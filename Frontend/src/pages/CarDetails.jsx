import React, { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import useCarsStore from '../store/carsStore';
import { toast } from 'react-toastify';
import { useAuthStore } from '../store/authStore';
import Loader from '../components/Loader';


const CarDetails = () => {
    const { id } = useParams();
    const { error, fetchOneCar, singelCars, avgRating, avgRatings } = useCarsStore();
    const [changeIndex, setChangeIndex] = useState(0);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [hover, setHover] = useState(0);
    const [showAllReviews, setShowAllReviews] = useState(false);
    const { addARewiev } = useCarsStore();
    const { user } = useAuthStore();
    const navigate = useNavigate()


    useEffect(() => {
        if (id) {
            fetchOneCar(id);
            avgRating(id)
        }
    }, [id]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }
        if (!comment.trim()) {
            toast.error('Please write a review');
            return;
        }

        try {
            const newReview = {
                user: user.username,
                comment,
                rating,
                date: new Date().toLocaleDateString()
            };

            await addARewiev({ data: { comment, ratings: rating }, id });

            singelCars.reviews = [...(singelCars.reviews || []), newReview];

            toast.success('Review submitted successfully!');
            setRating(0);
            setComment('');
        } catch (err) {
            toast.error("Failed to submit review");
        }
    };


    if (error) {
        toast.error(error);
        return null;
    }

    if (!singelCars) {
        return <Loader/>
    }


    function convertToLocalTime(isoString) {
        const date = new Date(isoString);

        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
            timeZoneName: "short"
        };

        return date.toLocaleString("en-US", options);
    }

    

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-10">
            {/* Header Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-indigo-700 text-white p-6 rounded-2xl relative overflow-hidden col-span-2">
                    <h2 className="text-xl font-semibold mb-1">{singelCars.brand} {singelCars.model}</h2>
                    <p className="text-indigo-100">{singelCars.description}</p>
                    <img
                        src={singelCars.images[changeIndex]}
                        alt={singelCars.name}
                        className="absolute right-6 bottom-0 w-[280px] h-20 object-contain drop-shadow-xl"
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold">{singelCars.name}</h1>
                            <div className="text-sm text-gray-600 flex items-center gap-1">
                                <FaStar className="text-amber-500" /> {avgRatings.avgRating || 'No ratings yet'} • {singelCars.reviews?.length || 0} Reviews
                            </div>
                            <p className="text-gray-700 text-sm mt-2">
                                {singelCars.description}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                        <p><span className="font-medium text-gray-900">Type:</span> {singelCars.category}</p>
                        <p><span className="font-medium text-gray-900">Seats:</span> {singelCars.specifications.seats}</p>
                        <p><span className="font-medium text-gray-900">Transmission:</span> {singelCars.specifications.transmission}</p>
                        <p><span className="font-medium text-gray-900">Fuel:</span> {singelCars.specifications.fuelType}</p>
                        <p><span className="font-medium text-gray-900">Mileage:</span> {singelCars.specifications.mileage} km</p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        <div>
                            <span className="text-xl font-bold text-indigo-700">${singelCars.price}.00</span>
                            <span className="text-sm text-gray-600"> / day</span>
                        </div>
                        <button className="bg-indigo-700 text-white px-6 py-2 rounded-lg hover:bg-indigo-800 transition" onClick={()=>{navigate(`/payment/${id}`)}}>Rent Now</button>
                    </div>
                </div>
            </div>

            {/* Thumbnails */}
            {singelCars.images.length > 1 && (
                <div className="flex gap-4 mt-6">
                    {singelCars.images.map((image, index) => (
                        <img key={index} src={image} onClick={() => { setChangeIndex(index) }} alt="Thumbnail" className="w-32 h-20 rounded-lg object-cover shadow-md hover:ring-2 hover:ring-indigo-500 transition cursor-pointer" />
                    ))}
                </div>
            )}

            {/* Review Form Section */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h2 className="text-xl font-bold mb-4 text-gray-900">Write a Review</h2>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                        <div className="flex gap-1">
                            {[...Array(5)].map((_, index) => {
                                const ratingValue = index + 1;
                                return (
                                    <label key={index}>
                                        <input
                                            type="radio"
                                            name="rating"
                                            value={ratingValue}
                                            onClick={() => setRating(ratingValue)}
                                            className="hidden"
                                        />
                                        <FaStar
                                            className="cursor-pointer"
                                            size={24}
                                            color={ratingValue <= (hover || rating) ? "#f59e0b" : "#e4e5e9"}
                                            onMouseEnter={() => setHover(ratingValue)}
                                            onMouseLeave={() => setHover(0)}
                                        />
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            rows="4"
                            placeholder="Share your experience with this car..."
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-indigo-700 text-white px-6 py-2 rounded-lg hover:bg-indigo-800 transition"
                    >
                        Submit Review
                    </button>
                </form>
            </div>

            {/* Reviews Section */}
            <div className="bg-gray-50 rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4 text-gray-900">Reviews <span className="px-2 py-1 rounded text-white ml-5 text-sm bg-indigo-600">{singelCars.reviews?.length || 0}</span></h2>
                <div className='flex flex-col gap-10'>
                    {
                        singelCars.reviews && singelCars.reviews
                            .slice(0, showAllReviews ? undefined : 3)
                            .map((items) => {
                            return (
                                <>
                                    <div className='flex flex-col gap-5 w-full justify-between p-5 bg-white rounded-xl shadow-sm' key={items._id}>
                                        <div className='flex w-full justify-between'>
                                            <div className='' key={items._id}>
                                                <div className='flex gap-2'>
                                                    <img src={items.profilePicture || user.profilePicture} alt={items.user} className='w-20 h-20 rounded-full border-2 border-indigo-100 object-cover' />
                                                    <h1 className='font-bold text-lg text-gray-900'>{items.user}</h1>
                                                </div>
                                            </div>
                                            <div className='' >
                                                <div className='flex flex-col gap-2'>
                                                    <h1 className='text-gray-600'>{convertToLocalTime(items.date).slice(0, 15).replace(",", " ")}</h1>
                                                    <div className="flex justify-end">
                                                        {[...Array(5)].map((_, index) => (
                                                            <FaStar
                                                                key={index}
                                                                size={12}
                                                                color={index < items.rating ? "#f59e0b" : "#e4e5e9"}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='w-[90%] p-5 bg-gray-50 rounded-lg'>
                                            <p className="text-gray-700">{items.comment}</p>
                                        </div>
                                    </div>
                                </>
                            )
                        })
                    }
                </div>
                {singelCars.reviews && singelCars.reviews.length > 3 && (
                    <div className="text-center mt-4">
                        <button 
                            className="text-indigo-700 hover:text-indigo-900 font-medium hover:underline"
                            onClick={() => setShowAllReviews(!showAllReviews)}
                        >
                            {showAllReviews ? 'Show Less' : 'Show All'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CarDetails;
