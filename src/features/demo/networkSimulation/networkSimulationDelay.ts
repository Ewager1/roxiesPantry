import { getNetworkSimulationDelay } from "./networkSimulation";

export async function simulateNetworkDelay(): Promise<void> {
  const delay = getNetworkSimulationDelay();

  if (delay === 0) {
    return;
  }

  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, delay);
  });
}
