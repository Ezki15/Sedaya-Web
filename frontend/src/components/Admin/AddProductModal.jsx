import { useState } from "react";
import api from "../../api/axios";

export default function AddProductModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/products", form, { withCredentials: true });
      const newProduct = res.data.data;
      onSuccess(newProduct); // kirim data baru ke AdminPanel
      onClose();
    } catch (err) {
      alert("Gagal menambahkan produk");
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-white opacity-90 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-xl font-semibold mb-4">Tambah Produk</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="name"
            placeholder="Nama Produk"
            value={form.name}
            onChange={handleChange}
            className="border w-full p-2 rounded"
            required
          />
          <textarea
            name="description"
            placeholder="Deskripsi Produk"
            value={form.description}
            onChange={handleChange}
            className="border w-full p-2 rounded"
            rows={3}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Harga"
            value={form.price}
            onChange={handleChange}
            className="border w-full p-2 rounded"
            required
          />
          <input
            type="number"
            name="stock"
            placeholder="Stok"
            value={form.stock}
            onChange={handleChange}
            className="border w-full p-2 rounded"
            required
          />

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
