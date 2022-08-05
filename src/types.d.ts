export interface IDataService {
  getWarehouseSize: () => void;
  getWarehouse: () => void;
  getPalettes: (start: number, length: number) => void;
  getColorsSettings: () => void;
  getForkliftListOnline: () => void;
  getAllStatus: () => void;
}

export interface IDataApi {
  getWarehouseSizeAsync: () => Promise<WarehouseSize[]>;
  getWarehouseAsync: () => Promise<Warehouse[]>;
  getPalettesCountAsync: () => Promise<{ palettesCount: number }>;
  getPalettesAsync: (start: number, length: number) => Promise<WarehousePalettes>;
  getColorsSettingsAsync: () => Promise<Warehouse>;
  getForkliftListOnlineAsync: () => Promise<WarehouseForklift>;
  getAllStatusAsync: () => Promise<WarehouseAllStatus>;
  getPalettesByEpcNrAsync: (palettesId: any[]) => Promise<WarehousePalette[]>;
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

export type Block = {
  kuLagerNr: string;
  kuBlockNr: string;
  rows: BlockRow[];
};

export type BlockRow = {
  lfdnrReihe: string;
  xMitte: number;
  yMitte: number;
  xEnd: number;
  yEnd: number;
  xStart: number;
  yStart: number;
  hoehenAusgleich: number;
  winkel: number;
  reiheLaenge: number;
  reiheBreite: number;
  kuReihe: string;
  maxHoehe: number;
  blockTyp: number;
  blockArt: number;
  transponders: Transponder[];
};

export type Transponder = {
  posIdentNr: string;
  xkoord: number;
  ykoord: number;
  lfdnrReihe: string;
};

export type WarehouseSize = {
  x: number;
  y: number;
};

export type WarehousePalette = {
  staplerNr: number;
  posIdentNr: string;
  xkoord: number;
  ykoord: number;
  winkel: number;
  lagerort: number;
  epcNr: string;
  artikel: string;
  articleDesc: string;

  menge: number;
  leAufnahmeSeite: number;
  leGegenSeite: number;
  leHoehe: number;
  ablageHoehe: number;
  loadingType: number;
  leDefekt: number;
  leUnkonform: number;
  leGesperrt: number;
  leQs: number;
  leAdditional2: number;
  additionalChar4: number;
  additionalChar5: number;
};

export type WarehousePalettes = {
  recordsTotal: number;
  data: WarehousePalette[];
};

export type WarehouseForklift = {
  staplerNr: string;
  bereit: string;
  xkoord: number;
  ykoord: number;
  winkel: number;
  posIdentNr: string;
  epcNr: string;
  opeCode: string;
  spracheNr: number;
  'pmess,': string;
  flmess: string;
  chAuftrag: number;

  chBeladung: number;
  chNachricht: number;
  chFlmess: number;
  invMode: number;
  guiVersion: string;
  anzahlLe: number;
  tgewicht: number;
  bemerkung: string;
  username: string | null;
};

export type WarehouseAllStatus = {
  zones: never[];
  forklifts: {
    forklift: ForkliftStatus;
    palettes: PaletteStatus[];
  }[];
  palettes: never[];
};

export type ForkliftStatus = {
  staplerNr: string;
  bereit: string;
  xkoord: number;
  ykoord: number;
  winkel: number;
};

export type PaletteStatus = {
  gabelNr: number;
  transportEtage: number;
  gabelSlot: number;
  leAufnahmeSeite: number;
  leGegenSeite: number;
  leHoehe: number;
  leBasx: number;
  leBasy: number;
  leBasz: number;
  luOwner: string;
  artikel: string;
  articleDesc: string;
  menge: number;
  meeinheit: string;
  leNr: string;
  epcNr: string;
  prodDatumZeit: string;
  mhdDatumZeit: string;
  sperrDatumZeit: string;
  gewicht: number;
  loadingType: string;
  dimension: string;
  transNo: string;
  orderNo: string;
  mission: number;
  scanEpc: number;
  scanAntw: number;
  scanErr: number;
  errDesc: string;
  eigenAuftragErstellt: string;
  eauftragNr: string;
  sonderPlatz: number;
  aufKennung: number;
  hazmatP1: string;
  hazmatP2: string;
  luRemainder: string;
  luStockable: string;
  leDefekt: number;
  leUnkonform: number;
  leGesperrt: number;
  leQs: number;
  leAdditional1: number;
  leAdditional2: number;
  mess: string;
  resNr: number;
  prodBlock: string;
  additionalChar1: string;
  additionalChar2: string;
  additionalChar3: string;
  additionalChar4: string;
  additionalChar5: string;
  additionalChar6: string;
  additionalChar7: string;
  additionalChar8: string;
  additionalChar9: string;
  additionalInt1: number;
  additionalInt2: number;
  additionalInt3: number;
  additionalInt4: number;
  additionalInt5: number;
  additionalInt6: number;
  additionalInt7: number;
  additionalInt8: number;
  additionalInt9: number;
  additionalFloat1: number;
  additionalFloat2: number;
  additionalFloat3: number;
  additionalFloat4: number;
  additionalFloat5: number;
  additionalFloat6: number;
  additionalFloat7: number;
  additionalFloat8: number;
  additionalFloat9: number;
  additionalDate1: string;
  additionalDate2: string;
  aktion1: number;
  aktion2: number;
  aktion3: number;
  palType: number;
  aufLagerNr: string;
  aufBlockNr: string;
  aufReihe: string;
  aufDate: string;
};

declare global {
  interface Window {
    parseScript: HTMLScriptElement | undefined;
    application: any;
  }
}

export {};
