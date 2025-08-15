import styles from "./Products.module.css";

const Products = () => {
  return (
    <section className={styles.products}>
      <h2>Our Products</h2>
      <div className={styles.grid}>
        <div className={styles.card}>
          <img src="/images/product1.jpg" alt="Product 1" />
          <h3>Product 1</h3>
          <p className={styles.price}>₹1,999</p>
          <button>Add to Cart</button>
        </div>

        <div className={styles.card}>
          <img src="/images/product2.jpg" alt="Product 2" />
          <h3>Product 2</h3>
          <p className={styles.price}>₹2,499</p>
          <button>Add to Cart</button>
        </div>

        <div className={styles.card}>
          <img src="/images/product3.jpg" alt="Product 3" />
          <h3>Product 3</h3>
          <p className={styles.price}>₹999</p>
          <button>Add to Cart</button>
        </div>

        <div className={styles.card}>
          <img src="/images/product4.jpg" alt="Product 4" />
          <h3>Product 4</h3>
          <p className={styles.price}>₹1,499</p>
          <button>Add to Cart</button>
        </div>
      </div>
    </section>
  );
};

export default Products;
