import { useEffect, useState } from "react";
import Sidebar from "../../components/Admin/Sidebar";
import ProductTable from "../../components/Admin/ProductTable";
import AddProductModal from "../../components/Admin/AddProductModal";
import api from "../../api/axios";

export default function AdminPanel() {
  const [activePage, setActivePage] = useState("dashboard");
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState([]);

  const handleAddProduct = (newProduct) => {
    setTimeout(() => {
      setProducts((prev) => [...prev, newProduct]);
    }, 2000);
  };

  useEffect(() => {
    async function AddProduct(){
      try{
        const res = await api.get("/products", {withCredentials: true});
        setProducts(res.data.data);
      } catch(err){
        console.log(err);
      }
    }

    AddProduct();
  }, [products])

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return (
          <div>
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <p className="text-gray-600">
              Selamat datang di dashboard admin. Pilih menu di sidebar untuk mulai mengelola data.
            </p>
          </div>
        );
      case "products":
        return (
          <>
            <ProductTable
              products={products}
              onAdd={() => setShowModal(true)}
            />
            {showModal && (
              <AddProductModal
                onClose={() => setShowModal(false)}
                onSuccess={handleAddProduct}
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
