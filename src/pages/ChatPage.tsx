import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Phone, MoreVertical, Image as ImageIcon } from 'lucide-react';
import { cn } from '../utils/cn';

const INITIAL_MESSAGES = [
  { id: 1, text: "Hey! I'm heading to the park now.", sender: 'host', time: '8:45 AM' },
  { id: 2, text: "Awesome, I'm about 5 mins away.", sender: 'me', time: '8:46 AM' },
  { id: 3, text: "Cool, I'll be waiting by the fountain.", sender: 'host', time: '8:47 AM' },
];

export default function ChatPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const host = { name: 'Sarah Jenkins', avatar: 'https://i.pravatar.cc/150?img=5', status: 'Online' };

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages([...messages, { 
      id: Date.now(), 
      text: input, 
      sender: 'me', 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }]);
    setInput('');
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
                <img src={host.avatar} alt={host.name} className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div>
                <h2 className="font-bold text-sm leading-tight">{host.name}</h2>
                <p className="text-xs text-gray-500">{host.status}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-black transition-colors">
              <Phone className="w-5 h-5" />
            </button>
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
            const isMe = msg.sender === 'me';
            return (
              <div key={msg.id} className={cn("flex w-full", isMe ? "justify-end" : "justify-start")}>
                {!isMe && (
                  <img src={host.avatar} alt="host" className="w-8 h-8 rounded-full object-cover mr-2 self-end mb-1 shadow-sm" />
                )}
                <div className={cn(
                  "max-w-[75%] rounded-[1.5rem] px-5 py-3 shadow-sm relative",
                  isMe ? "bg-black text-white rounded-br-none" : "bg-white border border-gray-100 text-gray-900 rounded-bl-none"
                )}>
                  <p className="text-[15px] leading-relaxed">{msg.text}</p>
                  <span className={cn(
                    "text-[10px] font-bold mt-1 block opacity-60",
                    isMe ? "text-right text-gray-300" : "text-left text-gray-400"
                  )}>
                    {msg.time}
                  </span>
                </div>
              </div>
            );
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
              className="w-full bg-gray-100 border-transparent rounded-[2rem] pl-5 pr-12 py-3.5 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:bg-white focus:border-black focus:ring-2 focus:ring-black transition-all"
            />
            <button 
              type="submit"
              disabled={!input.trim()}
              className="absolute right-2 bottom-1.5 p-2 bg-black text-white rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:bg-gray-300 disabled:text-gray-500 transition-colors shadow-sm"
            >
              <Send className="w-4 h-4 translate-x-[-1px] translate-y-[1px]" />
            </button>
          </form>
        </div>
      </div>
      
    </div>
  );
}
