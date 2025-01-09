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
  const [deviceInfo, setDeviceInfo] = useState({
    battery: 0,
    co2: 0,
    humidity: 0,
    light_level: 0,
    pir: "",
    pressure: 0,
    temperature: 0,
    tvoc: 0,
  });

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  useEffect(() => {
    listTodos();
  }, []);

  function createTodo() {
    client.models.Todo.create({
      content: window.prompt("Todo content"),
    });
  }

  function getDeviceInfo() {
    console.log("getDeviceInfo");
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
        <p>Battery: {deviceInfo.battery}%</p>
        <p>CO2: {deviceInfo.co2} ppm</p>
        <p>Humidity: {deviceInfo.humidity}%</p>
        <p>Light Level: {deviceInfo.light_level}</p>
        <p>PIR Status: {deviceInfo.pir}</p>
        <p>Pressure: {deviceInfo.pressure} hPa</p>
        <p>Temperature: {deviceInfo.temperature}°C</p>
        <p>TVOC: {deviceInfo.tvoc} ppb</p>
      </div>
      <button onClick={getDeviceInfo}>Get Device Info</button>
      <button onClick={addDevice}>Add device</button>
    </main>
  );
}
