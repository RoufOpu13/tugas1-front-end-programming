  "use client";
  import Image from "next/image";
  import Link from "next/link";
  import { FiUsers, FiClipboard, FiHome, FiDollarSign, FiBarChart } from "react-icons/fi";
  import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
  import { Card } from "../Components/ui/card";
  import { CardHeader } from "../Components/ui/card-header";
  import { CardContent } from "../Components/ui/card-content";
  import { ProgressBar } from "../Components/ui/progress-bar";

  export default function Dashboard() {

    const pp = {
      workers: 70,  // Statistik agen kuli
      tasks: 120,  // Statistik tugas yang selesai
      clients: 150,  // Statistik klien
      transactions: 300  // Statistik transaksi sukses
    };

    const totalStats = {
      workers: 100,
      tasks: 200,
      clients: 200,
      transactions: 500
      
    };

    const stats = {
      workers: [{ name: "Mandor", value: 20 }, { name: "Tukang", value: 35 }, { name: "Pembantu Tukang", value: 15 }],
      tasks: [{ name: "Jan", value: 50 }, { name: "Feb", value: 80 }, { name: "Mar", value: 40 }],
      clients: [{ name: "Aktif", value: 120 }, { name: "Tidak Aktif", value: 30 }],
      transactions: [{ name: "Berhasil", value: 200 }, { name: "Tertunda", value: 50 }, { name: "Gagal", value: 10 }]
    };

    const charts = [
      { title: "Grafik Agen Kuli", data: stats.workers, icon: <FiHome className="text-black" />, color: "#000000" },
      { title: "Grafik Tugas", data: stats.tasks, icon: <FiBarChart className="text-black" />, color: "#000000" },
      { title: "Grafik Klien", data: stats.clients, icon: <FiUsers className="text-black" />, color: "#000000" },
      { title: "Grafik Transaksi", data: stats.transactions, icon: <FiDollarSign className="text-black" />, color: "#000000" }
    ];

    return (

      <div className="p-6 bg-gray-100 min-h-screen text-black">
        <br />
        <br />
        <br />
        <div className="flex justify-center items-center">
          <Image src="/images/logo.png" alt="Agen Kuli Logo" width={150} height={50} />
        </div>
        <br />

        <div className="text-left mb-8">
          <h2 className="text-3xl font-semibold">Statistik Agen Kuli</h2>
          <p className="text-xl text-black mt-2">Lihat statistik terkait Agen Kuli, Tugas yang diselesaikan, Klien yang dilayani, dan Transaksi</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kartu untuk statistik Workers */}
          <Card className="bg-white text-black border border-white shadow-lg">
            <CardHeader title={<span className="text-black">Agen Kuli</span>} icon={<FiHome className="text-black" />} />
            <CardContent>
              <div className="text-xl font-bold">{pp.workers} / {totalStats.workers}</div>
              <div className="w-full bg-gray-300 h-2 rounded-full">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${(pp.workers / totalStats.workers) * 100}%`,
                    backgroundColor: '#000000',
                  }}
                />
              </div>
              <div className="text-sm text-black">Jumlah Agen Kuli</div>
            </CardContent>
          </Card>

          {/* Kartu untuk statistik Tasks */}
          <Card className="bg-white text-black border border-white shadow-lg">
            <CardHeader title={<span className="text-black">Tugas</span>} icon={<FiClipboard className="text-black" />} />
            <CardContent>
              <div className="text-xl font-bold">{pp.tasks} / {totalStats.tasks}</div>
              <div className="w-full bg-gray-300 h-2 rounded-full">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${(pp.tasks / totalStats.tasks) * 100}%`,
                    backgroundColor: '#000000',
                  }}
                />
              </div>
              <div className="text-sm text-black">Tugas yang diselesaikan</div>
            </CardContent>
          </Card>

          {/* Kartu untuk statistik Clients */}
          <Card className="bg-white text-black border border-white shadow-lg">
            <CardHeader title={<span className="text-black">Klien</span>} icon={<FiUsers className="text-black" />} />
            <CardContent>
              <div className="text-xl font-bold">{pp.clients} / {totalStats.clients}</div>
              <div className="w-full bg-gray-300 h-2 rounded-full">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${(pp.clients / totalStats.clients) * 100}%`,
                    backgroundColor: '#000000',
                  }}
                />
              </div>
              <div className="text-sm text-black">Klien yang dilayani</div>
            </CardContent>
          </Card>

          {/* Kartu untuk statistik Transactions */}
          <Card className="bg-white text-black border border-white shadow-lg">
            <CardHeader title={<span className="text-black">Transaksi</span>} icon={<FiDollarSign className="text-black" />} />
            <CardContent>
              <div className="text-xl font-bold">{pp.transactions} / {totalStats.transactions}</div>
              <div className="w-full bg-gray-300 h-2 rounded-full">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${(pp.transactions / totalStats.transactions) * 100}%`,
                    backgroundColor: '#000000',
                  }}
                />
              </div>
              <div className="text-sm text-black">Transaksi berhasil</div>
            </CardContent>
          </Card>
        </div>

        <br />
        <div className="text-left mb-8">
          <h2 className="text-3xl font-semibold">Dashboard Agen Kuli</h2>
          <p className="text-xl text-black mt-2">Lihat berbagai grafik dan statistik terkait Agen Kuli, Tugas, Klien, dan Transaksi</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Grafik untuk workers */}
        <div className="bg-white p-4 border rounded shadow-lg">
          <h3 className="text-xl text- font-semibold">Grafik Agen Kuli</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.workers}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#000000" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Grafik untuk tasks */}
        <div className="bg-white p-4 border rounded shadow-lg">
          <h3 className="text-xl font-semibold">Grafik Tugas</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.tasks}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#000000" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Grafik untuk clients */}
        <div className="bg-white p-4 border rounded shadow-lg">
          <h3 className="text-xl font-semibold">Grafik Klien</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.clients}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#000000" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Grafik untuk transactions */}
        <div className="bg-white p-4 border rounded shadow-lg">
          <h3 className="text-xl font-semibold">Grafik Transaksi</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.transactions}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#000000" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-black hover:text-gray-800 hover:underline">
            Kembali ke Home
          </Link>
        </div>
      </div>
    );
  }
