import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float, Stars } from '@react-three/drei';
import { COLORS } from '../types';

interface StarProps {
  isFormed: boolean;
}

export const Snowflake: React.FC<StarProps> = ({ isFormed }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Create a 5-pointed star shape
  const starGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const outerRadius = 1.2;
    const innerRadius = 0.5;
    const points = 5;
    
    // Start at top point
    shape.moveTo(0, outerRadius);
    
    const step = Math.PI / points;
    
    for (let i = 0; i < 2 * points; i++) {
        const r = (i % 2 === 1) ? outerRadius : innerRadius;
        const a = (i + 1) * step; // Rotate slightly to align top
        
        // We actually want the first point to be up. 
        // Standard shape logic:
        const angle = i * step; 
        // But let's just manually compute vertices for a standard star look
        // actually existing logic is: 
        // i=0 -> r=outer (top)
        // i=1 -> r=inner
        // ...
    }
    
    // Simpler loop
    for (let i = 0; i < points * 2; i++) {
      const angle = (i * Math.PI) / points;
      const r = i % 2 === 0 ? outerRadius : innerRadius;
      shape.lineTo(Math.sin(angle) * r, Math.cos(angle) * r);
    }
    
    shape.closePath();

    const extrudeSettings = {
      steps: 1,
      depth: 0.4,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.1,
      bevelSegments: 2
    };

    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center(); // Center geometry
    return geom;
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Target position: Top of tree (y = 6.5 approx)
    const targetY = 7.0; 
    const chaosY = 25;

    const targetPos = new THREE.Vector3(0, targetY, 0);
    const chaosPos = new THREE.Vector3(0, chaosY, 0);

    const dest = isFormed ? targetPos : chaosPos;
    
    groupRef.current.position.lerp(dest, delta * 2);
    
    // Rotate slowly
    if (isFormed) {
        groupRef.current.rotation.y += delta * 0.5;
    } else {
        groupRef.current.rotation.x += delta;
        groupRef.current.rotation.z += delta;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
        {/* The Star Mesh */}
        <mesh geometry={starGeometry}>
          <meshPhysicalMaterial 
            color={COLORS.GOLD} 
            emissive={COLORS.GOLD}
            emissiveIntensity={1.0}
            roughness={0.1}
            metalness={1.0}
            clearcoat={1}
            clearcoatRoughness={0}
          />
        </mesh>
        
        {/* Inner glow core (invisible mesh with strong light) */}
        <pointLight color="#FFD700" intensity={8} distance={15} decay={2} />
        
        {/* Subtle sparkle particles around the star */}
        <Stars radius={1.5} depth={0} count={15} factor={3} saturation={0} fade speed={3} />
      </Float>
    </group>
  );
};