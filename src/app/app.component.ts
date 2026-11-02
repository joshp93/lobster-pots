import { Component } from '@angular/core';

import { BoatyardComponent } from './components/boatyard/boatyard.component';
import { GameplayComponent } from './components/gameplay/gameplay.component';
import { PremisesComponent } from './components/premises/premises.component';
import { ProgressComponent } from './components/progress/progress.component';
import { RulesComponent } from './components/rules/rules.component';

@Component({
    selector: 'app-root',
    imports: [
        BoatyardComponent,
        GameplayComponent,
        PremisesComponent,
        ProgressComponent,
        RulesComponent
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    showHowToPlay: boolean = false;
    showPremises: boolean = false;
    showBoatyard: boolean = false;
    selectedBoatId: string | null = null;

    toggleShowHowToPlay() {
        this.showHowToPlay = !this.showHowToPlay;

        if (this.showHowToPlay) {
            this.showPremises = false;
            this.showBoatyard = false;
        }
    }

    toggleShowPremises() {
        this.showPremises = !this.showPremises;

        if (this.showPremises) {
            this.showHowToPlay = false;
            this.showBoatyard = false;
        }
    }

    toggleShowBoatyard(boatId: string | null = null) {
        if (this.showBoatyard && this.selectedBoatId === boatId) {
            this.showBoatyard = false;
            return;
        }

        this.selectedBoatId = boatId;
        this.showBoatyard = true;
        this.showHowToPlay = false;
        this.showPremises = false;
    }

    closeBoatyard() {
        this.showBoatyard = false;
    }
}
