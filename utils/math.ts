import * as THREE from 'three';

// Generate a random point inside a sphere
export const getRandomSpherePoint = (radius: number): THREE.Vector3 => {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const r = Math.cbrt(Math.random()) * radius;
  const sinPhi = Math.sin(phi);
  const x = r * sinPhi * Math.cos(theta);
  const y = r * sinPhi * Math.sin(theta);
  const z = r * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
};

// Generate a random point on the volume of a cone (Standard Tree shape)
export const getRandomConePoint = (height: number, baseRadius: number, yOffset: number = 0): THREE.Vector3 => {
  const h = height;
  const yNorm = Math.random(); 
  const y = yNorm * h;
  const radiusAtY = (1 - yNorm) * baseRadius;
  
  const theta = Math.random() * Math.PI * 2;
  const r = Math.sqrt(Math.random()) * radiusAtY; 
  
  const x = r * Math.cos(theta);
  const z = r * Math.sin(theta);
  
  return new THREE.Vector3(x, y + yOffset, z);
};

// Generate points in distinct layers (Realistic Pine Tree)
export const getLayeredConePoint = (
  height: number, 
  baseRadius: number, 
  layers: number, 
  yOffset: number = 0
): THREE.Vector3 => {
  // 1. Pick a layer (0 is bottom, layers-1 is top)
  // We bias slightly towards bottom layers for volume, but uniform is fine for filling.
  const layerIndex = Math.floor(Math.random() * layers);
  
  // 2. Calculate vertical bounds of this layer
  const layerHeight = height / layers;
  const gapRatio = 0.3; // 30% gap between layers
  const branchThickness = layerHeight * (1 - gapRatio);
  
  // Base Y for this layer
  const layerBaseY = layerIndex * layerHeight;
  
  // Random Y within the thickness of the branch
  // We distribute more points towards the center of the branch vertically
  const localY = (Math.random() * branchThickness);
  
  let y = layerBaseY + localY;
  
  // 3. Radius at this height (Linear taper for the overall tree cone)
  // Top of tree is narrower
  const overallProgress = y / height;
  const maxRadiusAtY = baseRadius * (1 - overallProgress);
  
  // 4. Radius of the point
  // We want more points near the outer edge to define the branch shape
  const r = Math.sqrt(Math.random()) * maxRadiusAtY;
  
  // 5. Droop Effect:
  // Real pine branches droop under weight.
  // The further out (r), the lower the y.
  const droopFactor = 0.3; // How much it droops at max radius
  y -= (r / baseRadius) * droopFactor;

  const theta = Math.random() * Math.PI * 2;
  
  const x = r * Math.cos(theta);
  const z = r * Math.sin(theta);
  
  return new THREE.Vector3(x, y + yOffset, z);
};