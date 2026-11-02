import type { PremisesOffer } from '../../classes/premises-offer';
import type { PremisesDefinition } from '../../settings/premises-settings';
import { PREMISES_RARITY_WEIGHTS } from '../../settings/premises-settings';
import type { RandomInt } from '../random/random-int';
import { pickWeighted } from '../random/weighted-pick';

/**
 * Generates the premises offers available for the current cycle.
 * The smallest eligible offer is always included so progress is reachable.
 * @param pool Premises that can appear as offers.
 * @param currentCapacity Capacity of the owned premises.
 * @param totalPots Pots currently owned.
 * @param count Number of offers to return.
 * @param randomInt Inclusive random integer generator.
 * @returns Offers sorted by capacity.
 */
export function createPremisesOffers(
    pool: readonly PremisesDefinition[],
    currentCapacity: number,
    totalPots: number,
    count: number,
    randomInt: RandomInt
): PremisesOffer[] {
    const eligible = pool
        .filter((premises) => premises.capacity > currentCapacity && premises.capacity >= totalPots)
        .sort((left, right) => left.capacity - right.capacity);

    if (eligible.length === 0 || count <= 0) {
        return [];
    }

    const offers: PremisesOffer[] = [eligible[0]];
    const remaining = eligible.slice(1);

    while (offers.length < count && remaining.length > 0) {
        const picked = pickWeighted(
            remaining.map((premises) => ({
                value: premises,
                weight: PREMISES_RARITY_WEIGHTS[premises.rarity]
            })),
            randomInt
        );

        if (!picked) {
            break;
        }

        offers.push(picked);
        remaining.splice(remaining.indexOf(picked), 1);
    }

    return [...offers].sort((left, right) => left.capacity - right.capacity);
}
