import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ProgressComponent } from './components/progress/progress.component';
import { GameplayComponent } from './components/gameplay/gameplay.component';
import { CoolStorageModule } from '@angular-cool/storage';
import { RulesComponent } from './components/rules/rules.component';
import { FormsModule } from '@angular/forms';
import { GameOverComponent } from './components/gameplay/game-over/game-over.component';
import { ResultsComponent } from './components/gameplay/results/results.component';
import { SetupComponent } from './components/gameplay/setup/setup.component';

@NgModule({
  declarations: [
    AppComponent,
    ProgressComponent,
    GameplayComponent,
    RulesComponent,
    GameOverComponent,
    ResultsComponent,
    SetupComponent
  ],
  imports: [
    BrowserModule,
    CoolStorageModule.forRoot(),
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
