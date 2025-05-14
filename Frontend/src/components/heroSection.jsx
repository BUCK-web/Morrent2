import React from 'react'
import { useNavigate } from 'react-router-dom'

const HeroSection = () => {
    const navigate = useNavigate();
    return (
        <div className='flex gap-4 items-center justify-center p-10 flex-wrap'>
            <div className='relative'>
                {/* Text Content */}
                <div className='absolute top-6 left-6 flex flex-col gap-4 items-start z-10'>
                    <h1 className='text-lg sm:text-4xl font-bold text-white leading-snug'>
                        The Best Platform <br /> for Car Rental
                    </h1>
                    <p className='text-sm sm:text-base text-white'>
                        Ease of doing a car rental safely and <br /> reliably. Of course at a low price.
                    </p>
                    <button className='bg-blue-600 text-white px-4 py-2 rounded-md text-sm sm:text-base cursor-pointer' onClick={()=>{navigate("/allcars")}}>
                        Rental Car
                    </button>
                </div>

                {/* Background Image */}
                <img
                    src="./Ads 1.png"
                    alt="Ad Background"
                    className='w-full h-[30vh] object-cover rounded-md sm:h-full'
                />

                {/* Overlay Car Image */}
                <img
                    src="./image 7.png"
                    alt="Overlay Car"
                    className='absolute w-52 sm:w-[60%] sm:top-2/3 sm:left-1/3 bottom-0 left-2/5'
                />
            </div>

            <div className='relative hidden sm:block'>
                <div className='absolute mt-8 ml-8 flex flex-col gap-5 items-start'>
                    <h1 className='text-4xl font-bold text-white'>Easy way to rent a <br /> car at a low price</h1>
                    <p className='text-white'>Providing cheap car rental services <br /> and safe and comfortable facilities.</p>
                    <button className='bg-blue-400 text-white px-4 py-2 rounded-md cursor-pointer' onClick={()=>{navigate("/allcars")}}>Rental Car</button>
                </div>
                <img src="./Ads 2.png" alt="" className='w-full' />
                <img src="./image 8.png" alt="" className='absolute top-2/3 left-1/3' />
            </div>
        </div>
    )
}

export default HeroSection