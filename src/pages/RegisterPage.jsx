import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      // 2. Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        createdAt: new Date().toISOString(),
        onboardingCompleted: false
      });

      // 3. Navigate to onboarding
      navigate('/onboarding');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Save user to firestore if they don't exist
      await setDoc(doc(db, 'users', user.uid), {
        name: user.displayName || 'Anonymous',
        email: user.email,
        createdAt: new Date().toISOString()
      }, { merge: true });

      navigate('/onboarding'); 
    } catch (err) {
      console.error(err);
      setError(err.message || 'Google sign-in failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[100dvh] bg-gray-50 text-gray-900 selection:bg-black selection:text-white font-sans">
      
      {/* Left Form Section */}
      <div className="flex-1 flex flex-col p-6 lg:px-12 xl:px-24 bg-white shadow-2xl z-10 max-w-2xl relative">
        <header className="flex items-center mb-12">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-black transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
          <div className="mb-10 text-center">
            <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center mx-auto mb-6">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2 text-gray-900">Create an account</h1>
            <p className="text-gray-500 text-sm">Join the community and start discovering.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error &&
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">
                {error}
              </div>
            }
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-12 bg-white border border-gray-300 rounded-xl pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all shadow-sm"
                  required />
                
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 bg-white border border-gray-300 rounded-xl pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all shadow-sm"
                  required />
                
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 bg-white border border-gray-300 rounded-xl pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all shadow-sm"
                  required />
                
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full h-12 bg-black hover:bg-gray-800 text-white rounded-xl font-semibold text-base transition-transform active:scale-95 shadow-md mt-4 disabled:opacity-50">
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>



          <p className="mt-8 text-center text-sm font-medium text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-black hover:underline transition-all">
              Log in
            </Link>
          </p>
        </main>
      </div>

      {/* Right Image Section (Desktop only) */}
      <div className="hidden lg:block lg:flex-1 relative overflow-hidden bg-gray-100">
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
          alt="Community"
          className="absolute inset-0 w-full h-full object-cover" />
        
      </div>
    </div>);

}