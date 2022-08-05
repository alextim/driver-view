import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { Font } from 'three/examples/jsm/loaders/FontLoader';
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// import TextSprite from '@seregpie/three.text-sprite'
import blockMaterials from './blockMaterial';

type TextMesh = THREE.Mesh<TextGeometry, THREE.LineBasicMaterial | THREE.MeshBasicMaterial>;

export default class Blocks {
  mergeGeometries: boolean;
  drawLabel: boolean;

  geomitries: Record<string, any>;

  font: Font;
  data: any[];

  labels_7: TextMesh[];
  labels: TextMesh[];
  rowLabels: TextMesh[];

  container: THREE.Object3D;

  constructor({ font, data, drawLabel }: { font: Font; data: any[]; drawLabel: boolean }) {
    this.mergeGeometries = false;
    this.drawLabel = drawLabel;

    this.geomitries = {};

    this.font = font;
    this.data = data;

    this.labels_7 = [];
    this.labels = [];
    this.rowLabels = [];

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

    this.setBlocks();
  }

  setBlocks() {
    console.time('setBlocks');

    this.data.forEach((block) => void this.createBlock(block));

    if (this.drawLabel && this.mergeGeometries) {
      [
        this.mergedMesh(this.labels_7, blockMaterials.blockType_7),
        this.mergedMesh(this.labels, blockMaterials.blockLabel2),
        this.mergedMesh(this.rowLabels, blockMaterials.blockLabel),
      ]
        .filter(Boolean)
        .forEach((item) => void this.container.add(item!));
    }

    console.log(this.container.toJSON());

    console.timeEnd('setBlocks');
  }

  mergedMesh(meshes: TextMesh[], material: THREE.MeshBasicMaterial | THREE.LineBasicMaterial) {
    if (meshes.length === 0) {
      return undefined;
    }
    const geometries = meshes.map((m) => {
      // materials.push(b.material);
      m.updateMatrixWorld(); // needs to be done to be sure that all transformations are applied
      return m.geometry.applyMatrix4(m.matrixWorld);
    });
    const mergedGeometry = mergeBufferGeometries(geometries, true);

    return new THREE.Mesh(mergedGeometry, material);
  }

  createBlock(block: any) {
    // console.log(block)
    try {
      const blockTyp = block.rows[0].blockTyp;

      if (this.drawLabel) {
        switch (blockTyp) {
          case 8:
            // do nothing
            break;
          case 7:
            if (this.mergeGeometries) this.labels_7.push(this.createBlockLabel_7(block));
            else this.container.add(this.createBlockLabel_7(block));
            break;
          default:
            if (this.mergeGeometries) this.labels.push(this.createBlockLabel(block));
            else this.container.add(this.createBlockLabel(block));
        }
      }

      const hasLabel = !(blockTyp === 7 || blockTyp === 8);
      block.rows.forEach((row: any) => void this.createRow(row, block.kuBlockNr, hasLabel));
    } catch (ex) {
      console.error(block.kuBlockNr + ' ' + ex);
    }
  }

  createRow(row: any, kuBlockNr: any, hasLabel: boolean) {
    // const mesh = this.createRowBorder(row, kuBlockNr)
    const mesh = this.createRowBorder(row, kuBlockNr);
    this.container.add(mesh);

    if (this.drawLabel) {
      if (hasLabel) {
        const label = this.createRowLabel(row, kuBlockNr);
        if (this.mergeGeometries) this.rowLabels.push(label);
        else this.container.add(label);

        // this.container.add(label)
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

  createRowBorder(row: any, kuBlockNr: any) {
    const width = row.reiheLaenge,
      height = row.reiheBreite,
      depth = row.reiheBreite; // Z
    const dx = width / 2,
      dy = height / 2;
    const x = row.xMitte,
      y = row.yMitte;
    const dangle = row.winkel * (Math.PI / 180); // calculate angle in radiants

    const material = this.getMaterial(row.blockTyp);
    const geometry = this.getRowBorderGeometry(width, height);

    const polygon = new THREE.Line(geometry, material);
    polygon.position.set(x, y, 0);
    polygon.rotateZ(dangle);

    polygon.name = 'blck-row-3d-' + row.lfdnrReihe;
    // polygon.userData = row;
    // polygon.userData["kuBlockNr"] = kuBlockNr;

    polygon.matrixAutoUpdate = false;
    polygon.updateMatrix();

    return polygon;
  }

  getRowBorderGeometry(width: number, height: number) {
    const dx = width / 2,
      dy = height / 2;

    const vertices = new Float32Array([+dx, -dy, 0, +dx, +dy, 0, -dx, +dy, 0, -dx, -dy, 0, +dx, -dy, 0]);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    if (this.geomitries[`block-${width}x${height}`] === undefined) {
      this.geomitries[`block-${width}x${height}`] = geometry;
    }
    // else {
    //   console.log(`block-${width}x${height}`)
    // }

    return this.geomitries[`block-${width}x${height}`];
  }

  getMaterial(blockType: number) {
    /*
        angle		=			m_draw_data_c->get_angle  (i)
   
      double pi = 3.1415926535
      double dangle= (double)pi*(angle)/180.	// calculate angle in radiants
      double sin_angle= sin(dangle)	// this for speeding up process below
      double cos_angle= cos(dangle)
      
          blockName	=		m_draw_data_c->get_ku_block_nr(i)
          lagerName	=		m_draw_data_c->get_ku_lager_nr(i)
          xEnd		=		m_draw_data_c->get_x_end(i)
          yEnd		=		m_draw_data_c->get_y_end(i)
          xBegin		=		m_draw_data_c->get_x_start(i)
          yBegin		=		m_draw_data_c->get_y_start(i)
          xKoord		=		m_draw_data_c->get_xkoord(i)
          yKoord		=		m_draw_data_c->get_ykoord(i)
          //  check if it's a old fashioned database which hasn't x/yBegin and x/yEnd
          if (xBegin==0 && yBegin==0 && xEnd==0 && yEnd==0 && xKoord && yKoord)
          {
            xBegin= xKoord+.5	xEnd  = xKoord-.5
            yBegin= yKoord+.5	yEnd  = yKoord-.5
          }
          rowWidth	=	m_draw_data_c->get_abstand_reihe(i)
          if (!rowWidth)	rowWidth=2.	
    
          if (block_type==BT_FLAECHE)
          {	//  draw the frame around the Floor Space in a different manner
            xEnd= xBegin
            yEnd= yBegin
          }
          //  Save the rectangle or quadrangle in variable
          quadrangle_c quadr( CPoint	((int)(xBegin*100. - rowWidth*100./2.*sin_angle),	// x2
                         (int)(yBegin*100. + rowWidth*100./2.*cos_angle)),	// y1
                    CPoint	((int)(xEnd	 *100. - rowWidth*100./2.*sin_angle),	// x1 all length given here in centi metres
                         (int)(yEnd  *100. + rowWidth*100./2.*cos_angle)),	// y1
                    CPoint	((int)(xBegin*100. + rowWidth*100./2.*sin_angle),	// x1
                         (int)(yBegin*100. - rowWidth*100./2.*cos_angle)),	// y1
                    CPoint	((int)(xEnd  *100. + rowWidth*100./2.*sin_angle),	// x2
                         (int)(yEnd  *100. - rowWidth*100./2.*cos_angle)))	// y2
    */

    switch (blockType) {
      case 8: // Navigation
        return blockMaterials.blockType_8; // 0x00FF0F
        //console.log(model.lfdnrReihe + ' ' + model.winkel)
        //xEnd = xBegin
        //yEnd = yBegin
        break;
      case 21: // Still Safety
        return blockMaterials.blockType_8; // 0x00FF0F
      case 12: // production output
      case 20: // Building
        return blockMaterials.blockType_20; // Color.Black
      case 3: // RACK
      case 13:
      case 14:
      case 15:
      case 16:
      case 17:
        return blockMaterials.blockType_17; //0x0000FF // Color.DarkBlue
      case 7: // BT_FLAECHE
        //console.log(model.lfdnrReihe + ' ' + model.winkel)
        //xEnd = xBegin
        //yEnd = yBegin
        return blockMaterials.blockType_7; // Color.Green
      default:
        return blockMaterials.blockType_default; // Color.Red
    }
  }

  createBlockLabel(block: any) {
    const x = block.rows[0].xStart,
      y = block.rows[0].yStart;
    const shift = 1;

    const label = this.createLabel(block.kuBlockNr, x, y, 6, 0, 0, 0.5, blockMaterials.blockLabel2);
    label.rotation.x = 90 * (Math.PI / 180);
    label.updateMatrix();

    return label;
  }

  createBlockLabel_7(block: any) {
    const x = block.rows[0].xStart,
      y = block.rows[0].yStart;
    const shift = 1;

    const label = this.createLabel(block.kuBlockNr, x, y, 0, block.rows[0].winkel - 45, 0, 0.5, blockMaterials.blockType_7);

    return label;
  }

  createRowLabel(row: any, kuBlockNr: any) {
    const x = row.xStart;
    const y = row.yStart;
    const shift = 1;

    const label = this.createLabel(`${row.kuReihe} - ${row.winkel}`, x, y, 0, row.winkel, 1, 0.4, blockMaterials.blockLabel);

    return label;
  }

  createLabel(
    text: string,
    x: number,
    y: number,
    z: number,
    angle: number,
    shift: number,
    size: number,
    material: THREE.MeshBasicMaterial | THREE.LineBasicMaterial,
  ) {
    const dangle = angle * (Math.PI / 180);

    if (shift != 0) {
      switch (angle) {
        case 0:
          x -= shift;
          break;
        case 90:
          y -= shift;
          break;
        case 180:
          x += shift;
          break;
        case 270:
          y += shift;
          break;
        default:
          x -= shift * Math.cos(dangle);
          y -= shift * Math.sin(dangle);
      }
    }

    return this.createText(text, x, y, z, dangle, size, material);
  }

  createText(
    text: string,
    x: number,
    y: number,
    z: number,
    dangle: number,
    size: number,
    material: THREE.MeshBasicMaterial | THREE.LineBasicMaterial,
  ) {
    const geometry = new TextGeometry(text, {
      font: this.font,
      size,
      height: 0,
      curveSegments: 4,
    });

    // geometry.computeBoundingBox()
    // console.log(geometry.boundingBox)
    // console.log(geometry.boundingBox.max.x - geometry.boundingBox.min.x)

    const label = new THREE.Mesh(geometry, material);
    label.position.set(x, y, z);
    if (dangle !== 0) {
      label.rotateZ(dangle);
    }

    label.matrixAutoUpdate = false;
    label.updateMatrix();

    // Merge all text geometries.
    // mergedGeometry = BufferGeometryUtils.mergeBufferGeometries( geometries );

    // var mesh = new THREE.Mesh(mergedGeometry, materialWhite);

    return label;
  }

  createLabel2(text: string, x: number, y: number, z: number, size: number) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) {
      console.warn('fail getContext("2d")');
      return undefined;
    }

    context.font = size + 'pt Arial';

    const margin = 10;
    const textWidth = context.measureText(text).width;

    context.strokeStyle = 'black';
    context.strokeRect(0, 0, canvas.width, canvas.height);

    context.strokeStyle = 'red';
    context.strokeRect(
      canvas.width / 2 - textWidth / 2 - margin / 2,
      canvas.height / 2 - size / 2 - +margin / 2,
      textWidth + margin,
      size + margin,
    );

    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = 'black';
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    const material = new THREE.MeshBasicMaterial({
      map: texture,
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(canvas.width, canvas.height, 10, 10), material);
    // TODO: mesh.overdraw = true;
    (mesh as any).overdraw = true;
    // mesh.doubleSided = true;
    mesh.position.x = x - canvas.width / 2;
    mesh.position.y = y - canvas.height / 2;

    return mesh;
  }
}
