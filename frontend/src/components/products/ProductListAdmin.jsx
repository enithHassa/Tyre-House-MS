import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Trash2, Edit, Download } from 'lucide-react';
import jsPDF from 'jspdf';

export default function ProductListAdmin({ onEdit, onDelete }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [editOrder, setEditOrder] = useState(null);
  const [status, setStatus] = useState('');
  const [activeTab, setActiveTab] = useState('products');
  const [viewSlip, setViewSlip] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/products')
      .then(res => res.json())
      .then(setProducts);
  }, []);

  useEffect(() => {
    fetch('http://localhost:8080/api/orders')
      .then(res => res.json())
      .then(setOrders);
  }, []);

  useEffect(() => {
    fetch('http://localhost:8080/api/bookings')
      .then(res => res.json())
      .then(setBookings);
  }, []);

  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Delete this order?')) return;
    await fetch(`http://localhost:8080/api/orders/${id}`, { method: 'DELETE' });
    setOrders(orders.filter(o => o.id !== id));
    toast.success('Order deleted');
  };

  const handleEditOrder = (order) => {
    setEditOrder(order);
    setStatus(order.status);
  };

  const handleUpdateOrder = async () => {
    await fetch(`http://localhost:8080/api/orders/${editOrder.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editOrder, status })
    });
    setOrders(orders.map(o => o.id === editOrder.id ? { ...o, status } : o));
    setEditOrder(null);
    toast.success('Order status updated');
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Delete this booking?')) return;
    await fetch(`http://localhost:8080/api/bookings/${id}`, { method: 'DELETE' });
    setBookings(bookings.filter(b => b.id !== id));
    toast.success('Booking deleted');
  };

  // PDF download handler for all orders
  const handleDownloadOrdersPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('All Orders', 14, 18);
    doc.setFontSize(9);
    let y = 28;
    // Adjusted X positions for more columns
    doc.text('Order ID', 10, y);
    doc.text('User', 26, y);
    doc.text('Total', 60, y);
    doc.text('Status', 80, y);
    doc.text('Card', 100, y);
    doc.text('ZIP', 115, y);
    doc.text('Phone', 130, y);
    doc.text('Email', 155, y);
    y += 7;
    doc.setFontSize(8);
    orders.forEach(order => {
      const truncate = (str, n = 18) => str && str.length > n ? str.slice(0, n - 3) + '...' : (str || '-');
      doc.text(String(order.id), 10, y);
      doc.text(truncate(order.userEmail, 18), 26, y);
      doc.text('Rs. ' + (order.total?.toLocaleString() || '-'), 60, y);
      doc.text(truncate(order.status, 10), 80, y);
      doc.text(truncate(order.cardType, 8), 100, y);
      doc.text(truncate(order.zip, 8), 115, y);
      doc.text(truncate(order.phone, 12), 130, y);
      doc.text(truncate(order.email, 22), 155, y);
      y += 6;
      if (y > 280) { doc.addPage(); y = 18; doc.setFontSize(8); }
    });
    doc.save('all_orders.pdf');
  };

  // PDF download handler for all bookings
  const handleDownloadBookingsPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('All Bookings', 14, 18);
    doc.setFontSize(9);
    let y = 28;
    doc.text('Booking ID', 10, y);
    doc.text('Name', 28, y);
    doc.text('Email', 60, y);
    doc.text('Contact', 100, y);
    doc.text('Date', 125, y);
    doc.text('Time', 145, y);
    y += 7;
    doc.setFontSize(8);
    bookings.forEach(b => {
      const truncate = (str, n = 22) => str && str.length > n ? str.slice(0, n - 3) + '...' : (str || '-');
      doc.text(String(b.id), 10, y);
      doc.text(truncate(b.name, 18), 28, y);
      doc.text(truncate(b.email, 32), 60, y);
      doc.text(truncate(b.contactNo, 16), 100, y);
      doc.text(truncate(b.date, 12), 125, y);
      doc.text(truncate(b.time, 10), 145, y);
      y += 6;
      if (y > 280) { doc.addPage(); y = 18; doc.setFontSize(8); }
    });
    doc.save('all_bookings.pdf');
  };

  const handleViewSlip = (base64Slip) => {
    let prefix = '';
    if (base64Slip.startsWith('/9j/')) {
      prefix = 'data:image/jpeg;base64,';
    } else if (base64Slip.startsWith('iVBOR')) {
      prefix = 'data:image/png;base64,';
    } else if (base64Slip.startsWith('JVBER')) {
      prefix = 'data:application/pdf;base64,';
    } else {
      prefix = 'data:image/jpeg;base64,';
    }
    setViewSlip(prefix + base64Slip);
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <div className="flex gap-4 mb-6">
        <button className={`px-4 py-2 rounded font-semibold ${activeTab === 'products' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`} onClick={() => setActiveTab('products')}>Products</button>
        <button className={`px-4 py-2 rounded font-semibold ${activeTab === 'orders' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`} onClick={() => setActiveTab('orders')}>Orders</button>
        <button className={`px-4 py-2 rounded font-semibold ${activeTab === 'bookings' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`} onClick={() => setActiveTab('bookings')}>Bookings</button>
      </div>
      {activeTab === 'products' && (
        <>
          <h2 className="text-2xl font-bold mb-4">All Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map(p => (
              <div key={p.id} className="bg-gray-50 rounded shadow p-4 flex flex-col items-center">
                <img src={`data:image/jpeg;base64,${p.base64Image}`} alt={p.brandName} className="h-32 object-contain mb-2" />
                <div className="font-bold text-lg">{p.brandName}</div>
                <div className="text-sm text-gray-600 mb-1">Size: {p.size}</div>
                <div className="text-sm text-gray-600 mb-1">{p.description}</div>
                <div className="font-bold text-blue-700 mb-1">${p.price}</div>
                <div className="mb-2">
                  {p.availability ? <span className="text-green-600 bg-green-100 px-2 py-1 rounded text-xs">In Stock</span> : <span className="text-red-600 bg-red-100 px-2 py-1 rounded text-xs">Out of Stock</span>}
                </div>
                <div className="flex gap-2 mt-2">
                  <button className="bg-yellow-500 text-white px-3 py-1 rounded" onClick={() => onEdit(p)}>Edit</button>
                  <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => onDelete(p)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {activeTab === 'orders' && (
        <>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-4">All Orders
            <button className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1 text-xs hover:bg-blue-700 ml-4" onClick={handleDownloadOrdersPDF}><Download size={14}/> Download PDF</button>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">Order ID</th>
                  <th className="p-2">User</th>
                  <th className="p-2">Total</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Phone</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Created</th>
                  <th className="p-2">Payment Slip</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-t">
                    <td className="p-2">{order.id}</td>
                    <td className="p-2">{order.userEmail}</td>
                    <td className="p-2">Rs. {order.total?.toLocaleString()}</td>
                    <td className="p-2">{order.status}</td>
                    <td className="p-2">{order.phone}</td>
                    <td className="p-2">{order.email}</td>
                    <td className="p-2">{order.createdAt?.slice(0, 10)}</td>
                    <td className="p-2">
                      {order.base64PaymentSlip ? (
                        <button
                          className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold hover:bg-blue-700"
                          onClick={() => handleViewSlip(order.base64PaymentSlip)}
                        >
                          View Slip
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs">No slip</span>
                      )}
                    </td>
                    <td className="p-2 flex gap-2">
                      <button className="bg-yellow-500 text-white px-2 py-1 rounded" onClick={() => handleEditOrder(order)}><Edit size={16} /></button>
                      <button className="bg-red-600 text-white px-2 py-1 rounded" onClick={() => handleDeleteOrder(order.id)}><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {editOrder && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md relative">
                <button className="absolute top-2 right-2 text-gray-400 hover:text-black" onClick={() => setEditOrder(null)}>✕</button>
                <h2 className="text-xl font-bold mb-4">Edit Order Status</h2>
                <select
                  className="w-full border rounded px-3 py-2 mb-4"
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="PAID">PAID</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
                <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700" onClick={handleUpdateOrder}>Update</button>
              </div>
            </div>
          )}
          {/* Modal for viewing slip */}
          {viewSlip && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded shadow-lg p-4 max-w-lg w-full relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
                  onClick={() => setViewSlip(null)}
                >✕</button>
                {viewSlip.startsWith('data:image') ? (
                  <img src={viewSlip} alt="Payment Slip" className="max-w-full max-h-[70vh] mx-auto" />
                ) : (
                  <iframe
                    src={viewSlip}
                    title="Payment Slip PDF"
                    className="w-full h-[70vh] border rounded"
                  />
                )}
              </div>
            </div>
          )}
        </>
      )}
      {activeTab === 'bookings' && (
        <>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-4">All Bookings
            <button className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1 text-xs hover:bg-blue-700 ml-4" onClick={handleDownloadBookingsPDF}><Download size={14}/> Download PDF</button>
          </h2>
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
                  <button className="bg-red-600 text-white px-4 py-2 rounded font-semibold shadow hover:bg-red-700" onClick={() => handleDeleteBooking(b.id)}>Delete</button>
                </div>
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs px-3 py-1 rounded-bl-xl rounded-tr-xl tracking-widest font-bold">ADMIT ONE</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
} 