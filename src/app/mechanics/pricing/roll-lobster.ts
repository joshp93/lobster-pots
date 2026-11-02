import type { LobsterCatch } from '../../classes/lobster-catch';
import type { FishingGround } from '../../enums/fishing-ground';
import { LobsterSize } from '../../enums/lobster-size';
import { ShellHardness } from '../../enums/shell-hardness';
import { SHELL_WEIGHTS, SIZE_WEIGHTS } from '../../settings/catch-settings';
import type { RandomInt } from '../random/random-int';
import { pickWeighted } from '../random/weighted-pick';
import { lobsterPrice } from './lobster-price';

const SIZES: readonly LobsterSize[] = [
    LobsterSize.small,
    LobsterSize.medium,
    LobsterSize.large,
    LobsterSize.jumbo
];

const SHELLS: readonly ShellHardness[] = [ShellHardness.soft, ShellHardness.hard];

/**
 * Rolls the size, shell and price of a lobster caught on a ground.
 * @param ground Ground the lobster was caught on.
 * @param demand Current demand value.
 * @param reputationMultiplier Premises reputation multiplier.
 * @param randomInt Inclusive random integer generator.
 * @returns The caught lobster.
 */
export function rollLobster(
    ground: FishingGround,
    demand: number,
    reputationMultiplier: number,
    randomInt: RandomInt
): LobsterCatch {
    const size =
        pickWeighted(
            SIZES.map((value) => ({ value, weight: SIZE_WEIGHTS[ground][value] })),
            randomInt
        ) ?? LobsterSize.small;

    const shell =
        pickWeighted(
            SHELLS.map((value) => ({ value, weight: SHELL_WEIGHTS[ground][value] })),
            randomInt
        ) ?? ShellHardness.soft;

    return {
        ground,
        size,
        shell,
        price: lobsterPrice(size, shell, demand, reputationMultiplier)
    };
}
