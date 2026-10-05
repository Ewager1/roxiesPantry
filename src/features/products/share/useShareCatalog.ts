import { useCallback, useEffect, useRef, useState } from "react";

type ShareStatus = "idle" | "shared" | "copied" | "error";

const FEEDBACK_DURATION_MS = 2000;

export function useShareCatalog() {
  const [status, setStatus] = useState<ShareStatus>("idle");

  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const showTemporaryStatus = useCallback((nextStatus: ShareStatus) => {
    setStatus(nextStatus);

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setStatus("idle");
    }, FEEDBACK_DURATION_MS);
  }, []);

  const shareCatalog = useCallback(async () => {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Roxie's Pantry",
          text: "Check out this product list.",
          url,
        });

        showTemporaryStatus("shared");
        return;
      }

      await navigator.clipboard.writeText(url);

      showTemporaryStatus("copied");
    } catch (error) {
      // Closing the native share dialog is not
      // really an application error.
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      showTemporaryStatus("error");
    }
  }, [showTemporaryStatus]);

  return {
    shareCatalog,
    status,
  };
}
