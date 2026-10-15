import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchInput } from '../components/ui/SearchInput';
import { FilterBar } from '../components/ui/FilterBar';
import { AgentCard } from '../components/agents/AgentCard';
import { useAgentStore } from '../store/agentStore';
import styles from './Agents.module.css';

export function Agents() {
  const navigate = useNavigate();
  const agents = useAgentStore((s: any) => s.agents);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({
    status: 'all',
    risk: 'all',
    autonomy: 'all'
  });

  const filteredAgents = useMemo(() => {
    return (agents || []).filter((agent: any) => {
      const q = search.toLowerCase().trim();
      const matchSearch = !q || 
        (agent.name && agent.name.toLowerCase().includes(q)) ||
        (agent.description && agent.description.toLowerCase().includes(q)) ||
        (agent.ownerTeam && agent.ownerTeam.toLowerCase().includes(q)) ||
        (agent.owner && agent.owner.toLowerCase().includes(q));
      
      const matchStatus = !filters.status || filters.status === 'all' || agent.status === filters.status;
      const matchRisk = !filters.risk || filters.risk === 'all' || agent.risk === filters.risk;
      const matchAutonomy = !filters.autonomy || filters.autonomy === 'all' || agent.autonomy === filters.autonomy;

      return matchSearch && matchStatus && matchRisk && matchAutonomy;
    });
  }, [agents, search, filters]);

  const filterOptions = [
    {
      id: 'status',
      label: 'Status',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' }
      ]
    },
    {
      id: 'risk',
      label: 'Risk',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
        { label: 'Critical', value: 'critical' }
      ]
    },
    {
      id: 'autonomy',
      label: 'Autonomy',
      options: [
        { label: 'Observe', value: 'observe' },
        { label: 'Advise', value: 'advise' },
        { label: 'Approval Required', value: 'approval_required' },
        { label: 'Autonomous', value: 'autonomous' }
      ]
    }
  ];

  const filterItems = filterOptions.map(f => ({
    ...f,
    value: filters[f.id] || 'all'
  }));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Agents</h1>
        <p className={styles.subtitle}>
          Understand what your AI agents can access, what they are doing and how they are governed.
        </p>
      </div>

      <div className={styles.controls}>
        <SearchInput 
          value={search} 
          onChange={setSearch} 
          placeholder="Search agents by name, description, or owner..." 
        />
        <FilterBar 
          filters={filterItems} 
          onChange={(id, val) => setFilters(prev => ({ ...prev, [id]: val }))}
          onReset={() => setFilters({ status: 'all', risk: 'all', autonomy: 'all' })}
        />
      </div>

      {filteredAgents.length > 0 ? (
        <div className={styles.grid}>
          {filteredAgents.map((agent: any) => (
            <AgentCard 
              key={agent.id} 
              agent={agent} 
              onClick={() => navigate(`/agents/${agent.id}`)} 
            />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          No agents found matching your criteria.
        </div>
      )}
    </div>
  );
}
