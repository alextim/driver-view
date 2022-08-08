import * as THREE from 'three';
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

export type TextMesh = THREE.Mesh<TextGeometry, THREE.LineBasicMaterial | THREE.MeshBasicMaterial>;

export function mergedMesh(meshes: TextMesh[], material: THREE.MeshBasicMaterial | THREE.LineBasicMaterial) {
  if (meshes.length === 0) {
    return undefined;
  }
  const geometries = meshes.map((m) => {
    // materials.push(b.material);
    m.updateMatrixWorld(); // needs to be done to be sure that all transformations are applied
    return m.geometry.applyMatrix4(m.matrixWorld);
  });
  const mergedGeometry = mergeBufferGeometries(geometries, true);

  return new THREE.Mesh(mergedGeometry, material);
}
