import { DAILY_WEAR_MAX, DAILY_WEAR_MIN } from '../../settings/boat-settings';
import type { RandomInt } from '../random/random-int';

/**
 * Rolls the daily wear for a deployed boat.
 * @param randomInt Inclusive random integer generator.
 * @param damageMultiplier Strength-based damage multiplier.
 * @returns Damage points added for the day, at least 1.
 */
export function boatWear(randomInt: RandomInt, damageMultiplier: number = 1): number {
    return Math.max(1, Math.round(randomInt(DAILY_WEAR_MIN, DAILY_WEAR_MAX) * damageMultiplier));
}
