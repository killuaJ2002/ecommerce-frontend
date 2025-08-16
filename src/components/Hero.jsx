import { useState, useEffect } from "react";
import styles from "./Hero.module.css";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Summer Sale Spectacular",
      subtitle: "Up to 70% off on electronics & gadgets",
      description:
        "Don't miss out on incredible deals across all categories. Limited time offer!",
      buttonText: "Shop Electronics",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop",
    },
    {
      id: 2,
      title: "New Arrivals",
      subtitle: "Latest trends in fashion & lifestyle",
      description:
        "Discover the newest collection of premium products curated just for you.",
      buttonText: "Explore Collection",
      background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      image:
        "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&h=400&fit=crop",
    },
    {
      id: 3,
      title: "Tech Revolution",
      subtitle: "Smart devices for modern living",
      description:
        "Experience the future with our cutting-edge technology and smart home solutions.",
      buttonText: "Shop Tech",
      background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      image:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className={styles.hero}>
      <div className={styles.heroContainer}>
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`${styles.slide} ${
              index === currentSlide ? styles.active : ""
            }`}
            style={{ background: slide.background }}
          >
            <div className={styles.slideContent}>
              <div className={styles.textContent}>
                <div className={styles.badge}>
                  <span>✨ Special Offer</span>
                </div>
                <h1 className={styles.title}>{slide.title}</h1>
                <h2 className={styles.subtitle}>{slide.subtitle}</h2>
                <p className={styles.description}>{slide.description}</p>
                <div className={styles.buttonGroup}>
                  <button className={styles.primaryButton}>
                    {slide.buttonText}
                    <span className={styles.buttonIcon}>→</span>
                  </button>
                  <button className={styles.secondaryButton}>Learn More</button>
                </div>
                <div className={styles.features}>
                  <div className={styles.feature}>
                    <span className={styles.featureIcon}>🚚</span>
                    <span>Free Delivery</span>
                  </div>
                  <div className={styles.feature}>
                    <span className={styles.featureIcon}>🔒</span>
                    <span>Secure Payment</span>
                  </div>
                  <div className={styles.feature}>
                    <span className={styles.featureIcon}>↩️</span>
                    <span>Easy Returns</span>
                  </div>
                </div>
              </div>
              <div className={styles.imageContent}>
                <div className={styles.imageContainer}>
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className={styles.heroImage}
                  />
                  <div className={styles.floatingCard}>
                    <div className={styles.cardContent}>
                      <span className={styles.discount}>50% OFF</span>
                      <span className={styles.cardText}>Today Only!</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Controls */}
        <button
          className={styles.navButton}
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          ❮
        </button>
        <button
          className={`${styles.navButton} ${styles.next}`}
          onClick={nextSlide}
          aria-label="Next slide"
        >
          ❯
        </button>

        {/* Slide Indicators */}
        <div className={styles.indicators}>
          {slides.map((_, index) => (
            <button
              key={index}
              className={`${styles.indicator} ${
                index === currentSlide ? styles.activeIndicator : ""
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className={styles.progressBar}>
          <div
            className={styles.progress}
            style={{
              transform: `translateX(${
                (currentSlide / slides.length) * 100 - 100
              }%)`,
            }}
          />
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className={styles.backgroundElements}>
        <div className={styles.floatingShape}></div>
        <div className={styles.floatingShape}></div>
        <div className={styles.floatingShape}></div>
      </div>
    </section>
  );
};

export default Hero;
