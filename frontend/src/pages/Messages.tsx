import { useState, useEffect } from 'react';
import { getConversations } from '../services/chatService';
import ChatWindow from '../components/ChatWindow';
import { Conversation } from '../types';
import { useAuth } from '../context/AuthContext';

const Messages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    getConversations().then(r => { setConversations(r.data || []); setLoading(false); });
  }, []);

  const getOther = (conv: Conversation) => {
    const buyer  = conv.buyer  as any;
    const seller = conv.seller as any;
    return buyer?._id === user?._id ? seller : buyer;
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-folio-green border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="font-heading text-3xl font-bold mb-8">Messages</h1>
      {conversations.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-4xl mb-4">💬</p>
          <p className="text-folio-muted text-lg">No conversations yet. Chat with a seller from any book page.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6 h-[600px]">
          <div className="card overflow-y-auto">
            {conversations.map(conv => {
              const other = getOther(conv);
              const book  = conv.book as any;
              return (
                <button
                  key={conv._id}
                  onClick={() => setSelected(conv)}
                  className={`w-full text-left p-4 border-b border-folio-light hover:bg-folio-cream transition-colors ${selected?._id === conv._id ? 'bg-folio-cream' : ''}`}
                >
                  <p className="font-medium">{other?.name || 'Unknown'}</p>
                  <p className="text-sm text-folio-muted line-clamp-1">{book?.title}</p>
                </button>
              );
            })}
          </div>
          <div className="md:col-span-2">
            {selected ? (
              <ChatWindow conversationId={selected._id} />
            ) : (
              <div className="card h-full flex items-center justify-center">
                <p className="text-folio-muted">Select a conversation</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
