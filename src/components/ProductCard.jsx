import styles from "./Products.module.css";

const ProductCard = ({
  product,
  index,
  onQuickView,
  onAddToCart,
  onBuyNow,
  isAddingToCart = false,
}) => {
  return (
    <div
      key={product.id}
      className={styles.productCard}
      style={{ "--delay": `${index * 0.1}s` }}
    >
      {/* Stock Status Badges */}
      {product.stock === 0 && (
        <div className={styles.outOfStock}>Out of Stock</div>
      )}
      {product.stock > 0 && product.stock <= 5 && (
        <div className={styles.lowStock}>Low Stock</div>
      )}

      <div className={styles.imageContainer}>
        <img
          src={product.image}
          alt={product.name}
          className={styles.productImage}
          loading="lazy"
        />
        <div className={styles.imageOverlay}>
          <button
            className={styles.quickView}
            onClick={() => onQuickView(product.id)}
          >
            👁 Quick View
          </button>
        </div>
      </div>

      <div className={styles.productInfo}>
        <div className={styles.productHeader}>
          <h3 className={styles.productName}>{product.name}</h3>
        </div>

        <div className={styles.description}>
          <p>{product.description}</p>
        </div>

        <div className={styles.stockInfo}>
          <span className={styles.stockLabel}>Stock:</span>
          <span
            className={`${styles.stockValue} ${
              product.stock === 0
                ? styles.outOfStockText
                : product.stock <= 5
                ? styles.lowStockText
                : styles.inStockText
            }`}
          >
            {product.stock === 0
              ? "Out of Stock"
              : `${product.stock} available`}
          </span>
        </div>

        <div className={styles.priceSection}>
          <div className={styles.prices}>
            <span className={styles.currentPrice}>₹{product.price}</span>
          </div>
        </div>

        <div className={styles.actions}>
          {/* Buy Now button */}
          <button
            className={`${styles.addToCartBtn} ${
              product.stock === 0 ? styles.disabled : ""
            }`}
            disabled={product.stock === 0}
            onClick={() => onBuyNow(product)}
          >
            {product.stock === 0 ? "Out of Stock" : "Buy Now"}
          </button>

          {/* Add to Cart button with loading state */}
          {product.stock > 0 && (
            <button
              className={`${styles.cartBtn} ${
                isAddingToCart ? styles.loading : ""
              }`}
              aria-label="Add to Cart"
              title="Add to Cart"
              disabled={isAddingToCart} // Disable while loading
              onClick={() => onAddToCart(product)}
            >
              {isAddingToCart ? "⏳" : "🛒"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
