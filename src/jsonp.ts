import { TCPCOM_SLEEP } from './constants';

async function process_redbox_map(data: any) {
  const orientation = data.get('orientation');
  const x = data.get('x');
  const y = data.get('y');

  const app = window.application;

  // console.log(app.myForklift)
  const frk = app.myForklift;
  const rad = orientation * (Math.PI / 180);

  if (frk.position.x != x || frk.position.y != y || frk.rotation.z != rad) {
    console.log('x=' + x + ', y=' + y + ', ori=' + orientation);

    frk.position.set(x, y, 0);
    frk.rotation.z = rad;

    app.update();
  }

  await sleep(TCPCOM_SLEEP);
  app.loadData();
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default (url: string, callback: (arg0: any) => void) => {
  const callbackName = 'process_redbox_map'; // + Math.round(100000 * Math.random());
  (window as Record<string, any>)[callbackName] = (data: any) => {
    // delete window[callbackName]
    // document.body.removeChild(script)
    callback(data);
  };

  const script = document.createElement('script');
  script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
  document.body.appendChild(script);
};
