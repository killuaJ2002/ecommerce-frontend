import { useEffect, useState } from "react";
import styles from "./OrderPage.module.css";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { getAuthHeaders, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/order/my`, {
          method: "GET",
          headers: getAuthHeaders(),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Couldn't fetch order details");
        }
        setOrders(data.orders);
      } catch (error) {
        console.log("Error fetching orders: ", error.message);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [loading, getAuthHeaders]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateOrderTotal = (items) => {
    return items
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const getProductInitial = (name) => {
    return name.charAt(0).toUpperCase();
  };

  if (orders.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Your Orders</h1>
        </div>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📦</div>
          <h2 className={styles.emptyTitle}>No orders yet</h2>
          <p className={styles.emptyDescription}>
            When you place your first order, it will appear here.
          </p>
          <button className={styles.shopButton}>Start Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Your Orders</h1>
        <p className={styles.subtitle}>Manage and track your order history</p>
      </div>

      <div className={styles.ordersList}>
        {orders.map((order) => (
          <div key={order.id} className={styles.orderCard}>
            <div className={styles.orderHeader}>
              <div className={styles.orderInfo}>
                <div className={styles.orderMeta}>
                  <span className={styles.orderDate}>
                    {formatDate(order.createdAt)} at{" "}
                    {formatTime(order.createdAt)}
                  </span>
                  <span className={styles.orderStatus}>{order.status}</span>
                </div>
              </div>
            </div>

            <div className={styles.orderItems}>
              {order.items.map((item) => (
                <div key={item.id} className={styles.orderItem}>
                  <div className={styles.itemImage}>
                    <div className={styles.imagePlaceholder}>
                      {getProductInitial(item.product.name)}
                    </div>
                  </div>
                  <div className={styles.itemDetails}>
                    <h4 className={styles.itemName}>{item.product.name}</h4>
                    <p className={styles.itemDescription}>
                      {item.product.description}
                    </p>
                    <div className={styles.itemMeta}>
                      <span className={styles.itemQuantity}>
                        Qty: {item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.orderActions}>
              <button className={styles.actionButton}>View Details</button>
              <button className={styles.actionButton}>Track Order</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderPage;
