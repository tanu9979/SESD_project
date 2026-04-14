import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LocationProvider } from './context/LocationContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home           from './pages/Home';
import Login          from './pages/Login';
import Register       from './pages/Register';
import Books          from './pages/Books';
import BookDetail     from './pages/BookDetail';
import CreateListing  from './pages/CreateListing';
import Cart           from './pages/Cart';
import Checkout       from './pages/Checkout';
import MyOrders       from './pages/MyOrders';
import MyRentals      from './pages/MyRentals';
import MyListings     from './pages/MyListings';
import Messages       from './pages/Messages';
import Feedback       from './pages/Feedback';
import AdminDashboard from './pages/AdminDashboard';

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <LocationProvider>
          <div className="min-h-screen bg-folio-cream flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/"               element={<Home />} />
                <Route path="/login"          element={<Login />} />
                <Route path="/register"       element={<Register />} />
                <Route path="/books"          element={<Books />} />
                <Route path="/books/:id"      element={<BookDetail />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/cart"              element={<Cart />} />
                  <Route path="/checkout"          element={<Checkout />} />
                  <Route path="/my-orders"         element={<MyOrders />} />
                  <Route path="/my-rentals"        element={<MyRentals />} />
                  <Route path="/my-listings"       element={<MyListings />} />
                  <Route path="/create-listing"    element={<CreateListing />} />
                  <Route path="/edit-listing/:id"  element={<CreateListing />} />
                  <Route path="/messages"          element={<Messages />} />
                  <Route path="/feedback"          element={<Feedback />} />
                </Route>

                <Route element={<ProtectedRoute adminOnly />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <footer className="bg-folio-dark text-folio-cream/60 text-center py-4 text-sm">
              © {new Date().getFullYear()} Folio — Every page has a story to pass on
            </footer>
          </div>
        </LocationProvider>
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
