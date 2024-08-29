"use client";
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// import Image from 'next/image';

// Define a type for product
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

const fetchProducts = async (username: string): Promise<Product[]> => {
  try {
    const response = await fetch(`e-commerce-website-production-ffa9.up.railway.app/api/product/viewProducts/${username}`); // Use relative URL
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    console.log(data.products.image)
    return data.products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return []; // Return an empty array in case of error
  }
};

const checkStore = async (username: string): Promise<boolean> => {
    try {
      const response = await fetch(`http://localhost:5000/api/user/checkstore/${username}`);
      const data = await response.json();
      return data.hasStore;
    } catch (error) {
      console.error('Error checking store:', error);
      return false;
    }
  };

const SellerDashboard: React.FC = () => {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    const getProducts = async () => {
      if (session?.user?.username) {
        const products = await fetchProducts(session.user.username);
        setProducts(products);
      } else {
        // Handle case when session or username is not available
        console.error('User is not authenticated or username is missing');
      }
    };
    getProducts();
  }, [session]);

  const handleStoreButtonClick = async () => {
    if (session?.user?.username) {
      console.log('Username:', session.user.username);
      const hasStore = await checkStore(session.user.username);
      if (hasStore) {
        router.push('/seller/addProduct');
      } else {
        router.push('/seller/addStore');
      }
    } else {
      console.error('User is not authenticated or username is missing');
    }
  };

  const showorders = async () => {
    if (session?.user?.username) {
      router.push('/seller/view-orders');
    } else {
      console.error('User is not authenticated or username is missing');
    }
  };  

  const handleLogout = async () => {
    // Sign out and redirect to home page
    await signOut({ redirect: false }); // Use redirect: false to manually control redirection
    setTimeout(() => router.push('/login'), 1000); // Delay before redirecting
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-black shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white text-2xl">Seller Dashboard</h1>
          <div className="space-x-4">
            <button onClick={handleStoreButtonClick} className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">
                Store
            </button>
            <button onClick={showorders} className="text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded">
                Orders
            </button>
            <button onClick={handleLogout} className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded">
                SignOut
            </button>
          </div>
        </div>
      </nav>

      {/* Products Display */}
    <div>
      {/* ... */}

      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-4">Your Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product._id} style={{ width: '300px', height: '300px', border: '1px solid #ddd', margin: '10px', display: 'flex', flexDirection: 'column' }}>
                <img
                  src={product.image}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover rounded"
                />
                <h3 className="text-xl font-bold mt-2">{product.name}</h3>
              </div>
            ))
          ) : (
            <p>No products found</p>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default SellerDashboard;
