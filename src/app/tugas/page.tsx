"use client";
import { useState, useEffect } from "react";

interface Task {
  id: number;
  nama_perusahaan: string;
  nama_tugas: string;
  keterangan: string;
  nama_daerah: string;
  status: string;
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<Task[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Task>({
    id: 0,
    nama_perusahaan: "",
    nama_tugas: "",
    keterangan: "",
    nama_daerah: "",
    status: "",
  });
  const [message, setMessage] = useState("");
  const [newTask, setNewTask] = useState<Omit<Task, "id">>({
    nama_perusahaan: "",
    nama_tugas: "",
    keterangan: "",
    nama_daerah: "",
    status: "",
  });

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/tugas.json");
      const data: Task[] = await response.json();
      setTasks(data);
      setSearchResult(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filteredTasks = tasks.filter((task) =>
      Object.values(task).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setSearchResult(filteredTasks);
    setCurrentPage(0);
  }, [searchQuery, tasks]);

  const handleDelete = (id: number) => {
    const updatedTasks = searchResult.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    setSearchResult(updatedTasks);
    setMessage("Data dihapus");
    setTimeout(() => setMessage(""), 2000);
  };

  const handleEdit = (task: Task) => {
    setEditId(task.id);
    setEditData(task);
  };

  const handleSave = (id: number) => {
    const updatedTasks = searchResult.map((task) =>
      task.id === id ? editData : task
    );
    setTasks(updatedTasks);
    setSearchResult(updatedTasks);
    setEditId(null);
    setMessage("Data diedit");
    setTimeout(() => setMessage(""), 2000);
  };

  const handleAddTask = () => {
    if (
      !newTask.nama_perusahaan ||
      !newTask.nama_tugas ||
      !newTask.keterangan ||
      !newTask.nama_daerah ||
      !newTask.status
    ) {
      setMessage("Isi semua data terlebih dahulu.");
      setTimeout(() => setMessage(""), 3000); // Menghilangkan pesan setelah 3 detik
      return;
    }

    const newId = tasks.length ? tasks[tasks.length - 1].id + 1 : 1;
    const newTaskData: Task = { id: newId, ...newTask };
    const updatedTasks = [...tasks, newTaskData];
    setTasks(updatedTasks);
    setSearchResult(updatedTasks);
    setNewTask({
      nama_perusahaan: "",
      nama_tugas: "",
      keterangan: "",
      nama_daerah: "",
      status: "",
    });
    setMessage("Data disimpan");
    setTimeout(() => setMessage(""), 3000); // Menghilangkan pesan setelah 3 detik
  };

  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTasks = searchResult.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(searchResult.length / itemsPerPage);
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <br />
      <br />
      <br />
      <h1 className="text-center text-3xl border borde-1 rounded-xl font-extrabold">Data Tugas</h1>
      <br />
      {message && <p className="text-green-500 text-center mb-4">{message}</p>}
      <input
        type="text"
        placeholder="Cari tugas..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setSearchQuery(e.target.value); // Update searchQuery langsung
        }}
        className="w-full px-4 py-2 border rounded-full mb-4"
      />
      <table className="min-w-full bg-white border rounded shadow-md">
        <thead>
          <tr className="bg-black text-white">
            <th className="py-2 px-4 border w-16 text-center">No.</th>
            <th className="py-2 px-4 border w-48">Nama Perusahaan</th>
            <th className="py-2 px-4 border w-48">Nama Tugas</th>
            <th className="py-2 px-4 border w-64">Keterangan</th>
            <th className="py-2 px-4 border w-32">Nama Daerah</th>
            <th className="py-2 px-4 border w-24">Status</th>
            <th className="py-2 px-4 border w-40 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {currentTasks.map((task) => (
            <tr key={task.id} className="hover:bg-gray-100">
              <td className="py-2 text-center px-4 border">{task.id}</td>
              {editId === task.id ? (
                <>
                  <td className="py-2 px-4 border">
                    <input type="text" value={editData.nama_perusahaan} onChange={(e) => setEditData({ ...editData, nama_perusahaan: e.target.value })} className="w-full px-2 py-1 border rounded" />
                  </td>
                  <td className="py-2 px-4 border">
                    <input type="text" value={editData.nama_tugas} onChange={(e) => setEditData({ ...editData, nama_tugas: e.target.value })} className="w-full px-2 py-1 border rounded" />
                  </td>
                  <td className="py-2 px-4 border">
                    <input type="text" value={editData.keterangan} onChange={(e) => setEditData({ ...editData, keterangan: e.target.value })} className="w-full px-2 py-1 border rounded" />
                  </td>
                  <td className="py-2 px-4 border">
                    <input type="text" value={editData.nama_daerah} onChange={(e) => setEditData({ ...editData, nama_daerah: e.target.value })} className="w-full px-2 py-1 border rounded" />
                  </td>
                  <td className="py-2 px-4 border">
                    <input type="text" value={editData.status} onChange={(e) => setEditData({ ...editData, status: e.target.value })} className="w-full px-2 py-1 border rounded" />
                  </td>
                </>
              ) : (
                <>
                  <td className="py-2 px-4 border">{task.nama_perusahaan}</td>
                  <td className="py-2 px-4 border">{task.nama_tugas}</td>
                  <td className="py-2 px-4 border">{task.keterangan}</td>
                  <td className="py-2 px-4 border">{task.nama_daerah}</td>
                  <td className="py-2 px-4 border">{task.status}</td>
                </>
              )}
              <td className="py-2 px-4 border">
                {editId === task.id ? (
                  <>
                    <button className="bg-green-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleSave(task.id)}>Simpan</button>
                    <button className="bg-gray-500 text-white px-2 py-1 rounded" onClick={() => setEditId(null)}>Batal</button>
                  </>
                ) : (
                  <>
                    <button className="bg-black text-white px-2 py-1 rounded mr-2" onClick={() => handleEdit(task)}>Ubah</button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDelete(task.id)}>Hapus</button>
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
      <h1 className="text-center text-3xl border borde-1 rounded-xl font-extrabold">Tambah Data Tugas</h1>
      <div className="flex justify-center items-center mt-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddTask();
          }}
          className="w-full max-w-4xl p-4 bg-white rounded shadow-md"
        >

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Nama Perusahaan
              </label>
              <input
                type="text"
                placeholder="Nama Perusahaan"
                className="w-full px-3 py-2 border rounded"
                value={newTask.nama_perusahaan}
                onChange={(e) =>
                  setNewTask({ ...newTask, nama_perusahaan: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Nama Tugas
              </label>
              <input
                type="text"
                placeholder="Nama Tugas"
                className="w-full px-3 py-2 border rounded"
                value={newTask.nama_tugas}
                onChange={(e) => setNewTask({ ...newTask, nama_tugas: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Keterangan
              </label>
              <input
                type="text"
                placeholder="Keterangan"
                className="w-full px-3 py-2 border rounded"
                value={newTask.keterangan}
                onChange={(e) => setNewTask({ ...newTask, keterangan: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Nama Daerah
              </label>
              <input
                type="text"
                placeholder="Nama Daerah"
                className="w-full px-3 py-2 border rounded"
                value={newTask.nama_daerah}
                onChange={(e) => setNewTask({ ...newTask, nama_daerah: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Status
              </label>
              <input
                type="text"
                placeholder="Status"
                className="w-full px-3 py-2 border rounded"
                value={newTask.status}
                onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Tambah Tugas
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Tasks;