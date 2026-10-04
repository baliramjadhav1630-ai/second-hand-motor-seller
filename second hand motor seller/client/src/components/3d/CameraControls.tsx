import React, { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';

export type CameraPreset = 'front' | 'side' | 'rear' | 'isometric' | 'interior' | 'reset';

interface CameraControlsProps {
  preset: CameraPreset;
  autoRotate?: boolean;
}

export const CameraControls: React.FC<CameraControlsProps> = ({
  preset,
  autoRotate = false
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  useEffect(() => {
    if (!controlsRef.current) return;

    const targets: Record<CameraPreset, { pos: [number, number, number]; lookAt: [number, number, number] }> = {
      front: { pos: [0, 1.0, 4.8], lookAt: [0, 0.4, 0] },
      side: { pos: [4.8, 1.0, 0], lookAt: [0, 0.4, 0] },
      rear: { pos: [0, 1.2, -4.8], lookAt: [0, 0.4, 0] },
      isometric: { pos: [4.0, 2.5, 4.0], lookAt: [0, 0.4, 0] },
      interior: { pos: [0.35, 1.05, 0.3], lookAt: [0, 0.85, 1.8] },
      reset: { pos: [4.0, 2.2, 4.0], lookAt: [0, 0.4, 0] }
    };

    const config = targets[preset] || targets.reset;

    // Smoothly animate camera position
    const startPos = camera.position.clone();
    const endPos = new THREE.Vector3(...config.pos);
    const startTarget = controlsRef.current.target.clone();
    const endTarget = new THREE.Vector3(...config.lookAt);

    let progress = 0;
    const duration = 800; // ms
    const startTime = performance.now();

    const animateTransition = (now: number) => {
      progress = Math.min((now - startTime) / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);

      camera.position.lerpVectors(startPos, endPos, ease);
      controlsRef.current?.target.lerpVectors(startTarget, endTarget, ease);
      controlsRef.current?.update();

      if (progress < 1) {
        requestAnimationFrame(animateTransition);
      }
    };

    requestAnimationFrame(animateTransition);
  }, [preset, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      minDistance={2.0}
      maxDistance={8.5}
      maxPolarAngle={Math.PI / 2 - 0.05} // Prevent camera going below floor
      minPolarAngle={0.1}
      autoRotate={autoRotate}
      autoRotateSpeed={0.8}
      makeDefault
    />
  );
};
