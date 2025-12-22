
import React from 'react';
import { BlockType } from './types';

export const TEXTURES: Record<BlockType, string> = {
  dirt: 'https://picsum.photos/id/10/256/256',
  grass: 'https://picsum.photos/id/11/256/256',
  glass: 'https://picsum.photos/id/12/256/256',
  wood: 'https://picsum.photos/id/13/256/256',
  log: 'https://picsum.photos/id/14/256/256',
  cobblestone: 'https://picsum.photos/id/15/256/256',
};

// Colors instead of textures for high performance if images fail
export const COLORS: Record<BlockType, string> = {
  dirt: '#8B4513',
  grass: '#228B22',
  glass: 'rgba(173, 216, 230, 0.4)',
  wood: '#D2B48C',
  log: '#5D4037',
  cobblestone: '#808080',
};

export const INITIAL_CUBES: { pos: [number, number, number], texture: BlockType }[] = [
  { pos: [1, 0, 1], texture: 'grass' },
  { pos: [2, 0, 1], texture: 'dirt' },
  { pos: [3, 0, 1], texture: 'cobblestone' },
  { pos: [1, 1, 1], texture: 'wood' },
  { pos: [1, 2, 1], texture: 'log' },
];

export const JUMP_FORCE = 4;
export const SPEED = 4;
