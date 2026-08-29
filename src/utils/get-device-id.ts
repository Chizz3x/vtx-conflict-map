import { generateUUID } from './generate-uuid';

const STORAGE_KEY = 'device_id';

let cachedId: string | null = null;

const getDeviceId = (): string => {
  if (cachedId) return cachedId;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    cachedId = stored;
    return stored;
  }

  const id = generateUUID();
  localStorage.setItem(STORAGE_KEY, id);
  cachedId = id;
  return id;
};

export { getDeviceId };
