/**
 * Describes a premises reputation multiplier.
 * @param multiplier Reputation multiplier applied to lobster prices.
 * @returns A short quality label.
 */
export function reputationLabel(multiplier: number): string {
    if (multiplier < 0.95) {
        return 'Poor';
    }

    if (multiplier < 1) {
        return 'Fair';
    }

    if (multiplier < 1.05) {
        return 'Good';
    }

    if (multiplier < 1.1) {
        return 'Great';
    }

    return 'Excellent';
}

/**
 * Describes a premises reputation and the price multiplier it applies.
 * @param multiplier Reputation multiplier applied to lobster prices.
 * @returns A label with the multiplier, for example "Good (×1 lobster price)".
 */
export function reputationDescription(multiplier: number): string {
    const factor = Number(multiplier.toFixed(2));
    return `${reputationLabel(multiplier)} (×${factor} lobster price)`;
}
