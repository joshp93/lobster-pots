import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProgressService } from 'src/app/services/progress.service';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit {
  @Output() showHowToPlayEvent = new EventEmitter<void>();

  constructor(public progressService: ProgressService) { }

  ngOnInit(): void {
  }

  toggleShowHowToPlay() {
    this.showHowToPlayEvent.emit();
  }

}
