import CheckIcon from '@assets/icons/check.svg?react';
import ChevronRightIcon from '@assets/icons/chevron-right.svg?react';
import CopyIcon from '@assets/icons/copy.svg?react';
import EyeOffIcon from '@assets/icons/eye-off.svg?react';
import EyeIcon from '@assets/icons/eye.svg?react';
import ImportIcon from '@assets/icons/import.svg?react';
import KeyIcon from '@assets/icons/key.svg?react';
import ReceiveIcon from '@assets/icons/receive.svg?react';
import SendIcon from '@assets/icons/send.svg?react';
import SettingsIcon from '@assets/icons/settings.svg?react';
import ShieldIcon from '@assets/icons/shield.svg?react';
import TonSymbolIcon from '@assets/icons/ton-symbol.svg?react';
import WalletIcon from '@assets/icons/wallet.svg?react';

export const iconMap = {
    key: KeyIcon,
    import: ImportIcon,
    wallet: WalletIcon,
    send: SendIcon,
    receive: ReceiveIcon,
    copy: CopyIcon,
    check: CheckIcon,
    chevronRight: ChevronRightIcon,
    settings: SettingsIcon,
    eye: EyeIcon,
    eyeOff: EyeOffIcon,
    shield: ShieldIcon,
    tonSymbol: TonSymbolIcon,
} as const;

export type IconName = keyof typeof iconMap;
