import { Icon } from '@components/ui/Icon';
import classNames from 'classnames';

import styles from './ActionCard.module.scss';

import type { IconName } from '@/types/icons';

interface ActionCardProps {
  icon: IconName;
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
  return (
    <div
      className={classNames(styles.card, styles[gradient], {
        [styles.selected]: selected,
      })}
      onClick={onClick}
    >
      <div className={styles.iconWrapper}>
        <div className={styles.icon}>
          <Icon name={icon} size={32} />
        </div>
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
      <div className={styles.arrow}>→</div>
    </div>
  );
};
