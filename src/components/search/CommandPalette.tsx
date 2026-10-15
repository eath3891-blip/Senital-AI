import React from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import { Bot, FileText, Database, Clock } from 'lucide-react';
import { useAgentStore } from '../../store/agentStore';
import { usePolicyStore } from '../../store/policyStore';
import { useSystemStore } from '../../store/systemStore';
import { useApprovalStore } from '../../store/approvalStore';
import styles from './CommandPalette.module.css';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const navigate = useNavigate();
  const agents = useAgentStore(state => state.agents);
  const policies = usePolicyStore(state => state.policies);
  const systems = useSystemStore(state => state.systems);
  const approvals = useApprovalStore(state => state.approvals).filter(a => a.status === 'pending');

  const onSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <Command.Dialog 
      open={isOpen} 
      onOpenChange={(open) => !open && onClose()}
      label="Global Command Menu"
    >
      <Command.Input 
        placeholder="Search agents, policies, systems..." 
      />
      <Command.List>
        <Command.Empty>No results found.</Command.Empty>
        
        <Command.Group heading="Agents">
          {agents.map(agent => (
            <Command.Item 
              key={agent.id} 
              onSelect={() => onSelect(`/agents/${agent.id}`)}
            >
              <Bot size={16} className={styles.itemIcon} />
              <span className={styles.itemTitle}>{agent.name}</span>
              <span className={styles.itemSubtitle}>{agent.ownerTeam}</span>
            </Command.Item>
          ))}
        </Command.Group>
        
        <Command.Group heading="Policies">
          {policies.map(policy => (
            <Command.Item 
              key={policy.id} 
              onSelect={() => onSelect(`/policies/${policy.id}`)}
            >
              <FileText size={16} className={styles.itemIcon} />
              <span className={styles.itemTitle}>{policy.name}</span>
              <span className={styles.itemSubtitle}>{policy.scope}</span>
            </Command.Item>
          ))}
        </Command.Group>
        
        <Command.Group heading="Systems">
          {systems.map(system => (
            <Command.Item 
              key={system.id} 
              onSelect={() => onSelect(`/systems/${system.id}`)}
            >
              <Database size={16} className={styles.itemIcon} />
              <span className={styles.itemTitle}>{system.name}</span>
              <span className={styles.itemSubtitle}>{system.type}</span>
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Group heading="Approvals">
          {approvals.map(approval => (
            <Command.Item 
              key={approval.id} 
              onSelect={() => onSelect(`/approvals/${approval.id}`)}
            >
              <Clock size={16} className={styles.itemIcon} />
              <span className={styles.itemTitle}>{approval.actionDescription}</span>
              <span className={styles.itemSubtitle}>{approval.agentName}</span>
            </Command.Item>
          ))}
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}
