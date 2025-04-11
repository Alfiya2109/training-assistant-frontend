// src/Admin.js

import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import Login from '../Authentication/Login';
import AddQuestions from './AddQuestions';

const UserPerformanceDashboard = lazy(() => import('./UserPerformanceDashboard'));
const Users = lazy(() => import('./Users'));
const Settings = lazy(() => import('./Settings'));

const AdminLayout = () => {
  return (
    <div className="admin-container flex sm:flex-row flex-col w-full">
      <AdminSidebar />
      <div className="admin-content w-full sm:ml-[25%] ml-0 sm:w-3/4">
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};

const Admin = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<UserPerformanceDashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="settings" element={<Settings />} />
        <Route path="login" element={<Login />} />
        <Route path="add-questions" element={<AddQuestions />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        {/* <Route path="code" element={<Navigate to="/code" replace />} /> */}

      </Route>
    </Routes>
  );
};

export default Admin;
