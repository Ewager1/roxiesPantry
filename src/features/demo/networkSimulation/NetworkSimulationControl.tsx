import { useState } from "react";

import {
  getNetworkSimulationMode,
  setNetworkSimulationMode,
  type NetworkSimulationMode,
} from "./networkSimulation";

import styles from "../components/DemoWorksite.module.css";

export function NetworkSimulationControl() {
  const [mode, setMode] = useState<NetworkSimulationMode>(
    getNetworkSimulationMode,
  );

  function changeMode(nextMode: NetworkSimulationMode) {
    setNetworkSimulationMode(nextMode);
    setMode(nextMode);
  }

  return (
    <div className={styles.controlGroup}>
      <span className={styles.controlLabel}>Network Speed</span>

      <div className={styles.toggle}>
        <button
          className={styles.toggleButton}
          type="button"
          disabled={mode === "normal"}
          onClick={() => changeMode("normal")}
        >
          Normal
        </button>

        <button
          className={styles.toggleButton}
          type="button"
          disabled={mode === "slow"}
          onClick={() => changeMode("slow")}
        >
          Slow
        </button>
      </div>
    </div>
  );
}
