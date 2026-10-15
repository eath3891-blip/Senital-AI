import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { formatDistanceToNow, format } from 'date-fns';
import { useSystemStore } from '../store/systemStore';
import { useAgentStore } from '../store/agentStore';
import { usePolicyStore } from '../store/policyStore';
import { Badge } from '../components/ui/Badge';
import { StatusDot } from '../components/ui/StatusDot';
import { RiskIndicator } from '../components/ui/RiskIndicator';
import styles from './SystemDetail.module.css';

export function SystemDetail() {
  const { id } = useParams<{ id: string }>();
  const system = useSystemStore((s) => s.getSystem(id || ''));
  const agents = useAgentStore((s) => s.agents).filter((a) => system?.connectedAgents.includes(a.id));
  const policies = usePolicyStore((s) => s.policies).filter((p) => system?.policies.includes(p.id));

  if (!system) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>System not found.</div>
      </div>
    );
  }

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

  const safeFormatDate = (ts: string | undefined | null, formatStr: string) => {
    try {
      if (!ts) return 'N/A';
      const d = new Date(ts);
      return isNaN(d.getTime()) ? 'N/A' : format(d, formatStr);
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className={styles.container}>
      <Link to="/systems" className={styles.backLink}>← Data & Systems</Link>
      
      <header className={styles.header}>
        <h1 className={styles.title}>{system.name}</h1>
        <p className={styles.subtitle}>{system.description}</p>
        <div className={styles.statusWrapper}>
          <StatusDot status={getStatusColor(system.status) as any} />
          {system.status}
        </div>
      </header>

      <div className={styles.overviewGrid}>
        <div className={styles.overviewItem}>
          <span className={styles.overviewLabel}>Type</span>
          <span className={styles.overviewValue} style={{ textTransform: 'capitalize' }}>
            {system.type}
          </span>
        </div>
        <div className={styles.overviewItem}>
          <span className={styles.overviewLabel}>Access Level</span>
          <span className={styles.overviewValue}>{system.accessLevel || 'Read-Only'}</span>
        </div>
        <div className={styles.overviewItem}>
          <span className={styles.overviewLabel}>Last Sync</span>
          <span className={styles.overviewValue}>
            {safeFormatDistance(system.lastSync)}
          </span>
        </div>
        <div className={styles.overviewItem}>
          <span className={styles.overviewLabel}>Risk</span>
          <span className={styles.overviewValue}>
            <RiskIndicator level={system.risk} />
          </span>
        </div>
        <div className={styles.overviewItem}>
          <span className={styles.overviewLabel}>Connected Agents</span>
          <span className={styles.overviewValue}>{agents.length}</span>
        </div>
        <div className={styles.overviewItem}>
          <span className={styles.overviewLabel}>Policies</span>
          <span className={styles.overviewValue}>{policies.length}</span>
        </div>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Connected agents</h2>
        <div className={styles.cardsGrid}>
          {agents.map((agent) => (
            <Link key={agent.id} to={`/agents/${agent.id}`} className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>{agent.name}</h3>
                <Badge variant="status" value={agent.autonomy}>
                  {agent.autonomy.replace('_', ' ')}
                </Badge>
              </div>
              <RiskIndicator level={agent.risk} />
            </Link>
          ))}
          {agents.length === 0 && (
            <div style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>No connected agents.</div>
          )}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Applied policies</h2>
        <div className={styles.cardsGrid}>
          {policies.map((policy) => (
            <Link key={policy.id} to={`/policies/${policy.id}`} className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>{policy.name}</h3>
                <Badge variant={policy.status === 'active' ? 'success' : 'neutral'}>
                  {policy.status}
                </Badge>
              </div>
              <div style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
                {policy.scope} scope
              </div>
            </Link>
          ))}
          {policies.length === 0 && (
            <div style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>No applied policies.</div>
          )}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Recent access</h2>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Agent</th>
                <th>Action</th>
                <th>Timestamp</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {system.recentAccess?.map((access: any, i: number) => {
                const agent = useAgentStore.getState().agents.find(a => a.id === access.agentId);
                return (
                  <tr key={i}>
                    <td>
                      <Link to={`/agents/${access.agentId}`} style={{ color: 'var(--color-text-primary)', textDecoration: 'none', fontWeight: 500 }}>
                        {agent?.name || access.agentId}
                      </Link>
                    </td>
                    <td>{access.action}</td>
                    <td>{safeFormatDate(access.timestamp, 'MMM d, yyyy HH:mm:ss')}</td>
                    <td>
                      <Badge variant="status" value={access.status}>
                        {access.status}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
              {(!system.recentAccess || system.recentAccess.length === 0) && (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                    No recent access logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
