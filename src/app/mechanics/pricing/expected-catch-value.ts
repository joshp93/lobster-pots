import type { FishingGround } from '../../enums/fishing-ground';
import { LobsterSize } from '../../enums/lobster-size';
import { ShellHardness } from '../../enums/shell-hardness';
import { SHELL_WEIGHTS, SIZE_WEIGHTS } from '../../settings/catch-settings';
import { lobsterPrice } from './lobster-price';

const SIZES: readonly LobsterSize[] = [
    LobsterSize.small,
    LobsterSize.medium,
    LobsterSize.large,
    LobsterSize.jumbo
];

const SHELLS: readonly ShellHardness[] = [ShellHardness.soft, ShellHardness.hard];

/**
 * Calculates the expected sale value of one lobster from a ground.
 * @param ground Ground being fished.
 * @param demand Current demand value.
 * @param reputationMultiplier Premises reputation multiplier.
 * @returns The probability-weighted price per catch.
 */
export function expectedCatchValue(
    ground: FishingGround,
    demand: number,
    reputationMultiplier: number
): number {
    const totalSizeWeight = SIZES.reduce((total, size) => total + SIZE_WEIGHTS[ground][size], 0);
    const totalShellWeight = SHELLS.reduce(
        (total, shell) => total + SHELL_WEIGHTS[ground][shell],
        0
    );

    let expected = 0;

    for (const size of SIZES) {
        for (const shell of SHELLS) {
            const probability =
                (SIZE_WEIGHTS[ground][size] / totalSizeWeight) *
                (SHELL_WEIGHTS[ground][shell] / totalShellWeight);
            expected += probability * lobsterPrice(size, shell, demand, reputationMultiplier);
        }
    }

    return expected;
}
