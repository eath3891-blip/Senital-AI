import React from 'react';
import styles from './Badge.module.css';

export interface BadgeProps {
  variant?: 'risk' | 'status' | 'neutral' | 'success' | 'warning' | 'error' | 'danger' | 'default';
  value?: string;
  children?: React.ReactNode;
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  value,
  children,
  size = 'md',
  dot = false,
}) => {
  const textContent = value !== undefined ? value : (typeof children === 'string' ? children : '');
  const normalizedValue = (textContent || '').toString().toLowerCase();
  let colorClass = styles.neutral;

  if (variant === 'risk') {
    if (normalizedValue.includes('low')) colorClass = styles.riskLow;
    else if (normalizedValue.includes('medium')) colorClass = styles.riskMedium;
    else if (normalizedValue.includes('high')) colorClass = styles.riskHigh;
    else if (normalizedValue.includes('critical')) colorClass = styles.riskCritical;
  } else if (variant === 'status') {
    if (['active', 'approved', 'completed', 'resolved', 'allowed'].includes(normalizedValue)) colorClass = styles.statusActive;
    else if (['pending', 'in progress', 'approval_required', 'approval required', 'pending review', 'pending approval'].includes(normalizedValue)) colorClass = styles.statusPending;
    else if (['blocked', 'rejected', 'failed'].includes(normalizedValue)) colorClass = styles.statusBlocked;
    else if (['investigating'].includes(normalizedValue)) colorClass = styles.statusInvestigating;
    else colorClass = styles.statusInactive;
  } else if (variant === 'success') {
    colorClass = styles.statusActive;
  } else if (variant === 'warning') {
    colorClass = styles.statusPending;
  } else if (variant === 'danger' || variant === 'error') {
    colorClass = styles.statusBlocked;
  } else {
    colorClass = styles.neutral;
  }

  const classes = [
    styles.badge,
    styles[`size-${size}`] || styles.sizeMd,
    colorClass
  ].filter(Boolean).join(' ');

  return (
    <span className={classes}>
      {dot && <span className={styles.dot} />}
      {children !== undefined ? children : value}
    </span>
  );
};
