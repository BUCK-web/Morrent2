import React from 'react';
import { Link } from 'react-router-dom';

const Cancel = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="bg-white p-8 rounded-xl shadow-md text-center">
        <h1 className="text-2xl font-bold text-red-700 mb-4">Payment Cancelled</h1>
        <p className="text-gray-700 mb-6">It looks like your payment was not completed.</p>
        <Link to="/" className="text-blue-600 hover:underline">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default Cancel;
