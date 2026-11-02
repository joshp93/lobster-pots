import type { FishingGround } from '../enums/fishing-ground';
import type { LobsterSize } from '../enums/lobster-size';
import type { ShellHardness } from '../enums/shell-hardness';

export interface LobsterCatch {
    ground: FishingGround;
    size: LobsterSize;
    shell: ShellHardness;
    price: number;
}
