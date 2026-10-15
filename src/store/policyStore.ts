import { create } from 'zustand';
import { Policy } from '../types';
import { mockPolicies } from '../mock/policies';

interface PolicyStore {
  policies: Policy[];
  getPolicy: (id: string) => Policy | undefined;
  addPolicy: (policy: Policy) => void;
}

export const usePolicyStore = create<PolicyStore>((set, get) => ({
  policies: mockPolicies,
  getPolicy: (id) => get().policies.find(p => p.id === id),
  addPolicy: (policy) => set(state => ({ policies: [policy, ...state.policies] })),
}));
