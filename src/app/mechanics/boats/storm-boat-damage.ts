import type { BoatSize } from '../../enums/boat-size';
import { FishingGround } from '../../enums/fishing-ground';
import { StormSeverity } from '../../enums/storm-severity';
import { BOAT_PROFILES, INSHORE_STORM_DAMAGE_MAX } from '../../settings/boat-settings';
import type { RandomInt } from '../random/random-int';

/**
 * Rolls storm damage for a boat on its ground.
 * @param size Boat size.
 * @param ground Ground the boat worked.
 * @param severity Storm severity.
 * @param randomInt Inclusive random integer generator.
 * @param damageMultiplier Strength-based damage multiplier.
 * @returns Damage points added by the storm.
 */
export function stormBoatDamage(
    size: BoatSize,
    ground: FishingGround,
    severity: StormSeverity,
    randomInt: RandomInt,
    damageMultiplier: number = 1
): number {
    if (severity === StormSeverity.none) {
        return 0;
    }

    if (ground === FishingGround.inshore) {
        return severity === StormSeverity.inshoreAndOffshore
            ? Math.round(randomInt(0, INSHORE_STORM_DAMAGE_MAX) * damageMultiplier)
            : 0;
    }

    return Math.round(randomInt(0, BOAT_PROFILES[size].stormDamageOffshoreMax) * damageMultiplier);
}
