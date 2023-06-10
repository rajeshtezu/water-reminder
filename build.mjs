import * as esbuild from 'esbuild';
import * as fs from 'fs';
import { globPlugin } from 'esbuild-plugin-glob';

const srcDir = 'src';
const outDir = 'dist';

fs.rm(outDir, { recursive: true, force: true }, (err) =>
  console.log('rm error: ', err)
);

await esbuild.build({
  entryPoints: [`${srcDir}/**/*.{js,css}`],
  outdir: outDir,
  bundle: true,
  minify: true,
  plugins: [globPlugin()],
});

// Copy html files
function getHtmlFilePaths(rootPath) {
  const htmlPathList = [];

  function findPath(path) {
    try {
      const paths = fs.readdirSync(path);

      paths.forEach((p) => {
        if (p.endsWith('.html')) htmlPathList.push(`${path}/${p}`);

        // If the path is for file
        if (p.includes('.')) return;

        // If the path is for directory
        findPath(`${path}/${p}`);
      });
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  findPath(rootPath);

  return htmlPathList;
}

const srcPathList = getHtmlFilePaths(srcDir);

srcPathList.forEach((sPath) => {
  fs.copyFileSync(sPath, sPath.replace(srcDir, outDir));
});

// Copy manifest
fs.copyFileSync('manifest.json', `${outDir}/manifest.json`);

// Copy assets
fs.mkdirSync(`${outDir}/assets`);
fs.readdirSync('assets').forEach((path) => {
  fs.copyFileSync(`assets/${path}`, `${outDir}/assets/${path}`);
});
