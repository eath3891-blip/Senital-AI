import { create } from 'zustand';
import { Activity } from '../types';
import { mockActivities } from '../mock/activities';

interface ActivityStore {
  activities: Activity[];
  addActivity: (activity: Activity) => void;
  getActivitiesByAgent: (agentId: string) => Activity[];
  getActivity: (id: string) => Activity | undefined;
}

export const useActivityStore = create<ActivityStore>((set, get) => ({
  activities: mockActivities,
  addActivity: (activity) => set(state => ({ activities: [activity, ...state.activities] })),
  getActivitiesByAgent: (agentId) => get().activities.filter(a => a.agentId === agentId),
  getActivity: (id) => get().activities.find(a => a.id === id),
}));
