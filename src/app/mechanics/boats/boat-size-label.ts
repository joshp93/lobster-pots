import type { BoatSize } from '../../enums/boat-size';
import { capitalize } from '../format/capitalize';

/**
 * Formats a boat size for display.
 * @param size Boat size.
 * @returns The size with a capital first letter.
 */
export function boatSizeLabel(size: BoatSize): string {
    return capitalize(size);
}
