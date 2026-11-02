import { Injectable, signal } from '@angular/core';
import type { Boat } from '../classes/boat';
import type { BoatOffer } from '../classes/boat-offer';
import type { Premises } from '../classes/premises';
import type { PremisesOffer } from '../classes/premises-offer';
import type { Results } from '../classes/results';
import type { Setup } from '../classes/setup';
import { Difficulty } from '../enums/difficulty';
import { FishingGround } from '../enums/fishing-ground';
import { generateBoatName } from '../mechanics/boats/boat-name';
import { capacityRemaining } from '../mechanics/premises/capacity-remaining';
import { createRandomInt } from '../mechanics/random/random-int';
import { effectiveRent } from '../mechanics/rent/effective-rent';
import { STARTING_BOATS } from '../settings/boat-settings';
import { DEMAND_SETTINGS } from '../settings/demand-settings';
import { GAME_SETTINGS } from '../settings/game-settings';
import { STARTING_PREMISES } from '../settings/premises-settings';
import { readSessionJson, writeSessionJson } from './session-storage';
import { isStateCurrent, STATE_VERSION } from './state-version';

@Injectable({
    providedIn: 'root'
})
export class ProgressService {
    private readonly changes = signal(0);

    /**
     * Signal that changes whenever persisted game state changes.
     */
    readonly revision = this.changes.asReadonly();

    constructor() {
        if (!isStateCurrent(sessionStorage, STATE_VERSION) || !sessionStorage.getItem('day')) {
            this.newGame();
        }
    }

    /**
     * Resets all persisted game state to a fresh run.
     */
    newGame(): void {
        sessionStorage.clear();
        sessionStorage.setItem('stateVersion', STATE_VERSION);
        this.openingCash = GAME_SETTINGS.openingCash;
        this.openingPots = GAME_SETTINGS.openingPots;
        this.day = GAME_SETTINGS.startDay;
        this.difficulty = Difficulty.normal;
        this.potsBought = 0;
        this.potsLost = 0;
        this.income = 0;
        this.turnover = 0;
        this.potSpendings = 0;
        this.premisesSpendings = 0;
        this.boatSpendings = 0;
        this.totalLobstersCaught = 0;
        this.gameOver = false;
        this.gameOverReason = '';
        this.demand = DEMAND_SETTINGS.starting;
        this.demandDay = GAME_SETTINGS.startDay;
        this.lastRentPaidDay = 0;
        this.premises = {
            id: STARTING_PREMISES.id,
            name: STARTING_PREMISES.name,
            rarity: STARTING_PREMISES.rarity,
            capacity: STARTING_PREMISES.capacity,
            weeklyRent: STARTING_PREMISES.weeklyRent,
            reputationMultiplier: STARTING_PREMISES.reputationMultiplier
        };
        this.premisesOffers = [];
        this.offersCycle = -1;
        const randomInt = createRandomInt();
        const usedNames = new Set<string>();
        this.boats = STARTING_BOATS.map((boat, index) => {
            const name = generateBoatName(randomInt, usedNames);
            usedNames.add(name);

            return {
                id: `boat-${index + 1}`,
                name,
                size: boat.size,
                strength: boat.strength,
                damage: boat.damage,
                capacityBonus: 0,
                ground: null,
                pots: 0
            };
        });
        this.boatOffers = [];
        this.boatOffersCycle = -1;
        this.nextBoatId = STARTING_BOATS.length + 1;
        this.setup = null;
        this.results = null;
        this.touch();
    }

    private touch(): void {
        this.changes.update((value) => value + 1);
    }

    get openingCash(): number {
        return parseInt(sessionStorage.getItem('openingCash') || '0', 10);
    }
    set openingCash(value: number) {
        sessionStorage.setItem('openingCash', value.toString());
        this.touch();
    }

    get openingPots(): number {
        return parseInt(sessionStorage.getItem('openingPots') || '0', 10);
    }
    set openingPots(value: number) {
        sessionStorage.setItem('openingPots', value.toString());
        this.touch();
    }

    get potsBought(): number {
        return parseInt(sessionStorage.getItem('potsBought') || '0', 10);
    }
    set potsBought(value: number) {
        sessionStorage.setItem('potsBought', value.toString());
        this.touch();
    }

    get potsLost(): number {
        return parseInt(sessionStorage.getItem('potsLost') || '0', 10);
    }
    set potsLost(value: number) {
        sessionStorage.setItem('potsLost', value.toString());
        this.touch();
    }

    get potsInshore(): number {
        return this.boats
            .filter((boat) => boat.ground === FishingGround.inshore)
            .reduce((total, boat) => total + boat.pots, 0);
    }

    get potsOffshore(): number {
        return this.boats
            .filter((boat) => boat.ground === FishingGround.offshore)
            .reduce((total, boat) => total + boat.pots, 0);
    }

    get income(): number {
        return parseInt(sessionStorage.getItem('income') || '0', 10);
    }
    set income(value: number) {
        sessionStorage.setItem('income', value.toString());
        this.touch();
    }

    /**
     * Adds income and, when positive, records it as turnover.
     * @param value Amount to add; negative values are expenses.
     */
    addToIncome(value: number): void {
        sessionStorage.setItem('income', (this.income + value).toString());
        if (value > 0) {
            this.turnover += value;
        }
        this.touch();
    }

    get turnover(): number {
        return parseInt(sessionStorage.getItem('turnover') || '0', 10);
    }
    set turnover(value: number) {
        sessionStorage.setItem('turnover', value.toString());
    }

    get potSpendings(): number {
        return parseInt(sessionStorage.getItem('potSpendings') || '0', 10);
    }
    set potSpendings(value: number) {
        sessionStorage.setItem('potSpendings', value.toString());
        if (value < 0) {
            this.turnover += value * -1;
        }
        this.touch();
    }

    get premisesSpendings(): number {
        return parseInt(sessionStorage.getItem('premisesSpendings') || '0', 10);
    }
    set premisesSpendings(value: number) {
        sessionStorage.setItem('premisesSpendings', value.toString());
        this.touch();
    }

    get boatSpendings(): number {
        return parseInt(sessionStorage.getItem('boatSpendings') || '0', 10);
    }
    set boatSpendings(value: number) {
        sessionStorage.setItem('boatSpendings', value.toString());
        this.touch();
    }

    get netProfit(): number {
        return (
            this.openingCash +
            this.income -
            this.potSpendings -
            this.premisesSpendings -
            this.boatSpendings
        );
    }

    get totalPots(): number {
        return Math.max(0, this.openingPots + this.potsBought - this.potsLost);
    }

    get totalAvailablePots(): number {
        return Math.max(0, this.totalPots - (this.potsInshore + this.potsOffshore));
    }

    get inshoreAvailablePots(): number {
        return Math.max(0, this.totalPots - this.potsOffshore);
    }

    get offshoreAvailablePots(): number {
        return Math.max(0, this.totalPots - this.potsInshore);
    }

    get capacity(): number {
        return this.premises.capacity;
    }

    get capacityRemaining(): number {
        return capacityRemaining(this.capacity, this.totalPots);
    }

    get day(): number {
        return parseInt(sessionStorage.getItem('day') || '0', 10);
    }
    set day(value: number) {
        sessionStorage.setItem('day', value.toString());
        this.touch();
    }

    get setup(): Setup | null {
        return readSessionJson<Setup>('setup');
    }
    set setup(value: Setup | null) {
        writeSessionJson('setup', value);
        this.touch();
    }

    get results(): Results | null {
        return readSessionJson<Results>('results');
    }
    set results(value: Results | null) {
        writeSessionJson('results', value);
        this.touch();
    }

    get totalLobstersCaught(): number {
        return parseInt(sessionStorage.getItem('totalLobstersCaught') || '0', 10);
    }
    set totalLobstersCaught(value: number) {
        sessionStorage.setItem('totalLobstersCaught', value.toString());
        this.touch();
    }

    get gameOver(): boolean {
        return sessionStorage.getItem('gameOver') === 'true';
    }
    set gameOver(value: boolean) {
        sessionStorage.setItem('gameOver', value.toString());
        this.touch();
    }

    get gameOverReason(): string {
        return sessionStorage.getItem('gameOverReason') || '';
    }
    set gameOverReason(value: string) {
        sessionStorage.setItem('gameOverReason', value.toString());
    }

    get difficulty(): Difficulty {
        return parseInt(sessionStorage.getItem('difficulty') || '0', 10);
    }
    set difficulty(value: Difficulty) {
        sessionStorage.setItem('difficulty', value.toString());
        this.touch();
    }

    get demand(): number {
        return parseInt(sessionStorage.getItem('demand') || `${DEMAND_SETTINGS.starting}`, 10);
    }
    set demand(value: number) {
        sessionStorage.setItem('demand', value.toString());
        this.touch();
    }

    get demandDay(): number {
        return parseInt(sessionStorage.getItem('demandDay') || '0', 10);
    }
    set demandDay(value: number) {
        sessionStorage.setItem('demandDay', value.toString());
    }

    get lastRentPaidDay(): number {
        return parseInt(sessionStorage.getItem('lastRentPaidDay') || '0', 10);
    }
    set lastRentPaidDay(value: number) {
        sessionStorage.setItem('lastRentPaidDay', value.toString());
    }

    get rentValue(): number {
        return effectiveRent(this.premises.weeklyRent, this.difficulty);
    }

    get premises(): Premises {
        return (
            readSessionJson<Premises>('premises') ?? {
                id: STARTING_PREMISES.id,
                name: STARTING_PREMISES.name,
                rarity: STARTING_PREMISES.rarity,
                capacity: STARTING_PREMISES.capacity,
                weeklyRent: STARTING_PREMISES.weeklyRent,
                reputationMultiplier: STARTING_PREMISES.reputationMultiplier
            }
        );
    }
    set premises(value: Premises) {
        writeSessionJson('premises', value);
        this.touch();
    }

    get premisesOffers(): PremisesOffer[] {
        return readSessionJson<PremisesOffer[]>('premisesOffers') ?? [];
    }
    set premisesOffers(value: PremisesOffer[]) {
        writeSessionJson('premisesOffers', value);
    }

    get offersCycle(): number {
        return parseInt(sessionStorage.getItem('offersCycle') || '-1', 10);
    }
    set offersCycle(value: number) {
        sessionStorage.setItem('offersCycle', value.toString());
    }

    get boats(): Boat[] {
        return (
            readSessionJson<Boat[]>('boats') ??
            STARTING_BOATS.map((boat, index) => ({
                id: `boat-${index + 1}`,
                name: `Boat ${index + 1}`,
                size: boat.size,
                strength: boat.strength,
                damage: boat.damage,
                capacityBonus: 0,
                ground: null,
                pots: 0
            }))
        );
    }
    set boats(value: Boat[]) {
        writeSessionJson('boats', value);
        this.touch();
    }

    get boatOffers(): BoatOffer[] {
        return readSessionJson<BoatOffer[]>('boatOffers') ?? [];
    }
    set boatOffers(value: BoatOffer[]) {
        writeSessionJson('boatOffers', value);
    }

    get boatOffersCycle(): number {
        return parseInt(sessionStorage.getItem('boatOffersCycle') || '-1', 10);
    }
    set boatOffersCycle(value: number) {
        sessionStorage.setItem('boatOffersCycle', value.toString());
    }

    get nextBoatId(): number {
        return parseInt(sessionStorage.getItem('nextBoatId') || '1', 10);
    }
    set nextBoatId(value: number) {
        sessionStorage.setItem('nextBoatId', value.toString());
    }
}
