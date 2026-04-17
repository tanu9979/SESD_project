import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, CalendarDays, Gift, MessageCircle,
  Star, BookOpen, Tag, Layers, Ruler, Lightbulb, Heart,
} from 'lucide-react';
import { getBook } from '../services/bookService';
import { startConversation } from '../services/chatService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import StarRating from '../components/StarRating';
import ChatWindow from '../components/ChatWindow';
import { Book } from '../types';

const FALLBACK = 'https://covers.openlibrary.org/b/id/8739161-L.jpg';

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook]              = useState<Book | null>(null);
  const [conversationId, setConvoId] = useState<string | null>(null);
  const [showChat, setShowChat]      = useState(false);
  const [loading, setLoading]        = useState(true);
  const { addItem } = useCart();
  const { user, isLoggedIn } = useAuth();
  const { convertPrice } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) getBook(id).then(r => setBook(r.data)).finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!isLoggedIn) { navigate('/login'); return; }
    await addItem(book!._id);
    navigate('/cart');
  };

  const handleChat = async () => {
    if (!isLoggedIn) { navigate('/login'); return; }
    const res = await startConversation(book!.owner._id, book!._id);
    setConvoId(res.data._id);
    setShowChat(true);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-96">
      <BookOpen size={40} className="text-folio-green animate-pulse" />
    </div>
  );
  if (!book) return <div className="text-center py-20 text-folio-muted">Book not found</div>;

  const isOwner = user?._id === book.owner._id;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10">

        {/* Left — Cover + Details */}
        <div>
          <div className="rounded-2xl overflow-hidden h-80 mb-6 shadow-lg bg-folio-light">
            <img
              src={book.image || FALLBACK}
              alt={book.title}
              className="w-full h-full object-cover"
              onError={e => { (e.target as HTMLImageElement).src = FALLBACK; }}
            />
          </div>

          <div className="card p-4 space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 text-folio-muted"><Ruler size={14} /> Condition</span>
              <span className="font-medium capitalize">{book.condition}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 text-folio-muted"><Tag size={14} /> Category</span>
              <span className="font-medium">{book.category}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 text-folio-muted"><Layers size={14} /> Type</span>
              <span className="font-medium capitalize">{book.type}</span>
            </div>
            {book.examTags?.length > 0 && (
              <div className="flex justify-between items-start">
                <span className="flex items-center gap-1.5 text-folio-muted"><BookOpen size={14} /> Exam Tags</span>
                <div className="flex flex-wrap gap-1 justify-end">
                  {book.examTags.map(t => (
                    <span key={t._id} className="badge-cream text-xs">{t.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right — Info + Actions */}
        <div>
          <h1 className="font-heading text-3xl font-bold text-folio-dark mb-2">{book.title}</h1>
          <p className="text-folio-muted text-lg mb-4">by {book.author}</p>

          <div className="flex items-center gap-3 mb-6">
            <StarRating value={book.owner.avgRating} readonly />
            <span className="text-folio-muted text-sm">
              Seller: <strong className="text-folio-dark">{book.owner.name}</strong>
            </span>
          </div>

          <div className="font-heading text-4xl font-bold text-folio-green mb-6 flex items-baseline gap-2">
            {book.type === 'donate' ? (
              <span className="flex items-center gap-2"><Gift size={32} className="text-purple-500" /> FREE</span>
            ) : convertPrice(book.price)}
            {(book.type === 'rent' || book.type === 'both') && (
              <span className="text-lg text-folio-muted font-normal">/day</span>
            )}
          </div>

          {book.description && (
            <p className="text-folio-muted leading-relaxed mb-6">{book.description}</p>
          )}

          {!isOwner && book.status === 'available' && (
            <div className="flex flex-col gap-3 mb-8">
              {(book.type === 'sell' || book.type === 'both') && (
                <button onClick={handleAddToCart} className="btn-primary w-full flex items-center justify-center gap-2">
                  <ShoppingCart size={18} /> Add to Cart
                </button>
              )}
              {(book.type === 'rent' || book.type === 'both') && (
                <button onClick={() => navigate(`/rent/${book._id}`)} className="btn-secondary w-full flex items-center justify-center gap-2">
                  <CalendarDays size={18} /> Rent This Book
                </button>
              )}
              {book.type === 'donate' && (
                <button onClick={handleAddToCart} className="btn-gold w-full flex items-center justify-center gap-2">
                  <Heart size={18} /> Request This Book
                </button>
              )}
              <button onClick={handleChat} className="border border-folio-light text-folio-dark px-6 py-2.5 rounded-lg hover:bg-folio-cream transition-all flex items-center justify-center gap-2">
                <MessageCircle size={18} /> Chat with Seller
              </button>
            </div>
          )}

          {book.status !== 'available' && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm font-medium">
              This book is currently not available
            </div>
          )}

          {/* Seller Insights */}
          {book.sellerInsights && (
            <div className="bg-folio-cream border-l-4 border-folio-gold p-5 rounded-r-xl mb-6">
              <h3 className="font-heading font-semibold text-folio-dark mb-2 flex items-center gap-2">
                <Lightbulb size={16} className="text-folio-gold" /> Seller's Reading Insights
              </h3>
              <p className="text-folio-muted text-sm leading-relaxed italic">"{book.sellerInsights}"</p>
            </div>
          )}

          {/* Donor Note */}
          {book.donorNote && (
            <div className="bg-purple-50 border-l-4 border-purple-400 p-5 rounded-r-xl mb-6">
              <h3 className="font-heading font-semibold text-folio-dark mb-2 flex items-center gap-2">
                <Gift size={16} className="text-purple-500" /> A Note from the Donor
              </h3>
              <p className="text-folio-muted text-sm leading-relaxed italic">"{book.donorNote}"</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat */}
      {showChat && conversationId && (
        <div className="mt-10">
          <h2 className="font-heading text-xl font-bold mb-4 flex items-center gap-2">
            <MessageCircle size={20} className="text-folio-green" /> Chat with Seller
          </h2>
          <ChatWindow conversationId={conversationId} />
        </div>
      )}
    </div>
  );
};

export default BookDetail;
