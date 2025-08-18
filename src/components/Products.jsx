import { useState, useEffect } from "react";
import styles from "./Products.module.css";

const API_URL = "http://localhost:8000/api/products";
const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop";

const guessCategory = (name = "") => {
  const n = name.toLowerCase();
  if (
    /(mouse|keyboard|headset|charger|hard drive|ssd|hdd|laptop|monitor)/.test(n)
  )
    return "electronics";
  if (/(cable|case|cover|strap|stand|adapter)/.test(n)) return "accessories";
  return "gadgets";
};

const Products = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [animationTrigger, setAnimationTrigger] = useState(false);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Categories
  const categories = [
    { id: "all", name: "All Products", icon: "🏪" },
    { id: "electronics", name: "Electronics", icon: "📱" },
    { id: "accessories", name: "Accessories", icon: "🎧" },
    { id: "gadgets", name: "Gadgets", icon: "⌚" },
  ];

  // Fetch products from API
  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(API_URL, { signal: ac.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        // Normalize: add generic image + category
        const normalized = (data?.products || []).map((p) => ({
          ...p,
          image: DEFAULT_IMAGE,
          category: p.category || guessCategory(p.name),
        }));

        setProducts(normalized);
      } catch (e) {
        if (e.name !== "AbortError") setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, []);

  // Filter by category
  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  useEffect(() => {
    setAnimationTrigger(true);
    const timer = setTimeout(() => setAnimationTrigger(false), 100);
    return () => clearTimeout(timer);
  }, [activeCategory, sortBy]);

  return (
    <section className={styles.productsSection}>
      <div className={styles.container}>
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
                  onClick={() => setViewMode("grid")}
                >
                  ⊞
                </button>
                <button
                  className={`${styles.viewButton} ${
                    viewMode === "list" ? styles.active : ""
                  }`}
                  onClick={() => setViewMode("list")}
                >
                  ☰
                </button>
              </div>

              <select
                className={styles.sortSelect}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
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
                onClick={() => setActiveCategory(category.id)}
              >
                <span className={styles.categoryIcon}>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Loading & Error states */}
        {loading && <p className={styles.resultsText}>Loading products…</p>}
        {error && !loading && <p className={styles.resultsText}>{error}</p>}

        {!loading && !error && (
          <>
            <div
              className={`${styles.productsGrid} ${styles[viewMode]} ${
                animationTrigger ? styles.animate : ""
              }`}
            >
              {sortedProducts.map((product, index) => (
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
                        onClick={() => console.log("Quick view:", product.id)}
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
                        <span className={styles.currentPrice}>
                          ₹{product.price}
                        </span>
                      </div>
                    </div>

                    <div className={styles.actions}>
                      {/* 1) First button -> Buy Now (text), keep same disabled logic */}
                      <button
                        className={`${styles.addToCartBtn} ${
                          product.stock === 0 ? styles.disabled : ""
                        }`}
                        disabled={product.stock === 0}
                      >
                        {product.stock === 0 ? "Out of Stock" : "Buy Now"}
                      </button>

                      {/* 2) Second button -> icon-only Add to Cart (no text) */}
                      {product.stock > 0 && (
                        <button
                          className={`${styles.cartBtn}`}
                          aria-label="Add to Cart"
                          title="Add to Cart"
                        >
                          🛒
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.loadMore}>
              <button className={styles.loadMoreBtn}>
                Load More Products
                <span className={styles.loadIcon}>↓</span>
              </button>
              <p className={styles.resultsText}>
                Showing {sortedProducts.length} products
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Products;
