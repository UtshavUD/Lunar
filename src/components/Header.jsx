import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "../utils/ReactToast";
import { useAuth } from "../contexts/AuthContext";
import Lunar from '/Lunar.png'


const Header = () => {
  const {logout} = useAuth();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [displayName] = useState(localStorage.getItem('DisplayName'));
  // Toggle Sidebar Menu
  const toggleMobileMenu = () => {
    document.querySelector(".sidebar").classList.toggle("-translate-x-full");
  };

  // Toggle Profile Menu
  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  const closeProfileMenu = () => {
    setProfileMenuOpen(false);
  };

  //logout
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    //auth context logout
    logout();
    showToast("Logged Out Successfully", "success");
  };
  return (
    <header
      className="fixed w-full bg-white text-indigo-800 z-50 shadow-lg"
      onClick={closeProfileMenu}
      onMouseLeave={()=> setProfileMenuOpen(false)}
    >
      <div
        className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between h-16"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Menu Button */}
        <button
          className="p-2 lg:hidden text-2xl text-indigo-800"
          onClick={toggleMobileMenu}
        >
          {/* Boxicons Menu Icon */}
          <i className="bx bx-menu text-3xl"></i>
        </button>

        {/* Title */}
        <div className="text-xl font-bold text-blue-900">
          <span className="text-indigo-800">Lunar Dashboard</span>
        </div>

        {/* Icons and Profile */}
        <div className="flex items-center space-x-2 relative">
          <img
            className="w-10 h-10 rounded-full transition-transform duration-300 hover:scale-110 object-cover cursor-pointer"
            src={Lunar}
            alt="Profile"
            onMouseEnter={toggleProfileMenu}
            onClick={toggleProfileMenu}
          />

          {/* Profile Menu */}
          {profileMenuOpen && (
            <div 
            onMouseLeave={toggleProfileMenu} className="absolute right-0 mt-60 w-64 bg-white border rounded-lg shadow-lg z-50 p-4 transition-all">
              <div className="flex items-center mb-4">
                <img
                  className="w-12 h-12 rounded-full object-cover mr-3"
                  src={Lunar}
                  alt="Admin"
                />
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">{displayName}</h4>
                  <p className="text-sm text-gray-500">admin@example.com</p>
                </div>
              </div>
              <hr className="my-2" />
              <a
                href="#"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-indigo-800 rounded-md"
              >
                {/* Boxicons User Icon */}
                <i className="bx bx-user text-xl mr-2"></i>
                Profile
              </a>
              <Link
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-red-600 rounded-md"
              >
                {/* Boxicons Power Icon */}
                <i className="bx bx-power-off text-xl mr-2"></i>
                Logout
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
