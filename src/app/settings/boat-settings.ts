import { BoatSize } from '../enums/boat-size';
import { BoatStrength } from '../enums/boat-strength';

export interface BoatProfile {
    capacity: number;
    buyPrice: number;
    repairPerPoint: number;
    stormDamageOffshoreMax: number;
}

export interface BoatStrengthProfile {
    value: BoatStrength;
    label: string;
    damageMultiplier: number;
    priceMultiplier: number;
    weight: number;
}

export const BOAT_PROFILES: Record<BoatSize, BoatProfile> = {
    [BoatSize.small]: {
        capacity: 4,
        buyPrice: 150,
        repairPerPoint: 0.2,
        stormDamageOffshoreMax: 20
    },
    [BoatSize.medium]: {
        capacity: 8,
        buyPrice: 350,
        repairPerPoint: 0.35,
        stormDamageOffshoreMax: 40
    },
    [BoatSize.large]: {
        capacity: 14,
        buyPrice: 900,
        repairPerPoint: 0.5,
        stormDamageOffshoreMax: 70
    }
};

export const BOAT_STRENGTHS: readonly BoatStrengthProfile[] = [
    {
        value: BoatStrength.decrepit,
        label: 'Decrepit',
        damageMultiplier: 1.5,
        priceMultiplier: 0.8,
        weight: 30
    },
    {
        value: BoatStrength.flimsy,
        label: 'Flimsy',
        damageMultiplier: 1.25,
        priceMultiplier: 0.9,
        weight: 30
    },
    {
        value: BoatStrength.soSo,
        label: 'So-so',
        damageMultiplier: 1,
        priceMultiplier: 1,
        weight: 25
    },
    {
        value: BoatStrength.sturdy,
        label: 'Sturdy',
        damageMultiplier: 0.75,
        priceMultiplier: 1.2,
        weight: 10
    },
    {
        value: BoatStrength.nighUnsinkable,
        label: 'Nigh Unsinkable',
        damageMultiplier: 0.5,
        priceMultiplier: 1.5,
        weight: 5
    }
];

export const FORTIFY_BASE_COST: Record<BoatSize, number> = {
    [BoatSize.small]: 80,
    [BoatSize.medium]: 150,
    [BoatSize.large]: 250
};

export const CAPACITY_UPGRADE_COST_RATE = 0.06;
export const BOAT_OFFER_INTERVAL_DAYS = 10;
export const BOAT_OFFER_OFFSET_DAYS = 5;
export const BOAT_OFFERS_PER_SIZE = 2;

export const DAILY_WEAR_MIN = 1;
export const DAILY_WEAR_MAX = 5;
export const INSHORE_STORM_DAMAGE_MAX = 40;
export const BOAT_RESALE_MULTIPLIER = 0.5;
export const WRECK_RECOVERY_RATE = 0.4;

export const STARTING_BOATS: readonly {
    size: BoatSize;
    strength: BoatStrength;
    damage: number;
}[] = [
    { size: BoatSize.small, strength: BoatStrength.soSo, damage: 0 },
    { size: BoatSize.medium, strength: BoatStrength.soSo, damage: 0 },
    { size: BoatSize.large, strength: BoatStrength.decrepit, damage: 100 }
];
