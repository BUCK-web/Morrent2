import React, { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'
import Loader from './Loader';
import { toast } from 'react-toastify';
const signup = () => {
    const navigate = useNavigate();
    const { register, isAuthenticated, isLoading } = useAuthStore()

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        await register(formData.username, formData.email, formData.password)
        navigate("/")
        toast.success("You have been signedin")

    }
    

    if (isLoading) {
        return < Loader />
    }



    return (
        <div>
            <form onSubmit={handleSubmit} className='flex  items-center justify-center h-screen  '>
                <div className=' flex flex-col gap-5 bg-blue-200 p-20 rounded-md'>
                    <h1 className='font-bold text-4xl mb-10'>SignUp To <span className='text-blue-500 '>Morrent</span></h1>
                    <input type="text" name="username" placeholder='Username' value={formData.username} onChange={handleChange} className='w-[300px] p-3 border border-blue-600 rounded-md outline-none' />
                    <input type="email" name="email" placeholder='Email' value={formData.email} onChange={handleChange} className='w-[300px] p-3 border border-blue-600 rounded-md outline-none' />
                    <input type="password" name="password" placeholder='Password' value={formData.password} onChange={handleChange} className='w-[300px] p-3 border border-blue-600 rounded-md outline-none' />
                    <input type="password" name="confirmPassword" placeholder='Confirm Passowrd' value={formData.confirmPassword} onChange={handleChange} className='w-[300px] p-3 border border-blue-600 rounded-md outline-none' />
                    <button type="submit" className='bg-blue-500 w-[300px] p-5 mt-5 rounded-md text-md text-white font-bold' >Signup</button>
                </div>
            </form>
        </div>
    )
}

export default signup