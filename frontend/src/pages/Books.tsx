import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getBooks, getExamTags } from '../services/bookService';
import BookCard from '../components/BookCard';
import { Book, ExamTag } from '../types';
import { useLocation } from '../context/LocationContext';

const CONDITIONS = ['new', 'like-new', 'good', 'fair'];
const TYPES      = ['sell', 'rent', 'both', 'donate'];
const CATEGORIES = ['Fiction', 'Science', 'History', 'Technology', 'Self-Help', 'Medicine', 'Law', 'Engineering'];

const Books = () => {
  const [books, setBooks]         = useState<Book[]>([]);
  const [total, setTotal]         = useState(0);
  const [examTags, setExamTags]   = useState<ExamTag[]>([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [page, setPage]           = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const { isIndia } = useLocation();

  const filters = {
    q:         searchParams.get('q') || '',
    category:  searchParams.get('category') || '',
    type:      searchParams.get('type') || '',
    condition: searchParams.get('condition') || '',
    examTag:   searchParams.get('examTag') || '',
  };

  useEffect(() => {
    if (isIndia) getExamTags().then(r => setExamTags(r.data || []));
  }, [isIndia]);

  useEffect(() => {
    setLoading(true); setError('');
    getBooks({ ...filters, page, limit: 12 })
      .then(r => { setBooks(r.data?.data || []); setTotal(r.data?.pagination?.total || 0); })
      .catch(() => setError('Could not load books. Make sure the server is running.'))
      .finally(() => setLoading(false));
  }, [searchParams, page]);

  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value); else params.delete(key);
    setSearchParams(params); setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 flex gap-8">
      {/* Filters */}
      <aside className="w-56 flex-shrink-0 space-y-6">
        <div>
          <h3 className="font-heading font-semibold text-folio-dark mb-3">Type</h3>
          <div className="space-y-2">
            {TYPES.map(t => (
              <label key={t} className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="radio" name="type" checked={filters.type === t} onChange={() => setFilter('type', filters.type === t ? '' : t)} className="accent-folio-green" />
                <span className="capitalize">{t === 'donate' ? 'Free (Donate)' : t}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-heading font-semibold text-folio-dark mb-3">Condition</h3>
          <div className="space-y-2">
            {CONDITIONS.map(c => (
              <label key={c} className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="radio" name="condition" checked={filters.condition === c} onChange={() => setFilter('condition', filters.condition === c ? '' : c)} className="accent-folio-green" />
                <span className="capitalize">{c}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-heading font-semibold text-folio-dark mb-3">Category</h3>
          <div className="space-y-2">
            {CATEGORIES.map(c => (
              <label key={c} className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="radio" name="category" checked={filters.category === c} onChange={() => setFilter('category', filters.category === c ? '' : c)} className="accent-folio-green" />
                {c}
              </label>
            ))}
          </div>
        </div>

        {isIndia && examTags.length > 0 && (
          <div>
            <h3 className="font-heading font-semibold text-folio-dark mb-3">🇮🇳 Exam</h3>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {examTags.map(tag => (
                <label key={tag._id} className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="radio" name="examTag" checked={filters.examTag === tag._id} onChange={() => setFilter('examTag', filters.examTag === tag._id ? '' : tag._id)} className="accent-folio-green" />
                  {tag.name}
                </label>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Main */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-heading text-2xl font-bold text-folio-dark">
            {filters.type === 'donate' ? '🎁 Free Books' : 'Browse Books'}
            <span className="text-folio-muted text-base font-normal ml-2">({total} found)</span>
          </h1>
          <input
            type="search"
            placeholder="Search books..."
            className="input !w-64"
            value={filters.q}
            onChange={e => setFilter('q', e.target.value)}
          />
        </div>

        {error ? (
          <div className="text-center py-20 text-red-500">
            <p className="text-lg">{error}</p>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="card h-72 animate-pulse bg-folio-light" />)}
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-20 text-folio-muted">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-lg">No books found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map(book => <BookCard key={book._id} book={book} />)}
          </div>
        )}

        {total > 12 && (
          <div className="flex justify-center gap-2 mt-10">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-secondary !px-4 !py-2 disabled:opacity-40">← Prev</button>
            <span className="px-4 py-2 text-folio-muted text-sm">Page {page}</span>
            <button disabled={page * 12 >= total} onClick={() => setPage(p => p + 1)} className="btn-secondary !px-4 !py-2 disabled:opacity-40">Next →</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Books;
