"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Form } from '@/components/ui/form';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    role: 'buyer', // default value
  });
  const [error, setError] = useState<string | null>(null); // Error state

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`e-commerce-website-production-ffa9.up.railway.app/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("API hitted register");

      if (response.ok) {
        if (data.success) {
          router.push('/login'); // Redirect to login page after successful registration
        } else {
          setError(data.error || 'An unknown error occurred');
        }
      } else {
        setError('An error occurred while registering. Please try again.');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setError('Registration failed. Please check your connection and try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold">Register</h2>
          <p className="text-gray-600">Enter Your Details</p>
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
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="username">Username</Label>
            <Input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-6">
            <Label htmlFor="role">Role</Label>
            <select
              name="role"
              id="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
          </div>
          {error && (
            <div className="mb-4 text-red-500">
              {error}
            </div>
          )}
          <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded">
            Register
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default RegisterPage;
