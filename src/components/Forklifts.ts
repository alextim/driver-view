import * as THREE from 'three';
import Palettes from './Palettes';

import { MY_FORKLIFT_ID, FRK_PLT_3D_, PLT_3D_ } from '../constants';

export default class Forklifts {
  scene: THREE.Scene;
  forkliftModel: THREE.Group;
  data: Record<string, string>;
  palettes: Palettes;
  forklifts: Record<string, THREE.Object3D>;

  constructor({
    forkliftModel,
    data,
    palettes,
    scene,
  }: {
    forkliftModel: THREE.Group;
    data: Record<string, string>;
    palettes: Palettes;
    scene: THREE.Scene;
  }) {
    this.forkliftModel = forkliftModel;
    this.data = data;
    this.palettes = palettes;
    this.scene = scene;

    // this.container = new THREE.Object3D()
    // this.container.matrixAutoUpdate = true
    // this.container.name = 'forklifts'

    this.forklifts = {};
  }

  createForklift(id: string, forklift3d?: THREE.Object3D) {
    if (!this.forkliftModel) {
      return null;
    }
    // console.log(this.forkliftModel)
    if (this.forklifts[id]) {
      return this.forklifts[id];
    }

    if (!forklift3d) {
      forklift3d = new THREE.Object3D();
      forklift3d.name = 'frk-3d-' + id;
    }

    // adjust model
    // todo: fix it in blender
    const forkliftModel = this.forkliftModel.clone();
    forklift3d.add(forkliftModel);
    // forklift.position.z = 1.25
    // forklift.rotation.y = (Math.PI / 4)

    this.forklifts[id] = forklift3d;

    if (id !== MY_FORKLIFT_ID) {
      this.scene.add(forklift3d);
    }

    return forklift3d;
  }

  getForklift(id: string) {
    if (this.forklifts[id]) {
      return this.forklifts[id];
    }
    return this.createForklift(id);
  }

  updateForkliftPosition(forkliftData: any) {
    if (forkliftData.staplerNr === MY_FORKLIFT_ID) {
      // updated by tcpcom
      return;
    }
    const forklift3d = this.getForklift(forkliftData.staplerNr);
    if (!forklift3d) {
      console.warn(`no forkliftData.staplerNr=${forkliftData.staplerNr}`);
      return;
    }

    if (forklift3d.position.x != forkliftData.xkoord || forklift3d.position.y != forkliftData.ykoord) {
      forklift3d.position.x = forkliftData.xkoord;
      forklift3d.position.y = forkliftData.ykoord;
    }
    const rad = forkliftData.winkel * (Math.PI / 180);
    if (forklift3d.rotation.z != rad) {
      forklift3d.rotation.z = rad;
    }
  }

  updateForkliftPalettes(forkliftId: string, palettesData: any[]) {
    const sampleData = [
      {
        gabelNr: 1,
        transportEtage: 1,
        gabelSlot: 1,
        leAufnahmeSeite: 1.2,
        leGegenSeite: 0.8,
        leHoehe: 1.13,
        leBasx: 0,
        leBasy: 0,
        leBasz: 1.13,
        luOwner: '',
        artikel: 'E1030277',
        articleDesc: '',
        menge: 938,
        meeinheit: '',
        leNr: 'A',
        epcNr: '007524-35505',
        prodDatumZeit: '20201113131444',
        mhdDatumZeit: '',
        sperrDatumZeit: '',
        gewicht: 938,
        loadingType: '2',
        dimension: 'EPAL',
        transNo: '',
        orderNo: '00000000',
        mission: 0,
        scanEpc: 0,
        scanAntw: 1,
        scanErr: 1,
        errDesc: '',
        eigenAuftragErstellt: '0',
        eauftragNr: '',
        sonderPlatz: 0,
        aufKennung: 0,
        hazmatP1: '',
        hazmatP2: '',
        luRemainder: '',
        luStockable: '',
        leDefekt: 1,
        leUnkonform: 1,
        leGesperrt: 1,
        leQs: 1,
        leAdditional1: 1,
        leAdditional2: 3,
        mess: '',
        resNr: 0,
        prodBlock: '1',
        additionalChar1: '',
        additionalChar2: '',
        additionalChar3: '',
        additionalChar4: '',
        additionalChar5: '35505',
        additionalChar6: '',
        additionalChar7: '10',
        additionalChar8: '1',
        additionalChar9: '',
        additionalInt1: 5,
        additionalInt2: 0,
        additionalInt3: 0,
        additionalInt4: 0,
        additionalInt5: 0,
        additionalInt6: 0,
        additionalInt7: 0,
        additionalInt8: 0,
        additionalInt9: 0,
        additionalFloat1: 0,
        additionalFloat2: 0,
        additionalFloat3: 0,
        additionalFloat4: 0,
        additionalFloat5: 0,
        additionalFloat6: 0,
        additionalFloat7: 0,
        additionalFloat8: 0,
        additionalFloat9: 0,
        additionalDate1: '',
        additionalDate2: '',
        aktion1: 0,
        aktion2: 0,
        aktion3: 0,
        palType: 0,
        aufLagerNr: '1',
        aufBlockNr: 'MATRIX',
        aufReihe: '20',
        aufDate: '0000-00-00 00:00:00',
      },
    ];

    const forklift3d = this.getForklift(forkliftId);

    if (!forklift3d) {
      console.warn(`no forkliftId=${forkliftId}`);
      return;
    }
    this.pickupForkliftPalettes(forklift3d, palettesData);
  }

  pickupForkliftPalettes(forklift3d: THREE.Object3D, palettesData: any[]) {
    let zPalette = 0.05;
    palettesData.forEach((el) => {
      //pickup data model
      const epcNr = el.epc_nr ?? el.epcNr;

      el.xkoord = 1.7;
      el.ykoord = 0;
      el.ablageHoehe = zPalette;
      el.winkel = 0;

      const testFrkPlt = forklift3d.children.filter((x) => x.name === FRK_PLT_3D_ + epcNr);
      if (testFrkPlt.length > 0) {
        zPalette += el.leHoehe;

        //check z
        if (testFrkPlt[0].position.z !== zPalette) {
          // todo: move
        }
      } else {
        const testWrhsPlt = this.palettes.container.children.filter((x) => x.name === PLT_3D_ + epcNr);
        if (testWrhsPlt.length > 0) {
          let leHoehe = el.leHoehe;
          if (!el.leHoehe) {
            // get from mesh geometry
            // TODO: geometry
            leHoehe = (testWrhsPlt[0].children[0] as unknown as any).geometry.parameters.height;
          }
          zPalette += leHoehe;
          //hide in warehouse add to forklift
          const frkPlt = testWrhsPlt[0].clone();
          testWrhsPlt[0].visible = false; // ???

          frkPlt.name = FRK_PLT_3D_ + el.epcNr;
          frkPlt.position.set(el.xkoord, el.ykoord, el.ablageHoehe + leHoehe / 2);
          if (el.winkel % 180 !== 0) {
            // TODO: frkPlt.rotateZ = el.winkel * (Math.PI / 180); // _1_DEG_TO_RAD
            // frkPlt.rotateZ = el.winkel * (Math.PI / 180); // _1_DEG_TO_RAD
            frkPlt.rotateZ(el.winkel * (Math.PI / 180)); // _1_DEG_TO_RAD
          }
          frkPlt.updateMatrix();
          forklift3d.add(frkPlt);
        } else {
          zPalette += el.leHoehe;

          const palette = this.palettes.createPalette(el, FRK_PLT_3D_);
          forklift3d.add(palette);
        }
      }
    });
  }

  dropForkliftPalettes(forklift3d: THREE.Object3D, palettesData: any[]) {
    // assume palettes already exists !!!
    // todo: review it

    for (const el of palettesData) {
      const epcNr = el.epc_nr ?? el.epcNr;

      const testFrkPlt = forklift3d.children.filter((x) => x.name === FRK_PLT_3D_ + epcNr);
      const testPlt = forklift3d.children.filter((x) => x.name === PLT_3D_ + epcNr);

      const frkPlt = testFrkPlt.length > 0 ? testFrkPlt[0] : null;
      let plt = testPlt.length > 0 ? testPlt[0] : null;

      const ablageHoehe = el.le_ablage_hoehe ?? el.ablageHoehe;
      const leHoehe = el.le_hoehe ?? el.leHoehe;

      // display on warehouse

      if (!plt) {
        if (!frkPlt) {
          console.error(`BUG: can't create droped palettes for warehouse: ${epcNr}`);
        } else {
          plt = frkPlt.clone();
          plt.name = PLT_3D_ + epcNr;
          this.palettes.container.add(plt);
        }
      }

      if (plt) {
        // todo: move code to Palettes
        plt.position.set(el.xkoord, el.ykoord, ablageHoehe + leHoehe / 2);
        if (el.winkel % 180 !== 0) {
          // TODO: plt.rotateZ = el.winkel * (Math.PI / 180); // _1_DEG_TO_RAD
          plt.rotateZ(el.winkel * (Math.PI / 180)); // _1_DEG_TO_RAD
        }
        plt.updateMatrix();
        plt.visible = true;
      }

      // delete from forklift
      if (frkPlt) {
        forklift3d.remove(frkPlt); // destroy object??
      } else {
        console.warn(`BUG: can't find droped palettes on forklift: ${epcNr}`);
      }
    }
  }

  updateStatus(data: undefined | any[]) {
    const sampleData = [
      {
        staplerNr: '50', //+
        winkel: 33, //+
        ope_code: '1234',
        epc_nr: '007524-35505',
        anz_paletten: 1,
        tgewicht: 938,
        xkoord: 19.6, //+
        ykoord: 22.4, //+
        posIdentNr: '1000 0000100700250002',
      },
    ];

    this.updateForkliftPosition(data);
  }

  drop(data: undefined | any[]) {
    if (!data?.length) {
      return;
    }

    const sampleData = [
      {
        stapler_nr: '50',
        staplerNr: '50',
        pos_ident_nr: '1000 0000100700220003',
        etage: 1,
        xkoord: 18.2,
        ykoord: 22.4,
        winkel: 90,
        gabel_nr: 1,
        lagerort: '0100700220003010',
        res_nr: 0,
        le_nr: 'A',
        epc_nr: '007524-35505',
        lu_owner: '',
        artikel: 'E1030277',
        article_desc: '',
        menge: 938,
        meeinheit: '',
        gewicht: 938,
        we_datum_zeit: '00000000000000',
        prod_datum_zeit: '20201113131444',
        mhd_datum_zeit: '',
        sperr_datum_zeit: '',
        le_aufnahme_seite: 1.2,
        le_gegen_seite: 0.8,
        le_hoehe: 1.13,
        le_basx: 0,
        le_basy: 0,
        le_basz: 1.13,
        le_ablage_hoehe: 0,
        loading_type: '2',
        dimension: 'EPAL',
        order_no: '00000000',
        mess: '',
        hazmat_p1: '',
        hazmat_p2: '',
        lu_remainder: '',
        lu_stockable: '',
        le_defekt: 1,
        le_unkonform: 1,
        le_gesperrt: 1,
        le_qs: 1,
        le_additional1: 1,
        le_additional2: 3,
        prod_block: '1',
        additional_char1: '',
        additional_char2: '',
        additional_char3: '',
        additional_char4: '',
        additional_char5: '35505',
        additional_char6: '',
        additional_char7: '10',
        additional_char8: '1',
        additional_char9: '',
        additional_int1: 5,
        additional_int2: 0,
        additional_int3: 0,
        additional_int4: 0,
        additional_int5: 0,
        additional_int6: 0,
        additional_int7: 0,
        additional_int8: 0,
        additional_int9: 0,
        additional_float1: 0,
        additional_float2: 0,
        additional_float3: 0,
        additional_float4: 0,
        additional_float5: 0,
        additional_float6: 0,
        additional_float7: 0,
        additional_float8: 0,
        additional_float9: 0,
        additional_date1: '',
        additional_date2: '',
        ope_code: '1234',
        pal_type: 0,
        fpid: 0,
      },
    ];

    // todo: is it for same forklift ???
    const forklift3d = this.getForklift(data[0].staplerNr);
    if (!forklift3d) {
      console.warn(`no forkliftId=${data[0].staplerNr}`);
    }
    this.dropForkliftPalettes(forklift3d!, data);
  }

  pickup(data: undefined | any[]) {
    if (!data?.length) {
      return;
    }

    const sampleData = [
      {
        staplerNr: '50',
        gabel_nr: 1,
        transport_etage: 1,
        gabel_slot: 1,
        auf_lager_nr: '1',
        auf_block_nr: 'MATRIX',
        auf_reihe: '20',
        epc_nr: '007524-35505',
        le_nr: 'A',
        artikel: 'E1030277',
        article_desc: '',
        mess: '',
        hazmat_p1: '',
        hazmat_p2: '',
        Zpos_ident_nr: '1000 0000100700200002',
        G1_pos_ident_nr: '',
        G2_pos_ident_nr: '',
      },
    ];

    // todo: is it for same forklift ???
    const forklift3d = this.getForklift(data[0].staplerNr);
    if (!forklift3d) {
      console.warn(`no forkliftId=${data[0].staplerNr}`);
    }
    // todo: discuss about data model
    //       if palette 3d object not yet created how to get data from lagerdaten or stapler_XX
    const palettesData = data.map((el) => ({ ...el, epcNr: el.epc_nr }));
    this.pickupForkliftPalettes(forklift3d!, palettesData);
  }
}
