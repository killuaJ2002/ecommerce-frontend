import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./SignUpPage.module.css";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { signup, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/");
      return;
    }
  }, [isAuthenticated]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: [],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setIsLoading(true);

    try {
      const result = await signup(formData);

      if (result.success) {
        navigate("/");
      } else {
        const response = await fetch("http://localhost:8000/api/user/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const errorData = await response.json();

        if (errorData.errors && Array.isArray(errorData.errors)) {
          const groupedErrors = {};
          errorData.errors.forEach((error) => {
            const field = error.field;
            if (!groupedErrors[field]) {
              groupedErrors[field] = [];
            }
            groupedErrors[field].push(error.message);
          });
          setFieldErrors(groupedErrors);
        } else {
          setFieldErrors({
            general: [result.message || "Signup failed. Please try again."],
          });
        }
      }
    } catch (error) {
      console.log(error);
      setFieldErrors({
        general: ["An unexpected error occurred. Please try again."],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getInputClass = (fieldName) =>
    `${styles.input} ${
      fieldErrors[fieldName]?.length > 0 ? styles.inputError : ""
    }`;

  return (
    <div className={styles.signupPage}>
      <div className={styles.signupContainer}>
        <h3 className={styles.signupTitle}>Sign Up</h3>

        {fieldErrors.general && (
          <div className={styles.errorMessage}>
            {fieldErrors.general.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your Name"
              className={getInputClass("name")}
              disabled={isLoading}
            />
            {fieldErrors.name &&
              fieldErrors.name.map((error, index) => (
                <div key={index} className={styles.fieldError}>
                  {error}
                </div>
              ))}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={getInputClass("email")}
              disabled={isLoading}
            />
            {fieldErrors.email &&
              fieldErrors.email.map((error, index) => (
                <div key={index} className={styles.fieldError}>
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
              className={getInputClass("password")}
              disabled={isLoading}
            />
            {fieldErrors.password &&
              fieldErrors.password.map((error, index) => (
                <div key={index} className={styles.fieldError}>
                  {error}
                </div>
              ))}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className={getInputClass("confirmPassword")}
              disabled={isLoading}
            />
            {fieldErrors.confirmPassword &&
              fieldErrors.confirmPassword.map((error, index) => (
                <div key={index} className={styles.fieldError}>
                  {error}
                </div>
              ))}
          </div>

          <button
            type="submit"
            className={styles.signupButton}
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className={styles.extraLinks}>
          <Link to="/login">Existing user? Login</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
