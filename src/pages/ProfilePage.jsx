import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./ProfilePage.module.css";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
const ProfilePage = () => {
  const { user, getAuthHeaders } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/address`, {
          headers: getAuthHeaders(),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message);
        }
        setAddresses(data.addresses || []);
      } catch (error) {
        console.log("Error fetching addresses: ", error.message);
        toast.error("Couldn't fetch addresses");
      }
    };
    fetchAddresses();
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
            </div>
          </div>
          <button onClick={handleEditProfile} className={styles.editButton}>
            Edit Profile
          </button>
        </div>

        {/* Addresses Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>📍 Saved Addresses</h2>
            <Link
              to="/address"
              state={{ from: "profile" }}
              className={styles.addButton}
            >
              + Add New Address
            </Link>
          </div>

          {addresses.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📍</div>
              <h3>No addresses saved</h3>
              <p>Add your first delivery address to make checkout faster</p>
              <Link
                to="/address"
                state={{ from: "profile" }}
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
