import type { Boat } from '../../classes/boat';
import type { BoatSize } from '../../enums/boat-size';
import { BOAT_PROFILES } from '../../settings/boat-settings';

/**
 * Calculates pot capacity for a boat size and upgrade bonus.
 * @param size Boat size.
 * @param capacityBonus Extra pot slots from upgrades.
 * @returns Current pot slots.
 */
export function capacityForSize(size: BoatSize, capacityBonus: number): number {
    return BOAT_PROFILES[size].capacity + capacityBonus;
}

/**
 * Calculates a boat's current pot capacity including upgrades.
 * @param boat Boat to inspect.
 * @returns Current pot slots.
 */
export function boatCapacity(boat: Boat): number {
    return capacityForSize(boat.size, boat.capacityBonus);
}

/**
 * Calculates the maximum capacity bonus a boat size can receive.
 * @param size Boat size.
 * @returns Maximum extra pot slots, which is half the base capacity.
 */
export function boatMaxCapacityBonus(size: BoatSize): number {
    return Math.floor(BOAT_PROFILES[size].capacity * 0.5);
}
