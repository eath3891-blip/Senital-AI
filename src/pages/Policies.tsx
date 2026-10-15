import React from 'react';
import { usePolicyStore } from '../store/policyStore';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Plus, ChevronRight } from 'lucide-react';
import styles from './Policies.module.css';

export function Policies() {
  const policies = usePolicyStore(s => s.policies);
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Policies</h1>
          <p className={styles.subtitle}>
            Define the rules that determine what AI agents can access and when humans need to intervene.
          </p>
        </div>
        <div className={styles.actions}>
          <Button variant="primary" onClick={() => navigate('/policies/new')}>
            <Plus size={16} /> Create policy
          </Button>
        </div>
      </div>

      <div className={styles.grid}>
        {policies?.map(policy => (
          <Link to={`/policies/${policy.id}`} key={policy.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>{policy.name}</h3>
              <p className={styles.cardDescription}>{policy.description}</p>
            </div>
            <div className={styles.divider} />
            <div className={styles.cardFooter}>
              <div className={styles.meta}>
                <span className={styles.metaLabel}>Scope:</span> {policy.scope}
              </div>
              <div className={styles.meta}>
                <span className={styles.metaLabel}>Applies to:</span> {policy.appliesTo}
              </div>
              <div className={styles.footerRow}>
                <Badge variant={policy.status === 'active' ? 'success' : policy.status === 'draft' ? 'warning' : 'neutral'}>
                  {policy.status}
                </Badge>
                <span className={styles.agentCount}>
                  {policy.connectedAgents?.length || 0} agents
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
