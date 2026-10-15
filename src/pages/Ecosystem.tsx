import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Ecosystem.module.css';

const EcosystemGraph = lazy(() => import('../components/graph/EcosystemGraph'));

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('webgl2')));
  } catch { 
    return false; 
  }
}

export function Ecosystem() {
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    setHasWebGL(supportsWebGL());
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link to="/" className={styles.backLink}>← Overview</Link>
        <h1 className={styles.title}>Agent ecosystem</h1>
        <p className={styles.subtitle}>
          Explore the relationships between agents, policies, data sources, and governance.
        </p>
      </div>
      
      <div className={styles.graphWrapper}>
        {hasWebGL ? (
          <Suspense fallback={<div style={{ color: 'var(--color-text-secondary)', padding: '24px', fontSize: '14px' }}>Loading 3D Ecosystem graph...</div>}>
            <EcosystemGraph />
          </Suspense>
        ) : (
          <div style={{ color: 'var(--color-text-secondary)', padding: '24px', fontSize: '14px' }}>
            WebGL is not supported in this browser. Switching to 2D topological view...
          </div>
        )}
      </div>
    </div>
  );
}
