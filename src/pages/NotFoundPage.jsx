import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";
import styles from "./NotFoundPage.module.css";

const NotFoundPage = () => {
  return (
    <section className={styles.container}>
      <FaExclamationTriangle className={styles.icon} />
      <h1 className={styles.title}>404 Not Found</h1>
      <p className={styles.description}>This page does not exist</p>
      <Link to="/" className={styles.backButton}>
        Go Back
      </Link>
    </section>
  );
};

export default NotFoundPage;
