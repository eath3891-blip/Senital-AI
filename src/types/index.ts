// Risk levels
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

// Status types
export type AgentStatus = 'active' | 'inactive' | 'investigating';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';
export type ActivityStatus = 'allowed' | 'blocked' | 'approval_required' | 'completed' | 'pending';
export type PolicyStatus = 'active' | 'inactive' | 'draft';
export type SystemStatus = 'connected' | 'disconnected' | 'degraded';

// Autonomy levels
export type AutonomyLevel = 'observe' | 'advise' | 'approval_required' | 'autonomous';

// Agent type
export type AgentType = 'analysis' | 'investigation' | 'assistant' | 'forecasting' | 'support';

// Environment
export type Environment = 'production' | 'staging' | 'development';

// Agent
export interface Agent {
  id: string;
  name: string;
  description: string;
  owner: string;
  ownerTeam: string;
  status: AgentStatus;
  risk: RiskLevel;
  autonomy: AutonomyLevel;
  type: AgentType;
  environment: Environment;
  created: string;
  lastActivity: string;
  permissions: string[];
  deniedPermissions: string[];
  connectedSystems: string[]; // system IDs
  policies: string[]; // policy IDs
  riskExplanation: string;
  avatar?: string;
}

// Policy
export interface PolicyCondition {
  field: string;
  operator: string;
  value: string;
}

export interface PolicyAction {
  type: 'require_approval' | 'block' | 'allow' | 'audit' | 'notify';
  description: string;
}

export interface Policy {
  id: string;
  name: string;
  description: string;
  scope: string;
  appliesTo: string;
  status: PolicyStatus;
  conditions: PolicyCondition[];
  actions: PolicyAction[];
  connectedAgents: string[]; // agent IDs
  createdAt: string;
  updatedAt: string;
}

// Approval
export interface Approval {
  id: string;
  agentId: string;
  agentName: string;
  action: string;
  actionDescription: string;
  reason: string;
  resource: string;
  resourceType: string;
  accessLevel: string;
  duration: string;
  risk: RiskLevel;
  riskReason: string;
  policyId: string;
  policyName: string;
  policyResult: string;
  status: ApprovalStatus;
  requestedAt: string;
  decidedAt?: string;
  decidedBy?: string;
  relatedActivityIds: string[];
}

// Activity
export interface Activity {
  id: string;
  agentId: string;
  agentName: string;
  action: string;
  actionDescription: string;
  system: string;
  systemId: string;
  dataInvolved: string;
  policyId?: string;
  policyName?: string;
  risk: RiskLevel;
  status: ActivityStatus;
  decision?: string;
  approver?: string;
  timestamp: string;
  // Technical details (progressive disclosure)
  technical: {
    requestId: string;
    agentId: string;
    policyId?: string;
    apiEndpoint: string;
    responseCode?: number;
    executionDuration: string;
    environment: Environment;
  };
}

// System
export interface ConnectedSystem {
  id: string;
  name: string;
  type: string;
  status: SystemStatus;
  lastSync: string;
  accessLevel: string;
  connectedAgents: string[]; // agent IDs
  risk: RiskLevel;
  policies: string[]; // policy IDs
  description: string;
  recentAccess: {
    agentId: string;
    agentName: string;
    action: string;
    timestamp: string;
    status: ActivityStatus;
  }[];
}

// Audit Event
export interface AuditEvent {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  action: string;
  policyId?: string;
  policyName?: string;
  decision: string;
  actor: string;
  risk: RiskLevel;
  details: string;
}

// Notification
export interface Notification {
  id: string;
  type: 'risk' | 'approval' | 'policy' | 'system' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
  agentId?: string;
}

// Filter types
export interface FilterOption {
  label: string;
  value: string;
}

// Search result
export interface SearchResult {
  type: 'agent' | 'policy' | 'system' | 'activity' | 'approval';
  id: string;
  title: string;
  subtitle: string;
  link: string;
}
