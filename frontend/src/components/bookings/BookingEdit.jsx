import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const timeSlots = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
];

export default function BookingEdit({ booking, onUpdated, onCancel }) {
  const [form, setForm] = useState(booking || {});

  useEffect(() => {
    setForm(booking || {});
  }, [booking]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:8080/api/bookings/${form.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        toast.success('Booking updated!');
        if (onUpdated) onUpdated();
      } else {
        toast.error('Update failed');
      }
    } catch {
      toast.error('Update failed');
    }
  };

  if (!form) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8 w-full max-w-2xl relative">
        <button type="button" className="absolute top-2 right-2 text-gray-400 hover:text-black" onClick={onCancel}>✕</button>
        <h2 className="text-2xl font-bold text-center text-purple-700 mb-2">Edit Booking</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-1">Your Name</label>
            <input name="name" value={form.name || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Select Date</label>
            <input name="date" type="date" value={form.date || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Your Email</label>
            <input name="email" type="email" value={form.email || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Select Time</label>
            <select name="time" value={form.time || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" required>
              <option value="">Choose a time slot</option>
              {timeSlots.map(slot => <option key={slot} value={slot}>{slot}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Contact Number</label>
            <input name="contactNo" value={form.contactNo || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Description</label>
            <input name="description" value={form.description || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
        </div>
        <button className="w-full mt-4 py-3 rounded bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg shadow hover:from-blue-700 hover:to-purple-700 transition">Update Booking</button>
      </form>
    </div>
  );
} 