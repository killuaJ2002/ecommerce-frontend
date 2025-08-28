import styles from "./Products.module.css";

const LoadingStates = ({ loading, error }) => {
  if (loading) {
    return <p className={styles.resultsText}>Loading products…</p>;
  }

  if (error && !loading) {
    return <p className={styles.resultsText}>{error}</p>;
  }

  return null;
};

export default LoadingStates;
