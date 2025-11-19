import { useState, useEffect } from "react";
import api from "../../api/axios";
import ProductsList from "./ProductsList";
import OrderSummaryModal from "../orders/OrderSummaryModal";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderItems, setOrderItems] = useState([]);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await api.get("/products", { withCredentials: true });
        setProducts(response.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    fetchProducts();
  }, []);

  const handleAddToOrder = (product) => {
    setOrderItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.id);
      if (existing) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveItem = (id) => {
    setOrderItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleQuantityChange = (id, qty) => {
    setOrderItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, qty) } : item
      )
    );
  };

  const handleSubmitOrder = async () => {
    try {
      // contoh payload yang akan dikirim ke backend
      const payload = {
        items: orderItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      };

      console.log("Kirim ke backend:", payload);

      // await api.post("/orders", payload, { withCredentials: true });
      alert("Pesanan berhasil dikirim!");
      setOrderItems([]);
      setShowOrderModal(false);
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Gagal membuat pesanan!");
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen py-10">
      {/* Header */}
      <div className="w-[75%] mx-auto mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
          🛍️ Our Products
        </h1>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg py-2 px-4 pr-10 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.9 14.32a8 8 0 111.414-1.414l3.387 3.386a1 1 0 01-1.414 1.415l-3.387-3.387zM14 8a6 6 0 11-12 0 6 6 0 0112 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {/* Grid Produk */}
      <div className="w-[70%] mx-auto">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
            {filteredProducts.map((product) => (
              <ProductsList
                key={product.id}
                product={product}
                onAddToOrder={handleAddToOrder}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg mt-16">
            😕 Tidak ada produk yang ditemukan.
          </p>
        )}
      </div>

      {/* Tombol Buat Pesanan */}
      {orderItems.length > 0 && (
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => setShowOrderModal(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-green-700 active:scale-95 transition-all"
          >
            Buat Pesanan ({orderItems.length})
          </button>
        </div>
      )}

      {/* Modal Ringkasan Order */}
      {showOrderModal && (
        <OrderSummaryModal
          orderItems={orderItems}
          onClose={() => setShowOrderModal(false)}
          onRemoveItem={handleRemoveItem}
          onQuantityChange={handleQuantityChange}
          onSubmitOrder={handleSubmitOrder}
        />
      )}
    </div>
  );
}
