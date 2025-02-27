import React from 'react'
import HeaderComponent from '../../components/Header/HeaderComponent';
import FooterComponent from '../../components/FooterComponent/FooterComponent';
import GardenItem from '../../components/GardenItem/GardenItem';

function HomePage() {
  return (
    <div>
      <HeaderComponent/>
      <div className='flex min-h-screen flex-wrap p-10 justify-between'>
        <GardenItem
          name={"Khu 1"}
          temp={"25 độ"}
          moisture={"50%"}
        />

        <GardenItem
          name={"Khu 1"}
          temp={"25 độ"}
          moisture={"50%"}
        />

        <GardenItem
          name={"Khu 1"}
          temp={"25 độ"}
          moisture={"50%"}
        />

        <GardenItem
          name={"Khu 1"}
          temp={"25 độ"}
          moisture={"50%"}
        />
      </div>
      <FooterComponent/>
    </div>
  )
}

export default HomePage;