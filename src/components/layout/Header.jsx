import React, { useEffect, useState, useContext } from 'react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../common/ThemeToggle';
import { Menu, Maximize, Minimize, LogOut, RefreshCw, SettingsIcon } from "lucide-react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import lightLogo from '../../assets/insightLight.svg';
import darkLogo from '../../assets/insightDark.svg';
import { useTheme } from 'next-themes';
import Notifications from './Notifications';

const menuItems = [
  {
    name: 'Dashboard',
    link: '/',
  },
  {
    name: 'Activities',
    link: '/activities',
  },
  {
    name: 'Stock Request',
    link: '/stock-requests',
  },
  {
    name: 'Forms',
    link: '/forms',
  },
  {
    name: 'Agents',
    link: '/agents',
  },
  {
    name: 'Settings',
    link: '/settings',
  },
];

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme } = useTheme();

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("");
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleFullscreen = () => {
    if (!isFullscreen) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleWindowRefresh = () => {
    window.location.reload();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="flex justify-between items-center px-1.5">
      <Link to="/" className="">
        <img src={theme === 'dark' ? darkLogo : lightLogo} alt="Insight" className="w-32 h-auto" />
      </Link>
      <div className="flex items-center gap-1 md:mr-2 mt-2">
        <div className="hidden md:flex items-center gap-2 bg-[#fcfbfc83] dark:bg-zinc-800 rounded-full p-1">
          {menuItems.map((item, index) => (
            <Link
              to={item.link}
              key={index}
              className={`py-3 px-6 hover:bg-gray-200 hover:text-zinc-800 dark:hover:bg-zinc-700 dark:hover:text-zinc-300 rounded-full transition-colors duration-300 ease-in-out
                ${isActive(item.link) ? 'bg-[#303030] dark:bg-zinc-300 text-neutral-200 dark:text-neutral-700' : ''}
              `}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <button
          onClick={handleWindowRefresh}
          className="hidden md:flex bg-[#fcfbfc83] dark:bg-zinc-800 rounded-full min-h-10 h-full items-center gap-3 px-3 py-3 hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer"
        >
          <RefreshCw size={20} strokeWidth={1} />
          Refresh
        </button>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Notifications />
          <button
            onClick={handleFullscreen}
            className="hidden md:flex w-10 min-h-10 h-full py-3 bg-[#fcfbfc83] dark:bg-zinc-800 rounded-full justify-center items-center hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer"
          >
            {isFullscreen ? <Minimize size={20} strokeWidth={1} /> : <Maximize size={20} strokeWidth={1} />}
          </button>
          <div className="flex items-center">
            <Popover>
              <PopoverTrigger asChild>
                <img
                  src={user?.profilePic || `https://eu.ui-avatars.com/api/?name=${getInitials(user?.name)}`}
                  alt="Profile"
                  className="w-8 h-8 rounded-full cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out"
                />
              </PopoverTrigger>
              <PopoverContent>
                <div className="flex flex-col gap-2">
                  <div
                    className="flex flex-col text-center items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors duration-300 ease-in-out"
                  >
                    <img
                      src={user?.profilePic || `https://eu.ui-avatars.com/api/?name=${getInitials(user?.name)}`}
                      alt="Profile"
                      className="w-16 h-16 rounded-full"
                    />
                    <span className="text-lg font-medium">{user?.name}</span>
                    <span className="text-sm text-gray-500">{user?.email}</span>
                    <span className="text-sm text-gray-500">{user?.role}</span>
                  </div>
                  <Link
                    to="/settings"
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors duration-300 ease-in-out"
                  >
                    <SettingsIcon size={20} strokeWidth={1} />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors duration-300 ease-in-out"
                  >
                    <LogOut size={20} strokeWidth={1} />
                    <span>Logout</span>
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <button
          onClick={toggleMenu}
          className="md:hidden flex items-center justify-center w-10 h-10 bg-[#fcfbfc83] dark:bg-zinc-800 rounded-full hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer"
        >
          <Menu size={20} strokeWidth={1} />
        </button>
      </div>
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="bg-white dark:bg-zinc-800 w-64 h-full p-4">
            <button
              onClick={toggleMenu}
              className="flex items-center justify-center w-10 h-10 bg-[#fcfbfc83] dark:bg-zinc-800 rounded-full hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer mb-4"
            >
              <Menu size={20} strokeWidth={1} />
            </button>
            <div className="flex flex-col gap-2">
              {menuItems.map((item, index) => (
                <Link
                  to={item.link}
                  key={index}
                  className={`py-3 px-6 hover:bg-gray-200 hover:text-zinc-800 dark:hover:bg-zinc-700 dark:hover:text-zinc-300 rounded-full transition-colors duration-300 ease-in-out
                    ${isActive(item.link) ? 'bg-[#303030] dark:bg-zinc-300 text-neutral-200 dark:text-neutral-700' : ''}
                  `}
                  onClick={toggleMenu}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;