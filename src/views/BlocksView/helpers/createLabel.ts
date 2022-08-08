import * as THREE from 'three';
import { Font } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

export function createLabel(
  text: string,
  x: number,
  y: number,
  z: number,
  angle: number,
  shift: number,
  size: number,
  material: THREE.MeshBasicMaterial | THREE.LineBasicMaterial,
  font: Font,
) {
  const dangle = angle * (Math.PI / 180);

  if (shift != 0) {
    switch (angle) {
      case 0:
        x -= shift;
        break;
      case 90:
        y -= shift;
        break;
      case 180:
        x += shift;
        break;
      case 270:
        y += shift;
        break;
      default:
        x -= shift * Math.cos(dangle);
        y -= shift * Math.sin(dangle);
    }
  }

  return createMeshText(text, x, y, z, dangle, size, material, font);
}

function createMeshText(
  text: string,
  x: number,
  y: number,
  z: number,
  dangle: number,
  size: number,
  material: THREE.MeshBasicMaterial | THREE.LineBasicMaterial,
  font: Font,
) {
  const geometry = new TextGeometry(text, {
    font,
    size,
    height: 0,
    curveSegments: 4,
  });

  // geometry.computeBoundingBox()
  // console.log(geometry.boundingBox)
  // console.log(geometry.boundingBox.max.x - geometry.boundingBox.min.x)

  const label = new THREE.Mesh(geometry, material);
  label.position.set(x, y, z);
  if (dangle !== 0) {
    label.rotateZ(dangle);
  }

  label.matrixAutoUpdate = false;
  label.updateMatrix();

  // Merge all text geometries.
  // mergedGeometry = BufferGeometryUtils.mergeBufferGeometries( geometries );

  // var mesh = new THREE.Mesh(mergedGeometry, materialWhite);

  return label;
}
