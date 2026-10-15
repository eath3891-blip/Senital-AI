import { Policy } from '../types';

export const mockPolicies: Policy[] = [
  {
    id: 'sensitive-data-policy',
    name: 'Sensitive Data Policy',
    description: 'Controls access to sensitive customer data and requires human approval for read or export operations on customer PII.',
    scope: 'Customer data',
    appliesTo: 'All agents accessing customer PII',
    status: 'active',
    conditions: [
      { field: 'data_classification', operator: 'equals', value: 'sensitive' },
      { field: 'agent_autonomy', operator: 'greater_than', value: 'observe' }
    ],
    actions: [
      { type: 'require_approval', description: 'Require human approval before access' },
      { type: 'audit', description: 'Create audit event for all access attempts' }
    ],
    connectedAgents: ['financial-analysis-agent', 'fraud-investigation-agent', 'collections-assistant', 'revenue-forecast-agent', 'customer-support-agent'],
    createdAt: '2026-04-01T00:00:00Z',
    updatedAt: '2026-09-20T00:00:00Z'
  },
  {
    id: 'financial-data-policy',
    name: 'Financial Data Policy',
    description: 'Restricts access to financial datasets to approved agents with appropriate clearance and monitoring.',
    scope: 'Financial datasets',
    appliesTo: 'Agents accessing financial records',
    status: 'active',
    conditions: [
      { field: 'data_type', operator: 'equals', value: 'financial' },
      { field: 'agent_approved', operator: 'equals', value: 'true' }
    ],
    actions: [
      { type: 'allow', description: 'Allow access for approved agents' },
      { type: 'audit', description: 'Log all financial data access' }
    ],
    connectedAgents: ['financial-analysis-agent', 'fraud-investigation-agent', 'collections-assistant', 'revenue-forecast-agent'],
    createdAt: '2026-04-15T00:00:00Z',
    updatedAt: '2026-09-18T00:00:00Z'
  },
  {
    id: 'human-approval-policy',
    name: 'Human Approval Policy',
    description: 'Requires human review and approval for high-risk agent actions that could impact customer accounts or trigger workflows.',
    scope: 'High-risk actions',
    appliesTo: 'Actions with risk level high or critical',
    status: 'active',
    conditions: [
      { field: 'risk_level', operator: 'in', value: 'high,critical' },
      { field: 'action_type', operator: 'in', value: 'write,execute,create' }
    ],
    actions: [
      { type: 'require_approval', description: 'Route to approval queue' },
      { type: 'notify', description: 'Notify governance team' }
    ],
    connectedAgents: ['financial-analysis-agent', 'fraud-investigation-agent'],
    createdAt: '2026-05-01T00:00:00Z',
    updatedAt: '2026-09-22T00:00:00Z'
  },
  {
    id: 'production-access-policy',
    name: 'Production Access Policy',
    description: 'Controls access to production systems with elevated audit logging and mandatory approval for write operations.',
    scope: 'Production systems',
    appliesTo: 'All production environment access',
    status: 'active',
    conditions: [
      { field: 'environment', operator: 'equals', value: 'production' },
      { field: 'access_type', operator: 'equals', value: 'write' }
    ],
    actions: [
      { type: 'require_approval', description: 'Approval required plus elevated audit logging' },
      { type: 'audit', description: 'Enhanced audit trail for production access' }
    ],
    connectedAgents: ['financial-analysis-agent', 'revenue-forecast-agent'],
    createdAt: '2026-03-15T00:00:00Z',
    updatedAt: '2026-09-15T00:00:00Z'
  }
];
