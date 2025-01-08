"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { API } from '@aws-amplify/api'

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [config, setConfig] = useState({
    measurementInterval: 300,
    motionSensitivity: 'medium',
    ledEnabled: true
  })

  const updateDeviceConfig = async () => {
    try {
      await API.post('deviceApi', '/device/control', {
        body: {
          deviceId: '24E124707C141230',
          action: 'updateConfig',
          payload: config
        }
      })
      alert('Configuration updated!')
    } catch (error) {
      console.error('Error updating config:', error)
      alert('Failed to update configuration')
    }
  }

  const sendDownlink = async () => {
    try {
      const payload = {
        fPort: 2,
        data: Buffer.from([0x01, config.ledEnabled ? 0x01 : 0x00]).toString('base64')
      }

      await API.post('deviceApi', '/device/control', {
        body: {
          deviceId: '24E124707C141230',
          action: 'sendDownlink',
          payload
        }
      })
      alert('Downlink sent!')
    } catch (error) {
      console.error('Error sending downlink:', error)
      alert('Failed to send downlink')
    }
  }


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

  return (
    <main>
      <h1>My End devices</h1>
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
      <div>
      <h2>Device Configuration</h2>
      <div>
        <label>
          Measurement Interval (seconds):
          <input
            type="number"
            value={config.measurementInterval}
            onChange={(e) => setConfig({
              ...config,
              measurementInterval: parseInt(e.target.value)
            })}
          />
        </label>
      </div>
      <div>
        <label>
          Motion Sensitivity:
          <select
            value={config.motionSensitivity}
            onChange={(e) => setConfig({
              ...config,
              motionSensitivity: e.target.value
            })}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          LED Enabled:
          <input
            type="checkbox"
            checked={config.ledEnabled}
            onChange={(e) => setConfig({
              ...config,
              ledEnabled: e.target.checked
            })}
          />
        </label>
      </div>
      <button onClick={updateDeviceConfig}>Update Configuration</button>
      <button onClick={sendDownlink}>Send LED Command</button>
    </div>
    </main>
  );
}
