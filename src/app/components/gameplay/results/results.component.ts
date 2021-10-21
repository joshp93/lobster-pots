import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Results } from 'src/app/classes/results';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  @Input() results: Results = new Results();
  @Output() nextDayEvent = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  nextDay() {
    this.nextDayEvent.emit();
  }

}
