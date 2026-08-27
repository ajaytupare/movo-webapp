import React, { useState } from 'react';
import { BottomNav } from '../components/layout/BottomNav';
import { Check, X, Bell, UserPlus, Calendar } from 'lucide-react';
import { cn } from '../utils/cn';

const INITIAL_NOTIFICATIONS = [
{
  id: 1,
  type: 'request',
  user: { name: 'Michael', avatar: 'https://i.pravatar.cc/150?img=11' },
  plan: 'Morning Run & Coffee',
  time: '2m ago',
  read: false,
  status: 'pending' // pending, accepted, declined
},
{
  id: 2,
  type: 'accepted',
  user: { name: 'Sarah', avatar: 'https://i.pravatar.cc/150?img=5' },
  plan: 'Indie Game Dev Meetup',
  time: '1h ago',
  read: false
},
{
  id: 3,
  type: 'reminder',
  plan: 'Dinner Tonight',
  time: '2h ago',
  message: 'Starts in 1 hour! Head to the location.',
  read: true
},
{
  id: 4,
  type: 'request',
  user: { name: 'Jessica', avatar: 'https://i.pravatar.cc/150?img=9' },
  plan: 'Weekend Hike',
  time: '1d ago',
  read: true,
  status: 'accepted'
}];


export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const handleAction = (id, action) => {
    setNotifications((prev) => prev.map((notif) =>
    notif.id === id ? { ...notif, status: action, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-[100dvh] bg-white text-gray-900 pb-24 font-sans selection:bg-black selection:text-white">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 px-6 pt-12 pb-4">
        <div className="max-w-2xl mx-auto flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Alerts</h1>
            {unreadCount > 0 &&
            <p className="text-sm font-bold text-blue-600 mt-1">You have {unreadCount} new alerts</p>
            }
          </div>
          {unreadCount > 0 &&
          <button
            onClick={markAllAsRead}
            className="text-sm font-bold text-gray-400 hover:text-black transition-colors">
            
              Mark all read
            </button>
          }
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto">
        <div className="divide-y divide-gray-100">
          
          {notifications.map((notif) =>
          <div
            key={notif.id}
            className={cn(
              "p-6 flex gap-4 transition-colors relative",
              !notif.read ? "bg-blue-50/30" : "bg-white"
            )}>
            
              {!notif.read &&
            <span className="absolute top-1/2 left-2 w-1.5 h-1.5 bg-blue-600 rounded-full transform -translate-y-1/2" />
            }
              
              {/* Icon / Avatar */}
              <div className="flex-shrink-0">
                {notif.type === 'request' || notif.type === 'accepted' ?
              <div className="relative">
                    <img src={notif.user?.avatar} alt={notif.user?.name} className="w-12 h-12 rounded-full object-cover border border-gray-100" />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] bg-black">
                      {notif.type === 'request' ? <UserPlus className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                    </div>
                  </div> :

              <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500">
                    <Calendar className="w-5 h-5" />
                  </div>
              }
              </div>

              {/* Content */}
              <div className="flex-1 pt-1">
                {notif.type === 'request' &&
              <>
                    <p className="text-gray-900 leading-snug">
                      <span className="font-bold">{notif.user?.name}</span> requested to join <span className="font-bold">"{notif.plan}"</span>
                    </p>
                    <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider">{notif.time}</p>
                    
                    {notif.status === 'pending' ?
                <div className="flex gap-2 mt-3">
                        <button
                    onClick={() => handleAction(notif.id, 'accepted')}
                    className="flex-1 py-2 bg-black text-white rounded-xl text-sm font-bold shadow-sm hover:bg-gray-800 transition-colors">
                    
                          Accept
                        </button>
                        <button
                    onClick={() => handleAction(notif.id, 'declined')}
                    className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors">
                    
                          Decline
                        </button>
                      </div> :

                <p className={cn(
                  "text-sm font-bold mt-3 px-3 py-1.5 rounded-lg inline-block",
                  notif.status === 'accepted' ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                )}>
                        {notif.status === 'accepted' ? 'Request Accepted' : 'Request Declined'}
                      </p>
                }
                  </>
              }

                {notif.type === 'accepted' &&
              <>
                    <p className="text-gray-900 leading-snug">
                      <span className="font-bold">{notif.user?.name}</span> accepted your request for <span className="font-bold">"{notif.plan}"</span>
                    </p>
                    <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider">{notif.time}</p>
                  </>
              }

                {notif.type === 'reminder' &&
              <>
                    <p className="text-gray-900 leading-snug">
                      <span className="font-bold">Reminder for "{notif.plan}"</span>
                    </p>
                    <p className="text-sm text-gray-600 mt-0.5">{notif.message}</p>
                    <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider">{notif.time}</p>
                  </>
              }
              </div>

            </div>
          )}

          {notifications.length === 0 &&
          <div className="py-20 flex flex-col items-center justify-center text-center px-6">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">No alerts yet</h3>
              <p className="text-sm text-gray-500">When you join plans or get requests, they'll show up here.</p>
            </div>
          }

        </div>
      </main>

      <BottomNav />
    </div>);

}