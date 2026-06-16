import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Send, Check, ShieldCheck } from 'lucide-react';

export const Messages: React.FC = () => {
  const { chatHistory, sendMessageToMechanic } = useApp();
  
  // Available chat threads
  const mechanics = Object.keys(chatHistory);
  const [activeThread, setActiveThread] = useState<string>(mechanics[0] || 'A1 Car Care');
  const [inputText, setInputText] = useState<string>('');

  const activeMessages = chatHistory[activeThread] || [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendMessageToMechanic(activeThread, inputText);
    setInputText('');
  };

  return (
    <div className="p-8 w-full h-full flex flex-col space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0D1117]">Messages & Chat</h1>
        <p className="text-gray-500 text-sm mt-1">Communicate directly with your dispatched roadside mechanics.</p>
      </div>

      <div className="flex bg-white rounded-3xl border border-gray-200 overflow-hidden flex-1 shadow-sm min-h-[450px]">
        
        {/* Left Side: Threads list */}
        <div className="w-[30%] border-r border-gray-150 flex flex-col">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wider">Mechanic Dialogues</h3>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100 custom-scrollbar">
            {mechanics.map((name) => {
              const active = activeThread === name;
              const lastMsg = chatHistory[name]?.[chatHistory[name].length - 1];

              return (
                <div 
                  key={name}
                  onClick={() => setActiveThread(name)}
                  className={`p-4 flex items-center gap-3 cursor-pointer transition-colors ${
                    active ? 'bg-[#FFF9E5]' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                    <img src={`https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=F5F6F8&color=0D1117`} alt={name} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-xs font-bold truncate ${active ? 'text-[#FFB800]' : 'text-gray-800'}`}>{name}</h4>
                    <p className="text-[10px] text-gray-500 truncate mt-0.5">{lastMsg ? lastMsg.text : 'Click to start chat'}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Dialogue Messages */}
        <div className="flex-1 flex flex-col bg-gray-50/20">
          
          {/* Active head */}
          <div className="p-4 border-b border-gray-100 bg-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
              <img src={`https://ui-avatars.com/api/?name=${activeThread.replace(' ', '+')}&background=F5F6F8&color=0D1117`} alt={activeThread} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0D1117] flex items-center gap-1">
                {activeThread}
                <ShieldCheck className="w-4 h-4 text-green-500" />
              </h4>
              <p className="text-[10px] text-green-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Online • Dispatched Partner
              </p>
            </div>
          </div>

          {/* Message History area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col custom-scrollbar bg-gray-50/30">
            {activeMessages.map((msg, idx) => {
              const isUser = msg.sender === 'user';
              return (
                <div 
                  key={idx} 
                  className={`max-w-[70%] flex flex-col ${
                    isUser ? 'ml-auto items-end' : 'items-start'
                  }`}
                >
                  <div className={`p-3.5 rounded-2xl text-xs shadow-sm ${
                    isUser 
                      ? 'bg-[#0D1117] text-white rounded-tr-sm' 
                      : 'bg-white border border-gray-150 text-gray-800 rounded-tl-sm'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-gray-400 mt-1 font-semibold flex items-center gap-1">
                    {msg.time} {isUser && <Check className="w-3 h-3 text-green-600" />}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Typing Form */}
          <form onSubmit={handleSend} className="p-4 border-t border-gray-100 bg-white flex gap-3 items-center">
            <input 
              type="text"
              placeholder="Send coordinates, vehicle color, landmarks or message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#FFB800] focus:ring-1 focus:ring-[#FFB800]"
            />
            <button 
              type="submit"
              disabled={!inputText.trim()}
              className="bg-[#FFB800] text-[#0D1117] w-10 h-10 rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-400 transition-colors shadow-sm shrink-0"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
};

export default Messages;
