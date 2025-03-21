import React, {useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import HeaderComponent from '../../components/Header/HeaderComponent';
import FooterComponent from '../../components/FooterComponent/FooterComponent';
import GardenItem from '../../components/GardenItem/GardenItem';
import {ArrowDown, ChevronDown} from 'lucide-react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {ToggleLeft, ToggleRight} from 'lucide-react';


function HomePage() {
  const test =[1,2,3,4,5,6,7,8,9,10]

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isFanStatus, setIsFanStatus] = useState(false);
  
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    // setAnchorEl(null);
  };
  return (
    <div>
      <HeaderComponent/>
      <div className='flex space-between justify-between items-center px-10 py-10'>
        <strong>
          <h1 className='text-4xl'>Vườn Tiêu <span className='text-green-500'>Bình Phước</span></h1>
        </strong>
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
          <MenuItem onClick={handleClose}>
            Trạng thái tưới
            {isFanStatus ? <ToggleRight size={32} color='blue' onClick={()=>setIsFanStatus(!isFanStatus)}/>
                    : <ToggleLeft size={32} onClick={()=>setIsFanStatus(!isFanStatus)}/>} 
          </MenuItem>
          <MenuItem onClick={handleClose}>Quạt</MenuItem>
          <MenuItem onClick={handleClose}>Đèn</MenuItem>
        </Menu>
      </div>
      
      <div className='flex min-h-screen flex-wrap px-10 py-8 justify-between gap-8 gap-y-6'>
        {test.map((item, index) =>{
          return <GardenItem name="Garden" temp="30" moisture="50" water="50"/>
        })}
        
      </div>
    </div>
  )
}

export default HomePage;