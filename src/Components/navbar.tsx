"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <nav className="bg-white text-black p-4 fixed w-full shadow-md z-10">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Mobile Menu */}
        {isOpen && (
          <ul className="md:hidden mt-2 space-y-2 bg-black p-4 rounded">
            <li>
              <Link href="/" className="block text-white hover:text-gray-300">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/" className="block text-white hover:text-gray-300">
                Agen Kuli
              </Link>
            </li>
            <li>
              <Link href="/users" className="block text-white hover:text-gray-300">
                User Management
              </Link>
            </li>
            <li>
              <Link href="/" className="block text-white hover:text-gray-300">
                Tugas
              </Link>
            </li>
            <li>
              <Link href="/" className="block text-white hover:text-gray-300">
                Transaksi
              </Link>
            </li>
          </ul>
        )}

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6">
          <li>
            <Link href="/" className="hover:text-gray-600">Dashboard</Link>
          </li>
          <li>
            <Link href="/" className="hover:text-gray-600">Agen Kuli</Link>
          </li>
          <li>
            <Link href="/users" className="hover:text-gray-600">User Management</Link>
          </li>
          <li>
            <Link href="/" className="hover:text-gray-600">Tugas</Link>
          </li>
          <li>
            <Link href="/" className="hover:text-gray-600">Transaksi</Link>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>

        {/* Logo + Search Bar */}
        <div className="flex items-center space-x-4">
           {/* Search Input */}
           <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 px-3 py-1 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
          />
          {/* Logo */}
          <Image src="/images/logo.png" alt="Agen Kuli Logo" width={50} height={50} />

         
        </div>
      </div>
    </nav>
  );
}
