/**
 * Describes a demand value in plain language.
 * @param demand Demand value on the 1-10 scale.
 * @returns A short label for the current market.
 */
export function demandLabel(demand: number): string {
    if (demand <= 2) {
        return 'Dead';
    }

    if (demand <= 4) {
        return 'Quiet';
    }

    if (demand <= 7) {
        return 'Steady';
    }

    if (demand <= 9) {
        return 'Brisk';
    }

    return 'Frenzy';
}
