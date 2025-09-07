import { useState, useEffect } from "react";

const CheckoutPage = () => {
  const [step, setStep] = useState(1);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [cart, setCart] = useState([]); // fetch from backend/context

  useEffect(() => {
    // fetch addresses from backend
    const fetchAddresses = async () => {
      const res = await fetch("http://localhost:8000/api/address", {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      setAddresses(data.addresses || []);
    };
    fetchAddresses();
  }, []);

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
                {addr.name}, {addr.street}, {addr.city}, {addr.zip}
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
              {selectedAddress?.name}, {selectedAddress?.street},{" "}
              {selectedAddress?.city}, {selectedAddress?.zip}
            </p>
          </div>

          <div>
            <h3>Items:</h3>
            {cart.map((item) => (
              <div key={item.id}>
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div>Total: ₹{/* calculate subtotal here */}</div>

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
