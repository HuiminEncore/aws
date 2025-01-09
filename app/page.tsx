"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [deviceData, setDeviceData] = useState<Array<Schema["Data"]["type"]>>(
    []
  );

  const [things, setThings] = useState<Array<Schema["Thing"]["type"]>>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    deviceId: "",
    deviceName: "",
    deviceType: "A", // default value
  });

  function listDeviceData() {
    client.models.Data.observeQuery().subscribe({
      next: (data) => setDeviceData([...data.items]),
    });
    console.log(deviceData);
  }

  function listThings() {
    client.models.Thing.observeQuery().subscribe({
      next: (data) => setThings([...data.items]),
    });
  }

  useEffect(() => {
    listDeviceData();
    listThings();
  }, []);

  function createThing(e: React.FormEvent) {
    e.preventDefault();
    client.models.Thing.create({
      deviceId: formData.deviceId,
      deviceName: formData.deviceName,
      deviceType: formData.deviceType,
    });
    setShowForm(false);
    setFormData({ deviceId: "", deviceName: "", deviceType: "A" });
  }

  return (
    <main>
      <h1>My things</h1>
      <button onClick={() => setShowForm(true)}>+ new</button>

      {showForm && (
        <form onSubmit={createThing} className="thing-form">
          <input
            type="text"
            placeholder="Device ID"
            value={formData.deviceId}
            onChange={(e) =>
              setFormData({ ...formData, deviceId: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Device Name"
            value={formData.deviceName}
            onChange={(e) =>
              setFormData({ ...formData, deviceName: e.target.value })
            }
            required
          />
          <select
            value={formData.deviceType}
            onChange={(e) =>
              setFormData({ ...formData, deviceType: e.target.value })
            }
            required
          >
            <option value="A">Type A</option>
            <option value="B">Type B</option>
            <option value="C">Type C</option>
          </select>
          <div className="form-buttons">
            <button type="submit">Create</button>
            <button type="button" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <ul>
        {things.map((thing) => (
          <li key={thing.id}>
            <p>{thing.deviceId}</p>
            <p>{thing.deviceName}</p>
            <p>{thing.deviceType}</p>
          </li>
        ))}
      </ul>
      <h1>Device Data</h1>
      <div className="device-info">
        {deviceData.map((device) => {
          const parsedData = JSON.parse(device.device_data as string);
          return (
            <div key={device.id} className="sensor-card">
              <p>Device ID: {parsedData.deviceId.S}</p>
              <p>Time: {parsedData.time.S}</p>
              <p>Temperature: {parsedData.temperature.N}°C</p>
              <p>Humidity: {parsedData.humidity.N}%</p>
              <p>Pressure: {parsedData.pressure.N} hPa</p>
              <p>CO2: {parsedData.co2.N} ppm</p>
              <p>TVOC: {parsedData.tvoc.N} ppb</p>
              <p>Light Level: {parsedData.lightlevel.N}</p>
              <p>Battery: {parsedData.battery.N}%</p>
              <p>PIR Status: {parsedData.pir.S}</p>
              <p>Type: {parsedData.typename.S}</p>
              <p>
                Created:{" "}
                {new Date(Number(parsedData.createdAt.N)).toLocaleString()}
              </p>
              <p>
                Updated:{" "}
                {new Date(Number(parsedData.updatedAt.N)).toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>
    </main>
  );
}
