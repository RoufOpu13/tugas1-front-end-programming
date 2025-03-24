"use client";
import { useState, useEffect } from "react";

interface Booking {
  id: number;
  ruangan: string;
  tanggal: string;
  dibookingOleh: string;
  harga: string; // Diubah menjadi string
}

const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<Booking[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState<{ ruangan: string; tanggal: string; dibookingOleh: string; harga: string }>({ ruangan: "", tanggal: "", dibookingOleh: "", harga: "" }); // Diubah menjadi string
  const [message, setMessage] = useState("");
  const [newBooking, setNewBooking] = useState({ ruangan: "", tanggal: "", dibookingOleh: "", harga: "" }); // Diubah menjadi string
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/booking.json");
      const data: Booking[] = await response.json();
      setBookings(data);
      setSearchResult(data);
    };
    fetchData();
  }, []);

  const handleDelete = (id: number) => {
    const isConfirmed = window.confirm("Apakah Anda yakin ingin menghapus data ini?");

    if (isConfirmed) {
      const updatedBookings = bookings.filter(booking => booking.id !== id);
      setBookings(updatedBookings);
      setSearchResult(updatedBookings);

      alert("Data berhasil dihapus!");

      setTimeout(() => setMessage(""), 2000);
    }
  };

  const handleEdit = (booking: Booking) => {
    setEditId(booking.id);
    setEditData({ ruangan: booking.ruangan, tanggal: booking.tanggal, dibookingOleh: booking.dibookingOleh, harga: booking.harga });
    setIsEditModalOpen(true);
  };

  const handleSave = () => {
    if (!editData.ruangan.trim() || !editData.tanggal.trim() || !editData.dibookingOleh.trim() || !editData.harga.trim()) {
      setMessage("Semua field harus diisi!");
      setTimeout(() => setMessage(""), 2000);
      return;
    }

    const updatedBookings = bookings.map(booking =>
      booking.id === editId ? { ...booking, ruangan: editData.ruangan, tanggal: editData.tanggal, dibookingOleh: editData.dibookingOleh, harga: editData.harga } : booking
    );
    setBookings(updatedBookings);
    setSearchResult(updatedBookings);
    setIsEditModalOpen(false);
    alert('Data Berhasil Diedit');
    setTimeout(() => setMessage(""), 2000);
  };

  useEffect(() => {
    const filtered = bookings.filter(booking =>
      booking.ruangan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.tanggal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.dibookingOleh.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResult(filtered);
  }, [searchQuery, bookings]);

  const handleAddBooking = () => {
    if (!newBooking.ruangan || !newBooking.tanggal || !newBooking.dibookingOleh || !newBooking.harga.trim()) return;
    const newId = bookings.length ? bookings[bookings.length - 1].id + 1 : 1;
    const newBookingData: Booking = { id: newId, ...newBooking };
    const updatedBookings = [...bookings, newBookingData];
    setBookings(updatedBookings);
    setSearchResult(updatedBookings);
    setNewBooking({ ruangan: "", tanggal: "", dibookingOleh: "", harga: "" });
    setModalOpen(false);
    alert("Booking ditambahkan");
    setTimeout(() => setMessage(""), 2000);
  };

  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = searchResult.slice(indexOfFirstItem, indexOfLastItem);
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
            <br />
            <br />
            <h2 className="text-2xl font-bold mb-4">Edit Booking</h2>

            <label className="block mb-2">Ruangan</label>
            <input
              type="text"
              value={editData.ruangan}
              onChange={(e) => setEditData({ ...editData, ruangan: e.target.value })}
              className="w-full px-3 py-2 border rounded mb-4"
            />

            <label className="block mb-2">Tanggal</label>
            <input
              type="date"
              value={editData.tanggal}
              onChange={(e) => setEditData({ ...editData, tanggal: e.target.value })}
              className="w-full px-3 py-2 border rounded mb-4"
            />

            <label className="block mb-2">Dibooking Oleh</label>
            <input
              type="text"
              value={editData.dibookingOleh}
              onChange={(e) => setEditData({ ...editData, dibookingOleh: e.target.value })}
              className="w-full px-3 py-2 border rounded mb-4"
            />

            <label className="block mb-2">Harga</label>
            <input
              type="text"
              value={editData.harga}
              onChange={(e) => setEditData({ ...editData, harga: e.target.value })}
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

      <h1 className="text-center text-3xl font-extrabold">Data Booking</h1>
      {message && <p className="text-green-500 text-center mb-4">{message}</p>}

      <input
        type="text"
        placeholder="Cari booking..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-2 border rounded-full"
      />
      <button
        onClick={() => setModalOpen(true)}
        className="mt-4 bg-black text-white px-4 py-2 rounded"
      >
        Tambah Booking
      </button>

      <table className="min-w-full bg-white border rounded shadow-md">
        <thead>
          <tr className="bg-black text-white">
            <th className="py-2 px-4 border w-16 text-center">No.</th>
            <th className="py-2 px-4 border w-48">Ruangan</th>
            <th className="py-2 px-4 border w-64">Tanggal</th>
            <th className="py-2 px-4 border w-64">Dibooking Oleh</th>
            <th className="py-2 px-4 border w-40">Harga</th>
            <th className="py-2 px-4 border w-40 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {currentBookings.map((booking) => (
            <tr key={booking.id} className="hover:bg-gray-100">
              <td className="py-2 text-center text px-4 border">{booking.id}</td>
              <td className="py-2 px-4 border">{booking.ruangan}</td>
              <td className="py-2 px-4 border">{booking.tanggal}</td>
              <td className="py-2 px-4 border">{booking.dibookingOleh}</td>
              <td className="py-2 px-4 border">{booking.harga}</td>
              <td className="py-2 px-4 border">
                <div className="flex space-x-2">
                  <button className="bg-black text-white px-2 py-1 rounded" onClick={() => handleEdit(booking)}>
                    Ubah
                  </button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDelete(booking.id)}>
                    Hapus
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
          onClick={() => setCurrentPage(prev => prev - 1)}
          className={`px-5 py-2 rounded text-white font-semibold ${currentPage === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"}`}
        >⬅ Sebelumnya</button>

        <span>Halaman {currentPage + 1} dari {totalPages}</span>

        <button
          disabled={currentPage + 1 === totalPages || totalPages === 0}
          onClick={() => setCurrentPage(prev => prev + 1)}
          className={`px-5 py-2 rounded text-white font-semibold ${currentPage + 1 === totalPages || totalPages === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-blue-400"}`}
        >Berikutnya ➡</button>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Tambah Booking</h2>
            <input
              type="text"
              placeholder="Ruangan"
              className="p-2 border rounded w-full mb-2"
              value={newBooking.ruangan}
              onChange={(e) => setNewBooking({ ...newBooking, ruangan: e.target.value })}
            />
            <input
              type="date"
              placeholder="Tanggal"
              className="p-2 border rounded w-full mb-2"
              value={newBooking.tanggal}
              onChange={(e) => setNewBooking({ ...newBooking, tanggal: e.target.value })}
            />
            <input
              type="text"
              placeholder="Dibooking Oleh"
              className="p-2 border rounded w-full mb-2"
              value={newBooking.dibookingOleh}
              onChange={(e) => setNewBooking({ ...newBooking, dibookingOleh: e.target.value })}
            />
            <input
              type="text"
              placeholder="Harga"
              className="p-2 border rounded w-full mb-4"
              value={newBooking.harga}
              onChange={(e) => setNewBooking({ ...newBooking, harga: e.target.value })}
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Batal
              </button>
              <button
                onClick={handleAddBooking}
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

export default Bookings;