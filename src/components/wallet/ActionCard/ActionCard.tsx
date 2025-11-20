import classNames from 'classnames';
import type { ReactNode } from 'react';

import styles from './ActionCard.module.scss';

interface ActionCardProps {
    icon: ReactNode;
    title: string;
    description: string;
    gradient?: 'primary' | 'secondary' | 'accent';
    onClick?: () => void;
    selected?: boolean;
}

export const ActionCard = ({
                               icon,
                               title,
                               description,
                               gradient = 'primary',
                               onClick,
                               selected = false,
                           }: ActionCardProps) => {
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick) {
            e.preventDefault();
            onClick();
        }
    };

    return (
        <div
            className={classNames(styles['action-card'], {
                [styles[`action-card--${gradient}`]]: gradient,
                [styles['action-card--selected']]: selected,
            })}
            onClick={onClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-pressed={selected}
        >
            <div className={styles['action-card__content']}>
                <h3 className={styles['action-card__title']}>{title}</h3>
                <p className={styles['action-card__description']}>{description}</p>
            </div>
            <div className={styles['action-card__icon-wrapper']}>
                <div className={styles['action-card__icon']}>
                    {icon}
                </div>
            </div>
        </div>
    );
};
