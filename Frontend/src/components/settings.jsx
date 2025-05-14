import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Loader from './Loader';
import { toast } from 'react-toastify';

const Settings = () => {
    const { user, profile, updateProfile, logout, isLoading ,error } = useAuthStore();
    const navigate = useNavigate();
    const [image, setImage] = useState("");
    const [role, setRole] = useState()
    const [formData, setFormData] = useState({
        profilePicture: "",
        username: '',
        email: '',
        phone: '',
    });


    useEffect(() => {
        if (user) {
            profile()
        }
    }, []);




    useEffect(() => {
        if (user) {
            setFormData({
                profilePicture: user.profilePicture || "",
                username: user.username || '',
                email: user.email || '',
                phone: user.phoneNumber || '',
            });
            setImage(user.profilePicture || '');
            setRole(user.role)
        }
    }, [user]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
                setFormData(prev => ({
                    ...prev,
                    profilePicture: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Create a copy of formData
            const dataToSend = { ...formData };

            // Remove profilePicture if it contains "default" in the filename
            if (dataToSend.profilePicture?.includes("default")) {
                delete dataToSend.profilePicture;
            }

            await updateProfile(dataToSend);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    if (error) {
        toast.error(error)
    }
    

    if (isLoading ) {
        return (
            <Loader />
        )
    }


    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Settings</h1>

                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Profile Picture */}
                        <div className="flex items-center space-x-6 justify-between">
                            <div className="relative flex gap-5 items-center">
                                <img
                                    src={image}
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                                />
                                <div>

                                    <h2 className="text-xl font-semibold text-gray-800">Profile Picture</h2>
                                    <p className="text-gray-600">Click to change your profile picture</p>
                                    <p className={user?.role === "admin" ? "text-green-600 font-bold uppercase" : "text-red-600 font-bold uppercase"}>
                                        {user?.role}
                                    </p>
                                </div>

                                <label className="absolute top-25 left-20 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition duration-300">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                    </svg>
                                </label>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                            >
                                Logout
                            </button>
                        </div>

                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="outline-none border border-blue-600 p-5 mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Enter your username"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="outline-none border border-blue-600 p-5 mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Enter your email"
                                disabled
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="outline-none border border-blue-600 p-5 mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Enter your phone number"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                    <div className="flex space-x-4 flex-wrap items-center justify-center gap-5 mt-10">
                        {
                            role === "admin" ? <div className=' flex flex-wrap gap-5 items-center justify-center'>
                                <Link
                                    to="/cars"
                                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                                >
                                    Add a car
                                </Link>
                                <Link
                                    to="/dashboard"
                                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-300"
                                >
                                    Car Dashboard
                                </Link></div> : <div></div>
                        }

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;