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

  clearPreviousSetup() {
    this.progressService.roundResults = null;
    this.progressService.roundSetup = null;
  }

  getRoundSetup(): RoundSetup {
    this.clearPreviousSetup();
    if (this.progressService.day === 1) {
      return this.dayOneRoundSetup();
    }

    let roundSetup = new RoundSetup();
    roundSetup.rentDue = (this.progressService.day % GAME_SETTINGS.rentInterval === 0);
    roundSetup.rentDueTomorrow = ((this.progressService.day + 1) % GAME_SETTINGS.rentInterval === 0);
    roundSetup.rentWarning = roundSetup.rentDueTomorrow && (this.progressService.netProfit < GAME_SETTINGS.rentValue);
    roundSetup.rentValue = GAME_SETTINGS.rentValue;
    this.setBasicRoundSetup(roundSetup);
    this.progressService.gameOver = this.checkGameOver(roundSetup);
    if (this.progressService.gameOver) {
      return this.setRoundSetup(roundSetup);
    }
    if (roundSetup.rentDue) {
      this.progressService.income -= GAME_SETTINGS.rentValue;
    }
    this.setMarketConditions(roundSetup);
    return this.setRoundSetup(roundSetup);
  }

  private checkGameOver(roundSetup: RoundSetup): boolean {
    if (roundSetup.rentDue) {
      if (this.progressService.netProfit < GAME_SETTINGS.rentValue) {
        this.progressService.gameOverReason = "Ye couldn't pay the rent!";
        return true;
      }
    }
    if ((this.progressService.netProfit < roundSetup.potPrice) && this.progressService.totalPots < 1) {
      this.progressService.gameOverReason = "Ye have no more pots and ye can't afford to buy them!";
      return true;
    }
    return false;
  }

  private dayOneRoundSetup(): RoundSetup {
    let roundSetup = new RoundSetup();
    roundSetup.title = "Avast, Me Hearties!";
    roundSetup.info = "Welcome to lobster pots! Be ye savvy enough to survive the cutthroat life as a lobster catcher? There is but 1 rule... No prey no pay!";
    roundSetup.weatherConditions = WeatherConditions.perfect;
    roundSetup.goodWeatherMax = GAME_SETTINGS.goodWeatherMax;
    roundSetup.weatherAlert = false;
    roundSetup.positiveWeatherAlert = true;
    roundSetup.weatherConditionsDescription = `The weather forecast looks ${WeatherConditions[WeatherConditions.perfect]} today! A good day to start. There is only a ${GAME_SETTINGS.randomNumberMax - roundSetup.goodWeatherMax}% chance of a storm.`;
    roundSetup.marketAlert = false
    roundSetup.potPrice = GAME_SETTINGS.potPrice;
    roundSetup.onshorePrice = GAME_SETTINGS.onshorePrice;
    roundSetup.offshorePrice = GAME_SETTINGS.offshorePrice;
    roundSetup.marketConditions = MarketConditions.normal;
    roundSetup.marketConditionsDescription = `The lobster market is ${MarketConditions[MarketConditions.normal]} today. Here are the prices:`;
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
    roundSetup.marketAlert = false;
    roundSetup.weatherConditions = this.getRandomFromEnum(WeatherConditions);
    roundSetup.positiveWeatherAlert = (roundSetup.weatherConditions === WeatherConditions.perfect);
    roundSetup.goodWeatherMax = (GAME_SETTINGS.goodWeatherMax - (roundSetup.weatherConditions * 10));
    roundSetup.weatherConditionsDescription = `The weather forecast looks ${WeatherConditions[roundSetup.weatherConditions]} today. There is a ${GAME_SETTINGS.randomNumberMax - roundSetup.goodWeatherMax}% chance of a storm:`;
    roundSetup.weatherAlert = (roundSetup.goodWeatherMax < 60);
    roundSetup.marketConditions = this.getRandomFromEnum(MarketConditions);
    roundSetup.marketConditionsDescription = `The lobster market is ${MarketConditions[MarketConditions.normal]} today.`;
    roundSetup.catchChanceMax = GAME_SETTINGS.catchChanceMax;
    roundSetup.title = "Another Day, Another Lobster!"
  }

  private setMarketConditions(roundSetup: RoundSetup) {
    if (roundSetup.marketConditions === MarketConditions.lobsterShortage) {
      roundSetup.marketAlert = true;
      roundSetup.potPrice *= 2;
      roundSetup.onshorePrice *= 2;
      roundSetup.offshorePrice *= 2;
      roundSetup.catchChanceMax = 50;
      roundSetup.marketConditionsDescription = "Avast! There be a lobster shortage today! All prices be doubled, but beware, lobsters be harder to catch.";
    } else if (roundSetup.marketConditions === MarketConditions.lobsterSurplus) {
      roundSetup.positiveMarketAlert = true;
      roundSetup.potPrice /= 2;
      roundSetup.onshorePrice /= 2;
      roundSetup.offshorePrice /= 2;
      roundSetup.catchChanceMax = 90;
      roundSetup.marketConditionsDescription = "Blow me down! There be a great multitude of lobsters in the sea today! They be much easier to catch! but... the prices are lower too.";
    }
    else if (roundSetup.marketConditions === MarketConditions.lowDemand) {
      roundSetup.marketAlert = true;
      roundSetup.potPrice /= 2;
      roundSetup.onshorePrice /= 2;
      roundSetup.offshorePrice /= 2;
      roundSetup.marketConditionsDescription = "Blimey! There be a drop in demand for lobster! Everything is half price... including the lobsters.";
    } else if (roundSetup.marketConditions === MarketConditions.highDemand) {
      roundSetup.positiveMarketAlert = true;
      roundSetup.potPrice *= 2;
      roundSetup.onshorePrice *= 2;
      roundSetup.offshorePrice *= 2;
      roundSetup.marketConditionsDescription = "Yaar! There be high demand for lobster! All prices be doubled.";
    }
    roundSetup.marketConditionsDescription += ` There be reports that lobsters are getting caught about ${roundSetup.catchChanceMax}% of the time:`
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
      alert("Ye don't have enough 💰");
      return;
    }
    this.progressService.potsBought += 1;
    this.progressService.potSpendings += roundSetup.potPrice;
  }

  sellPot(roundSetup: RoundSetup) {
    if (this.progressService.totalPots < 1) {
      return;
    }
    this.progressService.potsBought -= 1;
    this.progressService.potSpendings -= (roundSetup.potPrice / 2);
  }

  placeOnshore(remove?: boolean) {
    if (remove) {
      if (this.progressService.potsOnshore < 1) {
        return;
      }
      this.progressService.potsOnshore -= 1;
    } else {
      if (this.progressService.totalPots < 1) {
        return;
      }
      this.progressService.potsOnshore += 1;
    }
  }

  placeOffshore(remove?: boolean) {
    if (remove) {
      if (this.progressService.potsOffshore < 1) {
        return;
      }
      this.progressService.potsOffshore -= 1;
    } else {
      if (this.progressService.totalPots < 1) {
        return;
      }
      this.progressService.potsOffshore += 1;
    }
  }

  goLobstering(roundSetup: RoundSetup): RoundResults {
    let roundResults = new RoundResults();
    this.generateWeatherConditions(roundSetup, roundResults);
    for (let i = 0; i < (this.progressService.potsOnshore); i++) {
      if (this.generateCatchResult(roundSetup)) {
        this.catchLobster(roundResults, roundSetup.onshorePrice);
      }
    }
    if (roundResults.weatherConditions !== WeatherConditions.evil) {
      for (let i = 0; i < (this.progressService.potsOffshore); i++) {
        if (this.generateCatchResult(roundSetup)) {
          this.catchLobster(roundResults, roundSetup.offshorePrice);
        }
      }
    } else {
      this.progressService.potsBought -= this.progressService.potsOffshore;
      roundResults.potsLost = this.progressService.potsOffshore;
    }

    if (this.progressService.potsOnshore > 0 || this.progressService.potsOffshore > 0) {
      if (roundResults.lobstersCaught > 0) {
        roundResults.title = "Success!";
        roundResults.success = true;
      } else {
        roundResults.title = "Unlucky!";
        roundResults.success = false;
      }
    } else {
      roundResults.title = "Ye sat this one out! Ye landlubber!!"
    }

    this.progressService.roundResults = roundResults;
    this.progressService.potsOnshore = 0;
    this.progressService.potsOffshore = 0;
    return roundResults;
  }

  private catchLobster(roundResults: RoundResults, price: number) {
    this.progressService.totalLobstersCaught += 1;
    roundResults.lobstersCaught += 1;
    this.progressService.income += price;
    roundResults.income += price;
  }

  private generateWeatherConditions(roundSetup: RoundSetup, roundResults: RoundResults) {
    const weatherChance = Math.floor(Math.random() * GAME_SETTINGS.randomNumberMax) + 1;
    if (weatherChance > roundSetup.goodWeatherMax) {
      roundResults.weatherConditions = WeatherConditions.evil;
      if (this.progressService.potsOffshore > 0) {
        roundResults.weatherConditionsDescription = `Alas! There was a storm in the night. All yer offshore pots were lost to Davey Jones!`;
        roundResults.alert = true;
      } else {
        roundResults.weatherConditionsDescription = "There was a storm in the night! lucky ye didn't put any pots out there!"
      }
    } else {
      if (roundSetup.weatherConditions === WeatherConditions.evil) {
        roundResults.weatherConditions = WeatherConditions.normal;
        roundResults.weatherConditionsDescription = `Despite the forecast, there was no storm in the night!`;
      } else {
        roundResults.weatherConditions = roundSetup.weatherConditions;
        roundResults.weatherConditionsDescription = `The weather was ${WeatherConditions[roundSetup.weatherConditions]} overnight as forecast... But no storm!`;
      }
    }
  }

  private generateCatchResult(roundSetup: RoundSetup): boolean {
    let catchChance = Math.floor(Math.random() * GAME_SETTINGS.randomNumberMax) + 1;
    const caught = (catchChance < roundSetup.catchChanceMax);
    return caught;
  }
}