import * as THREE from 'three';

export function createLabel2(text: string, x: number, y: number, z: number, size: number) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) {
    console.warn('fail getContext("2d")');
    return undefined;
  }

  context.font = size + 'pt Arial';

  const margin = 10;
  const textWidth = context.measureText(text).width;

  context.strokeStyle = 'black';
  context.strokeRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = 'red';
  context.strokeRect(
    canvas.width / 2 - textWidth / 2 - margin / 2,
    canvas.height / 2 - size / 2 - +margin / 2,
    textWidth + margin,
    size + margin,
  );

  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = 'black';
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;

  const material = new THREE.MeshBasicMaterial({ map: texture });

  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(canvas.width, canvas.height, 10, 10), material);
  // TODO: mesh.overdraw = true;
  (mesh as any).overdraw = true;
  // mesh.doubleSided = true;
  mesh.position.x = x - canvas.width / 2;
  mesh.position.y = y - canvas.height / 2;

  return mesh;
}