import React from 'react';
import { Grid } from '@react-three/drei';

export const TurntableStage: React.FC = () => {
  return (
    <group position={[0, -0.01, 0]}>
      {/* Dynamic Lighting Setup */}
      {/* Ambient Cool Fill */}
      <ambientLight intensity={0.8} color="#94a3b8" />

      {/* Main Studio Key Light */}
      <directionalLight
        position={[6, 8, 5]}
        intensity={2.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
      />

      {/* Futuristic Electric Cyan Rim Light */}
      <directionalLight position={[-6, 5, -5]} intensity={1.8} color="#00f0ff" />

      {/* Warm Magenta/Blue Accent from Bottom/Rear */}
      <spotLight position={[0, 4, -6]} intensity={1.4} color="#38bdf8" angle={0.8} penumbra={1} />

      {/* 1. Circular Turntable Podium */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.4, 0.08, 64]} />
        <meshStandardMaterial
          color="#0b101c"
          metalness={0.7}
          roughness={0.25}
        />
      </mesh>

      {/* Glowing Outer Cyan Stage Ring */}
      <mesh position={[0, 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.25, 3.32, 64]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.8} />
      </mesh>

      {/* Inner Accent Ring */}
      <mesh position={[0, 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.5, 2.53, 64]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.25} />
      </mesh>

      {/* 2. Cyber Reflective Floor Grid */}
      <Grid
        position={[0, -0.02, 0]}
        args={[30, 30]}
        cellSize={0.8}
        cellThickness={1}
        cellColor="#00f0ff"
        sectionSize={2.4}
        sectionThickness={1.5}
        sectionColor="#0072ff"
        fadeDistance={24}
        fadeStrength={1.8}
      />

      {/* Floor Dark Backdrop Plane */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#05070c" roughness={0.7} metalness={0.3} />
      </mesh>
    </group>
  );
};
