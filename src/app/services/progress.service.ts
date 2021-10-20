import { CoolSessionStorage } from '@angular-cool/storage';
import { Injectable } from '@angular/core';
import { RoundResults } from '../classes/round-results';
import { RoundSetup } from '../classes/round-setup';
import { GAME_SETTINGS } from '../settings/game-settings';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {

  constructor(private coolSessionStorage: CoolSessionStorage) { 
    if (!sessionStorage.getItem('day')) {
      this.newGame();
    }
  }
  
  newGame() {
    sessionStorage.clear();
    this.openingCash = GAME_SETTINGS.openingCash;
    this.openingPots = GAME_SETTINGS.openingPots;
    this.day = GAME_SETTINGS.startDay;
  }

  get openingCash(): number {
    return parseInt(sessionStorage.getItem('openingCash') || '0');
  }
  set openingCash(value: number) {
    sessionStorage.setItem('openingCash', value.toString());
  }

  get openingPots(): number {
    return parseInt(sessionStorage.getItem('openingPots') || '0');
  }
  set openingPots(value: number) {
    sessionStorage.setItem('openingPots', value.toString());
  }

  get potsBought(): number {
    return parseInt(sessionStorage.getItem('potsBought') || '0');
  }
  set potsBought(value: number) {
    sessionStorage.setItem('potsBought', value.toString());
  }

  get potsOnshore(): number {
    return parseInt(sessionStorage.getItem('potsOnshore') || '0');
  }
  set potsOnshore(value: number) {
    sessionStorage.setItem('potsOnshore', value.toString());
  }

  get potsOffshore(): number {
    return parseInt(sessionStorage.getItem('potsOffshore') || '0');
  }
  set potsOffshore(value: number) {
    sessionStorage.setItem('potsOffshore', value.toString());
  }

  get income(): number {
    return parseInt(sessionStorage.getItem('income') || '0');
  }
  set income(value: number) {
    sessionStorage.setItem('income', value.toString());
  }

  get potSpendings(): number {
    return parseInt(sessionStorage.getItem('potSpendings') || '0');
  }
  set potSpendings(value: number) {
    sessionStorage.setItem('potSpendings', value.toString());
  }

  get netProfit(): number {
    return (this.openingCash + this.income) - this.potSpendings
  }

  get totalPots(): number {
    return (this.openingPots + this.potsBought) - (this.potsOnshore + this.potsOffshore);
  }

  get day(): number {
    return parseInt(sessionStorage.getItem('day') || '0');
  }
  set day(value: number) {
    sessionStorage.setItem('day', value.toString());
  }

  get roundSetup(): RoundSetup | null {
    return this.coolSessionStorage.getObject('roundSetup');
  }
  set roundSetup(value: RoundSetup | null) {
    this.coolSessionStorage.setObject('roundSetup', value);
  }
  get totalLobstersCaught(): number {
    return parseInt(sessionStorage.getItem('totalLobstersCaught') || '0');
  }
  set totalLobstersCaught(value: number) {
    sessionStorage.setItem('totalLobstersCaught', value.toString());
  }

  get roundResults(): RoundResults | null {
    return this.coolSessionStorage.getObject('roundResults');
  }
  set roundResults(value: RoundResults | null) {
    this.coolSessionStorage.setObject('roundResults', value);
  }

  get gameOver(): boolean {
    return sessionStorage.getItem('gameOver') === 'true';
  }
  set gameOver(value: boolean) {
    sessionStorage.setItem('gameOver', value.toString());
  }
}