import jsonp from './jsonp';

const dummyData = [
  {
    patientName: 'Jon Foo',
    time: '7:00 pm',
    duration: '30 min',
    provider: 'Shmovider',
    appointmentStatus: 'done',
  },
  {
    patientName: 'Jane Bar',
    time: '7:30 pm',
    duration: '60 min',
    provider: 'Shlovider',
    appointmentStatus: 'in progress',
  },
];

export default (callback) =>
  jsonp(
    'http://localhost:8081/vna.jsonp',
    //'https://jsfiddle.net/echo/jsonp/?data=' + JSON.stringify(dummyData),
    (response) => callback(JSON.parse(response.data)),
  );
