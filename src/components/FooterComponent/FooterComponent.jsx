import React from 'react'

function FooterComponent() {
  return (
    <div>
        <div className='flex justify-center items-center h-20 border-t-2'>
            <h1 className='text-2xl'>@ GreenSprout | Privacy Policy |</h1>
            <img src={require("../../assets/images/TreePlanting.png")} className='w-12' alt='logo'/>

        </div>
    </div>
  )
}

export default FooterComponent;
