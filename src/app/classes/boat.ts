import type { BoatSize } from '../enums/boat-size';
import type { BoatStrength } from '../enums/boat-strength';
import type { FishingGround } from '../enums/fishing-ground';

export interface Boat {
    id: string;
    name: string;
    size: BoatSize;
    strength: BoatStrength;
    damage: number;
    capacityBonus: number;
    ground: FishingGround | null;
    pots: number;
}
