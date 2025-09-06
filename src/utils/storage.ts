export const safeGet = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.warn('[storage] get failed for key', key, e);
    return fallback;
  }
};

export const safeSet = (key: string, value: unknown): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('[storage] set failed for key', key, e);
  }
};

export const safeRemove = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn('[storage] remove failed for key', key, e);
  }
};
