import { useState, useEffect } from 'react';
import { getMyOrders } from '../services/orderService';
import { submitRating } from '../services/ratingService';
import OrderTracker from '../components/OrderTracker';
import StarRating from '../components/StarRating';
import { Order } from '../types';
import { useLocation } from '../context/LocationContext';

const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingModal, setRatingModal] = useState<{ orderId: string; sellerId: string } | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { convertPrice } = useLocation();

  useEffect(() => {
    getMyOrders().then(r => { setOrders(r.data?.data || r.data || []); setLoading(false); });
  }, []);

  const handleRate = async () => {
    if (!ratingModal || rating === 0) return;
    setSubmitting(true);
    try {
      await submitRating({ orderId: ratingModal.orderId, sellerId: ratingModal.sellerId, rating, comment });
      setRatingModal(null); setRating(0); setComment('');
      alert('Rating submitted!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit rating');
    } finally { setSubmitting(false); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-folio-green border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="font-heading text-3xl font-bold mb-8">My Orders</h1>
      {orders.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-4xl mb-4">📦</p>
          <p className="text-folio-muted text-lg">No orders yet. Start shopping!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order._id} className="card p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="font-heading font-bold text-lg">{(order.book as any)?.title}</h2>
                  <p className="text-folio-muted text-sm">by {(order.book as any)?.author}</p>
                  <p className="text-sm text-folio-muted mt-1">Order #{order._id.slice(-8).toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-folio-green text-lg">{convertPrice(order.totalAmount)}</p>
                  <p className="text-xs text-folio-muted">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <OrderTracker order={order} />
              {order.status === 'completed' && (
                <button
                  onClick={() => setRatingModal({ orderId: order._id, sellerId: (order.book as any)?.owner?._id || (order.book as any)?.owner })}
                  className="mt-4 text-sm text-folio-green font-medium hover:underline"
                >
                  ⭐ Rate Seller
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {ratingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card p-6 max-w-md w-full">
            <h3 className="font-heading font-bold text-xl mb-4">Rate Seller</h3>
            <StarRating value={rating} onChange={setRating} />
            <textarea
              className="input mt-4 h-24 resize-none"
              placeholder="Leave a comment (optional)"
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
            <div className="flex gap-3 mt-4">
              <button onClick={handleRate} disabled={submitting || rating === 0} className="btn-primary flex-1">
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
              <button onClick={() => setRatingModal(null)} className="btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
