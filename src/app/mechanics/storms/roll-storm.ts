import type { Forecast } from '../../enums/forecast';
import { StormSeverity } from '../../enums/storm-severity';
import { STORM_SEVERITY_WEIGHTS } from '../../settings/storm-settings';
import type { RandomInt } from '../random/random-int';
import { pickWeighted } from '../random/weighted-pick';

/**
 * Rolls whether a storm occurs and how severe it is.
 * @param chance Chance of any storm in percent.
 * @param forecast Forecast quality, which weights the storm type.
 * @param randomInt Inclusive random integer generator.
 * @returns The storm severity, or none.
 */
export function rollStorm(chance: number, forecast: Forecast, randomInt: RandomInt): StormSeverity {
    if (chance <= 0 || randomInt(1, 100) > chance) {
        return StormSeverity.none;
    }

    const weights = STORM_SEVERITY_WEIGHTS[forecast];

    return (
        pickWeighted(
            Object.entries(weights).map(([value, weight]) => ({
                value: value as StormSeverity,
                weight
            })),
            randomInt
        ) ?? StormSeverity.none
    );
}
