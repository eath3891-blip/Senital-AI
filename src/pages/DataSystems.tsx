import React from 'react';
import { Link } from 'react-router-dom';
import { Database, Server, Globe, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useSystemStore } from '../store/systemStore';
import { Badge } from '../components/ui/Badge';
import { StatusDot } from '../components/ui/StatusDot';
import styles from './DataSystems.module.css';

export function DataSystems() {
  const systems = useSystemStore((s) => s.systems);

  const getIcon = (type: string) => {
    switch (type) {
      case 'database':
        return <Database size={24} />;
      case 'api':
        return <Server size={24} />;
      case 'platform':
        return <Globe size={24} />;
      default:
        return <Database size={24} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'success';
      case 'disconnected': return 'error';
      case 'degraded': return 'warning';
      default: return 'neutral';
    }
  };

  const safeFormatDistance = (ts: string | undefined | null) => {
    try {
      if (!ts) return 'Recently';
      const d = new Date(ts);
      return isNaN(d.getTime()) ? 'Recently' : formatDistanceToNow(d, { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Data & Systems</h1>
        <p className={styles.subtitle}>
          Manage the enterprise systems and data sources your AI agents connect to.
        </p>
      </header>

      <div className={styles.grid}>
        {systems.map((system) => (
          <Link key={system.id} to={`/systems/${system.id}`} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.iconWrapper} data-type={system.type}>
                {getIcon(system.type)}
              </div>
              <div className={styles.cardInfo}>
                <h3 className={styles.cardTitle}>
                  {system.name}
                  <ChevronRight size={16} color="var(--color-text-tertiary)" />
                </h3>
                <p className={styles.cardDescription}>{system.description}</p>
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.metaGrid}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Status</span>
                <span className={styles.metaValue}>
                  <StatusDot status={getStatusColor(system.status) as any} />
                  <span style={{ textTransform: 'capitalize' }}>{system.status}</span>
                </span>
              </div>
              
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Last Sync</span>
                <span className={styles.metaValue}>
                  {safeFormatDistance(system.lastSync)}
                </span>
              </div>

              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Risk Level</span>
                <span className={styles.metaValue}>
                  <Badge variant="risk" value={system.risk}>
                    {system.risk}
                  </Badge>
                </span>
              </div>

              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Connected</span>
                <span className={styles.metaValue}>
                  {system.connectedAgents.length} agents • {system.policies.length} policies
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
