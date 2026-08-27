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

          <div className="mt-8 flex items-center justify-center space-x-4">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">or</span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          <button type="button" onClick={handleGoogleSignIn} disabled={isLoading} className="w-full h-12 mt-8 border border-gray-300 hover:bg-gray-50 rounded-xl font-semibold text-gray-700 transition-colors flex items-center justify-center shadow-sm bg-white disabled:opacity-50">
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

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