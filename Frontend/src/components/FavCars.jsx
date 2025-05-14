import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCarsStore from '../store/carsStore';
import Loader from './Loader';

const FavCars = () => {
  const { fetchFavoriteCars, favoriteCars, error } = useCarsStore();


  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      await fetchFavoriteCars();
    };
    loadData();
  }, []);


  if (!favoriteCars) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10">
        Failed to load favorite cars: {error}
      </div>
    );
  }

  if (!favoriteCars || favoriteCars.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10">
        You haven’t added any cars to favorites yet.
      </div>
    );
  }

  return (
    <>
      <h1 className='font-bold text-4xl p-6'>Your Favorite Cars</h1>
      <div className="flex flex-wrap justify-center gap-6 p-6">
        {favoriteCars.map((car) => (
          <div key={car._id} className="w-full max-w-sm bg-white rounded-xl shadow-md hover:shadow-lg transition p-4">
            <img
              src={car.images}
              alt={car.name}
              className="w-full h-48 object-contain rounded-md mb-4"
            />

            <div className="flex justify-between items-start mb-2">
              <div>
                <h2 className="text-lg font-bold">{car.name}</h2>
                <p className="text-gray-500 text-sm">{car.type}</p>
              </div>
            </div>

            <div className="flex justify-between text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <img src="/gas-station.png" alt="Fuel" className="w-4 h-4" />
                <span>{car.specifications.fuelType}</span>
              </div>
              <div className="flex items-center gap-1">
                <img src="/Car.png" alt="Transmission" className="w-4 h-4" />
                <span>{car.specifications.transmission}</span>
              </div>
              <div className="flex items-center gap-1">
                <img src="/profile-2user.png" alt="Capacity" className="w-4 h-4" />
                <span>{car.specifications.seats}People</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">${car.price} <span className="text-gray-500 text-sm">/ day</span></span>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                onClick={() => navigate(`/cars/${car._id}`)}
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default FavCars;
