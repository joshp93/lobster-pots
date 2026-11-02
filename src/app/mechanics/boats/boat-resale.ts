import type { Boat } from '../../classes/boat';
import { BOAT_PROFILES, BOAT_RESALE_MULTIPLIER } from '../../settings/boat-settings';
import { boatStrengthProfile } from './boat-strength';

/**
 * Calculates the sale value of a boat.
 * @param boat Boat being sold.
 * @returns The resale price, scaled by strength, capacity upgrades and damage.
 */
export function boatResale(boat: Boat): number {
    const strength = boatStrengthProfile(boat.strength);
    const capacityFactor = 1 + (boat.capacityBonus / BOAT_PROFILES[boat.size].capacity) * 0.75;
    const condition = Math.max(0, 100 - boat.damage) / 100;
    const price =
        BOAT_PROFILES[boat.size].buyPrice *
        BOAT_RESALE_MULTIPLIER *
        strength.priceMultiplier *
        capacityFactor *
        condition;

    return Math.round(price);
}
