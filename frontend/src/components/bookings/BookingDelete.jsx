import { toast } from 'react-hot-toast';

export default function BookingDelete({ booking, onDeleted, onCancel }) {
  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/bookings/${booking.id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        toast.success('Booking deleted!');
        if (onDeleted) onDeleted();
      } else {
        toast.error('Delete failed');
      }
    } catch {
      toast.error('Delete failed');
    }
  };

  if (!booking) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Delete Booking</h2>
        <p className="mb-6">Are you sure you want to delete this booking?</p>
        <div className="flex gap-4 justify-center">
          <button className="bg-gray-300 px-4 py-2 rounded" onClick={onCancel}>Cancel</button>
          <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
} 