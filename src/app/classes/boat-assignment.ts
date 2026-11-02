import type { BoatSize } from '../enums/boat-size';
import type { FishingGround } from '../enums/fishing-ground';

export interface BoatAssignment {
    boatId: string;
    size: BoatSize;
    ground: FishingGround;
    pots: number;
}
