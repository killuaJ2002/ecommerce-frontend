import { useState, useEffect } from "react";
import styles from "./Products.module.css";

const Products = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [favorites, setFavorites] = useState(new Set());
  const [animationTrigger, setAnimationTrigger] = useState(false);

  const categories = [
    { id: "all", name: "All Products", icon: "🏪" },
    { id: "electronics", name: "Electronics", icon: "📱" },
    { id: "accessories", name: "Accessories", icon: "🎧" },
    { id: "gadgets", name: "Gadgets", icon: "⌚" },
  ];

  const products = [
    {
      id: 1,
      name: "Wireless Headphones Pro",
      category: "electronics",
      price: 79.99,
      originalPrice: 99.99,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
      rating: 4.8,
      reviews: 324,
      discount: 20,
      badge: "Best Seller",
      tags: ["Noise Cancelling", "24h Battery", "Fast Charge"],
      inStock: true,
      isNew: false,
      colors: ["#000000", "#ffffff", "#ff6b6b"],
    },
    {
      id: 2,
      name: "Smart Watch Series 8",
      category: "gadgets",
      price: 199.99,
      originalPrice: 249.99,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
      rating: 4.9,
      reviews: 189,
      discount: 20,
      badge: "Editor's Choice",
      tags: ["Health Monitor", "GPS", "Water Resistant"],
      inStock: true,
      isNew: true,
      colors: ["#000000", "#c0c0c0", "#ffd700"],
    },
    {
      id: 3,
      name: "Aluminum Laptop Stand",
      category: "accessories",
      price: 49.99,
      originalPrice: 69.99,
      image:
        "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
      rating: 4.6,
      reviews: 156,
      discount: 29,
      badge: "Limited Time",
      tags: ["Adjustable", "Cooling", "Portable"],
      inStock: true,
      isNew: false,
      colors: ["#c0c0c0", "#000000"],
    },
    {
      id: 4,
      name: "Premium Bluetooth Speaker",
      category: "electronics",
      price: 89.99,
      originalPrice: 119.99,
      image:
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
      rating: 4.7,
      reviews: 203,
      discount: 25,
      badge: "Trending",
      tags: ["360° Sound", "Waterproof", "15h Battery"],
      inStock: false,
      isNew: false,
      colors: ["#000000", "#ff6b6b", "#4facfe"],
    },
    {
      id: 5,
      name: "Ergonomic Wireless Mouse",
      category: "accessories",
      price: 29.99,
      originalPrice: 39.99,
      image:
        "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&h=400&fit=crop",
      rating: 4.4,
      reviews: 91,
      discount: 25,
      badge: "Value Pick",
      tags: ["Ergonomic", "Silent Click", "Long Range"],
      inStock: true,
      isNew: false,
      colors: ["#000000", "#ffffff", "#808080"],
    },
    {
      id: 6,
      name: "Multi-Port USB-C Hub",
      category: "gadgets",
      price: 59.99,
      originalPrice: 79.99,
      image:
        "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=400&fit=crop",
      rating: 4.5,
      reviews: 167,
      discount: 25,
      badge: "Professional",
      tags: ["8-in-1", "4K Support", "Fast Data"],
      inStock: true,
      isNew: true,
      colors: ["#c0c0c0", "#000000"],
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
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return b.isNew - a.isNew;
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

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className={styles.star}>
          ★
        </span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className={styles.halfStar}>
          ★
        </span>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className={styles.emptyStar}>
          ★
        </span>
      );
    }

    return stars;
  };

  return (
    <section className={styles.productsSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.titleSection}>
              <span className={styles.badge}>🔥 Hot Deals</span>
              <h2>Featured Products</h2>
              <p>
                Discover our handpicked selection of premium products with
                exclusive offers
              </p>
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
                <option value="rating">Top Rated</option>
                <option value="newest">Newest First</option>
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
              {!product.inStock && (
                <div className={styles.outOfStock}>Out of Stock</div>
              )}
              {product.isNew && <div className={styles.newBadge}>NEW</div>}
              {product.discount && (
                <div className={styles.discountBadge}>-{product.discount}%</div>
              )}
              {product.badge && (
                <div className={styles.specialBadge}>{product.badge}</div>
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
                  <div className={styles.colorOptions}>
                    {product.colors.map((color, i) => (
                      <div
                        key={i}
                        className={styles.colorDot}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className={styles.tags}>
                  {product.tags.slice(0, 2).map((tag, i) => (
                    <span key={i} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>

                <div className={styles.rating}>
                  <div className={styles.stars}>
                    {renderStars(product.rating)}
                  </div>
                  <span className={styles.ratingText}>{product.rating}</span>
                  <span className={styles.reviewCount}>
                    ({product.reviews} reviews)
                  </span>
                </div>

                <div className={styles.priceSection}>
                  <div className={styles.prices}>
                    <span className={styles.currentPrice}>
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className={styles.originalPrice}>
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                  {product.discount && (
                    <div className={styles.savings}>
                      Save ${(product.originalPrice - product.price).toFixed(2)}
                    </div>
                  )}
                </div>

                <div className={styles.actions}>
                  <button
                    className={`${styles.addToCartBtn} ${
                      !product.inStock ? styles.disabled : ""
                    }`}
                    disabled={!product.inStock}
                  >
                    <span className={styles.cartIcon}>🛒</span>
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
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
            Showing {sortedProducts.length} of 24 products
          </p>
        </div>
      </div>
    </section>
  );
};

export default Products;
