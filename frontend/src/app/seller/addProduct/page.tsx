"use client";
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {Card} from '@/components/ui/card';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';

const AddProductPage: React.FC = () => {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: null as File | null,  // Image file
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,  // Handle file upload
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.username) {
      setError('You must be logged in to add a product.');
      return;
    }

    const productData = new FormData();
    productData.append('name', formData.name);
    productData.append('description', formData.description);
    productData.append('price', formData.price);
    productData.append('image', formData.image as File);  // Append image file
    productData.append('seller', session.user.username);

    try {
      const response = await fetch('e-commerce-website-production-ffa9.up.railway.app/api/product/addproduct', {
        method: 'POST',
        body: productData,  // Send as FormData
      });

      if (response.ok) {
        setSuccessMessage('Product added successfully!');
        setError(null); // Clear any existing errors
      } else {
        const { message } = await response.json();
        setError(message || 'An error occurred while adding the product. Please try again.');
      }
    } catch (error) {
      console.error('Error in adding product:', error);
      setError('Failed to add product. Please check your connection and try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold">Add Product</h2>
          <p className="text-gray-600">Enter Product Details</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="description">Description</Label>
            <Input
              type="text"
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="price">Price</Label>
            <Input
              type="number"
              name="price"
              id="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="image">Product Image</Label>
            <Input
              type="file"  // Changed to file input
              name="image"
              id="image"
              accept="image/*"
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
            Add Product
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

export default AddProductPage;
