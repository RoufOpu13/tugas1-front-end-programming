"use client";
import { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<User[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState<{ name: string; email: string }>({ name: "", email: "" });
  const [message, setMessage] = useState("");
  const [newUser, setNewUser] = useState({ name: "", email: "" });

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

  useEffect(() => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResult(filtered);
    setCurrentPage(0); // Reset ke halaman pertama saat pencarian
  }, [searchQuery, users]);

  const handleDelete = (id: number) => {
    const updatedUsers = searchResult.filter(user => user.id !== id);
    setUsers(updatedUsers);
    setSearchResult(updatedUsers);
    setMessage("Data dihapus");
    setTimeout(() => setMessage(""), 2000);
  };

  const handleEdit = (user: User) => {
    setEditId(user.id);
    setEditData({ name: user.name, email: user.email });
  };

  const handleSave = (id: number) => {
    const updatedUsers = searchResult.map(user =>
      user.id === id ? { ...user, name: editData.name, email: editData.email } : user
    );
    setUsers(updatedUsers);
    setSearchResult(updatedUsers);
    setEditId(null);
    setMessage("Data diedit");
    setTimeout(() => setMessage(""), 2000);
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) return;
    const newId = users.length ? users[users.length - 1].id + 1 : 1;
    const newUserData: User = { id: newId, ...newUser };
    const updatedUsers = [...users, newUserData];
    setUsers(updatedUsers);
    setSearchResult(updatedUsers);
    setNewUser({ name: "", email: "" });
    setMessage("User ditambahkan");
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
      <br />
      <h1 className="text-center text-3xl border borde-1 rounded-xl font-extrabold">Data Pengguna</h1>
      <br />
      {message && <p className="text-green-500 text-center mb-4">{message}</p>}

      <input
        type="text"
        placeholder="Cari pengguna..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setSearchQuery(e.target.value); // Update searchQuery langsung
        }}
        className="w-full px-4 py-2 border rounded-full"
      />
      <br />
      <br />
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

              {/* Jika dalam mode edit, tampilkan input */}
              {editId === user.id ? (
                <>
                  <td className="py-2 px-4 border">
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="w-full px-2 py-1 border border-gray-400 rounded"
                    />
                  </td>
                  <td className="py-2 px-4 border">
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      className="w-full px-2 py-1 border border-gray-400 rounded"
                    />
                  </td>
                </>
              ) : (
                <>
                  <td className="py-2 px-4 border">{user.name}</td>
                  <td className="py-2 px-4 border">{user.email}</td>
                </>
              )}

              <td className="py-2 px-4 border">
                {editId === user.id ? (
                  <>
                    <button className="bg-green-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleSave(user.id)}>
                      Simpan
                    </button>
                    <button className="bg-gray-500 text-white px-2 py-1 rounded" onClick={() => setEditId(null)}>
                      Batal
                    </button>
                  </>
                ) : (
                  <>
                    <button className="bg-black text-white px-2 py-1 rounded mr-2" onClick={() => handleEdit(user)}>
                      Ubah
                    </button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDelete(user.id)}>
                      Hapus
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>

      </table>
      <br />
     
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
      <h1 className="text-center text-3xl border borde-1 rounded-xl font-extrabold">Tambah Data Pengguna</h1>
      <br />
      <div className="flex justify-center items-center">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddUser();
          }}
          className="flex space-x-2 w-full max-w-2xl"
        >
          <input
            type="text"
            placeholder="Nama"
            className="p-2 border rounded w-2/3 min-w-[250px]"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Email"
            className="p-2 border rounded w-2/3 min-w-[250px]"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Tambah
          </button>
        </form>
      </div>
    </div>
  );
};

export default Users;