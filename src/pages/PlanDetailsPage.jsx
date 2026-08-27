import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Share, MapPin, Clock, Users, ChevronRight, MessageCircle } from 'lucide-react';
import { cn } from '../utils/cn';
import { doc, getDoc, updateDoc, arrayUnion, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';

export default function PlanDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [hasJoined, setHasJoined] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlan() {
      if (!id) return;
      try {
        const docRef = doc(db, 'plans', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPlan({ id: docSnap.id, ...data });

          if (currentUser && data.attendees?.includes(currentUser.uid)) {
            setHasJoined(true);
          }
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching plan:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPlan();
  }, [id, currentUser]);

  const handleJoin = async () => {
    if (!currentUser) {
      alert("Please log in to join a plan.");
      return;
    }
    if (!id || !plan) return;

    setIsProcessing(true);
    try {
      const docRef = doc(db, 'plans', id);
      await updateDoc(docRef, {
        attendees: arrayUnion(currentUser.uid),
        joinedCount: plan.joinedCount + 1
      });

      if (plan.hostId && plan.hostId !== currentUser.uid) {
        const notifRef = collection(db, 'users', plan.hostId, 'notifications');
        await addDoc(notifRef, {
          type: 'join',
          userId: currentUser.uid,
          userName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Someone',
          userAvatar: currentUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.uid}`,
          planId: id,
          planTitle: plan.title,
          createdAt: serverTimestamp(),
          read: false
        });
      }

      setHasJoined(true);
      setPlan({ ...plan, joinedCount: plan.joinedCount + 1, attendees: [...plan.attendees, currentUser.uid] });
    } catch (error) {
      console.error("Error joining plan:", error);
      alert("Failed to join plan.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return <div className="min-h-[100dvh] flex items-center justify-center font-bold text-gray-500">Loading plan...</div>;
  }

  if (!plan) {
    return <div className="min-h-[100dvh] flex items-center justify-center font-bold text-gray-500">Plan not found.</div>;
  }

  return (
    <div className="min-h-[100dvh] bg-white text-gray-900 font-sans selection:bg-black selection:text-white pb-32">
      
      {/* Top Floating Actions */}
      <div className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center pointer-events-none">
        <button
          onClick={() => navigate(-1)}
          className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors shadow-lg pointer-events-auto border border-white/20">
          
          <ArrowLeft className="w-6 h-6" />
        </button>
        <button className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors shadow-lg pointer-events-auto border border-white/20">
          <Share className="w-5 h-5" />
        </button>
      </div>

      {/* Hero Image */}
      <div className="w-full h-[45dvh] relative bg-gray-200">
        <img src={plan.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'} alt={plan.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      </div>

      {/* Main Content (Overlaps Image) */}
      <main className="relative z-10 -mt-12 bg-white rounded-t-[3rem] px-6 pt-10 pb-8 min-h-[60dvh] max-w-3xl mx-auto shadow-2xl">
        
        {/* Title & Badge */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600 uppercase tracking-widest">
              {plan.category || 'Event'}
            </span>
            <span className="text-sm font-bold text-gray-400">
              Nearby
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight leading-tight mb-4">{plan.title}</h1>
          
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 text-gray-500">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-gray-900">When</p>
                <p className="text-sm text-gray-500 font-medium">{plan.time}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 text-gray-500">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-gray-900">Where</p>
                <p className="text-sm text-gray-500 font-medium">{plan.location}</p>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-gray-100 mb-8" />

        {/* Host Profile */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <img src={plan.hostAvatar || 'https://i.pravatar.cc/150?img=11'} alt={plan.hostName} className="w-14 h-14 rounded-full object-cover shadow-sm border border-gray-100" />
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-0.5">Hosted by</p>
              <h3 className="font-bold text-lg leading-none">{plan.hostName || 'Someone'}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-bold bg-gray-100 px-2 py-0.5 rounded-md">★ New</span>
                <span className="text-xs text-gray-500">Movo Host</span>
              </div>
            </div>
          </div>
          <Link to={`/chat/${plan.id}`} className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-200 hover:text-black transition-colors shadow-sm border border-gray-100">
            <MessageCircle className="w-5 h-5" />
          </Link>
        </div>

        {/* Description */}
        <div className="mb-10">
          <h3 className="font-bold text-xl mb-3">About this plan</h3>
          <p className="text-gray-600 leading-relaxed">
            {plan.description || 'No description provided.'}
          </p>
        </div>

        {/* Attendees */}
        <div className="bg-gray-50 rounded-[2rem] p-6 mb-8 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Who's going</h3>
            <span className="text-sm font-bold text-gray-500">{plan.joinedCount || 1}/{plan.maxCapacity} spots filled</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex -space-x-3">
              {Array.from({ length: Math.min(3, plan.joinedCount || 1) }).map((_, i) =>
              <img
                key={i}
                src={`https://i.pravatar.cc/150?img=${i + 15}`}
                alt="Attendee"
                className="w-12 h-12 rounded-full border-4 border-gray-50 object-cover shadow-sm" />

              )}
              <div className="w-12 h-12 rounded-full border-4 border-gray-50 bg-gray-200 flex items-center justify-center shadow-sm">
                <span className="text-xs font-bold text-gray-500">+{Math.max(0, plan.maxCapacity - (plan.joinedCount || 1))}</span>
              </div>
            </div>
            
            <button className="text-sm font-bold text-blue-600 flex items-center gap-1 hover:text-blue-800 transition-colors">
              See all <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Location Map Snippet */}
        <div className="rounded-[2rem] overflow-hidden bg-gray-200 h-48 relative border border-gray-200">
          <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80" alt="Map" className="w-full h-full object-cover opacity-80 mix-blend-luminosity" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-2xl border-4 border-white">
              <MapPin className="w-6 h-6" />
            </div>
          </div>
          <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md rounded-xl p-3 shadow-sm border border-gray-100">
            <p className="font-bold text-sm text-gray-900">{plan.location}</p>
            <p className="text-xs text-gray-500">{plan.address}</p>
          </div>
        </div>

      </main>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent z-50 pointer-events-none">
        <div className="max-w-3xl mx-auto pointer-events-auto">
          {!hasJoined ?
          <button
            onClick={handleJoin}
            disabled={isProcessing}
            className="w-full h-16 bg-black text-white rounded-2xl font-bold text-lg shadow-2xl hover:bg-gray-800 transition-transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2">
            
              {isProcessing ? 'Confirming...' : 'Join Plan'}
            </button> :

          <div className="w-full h-16 bg-gray-100 text-black border border-gray-200 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-sm">
              <span className="text-green-600">✓</span> You're In!
            </div>
          }
        </div>
      </div>
      
    </div>);

}