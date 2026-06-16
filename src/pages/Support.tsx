import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Bot, Send, PhoneCall, 
  ShieldQuestion, ChevronRight, User
} from 'lucide-react';

interface Message {
  id: number;
  text: string | React.ReactNode;
  sender: 'user' | 'ai';
  time: string;
}

export const Support: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useApp();

  const initialMessages: Message[] = [
    {
      id: 1,
      text: `Hi ${user.name.split(' ')[0]}! I am Velix AI, your intelligent roadside diagnosis helper. What seems to be the issue with your vehicle today?`,
      sender: 'ai',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ];

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    const newUserMsg: Message = {
      id: Date.now(),
      text: userText,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);

    const query = userText.toLowerCase();

    // AI diagnosis simulation logic based on query keywords
    setTimeout(() => {
      let diagnosisTitle = '';
      let symptoms: string[] = [];
      let warning = '';
      let recommendedService = '';

      if (query.includes('battery') || query.includes('jump') || query.includes('start') || query.includes('dead')) {
        diagnosisTitle = 'Discharged / Dead Battery';
        symptoms = [
          'Dashboard lights flicker or are extremely dim.',
          'Starter motor clicks but the engine refuses to crank.',
          'Engine attempts to spin very slowly, then stops.'
        ];
        warning = '⚠️ Precaution: Do not repeat cranking, it will completely drain the remaining battery cells. Keep hazard flashers on.';
        recommendedService = 'battery';
      } else if (query.includes('tyre') || query.includes('puncture') || query.includes('flat') || query.includes('leak')) {
        diagnosisTitle = 'Puncture / Flat Tyre';
        symptoms = [
          'Steering wheel pulling strongly to one side.',
          'Rhythmic slapping or flapping noise at low speed.',
          'Low tyre pressure warning light active on console.'
        ];
        warning = '⚠️ Precaution: Engage the handbrake. Pull off to a flat concrete surface. Do NOT attempt to swap tyres on dirt or slopes.';
        recommendedService = 'tyre';
      } else if (query.includes('fuel') || query.includes('petrol') || query.includes('diesel') || query.includes('empty')) {
        diagnosisTitle = 'Engine Fuel Starvation';
        symptoms = [
          'Engine sputters or cuts out completely under acceleration.',
          'Fuel reserve warning indicator is illuminated.',
          'Engine cranks continuously but does not fire up.'
        ];
        warning = '⚠️ Precaution: Pull over safely to the shoulder of the highway. Switch on hazard lights.';
        recommendedService = 'fuel';
      } else if (query.includes('smoke') || query.includes('overheat') || query.includes('hot') || query.includes('radiator')) {
        diagnosisTitle = 'Engine Overheating';
        symptoms = [
          'Temperature gauge pointing near or in the Red zone.',
          'White steam rising from under the engine bonnet.',
          'Sweet coolant smell or liquid leaking under the car.'
        ];
        warning = '❌ Danger: Turn off the engine immediately. Do NOT open the radiator cap while the engine is hot. Doing so will release boiling steam!';
        recommendedService = 'towing';
      } else {
        diagnosisTitle = 'General Mechanical Breakdown';
        symptoms = [
          'Check Engine light is active or warning symbols are displayed.',
          'Unusual knocking, ticking, or squealing noises from engine bay.',
          'Gears failing to engage or loss of steering response.'
        ];
        warning = '⚠️ Precaution: Activate hazard warning flashers and stand behind the highway barrier safety line.';
        recommendedService = 'breakdown';
      }

      const aiResponseText = (
        <div className="space-y-3">
          <p className="font-bold text-[#0D1117] text-sm">Based on your description, here is our AI Diagnosis:</p>
          <div className="bg-gray-50 border border-gray-150 p-3 rounded-xl">
            <h4 className="font-extrabold text-xs text-[#0D1117] mb-1">{diagnosisTitle}</h4>
            <ul className="space-y-1.5 list-disc list-inside text-[11px] text-gray-600">
              {symptoms.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
          <div className="bg-red-50 p-3 rounded-xl border border-red-100 text-red-700 text-xs font-semibold">
            {warning}
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-[10px] text-gray-400 font-bold">Need assistance?</span>
            <button 
              onClick={() => navigate(`/services?category=${recommendedService}`)}
              className="bg-[#FFB800] text-[#0D1117] px-3.5 py-1.5 rounded-lg text-xs font-extrabold hover:bg-yellow-400 transition-colors"
            >
              Dispatch Helper
            </button>
          </div>
        </div>
      );

      const newAiMsg: Message = {
        id: Date.now() + 1,
        text: aiResponseText,
        sender: 'ai',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, newAiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="p-8 h-full flex flex-col w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0D1117]">Support & AI Help</h1>
        <p className="text-gray-500 text-sm mt-1">Get instant diagnosis or connect with our support team</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        
        {/* Left Column: Help Topics & Contact (35%) */}
        <div className="w-full lg:w-[35%] flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar shrink-0">
          
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-[#0D1117] mb-4 flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-[#FFB800]" />
              Emergency Contact
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Need urgent human assistance? Our emergency team is available 24/7.
            </p>
            <a 
              href={`tel:${user.phone}`}
              className="w-full bg-[#0D1117] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors text-center text-sm"
            >
              <PhoneCall className="w-4 h-4" />
              Call Support Now
            </a>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-[#0D1117] flex items-center gap-2">
                <ShieldQuestion className="w-5 h-5 text-gray-500" />
                Frequently Asked Questions
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {[
                'How to claim Velix Plus benefits?', 
                'Payment failed but money deducted', 
                'How to cancel a mechanic request?', 
                'Is towing available at night?'
              ].map((q, i) => (
                <button 
                  key={i} 
                  onClick={() => alert(`Topic: "${q}". Search our FAQs help center or query our AI helper.`)}
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="text-sm font-medium text-gray-700">{q}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: AI Diagnosis Chat (65%) */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden min-h-[400px]">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-[#0D1117] text-white shrink-0">
            <div className="w-10 h-10 rounded-full bg-[#FFB800] flex items-center justify-center">
              <Bot className="w-6 h-6 text-[#0D1117]" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Velix AI Engine</h3>
              <p className="text-[10px] text-gray-400">Smart Vehicle Diagnosis</p>
            </div>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50 custom-scrollbar">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-gray-200' : 'bg-[#FFB800]'}`}>
                  {msg.sender === 'user' ? <User className="w-5 h-5 text-gray-600" /> : <Bot className="w-5 h-5 text-[#0D1117]" />}
                </div>
                <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-4 rounded-2xl shadow-sm ${msg.sender === 'user' ? 'bg-[#0D1117] text-white rounded-tr-sm text-xs font-semibold' : 'bg-white border border-gray-100 rounded-tl-sm text-gray-800 text-xs'}`}>
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-gray-400 mt-1 font-semibold">{msg.time}</span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-[#FFB800] flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-[#0D1117]" />
                </div>
                <div className="p-4 rounded-2xl bg-white border border-gray-100 rounded-tl-sm shadow-sm flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input Area */}
          <div className="p-4 border-t border-gray-100 bg-white shrink-0">
            <form onSubmit={handleSendMessage} className="relative flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Describe your vehicle issue (e.g., My battery is dead...)"
                className="w-full pl-4 pr-14 py-4 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#FFB800] focus:ring-1 focus:ring-[#FFB800] transition-all"
              />
              <button 
                type="submit" 
                disabled={!inputValue.trim()}
                className="absolute right-2 w-10 h-10 bg-[#FFB800] text-[#0D1117] rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-400 transition-colors"
              >
                <Send className="w-5 h-5 ml-1" />
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Support;