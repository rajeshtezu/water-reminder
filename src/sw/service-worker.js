import { getFromStorage, CONSTANT } from '../util.js';

let username = 'there';
let notificationMsg = 'Time to get hydrated.';

async function updateName() {
  const { name } = await getFromStorage(CONSTANT.NAME);

  if (name) username = name;
}

async function updateNotificationMsg() {
  const { notificationMessage } = await getFromStorage(
    CONSTANT.NOTIFICATION_MESSAGE
  );

  if (notificationMessage) notificationMsg = notificationMessage;
}

async function createAlarm() {
  const { periodInMin } = await getFromStorage(CONSTANT.PERIOD_IN_MIN);

  chrome.alarms.create({
    periodInMinutes: periodInMin
      ? Number(periodInMin)
      : CONSTANT.DEFAULT_PERIOD,
  });
}

function listenToAlarm() {
  chrome.alarms.onAlarm.addListener(async (_alarm) => {
    await notify();
  });
}

async function notify() {
  try {
    registration.showNotification(`Hey ${username},`, {
      body: notificationMsg,
      icon: '../drop.png',
      requireInteraction: true,
    });
  } catch (error) {
    console.log('Error: ', error);
  }
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.update === CONSTANT.STORAGE_UPDATED) {
    try {
      await chrome.alarms.clearAll();
      await createAlarm();
      await Promise.all([updateName(), updateNotificationMsg()]);
    } catch (error) {
      // Fail silently
    }
  }

  if (message.start) {
    await createAlarm();
  } else if (message.stop) {
    await chrome.alarms.clearAll();
  }
});

(async () => {
  await createAlarm();
  await Promise.all([updateName(), updateNotificationMsg()]);
  listenToAlarm();
})();
