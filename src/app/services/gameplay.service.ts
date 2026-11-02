import { Injectable, inject } from '@angular/core';
import type { Boat } from '../classes/boat';
import type { BoatAssignment } from '../classes/boat-assignment';
import type { BoatOffer } from '../classes/boat-offer';
import type { LobsterCatch } from '../classes/lobster-catch';
import { Results } from '../classes/results';
import { Setup } from '../classes/setup';
import { BoatSize } from '../enums/boat-size';
import { FishingGround } from '../enums/fishing-ground';
import { Forecast } from '../enums/forecast';
import { StormSeverity } from '../enums/storm-severity';
import { boatCapacity } from '../mechanics/boats/boat-capacity';
import { boatOffersCycle, boatOffersRefreshIn } from '../mechanics/boats/boat-offers-refresh';
import { boatResale } from '../mechanics/boats/boat-resale';
import { boatStrengthIndex, boatStrengthProfile } from '../mechanics/boats/boat-strength';
import { boatWear } from '../mechanics/boats/boat-wear';
import { capacityUpgradeCost } from '../mechanics/boats/capacity-upgrade-cost';
import { createBoatOffers } from '../mechanics/boats/create-boat-offers';
import { fortifyCost } from '../mechanics/boats/fortify-cost';
import { repairCost } from '../mechanics/boats/repair-cost';
import { resolveWreck } from '../mechanics/boats/resolve-wreck';
import { stormBoatDamage } from '../mechanics/boats/storm-boat-damage';
import { catchChance } from '../mechanics/catch/catch-chance';
import { isCaught } from '../mechanics/catch/is-caught';
import { summarizeCatches } from '../mechanics/catch/summarize-catches';
import { demandLabel } from '../mechanics/demand/demand-label';
import { demandPriceMultiplier } from '../mechanics/demand/demand-price-multiplier';
import { nextDemand } from '../mechanics/demand/next-demand';
import { createPremisesOffers } from '../mechanics/premises/create-premises-offers';
import { hasFreeRepairs } from '../mechanics/premises/has-free-repairs';
import { hasWreckRecovery } from '../mechanics/premises/has-wreck-recovery';
import { purchaseBlockReason } from '../mechanics/premises/purchase-block';
import { reputationLabel } from '../mechanics/premises/reputation-multiplier';
import { rollLobster } from '../mechanics/pricing/roll-lobster';
import type { RandomInt } from '../mechanics/random/random-int';
import { effectiveRent } from '../mechanics/rent/effective-rent';
import { offersRefreshIn } from '../mechanics/rent/offers-refresh-in';
import { rentDueIn } from '../mechanics/rent/rent-due-in';
import { seasonForDay } from '../mechanics/season/season-for-day';
import { inshoreStormRisk } from '../mechanics/storms/inshore-storm-risk';
import { rollStorm } from '../mechanics/storms/roll-storm';
import { stormChance } from '../mechanics/storms/storm-chance';
import { stormPotsLost } from '../mechanics/storms/storm-pots-lost';
import { BOAT_STRENGTHS } from '../settings/boat-settings';
import { DEMAND_SETTINGS } from '../settings/demand-settings';
import { GAME_SETTINGS } from '../settings/game-settings';
import { PREMISES_OFFERS } from '../settings/premises-settings';
import { SEASON_PROFILES } from '../settings/season-settings';
import { ProgressService } from './progress.service';
import { RANDOM_INT } from './random-int.token';

@Injectable({
    providedIn: 'root'
})
export class GameplayService {
    private readonly randomInt = inject<RandomInt>(RANDOM_INT);

    constructor(private progressService: ProgressService) {}

    /**
     * Builds the current day's setup, reusing it when the day has already been prepared.
     * @returns The persisted setup for the current day.
     */
    getRoundSetup(): Setup {
        const existing = this.progressService.setup;

        if (existing && existing.day === this.progressService.day) {
            return existing;
        }

        this.progressService.results = null;
        this.resetBoatAssignments();

        const day = this.progressService.day;
        const season = seasonForDay(day, GAME_SETTINGS.seasonLengthDays);
        const profile = SEASON_PROFILES[season];
        const demand = this.resolveDemand(day, profile.demandTarget);
        const forecast = day === 1 ? Forecast.calm : this.rollForecast();
        const offshoreChance = day === 1 ? 0 : stormChance(profile.baseStormChance, forecast);
        const inshoreChance = inshoreStormRisk(offshoreChance, forecast);
        const chance = catchChance(GAME_SETTINGS.baseCatchChance, profile.catchModifier, demand);
        const premises = this.progressService.premises;
        const rentDays = rentDueIn(day, GAME_SETTINGS.rentIntervalDays);
        const offers = this.ensureOffers(premises, day);
        this.ensureBoatOffers(day);

        const setup = new Setup();
        setup.day = day;
        setup.title = day === 1 ? 'Avast, Me Hearties!' : 'Another Day, Another Lobster!';
        setup.info =
            day === 1
                ? 'Welcome to lobster pots! Be ye savvy enough to survive the cutthroat life as a lobster catcher? There is but 1 rule... No prey no pay!'
                : '';
        setup.season = season;
        setup.seasonDescription = profile.description;
        setup.forecast = forecast;
        setup.forecastDescription = this.describeForecast(forecast);
        setup.stormChanceOffshore = offshoreChance;
        setup.stormChanceInshore = inshoreChance;
        setup.stormAlert = offshoreChance >= 30;
        setup.catchChance = chance;
        setup.demand = demand;
        setup.demandLabel = demandLabel(demand);
        setup.demandMultiplier = demandPriceMultiplier(demand);
        setup.demandDescription = `Demand is ${setup.demandLabel.toLowerCase()} at ${demand}/10: lobster prices are ×${setup.demandMultiplier.toFixed(2)} and the catch chance is ${chance}%.`;
        setup.potPrice = GAME_SETTINGS.potPrice;
        setup.capacity = premises.capacity;
        setup.totalPots = this.progressService.totalPots;
        setup.premises = { ...premises };
        setup.premisesOffers = offers;
        setup.offerRefreshIn = offersRefreshIn(day, GAME_SETTINGS.premisesOfferIntervalDays);
        setup.rentValue = this.progressService.rentValue;
        setup.rentDueIn = rentDays;
        setup.rentDue = rentDays === 0;
        setup.rentDueTomorrow = rentDays === 1;
        setup.rentWarning = rentDays <= 1 && this.progressService.netProfit < setup.rentValue;
        setup.reputationLabel = reputationLabel(premises.reputationMultiplier);
        setup.freeRepairs = hasFreeRepairs(premises.rarity);
        setup.wreckRecovery = hasWreckRecovery(premises.rarity);
        setup.boatOfferRefreshIn = boatOffersRefreshIn(day);
        setup.inshoreGradeHint = 'Mostly small/medium · 55% hard-shell';
        setup.offshoreGradeHint = 'Mostly large/jumbo · 85% hard-shell';

        this.applyRent(setup);
        this.setGameOver(setup);

        if (this.progressService.gameOver) {
            setup.info = this.progressService.gameOverReason;
        }

        return this.setRoundSetup(setup);
    }

    /**
     * Runs the day's fishing trip and records the results.
     * @param setup Current day's setup.
     * @returns The results, or the existing results when already run today.
     */
    goLobstering(setup: Setup): Results {
        const existing = this.progressService.results;

        if (existing && existing.day === this.progressService.day) {
            return existing;
        }

        const results = new Results();
        results.day = setup.day;
        results.season = setup.season;
        results.demand = setup.demand;

        let boats = this.progressService.boats.map((boat) => ({ ...boat }));
        let assignments: BoatAssignment[] = boats
            .filter((boat) => boat.damage < 100 && boat.ground !== null && boat.pots > 0)
            .map((boat) => ({
                boatId: boat.id,
                size: boat.size,
                ground: boat.ground as FishingGround,
                pots: boat.pots
            }));
        const inshorePots = this.potsOnGround(assignments, FishingGround.inshore);
        const offshorePots = this.potsOnGround(assignments, FishingGround.offshore);

        const severity =
            setup.day === 1
                ? StormSeverity.none
                : rollStorm(setup.stormChanceOffshore, setup.forecast, this.randomInt);
        results.stormSeverity = severity;

        if (severity !== StormSeverity.none) {
            const losses = stormPotsLost(severity, inshorePots, offshorePots, this.randomInt);
            results.potsLostInshore = losses.inshore;
            results.potsLostOffshore = losses.offshore;
            results.potsLost = losses.inshore + losses.offshore;
            this.progressService.potsLost += results.potsLost;
            assignments = this.removePots(assignments, FishingGround.inshore, losses.inshore);
            assignments = this.removePots(assignments, FishingGround.offshore, losses.offshore);
        }

        results.stormDescription = this.describeStorm(
            severity,
            results.potsLostInshore,
            results.potsLostOffshore
        );
        results.alert = results.potsLost > 0;

        const reputation = setup.premises?.reputationMultiplier ?? 1;
        const catchesByBoat = new Map<string, LobsterCatch[]>();

        for (const assignment of assignments) {
            const boatCatches: LobsterCatch[] = [];

            for (let pot = 0; pot < assignment.pots; pot += 1) {
                if (!isCaught(setup.catchChance, this.randomInt)) {
                    continue;
                }

                for (
                    let catchIndex = 0;
                    catchIndex < GAME_SETTINGS.catchesPerPot;
                    catchIndex += 1
                ) {
                    boatCatches.push(
                        rollLobster(assignment.ground, setup.demand, reputation, this.randomInt)
                    );
                }
            }

            catchesByBoat.set(assignment.boatId, boatCatches);
        }

        for (const assignment of assignments) {
            const boat = boats.find((candidate) => candidate.id === assignment.boatId);

            if (!boat) {
                continue;
            }

            const strength = boatStrengthProfile(boat.strength);
            const damageBefore = boat.damage;
            const damage =
                stormBoatDamage(
                    assignment.size,
                    assignment.ground,
                    severity,
                    this.randomInt,
                    strength.damageMultiplier
                ) + boatWear(this.randomInt, strength.damageMultiplier);
            boat.damage = Math.min(100, damageBefore + damage);
            results.boatDamage.push({
                boatId: boat.id,
                name: boat.name,
                size: boat.size,
                damageBefore,
                damageAfter: boat.damage
            });
        }

        const recovery = setup.premises ? hasWreckRecovery(setup.premises.rarity) : false;
        const survivingCatches: LobsterCatch[] = [];

        for (const assignment of assignments) {
            const boat = boats.find((candidate) => candidate.id === assignment.boatId);

            if (!boat) {
                continue;
            }

            const boatCatches = catchesByBoat.get(boat.id) ?? [];

            if (boat.damage < 100) {
                survivingCatches.push(...boatCatches);
                continue;
            }

            const resolution = resolveWreck(assignment.pots, boatCatches, recovery);
            results.potsLost += resolution.potsLost;
            this.progressService.potsLost += resolution.potsLost;

            const incomeKept = resolution.catchesKept.reduce(
                (total, lobster) => total + lobster.price,
                0
            );
            const incomeLost = resolution.catchesLost.reduce(
                (total, lobster) => total + lobster.price,
                0
            );

            results.boatLosses.push({
                boatId: boat.id,
                name: boat.name,
                size: boat.size,
                potsLost: resolution.potsLost,
                potsRecovered: resolution.potsKept,
                incomeLost,
                incomeRecovered: incomeKept,
                boatLost: resolution.boatLost
            });

            if (resolution.boatLost) {
                boats = boats.filter((candidate) => candidate.id !== boat.id);
                results.boatsWrecked += 1;
            }

            survivingCatches.push(...resolution.catchesKept);
        }

        for (const lobster of survivingCatches) {
            results.income += lobster.price;

            if (lobster.ground === FishingGround.inshore) {
                results.inshoreIncome += lobster.price;
            } else {
                results.offshoreIncome += lobster.price;
            }
        }

        results.lobstersCaught = survivingCatches.length;
        results.catches = summarizeCatches(survivingCatches);
        results.title =
            inshorePots + offshorePots === 0
                ? 'Ye sat this one out! Ye landlubber!!'
                : results.income > 0
                  ? 'Success!'
                  : 'Unlucky!';
        results.success = results.income > 0;

        this.progressService.addToIncome(results.income);
        this.progressService.totalLobstersCaught += results.lobstersCaught;
        this.progressService.boats = boats.map((boat) => ({
            ...boat,
            ground: null,
            pots: 0
        }));
        this.progressService.results = results;

        return results;
    }

    /**
     * Buys a pot when the premises and wallet allow it.
     * @param setup Current day's setup.
     * @returns The updated setup.
     */
    buyPot(setup: Setup): Setup {
        if (this.progressService.totalPots >= this.progressService.capacity) {
            setup.info = 'Yer premises cannot hold another pot. Buy a bigger premises first.';
            this.progressService.setup = setup;
            return setup;
        }

        if (this.progressService.netProfit < setup.potPrice) {
            setup.info = "Ye don't have enough 💰";
            this.progressService.setup = setup;
            return setup;
        }

        this.progressService.potsBought += 1;
        this.progressService.potSpendings += setup.potPrice;
        setup.totalPots = this.progressService.totalPots;
        setup.info = `Bought a pot for ${setup.potPrice}💰.`;
        this.progressService.setup = setup;

        return setup;
    }

    /**
     * Sells one unplaced pot for half its current price.
     * @param setup Current day's setup.
     */
    sellPot(setup: Setup): void {
        if (this.progressService.totalAvailablePots < 1) {
            return;
        }

        const refund = Math.round(setup.potPrice * GAME_SETTINGS.potResaleMultiplier);
        this.progressService.potsBought -= 1;
        this.progressService.potSpendings -= refund;
        setup.totalPots = this.progressService.totalPots;
        setup.info = `Sold a pot for ${refund}💰.`;
        this.progressService.setup = setup;
    }

    /**
     * Buys a randomly offered premises.
     * @param offerId Identifier of the offer to buy.
     * @returns A player-facing error message, or null on success.
     */
    buyPremises(offerId: string): string | null {
        const offer = this.progressService.premisesOffers.find(
            (candidate) => candidate.id === offerId
        );

        if (!offer) {
            return 'That offer has sailed. Wait for the next batch.';
        }

        const current = this.progressService.premises;
        const block = purchaseBlockReason(
            this.progressService.netProfit,
            offer.purchasePrice,
            offer.capacity,
            current.capacity,
            this.progressService.totalPots
        );

        if (block) {
            return block;
        }

        this.progressService.premisesSpendings += offer.purchasePrice;
        this.progressService.premises = {
            id: offer.id,
            name: offer.name,
            rarity: offer.rarity,
            capacity: offer.capacity,
            weeklyRent: offer.weeklyRent,
            reputationMultiplier: offer.reputationMultiplier
        };
        this.progressService.premisesOffers = this.progressService.premisesOffers.filter(
            (candidate) =>
                candidate.capacity > offer.capacity &&
                candidate.capacity >= this.progressService.totalPots
        );
        this.syncSetupPremises();

        return null;
    }

    /**
     * Fully repairs a boat.
     * @param boatId Identifier of the boat to repair.
     * @returns A player-facing error message, or null on success.
     */
    repairBoat(boatId: string): string | null {
        const boats = this.progressService.boats;
        const boat = boats.find((candidate) => candidate.id === boatId);

        if (!boat) {
            return 'That boat is already at the bottom of the sea.';
        }

        if (boat.damage <= 0) {
            return 'That boat is already shipshape.';
        }

        const free = hasFreeRepairs(this.progressService.premises.rarity);
        const cost = repairCost(boat.size, boat.damage, free);

        if (cost > 0 && this.progressService.netProfit < cost) {
            return "Ye don't have enough 💰 for that repair.";
        }

        boat.damage = 0;
        this.progressService.boats = boats;
        this.progressService.boatSpendings += cost;

        return null;
    }

    /**
     * Buys a boat from the current market.
     * @param offerId Identifier of the boat offer.
     * @returns A player-facing error message, or null on success.
     */
    buyBoatOffer(offerId: string): string | null {
        const offer = this.progressService.boatOffers.find((candidate) => candidate.id === offerId);

        if (!offer) {
            return 'That boat has already sailed.';
        }

        if (this.progressService.netProfit < offer.price) {
            return "Ye don't have enough 💰 for that boat.";
        }

        const boat: Boat = {
            id: `boat-${this.progressService.nextBoatId}`,
            name: offer.name,
            size: offer.size,
            strength: offer.strength,
            damage: 0,
            capacityBonus: offer.capacityBonus,
            ground: null,
            pots: 0
        };
        this.progressService.nextBoatId += 1;
        this.progressService.boats = [...this.progressService.boats, boat];
        this.progressService.boatOffers = this.progressService.boatOffers.filter(
            (candidate) => candidate.id !== offerId
        );
        this.progressService.boatSpendings += offer.price;

        return null;
    }

    /**
     * Assigns a boat to a fishing ground.
     * @param boatId Boat identifier.
     * @param ground Ground to assign, or null to dock the boat.
     */
    setBoatGround(boatId: string, ground: FishingGround | null): void {
        const boats = this.progressService.boats;
        const boat = boats.find((candidate) => candidate.id === boatId);

        if (!boat || boat.damage >= 100) {
            return;
        }

        if (ground === FishingGround.offshore && boat.size !== BoatSize.large) {
            return;
        }

        boat.ground = ground;

        if (ground === null) {
            boat.pots = 0;
        }

        this.progressService.boats = boats;
    }

    /**
     * Sets the number of pots loaded on a boat.
     * @param boatId Boat identifier.
     * @param pots Requested pot count.
     */
    setBoatPots(boatId: string, pots: number): void {
        const boats = this.progressService.boats;
        const boat = boats.find((candidate) => candidate.id === boatId);

        if (!boat || boat.damage >= 100) {
            return;
        }

        const available = this.availablePotsForBoat(boats, boatId);
        const next = Math.max(0, Math.min(boatCapacity(boat), Math.floor(pots), available));
        boat.pots = next;

        if (next > 0 && boat.ground === null) {
            boat.ground = FishingGround.inshore;
        }

        this.progressService.boats = boats;
    }

    /**
     * Loads a boat with as many available pots as it can carry.
     * @param boatId Boat identifier.
     */
    fillBoat(boatId: string): void {
        const boats = this.progressService.boats;
        const boat = boats.find((candidate) => candidate.id === boatId);

        if (!boat || boat.damage >= 100) {
            return;
        }

        const available = this.availablePotsForBoat(boats, boatId);
        boat.pots = Math.min(boatCapacity(boat), available);

        if (boat.pots > 0 && boat.ground === null) {
            boat.ground = FishingGround.inshore;
        }

        this.progressService.boats = boats;
    }

    /**
     * Docks a boat and unloads its pots.
     * @param boatId Boat identifier.
     */
    dockBoat(boatId: string): void {
        const boats = this.progressService.boats;
        const boat = boats.find((candidate) => candidate.id === boatId);

        if (!boat) {
            return;
        }

        boat.ground = null;
        boat.pots = 0;
        this.progressService.boats = boats;
    }

    /**
     * Fortifies a boat by one strength grade.
     * @param boatId Boat identifier.
     * @returns A player-facing error message, or null on success.
     */
    fortifyBoat(boatId: string): string | null {
        const boats = this.progressService.boats;
        const boat = boats.find((candidate) => candidate.id === boatId);

        if (!boat) {
            return 'That boat is not in yer fleet.';
        }

        const cost = fortifyCost(boat.size, boat.strength);

        if (cost === null) {
            return 'That boat is already as strong as she gets.';
        }

        if (this.progressService.netProfit < cost) {
            return "Ye don't have enough 💰 to fortify her.";
        }

        boat.strength = BOAT_STRENGTHS[boatStrengthIndex(boat.strength) + 1].value;
        this.progressService.boats = boats;
        this.progressService.boatSpendings += cost;

        return null;
    }

    /**
     * Adds one pot slot to a boat.
     * @param boatId Boat identifier.
     * @returns A player-facing error message, or null on success.
     */
    upgradeBoatCapacity(boatId: string): string | null {
        const boats = this.progressService.boats;
        const boat = boats.find((candidate) => candidate.id === boatId);

        if (!boat) {
            return 'That boat is not in yer fleet.';
        }

        const cost = capacityUpgradeCost(boat.size, boat.capacityBonus);

        if (cost === null) {
            return 'That boat cannot carry any more pots.';
        }

        if (this.progressService.netProfit < cost) {
            return "Ye don't have enough 💰 for that upgrade.";
        }

        boat.capacityBonus += 1;
        this.progressService.boats = boats;
        this.progressService.boatSpendings += cost;

        return null;
    }

    /**
     * Renames a boat.
     * @param boatId Boat identifier.
     * @param name New name.
     * @returns A player-facing error message, or null on success.
     */
    renameBoat(boatId: string, name: string): string | null {
        const boats = this.progressService.boats;
        const boat = boats.find((candidate) => candidate.id === boatId);
        const trimmed = name.trim();

        if (!boat) {
            return 'That boat is not in yer fleet.';
        }

        if (!trimmed) {
            return 'Give her a proper name.';
        }

        if (trimmed.length > 40) {
            return 'That name is too long.';
        }

        boat.name = trimmed;
        this.progressService.boats = boats;

        return null;
    }

    /**
     * Sells a boat at its condition-adjusted resale value.
     * @param boatId Identifier of the boat to sell.
     * @returns A player-facing error message, or null on success.
     */
    sellBoat(boatId: string): string | null {
        const boats = this.progressService.boats;
        const boat = boats.find((candidate) => candidate.id === boatId);

        if (!boat) {
            return 'That boat is not in yer fleet.';
        }

        this.progressService.boats = boats.filter((candidate) => candidate.id !== boatId);
        this.progressService.boatSpendings -= boatResale(boat);

        return null;
    }

    private resolveDemand(day: number, target: number): number {
        if (this.progressService.demandDay === day) {
            return this.progressService.demand;
        }

        const previous =
            this.progressService.demandDay === 0
                ? DEMAND_SETTINGS.starting
                : this.progressService.demand;
        const demand =
            day === 1 ? DEMAND_SETTINGS.starting : nextDemand(previous, target, this.randomInt);
        this.progressService.demand = demand;
        this.progressService.demandDay = day;

        return demand;
    }

    private rollForecast(): Forecast {
        const forecasts = Object.values(Forecast);
        return forecasts[this.randomInt(0, forecasts.length - 1)];
    }

    private ensureOffers(
        premises: { capacity: number },
        day: number
    ): ReturnType<typeof createPremisesOffers> {
        const cycle = Math.floor((Math.max(1, day) - 1) / GAME_SETTINGS.premisesOfferIntervalDays);

        if (this.progressService.offersCycle === cycle) {
            return this.progressService.premisesOffers;
        }

        const offers = createPremisesOffers(
            PREMISES_OFFERS,
            premises.capacity,
            this.progressService.totalPots,
            GAME_SETTINGS.offersPerCycle,
            this.randomInt
        );
        this.progressService.premisesOffers = offers;
        this.progressService.offersCycle = cycle;

        return offers;
    }

    private applyRent(setup: Setup): void {
        if (
            !setup.rentDue ||
            this.progressService.lastRentPaidDay === setup.day ||
            this.progressService.gameOver
        ) {
            return;
        }

        if (this.progressService.netProfit < setup.rentValue) {
            this.progressService.gameOver = true;
            this.progressService.gameOverReason = "Ye couldn't pay the rent!";
            return;
        }

        this.progressService.addToIncome(-setup.rentValue);
        this.progressService.lastRentPaidDay = setup.day;
    }

    private setGameOver(setup: Setup): void {
        if (this.progressService.gameOver) {
            return;
        }

        if (this.progressService.netProfit < setup.potPrice && this.progressService.totalPots < 1) {
            this.progressService.gameOver = true;
            this.progressService.gameOverReason =
                "Ye have no more pots and ye can't afford to buy them!";
        }
    }

    private setRoundSetup(setup: Setup): Setup {
        this.progressService.setup = setup;
        return setup;
    }

    private syncSetupPremises(): void {
        const setup = this.progressService.setup;

        if (!setup) {
            return;
        }

        const premises = this.progressService.premises;
        setup.premises = { ...premises };
        setup.capacity = premises.capacity;
        setup.totalPots = this.progressService.totalPots;
        setup.rentValue = effectiveRent(premises.weeklyRent, this.progressService.difficulty);
        setup.reputationLabel = reputationLabel(premises.reputationMultiplier);
        setup.freeRepairs = hasFreeRepairs(premises.rarity);
        setup.wreckRecovery = hasWreckRecovery(premises.rarity);
        setup.premisesOffers = this.progressService.premisesOffers;
        setup.info = `Welcome to ${premises.name}! Rent is now ${premises.weeklyRent}💰 a week.`;
        this.progressService.setup = setup;
    }

    private availablePotsForBoat(boats: readonly Boat[], boatId: string): number {
        const assignedElsewhere = boats
            .filter((boat) => boat.id !== boatId)
            .reduce((total, boat) => total + boat.pots, 0);

        return Math.max(0, this.progressService.totalPots - assignedElsewhere);
    }

    private resetBoatAssignments(): void {
        this.progressService.boats = this.progressService.boats.map((boat) => ({
            ...boat,
            ground: null,
            pots: 0
        }));
    }

    private ensureBoatOffers(day: number): BoatOffer[] {
        const cycle = boatOffersCycle(day);

        if (this.progressService.boatOffersCycle === cycle) {
            return this.progressService.boatOffers;
        }

        const excluded = new Set(this.progressService.boats.map((boat) => boat.name));
        const offers = createBoatOffers(this.randomInt, excluded);
        this.progressService.boatOffers = offers;
        this.progressService.boatOffersCycle = cycle;

        return offers;
    }

    private potsOnGround(assignments: readonly BoatAssignment[], ground: FishingGround): number {
        return assignments
            .filter((assignment) => assignment.ground === ground)
            .reduce((total, assignment) => total + assignment.pots, 0);
    }

    private removePots(
        assignments: readonly BoatAssignment[],
        ground: FishingGround,
        count: number
    ): BoatAssignment[] {
        let remaining = count;

        return assignments
            .map((assignment) => {
                if (assignment.ground !== ground || remaining <= 0) {
                    return assignment;
                }

                const removed = Math.min(assignment.pots, remaining);
                remaining -= removed;

                return { ...assignment, pots: assignment.pots - removed };
            })
            .filter((assignment) => assignment.pots > 0);
    }

    private describeForecast(forecast: Forecast): string {
        switch (forecast) {
            case Forecast.calm:
                return 'The glass is steady and the sea is flat.';
            case Forecast.fair:
                return 'A fair-weather forecast with a working breeze.';
            case Forecast.normal:
                return 'Mixed skies and ordinary conditions.';
            case Forecast.unsettled:
                return 'The wind is rising and the sky looks dirty.';
            case Forecast.grim:
                return 'A grim forecast. Batten down the hatches.';
            case Forecast.evil:
                return 'An evil-looking sky. Only a fool would trust it.';
            default:
                return 'The forecast is uncertain.';
        }
    }

    private describeStorm(
        severity: StormSeverity,
        inshoreLost: number,
        offshoreLost: number
    ): string {
        if (severity === StormSeverity.none) {
            return 'No storm in the night.';
        }

        if (inshoreLost + offshoreLost === 0) {
            return 'A storm blew through, but it spared yer gear.';
        }

        if (severity === StormSeverity.offshoreMinor) {
            return `A squall passed offshore. ${offshoreLost} offshore pot${offshoreLost === 1 ? '' : 's'} lost.`;
        }

        if (severity === StormSeverity.offshoreMajor) {
            return `A gale hammered the offshore grounds. ${offshoreLost} offshore pot${offshoreLost === 1 ? '' : 's'} lost.`;
        }

        return `The worst storm in years struck both grounds. ${offshoreLost} offshore and ${inshoreLost} inshore pots lost.`;
    }
}
