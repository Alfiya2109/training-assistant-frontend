import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaUserFriends, FaCog, FaChartBar, FaSignOutAlt } from 'react-icons/fa';
import { FaRegSquarePlus } from "react-icons/fa6";
import { MdAdminPanelSettings } from "react-icons/md";
import { FaLaptopCode } from "react-icons/fa";


const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="static sm:relative">
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="text-blue-950 w-full p-1 sm:p-4 text-4xl font-bold md:hidden"
      >
        <MdAdminPanelSettings/>
      </button>

      {/* Sidebar */}
      <div 
        className={`fixed z-50 top-0 left-0 h-screen w-3/4 md:w-1/4 bg-blue-950 text-white font-bold transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <h2 className="text-2xl sm:text-4xl p-4 cursor-pointer" onClick={() => setIsOpen(false)}>
          Admin Panel
        </h2>
        <hr />
        <nav className="flex flex-col gap-4 p-4">
          <NavLink to="/admin" className="sidebar-link flex items-center text-2xl gap-2">
            <FaChartBar />
            Dashboard
          </NavLink>
          <NavLink to="/admin/add-questions" className="sidebar-link flex items-center text-2xl gap-2">
            <FaRegSquarePlus />
            Add Question
          </NavLink>
          <NavLink to="/admin/users" className="sidebar-link flex items-center text-2xl gap-2">
            <FaUserFriends />
            Users
          </NavLink>
          <NavLink to="/code" className="sidebar-link flex items-center text-2xl gap-2">
            <FaLaptopCode />
            Compiler
          </NavLink>
          <NavLink to="/admin/logout" className="sidebar-link flex items-center text-2xl gap-2">
            <FaSignOutAlt />
            Logout
          </NavLink>

        </nav>
      </div>

      {/* Overlay for Mobile */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 md:hidden" onClick={() => setIsOpen(false)}></div>}
    </div>
  );
};

export default AdminSidebar;
