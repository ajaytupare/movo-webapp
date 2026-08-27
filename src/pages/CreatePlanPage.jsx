import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Users, Camera, Sparkles } from 'lucide-react';
import { cn } from '../utils/cn';
import { useAuth } from '../lib/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

const QUICK_TITLES = ['Coffee & Chat', 'Running', 'Dinner', 'Drinks', 'Gaming'];
const CATEGORIES = ['Coffee', 'Sports', 'Food', 'Drinks', 'Gaming', 'Music', 'Outdoors'];

export default function CreatePlanPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Social');
  const [capacity, setCapacity] = useState(5);
  const [time, setTime] = useState('Today at 5:00 PM');
  const [location, setLocation] = useState('');

  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    if (!currentUser) {
      alert("You must be logged in to create a plan.");
      return;
    }

    setIsPublishing(true);

    try {
      const bgMap = {
        'social': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
        'sports': 'https://images.unsplash.com/photo-1576267423048-15c0040fec78?auto=format&fit=crop&w=800&q=80',
        'food': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
        'creative': 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=800&q=80'
      };
      const randomImage = bgMap[category.toLowerCase()] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80';

      await addDoc(collection(db, 'plans'), {
        title,
        category: category.toLowerCase() || 'all',
        maxCapacity: capacity,
        time,
        location: location || 'TBD',
        address: 'TBD',
        hostId: currentUser.uid,
        hostName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Anonymous',
        hostAvatar: currentUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.uid}`,
        joinedCount: 1, // The host is the first one joined
        attendees: [currentUser.uid],
        createdAt: serverTimestamp(),
        image: randomImage,
        description: 'No description provided.'
      });

      navigate('/home');
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to publish plan. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-gray-50 text-gray-900 font-sans selection:bg-black selection:text-white pb-safe">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 px-6 pt-12 pb-4 shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-black transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="text-sm font-bold text-gray-900 tracking-wide">
            {step === 1 ? 'New Plan' : 'Details'}
          </div>
          <button className="text-sm font-bold text-gray-400 hover:text-black transition-colors">
            Clear
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 pt-8 pb-32 max-w-2xl mx-auto">
        
        {step === 1 &&
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h1 className="text-3xl font-bold tracking-tight mb-2">What are we doing?</h1>
            <p className="text-gray-500 text-sm mb-8">Keep it simple. You can figure out details later.</p>

            <div className="space-y-8">
              
              {/* Title Input */}
              <div>
                <textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Grab coffee and walk in the park..."
                className="w-full text-2xl font-bold text-gray-900 placeholder:text-gray-300 bg-transparent border-none resize-none focus:outline-none focus:ring-0 min-h-[120px]"
                autoFocus />
              
                
                {/* Quick Suggestions */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
                  <Sparkles className="w-4 h-4 text-gray-400 flex-shrink-0 mr-1" />
                  {QUICK_TITLES.map((t) =>
                <button
                  key={t}
                  onClick={() => setTitle(t)}
                  className="flex-shrink-0 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-bold text-gray-600 hover:border-black hover:text-black transition-colors shadow-sm">
                  
                      {t}
                    </button>
                )}
                </div>
              </div>

              {/* Photo Upload Area */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Cover Photo</h3>
                <div className="w-full h-48 rounded-[2rem] border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-600 transition-colors cursor-pointer group overflow-hidden relative">
                  <Camera className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-bold">Tap to add photo</span>
                  <span className="text-xs mt-1 opacity-70">or we'll pick one based on your title</span>
                </div>
              </div>

            </div>
          </div>
        }

        {step === 2 &&
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h1 className="text-3xl font-bold tracking-tight mb-8">The Details</h1>

            <div className="space-y-6">
              
              {/* Category */}
              <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-3 text-sm tracking-wide uppercase">Category</h3>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) =>
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-bold transition-all border",
                    category === c ?
                    "bg-black text-white border-black" :
                    "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                  )}>
                  
                      {c}
                    </button>
                )}
                </div>
              </div>

              {/* Time & Location */}
              <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm divide-y divide-gray-100 overflow-hidden">
                <div className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors relative">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-bold text-gray-900">When</p>
                      <input 
                        type="text"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        placeholder="e.g. Today at 5:00 PM"
                        className="text-sm font-medium text-blue-600 bg-transparent border-none p-0 focus:ring-0 w-full"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors relative">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-bold text-gray-900">Where</p>
                      <input 
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Pick a location..."
                        className="text-sm font-medium text-blue-600 bg-transparent border-none p-0 focus:ring-0 w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Capacity limit */}
              <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900">People Limit</p>
                    <p className="text-sm text-gray-500">Up to {capacity} people</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setCapacity(Math.max(2, capacity - 1))} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-lg hover:bg-gray-200">-</button>
                  <span className="font-bold w-4 text-center">{capacity}</span>
                  <button onClick={() => setCapacity(Math.min(20, capacity + 1))} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-lg hover:bg-gray-200">+</button>
                </div>
              </div>

            </div>
          </div>
        }

      </main>

      {/* Footer Action */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent z-50 pointer-events-none">
        <div className="max-w-2xl mx-auto pointer-events-auto">
          {step === 1 ?
          <button
            onClick={() => setStep(2)}
            disabled={!title.trim()}
            className="w-full h-14 bg-black text-white rounded-xl font-bold text-lg shadow-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            
              Next Step
            </button> :

          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="w-full h-14 bg-black text-white rounded-xl font-bold text-lg shadow-xl hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            
              {isPublishing ? 'Publishing...' : 'Publish Plan'}
            </button>
          }
        </div>
      </div>
      
    </div>);

}