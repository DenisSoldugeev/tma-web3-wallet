import { type SVGProps } from 'react';

import { iconMap, type IconName } from '@/types/icons';

export interface IconProps extends SVGProps<SVGSVGElement> {
    name: IconName;
    size?: number;
}

export const Icon = ({ name, size = 24, ...props }: IconProps) => {
    const IconComponent = iconMap[name];

    return (
        <IconComponent
            width={size}
            height={size}
            {...props}
        />
    );
};
