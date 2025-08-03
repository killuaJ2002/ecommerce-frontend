import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const URL = "http://localhost:8000/api/users/login";
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      navigate("/");
    } catch (error) {
      console.log(error);
      setErrorMessage(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
    e.target.style.backgroundColor = "#2563eb";
  };

  const handleButtonLeave = (e) => {
    e.target.style.backgroundColor = "#3b82f6";
  };

  const handleLinkHover = (e) => {
    e.target.style.color = "#2563eb";
  };

  const handleLinkLeave = (e) => {
    e.target.style.color = "#3b82f6";
  };

  // Styles object moved to the bottom
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
      backgroundColor: "#3b82f6",
      color: "white",
      border: "none",
      borderRadius: "6px",
      fontSize: "1rem",
      fontWeight: "500",
      cursor: "pointer",
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
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h3 style={styles.title}>Login</h3>

        {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}

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
              style={styles.input}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
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
              style={styles.input}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </div>

          <button
            type="submit"
            style={styles.button}
            onMouseEnter={handleButtonHover}
            onMouseLeave={handleButtonLeave}
          >
            Sign In
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
