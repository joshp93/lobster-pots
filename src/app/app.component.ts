import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  showHowToPlay: boolean = false;

  toggleShowHowToPlay() {
    this.showHowToPlay = !this.showHowToPlay;
  }
}
