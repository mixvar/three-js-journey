import * as Three from "three";

export const floor1Material = new Three.MeshStandardMaterial({
  color: "limegreen",
});

export const floor2Material = new Three.MeshStandardMaterial({
  color: "greenyellow",
});

export const floor3Material = new Three.MeshStandardMaterial({
  color: "lightsteelblue",
});

export const obstacleMaterial = new Three.MeshStandardMaterial({
  color: "orangered",
});

obstacleMaterial.roughness = 0.5;
obstacleMaterial.metalness = 0.8;

export const wallMaterial = new Three.MeshStandardMaterial({
  color: "slategrey",
});

wallMaterial.roughness = 0;
wallMaterial.metalness = 1;
