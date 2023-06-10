import { getFromStorage, setToStorage, CONSTANT } from '../util.js';

const mainElm = document.getElementById('main');
const startElm = document.getElementById('start');
const stopElm = document.getElementById('stop');
const heyMsgNameElm = document.getElementById('hey-msg-name');
const reminderIntervalValElm = document.getElementById('reminder-interval-val');

mainElm.addEventListener('click', handleClick);

async function handleClick(event) {
  event.preventDefault();

  const start = event.target.id === 'start';
  const stop = event.target.id === 'stop';

  chrome.runtime.sendMessage({ start, stop });

  if (start) {
    setToStorage(CONSTANT.START, true);
  } else if (stop) {
    setToStorage(CONSTANT.START, false);
  }

  await showButton();

  event.stopPropagation();
}

async function showButton() {
  const { start } = await getFromStorage(CONSTANT.START);

  if (start === undefined) return;

  if (start) {
    startElm.classList.add('hide');
    startElm.classList.remove('show');

    stopElm.classList.add('show');
  } else {
    stopElm.classList.add('hide');
    stopElm.classList.remove('show');

    startElm.classList.add('show');
  }
}

async function renderHeyMsg() {
  const { name } = await getFromStorage(CONSTANT.NAME);

  heyMsgNameElm.innerText = name ?? 'there';
}

async function renderReminderInterval() {
  const { periodInMin } = await getFromStorage(CONSTANT.PERIOD_IN_MIN);

  reminderIntervalValElm.innerText = periodInMin || CONSTANT.DEFAULT_PERIOD;
}

(async () => {
  await Promise.all([renderHeyMsg(), renderReminderInterval(), showButton()]);
})();
