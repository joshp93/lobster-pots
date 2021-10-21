import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GAME_SETTINGS } from "../../settings/game-settings";

@Component({
  selector: 'app-how-to-play',
  templateUrl: './how-to-play.component.html',
  styleUrls: ['./how-to-play.component.scss']
})
export class HowToPlayComponent implements OnInit {
  @Input() showHowToPlay: boolean = false;
  @Output() showHowToPlayEvent = new EventEmitter<void>();

  gameSettings = GAME_SETTINGS;

  constructor() { }

  ngOnInit(): void {
  }

  toggleShowHowToPlay() {
    this.showHowToPlayEvent.emit();
  }

}
