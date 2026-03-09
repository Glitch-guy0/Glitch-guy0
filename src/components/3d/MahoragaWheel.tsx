import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, MathUtils, Vector3 } from 'three';
import { Float, useGLTF } from '@react-three/drei';

interface MahoragaWheelProps {
  /** Whether the loading phase is complete and intro animation should start. */
  isLoaded: boolean;
  /** Callback when the wheel is clicked. */
  onClick: () => void;
}

/**
 * 3D Component representing the Mahoraga Wheel.
 * Uses a pre-loaded GLB model instead of programmatic geometry.
 * Handles its own intro animation and smooth rotation.
 */
export const MahoragaWheel: React.FC<MahoragaWheelProps> = ({ isLoaded, onClick }) => {
  const groupRef = useRef<Group>(null);

  // Load the GLB model
  const { scene } = useGLTF('/3d/mahoraga_wheel.glb');

  // Local state to track the wheel's independent rotation
  const [internalRotation, setInternalRotation] = useState(0);

  // Pre-calculate target vectors to avoid GC pressure
  const loadedPos = useMemo(() => new Vector3(0, 2, 0), []);
  const initialPos = useMemo(() => new Vector3(0, 0, 0), []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const group = groupRef.current;

    // 1. Intro Animation Logic
    const targetPos = isLoaded ? loadedPos : initialPos;

    // We orient the physical geometry to lie flat on the XZ plane naturally.
    // In "loading" phase, we want a top-view, meaning we look straight down at it.
    // To achieve this while the camera is still on the Z-axis, we rotate the whole group 90 degrees (PI/2) on the X-axis to face the camera.
    // In "loaded" phase, we want it horizontal (front-view), with a slight backward tilt (-10% or -10 degrees).
    // So target X rotation is PI/2 for top-view (loading), and roughly ~10 degrees tilt when horizontal.

    // Actually, if the geometry is horizontal (flat on XZ plane),
    // looking straight at it from Z-axis is an edge-on view.
    // To look down on it from the top (top-view), we rotate X by Math.PI / 2.
    // To view it horizontally but tilted back slightly (-10 degrees), we rotate X by MathUtils.degToRad(-10) + Math.PI/2? No, if it's horizontal, X rotation is 0. But if we tilt it back, it's positive or negative. Let's just say horizontal is X=0. Tilting it back slightly is ~10 deg.

    // Wait, let's redefine:
    // The native geometry will be built horizontally (flat on XZ plane).
    // The camera is at [0, 0, 12], looking at [0,0,0].
    // If geometry is on XZ plane, camera sees it edge-on.
    // To see it "top-view", we must rotate the group on X-axis by 90 degrees (Math.PI / 2).
    // To see it "horizontal front-view with slight tilt back", we rotate it on X-axis to MathUtils.degToRad(-10) or MathUtils.degToRad(10). Let's use 10 degrees for tilt-up, or just ~10 degrees relative to XZ plane.

    // Set to 0 degrees on X-axis (perfectly horizontal) as if hovering over a person.
    const targetRotX = isLoaded ? 0 : Math.PI / 2;

    // Smoothly interpolate position and tilt (X-axis)
    group.position.lerp(targetPos, delta * 2);
    group.rotation.x = MathUtils.lerp(group.rotation.x, targetRotX, delta * 2);

    // 2. Spinning Logic (Y-axis now, since it's built horizontally)
    // Add 7 degrees base offset on Y-axis to give it an off-center "floating" look.
    const targetRotY = MathUtils.degToRad(internalRotation + 7);

    // If not loaded, spin continuously
    if (!isLoaded) {
      group.rotation.y += delta * 2;
    } else {
      // If loaded, rotate to independent local target
      group.rotation.y = MathUtils.lerp(group.rotation.y, targetRotY, delta * 3);
    }
  });

  const handlePointerClick = (e: any) => {
    e.stopPropagation();
    // Increment internal rotation by 45 degrees independently
    setInternalRotation((prev) => prev + 45);
    // Trigger external routing logic
    onClick();
  };

  return (
    <group
      ref={groupRef}
      onClick={handlePointerClick}
      onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; }}
    >
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2} enabled={isLoaded}>
        {/* We use the loaded GLB model, oriented natively horizontally. */}
        <group rotation={[0, 0, 0]} scale={1.5}>
          <primitive object={scene} />
        </group>
      </Float>
    </group>
  );
};

// Preload the model to prevent UI stalls when rendering
useGLTF.preload('/3d/mahoraga_wheel.glb');
