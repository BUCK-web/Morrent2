import { create } from 'zustand'
import axios from 'axios'
import { axiosInstance } from '../utils/axiosInstance'
import { loadStripe } from '@stripe/stripe-js'

const useCarsStore = create((set, get) => ({
    popularCars: [],
    recommendedCars: [],
    allCars : null , 
    loading: false,
    error: null,
    dashboard: null,
    singelCars: null,
    avgRatings: 0,
    bookings : [],
    oneBookingData : null, 
    favoriteCars : null,

    // Fetch popular cars
    fetchPopularCars: async () => {
        try {
            set({ loading: true, error: null })
            const response = await axiosInstance.get('/cars/popular')
            const formattedCars = response.data.map(car => ({
                id: car._id,
                name: car.name,
                type: car.category,
                image: car.images[0] || './default-car.png',
                fuel: car.specifications.fuelType,
                transmission: car.specifications.transmission,
                capacity: `${car.specifications.seats} People`,
                price: car.price,
                isFavorite: false,
                rating: car.rating,
                bookings: car.bookings
            }))
            set({ popularCars: formattedCars, loading: false })
        } catch (error) {
            set({ error: error.message, loading: false })
            console.error('Error fetching popular cars:', error)
        }
    },

    fetchAllCars : async ()=>{
        try {
            const res = await axiosInstance.get("/cars/all")
            set({allCars : res.data})
        } catch (error) {
            set({error : error})
            
        }
    },

    // Fetch recommended cars
    fetchRecommendedCars: async () => {
        try {
            set({ loading: true, error: null })
            const response = await axiosInstance.get('/cars/recommended')
            const formattedCars = response.data.map(car => ({
                id: car._id,
                name: car.name,
                type: car.category,
                image: car.images[0] || './default-car.png',
                fuel: car.specifications.fuelType,
                transmission: car.specifications.transmission,
                capacity: `${car.specifications.seats} People`,
                price: car.price,
                isFavorite: false,
                rating: car.rating,
                bookings: car.bookings
            }))
            set({ recommendedCars: formattedCars, loading: false })
        } catch (error) {
            set({ error: error.message, loading: false })
            console.error('Error fetching recommended cars:', error)
        }
    },

    // Toggle favorite status for a car
    toggleFavorite: async (carId) => {
        // Optimistic update (optional but gives fast UI feedback)
        set((state) => ({
            popularCars: state.popularCars.map(car =>
                car.id === carId
                    ? { ...car, isFavorite: !car.isFavorite }
                    : car
            ),
            recommendedCars: state.recommendedCars.map(car =>
                car.id === carId
                    ? { ...car, isFavorite: !car.isFavorite }
                    : car
            ),
            error: null,
        }));
    
        try {
            const res = await axiosInstance.post(`/users/favorites/${carId}`);
            console.log(res.data);
            
            const updatedFavorites = res.data.favorites;
    
            // Sync state with server response to ensure accuracy
            set((state) => ({
                popularCars: state.popularCars.map(car => ({
                    ...car,
                    isFavorite: updatedFavorites.includes(car.id),
                })),
                recommendedCars: state.recommendedCars.map(car => ({
                    ...car,
                    isFavorite: updatedFavorites.includes(car.id),
                })),
            }));
        } catch (error) {
            console.error("Failed to toggle favorite:", error.message);
    
            set({ error: error.message });
    
            // Optional: revert optimistic update if needed
            // Or notify user to refresh for consistency
        }
    },
    fetchFavoriteCars : async ()=>{
        try {
            const res = await axiosInstance.get(`/users/favorites`);            
            const updatedFavorites = res.data.favorites;
    
            // Sync state with server response to ensure accuracy
            set((state) => ({
                popularCars: state.popularCars.map(car => ({
                    ...car,
                    isFavorite: updatedFavorites.includes(car.id),
                })),
                recommendedCars: state.recommendedCars.map(car => ({
                    ...car,
                    isFavorite: updatedFavorites.includes(car.id),
                })),

                favoriteCars : res.data.Cars
            }));


        } catch (error) {
            console.error("Failed to toggle favorite:", error.message);
    
            set({ error: error.message });
    
            // Optional: revert optimistic update if needed
            // Or notify user to refresh for consistency
        }
    },
    

    // Get all favorite cars
    getFavorites: () => {
        const state = get()
        return [
            ...state.popularCars.filter(car => car.isFavorite),
            ...state.recommendedCars.filter(car => car.isFavorite)
        ]
    },

    // Add a new car (admin only)
    addCar: async (newCar) => {
        try {
            set({ loading: true, error: null })
            const response = await axiosInstance.post('/cars/', newCar)
            const formattedCar = {
                id: response.data.savedCar._id,
                name: response.data.savedCar.name,
                type: response.data.savedCar.category,
                image: response.data.savedCar.images || './default-car.png',
                fuel: response.data.savedCar.specifications.fuelType,
                transmission: response.data.savedCar.specifications.transmission,
                capacity: `${response.data.savedCar.specifications.seats} People`,
                price: response.data.savedCar.price,
                isFavorite: false,
                rating: response.data.savedCar.rating,
                bookings: response.data.savedCar.bookings
            }
            set(state => ({
                popularCars: [...state.popularCars, formattedCar],
                loading: false
            }))
        } catch (error) {
            set({ error: error.message, loading: false })
            console.error('Error adding car:', error)
        }
    },


    fetchDashboard: async () => {
        try {
            const res = await axiosInstance.get("/cars/dashboard")
            set({ dashboard: res.data })
            console.log(res.data);

        } catch (error) {
            console.log(error.message);
        }
    },

    updateCars: async ({ formData, id }) => {
        try {
            set({ loading: true })
            const res = axiosInstance.put(`cars/${id}`, formData)
            // console.log(formData,id);
            set({ loading: false })

        } catch (error) {
            set({ error: error.message });


        }
    },

    deleteCars: async ({ id }) => {
        try {
            set({ loading: true });
            await axiosInstance.delete(`/cars/${id}`);

            // Update dashboard state after successful deletion
            set(state => ({
                dashboard: state.dashboard.filter(car => car._id !== id),
                loading: false
            }));

        } catch (error) {
            set({
                error: error.message,
                loading: false
            });
            console.error('Error deleting car:', error);
        }
    },

    fetchOneCar: async (carId) => {
        try {
            set({ loading: true })
            const res = await axiosInstance.get(`/cars/${carId}`)
            set({ loading: false })
            set({ singelCars: res.data })

        } catch (error) {
            set({ loading: false })
            set({ error: error.message })
        }
    },

    addARewiev: ({ data, id }) => {
        try {
            set({ loading: true })
            const res = axiosInstance.post(`/cars/ratings/${id}`, data)

            if (!res) {
                set({ error: "There is and Error" })
            }
            set({ loading: false })
        } catch (error) {
            set({ error: error.message })
        }
    },

    avgRating: async (id) => {
        try {
            const res = await axiosInstance.post(`/cars/avgRating/${id}`)
            set({ avgRatings: res.data })
            console.log(res.data);

        } catch (error) {
            console.log(error.message);

        }
    },

    makePayment: async (data) => {

        
        try {
            const stripe = await loadStripe("pk_test_51QxxqaKpLWcazskDblOQSOcCKXXo1PZcCD6aylrr2meWmNicx3wvrQEpIbu9HtZYnqg4SPKdXg33Fnt7LgiSgw5700uro1YaAY")

            const response = await axiosInstance.post('bookings/create-checkout-session', data);

            const session = response.data;

            const result = await stripe.redirectToCheckout({
                sessionId: session.sessionId,
            });

            if (result.error) {
                console.error("Stripe Checkout error:", result.error.message);
            }
        } catch (error) {
            console.error("Payment error:", error.message);
        }

    },
    fetchBookingData : async()=>{
        try {
            const data = await axiosInstance.get("/bookings/user-booking")
            set({bookings : data.data})
        } catch (error) {
            set({error : error})
            
        }
    },

    fetchOneBookingData : async (id)=>{
        try {
            const res = await axiosInstance.get(`/bookings/${id}`)
            set({oneBookingData : res.data})
        } catch (error) {
            set({error : error})
        }
    }


}))




export default useCarsStore