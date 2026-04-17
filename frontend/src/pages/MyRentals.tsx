import { useState, useEffect } from 'react';
import { getMyRentals, returnBook } from '../services/rentalService';
import { Rental } from '../types';
import { useLocation } from '../context/LocationContext';

const statusBadge: Record<string, string> = {
  active:   'badge-green',
  returned: 'badge-cream',
  overdue:  'bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium',
};

const MyRentals = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading]   = useState(true);
  const [returning, setReturning] = useState<string | null>(null);
  const { convertPrice } = useLocation();

  const load = () => getMyRentals().then(r => { setRentals(r.data?.data || r.data || []); setLoading(false); });
  useEffect(() => { load(); }, []);

  const handleReturn = async (id: string) => {
    if (!confirm('Confirm book return?')) return;
    setReturning(id);
    try {
      await returnBook(id);
      await load();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Return failed');
    } finally { setReturning(null); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-folio-green border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="font-heading text-3xl font-bold mb-8">My Rentals</h1>
      {rentals.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-4xl mb-4">📚</p>
          <p className="text-folio-muted text-lg">No rentals yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rentals.map(rental => {
            const book = rental.book as any;
            const daysLeft = rental.status === 'active'
              ? Math.ceil((new Date(rental.endDate).getTime() - Date.now()) / 86400000)
              : null;
            return (
              <div key={rental._id} className="card p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="font-heading font-bold text-lg">{book?.title}</h2>
                      <span className={statusBadge[rental.status] || 'badge'}>{rental.status}</span>
                    </div>
                    <p className="text-folio-muted text-sm">by {book?.author}</p>
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-folio-muted text-xs">Start</p>
                        <p className="font-medium">{new Date(rental.startDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-folio-muted text-xs">Due</p>
                        <p className={`font-medium ${rental.status === 'overdue' ? 'text-red-600' : ''}`}>
                          {new Date(rental.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-folio-muted text-xs">Daily Rate</p>
                        <p className="font-medium">{convertPrice(rental.dailyRate)}</p>
                      </div>
                      <div>
                        <p className="text-folio-muted text-xs">Total</p>
                        <p className="font-medium text-folio-green">{convertPrice(rental.totalAmount)}</p>
                      </div>
                    </div>
                    {rental.status === 'active' && daysLeft !== null && (
                      <p className={`mt-2 text-sm font-medium ${daysLeft <= 2 ? 'text-red-600' : 'text-folio-muted'}`}>
                        {daysLeft > 0 ? `${daysLeft} day${daysLeft !== 1 ? 's' : ''} remaining` : 'Due today!'}
                      </p>
                    )}
                    {rental.status === 'returned' && rental.returnedDate && (
                      <p className="mt-2 text-sm text-folio-muted">Returned on {new Date(rental.returnedDate).toLocaleDateString()}</p>
                    )}
                  </div>
                  {rental.status === 'active' && (
                    <button
                      onClick={() => handleReturn(rental._id)}
                      disabled={returning === rental._id}
                      className="btn-secondary ml-4 text-sm"
                    >
                      {returning === rental._id ? 'Processing...' : 'Return Book'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyRentals;
