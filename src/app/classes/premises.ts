import type { PremisesRarity } from '../enums/premises-rarity';

export interface Premises {
    id: string;
    name: string;
    rarity: PremisesRarity;
    capacity: number;
    weeklyRent: number;
    reputationMultiplier: number;
}
