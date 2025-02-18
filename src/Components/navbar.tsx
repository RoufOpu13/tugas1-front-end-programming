"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white text-black p-4 fixed top-0 left-0 right-0 z-10 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Mobile Menu */}
        {isOpen && (
          <ul className="md:hidden mt-2 space-y-2 bg-black p-4 rounded">
            <li>
              <Link href="/" className="block text-white hover:text-black">Dashboard</Link>
            </li>
            <li>
              <Link href="/" className="block text-white hover:text-black">Agen Kuli</Link>
            </li>
            <li>
              <Link href="/" className="block text-white hover:text-black">Klien</Link>
            </li>
            <li>
              <Link href="/" className="block text-white hover:text-black">Tugas</Link>
            </li>
            <li>
              <Link href="/" className="block text-white hover:text-black">Transaksi</Link>
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
            <Link href="/" className="hover:text-gray-600">Klien</Link>
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
        
        {/* Logo */}
        <div className="flex justify-center items-center">
          <Image src="/images/logo.png" alt="Agen Kuli Logo" width={50} height={50} />
        </div>
      </div>
    </nav>
  );
}
