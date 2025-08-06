import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError("");
    setIsLoading(true);

    try {
      // Make direct API call to get detailed error information
      const response = await fetch("http://localhost:8000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Success - now use AuthContext to set the auth state
        const result = await login(formData);
        if (result.success) {
          navigate("/");
        } else {
          // This shouldn't happen if our API call succeeded, but handle just in case
          setGeneralError("Login failed. Please try again.");
        }
      } else {
        // Handle different types of errors
        if (data.errors && Array.isArray(data.errors)) {
          // Zod validation errors - show under input fields
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
          // Non-Zod errors (like "Invalid credentials") - show at top
          setGeneralError(data.message || "Login failed. Please try again.");
        }
      }
    } catch (error) {
      console.log(error);
      setGeneralError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: [],
      }));
    }

    // Clear general error when user starts typing
    if (generalError) {
      setGeneralError("");
    }
  };

  const handleInputFocus = (e) => {
    e.target.style.outline = "none";
    e.target.style.borderColor = "#3b82f6";
    e.target.style.boxShadow = "0 0 0 2px rgba(59, 130, 246, 0.1)";
  };

  const handleInputBlur = (e) => {
    e.target.style.borderColor = "#d1d5db";
    e.target.style.boxShadow = "none";
  };

  const handleButtonHover = (e) => {
    if (!isLoading) {
      e.target.style.backgroundColor = "#2563eb";
    }
  };

  const handleButtonLeave = (e) => {
    if (!isLoading) {
      e.target.style.backgroundColor = "#3b82f6";
    }
  };

  const handleLinkHover = (e) => {
    e.target.style.color = "#2563eb";
  };

  const handleLinkLeave = (e) => {
    e.target.style.color = "#3b82f6";
  };

  // Helper function to get input style with error state
  const getInputStyle = (fieldName) => ({
    ...styles.input,
    borderColor: fieldErrors[fieldName]?.length > 0 ? "#dc2626" : "#d1d5db",
  });

  // Styles object
  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#f9fafb",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "3rem 1rem",
      fontFamily: "system-ui, -apple-system, sans-serif",
    },
    card: {
      maxWidth: "400px",
      width: "100%",
      backgroundColor: "white",
      padding: "2rem",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    title: {
      fontSize: "2rem",
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: "2rem",
      color: "#1f2937",
      margin: "0 0 2rem 0",
    },
    errorMessage: {
      backgroundColor: "#fef2f2",
      color: "#dc2626",
      padding: "0.75rem",
      borderRadius: "6px",
      fontSize: "0.875rem",
      marginBottom: "1.5rem",
      border: "1px solid #fecaca",
      textAlign: "center",
    },
    formGroup: {
      marginBottom: "1.5rem",
    },
    label: {
      display: "block",
      fontSize: "0.875rem",
      fontWeight: "500",
      color: "#374151",
      marginBottom: "0.5rem",
    },
    input: {
      width: "100%",
      padding: "0.75rem",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      fontSize: "1rem",
      transition: "all 0.2s",
      boxSizing: "border-box",
    },
    button: {
      width: "100%",
      padding: "0.75rem",
      backgroundColor: isLoading ? "#9ca3af" : "#3b82f6",
      color: "white",
      border: "none",
      borderRadius: "6px",
      fontSize: "1rem",
      fontWeight: "500",
      cursor: isLoading ? "not-allowed" : "pointer",
      transition: "background-color 0.2s",
    },
    linkContainer: {
      textAlign: "center",
      marginTop: "1.5rem",
    },
    link: {
      color: "#3b82f6",
      textDecoration: "none",
      fontSize: "0.875rem",
      transition: "color 0.2s",
    },
    fieldError: {
      color: "#dc2626",
      fontSize: "0.75rem",
      marginTop: "0.25rem",
      lineHeight: "1.2",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h3 style={styles.title}>Login</h3>

        {generalError && <div style={styles.errorMessage}>{generalError}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              style={getInputStyle("email")}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              disabled={isLoading}
            />
            {fieldErrors.email &&
              fieldErrors.email.map((error, index) => (
                <div key={index} style={styles.fieldError}>
                  {error}
                </div>
              ))}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              style={getInputStyle("password")}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              disabled={isLoading}
            />
            {fieldErrors.password &&
              fieldErrors.password.map((error, index) => (
                <div key={index} style={styles.fieldError}>
                  {error}
                </div>
              ))}
          </div>

          <button
            type="submit"
            style={styles.button}
            onMouseEnter={handleButtonHover}
            onMouseLeave={handleButtonLeave}
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div style={styles.linkContainer}>
          <Link
            to="/signup"
            style={styles.link}
            onMouseEnter={handleLinkHover}
            onMouseLeave={handleLinkLeave}
          >
            Not a user? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
