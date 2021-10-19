import { Injectable } from '@angular/core';
import { RoundResults } from '../classes/round-results';
import { RoundSetup } from '../classes/round-setup';
import { MarketConditions } from '../enums/market-conditions';
import { WeatherConditions } from '../enums/weather-conditions';
import { GAME_SETTINGS } from '../settings/game-settings';
import { ProgressService } from './progress.service';

@Injectable({
  providedIn: 'root'
})
export class GameplayService {

  constructor(private progressService: ProgressService) { }

  getRoundSetup(): RoundSetup {
    if (this.progressService.day === 1) {
      return this.dayOneRoundSetup();
    }

    let roundSetup = new RoundSetup();
    this.setBasicRoundSetup(roundSetup);
    this.setMarketConditions(roundSetup);
    return this.setRoundSetup(roundSetup);
  }

  private dayOneRoundSetup(): RoundSetup {
    let roundSetup = new RoundSetup();
    roundSetup.title = "Avast, Me Hearties!";
    roundSetup.info = "Welcome to lobster pots! Be ye savvy enough to survive the cutthroat life as a lobster catcher? There is but 1 rule... No prey no pay!";
    roundSetup.weatherConditions = WeatherConditions.perfect;
    roundSetup.weatherConditionsDescription = `The weather forecast is ${WeatherConditions[WeatherConditions.perfect]} today`;
    roundSetup.alert = false
    roundSetup.potPrice = GAME_SETTINGS.potPrice;
    roundSetup.onshorePrice = GAME_SETTINGS.onshorePrice;
    roundSetup.offshorePrice = GAME_SETTINGS.offshorePrice;
    roundSetup.marketConditions = MarketConditions.normal;
    roundSetup.marketConditionsDescription = `The lobster market is ${MarketConditions[MarketConditions.normal]} today. Here are the prices:`;
    roundSetup.goodWeatherMax = GAME_SETTINGS.goodWeatherMax;
    roundSetup.catchChanceMax = GAME_SETTINGS.catchChanceMax;
    
    return this.setRoundSetup(roundSetup);
  }

  private setRoundSetup(roundSetup: RoundSetup): RoundSetup {
    this.progressService.roundSetup = roundSetup;
    return roundSetup;
  }

  private setBasicRoundSetup(roundSetup: RoundSetup) {
    roundSetup.potPrice = GAME_SETTINGS.potPrice;
    roundSetup.onshorePrice = GAME_SETTINGS.onshorePrice;
    roundSetup.offshorePrice = GAME_SETTINGS.offshorePrice;
    roundSetup.alert = false;
    roundSetup.weatherConditions = this.getRandomFromEnum(WeatherConditions);
    roundSetup.weatherConditionsDescription = `The weather forecast is ${WeatherConditions[roundSetup.weatherConditions]} today Here are the prices:`;
    roundSetup.marketConditions = this.getRandomFromEnum(MarketConditions);
    roundSetup.marketConditionsDescription = `The lobster market is ${MarketConditions[MarketConditions.normal]} today. Here are the prices:`;
    roundSetup.goodWeatherMax = (GAME_SETTINGS.goodWeatherMax - (roundSetup.weatherConditions + 1));
    roundSetup.catchChanceMax = GAME_SETTINGS.catchChanceMax;
  }

  private setMarketConditions(roundSetup: RoundSetup) {
    if (roundSetup.marketConditions === MarketConditions.lobsterShortage) {
      roundSetup.alert = true;
      roundSetup.potPrice *= 2;
      roundSetup.onshorePrice *= 2;
      roundSetup.offshorePrice *= 2;
      roundSetup.catchChanceMax = 50;
      roundSetup.marketConditionsDescription = "Avast! There be a lobster shortage today! All prices be doubled, but beware, lobsters be harder to catch:";
    } else if (roundSetup.marketConditions === MarketConditions.lobsterSurplus) {
      roundSetup.alert = true;
      roundSetup.potPrice *= 2;
      roundSetup.onshorePrice *= 2;
      roundSetup.offshorePrice *= 2;
      roundSetup.catchChanceMax = 90;
      roundSetup.marketConditionsDescription = "HeyHo! There be a great multitude of lobsters in the sea today! They be much easier to catch! but... the prices are lower too:";
    }
    else if (roundSetup.marketConditions === MarketConditions.lowDemand) {
      roundSetup.alert = true;
      roundSetup.potPrice /= 2;
      roundSetup.onshorePrice /= 2;
      roundSetup.offshorePrice /= 2;
      roundSetup.marketConditionsDescription = "Ahoy! There is a drop in demand for lobster! Everything is half price, including the price for lobsters:";
    } else if (roundSetup.marketConditions === MarketConditions.highDemand) {
      roundSetup.alert = true;
      roundSetup.potPrice *= 2;
      roundSetup.onshorePrice *= 2;
      roundSetup.offshorePrice *= 2;
      roundSetup.marketConditionsDescription = "Yahar! There be high demand for lobster! All prices be doubled:";
    }
  }

  private getRandomFromEnum(enumName: any): number {
    return Math.floor(Math.random() * this.enumElementCount(enumName)) + 1;
  }

  private enumElementCount(enumName: any): number {
    let count = 0
    for (let item in enumName) {
      if (isNaN(Number(item))) count++;
    }
    return count
  }

  buyPot(roundSetup: RoundSetup) {
    if (this.progressService.netProfit < roundSetup.potPrice) {
      alert("You don't have enough doubloons!");
      return;
    }
    this.progressService.potsBought += 1;
    this.progressService.potSpendings += roundSetup.potPrice;
  }

  placeOnshore() {
    if (this.progressService.totalPots < 1) {
      alert("You don't have enough pots!");
      return;
    }
    this.progressService.potsOnshore += 1;
  }

  placeOffshore() {
    if (this.progressService.totalPots < 1) {
      alert("You don't have enough pots!");
      return;
    }
    this.progressService.potsOffshore += 1;
  }

  goLobstering(roundSetup: RoundSetup): RoundResults {
    let roundResults = new RoundResults();
    roundResults.weatherConditions = this.generateWeatherConditions(roundSetup);
    for (let i = 1; i < (this.progressService.potsOnshore); i++) {
      if (this.generateCatchResult(roundSetup)) {
        this.progressService.totalLobstersCaught += 1;
      }
    }
    if (roundResults.weatherConditions !== WeatherConditions.stormy) {
      for (let i = 1; i < (this.progressService.potsOffshore); i++) {
        if (this.generateCatchResult(roundSetup)) {
          this.progressService.totalLobstersCaught += 1;
        }
      }
    } else {
      this.progressService.potsBought -= this.progressService.potsOffshore;
      roundResults.potsLost = this.progressService.potsOffshore;
    }

    return roundResults;
  }

  private generateWeatherConditions(roundSetup: RoundSetup): WeatherConditions {
    const weatherChance = Math.floor(Math.random() * 100) + 1;
    if (weatherChance > roundSetup.goodWeatherMax) {
      return WeatherConditions.stormy;
    } else {
      return roundSetup.weatherConditions;
    }
  }

  private generateCatchResult(roundSetup: RoundSetup): boolean {
    let catchChance = Math.floor(Math.random() * 100) + 1;
    const caught = (catchChance < roundSetup.catchChanceMax);
    return caught;
  }
}