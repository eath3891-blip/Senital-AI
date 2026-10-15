import { create } from 'zustand';
import { ConnectedSystem } from '../types';
import { mockSystems } from '../mock/systems';

interface SystemStore {
  systems: ConnectedSystem[];
  getSystem: (id: string) => ConnectedSystem | undefined;
}

export const useSystemStore = create<SystemStore>((set, get) => ({
  systems: mockSystems,
  getSystem: (id) => get().systems.find(s => s.id === id),
}));
