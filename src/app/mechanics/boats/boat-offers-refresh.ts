import { BOAT_OFFER_INTERVAL_DAYS, BOAT_OFFER_OFFSET_DAYS } from '../../settings/boat-settings';

/**
 * Calculates which boat-market cycle a day belongs to.
 * @param day Current game day.
 * @returns The cycle index.
 */
export function boatOffersCycle(day: number): number {
    return Math.floor((Math.max(1, day) - 1 + BOAT_OFFER_OFFSET_DAYS) / BOAT_OFFER_INTERVAL_DAYS);
}

/**
 * Calculates how many days remain before the boat market refreshes.
 * @param day Current game day.
 * @returns Days until the next refresh.
 */
export function boatOffersRefreshIn(day: number): number {
    const cycle = boatOffersCycle(day);
    const nextRefreshDay = (cycle + 1) * BOAT_OFFER_INTERVAL_DAYS - BOAT_OFFER_OFFSET_DAYS + 1;

    return nextRefreshDay - Math.max(1, day);
}
