import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./CheckoutPage.module.css";

const CheckoutPage = () => {
  const [step, setStep] = useState(1);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [cart, setCart] = useState({});
  const { getAuthHeaders, loading: authLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    // If auth is still loading, wait
    if (authLoading) {
      return;
    }

    // If user is not authenticated, redirect to login
    if (!isAuthenticated()) {
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }

    const fetchCart = async () => {
      try {
        const headers = getAuthHeaders();

        const res = await fetch(`${API_BASE_URL}/cart`, {
          method: "GET",
          headers: headers,
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || `HTTP error! status: ${res.status}`);
        }
        setCart(data.cart);
      } catch (error) {
        console.log("Failed to fetch cart:", error.message);
        toast.error("Couldn't fetch cart");
      }
    };

    // fetch addresses from backend
    const fetchAddresses = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/address`, {
          headers: getAuthHeaders(),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message);
        }
        setAddresses(data.addresses || []);
      } catch (error) {
        console.log("Error fetching addresses: ", error.message);
        toast.error("Couldn't fetch addresses");
      }
    };
    fetchAddresses();
    fetchCart();
  }, [authLoading, isAuthenticated, navigate]);

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

  const handleAddressSelect = (addr) => {
    setSelectedAddress(addr);
  };

  return (
    <div className={styles.container}>
      {step === 1 && (
        <div className={styles.stepContainer}>
          <h2 className={styles.stepTitle}>Select Delivery Address</h2>

          {addresses.length === 0 ? (
            <div className={styles.emptyState}>
              No addresses found. Please add an address to continue.
            </div>
          ) : (
            <div className={styles.addressList}>
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`${styles.addressOption} ${
                    selectedAddress?.id === addr.id ? styles.selected : ""
                  }`}
                  onClick={() => handleAddressSelect(addr)}
                >
                  <input
                    type="radio"
                    name="address"
                    value={addr.id}
                    checked={selectedAddress?.id === addr.id}
                    onChange={() => handleAddressSelect(addr)}
                  />
                  <div className={styles.addressText}>
                    {addr.street}, {addr.zipCode}, {addr.city}, {addr.state}
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            className={styles.continueButton}
            disabled={!selectedAddress}
            onClick={() => setStep(2)}
          >
            Continue to Review Order
          </button>
        </div>
      )}

      {step === 2 && (
        <div className={styles.stepContainer}>
          <h2 className={styles.stepTitle}>Order Review</h2>

          <div className={styles.reviewSection}>
            <h3 className={styles.sectionTitle}>📍 Shipping Address</h3>
            <div className={styles.shippingAddress}>
              {selectedAddress?.street}, {selectedAddress?.zipCode},{" "}
              {selectedAddress?.city}, {selectedAddress?.state}
            </div>
          </div>

          <div className={styles.reviewSection}>
            <h3 className={styles.sectionTitle}>🛍️ Order Items</h3>
            <div className={styles.itemsList}>
              {cart?.items?.map((item) => (
                <div key={item.id} className={styles.itemRow}>
                  <div className={styles.itemDetails}>
                    {item.product.name} × {item.quantity}
                  </div>
                  <div className={styles.itemPrice}>
                    ₹{(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.priceSummary}>
            <h3 className={styles.sectionTitle}>💳 Price Summary</h3>

            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>
                Subtotal ({cart?.items?.length || 0} items)
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
              <span
                className={`${styles.summaryValue} ${
                  calculateShipping() === 0 ? styles.freeShipping : ""
                }`}
              >
                {calculateShipping() === 0
                  ? "FREE"
                  : formatPrice(calculateShipping())}
              </span>
            </div>

            <div className={`${styles.summaryRow} ${styles.total}`}>
              <span className={styles.summaryLabel}>Total Amount</span>
              <span className={styles.summaryValue}>
                {formatPrice(
                  calculateSubtotal() + calculateTax() + calculateShipping()
                )}
              </span>
            </div>
          </div>

          <button
            className={styles.placeOrderButton}
            onClick={() => {
              // Later call backend to place order
              toast.success("Order placed successfully!");
              alert("Order Placed!");
            }}
          >
            Place Order
          </button>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
