import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, User, Lock, Eye, Bell, Mail,
  MapPin, HelpCircle, FileText, Shield, LogOut, ChevronRight } from
'lucide-react';
import { cn } from '../utils/cn';
import { useAuth } from '../lib/AuthContext';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  // State for toggles
  const [toggles, setToggles] = useState({
    push: true,
    email: false,
    location: true
  });

  useEffect(() => {
    if (!currentUser) return;
    const fetchSettings = async () => {
      const docRef = doc(db, 'users', currentUser.uid);
      const snap = await getDoc(docRef);
      if (snap.exists() && snap.data().settings) {
        setToggles(snap.data().settings);
      }
    };
    fetchSettings();
  }, [currentUser]);

  const handleToggle = async (key) => {
    const newValue = !toggles[key];
    setToggles((prev) => ({ ...prev, [key]: newValue }));
    
    if (currentUser) {
      try {
        const docRef = doc(db, 'users', currentUser.uid);
        await updateDoc(docRef, {
          [`settings.${key}`]: newValue
        });
      } catch (err) {
        console.error("Failed to update setting", err);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const renderSection = (title, items) =>
  <div className="mb-8">
      <h3 className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
        {title}
      </h3>
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
        {items.map((item, index) =>
      <button
        key={index}
        onClick={item.onClick}
        className={cn(
          "w-full flex items-center justify-between p-4 transition-colors",
          item.type !== 'toggle' && "hover:bg-gray-50",
          item.type === 'toggle' && "cursor-default" // toggles handle their own click area mostly, but whole row is fine
        )}>
        
            <div className="flex items-center gap-3">
              <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            item.danger ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-600"
          )}>
                {item.icon}
              </div>
              <span className={cn(
            "font-bold text-sm",
            item.danger ? "text-red-600" : "text-gray-900"
          )}>
                {item.label}
              </span>
            </div>

            {/* Right side component based on type */}
            {item.type === 'link' && !item.danger &&
        <ChevronRight className="w-5 h-5 text-gray-400" />
        }
            
            {item.type === 'toggle' &&
        <div
          onClick={(e) => {e.stopPropagation();item.onClick();}}
          className={cn(
            "w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out cursor-pointer shadow-inner",
            toggles[item.toggleKey] ? "bg-green-500" : "bg-gray-200"
          )}>
          
                <div className={cn(
            "w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out",
            toggles[item.toggleKey] ? "translate-x-6" : "translate-x-0"
          )} />
              </div>
        }
          </button>
      )}
      </div>
    </div>;


  return (
    <div className="min-h-[100dvh] bg-gray-50 text-gray-900 font-sans selection:bg-black selection:text-white pb-safe">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 px-6 pt-12 pb-4 shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-black transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="text-sm font-bold text-gray-900 tracking-wide">
            Settings
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 pt-8 pb-12 max-w-2xl mx-auto">
        
        {renderSection('Account', [
        { icon: <User className="w-5 h-5" />, label: 'Edit Profile', type: 'link', onClick: () => navigate('/onboarding') }]
        )}

        {renderSection('Preferences', [
        { icon: <Bell className="w-5 h-5" />, label: 'Push Notifications', type: 'toggle', toggleKey: 'push', onClick: () => handleToggle('push') },
        { icon: <Mail className="w-5 h-5" />, label: 'Email Alerts', type: 'toggle', toggleKey: 'email', onClick: () => handleToggle('email') },
        { icon: <MapPin className="w-5 h-5" />, label: 'Location Services', type: 'toggle', toggleKey: 'location', onClick: () => handleToggle('location') }]
        )}

        {renderSection('Account Actions', [
        { icon: <LogOut className="w-5 h-5" />, label: 'Log Out', type: 'action', danger: true, onClick: handleLogout }]
        )}

        <div className="text-center mt-12 mb-4">
          <p className="text-xs font-bold text-gray-400">MOVO App v1.0.0</p>
          <p className="text-xs text-gray-400 mt-1">Made in New York City</p>
        </div>

      </main>
      
    </div>);

}