import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProgressService } from 'src/app/services/progress.service';

@Component({
  selector: 'app-game-over',
  templateUrl: './game-over.component.html',
  styleUrls: ['./game-over.component.scss']
})
export class GameOverComponent implements OnInit {

  @Output() startOverEvent = new EventEmitter<void>();

  constructor(public progressService: ProgressService) { }

  ngOnInit(): void {
  }

  startOver() {
    this.startOverEvent.emit();
  }

}
