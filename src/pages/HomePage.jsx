import React, { useState, useEffect } from 'react';
import { BottomNav } from '../components/layout/BottomNav';
import { MapPin, Bell, Clock, Users, ChevronRight, SlidersHorizontal, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../utils/cn';
import { collection, query, orderBy, onSnapshot, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';

const CATEGORIES = [
{ id: 'all', label: 'All', image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=100&h=100&fit=crop' },
{ id: 'coffee', label: 'Coffee', image: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=100&h=100&fit=crop' },
{ id: 'sports', label: 'Sports', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=100&h=100&fit=crop' },
{ id: 'gaming', label: 'Gaming', image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=100&h=100&fit=crop' },
{ id: 'food', label: 'Food', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100&h=100&fit=crop' },
{ id: 'drinks', label: 'Drinks', image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=100&h=100&fit=crop' }];

function PlanCard({ plan, savedPlans, toggleSavePlan }) {
  const [hostProfile, setHostProfile] = useState(null);

  useEffect(() => {
    if (!plan.hostId) return;
    getDoc(doc(db, 'users', plan.hostId)).then(snap => {
      if (snap.exists()) setHostProfile(snap.data());
    });
  }, [plan.hostId]);

  return (
    <Link to={`/plan/${plan.id}`} className="block group">
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 transition-all active:scale-[0.98] overflow-hidden hover:shadow-md">
        
        {/* Large Image Header */}
        <div className="w-full h-56 relative bg-gray-200">
          <img src={plan.image} alt={plan.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Floating Like Button */}
          <button 
            onClick={(e) => toggleSavePlan(e, plan.id)}
            className={cn(
              "absolute top-4 right-4 w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-colors z-20",
              savedPlans[plan.id] ? "bg-red-500 text-white" : "bg-white/20 text-white hover:bg-white hover:text-black"
            )}>
            <Heart className={cn("w-5 h-5", savedPlans[plan.id] && "fill-current")} />
          </button>

          {/* Title & Host Overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h3 className="text-2xl font-bold leading-tight mb-2 drop-shadow-md">{plan.title}</h3>
            <div className="flex items-center gap-2">
              <img src={hostProfile?.photoURL || plan.hostAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback'} alt={plan.hostName} className="w-6 h-6 rounded-full border border-white/50 bg-white" />
              <span className="text-sm font-medium opacity-90">Hosted by {plan.hostName || 'Someone'}</span>
            </div>
          </div>
        </div>
        
        {/* Card Details */}
        <div className="p-5">
          <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-600 mb-4">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-black font-bold">{plan.time}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-gray-400" />
              {plan.location}
            </div>
          </div>
          
          {/* Attendees Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) =>
                  <img
                    key={i}
                    src={`https://i.pravatar.cc/150?img=${i + 20}`}
                    alt="Attendee"
                    className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm" />
                )}
              </div>
              <span className="text-sm font-bold text-gray-500">
                {plan.joinedCount || 1}/{plan.maxCapacity} joined
              </span>
            </div>
            
            <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}


export default function HomePage() {
  const { currentUser } = useAuth();
  const [activeCategory, setActiveCategory] = useState('all');
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedPlans, setSavedPlans] = useState({});
  const [userProfile, setUserProfile] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!currentUser) return;
    const unsubProfile = onSnapshot(doc(db, 'users', currentUser.uid), (docSnap) => {
      if (docSnap.exists()) setUserProfile(docSnap.data());
    });
    const unsubNotifs = onSnapshot(collection(db, 'users', currentUser.uid, 'notifications'), (snap) => {
      setUnreadCount(snap.docs.filter(d => !d.data().read).length);
    }, (err) => {
      console.error("Home notifications error:", err);
    });
    return () => { unsubProfile(); unsubNotifs(); };
  }, [currentUser]);

  useEffect(() => {
    const q = query(collection(db, 'plans'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const plansData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setPlans(plansData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch saved plans
  useEffect(() => {
    if (!currentUser) return;
    const unsub = onSnapshot(collection(db, 'users', currentUser.uid, 'saved_plans'), (snapshot) => {
      const saved = {};
      snapshot.docs.forEach(doc => {
        saved[doc.id] = true;
      });
      setSavedPlans(saved);
    });
    return () => unsub();
  }, [currentUser]);

  const toggleSavePlan = async (e, planId) => {
    e.preventDefault();
    if (!currentUser) return;
    const docRef = doc(db, 'users', currentUser.uid, 'saved_plans', planId);
    if (savedPlans[planId]) {
      await deleteDoc(docRef);
    } else {
      await setDoc(docRef, { savedAt: new Date() });
    }
  };

  const filteredPlans = plans.filter(
    (plan) => activeCategory === 'all' || plan.category === activeCategory
  );

  return (
    <div className="min-h-[100dvh] bg-gray-50 text-gray-900 pb-24 font-sans selection:bg-black selection:text-white">
      
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 px-6 pt-12 shadow-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto mb-4">
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-1 capitalize">
              <MapPin className="w-3 h-3" /> {userProfile?.location || 'New York City'}
            </p>
            <h1 className="text-3xl font-bold tracking-tight">Discover</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/notifications" className="relative text-gray-900 hover:text-black transition-colors w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-gray-100 rounded-full" />}
            </Link>
            <Link to="/profile">
              <img 
                src={userProfile?.photoURL || currentUser?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.uid}`} 
                alt="Profile" 
                className="w-10 h-10 rounded-full border border-gray-200 object-cover shadow-sm bg-white" 
              />
            </Link>
          </div>
        </div>

        {/* Categories / Filter */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 max-w-7xl mx-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
          {CATEGORIES.map((cat) =>
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "flex-shrink-0 flex items-center gap-2 pr-4 pl-1.5 py-1.5 rounded-full text-sm font-bold transition-all shadow-sm border",
              activeCategory === cat.id ?
              "bg-black text-white border-black" :
              "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
            )}>
            
              <img src={cat.image} alt={cat.label} className="w-8 h-8 rounded-full object-cover" /> 
              {cat.label}
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 mt-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold tracking-tight">Happening Nearby</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} savedPlans={savedPlans} toggleSavePlan={toggleSavePlan} />
          ))}
        </div>
      </main>

      <BottomNav />
    </div>);

}