import type { LobsterSize } from '../../enums/lobster-size';
import type { ShellHardness } from '../../enums/shell-hardness';
import { LOBSTER_BASE_PRICES, SHELL_MULTIPLIERS } from '../../settings/catch-settings';
import { demandPriceMultiplier } from '../demand/demand-price-multiplier';

/**
 * Calculates the sale price of a single lobster.
 * @param size Lobster size grade.
 * @param shell Shell hardness.
 * @param demand Current demand value.
 * @param reputationMultiplier Premises reputation multiplier.
 * @returns The rounded price, never below 1.
 */
export function lobsterPrice(
    size: LobsterSize,
    shell: ShellHardness,
    demand: number,
    reputationMultiplier: number
): number {
    const price =
        LOBSTER_BASE_PRICES[size] *
        SHELL_MULTIPLIERS[shell] *
        demandPriceMultiplier(demand) *
        reputationMultiplier;

    return Math.max(1, Math.round(price));
}
