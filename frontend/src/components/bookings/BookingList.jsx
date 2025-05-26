import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';

export default function BookingList({ user, onEdit, onDelete, refreshKey }) {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (!user) return;
    fetch(`http://localhost:8080/api/bookings?email=${encodeURIComponent(user.email)}`)
      .then(res => res.json())
      .then(setBookings);
  }, [user, refreshKey]);

  // PDF download handler for booking
  const handleDownloadBookingPDF = (booking) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Booking Ticket', 14, 18);
    doc.setFontSize(12);
    doc.text(`Booking ID: ${booking.id}`, 14, 30);
    doc.text(`Name: ${booking.name}`, 14, 38);
    doc.text(`Email: ${booking.email}`, 14, 46);
    doc.text(`Contact: ${booking.contactNo}`, 14, 54);
    doc.text(`Date: ${booking.date}`, 14, 62);
    doc.text(`Time: ${booking.time}`, 14, 70);
    doc.text(`Description: ${booking.description || '-'}`, 14, 78);
    doc.save(`booking_ticket_${booking.id}.pdf`);
  };

  if (!user) {
    return <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded shadow text-center">Please log in to view your bookings.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Your Bookings</h2>
      <div className="flex flex-col gap-6">
        {bookings.length === 0 && (
          <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">No bookings found.</div>
        )}
        {bookings.map(b => (
          <div key={b.id} className="relative bg-white rounded-xl shadow-lg flex flex-col md:flex-row items-center p-6 border-l-8 border-blue-600 ticket-block">
            <div className="flex-1 flex flex-col md:flex-row items-center gap-6">
              <div className="flex flex-col items-center md:items-start">
                <div className="text-3xl font-extrabold tracking-widest text-blue-700 mb-2">TICKET</div>
                <div className="text-xs text-gray-400 mb-1">Booking ID: {b.id}</div>
                <div className="text-lg font-bold mb-1">{b.name}</div>
                <div className="text-sm text-gray-600">{b.email}</div>
                <div className="text-sm text-gray-600">Contact: {b.contactNo}</div>
              </div>
              <div className="flex flex-col items-center md:items-start">
                <div className="text-md font-semibold text-gray-700 mb-1">Date: <span className="font-bold text-black">{b.date}</span></div>
                <div className="text-md font-semibold text-gray-700 mb-1">Time: <span className="font-bold text-black">{b.time}</span></div>
                <div className="text-md font-semibold text-gray-700 mb-1">Description: <span className="font-normal text-black">{b.description}</span></div>
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-4 md:mt-0 md:ml-8 items-center">
              <button className="bg-yellow-500 text-white px-4 py-2 rounded font-semibold shadow hover:bg-yellow-600" onClick={() => onEdit(b)}>Edit</button>
              <button className="bg-red-600 text-white px-4 py-2 rounded font-semibold shadow hover:bg-red-700" onClick={() => onDelete(b)}>Delete</button>
              <button className="bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700 mt-2 flex items-center justify-center" title="Download Ticket" onClick={() => handleDownloadBookingPDF(b)}><Download size={16} /></button>
            </div>
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs px-3 py-1 rounded-bl-xl rounded-tr-xl tracking-widest font-bold">ADMIT ONE</div>
          </div>
        ))}
      </div>
    </div>
  );
} 