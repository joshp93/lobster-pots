/**
 * Calculates how many days remain before premises offers refresh.
 * @param day Current game day.
 * @param interval Days between offer refreshes.
 * @returns Days until the next refresh.
 */
export function offersRefreshIn(day: number, interval: number): number {
    const safeInterval = Math.max(1, interval);
    const cycle = Math.floor((Math.max(1, day) - 1) / safeInterval);
    const nextRefreshDay = (cycle + 1) * safeInterval + 1;
    return nextRefreshDay - day;
}
