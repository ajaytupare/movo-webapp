import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Send, Phone, MoreVertical, Image as ImageIcon } from 'lucide-react';
import { cn } from '../utils/cn';
import { db } from '../lib/firebase';
import { collection, doc, getDoc, onSnapshot, addDoc, query, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useAuth } from '../lib/AuthContext';










export default function ChatPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [plan, setPlan] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const endOfMessagesRef = useRef(null);

  // Fetch plan details
  useEffect(() => {
    if (!id) return;
    const fetchPlan = async () => {
      const docRef = doc(db, 'plans', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPlan({ id: docSnap.id, ...docSnap.data() });
      }
    };
    fetchPlan();
  }, [id]);

  // Listen for messages
  useEffect(() => {
    if (!id) return;
    const q = query(collection(db, 'plans', id, 'messages'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [id]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !id || !currentUser) return;

    const messageText = input;
    setInput('');

    await addDoc(collection(db, 'plans', id, 'messages'), {
      text: messageText,
      senderId: currentUser.uid,
      senderName: currentUser.displayName || 'Anonymous',
      senderAvatar: currentUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.uid}`,
      createdAt: serverTimestamp()
    });
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-gray-50 text-gray-900 font-sans selection:bg-black selection:text-white">
      
      {/* Header */}
      <header className="flex-shrink-0 sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 px-4 pt-12 pb-4 shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-black transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <img src={plan?.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=150&q=80'} alt="Group" className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div>
                <h2 className="font-bold text-sm leading-tight">{plan?.title || 'Loading...'}</h2>
                <p className="text-xs text-gray-500">{plan?.joinedCount || 0} Members</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-black transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 max-w-2xl mx-auto w-full">
        <div className="flex flex-col space-y-4 pt-4 pb-20">
          <div className="text-center mb-6">
            <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-widest">
              Today
            </span>
          </div>
          
          {messages.map((msg) => {
            const isMe = msg.senderId === currentUser?.uid;

            // Format timestamp nicely
            let timeString = '';
            if (msg.createdAt) {
              const date = msg.createdAt.toDate();
              timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }

            return (
              <div key={msg.id} className={cn("flex w-full", isMe ? "justify-end" : "justify-start")}>
                {!isMe &&
                <img src={msg.senderAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.senderId}`} alt={msg.senderName} className="w-8 h-8 rounded-full object-cover mr-2 self-end mb-1 shadow-sm border border-gray-100" />
                }
                <div className="flex flex-col">
                  {!isMe && <span className="text-[10px] text-gray-500 ml-1 mb-1">{msg.senderName}</span>}
                  <div className={cn(
                    "max-w-[85%] rounded-[1.5rem] px-5 py-3 shadow-sm relative",
                    isMe ? "bg-black text-white rounded-br-none self-end" : "bg-white border border-gray-100 text-gray-900 rounded-bl-none self-start"
                  )}>
                    <p className="text-[15px] leading-relaxed break-words">{msg.text}</p>
                    <span className={cn(
                      "text-[10px] font-bold mt-1 block opacity-60",
                      isMe ? "text-right text-gray-300" : "text-left text-gray-400"
                    )}>
                      {timeString}
                    </span>
                  </div>
                </div>
              </div>);

          })}
          <div ref={endOfMessagesRef} />
        </div>
      </main>

      {/* Input Area */}
      <div className="flex-shrink-0 bg-white border-t border-gray-200 p-4 pb-safe">
        <div className="max-w-2xl mx-auto flex items-end gap-2">
          <button className="p-3 text-gray-400 hover:text-black transition-colors bg-gray-50 hover:bg-gray-100 rounded-full flex-shrink-0">
            <ImageIcon className="w-6 h-6" />
          </button>
          
          <form onSubmit={handleSend} className="flex-1 relative flex items-end">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message..."
              className="w-full bg-gray-100 border-transparent rounded-[2rem] pl-5 pr-12 py-3.5 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:bg-white focus:border-black focus:ring-2 focus:ring-black transition-all" />
            
            <button
              type="submit"
              disabled={!input.trim()}
              className="absolute right-2 bottom-1.5 p-2 bg-black text-white rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:bg-gray-300 disabled:text-gray-500 transition-colors shadow-sm">
              
              <Send className="w-4 h-4 translate-x-[-1px] translate-y-[1px]" />
            </button>
          </form>
        </div>
      </div>
      
    </div>);

}