import './assets/style.css';
import Application from './components/Application.js';
// import { BCO_API_URL } from './constants';
import MockDataApi from './services/MockDataApi';

const application = new Application({
  targetElement: document.querySelector('.js-canvas'),
  dataApi: new MockDataApi(),
});
