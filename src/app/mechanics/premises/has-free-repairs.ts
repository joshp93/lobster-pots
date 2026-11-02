import { PremisesRarity } from '../../enums/premises-rarity';

/**
 * Reports whether a premises rarity includes free boat repairs.
 * @param rarity Premises rarity.
 * @returns True for rare and legendary premises.
 */
export function hasFreeRepairs(rarity: PremisesRarity): boolean {
    return rarity === PremisesRarity.rare || rarity === PremisesRarity.legendary;
}
