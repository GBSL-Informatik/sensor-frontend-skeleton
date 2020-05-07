import React from "react";
import "./styles.css";
import socketioClient from "socket.io-client";
import LineGraph from "./components/LineGraph";
import SensorConfig from "./components/SensorConfig";
import MotionSimulator from "./Simulator";

export const API_URL = "http://localhost:4001";

export default class App extends React.Component {
  /**
   * Generate a random string with 5 characters as the device id
   */
  deviceId = Math.random().toString(36).substr(2, 5).toUpperCase();

  state = {
    motionData: [],
    displayDeviceId: "",
    devices: [],
    useSimulatedDeviceMotion: false
  };

  componentDidMount() {
    this.socket = socketioClient(API_URL);

    // TODO 0: API_URL auf Zeile 24 durch die URL des Servers ersetzen.

    // TODO 1: teile dem Server mit, dass ein neues Gerät bereit zur Datenübertragung ist:
    //         Nachricht: "new_device", Daten: { deviceId: this.deviceId }

    // TODO 2: konfiguriere was passiert, wenn vom Server die Nachricht "motion_devices" empfangen wird
    //         --> Die erhaltenen Daten (data) sollen der Funktion "this.setMotionDevices" übergeben:
    //         this.setMotionDevice(data)

    // TODO 3: beantrage alle Devices vom Server:
    //         Nachricht: "get_devices"  

    // TODO 4: konfiguriere, was passiert, wenn vom Server die Nachricht "motion_data"
    //         empfangen wird. => die erhaltenen motionDaten müssen in unseren State geschrieben werden,
    //         damit der Graph die Änderung mitbekommt und sich updaten kann: 
    //         this.setState({ motionData: motionData })

    /**
     * register a function that is called whenever the window emits a
     * device motion event (e.g. whenever a new sensorvalue is present)
     */
    window.addEventListener("devicemotion", this.onDevicemotion, true)
  }

  setMotionDevices(motionDevices) {
    this.setState({ devices: motionDevices })
    // when the currently observed device is not present,
    // display the data of my own device
    if (!motionDevices.includes(this.state.displayDeviceId)) {
      this.setDisplayDevice(this.deviceId);
    }
  }

  onDevicemotion = (e) => {
    const motionData = {
      deviceId: this.deviceId,
      timeStamp: e.timeStamp,
      x: e.accelerationIncludingGravity.x,
      y: e.accelerationIncludingGravity.y,
      z: e.accelerationIncludingGravity.z
    };
    // TODO 5: sende die neuen Bewegungsdaten an den Server:
    //         Nachricht: "new_motion_data", Daten: motionData
  };

  /**
   * when no acceleration sensor is present, a simulator can be used instead
   */
  toggleUseSimulatedDeviceMotion = () => {
    const deviceSimulator = document.getElementById("DeviceSimulator");
    if (!deviceSimulator) {
      return;
    }

    const useSimulator = !this.state.useSimulatedDeviceMotion;
    this.setState({ useSimulatedDeviceMotion: useSimulator });
    if (useSimulator) {
      window.removeEventListener("devicemotion", this.onDevicemotion, true);
      deviceSimulator.addEventListener("devicemotion", this.onDevicemotion, true);
      const simulator = new MotionSimulator();
      this.setState({
        simulator: simulator
      });
    } else {
      deviceSimulator.removeEventListener("devicemotion", this.onDevicemotion, true);
      window.addEventListener("devicemotion", this.onDevicemotion, true);
      if (this.state.simulator) {
        this.state.simulator.stopSimulation();
        this.setState({
          simulator: undefined
        });
      }
    }
  }

  setDisplayDevice = (deviceId) => {
    // TODO: informiere den Server, dass wir nun die deviceMotion Daten
    //       von der "deviceId" beobachten möchten:
    //       Nachricht: "display_device", Daten: { oldDeviceId: this.state.displayDeviceId, deviceId: deviceId}


    // save the displayDeviceId locally such that it is shown in the dropdown
    this.setState({ displayDeviceId: deviceId });
  }

  clearMotionData = () => {
    // TODO: sage dem Server, er soll die Bewegungsdaten Daten des aktuellen
    //       displayDevices löschen:
    //       Nachricht: "clear_motion_data", Daten: { deviceId: this.state.displayDeviceId }
  }

  render() {
    return (
      <div className="App">
        <h1>Socket Sensor Stream</h1>
        <button onClick={this.clearMotionData}>Clear current Motion Data</button>
        <SensorConfig
          setDisplayDevice={this.setDisplayDevice}
          devices={this.state.devices}
          deviceId={this.deviceId}
          displayDeviceId={this.state.displayDeviceId}
          toggleUseSimulatedDeviceMotion={this.toggleUseSimulatedDeviceMotion}
          useSimulatedDeviceMotion={this.state.useSimulatedDeviceMotion}
        />
        <LineGraph motionData={this.state.motionData} />
      </div>
    );
  }
}
