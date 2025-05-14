import React from 'react';
import { Link } from 'react-router-dom';

const Success = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded-xl shadow-md text-center">
        <h1 className="text-2xl font-bold text-green-700 mb-4">Payment Successful!</h1>
        <p className="text-gray-700 mb-6">Thank you for your payment. Your rental has been confirmed.</p>
        <Link to="/" className="text-blue-600 hover:underline">
          Go back to Home
        </Link>
      </div>
    </div>
  );
};

export default Success;
