import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getRandomSpherePoint, getLayeredConePoint } from '../utils/math';
import '../materials/FoliageShader';

interface FoliageProps {
  count: number;
  isFormed: boolean;
}

export const Foliage: React.FC<FoliageProps> = ({ count, isFormed }) => {
  const materialRef = useRef<any>();
  
  // Generate geometry data once
  const { positions, chaosPositions, randoms } = useMemo(() => {
    const chaosPos = new Float32Array(count * 3);
    const targetPos = new Float32Array(count * 3);
    const rnds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Chaos: Large sphere
      const cp = getRandomSpherePoint(25);
      chaosPos[i * 3] = cp.x;
      chaosPos[i * 3 + 1] = cp.y;
      chaosPos[i * 3 + 2] = cp.z;

      // Target: Layered Cone (Pine Tree Structure)
      // Height 13, Base Radius 4.5, 9 Layers
      const tp = getLayeredConePoint(13, 4.5, 9, -6.5);
      targetPos[i * 3] = tp.x;
      targetPos[i * 3 + 1] = tp.y;
      targetPos[i * 3 + 2] = tp.z;

      rnds[i] = Math.random();
    }
    
    return {
      chaosPositions: chaosPos,
      positions: targetPos,
      randoms: rnds
    };
  }, [count]);

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime;
      
      const targetProgress = isFormed ? 1.0 : 0.0;
      materialRef.current.uProgress = THREE.MathUtils.lerp(
        materialRef.current.uProgress,
        targetProgress,
        delta * 0.8
      );
    }
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aTargetPos"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aChaosPos"
          count={chaosPositions.length / 3}
          array={chaosPositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aRandom"
          count={randoms.length}
          array={randoms}
          itemSize={1}
        />
      </bufferGeometry>
      <foliageMaterial 
        ref={materialRef} 
        transparent 
        depthWrite={false} 
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};