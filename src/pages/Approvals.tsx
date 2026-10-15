import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, Clock } from 'lucide-react';
import { useApprovalStore } from '../store/approvalStore';
import { Badge } from '../components/ui/Badge';
import { RiskIndicator } from '../components/ui/RiskIndicator';
import styles from './Approvals.module.css';

export const Approvals: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('Pending');
  const approvals = useApprovalStore((state) => state.approvals);

  const pendingCount = approvals.filter((a) => a.status === 'pending').length;

  const filteredApprovals = approvals.filter((approval) => {
    if (activeTab === 'All') return true;
    return approval.status.toLowerCase() === activeTab.toLowerCase();
  });

  const safeFormatDistance = (ts: string | undefined | null) => {
    try {
      if (!ts) return 'recently';
      const d = new Date(ts);
      return isNaN(d.getTime()) ? 'recently' : `${formatDistanceToNow(d)} ago`;
    } catch {
      return 'recently';
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Approval queue</h1>
        <p className={styles.subtitle}>
          Review actions that require human judgment<br />
          before an AI agent can proceed.
        </p>
      </header>

      <div className={styles.tabs}>
        {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((tab) => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            {tab === 'Pending' && pendingCount > 0 && (
              <span className={styles.badge}>{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      <div className={styles.list}>
        {filteredApprovals.length === 0 ? (
          <div className={styles.emptyState}>
            <CheckCircle className={styles.emptyIcon} size={48} />
            <p>You're all caught up.</p>
          </div>
        ) : (
          filteredApprovals.map((approval) => (
            <Link key={approval.id} to={`/approvals/${approval.id}`} className={styles.cardWrapper}>
              <div
                className={styles.card}
                data-risk={approval.risk}
              >
                <div className={styles.cardHeader}>
                  <span className={styles.agentName}>{approval.agentName}</span>
                </div>
                <h3 className={styles.action}>{approval.actionDescription}</h3>
                <p className={styles.reason}>
                  {approval.reason.length > 120
                    ? `${approval.reason.substring(0, 120)}...`
                    : approval.reason}
                </p>
                <div className={styles.cardFooter}>
                  <RiskIndicator level={approval.risk} />
                  <div className={styles.metaInfo}>
                    <Clock size={14} className={styles.clockIcon} />
                    <span>{safeFormatDistance(approval.requestedAt)}</span>
                  </div>
                  <Badge variant="status" value={approval.status}>
                    {approval.status}
                  </Badge>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};
