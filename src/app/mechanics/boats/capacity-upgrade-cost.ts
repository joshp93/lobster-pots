import type { BoatSize } from '../../enums/boat-size';
import { BOAT_PROFILES, CAPACITY_UPGRADE_COST_RATE } from '../../settings/boat-settings';
import { boatMaxCapacityBonus } from './boat-capacity';

/**
 * Calculates the cost of adding one pot slot to a boat.
 * @param size Boat size.
 * @param currentBonus Current number of added pot slots.
 * @returns The cost, or null when the boat is at its capacity limit.
 */
export function capacityUpgradeCost(size: BoatSize, currentBonus: number): number | null {
    if (currentBonus >= boatMaxCapacityBonus(size)) {
        return null;
    }

    return Math.round(
        BOAT_PROFILES[size].buyPrice * CAPACITY_UPGRADE_COST_RATE * (currentBonus + 1)
    );
}
