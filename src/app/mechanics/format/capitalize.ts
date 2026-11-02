/**
 * Capitalises the first letter of a display label.
 * @param value Text to format.
 * @returns The text with a capital first letter.
 */
export function capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
}
