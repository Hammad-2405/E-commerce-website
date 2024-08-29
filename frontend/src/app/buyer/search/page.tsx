"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

const SearchResults: React.FC = () => {
  const [results, setResults] = useState<any[]>([]);
  const searchParams = useSearchParams();
  const query = searchParams.get('query');
  const router = useRouter();

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (query) {
        try {
          const response = await fetch(`e-commerce-website-production-ffa9.up.railway.app/api/product/search?query=${query}`);
          const data = await response.json();
          
          console.log('Fetched Search Results:', data); // Debugging line

          if (data && Array.isArray(data.products) && Array.isArray(data.stores)) {
            // Ensure that products and stores are assigned correctly
            const combinedResults = [
              ...data.products.map(product => ({ ...product, type: 'product' })),
              ...data.stores.map(store => ({ ...store, type: 'store' }))
            ];
            setResults(combinedResults);
          } else {
            console.error('Unexpected response format:', data);
            setResults([]);
          }
        } catch (error) {
          console.error('Error fetching search results:', error);
          setResults([]);
        }
      }
    };

    fetchSearchResults();
  }, [query]);

  // Separate results into products and stores
  const products = (results || []).filter(result => result.type === 'product');
  const stores = (results || []).filter(result => result.type === 'store');

  console.log('Products:', products); // Debugging line
  console.log('Stores:', stores); // Debugging line

  const handleAddToCart = (product: any) => {
    // Get the existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');

    // Add the new product to the cart
    const updatedCart = [...existingCart, product];
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    // Show a message to the user
    alert('Product added to cart!');
  };

  // const handleProductClick = (productId: string) => {
  //   router.push(`/product/${productId}`);
  // };

  // const handleStoreClick = (storeId: string) => {
  //   router.push(`/store/${storeId}`);
  // };

  return (
    
    <div className="container mx-auto p-4">
      {/* Navbar */}
      <nav className="bg-black shadow-md mb-4 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white text-2xl">Shopper</h1>
        </div>
      </nav>
      <h2 className="text-2xl font-semibold mb-4">Search Results for "{query}"</h2>

      {/* Display Products */}
      {products.length > 0 ? (
        <div>
          <h3 className="text-2xl font-semibold mb-4">Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products.map(product => (
              <div
                key={product._id}
                className="p-4 border rounded cursor-pointer"
                // onClick={() => handleProductClick(product._id)}
              >
                <h3 className="text-xl font-bold">{product.name}</h3>
                <p>{product.description}</p>
                <p>Price: ${product.price}</p>
                <button onClick={() => handleAddToCart(product)} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded mt-2">
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>No products found</p>
      )}

      {/* Display Stores */}
      {stores.length > 0 ? (
        <div className="mt-8">
          <h3 className="text-2xl font-semibold mb-4">Stores</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {stores.map(store => (
              <div
                key={store._id}
                className="p-4 border rounded cursor-pointer"
                // onClick={() => handleStoreClick(store._id)}
              >
                <h3 className="text-xl font-bold">{store.storeName}</h3>
                <p>Owner: {store.owner}</p>
              </div>
            ))}
          </div>
        </div>
      )
       : (
        <p></p>
      )
      }
    </div>
  );
};

export default SearchResults;
