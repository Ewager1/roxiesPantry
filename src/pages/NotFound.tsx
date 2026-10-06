import { Link } from "react-router-dom";

import roxieCuriousBox from "../assets/roxie-curious-box.png";

import styles from "./NotFound.module.css";

export function NotFoundPage() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <img className={styles.image} src={roxieCuriousBox} alt="" />

        <p className={styles.errorCode}>404</p>

        <h1 className={styles.title}>We couldn&apos;t find that page</h1>

        <p className={styles.message}>
          Roxie looked everywhere, but there&apos;s nothing here.
        </p>

        <Link className={styles.catalogButton} to="/products">
          Return to catalog
        </Link>
      </div>
    </main>
  );
}
