import { DEMAND_CATCH_BANDS } from '../../settings/demand-settings';

/**
 * Returns the catch-chance modifier for a demand value.
 * @param demand Demand value on the 1-10 scale.
 * @returns Percentage points added to the base catch chance.
 */
export function demandCatchModifier(demand: number): number {
    const band = DEMAND_CATCH_BANDS.find((entry) => demand <= entry.maxDemand);
    return band ? band.modifier : 0;
}
