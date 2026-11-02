import type { BoatSize } from '../enums/boat-size';
import type { BoatStrength } from '../enums/boat-strength';

export interface BoatOffer {
    id: string;
    name: string;
    size: BoatSize;
    strength: BoatStrength;
    capacityBonus: number;
    price: number;
}
