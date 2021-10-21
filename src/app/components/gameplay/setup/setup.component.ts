import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Setup } from 'src/app/classes/setup';
import { GameplayService } from 'src/app/services/gameplay.service';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit {
  @Input() setup: Setup = new Setup();
  @Input() potsOnshore: string = "";
  @Input() potsOffshore: string = "";

  constructor(public gameplayService: GameplayService) { }

  ngOnInit(): void {
  }

  buyPot() {
    this.setup = this.gameplayService.buyPot(this.setup);
  }

}
