import { Forecast } from '../enums/forecast';
import { Season } from '../enums/season';
import type { Premises } from './premises';
import type { PremisesOffer } from './premises-offer';

export class Setup {
    day: number = 0;
    title: string = '';
    info: string = '';
    season: Season = Season.spring;
    seasonDescription: string = '';
    forecast: Forecast = Forecast.normal;
    forecastDescription: string = '';
    stormChanceOffshore: number = 0;
    stormChanceInshore: number = 0;
    stormAlert: boolean = false;
    catchChance: number = 0;
    demand: number = 5;
    demandLabel: string = '';
    demandDescription: string = '';
    demandMultiplier: number = 1;
    potPrice: number = 0;
    capacity: number = 0;
    totalPots: number = 0;
    premises: Premises | null = null;
    premisesOffers: PremisesOffer[] = [];
    offerRefreshIn: number = 0;
    boatOfferRefreshIn: number = 0;
    rentValue: number = 0;
    rentDueIn: number = 0;
    rentDue: boolean = false;
    rentDueTomorrow: boolean = false;
    rentWarning: boolean = false;
    reputationLabel: string = '';
    freeRepairs: boolean = false;
    wreckRecovery: boolean = false;
    inshoreGradeHint: string = '';
    offshoreGradeHint: string = '';
}
