import { Component, EventEmitter, Output } from '@angular/core';

import { ProgressService } from '../../../services/progress.service';

@Component({
  selector: 'app-game-over',
  templateUrl: './game-over.component.html',
  styleUrl: './game-over.component.scss'
})
export class GameOverComponent {
  @Output() startOverEvent = new EventEmitter<void>();

  constructor(public progressService: ProgressService) { }

  startOver() {
    this.startOverEvent.emit();
  }
}
