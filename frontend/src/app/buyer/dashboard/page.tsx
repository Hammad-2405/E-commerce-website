"use client";

import React, { useState, useEffect } from 'react';
import { NavigationMenu } from "@/components/ui/navigation-menu";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const BuyerDashboard: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch random products on page load
    const fetchRandomProducts = async () => {
      try {
        const response = await fetch('e-commerce-website-production-ffa9.up.railway.app/api/product/randomProducts');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching random products:', error);
      }
    };

    fetchRandomProducts();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = () => {
    if (searchTerm.trim() !== '') {
      router.push(`/buyer/search?query=${searchTerm}`);
    }
  };

  // const handleProductClick = (productId: string) => {
  //   router.push(`/product/${productId}`);
  // };

  const cartbutton = () => {
    router.push('/buyer/cart')
  }

  const logoutbutton = () => {
    
    document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    
    // For localStorage
    localStorage.removeItem('sessionData'); // Adjust key as needed
    
    // Redirect to login page
    router.push('/login');
  };

  const handleAddToCart = (product: any) => {
    // Get the existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');

    // Add the new product to the cart
    const updatedCart = [...existingCart, product];
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    // Show a message to the user
    alert('Product added to cart!');
  };
  

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-black shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white text-2xl">Buyer Dashboard</h1>
          <div className="relative flex-grow mx-10">
            <input
              type="text"
              className="w-half p-2 rounded-l"
              placeholder="Search products or stores..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button
              onClick={handleSearchClick}
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-r"
            >
              Search
            </button>
            {searchResults.length > 0 && (
              <div className="absolute bg-white border rounded w-full mt-1 z-10">
                {searchResults.map((result) => (
                  <div
                    key={result._id}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                    // onClick={() => handleProductClick(result._id)}
                  >
                    {result.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button onClick={cartbutton} className="text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded">
            Cart
          </button>
          <button onClick={logoutbutton} className="text-white bg-red-500 hover:bg-red-600 ml-4 px-4 py-2 rounded">
            Log Out
          </button>
        </div>
      </nav>

      {/* Products Display */}
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-4">Products You Might Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id}
                style={{
                  width: '300px',
                  height: '300px',
                  border: '1px solid #ddd',
                  margin: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                // onClick={() => handleProductClick(product._id)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover rounded"
                />
                <h3 className="text-xl font-bold mt-2">{product.name}</h3>
                <button onClick={() => handleAddToCart(product)} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded mt-2">
                  Add to Cart
                </button>
              </div>
            ))
          ) : (
            <p>No products found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
