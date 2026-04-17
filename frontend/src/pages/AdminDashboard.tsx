import { useState, useEffect } from 'react';
import {
  getAdminUsers, deleteAdminUser,
  getAdminListings, deleteAdminListing,
  getAdminTransactions, getAdminFeedback,
} from '../services/adminService';

type Tab = 'users' | 'listings' | 'transactions' | 'feedback';

const AdminDashboard = () => {
  const [tab, setTab]               = useState<Tab>('users');
  const [users, setUsers]           = useState<any[]>([]);
  const [listings, setListings]     = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [feedback, setFeedback]     = useState<any[]>([]);
  const [loading, setLoading]       = useState(false);

  const load = async (t: Tab) => {
    setLoading(true);
    try {
      if (t === 'users')        setUsers((await getAdminUsers()).data || []);
      if (t === 'listings')     setListings((await getAdminListings()).data || []);
      if (t === 'transactions') setTransactions((await getAdminTransactions()).data || []);
      if (t === 'feedback')     setFeedback((await getAdminFeedback()).data || []);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(tab); }, [tab]);

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Delete this user?')) return;
    await deleteAdminUser(id);
    setUsers(prev => prev.filter((u: any) => u._id !== id));
  };

  const handleDeleteListing = async (id: string) => {
    if (!confirm('Remove this listing?')) return;
    await deleteAdminListing(id);
    setListings(prev => prev.filter((b: any) => b._id !== id));
  };

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'users',        label: 'Users',        icon: '👥' },
    { key: 'listings',     label: 'Listings',     icon: '📚' },
    { key: 'transactions', label: 'Transactions', icon: '💰' },
    { key: 'feedback',     label: 'Feedback',     icon: '💬' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="font-heading text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="flex gap-2 mb-6 border-b border-folio-light pb-0">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-2.5 font-medium text-sm rounded-t-lg border-b-2 transition-all ${
              tab === t.key ? 'border-folio-green text-folio-green bg-folio-cream' : 'border-transparent text-folio-muted hover:text-folio-dark'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40"><div className="w-8 h-8 border-4 border-folio-green border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <>
          {tab === 'users' && (
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-folio-cream">
                  <tr>{['Name','Email','Role','Joined',''].map(h => <th key={h} className="text-left px-4 py-3 font-medium text-folio-muted">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-folio-light">
                  {users.map((u: any) => (
                    <tr key={u._id} className="hover:bg-folio-cream/50">
                      <td className="px-4 py-3 font-medium">{u.name}</td>
                      <td className="px-4 py-3 text-folio-muted">{u.email}</td>
                      <td className="px-4 py-3"><span className={`badge ${u.role === 'admin' ? 'badge-gold' : 'badge-green'}`}>{u.role}</span></td>
                      <td className="px-4 py-3 text-folio-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        {u.role !== 'admin' && (
                          <button onClick={() => handleDeleteUser(u._id)} className="text-red-600 hover:text-red-800 font-medium text-xs">Delete</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && <p className="text-center py-8 text-folio-muted">No users found</p>}
            </div>
          )}

          {tab === 'listings' && (
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-folio-cream">
                  <tr>{['Title','Author','Type','Status','Owner',''].map(h => <th key={h} className="text-left px-4 py-3 font-medium text-folio-muted">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-folio-light">
                  {listings.map((b: any) => (
                    <tr key={b._id} className="hover:bg-folio-cream/50">
                      <td className="px-4 py-3 font-medium">{b.title}</td>
                      <td className="px-4 py-3 text-folio-muted">{b.author}</td>
                      <td className="px-4 py-3"><span className="badge-gold capitalize">{b.type}</span></td>
                      <td className="px-4 py-3"><span className={`badge ${b.status === 'available' ? 'badge-green' : 'badge-cream'}`}>{b.status}</span></td>
                      <td className="px-4 py-3 text-folio-muted">{b.owner?.name || '—'}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleDeleteListing(b._id)} className="text-red-600 hover:text-red-800 font-medium text-xs">Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {listings.length === 0 && <p className="text-center py-8 text-folio-muted">No listings found</p>}
            </div>
          )}

          {tab === 'transactions' && (
            <div className="space-y-3">
              {transactions.map((tx: any) => (
                <div key={tx._id} className="card p-4 flex justify-between items-center text-sm">
                  <div>
                    <p className="font-medium">{tx.book?.title || 'Book'}</p>
                    <p className="text-folio-muted text-xs">
                      {tx.buyer?.name || tx.renter?.name} • {new Date(tx.orderDate || tx.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-folio-green">₹{tx.totalAmount}</p>
                    <span className={`badge ${tx.status === 'completed' || tx.status === 'returned' ? 'badge-green' : 'badge-cream'}`}>{tx.status}</span>
                  </div>
                </div>
              ))}
              {transactions.length === 0 && <div className="card p-8 text-center text-folio-muted">No transactions found</div>}
            </div>
          )}

          {tab === 'feedback' && (
            <div className="space-y-3">
              {feedback.map((fb: any) => (
                <div key={fb._id} className="card p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{fb.user?.name || 'Anonymous'}</p>
                      <p className="text-folio-muted text-xs mb-2">{fb.user?.email} • {new Date(fb.createdAt).toLocaleDateString()}</p>
                      <p className="text-sm">{fb.message}</p>
                    </div>
                  </div>
                </div>
              ))}
              {feedback.length === 0 && <div className="card p-8 text-center text-folio-muted">No feedback yet</div>}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
