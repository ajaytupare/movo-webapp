import React, { useState, useEffect } from 'react';
import { BottomNav } from '../components/layout/BottomNav';
import { Search, Map as MapIcon, List, Filter, MapPin, ArrowRight } from 'lucide-react';
import { cn } from '../utils/cn';
import { Link, useNavigate } from 'react-router-dom';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

const TRENDING_SEARCHES = [
'Coffee shops open now',
'Pickup basketball',
'Live jazz',
'Running groups',
'Rooftop drinks'];


export default function DiscoverPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('map'); // default to map as requested
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'plans'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const plansData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Assign a consistent pseudo-random position on the map based on ID string
        mapX: 15 + (doc.id.charCodeAt(0) % 70), // between 15% and 85%
        mapY: 15 + (doc.id.charCodeAt(doc.id.length-1) % 70) 
      }));
      setPlans(plansData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-[100dvh] bg-gray-50 text-gray-900 pb-24 font-sans selection:bg-black selection:text-white">
      
      {/* Search Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 px-6 pt-12 pb-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Search</h1>
            
            {/* View Toggle */}
            <div className="bg-gray-100 p-1 rounded-xl flex items-center shadow-inner">
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-2 rounded-lg flex items-center justify-center transition-all",
                  viewMode === 'list' ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-black"
                )}>
                
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={cn(
                  "p-2 rounded-lg flex items-center justify-center transition-all",
                  viewMode === 'map' ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-black"
                )}>
                
                <MapIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="What do you want to do?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 bg-gray-100 border-transparent rounded-xl pl-12 pr-4 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:bg-white focus:border-black focus:ring-2 focus:ring-black transition-all" />
              
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-colors shadow-sm",
                showFilters ? "bg-black text-white" : "bg-gray-100 text-gray-900 hover:bg-gray-200"
              )}>
              <Filter className="w-5 h-5" />
            </button>
          </div>
          
          {showFilters && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {['All', 'Social', 'Sports', 'Food', 'Creative'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={cn("px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors",
                    filterCategory === cat ? "bg-black text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        
        {viewMode === 'list' && (
          <div className="px-6 mt-6 animate-in fade-in duration-500">
            <h2 className="text-xl font-bold tracking-tight mb-4 text-gray-900">Explore Plans</h2>
            <div className="flex flex-col gap-4">
              {plans
                .filter(plan => filterCategory === 'All' || plan.category === filterCategory.toLowerCase())
                .filter(plan => plan.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(plan => (
                  <Link to={`/plan/${plan.id}`} key={plan.id} className="bg-white rounded-[2rem] border border-gray-100 p-4 flex gap-4 items-center shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
                    <img src={plan.image} className="w-20 h-20 rounded-2xl object-cover bg-gray-100 flex-shrink-0" alt="" />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 leading-tight mb-1">{plan.title}</h3>
                      <p className="text-sm font-medium text-gray-500">{plan.time}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-300" />
                  </Link>
                ))}
            </div>
          </div>
        )}

        {viewMode === 'map' &&
        <div className="relative w-full h-[calc(100dvh-180px)] animate-in fade-in duration-500 bg-gray-200 overflow-hidden">
            {/* Fake Map Background */}
            <img
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80"
            alt="Map View"
            className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity" />
          
            
            {/* Dynamic Map Pins */}
            {plans
              .filter(plan => filterCategory === 'All' || plan.category === filterCategory.toLowerCase())
              .filter(plan => plan.title.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((plan) => (
              <div 
                key={plan.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ top: `${plan.mapY}%`, left: `${plan.mapX}%` }}
              >
                <div 
                  className="relative group cursor-pointer"
                  onClick={() => navigate(`/plan/${plan.id}`)}
                >
                  <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center shadow-xl border-2 border-white transform transition-transform group-hover:scale-110">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-white px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none font-bold text-sm">
                    {plan.title}
                  </div>
                </div>
              </div>
            ))}
            
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg font-bold text-sm border border-gray-200">
              Search this area
            </div>
          </div>
        }

      </main>

      <BottomNav />
    </div>);

}