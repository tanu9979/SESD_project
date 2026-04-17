import { useState, FormEvent } from 'react';
import { submitFeedback } from '../services/feedbackService';

const Feedback = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    try {
      await submitFeedback({ message });
      setSent(true);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit feedback');
    } finally { setLoading(false); }
  };

  if (sent) return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <p className="text-5xl mb-4">🙏</p>
      <h2 className="font-heading text-2xl font-bold mb-2">Thank you!</h2>
      <p className="text-folio-muted">Your feedback helps us improve Folio for everyone.</p>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="font-heading text-3xl font-bold mb-2">Share Feedback</h1>
      <p className="text-folio-muted mb-8">Tell us what you love or what we can improve.</p>
      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Your Message</label>
            <textarea
              className="input h-40 resize-none"
              placeholder="Share your thoughts, suggestions, or report an issue..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Sending...' : 'Send Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
