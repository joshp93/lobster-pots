import { MarketConditions } from "../enums/market-conditions";
import { WeatherConditions } from "../enums/weather-conditions";

export class RoundSetup {
    title: string = "";
    info: string = "";
    weatherConditions: WeatherConditions = WeatherConditions.normal;
    weatherConditionsDescription: string = "";
    weatherAlert: boolean = false;
    marketConditions: MarketConditions = MarketConditions.normal;
    marketConditionsDescription: string = "";
    marketAlert: boolean = false;
    potPrice: number = 0;
    onshorePrice: number = 0;
    offshorePrice: number = 0;
    goodWeatherMax: number = 0;
    catchChanceMax: number = 0;
    rentDue: boolean = false;
    rentDueTomorrow: boolean = false;
    rentValue: number = 0;
    rentWarning: boolean = false;
}
