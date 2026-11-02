import type { CatchSummary } from '../../classes/catch-summary';
import type { LobsterCatch } from '../../classes/lobster-catch';
import { LobsterSize } from '../../enums/lobster-size';

const SIZE_ORDER: Record<LobsterSize, number> = {
    [LobsterSize.small]: 0,
    [LobsterSize.medium]: 1,
    [LobsterSize.large]: 2,
    [LobsterSize.jumbo]: 3
};

/**
 * Aggregates individual catches into rows by ground, size and shell.
 * @param catches Lobsters that survived the day.
 * @returns Summarised catch rows with counts and income.
 */
export function summarizeCatches(catches: readonly LobsterCatch[]): CatchSummary[] {
    const summaries = new Map<string, CatchSummary>();

    for (const lobster of catches) {
        const key = `${lobster.ground}|${lobster.size}|${lobster.shell}`;
        const summary = summaries.get(key);

        if (summary) {
            summary.count += 1;
            summary.income += lobster.price;
        } else {
            summaries.set(key, {
                ground: lobster.ground,
                size: lobster.size,
                shell: lobster.shell,
                count: 1,
                income: lobster.price
            });
        }
    }

    return [...summaries.values()].sort((left, right) => {
        if (left.ground !== right.ground) {
            return left.ground.localeCompare(right.ground);
        }

        return SIZE_ORDER[left.size] - SIZE_ORDER[right.size];
    });
}
