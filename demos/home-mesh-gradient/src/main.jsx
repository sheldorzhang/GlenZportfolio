import React from 'react';
import { createRoot } from 'react-dom/client';
import { MeshGradient } from '@paper-design/shaders-react';

function HomeMeshGradient() {
  return (
    <MeshGradient
      width={1280}
      height={720}
      colors={['#d8edf3', '#47c6d1', '#b8f1ff', '#fcd783']}
      distortion={0.27}
      swirl={0.2}
      grainMixer={0}
      grainOverlay={0}
      speed={0.5}
      scale={1.4}
      rotation={92}
      offsetY={0.18}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  );
}

createRoot(document.getElementById('home-gradient-mount')).render(<HomeMeshGradient />);
