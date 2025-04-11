import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const useAutoLogout = (timeout = 600000) => { //10 minutes
    const navigate = useNavigate();

    useEffect(() => {
        let timer = null;
        const resetTimer = () => {
            clearTimeout(timer);
            timer = setTimeout(async () => {
                // Make an API call to update active time before logging out
                try {
                    const token = localStorage.getItem("access_token");

                    await axios.post(`${API_BASE_URL}/update-active-time/`, { active: false },{
                        headers: { 'Content-Type': 'application/json',
                             Authorization: `Bearer ${token}`
                         }
                    });
                } catch (error) {
                    console.error('Failed to update active time', error);
                }

                // Proceed with logging out
                localStorage.removeItem('access_token'); // Clear token
                alert('You have been logged out due to inactivity');
                navigate('/'); // Redirect to login page
            }, timeout);
        };

        // Event listeners for activity
        window.addEventListener('mousemove', resetTimer, false);
        window.addEventListener('keydown', resetTimer, false);
        window.addEventListener('scroll', resetTimer, false);

        resetTimer(); // Initialize the timer

        return () => {
            clearTimeout(timer);
            window.removeEventListener('mousemove', resetTimer, false);
            window.removeEventListener('keydown', resetTimer, false);
            window.removeEventListener('scroll', resetTimer, false);
        };
    }, [navigate, timeout]);

    return null;
};

export default useAutoLogout;
