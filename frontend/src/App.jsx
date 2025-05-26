import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import Login from './components/user/Login'
import Signup from './components/user/Signup'
import Profile from './components/user/Profile'
import UpdateProfile from './components/user/UpdateProfile'
import DeleteProfile from './components/user/DeleteProfile'
import BookingForm from './components/bookings/BookingForm'
import BookingList from './components/bookings/BookingList'
import BookingEdit from './components/bookings/BookingEdit'
import BookingDelete from './components/bookings/BookingDelete'
import Navbar from './components/main/Navbar'
import Footer from './components/main/Footer'
import ProductList from './components/products/ProductList'
import ProductListAdmin from './components/products/ProductListAdmin'
import ProductForm from './components/products/ProductForm'
import { CartProvider } from './components/payments/CartContext'
import { Toaster } from 'react-hot-toast'
import CartPage from './components/payments/CartPage'
import CheckoutPage from './components/payments/CheckoutPage'
import About from './components/main/About'
import { NotificationProvider } from './components/main/NotificationContext'

// ProtectedRoute wrapper
function ProtectedRoute({ user, children }) {
  if (!user) return <Navigate to="/" replace />;
  return children;
}

// Layout wrapper for pages that need Navbar and Footer
function MainLayout({ children, user, onLogout }) {
  return (
    <>
      <Navbar user={user} onLogout={onLogout} />
      <div className="flex-1 w-full">{children}</div>
      <Footer />
    </>
  );
}

function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [editBooking, setEditBooking] = useState(null)
  const [deleteBooking, setDeleteBooking] = useState(null)
  const [editProduct, setEditProduct] = useState(null)
  const [showProductForm, setShowProductForm] = useState(false)
  const navigate = useNavigate()
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const handleLogin = (user) => {
    setUser(user);
    // Navigation is now handled in Login.jsx
  }
  const handleSignup = () => {
    navigate('/')
  }
  const handleLogout = () => {
    setUser(null)
    navigate('/')
  }
  const handleProfileUpdate = () => {
    navigate('/profile')
  }
  const handleDelete = () => {
    setUser(null)
    navigate('/')
  }
  const handleBookingEdit = (booking) => {
    setEditBooking(booking)
  }
  const handleBookingDelete = (booking) => {
    setDeleteBooking(booking)
  }
  const closeEditModal = () => {
    setEditBooking(null)
  }
  const closeDeleteModal = () => {
    setDeleteBooking(null)
  }
  const refreshBookings = () => {
    setEditBooking(null)
    setDeleteBooking(null)
    setRefreshKey(k => k + 1);
    navigate('/bookings', { replace: true })
  }
  // Product admin handlers
  const handleProductEdit = (product) => {
    setEditProduct(product)
    setShowProductForm(true)
  }
  const handleProductAdd = () => {
    setEditProduct(null)
    setShowProductForm(true)
  }
  const handleProductDelete = async (product) => {
    if (!window.confirm('Delete this product?')) return;
    await fetch(`http://localhost:8080/api/products/${product.id}`, { method: 'DELETE' })
    window.location.reload();
  }
  const closeProductForm = () => {
    setShowProductForm(false)
    setEditProduct(null)
    window.location.reload();
  }

  return (
    <CartProvider>
      <NotificationProvider>
      <div className="min-h-screen w-full flex flex-col bg-gray-100">
        <Toaster />
        <Routes>
          <Route path="/signup" element={<Signup onSignup={handleSignup} />} />
          <Route path="/" element={
            user
              ? user.isAdmin
                ? <Navigate to="/adminPage" replace />
                : <Navigate to="/home" replace />
              : <Login onLogin={handleLogin} />
          } />
          <Route path="/*" element={
            <ProtectedRoute user={user}>
              <MainLayout user={user} onLogout={handleLogout}>
                <Routes>
                  <Route path="/home" element={<ProductList showAddToCart={false} />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/products/tyres" element={<ProductList showAddToCart={true} showFilters={true} />} />
                  <Route path="/profile" element={<Profile userId={user?.id} onEdit={() => navigate('/update')} onDelete={() => navigate('/delete')} />} />
                  <Route path="/update" element={<UpdateProfile userId={user?.id} onUpdated={handleProfileUpdate} />} />
                  <Route path="/delete" element={<DeleteProfile userId={user?.id} onDeleted={handleDelete} />} />
                  <Route path="/book" element={<BookingForm onBooked={() => navigate('/bookings')} />} />
                  <Route path="/bookings" element={<BookingList user={user} onEdit={handleBookingEdit} onDelete={handleBookingDelete} refreshKey={refreshKey} />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage user={user} />} />
                  <Route path="/adminPage" element={
                    user && user.isAdmin ? (
                      <div>
                        <div className="max-w-6xl mx-auto flex justify-end mt-8">
                          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleProductAdd}>Add Product</button>
                        </div>
                        <ProductListAdmin onEdit={handleProductEdit} onDelete={handleProductDelete} />
                        {showProductForm && (
                          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xl relative">
                              <button className="absolute top-2 right-2 text-gray-400 hover:text-black" onClick={closeProductForm}>✕</button>
                              <ProductForm product={editProduct} onSaved={closeProductForm} />
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <Navigate to="/home" replace />
                    )
                  } />
                </Routes>
                {editBooking && <BookingEdit booking={editBooking} onUpdated={refreshBookings} onCancel={closeEditModal} />}
                {deleteBooking && <BookingDelete booking={deleteBooking} onDeleted={refreshBookings} onCancel={closeDeleteModal} />}
              </MainLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </div>
      </NotificationProvider>
    </CartProvider>
  )
}

export default App
