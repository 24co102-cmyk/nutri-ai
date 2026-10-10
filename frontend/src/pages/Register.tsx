// src/pages/Register.tsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const auth = useContext(AuthContext)!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await auth.register(name, email, password);
      navigate('/onboarding');
    } catch (err: any) {
      console.error(err);
      const message = err.response?.data?.detail || 'Registration failed';
      alert(message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white rounded shadow">
      <h2 className="text-2xl mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="w-full bg-teal-500 text-white p-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
