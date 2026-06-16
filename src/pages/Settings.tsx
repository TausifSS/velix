import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, ShieldAlert, Plus, Trash2, CheckCircle, Save } from 'lucide-react';

export const Settings: React.FC = () => {
  const { user, addEmergencyContact, removeEmergencyContact } = useApp();

  const [contactName, setContactName] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  
  const [profileName, setProfileName] = useState<string>(user.name);
  const [profileEmail, setProfileEmail] = useState<string>(user.email);
  const [profilePhone, setProfilePhone] = useState<string>(user.phone);

  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactName.trim() && contactPhone.trim()) {
      addEmergencyContact(contactName, contactPhone);
      setContactName('');
      setContactPhone('');
    }
  };

  return (
    <div className="p-8 w-full space-y-8 overflow-y-auto h-full custom-scrollbar">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0D1117]">Settings & Profile</h1>
        <p className="text-gray-500 text-sm mt-1">Configure your personal profile details and SOS family notification contacts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns: Profile Info form */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 lg:col-span-2 space-y-6 shadow-sm">
          <h3 className="font-extrabold text-base text-[#0D1117] flex items-center gap-2">
            <User className="w-5 h-5 text-gray-500" /> Account Information
          </h3>

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FFB800]"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FFB800]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Email Address</label>
              <input 
                type="email" 
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FFB800]"
                required
              />
            </div>

            <div className="pt-2 flex justify-between items-center">
              {isSaved ? (
                <span className="text-xs text-green-600 font-bold flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> Profile updated successfully!
                </span>
              ) : (
                <div></div>
              )}
              <button 
                type="submit"
                className="bg-[#0D1117] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors shadow-sm flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Profile Details
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Family Contacts configuration */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-6 shadow-sm h-max">
          <div>
            <h3 className="font-extrabold text-base text-[#0D1117] flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#FFB800]" /> SOS Emergency Contacts
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Registered contacts will automatically receive SMS alerts with your live location coordinates during an SOS broadcast.
            </p>
          </div>

          {/* List contacts */}
          <div className="space-y-3.5 border-t border-gray-150 pt-4">
            {user.emergencyContacts.map((contact, idx) => (
              <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div>
                  <h4 className="font-bold text-xs text-[#0D1117]">{contact.name}</h4>
                  <p className="text-[10px] text-gray-500 font-medium">{contact.phone}</p>
                </div>
                <button 
                  onClick={() => removeEmergencyContact(contact.phone)}
                  className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {user.emergencyContacts.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">No emergency contacts listed yet.</p>
            )}
          </div>

          {/* Add form */}
          <form onSubmit={handleAddContact} className="space-y-3 pt-4 border-t border-gray-150">
            <p className="text-xs font-bold text-gray-800 uppercase tracking-wide">Register Contact</p>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Name" 
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-1/2 p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#FFB800]"
                required
              />
              <input 
                type="tel" 
                placeholder="Mobile (+91)" 
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-1/2 p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#FFB800]"
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-gray-100 hover:bg-[#FFF9E5] text-gray-700 hover:text-[#FFB800] py-2.5 rounded-xl text-xs font-bold border border-gray-150 transition-colors flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Save Contact
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};

export default Settings;
