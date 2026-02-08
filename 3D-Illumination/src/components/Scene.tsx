import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { ShapeType, getShapeById } from '@/lib/shapes';
import { createMaterial, lightingOptions, backgroundOptions, additionalLightOptions } from '@/lib/lighting';

interface SceneProps {
  shapeId: ShapeType;
  wireframe: boolean;
  // Used here: controls whether the mesh material writes/reads the depth buffer (hidden surface removal).
  depthTestEnabled?: boolean;
  ambient: boolean;
  diffuse: boolean;
  specular: boolean;
  shapeColor: string;
  background: string;
  ambientLightColor?: string;
  diffuseLightColor?: string;
  specularLightColor?: string;
  showLightHelpers?: boolean;
  additionalLights?: string[];
  showInterference?: boolean;
  rotationPaused?: boolean;
}

const Shape: React.FC<{ 
  shapeId: ShapeType;
  wireframe: boolean;
  depthTestEnabled?: boolean;
  shapeColor: string;
  rotationPaused?: boolean;
}> = ({ 
  shapeId, 
  wireframe, 
  depthTestEnabled = true,
  shapeColor, 
  rotationPaused = false
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const shape = getShapeById(shapeId);
  const geometry = useMemo(() => shape.geometry(), [shapeId]);
  
  // Uses flat shading by default (see createMaterial); wireframe mode overrides.
  // depthTestEnabled toggles Z-buffer visibility behavior for demonstration.
  const material = useMemo(
    () => createMaterial(shapeColor, wireframe, depthTestEnabled),
    [shapeColor, wireframe, depthTestEnabled]
  );

  useFrame(() => {
    if (meshRef.current && !rotationPaused) {
      meshRef.current.rotation.x += 0.002;
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <mesh 
      ref={meshRef}
      geometry={geometry}
      position={new THREE.Vector3(...shape.defaultPosition)}
      rotation={new THREE.Euler(...shape.defaultRotation)}
      scale={new THREE.Vector3(...shape.defaultScale)}
      castShadow
      receiveShadow
    >
      <primitive object={material} attach="material" />
    </mesh>
  );
};

const SpaceBackground: React.FC = () => {
  return (
    <Stars 
      radius={100} 
      depth={50} 
      count={5000} 
      factor={4} 
      saturation={0} 
      fade
      speed={1}
    />
  );
};

const LightHelper: React.FC<{
  position: [number, number, number];
  color: string;
  type: 'directional' | 'point';
}> = ({ position, color, type }) => {
  const size = type === 'directional' ? 1 : 0.5;
  
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[size * 0.2, 16, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
};

const AdditionalLight: React.FC<{
  color: string;
  position: [number, number, number];
  intensity: number;
  showHelper?: boolean;
}> = ({ color, position, intensity, showHelper = false }) => {
  return (
    <>
      <pointLight
        color={new THREE.Color(color)}
        position={new THREE.Vector3(...position)}
        intensity={intensity}
        castShadow
      />
      {showHelper && (
        <LightHelper 
          position={position}
          color={color}
          type="point"
        />
      )}
    </>
  );
};

const Lights: React.FC<{ 
  ambient: boolean;
  diffuse: boolean;
  specular: boolean;
  ambientColor?: string;
  diffuseColor?: string;
  specularColor?: string;
  showHelpers?: boolean;
  additionalLights?: string[];
  showInterference?: boolean;
}> = React.memo(({ 
  ambient, 
  diffuse, 
  specular, 
  ambientColor = lightingOptions.ambientLight.defaultColor,
  diffuseColor = lightingOptions.diffuseLight.defaultColor,
  specularColor = lightingOptions.specularLight.defaultColor,
  showHelpers = false,
  additionalLights = [],
  showInterference = false
}) => {
  return (
    <>
      {ambient && (
        <ambientLight 
          color={new THREE.Color(ambientColor)}
          intensity={lightingOptions.ambientLight.defaultIntensity}
        />
      )}
      
      {diffuse && (
        <>
          <directionalLight
            color={new THREE.Color(diffuseColor)}
            intensity={lightingOptions.diffuseLight.defaultIntensity}
            position={new THREE.Vector3(...lightingOptions.diffuseLight.defaultPosition)}
            castShadow
          />
          {showHelpers && (
            <LightHelper 
              position={lightingOptions.diffuseLight.defaultPosition}
              color={diffuseColor}
              type="directional"
            />
          )}
        </>
      )}
      
      {specular && (
        <>
          <pointLight
            color={new THREE.Color(specularColor)}
            intensity={lightingOptions.specularLight.defaultIntensity}
            position={new THREE.Vector3(...lightingOptions.specularLight.defaultPosition)}
            castShadow
          />
          {showHelpers && (
            <LightHelper 
              position={lightingOptions.specularLight.defaultPosition}
              color={specularColor}
              type="point"
            />
          )}
        </>
      )}
      
      {additionalLights.map((lightId) => {
        const lightOption = additionalLightOptions.find(opt => opt.id === lightId);
        if (lightOption) {
          return (
            <AdditionalLight
              key={lightId}
              color={lightOption.color}
              position={lightOption.defaultPosition as [number, number, number]}
              intensity={lightOption.defaultIntensity}
              showHelper={showHelpers}
            />
          );
        }
        return null;
      })}
      
      {showInterference && (
        <>
          <AdditionalLight
            color="#9b87f5"
            position={[3, 2, 1]}
            intensity={0.4}
            showHelper={showHelpers}
          />
          <AdditionalLight
            color="#F97316"
            position={[-2, 3, 2]}
            intensity={0.4}
            showHelper={showHelpers}
          />
          <AdditionalLight
            color="#0EA5E9"
            position={[0, -3, 2]}
            intensity={0.4}
            showHelper={showHelpers}
          />
        </>
      )}
    </>
  );
});

Lights.displayName = 'Lights';

const CanvasContainer: React.FC<SceneProps> = ({ 
  shapeId, 
  wireframe, 
  depthTestEnabled = true,
  ambient, 
  diffuse, 
  specular, 
  shapeColor, 
  background,
  ambientLightColor = lightingOptions.ambientLight.defaultColor,
  diffuseLightColor = lightingOptions.diffuseLight.defaultColor,
  specularLightColor = lightingOptions.specularLight.defaultColor,
  showLightHelpers = false,
  additionalLights = [],
  showInterference = false,
  rotationPaused = false
}) => {
  const bgColor = useMemo(() => {
    const bgOption = backgroundOptions.find(option => option.id === background);
    return bgOption ? bgOption.color : '#000000';
  }, [background]);

  const showStars = background === 'space';

  return (
    <Canvas shadows dpr={[1, 2]} className="shape-canvas">
      <color attach="background" args={[bgColor]} />
      
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={40} />
      
      {showStars && <SpaceBackground />}
      
      <Lights 
        ambient={ambient} 
        diffuse={diffuse} 
        specular={specular}
        ambientColor={ambientLightColor}
        diffuseColor={diffuseLightColor}
        specularColor={specularLightColor}
        showHelpers={showLightHelpers}
        additionalLights={additionalLights}
        showInterference={showInterference}
      />
      
      <Shape 
        shapeId={shapeId} 
        wireframe={wireframe}
        depthTestEnabled={depthTestEnabled}
        shapeColor={shapeColor}
        rotationPaused={rotationPaused}
      />
      
      <OrbitControls 
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        minDistance={1}
        maxDistance={20}
        zoomSpeed={1}
      />
      
      <Environment preset="sunset" />
    </Canvas>
  );
};

const Scene: React.FC<SceneProps> = (props) => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="w-full h-full">
      <CanvasContainer {...props} />
    </div>
  );
};

export default Scene;
