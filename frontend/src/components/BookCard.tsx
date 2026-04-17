import { Link } from 'react-router-dom';
import { ShoppingCart, CalendarDays, Gift, BookOpen, Star } from 'lucide-react';
import { Book } from '../types';
import { useLocation } from '../context/LocationContext';

const FALLBACK = 'https://covers.openlibrary.org/b/id/8739161-L.jpg';

const TYPE_CONFIG: Record<string, { label: string; icon: React.ReactNode; cls: string }> = {
  sell:   { label: 'For Sale',  icon: <ShoppingCart size={11} />, cls: 'badge-green' },
  rent:   { label: 'For Rent',  icon: <CalendarDays  size={11} />, cls: 'badge-gold'  },
  both:   { label: 'Sale/Rent', icon: <BookOpen      size={11} />, cls: 'badge-cream' },
  donate: { label: 'Free',      icon: <Gift          size={11} />, cls: 'bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1' },
};

const BookCard = ({ book }: { book: Book }) => {
  const { convertPrice } = useLocation();
  const cfg = TYPE_CONFIG[book.type] || TYPE_CONFIG.sell;

  return (
    <Link to={`/books/${book._id}`} className="card p-0 flex flex-col group overflow-hidden">
      {/* Cover */}
      <div className="relative h-52 bg-folio-light overflow-hidden">
        <img
          src={book.image || FALLBACK}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={e => { (e.target as HTMLImageElement).src = FALLBACK; }}
        />
        {/* Type badge overlay */}
        <span className={`absolute top-2 right-2 ${cfg.cls} flex items-center gap-1`}>
          {cfg.icon} {cfg.label}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        <div>
          <h3 className="font-heading font-semibold text-folio-dark text-sm leading-tight group-hover:text-folio-green transition-colors line-clamp-2">
            {book.title}
          </h3>
          <p className="text-folio-muted text-xs mt-0.5">{book.author}</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs badge-cream capitalize">{book.condition}</span>
          {book.category && <span className="text-xs text-folio-muted">{book.category}</span>}
        </div>

        {book.owner && (
          <div className="flex items-center gap-1">
            <Star size={11} className="fill-folio-gold text-folio-gold" />
            <span className="text-xs text-folio-muted">
              {book.owner.avgRating > 0 ? book.owner.avgRating.toFixed(1) : 'New'} · {book.owner.name}
            </span>
          </div>
        )}

        <div className="flex items-end justify-between mt-auto pt-2 border-t border-folio-light">
          <span className="font-heading font-bold text-folio-green text-base">
            {book.type === 'donate' ? 'FREE' : convertPrice(book.price)}
          </span>
          {(book.type === 'rent' || book.type === 'both') && (
            <span className="text-xs text-folio-muted">/day</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
