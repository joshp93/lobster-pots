export type RandomInt = (min: number, max: number) => number;

/**
 * Creates an inclusive random integer generator backed by Math.random.
 * @returns A function returning an integer between min and max inclusive.
 */
export function createRandomInt(): RandomInt {
    return (min: number, max: number): number => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
}
