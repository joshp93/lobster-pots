import { PremisesRarity } from '../enums/premises-rarity';

export interface PremisesDefinition {
    id: string;
    name: string;
    rarity: PremisesRarity;
    capacity: number;
    purchasePrice: number;
    weeklyRent: number;
    reputationMultiplier: number;
}

export const STARTING_PREMISES: PremisesDefinition = {
    id: 'lobsters-revenge',
    name: 'Lobsters Revenge',
    rarity: PremisesRarity.common,
    capacity: 16,
    purchasePrice: 0,
    weeklyRent: 80,
    reputationMultiplier: 1
};

export const PREMISES_OFFERS: readonly PremisesDefinition[] = [
    {
        id: 'rusty-anchor',
        name: 'The Rusty Anchor',
        rarity: PremisesRarity.common,
        capacity: 18,
        purchasePrice: 90,
        weeklyRent: 95,
        reputationMultiplier: 0.95
    },
    {
        id: 'salty-dog-shack',
        name: 'Salty Dog Shack',
        rarity: PremisesRarity.common,
        capacity: 20,
        purchasePrice: 150,
        weeklyRent: 105,
        reputationMultiplier: 1
    },
    {
        id: 'barnacle-bills-boathouse',
        name: "Barnacle Bill's Boathouse",
        rarity: PremisesRarity.common,
        capacity: 22,
        purchasePrice: 240,
        weeklyRent: 120,
        reputationMultiplier: 1
    },
    {
        id: 'crows-nest',
        name: "The Crow's Nest",
        rarity: PremisesRarity.uncommon,
        capacity: 25,
        purchasePrice: 340,
        weeklyRent: 135,
        reputationMultiplier: 1.05
    },
    {
        id: 'jolly-roger-jetty',
        name: 'Jolly Roger Jetty',
        rarity: PremisesRarity.uncommon,
        capacity: 28,
        purchasePrice: 460,
        weeklyRent: 150,
        reputationMultiplier: 1.05
    },
    {
        id: 'dead-mans-dock',
        name: "Dead Man's Dock",
        rarity: PremisesRarity.uncommon,
        capacity: 31,
        purchasePrice: 600,
        weeklyRent: 165,
        reputationMultiplier: 1
    },
    {
        id: 'pieces-of-eight-pier',
        name: 'Pieces of Eight Pier',
        rarity: PremisesRarity.uncommon,
        capacity: 34,
        purchasePrice: 760,
        weeklyRent: 185,
        reputationMultiplier: 1.1
    },
    {
        id: 'rum-barrel',
        name: 'The Rum Barrel',
        rarity: PremisesRarity.rare,
        capacity: 38,
        purchasePrice: 940,
        weeklyRent: 205,
        reputationMultiplier: 1.05
    },
    {
        id: 'krakens-wharf',
        name: "Kraken's Wharf",
        rarity: PremisesRarity.rare,
        capacity: 42,
        purchasePrice: 1150,
        weeklyRent: 225,
        reputationMultiplier: 1.1
    },
    {
        id: 'blackbeards-booty',
        name: "Blackbeard's Booty",
        rarity: PremisesRarity.rare,
        capacity: 46,
        purchasePrice: 1400,
        weeklyRent: 250,
        reputationMultiplier: 1.15
    },
    {
        id: 'davy-jones-locker',
        name: "Davy Jones' Locker",
        rarity: PremisesRarity.rare,
        capacity: 50,
        purchasePrice: 1700,
        weeklyRent: 275,
        reputationMultiplier: 0.9
    },
    {
        id: 'flying-dutchman',
        name: 'The Flying Dutchman',
        rarity: PremisesRarity.legendary,
        capacity: 55,
        purchasePrice: 2100,
        weeklyRent: 310,
        reputationMultiplier: 1.1
    },
    {
        id: 'neptunes-palace',
        name: "Neptune's Palace",
        rarity: PremisesRarity.legendary,
        capacity: 60,
        purchasePrice: 2600,
        weeklyRent: 350,
        reputationMultiplier: 1.2
    },
    {
        id: 'treasure-island-depot',
        name: 'Treasure Island Depot',
        rarity: PremisesRarity.legendary,
        capacity: 66,
        purchasePrice: 3200,
        weeklyRent: 400,
        reputationMultiplier: 1.15
    }
];

export const PREMISES_RARITY_WEIGHTS: Record<PremisesRarity, number> = {
    [PremisesRarity.common]: 60,
    [PremisesRarity.uncommon]: 25,
    [PremisesRarity.rare]: 12,
    [PremisesRarity.legendary]: 3
};
