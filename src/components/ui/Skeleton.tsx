import React from 'react';
import styles from './Skeleton.module.css';

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '20px',
  borderRadius = 'var(--radius-sm)',
  count = 1,
}) => {
  const elements = Array.from({ length: count });

  return (
    <div className={styles.wrapper}>
      {elements.map((_, i) => (
        <div
          key={i}
          className={styles.skeleton}
          style={{ width, height, borderRadius }}
        />
      ))}
    </div>
  );
};
