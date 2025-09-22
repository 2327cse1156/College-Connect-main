// import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Users, Code2, BookOpen, Network, UserCircle, Home, GraduationCap, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/hackathons', icon: Code2, label: 'Hackathons' },
    { path: '/team-builder', icon: Users, label: 'Team Builder' },
    { path: '/resources', icon: BookOpen, label: 'Resources' },
    { path: '/alumni', icon: Network, label: 'Alumni' },
    { path: '/seniors', icon: GraduationCap, label: 'Seniors' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to log out');
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Users className="h-8 w-8 text-indigo-600" />
            <span className="font-bold text-xl text-gray-900">CollegeConnect</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive(path)
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
            
            <div className="flex items-center space-x-2 ml-4">
              {currentUser ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center space-x-1 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                  >
                    <UserCircle className="h-5 w-5" />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;