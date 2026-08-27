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
        
        {/* Right Images Collage */}
        <div className="flex-1 w-full relative flex justify-center items-center h-[50vh] lg:h-[70vh] max-h-[700px] mt-10 lg:mt-0">
          <div className="relative w-full h-full grid grid-cols-3 gap-3 lg:gap-4">
            
            {/* Left Column (2 images) */}
            <div className="flex flex-col gap-3 lg:gap-4 h-full transform translate-y-6 lg:translate-y-12">
              <div className="flex-[0.6] rounded-[1.5rem] overflow-hidden shadow-xl border border-gray-200/50">
                <img
                  src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80"
                  alt="Party/Social"
                  className="w-full h-full object-cover" />
                
              </div>
              <div className="flex-[0.4] rounded-[1.5rem] overflow-hidden shadow-xl border border-gray-200/50">
                <img
                  src="https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=600&q=80"
                  alt="Coffee"
                  className="w-full h-full object-cover" />
                
              </div>
            </div>

            {/* Center Column (1 tall image) */}
            <div className="relative h-full rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden shadow-2xl border border-gray-200/50 transform -translate-y-4 lg:-translate-y-6 z-10">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
                alt="Friends hanging out"
                className="w-full h-full object-cover" />
              
              {/* Clean UI overlay */}
              <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-2 lg:p-3 rounded-xl shadow-sm border border-gray-100">
                <p className="text-xs lg:text-sm font-bold text-gray-900 leading-tight truncate">Coffee Downtown</p>
                <p className="text-[10px] lg:text-xs text-gray-500 mt-0.5">Starts in 10 mins</p>
              </div>
            </div>

            {/* Right Column (2 images) */}
            <div className="flex flex-col gap-3 lg:gap-4 h-full transform translate-y-6 lg:translate-y-12">
              <div className="flex-[0.4] rounded-[1.5rem] overflow-hidden shadow-xl border border-gray-200/50 relative">
                <img
                  src="https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=600&q=80"
                  alt="Drinks"
                  className="w-full h-full object-cover" />
                
                {/* Second tiny overlay */}
                <div className="absolute top-2 right-2 lg:top-3 lg:right-3 bg-black/80 backdrop-blur-md px-2 py-1 rounded-full shadow-lg border border-white/10">
                  <p className="text-[10px] lg:text-xs font-bold text-white tracking-wide">3 joined</p>
                </div>
              </div>
              <div className="flex-[0.6] rounded-[1.5rem] overflow-hidden shadow-xl border border-gray-200/50">
                <img
                  src="https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?auto=format&fit=crop&w=600&q=80"
                  alt="Group smiling"
                  className="w-full h-full object-cover" />
                
              </div>
            </div>
            
          </div>
        </div>

      </main>
    </div>);

}