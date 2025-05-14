import React from 'react';
import { useAuth } from '../store/authStore';
import { Link } from 'react-router-dom';

const Profile = () => {
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-4">Please log in to view your profile</h2>
                    <Link to="/login" className="text-blue-500 hover:underline">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                {/* Profile Header */}
                <div className="flex items-center space-x-6 mb-8">
                    <img
                        src={user.profilePicture || './default-avatar.png'}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover"
                    />
                    <div>
                        <h1 className="text-3xl font-bold">{user.username}</h1>
                        <p className="text-gray-600">{user.email}</p>
                        <Link
                            to="/settings"
                            className="mt-2 inline-block text-blue-500 hover:text-blue-600"
                        >
                            Edit Profile
                        </Link>
                    </div>
                </div>

                {/* User Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                            <p className="mt-1">{user.phone || 'Not provided'}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Address</h3>
                            <p className="mt-1">{user.address || 'Not provided'}</p>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Bio</h3>
                        <p className="mt-1">{user.bio || 'No bio provided'}</p>
                    </div>
                </div>

                {/* User Activity */}
                <div className="border-t pt-6">
                    <h2 className="text-xl font-semibold mb-4">Your Activity</h2>
                    
                    {/* Recent Bookings */}
                    <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2">Recent Bookings</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-600">No recent bookings</p>
                        </div>
                    </div>

                    {/* Favorite Cars */}
                    <div>
                        <h3 className="text-lg font-medium mb-2">Favorite Cars</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-600">No favorite cars yet</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile; 