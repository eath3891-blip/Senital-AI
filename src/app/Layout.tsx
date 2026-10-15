import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Bot, 
  Network,
  Activity, 
  CheckCircle, 
  FileText, 
  Database, 
  ClipboardList, 
  User,
  Search,
  Bell,
  Menu,
  X,
  ShieldCheck
} from 'lucide-react';
import styles from './Layout.module.css';
import { useApprovalStore } from '../store/approvalStore';
import { useNotificationStore } from '../store/notificationStore';
import { CommandPalette } from '../components/search/CommandPalette';
import { NotificationPanel } from '../components/notifications/NotificationPanel';

const navItems = [
  { path: '/', label: 'Overview', icon: LayoutDashboard },
  { path: '/agents', label: 'Agents', icon: Bot },
  { path: '/ecosystem', label: 'Ecosystem 3D', icon: Network },
  { path: '/activity', label: 'Activity', icon: Activity },
  { path: '/approvals', label: 'Approvals', icon: CheckCircle },
  { path: '/policies', label: 'Policies', icon: FileText },
  { path: '/systems', label: 'Data & Systems', icon: Database },
  { path: '/audit', label: 'Audit', icon: ClipboardList },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const pendingApprovals = useApprovalStore(state => state.getPendingCount());
  const unreadNotifications = useNotificationStore(state => state.unreadCount());

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const getPageContext = () => {
    const current = navItems.find(item => 
      item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path)
    );
    return current ? current.label : '';
  };

  return (
    <div className={styles.layout}>
      {/* Mobile overlay */}
      <div 
        className={`${styles.overlay} ${isSidebarOpen ? styles.overlayOpen : ''}`} 
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.logoArea}>
          <div className={styles.logo}>
            <div className={styles.logoMark}>
              <ShieldCheck size={18} />
            </div>
            <span>Sentinel <span className={styles.accent}>AI</span></span>
          </div>
          <button className={styles.closeSidebarButton} onClick={closeSidebar} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>
        
        <nav className={styles.nav}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.path === '/' 
              ? location.pathname === '/' 
              : location.pathname.startsWith(item.path);
              
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                onClick={closeSidebar}
              >
                <Icon size={20} />
                <span>{item.label}</span>
                {item.path === '/approvals' && pendingApprovals > 0 && (
                  <span className={styles.badge}>{pendingApprovals}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className={styles.userSection}>
          <div className={styles.userIcon}>
            <User size={18} />
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>Manoj</span>
            <span className={styles.userRole}>AI Governance Lead</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Topbar */}
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button className={styles.menuButton} onClick={toggleSidebar}>
              <Menu size={22} />
            </button>
            <div className={styles.breadcrumb}>
              <span className={styles.breadcrumbOrg}>Platform</span>
              <span className={styles.breadcrumbSlash}>/</span>
              <span className={styles.pageContext}>{getPageContext()}</span>
            </div>
          </div>
          
          <div className={styles.topbarRight}>
            <button className={styles.searchButton} onClick={() => setIsSearchOpen(true)}>
              <div className={styles.searchLeft}>
                <Search size={16} />
                <span className={styles.searchButtonText}>Search platform...</span>
              </div>
              <span className={styles.kbd}>⌘K</span>
            </button>
            <button className={styles.bellButton} onClick={() => setIsNotificationsOpen(true)} aria-label="Notifications">
              <Bell size={18} />
              {unreadNotifications > 0 && <span className={styles.unreadDot} />}
            </button>
            <div className={styles.avatar}>M</div>
          </div>
        </header>

        {/* Content Area */}
        <div className={styles.content}>
          <div className={styles.contentInner}>
            {children}
          </div>
        </div>
      </main>

      <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <NotificationPanel isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
    </div>
  );
}
