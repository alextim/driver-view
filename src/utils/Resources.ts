import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import fontHelvetiker from 'three/examples/fonts/helvetiker_regular.typeface.json';

import EventEmitter from './EventEmitter';

// import forkliftGlb from '../assets/models/firklift.glb';
const forkliftGlb = '/assets/models/forklift.glb';

export default class Resources extends EventEmitter {
  font: Font;

  constructor() {
    super();

    const gltfLoader = new GLTFLoader();
    const fontLoader = new FontLoader();
    // objLoader: new THREE.ObjectLoader(),

    this.font = fontLoader.parse(fontHelvetiker);

    // this.items.forklift = this.loaders.gltfLoader.loadAsync('')

    // this.loaders.jsonLoader.parse()

    gltfLoader.load(forkliftGlb, (gltf) => {
      const model = gltf.scene;
      //adjust model to physical scale
      //TODO: model have to modified in f.e. Blender
      model.rotation.x = Math.PI / 2;
      model.position.set(0, 0, 1.25);
      model.scale.set(0.5, 0.5, 0.5);

      this.trigger('forkliftModelReady', [model]);
    });
  }
}
