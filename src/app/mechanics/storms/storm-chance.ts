import type { Forecast } from '../../enums/forecast';
import {
    FORECAST_STORM_MODIFIERS,
    STORM_CHANCE_MAX,
    STORM_CHANCE_MIN
} from '../../settings/storm-settings';

/**
 * Calculates the chance of a storm for the day.
 * @param seasonBaseChance Season base storm chance in percent.
 * @param forecast Forecast quality for the day.
 * @returns The clamped storm chance in percent.
 */
export function stormChance(seasonBaseChance: number, forecast: Forecast): number {
    const chance = seasonBaseChance + FORECAST_STORM_MODIFIERS[forecast];
    return Math.min(STORM_CHANCE_MAX, Math.max(STORM_CHANCE_MIN, chance));
}
