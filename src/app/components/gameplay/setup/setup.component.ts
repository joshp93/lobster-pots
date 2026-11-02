import { Component, Input } from '@angular/core';

import type { Boat } from '../../../classes/boat';
import { Setup } from '../../../classes/setup';
import { BoatSize } from '../../../enums/boat-size';
import { FishingGround } from '../../../enums/fishing-ground';
import { boatCapacity } from '../../../mechanics/boats/boat-capacity';
import { boatSizeLabel } from '../../../mechanics/boats/boat-size-label';
import { hasFreeRepairs } from '../../../mechanics/premises/has-free-repairs';
import { hasWreckRecovery } from '../../../mechanics/premises/has-wreck-recovery';
import { reputationDescription } from '../../../mechanics/premises/reputation-multiplier';
import { GameplayService } from '../../../services/gameplay.service';
import { ProgressService } from '../../../services/progress.service';

@Component({
    selector: 'app-setup',
    templateUrl: './setup.component.html',
    styleUrl: './setup.component.scss'
})
export class SetupComponent {
    @Input() setup: Setup = new Setup();

    readonly inshore = FishingGround.inshore;
    readonly offshore = FishingGround.offshore;
    readonly largeBoat = BoatSize.large;

    constructor(
        public gameplayService: GameplayService,
        public progressService: ProgressService
    ) {}

    get demandMultiplierText(): string {
        return this.setup.demandMultiplier.toFixed(2);
    }

    get rentDueText(): string {
        return this.setup.rentDueIn === 0
            ? 'due today'
            : `due in ${this.setup.rentDueIn} day${this.setup.rentDueIn === 1 ? '' : 's'}`;
    }

    get premisesName(): string {
        return this.progressService.premises.name;
    }

    get reputationText(): string {
        return reputationDescription(this.progressService.premises.reputationMultiplier);
    }

    get freeRepairs(): boolean {
        return hasFreeRepairs(this.progressService.premises.rarity);
    }

    get wreckRecovery(): boolean {
        return hasWreckRecovery(this.progressService.premises.rarity);
    }

    get usableBoats(): Boat[] {
        return this.progressService.boats.filter((boat) => boat.damage < 100);
    }

    get assignedPots(): number {
        return this.progressService.potsInshore + this.progressService.potsOffshore;
    }

    get remainingPots(): number {
        return Math.max(0, this.progressService.totalPots - this.assignedPots);
    }

    boatCapacity(boat: Boat): number {
        return boatCapacity(boat);
    }

    boatSize(boat: Boat): string {
        return boatSizeLabel(boat.size);
    }

    setGround(boat: Boat, ground: FishingGround | null) {
        this.gameplayService.setBoatGround(boat.id, ground);
    }

    setPots(boat: Boat, event: Event) {
        const value = Number((event.target as HTMLInputElement).value);
        this.gameplayService.setBoatPots(boat.id, value);
    }

    fillBoat(boat: Boat) {
        this.gameplayService.fillBoat(boat.id);
    }

    dockBoat(boat: Boat) {
        this.gameplayService.dockBoat(boat.id);
    }
}
