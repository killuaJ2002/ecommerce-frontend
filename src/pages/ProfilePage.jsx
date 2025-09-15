import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./ProfilePage.module.css";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const {
    user,
    getAuthHeaders,
    loading: authLoading,
    isAuthenticated,
  } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) {
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated()) {
      setLoading(false);
      setError("Please log in to view your profile");
      navigate("/login");
      return;
    }

    const fetchAddresses = async () => {
      try {
        const headers = getAuthHeaders();

        // Additional check to ensure we have proper headers
        if (!headers || !headers.Authorization) {
          throw new Error("Authentication required");
        }

        const res = await fetch(`${API_BASE_URL}/address`, {
          headers: headers,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || `HTTP error! status: ${res.status}`);
        }

        setAddresses(data.addresses || []);
        setError(null);
      } catch (error) {
        console.log("Error fetching addresses: ", error.message);
        setError(error.message);
        toast.error("Couldn't fetch addresses");
        // Don't clear addresses on error - keep existing ones if any
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [authLoading, isAuthenticated, getAuthHeaders, API_BASE_URL]);

  const handleEditProfile = () => {
    // Logic for editing profile
    console.log("Edit profile clicked");
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const headers = getAuthHeaders();

      const res = await fetch(`${API_BASE_URL}/address/${addressId}`, {
        method: "DELETE",
        headers: headers,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete address");
      }

      // Remove the address from local state
      setAddresses((prev) => prev.filter((addr) => addr.id !== addressId));
      toast.success("Address deleted successfully");
    } catch (error) {
      console.log("Error deleting address:", error.message);
      toast.error("Failed to delete address");
    }
  };

  const handleEditAddress = (addressId) => {
    // Logic for editing address - navigate to edit page
    console.log("Edit address:", addressId);
  };

  const handleBack = () => {
    // Check if there's a previous page in history, otherwise go to home
    if (location.state?.from) {
      navigate(location.state.from);
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  if (authLoading || loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error && error.includes("log in")) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <h2>Authentication Required</h2>
          <p>Please log in to view your profile</p>
          <Link to="/login" className={styles.retryButton}>
            Go to Login
          </Link>
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
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className={styles.userDetails}>
              <h1 className={styles.userName}>{user?.name || "User Name"}</h1>
              <p className={styles.userEmail}>
                {user?.email || "user@example.com"}
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

        {/* Back Button */}
        <div className={styles.backButtonContainer}>
          <button onClick={handleBack} className={styles.backButton}>
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
