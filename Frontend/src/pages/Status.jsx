import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useCarsStore from '../store/carsStore';

const Status = () => {
  const { id } = useParams();
  const { singelCars, fetchOneCar, fetchOneBookingData,oneBookingData} = useCarsStore();

  useEffect(() => {
    if (id) fetchOneCar(id);
    if(id) fetchOneBookingData(id)
  }, [id, fetchOneCar]);

  // Show loading or fallback if data is not ready
  if (!singelCars || !oneBookingData || Object.keys(singelCars).length === 0) {
    return <div className="text-center text-lg py-10">Loading car details...</div>;
  }

  const {
    name,
    brand,
    model,
    year,
    category,
    price,
    description,
    specifications,
    location,
    rating,
    availability,
    images,
  } = singelCars;
  console.log()  

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {images?.[0] && (
          <img
            src={images[0]}
            alt={name}
            className="w-full h-64 object-cover"
          />
        )}
        <div className="p-6">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
              <p className="text-gray-600 mt-1">{brand} • {model} • {year}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${availability ? 'bg-green-100 text-red-800' : 'bg-red-100 text-green-800'}`}>
              {availability ? 'Unavailable' : 'Available'}
            </span>
          </div>

          <p className="mt-4 text-gray-700">{description || "No description provided."}</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 text-sm text-gray-700">
            <div><strong>Category:</strong> {category}</div>
            <div><strong>Mileage:</strong> {specifications?.mileage} km</div>

            <div><strong>Engine:</strong> {specifications?.engine}</div>
            <div><strong>Transmission:</strong> {specifications?.transmission}</div>
            <div><strong>Fuel Type:</strong> {specifications?.fuelType}</div>
            <div><strong>Seats:</strong> {specifications?.seats}</div>
            <div><strong>Color:</strong> {specifications?.color}</div>
            <div><strong>Location:</strong> {location}</div>
            <div><strong>Toal Price:</strong> {oneBookingData[0].totalPrice}</div>
            <div><strong>Rating:</strong> {rating} ⭐</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Status;
