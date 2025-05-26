import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function ProductForm({ onSaved, product }) {
  const [form, setForm] = useState(product || {
    brandName: '', size: '', price: '', description: '', availability: true, base64Image: ''
  });
  const [preview, setPreview] = useState(product?.base64Image || '');

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImage = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setForm(f => ({ ...f, base64Image: ev.target.result }));
      setPreview(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const method = form.id ? 'PUT' : 'POST';
    const url = form.id ? `http://localhost:8080/api/products/${form.id}` : 'http://localhost:8080/api/products';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        toast.success('Product saved!');
        setForm({ brandName: '', size: '', price: '', description: '', availability: true, base64Image: '' });
        setPreview('');
        if (onSaved) onSaved();
      } else {
        toast.error('Save failed');
      }
    } catch {
      toast.error('Save failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8 w-full max-w-xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">{form.id ? 'Edit' : 'Add'} Product</h2>
      <div className="mb-4">
        <label className="block mb-1">Image</label>
        <input type="file" accept="image/*" onChange={handleImage} className="mb-2" />
        {preview && <img src={preview.startsWith('data:') ? preview : `data:image/jpeg;base64,${preview}`} alt="Preview" className="h-24 object-contain" />}
      </div>
      <div className="mb-4">
        <label className="block mb-1">Brand Name</label>
        <input name="brandName" value={form.brandName} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Size</label>
        <input name="size" value={form.size} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Price</label>
        <input name="price" type="number" value={form.price} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2" />
      </div>
      <div className="mb-4 flex items-center gap-2">
        <input type="checkbox" name="availability" checked={form.availability} onChange={handleChange} />
        <label>In Stock</label>
      </div>
      <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700" type="submit">
        {form.id ? 'Update' : 'Add'} Product
      </button>
    </form>
  );
} 