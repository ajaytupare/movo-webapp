import React, { useState, useEffect } from 'react';
import { BottomNav } from '../components/layout/BottomNav';
import { Settings, MapPin, Grid, Heart, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../utils/cn';
import { useAuth } from '../lib/AuthContext';
import { collection, query, where, onSnapshot, getDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('activity');
  const { currentUser } = useAuth();
  const [activityPlans, setActivityPlans] = useState([]);
  const [savedPlans, setSavedPlans] = useState([]);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (!currentUser) return;

    // Fetch User Profile
    const unsubProfile = onSnapshot(doc(db, 'users', currentUser.uid), (doc) => {
      if (doc.exists()) {
        setUserProfile(doc.data());
      }
    });
    
    // Fetch Activity
    const q1 = query(collection(db, 'plans'), where('attendees', 'array-contains', currentUser.uid));
    const unsub1 = onSnapshot(q1, (snap) => {
      setActivityPlans(snap.docs.map(d => ({id: d.id, ...d.data()})));
    });

    // Fetch Saved Plans
    const unsub2 = onSnapshot(collection(db, 'users', currentUser.uid, 'saved_plans'), async (snap) => {
      const planIds = snap.docs.map(d => d.id);
      if (planIds.length === 0) {
        setSavedPlans([]);
        return;
      }
      const fetched = await Promise.all(planIds.map(id => getDoc(doc(db, 'plans', id))));
      setSavedPlans(fetched.filter(d => d.exists()).map(d => ({id: d.id, ...d.data()})));
    });

    return () => { unsub1(); unsub2(); unsubProfile(); };
  }, [currentUser]);

  return (
    <div className="min-h-[100dvh] bg-gray-50 text-gray-900 pb-24 font-sans selection:bg-black selection:text-white">
      
      {/* Cover Photo */}
      <div className="h-48 w-full relative bg-gray-200">
        <img
          src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80"
          alt="Cover"
          className="w-full h-full object-cover opacity-80" />
        
        <div className="absolute top-12 right-6">
          <Link to="/settings" className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-black hover:bg-white transition-colors shadow-sm">
            <Settings className="w-5 h-5" />
          </Link>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-6 relative -mt-16 z-10">
        
        {/* Profile Info */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex justify-between items-end mb-4">
            <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-md">
              <img src={currentUser?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.uid}`} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <Link to="/onboarding" className="px-5 py-2 rounded-full bg-black text-white text-sm font-bold shadow-md hover:bg-gray-800 transition-colors">
              Edit Profile
            </Link>
          </div>
          
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">{currentUser?.displayName || 'Anonymous User'}</h1>
          <p className="text-gray-500 font-medium flex items-center gap-1 mb-4 capitalize">
            <MapPin className="w-4 h-4" /> {userProfile?.location || 'New York City'}
          </p>
          
          <p className="text-gray-700 leading-relaxed text-sm mb-6 capitalize">
            {userProfile?.interests?.length > 0 
              ? `Always down for ${userProfile.interests.join(', ')}. Let's do something today.`
              : `Always down for a quick coffee, a long run, or finding the best street food. Let's do something today.`}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-6 py-4 border-t border-gray-100">
            <div>
              <p className="text-2xl font-bold text-gray-900">{activityPlans.length}</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Plans Joined</p>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div>
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Plans Hosted</p>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div>
              <p className="text-2xl font-bold text-gray-900">5.0</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Rating</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setActiveTab('activity')}
            className={cn(
              "flex-1 flex justify-center items-center gap-2 py-3 rounded-xl text-sm font-bold transition-colors",
              activeTab === 'activity' ? "bg-white text-black shadow-sm border border-gray-100" : "text-gray-500 hover:text-black"
            )}>
            
            <Activity className="w-4 h-4" /> Activity
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={cn(
              "flex-1 flex justify-center items-center gap-2 py-3 rounded-xl text-sm font-bold transition-colors",
              activeTab === 'saved' ? "bg-white text-black shadow-sm border border-gray-100" : "text-gray-500 hover:text-black"
            )}>
            
            <Heart className="w-4 h-4" /> Saved
          </button>
        </div>

        {/* Past Activity Grid */}
        {activeTab === 'activity' && (
          <div className="grid grid-cols-2 gap-4">
            {activityPlans.length === 0 ? (
              <div className="col-span-2 text-center py-12 bg-white rounded-3xl border border-gray-100">
                <Activity className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="font-bold text-gray-900 mb-1">No activity yet</p>
                <p className="text-sm text-gray-500">Join some plans to see them here.</p>
              </div>
            ) : (
              activityPlans.map((plan) => (
                <Link to={`/plan/${plan.id}`} key={plan.id} className="relative aspect-square rounded-2xl overflow-hidden bg-gray-200 group">
                  <img src={plan.image} alt={plan.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-bold text-sm leading-tight mb-0.5">{plan.title}</h3>
                    <p className="text-xs text-gray-300">{plan.time}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="grid grid-cols-2 gap-4">
            {savedPlans.length === 0 ? (
              <div className="col-span-2 text-center py-12 bg-white rounded-3xl border border-gray-100">
                <Heart className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="font-bold text-gray-900 mb-1">No saved plans yet</p>
                <p className="text-sm text-gray-500">When you save plans, they'll show up here.</p>
              </div>
            ) : (
              savedPlans.map((plan) => (
                <Link to={`/plan/${plan.id}`} key={plan.id} className="relative aspect-square rounded-2xl overflow-hidden bg-gray-200 group">
                  <img src={plan.image} alt={plan.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-bold text-sm leading-tight mb-0.5">{plan.title}</h3>
                    <p className="text-xs text-gray-300">{plan.time}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

      </main>

      <BottomNav />
    </div>);

}