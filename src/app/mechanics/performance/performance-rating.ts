export interface PerformanceRating {
    score: number;
    title: string;
    description: string;
}

/**
 * Rates a completed run from days survived, lobsters landed and turnover.
 * @param days Days survived.
 * @param lobsters Total lobsters caught.
 * @param turnover Total money turned over.
 * @returns The performance score and its player-facing rating.
 */
export function performanceRating(
    days: number,
    lobsters: number,
    turnover: number
): PerformanceRating {
    const score = Math.max(0, Math.round(days * 25 + lobsters / 2 + turnover / 10));

    if (score < 400) {
        return {
            score,
            title: 'Landlubber',
            description: 'Ye need more practice, matey! The sea shows no mercy.'
        };
    }

    if (score < 1200) {
        return {
            score,
            title: 'Deckhand',
            description: 'Avast! Ye were not so bad, but there be plenty of room to improve.'
        };
    }

    if (score < 3500) {
        return {
            score,
            title: 'Bosun',
            description: 'Blimey, ye be getting pretty good at this! The fleet respects ye.'
        };
    }

    return {
        score,
        title: 'Lobster Legend',
        description: 'Blow me down! Yer a bona fide lobster lover. Good job, matey!'
    };
}
