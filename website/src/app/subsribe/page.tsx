"use client";

import { useState } from "react";
import axios from "axios";

export default function Subscribe() {
  const [email, setEmail] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/products");
      setProducts(response.data.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setMessage("Failed to fetch products.");
    }
  };

  const handleSubscribe = async () => {
    if (!selectedProduct) {
      setMessage("Please enter an email and select a product.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("/api/create-subscription", {
          productId: selectedProduct,
      });
      console.log(response.data);
      const { checkoutUrl } = response.data;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error("Error subscribing:", error.message);
      setMessage("Subscription failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h1 className="text-2xl text-white font-bold mb-4">Subscribe to a Product</h1>
      <button
        onClick={fetchProducts}
        className="bg-blue-500 text-white px-4 py-2 mb-4"
      >
        Fetch Products
      </button>
      <select
        value={selectedProduct}
        onChange={(e) => setSelectedProduct(e.target.value)}
        className="w-full mb-4 p-2 border"
      >
        <option value="">Select a Product</option>
        {products.map((product: any) => (
          <option key={product.id} value={product.id}>
            {product.attributes.name}
          </option>
        ))}
      </select>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="w-full mb-4 p-2 border"
      />
      <button
        onClick={handleSubscribe}
        disabled={loading}
        className={`w-full bg-green-500 text-white px-4 py-2 ${
          loading ? "opacity-50" : ""
        }`}
      >
        {loading ? "Subscribing..." : "Subscribe"}
      </button>
      {message && <p className="mt-4 text-white">{message}</p>}
    </div>
  );
}