/**
 * Reads a JSON value from session storage.
 * @param key Storage key to read.
 * @returns The parsed value, or null when the key is absent or unreadable.
 */
export function readSessionJson<T>(key: string): T | null {
  const stored = sessionStorage.getItem(key);
  if (stored === null) {
    return null;
  }

  try {
    return JSON.parse(stored) as T;
  } catch {
    return null;
  }
}

/**
 * Serialises a value to JSON and stores it in session storage.
 * @param key Storage key to write.
 * @param value Value to store, or null to remove the key.
 */
export function writeSessionJson<T>(key: string, value: T | null): void {
  if (value === null) {
    sessionStorage.removeItem(key);
    return;
  }

  sessionStorage.setItem(key, JSON.stringify(value));
}
