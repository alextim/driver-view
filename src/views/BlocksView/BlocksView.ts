import * as THREE from 'three';
import { Font } from 'three/examples/jsm/loaders/FontLoader';

import { mergedMesh } from './helpers/mergeMesh';
import type { TextMesh } from './helpers/mergeMesh';
// import TextSprite from '@seregpie/three.text-sprite'
import blockMaterials, { getMaterialByBlockType } from './helpers/blockMaterial';
import { createLabel } from './helpers/createLabel';

import type { Block, BlockRow } from '../../types';

export default class BlocksView {
  private mergeGeometries = false;
  private drawLabel: boolean;

  private geomitries: Record<string, THREE.BufferGeometry> = {};

  private font: Font;

  private labels_7: TextMesh[] = [];
  private labels: TextMesh[] = [];
  private rowLabels: TextMesh[] = [];

  container: THREE.Object3D;

  constructor({ font, drawLabel }: { font: Font; drawLabel: boolean }) {
    this.drawLabel = drawLabel;

    this.font = font;

    // Set up

    // objLoader = new THREE.ObjectLoader() parse

    this.container = new THREE.Object3D();
    this.container.matrixAutoUpdate = true;
    this.container.name = 'blocks';
    // this.container.updateMatrix()

    // // create a canvas element
    // var canvas1 = document.createElement('canvas');
    // var context1 = canvas1.getContext('2d');
    // canvas1.width = 600;
    // canvas1.height = 120;
    // context1.font = "Bold 8px Arial";
    // context1.fillStyle = "rgba(255,0,0,0.95)";
    // context1.fillText('Hello, world!', 0, 100);

    // // canvas contents will be used for a texture
    // var texture1 = new THREE.Texture(canvas1)
    // texture1.needsUpdate = true;

    // var material1 = new THREE.MeshBasicMaterial({ map: texture1, side: THREE.DoubleSide });
    // material1.transparent = true;

    // var mesh1 = new THREE.Mesh(
    //   new THREE.PlaneGeometry(300, 60),
    //   material1
    // );
    // mesh1.position.set(0, 50, 0);
    // this.container.add(mesh1);

    // let instance = new TextSprite({
    //   alignment: 'left',
    //   color: '#24ff00',
    //   fontFamily: '"Times New Roman", Times, serif',
    //   fontSize: 8,
    //   fontStyle: 'italic',
    //   text: 'Twinkle, twinkle, little star',
    // });
    // this.container.add(instance);

    // const label2 = this.createLabel2('text', 1, 1, 1, 24, 'black')
    // this.container.add(label2)
  }

  public setBlocks(data: Block[]) {
    console.time('setBlocks');

    data.forEach((block) => void this.createBlock(block));

    if (this.drawLabel && this.mergeGeometries) {
      [
        mergedMesh(this.labels_7, blockMaterials.blockType_7),
        mergedMesh(this.labels, blockMaterials.blockLabel2),
        mergedMesh(this.rowLabels, blockMaterials.blockLabel),
      ]
        .filter(Boolean)
        .forEach((item) => void this.container.add(item!));
    }

    console.log(this.container.toJSON());

    console.timeEnd('setBlocks');
  }

  private createBlock(block: Block) {
    // console.log(block)
    try {
      const blockTyp = block.rows[0].blockTyp;

      if (this.drawLabel) {
        switch (blockTyp) {
          case 8:
            // do nothing
            break;
          case 7:
            if (this.mergeGeometries) {
              this.labels_7.push(this.createBlockLabel_7(block));
            } else {
              this.container.add(this.createBlockLabel_7(block));
            }
            break;
          default:
            if (this.mergeGeometries) {
              this.labels.push(this.createBlockLabel(block));
            } else {
              this.container.add(this.createBlockLabel(block));
            }
        }
      }

      const hasLabel = !(blockTyp === 7 || blockTyp === 8);
      block.rows.forEach((row) => void this.createRow(row, block.kuBlockNr, hasLabel));
    } catch (ex) {
      console.error(block.kuBlockNr + ' ' + ex);
    }
  }

  private createRow(row: BlockRow, kuBlockNr: string, hasLabel: boolean) {
    const mesh = this.createRowBorder(row /*, kuBlockNr */);
    this.container.add(mesh);

    if (hasLabel && this.drawLabel) {
      const label = this.createRowLabel(row /*, kuBlockNr */);
      if (this.mergeGeometries) {
        this.rowLabels.push(label);
      } else {
        this.container.add(label);
      }
    }

    // row.transponders.map(transponder => createTransponder(transponder, row.winkel))
  }

  /*
    createRowBorder_(model, kuBlockNr) {
      const width = model.reiheLaenge, height = model.reiheBreite
      //var name = model.ku_block_nr + '-' + model.ku_lager_nr + '-' + model.ku_reihe
      const x = model.xMitte, y = model.yMitte
   
      const rowWidth = model.reiheBreite
      let xEnd = model.xEnd
      let yEnd = model.yEnd
      const xBegin = model.xStart
      const yBegin = model.yStart
   
      const dangle = model.winkel * (Math.PI / 180)	// calculate angle in radiants
      const dx = rowWidth / 2 * Math.sin(dangle)
      const dy = rowWidth / 2 * Math.cos(dangle)
   
      let material = this.getMaterial(model.blockTyp)
   
      const vertices = new Float32Array([
        xBegin + dx, yBegin - dy, 0,
        xEnd + dx, yEnd - dy, 0,
        xEnd - dx, yEnd + dy, 0,
        xBegin - dx, yBegin + dy, 0,
        xBegin + dx, yBegin - dy, 0
      ])
   
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
      const polygon = new THREE.Line(geometry, material)
   
      // const polygon = this.createLine([
      //   new THREE.Vector3(xBegin + dx, yBegin - dy, 0),
      //   new THREE.Vector3(xEnd + dx, yEnd - dy, 0),
      //   new THREE.Vector3(xEnd - dx, yEnd + dy, 0),
      //   new THREE.Vector3(xBegin - dx, yBegin + dy, 0),
      //   new THREE.Vector3(xBegin + dx, yBegin - dy, 0)],
      //   material)
   
      polygon.name = 'blck-row-3d-' + model.lfdnrReihe
      polygon.userData = model
      polygon.userData["kuBlockNr"] = kuBlockNr
   
      polygon.matrixAutoUpdate = false
   
      return polygon
    }
  */

  private createRowBorder(row: BlockRow /*, kuBlockNr: string */) {
    const { reiheLaenge: width, reiheBreite: height, reiheBreite: depth, xMitte: x, yMitte: y, blockTyp, winkel, lfdnrReihe } = row; // Z
    // const dx = width / 2;
    // const dy = height / 2;
    const dangle = winkel * (Math.PI / 180); // calculate angle in radiants

    const material = getMaterialByBlockType(blockTyp);
    const geometry = this.getRowBorderGeometry(width, height);

    const polygon = new THREE.Line(geometry, material);
    polygon.position.set(x, y, 0);
    polygon.rotateZ(dangle);

    polygon.name = 'blck-row-3d-' + lfdnrReihe;
    // polygon.userData = row;
    // polygon.userData["kuBlockNr"] = kuBlockNr;

    polygon.matrixAutoUpdate = false;
    polygon.updateMatrix();

    return polygon;
  }

  private getRowBorderGeometry(width: number, height: number) {
    const key = `block-${width}x${height}`;

    if (!this.geomitries[key]) {
      const dx = width / 2;
      const dy = height / 2;

      const vertices = new Float32Array([+dx, -dy, 0, +dx, +dy, 0, -dx, +dy, 0, -dx, -dy, 0, +dx, -dy, 0]);

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      this.geomitries[key] = geometry;
    }
    // else {
    //   console.log(key)
    // }

    return this.geomitries[key];
  }

  private createBlockLabel({ kuBlockNr, rows: [{ xStart: x, yStart: y }] }: Block) {
    // const shift = 1;

    const label = createLabel(kuBlockNr, x, y, 6, 0, 0, 0.5, blockMaterials.blockLabel2, this.font);
    label.rotation.x = 90 * (Math.PI / 180);
    label.updateMatrix();

    return label;
  }

  private createBlockLabel_7({ kuBlockNr, rows: [{ xStart: x, yStart: y, winkel }] }: Block) {
    // const shift = 1;

    const label = createLabel(kuBlockNr, x, y, 0, winkel - 45, 0, 0.5, blockMaterials.blockType_7, this.font);

    return label;
  }

  private createRowLabel({ xStart: x, yStart: y, winkel, kuReihe }: BlockRow /*, kuBlockNr: string */) {
    // const shift = 1;

    const label = createLabel(`${kuReihe} - ${winkel}`, x, y, 0, winkel, 1, 0.4, blockMaterials.blockLabel, this.font);

    return label;
  }
}
