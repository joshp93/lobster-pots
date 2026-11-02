import { Component } from '@angular/core';

import { Results } from '../../classes/results';
import type { Setup } from '../../classes/setup';
import { GameplayService } from '../../services/gameplay.service';
import { ProgressService } from '../../services/progress.service';
import { GameOverComponent } from './game-over/game-over.component';
import { ResultsComponent } from './results/results.component';
import { SetupComponent } from './setup/setup.component';

@Component({
    selector: 'app-gameplay',
    imports: [GameOverComponent, ResultsComponent, SetupComponent],
    templateUrl: './gameplay.component.html',
    styleUrl: './gameplay.component.scss'
})
export class GameplayComponent {
    setup: Setup;
    results: Results;

    constructor(
        public gameplayService: GameplayService,
        public progressService: ProgressService
    ) {
        this.setup = gameplayService.getRoundSetup();
        this.results = progressService.results ?? new Results();
    }

    goLobstering() {
        this.results = this.gameplayService.goLobstering(this.setup);
    }

    nextDay() {
        this.progressService.day += 1;
        this.results = new Results();
        this.setup = this.gameplayService.getRoundSetup();
    }

    startOver() {
        this.results = new Results();
        this.progressService.newGame();
        this.setup = this.gameplayService.getRoundSetup();
    }
}
