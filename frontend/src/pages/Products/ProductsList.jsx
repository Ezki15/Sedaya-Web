export default function ProductsList({ product, onAddToOrder }) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
      {/* Gambar produk */}
      <div className="bg-gray-100 flex items-center justify-center h-48">
        <img
          src={`http://localhost:3000/uploads/products/${product.imagePath}`}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Body card */}
      <div className="flex flex-col justify-between flex-1 p-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
            {product.name}
          </h2>
          <p className="text-gray-500 text-sm line-clamp-2 mb-3">
            {product.description}
          </p>
        </div>

        {/* Harga, stok, dan tombol */}
        <div className="flex justify-between items-end mt-auto">
          <div className="flex flex-col text-sm text-gray-700">
            <span className="font-semibold text-green-600">
              Rp {product.price?.toLocaleString("id-ID")}
            </span>
            <span className="text-gray-500">Stok: {product.stock}</span>
          </div>

          <button
            onClick={() => onAddToOrder(product)}
            className="bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg shadow hover:bg-blue-700 hover:shadow-md active:scale-95 transition-all duration-200"
          >
            + Order
          </button>
        </div>
      </div>
    </div>
  );
}
