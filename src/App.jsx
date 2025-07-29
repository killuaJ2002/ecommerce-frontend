import React, { useEffect, useState } from "react";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  // Fetch products from backend API and extract products array
  useEffect(() => {
    fetch("http://localhost:8000/api/products")
      .then((res) => res.json())
      .then((data) =>
        setProducts(Array.isArray(data.products) ? data.products : [])
      )
      .catch(() => setProducts([]));
  }, []);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <span className="text-2xl font-bold">Flopkart</span>
        <span className="bg-white text-blue-600 px-3 py-1 rounded font-semibold">
          Cart: {cart.length}
        </span>
      </header>
      <main className="p-4">
        <h2 className="text-xl font-semibold mb-4">Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.length === 0 ? (
            <p className="col-span-3 text-center text-gray-500">
              No products found.
            </p>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="bg-white p-4 rounded shadow flex flex-col items-center"
              >
                <img
                  src={product.image || "/src/assets/react.svg"}
                  alt={product.name}
                  className="h-24 mb-2"
                />
                <h3 className="font-bold">{product.name}</h3>
                <p className="text-gray-700 mb-2">₹{product.price}</p>
                <p className="text-xs text-gray-500 mb-2">
                  {product.description}
                </p>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded mt-auto"
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
