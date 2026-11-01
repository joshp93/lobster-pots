import { Component } from '@angular/core';

import { Results } from '../../classes/results';
import { Setup } from '../../classes/setup';
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
  results: Results = new Results();

  constructor(public gameplayService: GameplayService, public progressService: ProgressService) {
    if (progressService.setup === null) {
      this.setup = gameplayService.getRoundSetup();
    } else {
      this.setup = progressService.setup;
    }
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
    this.setup = new Setup();
    this.progressService.newGame();
    this.setup = this.gameplayService.getRoundSetup();
  }
}
