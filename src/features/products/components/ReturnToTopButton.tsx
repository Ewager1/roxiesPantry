import { useEffect, useState } from "react";

import styles from "./ReturnToTopButton.module.css";

const SHOW_AFTER_PX = 700;

export function ReturnToTopButton() {
  const [isVisible, setIsVisible] = useState(
    () => typeof window !== "undefined" && window.scrollY > SHOW_AFTER_PX,
  );

  useEffect(() => {
    function handleScroll() {
      setIsVisible(window.scrollY > SHOW_AFTER_PX);
    }

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  function handleClick() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <button
      type="button"
      className={styles.button}
      onClick={handleClick}
      aria-label="Return to top"
    >
      ↑<span>Top</span>
    </button>
  );
}
