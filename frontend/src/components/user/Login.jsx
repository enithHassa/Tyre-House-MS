import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/TH-logo.jpg';
import background2 from '../../assets/background-2.jpg';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const user = await res.json();
        toast.success('Login successful!');
        localStorage.setItem('user', JSON.stringify(user));
        if (user.isAdmin) {
          navigate('/adminPage');
        } else {
          navigate('/home');
        }
        if (onLogin) onLogin(user);
      } else {
        toast.error('Invalid credentials');
      }
    } catch (err) {
      toast.error('Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundImage: `url(${background2})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(222, 219, 219, 0.79)', zIndex: 1 }} />
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border-t-4 border-blue-600" style={{ position: 'relative', zIndex: 2 }}>
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Logo" className="h-16 mb-2" style={{objectFit:'contain'}} />
          <h2 className="text-2xl font-bold mb-2 text-center">Login to Tyre Shop</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Password</label>
            <input
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2 text-lg font-semibold" type="submit">
            <LogIn /> Login
          </button>
        </form>
        <div className="flex justify-between mt-4 text-sm">
          <span className="text-gray-500">Don't have an account?</span>
          <Link to="/signup" className="text-blue-600 hover:underline font-semibold">Sign up</Link>
        </div>
      </div>
    </div>
  );
} 