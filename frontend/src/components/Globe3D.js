import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useDrag } from '@react-three/drei';

function Globe() {
  const meshRef = useRef();
  const [rotationSpeed, setRotationSpeed] = React.useState({ x: 0, y: 0 });

  // Add drag handler
  const bind = useDrag(({ delta: [x, y] }) => {
    setRotationSpeed({ x: -y * 0.01, y: -x * 0.01 });
  });

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotationSpeed.x;
      meshRef.current.rotation.y += rotationSpeed.y;
      // Gradually slow down the rotation
      setRotationSpeed(prev => ({
        x: prev.x * 0.95,
        y: prev.y * 0.95
      }));
    }
  });

  return (
    <mesh ref={meshRef} {...bind()}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshBasicMaterial 
        color="white"
        wireframe={true}
      />
    </mesh>
  );
}

export default function Globe3D({ size = 200 }) {
  return (
    <Canvas
      style={{ 
        width: size, 
        height: size,
        cursor: 'grab',
      }}
      camera={{ position: [0, 0, 2.2] }}
    >
      <Globe />
    </Canvas>
  );
}