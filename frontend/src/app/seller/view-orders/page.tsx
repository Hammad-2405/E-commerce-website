"use client";
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface Order {
  _id: string;
  product?: {
    name?: string;
    price?: number;
  };
  quantity: number;
  buyer?: {
    username?: string;
  };
}

const ViewOrders: React.FC = () => {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (session?.user?.username) {
        try {
          const response = await fetch(`e-commerce-website-production-ffa9.up.railway.app/api/order/viewSellerOrders/${session.user.username}`);
          if (!response.ok) {
            throw new Error('Failed to fetch orders');
          }
          const data = await response.json();
          console.log('Fetched data:', data); // Debugging
          if (data.success) {
            setOrders(data.data); // Update to match the response format
          } else {
            console.error(data.error);
          }
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
      }
    };

    fetchOrders();
  }, [session]);

  return (
    <div>
      <nav className="bg-black shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white text-2xl">Seller Orders</h1>
        </div>
      </nav>
      
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>
        <div>
          {orders.length > 0 ? (
            <ul>
              {orders.map(order => (
                <li key={order._id} className="border p-4 mb-4 rounded">
                  <h3 className="text-xl font-bold">{order.product?.name || 'No name available'}</h3>
                  <p>Price: ${order.product?.price ?? 'Price not available'}</p>
                  <p>Quantity: {order.quantity}</p>
                  <p>Buyer: {order.buyer?.username || 'No buyer info available'}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No orders found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewOrders;
