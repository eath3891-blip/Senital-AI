import React, { useMemo } from 'react';
import styles from './GraphFallback.module.css';

interface Props {
  nodes: any[];
  edges: any[];
  onNodeClick: (id: string) => void;
  selectedNodeId: string | null;
}

export const GraphFallback: React.FC<Props> = ({ nodes, edges, onNodeClick, selectedNodeId }) => {
  // Simple 2D projection
  const width = 800;
  const height = 600;
  
  const projectedNodes = useMemo(() => {
    return nodes.map(n => ({
      ...n,
      px: width / 2 + n.position[0] * 50,
      py: height / 2 - n.position[2] * 50 // Use z as y
    }));
  }, [nodes]);

  const projectedEdges = useMemo(() => {
    return edges.map(e => {
      const source = projectedNodes.find(n => n.id === e.source);
      const target = projectedNodes.find(n => n.id === e.target);
      return { id: `${e.source}-${e.target}`, source, target };
    }).filter(e => e.source && e.target);
  }, [edges, projectedNodes]);

  return (
    <div className={styles.container}>
      <svg className={styles.svg} viewBox={`0 0 ${width} ${height}`}>
        {projectedEdges.map(edge => {
          const isHighlighted = selectedNodeId === edge.source?.id || selectedNodeId === edge.target?.id;
          const opacity = selectedNodeId ? (isHighlighted ? 0.8 : 0.1) : 0.3;
          return (
            <line
              key={edge.id}
              x1={edge.source?.px}
              y1={edge.source?.py}
              x2={edge.target?.px}
              y2={edge.target?.py}
              className={styles.edge}
              style={{ strokeOpacity: opacity }}
            />
          );
        })}
        
        {projectedNodes.map(node => {
          const isSelected = selectedNodeId === node.id;
          const isDimmed = selectedNodeId && !isSelected && !node.connectedToSelected;
          
          return (
            <g key={node.id} transform={`translate(${node.px}, ${node.py})`} onClick={() => onNodeClick(node.id)}>
              <circle
                r={node.size * 30}
                fill={node.color}
                opacity={isDimmed ? 0.3 : 1}
                className={styles.node}
                stroke={isSelected ? 'white' : 'transparent'}
                strokeWidth={2}
              />
              <text y={25} className={styles.label} opacity={isDimmed ? 0.3 : 1}>
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
