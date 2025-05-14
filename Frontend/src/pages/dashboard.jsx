import React, { useEffect, useState } from 'react';
import useCarsStore from '../store/carsStore';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { dashboard, fetchDashboard, bookings, fetchBookingData } = useCarsStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);

  useEffect(() => {
    fetchDashboard();
    fetchBookingData()
  }, []);

  console.log(bookings);

  const navigate = useNavigate()

  // Calculate statistics from dashboard data
  const totalCars = dashboard ? dashboard.length : 0;
  const availableCars = dashboard ? dashboard.filter(car => car.availability === false).length : 0;
  const totalRevenue = bookings ? bookings.reduce((sum, car) => sum + Number(car.totalPrice), 0) : 0;
  const { deleteCars } = useCarsStore();



  const handleDelete = async (id) => {
    try {
      deleteCars({ id });
      setShowDeleteModal(false);
      setCarToDelete(null);
      console.log(id);


    } catch (error) {
      console.error('Error deleting car:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Cars Dashboard</h1>
          <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <h2 className="text-lg font-semibold text-gray-700">Total Cars</h2>
            <p className="text-3xl font-bold text-blue-500 mt-2">{totalCars}</p>
            <p className="text-sm text-gray-500 mt-2">In your fleet</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <h2 className="text-lg font-semibold text-gray-700">Available Cars</h2>
            <p className="text-3xl font-bold text-green-500 mt-2">{availableCars}</p>
            <p className="text-sm text-gray-500 mt-2">Ready for rental</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <h2 className="text-lg font-semibold text-gray-700">Total Revenue</h2>
            <p className="text-3xl font-bold text-yellow-500 mt-2">${totalRevenue.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-2">All time earnings</p>
          </div>
        </div>

        {/* Cars Grid */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Car Fleet</h2>
          <div className="flex flex-col gap-5">
            {dashboard && dashboard.map((car) => (
              <div key={car._id} className="bg-white rounded-xl shadow-sm flex border justify-between p-5">
                <img
                  src={car.images[0]}
                  alt={car.name}
                  className="w-60 h-20 object-contain rounded-lg"
                />
                <div className="flex-1 px-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{car.name}</h3>
                      <p className="text-gray-600 text-sm">{car.brand} {car.model} • {car.year}</p>
                    </div>
                    <p className="text-lg font-bold text-blue-600">${car.price}/day</p>
                  </div>
                  <div className="mt-3 flex items-center gap-4">
                    <span className="text-sm text-gray-600">{car.location}</span>
                    <span className="text-sm text-gray-600">{car.category}</span>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <div>
                      <span
                        className={`py-1 mr-4 rounded-full text-sm ${car.availability
                          ? 'bg-red-100 text-red-800 font-bold'
                          : 'bg-green-100 text-green-800 font-bold'
                          }`}
                      >
                        {car.availability ? 'Rented' : 'Available'}
                      </span>
                      {
                        car.availability ? <span className='p-2 rounded-md cursor-pointer border border-black' onClick={()=>{navigate(`/status/${car._id}`)}}>Check Status</span >
                          : <span></span>
                      }
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center">
                        <span className="text-yellow-400 mr-1">★</span>
                        {car.rating || 'New'}
                      </span>
                      <Link
                        to={`/edit/${car._id}`}
                        state={{ carData: car }}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => {
                          setCarToDelete(car._id);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Delete Car</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this car? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(carToDelete)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;