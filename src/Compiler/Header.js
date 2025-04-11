import {React, useState, useEffect} from 'react';
import axios from 'axios';
import logo from '../static/iqraorignal.png';
import { RxAvatar } from "react-icons/rx";
import { useNavigate } from 'react-router-dom';
import avatar from '../static/avatar.png';
import { API_BASE_URL } from '../config';
const Header = ({ language, handleLanguageChange, handleRunCode, loading, toggleAssistant }) => {
  const navigate = useNavigate()
  const [user, setUser] = useState();
  const fetchQuestions = async () => {
      try {
          const token = localStorage.getItem('access_token'); 
          const response = await axios.get(`${API_BASE_URL}/current-user/`, {
              headers: {
                  'Authorization': `Bearer ${token}`, 
              }
          });
          setUser(response.data);
          console.log(user);
      } catch (err) {
          console.error(err);
         
      }
  };
  useEffect(() => {
      fetchQuestions();
  }, []); 
  return (
    <header className="bg-white shadow-md">
        <div className="container mx-auto px-3 py-2 sm:gap-0 gap-4 flex sm:flex-row flex-col justify-between items-center">
          <div className='sm:h-auto h-10 flex sm:flex-col justify-evenly sm:items-start items-center'>
            <img className='w-1/5 sm:w-[11%]' alt='' src={logo}/>
            <label className='text-blue-950 leading-tight text-lg  sm:pl-0 sm:text-[12px] font-semibold'>AI Training Assistant</label>
            <button
              onClick={()=>{navigate('/profile')}}
              className="h-10 sm:hidden block w-fit text-blue-950  whitespace-nowrap rounded-md transition"
            >
              <img className='size-10 rounded-full' alt='' src={user?.profile_pic?user.profile_pic:avatar}/>
            </button>
          </div>
          <nav className="w-full sm:w-1/2 justify-evenly sm:justify-end flex items-center gap-6">
            <section className="flex gap-6">
              <div className="w-full">
                <select
                  id="language"
                  value={language}
                  onChange={handleLanguageChange}
                  className="w-full p-2 rounded-md h-8 sm:h-12 text-xs sm:text-sm whitespace-nowrap bg-blue-950 border border-gray-500 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="c">C</option>
                  <option value="cpp">C++</option>
                  <option value="csharp">C#</option>
                  <option value="go">Go</option>
                  <option value="java">Java</option>
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="php">PHP</option> 
                  
                </select>

              </div>
            </section>
            <button
              onClick={handleRunCode}
              className="bg-blue-950 text-xs sm:text-sm h-8 sm:h-12 hover:bg-blue-700 text-white px-4 whitespace-nowrap py-1 rounded-md transition"
            >
              {loading ? 'Running...' : 'Run Code'}
            </button>
            <button
              onClick={toggleAssistant}
              className="bg-blue-950 h-8 sm:h-12 text-xs sm:text-sm hover:bg-blue-700 text-white px-4 py-1 whitespace-nowrap rounded-md transition"
            >
              AI Assistance
            </button>
            <button
              onClick={()=>{navigate('/profile')}}
              className="h-14 sm:block hidden w-fit text-blue-950  whitespace-nowrap rounded-md transition"
            >
              <img className='size-12 rounded-full' alt='' src={user?.profile_pic?user.profile_pic:avatar}/>
            </button>
          </nav>
        </div>
      </header>  );
};

export default Header;
