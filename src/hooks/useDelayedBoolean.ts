import { useEffect, useState } from "react";

export function useDelayedBoolean(value: boolean, delayMs = 200) {
  const [delayedValue, setDelayedValue] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(
      () => {
        setDelayedValue(value);
      },
      value ? delayMs : 0,
    );

    return () => {
      window.clearTimeout(timeout);
    };
  }, [value, delayMs]);

  // False is reflected immediately.
  // True only appears after the delay.
  return value && delayedValue;
}
