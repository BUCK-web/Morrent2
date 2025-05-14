import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // For hamburger menu icons

const Nav = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, profile, notificationsBool, getNotifications } = useAuthStore();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  

  useEffect(() => {
    profile();
    getNotifications();
  }, []);

  return (
    <>
      {/* Fixed Navbar */}
      <nav className="fixed top-0 left-0 w-full z-20 bg-white p-5  border-b shadow-sm">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-500">
            MORENT
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex w-full max-w-lg mx-4 items-center relative">
            {/* <img src="./search-normal.png" alt="search" className="absolute left-3 top-2.5 w-4 h-4" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Something Here..."
              className="w-full border-2 rounded-full p-2 pl-10 border-blue-400"
            /> */}
          </div>

          {/* Desktop User Controls */}
          {isAuthenticated && user ? (
            <div className="hidden md:flex gap-4 items-center">
              <img
                src="./Like.png"
                alt="like"
                className="cursor-pointer"
                onClick={() => navigate("/favCars")}
              />
              <div className="relative cursor-pointer" onClick={() => navigate("/notification")}>
                <img src="./notification.png" alt="notification" />
                {notificationsBool && (
                  <div className="w-3 h-3 bg-red-500 rounded-full absolute top-0 right-0" />
                )}
              </div>
              <img
                onClick={() => navigate('/settings')}
                src="./Settings.png"
                alt="settings"
                className="cursor-pointer"
              />
              <img
                src={user.profilePicture}
                alt="profile"
                className="w-8 h-8 object-cover rounded-full cursor-pointer"
              />
            </div>
          ) : (
            <div className="hidden md:flex gap-4 items-center">
              <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded-md">Login</Link>
              <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-md">Signup</Link>
            </div>
          )}

          {/* Mobile Menu Icon */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-4 space-y-4">
            {/* Mobile Search */}
            <div className="flex items-center border-2 border-blue-400 rounded-full px-3 py-2">
              <img src="./search-normal.png" alt="search" className="w-4 h-4 mr-2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full outline-none"
              />
            </div>

            {/* Authenticated User Controls */}
            {isAuthenticated && user ? (
              <div className="flex flex-col gap-4">
                <button onClick={() => navigate("/favCars")}>Favorites</button>
                <button onClick={() => navigate("/notification")} className="relative">
                  Notifications
                  {notificationsBool && (
                    <span className="w-2 h-2 bg-red-500 rounded-full absolute top-0 right-0" />
                  )}
                </button>
                <button onClick={() => navigate("/settings")}>Settings</button>
                <div className="flex items-center gap-2">
                  <img
                    src={user.profilePicture}
                    alt="profile"
                    className="w-8 h-8 object-cover rounded-full"
                  />
                  <span>{user.name || 'User'}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded-md text-center">
                  Login
                </Link>
                <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-md text-center">
                  Signup
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Spacer to prevent content from hiding behind fixed nav */}
      <div className="mb-20" />
    </>
  );
};

export default Nav;
