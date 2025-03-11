"use client";
import { useState, useEffect } from "react";

interface Ruangan {
  id: number;
  kapasitas: string;
  kategori: string;
  price: string;
  status: string;
}

const Ruangans = () => {
  const [ruangans, setRuangans] = useState<Ruangan[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<Ruangan[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState({ kapasitas: "", kategori: "", price: "", status: "" });
  const [message, setMessage] = useState("");
  const [newRuangan, setNewRuangan] = useState({ kapasitas: "", kategori: "", price: "", status: "" });
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

  useEffect(() => {
    const filtered = ruangans.filter(ruangan =>
      ruangan.kapasitas.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ruangan.kategori.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResult(filtered);
  }, [searchQuery, ruangans]);

  const handleEdit = (ruangan: Ruangan) => {
    setEditId(ruangan.id);
    setEditData({ kapasitas: ruangan.kapasitas, kategori: ruangan.kategori, price: ruangan.price, status: ruangan.status });
  };

  const handleSave = (id: number) => {
    const updatedRuangans = ruangans.map(ruangan =>
      ruangan.id === id ? { ...ruangan, ...editData } : ruangan
    );
    setRuangans(updatedRuangans);
    setSearchResult(updatedRuangans);
    setEditId(null);
    alert(`Data Berhasil diedit`);
    setTimeout(() => setMessage(""), 2000);
  };
  const handleAccept = (id: number) => {
    const ruangan = ruangans.find(ruangan => ruangan.id === id);
  
    if (ruangan) {
      const isConfirmed = window.confirm(`Apakah Anda yakin ingin menerima ruangan ${ruangan.kategori}?`);
      
      if (isConfirmed) {
        const updatedRuangans = ruangans.map(ruang =>
          ruang.id === id ? { ...ruang, status: "Diterima" } : ruang
        );
  
        setRuangans(updatedRuangans);
        setSearchResult(updatedRuangans);
        alert(`Ruangan ${ruangan.kategori} telah diterima`);
        
        setTimeout(() => setMessage(""), 2000);
      }
    }
  };
  
  
  const handleReject = (id: number) => {
    const ruangan = ruangans.find(ruangan => ruangan.id === id);
  
    if (ruangan) {
      const isConfirmed = window.confirm(`Apakah Anda yakin ingin menolak ruangan ${ruangan.kategori}?`);
      
      if (isConfirmed) {
        const updatedRuangans = ruangans.map(ruang =>
          ruang.id === id ? { ...ruang, status: "Ditolak" } : ruang
        );
  
        setRuangans(updatedRuangans);
        setSearchResult(updatedRuangans);
  
        alert(`Ruangan ${ruangan.kategori} telah ditolak`);
      }
    }
  };
  

  const handleDelete = (id: number) => {
    const isConfirmed = window.confirm("Apakah Anda yakin ingin menghapus data ini?");
    
    if (isConfirmed) {
      const updatedRuangans = ruangans.filter(ruangan => ruangan.id !== id);
      setRuangans(updatedRuangans);
      setSearchResult(updatedRuangans);
  
      // Menampilkan alert bahwa data berhasil dihapus
      alert("Data berhasil dihapus!");
  
      setTimeout(() => setMessage(""), 2000);
    }
  };
  

  const handleAddRuangan = () => {
    if (!newRuangan.kapasitas || !newRuangan.kategori || !newRuangan.price || !newRuangan.status) return;
    const newId = ruangans.length ? ruangans[ruangans.length - 1].id + 1 : 1;
    const newRuanganData: Ruangan = { id: newId, ...newRuangan };
    const updatedRuangans = [...ruangans, newRuanganData];
    setRuangans(updatedRuangans);
    setSearchResult(updatedRuangans);
    setNewRuangan({ kapasitas: "", kategori: "", price: "", status: "" });
    alert("Ruangan ditambahkan!");
    setTimeout(() => setMessage(""), 2000);
  };

  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const displayedRuangans = searchResult.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(searchResult.length / itemsPerPage);


  return (
    <div className="p-6 max-w-4xl mx-auto">
      <br />
      <br />
      <br />
      <h1 className="text-center text-3xl border borde-1 rounded-xl font-extrabold">Data Ruangan</h1>
      <br />
      {message && <p className="text-green-500 text-center mb-4">{message}</p>}

      <input
        type="text"
        placeholder="Cari ruangan..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-2 border rounded-full mb-4"
      />

      <table className="min-w-full bg-white border rounded shadow-md">
        <thead>
          <tr className="bg-black text-white">
            <th className="py-2 px-4 border w-12">No.</th>
            <th className="py-2 px-4 border w-40">Kapasitas</th>
            <th className="py-2 px-4 border w-40">Kategori</th>
            <th className="py-2 px-4 border w-20">Price</th>
            <th className="py-2 px-4 border w-32">Status</th>
            <th className="py-2 px-4 border w-40">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {displayedRuangans.map((ruangan, index) => (
            <tr key={ruangan.id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border">{ruangan.id}</td>
              {editId === ruangan.id ? (
                <>
                  <td className="py-2 px-4 border">
                    <input
                      type="text"
                      value={editData.kapasitas}
                      onChange={(e) => setEditData({ ...editData, kapasitas: e.target.value })}
                      className="p-1 border rounded w-full"
                    />
                  </td>
                  <td className="py-2 px-4 border">
                    <input
                      type="text"
                      value={editData.kategori}
                      onChange={(e) => setEditData({ ...editData, kategori: e.target.value })}
                      className="p-1 border rounded w-full"
                    />
                  </td>
                  <td className="py-2 px-4 border">
                    <input
                      type="text"
                      value={editData.price}
                      onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                      className="p-1 border rounded w-full"
                    />
                  </td>
                  <td className="py-2 px-4 border">
                    <input
                      type="text"
                      value={editData.status}
                      onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                      className="p-1 border rounded w-full"
                    />
                  </td>
                  <td className="py-2 px-4 border">
                    <button className="bg-green-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleSave(ruangan.id)}>Simpan</button>
                    <button className="bg-gray-500 text-white px-2 py-1 rounded" onClick={() => setEditId(null)}>Batal</button>
                  </td>
                </>
              ) : (
                <>
                  <td className="py-2 px-4 border">{ruangan.kapasitas}</td>
                  <td className="py-2 px-4 border">{ruangan.kategori}</td>
                  <td className="py-2 px-4 border">{ruangan.price}</td>
                  <td className="py-2 px-4 border">{ruangan.status}</td>
                  <td className="py-2 px-4 border">
                    <button className="bg-black text-white px-2 py-1 rounded mr-2" onClick={() => handleEdit(ruangan)}>Ubah</button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleDelete(ruangan.id)}>Hapus</button>
                    <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleAccept(ruangan.id)}>Terima</button>
                    <button className="bg-yellow-500 text-white px-2 py-1 rounded" onClick={() => handleReject(ruangan.id)}>Tolak</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          disabled={currentPage === 0}
          onClick={() => setCurrentPage(prev => prev - 1)}
          className={`px-5 py-2 rounded text-white font-semibold ${currentPage === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"}`}
        >⬅ Sebelumnya</button>

        <span>Halaman {currentPage + 1} dari {totalPages}</span>

        <button
          disabled={currentPage + 1 === totalPages || totalPages === 0}
          onClick={() => setCurrentPage(prev => prev + 1)}
          className={`px-5 py-2 rounded text-white font-semibold ${currentPage + 1 === totalPages || totalPages === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-800"}`}
        >Berikutnya ➡</button>
      </div>
      <br />
      <h1 className="text-center text-3xl border borde-1 rounded-xl font-extrabold">Tambah Data Ruangan</h1>
      <br />
      <div className="flex justify-center mt-4">
      <input type="text" placeholder="Kapasitas" className="p-2 border rounded mx-1" value={newRuangan.kapasitas} onChange={(e) => setNewRuangan({ ...newRuangan, kapasitas: e.target.value })} />
      <input type="text" placeholder="Kategori" className="p-2 border rounded mx-1" value={newRuangan.kategori} onChange={(e) => setNewRuangan({ ...newRuangan, kategori: e.target.value })} />
      <input type="text" placeholder="Price" className="p-2 border rounded mx-1" value={newRuangan.price} onChange={(e) => setNewRuangan({ ...newRuangan, price: e.target.value })} />
      <input type="text" placeholder="Status" className="p-2 border rounded mx-1" value={newRuangan.status} onChange={(e) => setNewRuangan({ ...newRuangan, status: e.target.value })} />
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleAddRuangan}>Tambah</button>
    </div>
    </div>
  );
};

export default Ruangans;
