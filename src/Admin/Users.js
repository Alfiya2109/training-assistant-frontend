import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdEdit } from "react-icons/md";
import { FaCheck, FaDownload } from "react-icons/fa";
import avatar from '../static/avatar.png';
import { API_BASE_URL, API_MEDIA_URL } from '../config';
import { utils, writeFile } from 'xlsx';
import DownloadIcon from '@mui/icons-material/Download';


function Users() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
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

      const updatedUsers = users.map(usr =>
        usr.username === user.username ? { ...usr, token_limit: editedTokenLimit } : usr
      );
      setUsers(updatedUsers);
      handleCancel();
    } catch (e) {
      setError(e.response ? e.response.data.message : e.message);
    }
  };

  const handleDownloadExcel = () => {
    
    const data = filteredUsers.map(user => ({
      "Full Name": `${user.first_name} ${user.last_name}`,
      "Username": user.username,
      "Request Count": user.openai_request_count,
      "Total Token Consumed": user.token_consumption,
      "Remaining Tokens": parseInt(user.token_limit) - parseInt(user.token_consumption),
      "Token Limit": user.token_limit,
      "Active Time": formatTime(user.active_time_today),
      "Problems Solved": user.total_problems_solved,
    }));

    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Users");

    writeFile(workbook, "users_data.xlsx");
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='flex flex-col items-center px-4 w-full'>
      <h1 className='text-blue-950 font-semibold text-4xl p-4'>Users</h1>

      {/* Search input and download button */}
      <div className="flex justify-between items-center w-full  mb-4">
        <div className="flex w-full">
          <input
            type="text"
            placeholder="Search by Name or Username"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border-blue-900 border-2 rounded-lg w-full"
          />
          <button
          onClick={handleDownloadExcel}
          className="ml-4 py-2 px-3 bg-blue-900 text-white rounded-lg flex items-center gap-1 hover:bg-blue-800"
          title="Download Excel"
        >
          <DownloadIcon />
        </button>
        </div>
        
      </div>

      {filteredUsers.length > 0 ? (
        <div className="overflow-x-auto w-full max-w-7xl">
          <table className="min-w-full border border-blue-900 text-sm text-left">
            <thead className="bg-blue-950 text-white">
              <tr>
                <th className="py-2 px-3 border">Profile</th>
                <th className="py-2 px-3 border">Full Name</th>
                <th className="py-2 px-3 border">Username</th>
                <th className="py-2 px-3 border">Request Count</th>
                <th className="py-2 px-3 border">Total Token Consumed</th>
                <th className="py-2 px-3 border">Remaining Tokens</th>
                <th className="py-2 px-3 border">Token Limit</th>
                <th className="py-2 px-3 border">Active Time</th>
                <th className="py-2 px-3 border">Total Problems Solved</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.username} className="border-t hover:bg-blue-50">
                  <td className="py-2 px-3 border text-center">
                    <img
                      src={user.profile.profile_pic ? `${API_MEDIA_URL}${user.profile.profile_pic}` : avatar}
                      alt={user.first_name}
                      className="w-10 h-10 object-cover rounded-full mx-auto"
                    />
                  </td>
                  <td className="py-2 px-3 border">{user.first_name} {user.last_name}</td>
                  <td className="py-2 px-3 border">{user.username}</td>
                  <td className="py-2 px-3 border">{user.openai_request_count}</td>
                  <td className="py-2 px-3 border">{user.token_consumption}</td>
                  <td className="py-2 px-3 border">{parseInt(user?.token_limit) - parseInt(user?.token_consumption)}</td>
                  <td className="py-2 px-3 border">
                    {
                      editUserId === user.username ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={editedTokenLimit}
                            onChange={(e) => setEditedTokenLimit(e.target.value)}
                            className="w-20 px-1 border rounded text-black"
                          />
                          <FaCheck className="cursor-pointer" onClick={() => handleSave(user)} />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {user.token_limit}
                          <MdEdit className="cursor-pointer" onClick={() => handleEdit(user)} />
                        </div>
                      )
                    }
                  </td>
                  <td className="py-2 px-3 border">{formatTime(user.active_time_today)}</td>
                  <td className="py-2 px-3 border">{user.total_problems_solved}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>No users found</div>
      )}
    </div>
  );
}

export default Users;
