import type { BoatStrength } from '../../enums/boat-strength';
import { BOAT_STRENGTHS, type BoatStrengthProfile } from '../../settings/boat-settings';

/**
 * Finds the profile for a boat strength grade.
 * @param strength Boat strength grade.
 * @returns The matching strength profile.
 */
export function boatStrengthProfile(strength: BoatStrength): BoatStrengthProfile {
    return BOAT_STRENGTHS.find((profile) => profile.value === strength) ?? BOAT_STRENGTHS[0];
}

/**
 * Finds the ordered index of a boat strength grade.
 * @param strength Boat strength grade.
 * @returns Zero-based index, where a higher value is stronger.
 */
export function boatStrengthIndex(strength: BoatStrength): number {
    return Math.max(
        0,
        BOAT_STRENGTHS.findIndex((profile) => profile.value === strength)
    );
}
