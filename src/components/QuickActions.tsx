import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Wrench, Droplet, Target, MoreHorizontal, Truck, Zap 
} from 'lucide-react';

const servicesList = [
  { 
    id: 'breakdown',
    name: 'Breakdown', 
    desc: 'Get help for vehicle issue', 
    icon: Wrench, 
    iconColor: 'text-[#F97316]', // Orange
    bgColor: 'bg-orange-50' 
  },
  { 
    id: 'towing',
    name: 'Towing', 
    desc: 'Tow your vehicle safely', 
    icon: Truck, 
    iconColor: 'text-[#F97316]', // Orange
    bgColor: 'bg-orange-50' 
  },
  { 
    id: 'battery',
    name: 'Battery Jumpstart', 
    desc: "We'll boost your battery", 
    icon: Zap, 
    iconColor: 'text-gray-700', // Dark
    bgColor: 'bg-gray-100' 
  },
  { 
    id: 'fuel',
    name: 'Fuel Delivery', 
    desc: 'Fuel at your location', 
    icon: Droplet, 
    iconColor: 'text-[#F59E0B]', // Yellow/Amber
    bgColor: 'bg-amber-50' 
  },
  { 
    id: 'tyre',
    name: 'Flat Tyre', 
    desc: 'Quick tyre assistance', 
    icon: Target, 
    iconColor: 'text-gray-700', // Dark
    bgColor: 'bg-gray-100' 
  },
  { 
    id: 'more',
    name: 'More Services', 
    desc: 'View all services', 
    icon: MoreHorizontal, 
    iconColor: 'text-gray-500', // Gray
    bgColor: 'bg-gray-100' 
  },
];

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const handleServiceClick = (serviceId: string) => {
    if (serviceId === 'more') {
      navigate('/services');
    } else {
      navigate(`/services?category=${serviceId}`);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-[#0D1117] mb-4">How can we help you today?</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {servicesList.map((service, idx) => (
          <div 
            key={idx} 
            onClick={() => handleServiceClick(service.id)}
            className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all cursor-pointer flex flex-col items-start gap-4 active:scale-95"
          >
            {/* Service Icon inside a colored rounded box */}
            <div className={`p-3 rounded-xl ${service.bgColor}`}>
              <service.icon className={`w-6 h-6 ${service.iconColor}`} />
            </div>
            
            {/* Service Name and Description */}
            <div>
              <h3 className="font-bold text-[13px] text-[#0D1117] leading-tight mb-1">{service.name}</h3>
              <p className="text-[11px] text-gray-500 leading-tight">{service.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;