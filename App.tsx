
import React, { useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky, PointerLockControls, Stars } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import { nanoid } from 'nanoid';

import Player from './components/Player';
import Ground from './components/Ground';
import Cube from './components/Cube';
import { BlockType, CubeData } from './types';
import { TEXTURES, COLORS } from './constants';
import { useKeyboard } from './hooks/useKeyboard';
import { getArchitecturalAdvice, ArchitectureHint } from './services/geminiService';

const App: React.FC = () => {
  const [cubes, setCubes] = useState<CubeData[]>([]);
  const [activeTexture, setActiveTexture] = useState<BlockType>('grass');
  const [aiAdvice, setAiAdvice] = useState<ArchitectureHint | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [showUi, setShowUi] = useState(true);

  const { digit1, digit2, digit3, digit4, digit5 } = useKeyboard();

  useEffect(() => {
    const textures: BlockType[] = ['grass', 'dirt', 'wood', 'log', 'cobblestone'];
    if (digit1) setActiveTexture(textures[0]);
    if (digit2) setActiveTexture(textures[1]);
    if (digit3) setActiveTexture(textures[2]);
    if (digit4) setActiveTexture(textures[3]);
    if (digit5) setActiveTexture(textures[4]);
  }, [digit1, digit2, digit3, digit4, digit5]);

  const addCube = useCallback((x: number, y: number, z: number) => {
    setCubes((prev) => [
      ...prev,
      {
        key: nanoid(),
        pos: [Math.round(x), Math.round(y), Math.round(z)],
        texture: activeTexture,
      },
    ]);
  }, [activeTexture]);

  const removeCube = useCallback((x: number, y: number, z: number) => {
    setCubes((prev) => prev.filter((cube) => {
      const [cx, cy, cz] = cube.pos;
      return cx !== Math.round(x) || cy !== Math.round(y) || cz !== Math.round(z);
    }));
  }, []);

  const fetchAiAdvice = async () => {
    setLoadingAdvice(true);
    const themes = ["Sky Castle", "Underground Bunker", "Floating Garden", "Obsidian Tower", "Cozy Cottage"];
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    const advice = await getArchitecturalAdvice(randomTheme);
    setAiAdvice(advice);
    setLoadingAdvice(false);
  };

  // Initial advice
  useEffect(() => {
    fetchAiAdvice();
  }, []);

  return (
    <div className="w-full h-full relative">
      <div className="crosshair" />

      {/* 3D Engine */}
      <Canvas shadows camera={{ fov: 45 }}>
        <Sky sunPosition={[100, 100, 20]} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.5} />
        <pointLight position={[100, 100, 100]} castShadow />

        <Physics gravity={[0, -9.81, 0]}>
          <Player />
          <Cubes cubes={cubes} addCube={addCube} removeCube={removeCube} />
          <Ground addCube={addCube} />
        </Physics>

        <PointerLockControls onUnlock={() => setShowUi(true)} onLock={() => setShowUi(false)} />
      </Canvas>

      {/* UI Overlay */}
      <div className={`absolute top-0 left-0 w-full p-6 flex justify-between items-start pointer-events-none transition-opacity duration-300 ${showUi ? 'opacity-100' : 'opacity-0'}`}>
        {/* Left Side: Instructions */}
        <div className="bg-black/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-white w-72 pointer-events-auto">
          <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Gemini World</h1>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><span className="text-emerald-400 font-bold">WASD:</span> Move</li>
            <li><span className="text-emerald-400 font-bold">SPACE:</span> Jump</li>
            <li><span className="text-emerald-400 font-bold">CLICK:</span> Lock Camera</li>
            <li><span className="text-emerald-400 font-bold">ESC:</span> Unlock Camera</li>
            <li><span className="text-emerald-400 font-bold">L-CLICK:</span> Break Block</li>
            <li><span className="text-emerald-400 font-bold">R-CLICK:</span> Place Block</li>
            <li><span className="text-emerald-400 font-bold">1-5:</span> Change Texture</li>
          </ul>
        </div>

        {/* Right Side: Gemini AI Architect */}
        <div className="bg-black/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-white w-80 pointer-events-auto">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <h2 className="font-bold text-lg uppercase tracking-wider text-blue-400">AI Architect</h2>
          </div>
          
          {loadingAdvice ? (
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="h-12 bg-gray-700 rounded"></div>
            </div>
          ) : aiAdvice ? (
            <div className="space-y-3">
              <p className="font-bold text-lg">{aiAdvice.title}</p>
              <p className="text-xs text-gray-400 leading-relaxed italic">"{aiAdvice.description}"</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {aiAdvice.suggestedMaterials.map(m => (
                  <span key={m} className="px-2 py-0.5 bg-white/10 rounded-full text-[10px] uppercase border border-white/5">{m}</span>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No advice yet. Try clicking build.</p>
          )}

          <button 
            onClick={fetchAiAdvice}
            disabled={loadingAdvice}
            className="mt-6 w-full py-2 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 transition-all rounded-lg font-bold text-sm shadow-lg shadow-blue-900/20"
          >
            Generate New Idea
          </button>
        </div>
      </div>

      {/* Bottom: Inventory Bar */}
      <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 flex gap-4 bg-black/40 p-3 rounded-2xl backdrop-blur-xl border border-white/10 transition-transform duration-300 ${showUi ? 'translate-y-0' : 'translate-y-32'}`}>
        {(['grass', 'dirt', 'wood', 'log', 'cobblestone'] as BlockType[]).map((tex, i) => (
          <div 
            key={tex}
            onClick={() => setActiveTexture(tex)}
            className={`relative w-14 h-14 rounded-xl cursor-pointer overflow-hidden border-2 transition-all ${activeTexture === tex ? 'border-emerald-400 scale-110 shadow-lg shadow-emerald-500/20' : 'border-white/10 grayscale opacity-60'}`}
          >
            <div className="absolute inset-0" style={{ backgroundColor: COLORS[tex] }} />
            <img src={TEXTURES[tex]} alt={tex} className="w-full h-full object-cover mix-blend-overlay" />
            <span className="absolute top-0.5 left-1 text-[10px] font-bold text-white shadow-sm">{i + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper component to render all cubes efficiently
const Cubes = React.memo(({ cubes, addCube, removeCube }: { cubes: CubeData[], addCube: any, removeCube: any }) => {
  return (
    <>
      {cubes.map((cube) => (
        <Cube
          key={cube.key}
          position={cube.pos}
          texture={cube.texture}
          addCube={addCube}
          removeCube={removeCube}
        />
      ))}
    </>
  );
});

export default App;
