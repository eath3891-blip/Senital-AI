import { ConnectedSystem } from '../types';

export const mockSystems: ConnectedSystem[] = [
  {
    id: 'financial-db',
    name: 'Financial Database',
    type: 'database',
    status: 'connected',
    lastSync: '2026-09-25T10:40:00Z',
    accessLevel: 'Read/Write (restricted)',
    risk: 'high',
    connectedAgents: ['financial-analysis-agent', 'fraud-investigation-agent', 'collections-assistant', 'revenue-forecast-agent'],
    description: 'Primary financial transaction database containing account balances, transaction history, and financial records.',
    policies: ['financial-data-policy', 'production-access-policy'],
    recentAccess: [
      { agentId: 'financial-analysis-agent', agentName: 'Financial Analysis Agent', action: 'Read financial transaction dataset', timestamp: '2026-09-25T10:39:00Z', status: 'allowed' },
      { agentId: 'revenue-forecast-agent', agentName: 'Revenue Forecast Agent', action: 'Read historical revenue data', timestamp: '2026-09-25T10:05:00Z', status: 'allowed' },
      { agentId: 'fraud-investigation-agent', agentName: 'Fraud Investigation Agent', action: 'Queried customer transaction patterns', timestamp: '2026-09-25T09:58:00Z', status: 'allowed' }
    ]
  },
  {
    id: 'customer-data-platform',
    name: 'Customer Data Platform',
    type: 'platform',
    status: 'connected',
    lastSync: '2026-09-25T10:32:00Z',
    accessLevel: 'Read (restricted)',
    risk: 'high',
    connectedAgents: ['financial-analysis-agent', 'collections-assistant'],
    description: 'Centralized customer data platform containing customer profiles, preferences, and interaction history.',
    policies: ['sensitive-data-policy'],
    recentAccess: [
      { agentId: 'financial-analysis-agent', agentName: 'Financial Analysis Agent', action: 'Requested access to customer transaction data', timestamp: '2026-09-25T10:42:00Z', status: 'approval_required' },
      { agentId: 'collections-assistant', agentName: 'Collections Assistant', action: 'Attempted to export restricted customer records', timestamp: '2026-09-25T10:38:00Z', status: 'blocked' }
    ]
  },
  {
    id: 'fraud-detection-api',
    name: 'Fraud Detection API',
    type: 'api',
    status: 'connected',
    lastSync: '2026-09-25T10:41:00Z',
    accessLevel: 'Read/Execute',
    risk: 'medium',
    connectedAgents: ['financial-analysis-agent', 'fraud-investigation-agent'],
    description: 'API for evaluating transactions against known fraud patterns and initiating fraud investigation workflows.',
    policies: ['human-approval-policy'],
    recentAccess: [
      { agentId: 'fraud-investigation-agent', agentName: 'Fraud Investigation Agent', action: 'Triggered investigation workflow', timestamp: '2026-09-25T10:24:00Z', status: 'completed' }
    ]
  },
  {
    id: 'crm',
    name: 'CRM',
    type: 'platform',
    status: 'connected',
    lastSync: '2026-09-25T10:37:00Z',
    accessLevel: 'Read/Write',
    risk: 'low',
    connectedAgents: ['fraud-investigation-agent', 'collections-assistant', 'customer-support-agent'],
    description: 'Customer relationship management system for tracking interactions and support tickets.',
    policies: [],
    recentAccess: [
      { agentId: 'customer-support-agent', agentName: 'Customer Support Agent', action: 'Routed customer inquiry to specialist', timestamp: '2026-09-25T10:18:00Z', status: 'completed' },
      { agentId: 'collections-assistant', agentName: 'Collections Assistant', action: 'Generated collection status report', timestamp: '2026-09-25T09:45:00Z', status: 'completed' }
    ]
  },
  {
    id: 'analytics-workspace',
    name: 'Analytics Workspace',
    type: 'platform',
    status: 'connected',
    lastSync: '2026-09-25T10:42:00Z',
    accessLevel: 'Read/Write',
    risk: 'low',
    connectedAgents: ['financial-analysis-agent', 'revenue-forecast-agent'],
    description: 'Data analytics and reporting environment for generating business intelligence insights.',
    policies: [],
    recentAccess: [
      { agentId: 'revenue-forecast-agent', agentName: 'Revenue Forecast Agent', action: 'Generated quarterly revenue forecast', timestamp: '2026-09-25T10:31:00Z', status: 'completed' },
      { agentId: 'financial-analysis-agent', agentName: 'Financial Analysis Agent', action: 'Generated anomaly detection report', timestamp: '2026-09-25T10:12:00Z', status: 'completed' }
    ]
  },
  {
    id: 'knowledge-base',
    name: 'Knowledge Base',
    type: 'platform',
    status: 'connected',
    lastSync: '2026-09-25T09:42:00Z',
    accessLevel: 'Read',
    risk: 'low',
    connectedAgents: ['revenue-forecast-agent', 'customer-support-agent'],
    description: 'Internal documentation repository and troubleshooting guides for support teams.',
    policies: [],
    recentAccess: [
      { agentId: 'customer-support-agent', agentName: 'Customer Support Agent', action: 'Accessed knowledge base for customer inquiry', timestamp: '2026-09-25T09:30:00Z', status: 'allowed' }
    ]
  }
];
