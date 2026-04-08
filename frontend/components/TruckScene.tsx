'use client';

import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, ContactShadows, Clone, useGLTF, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Pre-load the 3D model
useGLTF.preload('/truck.glb');

interface TruckProps {
  position: [number, number, number];
  rotation: [number, number, number];
  speed?: number;
  scale?: number;
}

function Truck({ position, rotation, speed = 1, scale = 1 }: TruckProps) {
  const { scene } = useGLTF('/truck.glb');

  // Factor de escala global reducido drásticamente. 
  // 0.01 los hace un 80% más pequeños respecto al 0.05 original.
  const baseScale = 0.01;

  return (
    <group position={position} rotation={rotation} scale={scale * baseScale}>
      {/* Animación básica "paraditos", solo flotan muy sutilmente */}
      <Float speed={speed} rotationIntensity={0.1} floatIntensity={0.1} floatingRange={[-0.05, 0.05]}>
        <Clone object={scene} />
      </Float>
    </group>
  );
}

function TrucksGroup() {
  return (
    <group position={[0, -1.2, 0]}>
      {/* Alineados "rectos" y más separados en el eje X para que no se choquen */}
      <Truck position={[-3.6, 0, 0]} rotation={[0, -Math.PI / 8, 0]} scale={1.1} speed={1.5} />
      <Truck position={[-1.2, 0, 0]} rotation={[0, -Math.PI / 8, 0]} scale={1.1} speed={1.2} />
      <Truck position={[1.2, 0, 0]} rotation={[0, -Math.PI / 8, 0]} scale={1.1} speed={1.8} />
      <Truck position={[3.6, 0, 0]} rotation={[0, -Math.PI / 8, 0]} scale={1.1} speed={1.4} />
    </group>
  );
}

export default function TruckScene() {
  return (
    <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-slate-900 via-primary/10 to-slate-900">
      <Canvas camera={{ position: [0, 1, 8], fov: 40 }}>
        <ambientLight intensity={0.6} />
        <spotLight position={[10, 10, 10]} angle={0.2} penumbra={1} intensity={2} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#ffffff" />

        <Suspense fallback={null}>
          <TrucksGroup />

          <Environment preset="city" />
          <ContactShadows position={[0, -1.2, 0]} opacity={0.5} scale={15} blur={2.5} far={4} color="#000000" />
          
          {/* Permite mover la cámara para interactuar con la escena */}
          <OrbitControls 
            enableZoom={true} 
            enablePan={false} 
            maxPolarAngle={Math.PI / 2 - 0.05} 
            minPolarAngle={Math.PI / 4} 
          />
        </Suspense>
      </Canvas>
    </div>
  );
}