import { CoolSessionStorage } from '@angular-cool/storage';
import { Injectable } from '@angular/core';
import { Results } from '../classes/results';
import { Setup } from '../classes/setup';
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
    this.rentMultiplier = 1;
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
  addToIncome(value: number) {
    sessionStorage.setItem('income', (this.income + value).toString());
    if (value > 0) {
      this.turnover += value;
    }
  }
  get turnover(): number {
    return parseInt(sessionStorage.getItem('turnover') || '0');
  }
  set turnover(value: number) {
    sessionStorage.setItem('turnover', value.toString());
  }

  get potSpendings(): number {
    return parseInt(sessionStorage.getItem('potSpendings') || '0');
  }
  set potSpendings(value: number) {
    sessionStorage.setItem('potSpendings', value.toString());
    if (value < 0) {
      this.turnover += (value * -1);
    }
  }

  get netProfit(): number {
    return (this.openingCash + this.income) - this.potSpendings
  }

  get totalAvailablePots(): number {
    return this.totalPots - (this.potsOnshore + this.potsOffshore);
  }
  get onshoreAvailablePots(): number {
    return (this.totalPots - this.potsOffshore);
  }
  get offshoreAvailablePots(): number {
    return (this.totalPots - this.potsOnshore);
  }

  get totalPots(): number {
    return (this.openingPots + this.potsBought);
  }

  get day(): number {
    return parseInt(sessionStorage.getItem('day') || '0');
  }
  set day(value: number) {
    sessionStorage.setItem('day', value.toString());
  }

  get setup(): Setup | null {
    return this.coolSessionStorage.getObject('setup');
  }
  set setup(value: Setup | null) {
    this.coolSessionStorage.setObject('setup', value);
  }
  get totalLobstersCaught(): number {
    return parseInt(sessionStorage.getItem('totalLobstersCaught') || '0');
  }
  set totalLobstersCaught(value: number) {
    sessionStorage.setItem('totalLobstersCaught', value.toString());
  }

  get results(): Results | null {
    return this.coolSessionStorage.getObject('results');
  }
  set results(value: Results | null) {
    this.coolSessionStorage.setObject('results', value);
  }

  get gameOver(): boolean {
    return sessionStorage.getItem('gameOver') === 'true';
  }
  set gameOver(value: boolean) {
    sessionStorage.setItem('gameOver', value.toString());
  }

  get gameOverReason(): string {
    return sessionStorage.getItem('gameOverReason') || '';
  }
  set gameOverReason(value: string) {
    sessionStorage.setItem('gameOverReason', value.toString());
  }

  get rentMultiplier(): number {
    return parseInt(sessionStorage.getItem('rentMultiplier') || '0');
  }
  set rentMultiplier(value: number) {
    sessionStorage.setItem('rentMultiplier', value.toString());
  }

  get rentValue(): number {
    return GAME_SETTINGS.rentValue * this.rentMultiplier;
  }

}
