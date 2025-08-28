import { useState, useEffect } from "react";
import ProductFilters from "./ProductFilters";
import ProductGrid from "./ProductGrid";
import LoadingStates from "./LoadingStates";
import LoadMore from "./LoadMore";
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

  // Animation trigger for category/sort changes
  useEffect(() => {
    setAnimationTrigger(true);
    const timer = setTimeout(() => setAnimationTrigger(false), 100);
    return () => clearTimeout(timer);
  }, [activeCategory, sortBy]);

  // Event handlers
  const handleQuickView = (productId) => {
    console.log("Quick view:", productId);
  };

  const handleAddToCart = (product) => {
    console.log("Add to cart:", product);
  };

  const handleBuyNow = (product) => {
    console.log("Buy now:", product);
  };

  const handleLoadMore = () => {
    console.log("Load more products");
  };

  return (
    <section className={styles.productsSection}>
      <div className={styles.container}>
        <ProductFilters
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        <LoadingStates loading={loading} error={error} />

        {!loading && !error && (
          <>
            <ProductGrid
              products={sortedProducts}
              viewMode={viewMode}
              animationTrigger={animationTrigger}
              onQuickView={handleQuickView}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />

            <LoadMore
              productCount={sortedProducts.length}
              onLoadMore={handleLoadMore}
            />
          </>
        )}
      </div>
    </section>
  );
};

export default Products;
