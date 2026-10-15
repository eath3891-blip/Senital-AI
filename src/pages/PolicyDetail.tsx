import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePolicyStore } from '../store/policyStore';
import { useAgentStore } from '../store/agentStore';
import { Badge } from '../components/ui/Badge';
import { ArrowLeft, Check, ShieldAlert, ArrowDown } from 'lucide-react';
import styles from './PolicyDetail.module.css';

export function PolicyDetail() {
  const { id } = useParams<{ id: string }>();
  const policy = usePolicyStore(s => s.policies.find(p => p.id === id));
  const agents = useAgentStore(s => s.agents);

  if (!policy) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <ShieldAlert size={48} className={styles.errorIcon} />
          <h2>Policy not found</h2>
          <Link to="/policies" className={styles.backLink}>← Back to Policies</Link>
        </div>
      </div>
    );
  }

  const connectedAgents = agents.filter(a => (policy.connectedAgents || []).includes(a.id));

  return (
    <div className={styles.container}>
      <Link to="/policies" className={styles.backLink}>
        <ArrowLeft size={16} /> Policies
      </Link>

      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{policy.name}</h1>
          <Badge variant={policy.status === 'active' ? 'success' : policy.status === 'draft' ? 'warning' : 'neutral'}>
            {policy.status}
          </Badge>
        </div>
        <p className={styles.subtitle}>{policy.description}</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Policy Rule</h2>
        <div className={styles.visualization}>
          <div className={styles.ifSection}>
            <div className={styles.ifLabel}>IF</div>
            <div className={styles.conditionsList}>
              {policy.conditions?.map((cond, index) => (
                <React.Fragment key={index}>
                  <div className={styles.conditionCard}>
                    <span className={styles.field}>{cond.field}</span>
                    <span className={styles.operator}>{cond.operator.replace(/_/g, ' ')}</span>
                    <span className={styles.value}>{cond.value}</span>
                  </div>
                  {index < policy.conditions.length - 1 && (
                    <div className={styles.andLabel}>AND</div>
                  )}
                </React.Fragment>
              ))}
              {(!policy.conditions || policy.conditions.length === 0) && (
                <div className={styles.conditionCard}>No conditions specified</div>
              )}
            </div>
          </div>
          
          <div className={styles.connector}>
            <div className={styles.line}></div>
            <ArrowDown className={styles.arrowIcon} size={20} />
          </div>

          <div className={styles.thenSection}>
            <div className={styles.thenLabel}>THEN</div>
            <div className={styles.actionsList}>
              {policy.actions?.map((action, index) => (
                <div key={index} className={styles.actionItem}>
                  <Check size={16} className={styles.checkIcon} />
                  <span>{action.type.replace(/_/g, ' ')}: {action.description}</span>
                </div>
              ))}
              {(!policy.actions || policy.actions.length === 0) && (
                <div className={styles.actionItem}>No actions specified</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.detailsCard}>
          <h3 className={styles.cardHeading}>Details</h3>
          <dl className={styles.detailsList}>
            <div className={styles.detailItem}>
              <dt>Scope</dt>
              <dd>{policy.scope}</dd>
            </div>
            <div className={styles.detailItem}>
              <dt>Applies to</dt>
              <dd>{policy.appliesTo}</dd>
            </div>
            <div className={styles.detailItem}>
              <dt>Status</dt>
              <dd>{policy.status}</dd>
            </div>
          </dl>
        </div>

        <div className={styles.agentsCard}>
          <h3 className={styles.cardHeading}>Connected Agents</h3>
          <div className={styles.agentsList}>
            {connectedAgents.length > 0 ? (
              connectedAgents.map(agent => (
                <Link to={`/agents/${agent.id}`} key={agent.id} className={styles.agentItem}>
                  <div className={styles.agentName}>{agent.name}</div>
                  <div className={styles.agentBadges}>
                    <Badge variant="risk" value={agent.risk}>{agent.risk} risk</Badge>
                    <Badge variant="status" value={agent.autonomy}>{agent.autonomy.replace('_', ' ')}</Badge>
                  </div>
                </Link>
              ))
            ) : (
              <p className={styles.emptyText}>No connected agents found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
