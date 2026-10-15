import { AuditEvent } from '../types';

export const mockAuditEvents: AuditEvent[] = [
  {
    id: 'aud-010',
    timestamp: '2026-09-25T10:42:00Z',
    agentId: 'financial-analysis-agent',
    agentName: 'Financial Analysis Agent',
    action: 'Customer transaction data access request',
    policyId: 'sensitive-data-policy',
    policyName: 'Sensitive Data Policy',
    decision: 'Pending Approval',
    actor: 'System',
    risk: 'high',
    details: 'Agent requested access to customer transaction data. Routed to approval queue per Sensitive Data Policy.'
  },
  {
    id: 'aud-009',
    timestamp: '2026-09-25T10:39:00Z',
    agentId: 'financial-analysis-agent',
    agentName: 'Financial Analysis Agent',
    action: 'Read financial transaction dataset',
    policyId: 'financial-data-policy',
    policyName: 'Financial Data Policy',
    decision: 'Allowed',
    actor: 'System',
    risk: 'low',
    details: 'Agent has appropriate read permissions for financial transaction dataset.'
  },
  {
    id: 'aud-008',
    timestamp: '2026-09-25T10:38:00Z',
    agentId: 'collections-assistant',
    agentName: 'Collections Assistant',
    action: 'Export restricted customer records',
    policyId: 'sensitive-data-policy',
    policyName: 'Sensitive Data Policy',
    decision: 'Blocked',
    actor: 'System',
    risk: 'high',
    details: 'Agent attempted to export restricted customer records. Automatically blocked by Sensitive Data Policy — agent does not have export permission for customer PII.'
  },
  {
    id: 'aud-007',
    timestamp: '2026-09-25T10:35:00Z',
    agentId: 'financial-analysis-agent',
    agentName: 'Financial Analysis Agent',
    action: 'Export customer records',
    policyId: 'sensitive-data-policy',
    policyName: 'Sensitive Data Policy',
    decision: 'Blocked',
    actor: 'System',
    risk: 'medium',
    details: 'Agent attempted to export customer records. Blocked by Sensitive Data Policy — export operations on customer data are not permitted for this agent.'
  },
  {
    id: 'aud-006',
    timestamp: '2026-09-25T10:31:00Z',
    agentId: 'revenue-forecast-agent',
    agentName: 'Revenue Forecast Agent',
    action: 'Generate quarterly revenue forecast',
    decision: 'Completed',
    actor: 'System',
    risk: 'low',
    details: 'Revenue forecast report generated successfully using aggregated financial data.'
  },
  {
    id: 'aud-005',
    timestamp: '2026-09-25T10:24:00Z',
    agentId: 'fraud-investigation-agent',
    agentName: 'Fraud Investigation Agent',
    action: 'Create investigation workflow',
    policyId: 'human-approval-policy',
    policyName: 'Human Approval Policy',
    decision: 'Completed',
    actor: 'System',
    risk: 'medium',
    details: 'Investigation workflow created after prior human approval. Workflow initiated for suspicious transaction patterns.'
  },
  {
    id: 'aud-004',
    timestamp: '2026-09-25T09:15:00Z',
    agentId: 'financial-analysis-agent',
    agentName: 'Financial Analysis Agent',
    action: 'Read financial dataset',
    policyId: 'financial-data-policy',
    policyName: 'Financial Data Policy',
    decision: 'Approved',
    actor: 'Manoj',
    risk: 'low',
    details: 'Human approval granted by Manoj for Financial Analysis Agent to read financial dataset for routine quarterly analysis.'
  },
  {
    id: 'aud-003',
    timestamp: '2026-09-25T08:30:00Z',
    agentId: 'collections-assistant',
    agentName: 'Collections Assistant',
    action: 'Export customer account data',
    policyId: 'sensitive-data-policy',
    policyName: 'Sensitive Data Policy',
    decision: 'Rejected',
    actor: 'Manoj',
    risk: 'high',
    details: 'Human approval denied by Manoj for Collections Assistant to export customer account data. Reason: Export of customer data not justified for the stated use case.'
  },
  {
    id: 'aud-002',
    timestamp: '2026-09-25T08:15:00Z',
    agentId: 'customer-support-agent',
    agentName: 'Customer Support Agent',
    action: 'Access knowledge base',
    decision: 'Allowed',
    actor: 'System',
    risk: 'low',
    details: 'Standard knowledge base access permitted for customer inquiry resolution.'
  },
  {
    id: 'aud-001',
    timestamp: '2026-09-25T07:30:00Z',
    agentId: 'customer-support-agent',
    agentName: 'Customer Support Agent',
    action: 'Agent registration',
    decision: 'Completed',
    actor: 'System',
    risk: 'low',
    details: 'Customer Support Agent registered and activated in production environment.'
  }
];
