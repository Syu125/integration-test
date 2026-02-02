import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { LiveProvider, LiveEditor, LivePreview, LiveError } from "react-live";

const socket = io("http://localhost:4000");

function App() {
  const [codeSnippet, setCodeSnippet] = useState("");

  useEffect(() => {
    // Listen for the event
    socket.on("new-code-arrival", (data: any) => {
      setCodeSnippet(data.content);
    });

    // CLEANUP: This must return a function or void
    return () => {
      socket.off("new-code-arrival");
    };
  }, []); // Empty dependency array ensures this only runs once
  return (
    <div style={{ padding: "20px" }}>
      <h1>Live Component Preview</h1>

      {codeSnippet ? (
        <LiveProvider code={codeSnippet} noInline={false}>
          <div
            style={{ display: "flex", gap: "20px", border: "1px solid #ddd" }}
          >
            {/* The Code View (Editable if you want) */}
            <div style={{ flex: 1, background: "#011627", padding: "10px" }}>
              <LiveEditor />
            </div>

            {/* THE ACTUAL RENDERED COMPONENT */}
            <div style={{ flex: 1, padding: "20px", background: "#fff" }}>
              <h3>Output:</h3>
              <LivePreview />
              <LiveError style={{ color: "red", fontSize: "12px" }} />
            </div>
          </div>
        </LiveProvider>
      ) : (
        <p>Waiting for code from App A...</p>
      )}
    </div>
  );
}

export default App;
