import React, { useEffect, useState } from 'react'
import useCarsStore from '../store/carsStore'
import { useNavigate } from 'react-router-dom'

const RecomenedCars = () => {
    const { recommendedCars, toggleFavorite,fetchRecommendedCars } = useCarsStore()

    useEffect(() => {
      fetchRecommendedCars()
    }, [])

    const navigate = useNavigate();
    

    return (
        <div>
            <div className='flex justify-between items-center p-10' >
                <h1 className='text-gray-500 '>Recomended Cars</h1>
                <h1 className='text-blue-500 cursor-pointer' onClick={()=>{navigate("/allCars")}}>View All</h1>
            </div>
            <div className='flex gap-20 justify-center flex-wrap w-full items-center p-10 '>
                {recommendedCars.map((car) => (
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
                            <img src={car.image} alt={car.name} />
                            <div className='flex flex-col p-5'>
                                <div className='flex flex-wrap justify-between items-center'>
                                    <div className='flex items-center gap-2'>
                                        <img src="./gas-station.png" alt="fuel" />
                                        <p>{car.fuel}</p>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <img src="./Car.png" alt="transmission" />
                                        <p>{car.transmission}</p>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <img src="./profile-2user.png" alt="capacity" />
                                        <p>{car.capacity}</p>
                                    </div>
                                </div>
                                <div className='flex justify-between items-center mt-4 flex-wrap '>
                                    <h1 className='text-xl font-bold'>${car.price}<span className='text-gray-500'>/ day</span></h1>
                                    <button className='bg-blue-600 text-white px-4 py-2 rounded-md' onClick={()=>{navigate(`/cars/${car.id}`)}} >Book Now</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}


export default RecomenedCars