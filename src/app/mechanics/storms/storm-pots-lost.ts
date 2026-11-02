import type { StormLosses } from '../../classes/storm-losses';
import type { StormSeverity } from '../../enums/storm-severity';
import { POT_LOSS_CHANCES } from '../../settings/storm-settings';
import type { RandomInt } from '../random/random-int';

function countLostPots(pots: number, chance: number, randomInt: RandomInt): number {
    let lost = 0;

    for (let pot = 0; pot < pots; pot += 1) {
        if (randomInt(1, 100) <= chance) {
            lost += 1;
        }
    }

    return lost;
}

/**
 * Rolls storm losses per placed pot.
 * @param severity Storm severity.
 * @param inshorePots Pots placed inshore.
 * @param offshorePots Pots placed offshore.
 * @param randomInt Inclusive random integer generator.
 * @returns Pots lost on each ground.
 */
export function stormPotsLost(
    severity: StormSeverity,
    inshorePots: number,
    offshorePots: number,
    randomInt: RandomInt
): StormLosses {
    const chances = POT_LOSS_CHANCES[severity];

    return {
        inshore: countLostPots(Math.max(0, inshorePots), chances.inshore, randomInt),
        offshore: countLostPots(Math.max(0, offshorePots), chances.offshore, randomInt)
    };
}
