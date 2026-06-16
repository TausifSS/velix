import React, { useState } from 'react';
import { 
  MapPin, Phone, ShieldCheck, Clock, 
  Search, ShieldAlert, Wrench, Car
} from 'lucide-react';

export const LiveMap: React.FC = () => {
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedPin, setSelectedPin] = useState<any>(null);

  const fleet = [
    { id: '1', name: 'A1 Car Care', type: 'breakdown', status: 'available', coords: { x: 420, y: 180 }, distance: '2.4 km', eta: '6 mins', contact: '+91 98765 43201', vehicle: 'White WagonR' },
    { id: '2', name: 'Speedy Rescue', type: 'towing', status: 'on_duty', coords: { x: 280, y: 350 }, distance: '3.1 km', eta: '8 mins', contact: '+91 98765 43202', vehicle: 'Flatbed Tow Truck' },
    { id: '3', name: 'QuickFix Auto', type: 'battery', status: 'available', coords: { x: 550, y: 280 }, distance: '4.0 km', eta: '10 mins', contact: '+91 98765 43203', vehicle: 'Service Van' },
    { id: '4', name: 'Auto Heroes', type: 'towing', status: 'available', coords: { x: 620, y: 150 }, distance: '1.2 km', eta: '4 mins', contact: '+91 98765 43204', vehicle: 'Hydraulic Lift Tow' }
  ];

  const filteredFleet = filterType === 'all' 
    ? fleet 
    : fleet.filter(f => f.type === filterType);

  return (
    <div className="p-8 w-full h-screen flex flex-col space-y-6 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-start shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1117]">Live Service Map</h1>
          <p className="text-gray-500 text-sm mt-1">Real-time status of dispatch trucks and emergency support loops near Western Express Highway.</p>
        </div>
        
        {/* Quick Helpline Info */}
        <div className="bg-[#0D1117] text-white px-4 py-2 rounded-xl flex items-center gap-3 border border-gray-800 shadow-sm">
          <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-gray-300">Dispatch Support Line:</span>
          <a href="tel:1800-120-999" className="text-sm font-black text-[#FFB800] hover:underline">1800-120-999</a>
        </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-0 bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm p-2">
        {/* Left Side: Sidebar Fleets (30%) */}
        <div className="w-[30%] flex flex-col min-h-0 border-r border-gray-150">
          {/* Search bar */}
          <div className="p-4 border-b border-gray-100 flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input 
                type="text" 
                placeholder="Search fleet units..." 
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#FFB800]"
              />
            </div>
          </div>

          {/* Service Filters */}
          <div className="p-3 border-b border-gray-100 flex gap-1.5 overflow-x-auto custom-scrollbar shrink-0">
            {['all', 'breakdown', 'towing', 'battery'].map((t) => (
              <button 
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold capitalize transition-colors ${
                  filterType === t 
                    ? 'bg-[#FFF9E5] text-[#FFB800] border border-[#FFB800]/30' 
                    : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100 custom-scrollbar">
            {filteredFleet.map((f) => (
              <div 
                key={f.id}
                onClick={() => setSelectedPin(f)}
                className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${
                  selectedPin?.id === f.id ? 'bg-[#FFF9E5]/40' : 'hover:bg-gray-50/50'
                }`}
              >
                <div className="flex gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${
                    f.type === 'breakdown' ? 'bg-orange-50 text-orange-600' :
                    f.type === 'towing' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {f.type === 'breakdown' ? <Wrench className="w-4.5 h-4.5" /> :
                     f.type === 'towing' ? <Car className="w-4.5 h-4.5" /> : <Clock className="w-4.5 h-4.5" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0D1117] flex items-center gap-1">
                      {f.name}
                      {f.status === 'available' && <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span>}
                    </h4>
                    <p className="text-[10px] text-gray-500 mt-0.5">{f.vehicle} • {f.distance}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[9px] font-bold text-[#FFB800] bg-yellow-50 px-2 py-0.5 rounded capitalize">
                    {f.eta}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Emergency Cards */}
          <div className="p-4 bg-[#0D1117] text-white m-3 rounded-2xl border border-gray-800 space-y-3 shrink-0">
            <h4 className="text-xs font-bold text-red-500 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" /> Highway Emergencies
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="border border-white/10 p-2 rounded-xl bg-white/5">
                <p className="text-gray-400">Police Hotline</p>
                <a href="tel:112" className="font-extrabold text-white text-xs hover:underline mt-0.5 block">112</a>
              </div>
              <div className="border border-white/10 p-2 rounded-xl bg-white/5">
                <p className="text-gray-400">Accident Help</p>
                <a href="tel:1073" className="font-extrabold text-white text-xs hover:underline mt-0.5 block">1073</a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Map Canvas Simulation (70%) */}
        <div className="flex-1 bg-[#E8EAED] relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-[#E5E5E5] opacity-50" 
               style={{ 
                 backgroundImage: 'radial-gradient(#c9ccd1 1px, transparent 1px)', 
                 backgroundSize: '20px 20px' 
               }} />

          {/* Draw Roads SVG Grid */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <path d="M 50,50 L 950,50 M 50,300 L 950,300 M 50,550 L 950,550 M 200,50 L 200,600 M 500,50 L 500,600 M 800,50 L 800,600" fill="none" stroke="#FFFFFF" strokeWidth="6" opacity="0.6" />
            <path d="M 50,50 L 950,50 M 50,300 L 950,300 M 50,550 L 950,550 M 200,50 L 200,600 M 500,50 L 500,600 M 800,50 L 800,600" fill="none" stroke="#D1D5DB" strokeWidth="2" strokeDasharray="5 5" />
            
            {/* Main WEH Highway diagonal line */}
            <path d="M 100,550 C 300,500 400,200 850,100" fill="none" stroke="#C1C5CB" strokeWidth="16" />
            <path d="M 100,550 C 300,500 400,200 850,100" fill="none" stroke="#FFD166" strokeWidth="2" strokeDasharray="6 6" />
          </svg>

          {/* User Location Blue Marker */}
          <div className="absolute top-[380px] left-[500px] -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="relative">
              <div className="w-8 h-8 bg-blue-500 rounded-full shadow-lg border-2 border-white flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
              </div>
              <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-25"></div>
            </div>
            <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white text-[#0D1117] text-[10px] font-bold px-2.5 py-1 rounded shadow-md border border-gray-150 whitespace-nowrap">
              Your GPS: Western Express Highway
            </div>
          </div>

          {/* Fleet Pins */}
          {filteredFleet.map((f) => {
            const active = selectedPin?.id === f.id;
            return (
              <div 
                key={f.id}
                onClick={() => setSelectedPin(f)}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
                style={{ top: `${f.coords.y}px`, left: `${f.coords.x}px` }}
              >
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full shadow-md flex items-center justify-center border-2 transition-all ${
                    active ? 'bg-[#0D1117] border-[#FFB800] scale-110 shadow-lg' : 'bg-white border-green-500 group-hover:scale-105'
                  }`}>
                    {f.type === 'breakdown' ? <Wrench className={`w-5 h-5 ${active ? 'text-[#FFB800]' : 'text-orange-500'}`} /> :
                     f.type === 'towing' ? <Car className={`w-5 h-5 ${active ? 'text-[#FFB800]' : 'text-blue-500'}`} /> :
                     <Clock className={`w-5 h-5 ${active ? 'text-[#FFB800]' : 'text-gray-500'}`} />}
                  </div>
                  <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
              </div>
            );
          })}

          {/* Selected Pin Details Overlay Card */}
          {selectedPin && (
            <div className="absolute bottom-4 left-4 right-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xl max-w-sm z-30 animate-in slide-in-from-bottom-5 duration-200 flex justify-between items-center">
              <div>
                <h4 className="text-sm font-extrabold text-[#0D1117] flex items-center gap-1">
                  {selectedPin.name}
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                </h4>
                <p className="text-xs text-gray-500 mt-1">{selectedPin.vehicle} • {selectedPin.distance} away</p>
                <div className="flex gap-2.5 items-center mt-2 text-xs font-semibold text-gray-600">
                  <span className="flex items-center gap-1 text-[#FFB800] bg-yellow-50 px-2 py-0.5 rounded">
                    ★ 4.8
                  </span>
                  <span>ETA: {selectedPin.eta}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 shrink-0">
                <a 
                  href={`tel:${selectedPin.contact}`} 
                  className="bg-[#0D1117] text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-gray-800 flex items-center justify-center gap-1 shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5" /> Call Unit
                </a>
                <button 
                  onClick={() => setSelectedPin(null)} 
                  className="text-xs text-gray-400 font-bold hover:underline"
                >
                  Close Detail
                </button>
              </div>
            </div>
          )}

          {/* Map zoom controls */}
          <div className="absolute right-4 bottom-4 flex flex-col gap-2 z-30">
            <button className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center text-gray-700 font-bold text-lg hover:bg-gray-50 border border-gray-100">+</button>
            <button className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center text-gray-700 font-bold text-xl hover:bg-gray-50 border border-gray-100">-</button>
            <button className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center text-[#FFB800] hover:bg-gray-50 border border-gray-100"><MapPin className="w-5 h-5 fill-current" /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMap;
