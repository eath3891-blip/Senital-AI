import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useActivityStore } from '../store/activityStore';
import { useAgentStore } from '../store/agentStore';
import { Badge } from '../components/ui/Badge';
import { FilterBar } from '../components/ui/FilterBar';
import { SearchInput } from '../components/ui/SearchInput';
import { format } from 'date-fns';
import { ChevronRight, FileText, Activity as ActivityIcon } from 'lucide-react';
import styles from './Activity.module.css';

export function Activity() {
  const activities = useActivityStore(state => state.activities || []);
  const agents = useAgentStore(state => state.agents || []);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [agentFilter, setAgentFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const agentOptions = [
    'All',
    'Financial Analysis Agent',
    'Fraud Investigation Agent',
    'Collections Assistant',
    'Revenue Forecast Agent',
    'Customer Support Agent'
  ];

  const riskOptions = ['All', 'Low', 'Medium', 'High', 'Critical'];
  const statusOptions = ['All', 'Allowed', 'Blocked', 'Approval Required', 'Completed'];

  const getAgentName = (agentId: string) => {
    const agent = agents.find((a: any) => a.id === agentId);
    return agent ? agent.name : 'Unknown Agent';
  };

  const filteredActivities = useMemo(() => {
    return activities.filter((activity: any) => {
      const agentName = getAgentName(activity.agentId);

      const q = searchTerm.toLowerCase().trim();
      const matchSearch = !q || 
        (activity.action && activity.action.toLowerCase().includes(q)) ||
        (activity.actionDescription && activity.actionDescription.toLowerCase().includes(q)) ||
        (activity.system && activity.system.toLowerCase().includes(q)) ||
        (activity.dataInvolved && activity.dataInvolved.toLowerCase().includes(q)) ||
        agentName.toLowerCase().includes(q);

      const matchAgent = agentFilter === 'All' || agentName === agentFilter;
      
      const matchRisk = riskFilter === 'All' || 
        (activity.risk && activity.risk.toLowerCase() === riskFilter.toLowerCase());
      
      const normalizedStatus = (activity.status || '').replace(/_/g, ' ').toLowerCase();
      const matchStatus = statusFilter === 'All' || 
        normalizedStatus === statusFilter.toLowerCase();
      
      return matchSearch && matchAgent && matchRisk && matchStatus;
    });
  }, [activities, agents, searchTerm, agentFilter, riskFilter, statusFilter]);

  const getStatusColor = (status: string) => {
    const s = (status || '').toLowerCase().replace(/_/g, ' ');
    switch (s) {
      case 'allowed':
      case 'completed':
        return styles.statusGreen;
      case 'blocked':
        return styles.statusRed;
      case 'approval required':
      case 'pending':
        return styles.statusAmber;
      default:
        return styles.statusGray;
    }
  };

  const formatSafeTime = (ts: string) => {
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
        <h1 className={styles.title}>Activity</h1>
        <p className={styles.subtitle}>
          Trace what your agents are doing across systems, policies and decisions in real time.
        </p>
      </header>

      <div className={styles.filters}>
        <SearchInput 
          value={searchTerm} 
          onChange={setSearchTerm} 
          placeholder="Search activity by action, system, data or agent..." 
        />
        <div className={styles.filterGroup}>
          <FilterBar 
            options={agentOptions}
            value={agentFilter}
            onChange={setAgentFilter}
            label="Agent"
          />
          <FilterBar 
            options={riskOptions}
            value={riskFilter}
            onChange={setRiskFilter}
            label="Risk"
          />
          <FilterBar 
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            label="Status"
          />
        </div>
      </div>

      <div className={styles.timelineContainer}>
        {filteredActivities.length === 0 ? (
          <div className={styles.emptyState}>
            <ActivityIcon className={styles.emptyIcon} size={48} />
            <p>No activity matches your filters.</p>
          </div>
        ) : (
          <div className={styles.timeline}>
            {filteredActivities.map((activity: any) => (
              <div key={activity.id} className={styles.timelineItem}>
                <div className={styles.timeWrapper}>
                  <span className={styles.time}>
                    {formatSafeTime(activity.timestamp)}
                  </span>
                </div>
                <div className={styles.timelineLine}>
                  <div className={`${styles.timelineDot} ${getStatusColor(activity.status)}`} />
                </div>
                <div className={styles.contentWrapper}>
                  <Link to={`/activity/${activity.id}`} className={styles.activityCard}>
                    <div className={styles.activityHeader}>
                      <span className={styles.agentName}>
                        {getAgentName(activity.agentId)}
                      </span>
                    </div>
                    <div className={styles.actionDesc}>
                      {activity.actionDescription || activity.action}
                    </div>
                    
                    <div className={styles.metaRow}>
                      <Badge variant="risk" value={activity.risk} size="sm">
                        {activity.risk}
                      </Badge>
                      <Badge variant="status" value={activity.status} size="sm">
                        {(activity.status || '').replace(/_/g, ' ')}
                      </Badge>
                    </div>

                    {activity.policyName && (
                      <div className={styles.policyInfo}>
                        <FileText size={14} />
                        <span>{activity.policyName}</span>
                      </div>
                    )}
                    
                    <div className={styles.chevron}>
                      <ChevronRight size={18} />
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
