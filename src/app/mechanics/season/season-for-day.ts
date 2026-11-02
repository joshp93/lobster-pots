import { Season } from '../../enums/season';

const SEASON_ORDER: readonly Season[] = [
    Season.spring,
    Season.summer,
    Season.autumn,
    Season.winter
];

/**
 * Determines the season for a game day.
 * @param day One-based game day.
 * @param seasonLength Number of days in each season.
 * @returns The season containing the day.
 */
export function seasonForDay(day: number, seasonLength: number): Season {
    const safeDay = Math.max(1, day);
    const safeLength = Math.max(1, seasonLength);
    return SEASON_ORDER[Math.floor((safeDay - 1) / safeLength) % SEASON_ORDER.length];
}
