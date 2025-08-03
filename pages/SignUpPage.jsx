const SignUpPage = () => {
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
        <h3 style={styles.title}>Sign Up</h3>

        <div style={styles.formGroup}>
          <label htmlFor="name" style={styles.label}>
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter your Name"
            style={styles.input}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="email" style={styles.label}>
            Email
          </label>
          <input
            id="email"
            type="email"
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
            placeholder="Enter password"
            style={styles.input}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="confirmPassword" style={styles.label}>
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm password"
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
          Create Account
        </button>

        <div style={styles.linkContainer}>
          <a
            href="#"
            style={styles.link}
            onMouseEnter={handleLinkHover}
            onMouseLeave={handleLinkLeave}
          >
            Existing user? Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
