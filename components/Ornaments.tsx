import React, { useMemo, useRef, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getRandomSpherePoint, getLayeredConePoint } from '../utils/math';

interface OrnamentProps {
  count: number;
  isFormed: boolean;
  type: 'box' | 'sphere' | 'bow';
  colors: THREE.Color[];
  weight: number; // Affects lerp speed
}

export const Ornaments: React.FC<OrnamentProps> = ({ count, isFormed, type, colors, weight }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Pre-calculate positions and scales
  const data = useMemo(() => {
    return new Array(count).fill(0).map(() => {
      // Chaos Position
      const chaos = getRandomSpherePoint(30);
      
      // Target Position aligned with Foliage Layers
      // Same parameters as foliage: Height 13, Base 4.5, 9 Layers
      // We push them slightly outward (radius * 1.1) to sit ON the branches
      const rawTarget = getLayeredConePoint(13, 4.5, 9, -6.5);
      
      // Push slightly to surface
      const xz = new THREE.Vector2(rawTarget.x, rawTarget.z);
      // Add random offset to scatter them nicely, mostly keeping the layered Y structure
      
      const target = new THREE.Vector3(rawTarget.x, rawTarget.y, rawTarget.z);
      
      // Random rotation
      const rotation = new THREE.Euler(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      const scale = new THREE.Vector3(1, 1, 1);

      if (type === 'box') {
         const baseSize = Math.random() * 0.3 + 0.3; 
         scale.set(
            (Math.random() * 0.5 + 0.5) * baseSize, 
            (Math.random() * 1.5 + 0.5) * baseSize, 
            (Math.random() * 0.5 + 0.5) * baseSize  
         );
      } else if (type === 'bow') {
          const s = Math.random() * 0.2 + 0.2;
          scale.set(s, s, s);
      } else {
         const s = Math.random() * 0.25 + 0.15; 
         scale.set(s, s, s);
      }

      return { chaos, target, rotation, scale };
    });
  }, [count, type]);

  useLayoutEffect(() => {
    if (meshRef.current) {
      for (let i = 0; i < count; i++) {
        const paletteColor = colors[Math.floor(Math.random() * colors.length)];
        const color = paletteColor.clone();
        
        const hsl = { h: 0, s: 0, l: 0 };
        color.getHSL(hsl);
        color.setHSL(hsl.h, hsl.s, hsl.l + (Math.random() - 0.5) * 0.1);

        meshRef.current.setColorAt(i, color);
      }
      meshRef.current.instanceColor!.needsUpdate = true;
    }
  }, [count, colors]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const lerpFactor = delta * weight;
    const time = state.clock.elapsedTime;

    data.forEach((item, i) => {
      meshRef.current!.getMatrixAt(i, dummy.matrix);
      dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
      
      const destination = isFormed ? item.target : item.chaos;
      
      dummy.position.lerp(destination, lerpFactor);
      dummy.scale.copy(item.scale);
      
      if (isFormed) {
         dummy.position.y += Math.sin(time * 2 + i * 0.1) * 0.002;
         dummy.rotation.set(
             item.rotation.x + Math.sin(time * 0.5 + i) * 0.1,
             item.rotation.y + time * 0.1,
             item.rotation.z
         );
      } else {
         dummy.rotation.x += delta;
         dummy.rotation.y += delta;
      }

      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  const geometry = useMemo(() => {
    if (type === 'box') {
        return new THREE.BoxGeometry(1, 1, 1);
    } else if (type === 'bow') {
        return new THREE.TorusKnotGeometry(0.5, 0.15, 64, 8, 2, 3);
    } else {
        return new THREE.SphereGeometry(1, 16, 16);
    }
  }, [type]);

  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: type === 'box' ? 0.3 : 0.15,
      metalness: type === 'box' ? 0.4 : 0.9,
      envMapIntensity: 1.5,
    });
  }, [type]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, count]}
      castShadow
      receiveShadow
    />
  );
};