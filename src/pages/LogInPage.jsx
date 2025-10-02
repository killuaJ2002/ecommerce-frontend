import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import styles from "./LogInPage.module.css";

const LogInPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/");
      return;
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError("");
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://flopkart-backend.onrender.com/api/user/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const result = await login(formData);
        if (result.success) {
          navigate("/");
        } else {
          setGeneralError("Login failed. Please try again.");
        }
      } else {
        if (data.errors && Array.isArray(data.errors)) {
          const groupedErrors = {};
          data.errors.forEach((error) => {
            const field = error.field;
            if (!groupedErrors[field]) {
              groupedErrors[field] = [];
            }
            groupedErrors[field].push(error.message);
          });
          setFieldErrors(groupedErrors);
        } else {
          setGeneralError(data.message || "Login failed. Please try again.");
        }
      }
    } catch (error) {
      console.error(error);
      setGeneralError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: [] }));
    }
    if (generalError) {
      setGeneralError("");
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <h3 className={styles.loginTitle}>Login</h3>

        {generalError && (
          <div
            style={{ color: "red", marginBottom: "1rem", textAlign: "center" }}
          >
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              disabled={isLoading}
            />
            {fieldErrors.email?.map((error, index) => (
              <div key={index} style={{ color: "red", fontSize: "0.85rem" }}>
                {error}
              </div>
            ))}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              disabled={isLoading}
            />
            {fieldErrors.password?.map((error, index) => (
              <div key={index} style={{ color: "red", fontSize: "0.85rem" }}>
                {error}
              </div>
            ))}
          </div>

          <button
            type="submit"
            className={styles.loginButton}
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className={styles.extraLinks}>
          <Link to="/signup">Not a user? Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default LogInPage;
