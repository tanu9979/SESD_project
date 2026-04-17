import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyListings, deleteBook } from '../services/bookService';
import { Book } from '../types';
import { useLocation } from '../context/LocationContext';

const conditionColor: Record<string, string> = {
  new: 'badge-green',
  'like-new': 'badge-green',
  good: 'badge-gold',
  fair: 'badge-cream',
};

const MyListings = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { convertPrice } = useLocation();

  const load = () => getMyListings().then(r => { setBooks(r.data?.data || r.data || []); setLoading(false); });
  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this listing? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await deleteBook(id);
      setBooks(prev => prev.filter(b => b._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Delete failed');
    } finally { setDeleting(null); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-folio-green border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-heading text-3xl font-bold">My Listings</h1>
        <Link to="/create-listing" className="btn-primary">+ New Listing</Link>
      </div>
      {books.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-4xl mb-4">📖</p>
          <p className="text-folio-muted text-lg mb-4">No listings yet.</p>
          <Link to="/create-listing" className="btn-primary">Create Your First Listing</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {books.map(book => (
            <div key={book._id} className="card p-5 flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-heading font-bold text-lg">{book.title}</h2>
                    <p className="text-folio-muted text-sm">by {book.author}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={conditionColor[book.condition] || 'badge'}>{book.condition}</span>
                    <span className={`badge ${book.status === 'available' ? 'badge-green' : 'badge-cream'}`}>{book.status}</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-4 text-sm">
                  <span className="font-bold text-folio-green text-lg">
                    {book.type === 'donate' ? 'FREE' : convertPrice(book.price)}
                  </span>
                  <span className="badge-gold capitalize">{book.type}</span>
                  {book.category && <span className="text-folio-muted">{book.category}</span>}
                </div>
                {book.sellerInsights && (
                  <p className="mt-2 text-sm text-folio-muted line-clamp-2 italic">"{book.sellerInsights}"</p>
                )}
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <Link to={`/books/${book._id}`} className="btn-secondary text-sm text-center">View</Link>
                <Link to={`/edit-listing/${book._id}`} className="btn-secondary text-sm text-center">Edit</Link>
                <button
                  onClick={() => handleDelete(book._id)}
                  disabled={deleting === book._id}
                  className="text-red-600 hover:text-red-800 text-sm font-medium border border-red-200 rounded-lg px-3 py-1.5 transition-colors hover:bg-red-50"
                >
                  {deleting === book._id ? '...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings;
