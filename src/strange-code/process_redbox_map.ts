import { TCPCOM_SLEEP } from '../constants';
import loadData from './loadData';

async function process_redbox_map(data: any) {
  const orientation = data.get('orientation');
  const x = data.get('x');
  const y = data.get('y');

  const app = window.application;

  // const frk = app.myForklift;
  const frk = app.appView.myForklift;
  // console.log(frk)
  const rad = orientation * (Math.PI / 180);

  if (frk.position.x != x || frk.position.y != y || frk.rotation.z != rad) {
    console.log('x=' + x + ', y=' + y + ', ori=' + orientation);

    frk.position.set(x, y, 0);
    frk.rotation.z = rad;

    app.update();
  }

  await sleep(TCPCOM_SLEEP);
  loadData();
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

(window as any).process_redbox_map = process_redbox_map;
