import { Component, EventEmitter, Output } from '@angular/core';

import { performanceRating } from '../../../mechanics/performance/performance-rating';
import { ProgressService } from '../../../services/progress.service';

@Component({
    selector: 'app-game-over',
    templateUrl: './game-over.component.html',
    styleUrl: './game-over.component.scss'
})
export class GameOverComponent {
    @Output() startOverEvent = new EventEmitter<void>();

    constructor(public progressService: ProgressService) {}

    get performance() {
        return performanceRating(
            this.progressService.day,
            this.progressService.totalLobstersCaught,
            this.progressService.turnover
        );
    }

    startOver() {
        this.startOverEvent.emit();
    }
}
