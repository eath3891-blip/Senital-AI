import React from 'react';
import { Badge } from '../ui/Badge';
import styles from './AgentCard.module.css';

interface AgentCardProps {
  agent: any;
  onClick: () => void;
}

export function AgentCard({ agent, onClick }: AgentCardProps) {
  const getRiskColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case 'low': return 'var(--color-risk-low)';
      case 'medium': return 'var(--color-risk-medium)';
      case 'high': return 'var(--color-risk-high)';
      case 'critical': return 'var(--color-risk-critical)';
      default: return 'var(--color-risk-low)';
    }
  };

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.header}>
        <h3 className={styles.name}>{agent.name}</h3>
        <Badge variant="status" value={agent.status} />
      </div>
      <p className={styles.description}>{agent.description}</p>
      
      <div className={styles.divider} />
      
      <div className={styles.metaGrid}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Owner</span>
          <span className={styles.metaValue}>{agent.ownerTeam}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Risk</span>
          <div>
            <Badge variant="risk" value={agent.risk} />
          </div>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Autonomy</span>
          <span className={styles.metaValue} style={{ textTransform: 'capitalize' }}>
            {agent.autonomy?.replace('_', ' ')}
          </span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Environment</span>
          <div>
            <Badge variant="neutral" value={agent.environment} />
          </div>
        </div>
      </div>

      <div 
        className={styles.bottomAccent} 
        style={{ backgroundColor: getRiskColor(agent.risk) }}
      />
    </div>
  );
}
