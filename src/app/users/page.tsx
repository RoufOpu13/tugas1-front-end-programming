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

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/users.json");
      const data: User[] = await response.json();
      setUsers(data);
      setSearchResult(data);
    };
    fetchData();
  }, []);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearchQuery(search);
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
      setSearchResult(filtered.length > 0 ? filtered : []);
    }
  };

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

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) {
      setMessage("Nama dan Email harus diisi");
      setTimeout(() => setMessage(""), 2000);
      return;
    }

    const newUserEntry: User = { id: users.length + 1, name: newUser.name, email: newUser.email };
    const updatedUsers = [...users, newUserEntry];
    setUsers(updatedUsers);
    setSearchResult(updatedUsers);
    setNewUser({ name: "", email: "" });
    setMessage("User berhasil ditambahkan");
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <br />
      <br />
      <br />
      <br />
      <h1 className="text-3xl font-bold mb-6 text-center">User List</h1>
      {message && <p className="text-green-500 text-center mb-4">{message}</p>}

      {/* Form Tambah User */}
    

      <input
        type="text"
        placeholder="Search users..."
        className="w-full p-2 text-black border border-black rounded mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleSearch}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow-md">
          <thead>
            <tr className="bg-black text-white">
              <th className="py-2 px-4 border border-black">ID</th>
              <th className="py-2 px-4 border border-black">Name</th>
              <th className="py-2 px-4 border border-black">Email</th>
              <th className="py-2 px-4 border border-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            {searchResult.length > 0 ? (
              searchResult.map((user) => (
                <tr key={user.id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border border-black text-center">{user.id}</td>
                  <td className={`py-2 px-4 border border-black ${editId === user.id ? 'text-red-500' : ''}`}>
                    {editId === user.id ? (
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="border border-red-500 rounded p-1"
                      />
                    ) : (
                      user.name
                    )}
                  </td>
                  <td className={`py-2 px-4 border border-black ${editId === user.id ? 'text-red-500' : ''}`}>
                    {editId === user.id ? (
                      <input
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        className="border border-red-500 rounded p-1"
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td className="py-2 px-4 border border-black text-center">
                    {editId === user.id ? (
                      <button
                        className="bg-black text-white px-2 py-1 rounded mr-2"
                        onClick={() => handleSave(user.id)}
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        className="bg-black text-white px-2 py-1 rounded mr-2"
                        onClick={() => handleEdit(user)}
                      >
                        Edit
                      </button>
                    )}
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-2 px-4 border text-center text-red-500">
                  "{searchQuery}" tidak terdaftar
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <br />
      <form onSubmit={handleAddNew} className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Nama"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          className="p-2 border border-gray-300 rounded w-1/3"
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          className="p-2 border border-gray-300 rounded w-1/3"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add New
        </button>
      </form>
    </div>
  );
};

export default Users;
