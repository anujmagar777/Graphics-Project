import * as THREE from 'three';

// Lighting options
export const lightingOptions = {
  ambientLight: {
    defaultColor: '#404040',
    defaultIntensity: 0.5,
  },
  diffuseLight: {
    defaultColor: '#ffffff',
    defaultIntensity: 0.5,
    defaultPosition: [1, 1, 1] as [number, number, number],
  },
  specularLight: {
    defaultColor: '#ffffff',
    defaultIntensity: 0.3,
    defaultPosition: [-1, -1, -1] as [number, number, number],
  },
};

// Custom light sources
export const additionalLightOptions = [
  {
    id: 'purple',
    name: 'Purple',
    color: '#9b87f5',
    defaultIntensity: 0.6,
    defaultPosition: [3, 2, 1] as [number, number, number],
  },
  {
    id: 'orange',
    name: 'Orange',
    color: '#F97316',
    defaultIntensity: 0.5,
    defaultPosition: [-2, 3, 2] as [number, number, number],
  },
  {
    id: 'blue',
    name: 'Blue',
    color: '#0EA5E9',
    defaultIntensity: 0.4,
    defaultPosition: [0, -3, 2] as [number, number, number],
  },
  {
    id: 'green',
    name: 'Green',
    color: '#10B981',
    defaultIntensity: 0.4,
    defaultPosition: [2, -1, -3] as [number, number, number],
  },
];

// Background options
export const backgroundOptions = [
  { id: 'white', name: 'White', color: '#ffffff' },
  { id: 'gray', name: 'Gray', color: '#808080' },
  { id: 'black', name: 'Black', color: '#000000' },
  { id: 'space', name: 'Space', color: '#000000' },
];

// createMaterial now only supports flat shading (plus optional wireframe)
export const createMaterial = (
  color: string,
  wireframe = false,
  // Created in ShapeViewer and passed down through Scene.
  // Applied here by setting material.depthTest/material.depthWrite.
  depthTestEnabled = true
): THREE.Material => {
  const colorObject = new THREE.Color(color);

  if (wireframe) {
    const material = new THREE.MeshBasicMaterial({
      color: colorObject,
      wireframe: true,
    });

    // Actually applied here: depth buffer usage (hidden surface removal) is controlled by these flags.
    material.depthTest = depthTestEnabled;
    material.depthWrite = depthTestEnabled;
    return material;
  }

  // Flat shading is created here by setting `flatShading: true`.
  // Using Lambert (diffuse-only) so we are not using Phong shading.
  const material = new THREE.MeshLambertMaterial({
    color: colorObject,
    flatShading: true,
  });

  // Actually applied here: depth buffer usage (hidden surface removal) is controlled by these flags.
  material.depthTest = depthTestEnabled;
  material.depthWrite = depthTestEnabled;
  return material;
};
