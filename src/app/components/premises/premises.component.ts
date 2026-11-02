import { Component, EventEmitter, Input, Output } from '@angular/core';

import type { PremisesOffer } from '../../classes/premises-offer';
import type { PremisesRarity } from '../../enums/premises-rarity';
import { hasFreeRepairs } from '../../mechanics/premises/has-free-repairs';
import { hasWreckRecovery } from '../../mechanics/premises/has-wreck-recovery';
import { premisesRarityLabel } from '../../mechanics/premises/premises-rarity-label';
import { reputationDescription } from '../../mechanics/premises/reputation-multiplier';
import { GameplayService } from '../../services/gameplay.service';
import { ProgressService } from '../../services/progress.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
    selector: 'app-premises',
    imports: [ModalComponent],
    templateUrl: './premises.component.html',
    styleUrl: './premises.component.scss'
})
export class PremisesComponent {
    @Input() show: boolean = false;
    @Output() showEvent = new EventEmitter<void>();

    message = '';

    constructor(
        public progressService: ProgressService,
        public gameplayService: GameplayService
    ) {}

    get offers(): PremisesOffer[] {
        return this.progressService.premisesOffers;
    }

    get reputationText(): string {
        return reputationDescription(this.progressService.premises.reputationMultiplier);
    }

    rarityLabel(rarity: PremisesRarity): string {
        return premisesRarityLabel(rarity);
    }

    reputationDescriptionFor(multiplier: number): string {
        return reputationDescription(multiplier);
    }

    get freeRepairs(): boolean {
        return hasFreeRepairs(this.progressService.premises.rarity);
    }

    get wreckRecovery(): boolean {
        return hasWreckRecovery(this.progressService.premises.rarity);
    }

    get refreshIn(): number {
        return this.progressService.setup?.offerRefreshIn ?? 0;
    }

    canAfford(offer: PremisesOffer): boolean {
        return this.progressService.netProfit >= offer.purchasePrice;
    }

    buy(offer: PremisesOffer) {
        const error = this.gameplayService.buyPremises(offer.id);
        this.message = error ?? `${offer.name} is yers!`;
    }

    close() {
        this.showEvent.emit();
    }
}
