import * as THREE from 'three';

import { PLT_3D_ } from '../../constants';
import { stringToHex } from '../../utils/stringToHex';

import type { WarehousePalette, WarehousePalettePartial, WarehouseClientColors } from '../../types';

export default class Palettes {
  container: THREE.Object3D;
  
  clientsColors: WarehouseClientColors = {};

  private palettesGeometries: Record<string, THREE.BoxGeometry> = {};
  private palettesEdgeGeometries: Record<string, THREE.EdgesGeometry<THREE.BoxGeometry>> = {};

  private palettesMaterials: Record<string, THREE.MeshBasicMaterial> = {
    plum: new THREE.MeshBasicMaterial({ color: 0xff00ff }),
    orange: new THREE.MeshBasicMaterial({ color: 0x00ffff }),
    aquamarine: new THREE.MeshBasicMaterial({ color: 0x0000ff }),
    frame: new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true }),
    active: new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true }),
    selected: new THREE.MeshBasicMaterial({ color: 0xffff00 }),
    defective: new THREE.MeshBasicMaterial({ color: 0xffd0d3 }),
    stringer: new THREE.MeshBasicMaterial({ color: 0xa0522d }),
  };

  constructor() {
    this.container = new THREE.Object3D();
    this.container.matrixAutoUpdate = true;
    this.container.name = 'palettes';
  }

  addPalettesToWarehouse(palettesData: WarehousePalette[]) {
    palettesData.forEach((paletteData) => {
      const group = this.createPalette(paletteData);
      this.container.add(group);
    });
  }

  createPalette(paletteData: WarehousePalettePartial, namePrefix = '') {
    //todo: check if exists
    if (!namePrefix) {
      namePrefix = PLT_3D_;
    }

    let dx: number;
    let dy: number;
    const dz = paletteData.leHoehe;

    // TODO: paletteData.loadingType === '2'
    if (paletteData.loadingType === 2) {
      dy = paletteData.leAufnahmeSeite;
      dx = paletteData.leGegenSeite;
    } else {
      dx = paletteData.leAufnahmeSeite;
      dy = paletteData.leGegenSeite;
    }

    // const geometry = new THREE.BufferGeometry();
    // geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    // const edges = new THREE.EdgesGeometry(geometry);
    // const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xc4eaff }));
    // scene.add(line);

    const geometry = this.getGeometryBySize(dx, dy, dz);
    //geometry.translate(0, 0.5, 0); //shift 0 point to bottom
    const material = this.getMaterialForPalette(paletteData);

    const group = new THREE.Object3D();
    group.name = namePrefix + paletteData.epcNr;
    group.matrixAutoUpdate = false;
    group.add(new THREE.Mesh(geometry, material));

    const edgeGeometry = this.getEdgeGeometryBySize(dx, dy, dz);
    group.add(new THREE.LineSegments(edgeGeometry, this.palettesMaterials.orange));

    group.position.set(paletteData.xkoord, paletteData.ykoord, paletteData.ablageHoehe + paletteData.leHoehe / 2);
    if (paletteData.winkel % 180 !== 0) {
      group.rotateZ(paletteData.winkel * (Math.PI / 180)); // _1_DEG_TO_RAD
    }
    group.updateMatrix();
    return group;
  }

  private getMaterialForPalette({ artikel, leDefekt, leUnkonform, leGesperrt, leQs }: WarehousePalettePartial) {
    /*
                    if ( data["sd.leDefekt"] == 0 ) {
                      $('td', row).css('background-color', '#FFD0D3' );
                  }

                  if ( data["sd.leUnkonform"] == 0 ) {
                      $('td', row).css('background-color', '#FFD0D3' );
                  }

                  if ( data["sd.leGesperrt"] == 0 ) {
                      $('td', row).css('background-color', '#FFD0D3' );
                  }

                  if ( data["sd.leQs"] == 0 ) {
                      $('td', row).css('background-color', '#FFD0D3' );
                  }
    */

    //TODO: palette.leGesspert === 0 color

    // isDefect
    if (leDefekt === 0 || leUnkonform === 0 || leGesperrt === 0 || leQs === 0) {
      return this.palettesMaterials.defective;
    }

    //const selector = getSelectorFromName(palette.additionalChar4);
    const selector = this.getSelectorFromName(artikel);
    if (!this.palettesMaterials[selector]) {
      let color = '#FFFFFF';
      if (this.clientsColors[selector]) {
        color = this.clientsColors[selector];
      } else {
        color = stringToHex(selector);
        this.clientsColors[selector] = color;
      }

      const mat = new THREE.MeshBasicMaterial({ color });
      this.palettesMaterials[selector] = mat;
    }

    // console.log(clientsColors);
    return this.palettesMaterials[selector];

    //not used now
    /*
    if (artikel.indexOf('-') > -1) {
      return paletteMaterials.plum;
    }
    if (artikel.indexOf('.') > -1) {
      return paletteMaterials.orange;
    }
    return paletteMaterials.aquamarine;
    */
  }

  // site specific
  private getSelectorFromName(name: string) {
    return name ? name.split('-')[0] : 'empty';

    //--strip name to first space or /
    /*
    let selector = name;
    if (selector) {
      const space = selector.search(/ |\//);
      if (space > 0) {
        selector = selector.substr(0, space);
      }
    }
    else {
      selector = 'unknown';
    }
    return selector.toUpperCase();
    */
  }

  private formatKey(x: number, y: number, z: number) {
    return `box_${x}_${y}_${z}`;
  }

  private getGeometryBySize(x: number, y: number, z: number) {
    const key = this.formatKey(x, y, z);

    if (!this.palettesGeometries[key]) {
      this.palettesGeometries[key] = new THREE.BoxBufferGeometry(x, y, z);
    }

    return this.palettesGeometries[key];
  }

  private getEdgeGeometryBySize(x: number, y: number, z: number) {
    const key = this.formatKey(x, y, z);

    if (!this.palettesEdgeGeometries[key]) {
      this.palettesEdgeGeometries[key] = new THREE.EdgesGeometry(this.getGeometryBySize(x, y, z));
    }

    return this.palettesEdgeGeometries[key];
  }
}
