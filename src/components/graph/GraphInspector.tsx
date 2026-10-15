import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import styles from './GraphInspector.module.css';

export interface NodeData {
  id: string;
  type: 'agent' | 'policy' | 'system' | 'category';
  label: string;
  categoryType?: 'risk' | 'approval' | 'audit' | 'identity';
  risk?: string;
  autonomy?: string;
  owner?: string;
  status?: string;
  scope?: string;
  connectionsCount?: {
    systems?: number;
    policies?: number;
    agents?: number;
  };
  description?: string;
}

interface Props {
  node: NodeData;
  onClose: () => void;
}

export const GraphInspector: React.FC<Props> = ({ node, onClose }) => {
  return (
    <div className={styles.inspector}>
      <div className={styles.header}>
        <div>
          <div className={styles.typeLabel}>
            {node.type === 'category' ? 'Category' : 
             node.type === 'agent' ? 'AI Agent' : 
             node.type === 'policy' ? 'Policy' : 'Data Source'}
          </div>
          <h3 className={styles.title}>{node.label}</h3>
        </div>
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      {node.type === 'agent' && (
        <>
          <div className={styles.badgeRow}>
            {node.risk && (
              <span className={`${styles.badge} ${
                node.risk === 'high' ? styles.badgeRiskHigh : 
                node.risk === 'low' ? styles.badgeRiskLow : styles.badgeRiskMedium
              }`}>
                Risk: {node.risk}
              </span>
            )}
            {node.autonomy && (
              <span className={styles.badge}>Autonomy: {node.autonomy}</span>
            )}
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Owner</span>
            <span className={styles.detailValue}>{node.owner || 'Unknown'}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Connected Systems</span>
            <span className={styles.detailValue}>{node.connectionsCount?.systems || 0}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Policies</span>
            <span className={styles.detailValue}>{node.connectionsCount?.policies || 0}</span>
          </div>
          <Link to={`/agents/${node.id}`} className={styles.button}>
            Open agent
          </Link>
        </>
      )}

      {node.type === 'policy' && (
        <>
          <div className={styles.badgeRow}>
            {node.status && (
              <span className={styles.badge}>Status: {node.status}</span>
            )}
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Scope</span>
            <span className={styles.detailValue}>{node.scope || 'Global'}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Connected Agents</span>
            <span className={styles.detailValue}>{node.connectionsCount?.agents || 0}</span>
          </div>
          <Link to={`/policies/${node.id}`} className={styles.button}>
            Open policy
          </Link>
        </>
      )}

      {node.type === 'system' && (
        <>
          <div className={styles.badgeRow}>
            {node.risk && (
              <span className={`${styles.badge} ${
                node.risk === 'high' ? styles.badgeRiskHigh : 
                node.risk === 'low' ? styles.badgeRiskLow : styles.badgeRiskMedium
              }`}>
                Risk: {node.risk}
              </span>
            )}
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Connected Agents</span>
            <span className={styles.detailValue}>{node.connectionsCount?.agents || 0}</span>
          </div>
          <Link to={`/systems/${node.id}`} className={styles.button}>
            Open system
          </Link>
        </>
      )}

      {node.type === 'category' && (
        <>
          <p style={{ margin: 0, fontSize: 'var(--text-body)', color: 'var(--color-text-secondary)' }}>
            {node.description || 'Explore elements in this category.'}
          </p>
        </>
      )}
    </div>
  );
};
