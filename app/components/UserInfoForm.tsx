"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

interface UserInfoFormProps {
  onSubmit: (fullName: string, email: string) => void;
}

export default function UserInfoForm({ onSubmit }: UserInfoFormProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({ fullName: '', email: '' });

  const validateForm = (): boolean => {
    const newErrors = { fullName: '', email: '' };
    let isValid = true;

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(fullName, email);
    }
  };

  return (
    <motion.div
      className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Before we begin</h2>
      <p className="mb-6 text-gray-600">
        Please provide your information so we can personalize your results and send you a copy.
        <span className="text-black font-medium">Your name and email are required for each test submission.</span>
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="fullName" className="block text-gray-700 mb-2 font-medium">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#F3762F] focus:ring-1 focus:ring-[#F3762F] text-gray-800 bg-white"
            placeholder="Enter your full name"
            required
          />
          {errors.fullName && (
            <p className="mt-1 text-red-600 text-sm">{errors.fullName}</p>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="email" className="block text-gray-700 mb-2 font-medium">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#F3762F] focus:ring-1 focus:ring-[#F3762F] text-gray-800 bg-white"
            placeholder="Enter your email address"
            required
          />
          {errors.email && (
            <p className="mt-1 text-red-600 text-sm">{errors.email}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-[#F3762F] hover:bg-[#F3762F]/90 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center"
        >
          Start Test
        </button>
      </form>
    </motion.div>
  );
}
