import React, {useState, useEffect} from 'react'
import {ToggleLeft, ToggleRight} from 'lucide-react';


function ToggleComponent({status, size, color}) {
    const [isOn, setIsOn] = useState(status);
  return (
    <div className="flex justify-between items-center m-1">
        {isOn ? <ToggleRight size={size} color={color} onClick={()=>setIsOn(!isOn)}/> 
                            : <ToggleLeft size={size} onClick={()=>setIsOn(!isOn)}/>}
    </div>
  )
}

export default ToggleComponent;
