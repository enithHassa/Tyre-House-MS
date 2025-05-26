import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';

export default function CartPage() {
  const { cart, removeFromCart, updateQty, clearCart } = useCart();
  const navigate = useNavigate();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = cart.length > 0 ? 400 : 0;
  const total = subtotal + shipping;

  // PDF download handler for cart quotation
  const handleDownloadQuotationPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Quotation', 14, 18);
    doc.setFontSize(12);
    let y = 30;
    doc.text('Product', 14, y);
    doc.text('Qty', 90, y);
    doc.text('Price', 120, y);
    doc.text('Total', 160, y);
    y += 8;
    cart.forEach(item => {
      doc.text(item.brandName, 14, y);
      doc.text(String(item.qty), 90, y);
      doc.text('Rs. ' + item.price.toLocaleString(), 120, y);
      doc.text('Rs. ' + (item.price * item.qty).toLocaleString(), 160, y);
      y += 8;
    });
    y += 4;
    doc.text(`Subtotal: Rs. ${subtotal.toLocaleString()}`, 14, y);
    y += 8;
    doc.text(`Shipping: Rs. ${shipping.toLocaleString()}`, 14, y);
    y += 8;
    doc.text(`Total: Rs. ${total.toLocaleString()}`, 14, y);
    doc.save('cart_quotation.pdf');
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white p-6 rounded shadow min-h-[60vh]">
      <h2 className="text-2xl font-bold mb-6">Your Tyre Cart</h2>
      {cart.length === 0 ? (
        <div className="text-center text-gray-500">Your cart is empty.</div>
      ) : (
        <>
          <div className="flex justify-between mb-4">
            <div className="font-semibold">Cart Items</div>
            <div className="flex gap-2">
              <button className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1 text-xs hover:bg-blue-700" onClick={handleDownloadQuotationPDF}><Download size={14}/> Download Quotation</button>
              <button className="text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-50" onClick={clearCart}>Clear Cart</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full mb-6">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">Product</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Quantity</th>
                  <th className="p-2">Total</th>
                  <th className="p-2">Remove</th>
                </tr>
              </thead>
              <tbody>
                {cart.map(item => (
                  <tr key={item.id} className="border-t">
                    <td className="p-2 flex items-center gap-2">
                      <img src={`data:image/jpeg;base64,${item.base64Image}`} alt={item.brandName} className="h-12 w-12 object-contain" />
                      <span>{item.brandName}</span>
                    </td>
                    <td className="p-2">Rs. {item.price.toLocaleString()}</td>
                    <td className="p-2">
                      <input
                        type="number"
                        min={1}
                        value={item.qty}
                        onChange={e => updateQty(item.id, Math.max(1, Number(e.target.value)))}
                        className="w-16 border rounded px-2 py-1"
                      />
                    </td>
                    <td className="p-2">Rs. {(item.price * item.qty).toLocaleString()}</td>
                    <td className="p-2">
                      <button className="text-red-600 hover:underline" onClick={() => removeFromCart(item.id)}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="bg-gray-50 p-4 rounded w-full md:w-1/3">
              <div className="font-bold mb-2">Order Summary</div>
              <div className="flex justify-between mb-1"><span>Subtotal</span><span>Rs. {subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between mb-1"><span>Shipping</span><span>Rs. {shipping.toLocaleString()}</span></div>
              <div className="flex justify-between font-bold text-blue-700 text-lg"><span>Total</span><span>Rs. {total.toLocaleString()}</span></div>
              <button
                className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                onClick={() => navigate('/checkout')}
              >
                Checkout Now
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 