export default function OrderSummaryModal({
  orderItems,
  onClose,
  onRemoveItem,
  onQuantityChange,
  onSubmitOrder,
}) {
  const totalPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-[90%] sm:w-[500px] rounded-2xl shadow-2xl p-6 relative">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          🧾 Ringkasan Pesanan
        </h2>

        {orderItems.length === 0 ? (
          <p className="text-gray-500 text-center py-6">Tidak ada produk.</p>
        ) : (
          <div className="max-h-80 overflow-y-auto space-y-3">
            {orderItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={`http://localhost:3000/uploads/products/${item.imagePath}`}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Rp {item.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      onQuantityChange(item.id, parseInt(e.target.value) || 1)
                    }
                    className="w-14 border rounded-lg text-center py-1 text-sm"
                  />
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700 text-lg font-bold"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center mt-5">
          <h3 className="font-bold text-lg">
            Total:{" "}
            <span className="text-green-600">
              Rp {totalPrice.toLocaleString("id-ID")}
            </span>
          </h3>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 transition-all"
            >
              Batal
            </button>
            <button
              onClick={onSubmitOrder}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all"
            >
              Kirim
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
