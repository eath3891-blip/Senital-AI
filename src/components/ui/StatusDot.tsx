import React from 'react';

export interface StatusDotProps {
  status: string;
  label?: string;
}

export const StatusDot: React.FC<StatusDotProps> = ({ status, label }) => {
  const normalizedStatus = status.toLowerCase();
  
  let color = 'var(--color-text-tertiary)';
  if (['active', 'connected', 'online', 'ok'].includes(normalizedStatus)) {
    color = 'var(--color-status-active)';
  } else if (['pending', 'warning'].includes(normalizedStatus)) {
    color = 'var(--color-status-pending)';
  } else if (['disconnected', 'error', 'offline', 'blocked'].includes(normalizedStatus)) {
    color = 'var(--color-status-blocked)';
  }

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
      <div 
        style={{ 
          width: '8px', 
          height: '8px', 
          borderRadius: '50%', 
          backgroundColor: color 
        }} 
      />
      {label && (
        <span style={{ 
          fontSize: 'var(--text-meta)', 
          color: 'var(--color-text-secondary)',
          fontFamily: 'var(--font-family)'
        }}>
          {label}
        </span>
      )}
    </div>
  );
};
