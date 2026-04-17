import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { getMessages } from '../services/chatService';
import { useAuth } from '../context/AuthContext';
import { Message } from '../types';

let socket: Socket | null = null;

const ChatWindow = ({ conversationId }: { conversationId: string }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    getMessages(conversationId).then(r => setMessages(r.data || []));

    socket = io('http://localhost:5001', { transports: ['websocket'] });
    socket.emit('join_conversation', conversationId);
    socket.on('receive_message', (msg: Message) => setMessages(prev => [...prev, msg]));
    return () => { socket?.disconnect(); };
  }, [conversationId]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = () => {
    if (!text.trim() || !user) return;
    socket?.emit('send_message', { conversationId, senderId: user._id, content: text.trim() });
    setText('');
  };

  return (
    <div className="flex flex-col h-96 bg-white rounded-xl border border-folio-light">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => {
          const isMine = msg.sender?._id === user?._id || (msg.sender as any) === user?._id;
          return (
            <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${isMine ? 'bg-folio-green text-white' : 'bg-folio-light text-folio-dark'}`}>
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <div className="p-3 border-t border-folio-light flex gap-2">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Type a message..."
          className="input flex-1 !py-2"
        />
        <button onClick={send} className="btn-primary !px-4 !py-2">Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
