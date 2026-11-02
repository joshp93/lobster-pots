import { DEMAND_SETTINGS } from '../../settings/demand-settings';
import type { RandomInt } from '../random/random-int';

/**
 * Advances demand one day using a mean-reverting random walk.
 * @param previous Previous demand value.
 * @param seasonalTarget Demand value the season pulls towards.
 * @param randomInt Inclusive random integer generator.
 * @returns The next demand value, clamped to the configured range.
 */
export function nextDemand(previous: number, seasonalTarget: number, randomInt: RandomInt): number {
    const pull = Math.sign(seasonalTarget - previous);
    const noise = randomInt(-DEMAND_SETTINGS.driftNoise, DEMAND_SETTINGS.driftNoise);
    const next = previous + pull + noise;

    return Math.min(DEMAND_SETTINGS.max, Math.max(DEMAND_SETTINGS.min, next));
}
