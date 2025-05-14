import React, { useEffect, useState } from 'react'
import useCarsStore from '../store/carsStore'
import Loader from '../components/Loader';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';


function valuetext(value) {
  return `${value}`;
}


const Allcars = () => {
  const { fetchAllCars, allCars } = useCarsStore();
  const [catagories, setCatagories] = useState([]);
  const [capacity, setCapacity] = useState([]);
  const [capacityCount, setCapacityCount] = useState({});
  const [priceRange, setPriceRange] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [maxPrices, setMaxPrice] = useState()
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCapacities, setSelectedCapacities] = useState([]);




  useEffect(() => {
    fetchAllCars();
  }, []);

  const filteredCars = allCars?.cars?.filter((car) => {
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(car.category);
    const matchesCapacity = selectedCapacities.length === 0 || selectedCapacities.includes(car.specifications?.seats);
    const matchesPrice = car.price >= priceRange[0] && car.price <= priceRange[1];
    return matchesCategory && matchesCapacity && matchesPrice;
  });
  


  useEffect(() => {
    if (allCars?.cars) {
      const uniqueCategories = [];
      const uniqueCapacities = [];
      const countsByCategory = {};
      const countsByCapacity = {};

      const maxPrice = Math.max(...allCars.cars.map(car => car.price || 0));
      setMaxPrice(maxPrice)
      setPriceRange([0, maxPrice]);


      allCars.cars.forEach((item) => {
        const category = item.category;
        const seats = item.specifications?.seats;

        if (!uniqueCategories.includes(category)) {
          uniqueCategories.push(category);
        }


        if (!uniqueCapacities.includes(seats)) {
          uniqueCapacities.push(seats);
        }

        countsByCategory[category] = (countsByCategory[category] || 0) + 1;
        countsByCapacity[seats] = (countsByCapacity[seats] || 0) + 1;
      });

      setCatagories(uniqueCategories);
      setCategoryCounts(countsByCategory);
      setCapacity(uniqueCapacities);
      setCapacityCount(countsByCapacity);
    }
  }, [allCars]);

  if (!allCars) return <Loader />;





  const handleCheckboxClick = (value, type) => {
    if (type === 'category') {
      setSelectedCategories(prev =>
        prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
      );
    } else if (type === 'capacity') {
      setSelectedCapacities(prev =>
        prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
      );
    }
  };





  // State for price range

  // Slider change handler
  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };






  return (
    <>
      <div className='w-full h-screen flex'>
        <div className='w-[30%] h-full   p-5'>
          <h4 className='font-bold text-md uppercase text-gray-500'>Type</h4>
          {
            catagories.map((items, index) => {
              return (
                <div className='p-2' key={`category-${index}`}>
                  <div className="flex items-center space-x-3">
                    <label className="group flex items-center cursor-pointer">
                      <input
                        className="hidden peer"
                        type="checkbox"
                        onChange={() => handleCheckboxClick(items, 'category')}
                        checked={selectedCategories.includes(items)}
                      />


                      <span
                        className="relative w-8 h-8 flex justify-center items-center bg-gray-100 border-2 border-gray-400 rounded-md shadow-md transition-all duration-500 peer-checked:border-blue-500 peer-checked:bg-blue-500 peer-hover:scale-105"
                      >
                        <span
                          className="absolute inset-0 bg-gradient-to-br from-white/30 to-white/10 opacity-0 peer-checked:opacity-100 rounded-md transition-all duration-500 peer-checked:animate-pulse"
                        ></span>
                        <svg
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          className="hidden w-5 h-5 text-white peer-checked:block transition-transform duration-500 transform scale-50 peer-checked:scale-100"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            clipRule="evenodd"
                            d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                            fillRule="evenodd"
                          ></path>
                        </svg>
                      </span>

                      <span
                        className="ml-3 text-gray-700 group-hover:text-blue-500 font-medium transition-colors duration-300"
                      >
                        {items} <span className='font-light'>({categoryCounts[items]})</span>
                      </span>
                    </label>
                  </div>
                </div>
              )
            })
          }
          <h4 className='font-bold text-md uppercase text-gray-500 mt-10'>CAPACITY</h4>
          {
            capacity.map((items, index) => {
              return (

                <div className='p-2' key={`capacity-${index}`}>
                  <div className="flex items-center space-x-3">
                    <label className="group flex items-center cursor-pointer">
                      <input
                        className="hidden peer"
                        type="checkbox"
                        onChange={() => handleCheckboxClick(items, 'capacity')}
                        checked={selectedCapacities.includes(items)}
                      />


                      <span
                        className="relative w-8 h-8 flex justify-center items-center bg-gray-100 border-2 border-gray-400 rounded-md shadow-md transition-all duration-500 peer-checked:border-blue-500 peer-checked:bg-blue-500 peer-hover:scale-105"
                      >
                        <span
                          className="absolute inset-0 bg-gradient-to-br from-white/30 to-white/10 opacity-0 peer-checked:opacity-100 rounded-md transition-all duration-500 peer-checked:animate-pulse"
                        ></span>
                        <svg
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          className="hidden w-5 h-5 text-white peer-checked:block transition-transform duration-500 transform scale-50 peer-checked:scale-100"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            clipRule="evenodd"
                            d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                            fillRule="evenodd"
                          ></path>
                        </svg>
                      </span>

                      <span
                        className="ml-3 text-gray-700 group-hover:text-blue-500 font-medium transition-colors duration-300"
                      >
                        {items} <span className='font-light'>({capacityCount[items]})</span>
                      </span>
                    </label>
                  </div>
                </div>
              )
            })
          }
          <h4 className='font-bold text-md uppercase text-gray-500 mt-10'>Price</h4>
          <Box sx={{ width: 300 }}>
            <Slider
              getAriaLabel={() => 'Price range'}
              value={priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              getAriaValueText={(val) => `$${val}`}
              min={0}
              max={maxPrices}
              sx={{
                color: '#3563E9',
                '& .MuiSlider-thumb': {
                  border: '2px solid white',
                },
                '& .MuiSlider-track': {
                  backgroundColor: '#3563E9',
                },
                '& .MuiSlider-rail': {
                  backgroundColor: '#90A3BF', // optional lighter rail
                },
              }}
            />
          </Box>

          <p className='mt-2 text-sm text-gray-600'>
            Price range: <span className="font-semibold">${priceRange[0]}</span> – <span className="font-semibold">${priceRange[1]}</span>
          </p>

        </div>
        <div className='flex gap-20 justify-center flex-wrap w-full items-center p-10 '>
          {filteredCars.map((car) => (
            <div key={car.id} className='w-[400px] h-[450px] '>
              <div className='flex flex-col gap-18 p-3'>
                <div className='flex justify-between items-center'>
                  <div>
                    <h1 className='text-xl font-bold mt-2'>{car.name}</h1>
                    <p className='text-gray-500'>{car.type}</p>
                  </div>
                  <img
                    onClick={() => toggleFavorite(car.id)}
                    src={car.isFavorite ? "./heart.png" : "./Like.png"}
                    alt="favorite"
                    className='cursor-pointer w-7 h-7'
                  />
                </div>
                <img src={car.images} alt={car.name} />
                <div className='flex flex-col p-5'>
                  <div className='flex flex-wrap justify-between items-center'>
                    <div className='flex items-center gap-2'>
                      <img src="./gas-station.png" alt="fuel" />
                      <p>{car.specifications.fuelType}</p>
                    </div>
                    <div className='flex items-center gap-2'>
                      <img src="./Car.png" alt="transmission" />
                      <p>{car.specifications.transmission}</p>
                    </div>
                    <div className='flex items-center gap-2'>
                      <img src="./profile-2user.png" alt="capacity" />
                      <p>{car.specifications.seats} People</p>
                    </div>
                  </div>
                  <div className='flex justify-between items-center mt-4 flex-wrap '>
                    <h1 className='text-xl font-bold'>${car.price}<span className='text-gray-500'>/ day</span></h1>
                    <button className='bg-blue-600 text-white px-4 py-2 rounded-md' onClick={() => { navigate(`/cars/${car.id}`) }}>Book Now</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Allcars