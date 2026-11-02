import type { PremisesRarity } from '../../enums/premises-rarity';
import { capitalize } from '../format/capitalize';

/**
 * Formats a premises rarity for display.
 * @param rarity Premises rarity.
 * @returns The rarity with a capital first letter.
 */
export function premisesRarityLabel(rarity: PremisesRarity): string {
    return capitalize(rarity);
}
