import { useEffect, useState } from "react";
import { useImmer } from "use-immer";
import Sidebar from "../../components/Admin/Sidebar";
import ProductTable from "./Products/ProductTable";
import ProductFormModal from "./Products/ProductFormModal";
import api from "../../api/axios";

export default function AdminPanel() {
  const [activePage, setActivePage] = useState("dashboard");
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useImmer([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleAddProduct = (newProduct) => {
  setProducts((draft) => {
    draft.push(newProduct);
  });
};


  const handleUpdateProduct = (updateProduct) => {
    setProducts((draft) => {
      const index = draft.findIndex((item) => item.id === updateProduct.id);
      draft[index] = updateProduct;
    });
  };

  const handleDeleteProduct = async (product) => {
    if (confirm("Yakin ingin menghapus produk ini?")) {
      await api.delete(`/products/${product.id}`, { withCredentials: true });
      setProducts((draft) => {
        const index = draft.findIndex((item) => item.id === product.id);
        draft.splice(index, 1);
      });
    }
  };

  useEffect(() => {
    async function AddProduct() {
      try {
        const res = await api.get("/products", { withCredentials: true });
        const sorted = res.data.data.sort((a, b) => a.createAt - b.createAt);
        setProducts(sorted);
      } catch (err) {
        console.log(err);
      }
    }

    AddProduct();
  }, [setProducts]);

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return (
          <div>
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <p className="text-gray-600">
              Selamat datang di dashboard admin. Pilih menu di sidebar untuk
              mulai mengelola data.
            </p>
          </div>
        );
      case "products":
        return (
          <>
            <ProductTable
              products={products}
              onAddProduct={() => {
                setShowModal(true);
                setIsEdit(false);
                setEditingProduct(null);
              }}
              onUpdateProduct={(product) => {
                setShowModal(true);
                setIsEdit(true);
                setEditingProduct(product);
              }}
              onDeleteProduct={handleDeleteProduct}
            />
            {showModal && (
              <ProductFormModal
                onClose={() => setShowModal(false)}
                onSuccessAdd={handleAddProduct}
                onSuccessUpdate={handleUpdateProduct}
                editingProduct={editingProduct}
                isEdit={isEdit}
              />
            )}
          </>
        );
      case "orders":
        return <p>Daftar pesanan akan muncul di sini.</p>;
      case "customers":
        return <p>Data pelanggan akan ditampilkan di sini.</p>;
      default:
        return <p>Halaman tidak ditemukan.</p>;
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar activePage={activePage} onChangePage={setActivePage} />
      <main className="flex-1 p-8 ml-60">{renderContent()}</main>
    </div>
  );
}
