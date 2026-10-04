import React, { useMemo, useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RealVehicleModelProps {
  color?: string;
  isRotating?: boolean;
}

export const RealVehicleModel: React.FC<RealVehicleModelProps> = ({
  color = '#00f0ff',
  isRotating = false
}) => {
  // Load model with local Draco decoders
  const { scene } = useGLTF('/models/ferrari.glb', '/draco/');
  const groupRef = useRef<THREE.Group>(null);
  const wheelsRef = useRef<THREE.Object3D[]>([]);

  // Clone scene so we don't mutate the cached GLTF across instances
  const clonedScene = useMemo(() => {
    const cloned = scene.clone(true);
    return cloned;
  }, [scene]);

  // Materials
  const bodyMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(color),
      metalness: 0.92,
      roughness: 0.18,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      envMapIntensity: 2.0
    });
  }, []);

  const detailsMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#d1d5db'),
      metalness: 0.95,
      roughness: 0.25
    });
  }, []);

  const glassMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#0f172a'),
      metalness: 0.1,
      roughness: 0.02,
      transmission: 0.9,
      transparent: true,
      opacity: 0.85,
      ior: 1.5
    });
  }, []);

  // Update body color in real-time when user clicks swatches or switches cars
  useEffect(() => {
    if (bodyMaterial) {
      bodyMaterial.color.set(color);
    }
  }, [color, bodyMaterial]);

  // Configure meshes and find wheels
  useEffect(() => {
    wheelsRef.current = [];

    clonedScene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        const name = (child.name || '').toLowerCase();

        if (name === 'body') {
          child.material = bodyMaterial;
        } else if (name === 'glass') {
          child.material = glassMaterial;
        } else if (name.startsWith('rim_') || name === 'trim') {
          child.material = detailsMaterial;
        }

        if (name.startsWith('wheel_') || name.startsWith('rim_')) {
          wheelsRef.current.push(child);
        }
      }
    });
  }, [clonedScene, bodyMaterial, detailsMaterial, glassMaterial]);

  // Subtle rotation animation if isRotating is true
  useFrame((_, delta) => {
    if (isRotating && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
      wheelsRef.current.forEach((wheel) => {
        wheel.rotation.x += delta * 3.0;
      });
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Real Supercar Mesh */}
      <primitive
        object={clonedScene}
        position={[0, 0, 0]}
        scale={1.05}
      />
    </group>
  );
};

// Preload the model
useGLTF.preload('/models/ferrari.glb', '/draco/');
