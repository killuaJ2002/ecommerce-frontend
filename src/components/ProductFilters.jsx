import styles from "./Products.module.css";

const ProductFilters = ({
  categories,
  activeCategory,
  onCategoryChange,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.titleSection}>
          <span className={styles.badge}>🔥 Hot Deals</span>
          <h2>Featured Products</h2>
          <p>Discover our handpicked selection of premium products</p>
        </div>

        <div className={styles.controls}>
          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewButton} ${
                viewMode === "grid" ? styles.active : ""
              }`}
              onClick={() => onViewModeChange("grid")}
            >
              ⊞
            </button>
            <button
              className={`${styles.viewButton} ${
                viewMode === "list" ? styles.active : ""
              }`}
              onClick={() => onViewModeChange("list")}
            >
              ☰
            </button>
          </div>

          <select
            className={styles.sortSelect}
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
      </div>

      <div className={styles.categoryTabs}>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`${styles.categoryTab} ${
              activeCategory === category.id ? styles.active : ""
            }`}
            onClick={() => onCategoryChange(category.id)}
          >
            <span className={styles.categoryIcon}>{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductFilters;
