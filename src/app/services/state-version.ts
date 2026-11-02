export const STATE_VERSION = '3';

/**
 * Checks whether stored game state matches the current schema.
 * @param storage Storage to inspect.
 * @param version Version the state must have.
 * @returns True when the stored state is current.
 */
export function isStateCurrent(storage: Storage, version: string): boolean {
    return storage.getItem('stateVersion') === version;
}
