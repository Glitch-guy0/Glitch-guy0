import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, MathUtils, Vector3, MeshStandardMaterial, Color } from 'three';
import { Float } from '@react-three/drei';

interface MahoragaWheelProps {
  /** The target rotation angle in degrees around the Y-axis (spinning). */
  targetRotation: number;
  /** Whether the loading phase is complete and intro animation should start. */
  isLoaded: boolean;
  /** Callback when the wheel is clicked. */
  onClick: () => void;
}

/**
 * 3D Component representing the Mahoraga Wheel.
 * Handles its own intro animation and smooth rotation.
 */
export const MahoragaWheel: React.FC<MahoragaWheelProps> = ({ targetRotation, isLoaded, onClick }) => {
  const groupRef = useRef<Group>(null);

  // Create material safely using useState to ensure fresh instance on mount
  const [goldMaterial] = useState(() => new MeshStandardMaterial({
    color: "#FFD700",
    metalness: 0.8,
    roughness: 0.2,
    emissive: new Color("#B8860B"),
    emissiveIntensity: 0.2
  }));

  // Clean up material on unmount
  useEffect(() => {
    return () => {
      goldMaterial.dispose();
    };
  }, [goldMaterial]);

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

    // Setting to -10 degrees as specifically requested to tilt it backward relative to the camera
    const tiltRadians = MathUtils.degToRad(-10); // Tilt slightly backward
    const targetRotX = isLoaded ? tiltRadians : Math.PI / 2;

    // Smoothly interpolate position and tilt (X-axis)
    group.position.lerp(targetPos, delta * 2);
    group.rotation.x = MathUtils.lerp(group.rotation.x, targetRotX, delta * 2);

    // 2. Spinning Logic (Y-axis now, since it's built horizontally)
    const targetRotY = MathUtils.degToRad(targetRotation);

    // If not loaded, spin continuously
    if (!isLoaded) {
      group.rotation.y += delta * 2;
    } else {
      // If loaded, rotate to target
      group.rotation.y = MathUtils.lerp(group.rotation.y, targetRotY, delta * 3);
    }
  });

  return (
    <group
      ref={groupRef}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; }}
    >
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2} enabled={isLoaded}>
        {/* We build the geometry natively horizontal on the XZ plane. */}
        {/* Torus defaults to XY plane, so we rotate it Math.PI/2 on X to make it flat on XZ. */}
        <group rotation={[0, 0, 0]}>

          {/* Main Torus (Ring) - rotated to lay flat */}
          <mesh material={goldMaterial} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[2.5, 0.15, 16, 64]} />
          </mesh>

          {/* Inner Hub */}
          <mesh material={goldMaterial}>
            <sphereGeometry args={[0.5, 32, 32]} />
          </mesh>

          {/* Spokes/Handles - distribute horizontally around Y axis */}
          {[...Array(8)].map((_, i) => (
            // Rotate each group around the Y-axis
            <group key={i} rotation={[0, (i * Math.PI) / 4, 0]}>
              {/* Spoke pointing outwards on the Z-axis (or X-axis, let's use Z) */}
              {/* We rotate the cylinder so it points along Z, cylinder defaults to pointing along Y */}
              <mesh position={[0, 0, 1.5]} rotation={[Math.PI / 2, 0, 0]} material={goldMaterial}>
                <cylinderGeometry args={[0.1, 0.1, 2.5]} />
              </mesh>
              {/* Handle Knob at the end of the spoke */}
              <mesh position={[0, 0, 2.8]} material={goldMaterial}>
                <sphereGeometry args={[0.2, 16, 16]} />
              </mesh>
            </group>
          ))}
        </group>
      </Float>
    </group>
  );
};
