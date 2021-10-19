export enum MarketConditions {
    normal, //normal play
    lowDemand, //price for lobster decreases, but they are normal to catch
    highDemand, //price for lobster is high, they are normal to catch
    lobsterShortage, //price for lobster is high, they are hard to catch
    lobsterSurplus //Lobsters are easy to catch, price is low
}
