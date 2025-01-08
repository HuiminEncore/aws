import React, { useEffect, useState } from "react";
import "./device.css";
import { PubSub } from "@aws-amplify/pubsub";

interface Message {
  value: any;
}

const pubsub = new PubSub({
  region: "eu-north-1",
  endpoint: "wss://a6c6d678fry48-ats.iot.eu-north-1.amazonaws.com/mqtt",
});

const DeviceData: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Subscribe to LoRaWAN device topic
    const subscription = pubsub
      .subscribe({
        topics: ["lorawan/24E124707C141230/uplink"],
      })
      .subscribe({
        next: (data) => {
          setMessages((prevMessages) => [
            ...prevMessages,
            { value: data.value },
          ]);
        },
        error: (error) => console.error("Subscription error:", error),
      });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div>
      <h2>LoRaWAN Data</h2>
      <div>
        {messages.map((message, index) => (
          <div key={index} className="message-card">
            <pre>{JSON.stringify(message, null, 2)}</pre>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeviceData;
