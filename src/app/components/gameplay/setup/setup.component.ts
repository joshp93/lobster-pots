import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Setup } from '../../../classes/setup';
import { GameplayService } from '../../../services/gameplay.service';
import { ProgressService } from '../../../services/progress.service';

@Component({
  selector: 'app-setup',
  imports: [FormsModule],
  templateUrl: './setup.component.html',
  styleUrl: './setup.component.scss'
})
export class SetupComponent {
  @Input() setup: Setup = new Setup();

  constructor(public gameplayService: GameplayService, public progressService: ProgressService) { }

  buyPot() {
    this.setup = this.gameplayService.buyPot(this.setup);
  }

  sellPot() {
    this.gameplayService.sellPot(this.setup);
  }

  moveNext(onshore: HTMLInputElement, offshore: HTMLInputElement) {
    if (document.activeElement === onshore) {
      offshore.focus();
    } else {
      const button = document.getElementById("lobster");
      if (button) {
        button.focus();
      }
    }
  }

  checkMaximumOnshore = () => this.progressService.potsOnshore = this.progressService.potsOnshore > this.progressService.onshoreAvailablePots ? this.progressService.onshoreAvailablePots : this.progressService.potsOnshore;

  checkMaximumOffshore = () => this.progressService.potsOffshore = this.progressService.potsOffshore > this.progressService.offshoreAvailablePots ? this.progressService.offshoreAvailablePots : this.progressService.potsOffshore;
}
