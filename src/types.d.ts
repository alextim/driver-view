export interface IDataService {
  getWarehouseSize: () => void;
  getWarehouse: () => void;
  getPalettes: (start: number, length: number) => void;
  getColorsSettings: () => void;
  getForkliftListOnline: () => void;
  getAllStatus: () => void;
}

export interface IDataApi {
  getWarehouseSizeAsync: () => Promise<any[]>;
  getWarehouseAsync: () => Promise<any>;
  getPalettesCountAsync: () => Promise<any>;
  getPalettesAsync: (start: number, length: number) => Promise<any>;
  getColorsSettingsAsync: () => Promise<any>;
  getForkliftListOnlineAsync: () => Promise<any>;
  getAllStatusAsync: () => Promise<any>;
}

export type WorldSettings = {
  width: number;
  height: number;
  minDistance: number;
  maxDistance: number;
  minZoom: number;
  maxZoom: number;
  controlsTarget: [number, number, number];
  topCameraPosition: [number, number, number];
  floorColor: number;
  sceneColor: number;
};

export {};

declare global {
  interface Window {
    parseScript: HTMLScriptElement | undefined;
    application: any;
  }
}
