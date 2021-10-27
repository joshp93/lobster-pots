import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProgressService } from 'src/app/services/progress.service';
import { GAME_SETTINGS } from "../../settings/game-settings";

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {
  @Input() showHowToPlay: boolean = false;
  @Output() showHowToPlayEvent = new EventEmitter<void>();

  gameSettings = GAME_SETTINGS;

  constructor(public progressService: ProgressService) { }

  ngOnInit(): void {
  }

  toggleShowHowToPlay() {
    this.showHowToPlayEvent.emit();
  }

  endGame() {
    this.progressService.gameOver = true;
    this.progressService.gameOverReason = "Ye ended the game!";
    this.toggleShowHowToPlay();
  }

}
