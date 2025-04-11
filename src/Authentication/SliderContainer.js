import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import logo from '../static/iqraorignal.png';
const SliderContainer = () => {
  const [isLogin, setIsLogin] = useState(true);

  const togglePage = () => {
    setIsLogin(!isLogin);
  };

  return (
     <div className="flex flex-col h-screen w-screen overflow-hidden bg-gray-50"> 
     <header className="w-full flex items-start  pl-5 py-1 border-b-[1px] border-blue-950 bg-white shadow-md">
     <img className="h-8 sm:h-16 flex text-left sm:absolute top-2 left-4 " src={logo} alt="Logo" />
     <h1 className="w-full  sm:p-4 pl-2 text-base sm:text-3xl  sm:text-center mont font-semibold text-blue-950">  AI Training Assistant </h1>
 </header>
    <div className="relative h-screen w-screen overflow-hidden bg-gray-50" >
      {/* Sliding Container */}
      
      <div
        className={`absolute inset-0 flex transform transition-transform duration-500 ease-in-out ${
          isLogin ? 'translate-x-0' : '-translate-x-1/2'
        }`}
        style={{ width: '200%' }}
      >
    
        {/* Login Page */}
          <Login togglePage={togglePage} />

        {/* Register Page */}
          <Register togglePage={togglePage} />
      </div>
    </div>
    </div>  

  );
};

export default SliderContainer;
