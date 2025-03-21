import React, {useState} from 'react'
import {ToggleLeft, ToggleRight} from 'lucide-react';

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
                <h1 className='m-2 text-xl  '>{name}</h1>
                <img src={require("../../assets/images/TreePlanting.png")} className='w-6 h-6 m-2' alt='edit'/>
            </div>
            <div className='flex justify-between items-center m-1'>
                <h2>Nhiệt độ:</h2>
                <h2>{temp}</h2>
            </div>
            <div className='flex justify-between items-center m-1'>
                <h2>Độ ẩm đất:</h2>
                <h2>{moisture}</h2>
            </div>
            <div className='flex justify-between items-center m-1'>
                <h2>Trạng thái tưới:</h2>
                {isIrrigationStatus ? <ToggleRight size={32} color='blue' onClick={()=>setIsIrrigationStatus(!isIrrigationStatus)}/> 
                    : <ToggleLeft size={32} onClick={()=>setIsIrrigationStatus(!isIrrigationStatus)}/>}
            </div>
            <div className='flex justify-between items-center m-1'>
                <h2>Quạt:</h2>
                {isFanStatus ? <ToggleRight size={32} color='blue' onClick={()=>setIsFanStatus(!isFanStatus)}/>
                    : <ToggleLeft size={32} onClick={()=>setIsFanStatus(!isFanStatus)}/>}

            </div>
            <div className='flex justify-between items-center m-1'>
                <h2>Đèn:</h2>
                {isLightStatus ? <ToggleRight size={32} color='blue' onClick={()=>setIsLightStatus(!isLightStatus)}/> 
                    : <ToggleLeft size={32} onClick={()=>setIsLightStatus(!isLightStatus)}/>}

            </div>
        </div>
    </div>
  )
}

export default GardenItem;
