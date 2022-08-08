import { IMqttClient, IDataService, IResourcesService, Block, WarehouseAllStatus, WarehousePalettes, WarehouseClientColors } from './types';

import * as THREE from 'three';

import { MY_FORKLIFT_ID, DRAW_BLOCK_LABELS } from './constants';

import loadData from './strange-code/loadData';

import AppView from './views/AppView';
import WorldView from './views/WorldView';
import PalettesView from './views/PalettesView';
import ForkliftsView from './views/ForkliftsView/ForkliftsView';
import BlocksView from './views/BlocksView';

const floorColor = 0xcfe2f3; //0xAAAAAA,

export default class Application {
  private dataService: IDataService;
  private resources: IResourcesService;
  private mqttClient: IMqttClient;

  private appView!: AppView;
  private worldView!: WorldView;
  private blocksView!: BlocksView;
  private forkliftsView!: ForkliftsView;
  private palettesView: PalettesView;

  constructor({
    targetElement,
    dataService,
    mqttClient,
    resources,
  }: {
    targetElement: HTMLElement | null;
    dataService: IDataService;
    mqttClient: IMqttClient;
    resources: IResourcesService;
  }) {
    if (!targetElement) {
      throw new Error('targetElement is null');
    }

    this.dataService = dataService;
    this.mqttClient = mqttClient;
    this.resources = resources;

    this.appView = new AppView(targetElement);

    this.worldView = new WorldView(floorColor);
    this.appView.add(this.worldView.container);

    this.blocksView = new BlocksView({ font: this.resources.font, drawLabel: DRAW_BLOCK_LABELS });
    this.appView.add(this.blocksView.container);
    // this.worldView.container.add(this.blocksView.container);

    this.palettesView = new PalettesView();
    this.appView.add(this.palettesView.container);

    this.dataService.on('warehouseSizeReady', ([{ x, y }]) => {
      this.appView.setWorldSettings(x, y);
      this.worldView.setFloor(x, y);
      this.appView.update();
    });

    this.dataService.on('warehouseDataReady', (data: Block[]) => {
      this.blocksView.setBlocks(data);
      this.appView.update();
    });

    this.dataService.on('colorSettingsDataReady', (clientsColors: WarehouseClientColors) => {
      this.palettesView.clientsColors = clientsColors;
      this.dataService.dataApi.getPalettesCountAsync().then(({ palettesCount }) => {
        // console.log(palettesCount);
        for (let i = 0; i < palettesCount; i += 100) {
          this.dataService.getPalettes(i, 100);
        }
      });
    });

    this.dataService.on('palettesDataReady', (ps: WarehousePalettes) => {
      console.log('palettesDataReady', ps);
      this.palettesView.addPalettesToWarehouse(ps.data);

      this.appView.update();
    });

    this.resources.on('forkliftModelReady', (forkliftModel: THREE.Group) => {
      this.forkliftsView = new ForkliftsView({
        forkliftModel,
        /* data: { myForkliftId: MY_FORKLIFT_ID }, */ palettesView: this.palettesView,
        scene: this.appView.scene,
      });

      this.forkliftsView.createForklift(MY_FORKLIFT_ID, this.appView.myForklift);
      // TODO: ???? this.forkliftsView.forklifts[MY_FORKLIFT_ID] = this.myForklift;

      // TODO:
      // window.LOAD_TCPCOM_DATA();
      this.LOAD_TCPCOM_DATA();

      // get data after model loaded
      this.dataService.getAllStatus();

      this.appView.update();
    });

    //initialize forklifts and loaded palettes
    this.dataService.on('allStatusDataReady', ({ forklifts }: WarehouseAllStatus) => {
      if (!this.forkliftsView) {
        console.log('Forklift model not yet ready!');
        return;
      }
      // TODO: data is removed from Forklifts
      // this.forklifts.data = { ...data.forklifts };
      forklifts.forEach(({ forklift, palettes }) => {
        if (forklift.staplerNr !== MY_FORKLIFT_ID) {
          this.forkliftsView.updateForkliftPosition(forklift);
          if (palettes.length > 0) {
            this.forkliftsView.updateForkliftPalettes(forklift.staplerNr, palettes);
          }
        }
      });

      this.appView.update();
    });

    this.mqttClient.on('mqttMessageArrived', ({ payloadString, topic }) => {
      if (!this.forkliftsView) {
        console.log('Forklift model not yet ready!');
        return;
      }

      const data = JSON.parse(payloadString);

      if (topic.startsWith('/tr/forklift')) {
        console.log('/tr/forklift');
        this.forkliftsView.updateStatus(data);
      } else if (topic.startsWith('/tr/warehouse/placement')) {
        console.log('/tr/placement');
        this.forkliftsView.drop(data);
      } else if (topic.startsWith('/tr/warehouse/pickup')) {
        console.log('/tr/pickup');
        this.forkliftsView.pickup(data);
        // on pickup we don't really know the original pos_ident_nr where the pallet was in lagerdaten
        // removePallet(x[0].epc_nr)
      } else {
        console.warn(`can't find topic ${topic}`);
      }

      this.appView.update();
    });
  }

  init() {
    this.resources.startLoading();

    this.dataService.getWarehouseSize();
    this.dataService.getWarehouse();
    this.dataService.getColorsSettings();
  }

  private LOAD_TCPCOM_DATA() {
    loadData();
  }
}
