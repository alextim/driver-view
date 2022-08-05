import * as THREE from 'three';
import Blocks from './Blocks';
import { WorldSettings } from '../types';

import { DRAW_BLOCK_LABELS } from '../constants';
import { Font } from 'three/examples/jsm/loaders/FontLoader';

export default class World {
  font: Font;
  worldSettings: WorldSettings;

  blocks!: Blocks;

  axis: THREE.AxesHelper;
  container: THREE.Object3D;

  constructor({ font, worldSettings }: { font: Font; worldSettings: WorldSettings }) {
    this.font = font;
    this.worldSettings = worldSettings;

    // Set up
    this.container = new THREE.Object3D();
    this.container.matrixAutoUpdate = false;

    this.axis = new THREE.AxesHelper();
    this.container.add(this.axis);

    this.setFloor();

    this.setLights();

    //this.setDummy()
  }

  setDummy() {
    const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0x00ffff }));
    this.container.add(cube);
  }

  setFloor() {
    // create the floor plane
    const planeGeometry = new THREE.PlaneBufferGeometry(this.worldSettings.width, this.worldSettings.height);
    const planeMaterial = new THREE.MeshBasicMaterial({
      color: this.worldSettings.floorColor,
    });

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(this.worldSettings.width / 2, this.worldSettings.height / 2, -0.01); // shift down -0.01 to avoid blinking

    // add the plane to the scene
    this.container.add(plane);
  }

  setWarehouse(data: any[]) {
    this.blocks = new Blocks({ data, font: this.font, drawLabel: DRAW_BLOCK_LABELS });
    this.container.add(this.blocks.container);
    // now in application
    // this.application.update()
  }

  setLights() {
    const mainLight = new THREE.DirectionalLight(0xffffff, 5);
    mainLight.position.set(100, 100, 1000);

    this.container.add(mainLight);
  }

  resize() {}

  update() {}

  destroy() {}
}
