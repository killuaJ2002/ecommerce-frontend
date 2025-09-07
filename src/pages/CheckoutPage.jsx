import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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

  return (
    <div>
      {step === 1 && (
        <div>
          <h2>Select Address</h2>
          {addresses.map((addr) => (
            <div key={addr.id}>
              <label>
                <input
                  type="radio"
                  name="address"
                  value={addr.id}
                  onChange={() => setSelectedAddress(addr)}
                />
                {addr.street}, {addr.zipCode}, {addr.city}, {addr.state}
              </label>
            </div>
          ))}

          <button disabled={!selectedAddress} onClick={() => setStep(2)}>
            Continue to Review
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2>Order Review</h2>
          <div>
            <h3>Shipping Address:</h3>
            <p>
              {selectedAddress?.street}, {selectedAddress?.zipCode},{" "}
              {selectedAddress?.city}, {selectedAddress?.state}
            </p>
          </div>

          <div>
            <h3>Items:</h3>
            {cart?.items?.map((item) => (
              <div key={item.id}>
                <span>
                  {item.product.name} x {item.quantity}
                </span>
                <span>₹{item.product.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div>
            <h3>Price Summary</h3>
            <div>
              <span>Subtotal ({cart.items.length} items)</span>
              <span>{formatPrice(calculateSubtotal())}</span>
            </div>
            <div>
              <span>Tax (18%)</span>
              <span>{formatPrice(calculateTax())}</span>
            </div>
            <div>
              <span>Shipping</span>
              <span>
                {calculateShipping() === 0
                  ? "FREE"
                  : formatPrice(calculateShipping())}
              </span>
            </div>
            <div>
              <span>Total</span>
              <span>
                {formatPrice(
                  calculateSubtotal() + calculateTax() + calculateShipping()
                )}
              </span>
            </div>
          </div>

          <button
            onClick={() => alert("Order Placed!")} // later call backend
          >
            Place Order
          </button>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
