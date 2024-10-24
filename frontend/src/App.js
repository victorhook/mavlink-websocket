import './App.css';

import React, { useEffect, useState } from 'react';

import DroneMap from './DroneMap/DroneMap';
import Horizon from './Horizon/Horizon';
import Battery from './Battery/Battery';
import Graph from './Graph/Graph';
import KeyValue from './KeyValue/KeyValue';
import TelemetryClient from './TelemetryClient';
import TelemetryTable from './Telemetry/Telemetry';


function App() {
  const [telemetryData, setTelemetryData] = useState({});
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Callback function to handle data reception
    const handleNewData = (newData) => {
      setTelemetryData(newData); // Update the telemetry data
      setHistory((prevHistory) => [...prevHistory, newData]); // Add new data to history
    };

    // Create a new instance of TelemetryClient
    const telemetryClient = new TelemetryClient('ws://localhost:8989', handleNewData);

    // Cleanup: Close WebSocket when the component unmounts
    return () => {
      telemetryClient.close();
    };
  }, []);
/*
  return (
    <div>
      <h1>Telemetry Data</h1>
      <pre>{JSON.stringify(telemetryData, null, 2)}</pre>
      <h2>History</h2>
      <pre>{JSON.stringify(history, null, 2)}</pre>
    </div>
  );*/

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
      {/*<DroneMap dronePosition={droneData} />*/}
      <Horizon pitch={droneData.pitch} roll={droneData.roll} />
      <Battery percentage={droneData.battery} />
      <Graph data={altitudeData} />

      <KeyValue name={'test'} value={22} />

      <TelemetryTable telemetryData={telemetryData} />
    </div>
  );
}

export default App;
