import { IDataApi } from '../types';

export default class DataApi implements IDataApi {
  private urlAPI: string;

  constructor(urlAPI: string) {
    this.urlAPI = urlAPI;
  }

  private async getRequestAsync(url: string) {
    const resp = await fetch(url);
    const data = await resp.json();
    return data;
  }

  async getWarehouseSizeAsync() {
    const url = `${this.urlAPI}warehouseSizeJSON`;
    return this.getRequestAsync(url);
  }

  async getWarehouseAsync() {
    const url = `${this.urlAPI}warehouseJSON`;
    return this.getRequestAsync(url);
  }

  async getPalettesCountAsync() {
    const url = `${this.urlAPI}palettesCountJSON`;
    return this.getRequestAsync(url);
  }

  async getPalettesAsync(start: number, length: number) {
    const url = `${this.urlAPI}searchPalettesJSON?page=${start}&len=${length}`;
    return this.getRequestAsync(url);
  }

  async getColorsSettingsAsync() {
    const url = `${this.urlAPI}getColorsSettingsJSON`;
    return this.getRequestAsync(url);
  }

  async getForkliftListOnlineAsync() {
    const url = `${this.urlAPI}forkliftListOnlineJSON`;
    return this.getRequestAsync(url);
  }

  async getAllStatusAsync() {
    const url = `${this.urlAPI}allStatusJSON`;
    return this.getRequestAsync(url);
  }

  async getPalettesByEpcNrAsync(palettesId: any[]) {
    const url = `${this.urlAPI}palettesByEpcNrJSON?epcNr=${palettesId.join(',')}`;
    return this.getRequestAsync(url);
  }
}
