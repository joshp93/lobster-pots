import { InjectionToken } from '@angular/core';
import { createRandomInt, type RandomInt } from '../mechanics/random/random-int';

export const RANDOM_INT = new InjectionToken<RandomInt>('RANDOM_INT', {
    providedIn: 'root',
    factory: () => createRandomInt()
});
