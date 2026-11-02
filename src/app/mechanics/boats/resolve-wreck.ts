import { WRECK_RECOVERY_RATE } from '../../settings/boat-settings';

export interface WreckResolution<T> {
    boatLost: boolean;
    potsKept: number;
    potsLost: number;
    catchesKept: T[];
    catchesLost: T[];
}

/**
 * Resolves the outcome of a wrecked boat.
 * @param pots Pots the boat was carrying.
 * @param catches Catches the boat landed.
 * @param hasRecovery Whether the current premises can recover wrecked boats.
 * @returns The pots and catches kept and lost.
 */
export function resolveWreck<T>(
    pots: number,
    catches: readonly T[],
    hasRecovery: boolean
): WreckResolution<T> {
    if (!hasRecovery) {
        return {
            boatLost: true,
            potsKept: 0,
            potsLost: pots,
            catchesKept: [],
            catchesLost: [...catches]
        };
    }

    const potsKept = Math.floor(pots * WRECK_RECOVERY_RATE);
    const catchesKeptCount = Math.floor(catches.length * WRECK_RECOVERY_RATE);

    return {
        boatLost: false,
        potsKept,
        potsLost: pots - potsKept,
        catchesKept: catches.slice(0, catchesKeptCount),
        catchesLost: catches.slice(catchesKeptCount)
    };
}
