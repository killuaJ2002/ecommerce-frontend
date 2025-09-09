import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./ProfilePage.module.css";

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    joinedDate: "",
  });

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Placeholder for fetching user data
    // fetchUserData();
    // fetchAddresses();
    setLoading(false);
  }, []);

  const handleEditProfile = () => {
    // Logic for editing profile
    console.log("Edit profile clicked");
  };

  const handleDeleteAddress = (addressId) => {
    // Logic for deleting address
    console.log("Delete address:", addressId);
  };

  const handleEditAddress = (addressId) => {
    // Logic for editing address
    console.log("Edit address:", addressId);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <h2>Error Loading Profile</h2>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className={styles.retryButton}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.profileContainer}>
        {/* Profile Header */}
        <div className={styles.profileHeader}>
          <div className={styles.profileInfo}>
            <div className={styles.avatar}>
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className={styles.userDetails}>
              <h1 className={styles.userName}>{user.name || "User Name"}</h1>
              <p className={styles.userEmail}>
                {user.email || "user@example.com"}
              </p>
              <p className={styles.joinDate}>
                Member since {user.joinedDate || "January 2024"}
              </p>
            </div>
          </div>
          <button onClick={handleEditProfile} className={styles.editButton}>
            Edit Profile
          </button>
        </div>

        {/* User Details Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>📱 Contact Information</h2>
          <div className={styles.detailsCard}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Name:</span>
              <span className={styles.detailValue}>
                {user.name || "Not provided"}
              </span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Email:</span>
              <span className={styles.detailValue}>
                {user.email || "Not provided"}
              </span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Phone:</span>
              <span className={styles.detailValue}>
                {user.phone || "Not provided"}
              </span>
            </div>
          </div>
        </div>

        {/* Addresses Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>📍 Saved Addresses</h2>
            <Link to="/profile/addresses/add" className={styles.addButton}>
              + Add New Address
            </Link>
          </div>

          {addresses.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📍</div>
              <h3>No addresses saved</h3>
              <p>Add your first delivery address to make checkout faster</p>
              <Link
                to="/profile/addresses/add"
                className={styles.addFirstButton}
              >
                Add Your First Address
              </Link>
            </div>
          ) : (
            <div className={styles.addressesList}>
              {addresses.map((address) => (
                <div key={address.id} className={styles.addressCard}>
                  <div className={styles.addressContent}>
                    <div className={styles.addressText}>
                      <div className={styles.addressLine}>{address.street}</div>
                      <div className={styles.addressLine}>
                        {address.city}, {address.state} {address.zipCode}
                      </div>
                    </div>
                    {address.isDefault && (
                      <span className={styles.defaultBadge}>Default</span>
                    )}
                  </div>
                  <div className={styles.addressActions}>
                    <button
                      onClick={() => handleEditAddress(address.id)}
                      className={styles.actionButton}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(address.id)}
                      className={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Account Actions */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>⚙️ Account Settings</h2>
          <div className={styles.actionsGrid}>
            <Link to="/profile/orders" className={styles.actionCard}>
              <div className={styles.actionIcon}>📦</div>
              <h3>Order History</h3>
              <p>View your past orders and track current ones</p>
            </Link>
            <Link to="/profile/security" className={styles.actionCard}>
              <div className={styles.actionIcon}>🔒</div>
              <h3>Security</h3>
              <p>Change password and security settings</p>
            </Link>
            <Link to="/profile/preferences" className={styles.actionCard}>
              <div className={styles.actionIcon}>🎛️</div>
              <h3>Preferences</h3>
              <p>Manage your account preferences</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
