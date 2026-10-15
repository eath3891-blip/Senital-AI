import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useActivityStore } from '../store/activityStore';
import { useAgentStore } from '../store/agentStore';
import { Badge } from '../components/ui/Badge';
import { RiskIndicator } from '../components/ui/RiskIndicator';
import { format } from 'date-fns';
import { ArrowLeft, FileText, Server, User } from 'lucide-react';
import styles from './EventDetail.module.css';

export function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const getActivity = useActivityStore((state: any) => state.getActivity);
  const agents = useAgentStore((state: any) => state.agents || []);
  
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  const event = getActivity ? getActivity(id) : null;
  const agent = event ? agents.find((a: any) => a.id === event.agentId) : null;
  
  if (!event) {
    return (
      <div className={styles.errorState}>
        <h2>Event not found</h2>
        <Link to="/activity" className={styles.backLink}>Return to Activity</Link>
      </div>
    );
  }

  const agentName = agent ? agent.name : 'Unknown Agent';

  const formatSafeDate = (ts: string, formatStr: string) => {
    try {
      if (!ts) return 'N/A';
      const d = new Date(ts);
      return isNaN(d.getTime()) ? 'N/A' : format(d, formatStr);
    } catch {
      return 'N/A';
    }
  };

  const tech = event.technical || {};
  const requestId = tech.requestId || event.requestId || `req_${event.id}`;
  const apiEndpoint = tech.apiEndpoint || event.apiEndpoint || '/api/v1/action';
  const responseCode = tech.responseCode ?? event.responseCode ?? 200;
  const executionDuration = tech.executionDuration || (event.executionDuration ? `${event.executionDuration}ms` : '120ms');
  const environment = tech.environment || event.environment || 'production';

  return (
    <div className={styles.container}>
      <Link to="/activity" className={styles.backLink}>
        <ArrowLeft size={16} />
        <span>Activity</span>
      </Link>

      <header className={styles.header}>
        <h1 className={styles.title}>{agentName}</h1>
        <h2 className={styles.subtitle}>{event.actionDescription || event.action}</h2>
        <div className={styles.meta}>
          <Badge variant="status" value={event.status}>{(event.status || '').replace('_', ' ')}</Badge>
          <Badge variant="risk" value={event.risk}>{event.risk}</Badge>
          <span className={styles.timestamp}>
            {formatSafeDate(event.timestamp, 'MMM d, yyyy HH:mm:ss')}
          </span>
        </div>
      </header>

      <div className={styles.content}>
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Event Summary</h3>
          <div className={styles.grid}>
            <div className={styles.gridItem}>
              <span className={styles.label}>Agent</span>
              <span className={styles.value}>
                <Link to={`/agents/${event.agentId}`} className={styles.link}>
                  <User size={14} className={styles.icon} />
                  {agentName}
                </Link>
              </span>
            </div>
            <div className={styles.gridItem}>
              <span className={styles.label}>Action</span>
              <span className={styles.value}>{event.actionDescription || event.action}</span>
            </div>
            <div className={styles.gridItem}>
              <span className={styles.label}>System</span>
              <span className={styles.value}>
                <Link to={`/systems/${event.systemId || ''}`} className={styles.link}>
                  <Server size={14} className={styles.icon} />
                  {event.system || event.systemName || 'Enterprise System'}
                </Link>
              </span>
            </div>
            <div className={styles.gridItem}>
              <span className={styles.label}>Data Involved</span>
              <span className={styles.value}>{event.dataInvolved || 'None'}</span>
            </div>
            <div className={styles.gridItem}>
              <span className={styles.label}>Timestamp</span>
              <span className={styles.value}>{formatSafeDate(event.timestamp, 'PPpp')}</span>
            </div>
            <div className={styles.gridItem}>
              <span className={styles.label}>Status</span>
              <span className={styles.value}>
                <Badge variant="status" value={event.status}>{(event.status || '').replace('_', ' ')}</Badge>
              </span>
            </div>
          </div>
        </section>

        {event.policyName && (
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Policy Decision</h3>
            <div className={styles.policyCard}>
              <div className={styles.policyHeader}>
                <FileText size={18} className={styles.policyIcon} />
                <Link to={`/policies/${event.policyId}`} className={styles.policyLink}>
                  {event.policyName}
                </Link>
              </div>
              <div className={styles.policyResult}>
                <span className={styles.label}>Decision Result</span>
                <span className={styles.value}>{(event.status || '').replace('_', ' ')}</span>
              </div>
            </div>
          </section>
        )}

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Risk Assessment</h3>
          <div className={styles.riskCard}>
            <RiskIndicator level={event.risk} />
          </div>
        </section>

        <section className={styles.section}>
          <button 
            className={styles.toggleButton} 
            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
          >
            {showTechnicalDetails ? 'Hide technical details' : 'Show technical details'}
          </button>
          
          {showTechnicalDetails && (
            <div className={styles.techDetails}>
              <div className={styles.techRow}>
                <span className={styles.techLabel}>Request ID</span>
                <span className={styles.techValue}>{requestId}</span>
              </div>
              <div className={styles.techRow}>
                <span className={styles.techLabel}>Agent ID</span>
                <span className={styles.techValue}>{event.agentId}</span>
              </div>
              <div className={styles.techRow}>
                <span className={styles.techLabel}>Policy ID</span>
                <span className={styles.techValue}>{event.policyId || 'N/A'}</span>
              </div>
              <div className={styles.techRow}>
                <span className={styles.techLabel}>API Endpoint</span>
                <span className={styles.techValue}>{apiEndpoint}</span>
              </div>
              <div className={styles.techRow}>
                <span className={styles.techLabel}>Response Code</span>
                <span className={`${styles.techValue} ${responseCode >= 400 ? styles.colorRed : styles.colorGreen}`}>
                  {responseCode}
                </span>
              </div>
              <div className={styles.techRow}>
                <span className={styles.techLabel}>Execution Duration</span>
                <span className={styles.techValue}>{executionDuration}</span>
              </div>
              <div className={styles.techRow}>
                <span className={styles.techLabel}>Environment</span>
                <span className={styles.techValue}>{environment}</span>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
