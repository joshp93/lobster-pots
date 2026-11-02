/**
 * Applies the difficulty modifier to a premises weekly rent.
 * @param weeklyRent Base weekly rent.
 * @param difficulty Difficulty percentage modifier.
 * @returns The effective weekly rent.
 */
export function effectiveRent(weeklyRent: number, difficulty: number): number {
    return Math.round(weeklyRent * (1 + difficulty / 100));
}
