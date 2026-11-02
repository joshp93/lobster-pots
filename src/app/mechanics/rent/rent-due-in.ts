/**
 * Calculates how many days remain before rent is due.
 * @param day Current game day.
 * @param interval Days between rent payments.
 * @returns 0 when rent is due today, otherwise the days remaining.
 */
export function rentDueIn(day: number, interval: number): number {
    const safeInterval = Math.max(1, interval);
    const remainder = day % safeInterval;
    return remainder === 0 ? 0 : safeInterval - remainder;
}
