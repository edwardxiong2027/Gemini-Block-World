
import React from 'react';
import { usePlane } from '@react-three/cannon';
import { MeshStandardMaterial } from 'three';

interface GroundProps {
  addCube: (x: number, y: number, z: number) => void;
}

const Ground: React.FC<GroundProps> = ({ addCube }) => {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -0.5, 0],
  }));

  return (
    <mesh
      ref={ref as any}
      onClick={(e) => {
        e.stopPropagation();
        // Fix: Use explicit property access for x, y, z to ensure correct types for Math.ceil
        const { x, y, z } = e.point;
        addCube(Math.ceil(x), Math.ceil(y), Math.ceil(z));
      }}
    >
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#3a5a40" />
    </mesh>
  );
};

export default Ground;
