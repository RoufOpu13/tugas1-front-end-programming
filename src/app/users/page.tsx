"use client";
import { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<User[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState<{ name: string; email: string }>({ name: "", email: "" });
  const [message, setMessage] = useState("");
  const [newUser, setNewUser] = useState({ name: "", email: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;


  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/users.json");
      const data: User[] = await response.json();
      setUsers(data);
      setSearchResult(data);
    };
    fetchData();
  }, []);

  const handleDelete = (id: number) => {
    const isConfirmed = window.confirm("Apakah Anda yakin ingin menghapus data ini?");

    if (isConfirmed) {
      const updatedUsers = users.filter(ruangan => ruangan.id !== id);
      setUsers(updatedUsers);
      setSearchResult(updatedUsers);

      // Menampilkan alert bahwa data berhasil dihapus
      alert("Data berhasil dihapus!");

      setTimeout(() => setMessage(""), 2000);
    }
  };

  const handleEdit = (user: User) => {
    setEditId(user.id);
    setEditData({ name: user.name, email: user.email });
    setIsEditModalOpen(true); // Buka modal
  };

  const handleSave = () => {
    if (!editData.name.trim() || !editData.email.trim()) {
      setMessage("Nama dan email tidak boleh kosong!");
      setTimeout(() => setMessage(""), 2000);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(editData.email)) {
      setMessage("Format email tidak valid!");
      setTimeout(() => setMessage(""), 2000);
      return;
    }

    const updatedUsers = users.map(user =>
      user.id === editId ? { ...user, name: editData.name, email: editData.email } : user
    );
    setUsers(updatedUsers);
    setSearchResult(updatedUsers);
    setIsEditModalOpen(false); // Tutup modal setelah edit selesai
   alert ('Data Berhasil Diedit');
    setTimeout(() => setMessage(""), 2000);
  };
  useEffect(() => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResult(filtered);
  }, [searchQuery, users]);

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) return;
    const newId = users.length ? users[users.length - 1].id + 1 : 1;
    const newUserData: User = { id: newId, ...newUser };
    const updatedUsers = [...users, newUserData];
    setUsers(updatedUsers);
    setSearchResult(updatedUsers);
    setNewUser({ name: "", email: "" });
    setModalOpen(false);
    alert ("User ditambahkan");
    setTimeout(() => setMessage(""), 2000);
  };

  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = searchResult.slice(indexOfFirstItem, indexOfLastItem);
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
            <h2 className="text-2xl font-bold mb-4">Edit Pengguna</h2>
            
            <label className="block mb-2">Nama</label>
            <input
              type="text"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded mb-4"
            />
            
            <label className="block mb-2">Email</label>
            <input
              type="email"
              value={editData.email}
              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
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

      <h1 className="text-center text-3xl font-extrabold">Data Pengguna</h1>
      {message && <p className="text-green-500 text-center mb-4">{message}</p>}

      <input
        type="text"
        placeholder="Cari pengguna..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-2 border rounded-full"
      />
      <button
        onClick={() => setModalOpen(true)}
        className="mt-4 bg-black text-white px-4 py-2 rounded"
      >
        Tambah Pengguna
      </button>

      
      <table className="min-w-full bg-white border rounded shadow-md">
        <thead>
          <tr className="bg-black text-white">
            <th className="py-2 px-4 border w-16 text-center">No.</th>
            <th className="py-2 px-4 border w-48">Nama</th>
            <th className="py-2 px-4 border w-64">Email</th>
            <th className="py-2 px-4 border w-40 text-center">Aksi</th>
          </tr>

        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id} className=" hover:bg-gray-100">
              <td className="py-2 text-center text px-4 border">{user.id}</td>

                  <td className="py-2 px-4 border">{user.name}</td>
                  <td className="py-2 px-4 border">{user.email}</td>

              <td className="py-2 px-4 border">
                <button className="bg-black text-white px-2 py-1 rounded mr-2" onClick={() => handleEdit(user)}>
                  Ubah
                </button>
                <button className="bg-red-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleDelete(user.id)}>Hapus</button>
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
            <h2 className="text-lg font-bold mb-4">Tambah Pengguna</h2>
            <input
              type="text"
              placeholder="Nama"
              className="p-2 border rounded w-full mb-2"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="p-2 border rounded w-full mb-4"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Batal
              </button>
              <button
                onClick={handleAddUser}
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

export default Users;