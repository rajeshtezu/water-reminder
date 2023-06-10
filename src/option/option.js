import { setToStorage, CONSTANT } from '../util.js';

const formElm = document.getElementById('form');
const saveBtnElm = document.getElementById('save-btn');
const successDialogElm = document.getElementById('success-dialog');

saveBtnElm.addEventListener('click', saveFormData);

async function saveFormData(event) {
  event.preventDefault();

  const formData = new FormData(formElm);
  const name = formData.get(CONSTANT.NAME);
  const periodInMin = formData.get(CONSTANT.PERIOD_IN_MIN);
  const customMessage = formData.get(CONSTANT.NOTIFICATION_MESSAGE);

  if (!name && !periodInMin && !customMessage) return;

  if (name) setToStorage(CONSTANT.NAME, name);
  if (customMessage) setToStorage(CONSTANT.NOTIFICATION_MESSAGE, customMessage);

  if (periodInMin) {
    setToStorage(CONSTANT.PERIOD_IN_MIN, periodInMin);
    // if (periodInMin >= 1 && periodInMin <= 90) {
    //   setToStorage(CONSTANT.PERIOD_IN_MIN, periodInMin);
    // } else {
    //   showDialog('Please set notification period value in range (1-90)', 2000);

    //   return;
    // }
  }

  chrome.runtime.sendMessage({ update: CONSTANT.STORAGE_UPDATED });

  showDialog('Settings saved successfully.');

  formElm.reset();

  event.stopPropagation();
}

function showDialog(message, timeToShow = 1500) {
  successDialogElm.innerText = message;

  successDialogElm.showModal();
  setTimeout(() => successDialogElm.close(), timeToShow);
}
