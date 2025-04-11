import './App.css';
import CodeEditor from './Compiler/CodeEditor';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './Authentication/Register';
import Login from './Authentication/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Admin from './Admin/Admin';
import ProtectedRoute from './Authentication/ProtectedRoute';
import UserProfile from './User/UserProfile';
import SliderContainer from './Authentication/SliderContainer';
import UserPerformanceDashboard from './Admin/UserPerformanceDashboard';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<SliderContainer />} />
          <Route path="/performance" element={<UserPerformanceDashboard />} />
          <Route path="/code" element={<ProtectedRoute><CodeEditor /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/*" element={
            <ProtectedRoute roleRequired="admin">
              <Admin />
            </ProtectedRoute>
          } />
        </Routes>
        <ToastContainer position="top-right" autoClose={5000} />
      </div>
    </Router>
  );
}

export default App;
