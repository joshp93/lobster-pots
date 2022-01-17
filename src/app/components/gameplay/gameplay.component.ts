import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Results } from 'src/app/classes/results';
import { Setup } from 'src/app/classes/setup';
import { GameplayService } from 'src/app/services/gameplay.service';
import { ProgressService } from 'src/app/services/progress.service';

@Component({
  selector: 'app-gameplay',
  templateUrl: './gameplay.component.html',
  styleUrls: ['./gameplay.component.scss']
})
export class GameplayComponent implements OnInit {
  setup: Setup;
  results: Results = new Results();

  constructor(public gameplayService: GameplayService, public progressService: ProgressService) {
    if (progressService.setup === null) {
      this.setup = gameplayService.getRoundSetup();
    } else {
      this.setup = progressService.setup;
    }
  }

  ngOnInit(): void {
    
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
