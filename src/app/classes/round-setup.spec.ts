import { WeatherConditions } from '../enums/weather-conditions';
import { RoundSetup } from './round-setup';

describe('RoundSetup', () => {
  it('should create an instance', () => {
    expect(new RoundSetup('title', 'info', WeatherConditions.perfect, false, 10, 10, 10, "Hello")).toBeTruthy();
  });
});
