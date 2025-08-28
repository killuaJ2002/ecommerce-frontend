import styles from "./Products.module.css";

const LoadMore = ({ productCount, onLoadMore }) => {
  return (
    <div className={styles.loadMore}>
      <button className={styles.loadMoreBtn} onClick={onLoadMore}>
        Load More Products
        <span className={styles.loadIcon}>↓</span>
      </button>
      <p className={styles.resultsText}>Showing {productCount} products</p>
    </div>
  );
};

export default LoadMore;
