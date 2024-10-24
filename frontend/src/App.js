import './App.css';
import DroneMap from './DroneMap/DroneMap';
import Horizon from './Horizon/Horizon';
import Battery from './Battery/Battery';
import Graph from './Graph/Graph';
import KeyValue from './KeyValue/KeyValue';

function App() {

  const droneData = {
    lat: 37.7749,  // Example latitude
    lng: -122.4194, // Example longitude
    heading: 90, // Example heading (in degrees)
    pitch: 0,
    roll: 0,
    battery: 77
  };

  const altitudeData = [
    { time: '10:00', altitude: 120 },
    { time: '10:01', altitude: 130 },
    { time: '10:02', altitude: 125 },
    // More data points...
  ];

  return (
    <div className="App">
      <DroneMap dronePosition={droneData} />
      <Horizon pitch={droneData.pitch} roll={droneData.roll} />
      <Battery percentage={droneData.battery} />
      <Graph data={altitudeData} />

      <KeyValue name={'test'} value={22} />
    </div>
  );
}

export default App;
