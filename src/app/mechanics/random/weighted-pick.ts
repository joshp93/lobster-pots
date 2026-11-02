import type { RandomInt } from './random-int';

export interface WeightedItem<T> {
    value: T;
    weight: number;
}

/**
 * Picks one value at random using the supplied weights.
 * @param items Weighted candidates.
 * @param randomInt Inclusive random integer generator.
 * @returns The selected value, or null when there is nothing to pick.
 */
export function pickWeighted<T>(items: readonly WeightedItem<T>[], randomInt: RandomInt): T | null {
    const validItems = items.filter((item) => item.weight > 0);
    const totalWeight = validItems.reduce((total, item) => total + item.weight, 0);

    if (validItems.length === 0 || totalWeight <= 0) {
        return null;
    }

    let roll = randomInt(1, totalWeight);

    for (const item of validItems) {
        roll -= item.weight;
        if (roll <= 0) {
            return item.value;
        }
    }

    return validItems[validItems.length - 1].value;
}
