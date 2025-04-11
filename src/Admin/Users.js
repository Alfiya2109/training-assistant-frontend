import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdEdit } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import avatar from '../static/avatar.png'
import { API_BASE_URL } from '../config';
function Users() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');


  // Add a state to manage editing status and values
  const [editUserId, setEditUserId] = useState(null);
  const [editedTokenLimit, setEditedTokenLimit] = useState('');

  const filteredUsers = users.filter(user =>
    user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function formatTime(minutes) {
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours} hr ${remainingMinutes} min`;
    }
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        const response = await axios.get(`${API_BASE_URL}/user-details/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setUsers(response.data);
        setIsLoading(false);
      } catch (e) {
        setError(e.response ? e.response.data.message : e.message);
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setEditUserId(user.username);
    setEditedTokenLimit(user.token_limit);
  };

  const handleCancel = () => {
    setEditUserId(null);
    setEditedTokenLimit('');
  };

  const handleSave = async (user) => {
    try {
      const accessToken = localStorage.getItem('access_token');
      const id = user.id;
      await axios.patch(`${API_BASE_URL}/increase-token-limit/${id}/`, {
        token_limit: editedTokenLimit
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      const updatedUsers = users.map(usr => usr.username === user.username ? {...usr, token_limit: editedTokenLimit} : usr);
      setUsers(updatedUsers);
      handleCancel();
    } catch (e) {
      setError(e.response ? e.response.data.message : e.message);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='flex flex-col items-center'>
      <h1 className=' text-blue-950 font-semibold text-4xl p-4'>Users</h1>
      <input
        type="text"
        placeholder="Search by Name or Username"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border-blue-900 border-2 rounded-lg w-[96%]"
      />
      {filteredUsers.length > 0 ? (
        <div className='w-full grid sm:grid-cols-3 gap-4 px-4'>
          
          {filteredUsers?.map(user => (
            <div className='p-2 border-2 flex items-center flex-col border-blue-900 rounded-xl' key={user.username}>
              <label className='w-full flex justify-center py-1 font-semibold text-2xl bg-blue-950 rounded-lg text-white mb-2'>
                {user.first_name} {user.last_name}
              </label>
              <div className='w-full flex items-center justify-center my-3'>
              <img src={user.profile.profile_pic?`${API_BASE_URL} ${user.profile.profile_pic}`:avatar} alt={user.first_name} className='w-24 h-24 object-cover rounded-full'/>
              </div>
              <div className='w-3/4 flex flex-col'>
              <b>Username: {user.username}</b>
              <b>Request Count: {user.openai_request_count}</b>
              <b>Total Token Consumed: {user.token_consumption}</b>
              <b>Remaining Tokens: {parseInt(user?.token_limit)-parseInt(user?.token_consumption) }</b>

              {
                editUserId === user.username ? (
                  <div className=' flex items-center gap-2'>
                    <b>Token Limit: </b>
                    <input type="number" value={editedTokenLimit} onChange={(e) => setEditedTokenLimit(e.target.value)} className="w-1/3 text-black"/>
                    <FaCheck onClick={() => handleSave(user)} />
                  </div>
                ) : (
                  <div className=' flex items-center gap-2'>
                    <b>Token Limit: {user.token_limit}</b>
                    <MdEdit onClick={() => handleEdit(user)} />
                  </div>
                )
              }
              <b>Active Time Today: {formatTime(user.active_time_today)}</b>
              <b>Total Problems Solved: {user.total_problems_solved}</b>
              {/* other fields and icons */}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>No users found</div>
      )}
    </div>
  );
}

export default Users;
