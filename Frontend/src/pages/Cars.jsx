import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { axiosInstance } from '../utils/axiosInstance';
import useCarsStore from '../store/carsStore';
import Loader from '../components/Loader';
import { useAuthStore } from '../store/authStore';

const Cars = () => {
    const navigate = useNavigate();
    const {user , profile} = useAuthStore();
    const {addCar,loading} = useCarsStore();

    useEffect(() => {
        profile()
    }, [])
    


    const [formData, setFormData] = useState({
        name: '',
        userId: user._id ,
        brand: '',
        model: '',
        year: '',
        category: '',
        price: '',
        description: '',
        location: '',
        images: [],
        specifications: {
            engine: '',
            transmission: '',
            fuelType: '',
            mileage: '',
            seats: '',
            color: ''
        }
    });



    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);
    
        const toBase64 = file =>
            new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });
    
        const base64Images = await Promise.all(files.map(file => toBase64(file)));
    
        setFormData(prev => ({
            ...prev,
            images: base64Images
        }));
    };
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            // const res = await axiosInstance.post('/cars/', formData);
            addCar(formData);
            toast.success('Car added successfully!');
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to add car');
        } 
    };


    if (loading) {
        return <Loader/>
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Add New Car</h1>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm  focus:border-blue-500 focus:ring-blue-500 p-2 outline-none border focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Brand</label>
                                <input
                                    type="text"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 outline-none border focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Model</label>
                                <input
                                    type="text"
                                    name="model"
                                    value={formData.model}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 outline-none border focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Year</label>
                                <input
                                    type="number"
                                    name="year"
                                    value={formData.year}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 outline-none border focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/* Category and Price */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 outline-none border focus:border-blue-500"
                                >
                                    <option value="">Select Category</option>
                                    <option value="SUV">SUV</option>
                                    <option value="Sedan">Sedan</option>
                                    <option value="Hatchback">Hatchback</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Luxury">Luxury</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Price (per day)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 outline-none border focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows={4}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 outline-none border focus:border-blue-500"
                            />
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 outline-none border focus:border-blue-500"
                            />
                        </div>

                        {/* Specifications */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Engine</label>
                                <input
                                    type="text"
                                    name="specifications.engine"
                                    value={formData.specifications.engine}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 outline-none border focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Transmission</label>
                                <select
                                    name="specifications.transmission"
                                    value={formData.specifications.transmission}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 outline-none border focus:border-blue-500"
                                >
                                    <option value="">Select Transmission</option>
                                    <option value="Automatic">Automatic</option>
                                    <option value="Manual">Manual</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Fuel Type</label>
                                <select
                                    name="specifications.fuelType"
                                    value={formData.specifications.fuelType}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 outline-none border focus:border-blue-500"
                                >
                                    <option value="">Select Fuel Type</option>
                                    <option value="Petrol">Petrol</option>
                                    <option value="Diesel">Diesel</option>
                                    <option value="Electric">Electric</option>
                                    <option value="Hybrid">Hybrid</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Mileage (km/l)</label>
                                <input
                                    type="number"
                                    name="specifications.mileage"
                                    value={formData.specifications.mileage}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 outline-none border focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Seats</label>
                                <input
                                    type="number"
                                    name="specifications.seats"
                                    value={formData.specifications.seats}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 outline-none border focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Color</label>
                                <input
                                    type="text"
                                    name="specifications.color"
                                    value={formData.specifications.color}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 outline-none border focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/* Images */}
                        <div >
                            <label className="block text-sm font-medium text-gray-700">Car Images</label>
                            <div className='flex gap-5'>
                            <img src={formData.images[0]} alt="" className='w-30 object-contain border border-blue-600  rounded-lg' />
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                required
                                className="mt-1 block w-full p-5 border border-blue-600 outline-none rounded-md"
                            />
                            </div>
                            <p className="mt-1 text-sm text-gray-500">Upload multiple images of the car</p>
                            {formData.images.length > 0 && (
                                <p className="mt-2 text-sm text-green-600">{formData.images.length} files selected</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                            >
                                {loading ? 'Adding Car...' : 'Add Car'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Cars;