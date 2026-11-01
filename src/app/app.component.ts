import { Component } from '@angular/core';

import { GameplayComponent } from './components/gameplay/gameplay.component';
import { ProgressComponent } from './components/progress/progress.component';
import { RulesComponent } from './components/rules/rules.component';

@Component({
  selector: 'app-root',
  imports: [GameplayComponent, ProgressComponent, RulesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  showHowToPlay: boolean = false;

  toggleShowHowToPlay() {
    this.showHowToPlay = !this.showHowToPlay;
  }
}
