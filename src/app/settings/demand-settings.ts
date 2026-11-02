export const DEMAND_SETTINGS = {
    min: 1,
    max: 10,
    starting: 5,
    multiplierBase: 0.5,
    multiplierPerPoint: 0.1,
    driftNoise: 2
};

export const DEMAND_CATCH_BANDS: readonly { maxDemand: number; modifier: number }[] = [
    { maxDemand: 2, modifier: 10 },
    { maxDemand: 4, modifier: 5 },
    { maxDemand: 7, modifier: 0 },
    { maxDemand: 9, modifier: -5 },
    { maxDemand: 10, modifier: -10 }
];
