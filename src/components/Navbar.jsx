import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";

const Navbar = ({ isAuthenticated, handleLogout, cartCount = 0 }) => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.navbar_left}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoIcon}>🛒</span>
            <span className={styles.logoText}>FlopKart</span>
          </Link>
        </div>

        <div className={styles.navbar_center}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search for products, brands and more..."
              className={styles.searchInput}
            />
            <button className={styles.searchButton}>
              <span className={styles.searchIcon}>🔍</span>
            </button>
          </div>
        </div>

        <div className={styles.navbar_right}>
          <Link className={styles.navLink} to="/order">
            <span className={styles.navIcon}>📦</span>
            <span>Orders</span>
          </Link>

          <Link className={styles.navLink} to="/cart">
            <span className={styles.navIcon}>🛍️</span>
            <span>Cart</span>
            {cartCount > 0 && (
              <span className={styles.cartBadge}>{cartCount}</span>
            )}
          </Link>

          {isAuthenticated && isAuthenticated() ? (
            <div className={styles.userMenu}>
              <button className={styles.userButton}>
                <span className={styles.userIcon}>👤</span>
                <span>Account</span>
              </button>
              <div className={styles.dropdown}>
                <Link to="/profile" className={styles.dropdownItem}>
                  Profile
                </Link>
                <Link to="/settings" className={styles.dropdownItem}>
                  Settings
                </Link>
                <button onClick={handleLogout} className={styles.dropdownItem}>
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link className={styles.loginButton} to="/login">
              <span className={styles.navIcon}>🔐</span>
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
