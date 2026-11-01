import { Component, EventEmitter, Output } from '@angular/core';

import { ProgressService } from '../../services/progress.service';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.scss'
})
export class ProgressComponent {
  @Output() showHowToPlayEvent = new EventEmitter<void>();

  constructor(public progressService: ProgressService) { }

  toggleShowHowToPlay() {
    this.showHowToPlayEvent.emit();
  }
}
