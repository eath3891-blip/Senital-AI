import React from 'react';
import { Button } from './Button';
import styles from './FilterBar.module.css';

export interface FilterOption {
  label: string;
  value: string;
}

export interface Filter {
  id: string;
  label: string;
  options: FilterOption[];
  value?: string;
}

export interface FilterBarProps {
  filters?: Filter[];
  onChange?: (filterIdOrValue: any, value?: any) => void;
  onReset?: () => void;
  // Support single standalone select usage:
  options?: (string | FilterOption)[];
  value?: string;
  label?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChange,
  onReset,
  options,
  value,
  label
}) => {
  // If used as standalone single select
  if (options && label) {
    const normalizedOptions: FilterOption[] = options.map(opt => 
      typeof opt === 'string' ? { label: opt, value: opt.toLowerCase() } : opt
    );

    return (
      <div className={styles.filterGroup}>
        <label className={styles.label}>{label}</label>
        <select
          className={styles.select}
          value={value || 'all'}
          onChange={(e) => {
            if (onChange) onChange(e.target.value);
          }}
        >
          {normalizedOptions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // If used with filters list
  const activeFilters = filters || [];
  const hasActiveFilters = activeFilters.some(f => f.value && f.value !== 'all');

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        {activeFilters.map(filter => (
          <div key={filter.id} className={styles.filterGroup}>
            <label className={styles.label}>{filter.label}</label>
            <select
              className={styles.select}
              value={filter.value || 'all'}
              onChange={(e) => onChange && onChange(filter.id, e.target.value)}
            >
              <option value="all">All</option>
              {filter.options.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
      
      {hasActiveFilters && onReset && (
        <Button variant="ghost" size="sm" onClick={onReset}>
          Reset Filters
        </Button>
      )}
    </div>
  );
};
