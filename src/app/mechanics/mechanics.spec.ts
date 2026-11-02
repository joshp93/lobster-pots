import type { Boat } from '../classes/boat';
import { BoatSize } from '../enums/boat-size';
import { BoatStrength } from '../enums/boat-strength';
import { FishingGround } from '../enums/fishing-ground';
import { Forecast } from '../enums/forecast';
import { LobsterSize } from '../enums/lobster-size';
import { PremisesRarity } from '../enums/premises-rarity';
import { Season } from '../enums/season';
import { ShellHardness } from '../enums/shell-hardness';
import { StormSeverity } from '../enums/storm-severity';
import { GAME_SETTINGS } from '../settings/game-settings';
import { PREMISES_OFFERS } from '../settings/premises-settings';
import { boatCapacity, boatMaxCapacityBonus } from './boats/boat-capacity';
import {
    BOAT_ADJECTIVES,
    BOAT_NOUNS,
    BOAT_POSSESSIVES,
    BOAT_SECOND_WORDS,
    generateBoatName
} from './boats/boat-name';
import { boatOffersCycle, boatOffersRefreshIn } from './boats/boat-offers-refresh';
import { boatResale } from './boats/boat-resale';
import { boatStrengthProfile } from './boats/boat-strength';
import { boatWear } from './boats/boat-wear';
import { capacityUpgradeCost } from './boats/capacity-upgrade-cost';
import { createBoatOffers } from './boats/create-boat-offers';
import { fortifyCost } from './boats/fortify-cost';
import { repairCost } from './boats/repair-cost';
import { resolveWreck } from './boats/resolve-wreck';
import { stormBoatDamage } from './boats/storm-boat-damage';
import { catchChance } from './catch/catch-chance';
import { isCaught } from './catch/is-caught';
import { summarizeCatches } from './catch/summarize-catches';
import { demandCatchModifier } from './demand/demand-catch-modifier';
import { demandLabel } from './demand/demand-label';
import { demandPriceMultiplier } from './demand/demand-price-multiplier';
import { nextDemand } from './demand/next-demand';
import { performanceRating } from './performance/performance-rating';
import { createPremisesOffers } from './premises/create-premises-offers';
import { hasFreeRepairs } from './premises/has-free-repairs';
import { hasWreckRecovery } from './premises/has-wreck-recovery';
import { premisesRarityLabel } from './premises/premises-rarity-label';
import { purchaseBlockReason } from './premises/purchase-block';
import { reputationDescription, reputationLabel } from './premises/reputation-multiplier';
import { expectedCatchValue } from './pricing/expected-catch-value';
import { lobsterPrice } from './pricing/lobster-price';
import { rollLobster } from './pricing/roll-lobster';
import type { RandomInt } from './random/random-int';
import { effectiveRent } from './rent/effective-rent';
import { offersRefreshIn } from './rent/offers-refresh-in';
import { rentDueIn } from './rent/rent-due-in';
import { seasonForDay } from './season/season-for-day';
import { inshoreStormRisk } from './storms/inshore-storm-risk';
import { rollStorm } from './storms/roll-storm';
import { stormChance } from './storms/storm-chance';
import { stormPotsLost } from './storms/storm-pots-lost';

function sequenceRandom(...values: number[]): RandomInt {
    let index = 0;

    return () => {
        const value = values[Math.min(index, values.length - 1)] ?? 1;
        index += 1;
        return value;
    };
}

function boat(
    id: string,
    size: BoatSize,
    damage = 0,
    strength: BoatStrength = BoatStrength.soSo
): Boat {
    return {
        id,
        name: `Boat ${id}`,
        size,
        strength,
        damage,
        capacityBonus: 0,
        ground: null,
        pots: 0
    };
}

describe('seasons', () => {
    it('maps days to 14-day seasons', () => {
        expect(seasonForDay(1, 14)).toBe(Season.spring);
        expect(seasonForDay(14, 14)).toBe(Season.spring);
        expect(seasonForDay(15, 14)).toBe(Season.summer);
        expect(seasonForDay(29, 14)).toBe(Season.autumn);
        expect(seasonForDay(43, 14)).toBe(Season.winter);
        expect(seasonForDay(57, 14)).toBe(Season.spring);
    });
});

describe('demand', () => {
    it('pulls toward the seasonal target and clamps', () => {
        expect(nextDemand(5, 8, sequenceRandom(0))).toBe(6);
        expect(nextDemand(5, 2, sequenceRandom(0))).toBe(4);
        expect(nextDemand(10, 3, sequenceRandom(2))).toBe(10);
        expect(nextDemand(1, 8, sequenceRandom(-2))).toBe(1);
    });

    it('maps demand to price multipliers', () => {
        expect(demandPriceMultiplier(1)).toBeCloseTo(0.6);
        expect(demandPriceMultiplier(5)).toBeCloseTo(1);
        expect(demandPriceMultiplier(10)).toBeCloseTo(1.5);
    });

    it('maps demand bands to catch modifiers', () => {
        expect(demandCatchModifier(1)).toBe(10);
        expect(demandCatchModifier(2)).toBe(10);
        expect(demandCatchModifier(4)).toBe(5);
        expect(demandCatchModifier(7)).toBe(0);
        expect(demandCatchModifier(9)).toBe(-5);
        expect(demandCatchModifier(10)).toBe(-10);
    });

    it('labels demand', () => {
        expect(demandLabel(1)).toBe('Dead');
        expect(demandLabel(5)).toBe('Steady');
        expect(demandLabel(10)).toBe('Frenzy');
    });
});

describe('pricing', () => {
    it('prices size, shell, demand and reputation', () => {
        expect(lobsterPrice(LobsterSize.small, ShellHardness.hard, 5, 1)).toBe(2);
        expect(lobsterPrice(LobsterSize.jumbo, ShellHardness.hard, 10, 1.2)).toBe(18);
        expect(lobsterPrice(LobsterSize.small, ShellHardness.soft, 1, 1)).toBe(1);
    });

    it('makes offshore catches worth more than inshore catches', () => {
        const inshore = expectedCatchValue(FishingGround.inshore, 5, 1);
        const offshore = expectedCatchValue(FishingGround.offshore, 5, 1);

        expect(inshore).toBeGreaterThan(2);
        expect(offshore).toBeGreaterThan(inshore * 1.5);
    });

    it('rolls the expected grade and shell', () => {
        const inshore = rollLobster(FishingGround.inshore, 5, 1, sequenceRandom(100, 1));
        const offshore = rollLobster(FishingGround.offshore, 5, 1, sequenceRandom(100, 100));

        expect(inshore.size).toBe(LobsterSize.jumbo);
        expect(inshore.shell).toBe(ShellHardness.soft);
        expect(offshore.size).toBe(LobsterSize.jumbo);
        expect(offshore.shell).toBe(ShellHardness.hard);
    });
});

describe('catches', () => {
    it('clamps catch chance', () => {
        expect(catchChance(70, 20, 1)).toBe(GAME_SETTINGS.maxCatchChance);
        expect(catchChance(70, -60, 10)).toBe(GAME_SETTINGS.minCatchChance);
        expect(catchChance(70, 0, 5)).toBe(70);
    });

    it('treats a roll equal to the chance as a catch', () => {
        expect(isCaught(70, sequenceRandom(70))).toBe(true);
        expect(isCaught(70, sequenceRandom(71))).toBe(false);
    });

    it('summarises catches by ground, size and shell', () => {
        const summaries = summarizeCatches([
            {
                ground: FishingGround.inshore,
                size: LobsterSize.small,
                shell: ShellHardness.hard,
                price: 2
            },
            {
                ground: FishingGround.inshore,
                size: LobsterSize.small,
                shell: ShellHardness.hard,
                price: 2
            },
            {
                ground: FishingGround.offshore,
                size: LobsterSize.jumbo,
                shell: ShellHardness.hard,
                price: 10
            }
        ]);

        expect(summaries).toHaveLength(2);
        expect(summaries[0].count).toBe(2);
        expect(summaries[0].income).toBe(4);
    });
});

describe('storms', () => {
    it('combines season and forecast storm chances', () => {
        expect(stormChance(15, Forecast.calm)).toBe(5);
        expect(stormChance(15, Forecast.evil)).toBe(30);
        expect(stormChance(80, Forecast.evil)).toBe(80);
        expect(stormChance(0, Forecast.calm)).toBe(0);
    });

    it('estimates inshore risk from the storm-type weights', () => {
        expect(inshoreStormRisk(30, Forecast.evil)).toBe(19.5);
        expect(inshoreStormRisk(30, Forecast.calm)).toBe(0.3);
    });

    it('returns none when the storm roll fails', () => {
        expect(rollStorm(0, Forecast.evil, sequenceRandom(1))).toBe(StormSeverity.none);
        expect(rollStorm(30, Forecast.evil, sequenceRandom(31))).toBe(StormSeverity.none);
    });

    it('uses the forecast to pick the storm type', () => {
        expect(rollStorm(100, Forecast.evil, sequenceRandom(50, 1))).toBe(
            StormSeverity.offshoreMinor
        );
        expect(rollStorm(100, Forecast.evil, sequenceRandom(50, 100))).toBe(
            StormSeverity.inshoreAndOffshore
        );
    });

    it('rolls pot losses per pot', () => {
        expect(stormPotsLost(StormSeverity.offshoreMinor, 5, 5, sequenceRandom(1))).toEqual({
            inshore: 0,
            offshore: 5
        });
        expect(stormPotsLost(StormSeverity.inshoreAndOffshore, 5, 5, sequenceRandom(100))).toEqual({
            inshore: 0,
            offshore: 0
        });
        expect(stormPotsLost(StormSeverity.inshoreAndOffshore, 4, 2, sequenceRandom(1))).toEqual({
            inshore: 4,
            offshore: 2
        });
    });
});

describe('boats', () => {
    it('rolls daily wear within range', () => {
        expect(boatWear(sequenceRandom(1))).toBe(1);
        expect(boatWear(sequenceRandom(5))).toBe(5);
    });

    it('applies storm damage by ground and size', () => {
        expect(
            stormBoatDamage(
                BoatSize.medium,
                FishingGround.inshore,
                StormSeverity.offshoreMajor,
                sequenceRandom(40)
            )
        ).toBe(0);
        expect(
            stormBoatDamage(
                BoatSize.medium,
                FishingGround.inshore,
                StormSeverity.inshoreAndOffshore,
                sequenceRandom(40)
            )
        ).toBe(40);
        expect(
            stormBoatDamage(
                BoatSize.large,
                FishingGround.offshore,
                StormSeverity.offshoreMinor,
                sequenceRandom(70)
            )
        ).toBe(70);
    });

    it('calculates repairs and resale', () => {
        const large = boat('l', BoatSize.large);

        expect(repairCost(BoatSize.large, 100, false)).toBe(50);
        expect(repairCost(BoatSize.large, 100, true)).toBe(0);
        expect(boatResale(large)).toBe(450);
        expect(boatResale({ ...large, damage: 50 })).toBe(225);
        expect(boatResale({ ...large, damage: 100 })).toBe(0);
        expect(boatResale({ ...large, strength: BoatStrength.nighUnsinkable })).toBe(675);
    });

    it('applies the strength multiplier to wear and storm damage', () => {
        expect(boatWear(sequenceRandom(4), 0.5)).toBe(2);
        expect(boatWear(sequenceRandom(1), 0.5)).toBe(1);
        expect(
            stormBoatDamage(
                BoatSize.large,
                FishingGround.offshore,
                StormSeverity.offshoreMajor,
                sequenceRandom(70),
                0.5
            )
        ).toBe(35);
    });

    it('upgrades capacity up to half the base capacity', () => {
        const large = boat('l', BoatSize.large);

        expect(boatCapacity(large)).toBe(14);
        expect(boatCapacity({ ...large, capacityBonus: 7 })).toBe(21);
        expect(boatMaxCapacityBonus(BoatSize.small)).toBe(2);
        expect(boatMaxCapacityBonus(BoatSize.medium)).toBe(4);
        expect(boatMaxCapacityBonus(BoatSize.large)).toBe(7);
    });

    it('prices fortification and capacity upgrades', () => {
        expect(fortifyCost(BoatSize.large, BoatStrength.decrepit)).toBe(250);
        expect(fortifyCost(BoatSize.large, BoatStrength.soSo)).toBe(750);
        expect(fortifyCost(BoatSize.large, BoatStrength.nighUnsinkable)).toBeNull();
        expect(boatStrengthProfile(BoatStrength.sturdy).damageMultiplier).toBe(0.75);
        expect(capacityUpgradeCost(BoatSize.large, 0)).toBe(54);
        expect(capacityUpgradeCost(BoatSize.large, 6)).toBe(378);
        expect(capacityUpgradeCost(BoatSize.large, 7)).toBeNull();
    });

    it('provides enough words for varied boat names', () => {
        expect(BOAT_ADJECTIVES.length).toBeGreaterThanOrEqual(30);
        expect(BOAT_NOUNS.length).toBeGreaterThanOrEqual(30);
        expect(BOAT_POSSESSIVES.length).toBeGreaterThanOrEqual(30);
        expect(BOAT_SECOND_WORDS.length).toBeGreaterThanOrEqual(30);
    });

    it('generates both boat name formats and avoids duplicates', () => {
        expect(generateBoatName(sequenceRandom(0, 0, 0))).toBe('The Rusty Tub');
        expect(generateBoatName(sequenceRandom(1, 0, 0))).toBe("Bluebeard's Freedom");
        expect(generateBoatName(sequenceRandom(0, 0, 0), new Set(['The Rusty Tub']))).not.toBe(
            'The Rusty Tub'
        );
    });

    it('generates two boat offers for each size', () => {
        const offers = createBoatOffers(sequenceRandom(1));

        expect(offers).toHaveLength(6);
        expect(new Set(offers.map((offer) => offer.name)).size).toBe(6);
        expect(offers.filter((offer) => offer.size === BoatSize.small)).toHaveLength(2);
        expect(offers.filter((offer) => offer.size === BoatSize.medium)).toHaveLength(2);
        expect(offers.filter((offer) => offer.size === BoatSize.large)).toHaveLength(2);
        expect(offers.every((offer) => offer.price > 0)).toBe(true);
    });

    it('refreshes boat offers offset from the premises', () => {
        expect(boatOffersCycle(1)).toBe(0);
        expect(boatOffersRefreshIn(1)).toBe(5);
        expect(boatOffersRefreshIn(6)).toBe(10);
    });

    it('resolves wrecks with and without recovery', () => {
        const loss = resolveWreck(10, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], false);
        expect(loss.boatLost).toBe(true);
        expect(loss.potsLost).toBe(10);
        expect(loss.catchesKept).toHaveLength(0);

        const recovered = resolveWreck(10, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], true);
        expect(recovered.boatLost).toBe(false);
        expect(recovered.potsKept).toBe(4);
        expect(recovered.potsLost).toBe(6);
        expect(recovered.catchesKept).toHaveLength(4);
    });
});

describe('performance rating', () => {
    it('is harsh for short, low-earning runs', () => {
        expect(performanceRating(5, 20, 100).title).toBe('Landlubber');
        expect(performanceRating(10, 100, 500).title).toBe('Landlubber');
    });

    it('scales with survival, catch and turnover', () => {
        expect(performanceRating(20, 200, 2000).title).toBe('Deckhand');
        expect(performanceRating(40, 800, 10000).title).toBe('Bosun');
        expect(performanceRating(80, 3000, 40000).title).toBe('Lobster Legend');
    });

    it('never returns a negative score', () => {
        expect(performanceRating(-5, -10, -100).score).toBe(0);
    });
});

describe('premises and rent', () => {
    it('includes the cheapest eligible offer and distinct picks', () => {
        const offers = createPremisesOffers(PREMISES_OFFERS, 16, 10, 3, sequenceRandom(1));

        expect(offers).toHaveLength(3);
        expect(offers[0].capacity).toBe(18);
        expect(new Set(offers.map((offer) => offer.id)).size).toBe(3);
        expect(offers.every((offer) => offer.capacity > 16)).toBe(true);
    });

    it('returns no offers at the largest premises', () => {
        expect(createPremisesOffers(PREMISES_OFFERS, 66, 10, 3, sequenceRandom(1))).toEqual([]);
    });

    it('blocks invalid purchases', () => {
        expect(purchaseBlockReason(100, 50, 18, 16, 10)).toBeNull();
        expect(purchaseBlockReason(10, 50, 18, 16, 10)).toContain('enough');
        expect(purchaseBlockReason(100, 50, 16, 16, 10)).toContain('no bigger');
    });

    it('describes reputation and perks', () => {
        expect(reputationLabel(0.9)).toBe('Poor');
        expect(reputationLabel(1)).toBe('Good');
        expect(reputationLabel(1.2)).toBe('Excellent');
        expect(reputationDescription(1)).toBe('Good (×1 lobster price)');
        expect(reputationDescription(1.15)).toBe('Excellent (×1.15 lobster price)');
        expect(premisesRarityLabel(PremisesRarity.rare)).toBe('Rare');
        expect(premisesRarityLabel(PremisesRarity.legendary)).toBe('Legendary');
        expect(hasFreeRepairs(PremisesRarity.rare)).toBe(true);
        expect(hasFreeRepairs(PremisesRarity.uncommon)).toBe(false);
        expect(hasWreckRecovery(PremisesRarity.legendary)).toBe(true);
    });

    it('calculates rent and offer timers', () => {
        expect(rentDueIn(1, 7)).toBe(6);
        expect(rentDueIn(6, 7)).toBe(1);
        expect(rentDueIn(7, 7)).toBe(0);
        expect(rentDueIn(8, 7)).toBe(6);
        expect(effectiveRent(80, 40)).toBe(112);
        expect(effectiveRent(80, -20)).toBe(64);
        expect(offersRefreshIn(1, 10)).toBe(10);
        expect(offersRefreshIn(10, 10)).toBe(1);
        expect(offersRefreshIn(11, 10)).toBe(10);
    });
});
