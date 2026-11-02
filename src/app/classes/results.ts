import type { BoatSize } from '../enums/boat-size';
import { Season } from '../enums/season';
import { StormSeverity } from '../enums/storm-severity';
import type { BoatLoss } from './boat-loss';
import type { CatchSummary } from './catch-summary';

export interface BoatDamage {
    boatId: string;
    name: string;
    size: BoatSize;
    damageBefore: number;
    damageAfter: number;
}

export class Results {
    day: number = 0;
    title: string = '';
    season: Season = Season.spring;
    demand: number = 5;
    stormSeverity: StormSeverity = StormSeverity.none;
    stormDescription: string = '';
    alert: boolean = false;
    success: boolean = false;
    lobstersCaught: number = 0;
    income: number = 0;
    inshoreIncome: number = 0;
    offshoreIncome: number = 0;
    potsLostInshore: number = 0;
    potsLostOffshore: number = 0;
    potsLost: number = 0;
    catches: CatchSummary[] = [];
    boatDamage: BoatDamage[] = [];
    boatLosses: BoatLoss[] = [];
    boatsWrecked: number = 0;
}
