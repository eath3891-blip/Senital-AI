import { create } from 'zustand';
import { AuditEvent } from '../types';
import { mockAuditEvents } from '../mock/auditEvents';

interface AuditStore {
  events: AuditEvent[];
  addEvent: (event: AuditEvent) => void;
}

export const useAuditStore = create<AuditStore>((set) => ({
  events: mockAuditEvents,
  addEvent: (event) => set(state => ({ events: [event, ...state.events] })),
}));
