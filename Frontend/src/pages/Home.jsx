import React from 'react'
import HeroSection from '../components/heroSection'
import RecomenedCars from '../components/RecomenedCars'
import PopularCars from '../components/PopularCars'


const Home = () => {
  return (
    <div className="home-page">
      <HeroSection />
      <PopularCars />
      <RecomenedCars />
    </div>
  )
}

export default Home 