import { TestBed } from '@angular/core/testing';

import { BoatSize } from '../enums/boat-size';
import { BoatStrength } from '../enums/boat-strength';
import { FishingGround } from '../enums/fishing-ground';
import { GameplayService } from './gameplay.service';
import { ProgressService } from './progress.service';
import { RANDOM_INT } from './random-int.token';

describe('GameplayService', () => {
    let service: GameplayService;
    let progress: ProgressService;

    beforeEach(() => {
        sessionStorage.clear();
        TestBed.configureTestingModule({
            providers: [{ provide: RANDOM_INT, useValue: () => 1 }]
        });
        progress = TestBed.inject(ProgressService);
        service = TestBed.inject(GameplayService);
    });

    function boatOfSize(size: BoatSize) {
        return progress.boats.find((boat) => boat.size === size);
    }

    it('creates a fresh day-one setup with a named fleet and boat market', () => {
        const setup = service.getRoundSetup();

        expect(setup.day).toBe(1);
        expect(setup.demand).toBe(5);
        expect(setup.stormChanceOffshore).toBe(0);
        expect(setup.capacity).toBe(16);
        expect(progress.boats).toHaveLength(3);
        expect(progress.boats.every((boat) => boat.name.length > 0)).toBe(true);
        expect(progress.boats.every((boat) => boat.ground === null && boat.pots === 0)).toBe(true);
        expect(progress.boatOffers).toHaveLength(6);
        expect(setup.premisesOffers).toHaveLength(3);
        expect(progress.premises.name).toBe('Lobsters Revenge');
        expect(progress.totalPots).toBe(10);
        expect(boatOfSize(BoatSize.large)?.damage).toBe(100);
    });

    it('reuses the setup and charges rent only once per due day', () => {
        progress.day = 7;
        service.getRoundSetup();
        const incomeAfterRent = progress.income;

        service.getRoundSetup();

        expect(progress.lastRentPaidDay).toBe(7);
        expect(progress.income).toBe(incomeAfterRent);
        expect(incomeAfterRent).toBe(-80);
    });

    it('blocks buying pots at premises capacity', () => {
        const setup = service.getRoundSetup();
        progress.potsBought = 6;
        setup.totalPots = progress.totalPots;

        const updated = service.buyPot(setup);

        expect(updated.info).toContain('cannot hold');
        expect(progress.totalPots).toBe(16);
    });

    it('repairs the salvaged large boat', () => {
        service.getRoundSetup();
        const large = boatOfSize(BoatSize.large);

        const error = service.repairBoat(large?.id ?? '');

        expect(error).toBeNull();
        expect(boatOfSize(BoatSize.large)?.damage).toBe(0);
        expect(progress.boatSpendings).toBe(50);
    });

    it('buys a premises and updates capacity', () => {
        service.getRoundSetup();
        progress.addToIncome(500);
        const offer = progress.premisesOffers[0];

        const error = service.buyPremises(offer.id);

        expect(error).toBeNull();
        expect(progress.premises.name).toBe(offer.name);
        expect(progress.premises.capacity).toBe(offer.capacity);
        expect(progress.premisesSpendings).toBe(offer.purchasePrice);
    });

    it('loads chosen boats and runs a day-one trip', () => {
        const setup = service.getRoundSetup();
        const small = boatOfSize(BoatSize.small);
        const medium = boatOfSize(BoatSize.medium);

        if (!small || !medium) {
            throw new Error('Starting boats missing');
        }

        service.setBoatGround(small.id, FishingGround.inshore);
        service.setBoatPots(small.id, 4);
        service.setBoatGround(medium.id, FishingGround.inshore);
        service.setBoatPots(medium.id, 6);

        expect(progress.potsInshore).toBe(10);

        const results = service.goLobstering(setup);

        expect(results.day).toBe(1);
        expect(results.lobstersCaught).toBe(20);
        expect(results.income).toBe(20);
        expect(results.potsLost).toBe(0);
        expect(results.boatDamage).toHaveLength(2);
        expect(results.boatDamage.every((boat) => boat.name.length > 0)).toBe(true);
        expect(progress.boats.every((boat) => boat.ground === null && boat.pots === 0)).toBe(true);
        expect(progress.totalLobstersCaught).toBe(20);
    });

    it('fills boats up to their capacity and the available pots', () => {
        service.getRoundSetup();
        const small = boatOfSize(BoatSize.small);
        const medium = boatOfSize(BoatSize.medium);

        if (!small || !medium) {
            throw new Error('Starting boats missing');
        }

        service.fillBoat(small.id);
        service.fillBoat(medium.id);

        expect(progress.potsInshore).toBe(10);
        expect(progress.boats.find((boat) => boat.id === small.id)?.pots).toBe(4);
        expect(progress.boats.find((boat) => boat.id === medium.id)?.pots).toBe(6);
    });

    it('clamps pots to the boat capacity and unassigned pots', () => {
        service.getRoundSetup();
        const small = boatOfSize(BoatSize.small);
        const medium = boatOfSize(BoatSize.medium);

        if (!small || !medium) {
            throw new Error('Starting boats missing');
        }

        service.setBoatPots(small.id, 999);
        service.setBoatPots(medium.id, 999);

        expect(progress.boats.find((boat) => boat.id === small.id)?.pots).toBe(4);
        expect(progress.boats.find((boat) => boat.id === medium.id)?.pots).toBe(6);
    });

    it('cannot send small boats offshore or use the salvaged large boat', () => {
        const setup = service.getRoundSetup();
        const small = boatOfSize(BoatSize.small);
        const large = boatOfSize(BoatSize.large);

        if (!small || !large) {
            throw new Error('Starting boats missing');
        }

        service.setBoatGround(small.id, FishingGround.offshore);
        service.setBoatGround(large.id, FishingGround.offshore);
        service.setBoatPots(large.id, 5);

        const results = service.goLobstering(setup);

        expect(progress.boats.find((boat) => boat.id === small.id)?.ground).toBeNull();
        expect(progress.boats.find((boat) => boat.id === large.id)?.pots).toBe(0);
        expect(results.lobstersCaught).toBe(0);
    });

    it('sends the repaired large boat offshore', () => {
        const setup = service.getRoundSetup();
        const large = boatOfSize(BoatSize.large);

        if (!large) {
            throw new Error('Starting large boat missing');
        }

        progress.addToIncome(500);
        service.repairBoat(large.id);
        service.setBoatGround(large.id, FishingGround.offshore);
        service.setBoatPots(large.id, 5);

        const results = service.goLobstering(setup);

        expect(results.lobstersCaught).toBe(10);
        expect(results.offshoreIncome).toBe(10);
        expect(results.inshoreIncome).toBe(0);
    });

    it('buys and sells boats from the market', () => {
        service.getRoundSetup();
        progress.addToIncome(1000);
        const offer = progress.boatOffers[0];

        expect(service.buyBoatOffer(offer.id)).toBeNull();
        expect(progress.boats).toHaveLength(4);
        expect(progress.boatOffers).toHaveLength(5);

        const sold = progress.boats[0];
        expect(service.sellBoat(sold.id)).toBeNull();
        expect(progress.boats).toHaveLength(3);
    });

    it('renames, fortifies and upgrades a boat', () => {
        service.getRoundSetup();
        progress.addToIncome(2000);
        const small = boatOfSize(BoatSize.small);

        if (!small) {
            throw new Error('Starting small boat missing');
        }

        expect(service.renameBoat(small.id, 'The Salty Test')).toBeNull();
        expect(progress.boats.find((boat) => boat.id === small.id)?.name).toBe('The Salty Test');

        expect(service.fortifyBoat(small.id)).toBeNull();
        expect(progress.boats.find((boat) => boat.id === small.id)?.strength).toBe(
            BoatStrength.sturdy
        );

        expect(service.upgradeBoatCapacity(small.id)).toBeNull();
        expect(progress.boats.find((boat) => boat.id === small.id)?.capacityBonus).toBe(1);
    });

    it('does not run the same day twice', () => {
        const setup = service.getRoundSetup();
        const small = boatOfSize(BoatSize.small);

        if (!small) {
            throw new Error('Starting small boat missing');
        }

        service.setBoatPots(small.id, 4);
        const first = service.goLobstering(setup);
        const second = service.goLobstering(setup);

        expect(second.day).toBe(first.day);
        expect(second.income).toBe(first.income);
        expect(progress.totalLobstersCaught).toBe(first.lobstersCaught);
    });
});
