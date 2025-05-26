import { useEffect, useState } from 'react';
import { useCart } from '../payments/CartContext';
import { Filter, Tag, Layers, Ruler, DollarSign } from 'lucide-react';

export default function ProductList({ showAddToCart = false, showFilters = false }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const { addToCart } = useCart();

  // Filter states
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/api/products')
      .then(res => res.json())
      .then(setProducts);
  }, []);

  // Get unique filter options
  const categories = Array.from(new Set(products.map(p => p.category || ''))).filter(Boolean);
  const brands = Array.from(new Set(products.map(p => p.brandName || ''))).filter(Boolean);
  const sizes = Array.from(new Set(products.map(p => p.size || ''))).filter(Boolean);

  let filtered = products.filter(p =>
    (p.brandName.toLowerCase().includes(search.toLowerCase()) ||
      p.size.toLowerCase().includes(search.toLowerCase())) &&
    (!category || (p.category && p.category === category)) &&
    (!brand || (p.brandName && p.brandName === brand)) &&
    (!size || (p.size && p.size === size)) &&
    (!minPrice || Number(p.price) >= Number(minPrice)) &&
    (!maxPrice || Number(p.price) <= Number(maxPrice))
  );

  return (
    <div className="w-full min-h-[60vh] bg-gray-100 py-8">
      <h2 className="text-3xl font-bold text-center mb-6">Our Tyre Collection</h2>
      {!showFilters && (
        <div className="max-w-3xl mx-auto mb-8">
          <input
            className="w-full p-3 rounded shadow border"
            placeholder="Search by brand or size..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      )}
      <div className="max-w-6xl mx-auto flex gap-8 justify-start">
        {showFilters && (
          <div className="w-72 bg-white rounded-2xl shadow-lg p-6 h-fit border border-blue-200 mr-10 mt-2 sticky top-24 self-start">
            <h3 className="font-bold mb-6 text-blue-700 flex items-center gap-2 text-lg"><Filter size={20}/> Filter Products</h3>
            <div className="mb-5">
              <label className="block text-sm font-semibold mb-1 flex items-center gap-1"><Layers size={16}/> Category</label>
              <select className="w-full border border-blue-200 rounded-lg p-2 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium text-blue-900 appearance-none transition" value={category} onChange={e => setCategory(e.target.value)}>
                <option value="">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="mb-5">
              <label className="block text-sm font-semibold mb-1 flex items-center gap-1"><Tag size={16}/> Brand</label>
              <select className="w-full border border-blue-200 rounded-lg p-2 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium text-blue-900 appearance-none transition" value={brand} onChange={e => setBrand(e.target.value)}>
                <option value="">All Brands</option>
                {brands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="mb-5">
              <label className="block text-sm font-semibold mb-1 flex items-center gap-1"><Ruler size={16}/> Size</label>
              <select className="w-full border border-blue-200 rounded-lg p-2 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium text-blue-900 appearance-none transition" value={size} onChange={e => setSize(e.target.value)}>
                <option value="">All Sizes</option>
                {sizes.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="mb-5">
              <label className="block text-sm font-semibold mb-1 flex items-center gap-1"><DollarSign size={16}/> Price Range</label>
              <div className="flex gap-2 items-center">
                <input type="number" className="w-1/2 border rounded p-1" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
                <span>-</span>
                <input type="number" className="w-1/2 border rounded p-1" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
              </div>
            </div>
            <button className="w-full mt-2 bg-blue-100 hover:bg-blue-200 rounded py-2 text-sm font-semibold text-blue-700 transition" onClick={() => { setCategory(''); setBrand(''); setSize(''); setMinPrice(''); setMaxPrice(''); }}>Reset Filters</button>
          </div>
        )}
        <div className={showFilters ? "grid grid-cols-1 md:grid-cols-3 gap-8 flex-1" : "max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 w-full"}>
          {filtered.map(p => (
            <div key={p.id} className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
              <img src={`data:image/jpeg;base64,${p.base64Image}`} alt={p.brandName} className="h-32 object-contain mb-2" />
              <div className="font-bold text-lg">{p.brandName}</div>
              <div className="text-sm text-gray-600 mb-1">Size: {p.size}</div>
              <div className="font-bold text-blue-700 mb-1">${p.price}</div>
              <div className="mb-2">
                {p.availability ? <span className="text-green-600 bg-green-100 px-2 py-1 rounded text-xs">In Stock</span> : <span className="text-red-600 bg-red-100 px-2 py-1 rounded text-xs">Out of Stock</span>}
              </div>
              {showAddToCart && (
                <button
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mt-2 disabled:opacity-50"
                  onClick={() => addToCart(p)}
                  disabled={!p.availability}
                >
                  Add to Cart
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 