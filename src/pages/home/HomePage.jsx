import React from 'react'
import HeaderComponent from '../../components/Header/HeaderComponent';

function HomePage() {
  return (
    <div>
      <HeaderComponent/>
      <div className='flex justify-center items-center min-h-screen'>
        <h1 className='text-5xl font-bold'>Home Page</h1>
      </div>
    </div>
  )
}

export default HomePage;