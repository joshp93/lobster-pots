import { GAME_SETTINGS } from '../../settings/game-settings';
import { demandCatchModifier } from '../demand/demand-catch-modifier';

/**
 * Combines the base catch chance with season and demand modifiers.
 * @param baseChance Base catch chance in percent.
 * @param seasonModifier Season catch modifier in percentage points.
 * @param demand Current demand value.
 * @returns The clamped catch chance in percent.
 */
export function catchChance(baseChance: number, seasonModifier: number, demand: number): number {
    const chance = baseChance + seasonModifier + demandCatchModifier(demand);
    return Math.min(GAME_SETTINGS.maxCatchChance, Math.max(GAME_SETTINGS.minCatchChance, chance));
}
