import React, { useState } from "react";
import { createRoot } from "react-dom/client";

function App() {
  const [screen, setScreen] = useState("home");

  if (screen === "home") {
    return (
      <div style={{ padding: 20 }}>
        <h1>Smart Caddie Loop</h1>
        <p>Simulate 3 holes → get a plan</p>
        <button onClick={() => setScreen("hole")}>
          Start simulation
        </button>
      </div>
    );
  }

  if (screen === "hole") {
    return (
      <div style={{ padding: 20 }}>
        <h2>Hole 1</h2>
        <p>Imagine your last round…</p>
        <button onClick={() => setScreen("summary")}>
          Finish
        </button>
      </div>
    );
  }

  if (screen === "summary") {
    return (
      <div style={{ padding: 20 }}>
        <h2>Round Summary</h2>
        <p>You struggle with approach shots</p>
        <button onClick={() => setScreen("plan")}>
          Create plan
        </button>
      </div>
    );
  }

  if (screen === "plan") {
    return (
      <div style={{ padding: 20 }}>
        <h2>Next Round Plan</h2>
        <p>Take +1 club and aim centre</p>
        <button onClick={() => setScreen("home")}>
          Restart
        </button>
      </div>
    );
  }
}

createRoot(document.getElementById("root")).render(<App />);
