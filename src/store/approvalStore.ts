import { create } from 'zustand';
import { Approval, Activity, AuditEvent } from '../types';
import { mockApprovals } from '../mock/approvals';
import { useActivityStore } from './activityStore';
import { useAuditStore } from './auditStore';

interface ApprovalStore {
  approvals: Approval[];
  getApproval: (id: string) => Approval | undefined;
  getPendingApprovals: () => Approval[];
  getPendingCount: () => number;
  getApprovalsByAgent: (agentId: string) => Approval[];
  approveAction: (id: string, actor: string) => void;
  rejectAction: (id: string, actor: string, reason?: string) => void;
}

export const useApprovalStore = create<ApprovalStore>((set, get) => ({
  approvals: mockApprovals,
  getApproval: (id) => get().approvals.find(a => a.id === id),
  getPendingApprovals: () => get().approvals.filter(a => a.status === 'pending'),
  getPendingCount: () => get().approvals.filter(a => a.status === 'pending').length,
  getApprovalsByAgent: (agentId) => get().approvals.filter(a => a.agentId === agentId),
  
  approveAction: (id, actor) => {
    const now = new Date().toISOString();
    const approval = get().approvals.find(a => a.id === id);
    if (!approval) return;
    
    // Update approval status
    set(state => ({
      approvals: state.approvals.map(a => 
        a.id === id ? { ...a, status: 'approved' as const, decidedAt: now, decidedBy: actor } : a
      )
    }));
    
    // Add activity event
    const newActivity: Activity = {
      id: `act-approved-${id}`,
      agentId: approval.agentId,
      agentName: approval.agentName,
      action: `${approval.action}_approved`,
      actionDescription: `${approval.actionDescription} — approved by ${actor}`,
      system: approval.resource,
      systemId: '',
      dataInvolved: approval.resource,
      policyId: approval.policyId,
      policyName: approval.policyName,
      risk: approval.risk,
      status: 'allowed',
      decision: 'Approved',
      approver: actor,
      timestamp: now,
      technical: {
        requestId: `req-apv-${id}`,
        agentId: approval.agentId,
        policyId: approval.policyId,
        apiEndpoint: '/api/approvals/' + id + '/approve',
        responseCode: 200,
        executionDuration: '45ms',
        environment: 'production',
      }
    };
    useActivityStore.getState().addActivity(newActivity);
    
    // Add audit event
    const auditEvent: AuditEvent = {
      id: `aud-approved-${id}`,
      timestamp: now,
      agentId: approval.agentId,
      agentName: approval.agentName,
      action: approval.actionDescription,
      policyId: approval.policyId,
      policyName: approval.policyName,
      decision: 'Approved',
      actor: actor,
      risk: approval.risk,
      details: `Human approval granted by ${actor} for ${approval.agentName} to ${approval.actionDescription.toLowerCase()}.`
    };
    useAuditStore.getState().addEvent(auditEvent);
  },
  
  rejectAction: (id, actor, reason) => {
    const now = new Date().toISOString();
    const approval = get().approvals.find(a => a.id === id);
    if (!approval) return;
    
    set(state => ({
      approvals: state.approvals.map(a => 
        a.id === id ? { ...a, status: 'rejected' as const, decidedAt: now, decidedBy: actor } : a
      )
    }));
    
    const newActivity: Activity = {
      id: `act-rejected-${id}`,
      agentId: approval.agentId,
      agentName: approval.agentName,
      action: `${approval.action}_rejected`,
      actionDescription: `${approval.actionDescription} — rejected by ${actor}`,
      system: approval.resource,
      systemId: '',
      dataInvolved: approval.resource,
      policyId: approval.policyId,
      policyName: approval.policyName,
      risk: approval.risk,
      status: 'blocked',
      decision: 'Rejected',
      approver: actor,
      timestamp: now,
      technical: {
        requestId: `req-rej-${id}`,
        agentId: approval.agentId,
        policyId: approval.policyId,
        apiEndpoint: '/api/approvals/' + id + '/reject',
        responseCode: 200,
        executionDuration: '38ms',
        environment: 'production',
      }
    };
    useActivityStore.getState().addActivity(newActivity);
    
    const auditEvent: AuditEvent = {
      id: `aud-rejected-${id}`,
      timestamp: now,
      agentId: approval.agentId,
      agentName: approval.agentName,
      action: approval.actionDescription,
      policyId: approval.policyId,
      policyName: approval.policyName,
      decision: 'Rejected',
      actor: actor,
      risk: approval.risk,
      details: `Human approval denied by ${actor} for ${approval.agentName} to ${approval.actionDescription.toLowerCase()}.${reason ? ' Reason: ' + reason : ''}`
    };
    useAuditStore.getState().addEvent(auditEvent);
  },
}));
