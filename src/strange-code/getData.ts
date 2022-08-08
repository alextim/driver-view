import jsonp from './jsonp';

/*
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
*/

//const url = 'https://jsfiddle.net/echo/jsonp/?data=' + JSON.stringify(dummyData);
const url = 'http://localhost:8081/vna.jsonp';

function getData(callback: (arg0: any) => any) {
  return jsonp(url, (response) => callback(JSON.parse(response.data)));
}

export default getData;
