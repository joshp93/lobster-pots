import { FishingGround } from '../enums/fishing-ground';
import { LobsterSize } from '../enums/lobster-size';
import { ShellHardness } from '../enums/shell-hardness';

export const LOBSTER_BASE_PRICES: Record<LobsterSize, number> = {
    [LobsterSize.small]: 2,
    [LobsterSize.medium]: 4,
    [LobsterSize.large]: 6,
    [LobsterSize.jumbo]: 10
};

export const SHELL_MULTIPLIERS: Record<ShellHardness, number> = {
    [ShellHardness.hard]: 1,
    [ShellHardness.soft]: 0.55
};

export const SIZE_WEIGHTS: Record<FishingGround, Record<LobsterSize, number>> = {
    [FishingGround.inshore]: {
        [LobsterSize.small]: 50,
        [LobsterSize.medium]: 32,
        [LobsterSize.large]: 15,
        [LobsterSize.jumbo]: 3
    },
    [FishingGround.offshore]: {
        [LobsterSize.small]: 15,
        [LobsterSize.medium]: 30,
        [LobsterSize.large]: 35,
        [LobsterSize.jumbo]: 20
    }
};

export const SHELL_WEIGHTS: Record<FishingGround, Record<ShellHardness, number>> = {
    [FishingGround.inshore]: {
        [ShellHardness.hard]: 55,
        [ShellHardness.soft]: 45
    },
    [FishingGround.offshore]: {
        [ShellHardness.hard]: 85,
        [ShellHardness.soft]: 15
    }
};
