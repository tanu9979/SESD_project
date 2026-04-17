import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, Handshake, Gift, Star,
  FlaskConical, Cpu, Clock, Brain, Scale, Wrench, BookMarked, Atom,
} from 'lucide-react';
import { getBooks } from '../services/bookService';
import BookCard from '../components/BookCard';
import FolioLogo from '../components/FolioLogo';
import { Book } from '../types';

const CATEGORIES: { name: string; icon: React.ReactNode }[] = [
  { name: 'Fiction',     icon: <BookOpen    size={32} className="text-folio-green" /> },
  { name: 'Science',     icon: <Atom        size={32} className="text-folio-green" /> },
  { name: 'History',     icon: <Clock       size={32} className="text-folio-green" /> },
  { name: 'Technology',  icon: <Cpu         size={32} className="text-folio-green" /> },
  { name: 'Self-Help',   icon: <Brain       size={32} className="text-folio-green" /> },
  { name: 'Medicine',    icon: <FlaskConical size={32} className="text-folio-green" /> },
  { name: 'Law',         icon: <Scale       size={32} className="text-folio-green" /> },
  { name: 'Engineering', icon: <Wrench      size={32} className="text-folio-green" /> },
];

const STATS = [
  { icon: <BookMarked size={28} className="text-folio-green" />, label: 'Books Listed',    val: '10,000+' },
  { icon: <Handshake  size={28} className="text-folio-green" />, label: 'Transactions',    val: '5,000+'  },
  { icon: <Gift       size={28} className="text-folio-green" />, label: 'Books Donated',   val: '1,200+'  },
  { icon: <Star       size={28} className="text-folio-green" />, label: 'Happy Readers',   val: '8,000+'  },
];

const Home = () => {
  const [featured, setFeatured] = useState<Book[]>([]);

  useEffect(() => {
    getBooks({ limit: 6 }).then(r => setFeatured(r.data?.data || []));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-folio-green text-folio-cream py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6"><FolioLogo size={72} /></div>
          <h1 className="font-heading text-5xl md:text-6xl font-bold mb-4">Folio</h1>
          <p className="text-folio-gold font-heading text-xl md:text-2xl italic mb-6">
            "Every page has a story to pass on"
          </p>
          <p className="text-folio-light text-lg mb-10 max-w-2xl mx-auto">
            Buy, sell, rent, or donate second-hand books. Connect with fellow readers and give every book a new home.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/books" className="bg-folio-gold text-white px-8 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-all text-center">
              Browse Books
            </Link>
            <Link to="/create-listing" className="border-2 border-folio-cream text-folio-cream px-8 py-3 rounded-lg font-medium hover:bg-folio-cream hover:text-folio-green transition-all text-center">
              List a Book
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-8 border-b border-folio-light">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map(s => (
            <div key={s.label}>
              <div className="flex justify-center mb-2">{s.icon}</div>
              <div className="font-heading font-bold text-2xl text-folio-green">{s.val}</div>
              <div className="text-folio-muted text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Free Books Spotlight */}
      <section className="bg-purple-50 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="flex-shrink-0 w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
            <Gift size={36} className="text-purple-500" />
          </div>
          <div className="flex-1">
            <h2 className="font-heading text-2xl font-bold text-folio-dark mb-2">Donate & Receive Free Books</h2>
            <p className="text-folio-muted">Someone's shelf is someone else's treasure. Browse free books — you only pay delivery charges.</p>
          </div>
          <Link to="/books?type=donate" className="btn-primary whitespace-nowrap">Browse Free Books</Link>
        </div>
      </section>

      {/* Categories */}
      <section className="py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-folio-dark mb-8">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map(cat => (
              <Link key={cat.name} to={`/books?category=${cat.name}`} className="card p-6 text-center hover:border-folio-green group transition-all">
                <div className="flex justify-center mb-3 group-hover:scale-110 transition-transform">{cat.icon}</div>
                <div className="font-medium text-folio-dark group-hover:text-folio-green transition-colors">{cat.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-14 px-4 bg-folio-cream">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading text-3xl font-bold text-folio-dark">Recently Listed</h2>
            <Link to="/books" className="text-folio-green font-medium hover:underline flex items-center gap-1">
              View all <BookOpen size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {featured.map(book => <BookCard key={book._id} book={book} />)}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
