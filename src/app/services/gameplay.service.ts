import { Injectable } from '@angular/core';
import { Results } from '../classes/results';
import { Setup } from '../classes/setup';
import { MarketConditions } from '../enums/market-conditions';
import { WeatherConditions } from '../enums/weather-conditions';
import { GAME_SETTINGS } from '../settings/game-settings';
import { ProgressService } from './progress.service';

@Injectable({
  providedIn: 'root'
})
export class GameplayService {

  constructor(private progressService: ProgressService) { }

  clearPreviousSetup() {
    this.progressService.results = null;
    this.progressService.setup = null;
  }

  getRoundSetup(): Setup {
    this.clearPreviousSetup();
    if (this.progressService.day === 1) {
      return this.dayOneRoundSetup();
    }

    let setup = new Setup();
    setup.rentDue = (this.progressService.day % GAME_SETTINGS.rentInterval === 0);
    setup.rentDueTomorrow = ((this.progressService.day + 1) % GAME_SETTINGS.rentInterval === 0);
    setup.rentWarning = setup.rentDueTomorrow && (this.progressService.netProfit < this.progressService.rentValue);
    setup.rentValue = this.progressService.rentValue;
    this.setBasicRoundSetup(setup);
    this.progressService.gameOver = this.checkGameOver(setup);
    if (this.progressService.gameOver) {
      return this.setRoundSetup(setup);
    }
    if (setup.rentDue) {
      this.progressService.addToIncome(-this.progressService.rentValue);
    }
    this.setMarketConditions(setup);
    return this.setRoundSetup(setup);
  }

  private checkGameOver(setup: Setup): boolean {
    if (setup.rentDue) {
      if (this.progressService.netProfit < this.progressService.rentValue) {
        this.progressService.gameOverReason = "Ye couldn't pay the rent!";
        return true;
      }
    }
    if ((this.progressService.netProfit < setup.potPrice) && this.progressService.totalPots < 1) {
      this.progressService.gameOverReason = "Ye have no more pots and ye can't afford to buy them!";
      return true;
    }
    return false;
  }

  private dayOneRoundSetup(): Setup {
    let setup = new Setup();
    setup.title = "Avast, Me Hearties!";
    setup.info = "Welcome to lobster pots! Be ye savvy enough to survive the cutthroat life as a lobster catcher? There is but 1 rule... No prey no pay!";
    setup.weatherConditions = WeatherConditions.perfect;
    setup.goodWeatherMax = GAME_SETTINGS.goodWeatherMax;
    setup.weatherAlert = false;
    setup.positiveWeatherAlert = true;
    setup.weatherConditionsDescription = `The weather forecast looks ${WeatherConditions[WeatherConditions.perfect]} today! A good day to start. There is only a ${GAME_SETTINGS.randomNumberMax - setup.goodWeatherMax}% chance of a storm.`;
    setup.marketAlert = false
    setup.potPrice = GAME_SETTINGS.potPrice;
    setup.onshorePrice = GAME_SETTINGS.onshorePrice;
    setup.offshorePrice = GAME_SETTINGS.offshorePrice;
    setup.marketConditions = MarketConditions.normal;
    setup.marketConditionsDescription = `The lobster market is ${MarketConditions[MarketConditions.normal]} today. Here are the prices:`;
    setup.catchChanceMax = GAME_SETTINGS.catchChanceMax;

    return this.setRoundSetup(setup);
  }

  private setRoundSetup(setup: Setup): Setup {
    this.progressService.setup = setup;
    return setup;
  }

  private setBasicRoundSetup(setup: Setup) {
    setup.potPrice = GAME_SETTINGS.potPrice;
    setup.onshorePrice = GAME_SETTINGS.onshorePrice;
    setup.offshorePrice = GAME_SETTINGS.offshorePrice;
    setup.marketAlert = false;
    setup.weatherConditions = this.getRandomFromEnum(WeatherConditions);
    setup.positiveWeatherAlert = (setup.weatherConditions === WeatherConditions.perfect);
    setup.goodWeatherMax = (GAME_SETTINGS.goodWeatherMax - (setup.weatherConditions * 10));
    setup.weatherConditionsDescription = `The weather forecast looks ${WeatherConditions[setup.weatherConditions]} today. There is a ${GAME_SETTINGS.randomNumberMax - setup.goodWeatherMax}% chance of a storm:`;
    setup.weatherAlert = (setup.goodWeatherMax < 60);
    setup.marketConditions = this.getRandomFromEnum(MarketConditions);
    setup.marketConditionsDescription = `The lobster market is ${MarketConditions[MarketConditions.normal]} today.`;
    setup.catchChanceMax = GAME_SETTINGS.catchChanceMax;
    setup.title = "Another Day, Another Lobster!"
  }

  private setMarketConditions(setup: Setup) {
    if (setup.marketConditions === MarketConditions.lobsterShortage) {
      setup.marketAlert = true;
      setup.potPrice *= 2;
      setup.onshorePrice *= 2;
      setup.offshorePrice *= 2;
      setup.catchChanceMax = 50;
      setup.marketConditionsDescription = "Avast! There be a lobster shortage today! All prices be doubled, but beware, lobsters be harder to catch.";
    } else if (setup.marketConditions === MarketConditions.lobsterSurplus) {
      setup.positiveMarketAlert = true;
      setup.potPrice /= 2;
      setup.onshorePrice /= 2;
      setup.offshorePrice /= 2;
      setup.catchChanceMax = 90;
      setup.marketConditionsDescription = "Blow me down! There be a great multitude of lobsters in the sea today! They be much easier to catch! but... the prices are lower too.";
    }
    else if (setup.marketConditions === MarketConditions.lowDemand) {
      setup.marketAlert = true;
      setup.potPrice /= 2;
      setup.onshorePrice /= 2;
      setup.offshorePrice /= 2;
      setup.marketConditionsDescription = "Blimey! There be a drop in demand for lobster! Everything is half price... including the lobsters.";
    } else if (setup.marketConditions === MarketConditions.highDemand) {
      setup.positiveMarketAlert = true;
      setup.potPrice *= 2;
      setup.onshorePrice *= 2;
      setup.offshorePrice *= 2;
      setup.marketConditionsDescription = "Yaar! There be high demand for lobster! All prices be doubled.";
    }
    setup.marketConditionsDescription += ` There be reports that lobsters are getting caught about ${setup.catchChanceMax}% of the time:`
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

  buyPot(setup: Setup): Setup {
    if (this.progressService.netProfit < setup.potPrice) {
      alert("Ye don't have enough 💰");
      return setup;
    }
    this.progressService.potsBought += 1;
    this.progressService.potSpendings += setup.potPrice;
    if (this.progressService.totalPots % GAME_SETTINGS.rentIncreaseInterval === 0) {
      const newRentMultiplier = (this.progressService.totalPots / GAME_SETTINGS.rentIncreaseInterval) + 1;
      if (this.progressService.rentMultiplier < newRentMultiplier) {
        this.progressService.rentMultiplier = newRentMultiplier;
        setup.info = `Avast matey! with the purchase of your ${this.progressService.totalPots}th pot, you had to move to a bigger premises. Your rent is now ${this.progressService.rentValue}💰!`;
        if (setup.rentValue > 0) {
          setup.rentValue = this.progressService.rentValue;
        }
        this.progressService.setup = setup;
      }
    }
    return setup;
  }

  sellPot(setup: Setup) {
    if (this.progressService.totalAvailablePots < 1) {
      return;
    }
    this.progressService.potsBought -= 1;
    this.progressService.potSpendings -= (setup.potPrice / 2);
  }

  placeOnshore(noOfPots: string): string {
    const count = parseInt(noOfPots) || 0;
    if (count < 1) {
      this.progressService.potsOnshore = 0;
    } else if (count > this.progressService.onshoreAvailablePots) {
      this.progressService.potsOnshore = this.progressService.onshoreAvailablePots;
    } else {
      this.progressService.potsOnshore = count;
    }
    return this.progressService.potsOnshore.toString();
  }

  placeOffshore(noOfPots: string): string {
    const count = parseInt(noOfPots) || 0;
    if (count < 1) {
      this.progressService.potsOffshore = 0;
    } else if (count > this.progressService.offshoreAvailablePots) {
      this.progressService.potsOffshore = this.progressService.offshoreAvailablePots;
    } else {
      this.progressService.potsOffshore = count;
    }
    return this.progressService.potsOffshore.toString();
  }

  goLobstering(setup: Setup): Results {
    let results = new Results();
    this.generateWeatherConditions(setup, results);
    for (let i = 0; i < (this.progressService.potsOnshore); i++) {
      if (this.generateCatchResult(setup)) {
        this.catchLobster(results, setup.onshorePrice);
      }
    }
    if (results.weatherConditions !== WeatherConditions.evil) {
      for (let i = 0; i < (this.progressService.potsOffshore); i++) {
        if (this.generateCatchResult(setup)) {
          this.catchLobster(results, setup.offshorePrice);
        }
      }
    } else {
      this.progressService.potsBought -= this.progressService.potsOffshore;
      results.potsLost = this.progressService.potsOffshore;
    }

    if (this.progressService.potsOnshore > 0 || this.progressService.potsOffshore > 0) {
      if (results.lobstersCaught > 0) {
        results.title = "Success!";
        results.success = true;
      } else {
        results.title = "Unlucky!";
        results.success = false;
      }
    } else {
      results.title = "Ye sat this one out! Ye landlubber!!"
    }

    this.progressService.results = results;
    this.progressService.potsOnshore = 0;
    this.progressService.potsOffshore = 0;
    return results;
  }

  private catchLobster(results: Results, price: number) {
    this.progressService.totalLobstersCaught += 1;
    results.lobstersCaught += 1;
    this.progressService.addToIncome(price);
    results.income += price;
  }

  private generateWeatherConditions(setup: Setup, results: Results) {
    const weatherChance = Math.floor(Math.random() * GAME_SETTINGS.randomNumberMax) + 1;
    if (weatherChance > setup.goodWeatherMax) {
      results.weatherConditions = WeatherConditions.evil;
      if (this.progressService.potsOffshore > 0) {
        results.weatherConditionsDescription = `Alas! There was a storm in the night. All yer offshore pots were lost to Davey Jones!`;
        results.alert = true;
      } else {
        results.weatherConditionsDescription = "There was a storm in the night! lucky ye didn't put any pots out there!"
      }
    } else {
      if (setup.weatherConditions === WeatherConditions.evil) {
        results.weatherConditions = WeatherConditions.normal;
        results.weatherConditionsDescription = `Despite the forecast, there was no storm in the night!`;
      } else {
        results.weatherConditions = setup.weatherConditions;
        results.weatherConditionsDescription = `The weather was ${WeatherConditions[setup.weatherConditions]} overnight as forecast... There was no storm!`;
      }
    }
  }

  private generateCatchResult(setup: Setup): boolean {
    let catchChance = Math.floor(Math.random() * GAME_SETTINGS.randomNumberMax) + 1;
    const caught = (catchChance < setup.catchChanceMax);
    return caught;
  }
}