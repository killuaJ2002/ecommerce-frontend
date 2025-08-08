import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "./HomePage.module.css";
const HomePage = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Navbar */}
      <div className={styles.navbar}>
        <div className={styles.navbar_left}>FlopKart</div>
        <div className={styles.navbar_right}>
          <Link className={styles.navLink}>Orders</Link>
          <Link className={styles.navLink}>Cart</Link>
          {isAuthenticated() ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <Link className={styles.navLink} to="/login">
              Login
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;
