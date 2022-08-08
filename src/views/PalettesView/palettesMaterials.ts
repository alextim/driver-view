import * as THREE from 'three';

const palettesMaterials = {
  plum: new THREE.MeshBasicMaterial({ color: 0xff00ff }),
  orange: new THREE.MeshBasicMaterial({ color: 0x00ffff }),
  aquamarine: new THREE.MeshBasicMaterial({ color: 0x0000ff }),
  frame: new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true }),
  active: new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true }),
  selected: new THREE.MeshBasicMaterial({ color: 0xffff00 }),
  defective: new THREE.MeshBasicMaterial({ color: 0xffd0d3 }),
  stringer: new THREE.MeshBasicMaterial({ color: 0xa0522d }),
};

export default palettesMaterials;
