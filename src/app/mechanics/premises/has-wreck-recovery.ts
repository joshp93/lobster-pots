import { PremisesRarity } from '../../enums/premises-rarity';

/**
 * Reports whether a premises rarity includes wreck recovery.
 * @param rarity Premises rarity.
 * @returns True for legendary premises.
 */
export function hasWreckRecovery(rarity: PremisesRarity): boolean {
    return rarity === PremisesRarity.legendary;
}
