import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ProgressComponent } from './components/progress/progress.component';
import { GameplayComponent } from './components/gameplay/gameplay.component';
import { CoolStorageModule } from '@angular-cool/storage';
import { HowToPlayComponent } from './components/how-to-play/how-to-play.component';

@NgModule({
  declarations: [
    AppComponent,
    ProgressComponent,
    GameplayComponent,
    HowToPlayComponent
  ],
  imports: [
    BrowserModule,
    CoolStorageModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
