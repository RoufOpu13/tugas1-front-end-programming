"use client";
import { useState, useEffect } from "react";

interface Booking {
  id: number;
  ruangan: string;
  tanggal: string;
  dibookingOleh: string;
  harga: string;
}

const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<Booking[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState({ ruangan: "", tanggal: "", dibookingOleh: "", harga: "" });
  const [message, setMessage] = useState("");
  const [newBooking, setNewBooking] = useState({ ruangan: "", tanggal: "", dibookingOleh: "", harga: "" });
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;
   
  const formatTanggal = (tanggal: string) => {
    const bulan = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
  
    const dateObj = new Date(tanggal);
    if (isNaN(dateObj.getTime())) return "Tanggal tidak valid"; // Cek jika tanggal tidak valid
  
    const hari = dateObj.getDate().toString().padStart(2, "0"); // Tambahkan nol jika perlu
    const bulanNama = bulan[dateObj.getMonth()];
    const tahun = dateObj.getFullYear();
  
    return `${hari} ${bulanNama} ${tahun}`;
  };
  

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/booking.json");
      const data: Booking[] = await response.json();
      setBookings(data);
      setSearchResult(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = bookings.filter(booking =>
      booking.ruangan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.dibookingOleh.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResult(filtered);
  }, [searchQuery, bookings]);

  const handleAddBookings = () => {
    if (!newBooking.ruangan || !newBooking.tanggal || !newBooking.dibookingOleh || !newBooking.harga) return;
    const newId = bookings.length ? bookings[bookings.length - 1].id + 1 : 1;
    const newBookingData: Booking = { id: newId, ...newBooking };
    setBookings([...bookings, newBookingData]);
    setNewBooking({ ruangan: "", tanggal: "", dibookingOleh: "", harga: "" });
    alert("Booking berhasil ditambahkan!");
  };

  const handleEdit = (booking: Booking) => {
    setEditId(booking.id);
    setEditData({ ruangan: booking.ruangan, tanggal: booking.tanggal, dibookingOleh: booking.dibookingOleh, harga: booking.harga });
  };


  const handleSave = (id: number) => {
    const updatedBookings = bookings.map(booking =>
      booking.id === id ? { ...booking, ...editData } : booking
    );
    setBookings(updatedBookings);
    setSearchResult(updatedBookings);
    setEditId(null);
    alert(`Data berhasil diedit`);
    setTimeout(() => setMessage(""), 2000);
  };

  

  const handleDelete = (id: number) => {
    const isConfirmed = window.confirm("Apakah Anda yakin ingin menghapus booking ini?");
    
    if (isConfirmed) {
      const updatedBookings = bookings.filter(booking => booking.id !== id);
      setBookings(updatedBookings);
      setSearchResult(updatedBookings);
      alert("Booking berhasil dihapus!");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  const handleAddBooking = () => {
    if (!newBooking.ruangan || !newBooking.tanggal || !newBooking.dibookingOleh || !newBooking.harga) return;
    const newId = bookings.length ? bookings[bookings.length - 1].id + 1 : 1;
    const newBookingData: Booking = { id: newId, ...newBooking };
    const updatedBookings = [...bookings, newBookingData];
    setBookings(updatedBookings);
    setSearchResult(updatedBookings);
    setNewBooking({ ruangan: "", tanggal: "", dibookingOleh: "", harga: "" });
    alert("Booking ditambahkan!");
    setTimeout(() => setMessage(""), 2000);
  };

  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const displayedBookings = searchResult.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(searchResult.length / itemsPerPage);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <br />
      <br />
      <br />
      <h1 className="text-center text-3xl border borde-1 rounded-xl font-extrabold">Data Booking</h1>
      <br />
      {message && <p className="text-green-500 text-center mb-4">{message}</p>}

      <input
        type="text"
        placeholder="Cari booking..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-2 border rounded-full mb-4"
      />

      <table className="min-w-full bg-white border rounded shadow-md">
        <thead>
          <tr className="bg-black text-white">
            <th className="py-2 px-4 border w-12">No.</th>
            <th className="py-2 px-4 border w-40">Ruangan</th>
            <th className="py-2 px-4 border w-40">Tanggal Pemesanan</th>
            <th className="py-2 px-4 border w-40">Dibooking Oleh</th>
            <th className="py-2 px-4 border w-20">Harga</th>
            <th className="py-2 px-4 border w-40">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {displayedBookings.map((booking, index) => (
            <tr key={booking.id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border">{booking.id}</td>
              {editId === booking.id ? (
                <>
                  <td className="py-2 px-4 border">
                    <input
                      type="text"
                      value={editData.ruangan}
                      onChange={(e) => setEditData({ ...editData, ruangan: e.target.value })}
                      className="p-1 border rounded w-full"
                    />
                  </td>
                  <td className="py-2 px-4 border">
                    <input
                      type="date"
                      value={editData.tanggal}
                      onChange={(e) => setEditData({ ...editData, tanggal: e.target.value })}
                      className="p-1 border rounded w-full"
                    />
                  </td>
                  <td className="py-2 px-4 border">
                    <input
                      type="text"
                      value={editData.dibookingOleh}
                      onChange={(e) => setEditData({ ...editData, dibookingOleh: e.target.value })}
                      className="p-1 border rounded w-full"
                    />
                  </td>
                  <td className="py-2 px-4 border">
                    <input
                      type="text"
                      value={editData.harga}
                      onChange={(e) => setEditData({ ...editData, harga: e.target.value })}
                      className="p-1 border rounded w-full"
                    />
                  </td>
                  <td className="py-2 px-4 border">
                    <button className="bg-green-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleSave(booking.id)}>Simpan</button>
                    <button className="bg-gray-500 text-white px-2 py-1 rounded" onClick={() => setEditId(null)}>Batal</button>
                  </td>
                </>
              ) : (
                <>
                  <td className="py-2 px-4 border">{booking.ruangan}</td>
                  <td className="py-2 px-4 border">{formatTanggal(booking.tanggal)}</td>
                  <td className="py-2 px-4 border">{booking.dibookingOleh}</td>
                  <td className="py-2 px-4 border">{booking.harga}</td>
                  <td className="py-2 px-4 border">
                    <button className="bg-black text-white px-2 py-1 rounded mr-2" onClick={() => handleEdit(booking)}>Ubah</button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDelete(booking.id)}>Hapus</button>
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
      <h1 className="text-center text-3xl border borde-1 rounded-xl font-extrabold">Tambah Data Booking</h1>
      <br />
      <div className="flex justify-center mb-4">
        <input type="text" placeholder="Ruangan" className="p-2 border rounded mx-1" value={newBooking.ruangan} onChange={(e) => setNewBooking({ ...newBooking, ruangan: e.target.value })} />
        <input type="date" className="p-2 border rounded mx-1" value={newBooking.tanggal} onChange={(e) => setNewBooking({ ...newBooking, tanggal: e.target.value })} />
        <input type="text" placeholder="Dibooking Oleh" className="p-2 border rounded mx-1" value={newBooking.dibookingOleh} onChange={(e) => setNewBooking({ ...newBooking, dibookingOleh: e.target.value })} />
        <input type="text" placeholder="Harga" className="p-2 border rounded mx-1" value={newBooking.harga} onChange={(e) => setNewBooking({ ...newBooking, harga: e.target.value })} />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleAddBooking}>Tambah</button>
      </div>
    </div>
  );
};

export default Bookings;
