import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  Bot, 
  Clock, 
  ShieldAlert, 
  Shield, 
  ChevronRight 
} from 'lucide-react';
import { useAgentStore } from '../store/agentStore';
import { useApprovalStore } from '../store/approvalStore';
import { useActivityStore } from '../store/activityStore';
import { Badge } from '../components/ui/Badge';
import styles from './Overview.module.css';

export const Overview: React.FC = () => {
  const agents = useAgentStore((s) => s.agents);
  const pendingCount = useApprovalStore((s) => s.getPendingCount());
  const activities = useActivityStore((s) => s.activities);

  // Computed metrics
  const activeAgentsCount = agents.filter(a => a.status === 'active').length;
  
  const highRiskEventsToday = activities.filter(
    a => (a.risk === 'high' || a.risk === 'critical')
  ).length;

  const policyDecisionsToday = activities.filter(
    a => Boolean(a.policyId || a.decision)
  ).length;

  // Recent activities
  const recentActivities = useMemo(() => {
    return [...activities]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 6);
  }, [activities]);

  // Risk distribution
  const riskCounts = useMemo(() => {
    const counts = { low: 0, medium: 0, high: 0, critical: 0 };
    activities.forEach(a => {
      if (counts[a.risk as keyof typeof counts] !== undefined) {
        counts[a.risk as keyof typeof counts]++;
      }
    });
    return counts;
  }, [activities]);

  const totalRisk = activities.length || 1;

  // Autonomy distribution
  const autonomyCounts = useMemo(() => {
    const counts = { observe: 0, advise: 0, approval_required: 0, autonomous: 0 };
    agents.forEach(a => {
      if (counts[a.autonomy as keyof typeof counts] !== undefined) {
        counts[a.autonomy as keyof typeof counts]++;
      }
    });
    return counts;
  }, [agents]);

  const totalAgents = agents.length || 1;

  // Attention items representing the 3 core governance scenarios
  const attentionItems = [
    {
      agentId: 'financial-analysis-agent',
      targetUrl: '/approvals/apr-001',
      name: 'Financial Analysis Agent',
      desc: 'High-risk action requesting customer financial data',
      status: 'Approval required',
      risk: 'pending',
      time: '10m ago',
      actionPrompt: 'Review approval'
    },
    {
      agentId: 'collections-assistant',
      targetUrl: '/activity/act-003',
      name: 'Collections Assistant',
      desc: 'Attempted to access restricted customer records',
      status: 'Blocked',
      risk: 'high',
      time: '1h ago',
      actionPrompt: 'Investigate block'
    },
    {
      agentId: 'revenue-forecast-agent',
      targetUrl: '/approvals/apr-002',
      name: 'Revenue Forecast Agent',
      desc: 'Requested production API access',
      status: 'Pending review',
      risk: 'medium',
      time: '2h ago',
      actionPrompt: 'Review request'
    }
  ];

  const safeFormatTime = (ts: string | undefined | null) => {
    try {
      if (!ts) return '--:--';
      const d = new Date(ts);
      return isNaN(d.getTime()) ? '--:--' : format(d, 'HH:mm');
    } catch {
      return '--:--';
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Overview</h1>
        <p className={styles.subtitle}>
          Monitor AI agents, emerging risks and human decisions across your organization.
        </p>
      </header>

      {/* KPI Grid */}
      <section className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <Bot className={`${styles.kpiIcon} ${styles.accent}`} />
            <span className={styles.kpiLabel}>Active Agents</span>
          </div>
          <div className={styles.kpiValue}>{activeAgentsCount}</div>
          <p className={styles.kpiDesc}>Currently running tasks</p>
        </div>
        
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <Clock className={`${styles.kpiIcon} ${styles.pending}`} />
            <span className={styles.kpiLabel}>Pending Approvals</span>
          </div>
          <div className={styles.kpiValue}>{pendingCount}</div>
          <p className={styles.kpiDesc}>Awaiting human review</p>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <ShieldAlert className={`${styles.kpiIcon} ${styles.highRisk}`} />
            <span className={styles.kpiLabel}>High Risk Events</span>
          </div>
          <div className={styles.kpiValue}>{highRiskEventsToday}</div>
          <p className={styles.kpiDesc}>Last 24 hours</p>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <Shield className={`${styles.kpiIcon} ${styles.accent}`} />
            <span className={styles.kpiLabel}>Policy Decisions Today</span>
          </div>
          <div className={styles.kpiValue}>{policyDecisionsToday}</div>
          <p className={styles.kpiDesc}>Automated rule enforcements</p>
        </div>
      </section>

      {/* Needs Attention */}
      <section>
        <h2 className={styles.sectionTitle}>Needs attention</h2>
        <div className={styles.needsAttentionList}>
          {attentionItems.map((item, idx) => (
            <Link to={item.targetUrl} key={idx} className={`${styles.attentionCard} ${styles[item.risk]}`}>
              <div className={styles.attentionContent}>
                <span className={styles.attentionAgent}>{item.name}</span>
                <p className={styles.attentionDesc}>{item.desc}</p>
              </div>
              <div className={styles.attentionMeta}>
                <Badge variant={item.risk === 'high' ? 'error' : item.risk === 'pending' ? 'warning' : 'default'}>
                  {item.status}
                </Badge>
                <span className={styles.attentionTime}>{item.time}</span>
                <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-accent)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  {item.actionPrompt}
                  <ChevronRight size={16} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Two Column Layout */}
      <div className={styles.mainLayout}>
        {/* Left: Activity Timeline */}
        <section className={styles.cardSection}>
          <h2 className={styles.cardSectionTitle}>
            Recent activity
            <Link to="/activity" className={styles.viewAll}>View all</Link>
          </h2>
          <div className={styles.activityList}>
            {recentActivities.map(activity => {
              const agent = agents.find(a => a.id === activity.agentId);
              return (
                <div key={activity.id} className={styles.activityItem}>
                  <div className={styles.activityTime}>
                    {safeFormatTime(activity.timestamp)}
                  </div>
                  <div className={styles.activityContent}>
                    <Link to={`/agents/${activity.agentId}`} className={styles.activityAgent}>
                      {agent?.name || 'Unknown Agent'}
                    </Link>
                    <p className={styles.activityDesc}>{activity.actionDescription}</p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Badge variant="risk" value={activity.risk} size="sm" />
                      <Badge variant="status" value={activity.status} size="sm">
                        {activity.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right Sidebar */}
        <aside className={styles.sidebar}>
          {/* Risk distribution */}
          <section className={styles.cardSection}>
            <h2 className={styles.cardSectionTitle}>Risk distribution</h2>
            
            <div className={styles.stackedBar}>
              <div className={styles.barSegment} style={{ width: `${(riskCounts.low / totalRisk) * 100}%`, backgroundColor: 'var(--color-risk-low)' }} />
              <div className={styles.barSegment} style={{ width: `${(riskCounts.medium / totalRisk) * 100}%`, backgroundColor: 'var(--color-risk-medium)' }} />
              <div className={styles.barSegment} style={{ width: `${(riskCounts.high / totalRisk) * 100}%`, backgroundColor: 'var(--color-risk-high)' }} />
              <div className={styles.barSegment} style={{ width: `${(riskCounts.critical / totalRisk) * 100}%`, backgroundColor: 'var(--color-risk-critical)' }} />
            </div>
            
            <div className={styles.legend}>
              <div className={styles.legendItem}>
                <div className={styles.legendDot} style={{ backgroundColor: 'var(--color-risk-low)' }} />
                <span>Low ({riskCounts.low})</span>
              </div>
              <div className={styles.legendItem}>
                <div className={styles.legendDot} style={{ backgroundColor: 'var(--color-risk-medium)' }} />
                <span>Medium ({riskCounts.medium})</span>
              </div>
              <div className={styles.legendItem}>
                <div className={styles.legendDot} style={{ backgroundColor: 'var(--color-risk-high)' }} />
                <span>High ({riskCounts.high})</span>
              </div>
              <div className={styles.legendItem}>
                <div className={styles.legendDot} style={{ backgroundColor: 'var(--color-risk-critical)' }} />
                <span>Critical ({riskCounts.critical})</span>
              </div>
            </div>
          </section>

          {/* Agent autonomy */}
          <section className={styles.cardSection}>
            <h2 className={styles.cardSectionTitle}>Agent autonomy</h2>
            
            <div className={styles.autonomyList}>
              <div className={styles.autonomyRow}>
                <div className={styles.autonomyHeader}>
                  <div className={styles.legendDot} style={{ backgroundColor: '#999' }} />
                  <span className={styles.autonomyLabel}>Observe</span>
                  <span className={styles.autonomyCount}>{autonomyCounts.observe}</span>
                </div>
                <div className={styles.progressBarContainer}>
                  <div className={styles.progressBar} style={{ width: `${(autonomyCounts.observe / totalAgents) * 100}%`, backgroundColor: '#999' }} />
                </div>
              </div>
              
              <div className={styles.autonomyRow}>
                <div className={styles.autonomyHeader}>
                  <div className={styles.legendDot} style={{ backgroundColor: '#2B5CE6' }} />
                  <span className={styles.autonomyLabel}>Advise</span>
                  <span className={styles.autonomyCount}>{autonomyCounts.advise}</span>
                </div>
                <div className={styles.progressBarContainer}>
                  <div className={styles.progressBar} style={{ width: `${(autonomyCounts.advise / totalAgents) * 100}%`, backgroundColor: '#2B5CE6' }} />
                </div>
              </div>

              <div className={styles.autonomyRow}>
                <div className={styles.autonomyHeader}>
                  <div className={styles.legendDot} style={{ backgroundColor: 'var(--color-status-pending)' }} />
                  <span className={styles.autonomyLabel}>Approval required</span>
                  <span className={styles.autonomyCount}>{autonomyCounts.approval_required}</span>
                </div>
                <div className={styles.progressBarContainer}>
                  <div className={styles.progressBar} style={{ width: `${(autonomyCounts.approval_required / totalAgents) * 100}%`, backgroundColor: 'var(--color-status-pending)' }} />
                </div>
              </div>

              <div className={styles.autonomyRow}>
                <div className={styles.autonomyHeader}>
                  <div className={styles.legendDot} style={{ backgroundColor: 'var(--color-status-active)' }} />
                  <span className={styles.autonomyLabel}>Autonomous</span>
                  <span className={styles.autonomyCount}>{autonomyCounts.autonomous}</span>
                </div>
                <div className={styles.progressBarContainer}>
                  <div className={styles.progressBar} style={{ width: `${(autonomyCounts.autonomous / totalAgents) * 100}%`, backgroundColor: 'var(--color-status-active)' }} />
                </div>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};
