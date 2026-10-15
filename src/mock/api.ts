/**
 * Mock API Layer
 * 
 * Simulates realistic API boundaries for the Sentinel AI prototype.
 * All functions return promises to mirror actual API behavior.
 * Data is read from / written to Zustand stores.
 */

import { useAgentStore } from '../store/agentStore';
import { useApprovalStore } from '../store/approvalStore';
import { useActivityStore } from '../store/activityStore';
import { usePolicyStore } from '../store/policyStore';
import { useSystemStore } from '../store/systemStore';
import { useAuditStore } from '../store/auditStore';
import type { Agent, Approval, Activity, Policy, ConnectedSystem, AuditEvent } from '../types';

// Simulate network delay
const delay = (ms: number = 0) => new Promise(resolve => setTimeout(resolve, ms));

// ─── Agents ──────────────────────────────────────────────

export async function getAgents(): Promise<Agent[]> {
  await delay();
  return useAgentStore.getState().agents;
}

export async function getAgent(id: string): Promise<Agent | undefined> {
  await delay();
  return useAgentStore.getState().getAgent(id);
}

export async function getAgentActivity(agentId: string): Promise<Activity[]> {
  await delay();
  return useActivityStore.getState().getActivitiesByAgent(agentId);
}

// ─── Approvals ───────────────────────────────────────────

export async function getApprovals(): Promise<Approval[]> {
  await delay();
  return useApprovalStore.getState().approvals;
}

export async function getApproval(id: string): Promise<Approval | undefined> {
  await delay();
  return useApprovalStore.getState().getApproval(id);
}

export async function approveAction(id: string, actor: string = 'Manoj'): Promise<void> {
  await delay();
  useApprovalStore.getState().approveAction(id, actor);
}

export async function rejectAction(id: string, actor: string = 'Manoj', reason?: string): Promise<void> {
  await delay();
  useApprovalStore.getState().rejectAction(id, actor, reason);
}

// ─── Policies ────────────────────────────────────────────

export async function getPolicies(): Promise<Policy[]> {
  await delay();
  return usePolicyStore.getState().policies;
}

export async function getPolicy(id: string): Promise<Policy | undefined> {
  await delay();
  return usePolicyStore.getState().getPolicy(id);
}

export async function createPolicy(policy: Policy): Promise<void> {
  await delay();
  usePolicyStore.getState().addPolicy(policy);
}

// ─── Activity ────────────────────────────────────────────

export async function getActivities(): Promise<Activity[]> {
  await delay();
  return useActivityStore.getState().activities;
}

export async function getActivity(id: string): Promise<Activity | undefined> {
  await delay();
  return useActivityStore.getState().getActivity(id);
}

// ─── Systems ─────────────────────────────────────────────

export async function getSystems(): Promise<ConnectedSystem[]> {
  await delay();
  return useSystemStore.getState().systems;
}

export async function getSystem(id: string): Promise<ConnectedSystem | undefined> {
  await delay();
  return useSystemStore.getState().getSystem(id);
}

// ─── Audit ───────────────────────────────────────────────

export async function getAuditEvents(): Promise<AuditEvent[]> {
  await delay();
  return useAuditStore.getState().events;
}
