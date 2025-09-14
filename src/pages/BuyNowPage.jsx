import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./BuyNowPage.module.css";

const BuyNowPage = () => {
  const [step, setStep] = useState(1);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { getAuthHeaders, loading: authLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const location = useLocation();
  const { product } = location?.state;

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
  }, [authLoading, isAuthenticated, navigate]);

  const calculateSubtotal = () => {
    return product.price * quantity;
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

  const handlePlaceOrder = async () => {
    try {
      const productId = product.id;
      const items = [{ productId, quantity }];
      const res = await fetch(`${API_BASE_URL}/order`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      toast.success("Order Placed successfully");
      navigate("/");
    } catch (error) {
      console.log("Error placing the order: ", error.message);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className={styles.container}>
      {step === 1 && (
        <div className={styles.stepContainer}>
          <h2 className={styles.stepTitle}>Select Delivery Address</h2>

          {addresses.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateIcon}>📍</div>
              <h3 className={styles.emptyStateTitle}>No addresses found</h3>
              <p className={styles.emptyStateText}>
                Please add a delivery address to continue with your order.
              </p>
              <Link
                className={styles.addAddressButton}
                to="/address"
                state={{ from: "checkout" }}
              >
                Add New Address
              </Link>
            </div>
          ) : (
            <>
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

              <div className={styles.addressActions}>
                <Link
                  to="/address"
                  state={{ from: "checkout" }}
                  className={styles.addAddressSecondaryButton}
                >
                  + Add New Address
                </Link>
              </div>
            </>
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
              <div key={product.id} className={styles.itemRow}>
                <div className={styles.itemDetails}>{product.name} × 1</div>
                <div className={styles.itemPrice}>
                  ₹{(product.price * quantity).toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.priceSummary}>
            <h3 className={styles.sectionTitle}>💳 Price Summary</h3>

            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>
                Subtotal ({quantity} items)
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
              handlePlaceOrder();
            }}
          >
            Place Order
          </button>
        </div>
      )}
    </div>
  );
};

export default BuyNowPage;
