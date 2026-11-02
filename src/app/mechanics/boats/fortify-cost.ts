import type { BoatSize } from '../../enums/boat-size';
import type { BoatStrength } from '../../enums/boat-strength';
import { BOAT_STRENGTHS, FORTIFY_BASE_COST } from '../../settings/boat-settings';
import { boatStrengthIndex } from './boat-strength';

/**
 * Calculates the cost of fortifying a boat by one strength grade.
 * @param size Boat size.
 * @param strength Current strength grade.
 * @returns The cost, or null when the boat is already at maximum strength.
 */
export function fortifyCost(size: BoatSize, strength: BoatStrength): number | null {
    const index = boatStrengthIndex(strength);

    if (index >= BOAT_STRENGTHS.length - 1) {
        return null;
    }

    return Math.round(FORTIFY_BASE_COST[size] * (index + 1));
}
