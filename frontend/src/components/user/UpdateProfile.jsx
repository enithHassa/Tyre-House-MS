import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Edit } from 'lucide-react';
import { useNotifications } from '../main/NotificationContext';

export default function UpdateProfile({ userId, onUpdated }) {
  const [form, setForm] = useState(null);
  const { addNotification } = useNotifications();

  useEffect(() => {
    fetch(`http://localhost:8080/api/users/${userId}`)
      .then(res => res.json())
      .then(setForm);
  }, [userId]);

  if (!form) return <div className="text-center mt-10">Loading...</div>;

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        toast.success('Profile updated!');
        addNotification({ text: 'Profile updated successfully!' });
        if (onUpdated) onUpdated();
      } else {
        toast.error('Update failed');
      }
    } catch (err) {
      toast.error('Update failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border-t-4 border-yellow-500">
        <div className="flex flex-col items-center mb-6">
          <Edit className="text-yellow-500" size={32} />
          <h2 className="text-2xl font-bold mb-2 text-center">Update Profile</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400" name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} required />
            <input className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400" name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} required />
          </div>
          <input className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400" name="address" placeholder="Address" value={form.address} onChange={handleChange} required />
          <input className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400" name="nic" placeholder="NIC" value={form.nic} onChange={handleChange} required />
          <select className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400" name="gender" value={form.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
          <input className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400" type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400" type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          <button className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 flex items-center justify-center gap-2 text-lg font-semibold" type="submit">
            <Edit /> Update
          </button>
        </form>
      </div>
    </div>
  );
} 