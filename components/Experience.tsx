import React from 'react';
import { PerspectiveCamera, Environment, OrbitControls, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { Foliage } from './Foliage';
import { Ornaments } from './Ornaments';
import { Snowflake } from './Snowflake';
import { COLORS } from '../types';

interface ExperienceProps {
  isFormed: boolean;
}

export const Experience: React.FC<ExperienceProps> = ({ isFormed }) => {
  return (
    <>
      {/* Camera Setup */}
      <PerspectiveCamera makeDefault position={[0, 4, 25]} fov={45} />
      <OrbitControls 
        enablePan={false} 
        minPolarAngle={Math.PI / 4} 
        maxPolarAngle={Math.PI / 1.8}
        minDistance={10}
        maxDistance={40}
        autoRotate={isFormed}
        autoRotateSpeed={0.5}
      />

      {/* Lighting */}
      <ambientLight intensity={0.2} color={COLORS.EMERALD_DARK} />
      
      {/* Golden Spotlights for Luxury Feel */}
      <spotLight 
        position={[10, 20, 10]} 
        angle={0.3} 
        penumbra={1} 
        intensity={200} 
        color={COLORS.GOLD} 
        castShadow 
      />
      <spotLight 
        position={[-10, 20, -10]} 
        angle={0.3} 
        penumbra={1} 
        intensity={200} 
        color="#ffffff" 
        castShadow 
      />
      
      {/* Fill Light from bottom */}
      <pointLight position={[0, -10, 0]} intensity={50} color={COLORS.EMERALD_LIGHT} />

      {/* Environment Map */}
      <Environment preset="lobby" background={false} blur={0.6} />

      {/* The Tree Components */}
      <group position={[0, 0, 0]}>
        {/* Increased count for density, but layered */}
        <Foliage count={15000} isFormed={isFormed} />
        
        {/* Layer 1: Colorful Gift Boxes (Heavy) */}
        <Ornaments 
            count={140} 
            isFormed={isFormed} 
            type="box" 
            colors={[
              COLORS.RED_VELVET, 
              COLORS.GOLD, 
              COLORS.BLUE_ROYAL, 
              COLORS.PURPLE_DEEP, 
              COLORS.EMERALD_LIGHT
            ]}
            weight={1.5} 
        />
        
        {/* Layer 2: Mixed Small Baubles */}
        <Ornaments 
            count={600} 
            isFormed={isFormed} 
            type="sphere" 
            colors={[
              COLORS.GOLD, 
              COLORS.SILVER, 
              COLORS.PINK_PASTEL, 
              COLORS.PINK_HOT, 
              COLORS.BLUE_ICE, 
              COLORS.PURPLE_ROYAL
            ]} 
            weight={2.5} 
        />

        {/* Layer 3: Golden & Red Bows */}
        <Ornaments 
            count={180} 
            isFormed={isFormed} 
            type="bow" 
            colors={[COLORS.GOLD, COLORS.RED_VELVET]} 
            weight={3.0} 
        />

        {/* The Star Topper */}
        <Snowflake isFormed={isFormed} />
      </group>

      {/* Floor Shadows */}
      <ContactShadows 
        opacity={0.6} 
        scale={30} 
        blur={2} 
        far={10} 
        resolution={256} 
        color="#000000" 
        position={[0, -6.5, 0]}
      />

      {/* Post Processing */}
      <EffectComposer disableNormalPass>
        <Bloom 
          luminanceThreshold={0.8} 
          mipmapBlur 
          intensity={1.8} 
          radius={0.5}
        />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </>
  );
};