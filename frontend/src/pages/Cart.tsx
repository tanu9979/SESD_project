import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLocation } from '../context/LocationContext';

const FALLBACK = 'https://covers.openlibrary.org/b/id/8739161-L.jpg';

const Cart = () => {
  const { cart, cartCount, removeItem } = useCart();
  const { convertPrice } = useLocation();
  const navigate = useNavigate();

  const total = cart.reduce((sum: number, item: any) => sum + (item.book?.price || 0), 0);

  if (cartCount === 0) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="flex justify-center mb-4"><ShoppingCart size={72} className="text-folio-light" /></div>
      <h2 className="font-heading text-2xl font-bold mb-3">Your cart is empty</h2>
      <p className="text-folio-muted mb-8">Discover amazing books to add to your cart</p>
      <Link to="/books" className="btn-primary">Browse Books</Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="font-heading text-3xl font-bold mb-8">Your Cart ({cartCount})</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {cart.map((item: any) => (
            <div key={item._id} className="card p-4 flex items-center gap-4">
              <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-folio-light">
                <img
                  src={item.book?.image || FALLBACK}
                  alt={item.book?.title}
                  className="w-full h-full object-cover"
                  onError={e => { (e.target as HTMLImageElement).src = FALLBACK; }}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-folio-dark">{item.book?.title}</h3>
                <p className="text-folio-muted text-sm">{item.book?.author}</p>
                <span className="text-folio-green font-bold">{item.book?.type === 'donate' ? 'FREE' : convertPrice(item.book?.price)}</span>
              </div>
              <button onClick={() => removeItem(item._id)} className="text-red-400 hover:text-red-600 transition-colors p-1">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
        <div className="card p-6 h-fit space-y-4">
          <h2 className="font-heading text-xl font-bold">Order Summary</h2>
          <div className="flex justify-between text-sm"><span>Items</span><span>{cartCount}</span></div>
          <div className="flex justify-between font-bold text-lg border-t border-folio-light pt-4">
            <span>Total</span><span className="text-folio-green">{convertPrice(total)}</span>
          </div>
          <button onClick={() => navigate('/checkout')} className="btn-primary w-full flex items-center justify-center gap-2">
            Proceed to Checkout <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
