import { toast } from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

export default function DeleteProfile({ userId, onDeleted }) {
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your profile?')) return;
    try {
      const res = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        toast.success('Profile deleted!');
        if (onDeleted) onDeleted();
      } else {
        toast.error('Delete failed');
      }
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow text-center">
      <Trash2 className="mx-auto text-red-600" size={40} />
      <h2 className="text-2xl font-bold mb-4">Delete Profile</h2>
      <p className="mb-4">Are you sure you want to delete your profile? This action cannot be undone.</p>
      <button className="bg-red-600 text-white py-2 px-6 rounded hover:bg-red-700" onClick={handleDelete}>
        Delete
      </button>
    </div>
  );
} 