import { useState, useEffect } from "react";
import io from "socket.io-client";

// Connect to the socket to receive pipeline logs
const socket = io("http://localhost:4000");

function CodeGenerator() {
  const [status, setStatus] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  useEffect(() => {
    // Listen for progress updates from the backend pipeline
    socket.on("pipeline-update", (message: string) => {
      setLogs((prev) => [...prev, `> ${message}`]);
    });

    // CLEANUP FUNCTION
    return () => {
      // Wrapping in braces ensures we return 'void', not the socket object
      socket.off("pipeline-update");
    };
  }, []);

  const runPipeline = async () => {
    setStatus("Pipeline Running...");
    setLogs(["Initializing Software Dev Pipeline..."]);

    try {
      const response = await fetch("http://localhost:4000/run-pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: "UserComponent.jsx",
          content: generatedComponent,
        }),
      });

      const data = await response.json();
      if (data.prUrl) {
        setStatus(`Success! View PR: ${data.prUrl}`);
        // Optional: Auto-open the link
        // window.open(data.prUrl, '_blank');
      }

      if (response.ok) {
        setStatus("Deployment Successful! ✅");
      }
    } catch (error) {
      setStatus("Pipeline Failed ❌");
    }
  };
  // This is the "Code" we want to send to the DB
  const generatedComponent = `
() => {
  // --- SUB-COMPONENT 1: Header ---
  const Header = ({ title }) => (
    <div style={{ 
      padding: '12px 20px', 
      background: '#1e1e1e', 
      color: '#00d8ff', 
      borderRadius: '8px 8px 0 0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #333'
    }}>
      <h4 style={{ margin: 0, letterSpacing: '1px', fontFamily: 'sans-serif' }}>{title}</h4>
      <div style={{ fontSize: '10px', background: '#00d8ff', color: '#1e1e1e', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
        LIVE
      </div>
    </div>
  );

  // --- SUB-COMPONENT 2: StatCard ---
  const StatCard = ({ label, value, trend }) => (
    <div style={{ 
      padding: '15px', 
      background: '#252526', 
      color: '#cccccc',
      border: '1px solid #333',
      borderRadius: '8px',
      flex: 1,
      fontFamily: 'sans-serif'
    }}>
      <div style={{ fontSize: '12px', marginBottom: '8px', color: '#888' }}>{label}</div>
      <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff' }}>{value}</div>
      <div style={{ fontSize: '11px', color: '#4ec9b0', marginTop: '5px' }}>
        {trend} since last sync
      </div>
    </div>
  );

  // --- MAIN COMPONENT STATE ---
  const [sessionClicks, setSessionClicks] = React.useState(0);

  return (
    <div style={{ 
      background: '#1e1e1e', 
      borderRadius: '8px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      overflow: 'hidden'
    }}>
      <Header title="SYSTEM MONITOR" />
      
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <StatCard label="ACTIVE FILES" value="3" trend="+1" />
          <StatCard label="INTERACTIONS" value={sessionClicks} trend="+100%" />
        </div>

        <div style={{ background: '#2d2d2d', padding: '15px', borderRadius: '6px', border: '1px solid #3d3d3d' }}>
          <p style={{ color: '#9cdcfe', margin: '0 0 10px 0', fontFamily: 'monospace', fontSize: '12px' }}>
            // Testing real-time state sync...
          </p>
          <button 
            onClick={() => setSessionClicks(prev => prev + 1)}
            style={{ 
              width: '100%', 
              padding: '12px', 
              background: '#007acc', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Update State
          </button>
        </div>
      </div>
    </div>
  );
}
`;

  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
      <div style={{ flex: 1, border: "1px solid black", padding: "20px" }}>
        <h2>App A: Code Studio</h2>
        <button onClick={runPipeline}>Run Build Pipeline</button>
        <p>Status: {status}</p>
        <pre
          style={{
            background: "#222",
            color: "#fff",
            padding: "10px",
            fontSize: "12px",
            overflow: "auto",
            textAlign: "left",
          }}
        >
          {generatedComponent}
        </pre>
      </div>
    </div>
  );
}

export default CodeGenerator;
