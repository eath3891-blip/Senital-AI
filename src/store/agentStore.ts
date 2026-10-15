import { create } from 'zustand';
import { Agent } from '../types';
import { mockAgents } from '../mock/agents';

interface AgentStore {
  agents: Agent[];
  getAgent: (id: string) => Agent | undefined;
  getAgentsByRisk: (risk: string) => Agent[];
  getAgentsByStatus: (status: string) => Agent[];
  getAgentsByAutonomy: (autonomy: string) => Agent[];
}

export const useAgentStore = create<AgentStore>((set, get) => ({
  agents: mockAgents,
  getAgent: (id) => get().agents.find(a => a.id === id),
  getAgentsByRisk: (risk) => get().agents.filter(a => a.risk === risk),
  getAgentsByStatus: (status) => get().agents.filter(a => a.status === status),
  getAgentsByAutonomy: (autonomy) => get().agents.filter(a => a.autonomy === autonomy),
}));
