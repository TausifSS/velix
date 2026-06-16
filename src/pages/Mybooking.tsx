import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Filter, ChevronRight, CheckCircle2, Clock, XCircle } from 'lucide-react';

export const MyBooking: React.FC = () => {
  const { bookings } = useApp();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('completed');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBookings = bookings.filter(booking => {
    let matchesTab = false;
    if (activeTab === 'upcoming') {
      matchesTab = ['requested', 'accepted', 'onWay', 'arrived'].includes(booking.status);
    } else {
      matchesTab = booking.status === activeTab;
    }
    const matchesSearch = booking.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          booking.mechanicName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="p-8 w-full">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1117]">My Bookings</h1>
          <p className="text-gray-500 text-sm mt-1">View and manage all your service requests.</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by ID or Mechanic..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FFB800] focus:ring-1 focus:ring-[#FFB800] w-64 bg-white"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-semibold text-gray-700 bg-white">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button 
          onClick={() => setActiveTab('upcoming')}
          className={`pb-4 px-6 text-sm font-semibold transition-colors relative ${activeTab === 'upcoming' ? 'text-[#FFB800]' : 'text-gray-500 hover:text-gray-800'}`}
        >
          Scheduled / Upcoming
          {activeTab === 'upcoming' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FFB800] rounded-t-full"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('completed')}
          className={`pb-4 px-6 text-sm font-semibold transition-colors relative ${activeTab === 'completed' ? 'text-[#FFB800]' : 'text-gray-500 hover:text-gray-800'}`}
        >
          Completed
          {activeTab === 'completed' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FFB800] rounded-t-full"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('cancelled')}
          className={`pb-4 px-6 text-sm font-semibold transition-colors relative ${activeTab === 'cancelled' ? 'text-[#FFB800]' : 'text-gray-500 hover:text-gray-800'}`}
        >
          Cancelled
          {activeTab === 'cancelled' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FFB800] rounded-t-full"></div>}
        </button>
      </div>

      {/* Booking List */}
      <div className="space-y-4">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                  <img src={`https://ui-avatars.com/api/?name=${booking.mechanicName.replace(' ', '+')}&background=F5F6F8&color=0D1117`} alt={booking.mechanicName} />
                </div>
                <div>
                  <h3 className="font-bold text-[#0D1117]">{booking.mechanicName}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{booking.service} • {booking.vehicle}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] text-gray-400 font-medium">{booking.date} • {booking.time}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="font-bold text-[#0D1117]">{booking.price}</p>
                  {booking.status === 'completed' && (
                    <span className="flex items-center gap-1 text-[10px] text-green-600 font-bold mt-1 justify-end">
                      <CheckCircle2 className="w-3 h-3" /> Completed
                    </span>
                  )}
                  {['requested', 'accepted', 'onWay', 'arrived'].includes(booking.status) && (
                    <span className="flex items-center gap-1 text-[10px] text-[#FFB800] font-bold mt-1 justify-end">
                      <Clock className="w-3 h-3" /> Scheduled
                    </span>
                  )}
                  {booking.status === 'cancelled' && (
                    <span className="flex items-center gap-1 text-[10px] text-red-500 font-bold mt-1 justify-end">
                      <XCircle className="w-3 h-3" /> Cancelled
                    </span>
                  )}
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#FFF9E5] transition-colors">
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#FFB800] transition-colors" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-400 bg-white border border-gray-100 rounded-2xl">
            <p>No bookings found in this section.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBooking;