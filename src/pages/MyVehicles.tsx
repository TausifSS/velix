import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Trash2, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export const MyVehicles: React.FC = () => {
  const { vehicles, addVehicle, setDefaultVehicle, deleteVehicle } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);

  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [regNo, setRegNo] = useState('');
  const [vehType, setVehType] = useState('Car');
  const [fuelType, setFuelType] = useState('CNG');
  const [color, setColor] = useState('White');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (brand.trim() && regNo.trim()) {
      addVehicle({
        type: vehType,
        brand,
        model,
        number: regNo,
        fuel: fuelType,
        color
      });
      // Reset
      setBrand('');
      setModel('');
      setRegNo('');
      setVehType('Car');
      setFuelType('CNG');
      setColor('White');
      setShowAddForm(false);
    }
  };

  return (
    <div className="p-8 h-full flex flex-col w-full overflow-y-auto custom-scrollbar">
      
      {/* Page Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1117]">My Garage</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your cars and bikes for quick emergency requests</p>
        </div>
        
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#0D1117] text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-gray-800 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          {showAddForm ? 'Cancel' : 'Add New Vehicle'}
        </button>
      </div>

      {/* Add New Vehicle Form (Conditional) */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="text-lg font-bold text-[#0D1117] mb-4">Vehicle Details</h3>
          
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Vehicle Type</label>
              <select 
                value={vehType}
                onChange={(e) => setVehType(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FFB800] bg-white"
              >
                <option>Car</option>
                <option>Bike</option>
                <option>EV</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Brand & Model</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="e.g. Maruti" 
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-1/2 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FFB800]"
                  required
                />
                <input 
                  type="text" 
                  placeholder="e.g. WagonR" 
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-1/2 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FFB800]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Registration Number</label>
              <input 
                type="text" 
                placeholder="e.g. MH 12 AB 1234" 
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FFB800] uppercase"
                required
              />
            </div>

            <div className="flex gap-2">
              <div className="w-1/2">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Fuel</label>
                <select 
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FFB800] bg-white"
                >
                  <option>CNG</option>
                  <option>Petrol</option>
                  <option>Diesel</option>
                  <option>Electric</option>
                </select>
              </div>
              <div className="w-1/2">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Color</label>
                <input 
                  type="text" 
                  placeholder="White" 
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FFB800]"
                />
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-end mt-2">
              <button 
                type="submit" 
                className="bg-[#FFB800] text-[#0D1117] font-bold px-8 py-3 rounded-xl hover:bg-yellow-400 transition-colors shadow-sm"
              >
                Save Vehicle
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className={`bg-white rounded-2xl border p-6 relative transition-all hover:shadow-md ${vehicle.isDefault ? 'border-[#FFB800] ring-1 ring-[#FFB800]/20' : 'border-gray-200'}`}>
            
            {/* Default Badge */}
            {vehicle.isDefault && (
              <div className="absolute top-0 right-6 -translate-y-1/2 bg-[#FFB800] text-[#0D1117] text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <CheckCircle2 className="w-3 h-3" /> Default
              </div>
            )}

            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center text-2xl">
                🚗
              </div>
              {!vehicle.isDefault && (
                <button 
                  onClick={() => deleteVehicle(vehicle.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#0D1117]">{vehicle.brand} {vehicle.model}</h3>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mt-1">
                {vehicle.number}
              </p>
            </div>

            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-100">
              <div className="bg-gray-50 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 border border-gray-100">
                {vehicle.color}
              </div>
              <div className="bg-gray-50 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 border border-gray-100">
                {vehicle.fuel}
              </div>
              <div className="bg-gray-50 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 border border-gray-100">
                {vehicle.type}
              </div>
            </div>

            {!vehicle.isDefault && (
              <button 
                onClick={() => setDefaultVehicle(vehicle.id)}
                className="mt-4 w-full py-2.5 text-sm font-semibold text-gray-500 hover:text-[#0D1117] hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-200"
              >
                Set as Default
              </button>
            )}

          </div>
        ))}

        {/* Empty State / Add New Card */}
        <div 
          onClick={() => setShowAddForm(true)}
          className="bg-gray-55/30 rounded-2xl border-2 border-dashed border-gray-200 p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-all min-h-[230px]"
        >
          <div className="w-14 h-14 bg-white rounded-full border border-gray-200 shadow-sm flex items-center justify-center mb-4">
            <Plus className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-[#0D1117] mb-1">Add Another Vehicle</h3>
          <p className="text-sm text-gray-500 max-w-[200px]">Keep all your vehicles registered for faster assistance.</p>
        </div>

      </div>

      {/* Velix Trust Banner */}
      <div className="mt-auto pt-12">
        <div className="bg-[#0D1117] rounded-2xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-[#FFB800]" />
            </div>
            <div>
              <h4 className="text-white font-bold">Secure Data Storage</h4>
              <p className="text-sm text-gray-400 mt-0.5">Your vehicle details are safely encrypted and stored.</p>
            </div>
          </div>
          <Zap className="w-6 h-6 text-gray-650 hidden md:block" />
        </div>
      </div>

    </div>
  );
};

export default MyVehicles;