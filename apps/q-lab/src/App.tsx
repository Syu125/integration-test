import React, { useEffect, useState } from "react";
import io from "socket.io-client";

// Connect to the backend
const socket = io("http://localhost:4000");

function App() {
  const [codeSnippet, setCodeSnippet] = useState("Waiting for code...");
  const [status, setStatus] = useState("Connecting...");

  useEffect(() => {
    // Check if we are actually connected
    socket.on("connect", () => {
      setStatus("Connected to Backend ✅");
      console.log("Connected with ID:", socket.id);
    });

    // LISTENER: Must match the io.emit name in server.js exactly
    socket.on("new-code-arrival", (data) => {
      console.log("🚀 Data received in App B:", data);
      setCodeSnippet(data.content);
    });

    return () => {
      socket.off("connect");
      socket.off("new-code-arrival");
    };
  }, []);

  useEffect(() => {
    // Fetch the last saved snippet from Postgres on load
    fetch("http://localhost:4000/snippets")
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) setCodeSnippet(data[0].content);
      });
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h1>App B: Receiver</h1>
      <p>
        Status: <strong>{status}</strong>
      </p>

      <div
        style={{
          background: "#282c34",
          color: "white",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <h3>Latest Code from DB:</h3>
        <pre>{codeSnippet}</pre>
      </div>
    </div>
  );
}

export default App;
