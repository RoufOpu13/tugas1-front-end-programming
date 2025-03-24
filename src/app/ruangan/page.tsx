"use client";
import { useState, useEffect } from "react";

interface Ruangan {
  id: number;
  kapasitas: string; // Kapasitas diubah menjadi string
  kategori: string;
  price: number;
  status: string;
}

const Ruangans = () => {
  const [ruangans, setRuangans] = useState<Ruangan[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<Ruangan[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState<{ kapasitas: string; kategori: string; price: number }>({
    kapasitas: "",
    kategori: "",
    price: 0,
  });
  const [message, setMessage] = useState("");
  const [newRuangan, setNewRuangan] = useState({ kapasitas: "", kategori: "", price: 0, status: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/ruangan.json");
      const data: Ruangan[] = await response.json();
      setRuangans(data);
      setSearchResult(data);
    };
    fetchData();
  }, []);

  const handleDelete = (id: number) => {
    const isConfirmed = window.confirm("Apakah Anda yakin ingin menghapus data ini?");

    if (isConfirmed) {
      const updatedRuangans = ruangans.filter((ruangan) => ruangan.id !== id);
      setRuangans(updatedRuangans);
      setSearchResult(updatedRuangans);
      alert("Data berhasil dihapus!");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  const handleEdit = (ruangan: Ruangan) => {
    setEditId(ruangan.id);
    setEditData({
      kapasitas: ruangan.kapasitas,
      kategori: ruangan.kategori,
      price: ruangan.price,
    });
    setIsEditModalOpen(true);
  };

  const handleSave = () => {
    if (!editData.kategori.trim() || !editData.kapasitas.trim()) {
      setMessage("Kategori dan kapasitas tidak boleh kosong!");
      setTimeout(() => setMessage(""), 2000);
      return;
    }

    if (editData.price <= 0) {
      setMessage("Harga harus lebih dari 0!");
      setTimeout(() => setMessage(""), 2000);
      return;
    }

    const updatedRuangans = ruangans.map((ruangan) =>
      ruangan.id === editId
        ? { ...ruangan, kapasitas: editData.kapasitas, kategori: editData.kategori, price: editData.price }
        : ruangan
    );
    setRuangans(updatedRuangans);
    setSearchResult(updatedRuangans);
    setIsEditModalOpen(false);
    alert("Data Berhasil Diedit");
    setTimeout(() => setMessage(""), 2000);
  };

  const handleTerima = (id: number) => {
    const isConfirmed = window.confirm("Apakah Anda yakin ingin menerima ruangan ini?");
    if (isConfirmed) {
      const updatedRuangans = ruangans.map((ruangan) =>
        ruangan.id === id ? { ...ruangan, status: "Diterima" } : ruangan
      );
      setRuangans(updatedRuangans);
      setSearchResult(updatedRuangans);
      alert("Ruangan Diterima");
    }
  };
  
  const handleTolak = (id: number) => {
    const isConfirmed = window.confirm("Apakah Anda yakin ingin menolak ruangan ini?");
    if (isConfirmed) {
      const updatedRuangans = ruangans.map((ruangan) =>
        ruangan.id === id ? { ...ruangan, status: "Ditolak" } : ruangan
      );
      setRuangans(updatedRuangans);
      setSearchResult(updatedRuangans);
      alert("Ruangan Ditolak");
    }
  };
  

  useEffect(() => {
    const filtered = ruangans.filter(
      (ruangan) =>
        ruangan.kategori.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ruangan.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResult(filtered);
  }, [searchQuery, ruangans]);

  const handleAddRuangan = () => {
    if (!newRuangan.kategori || !newRuangan.status || !newRuangan.kapasitas || newRuangan.price <= 0) return;
    const newId = ruangans.length ? ruangans[ruangans.length - 1].id + 1 : 1;
    const newRuanganData: Ruangan = { id: newId, ...newRuangan };
    const updatedRuangans = [...ruangans, newRuanganData];
    setRuangans(updatedRuangans);
    setSearchResult(updatedRuangans);
    setNewRuangan({ kapasitas: "", kategori: "", price: 0, status: "" });
    setModalOpen(false);
    alert("Ruangan ditambahkan");
    setTimeout(() => setMessage(""), 2000);
  };

  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRuangans = searchResult.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(searchResult.length / itemsPerPage);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <br />
      <br />
      <br />

      {/* Modal Edit */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Edit Ruangan</h2>

            <label className="block mb-2">Kapasitas</label>
            <input
              type="text"
              value={editData.kapasitas}
              onChange={(e) => setEditData({ ...editData, kapasitas: e.target.value })}
              className="w-full px-3 py-2 border rounded mb-4"
            />

            <label className="block mb-2">Kategori</label>
            <input
              type="text"
              value={editData.kategori}
              onChange={(e) => setEditData({ ...editData, kategori: e.target.value })}
              className="w-full px-3 py-2 border rounded mb-4"
            />

            <label className="block mb-2">Harga</label>
            <input
              type="number"
              value={editData.price}
              onChange={(e) => setEditData({ ...editData, price: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border rounded mb-4"
            />

            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsEditModalOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded">
                Batal
              </button>
              <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-center text-3xl font-extrabold">Data Ruangan</h1>
      {message && <p className="text-green-500 text-center mb-4">{message}</p>}

      <input
        type="text"
        placeholder="Cari ruangan..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-2 border rounded-full"
      />
      <button
        onClick={() => setModalOpen(true)}
        className="mt-4 bg-black text-white px-4 py-2 rounded"
      >
        Tambah Ruangan
      </button>

      <table className="min-w-full bg-white border rounded shadow-md">
        <thead>
          <tr className="bg-black text-white">
            <th className="py-2 px-4 border w-16 text-center">No.</th>
            <th className="py-2 px-4 border w-48">Kapasitas</th>
            <th className="py-2 px-4 border w-64">Kategori</th>
            <th className="py-2 px-4 border w-64">Harga</th>
            <th className="py-2 px-4 border w-64">Status</th>
            <th className="py-2 px-4 border w-40 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {currentRuangans.map((ruangan) => (
            <tr key={ruangan.id} className="hover:bg-gray-100">
              <td className="py-2 text-center text px-4 border">{ruangan.id}</td>
              <td className="py-2 px-4 border">{ruangan.kapasitas}</td>
              <td className="py-2 px-4 border">{ruangan.kategori}</td>
              <td className="py-2 px-4 border">{ruangan.price}</td>
              <td className="py-2 px-4 border">{ruangan.status}</td>
              <td className="py-2 px-4 border flex flex-col items-center">
  <div className="flex justify-between w-full mb-2">
    <button className="bg-black text-white px-2 py-1 rounded" onClick={() => handleEdit(ruangan)}>
      Ubah
    </button>
    <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDelete(ruangan.id)}>
      Hapus
    </button>
  </div>
  <div className="flex justify-between w-full">
    <button className="bg-green-500 text-white px-2 py-1 rounded" onClick={() => handleTerima(ruangan.id)}>
      Terima
    </button>
    <button className="bg-yellow-500 text-white px-2 py-1 rounded" onClick={() => handleTolak(ruangan.id)}>
      Tolak
    </button>
  </div>
</td>

            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <div />

      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          disabled={currentPage === 0}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className={`px-5 py-2 rounded text-white font-semibold ${
            currentPage === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"
          }`}
        >
          ⬅ Sebelumnya
        </button>

        <span>Halaman {currentPage + 1} dari {totalPages}</span>

        <button
          disabled={currentPage + 1 === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className={`px-5 py-2 rounded text-white font-semibold ${
            currentPage + 1 === totalPages || totalPages === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-blue-400"
          }`}
        >
          Berikutnya ➡
        </button>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Tambah Ruangan</h2>
            <input
              type="text"
              placeholder="Kapasitas"
              className="p-2 border rounded w-full mb-2"
              value={newRuangan.kapasitas}
              onChange={(e) => setNewRuangan({ ...newRuangan, kapasitas: e.target.value })}
            />
            <input
              type="text"
              placeholder="Kategori"
              className="p-2 border rounded w-full mb-2"
              value={newRuangan.kategori}
              onChange={(e) => setNewRuangan({ ...newRuangan, kategori: e.target.value })}
            />
            <input
              type="number"
              placeholder="Harga"
              className="p-2 border rounded w-full mb-2"
              value={newRuangan.price}
              onChange={(e) => setNewRuangan({ ...newRuangan, price: parseInt(e.target.value) })}
            />
            <input
              type="text"
              placeholder="Status"
              className="p-2 border rounded w-full mb-4"
              value={newRuangan.status}
              onChange={(e) => setNewRuangan({ ...newRuangan, status: e.target.value })}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Batal
              </button>
              <button
                onClick={handleAddRuangan}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Tambah
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ruangans;