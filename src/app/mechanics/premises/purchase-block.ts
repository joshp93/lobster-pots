/**
 * Checks whether a premises offer can be purchased.
 * @param netProfit Current net profit.
 * @param price Offer purchase price.
 * @param offerCapacity Capacity of the offered premises.
 * @param currentCapacity Capacity of the owned premises.
 * @param totalPots Pots currently owned.
 * @returns A player-facing reason when blocked, or null when allowed.
 */
export function purchaseBlockReason(
    netProfit: number,
    price: number,
    offerCapacity: number,
    currentCapacity: number,
    totalPots: number
): string | null {
    if (offerCapacity <= currentCapacity) {
        return 'That premises is no bigger than yer current one.';
    }

    if (offerCapacity < totalPots) {
        return 'That premises cannot hold all yer pots.';
    }

    if (netProfit < price) {
        return "Ye don't have enough 💰";
    }

    return null;
}
