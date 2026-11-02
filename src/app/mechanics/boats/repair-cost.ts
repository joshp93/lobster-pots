import type { BoatSize } from '../../enums/boat-size';
import { BOAT_PROFILES } from '../../settings/boat-settings';

/**
 * Calculates the cost of fully repairing a boat.
 * @param size Boat size.
 * @param damage Current damage percentage.
 * @param freeRepairs Whether the current premises repairs boats for free.
 * @returns The repair cost, or 0 when free.
 */
export function repairCost(size: BoatSize, damage: number, freeRepairs: boolean): number {
    if (freeRepairs || damage <= 0) {
        return 0;
    }

    return Math.round(damage * BOAT_PROFILES[size].repairPerPoint);
}
