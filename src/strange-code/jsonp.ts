export default (url: string, callback: (arg0: any) => void) => {
  const callbackName = 'process_redbox_map'; // + Math.round(100000 * Math.random());

  // TypeScript TS7015: Element implicitly has an 'any' type because index expression is not of type 'number'
  // window[callbackName] = (data: any) => {
  (window as { [key: string]: any })[callbackName] = (data: any) => {
    // delete window[callbackName]
    // document.body.removeChild(script)
    callback(data);
  };

  const sep = url.indexOf('?') >= 0 ? '&' : '?';

  const script = document.createElement('script');
  script.src = `${url}${sep}callback=${callbackName}`;
  document.body.appendChild(script);
};
