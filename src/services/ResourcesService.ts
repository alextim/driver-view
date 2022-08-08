import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import fontHelvetiker from 'three/examples/fonts/helvetiker_regular.typeface.json';

import { IResourcesService } from '../types';
import EventEmitter from '../utils/EventEmitter';

const FORK_LIFT_GLB = '/assets/models/forklift.glb';

export default class ResourcesService extends EventEmitter implements IResourcesService {
  public font!: Font;

  private loaders = {
    gltfLoader: new GLTFLoader(),
    fontLoader: new FontLoader(),
    // objLoader: new THREE.ObjectLoader(),
  };

  constructor() {
    super();
    this.startLoading();
  }

  public startLoading() {
    this.font = this.loaders.fontLoader.parse(fontHelvetiker);

    // this.items.forklift = gltfLoader.loadAsync('')
    // jsonLoader.parse()

    this.loaders.gltfLoader.load(FORK_LIFT_GLB, ({ scene: model }) => {
      //adjust model to physical scale
      //TODO: model have to modified in f.e. Blender
      model.rotation.x = Math.PI / 2;
      model.position.set(0, 0, 1.25);
      model.scale.set(0.5, 0.5, 0.5);

      this.trigger('forkliftModelReady', [model]);
    });
  }
}
