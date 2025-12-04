import React, { useState } from 'react';
import { HiMenuAlt3, HiX, HiUserCircle, HiLogout, HiCog } from 'react-icons/hi';
import { FaUserShield } from 'react-icons/fa';
import logo from '../../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/services', label: 'Services' },
  { path: '/doctors', label: 'Doctors' },
  { path: '/contacts', label: 'Contact' },
];

const getAuthLinks = (user) => {
  if (user?.role === 'admin') {
    return [
      { path: '/admin/dashboard', label: 'Admin Dashboard', icon: <HiUserCircle className="w-5 h-5" /> },
      { path: '/admin/doctors', label: 'Manage Doctors', icon: <FaUserShield className="w-4 h-4" /> },
      { path: '/admin/services', label: 'Manage Services', icon: <HiCog className="w-5 h-5" /> },
      { path: '/logout', label: 'Logout', icon: <HiLogout className="w-5 h-5" /> },
    ];
  } else if (user?.role === 'doctor') {
    return [
      { path: '/doctor', label: 'Doctor Dashboard', icon: <HiUserCircle className="w-5 h-5" /> },
      { path: '/logout', label: 'Logout', icon: <HiLogout className="w-5 h-5" /> },
    ];
  } else {
    // Patient links (default)
    return [
      { path: '/patient/dashboard', label: 'Dashboard', icon: <HiUserCircle className="w-5 h-5" /> },
      { path: '/patient/profile', label: 'Profile', icon: <FaUserShield className="w-4 h-4" /> },
      { path: '/patient/settings', label: 'Settings', icon: <HiCog className="w-5 h-5" /> },
      { path: '/logout', label: 'Logout', icon: <HiLogout className="w-5 h-5" /> },
    ];
  }
};

const Navbar = ({ 
  isAuthenticated = false, 
  user = null, 
  onLogout = () => {},
  onAuthLinkClick = (path, e) => {
    if (path === '/logout') {
      e.preventDefault();
      onLogout();
    }
  }
}) => {
  const navigate = useNavigate();
  const handleAuthLinkClick = (path, e) => {
    if (path === '/logout') {
      e.preventDefault();
      onLogout();
    }
    setIsOpen(false);
  };
  
  const handleAppointmentClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      toast.info('Please login or signup to book an appointment', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      navigate('/login');
    } else {
      navigate('/appointment');
    }
  };
  
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="w-full bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-sky-500 to-blue-700 shadow-lg">
            <Link to='/' onClick={() => setIsOpen(false)}>
              <img src={logo} alt="Medaid" className="h-10 w-10 object-contain" />
            </Link>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-sky-500">Medaid</p>
            <p className="text-lg font-semibold text-slate-900">Healing & Care</p>
          </div>
        </div>

        {!isAuthenticated || user?.role !== 'admin' ? (
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className="relative transition hover:text-slate-900"
              >
                {link.label}
                <span className="absolute -bottom-2 left-0 h-0.5 w-0 bg-linear-to-r
                 from-sky-500 to-teal-400 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>
        ) : (
          <div className="hidden lg:flex items-center space-x-8">
            <span className="text-lg font-semibold text-gray-700">Admin Panel</span>
          </div>
        )}

        <div className="hidden lg:flex items-center space-x-3">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 focus:outline-none"
                aria-label="User menu"
              >
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center text-white font-semibold">
          {user?.name?.charAt(0) || user?.firstName?.charAt(0) || 'U'}
        </div>
        <span className="text-sm font-medium text-gray-700">
          {user?.name || user?.firstName || 'User'}
        </span>
      </button>
      
      {isProfileOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg
         shadow-xl py-1 z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
          
          <div className="py-1">
            {getAuthLinks(user).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={(e) => onAuthLinkClick(link.path, e)}
                className="flex items-center px-4 py-2 text-sm text-gray-700
                 hover:bg-gray-100"
              >
                <span className="mr-3">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  ) : (
    <div className="flex items-center space-x-3">
      <Link 
        to="/login" 
        className="px-4 py-2 text-sm font-medium text-sky-600 hover:text-sky-700"
      >
        Login
      </Link>
      <Link 
        to="/signup" 
        className="rounded-full bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-2
         text-sm font-semibold text-white shadow-lg shadow-sky-200 transition
          hover:-translate-y-0.5"
      >
        Sign Up
      </Link>
    </div>
  )}
  
  <button 
    onClick={handleAppointmentClick}
    className="rounded-full bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-2 
    text-sm font-semibold text-white shadow-lg shadow-sky-200 transition
     hover:-translate-y-0.5"
  >
    Book Appointment
  </button>
</div>
<button
className="rounded-full p-2 text-slate-700 lg:hidden"
onClick={() => setIsOpen(prev => !prev)}
aria-label="Toggle menu"
>
{isOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
</button>
</div>
{isOpen && (
<div className="border-t border-slate-100 bg-white px-4 py-4 shadow-lg lg:hidden">
<ul className="space-y-4 text-base font-medium text-slate-700">
{navLinks.map(link => (
<li key={link.path}>
 <Link
 to={link.path}
 className="block rounded-lg px-3 py-2 hover:bg-slate-50"
 onClick={() => setIsOpen(false)}
 >
{link.label}
</Link>
</li>
))}
{isAuthenticated ? (
  <div className="pt-2">
    <div className="px-4 py-3 border-t border-gray-100">
      <p className="text-sm font-medium text-gray-900">
        {user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim()}
      </p>
      {user?.email && (
        <p className="text-xs text-gray-500 truncate">{user.email}</p>
      )}
    </div>
    
    {getAuthLinks(user).map((link) => (
      <li key={link.path} className="border-t border-gray-100">
        <Link
          to={link.path}
          onClick={(e) => handleAuthLinkClick(link.path, e)}
          className="flex items-center px-4 py-3 text-base text-gray-700
           hover:bg-gray-50"
        >
          <span className="mr-3">{link.icon}</span>
          {link.label}
        </Link>
      </li>
    ))}
  </div>
) : (
  <div className="space-y-3 pt-2">
    <li>
      <Link 
        to="/login" 
        className="block w-full rounded-xl border border-sky-500 px-4 py-3 text-center 
        text-base font-semibold text-sky-600 hover:bg-sky-50"
        onClick={() => setIsOpen(false)}
      >
        Login
      </Link>
    </li>
    <li>
      <Link 
        to="/signup" 
        className="block w-full rounded-xl bg-gradient-to-r from-sky-500 to-blue-600
         px-4 py-3 text-center text-base font-semibold text-white shadow-md"
        onClick={() => setIsOpen(false)}
      >
        Sign Up
      </Link>
    </li>
    <li>
      <button 
        onClick={(e) => {
          handleAppointmentClick(e);
          setIsOpen(false);
        }}
        className="block w-full rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 
        px-4 py-3 text-center text-base font-semibold text-white shadow-md"
      >
        Book Appointment
      </button>
    </li>
  </div>
)}
</ul>
 </div>
)}
</header>
  )
}

export default Navbar;
