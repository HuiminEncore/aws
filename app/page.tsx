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
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [deviceData, setDeviceData] = useState<Array<Schema["Data"]["type"]>>(
    []
  );

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  function getDeviceInfo() {
    client.models.Data.observeQuery().subscribe({
      next: (data) => setDeviceData([...data.items]),
    });
  }

  useEffect(() => {
    listTodos();
    getDeviceInfo();
  }, []);

  function createTodo() {
    client.models.Todo.create({
      content: window.prompt("Todo content"),
    });
  }

  function addDevice() {
    console.log("addDevice");
  }

  return (
    <main>
      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.content}</li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/">
          Review next steps of this tutorial.
        </a>
      </div>
      <h1>Device Information</h1>
      <div className="device-info">
        {deviceData.map((device) => (
          <div key={device.id}>
            <p>Battery: {device.battery}%</p>
            <p>CO2: {device.co2} ppm</p>
            <p>Humidity: {device.humidity}%</p>
            <p>Light Level: {device.light_level}</p>
            <p>PIR Status: {device.pir}</p>
            <p>Pressure: {device.pressure} hPa</p>
            <p>Temperature: {device.temperature}°C</p>
            <p>TVOC: {device.tvoc} ppb</p>
          </div>
        ))}
      </div>
      <button onClick={addDevice}>Add device</button>
    </main>
  );
}
