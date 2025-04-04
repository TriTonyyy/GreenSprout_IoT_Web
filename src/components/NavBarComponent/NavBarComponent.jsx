import React from 'react'

export default function NavBarComponent() {
  return (
    <div className='left-0 h-screen bg-gray-600 w-1/6'>
        <nav className="p-4">
            <div className="container mx-auto flex-col justify-between items-center">
            <ul className="flex-col space-x-4 text-white">
                <li><a href="/home">Home</a></li>
                <li><a href="/schedule">Schedule</a></li>
                <li><a href="/account">Account</a></li>
            </ul>
            </div>
        </nav>
    </div>
  )
}
