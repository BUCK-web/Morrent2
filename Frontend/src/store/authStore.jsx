import { create } from 'zustand';
import { axiosInstance } from '../utils/axiosInstance';

export const useAuthStore = create((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    notifications: null,
    notificationsBool: false,

    register: async (username, email, password) => {
        try {
            const response = await axiosInstance.post("/users/register", { username, email, password })
            set({ isLoading: false })
            if (response.status === 201) {
                set({ user: response.data.user, isAuthenticated: true })
            }
        } catch (error) {
            set({ error: error.response.data.message })
        }

    },


    login: async (email, password) => {
        try {
            set({ isLoading: true })
            const response = await axiosInstance.post("/users/login", { email, password })
            set({ isLoading: false })
            if (response.status === 200) {
                set({ user: response.data.user, isAuthenticated: true })
            }
        } catch (error) {
            set({ error: error.response.data.message })
        }
    },

    profile: async () => {
        try {
            set({ isLoading: true })
            const response = await axiosInstance.get("/users/profile")
            set({ isLoading: false })
            if (response.status === 200) {
                set({ user: response.data, isAuthenticated: true })
            }
        } catch (error) {
            set({ error: error.response.data.message })
        }
    },

    logout: async () => {
        try {
            const response = await axiosInstance.post("/users/logout")
            if (response.status === 200) {
                set({ user: null, isAuthenticated: false })
            }
        } catch (error) {
            set({ error: error.response.data.message })
        }
    },

    favorite: async (carId) => {
        try {
            const response = await axiosInstance.post(`/users/favorites/${carId}`)
            if (response.status === 200) {
                set({ user: response.data.user, isAuthenticated: true })
            }
        } catch (error) {
            set({ error: error.response.data.message })
        }
    },

    updateProfile: async (data) => {
        try {
            set({ isLoading: true })
            const res = await axiosInstance.put("/users/Updateprofile", {
                profilePicture: data.profilePicture,
                username: data.username,
                phoneNumber: data.phone
            })

            if (res.status == 200) {
                set({ isLoading: false })
            } else {
                set({ isLoading: true })
            }

        } catch (error) {
            set({error : error.response.data.message , isLoading : false})

        }
    },

    getNotifications: async () => {
        try {
            const notifications = await axiosInstance.get('/users/getNotifications')
            if (!notifications) {
                set({ error: "There is no notifications" })
            }

            if (notifications.data.notifications.length === 0) {
                set({ notifications: [], notificationsBool: false });                
            } else {
                set({ notifications: notifications.data.notifications, notificationsBool: true });
            }


            set({ notifications: notifications.data.notifications })
        } catch (error) {
            
            set({ error: error })
        }
    },
    deleteNotification: async (id) => {
        try {
            const data = await axiosInstance.delete(`users/deleteNotification/${id}`)
            if ((await data).data.status == 200) {
                console.log("Deleted And read the notifications");

            }
        } catch (error) {
            set({ error: error })
        }
    }




}))
