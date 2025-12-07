import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei';
import { Experience } from './components/Experience';
import { UI } from './components/UI';

const App: React.FC = () => {
  const [isFormed, setIsFormed] = useState(false);

  return (
    <div className="relative w-full h-screen bg-black">
      <Canvas
        shadows
        dpr={[1, 2]} // Quality scaling
        gl={{ 
          antialias: false, // Postprocessing handles AA or use SMAA if needed, simpler to disable for performance with Bloom
          toneMappingExposure: 1.2
        }}
      >
        <Suspense fallback={null}>
          <Experience isFormed={isFormed} />
        </Suspense>
      </Canvas>
      
      <Loader 
        containerStyles={{ background: '#000500' }}
        innerStyles={{ background: '#333', width: '200px' }}
        barStyles={{ background: '#D4AF37', height: '5px' }}
        dataStyles={{ color: '#D4AF37', fontFamily: 'serif' }}
      />
      
      <UI isFormed={isFormed} toggleFormed={() => setIsFormed(!isFormed)} />
    </div>
  );
};

export default App;
