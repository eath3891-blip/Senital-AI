import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './Button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Sentinel Error Boundary caught an error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '64px 24px',
          maxWidth: '600px',
          margin: '0 auto',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-risk-high-bg, #FBE9E7)',
            color: 'var(--color-risk-high, #E8512D)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '8px'
          }}>
            <AlertTriangle size={24} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            Unable to load view
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: '0 0 16px 0' }}>
            A temporary display error occurred while rendering this governance data.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button variant="secondary" onClick={this.handleReset}>
              Try again
            </Button>
            <Button variant="primary" onClick={this.handleReload} icon={<RefreshCw size={16} />}>
              Reload page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
