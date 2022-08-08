import { TCPCOM_URL } from '../constants';

function loadData() {
  //todo: delete prev.
  if (window.parseScript) {
    window.parseScript.parentElement?.removeChild(window.parseScript);
  }
  const parseScript = document.createElement('script');
  parseScript.src = TCPCOM_URL;
  document.getElementsByTagName('head')[0].appendChild(parseScript);
  window.parseScript = parseScript;
}

export default loadData;