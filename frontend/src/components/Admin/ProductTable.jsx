export default function ProductTable({ products, onAdd }) {
  return (
    <div className="flex-1 p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Daftar Produk</h2>
        <button
          onClick={onAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          + Tambah Produk
        </button>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">Nama</th>
            <th className="border border-gray-300 p-2">Deskripsi</th>
            <th className="border border-gray-300 p-2">Harga</th>
            <th className="border border-gray-300 p-2">Stok</th>
            <th className="border border-gray-300 p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center p-4 text-gray-500">
                Belum ada produk
              </td>
            </tr>
          ) : (
            products.map((p) => (
              <tr key={p.id}>
                <td className="border border-gray-300 p-2">{p.id}</td>
                <td className="border border-gray-300 p-2">{p.name}</td>
                <td className="border border-gray-300 p-2">{p.description}</td>
                <td className="border border-gray-300 p-2">{p.price}</td>
                <td className="border border-gray-300 p-2">{p.stock}</td>
                <td className="border border-gray-300 p-2">Edit | Delete</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
