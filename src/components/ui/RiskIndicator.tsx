import React from 'react';
import { ShieldAlert, ShieldCheck, Shield } from 'lucide-react';
import styles from './RiskIndicator.module.css';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface RiskIndicatorProps {
  level: RiskLevel;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskIndicator: React.FC<RiskIndicatorProps> = ({
  level,
  showLabel = true,
  size = 'md'
}) => {
  const Icon = level === 'low' ? ShieldCheck : level === 'medium' ? Shield : ShieldAlert;
  
  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20
  };

  return (
    <div className={`${styles.container} ${styles[`size-${size}`]} ${styles[`level-${level}`]}`}>
      <Icon size={iconSizes[size]} className={styles.icon} />
      {showLabel && <span className={styles.label}>{level.charAt(0).toUpperCase() + level.slice(1)} Risk</span>}
    </div>
  );
};
