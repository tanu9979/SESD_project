import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, MessageCircle, BookPlus, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import FolioLogo from './FolioLogo';

const Navbar = () => {
  const { user, logout, isLoggedIn } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="bg-folio-green text-folio-cream shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <FolioLogo size={32} />
          <span className="font-heading text-2xl font-bold text-folio-cream">Folio</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/books" className="hover:text-folio-gold transition-colors">Browse</Link>
          <Link to="/books?type=donate" className="hover:text-folio-gold transition-colors">Free Books</Link>
          {isLoggedIn && (
            <>
              <Link to="/create-listing" className="hover:text-folio-gold transition-colors flex items-center gap-1"><BookPlus size={15} /> Sell/Donate</Link>
              <Link to="/messages"       className="hover:text-folio-gold transition-colors flex items-center gap-1"><MessageCircle size={15} /> Messages</Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link to="/cart" className="relative p-1">
                <ShoppingCart size={22} className="text-folio-cream hover:text-folio-gold transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-folio-gold text-white text-xs w-4 h-4 rounded-full flex items-center justify-center leading-none">{cartCount}</span>
                )}
              </Link>
              <div className="relative group">
                <button className="flex items-center gap-2 hover:text-folio-gold transition-colors">
                  <span className="w-8 h-8 rounded-full bg-folio-gold flex items-center justify-center text-white font-bold text-sm">
                    {user?.name[0].toUpperCase()}
                  </span>
                </button>
                <div className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-lg border border-folio-light opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 text-folio-dark text-sm">
                  <Link to="/my-orders"   className="block px-4 py-2.5 hover:bg-folio-cream">My Orders</Link>
                  <Link to="/my-rentals"  className="block px-4 py-2.5 hover:bg-folio-cream">My Rentals</Link>
                  <Link to="/my-listings" className="block px-4 py-2.5 hover:bg-folio-cream">My Listings</Link>
                  {user?.role === 'admin' && <Link to="/admin" className="block px-4 py-2.5 hover:bg-folio-cream">Admin</Link>}
                  <hr className="border-folio-light" />
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 hover:bg-folio-cream text-red-500 flex items-center gap-2"><LogOut size={14} /> Logout</button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login"    className="hover:text-folio-gold transition-colors text-sm">Login</Link>
              <Link to="/register" className="btn-gold text-sm !py-2 !px-4 rounded-lg">Join Folio</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
