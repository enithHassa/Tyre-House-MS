import { useEffect, useState } from 'react';
import { User, Edit, Trash2, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';
import jsPDF from 'jspdf';

export default function Profile({ userId, onEdit, onDelete }) {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [editOrder, setEditOrder] = useState(null);
  const [editFields, setEditFields] = useState({ address: '', zip: '', phone: '', email: '' });
  const [viewSlip, setViewSlip] = useState(null);

  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:8080/api/users/${userId}`)
        .then(res => res.json())
        .then(setUser);
    }
  }, [userId]);

  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:8080/api/orders?user=${encodeURIComponent(user.email)}`)
        .then(res => res.json())
        .then(setOrders);
    }
  }, [user]);

  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Delete this order?')) return;
    await fetch(`http://localhost:8080/api/orders/${id}`, { method: 'DELETE' });
    setOrders(orders.filter(o => o.id !== id));
    toast.success('Order deleted');
  };

  const handleEditOrder = (order) => {
    setEditOrder(order);
    setEditFields({
      address: order.address || '',
      zip: order.zip || '',
      phone: order.phone || '',
      email: order.email || '',
    });
  };

  const handleUpdateOrder = async () => {
    await fetch(`http://localhost:8080/api/orders/${editOrder.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editOrder, ...editFields })
    });
    setOrders(orders.map(o => o.id === editOrder.id ? { ...o, ...editFields } : o));
    setEditOrder(null);
    toast.success('Order updated');
  };

  // PDF download handler
  const handleDownloadPDF = (order) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Order Receipt', 14, 18);
    doc.setFontSize(12);
    doc.text(`Order ID: ${order.id}`, 14, 30);
    doc.text(`Date: ${order.date || '-'}`, 14, 38);
    doc.text(`Status: ${order.status}`, 14, 46);
    doc.text(`Address: ${order.address || '-'}`, 14, 54);
    doc.text(`Card: ${order.cardType} ${order.cardNumber ? '****' + order.cardNumber.slice(-4) : ''}`, 14, 62);
    doc.text(`ZIP: ${order.zip}`, 14, 70);
    doc.text(`Phone: ${order.phone}`, 14, 78);
    doc.text(`Email: ${order.email}`, 14, 86);
    doc.text(`Total: Rs. ${order.total?.toLocaleString()}`, 14, 94);
    doc.save(`order_receipt_${order.id}.pdf`);
  };

  const handleViewSlip = (base64Slip) => {
    // Try to detect file type by the first few characters
    let prefix = '';
    if (base64Slip.startsWith('/9j/')) {
      prefix = 'data:image/jpeg;base64,';
    } else if (base64Slip.startsWith('iVBOR')) {
      prefix = 'data:image/png;base64,';
    } else if (base64Slip.startsWith('JVBER')) {
      prefix = 'data:application/pdf;base64,';
    } else {
      // Default to jpeg if unsure
      prefix = 'data:image/jpeg;base64,';
    }
    setViewSlip(prefix + base64Slip);
  };

  if (!user) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-8 border-t-4 border-blue-600">
        <div className="flex items-center gap-3 mb-6">
          <User className="text-blue-600" size={32} />
          <h2 className="text-3xl font-bold">Profile</h2>
        </div>
        <div className="flex gap-8 mb-8">
          <div className="bg-gray-50 rounded-xl p-6 shadow flex flex-col items-center min-w-[300px] max-w-[320px] w-full" style={{ minHeight: 340, maxHeight: 340 }}>
            <div className="text-xl font-bold mb-2">{user.firstName} {user.lastName}</div>
            <div className="text-gray-600 mb-1">{user.email}</div>
            <div className="text-gray-600 mb-1">{user.phone}</div>
            <div className="text-gray-600 mb-1">{user.address}</div>
            <div className="text-gray-600 mb-1">NIC: {user.nic}</div>
            <div className="text-gray-600 mb-1">Gender: {user.gender}</div>
            <div className="flex gap-2 mt-4">
              <button className="bg-yellow-500 text-white py-2 px-4 rounded flex items-center gap-2 hover:bg-yellow-600 font-semibold" onClick={onEdit}>
                <Edit size={18} /> Update
              </button>
              <button className="bg-red-600 text-white py-2 px-4 rounded flex items-center gap-2 hover:bg-red-700 font-semibold" onClick={onDelete}>
                <Trash2 size={18} /> Delete
              </button>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-4">
            <h3 className="text-xl font-bold mb-2 border-b pb-1">Your Orders</h3>
            {orders.length === 0 ? (
              <div className="text-gray-500">No orders found.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[340px] overflow-y-auto pr-2">
                {orders.map(order => (
                  <div key={order.id} className="bg-white border border-gray-200 rounded-xl shadow p-4 flex flex-col gap-2 receipt-block">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-bold text-blue-700">Order Receipt</div>
                      <div className="text-xs text-gray-400">Order ID: {order.id}</div>
                    </div>
                    <div className="text-sm text-gray-700 mb-1"><b>Date:</b> {order.date || '-'}</div>
                    <div className="text-sm text-gray-700 mb-1"><b>Status:</b> {order.status}</div>
                    <div className="text-sm text-gray-700 mb-1"><b>Address:</b> {order.address || '-'}</div>
                    <div className="text-sm text-gray-700 mb-1"><b>Phone:</b> {order.phone}</div>
                    <div className="text-sm text-gray-700 mb-1"><b>Email:</b> {order.email}</div>
                    <div className="text-sm text-gray-700 mb-1"><b>Total:</b> <span className="font-bold text-green-700">Rs. {order.total?.toLocaleString()}</span></div>
                    {/* Payment Slip Display */}
                    {order.base64PaymentSlip && (
                      <div className="mt-2">
                        <div className="text-xs text-gray-500 mb-1">Payment Slip:</div>
                        <button
                          className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-blue-700"
                          onClick={() => handleViewSlip(order.base64PaymentSlip)}
                        >
                          View Slip
                        </button>
                      </div>
                    )}
                    {/* Modal for viewing slip */}
                    {viewSlip && (
                      (() => { console.log('Slip data URL:', viewSlip); return null; })()
                    )}
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
                    <div className="flex gap-2 mt-2">
                      <button className="bg-yellow-500 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-yellow-600" onClick={() => handleEditOrder(order)}><Edit size={14} /> Edit</button>
                      <button className="bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-red-700" onClick={() => handleDeleteOrder(order.id)}><Trash2 size={14} /> Delete</button>
                      <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-blue-700 flex items-center gap-1" onClick={() => handleDownloadPDF(order)}><Download size={14} /> Download</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {editOrder && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md relative">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-black" onClick={() => setEditOrder(null)}>✕</button>
              <h2 className="text-xl font-bold mb-4">Edit Order Details</h2>
              <input
                className="w-full border rounded px-3 py-2 mb-2"
                value={editFields.address}
                onChange={e => setEditFields(f => ({ ...f, address: e.target.value }))}
                placeholder="Address"
              />
              <input
                className="w-full border rounded px-3 py-2 mb-2"
                value={editFields.zip}
                onChange={e => setEditFields(f => ({ ...f, zip: e.target.value }))}
                placeholder="ZIP Code"
              />
              <input
                className="w-full border rounded px-3 py-2 mb-2"
                value={editFields.phone}
                onChange={e => setEditFields(f => ({ ...f, phone: e.target.value }))}
                placeholder="Phone"
              />
              <input
                className="w-full border rounded px-3 py-2 mb-4"
                value={editFields.email}
                onChange={e => setEditFields(f => ({ ...f, email: e.target.value }))}
                placeholder="Email"
              />
              <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700" onClick={handleUpdateOrder}>Update</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 