import * as THREE from 'three';
import type { WorldSettings } from '../types';

export default class WorldView {
  public container: THREE.Object3D;

  private axis: THREE.AxesHelper;
  private floorColor: number;

  constructor(floorColor: number) {
    this.floorColor = floorColor;

    // Set up
    this.container = new THREE.Object3D();
    this.container.matrixAutoUpdate = false;

    this.axis = new THREE.AxesHelper();
    this.container.add(this.axis);

    this.setLights();

    this.setDummy();
  }

  private setDummy() {
    const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0x00ffff }));
    this.container.add(cube);
  }

  public setFloor(width: number, height: number) {
    // create the floor plane
    const planeGeometry = new THREE.PlaneBufferGeometry(width, height);
    const planeMaterial = new THREE.MeshBasicMaterial({ color: this.floorColor });

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(width / 2, height / 2, -0.01); // shift down -0.01 to avoid blinking

    // add the plane to the scene
    this.container.add(plane);
  }

  private setLights() {
    const mainLight = new THREE.DirectionalLight(0xffffff, 5);
    mainLight.position.set(100, 100, 1000);

    this.container.add(mainLight);
  }
}
