import { useState, useEffect } from "react";
import styles from "./Products.module.css";

const Products = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [favorites, setFavorites] = useState(new Set());
  const [animationTrigger, setAnimationTrigger] = useState(false);

  // Simplified categories - you can add category field to your Product model later if needed
  const categories = [
    { id: "all", name: "All Products", icon: "🏪" },
    { id: "electronics", name: "Electronics", icon: "📱" },
    { id: "accessories", name: "Accessories", icon: "🎧" },
    { id: "gadgets", name: "Gadgets", icon: "⌚" },
  ];

  // Sample products matching your database schema (id, name, description, price, stock)
  // In real app, you'd fetch this from your API
  const products = [
    {
      id: 1,
      name: "Wireless Headphones Pro",
      description:
        "Premium wireless headphones with noise cancellation and long battery life",
      price: 79.99,
      stock: 15,
      category: "electronics", // This would be added later to your schema
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    },
    {
      id: 2,
      name: "Smart Watch Series 8",
      description:
        "Advanced smartwatch with health monitoring and GPS tracking capabilities",
      price: 199.99,
      stock: 8,
      category: "gadgets",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    },
    {
      id: 3,
      name: "Aluminum Laptop Stand",
      description:
        "Ergonomic adjustable laptop stand made from premium aluminum",
      price: 49.99,
      stock: 22,
      category: "accessories",
      image:
        "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
    },
    {
      id: 4,
      name: "Premium Bluetooth Speaker",
      description:
        "High-quality portable speaker with 360-degree sound and waterproof design",
      price: 89.99,
      stock: 0, // Out of stock
      category: "electronics",
      image:
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
    },
    {
      id: 5,
      name: "Ergonomic Wireless Mouse",
      description:
        "Comfortable wireless mouse designed for extended use with silent clicks",
      price: 29.99,
      stock: 45,
      category: "accessories",
      image:
        "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&h=400&fit=crop",
    },
    {
      id: 6,
      name: "Multi-Port USB-C Hub",
      description:
        "Professional 8-in-1 USB-C hub with 4K support and fast data transfer",
      price: 59.99,
      stock: 12,
      category: "gadgets",
      image:
        "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=400&fit=crop",
    },
  ];

  const filteredProducts = products.filter(
    (product) => activeCategory === "all" || product.category === activeCategory
  );

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

  const toggleFavorite = (productId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

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
                />
                <div className={styles.imageOverlay}>
                  <button
                    className={styles.quickView}
                    onClick={() => console.log("Quick view:", product.id)}
                  >
                    👁 Quick View
                  </button>
                  <button
                    className={`${styles.favoriteBtn} ${
                      favorites.has(product.id) ? styles.favorited : ""
                    }`}
                    onClick={() => toggleFavorite(product.id)}
                  >
                    {favorites.has(product.id) ? "❤️" : "🤍"}
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
                      ${product.price}
                    </span>
                  </div>
                </div>

                <div className={styles.actions}>
                  <button
                    className={`${styles.addToCartBtn} ${
                      product.stock === 0 ? styles.disabled : ""
                    }`}
                    disabled={product.stock === 0}
                  >
                    <span className={styles.cartIcon}>🛒</span>
                    {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </button>
                  <button className={styles.compareBtn}>⚖️</button>
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
      </div>
    </section>
  );
};

export default Products;
