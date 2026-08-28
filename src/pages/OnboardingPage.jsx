import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, ChevronRight, ArrowLeft, Search, Plus } from 'lucide-react';
import { cn } from '../utils/cn';
import { useAuth } from '../lib/AuthContext';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const INTERESTS = [
{ id: 'coffee', label: 'Coffee', image: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=100&h=100&fit=crop' },
{ id: 'drinks', label: 'Drinks', image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=100&h=100&fit=crop' },
{ id: 'sports', label: 'Sports', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=100&h=100&fit=crop' },
{ id: 'gaming', label: 'Gaming', image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=100&h=100&fit=crop' },
{ id: 'movies', label: 'Movies', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=100&h=100&fit=crop' },
{ id: 'food', label: 'Food', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100&h=100&fit=crop' },
{ id: 'music', label: 'Live Music', image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=200&h=200&fit=crop' },
{ id: 'outdoors', label: 'Outdoors', image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=200&h=200&fit=crop' }];


export default function OnboardingPage() {
  const navigate = useNavigate();
  const { currentUser, reloadUser } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [photoBase64, setPhotoBase64] = useState(currentUser?.photoURL || null);
  const [location, setLocation] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handleGetLocation = () => {
    setIsGettingLocation(true);
    // Simulate getting location since we don't have a Geocoding API key
    setTimeout(() => {
      setLocation("New York City");
      setIsGettingLocation(false);
    }, 1000);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Compress and resize image to max 300x300
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 300;
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
        
        // Convert to base64 jpeg
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setPhotoBase64(dataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setLoading(true);
      
      try {
        if (currentUser) {
          const updates = {};
          
          if (photoBase64 && photoBase64 !== currentUser.photoURL) {
            try {
              // Try Firebase Storage first
              const { ref, uploadString, getDownloadURL } = await import('firebase/storage');
              const { storage } = await import('../lib/firebase');
              const storageRef = ref(storage, `avatars/${currentUser.uid}-${Date.now()}.jpg`);
              await uploadString(storageRef, photoBase64, 'data_url');
              const url = await getDownloadURL(storageRef);
              
              await updateProfile(currentUser, { photoURL: url });
              updates.photoURL = url;
            } catch (storageErr) {
              console.warn("Storage upload failed (possibly rules), falling back to base64", storageErr);
              // Fallback to base64 if Storage isn't configured
              await updateProfile(currentUser, { photoURL: photoBase64 });
              updates.photoURL = photoBase64;
            }
          }

          if (selectedInterests.length > 0) {
            updates.interests = selectedInterests;
          }
          if (location.trim() !== '') {
            updates.location = location.trim();
          }
          if (Object.keys(updates).length > 0) {
            const userRef = doc(db, 'users', currentUser.uid);
            
            // Add a 5-second timeout to setDoc in case the Firestore database hasn't been created in the console yet
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error("FIRESTORE_TIMEOUT")), 5000)
            );
            
            await Promise.race([
              setDoc(userRef, updates, { merge: true }),
              timeoutPromise
            ]);

            // Ensure frontend state instantly reflects backend changes
            if (reloadUser) await reloadUser();
          }
        }
      } catch (err) {
        console.error("Failed to update profile", err);
        if (err.message === "FIRESTORE_TIMEOUT") {
          alert("Your profile couldn't be saved. Have you created the Firestore Database in your Firebase Console yet?");
        }
      }
      
      setLoading(false);
      navigate('/home');
    }
  };

  return (
    <div className="min-h-[100dvh] bg-white text-gray-900 flex flex-col font-sans selection:bg-black selection:text-white">
      
      {/* Header & Progress */}
      <header className="px-6 py-8 relative z-20 max-w-2xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">
            
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            Step {step} of 3
          </div>
          <div className="w-10" />
        </div>

        <div className="flex gap-2">
          {[1, 2, 3].map((i) =>
          <div key={i} className="h-1.5 flex-1 rounded-full bg-gray-100 overflow-hidden">
              <div
              className={cn(
                "h-full bg-black rounded-full transition-all duration-500 ease-out",
                step >= i ? "w-full" : "w-0"
              )} />
            
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-6 flex flex-col max-w-2xl mx-auto w-full">
        <div className="flex-1">
          
          {step === 1 &&
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h1 className="text-4xl font-bold tracking-tight mb-3">Add a photo.</h1>
              <p className="text-gray-500 text-lg mb-10">Let people know who they're meeting up with.</p>
              
              <div className="flex flex-col items-center justify-center py-10">
                <label className="relative group cursor-pointer block">
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  <div className="w-40 h-40 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 text-gray-400 group-hover:border-black group-hover:text-black transition-colors overflow-hidden">
                    {photoBase64 ? (
                      <img src={photoBase64} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-10 h-10" />
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                    <Plus className="w-6 h-6" />
                  </div>
                </label>
              </div>
            </div>
          }

          {step === 2 &&
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h1 className="text-4xl font-bold tracking-tight mb-3">Where are you?</h1>
              <p className="text-gray-500 text-lg mb-10">We need this to show you activities nearby.</p>
              
              <div className="space-y-4">
                <button 
                  onClick={handleGetLocation}
                  disabled={isGettingLocation}
                  className="w-full bg-black text-white rounded-2xl p-5 flex items-center gap-4 hover:scale-[0.98] transition-transform shadow-md disabled:opacity-50">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-lg">{isGettingLocation ? 'Locating...' : 'Use Current Location'}</h3>
                    <p className="text-gray-300 text-sm">Recommended for best experience</p>
                  </div>
                </button>

                <div className="relative mt-8">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Search className="w-5 h-5" />
                  </div>
                  <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Or enter city manually"
                  className="w-full h-14 bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" />
                
                </div>
              </div>
            </div>
          }

          {step === 3 &&
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-8">
              <h1 className="text-4xl font-bold tracking-tight mb-3">What are you into?</h1>
              <p className="text-gray-500 text-lg mb-8">Pick a few so we can recommend the right plans.</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {INTERESTS.map((interest) => {
                const isSelected = selectedInterests.includes(interest.id);
                return (
                  <button
                    key={interest.id}
                    onClick={() => {
                      setSelectedInterests((prev) =>
                      prev.includes(interest.id) ?
                      prev.filter((i) => i !== interest.id) :
                      [...prev, interest.id]
                      );
                    }}
                    className={cn(
                      "flex flex-col text-left rounded-2xl transition-all overflow-hidden border bg-white group",
                      isSelected ?
                      "border-black ring-2 ring-black shadow-md" :
                      "border-gray-200 hover:border-black/50 hover:shadow-sm"
                    )}>
                    
                      <div className="w-full aspect-[4/3] relative overflow-hidden bg-gray-100">
                        <img
                        src={interest.image}
                        alt={interest.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      
                        {isSelected &&
                      <div className="absolute top-2 right-2 w-6 h-6 bg-black rounded-full flex items-center justify-center shadow-md">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                      }
                      </div>
                      <div className="p-3 w-full">
                        <span className={cn("font-bold text-sm", isSelected ? "text-black" : "text-gray-700")}>
                          {interest.label}
                        </span>
                      </div>
                    </button>);

              })}
              </div>
            </div>
          }

        </div>

        {/* Footer actions */}
        <div className="py-8 mt-auto z-20 bg-white">
          <button
            onClick={handleNext}
            disabled={loading}
            className="w-full h-14 bg-black text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-50">
            
            {loading ? 'Setting up...' : step === 3 ? 'Let\'s Go!' : 'Continue'}
            {!loading && <ChevronRight className="w-5 h-5" />}
          </button>
          {step < 3 &&
          <button
            onClick={handleNext}
            className="w-full py-4 text-gray-400 font-semibold mt-2 hover:text-black transition-colors">
            
              Skip for now
            </button>
          }
        </div>
      </main>
    </div>);

}