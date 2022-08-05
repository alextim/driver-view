import * as THREE from 'three';

const blockMaterials = {
  transponder: new THREE.LineBasicMaterial({
    color: 0xff00ff,
  }),

  blockType_21: new THREE.LineBasicMaterial({
    color: 0xff0000,
  }),
  blockType_20: new THREE.LineBasicMaterial({
    color: 0x000000,
  }),
  blockType_17: new THREE.LineBasicMaterial({
    color: 0x0000ff,
  }),
  blockType_8: new THREE.LineBasicMaterial({
    color: 0x76a5af,
  }),
  blockType_7: new THREE.LineBasicMaterial({
    color: 0x00ff00,
    side: THREE.DoubleSide,
  }),
  blockType_default: new THREE.LineBasicMaterial({
    color: 0xff0000,
  }),

  blockLabel: new THREE.MeshBasicMaterial({
    color: 0xff0000,
  }),
  blockLabel2: new THREE.MeshBasicMaterial({
    color: 0x000000,
    side: THREE.DoubleSide,
  }),
};

export default blockMaterials;
