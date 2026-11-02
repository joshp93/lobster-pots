import { Season } from '../enums/season';

export interface SeasonProfile {
    demandTarget: number;
    baseStormChance: number;
    catchModifier: number;
    description: string;
}

export const SEASON_PROFILES: Record<Season, SeasonProfile> = {
    [Season.spring]: {
        demandTarget: 5,
        baseStormChance: 15,
        catchModifier: 0,
        description: 'Spring: steady demand and moderate weather.'
    },
    [Season.summer]: {
        demandTarget: 8,
        baseStormChance: 8,
        catchModifier: 5,
        description: 'Summer: lobsters are plentiful, demand is high and storms are rare.'
    },
    [Season.autumn]: {
        demandTarget: 6,
        baseStormChance: 20,
        catchModifier: 0,
        description: 'Autumn: decent demand, but the weather starts to turn.'
    },
    [Season.winter]: {
        demandTarget: 3,
        baseStormChance: 30,
        catchModifier: -10,
        description: 'Winter: few lobsters, low demand and rough seas.'
    }
};
