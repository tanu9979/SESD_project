import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createBook, updateBook, getBook, getExamTags } from '../services/bookService';
import { ExamTag } from '../types';
import { useLocation } from '../context/LocationContext';

const CONDITIONS = ['new', 'like-new', 'good', 'fair'];
const CATEGORIES = ['Fiction', 'Science', 'History', 'Technology', 'Self-Help', 'Medicine', 'Law', 'Engineering', 'Other'];

const CreateListing = () => {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const [form, setForm] = useState({
    title: '', author: '', category: '', condition: 'good', price: '', type: 'sell',
    description: '', sellerInsights: '', donorNote: '', sellerPincode: '', examTags: [] as string[],
  });
  const [examTags, setExamTags]   = useState<ExamTag[]>([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const { isIndia } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isIndia) getExamTags().then(r => setExamTags(r.data || []));
    if (isEdit && id) {
      getBook(id).then(r => {
        const b = r.data;
        setForm({
          title: b.title || '', author: b.author || '', category: b.category || '',
          condition: b.condition || 'good', price: b.price?.toString() || '', type: b.type || 'sell',
          description: b.description || '', sellerInsights: b.sellerInsights || '',
          donorNote: b.donorNote || '', sellerPincode: b.sellerPincode || '',
          examTags: (b.examTags || []).map((t: any) => t._id || t),
        });
      });
    }
  }, [isIndia, isEdit, id]);

  const toggleExam = (tagId: string) =>
    setForm(p => ({ ...p, examTags: p.examTags.includes(tagId) ? p.examTags.filter(e => e !== tagId) : [...p.examTags, tagId] }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const payload = { ...form, price: form.type === 'donate' ? 0 : parseFloat(form.price) };
      if (isEdit && id) await updateBook(id, payload);
      else await createBook(payload);
      navigate('/my-listings');
    } catch (err: any) { setError(err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} listing`); }
    finally { setLoading(false); }
  };

  const field = (key: string) => (e: any) => setForm(p => ({ ...p, [key]: e.target.value }));

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="font-heading text-3xl font-bold text-folio-dark mb-8">{isEdit ? 'Edit Listing' : 'List a Book'}</h1>
      {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-6">{error}</div>}
      <form onSubmit={handleSubmit} className="card p-8 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="label">Title *</label><input className="input" value={form.title} onChange={field('title')} required /></div>
          <div><label className="label">Author *</label><input className="input" value={form.author} onChange={field('author')} required /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Category</label>
            <select className="input" value={form.category} onChange={field('category')}>
              <option value="">Select...</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Condition *</label>
            <select className="input" value={form.condition} onChange={field('condition')}>
              {CONDITIONS.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="label">Listing Type *</label>
          <div className="grid grid-cols-4 gap-2">
            {['sell','rent','both','donate'].map(t => (
              <label key={t} className={`cursor-pointer border-2 rounded-lg px-3 py-2 text-center text-sm font-medium transition-all ${form.type === t ? 'border-folio-green bg-folio-green text-white' : 'border-folio-light text-folio-muted hover:border-folio-green'}`}>
                <input type="radio" name="type" value={t} className="hidden" onChange={field('type')} />
                <span onClick={() => setForm(p => ({ ...p, type: t }))} className="capitalize">{t === 'donate' ? '🎁 Donate' : t}</span>
              </label>
            ))}
          </div>
        </div>

        {form.type !== 'donate' && (
          <div><label className="label">Price (₹) *</label><input type="number" min="0" step="0.01" className="input" value={form.price} onChange={field('price')} required /></div>
        )}

        <div><label className="label">Seller Pincode</label><input className="input" value={form.sellerPincode} onChange={field('sellerPincode')} placeholder="For delivery estimate" /></div>
        <div><label className="label">Description</label><textarea className="input !h-24 resize-none" value={form.description} onChange={field('description')} /></div>
        <div>
          <label className="label">📖 Your Reading Insights <span className="text-folio-muted font-normal">(optional)</span></label>
          <textarea className="input !h-24 resize-none" value={form.sellerInsights} onChange={field('sellerInsights')} placeholder="What did you love about this book? What did you learn?" />
        </div>
        {form.type === 'donate' && (
          <div>
            <label className="label">🎁 Donor Note <span className="text-folio-muted font-normal">(optional)</span></label>
            <textarea className="input !h-20 resize-none" value={form.donorNote} onChange={field('donorNote')} placeholder="A message for the recipient..." />
          </div>
        )}
        {isIndia && examTags.length > 0 && (
          <div>
            <label className="label">🇮🇳 Exam Tags</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {examTags.map(tag => (
                <button key={tag._id} type="button" onClick={() => toggleExam(tag._id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${form.examTags.includes(tag._id) ? 'bg-folio-green text-white border-folio-green' : 'border-folio-light text-folio-muted hover:border-folio-green'}`}>
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        )}
        <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? (isEdit ? 'Saving...' : 'Creating...') : (isEdit ? 'Save Changes' : 'Create Listing')}</button>
      </form>
    </div>
  );
};

export default CreateListing;
