import React from 'react'
import Header from '../../Components/LandingPage/Header/header'
import HeroSection from '../../Components/LandingPage/Hero/HeroSection'

const LandingPage = () => {
  return (
    <>
       <div className='h-screen'>
        <Header/>
        <HeroSection/>
       </div>
    </>
  )
}

export default LandingPage