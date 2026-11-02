import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Difficulty } from '../../enums/difficulty';
import { ProgressService } from '../../services/progress.service';
import { GAME_SETTINGS } from '../../settings/game-settings';
import { ModalComponent } from '../modal/modal.component';

@Component({
    selector: 'app-rules',
    imports: [ModalComponent],
    templateUrl: './rules.component.html',
    styleUrl: './rules.component.scss'
})
export class RulesComponent {
    @Input() showHowToPlay: boolean = false;
    @Output() showHowToPlayEvent = new EventEmitter<void>();

    gameSettings = GAME_SETTINGS;

    constructor(public progressService: ProgressService) {}

    toggleShowHowToPlay() {
        this.showHowToPlayEvent.emit();
    }

    endGame() {
        this.progressService.gameOver = true;
        this.progressService.gameOverReason = 'Ye ended the game!';
        this.toggleShowHowToPlay();
    }

    easyDifficulty() {
        this.progressService.difficulty = Difficulty.easy;
    }
    normalDifficulty() {
        this.progressService.difficulty = Difficulty.normal;
    }
    hardDifficulty() {
        this.progressService.difficulty = Difficulty.hard;
    }
    evilDifficulty() {
        this.progressService.difficulty = Difficulty.evil;
    }
}
