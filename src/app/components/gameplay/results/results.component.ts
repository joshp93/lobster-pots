import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Results } from '../../../classes/results';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss'
})
export class ResultsComponent {
  @Input() results: Results = new Results();
  @Output() nextDayEvent = new EventEmitter<void>();

  nextDay() {
    this.nextDayEvent.emit();
  }
}
