import { Component, OnInit } from '@angular/core';
import { RoundResults } from 'src/app/classes/round-results';
import { RoundSetup } from 'src/app/classes/round-setup';
import { GameplayService } from 'src/app/services/gameplay.service';
import { ProgressService } from 'src/app/services/progress.service';

@Component({
  selector: 'app-gameplay',
  templateUrl: './gameplay.component.html',
  styleUrls: ['./gameplay.component.scss']
})
export class GameplayComponent implements OnInit {
  roundSetup: RoundSetup;
  roundResults: RoundResults = new RoundResults();

  constructor(public gameplayService: GameplayService, public progressService: ProgressService) {
    if (progressService.roundSetup === null) {
      this.roundSetup = gameplayService.getRoundSetup();
    } else {
      this.roundSetup = progressService.roundSetup;
    }
  }

  ngOnInit(): void {
    
  }

  goLobstering() {
    this.roundResults = this.gameplayService.goLobstering(this.roundSetup);
  }

  nextDay() {
    this.progressService.day += 1;
    this.roundResults = new RoundResults();
    this.roundSetup = this.gameplayService.getRoundSetup();
  }

  startOver() {
    this.roundResults = new RoundResults();
    this.roundSetup = new RoundSetup();
    this.progressService.newGame();
    this.roundSetup = this.gameplayService.getRoundSetup();
  }
}
