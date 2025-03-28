import React from 'react'
import HeaderComponent from '../../components/Header/HeaderComponent'
import FooterComponent from '../../components/FooterComponent/FooterComponent'
import ScheduleItem from '../../components/ScheduleItem/ScheduleItem';
export default function SchedulePage() {
  return (
    <div>
        <HeaderComponent titleScheduleColor='Green'/>
        <div className="flex min-h-screen flex-wrap px-10 py-8 justify-between gap-8 gap-y-6">
            <h1 className='text-4xl'>
                Lịch trình tưới: <strong>Vườn tiêu Bình Phước</strong>
            </h1>
            <div className='flex w-full flex-wrap px-10 py-8 justify-between gap-8 gap-y-6'>
                <ScheduleItem/>
                <ScheduleItem/>
                <ScheduleItem/>


            </div>

      </div>
        <FooterComponent/>
    </div>
  )
}
