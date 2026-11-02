import { Component, EventEmitter, Input, Output } from '@angular/core';

import type { Boat } from '../../classes/boat';
import type { BoatOffer } from '../../classes/boat-offer';
import type { BoatSize } from '../../enums/boat-size';
import { boatCapacity, capacityForSize } from '../../mechanics/boats/boat-capacity';
import { boatResale } from '../../mechanics/boats/boat-resale';
import { boatSizeLabel } from '../../mechanics/boats/boat-size-label';
import { boatStrengthIndex, boatStrengthProfile } from '../../mechanics/boats/boat-strength';
import { capacityUpgradeCost } from '../../mechanics/boats/capacity-upgrade-cost';
import { fortifyCost } from '../../mechanics/boats/fortify-cost';
import { repairCost } from '../../mechanics/boats/repair-cost';
import { hasFreeRepairs } from '../../mechanics/premises/has-free-repairs';
import { hasWreckRecovery } from '../../mechanics/premises/has-wreck-recovery';
import { GameplayService } from '../../services/gameplay.service';
import { ProgressService } from '../../services/progress.service';
import { BOAT_STRENGTHS } from '../../settings/boat-settings';
import { ModalComponent } from '../modal/modal.component';

@Component({
    selector: 'app-boatyard',
    imports: [ModalComponent],
    templateUrl: './boatyard.component.html',
    styleUrl: './boatyard.component.scss'
})
export class BoatyardComponent {
    @Input() show: boolean = false;
    @Input() boatId: string | null = null;
    @Output() showEvent = new EventEmitter<void>();

    message = '';

    constructor(
        public progressService: ProgressService,
        public gameplayService: GameplayService
    ) {}

    get selectedBoat(): Boat | undefined {
        return this.progressService.boats.find((boat) => boat.id === this.boatId);
    }

    get offers(): BoatOffer[] {
        return this.progressService.boatOffers;
    }

    get freeRepairs(): boolean {
        return hasFreeRepairs(this.progressService.premises.rarity);
    }

    get wreckRecovery(): boolean {
        return hasWreckRecovery(this.progressService.premises.rarity);
    }

    get refreshIn(): number {
        return this.progressService.setup?.boatOfferRefreshIn ?? 0;
    }

    boatCapacity(boat: Boat): number {
        return boatCapacity(boat);
    }

    sizeLabel(size: BoatSize): string {
        return boatSizeLabel(size);
    }

    offerCapacity(offer: BoatOffer): number {
        return capacityForSize(offer.size, offer.capacityBonus);
    }

    strengthLabel(boat: Boat): string {
        return boatStrengthProfile(boat.strength).label;
    }

    strengthForOffer(offer: BoatOffer): string {
        return boatStrengthProfile(offer.strength).label;
    }

    nextStrengthLabel(boat: Boat): string {
        if (fortifyCost(boat.size, boat.strength) === null) {
            return 'Maximum strength';
        }

        return BOAT_STRENGTHS[boatStrengthIndex(boat.strength) + 1].label;
    }

    repairCostFor(boat: Boat): number {
        return repairCost(boat.size, boat.damage, this.freeRepairs);
    }

    resaleFor(boat: Boat): number {
        return boatResale(boat);
    }

    fortifyCostFor(boat: Boat): number | null {
        return fortifyCost(boat.size, boat.strength);
    }

    upgradeCostFor(boat: Boat): number | null {
        return capacityUpgradeCost(boat.size, boat.capacityBonus);
    }

    canAfford(amount: number | null): boolean {
        return amount !== null && this.progressService.netProfit >= amount;
    }

    canAffordOffer(offer: BoatOffer): boolean {
        return this.progressService.netProfit >= offer.price;
    }

    repair(boat: Boat) {
        const error = this.gameplayService.repairBoat(boat.id);
        this.message = error ?? `${boat.name} repaired.`;
    }

    sell(boat: Boat) {
        const error = this.gameplayService.sellBoat(boat.id);
        this.message = error ?? `${boat.name} sold.`;
    }

    rename(boat: Boat, name: string) {
        const error = this.gameplayService.renameBoat(boat.id, name);
        this.message = error ?? `She is now called ${name.trim()}.`;
    }

    fortify(boat: Boat) {
        const error = this.gameplayService.fortifyBoat(boat.id);
        this.message = error ?? `${boat.name} fortified.`;
    }

    upgradeCapacity(boat: Boat) {
        const error = this.gameplayService.upgradeBoatCapacity(boat.id);
        this.message = error ?? `${boat.name} can carry more pots.`;
    }

    buyOffer(offer: BoatOffer) {
        const error = this.gameplayService.buyBoatOffer(offer.id);
        this.message = error ?? `${offer.name} joins yer fleet.`;
    }

    close() {
        this.showEvent.emit();
    }
}
