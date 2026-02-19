import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { MahoragaWheel } from './MahoragaWheel';

interface SceneProps {
  /** Whether the initial loading phase is complete. */
  isLoaded: boolean;
  /** The target rotation angle for the wheel (in degrees). */
  targetRotation: number;
  /** Callback when the wheel is clicked. */
  onWheelClick: () => void;
}

/**
 * The main 3D Scene component.
 * Sets up the Canvas, Lights, and Environment.
 */
export const Scene: React.FC<SceneProps> = ({ isLoaded, targetRotation, onWheelClick }) => {
  return (
    <div className="absolute inset-0 w-full h-full -z-10 bg-transparent pointer-events-auto">
      <Canvas
        shadows
        camera={{ position: [0, 0, 12], fov: 45 }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.8} />
          <spotLight
            position={[10, 15, 10]}
            angle={0.3}
            penumbra={1}
            intensity={2}
            castShadow
          />
          <pointLight position={[-5, -5, -5]} intensity={0.5} color="#4444ff" />

          {/* The Wheel */}
          <MahoragaWheel
            isLoaded={isLoaded}
            targetRotation={targetRotation}
            onClick={onWheelClick}
          />

          {/* Environment & Shadows */}
          <Environment preset="city" />
          <ContactShadows
            position={[0, -4, 0]}
            opacity={0.5}
            scale={20}
            blur={2}
            far={4.5}
            color="#000000"
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
