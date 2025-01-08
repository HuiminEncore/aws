"use client";

import { useState, useEffect } from "react";
// import { generateClient } from "aws-amplify/data";
// import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import { PubSub } from "@aws-amplify/pubsub";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { fetchAuthSession } from "aws-amplify/auth";
import { IoTClient, AttachPolicyCommand } from "@aws-sdk/client-iot";

Amplify.configure(outputs);

// const client = generateClient<Schema>();
const pubsub = new PubSub({
  region: "eu-north-1",
  endpoint: "wss://a6c6d678fry48-ats.iot.eu-north-1.amazonaws.com/mqtt",
});

export default function App() {
  const [loraData, setLoraData] = useState<any>(null);

  // function listTodos() {
  //   client.models.Todo.observeQuery().subscribe({
  //     next: (data) => setTodos([...data.items]),
  //   });
  // }

  useEffect(() => {
    const attachIoTPolicy = async () => {
      try {
        const session = await fetchAuthSession();
        const identityId = session.identityId;

        const iotClient = new IoTClient({ region: "eu-north-1" });
        const command = new AttachPolicyCommand({
          policyName: "myIoTPolicy",
          target: identityId,
        });

        await iotClient.send(command);
        console.log("IoT policy attached successfully");
      } catch (error) {
        console.error("Error attaching IoT policy:", error);
      }
    };

    const setupSubscriptions = async () => {
      try {
        const subscription = await pubsub
          .subscribe({
            topics: ["lorawan/uplink"],
          })
          .subscribe({
            next: (data) => {
              console.log("Received LoRaWAN data:", data);
              setLoraData(data);
            },
            error: (error) => console.error("Subscription error:", error),
          });

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error setting up subscription:", error);
      }
    };

    attachIoTPolicy();
    setupSubscriptions();
    // listTodos();
  }, []);

  // function createTodo() {
  //   client.models.Todo.create({
  //     content: window.prompt("Todo content"),
  //   });
  // }

  return (
    <main>
      <div>
        <h1>Device</h1>
        {loraData && (
          <div>
            <h2>Latest LoRaWAN Data</h2>
            <pre>{JSON.stringify(loraData, null, 2)}</pre>
          </div>
        )}
      </div>
    </main>
  );
}
