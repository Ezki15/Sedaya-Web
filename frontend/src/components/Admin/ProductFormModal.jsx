import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function ProductFormModal({
  onClose,
  onSuccessAdd,
  onSuccessUpdate,
  isEdit,
  editingProduct,
}) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: null, // tambahkan field untuk file
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (isEdit && editingProduct) {
      setForm({
        name: editingProduct.name || "",
        description: editingProduct.description || "",
        price: editingProduct.price || "",
        stock: editingProduct.stock || "",
        image: null,
      });
    }
  }, [isEdit, editingProduct]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("stock", form.stock);
      // jika user upload gambar baru → kirim file baru
      if (form.image) {
        formData.append("image", form.image);
      } else {
        // jika tidak upload baru → kirim nama file lama
        formData.append("oldImage", editingProduct.image);
      }

      let res;
      if (isEdit && editingProduct) {
        res = await api.put(`/products/${editingProduct.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        onSuccessUpdate(res.data.data);
        setMessage({ type: "success", text: "Produk berhasil diperbarui!" });
      } else {
        res = await api.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        // console.log(res.data.data);
        onSuccessAdd(res.data.data);
        setMessage({ type: "success", text: "Produk berhasil ditambahkan!" });
      }

      setTimeout(() => onClose(), 1000);
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: isEdit
          ? "Gagal memperbarui produk."
          : "Gagal menambahkan produk.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] relative">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {isEdit ? "Edit Produk" : "Tambah Produk"}
        </h2>

        {message.text && (
          <div
            className={`p-3 mb-3 rounded-md text-sm ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-3"
          encType="multipart/form-data"
        >
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

          {/* Input file baru */}
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="border w-full p-2 rounded"
          />

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white px-4 py-2 rounded`}
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
