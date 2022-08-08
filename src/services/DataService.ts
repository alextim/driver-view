import EventEmitter from '../utils/EventEmitter';
import { IDataApi, WarehouseAllStatus, WarehouseForklift, Block, WarehouseSize, WarehousePalettes, WarehouseClientColors, WarehousePalettesCount } from '../types';

export default class DataService extends EventEmitter {
  dataApi: IDataApi;

  constructor(dataApi: IDataApi) {
    super();

    this.dataApi = dataApi;
  }

  getWarehouseSize() {
    // check local storage 1st
    this.dataApi.getWarehouseSizeAsync().then((data: WarehouseSize[]) => this.trigger('warehouseSizeReady', [data]));
  }

  getWarehouse() {
    // check local storage 1st
    this.dataApi.getWarehouseAsync().then((data: Block[]) => this.trigger('warehouseDataReady', [data]));
  }

  getPalettes(start: number, length: number) {
    this.dataApi.getPalettesAsync(start, length).then((data: WarehousePalettes) => this.trigger('palettesDataReady', [data]));
  }

  getColorsSettings() {
    this.dataApi.getColorsSettingsAsync().then((data: WarehouseClientColors) => this.trigger('colorSettingsDataReady', [data]));
  }

  getForkliftListOnline() {
    this.dataApi.getForkliftListOnlineAsync().then((data: WarehouseForklift) => this.trigger('forkliftListOnlineDataReady', [data]));
  }

  getAllStatus() {
    this.dataApi.getAllStatusAsync().then((data: WarehouseAllStatus) => this.trigger('allStatusDataReady', [data]));
  }
}
