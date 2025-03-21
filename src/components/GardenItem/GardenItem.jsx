import React, {useState} from 'react'
import {ToggleLeft, ToggleRight} from 'lucide-react';
import ToggleComponent from '../ToggleComponent/ToggleComponent';

function GardenItem({name, temp, moisture, water}) {
    const [isIrrigationStatus, setIsIrrigationStatus] = useState(false);
    const [isFanStatus, setIsFanStatus] = useState(false);
    const [isLightStatus, setIsLightStatus] = useState(false);
  return (
    <div className='w-[30%] h-2/3 rounded-lg flex border-2'>
        <div className='w-2/5'>
            <img src={require("../../assets/images/ItemImg.png")} alt={"Garden"} className='w-full h-full'/>
        </div>
        <div className='w-3/5'>
            <div className='flex justify-between items-center'>
                <h1 className='m-2 text-3xl'>{name}</h1>
                <img src={require("../../assets/images/TreePlanting.png")} className='w-6 h-6 m-2' alt='edit'/>
            </div>
            <div className='flex justify-between items-center m-1'>
                <h2 className='text-xl'>Nhiệt độ:</h2>
                <h2 className='text-xl'>{temp}</h2>
            </div>
            <div className='flex justify-between items-center m-1'>
                <h2 className='text-xl'>Độ ẩm đất:</h2>
                <h2 className='text-xl'>{moisture}</h2>
            </div>
            <div className='flex justify-between items-center m-1'>
                <h2 className='text-xl'>Trạng thái tưới:</h2>
                <ToggleComponent status={isIrrigationStatus} size={40} color='blue'/>
            </div>
            <div className='flex justify-between items-center m-1'>
                <h2 className='text-xl'>Quạt:</h2>
                <ToggleComponent status={isFanStatus} size={40} color='blue'/>

            </div>
            <div className='flex justify-between items-center m-1'>
                <h2 className='text-xl'>Đèn:</h2>
                <ToggleComponent status={isLightStatus} size={40} color='blue'/>
            </div>
        </div>
    </div>
  )
}

export default GardenItem;
