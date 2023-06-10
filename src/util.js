export const CONSTANT = {
  STORAGE_UPDATED: 'STORAGE_UPDATED',
  NAME: 'name',
  PERIOD_IN_MIN: 'periodInMin',
  NOTIFICATION_MESSAGE: 'notificationMessage',
  START: 'start',
  DEFAULT_PERIOD: 60,
};

export function setToStorage(key, value) {
  chrome.storage.sync.set({ [key]: value });
}

export async function getFromStorage(...keys) {
  return chrome.storage.sync.get([...keys]);
}
