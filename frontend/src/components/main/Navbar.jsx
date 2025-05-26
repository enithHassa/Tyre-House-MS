import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Bell } from 'lucide-react';
import { useCart } from '../payments/CartContext';
import NotificationSidebar from './NotificationSidebar';
import { useNotifications } from './NotificationContext';
import logo from '../../assets/TH-logo.jpg';

const menu = [
  {
    label: 'Home',
    path: '/home',
    dropdown: [
      { label: 'Dashboard', path: '/home' },
      { label: 'About', path: '/about' },
    ],
  },
  {
    label: 'Bookings',
    path: '/bookings',
    dropdown: [
      { label: 'Book Service', path: '/book' },
      { label: 'My Bookings', path: '/bookings' },
    ],
  },
  {
    label: 'Our Products',
    path: '/products/tyres',
    dropdown: [
      { label: 'Tyres', path: '/products/tyres' },
      { label: 'Batteries', path: '/products/batteries' },
    ],
  },
];

export default function Navbar({ user, onLogout }) {
  const [open, setOpen] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const closeTimeout = useRef();
  const navigate = useNavigate();
  const { cart } = useCart();
  const { notifications } = useNotifications();

  // Helper to handle delayed close
  const handleMenuMouseLeave = () => {
    closeTimeout.current = setTimeout(() => setOpen(null), 150);
  };
  const handleMenuMouseEnter = (idx) => {
    clearTimeout(closeTimeout.current);
    setOpen(idx);
  };

  return (
    <nav className="bg-blue-700 px-8 py-3 flex items-center justify-between shadow w-full">
      <div className="flex items-center gap-3 cursor-pointer select-none" > 
        <img src={logo} alt="TH Logo" className="h-10 w-10 object-contain rounded mr-2 bg-white p-1 shadow" onClick={() => navigate('/about')} />
        <span className="text-white text-2xl font-bold tracking-wide" onClick={() => navigate('/home')}>TyreShop</span>
      </div>
      <div className="flex items-center space-x-6 flex-1 justify-end">
        {user && user.isAdmin && (
          <button
            className="text-white bg-orange-500 hover:bg-orange-600 px-4 py-1 rounded font-semibold shadow transition"
            onClick={() => navigate('/adminPage')}
          >
            Admin Panel
          </button>
        )}
        {menu.map((item, idx) => (
          <div
            key={item.label}
            className="relative"
            onMouseEnter={() => handleMenuMouseEnter(idx)}
            onMouseLeave={handleMenuMouseLeave}
          >
            <button
              className={`text-white hover:bg-blue-800 px-3 py-1 rounded transition focus:outline-none font-medium ${open === idx ? 'bg-blue-800' : ''}`}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </button>
            {open === idx && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-[160px] bg-white rounded shadow-lg z-50 border border-blue-100"
                onMouseEnter={() => handleMenuMouseEnter(idx)}
                onMouseLeave={handleMenuMouseLeave}
              >
                {item.dropdown.map(sub => (
                  <Link
                    key={sub.path}
                    to={sub.path}
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-700 rounded"
                    onClick={() => setOpen(null)}
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
        {/* Profile dropdown - restored to menu */}
        <div
          className="relative"
          onMouseEnter={() => handleMenuMouseEnter('profile')}
          onMouseLeave={handleMenuMouseLeave}
        >
          <button
            className="text-white hover:bg-blue-800 px-3 py-1 rounded transition focus:outline-none font-medium"
            onClick={() => navigate('/profile')}
          >
            Profile
          </button>
          {open === 'profile' && (
            <div
              className="absolute top-full right-0 mt-2 min-w-[180px] bg-white rounded shadow-lg z-50 border border-blue-100 text-right"
              onMouseEnter={() => handleMenuMouseEnter('profile')}
              onMouseLeave={handleMenuMouseLeave}
            >
              <Link
                to="/profile"
                className="block px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-700 rounded text-left"
                onClick={() => setOpen(null)}
              >
                View Profile
              </Link>
              {user && (
                <button
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-700 rounded"
                  onClick={() => { setOpen(null); onLogout(); }}
                >
                  Logout
                </button>
              )}
            </div>
          )}
        </div>
        {/* Cart icon */}
        <button className="relative" onClick={() => navigate('/cart')}>
          <ShoppingCart className="text-white" size={26} />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
              {cart.reduce((sum, item) => sum + item.qty, 0)}
            </span>
          )}
        </button>
        {/* Notification Bell - far right */}
        <button className="relative ml-4" onClick={() => setNotifOpen(true)}>
          <Bell className="text-white" size={26} />
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </button>
        <NotificationSidebar open={notifOpen} onClose={() => setNotifOpen(false)} />
      </div>
    </nav>
  );
} 