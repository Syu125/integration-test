import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import CodeGenerator from "./code-generator/CodeGenerator";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <CodeGenerator></CodeGenerator>
    </div>
  );
}

export default App;
