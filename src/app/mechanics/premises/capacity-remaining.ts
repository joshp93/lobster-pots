/**
 * Calculates how many more pots the premises can hold.
 * @param capacity Premises capacity.
 * @param totalPots Pots currently owned.
 * @returns Remaining pot slots, never below zero.
 */
export function capacityRemaining(capacity: number, totalPots: number): number {
    return Math.max(0, capacity - totalPots);
}
