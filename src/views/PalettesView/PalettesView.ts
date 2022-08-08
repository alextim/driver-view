import * as THREE from 'three';

import { PLT_3D_ } from '../../constants';
import { stringToHex } from '../../utils/stringToHex';

import palettesMaterials from './palettesMaterials';

import type { WarehousePalette, WarehousePalettePartial, WarehouseClientColors } from '../../types';

export default class Palettes {
  container: THREE.Object3D;
  clientsColors: WarehouseClientColors = {};
  private palettesGeometries: Record<string, THREE.BoxGeometry> = {};
  private palettesEdgeGeometries: Record<string, THREE.EdgesGeometry<THREE.BoxGeometry>> = {};

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

    const geometry = this.getGeometriesBySize(dx, dy, dz);
    //geometry.translate(0, 0.5, 0); //shift 0 point to bottom
    const material = this.getMaterialsForPalette(paletteData);

    const group = new THREE.Object3D();
    group.name = namePrefix + paletteData.epcNr;
    group.matrixAutoUpdate = false;
    group.add(new THREE.Mesh(geometry, material));

    const edgeGeometry = this.getEdgeGeometriesBySize(dx, dy, dz);
    group.add(new THREE.LineSegments(edgeGeometry, palettesMaterials.orange));

    group.position.set(paletteData.xkoord, paletteData.ykoord, paletteData.ablageHoehe + paletteData.leHoehe / 2);
    if (paletteData.winkel % 180 !== 0) {
      group.rotateZ(paletteData.winkel * (Math.PI / 180)); // _1_DEG_TO_RAD
    }
    group.updateMatrix();
    return group;
  }

  private getMaterialsForPalette({ artikel, leDefekt, leUnkonform, leGesperrt, leQs }: WarehousePalettePartial) {
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
      return palettesMaterials.defective;
    }

    //const selector = getSelectorFromName(palette.additionalChar4);
    const selector = this.getSelectorFromName(artikel) as keyof typeof palettesMaterials;
    if (!palettesMaterials[selector]) {
      let color = '#FFFFFF';
      if (this.clientsColors[selector]) {
        color = this.clientsColors[selector];
      } else {
        color = stringToHex(selector);
        this.clientsColors[selector] = color;
      }

      const mat = new THREE.MeshBasicMaterial({ color });
      palettesMaterials[selector] = mat;
    }

    // console.log(clientsColors);
    return palettesMaterials[selector];

    //not used now
    /*
    if (artikel.indexOf('-') > -1) {
      return palettesMaterials.plum;
    }
    if (artikel.indexOf('.') > -1) {
      return palettesMaterials.orange;
    }
    return palettesMaterials.aquamarine;
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
    return 'box_' + x + '_' + y + '_' + z;
  }

  private getGeometriesBySize(x: number, y: number, z: number) {
    const key = this.formatKey(x, y, z); 

    if (!this.palettesGeometries[key]) {
      this.palettesGeometries[key] = new THREE.BoxBufferGeometry(x, y, z);
    }

    return this.palettesGeometries[key];
  }

  private getEdgeGeometriesBySize(x: number, y: number, z: number) {
    const key = this.formatKey(x, y, z); 

    if (!this.palettesEdgeGeometries[key]) {
      this.palettesEdgeGeometries[key] = new THREE.EdgesGeometry(this.getGeometriesBySize(x, y, z));
    }

    return this.palettesEdgeGeometries[key];
  }
}
