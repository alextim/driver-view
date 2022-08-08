import * as THREE from 'three';
import * as dat from 'lil-gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';
// import getData from '../getData';
import { WorldSettings } from '../types';

import { MY_FORKLIFT_ID } from '../constants';

const sceneColor = 0x8fbcd4;

export default class AppView {
  public scene: THREE.Scene;
  public myForklift: THREE.Object3D;

  private targetElement: HTMLElement;
  private sizes: {
    width: number;
    height: number;
  };
  private _worldSettings!: WorldSettings;
  private topCamera!: THREE.PerspectiveCamera;
  private frontCamera!: THREE.PerspectiveCamera;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private renderer!: THREE.WebGLRenderer;
  private debug!: dat.GUI;

  constructor(targetElement: HTMLElement) {
    this.targetElement = targetElement;

    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // set up on Z axe for orbit control
    THREE.Object3D.DefaultUp = new THREE.Vector3(0, 0, 1);

    // If cache is enabled, FileLoader should not make duplicate requests.
    THREE.Cache.enabled = true;

    this.scene = new THREE.Scene();

    this.myForklift = new THREE.Object3D();
    this.myForklift.name = 'my-frk-3d-' + MY_FORKLIFT_ID;

    this.setRenderer();

    this.setDebug();
    window.addEventListener('resize', () => void this.resize());
  }

  public setWorldSettings(x: number, y: number) {
    this._worldSettings = {
      width: x,
      height: y,
      minDistance: 5,
      maxDistance: x * y,
      minZoom: 1.0,
      maxZoom: 300.0,
      controlsTarget: [x / 2, y / 2, 0],
      topCameraPosition: [-x / 2, -y / 2, (x + y) / 4],
    };
    this.setTopCamera();
    this.setFrontCamera();
    this.setCamera();
  }

  private setRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.targetElement!,
      antialias: true,
    });

    this.renderer.setClearColor(sceneColor, 1);
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  private setCamera() {
    this.camera = this.topCamera;
    // this.camera = this.frontCamera
  }

  private setTopCamera() {
    this.topCamera = new THREE.PerspectiveCamera(
      35,
      this.sizes.width / this.sizes.height,
      this._worldSettings.minDistance,
      this._worldSettings.maxDistance,
    );
    this.topCamera.name = 'topCamera';
    this.topCamera.position.set(...this._worldSettings.topCameraPosition);

    this.scene.add(this.topCamera);

    // Controls
    this.controls = new OrbitControls(this.topCamera, this.targetElement!); // this.renderer.domElement
    this.controls.minDistance = this._worldSettings.minDistance;
    this.controls.maxDistance = this._worldSettings.maxDistance;
    this.controls.minPolarAngle = 0; //_15_DEG_TO_RAD
    this.controls.maxPolarAngle = (Math.PI / 180) * 90; //_90_DEG_TO_RAD

    this.controls.target.set(...this._worldSettings.controlsTarget);

    // controls.update() must be called after any manual changes to the camera's transform
    this.controls.update();

    this.controls.addEventListener('change', () => void this.update());
  }

  private setFrontCamera() {
    this.frontCamera = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.5, 50);
    this.frontCamera.name = 'frontCamera';
    this.frontCamera.position.set(1, 0, 1.5);

    this.frontCamera.lookAt(new THREE.Vector3(10, 0, 1.5));

    this.frontCamera.updateProjectionMatrix();

    // const con1 = new FirstPersonControls(this.frontCamera, this.targetElement);

    // this.helper = new THREE.CameraHelper(this.frontCamera);

    this.myForklift.add(this.frontCamera);
    // this.myForklift.add(this.helper);
    this.scene.add(this.myForklift);
  }

  public add(element: THREE.Object3D) {
    this.scene.add(element);
  }

  public update() {
    if (this.renderer) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  private setDebug() {
    this.debug = new dat.GUI();

    const btnCamera = {
      action: () => {
        if (this.camera.name === 'topCamera') {
          this.camera = this.frontCamera;
        } else {
          this.camera = this.topCamera;
        }
        this.update();
      },
    };
    this.debug.add(btnCamera, 'action').name('camera');

    const btnFrontCameraHelper = {
      action: () => {
        const helper = new THREE.CameraHelper(this.frontCamera);
        this.scene.add(helper);
        this.update();
        // getData(data => console.log(data));
      },
    };
    this.debug.add(btnFrontCameraHelper, 'action').name('camera helper');
  }

  private resize() {
    // Update sizes
    this.sizes.width = window.innerWidth;
    this.sizes.height = window.innerHeight;

    // Update camera
    this.camera.aspect = this.sizes.width / this.sizes.height;
    this.camera.updateProjectionMatrix();

    // Update renderer
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
}
