"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ProductPage: React.FC = () => {
  const [product, setProduct] = useState<any>(null);
  const router = useRouter();
  const { id } = router.query as { id: string };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`e-commerce-website-production-ffa9.up.railway.app/api/product/${id}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    // Assuming the user is logged in and their cart is managed via local storage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const updatedCart = [...cart, product];
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    alert('Product added to cart!');
  };

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Navbar */}
      <nav className="bg-black shadow-md p-4 mb-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white text-2xl">Product Details</h1>
          <button
            className="text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
            onClick={() => router.push('/buyer/dashboard')}
          >
            Back to Dashboard
          </button>
        </div>
      </nav>

      {/* Product Details */}
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 p-4">
          <img
            src={`http://localhost:5000/${product.image.replace(/\\/g, '/')}`}
            alt={product.name}
            className="w-full h-auto object-cover rounded"
          />
        </div>
        <div className="w-full md:w-1/2 p-4">
          <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
          <p className="text-xl mb-4">{product.description}</p>
          <p className="text-2xl font-semibold mb-4">Price: ${product.price}</p>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
