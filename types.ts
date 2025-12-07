import * as THREE from 'three';

export enum AppState {
  CHAOS = 'CHAOS',
  FORMED = 'FORMED'
}

export const COLORS = {
  EMERALD_DARK: new THREE.Color('#002419'),
  EMERALD_LIGHT: new THREE.Color('#005c3e'),
  GOLD: new THREE.Color('#FFD700'),
  GOLD_ROSE: new THREE.Color('#E0BFB8'),
  RED_VELVET: new THREE.Color('#8a0303'),
  SILVER: new THREE.Color('#E5E4E2'),
  
  // New varied ornament colors
  PINK_HOT: new THREE.Color('#FF69B4'),
  PINK_PASTEL: new THREE.Color('#FFD1DC'),
  BLUE_ICE: new THREE.Color('#A5F2F3'),
  BLUE_ROYAL: new THREE.Color('#4169E1'),
  PURPLE_ROYAL: new THREE.Color('#7851A9'),
  PURPLE_DEEP: new THREE.Color('#4B0082'),
};

export interface ParticleData {
  chaosPos: THREE.Vector3;
  targetPos: THREE.Vector3;
  scale: number;
  color: THREE.Color;
  speed: number; // For varying lerp speeds
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // DOM Elements
      div: any;
      header: any;
      h1: any;
      p: any;
      span: any;
      button: any;
      audio: any;
      svg: any;
      path: any;

      // React Three Fiber Elements
      group: any;
      mesh: any;
      points: any;
      bufferGeometry: any;
      bufferAttribute: any;
      instancedMesh: any;
      spotLight: any;
      pointLight: any;
      ambientLight: any;
      meshPhysicalMaterial: any;
    }
  }
}