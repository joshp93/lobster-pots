import type { RandomInt } from '../random/random-int';

export const BOAT_ADJECTIVES: readonly string[] = [
    'Rusty',
    'Salty',
    'Barnacled',
    'Leaky',
    'Crooked',
    'Weathered',
    'Sunken',
    'Drifting',
    'Plucky',
    'Dreadful',
    'Gilded',
    'Shabby',
    'Sturdy',
    'Wayward',
    'Fearsome',
    'Tattered',
    'Spry',
    'Grim',
    'Jolly',
    'Saucy',
    'Soggy',
    'Splintered',
    'Battered',
    'Ghostly',
    'Gallant',
    'Rotten',
    'Swift',
    'Proud',
    'Wretched',
    'Briny',
    'Bellowing',
    'Tidal'
];

export const BOAT_NOUNS: readonly string[] = [
    'Tub',
    'Wench',
    'Kraken',
    'Gull',
    'Anchor',
    'Hull',
    'Marlin',
    'Corsair',
    'Buccaneer',
    'Cutlass',
    'Gunwale',
    'Bowsprit',
    'Lantern',
    'Compass',
    'Rudder',
    'Cannon',
    'Doubloon',
    'Plank',
    'Reef',
    'Squall',
    'Tide',
    'Wake',
    'Keel',
    'Bilge',
    'Figurehead',
    'Booty',
    'Plunder',
    'Flask',
    'Bucket',
    'Oar',
    'Mermaid',
    'Leviathan'
];

export const BOAT_POSSESSIVES: readonly string[] = [
    "Bluebeard's",
    "Seafarer's",
    "Captain's",
    "Sailor's",
    "Pirate's",
    "Fisherman's",
    "Bosun's",
    "Navigator's",
    "Deckhand's",
    "Smuggler's",
    "Corsair's",
    "Buccaneer's",
    "Admiral's",
    "Skipper's",
    "Old Salt's",
    "Sea Dog's",
    "Privateer's",
    "Plunderer's",
    "Marauder's",
    "Mutineer's",
    "Quartermaster's",
    "Lookout's",
    "Helmsman's",
    "Cook's",
    "Gunner's",
    "Carpenter's",
    "Surgeon's",
    "Stowaway's",
    "Lighthouse's",
    "Harbour's",
    "Widow's",
    "Kraken's"
];

export const BOAT_SECOND_WORDS: readonly string[] = [
    'Freedom',
    'Pride',
    'Revenge',
    'Fortune',
    'Glory',
    'Wrath',
    'Fury',
    'Promise',
    'Oath',
    'Luck',
    'Honour',
    'Valour',
    'Journey',
    'Return',
    'Escape',
    'Triumph',
    'Lament',
    'Curse',
    'Vengeance',
    'Whisper',
    'Roar',
    'Dance',
    'Gambit',
    'Legacy',
    'Secret',
    'Treasure',
    'Song',
    'Tale',
    'Voyage',
    'Horizon',
    'Bounty',
    'Reckoning'
];

function pick<T>(items: readonly T[], randomInt: RandomInt): T {
    return items[randomInt(0, items.length - 1)];
}

/**
 * Generates a unique pirate-style boat name.
 * @param randomInt Inclusive random integer generator.
 * @param excluded Names that must not be reused.
 * @returns A name in one of the two supported formats.
 */
export function generateBoatName(
    randomInt: RandomInt,
    excluded: ReadonlySet<string> = new Set()
): string {
    for (let attempt = 0; attempt < 40; attempt += 1) {
        const name =
            randomInt(0, 1) === 0
                ? `The ${pick(BOAT_ADJECTIVES, randomInt)} ${pick(BOAT_NOUNS, randomInt)}`
                : `${pick(BOAT_POSSESSIVES, randomInt)} ${pick(BOAT_SECOND_WORDS, randomInt)}`;

        if (!excluded.has(name)) {
            return name;
        }
    }

    let fallback = `The Nameless ${randomInt(100, 999)}`;
    let suffix = 1;

    while (excluded.has(fallback)) {
        suffix += 1;
        fallback = `The Nameless ${suffix}`;
    }

    return fallback;
}
