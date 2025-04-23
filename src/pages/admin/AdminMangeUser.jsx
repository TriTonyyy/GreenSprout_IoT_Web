import React from 'react'
import HeaderComponent from '../../components/Header/HeaderComponent'
import SideNavigationBar from '../../components/SideNavigationBar/SideNavigationBar'

export default function AdminMangeUser() {
  return (
    <div>
        <HeaderComponent/>
        <div className='flex'>
            <SideNavigationBar/>
            <h1>Manage USer</h1>
        </div>
    </div>
  )
}
