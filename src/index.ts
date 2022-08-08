import './assets/style.css';

import Application from './Application';
// import DataApi from './services/DataApi';
import MockDataApi from './services/MockDataApi';
import DataService from './services/DataService';
import ResourcesService from './services/ResourcesService';
import MqttClient from './services/MqttClient';

const host = '127.0.0.1';
const port = 8080;
const mqttClient = new MqttClient({ host, port });

// const dataApi = new DataApi();
const dataApi = new MockDataApi();
const dataService = new DataService(dataApi);

const resources = new ResourcesService();

const app = new Application({
  targetElement: document.querySelector('.js-canvas'),
  dataService,
  mqttClient,
  resources,
});

window.application = app; // set global variable

app.init();
