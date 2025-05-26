import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-[70vh] bg-gradient-to-br from-blue-50 to-blue-200 flex flex-col items-center justify-center py-16">
      {/* Hero Section */}
      <div className="max-w-3xl text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-4 drop-shadow">Welcome to TyreShop</h1>
        <p className="text-lg md:text-xl text-gray-700 mb-6">Your trusted partner for quality tyres, expert service, and unbeatable value. Drive safe, drive smart!</p>
        <button
          className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-8 py-3 rounded-full shadow-lg text-lg transition"
          onClick={() => navigate('/products/tyres')}
        >
          Shop Tyres
        </button>
      </div>
      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl w-full px-4">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-blue-700 text-3xl mb-2">🛞</span>
          <div className="font-bold text-lg mb-1">Wide Selection</div>
          <div className="text-gray-600 text-sm text-center">Choose from top brands and all sizes for every vehicle.</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-blue-700 text-3xl mb-2">🛠️</span>
          <div className="font-bold text-lg mb-1">Expert Service</div>
          <div className="text-gray-600 text-sm text-center">Our experienced team ensures perfect fit and safety.</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-blue-700 text-3xl mb-2">🚚</span>
          <div className="font-bold text-lg mb-1">Fast Delivery</div>
          <div className="text-gray-600 text-sm text-center">Get your tyres delivered and installed quickly.</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-blue-700 text-3xl mb-2">⭐</span>
          <div className="font-bold text-lg mb-1">Trusted by Customers</div>
          <div className="text-gray-600 text-sm text-center">Thousands of happy drivers rely on TyreShop every year.</div>
        </div>
      </div>
    </div>
  );
} 