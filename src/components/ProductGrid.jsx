import ProductCard from "./ProductCard";
import styles from "./Products.module.css";

const ProductGrid = ({
  products,
  viewMode,
  animationTrigger,
  onQuickView,
  onAddToCart,
  onBuyNow,
  addingToCart,
}) => {
  return (
    <div
      className={`${styles.productsGrid} ${styles[viewMode]} ${
        animationTrigger ? styles.animate : ""
      }`}
    >
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          index={index}
          onQuickView={onQuickView}
          onAddToCart={onAddToCart}
          onBuyNow={onBuyNow}
          isAddingToCart={addingToCart === product.id}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
