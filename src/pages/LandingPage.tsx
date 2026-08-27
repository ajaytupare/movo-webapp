import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-[100dvh] bg-white text-gray-900 font-sans flex flex-col selection:bg-black selection:text-white">
      
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-black">MOVO</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/login" className="text-sm font-medium text-gray-500 hover:text-black transition-colors hidden sm:block">
            Log in
          </Link>
          <Link to="/register" className="text-sm font-medium bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800 transition-colors">
            Get Started
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center p-6 md:px-12 max-w-7xl mx-auto w-full gap-12 lg:gap-20">
        
        {/* Left Text */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left mt-8 lg:mt-0">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight text-gray-900">
            Meet up.<br />
            Right now.
          </h1>
          <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-lg leading-relaxed font-light">
            No endless group chats. No heavy planning. Discover spontaneous activities happening around you and join in instantly.
          </p>
          <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-4">
            <Link to="/register" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-3.5 bg-black hover:bg-gray-800 text-white rounded-full font-medium text-base transition-colors">
                Join the community
              </button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-3.5 bg-gray-100 hover:bg-gray-200 text-black rounded-full font-medium text-base transition-colors">
                Sign in
              </button>
            </Link>
          </div>
        </div>
        
        {/* Right Image */}
        <div className="flex-1 w-full relative flex justify-center items-center h-[50vh] lg:h-[70vh] max-h-[700px]">
          <div className="relative w-full h-full rounded-[2.5rem] bg-gray-100 overflow-hidden shadow-2xl border border-gray-200/50">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80" 
              alt="People hanging out" 
              className="w-full h-full object-cover"
            />
            
            {/* Clean UI overlay */}
            <div className="absolute bottom-6 left-6 right-6 lg:left-10 lg:right-10 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-900">Coffee Downtown</p>
                  <p className="text-xs text-gray-500 mt-0.5">Starts in 10 mins • 0.5km away</p>
                </div>
                <button className="bg-black text-white px-4 py-2 rounded-full text-xs font-bold">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
