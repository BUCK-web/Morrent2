import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import useCarsStore from '../store/carsStore';

const EditCar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const { updateCars, deleteCars } = useCarsStore();

    // Initialize form state with the car data
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        model: '',
        year: '',
        price: '',
        category: '',
        location: '',
        description: '',
        images: "",
        availability: true,
        specifications: {
            engine: '',
            transmission: '',
            fuelType: '',
            mileage: '',
            seats: '',
        }
    });

    // Load car data when component mounts
    useEffect(() => {
        if (location.state?.carData) {
            const car = location.state.carData;
            setFormData({
                name: car.name || '',
                brand: car.brand || '',
                model: car.model || '',
                year: car.year || '',
                price: car.price || '',
                category: car.category || '',
                location: car.location || '',
                description: car.description || '',
                availability: car.availability || true,
                images: car.images || "",
                specifications: {
                    engine: car.specifications?.engine || '',
                    transmission: car.specifications?.transmission || '',
                    fuelType: car.specifications?.fuelType || '',
                    mileage: car.specifications?.mileage || '',
                    seats: car.specifications?.seats || '',
                }
            });
        }
    }, [location.state]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('specifications.')) {
            const specField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                specifications: {
                    ...prev.specifications,
                    [specField]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

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


    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateCars({ id, formData });
            navigate('/dashboard');
        } catch (error) {
            console.error('Error updating car:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Edit Car</h1>

                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-gray-600 hover:text-gray-800"
                    >
                        ← Back to Dashboard
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information Section */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>
                        <div>
                            <img src={formData.images} alt={formData.brand} />
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                
                                className="mt-4 mb-5 block w-full p-5 border border-blue-600 outline-none rounded-md"

                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Car Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                                <input
                                    type="text"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                                <input
                                    type="text"
                                    name="model"
                                    value={formData.model}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                                <input
                                    type="text"
                                    name="year"
                                    value={formData.year}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing and Category Section */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Pricing & Category</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Price per Day ($)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Category</option>
                                    <option value="SUV">SUV</option>
                                    <option value="Sedan">Sedan</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Luxury">Luxury</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Location and Availability */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Location & Availability</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                                <select
                                    name="availability"
                                    value={formData.availability}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value={true}>Available</option>
                                    <option value={false}>Not Available</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Specifications Section */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Specifications</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Engine</label>
                                <input
                                    type="text"
                                    name="specifications.engine"
                                    value={formData.specifications.engine}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Transmission</label>
                                <select
                                    name="specifications.transmission"
                                    value={formData.specifications.transmission}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Transmission</option>
                                    <option value="Automatic">Automatic</option>
                                    <option value="Manual">Manual</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
                                <select
                                    name="specifications.fuelType"
                                    value={formData.specifications.fuelType}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Fuel Type</option>
                                    <option value="Petrol">Petrol</option>
                                    <option value="Diesel">Diesel</option>
                                    <option value="Electric">Electric</option>
                                    <option value="Hybrid">Hybrid</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Mileage</label>
                                <input
                                    type="text"
                                    name="specifications.mileage"
                                    value={formData.specifications.mileage}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Seats</label>
                                <input
                                    type="number"
                                    name="specifications.seats"
                                    value={formData.specifications.seats}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Description</h2>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter car description..."
                        ></textarea>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCar; 