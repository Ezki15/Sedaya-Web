export default function ConfirmDeleteModal({ onClose, onConfirm, product }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[350px]">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Hapus Produk
        </h2>
        <p className="text-gray-600 mb-4">
          Apakah Anda yakin ingin menghapus produk{" "}
          <span className="font-medium text-gray-800">{product.name}</span>?
          Tindakan ini tidak dapat dibatalkan.
        </p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
