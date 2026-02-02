import { useState } from "react";

function CodeGenerator() {
  const [status, setStatus] = useState("");

  // This is the "Code" we want to send to the DB
  const generatedComponent = `
() => {
  const [count, setCount] = React.useState(0);
  return (
    <div style={{ color: 'blue' }}>
      <h2>Dynamic Component!</h2>
      <button onClick={() => setCount(count + 1)}>
        Clicks: {count}
      </button>
    </div>
  );
}
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
