import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ProceduralVehicleProps {
  color?: string;
  modelType?: 'hyper_ev' | 'cyber_coupe' | 'm_spec' | 'sport_suv' | 'gran_turismo';
  isRotating?: boolean;
}

export const ProceduralVehicle: React.FC<ProceduralVehicleProps> = ({
  color = '#00f0ff',
  modelType = 'hyper_ev',
  isRotating = false
}) => {
  const vehicleGroup = useRef<THREE.Group>(null);
  const wheelsGroup = useRef<THREE.Group>(null);

  // Subtle chassis idle vibration or slow rotation if enabled
  useFrame((_, delta) => {
    if (isRotating && vehicleGroup.current) {
      vehicleGroup.current.rotation.y += delta * 0.4;
    }
  });

  // Color mappings
  const bodyColor = new THREE.Color(color);
  const darkTrimColor = new THREE.Color('#111622');
  const chromeColor = new THREE.Color('#e2e8f0');
  const tireColor = new THREE.Color('#15171e');
  const rimColor = new THREE.Color('#334155');
  const caliperColor = new THREE.Color('#00f0ff');
  const lightGlowColor = new THREE.Color('#00f0ff');
  const tailLightGlowColor = new THREE.Color('#ff003c');

  // Height and proportions based on vehicle type
  const isSuv = modelType === 'sport_suv';
  const chassisY = isSuv ? 0.65 : 0.42;
  const cabinHeight = isSuv ? 0.95 : 0.68;
  const cabinLength = isSuv ? 2.4 : 2.0;

  return (
    <group ref={vehicleGroup} position={[0, 0, 0]}>
      {/* 1. Main Vehicle Lower Chassis */}
      <mesh position={[0, chassisY, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.9, 0.45, 4.4]} />
        <meshStandardMaterial
          color={bodyColor}
          metalness={0.88}
          roughness={0.18}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Aerodynamic Front Nose / Hood taper */}
      <mesh position={[0, chassisY + 0.08, 1.8]} rotation={[-0.14, 0, 0]} castShadow>
        <boxGeometry args={[1.86, 0.28, 1.3]} />
        <meshStandardMaterial
          color={bodyColor}
          metalness={0.88}
          roughness={0.18}
        />
      </mesh>

      {/* Front Splitter / Carbon Aero Chin */}
      <mesh position={[0, chassisY - 0.16, 2.25]} castShadow>
        <boxGeometry args={[1.92, 0.08, 0.45]} />
        <meshStandardMaterial color={darkTrimColor} roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Rear Carbon Diffuser */}
      <mesh position={[0, chassisY - 0.12, -2.22]} castShadow>
        <boxGeometry args={[1.88, 0.14, 0.45]} />
        <meshStandardMaterial color={darkTrimColor} roughness={0.3} metalness={0.8} />
      </mesh>

      {/* 2. Sleek Cockpit / Glass Canopy */}
      <group position={[0, chassisY + cabinHeight * 0.5 + 0.15, -0.15]}>
        {/* Glass Windshield & Roof */}
        <mesh castShadow>
          <boxGeometry args={[1.52, cabinHeight, cabinLength]} />
          <meshPhysicalMaterial
            color="#080c14"
            transmission={0.85}
            opacity={1}
            transparent
            roughness={0.1}
            metalness={0.1}
            ior={1.52}
          />
        </mesh>

        {/* Roof Panel */}
        <mesh position={[0, cabinHeight * 0.5 + 0.02, 0]} castShadow>
          <boxGeometry args={[1.48, 0.06, cabinLength * 0.85]} />
          <meshStandardMaterial
            color={bodyColor}
            metalness={0.85}
            roughness={0.2}
          />
        </mesh>

        {/* Interior Steering Wheel & Dashboard Silhouettes */}
        <mesh position={[0.38, -0.05, 0.55]} rotation={[0.4, 0, 0]}>
          <torusGeometry args={[0.16, 0.03, 12, 24]} />
          <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.1, 0.65]}>
          <boxGeometry args={[1.35, 0.15, 0.4]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
        {/* 17-inch Center Screen Glow */}
        <mesh position={[0, -0.02, 0.58]} rotation={[-0.2, 0, 0]}>
          <boxGeometry args={[0.35, 0.22, 0.02]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>
      </group>

      {/* 3. Aerodynamic Rear Wing / Lip Spoiler */}
      <group position={[0, chassisY + 0.35, -2.1]}>
        <mesh castShadow>
          <boxGeometry args={[1.82, 0.06, 0.38]} />
          <meshStandardMaterial color={darkTrimColor} metalness={0.9} roughness={0.15} />
        </mesh>
        {/* Wing Endplates */}
        <mesh position={[0.9, 0.08, 0]}>
          <boxGeometry args={[0.04, 0.22, 0.4]} />
          <meshStandardMaterial color={darkTrimColor} />
        </mesh>
        <mesh position={[-0.9, 0.08, 0]}>
          <boxGeometry args={[0.04, 0.22, 0.4]} />
          <meshStandardMaterial color={darkTrimColor} />
        </mesh>
      </group>

      {/* 4. High-Tech Headlights (Neon Cyan / Laser White) */}
      {/* Front Left Headlight */}
      <mesh position={[0.72, chassisY + 0.14, 2.18]} rotation={[0, 0.15, 0]}>
        <boxGeometry args={[0.36, 0.08, 0.12]} />
        <meshBasicMaterial color={lightGlowColor} />
      </mesh>
      {/* Front Right Headlight */}
      <mesh position={[-0.72, chassisY + 0.14, 2.18]} rotation={[0, -0.15, 0]}>
        <boxGeometry args={[0.36, 0.08, 0.12]} />
        <meshBasicMaterial color={lightGlowColor} />
      </mesh>
      {/* Lightbar connecting headlights */}
      <mesh position={[0, chassisY + 0.15, 2.22]}>
        <boxGeometry args={[1.1, 0.02, 0.04]} />
        <meshBasicMaterial color={lightGlowColor} />
      </mesh>

      {/* 5. Continuous Rear Tail Light Strip (Cyber Red) */}
      <mesh position={[0, chassisY + 0.22, -2.22]}>
        <boxGeometry args={[1.82, 0.06, 0.05]} />
        <meshBasicMaterial color={tailLightGlowColor} />
      </mesh>

      {/* 6. Four High-Performance Wheels with Alloy Rims & Calipers */}
      <group ref={wheelsGroup}>
        {/* Front-Left Wheel */}
        <WheelAssembly position={[0.98, 0.36, 1.4]} isLeft={true} tireColor={tireColor} rimColor={rimColor} caliperColor={caliperColor} />
        {/* Front-Right Wheel */}
        <WheelAssembly position={[-0.98, 0.36, 1.4]} isLeft={false} tireColor={tireColor} rimColor={rimColor} caliperColor={caliperColor} />
        {/* Rear-Left Wheel */}
        <WheelAssembly position={[0.98, 0.36, -1.4]} isLeft={true} tireColor={tireColor} rimColor={rimColor} caliperColor={caliperColor} />
        {/* Rear-Right Wheel */}
        <WheelAssembly position={[-0.98, 0.36, -1.4]} isLeft={false} tireColor={tireColor} rimColor={rimColor} caliperColor={caliperColor} />
      </group>

      {/* Underbody Shadow Plane */}
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.4, 4.8]} />
        <meshBasicMaterial color="#030509" transparent opacity={0.65} />
      </mesh>
    </group>
  );
};

// Detailed Wheel with Low Profile Tire, Alloy Rim Spokes, and Brembo-style Caliper
const WheelAssembly: React.FC<{
  position: [number, number, number];
  isLeft: boolean;
  tireColor: THREE.Color;
  rimColor: THREE.Color;
  caliperColor: THREE.Color;
}> = ({ position, isLeft, tireColor, rimColor, caliperColor }) => {
  return (
    <group position={position}>
      {/* Outer Tire */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.38, 0.38, 0.32, 28]} />
        <meshStandardMaterial color={tireColor} roughness={0.8} />
      </mesh>

      {/* Outer Rim Ring */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.26, 0.26, 0.33, 24]} />
        <meshStandardMaterial color={rimColor} metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Alloy Spokes Center Cap */}
      <mesh position={[isLeft ? 0.16 : -0.16, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.1, 0.04, 16]} />
        <meshStandardMaterial color="#ffffff" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Brake Rotor Disc */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.22, 0.22, 0.04, 24]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.3} />
      </mesh>

      {/* High-Performance Brake Caliper */}
      <mesh position={[isLeft ? 0.04 : -0.04, 0.14, 0]}>
        <boxGeometry args={[0.12, 0.14, 0.1]} />
        <meshStandardMaterial color={caliperColor} metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
};
