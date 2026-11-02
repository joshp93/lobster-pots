import type { BoatSize } from '../enums/boat-size';

export interface BoatLoss {
    boatId: string;
    name: string;
    size: BoatSize;
    potsLost: number;
    potsRecovered: number;
    incomeLost: number;
    incomeRecovered: number;
    boatLost: boolean;
}
