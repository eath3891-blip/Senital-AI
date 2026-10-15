import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usePolicyStore } from '../store/policyStore';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Plus, X, ArrowDown, Check } from 'lucide-react';
import styles from './PolicyBuilder.module.css';

type Condition = { field: string; operator: string; value: string };
type Action = { type: string; description: string; checked?: boolean };

export function PolicyBuilder() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('draft');
  const [scope, setScope] = useState('');
  const [appliesTo, setAppliesTo] = useState('');
  
  const [conditions, setConditions] = useState<Condition[]>([
    { field: 'data_classification', operator: 'equals', value: '' }
  ]);

  const [actions, setActions] = useState<Action[]>([
    { type: 'require_human_approval', description: '', checked: false },
    { type: 'block_action', description: '', checked: false },
    { type: 'allow_action', description: '', checked: false },
    { type: 'create_audit_event', description: '', checked: false },
    { type: 'send_notification', description: '', checked: false },
  ]);

  const handleAddCondition = () => {
    setConditions([...conditions, { field: 'data_classification', operator: 'equals', value: '' }]);
  };

  const handleRemoveCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const handleConditionChange = (index: number, key: keyof Condition, val: string) => {
    const newConds = [...conditions];
    newConds[index][key] = val;
    setConditions(newConds);
  };

  const handleActionToggle = (index: number) => {
    const newActions = [...actions];
    newActions[index].checked = !newActions[index].checked;
    setActions(newActions);
  };

  const handleActionDescChange = (index: number, val: string) => {
    const newActions = [...actions];
    newActions[index].description = val;
    setActions(newActions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `pol-${Math.random().toString(36).substring(2, 9)}`;
    const finalActions = actions
      .filter(a => a.checked)
      .map(a => ({ type: a.type, description: a.description }));

    const policyStore = usePolicyStore.getState() as any;
    if (policyStore.addPolicy) {
      policyStore.addPolicy({
        id,
        name,
        description,
        status,
        scope,
        appliesTo,
        conditions,
        actions: finalActions,
        connectedAgents: [],
      });
    }
    
    navigate(`/policies/${id}`);
  };

  const selectedActions = actions.filter(a => a.checked);

  return (
    <div className={styles.container}>
      <Link to="/policies" className={styles.backLink}>
        <ArrowLeft size={16} /> Policies
      </Link>

      <div className={styles.header}>
        <h1 className={styles.title}>Create policy</h1>
        <p className={styles.subtitle}>Define a new governance rule for AI agent behavior.</p>
      </div>

      <div className={styles.content}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Basic Information</h2>
            <div className={styles.fieldGroup}>
              <label>Policy name</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
                placeholder="e.g. Sensitive Data Access"
              />
            </div>
            <div className={styles.fieldGroup}>
              <label>Description</label>
              <textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                rows={3} 
                placeholder="Explain what this policy does..."
              />
            </div>
            <div className={styles.fieldGroup}>
              <label>Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Conditions</h2>
              <p className={styles.sectionSubtitle}>Define when this policy applies</p>
            </div>
            <div className={styles.conditionsList}>
              {conditions.map((cond, i) => (
                <div key={i} className={styles.conditionRow}>
                  <select 
                    value={cond.field} 
                    onChange={e => handleConditionChange(i, 'field', e.target.value)}
                  >
                    <option value="data_classification">data_classification</option>
                    <option value="data_type">data_type</option>
                    <option value="agent_autonomy">agent_autonomy</option>
                    <option value="risk_level">risk_level</option>
                    <option value="action_type">action_type</option>
                    <option value="environment">environment</option>
                    <option value="access_type">access_type</option>
                  </select>
                  <select 
                    value={cond.operator} 
                    onChange={e => handleConditionChange(i, 'operator', e.target.value)}
                  >
                    <option value="equals">equals</option>
                    <option value="not_equals">not_equals</option>
                    <option value="greater_than">greater_than</option>
                    <option value="less_than">less_than</option>
                    <option value="in">in</option>
                    <option value="contains">contains</option>
                  </select>
                  <input 
                    type="text" 
                    value={cond.value} 
                    onChange={e => handleConditionChange(i, 'value', e.target.value)} 
                    placeholder="Value..."
                  />
                  <button type="button" onClick={() => handleRemoveCondition(i)} className={styles.removeBtn}>
                    <X size={16} />
                  </button>
                </div>
              ))}
              <Button type="button" variant="secondary" onClick={handleAddCondition}>
                <Plus size={16} /> Add condition
              </Button>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Actions</h2>
              <p className={styles.sectionSubtitle}>Define what happens when conditions are met</p>
            </div>
            <div className={styles.actionsList}>
              {actions.map((action, i) => (
                <div key={i} className={styles.actionRow}>
                  <label className={styles.checkboxLabel}>
                    <input 
                      type="checkbox" 
                      checked={action.checked} 
                      onChange={() => handleActionToggle(i)} 
                    />
                    <span>{action.type.replace(/_/g, ' ')}</span>
                  </label>
                  {action.checked && (
                    <input 
                      type="text" 
                      value={action.description} 
                      onChange={e => handleActionDescChange(i, e.target.value)} 
                      placeholder="Action description..."
                      className={styles.actionDescInput}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Scope</h2>
            <div className={styles.fieldGroup}>
              <label>Scope</label>
              <input 
                type="text" 
                value={scope} 
                onChange={e => setScope(e.target.value)} 
                placeholder="e.g. Customer data"
              />
            </div>
            <div className={styles.fieldGroup}>
              <label>Applies to</label>
              <input 
                type="text" 
                value={appliesTo} 
                onChange={e => setAppliesTo(e.target.value)} 
                placeholder="e.g. All agents accessing customer PII"
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <Button type="button" variant="secondary" onClick={() => navigate('/policies')}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create policy
            </Button>
          </div>
        </form>

        <div className={styles.previewPanel}>
          <h2 className={styles.sectionTitle}>Policy preview</h2>
          <div className={styles.visualization}>
            <div className={styles.ifSection}>
              <div className={styles.ifLabel}>IF</div>
              <div className={styles.conditionsList}>
                {conditions.map((cond, index) => (
                  <React.Fragment key={index}>
                    <div className={styles.conditionCard}>
                      <span className={styles.field}>{cond.field}</span>
                      <span className={styles.operator}>{cond.operator.replace(/_/g, ' ')}</span>
                      <span className={styles.value}>{cond.value || '...'}</span>
                    </div>
                    {index < conditions.length - 1 && (
                      <div className={styles.andLabel}>AND</div>
                    )}
                  </React.Fragment>
                ))}
                {conditions.length === 0 && (
                  <div className={styles.conditionCard}>No conditions</div>
                )}
              </div>
            </div>
            
            <div className={styles.connector}>
              <div className={styles.line}></div>
              <ArrowDown className={styles.arrowIcon} size={20} />
            </div>

            <div className={styles.thenSection}>
              <div className={styles.thenLabel}>THEN</div>
              <div className={styles.actionsList}>
                {selectedActions.map((action, index) => (
                  <div key={index} className={styles.actionItem}>
                    <Check size={16} className={styles.checkIcon} />
                    <span>{action.type.replace(/_/g, ' ')}: {action.description || '...'}</span>
                  </div>
                ))}
                {selectedActions.length === 0 && (
                  <div className={styles.actionItem}>No actions specified</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
