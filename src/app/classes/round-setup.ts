import { MarketConditions } from "../enums/market-conditions";
import { WeatherConditions } from "../enums/weather-conditions";

export class RoundSetup {
    title: string = "";
    info: string = "";
    weatherConditions: WeatherConditions = WeatherConditions.normal;
    weatherConditionsDescription: string = "";
    marketConditions: MarketConditions = MarketConditions.normal;
    marketConditionsDescription: string = "";
    alert: boolean = false;
    potPrice: number = 0;
    onshorePrice: number = 0;
    offshorePrice: number = 0;
    goodWeatherMax: number = 0;
    catchChanceMax: number = 0;

    constructor(title?: string, info?: string, weatherConditions?: WeatherConditions, weatherConditionsDescription?: string,
        alert?: boolean, potPrice?: number, onshorePrice?: number, offshorePrice?: number, marketConditions?: MarketConditions,
        marketConditionsDescription?: string, goodWeatherMax?: number, catchChanceMax?: number) {
        if (!(title && info && weatherConditions && weatherConditionsDescription && alert && onshorePrice && offshorePrice && potPrice &&
            marketConditions && marketConditionsDescription && goodWeatherMax && catchChanceMax)) {
            return;
        }
        this.title = title;
        this.info = info;
        this.alert = alert;
        this.onshorePrice = onshorePrice;
        this.offshorePrice = offshorePrice;
        this.potPrice = potPrice;
        this.weatherConditions = weatherConditions;
        this.weatherConditionsDescription = weatherConditionsDescription;
        this.marketConditions = marketConditions;
        this.marketConditionsDescription = marketConditionsDescription;
        this.goodWeatherMax = goodWeatherMax;
        this.catchChanceMax = catchChanceMax;
    }
}
