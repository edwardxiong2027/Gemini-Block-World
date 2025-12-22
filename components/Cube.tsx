
import React, { useState } from 'react';
import { useBox } from '@react-three/cannon';
import { BlockType } from '../types';
import { COLORS } from '../constants';
import { ThreeEvent } from '@react-three/fiber';

interface CubeProps {
  position: [number, number, number];
  texture: BlockType;
  addCube: (x: number, y: number, z: number) => void;
  removeCube: (x: number, y: number, z: number) => void;
}

const Cube: React.FC<CubeProps> = ({ position, texture, addCube, removeCube }) => {
  const [hover, setHover] = useState<number | null>(null);
  const [ref] = useBox(() => ({
    type: 'Static',
    position,
  }));

  const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHover(Math.floor(e.faceIndex! / 2));
  };

  const onPointerOut = () => {
    setHover(null);
  };

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const clickedFace = Math.floor(e.faceIndex! / 2);
    const { x, y, z } = ref.current!.position;

    if (e.button === 0) { // Left click: Remove
      removeCube(x, y, z);
      return;
    }

    if (e.button === 2) { // Right click: Add
      if (clickedFace === 0) addCube(x + 1, y, z);
      else if (clickedFace === 1) addCube(x - 1, y, z);
      else if (clickedFace === 2) addCube(x, y + 1, z);
      else if (clickedFace === 3) addCube(x, y - 1, z);
      else if (clickedFace === 4) addCube(x, y, z + 1);
      else if (clickedFace === 5) addCube(x, y, z - 1);
    }
  };

  return (
    <mesh
      ref={ref as any}
      onPointerMove={onPointerMove}
      onPointerOut={onPointerOut}
      onClick={onClick}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={hover !== null ? '#ddd' : COLORS[texture]}
        opacity={texture === 'glass' ? 0.6 : 1}
        transparent={texture === 'glass'}
      />
    </mesh>
  );
};

export default Cube;
