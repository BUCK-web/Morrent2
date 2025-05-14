import React, { useEffect, useState } from 'react';
import useCarsStore from '../store/carsStore';
import { useParams } from 'react-router-dom';

const Payment = () => {
  const { fetchOneCar, singelCars, makePayment } = useCarsStore();
  const { id } = useParams();
  const [rentalDays, setRentalDays] = useState(1);
  const [pickupDate, setPickupDate] = useState('');

  useEffect(() => {
    if (id) {
      fetchOneCar(id);
    }
  }, [id]);

  if (!singelCars) return <p className="p-6 text-center">Loading...</p>;

  const {
    name,
    brand,
    location,
    price,
    year,
    images,
  } = singelCars;

  const pricePerDay = parseInt(price);
  const insuranceFee = 50;
  const tax = 0.05 * (pricePerDay * rentalDays);
  const total = pricePerDay * rentalDays + insuranceFee + tax;

  const handlePickupDateChange = (e) => {
    setPickupDate(e.target.value);
  };

  const calculateDropOffDate = (pickupDate, rentalDays) => {
    const pickup = new Date(pickupDate);
    pickup.setDate(pickup.getDate() + rentalDays);
    return pickup;
  };

  const dropOffDate = pickupDate ? calculateDropOffDate(pickupDate, rentalDays) : null;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
      <div className="max-w-xl w-full bg-white p-6 rounded-2xl shadow-md space-y-6">
        <h2 className="text-2xl font-bold text-center">Confirm & Pay</h2>

        {/* Car Details */}
        <div className="flex items-center gap-4 border-b pb-4">
          <img
            src={images?.[0]}
            alt={name}
            className="h-20 w-28 object-cover rounded-xl"
          />
          <div>
            <h3 className="text-lg font-semibold">{name} ({year})</h3>
            <p className="text-sm text-gray-500">{brand} • {location}</p>
          </div>
        </div>

        {/* Rental Details */}
        <div className="space-y-2 text-sm text-gray-800">
          <div>
            <label className="font-medium block mb-1">Pickup Date</label>
            <input
              type="date"
              value={pickupDate}
              onChange={handlePickupDateChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {dropOffDate && (
            <p>
              <strong>Drop-off:</strong> {dropOffDate.toLocaleDateString()} @ 10:00 AM
            </p>
          )}

          <div className="flex items-center gap-2">
            <label className="font-medium">Duration:</label>
            <input
              type="number"
              min="1"
              value={rentalDays}
              onChange={(e) => setRentalDays(Number(e.target.value))}
              className="w-20 border rounded px-2 py-1 text-center"
            />
            <span>days</span>
          </div>

          <p>
            <strong>Driver:</strong> Self-drive
          </p>
        </div>

        {/* Price Summary */}
        <div className="space-y-1 text-sm">
          <h4 className="font-semibold mb-2">Price Summary</h4>
          <div className="flex justify-between">
            <span>{rentalDays} × ${pricePerDay}/day</span>
            <span>${pricePerDay * rentalDays}</span>
          </div>
          <div className="flex justify-between">
            <span>Insurance Fee</span>
            <span>${insuranceFee}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (5%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between font-bold text-base">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Button */}
        <button
          onClick={() => {
            const startDate = pickupDate;
            const endDate = dropOffDate.toISOString();
            makePayment({
              id: singelCars._id,
              startDate,
              endDate,
              totalPrice: total.toFixed(2),
              name: singelCars.name,
              year: singelCars.year,
              brand: singelCars.brand,
              location: singelCars.location,
              images: singelCars.images,
            });
          }}
          
          disabled={!pickupDate}
          className={`w-full py-3 rounded-xl font-semibold text-white transition ${
            pickupDate ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Pay ${total.toFixed(2)}
        </button>
      </div>
    </div>
  );
};

export default Payment;
