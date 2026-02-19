import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, MathUtils, Vector3, MeshStandardMaterial, Color } from 'three';
import { Float } from '@react-three/drei';

interface MahoragaWheelProps {
  /** The target rotation angle in degrees around the Z-axis (spinning). */
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
    const targetRotX = isLoaded ? 0 : -Math.PI / 2;

    // Smoothly interpolate position and tilt (X-axis)
    group.position.lerp(targetPos, delta * 2);
    group.rotation.x = MathUtils.lerp(group.rotation.x, targetRotX, delta * 2);

    // 2. Spinning Logic (Z-axis)
    const targetRotZ = MathUtils.degToRad(targetRotation);

    // If not loaded, spin continuously
    if (!isLoaded) {
      group.rotation.z += delta * 2;
    } else {
      // If loaded, rotate to target
      group.rotation.z = MathUtils.lerp(group.rotation.z, targetRotZ, delta * 3);
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
        <group rotation={[0, 0, 0]}>
          {/* Main Torus (Ring) */}
          <mesh material={goldMaterial}>
            <torusGeometry args={[2.5, 0.15, 16, 64]} />
          </mesh>

          {/* Inner Hub */}
          <mesh material={goldMaterial}>
            <sphereGeometry args={[0.5, 32, 32]} />
          </mesh>

          {/* Spokes/Handles */}
          {[...Array(8)].map((_, i) => (
            <group key={i} rotation={[0, 0, (i * Math.PI) / 4]}>
              {/* Spoke */}
              <mesh position={[0, 1.5, 0]} material={goldMaterial}>
                <cylinderGeometry args={[0.1, 0.1, 2.5]} />
              </mesh>
              {/* Handle Knob */}
              <mesh position={[0, 2.8, 0]} material={goldMaterial}>
                <sphereGeometry args={[0.2, 16, 16]} />
              </mesh>
            </group>
          ))}
        </group>
      </Float>
    </group>
  );
};
