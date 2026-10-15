import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Clock, FileText, Database, Info, Bell } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNotificationStore } from '../../store/notificationStore';
import styles from './NotificationPanel.module.css';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const { notifications, markRead, markAllRead } = useNotificationStore();
  const navigate = useNavigate();

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleNotificationClick = (id: string, link?: string) => {
    markRead(id);
    if (link) {
      navigate(link);
    }
    onClose();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'risk': return <div className={`${styles.iconWrapper} ${styles.iconRisk}`}><ShieldAlert size={16} /></div>;
      case 'approval': return <div className={`${styles.iconWrapper} ${styles.iconApproval}`}><Clock size={16} /></div>;
      case 'policy': return <div className={`${styles.iconWrapper} ${styles.iconPolicy}`}><FileText size={16} /></div>;
      case 'system': return <div className={`${styles.iconWrapper} ${styles.iconSystem}`}><Database size={16} /></div>;
      case 'info':
      default: return <div className={`${styles.iconWrapper} ${styles.iconInfo}`}><Info size={16} /></div>;
    }
  };

  const safeFormatDistance = (ts: string | undefined | null) => {
    try {
      if (!ts) return 'recently';
      const d = new Date(ts);
      return isNaN(d.getTime()) ? 'recently' : formatDistanceToNow(d, { addSuffix: true });
    } catch {
      return 'recently';
    }
  };

  return (
    <>
      <div className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`} onClick={onClose} />
      <div className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`}>
        <div className={styles.header}>
          <h2>Notifications</h2>
          <button className={styles.markReadBtn} onClick={markAllRead}>
            Mark all read
          </button>
        </div>
        
        <div className={styles.list}>
          {notifications.length === 0 ? (
            <div className={styles.emptyState}>
              <Bell size={32} />
              <p>No new notifications</p>
            </div>
          ) : (
            notifications.map(n => (
              <div 
                key={n.id} 
                className={`${styles.item} ${!n.read ? styles.itemUnread : ''}`}
                onClick={() => handleNotificationClick(n.id, n.link)}
              >
                {getIcon(n.type)}
                <div className={styles.content}>
                  <div className={styles.titleRow}>
                    <p className={styles.title}>{n.title}</p>
                    {!n.read && <span className={styles.unreadDot} />}
                  </div>
                  <p className={styles.message}>{n.message}</p>
                  <span className={styles.timestamp}>
                    {safeFormatDistance(n.timestamp)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
