import * as THREE from 'three';

const blockMaterials = {
  transponder: new THREE.LineBasicMaterial({ color: 0xff00ff }),

  blockType_21: new THREE.LineBasicMaterial({ color: 0xff0000 }),
  blockType_20: new THREE.LineBasicMaterial({ color: 0x000000 }),
  blockType_17: new THREE.LineBasicMaterial({ color: 0x0000ff }),
  blockType_8: new THREE.LineBasicMaterial({ color: 0x76a5af }),
  blockType_7: new THREE.LineBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide }),
  blockType_default: new THREE.LineBasicMaterial({ color: 0xff0000 }),

  blockLabel: new THREE.MeshBasicMaterial({ color: 0xff0000 }),
  blockLabel2: new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide }),
};

export default blockMaterials;

export function getMaterialByBlockType(blockType: number) {
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
