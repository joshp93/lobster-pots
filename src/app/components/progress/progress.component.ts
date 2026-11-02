import { Component, EventEmitter, Output } from '@angular/core';

import type { Boat } from '../../classes/boat';
import { boatCapacity } from '../../mechanics/boats/boat-capacity';
import { boatSizeLabel } from '../../mechanics/boats/boat-size-label';
import { boatStrengthProfile } from '../../mechanics/boats/boat-strength';
import { demandLabel } from '../../mechanics/demand/demand-label';
import { capitalize } from '../../mechanics/format/capitalize';
import { rentDueIn } from '../../mechanics/rent/rent-due-in';
import { seasonForDay } from '../../mechanics/season/season-for-day';
import { GameplayService } from '../../services/gameplay.service';
import { ProgressService } from '../../services/progress.service';
import { GAME_SETTINGS } from '../../settings/game-settings';

@Component({
    selector: 'app-progress',
    templateUrl: './progress.component.html',
    styleUrl: './progress.component.scss'
})
export class ProgressComponent {
    @Output() showHowToPlayEvent = new EventEmitter<void>();
    @Output() showPremisesEvent = new EventEmitter<void>();
    @Output() showBoatyardEvent = new EventEmitter<string | null>();

    potMessage = '';

    constructor(
        public progressService: ProgressService,
        public gameplayService: GameplayService
    ) {}

    get seasonLabel(): string {
        const season = seasonForDay(this.progressService.day, GAME_SETTINGS.seasonLengthDays);
        return season.charAt(0).toUpperCase() + season.slice(1);
    }

    get demand(): number {
        return this.progressService.setup?.demand ?? this.progressService.demand;
    }

    get demandLabel(): string {
        return demandLabel(this.demand);
    }

    get rentDueIn(): number {
        return rentDueIn(this.progressService.day, GAME_SETTINGS.rentIntervalDays);
    }

    get rentDueLabel(): string {
        return this.rentDueIn === 0 ? 'Rent due today' : `Rent due in ${this.rentDueIn}d`;
    }

    get premisesName(): string {
        return this.progressService.premises.name;
    }

    get boats(): Boat[] {
        return this.progressService.boats;
    }

    get potPrice(): number {
        return this.progressService.setup?.potPrice ?? GAME_SETTINGS.potPrice;
    }

    get canBuyPot(): boolean {
        return this.progressService.totalPots < this.progressService.capacity;
    }

    get canSellPot(): boolean {
        return this.progressService.totalAvailablePots > 0;
    }

    boatCapacity(boat: Boat): number {
        return boatCapacity(boat);
    }

    boatSize(boat: Boat): string {
        return boatSizeLabel(boat.size);
    }

    groundLabel(boat: Boat): string {
        return boat.ground ? capitalize(boat.ground) : 'Docked';
    }

    strengthLabel(boat: Boat): string {
        return boatStrengthProfile(boat.strength).label;
    }

    toggleShowHowToPlay() {
        this.showHowToPlayEvent.emit();
    }

    togglePremises() {
        this.showPremisesEvent.emit();
    }

    openBoatyard(boatId: string) {
        this.showBoatyardEvent.emit(boatId);
    }

    openBoatMarket() {
        this.showBoatyardEvent.emit(null);
    }

    buyPot() {
        const setup = this.progressService.setup;

        if (!setup) {
            return;
        }

        this.potMessage = this.gameplayService.buyPot(setup).info;
    }

    sellPot() {
        const setup = this.progressService.setup;

        if (!setup) {
            return;
        }

        this.gameplayService.sellPot(setup);
        this.potMessage = this.progressService.setup?.info ?? '';
    }
}
