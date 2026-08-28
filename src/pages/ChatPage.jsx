import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Send, Phone, MoreVertical, Image as ImageIcon, Info, Share2, LogOut, Edit, Check } from 'lucide-react';
import { cn } from '../utils/cn';
import { db } from '../lib/firebase';
import { collection, doc, getDoc, onSnapshot, addDoc, query, orderBy, serverTimestamp, Timestamp, updateDoc, arrayRemove } from 'firebase/firestore';
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

  const [selectedImage, setSelectedImage] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedImage]);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 800; // slightly higher quality for chat
        let width = img.width;
        let height = img.height;
        if (width > height && width > MAX_SIZE) {
          height *= MAX_SIZE / width;
          width = MAX_SIZE;
        } else if (height > MAX_SIZE) {
          width *= MAX_SIZE / height;
          height = MAX_SIZE;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        setSelectedImage(canvas.toDataURL('image/jpeg', 0.6));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if ((!input.trim() && !selectedImage) || !id || !currentUser) return;

    const messageText = input;
    const messageImage = selectedImage;
    setInput('');
    setSelectedImage(null);

    await addDoc(collection(db, 'plans', id, 'messages'), {
      text: messageText,
      image: messageImage || null,
      senderId: currentUser.uid,
      senderName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Anonymous',
      senderAvatar: currentUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.uid}`,
      createdAt: serverTimestamp()
    });
  };

  const handleShare = () => {
    const url = window.location.origin + '/plan/' + id;
    if (navigator.share) {
      navigator.share({
        title: plan?.title || 'Check out this plan on Movo!',
        url: url
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    setShowMenu(false);
  };

  const handleLeavePlan = async () => {
    if (!currentUser) return;
    if (!window.confirm("Are you sure you want to leave this plan?")) return;
    try {
      const docRef = doc(db, 'plans', id);
      await updateDoc(docRef, {
        attendees: arrayRemove(currentUser.uid),
        joinedCount: Math.max(1, (plan?.joinedCount || 1) - 1)
      });
      navigate('/home');
    } catch (err) {
      console.error("Error leaving plan", err);
      alert("Failed to leave plan. Please try again.");
    }
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
            <div 
              onClick={() => navigate(`/plan/${id}`)}
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="relative">
                <img src={plan?.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=150&q=80'} alt="Group" className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div>
                <h2 className="font-bold text-sm leading-tight hover:underline">{plan?.title || 'Loading...'}</h2>
                <p className="text-xs text-gray-500">{plan?.joinedCount || 0} Members</p>
              </div>
            </div>
          </div>
          <div className="relative z-50">
            <button 
              type="button"
              onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-black transition-colors relative z-50"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={(e) => { e.stopPropagation(); setShowMenu(false); }} 
                />
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <button
                    onClick={() => { setShowMenu(false); navigate(`/plan/${id}`); }}
                    className="w-full px-4 py-2.5 text-left text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors"
                  >
                    <Info className="w-4 h-4 text-gray-400" />
                    View Plan Details
                  </button>

                  <button
                    onClick={handleShare}
                    className="w-full px-4 py-2.5 text-left text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4 text-gray-400" />}
                    {copied ? 'Link Copied!' : 'Share Plan'}
                  </button>

                  {plan?.hostId === currentUser?.uid ? (
                    <button
                      onClick={() => { setShowMenu(false); navigate(`/edit/${id}`); }}
                      className="w-full px-4 py-2.5 text-left text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors border-t border-gray-100"
                    >
                      <Edit className="w-4 h-4 text-gray-400" />
                      Edit Plan
                    </button>
                  ) : (
                    <button
                      onClick={handleLeavePlan}
                      className="w-full px-4 py-2.5 text-left text-sm font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors border-t border-gray-100"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      Leave Plan
                    </button>
                  )}
                </div>
              </>
            )}
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
                    "max-w-[85%] rounded-[1.5rem] p-4 shadow-sm relative",
                    isMe ? "bg-black text-white rounded-br-none self-end" : "bg-white border border-gray-100 text-gray-900 rounded-bl-none self-start"
                  )}>
                    {msg.image && (
                      <img src={msg.image} alt="Sent" className="w-full max-w-sm rounded-xl mb-2 object-cover" />
                    )}
                    {msg.text && (
                      <p className="text-[15px] leading-relaxed break-words">{msg.text}</p>
                    )}
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
      <div className="flex-shrink-0 bg-white border-t border-gray-200 pb-safe">
        {selectedImage && (
          <div className="max-w-2xl mx-auto px-4 pt-4">
            <div className="relative inline-block">
              <img src={selectedImage} alt="Preview" className="w-20 h-20 object-cover rounded-xl shadow-sm border border-gray-200" />
              <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm">✕</button>
            </div>
          </div>
        )}
        <div className="max-w-2xl mx-auto flex items-end gap-2 p-4">
          <label className="cursor-pointer p-3 text-gray-400 hover:text-black transition-colors bg-gray-50 hover:bg-gray-100 rounded-full flex-shrink-0">
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            <ImageIcon className="w-6 h-6" />
          </label>
          
          <form onSubmit={handleSend} className="flex-1 relative flex items-end">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message..."
              className="w-full bg-gray-100 border-transparent rounded-[2rem] pl-5 pr-12 py-3.5 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:bg-white focus:border-black focus:ring-2 focus:ring-black transition-all" />
            
            <button
              type="submit"
              disabled={!input.trim() && !selectedImage}
              className="absolute right-2 bottom-1.5 p-2 bg-black text-white rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:bg-gray-300 disabled:text-gray-500 transition-colors shadow-sm">
              
              <Send className="w-4 h-4 translate-x-[-1px] translate-y-[1px]" />
            </button>
          </form>
        </div>
      </div>
      
    </div>);

}