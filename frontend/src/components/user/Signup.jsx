import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../../assets/TH-logo.jpg';
import background1 from '../../assets/background-1.jpg';

export default function Signup({ onSignup }) {
  const [form, setForm] = useState({
    firstName: '', lastName: '', address: '', nic: '', gender: '', phone: '', email: '', password: ''
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8080/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        toast.success('Signup successful!');
        setForm({ firstName: '', lastName: '', address: '', nic: '', gender: '', phone: '', email: '', password: '' });
        if (onSignup) onSignup();
      } else {
        toast.error('Signup failed');
      }
    } catch (err) {
      toast.error('Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundImage: `url(${background1})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(215, 211, 211, 0.77)', zIndex: 1 }} />
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border-t-4 border-green-600" style={{ position: 'relative', zIndex: 2 }}>
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Logo" className="h-16 mb-2" style={{objectFit:'contain'}} />
          <h2 className="text-2xl font-bold mb-2 text-center">Create your account</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400" name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} required />
            <input className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400" name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} required />
          </div>
          <input className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400" name="address" placeholder="Address" value={form.address} onChange={handleChange} required />
          <input className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400" name="nic" placeholder="NIC" value={form.nic} onChange={handleChange} required />
          <select className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400" name="gender" value={form.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
          <input className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400" type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400" type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 flex items-center justify-center gap-2 text-lg font-semibold" type="submit">
            <UserPlus /> Sign Up
          </button>
        </form>
        <div className="flex justify-between mt-4 text-sm">
          <span className="text-gray-500">Already have an account?</span>
          <Link to="/login" className="text-green-600 hover:underline font-semibold">Login</Link>
        </div>
      </div>
    </div>
  );
} 