import React, { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Loader from "../components/Loader"
const login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        await login(formData.email, formData.password)
        toast.success("Logged in successfully")
        navigate("/")
    }

    const { login,isLoading } = useAuthStore()

    if (!isLoading) {
        return <Loader/>
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className='flex  items-center justify-center h-screen  '>
                <div className=' flex flex-col gap-5 bg-blue-200 p-20 rounded-md'>
                    <h1 className='font-bold text-4xl mb-10'>Login To <span className='text-blue-500 '>Morrent</span></h1>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className='w-[300px] p-3 border border-blue-600 rounded-md' />
                    <input type="password" name="password" value={formData.password} onChange={handleChange} className='w-[300px] p-3 border border-blue-600 rounded-md' />
                    <button type="submit" className='bg-blue-500 w-[300px] p-5 mt-5 rounded-md text-md text-white font-bold'>Login</button>
                </div>
            </form>
        </div>
    )
}

export default login