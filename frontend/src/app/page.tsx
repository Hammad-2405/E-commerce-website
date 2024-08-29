"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-black shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white text-2xl">Shopper Marketplace</h1>
          <div className="space-x-4">
            <Link href="/login">
              <button onClick={() => router.push('/login')} className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">
                Login
              </button>
            </Link>
            <Link href="/register">
              <button  onClick={() => router.push('/register')} className="text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded">
                Signup
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto flex justify-between items-center mt-10">
        {/* Left Side: Text */}
        <div className="text-4xl font-bold text-gray-800">
          Find And Sell Whatever You Want
        </div>

        {/* Right Side: Image */}
        <div>
          <Image
            src="/home-page.jpg"
            alt="Home Page"
            width={500}
            height={300}
            className="rounded"
          />
        </div>
      </div>
    </div>
  );
}
