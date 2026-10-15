import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { format, formatDistanceToNow } from 'date-fns';
import { ArrowLeft, CheckCircle, XCircle, MessageSquare, FileText, Clock } from 'lucide-react';
import { useApprovalStore } from '../store/approvalStore';
import { useActivityStore } from '../store/activityStore';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { RiskIndicator } from '../components/ui/RiskIndicator';
import styles from './ApprovalDetail.module.css';

export const ApprovalDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const approval = useApprovalStore((state) => 
    state.approvals.find((a) => a.id === id)
  );
  const approveAction = useApprovalStore((state) => state.approveAction);
  const rejectAction = useApprovalStore((state) => state.rejectAction);

  const activities = useActivityStore((state) => 
    state.activities.filter((a) => a.agentId === approval?.agentId).slice(0, 4)
  );

  if (!approval) {
    return (
      <div className={styles.notFound}>
        <h2>Approval not found</h2>
        <Link to="/approvals">Return to Approvals</Link>
      </div>
    );
  }

  const handleApprove = () => {
    approveAction(approval.id, 'Manoj');
  };

  const handleReject = () => {
    rejectAction(approval.id, 'Manoj');
  };

  const safeFormatDistance = (ts: string | undefined | null) => {
    try {
      if (!ts) return 'recently';
      const d = new Date(ts);
      return isNaN(d.getTime()) ? 'recently' : `${formatDistanceToNow(d)} ago`;
    } catch {
      return 'recently';
    }
  };

  const safeFormatDate = (ts: string | undefined | null, formatStr: string) => {
    try {
      if (!ts) return '';
      const d = new Date(ts);
      return isNaN(d.getTime()) ? '' : format(d, formatStr);
    } catch {
      return '';
    }
  };

  return (
    <div className={styles.container}>
      <Link to="/approvals" className={styles.backLink}>
        <ArrowLeft size={16} />
        ← Approvals
      </Link>

      <header className={styles.header}>
        <div className={styles.headerTitleRow}>
          <h1 className={styles.title}>Review agent action</h1>
          <Badge variant={approval.status as any}>{approval.status}</Badge>
        </div>
        <div className={styles.headerSub}>
          Agent: <Link to={`/agents/${approval.agentId}`} className={styles.agentLink}>{approval.agentName}</Link>
        </div>
      </header>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>1. What is the agent trying to do?</h2>
        <div className={styles.card}>
          <h3 className={styles.actionName}>{approval.actionDescription || approval.action}</h3>
          <p className={styles.requestedTime}>
            Requested by <Link to={`/agents/${approval.agentId}`}>{approval.agentName}</Link> 
            {' '}{safeFormatDistance(approval.requestedAt)} {safeFormatDate(approval.requestedAt, 'PPpp') ? `(${safeFormatDate(approval.requestedAt, 'PPpp')})` : ''}
          </p>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>2. Why is the agent requesting this?</h2>
        <div className={styles.quoteBlock}>
          <p className={styles.reasonText}>{approval.reason}</p>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>3. Requested access</h2>
        <div className={styles.gridCard}>
          <div className={styles.gridItem}>
            <span className={styles.gridLabel}>Resource</span>
            <span className={styles.gridValue}>{approval.resource}</span>
          </div>
          <div className={styles.gridItem}>
            <span className={styles.gridLabel}>Resource Type</span>
            <span className={styles.gridValue}>
              <Badge variant="default">{approval.resourceType}</Badge>
            </span>
          </div>
          <div className={styles.gridItem}>
            <span className={styles.gridLabel}>Access Level</span>
            <span className={styles.gridValue}>{approval.accessLevel}</span>
          </div>
          <div className={styles.gridItem}>
            <span className={styles.gridLabel}>Duration</span>
            <span className={styles.gridValue}>{approval.duration || 'N/A'}</span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>4. Policy evaluation</h2>
        <div className={styles.card}>
          <div className={styles.policyRow}>
            <FileText size={20} className={styles.policyIcon} />
            <div>
              <Link to={`/policies/${approval.policyId}`} className={styles.policyName}>
                {approval.policyName}
              </Link>
              <p className={styles.policyResult}>Policy result evaluated successfully. Action requires manual approval due to risk settings.</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>5. Risk assessment</h2>
        <div className={styles.riskCard} data-risk={approval.risk}>
          <RiskIndicator level={approval.risk} />
          <p className={styles.riskReason}>{approval.riskReason || 'Elevated risk detected due to sensitive resource access.'}</p>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>6. Agent history</h2>
        <div className={styles.historyList}>
          {activities.length > 0 ? (
            activities.map(activity => (
              <div key={activity.id} className={styles.historyItem}>
                <Clock size={16} className={styles.historyIcon} />
                <div className={styles.historyDetails}>
                  <p className={styles.historyDesc}>{activity.actionDescription}</p>
                  <span className={styles.historyTime}>{safeFormatDistance(activity.timestamp)}</span>
                </div>
                <Badge variant="status" value={activity.status}>{activity.status}</Badge>
              </div>
            ))
          ) : (
            <p className={styles.noHistory}>No recent activity for this agent.</p>
          )}
          <Link to="/activity" className={styles.viewFullActivity}>
            View full activity
          </Link>
        </div>
      </div>

      <div className={styles.decisionArea}>
        <div className={styles.decisionCard}>
          {approval.status === 'pending' ? (
            <>
              <h2 className={styles.decisionTitle}>Make a decision</h2>
              <p className={styles.decisionSubtitle}>This action will take effect immediately after your decision.</p>
              
              <div className={styles.decisionButtons}>
                <Button variant="primary" onClick={handleApprove} className={styles.btnApprove}>
                  <CheckCircle size={18} />
                  Approve
                </Button>
                <Button variant="danger" onClick={handleReject} className={styles.btnReject}>
                  <XCircle size={18} />
                  Reject
                </Button>
                <Button variant="secondary" className={styles.btnMoreInfo}>
                  <MessageSquare size={18} />
                  Request more information
                </Button>
              </div>
            </>
          ) : (
            <div className={`${styles.decisionResult} ${approval.status === 'approved' ? styles.resultApproved : styles.resultRejected}`}>
              {approval.status === 'approved' ? (
                <>
                  <CheckCircle size={24} />
                  <h2>Action approved</h2>
                  <p>Approved by {approval.decidedBy} at {approval.decidedAt ? format(new Date(approval.decidedAt), 'PPpp') : 'Unknown'}</p>
                </>
              ) : (
                <>
                  <XCircle size={24} />
                  <h2>Action rejected</h2>
                  <p>Rejected by {approval.decidedBy} at {approval.decidedAt ? format(new Date(approval.decidedAt), 'PPpp') : 'Unknown'}</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
