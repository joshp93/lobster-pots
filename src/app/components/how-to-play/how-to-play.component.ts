import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { GAME_SETTINGS } from "../../settings/game-settings";

@Component({
  selector: 'app-how-to-play',
  templateUrl: './how-to-play.component.html',
  styleUrls: ['./how-to-play.component.scss']
})
export class HowToPlayComponent implements OnInit {
  showHowToPlay: boolean = false;
  gameSettings = GAME_SETTINGS;

  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
  }

}
