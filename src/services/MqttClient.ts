import Paho from 'paho-mqtt';

import EventEmitter from '../utils/EventEmitter';

export default class MqttClient extends EventEmitter {
  private mq: Paho.Client;

  constructor({ host, port }: { host: string; port: number }) {
    super();

    this.mq = new Paho.Client(host, port, 'browserclient-' + Math.random());

    const onSuccess = () => {
      console.log('Mqtt Connected!');
      // Registrieren fuer Warenbewegungen / register for goods movement events
      this.mq.subscribe('/tr/warehouse/#');
      // und fuer Staplerlebenszeichen / .. and for forklift alive signals from blm
      this.mq.subscribe('/tr/forklift/#');
    };

    this.mq.onMessageArrived = (msg) => {
      // console.log(`Eingehende Nachricht / Incoming Message:\nTopic=${msg.topic}:\n ${msg.payloadString}`)
      // TODO: msg.topic is not a member!!!!
      this.trigger('mqttMessageArrived', [{ topic: (msg as any).topic, payloadString: msg.payloadString }]);
    };

    this.mq.onConnectionLost = (err) => {
      console.log('Mqtt Connection Lost!');
      console.log(err);
      // this.mq.connect(options) ???
      this.mq.connect({ onSuccess });
    };

    console.log('Connecting...');
    this.mq.connect({
      useSSL: false,
      // userName: '',
      // password: '',
      onSuccess,
      onFailure(e: any) {
        console.log('Mqtt Failure');
        console.log(e);
      },
      //willMessage: lastWill,
      keepAliveInterval: 30,
      reconnect: true,
    });
  }
}
