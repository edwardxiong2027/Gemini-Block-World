
export type BlockType = 'dirt' | 'grass' | 'glass' | 'wood' | 'log' | 'cobblestone';

export interface CubeData {
  key: string;
  pos: [number, number, number];
  texture: BlockType;
}

export interface KeyboardState {
  moveForward: boolean;
  moveBackward: boolean;
  moveLeft: boolean;
  moveRight: boolean;
  jump: boolean;
  digit1: boolean;
  digit2: boolean;
  digit3: boolean;
  digit4: boolean;
  digit5: boolean;
}
