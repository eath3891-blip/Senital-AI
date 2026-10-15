import React, { useState } from 'react';
import styles from './Tabs.module.css';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab?: string;
  defaultTab?: string;
  onChange?: (id: string) => void;
  children?: React.ReactNode | ((activeTab: string) => React.ReactNode);
}

export const Tabs: React.FC<TabsProps> = ({ 
  tabs, 
  activeTab: controlledActiveTab, 
  defaultTab, 
  onChange,
  children 
}) => {
  const [internalTab, setInternalTab] = useState(defaultTab || tabs[0]?.id || '');
  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalTab;

  const handleTabChange = (id: string) => {
    if (controlledActiveTab === undefined) {
      setInternalTab(id);
    }
    if (onChange) {
      onChange(id);
    }
  };

  return (
    <div>
      <div className={styles.container}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={styles.count}>{tab.count}</span>
            )}
          </button>
        ))}
      </div>
      {typeof children === 'function' ? children(activeTab) : children}
    </div>
  );
};
