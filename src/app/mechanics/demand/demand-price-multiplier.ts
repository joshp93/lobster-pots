import { DEMAND_SETTINGS } from '../../settings/demand-settings';

/**
 * Converts a demand value into a lobster price multiplier.
 * @param demand Demand value on the 1-10 scale.
 * @returns Price multiplier from 0.6 to 1.5.
 */
export function demandPriceMultiplier(demand: number): number {
    return DEMAND_SETTINGS.multiplierBase + DEMAND_SETTINGS.multiplierPerPoint * demand;
}
