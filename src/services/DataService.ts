import EventEmitter from '../utils/EventEmitter';
import { IDataService, IDataApi, WarehauseAllStatus, WarehouseForklift, Warehouse, WarehouseSize, WarehousePalettes } from '../types';

export default class DataService extends EventEmitter {
  dataApi: IDataApi;

  constructor(dataApi: IDataApi) {
    super();

    this.dataApi = dataApi;

    this.getWarehouseSize();
    this.getWarehouse();
    this.getColorsSettings();
  }

  getWarehouseSize() {
    // check local storage 1st
    this.dataApi.getWarehouseSizeAsync().then((data: WarehouseSize[]) => this.trigger('warehouseSizeReady', [data]));
  }

  getWarehouse() {
    // check local storage 1st
    this.dataApi.getWarehouseAsync().then((data: Warehouse[]) => this.trigger('warehouseDataReady', [data]));
  }

  getPalettes(start: number, length: number) {
    this.dataApi.getPalettesAsync(start, length).then((data: WarehousePalettes) => this.trigger('palettesDataReady', [data]));
  }

  getColorsSettings() {
    this.dataApi.getColorsSettingsAsync().then((data: Warehouse) => this.trigger('colorSettingsDataReady', [data]));
  }

  getForkliftListOnline() {
    this.dataApi.getForkliftListOnlineAsync().then((data: WarehouseForklift) => this.trigger('forkliftListOnlineDataReady', [data]));
  }

  getAllStatus() {
    this.dataApi.getAllStatusAsync().then((data: WarehauseAllStatus) => this.trigger('allStatusDataReady', [data]));
  }
}
