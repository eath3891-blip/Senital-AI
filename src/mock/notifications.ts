import { Notification } from '../types';

export const mockNotifications: Notification[] = [
  {
    id: 'notif-001',
    type: 'risk',
    title: 'High-risk action blocked',
    message: 'Collections Assistant attempted restricted customer export',
    timestamp: '2026-09-25T10:38:00Z',
    read: false,
    link: '/activities'
  },
  {
    id: 'notif-002',
    type: 'approval',
    title: 'Approval required',
    message: 'Financial Analysis Agent needs access to customer transactions',
    timestamp: '2026-09-25T10:42:00Z',
    read: false,
    link: '/approvals'
  },
  {
    id: 'notif-003',
    type: 'approval',
    title: 'Approval required',
    message: 'Revenue Forecast Agent requesting production API access',
    timestamp: '2026-09-25T10:24:00Z',
    read: false,
    link: '/approvals'
  },
  {
    id: 'notif-004',
    type: 'policy',
    title: 'Policy updated',
    message: 'Sensitive Data Policy was modified by admin',
    timestamp: '2026-09-25T09:00:00Z',
    read: true,
    link: '/policies'
  },
  {
    id: 'notif-005',
    type: 'system',
    title: 'System sync completed',
    message: 'Financial Database sync completed successfully',
    timestamp: '2026-09-25T08:15:00Z',
    read: true,
    link: '/systems'
  },
  {
    id: 'notif-006',
    type: 'info',
    title: 'Agent registered',
    message: 'Customer Support Agent was registered and activated',
    timestamp: '2026-09-25T07:30:00Z',
    read: true,
    link: '/agents'
  }
];
