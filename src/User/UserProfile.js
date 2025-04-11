import { React, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MdOutlineIncompleteCircle } from "react-icons/md";
import { FaBrain } from "react-icons/fa";
import { MdRunningWithErrors } from "react-icons/md";
import { IoTimerOutline } from "react-icons/io5";
import { FaPencilAlt } from "react-icons/fa";
import logo from '../static/iqraorignal.png';
import { useNavigate } from 'react-router-dom';
import avatar from '../static/avatar.png';
import { API_BASE_URL } from '../config';

function UserProfile() {
    const [user, setUser] = useState();
    const [selectedFile, setSelectedFile] = useState(null);
    const navigate = useNavigate();

    const fetchQuestions = async () => {
        try {
            const token = localStorage.getItem('access_token'); 
            const response = await axios.get(`${API_BASE_URL}/current-user/`, {
                headers: {
                    'Authorization': `Bearer ${token}`, 
                }
            });
            setUser(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
            uploadImage(event.target.files[0]);
        }
    };

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append('profile_pic', file);
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.patch(`${API_BASE_URL}/update-pic/`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Profile picture updated successfully!');
            fetchQuestions(); // Refresh user data
        } catch (error) {
            console.error(error);
            alert('Failed to update profile picture.');
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    const formatTime = (minutes) => {
        if (minutes < 60) {
            return `${minutes} min`;
        } else {
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = minutes % 60;
            return `${hours} hr ${remainingMinutes} min`;
        }
    };

    const remaining_tokens = parseInt(user?.token_limit) - parseInt(user?.token_consumption);

    return (
        <>
            <header className="w-full flex items-center justify-between pl-5 py-1 border-b-[1px] border-blue-950 bg-white shadow-md">
                <img className="h-10 sm:h-16" src={logo} alt="Logo" />
                <button
                    onClick={() => {
                        navigate('/code');
                    }}
                    className="bg-blue-950 text-sm h-8 sm:h-12 hover:bg-blue-500 text-white text-semibold px-8 whitespace-nowrap py-1 rounded-md transition mr-5"
                >
                    Compiler
                </button>
            </header>

            <div className='w-full flex sm:flex-row flex-col items-center'>
                <div className=' w-full sm:w-1/3 flex flex-col items-center justify-center relative'>
                <div className='relative'>
                <img src={user?.profile_pic ? user?.profile_pic : avatar} alt='' className='m-2 sm:m-0 size-32 sm:size-40 rounded-full' />

                <label className="absolute bottom-2 right-3 bg-blue-600 text-white p-2 rounded-full cursor-pointer">
                  
                        <FaPencilAlt />
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                    </label>
                </div>
                    
                    
                    <div className='text-blue-950 font-semibold text-2xl sm:text-4xl'>
                        {user?.first_name} {user?.last_name}
                    </div>
                    <div className='text-base sm:text-xl text-blue-950 font-medium'>
                        Email: {user?.email}
                    </div>
                    <div className=' text-base sm:text-xl text-blue-950 font-medium'>
                        Username: {user?.username}
                    </div>
                </div>

                <div className='w-full sm:w-2/3 h-full'>
                    <div className='grid h-full sm:grid-cols-2 gap-2 sm:gap-8 items-center py-2 sm:py-10 px-8 rounded-lg shadow-md'>
                        <div className='bg-gray-100 p-2 rounded-lg text-lg'>
                            <div className='flex flex-col w-full items-center justify-between gap-1'>
                                <MdOutlineIncompleteCircle className='w-1/4 h-1/4 text-blue-950' />
                                <div>
                                    <b>Total Problems Solved: {user?.total_problems_solved}</b>
                                    <div className='w-full flex justify-between gap-2'>
                                        <div className='p-1 w-1/3 bg-slate-500 text-white rounded-lg text-base'>Easy: {user?.no_of_easy_problems_solved}</div>
                                        <div className='p-1 w-1/3 bg-slate-500 text-white rounded-lg text-base'>Med: {user?.no_of_medium_problems_solved}</div>
                                        <div className='p-1 w-1/3 bg-slate-500 text-white rounded-lg text-base'>Hard: {user?.no_of_hard_problems_solved}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='bg-gray-100 p-3 rounded-lg text-lg flex flex-col items-center justify-center'>
                            <FaBrain className='size-1/4 text-blue-950' />
                            <b>AI Request Count: {user?.openai_request_count}</b>
                            <b>Overall Token Usage: {user?.token_consumption}</b>
                        </div>
                        <div className='bg-gray-100 flex flex-col items-center p-3 rounded-lg text-lg'>
                            <MdRunningWithErrors className='size-1/4 text-blue-950' />
                            <b>Remaining Tokens: {remaining_tokens < 0 ? 0 : remaining_tokens}</b>
                            <b>Token Limit: {user?.token_limit}</b>
                        </div>
                        <div className='bg-gray-100 px-2 py-6 rounded-lg text-2xl flex flex-col items-center'>
                            <IoTimerOutline className='size-1/4 text-blue-950' />
                            <b>Active Time: {formatTime(user?.active_time_today)}</b>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default UserProfile;