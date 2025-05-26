import { useCart } from './CartContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useNotifications } from '../main/NotificationContext';

export default function CheckoutPage({ user }) {
  const { cart, clearCart } = useCart();
  const [form, setForm] = useState({
    firstName: '', lastName: '', company: '', district: '', address: '',
    phone: '', email: '', agree: false
  });
  const [paymentSlip, setPaymentSlip] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = cart.length > 0 ? 400 : 0;
  const total = subtotal + shipping;

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileChange = e => {
    setPaymentSlip(e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.agree) return toast.error('You must agree to the terms.');
    if (!paymentSlip) return toast.error('Please upload a payment slip.');
    setLoading(true);
    try {
      const order = {
        userEmail: user?.email || form.email || 'guest',
        total,
        status: 'PENDING',
        firstName: form.firstName,
        lastName: form.lastName,
        company: form.company,
        district: form.district,
        address: form.address,
        phone: form.phone,
        email: form.email,
      };
      // Convert file to base64
      const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
      let base64 = await toBase64(paymentSlip);
      // Ensure prefix is present
      if (!base64.startsWith('data:')) {
        if (paymentSlip.type === 'application/pdf') {
          base64 = 'data:application/pdf;base64,' + base64;
        } else if (paymentSlip.type.startsWith('image/')) {
          base64 = `data:${paymentSlip.type};base64,` + base64;
        }
      }
      order.base64PaymentSlip = base64;
      const res = await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      if (res.ok) {
        toast.success('Payment submitted!');
        addNotification({ text: `Payment of Rs. ${total.toLocaleString()} submitted!` });
        clearCart();
        navigate('/profile');
      } else {
        toast.error('Payment failed');
      }
    } catch {
      toast.error('Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white p-6 rounded shadow min-h-[60vh]">
      <button className="mb-4 px-4 py-1 rounded bg-gray-200 hover:bg-gray-300" onClick={() => navigate('/cart')}>&larr; Back to Cart</button>
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      <div className="flex flex-col md:flex-row gap-8">
        <form onSubmit={handleSubmit} className="flex-1 space-y-4">
          <div className="font-bold text-lg mb-2">Billing Details</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="firstName" placeholder="First Name *" className="border rounded px-3 py-2" value={form.firstName} onChange={handleChange} required />
            <input name="lastName" placeholder="Last Name *" className="border rounded px-3 py-2" value={form.lastName} onChange={handleChange} required />
            <input name="company" placeholder="Company Name (optional)" className="border rounded px-3 py-2" value={form.company} onChange={handleChange} />
            <select name="district" className="border rounded px-3 py-2" value={form.district} onChange={handleChange} required>
              <option value="">Districts *</option>
              <option value="Colombo">Colombo</option>
              <option value="Gampaha">Gampaha</option>
              <option value="Kandy">Kandy</option>
              <option value="Galle">Galle</option>
              <option value="Matara">Matara</option>
              <option value="Kurunegala">Kurunegala</option>
              <option value="Jaffna">Jaffna</option>
            </select>
            <input name="address" placeholder="Street Address *" className="border rounded px-3 py-2 md:col-span-2" value={form.address} onChange={handleChange} required />
            <input name="phone" placeholder="Phone *" className="border rounded px-3 py-2" value={form.phone} onChange={handleChange} required />
            <input name="email" placeholder="Email *" className="border rounded px-3 py-2 md:col-span-2" value={form.email} onChange={handleChange} required />
          </div>

          {/* Tyre Shop Bank Details Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4">
            <div className="font-bold text-blue-700 text-lg mb-2">Tyre Shop Bank Details</div>
            <div className="text-sm text-gray-700 mb-1"><b>Bank Name:</b> Commercial Bank PLC</div>
            <div className="text-sm text-gray-700 mb-1"><b>Account Name:</b> Tyre House Pvt Ltd</div>
            <div className="text-sm text-gray-700 mb-1"><b>Account Number:</b> 1234567890</div>
            <div className="text-sm text-gray-700 mb-1"><b>Branch:</b> Colombo Main</div>
            <div className="text-xs text-gray-500 mt-2">Please use your Order ID as the payment reference when making the transfer.</div>
          </div>

          <div className="font-bold text-lg mb-2">Upload Payment Slip *</div>
          <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} required className="border rounded px-3 py-2" />
          <div className="flex items-center gap-2">
            <input type="checkbox" name="agree" checked={form.agree} onChange={handleChange} />
            <label>I agree to the terms and conditions *</label>
          </div>
          <button
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mt-2"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Proceed To Submit'}
          </button>
        </form>
        <div className="bg-gray-50 p-4 rounded w-full md:w-1/3">
          <div className="font-bold mb-2">Order Summary</div>
          <table className="w-full text-sm mb-2">
            <tbody>
              {cart.map(item => (
                <tr key={item.id}>
                  <td>{item.brandName} × {item.qty}</td>
                  <td className="text-right">Rs. {(item.price * item.qty).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between mb-1"><span>Subtotal</span><span>Rs. {subtotal.toLocaleString()}</span></div>
          <div className="flex justify-between mb-1"><span>Shipping</span><span>Rs. {shipping.toLocaleString()}</span></div>
          <div className="flex justify-between font-bold text-blue-700 text-lg"><span>Total</span><span>Rs. {total.toLocaleString()}</span></div>
        </div>
      </div>
    </div>
  );
} 