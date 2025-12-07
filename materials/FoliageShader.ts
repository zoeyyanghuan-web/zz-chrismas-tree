import * as THREE from 'three';
import { extend, Object3DNode } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';

export const FoliageMaterial = shaderMaterial(
  {
    uTime: 0,
    uProgress: 0, // 0 = Chaos, 1 = Formed
    uColorBase: new THREE.Color('#002419'),
    uColorTip: new THREE.Color('#005c3e'),
    uColorGold: new THREE.Color('#FFD700'),
  },
  // Vertex Shader
  `
    uniform float uTime;
    uniform float uProgress;
    attribute vec3 aTargetPos;
    attribute vec3 aChaosPos;
    attribute float aRandom;
    
    varying vec2 vUv;
    varying float vBlink;
    varying float vDepth;

    // Cubic bezier blending for smoother motion
    float easeInOutCubic(float x) {
        return x < 0.5 ? 4.0 * x * x * x : 1.0 - pow(-2.0 * x + 2.0, 3.0) / 2.0;
    }

    void main() {
      vUv = uv;
      
      float ease = easeInOutCubic(uProgress);
      
      // Interpolate position
      vec3 pos = mix(aChaosPos, aTargetPos, ease);
      
      // Add "breathing" noise
      float breath = sin(uTime * 2.0 + aRandom * 10.0) * 0.1;
      if (uProgress > 0.8) {
        pos += normalize(pos) * breath;
      }

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      
      // Size attenuation
      gl_PointSize = (15.0 * aRandom + 5.0) * (1.0 / -mvPosition.z);
      
      gl_Position = projectionMatrix * mvPosition;
      
      vBlink = sin(uTime * 3.0 + aRandom * 20.0);
      vDepth = pos.y; // gradient based on height
    }
  `,
  // Fragment Shader
  `
    uniform vec3 uColorBase;
    uniform vec3 uColorTip;
    uniform vec3 uColorGold;
    
    varying float vBlink;
    varying float vDepth;

    void main() {
      // Circular particle
      vec2 coord = gl_PointCoord - vec2(0.5);
      float dist = length(coord);
      if (dist > 0.5) discard;

      // Soft edge
      float strength = 1.0 - (dist * 2.0);
      strength = pow(strength, 2.0);

      // Mix colors based on height (vDepth) and sparkles
      vec3 color = mix(uColorBase, uColorTip, clamp(vDepth / 10.0, 0.0, 1.0));
      
      // Add Gold Glint (Blinking)
      float sparkle = smoothstep(0.8, 1.0, vBlink);
      color = mix(color, uColorGold, sparkle * 0.8);

      gl_FragColor = vec4(color, strength);
      
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }
  `
);

extend({ FoliageMaterial });

// Type definition for JSX
declare global {
  namespace JSX {
    interface IntrinsicElements {
      foliageMaterial: Object3DNode<THREE.ShaderMaterial, typeof FoliageMaterial> & {
        uTime?: number;
        uProgress?: number;
        uColorBase?: THREE.Color;
        uColorTip?: THREE.Color;
        uColorGold?: THREE.Color;
      };
    }
  }
}