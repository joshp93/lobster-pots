import { WeatherConditions } from "../enums/weather-conditions";

export class RoundResults {
    weatherConditions: WeatherConditions = WeatherConditions.normal;
    weatherConditionsDescription: string = "";
    lobstersCaught: number = 0;
    potsLost: number = 0;
}
