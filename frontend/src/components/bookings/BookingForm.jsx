import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNotifications } from '../main/NotificationContext';

const timeSlots = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
];

export default function BookingForm({ onBooked }) {
  const [form, setForm] = useState({
    name: '', email: '', contactNo: '', date: '', time: '', description: ''
  });
  const { addNotification } = useNotifications();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const user = JSON.parse(stored);
      setForm(f => ({ ...f, email: user.email || '' }));
    }
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8080/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          date: form.date,
          time: form.time
        })
      });
      if (res.ok) {
        toast.success('Appointment booked!');
        addNotification({ text: `Booking added for ${form.date} at ${form.time}` });
        setForm({ name: '', email: '', contactNo: '', date: '', time: '', description: '' });
        if (onBooked) onBooked();
      } else {
        toast.error('Booking failed');
      }
    } catch {
      toast.error('Booking failed');
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-12 mt-28 w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-2">Tyre Shop</h2>
        <p className="text-center text-gray-500 mb-6">Book your appointment today</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-1">Your Name</label>
            <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="Enter your full name" required />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Select Date</label>
            <input name="date" type="date" value={form.date} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Your Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="example@email.com" required />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Select Time</label>
            <select name="time" value={form.time} onChange={handleChange} className="w-full border rounded px-3 py-2" required>
              <option value="">Choose a time slot</option>
              {timeSlots.map(slot => <option key={slot} value={slot}>{slot}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Contact Number</label>
            <input name="contactNo" value={form.contactNo} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="10-digit number" required />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Description</label>
            <input name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="Description" />
          </div>
        </div>
        <button className="w-full mt-4 py-3 rounded bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg shadow hover:from-blue-700 hover:to-purple-700 transition">Book Appointment</button>
      </form>
    </div>
  );
} 