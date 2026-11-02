import type { BoatOffer } from '../../classes/boat-offer';
import { BoatSize } from '../../enums/boat-size';
import type { BoatStrength } from '../../enums/boat-strength';
import { BOAT_OFFERS_PER_SIZE, BOAT_PROFILES, BOAT_STRENGTHS } from '../../settings/boat-settings';
import type { RandomInt } from '../random/random-int';
import { pickWeighted } from '../random/weighted-pick';
import { boatMaxCapacityBonus } from './boat-capacity';
import { generateBoatName } from './boat-name';
import { boatStrengthProfile } from './boat-strength';

const SIZES: readonly BoatSize[] = [BoatSize.small, BoatSize.medium, BoatSize.large];

function rollStrength(randomInt: RandomInt): BoatStrength {
    return (
        pickWeighted(
            BOAT_STRENGTHS.map((profile) => ({
                value: profile.value,
                weight: profile.weight
            })),
            randomInt
        ) ?? BOAT_STRENGTHS[0].value
    );
}

/**
 * Generates the boat market for a cycle.
 * @param randomInt Inclusive random integer generator.
 * @param excludedNames Names already used by the fleet.
 * @returns Two randomly generated offers for each boat size.
 */
export function createBoatOffers(
    randomInt: RandomInt,
    excludedNames: ReadonlySet<string> = new Set()
): BoatOffer[] {
    const usedNames = new Set(excludedNames);
    const offers: BoatOffer[] = [];

    for (const size of SIZES) {
        for (let index = 0; index < BOAT_OFFERS_PER_SIZE; index += 1) {
            const strength = rollStrength(randomInt);
            const capacityBonus = randomInt(0, boatMaxCapacityBonus(size));
            const name = generateBoatName(randomInt, usedNames);
            usedNames.add(name);
            const strengthProfile = boatStrengthProfile(strength);
            const capacityFactor = 1 + (capacityBonus / BOAT_PROFILES[size].capacity) * 0.75;
            const price = Math.round(
                BOAT_PROFILES[size].buyPrice * strengthProfile.priceMultiplier * capacityFactor
            );

            offers.push({
                id: `boat-offer-${size}-${index}-${randomInt(1000, 9999)}`,
                name,
                size,
                strength,
                capacityBonus,
                price
            });
        }
    }

    return offers;
}
