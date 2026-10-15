import React, { useMemo, useState, useCallback, memo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Billboard, Line } from '@react-three/drei';
import * as THREE from 'three';
import styles from './EcosystemGraph.module.css';
import { GraphInspector, NodeData } from './GraphInspector';
import { GraphFallback } from './GraphFallback';

// Stores will be imported correctly in real environment, 
// using generic fallback mock if they don't exist yet to prevent crash
// import { useAgentStore } from '../../stores/agentStore';
// import { useSystemStore } from '../../stores/systemStore';
// import { usePolicyStore } from '../../stores/policyStore';

const COLORS = {
  agent: '#2B5CE6',
  policy: '#7C4DFF',
  system: '#00897B',
  risk: '#E8512D',
  approval: '#E8A317',
  audit: '#546E7A',
  identity: '#8D6E63',
};

const SIZES = {
  agent: 0.4,
  system: 0.3,
  policy: 0.25,
  category: 0.35,
};

// Simplified graph generation
const generateGraphData = () => {
  const nodes: any[] = [];
  const edges: any[] = [];

  // Generate mock agents
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2;
    nodes.push({
      id: `agent-${i}`,
      type: 'agent',
      label: `Agent ${i+1}`,
      position: [3 * Math.cos(angle), 0, 3 * Math.sin(angle)],
      size: SIZES.agent,
      color: COLORS.agent,
      data: {
        id: `agent-${i}`,
        type: 'agent',
        label: `Agent ${i+1}`,
        risk: 'medium',
        autonomy: 'semi',
        owner: 'Platform Team',
        connectionsCount: { systems: 2, policies: 2 }
      }
    });
  }

  // Generate mock systems
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    nodes.push({
      id: `system-${i}`,
      type: 'system',
      label: `System ${i+1}`,
      position: [5 * Math.cos(angle), 1, 5 * Math.sin(angle)],
      size: SIZES.system,
      color: COLORS.system,
      data: {
        id: `system-${i}`,
        type: 'system',
        label: `System ${i+1}`,
        risk: 'low'
      }
    });
    // Connect to some agents
    edges.push({ source: `agent-${i % 5}`, target: `system-${i}` });
  }

  // Generate mock policies
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2;
    nodes.push({
      id: `policy-${i}`,
      type: 'policy',
      label: `Policy ${i+1}`,
      position: [5 * Math.cos(angle), -1, 5 * Math.sin(angle)],
      size: SIZES.policy,
      color: COLORS.policy,
      data: {
        id: `policy-${i}`,
        type: 'policy',
        label: `Policy ${i+1}`,
        status: 'active',
        scope: 'global'
      }
    });
    edges.push({ source: `agent-${i % 5}`, target: `policy-${i}` });
    edges.push({ source: `agent-${(i+1) % 5}`, target: `policy-${i}` });
  }

  // Categories
  const categories = [
    { id: 'cat-risk', label: 'Risk', color: COLORS.risk },
    { id: 'cat-approval', label: 'Approvals', color: COLORS.approval },
    { id: 'cat-audit', label: 'Audit', color: COLORS.audit },
    { id: 'cat-identity', label: 'Identity', color: COLORS.identity }
  ];

  categories.forEach((cat, i) => {
    const angle = (i / 4) * Math.PI * 2;
    nodes.push({
      id: cat.id,
      type: 'category',
      label: cat.label,
      position: [7 * Math.cos(angle), 0, 7 * Math.sin(angle)],
      size: SIZES.category,
      color: cat.color,
      data: {
        id: cat.id,
        type: 'category',
        label: cat.label,
        description: `Central governance node for ${cat.label.toLowerCase()}.`
      }
    });
    // Connect to all agents
    for (let j = 0; j < 5; j++) {
      edges.push({ source: cat.id, target: `agent-${j}` });
    }
  });

  return { nodes, edges };
};

const NodeMesh = memo(({ node, isSelected, isDimmed, onClick, onPointerOver, onPointerOut }: any) => {
  return (
    <group position={node.position} onClick={(e) => { e.stopPropagation(); onClick(node.id); }} onPointerOver={() => onPointerOver()} onPointerOut={() => onPointerOut()}>
      <mesh>
        <sphereGeometry args={[node.size, 16, 16]} />
        <meshStandardMaterial 
          color={node.color} 
          emissive={node.color} 
          emissiveIntensity={isSelected ? 0.8 : (isDimmed ? 0.1 : 0.3)} 
          transparent 
          opacity={isDimmed ? 0.2 : 1}
        />
      </mesh>
      <Billboard>
        <Text
          position={[0, -node.size - 0.2, 0]}
          fontSize={0.25}
          color={isDimmed ? '#6B6B6B' : '#ffffff'}
          anchorX="center"
          anchorY="middle"
        >
          {node.label}
        </Text>
      </Billboard>
    </group>
  );
});

export default function EcosystemGraph() {
  const { nodes, edges } = useMemo(() => generateGraphData(), []);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hovered, setHovered] = useState(false);

  // Compute connections
  const connectedNodeIds = useMemo(() => {
    if (!selectedId) return new Set<string>();
    const connected = new Set<string>();
    connected.add(selectedId);
    edges.forEach(e => {
      if (e.source === selectedId) connected.add(e.target);
      if (e.target === selectedId) connected.add(e.source);
    });
    return connected;
  }, [selectedId, edges]);

  const handlePointerOver = useCallback(() => setHovered(true), []);
  const handlePointerOut = useCallback(() => setHovered(false), []);

  const selectedNodeData = useMemo(() => {
    if (!selectedId) return null;
    return nodes.find(n => n.id === selectedId)?.data as NodeData;
  }, [selectedId, nodes]);

  return (
    <div className={styles.container} style={{ cursor: hovered ? 'pointer' : 'default' }}>
      <Canvas camera={{ position: [0, 8, 12], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05} 
          makeDefault 
        />

        <group onPointerMissed={() => setSelectedId(null)}>
          {edges.map((edge, i) => {
            const sourceNode = nodes.find(n => n.id === edge.source);
            const targetNode = nodes.find(n => n.id === edge.target);
            if (!sourceNode || !targetNode) return null;
            
            const isHighlighted = selectedId === edge.source || selectedId === edge.target;
            const isDimmed = selectedId && !isHighlighted;

            return (
              <Line
                key={`edge-${i}`}
                points={[sourceNode.position, targetNode.position]}
                color={sourceNode.color}
                lineWidth={isHighlighted ? 2 : 1}
                transparent
                opacity={selectedId ? (isHighlighted ? 0.6 : 0.05) : 0.2}
              />
            );
          })}

          {nodes.map(node => (
            <NodeMesh
              key={node.id}
              node={node}
              isSelected={selectedId === node.id}
              isDimmed={selectedId !== null && !connectedNodeIds.has(node.id)}
              onClick={setSelectedId}
              onPointerOver={handlePointerOver}
              onPointerOut={handlePointerOut}
            />
          ))}
        </group>
      </Canvas>
      
      {selectedNodeData && (
        <GraphInspector 
          node={selectedNodeData} 
          onClose={() => setSelectedId(null)} 
        />
      )}
    </div>
  );
}
