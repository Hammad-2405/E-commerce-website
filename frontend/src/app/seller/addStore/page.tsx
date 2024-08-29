"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Form } from '@/components/ui/form';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useSession } from 'next-auth/react';

const AddStorePage: React.FC = () => {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    name: '',
    owner: '', // Initially empty
    products: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const router = useRouter();

  // Set the owner field once the session is available
  useEffect(() => {
    if (session?.user?.username) {
      setFormData((prevData) => ({
        ...prevData,
        owner: session.user.username,
      }));
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.username) {
      setError('You must be logged in to create a store.');
      return;
    }

    try {
      const response = await fetch(`e-commerce-website-production-ffa9.up.railway.app/api/user/addStore`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccessMessage('Store created successfully!');
        setError(null);
      } else {
        const { message } = await response.json();
        setError(message || 'An error occurred while creating the store. Please try again.');
      }
    } catch (error) {
      console.error('Error in creating store:', error);
      setError('Failed to create store. Please check your connection and try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold">Create Store</h2>
          <p className="text-gray-600">Enter Store Details</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="name">Store Name</Label>
            <Input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          {error && (
            <div className="mb-4 text-red-500">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 text-green-500">
              {successMessage}
            </div>
          )}
          <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded">
            Create Store
          </Button>
        </form>
        <div className="mt-6 text-center">
          <Button 
            onClick={() => router.push('/seller/dashboard')}
            className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded">
            Back to Home
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AddStorePage;

