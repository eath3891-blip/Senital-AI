import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAgentStore } from '../store/agentStore';
import { useActivityStore } from '../store/activityStore';
import { useApprovalStore } from '../store/approvalStore';
import { usePolicyStore } from '../store/policyStore';
import { useSystemStore } from '../store/systemStore';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { RiskIndicator } from '../components/ui/RiskIndicator';
import { Tabs } from '../components/ui/Tabs';
import { format } from 'date-fns';
import { 
  CheckCircle2, 
  XCircle, 
  Database, 
  FileText, 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import styles from './AgentDetail.module.css';

const AUTONOMY_LEVELS = [
  { level: 'observe', label: 'Observe', desc: 'The agent can only observe and report. No actions are taken.' },
  { level: 'advise', label: 'Advise', desc: 'The agent can analyze and suggest actions but cannot execute them.' },
  { level: 'approval_required', label: 'Approval Required', desc: 'The agent can analyze and prepare actions, but sensitive actions require human approval.' },
  { level: 'autonomous', label: 'Autonomous', desc: 'The agent can take actions independently within policy boundaries.' }
];

const safeFormat = (dateVal?: string | Date, formatStr: string = 'MMM d, yyyy'): string => {
  if (!dateVal) return 'Unknown';
  try {
    const d = typeof dateVal === 'string' ? new Date(dateVal) : dateVal;
    if (isNaN(d.getTime())) return 'Unknown';
    return format(d, formatStr);
  } catch {
    return 'Unknown';
  }
};

export function AgentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const agents = useAgentStore((s) => s.agents);
  const agent = agents.find((a) => a.id === id);

  const activities = useActivityStore((s) => s.activities).filter((a) => a.agentId === id);
  const approvals = useApprovalStore((s) => s.approvals).filter((a) => a.agentId === id);
  const allPolicies = usePolicyStore((s) => s.policies);
  const allSystems = useSystemStore((s) => s.systems);

  const policies = allPolicies.filter((p) => agent?.policies?.includes(p.id));
  const systems = allSystems.filter((sys) => agent?.connectedSystems?.includes(sys.id));

  if (!agent) {
    return (
      <div className={styles.container}>
        <Link to="/agents" className={styles.backLink}>
          ← Back to Agents
        </Link>
        <div style={{ padding: '64px 0', textAlign: 'center' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '12px' }}>Agent not found</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
            The requested agent profile could not be located.
          </p>
          <Button variant="primary" onClick={() => navigate('/agents')}>
            View all agents
          </Button>
        </div>
      </div>
    );
  }

  const getRiskColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case 'low': return 'var(--color-risk-low)';
      case 'medium': return 'var(--color-risk-medium)';
      case 'high': return 'var(--color-risk-high)';
      case 'critical': return 'var(--color-risk-critical)';
      default: return 'var(--color-risk-low)';
    }
  };

  const currentAutonomy = AUTONOMY_LEVELS.find(
    a => a.level === agent.autonomy?.toLowerCase()
  ) || AUTONOMY_LEVELS[2]; // Default to Approval Required

  // Check if this agent has pending attention items
  const pendingApproval = approvals.find(a => a.status === 'pending');
  const blockedActivity = activities.find(a => a.status === 'blocked');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'activity', label: 'Activity', count: activities.length },
    { id: 'approvals', label: 'Approvals', count: approvals.filter(a => a.status === 'pending').length || undefined }
  ];

  return (
    <div className={styles.container}>
      <Link to="/agents" className={styles.backLink}>
        ← Agents
      </Link>

      {/* Attention Alert Banner if agent requires immediate action */}
      {pendingApproval && (
        <div className={styles.attentionBanner}>
          <div className={styles.bannerLeft}>
            <AlertTriangle size={22} className={styles.bannerIcon} />
            <div>
              <div className={styles.bannerTitle}>
                Human Approval Required: {pendingApproval.actionDescription}
              </div>
              <div className={styles.bannerDesc}>
                {pendingApproval.reason || 'This agent has initiated a high-risk request that requires governance approval before it can proceed.'}
              </div>
            </div>
          </div>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => navigate(`/approvals/${pendingApproval.id}`)}
          >
            Review & Decide →
          </Button>
        </div>
      )}

      {!pendingApproval && blockedActivity && (
        <div className={`${styles.attentionBanner} ${styles.bannerBlocked}`}>
          <div className={styles.bannerLeft}>
            <ShieldAlert size={22} className={styles.bannerIcon} />
            <div>
              <div className={styles.bannerTitle}>
                Policy Blocked: {blockedActivity.actionDescription}
              </div>
              <div className={styles.bannerDesc}>
                Automated policy enforcement prevented this agent from accessing restricted data at {safeFormat(blockedActivity.timestamp, 'HH:mm')}.
              </div>
            </div>
          </div>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => navigate(`/activity/${blockedActivity.id}`)}
          >
            Investigate Incident →
          </Button>
        </div>
      )}

      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div>
            <h1 className={styles.title}>{agent.name}</h1>
            <p className={styles.description}>{agent.description}</p>
            <div className={styles.badges}>
              <Badge variant="status" value={agent.status} />
              <Badge variant="risk" value={agent.risk} />
              <Badge variant="status" value={agent.autonomy}>
                {agent.autonomy?.replace('_', ' ')}
              </Badge>
            </div>
          </div>
          <Button variant="secondary" onClick={() => navigate('/ecosystem')}>
            Explore ecosystem
          </Button>
        </div>
      </div>

      <div className={styles.overviewGrid}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Owner</span>
          <span className={styles.metaValue}>{agent.owner}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Team</span>
          <span className={styles.metaValue}>{agent.ownerTeam}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Created</span>
          <span className={styles.metaValue}>
            {safeFormat(agent.created, 'MMM d, yyyy')}
          </span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Last Activity</span>
          <span className={styles.metaValue}>
            {safeFormat(agent.lastActivity, 'MMM d, yyyy HH:mm')}
          </span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Environment</span>
          <span className={styles.metaValue} style={{ textTransform: 'capitalize' }}>
            {agent.environment}
          </span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Agent Type</span>
          <span className={styles.metaValue} style={{ textTransform: 'capitalize' }}>
            {agent.type}
          </span>
        </div>
      </div>

      <Tabs tabs={tabs} defaultTab="overview">
        {(activeTab) => (
          <div style={{ marginTop: '32px' }}>
            {activeTab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
                  <div>
                    <h3 className={styles.sectionTitle}>What this agent can do</h3>
                    <div className={styles.permissionsList}>
                      {agent.permissions?.map((perm: string, i: number) => (
                        <div key={i} className={styles.permissionItem}>
                          <CheckCircle2 size={16} className={styles.iconAllow} />
                          <span>{perm}</span>
                        </div>
                      )) || <span style={{ color: 'var(--color-text-tertiary)', fontSize: 14 }}>No permissions specified.</span>}
                    </div>
                  </div>
                  <div>
                    <h3 className={styles.sectionTitle}>What this agent cannot do</h3>
                    <div className={styles.permissionsList}>
                      {agent.deniedPermissions?.map((perm: string, i: number) => (
                        <div key={i} className={styles.permissionItem}>
                          <XCircle size={16} className={styles.iconDeny} />
                          <span>{perm}</span>
                        </div>
                      )) || <span style={{ color: 'var(--color-text-tertiary)', fontSize: 14 }}>No restrictions specified.</span>}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className={styles.sectionTitle}>Connected systems</h3>
                  <div className={styles.systemsGrid}>
                    {systems.map((sys: any) => (
                      <Link key={sys.id} to={`/systems/${sys.id}`} className={styles.systemCard}>
                        <Database size={20} className={styles.systemIcon} />
                        <div className={styles.systemInfo}>
                          <span className={styles.systemName}>{sys.name}</span>
                          <Badge variant="neutral" value={sys.type} />
                        </div>
                      </Link>
                    ))}
                    {systems.length === 0 && (
                      <span style={{ color: 'var(--color-text-tertiary)', fontSize: 14 }}>No connected systems.</span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className={styles.sectionTitle}>Policies governing this agent</h3>
                  <div className={styles.policiesList}>
                    {policies.map((p: any) => (
                      <Link key={p.id} to={`/policies/${p.id}`} className={styles.policyCard}>
                        <FileText size={20} className={styles.policyIcon} />
                        <div className={styles.policyInfo}>
                          <span className={styles.policyName}>{p.name}</span>
                          <span className={styles.policyDesc}>{p.description}</span>
                        </div>
                      </Link>
                    ))}
                    {policies.length === 0 && (
                      <span style={{ color: 'var(--color-text-tertiary)', fontSize: 14 }}>No policies applied.</span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className={styles.sectionTitle}>Current risk assessment</h3>
                  <div 
                    className={styles.riskCard} 
                    style={{ borderLeftColor: getRiskColor(agent.risk) }}
                  >
                    <RiskIndicator level={agent.risk} size="lg" />
                    <p className={styles.riskDesc}>{agent.riskExplanation || 'High risk profile due to sensitive enterprise resource access.'}</p>
                  </div>
                </div>

                <div>
                  <h3 className={styles.sectionTitle}>Autonomy control</h3>
                  <div className={styles.autonomyStepper}>
                    {AUTONOMY_LEVELS.map(level => {
                      const isActive = level.level === currentAutonomy.level;
                      return (
                        <div 
                          key={level.level} 
                          className={`${styles.autonomyStep} ${isActive ? styles.autonomyStepActive : ''}`}
                        >
                          {level.label}
                        </div>
                      );
                    })}
                  </div>
                  <p className={styles.autonomyDesc}>{currentAutonomy.desc}</p>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div>
                <h3 className={styles.sectionTitle}>Recent Activity</h3>
                <div className={styles.activityList}>
                  {activities.map((act: any) => (
                    <Link 
                      key={act.id} 
                      to={`/activity/${act.id}`}
                      className={styles.activityItem}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <span className={styles.activityTime}>
                        {safeFormat(act.timestamp, 'HH:mm')}
                      </span>
                      <span className={styles.activityDesc}>
                        {act.actionDescription || act.action}
                      </span>
                      <Badge variant="status" value={act.status} />
                    </Link>
                  ))}
                  {activities.length === 0 && (
                    <span style={{ color: 'var(--color-text-tertiary)', fontSize: 14 }}>No recent activity.</span>
                  )}
                </div>
                <Link to="/activity" className={styles.viewAll} style={{ display: 'inline-block', marginTop: '16px' }}>
                  View all system activity →
                </Link>
              </div>
            )}

            {activeTab === 'approvals' && (
              <div>
                <h3 className={styles.sectionTitle}>Approval Requests</h3>
                <div className={styles.activityList}>
                  {approvals.map((app: any) => (
                    <Link 
                      key={app.id} 
                      to={`/approvals/${app.id}`} 
                      className={styles.activityItem} 
                      style={{ textDecoration: 'none' }}
                    >
                      <span className={styles.activityTime}>
                        {safeFormat(app.requestedAt, 'MMM d, HH:mm')}
                      </span>
                      <span className={styles.activityDesc}>
                        {app.actionDescription}
                      </span>
                      <Badge variant="risk" value={app.risk} />
                      <Badge variant="status" value={app.status} />
                    </Link>
                  ))}
                  {approvals.length === 0 && (
                    <span style={{ color: 'var(--color-text-tertiary)', fontSize: 14 }}>No approval requests for this agent.</span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Tabs>
    </div>
  );
}
