import React, {useState} from 'react'
import HeaderComponent from '../../components/Header/HeaderComponent';
import FooterComponent from '../../components/FooterComponent/FooterComponent';
import GardenItem from '../../components/GardenItem/GardenItem';
import {ArrowDown, ChevronDown, Plus} from 'lucide-react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ToggleComponent from '../../components/ToggleComponent/ToggleComponent';


function HomePage() {
  const test =[1,2,3,4,5,6,7,8,9,10]

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isIrrigationStatus, setIsIrrigationStatus] = useState(false);
  const [isFanStatus, setIsFanStatus] = useState(false);
  const [isLightStatus, setIsLightStatus] = useState(false);

  
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
      <HeaderComponent/>
      <div className='flex space-between justify-between items-center px-10 py-10'>
        <strong>
          <h1 className='text-4xl'>Vườn Tiêu <span className='text-green-500'>Bình Phước</span></h1>
        </strong>
        <div className='flex'>
          <Button
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            Công tắc chung <ChevronDown size={24}/>
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem children={
              <div className='flex justify-between items-center w-full'>
                <h2>Trạng thái tưới:  </h2>
                <ToggleComponent status={isIrrigationStatus} size={40} color='blue'/>
              </div>
            }>
            </MenuItem>
            <MenuItem children={
              <div className='flex justify-between items-center w-full'>
                <h2>Quạt:</h2>
                <ToggleComponent status={isFanStatus} size={40} color='blue'/>
              </div>
            }>
            </MenuItem>
            <MenuItem  children={
              <div className='flex justify-between items-center w-full'>
                <h2>Đèn: </h2>
                <ToggleComponent status={isLightStatus} size={40} color='blue'/>
              </div>
            }>
              

            </MenuItem>
          </Menu>
          <button className='bg-green-700 text-white rounded-2xl p-2'>
            <Plus size={24}/>
          </button>
        </div>

      </div>
      
      <div className='flex min-h-screen flex-wrap px-10 py-4 justify-between gap-8 gap-y-6'>
        {test.map((item, index) =>{
          return <GardenItem name="Garden" temp="30" moisture="50" water="50"/>
        })}
      
      </div>
      <FooterComponent/>
    </div>
  )
}

export default HomePage;