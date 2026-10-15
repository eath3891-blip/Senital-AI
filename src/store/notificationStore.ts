import { create } from 'zustand';
import { Notification } from '../types';
import { mockNotifications } from '../mock/notifications';

interface NotificationStore {
  notifications: Notification[];
  unreadCount: () => number;
  markRead: (id: string) => void;
  markAllRead: () => void;
  dismiss: (id: string) => void;
  addNotification: (notification: Notification) => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: mockNotifications,
  unreadCount: () => get().notifications.filter(n => !n.read).length,
  markRead: (id) => set(state => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  })),
  markAllRead: () => set(state => ({
    notifications: state.notifications.map(n => ({ ...n, read: true }))
  })),
  dismiss: (id) => set(state => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
  addNotification: (notification) => set(state => ({
    notifications: [notification, ...state.notifications]
  })),
}));
