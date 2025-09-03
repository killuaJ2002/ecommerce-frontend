import { useState, useEffect } from "react";
import ProductFilters from "./ProductFilters";
import ProductGrid from "./ProductGrid";
import LoadingStates from "./LoadingStates";
import LoadMore from "./LoadMore";
import styles from "./Products.module.css";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
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
  const [addingToCart, setAddingToCart] = useState(null);
  const { getAuthHeaders } = useAuth();

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
        const res = await fetch(`${API_BASE_URL}/product`, {
          signal: ac.signal,
        });
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

  const handleAddToCart = async (product) => {
    try {
      setAddingToCart(product.id);
      const id = product.id;
      const res = await fetch(`${API_BASE_URL}/cart`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          productId: id,
          quantity: 1,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      console.log("Item added to cart", data.cart);
      toast.success("Successfully added item to cart");
    } catch (error) {
      console.error("Failed to add to cart:", error.message);
      toast.error("Failed to add item to cart");
    } finally {
      setAddingToCart(null);
    }
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
              addingToCart={addingToCart}
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
