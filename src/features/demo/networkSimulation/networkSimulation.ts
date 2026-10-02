export type NetworkSimulationMode = "normal" | "slow";

const STORAGE_KEY = "roxies-pantry-network-simulation";

const SLOW_NETWORK_DELAY_MS = 1500;

export function getNetworkSimulationMode(): NetworkSimulationMode {
  const storedMode = localStorage.getItem(STORAGE_KEY);

  return storedMode === "slow" ? "slow" : "normal";
}

export function setNetworkSimulationMode(mode: NetworkSimulationMode) {
  localStorage.setItem(STORAGE_KEY, mode);
}

export function getNetworkSimulationDelay(): number {
  return getNetworkSimulationMode() === "slow" ? SLOW_NETWORK_DELAY_MS : 0;
}
