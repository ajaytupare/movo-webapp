import React from 'react';
import { Home, Search, PlusCircle, Bell, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn';

export function BottomNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { icon: <Home className="w-6 h-6" />, label: 'Home', path: '/home' },
    { icon: <Search className="w-6 h-6" />, label: 'Discover', path: '/discover' },
    { icon: <PlusCircle className="w-8 h-8" />, label: 'Create', path: '/create', primary: true },
    { icon: <Bell className="w-6 h-6" />, label: 'Alerts', path: '/notifications' },
    { icon: <User className="w-6 h-6" />, label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-gray-200 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-20 px-2 max-w-2xl mx-auto">
        {navItems.map((item, index) => {
          const isActive = currentPath === item.path;
          
          if (item.primary) {
            return (
              <Link 
                key={index} 
                to={item.path}
                className="flex flex-col items-center justify-center -mt-8"
              >
                <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center text-white shadow-xl transform transition-transform active:scale-95 border-4 border-white">
                  {item.icon}
                </div>
              </Link>
            );
          }

          return (
            <Link 
              key={index} 
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center w-16 h-full transition-colors",
                isActive ? "text-black" : "text-gray-400 hover:text-gray-600"
              )}
            >
              <div className={cn(
                "mb-1 transition-transform", 
                isActive ? "scale-110" : ""
              )}>
                {item.icon}
              </div>
              <span className={cn(
                "text-[10px] font-bold tracking-wider",
                isActive ? "opacity-100" : "opacity-0"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
