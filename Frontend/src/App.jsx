import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import Category from './pages/Category'
import Detail from './pages/Detail'
import Payment from './pages/Payment'
import Login from './components/login'
import Signup from './components/signup'
import Settings from './components/settings'
import Notifications from './components/notifications'
import FavCars from './components/FavCars'
import { useAuthStore } from './store/authStore'
import Cars from './pages/Cars'
import { ToastContainer } from 'react-toastify'
import Dashboard from './pages/dashboard'
import EditCar from './pages/EditCar'
import CarDetails from './pages/CarDetails'
import Success from './pages/Success'
import Cancel from './pages/Cancel'
import Allcars from './pages/Allcars'
import Status from './pages/Status'

const App = () => {
  const { user, profile, isAuthenticated } = useAuthStore();


  useEffect(() => {
    profile();
  }, []);

  return (
    <Router>
      <div className="app">
        <Nav />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category" element={<Category />} />
            <Route path="/detail/:id" element={<Detail />} />
            <Route path="/payment/:id" element={<Payment />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
            <Route path="/signup" element={isAuthenticated ? <Navigate to="/" replace /> : <Signup />} />
            <Route path='/settings' element={<Settings />} />
            <Route path='/notification' element={<Notifications />} />
            <Route path='/FavCars' element={<FavCars />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/success" element={<Success />} />
            <Route path="/cancel" element={<Cancel />} />
            <Route path="/allCars" element={<Allcars />} />
            <Route path="/status/:id" element={<Status />} />
            <Route
              path="/cars"
              element={
                user?.role === "admin" ? (
                  <Cars />
                ) : (
                  <div className="min-h-screen flex items-center justify-center text-red-600 text-2xl font-bold uppercase">
                    Access Denied
                  </div>
                )
              }
            />

            <Route path="/edit/:id" element={<EditCar />} />
            <Route path="/cars/:id" element={<CarDetails />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <ToastContainer />
    </Router>

  )
}

export default App