import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./AddressPage.module.css";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const AddressPage = () => {
  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const { isAuthenticated, getAuthHeaders } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, [isAuthenticated]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/address`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      toast.success("Address added");
      const from = location.state?.from;
      if (from === "checkout") {
        navigate("/checkout");
      } else if (from === "profile") {
        navigate("/profile");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log("Error while saving address: ", error.message);
      toast.error("Something went wrong");
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    const from = location.state?.from;
    if (from === "checkout") {
      navigate("/checkout");
    } else if (from === "profile") {
      navigate("/profile");
    } else {
      navigate("/");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.header}>
          <p className={styles.subtitle}>
            Enter your delivery address details below
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="street" className={styles.label}>
              Street Address *
            </label>
            <input
              type="text"
              id="street"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Enter your street address"
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="city" className={styles.label}>
                City *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter city"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="state" className={styles.label}>
                State *
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter state"
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="zipCode" className={styles.label}>
              ZIP Code *
            </label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Enter ZIP code"
              required
            />
          </div>

          <div className={styles.buttonGroup}>
            <button
              onClick={(e) => handleCancel(e)}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button type="submit" className={styles.saveButton}>
              Save Address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressPage;
