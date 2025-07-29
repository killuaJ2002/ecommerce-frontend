import React from "react";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-4 text-2xl font-bold">
        Flopkart
      </header>
      <main className="p-4">
        <h2 className="text-xl font-semibold mb-4">Products</h2>
        {/* Product grid will go here */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Example product card */}
          <div className="bg-white p-4 rounded shadow">
            <img
              src="/src/assets/react.svg"
              alt="Product"
              className="h-24 mx-auto mb-2"
            />
            <h3 className="font-bold">React T-shirt</h3>
            <p className="text-gray-700 mb-2">$19.99</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded">
              Add to Cart
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
