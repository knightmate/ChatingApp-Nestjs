import React, { useState } from 'react';
import axios from 'axios';

interface RegisterProps {
  onRegister: (token: string) => void;
}

function Register({ onRegister }: RegisterProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://lions-psychiatry-till-mood.trycloudflare.com
/auth/register', {
        username,
        email,
        password,
      });
      onRegister(response.data.access_token);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-4">
        <label htmlFor="username" className="block mb-1">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border p-1"
          placeholder="Enter your username"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block mb-1">Email Address</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-1"
          placeholder="Enter your email"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="block mb-1">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-1"
          placeholder="Enter your password"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-gray-200 px-4 py-1 rounded"
      >
        Register
      </button>
    </form>
  );
}

export default Register; 