import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import styles from "./CartPage.module.css";
import { toast } from "react-toastify";

const CartPage = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [cart, setCart] = useState({});
  const [cartLoading, setCartLoading] = useState(false);
  const [error, setError] = useState("");
  const { getAuthHeaders, loading: authLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If auth is still loading, wait
    if (authLoading) {
      return;
    }

    // If user is not authenticated, redirect to login
    if (!isAuthenticated()) {
      navigate("/login", { state: { from: "/cart" } });
      return;
    }

    const fetchCart = async () => {
      try {
        setCartLoading(true);
        setError(""); // Clear previous errors
        console.log("inside fetchCart");

        const headers = getAuthHeaders();
        console.log("Auth headers:", headers); // Debug log

        const res = await fetch(`${API_BASE_URL}/cart`, {
          method: "GET",
          headers: headers,
        });

        console.log("Response status:", res.status); // Debug log
        console.log("after fetching");

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || `HTTP error! status: ${res.status}`);
        }

        console.log("logging cart");
        console.log(data.cart);
        setCart(data.cart);
      } catch (error) {
        console.log("Failed to fetch cart:", error.message);
        setError(error.message);
      } finally {
        setCartLoading(false);
      }
    };

    fetchCart();
  }, [authLoading, isAuthenticated, API_BASE_URL, navigate]); // Add navigate to dependencies

  const calculateTotal = () => {
    if (!cart.items) return 0;
    return cart.items.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  };

  const calculateSubtotal = () => {
    return calculateTotal();
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.18; // 18% tax
  };

  const calculateShipping = () => {
    return calculateSubtotal() > 500 ? 0 : 50; // Free shipping over ₹500
  };

  const formatPrice = (price) => {
    return `₹${price.toFixed(2)}`;
  };

  const getProductInitial = (name) => {
    return name.charAt(0).toUpperCase();
  };

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading authentication...</p>
        </div>
      </div>
    );
  }

  // Note: We don't need the authentication check here anymore
  // since we're redirecting in useEffect

  // Show error message if there's an error
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <div className={styles.errorMessage}>Error: {error}</div>
          <button
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show loading state while cart is loading
  if (cartLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading your cart...</p>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (!cart.items || cart.items.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <h2>Your Cart is Empty</h2>
          <p className={styles.emptyMessage}>
            Start adding some items to your cart to see them here!
          </p>
          <Link to="/" className={styles.continueShoppingLink}>
            ← Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const handleDeleteItem = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/cart/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      console.log(data.message);
      setCart((prevCart) => ({
        ...prevCart,
        items: prevCart.items?.filter((item) => item.id !== id) || [],
      }));
      toast.success("Item deleted from cart");
    } catch (error) {
      console.log("Error deleting item from cart: ", error.message);
      toast.error("Something went wrong");
    }
  };

  const handleDeleteCart = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/cart`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      console.log(data.message);
      setCart({});
      toast.success("Cart deleted successfully");
    } catch (error) {
      console.log("Error deleting cart: ", error.message);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Shopping Cart</h1>
        <p className={styles.itemCount}>
          {cart.items.length} {cart.items.length === 1 ? "item" : "items"} in
          your cart
        </p>
      </div>

      <div className={styles.cartLayout}>
        <div className={styles.cartItems}>
          {cart.items.map((item) => (
            <div key={item.id} className={styles.cartItem}>
              <div className={styles.productImage}>
                {getProductInitial(item.product.name)}
              </div>

              <div className={styles.productDetails}>
                <h3 className={styles.productName}>{item.product.name}</h3>
                <p className={styles.productDescription}>
                  {item.product.description}
                </p>
                <div className={styles.productMeta}>
                  <span className={styles.price}>
                    {formatPrice(item.product.price)}
                  </span>
                  <span className={styles.stock}>
                    {item.product.stock} in stock
                  </span>
                </div>
              </div>

              <div className={styles.quantitySection}>
                <div className={styles.quantityLabel}>Quantity</div>
                <div className={styles.quantity}>
                  <span className={styles.quantityBadge}>{item.quantity}</span>
                </div>
                <div className={styles.subtotal}>
                  {formatPrice(item.product.price * item.quantity)}
                </div>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteItem(item.id)}
                  title="Remove item from cart"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.cartSummary}>
          <h2 className={styles.summaryTitle}>Order Summary</h2>

          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>
              Subtotal ({cart.items.length} items)
            </span>
            <span className={styles.summaryValue}>
              {formatPrice(calculateSubtotal())}
            </span>
          </div>

          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Tax (18%)</span>
            <span className={styles.summaryValue}>
              {formatPrice(calculateTax())}
            </span>
          </div>

          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Shipping</span>
            <span className={styles.summaryValue}>
              {calculateShipping() === 0
                ? "FREE"
                : formatPrice(calculateShipping())}
            </span>
          </div>

          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Total</span>
            <span className={styles.totalValue}>
              {formatPrice(
                calculateSubtotal() + calculateTax() + calculateShipping()
              )}
            </span>
          </div>

          <button className={styles.checkoutButton}>Proceed to Checkout</button>
          <button
            className={styles.clearCartButton}
            onClick={() => handleDeleteCart()}
          >
            Clear Cart
          </button>
          <Link to="/" className={styles.continueShoppingLink}>
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
