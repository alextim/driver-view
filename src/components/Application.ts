import { IDataApi, WorldSettings, Warehouse } from '../types';

import * as THREE from 'three';
import * as dat from 'lil-gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';

import DataService from '../services/DataService';
import MqttClient from '../services/MqttClient';

import { MY_FORKLIFT_ID, TCPCOM_URL } from '../constants';
import getData from '../getData';

import Resources from '../utils/Resources';
import World from './World';
import Palettes from './Palettes';
import Forklifts from './Forklifts';

export default class Application {
  targetElement: HTMLElement | null;
  sizes: {
    width: number;
    height: number;
  };
  scene: THREE.Scene;
  myForklift: THREE.Object3D;
  dataService: DataService;
  resources: Resources;
  palettes: Palettes;
  mqttClient: MqttClient;
  forklifts!: Forklifts;
  worldSettings!: WorldSettings;

  topCamera!: THREE.PerspectiveCamera;
  frontCamera!: THREE.PerspectiveCamera;
  camera!: THREE.PerspectiveCamera;

  controls!: OrbitControls;

  renderer!: THREE.WebGLRenderer;

  world!: World;
  debug!: dat.GUI;

  constructor({ targetElement, dataApi }: { targetElement: HTMLElement | null; dataApi: IDataApi }) {
    if (!targetElement) {
      throw new Error('targetElement is null');
    }
    window.application = this; // set global variable

    // Options
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

    this.dataService = new DataService(dataApi);

    this.resources = new Resources();

    this.palettes = new Palettes();

    this.mqttClient = new MqttClient({
      host: '127.0.0.1',
      port: 8080,
    });

    this.setPalettes();

    this.setDebug();

    this.dataService.on('warehouseSizeReady', (ws) => {
      this.setWorldSettings(ws[0].x, ws[0].y);

      this.setRenderer();

      this.setTopCamera();
      this.setFrontCamera();
      this.setCamera();

      this.setWorld();

      this.update();
    });

    this.dataService.on('colorSettingsDataReady', (clientsColors) => {
      this.palettes.clientsColors = clientsColors;
      this.dataService.dataApi.getPalettesCountAsync().then((data) => {
        // console.log(data.palettesCount);
        for (let i = 0; i < data.palettesCount; i += 100) {
          this.dataService.getPalettes(i, 100);
        }
      });
    });

    this.dataService.on('palettesDataReady', (ps) => {
      console.log(ps);
      this.palettes.addPalettesToWarehouse(ps.data);

      this.update();
    });

    this.resources.on('forkliftModelReady', (forkliftModel) => {
      this.forklifts = new Forklifts({ forkliftModel, data: { myForkliftId: MY_FORKLIFT_ID }, palettes: this.palettes, scene: this.scene });

      this.forklifts.createForklift(MY_FORKLIFT_ID, this.myForklift);
      this.forklifts.forklifts[MY_FORKLIFT_ID] = this.myForklift;
      this.LOAD_TCPCOM_DATA();

      // get data after model loaded
      this.dataService.getAllStatus();

      this.update();
    });

    //initialize forklifts and loaded palettes
    this.dataService.on('allStatusDataReady', (data) => {
      if (!this.forklifts) {
        console.log('Forklift model not yet ready!');
        return;
      }
      this.forklifts.data = { ...data.forklifts };
      data.forklifts.forEach((item: any) => {
        if (item.forklift.staplerNr !== MY_FORKLIFT_ID) {
          this.forklifts.updateForkliftPosition(item.forklift);
          if (item.palettes.length > 0) {
            this.forklifts.updateForkliftPalettes(item.forklift.staplerNr, item.palettes);
          }
        }
      });

      this.update();
    });

    this.mqttClient.on('mqttMessageArrived', (msg) => {
      const data = JSON.parse(msg.payloadString);

      if (!this.forklifts) {
        console.log('Forklift model not yet ready!');
        return;
      }

      if (msg.topic.startsWith('/tr/forklift')) {
        console.log('/tr/forklift');
        this.forklifts.updateStatus(data);
      } else if (msg.topic.startsWith('/tr/warehouse/placement')) {
        console.log('/tr/placement');
        this.forklifts.drop(data);
      } else if (msg.topic.startsWith('/tr/warehouse/pickup')) {
        console.log('/tr/pickup');
        this.forklifts.pickup(data);
        // on pickup we don't really know the original pos_ident_nr where the pallet was in lagerdaten
        // removePallet(x[0].epc_nr)
      } else {
        console.warn(`can't find topic ${msg.topic}`);
      }

      this.update();
    });

    window.addEventListener('resize', () => {
      this.resize();
    });
    this.init();
  }

  init() {
    // window.LOAD_DATA()
  }

  loadData() {
    //todo: delete prev.
    if (window.parseScript) {
      window.parseScript.parentElement?.removeChild(window.parseScript);
    }
    const parseScript = document.createElement('script');
    parseScript.src = TCPCOM_URL;
    document.getElementsByTagName('head')[0].appendChild(parseScript);
    window.parseScript = parseScript;
  }

  LOAD_TCPCOM_DATA() {
    this.loadData();
  }

  setWorldSettings(x: number, y: number) {
    this.worldSettings = {
      width: x,
      height: y,
      minDistance: 5,
      maxDistance: x * y,
      minZoom: 1.0,
      maxZoom: 300.0,
      controlsTarget: [x / 2, y / 2, 0],
      topCameraPosition: [-x / 2, -y / 2, (x + y) / 4],
      floorColor: 0xcfe2f3, //0xAAAAAA,
      sceneColor: 0x8fbcd4,
    };
  }

  setRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.targetElement!,
      antialias: true,
    });

    this.renderer.setClearColor(this.worldSettings.sceneColor, 1);
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  setCamera() {
    this.camera = this.topCamera;
    // this.camera = this.frontCamera
  }

  setTopCamera() {
    this.topCamera = new THREE.PerspectiveCamera(
      35,
      this.sizes.width / this.sizes.height,
      this.worldSettings.minDistance,
      this.worldSettings.maxDistance,
    );
    this.topCamera.name = 'topCamera';
    this.topCamera.position.set(...this.worldSettings.topCameraPosition);

    this.scene.add(this.topCamera);

    // Controls
    this.controls = new OrbitControls(this.topCamera, this.targetElement!); // this.renderer.domElement
    this.controls.minDistance = this.worldSettings.minDistance;
    this.controls.maxDistance = this.worldSettings.maxDistance;
    this.controls.minPolarAngle = 0; //_15_DEG_TO_RAD
    this.controls.maxPolarAngle = (Math.PI / 180) * 90; //_90_DEG_TO_RAD

    this.controls.target.set(...this.worldSettings.controlsTarget);

    // controls.update() must be called after any manual changes to the camera's transform
    this.controls.update();

    this.controls.addEventListener('change', () => {
      this.update();
    });
  }

  setFrontCamera() {
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

  setWorld() {
    this.world = new World({ font: this.resources.font, worldSettings: this.worldSettings });
    this.dataService.on('warehouseDataReady', (data: Warehouse[]) => {
      this.world.setWarehouse(data);
      this.update();
    });
    this.scene.add(this.world.container);
  }

  setPalettes() {
    this.scene.add(this.palettes.container);
  }

  setDebug() {
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

  update() {
    if (this.renderer) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  resize() {
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

  destroy() {}
}
