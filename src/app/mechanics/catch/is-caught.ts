import type { RandomInt } from '../random/random-int';

/**
 * Rolls whether a pot caught a lobster.
 * @param chance Catch chance in percent.
 * @param randomInt Inclusive random integer generator.
 * @returns True when the pot caught something.
 */
export function isCaught(chance: number, randomInt: RandomInt): boolean {
    return randomInt(1, 100) <= chance;
}
