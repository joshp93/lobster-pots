import type { Forecast } from '../../enums/forecast';
import { StormSeverity } from '../../enums/storm-severity';
import { STORM_SEVERITY_WEIGHTS } from '../../settings/storm-settings';

/**
 * Estimates the daily chance that a storm reaches the inshore grounds.
 * @param offshoreStormChance Chance of any storm in percent.
 * @param forecast Forecast quality for the day.
 * @returns Inshore storm risk in percent, to one decimal place.
 */
export function inshoreStormRisk(offshoreStormChance: number, forecast: Forecast): number {
    const severeWeight = STORM_SEVERITY_WEIGHTS[forecast][StormSeverity.inshoreAndOffshore];
    return Math.round(((offshoreStormChance * severeWeight) / 100) * 10) / 10;
}
