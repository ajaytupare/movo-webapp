import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/home');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    
    try {
      await signInWithPopup(auth, provider);
      navigate('/home');
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2 text-gray-900">Welcome back</h1>
            <p className="text-gray-500 text-sm">Log in to discover what's happening nearby.</p>
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
            
            <div className="flex justify-end">
              <button type="button" className="text-xs font-semibold text-gray-500 hover:text-black transition-colors">
                Forgot password?
              </button>
            </div>

            <button type="submit" disabled={isLoading} className="w-full h-12 bg-black hover:bg-gray-800 text-white rounded-xl font-semibold text-base transition-transform active:scale-95 shadow-md mt-4 disabled:opacity-50">
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </form>


          <p className="mt-8 text-center text-sm font-medium text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-black hover:underline transition-all">
              Sign up
            </Link>
          </p>
        </main>
      </div>

      {/* Right Image Section (Desktop only) */}
      <div className="hidden lg:block lg:flex-1 relative overflow-hidden bg-gray-100">
        <img
          src="https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&w=1200&q=80"
          alt="People playing sports"
          className="absolute inset-0 w-full h-full object-cover" />
        
      </div>
    </div>);

}