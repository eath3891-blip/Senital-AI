import React from 'react';
import styles from './Tooltip.module.css';

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top'
}) => {
  return (
    <div 
      className={`${styles.tooltipWrapper} ${styles[`position-${position}`]}`}
      data-tooltip={content}
    >
      {children}
    </div>
  );
};
