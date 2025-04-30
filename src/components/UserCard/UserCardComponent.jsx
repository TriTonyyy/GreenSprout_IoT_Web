import React from 'react'

export default function UserCardComponent({user}) {
  const numOfDevices = user.gardenId
  const handleClick = ()=>{
    console.log(user._id);
    
  }
  
    return (
      <div className="w-[32%] h-1/4 bg-white border border-gray-300 rounded-2xl shadow p-4 flex items-center space-x-4 hover:shadow-md transition" onClick={handleClick}>
        <img
          src={user?.avatar ? user.avatar : require("../../assets/images/AvatarDefault.png")}
          alt={user.name}
          className="w-24 h-24 rounded-full object-cover"
        />
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-800">{user.name}</h2>
          <p className="text-lg text-gray-500">{user.email}</p>
          <div className="mt-2 text-lg text-gray-600">
            <p><span className="font-medium">Gender:</span> {user.gender}</p>
            <p><span className="font-medium">Devices:</span> {numOfDevices?.length}</p>
          </div>
        </div>
      </div>
    )
}
