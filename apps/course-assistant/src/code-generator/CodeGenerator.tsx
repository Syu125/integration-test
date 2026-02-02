import { useState } from "react";

function CodeGenerator() {
  const [status, setStatus] = useState("");

  // This is the "Code" we want to send to the DB
  const generatedComponent = `
import React from 'react';

const NewComponent = () => {
  return (
    <div style={{ padding: '20px', background: '#f0f0f0' }}>
      <h1>Hello from the Database!</h1>
      <p>This component was generated in App A.</p>
    </div>
  );
};

export default NewComponent;
  `;

  const sendCodeToBackend = async () => {
    setStatus("Sending...");

    try {
      const response = await fetch("http://localhost:4000/save-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: "UserComponent.jsx",
          content: generatedComponent,
          language: "javascript",
        }),
      });

      if (response.ok) {
        setStatus("Code saved in Postgres and emitted to App B!");
      }
    } catch (error) {
      console.error("Error sending code:", error);
      setStatus("Failed to send.");
    }
  };

  return (
    <div style={{ border: "1px solid black", padding: "20px" }}>
      <h2>App A: Generator</h2>
      <button onClick={sendCodeToBackend}>Send React Component to DB</button>
      <p>Status: {status}</p>
      <pre style={{ background: "#222", color: "#fff", padding: "10px" }}>
        {generatedComponent}
      </pre>
    </div>
  );
}

export default CodeGenerator;
