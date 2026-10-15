import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useActivityStore } from '../store/activityStore';
import { useAgentStore } from '../store/agentStore';
import { Badge } from '../components/ui/Badge';
import { FilterBar } from '../components/ui/FilterBar';
import { SearchInput } from '../components/ui/SearchInput';
import { format } from 'date-fns';
import styles from './Audit.module.css';

export function Audit() {
  const navigate = useNavigate();
  const activities = useActivityStore(state => state.activities || []);
  const agents = useAgentStore(state => state.agents || []);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');
  const [decisionFilter, setDecisionFilter] = useState('All');
  const [actorFilter, setActorFilter] = useState('All');

  const riskOptions = ['All', 'Low', 'Medium', 'High', 'Critical'];
  const decisionOptions = ['All', 'Allowed', 'Blocked', 'Approved', 'Rejected', 'Approval Required', 'Completed'];
  const actorOptions = ['All', 'System', 'Manoj'];

  const getAgentName = (agentId: string) => {
    const agent = agents.find((a: any) => a.id === agentId);
    return agent ? agent.name : 'Unknown Agent';
  };

  const filteredEvents = useMemo(() => {
    return activities.filter((activity: any) => {
      const agentName = getAgentName(activity.agentId);
      const q = searchTerm.toLowerCase().trim();

      const matchSearch = !q ||
        (activity.action && activity.action.toLowerCase().includes(q)) ||
        (activity.actionDescription && activity.actionDescription.toLowerCase().includes(q)) ||
        (activity.system && activity.system.toLowerCase().includes(q)) ||
        (activity.dataInvolved && activity.dataInvolved.toLowerCase().includes(q)) ||
        (activity.policyName && activity.policyName.toLowerCase().includes(q)) ||
        agentName.toLowerCase().includes(q);

      const matchRisk = riskFilter === 'All' || 
        (activity.risk && activity.risk.toLowerCase() === riskFilter.toLowerCase());

      const normalizedStatus = (activity.status || '').replace(/_/g, ' ').toLowerCase();
      const matchDecision = decisionFilter === 'All' || 
        normalizedStatus === decisionFilter.toLowerCase();

      const actor = activity.actor || (activity.approvedBy ? 'Manoj' : 'System');
      const matchActor = actorFilter === 'All' || actor.toLowerCase() === actorFilter.toLowerCase();
      
      return matchSearch && matchRisk && matchDecision && matchActor;
    });
  }, [activities, agents, searchTerm, riskFilter, decisionFilter, actorFilter]);

  const handleRowClick = (id: string) => {
    navigate(`/activity/${id}`);
  };

  const formatSafeDate = (ts: string, formatStr: string) => {
    try {
      if (!ts) return '--:--';
      const d = new Date(ts);
      return isNaN(d.getTime()) ? '--:--' : format(d, formatStr);
    } catch {
      return '--:--';
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Audit</h1>
        <p className={styles.subtitle}>
          Maintain a tamper-evident record of agent actions, policy decisions and human interventions.
        </p>
      </header>

      <div className={styles.filters}>
        <SearchInput 
          value={searchTerm} 
          onChange={setSearchTerm} 
          placeholder="Search audit logs by agent, action, policy or system..." 
        />
        <div className={styles.filterGroup}>
          <FilterBar 
            options={riskOptions}
            value={riskFilter}
            onChange={setRiskFilter}
            label="Risk"
          />
          <FilterBar 
            options={decisionOptions}
            value={decisionFilter}
            onChange={setDecisionFilter}
            label="Decision"
          />
          <FilterBar 
            options={actorOptions}
            value={actorFilter}
            onChange={setActorFilter}
            label="Actor"
          />
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Agent</th>
              <th>Action</th>
              <th>Policy</th>
              <th>Decision</th>
              <th>Actor</th>
              <th>Risk</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((event: any) => (
              <tr key={event.id} onClick={() => handleRowClick(event.id)} className={styles.tableRow}>
                <td title={formatSafeDate(event.timestamp, 'PPpp')}>
                  <span className={styles.timestamp}>
                    {formatSafeDate(event.timestamp, 'HH:mm')}
                  </span>
                </td>
                <td>
                  <Link 
                    to={`/agents/${event.agentId}`} 
                    className={styles.agentLink}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {getAgentName(event.agentId)}
                  </Link>
                </td>
                <td className={styles.actionCell} title={event.actionDescription || event.action}>
                  {event.actionDescription || event.action}
                </td>
                <td>
                  {event.policyId ? (
                    <Link 
                      to={`/policies/${event.policyId}`}
                      className={styles.policyLink}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {event.policyName}
                    </Link>
                  ) : (
                    <span className={styles.emptyPolicy}>-</span>
                  )}
                </td>
                <td>
                  <Badge variant="status" value={event.status}>
                    {(event.status || '').replace(/_/g, ' ')}
                  </Badge>
                </td>
                <td>
                  <span className={styles.actor}>{event.actor || (event.approvedBy ? 'Manoj' : 'System')}</span>
                </td>
                <td>
                  <Badge variant="risk" value={event.risk}>
                    {event.risk}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredEvents.length === 0 && (
          <div className={styles.emptyState}>
            No audit records match your criteria.
          </div>
        )}
      </div>

      {/* Mobile Card Layout */}
      <div className={styles.mobileCards}>
        {filteredEvents.map((event: any) => (
          <div key={event.id} className={styles.card} onClick={() => handleRowClick(event.id)}>
            <div className={styles.cardHeader}>
              <span className={styles.timestamp}>{formatSafeDate(event.timestamp, 'MMM d, HH:mm')}</span>
              <Badge variant="risk" value={event.risk}>{event.risk}</Badge>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.cardAgent}>{getAgentName(event.agentId)}</div>
              <div className={styles.cardAction}>{event.actionDescription || event.action}</div>
              <div className={styles.cardBadges}>
                <Badge variant="status" value={event.status}>{(event.status || '').replace(/_/g, ' ')}</Badge>
                <span className={styles.actorBadge}>{event.actor || (event.approvedBy ? 'Manoj' : 'System')}</span>
              </div>
            </div>
          </div>
        ))}
        {filteredEvents.length === 0 && (
          <div className={styles.emptyState}>
            No audit records match your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
