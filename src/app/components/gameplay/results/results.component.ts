import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Results } from '../../../classes/results';
import type { BoatSize } from '../../../enums/boat-size';
import { boatSizeLabel } from '../../../mechanics/boats/boat-size-label';
import { capitalize } from '../../../mechanics/format/capitalize';

@Component({
    selector: 'app-results',
    templateUrl: './results.component.html',
    styleUrl: './results.component.scss'
})
export class ResultsComponent {
    @Input() results: Results = new Results();
    @Output() nextDayEvent = new EventEmitter<void>();

    get hasBoatDamage(): boolean {
        return this.results.boatDamage.length > 0;
    }

    get hasBoatLosses(): boolean {
        return this.results.boatLosses.length > 0;
    }

    get hasCatches(): boolean {
        return this.results.catches.length > 0;
    }

    boatSize(size: BoatSize): string {
        return boatSizeLabel(size);
    }

    label(value: string): string {
        return capitalize(value);
    }

    nextDay() {
        this.nextDayEvent.emit();
    }
}
