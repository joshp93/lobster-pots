import { Forecast } from '../enums/forecast';
import { StormSeverity } from '../enums/storm-severity';

export const STORM_CHANCE_MIN = 0;
export const STORM_CHANCE_MAX = 80;

export const FORECAST_STORM_MODIFIERS: Record<Forecast, number> = {
    [Forecast.calm]: -10,
    [Forecast.fair]: -5,
    [Forecast.normal]: 0,
    [Forecast.unsettled]: 5,
    [Forecast.grim]: 10,
    [Forecast.evil]: 15
};

export type StormSeverityWeights = Record<Exclude<StormSeverity, StormSeverity.none>, number>;

export const STORM_SEVERITY_WEIGHTS: Record<Forecast, StormSeverityWeights> = {
    [Forecast.calm]: {
        [StormSeverity.offshoreMinor]: 90,
        [StormSeverity.offshoreMajor]: 9,
        [StormSeverity.inshoreAndOffshore]: 1
    },
    [Forecast.fair]: {
        [StormSeverity.offshoreMinor]: 80,
        [StormSeverity.offshoreMajor]: 16,
        [StormSeverity.inshoreAndOffshore]: 4
    },
    [Forecast.normal]: {
        [StormSeverity.offshoreMinor]: 65,
        [StormSeverity.offshoreMajor]: 28,
        [StormSeverity.inshoreAndOffshore]: 7
    },
    [Forecast.unsettled]: {
        [StormSeverity.offshoreMinor]: 50,
        [StormSeverity.offshoreMajor]: 35,
        [StormSeverity.inshoreAndOffshore]: 15
    },
    [Forecast.grim]: {
        [StormSeverity.offshoreMinor]: 30,
        [StormSeverity.offshoreMajor]: 40,
        [StormSeverity.inshoreAndOffshore]: 30
    },
    [Forecast.evil]: {
        [StormSeverity.offshoreMinor]: 10,
        [StormSeverity.offshoreMajor]: 25,
        [StormSeverity.inshoreAndOffshore]: 65
    }
};

export const POT_LOSS_CHANCES: Record<StormSeverity, { inshore: number; offshore: number }> = {
    [StormSeverity.none]: { inshore: 0, offshore: 0 },
    [StormSeverity.offshoreMinor]: { inshore: 0, offshore: 30 },
    [StormSeverity.offshoreMajor]: { inshore: 0, offshore: 50 },
    [StormSeverity.inshoreAndOffshore]: { inshore: 30, offshore: 70 }
};
