import {
  IDataApi,
  Block,
  WarehouseSize,
  WarehousePalettes,
  WarehouseForklift,
  WarehouseAllStatus,
  WarehousePalette,
  WarehouseClientColors,
} from '../types';

import warehouseJSON from '../assets/mock/warehouseJSON-3.json';
import searchPalettesJSON from '../assets/mock/searchPalettesJSON-3.json';
import forkliftListOnlineJSON from '../assets/mock/forkliftListOnlineJSON-3.json';
import allStatusJSON from '../assets/mock/allStatusJSON-3.json';

export default class MockDataApi implements IDataApi {
  async getWarehouseSizeAsync() {
    // return Promise.resolve([{x: 680, y: 330}]) // 1
    // return Promise.resolve([{ x: 192.5, y: 183 }]) // 2 thai
    return Promise.resolve([{ x: 42.6, y: 37.2 }]); // 3 gps
  }

  async getWarehouseAsync() {
    return Promise.resolve(warehouseJSON as unknown as Block[]);
  }

  async getPalettesCountAsync() {
    return Promise.resolve({ palettesCount: searchPalettesJSON.data.length });
  }

  async getPalettesAsync(start: number, length: number) {
    return Promise.resolve({
      recordsTotal: searchPalettesJSON.data.length,
      data: searchPalettesJSON.data.slice(start, start + length - 1),
    } as unknown as WarehousePalettes);
  }

  async getColorsSettingsAsync() {
    return Promise.resolve({} as unknown as WarehouseClientColors);
  }

  async getForkliftListOnlineAsync() {
    return Promise.resolve(forkliftListOnlineJSON as unknown as WarehouseForklift);
  }

  async getAllStatusAsync() {
    return Promise.resolve(allStatusJSON as unknown as WarehouseAllStatus);
  }

  async getPalettesByEpcNrAsync(palettesId: any[]) {
    return Promise.resolve(searchPalettesJSON.data.slice(0, palettesId.length - 1) as unknown as WarehousePalette[]);
  }
}
