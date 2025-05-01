import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';

// Simplified continent outline coordinates
const continentOutlines = {
  northAmerica: [
    [-100, 50], [-120, 40], [-120, 30], [-100, 25], 
    [-80, 25], [-60, 45], [-70, 60], [-100, 50]
  ],
  southAmerica: [
    [-70, 10], [-80, -10], [-70, -30], [-60, -50],
    [-50, -40], [-40, -20], [-50, 0], [-70, 10]
  ],
  europe: [
    [0, 50], [-10, 60], [20, 70], [30, 60],
    [20, 45], [10, 40], [0, 50]
  ],
  africa: [
    [-10, 30], [0, 30], [30, 30], [40, 10],
    [20, -30], [10, -30], [-10, 0], [-10, 30]
  ],
  asia: [
    [30, 60], [50, 70], [90, 70], [120, 60],
    [140, 40], [120, 20], [100, 10], [60, 20],
    [40, 30], [30, 60]
  ],
  australia: [
    [110, -20], [130, -20], [140, -30], [130, -35],
    [115, -35], [110, -25], [110, -20]
  ],
};

function ContinentOutlines() {
  const outlines = [];

  Object.values(continentOutlines).forEach((continent) => {
    const points = continent.map(([long, lat]) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (180 - long) * (Math.PI / 180);
      return new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.cos(phi),
        Math.sin(phi) * Math.sin(theta)
      );
    });
    outlines.push(points);
  });

  return (
    <>
      {outlines.map((points, index) => (
        <Line 
          key={index}
          points={points}
          color="#4488ff"
          lineWidth={1.5}
        />
      ))}
    </>
  );
}

function Globe() {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={meshRef}>
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#ffffff"
          wireframe={true}
          wireframeLinewidth={1}
          opacity={0.3}
          transparent={true}
        />
      </mesh>
      <ContinentOutlines />
    </group>
  );
}

export default function Globe3D({ size = 200 }) {
  return (
    <Canvas
      style={{ 
        width: size, 
        height: size,
      }}
      camera={{ position: [0, 0, 2.5] }}
    >
      <ambientLight intensity={1} />
      <Globe />
      <OrbitControls enableZoom={true} enablePan={true} />
    </Canvas>
  );
}