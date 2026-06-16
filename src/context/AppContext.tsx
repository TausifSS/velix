import React, { createContext, useContext, useState, useEffect } from 'react';

// Interfaces
export interface Vehicle {
  id: number;
  type: string;
  brand: string;
  model: string;
  number: string;
  isDefault: boolean;
  fuel: string;
  color: string;
}

export interface Booking {
  id: string;
  mechanicName: string;
  service: string;
  date: string;
  time: string;
  price: string;
  status: 'requested' | 'accepted' | 'onWay' | 'arrived' | 'completed' | 'cancelled';
  vehicle: string;
  eta: string;
  distance: string;
  otp: string;
  visitCharge: string;
  serviceChargeEst: string;
  timeline: {
    requested: string;
    accepted?: string;
    onWay?: string;
    arrived?: string;
    completed?: string;
  };
}

export interface User {
  name: string;
  phone: string;
  email: string;
  walletBalance: number;
  velixPlus: {
    active: boolean;
    expiry?: string;
  };
  emergencyContacts: { name: string; phone: string }[];
}

export interface Message {
  id: number;
  text: string | React.ReactNode;
  sender: 'user' | 'mechanic' | 'ai';
  time: string;
}

export interface ChatHistory {
  [mechanicName: string]: Message[];
}

interface AppContextType {
  user: User;
  vehicles: Vehicle[];
  bookings: Booking[];
  currentBooking: Booking | null;
  chatHistory: ChatHistory;
  activeChatMechanic: string | null;
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'isDefault'>) => void;
  setDefaultVehicle: (id: number) => void;
  deleteVehicle: (id: number) => void;
  requestMechanic: (mechanic: any, serviceName: string) => void;
  cancelBooking: () => void;
  startServiceSimulation: () => void;
  completeBooking: (tipAmount?: number) => void;
  addMoneyToWallet: (amount: number) => void;
  upgradeToVelixPlus: () => void;
  addEmergencyContact: (name: string, phone: string) => void;
  removeEmergencyContact: (phone: string) => void;
  setActiveChatMechanic: (name: string | null) => void;
  sendMessageToMechanic: (mechanicName: string, text: string) => void;
  isSOSModalActive: boolean;
  setSOSModalActive: (active: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. User State
  const [user, setUser] = useState<User>({
    name: 'Tausif Khan',
    phone: '+91 98765 43210',
    email: 'tausif@velixapp.in',
    walletBalance: 1250,
    velixPlus: {
      active: true,
      expiry: '12 May, 2027',
    },
    emergencyContacts: [
      { name: 'Dad', phone: '+91 98111 22222' },
      { name: 'Brother', phone: '+91 98333 44444' },
    ],
  });

  // 2. Vehicles State
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: 1,
      type: 'Car',
      brand: 'Maruti Suzuki',
      model: 'WagonR',
      number: 'MH 12 AB 1234',
      isDefault: true,
      fuel: 'CNG',
      color: 'White',
    },
    {
      id: 2,
      type: 'Bike',
      brand: 'Royal Enfield',
      model: 'Classic 350',
      number: 'MH 14 XY 9876',
      isDefault: false,
      fuel: 'Petrol',
      color: 'Black',
    },
  ]);

  // 3. Bookings History
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: '#VLX123456',
      mechanicName: 'A1 Car Care',
      service: 'Breakdown Assistance',
      date: '12 May, 2026',
      time: '10:30 AM',
      price: '₹249',
      status: 'completed',
      vehicle: 'White WagonR (MH12 AB 1234)',
      eta: '6 mins',
      distance: '2.4 km',
      otp: '4812',
      visitCharge: '₹199',
      serviceChargeEst: '₹300 - ₹800',
      timeline: { requested: '10:24 AM', accepted: '10:25 AM', onWay: '10:28 AM', arrived: '10:35 AM', completed: '10:50 AM' },
    },
    {
      id: '#VLX123457',
      mechanicName: 'Speedy Rescue',
      service: 'Towing',
      date: '02 May, 2026',
      time: '08:15 PM',
      price: '₹699',
      status: 'completed',
      vehicle: 'Black Honda City (MH02 CD 5678)',
      eta: '8 mins',
      distance: '3.1 km',
      otp: '9921',
      visitCharge: '₹249',
      serviceChargeEst: '₹1200 - ₹2500',
      timeline: { requested: '08:10 PM', accepted: '08:12 PM', onWay: '08:15 PM', arrived: '08:22 PM', completed: '08:45 PM' },
    },
    {
      id: '#VLX123459',
      mechanicName: 'Auto Heroes',
      service: 'Flat Tyre',
      date: '10 Apr, 2026',
      time: '02:20 PM',
      price: '₹150',
      status: 'cancelled',
      vehicle: 'White WagonR (MH12 AB 1234)',
      eta: '4 mins',
      distance: '1.2 km',
      otp: '3152',
      visitCharge: '₹99',
      serviceChargeEst: '₹150 - ₹300',
      timeline: { requested: '02:18 PM' },
    },
  ]);

  // 4. Current Active Booking
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);

  // 5. Chat History
  const [chatHistory, setChatHistory] = useState<ChatHistory>({
    'A1 Car Care': [
      { id: 1, text: 'Hello, I have accepted your request. I am packing my tools and heading your way.', sender: 'mechanic', time: '10:26 AM' },
      { id: 2, text: 'Awesome, thanks! Please bring a CNG scanner if you have one.', sender: 'user', time: '10:27 AM' },
      { id: 3, text: 'Sure, I will bring my diagnostic kit. Be there in 5-6 mins.', sender: 'mechanic', time: '10:27 AM' },
    ],
    'Speedy Rescue': [
      { id: 1, text: 'Towing truck is dispatched.', sender: 'mechanic', time: '08:16 PM' },
    ],
  });

  const [activeChatMechanic, setActiveChatMechanic] = useState<string | null>(null);

  // 6. SOS Modal State
  const [isSOSModalActive, setSOSModalActive] = useState<boolean>(false);

  // Simulation effect for active booking
  useEffect(() => {
    if (!currentBooking) return;

    let timer: any;

    const formatTime = () => {
      return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (currentBooking.status === 'requested') {
      timer = setTimeout(() => {
        setCurrentBooking((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            status: 'accepted',
            timeline: { ...prev.timeline, accepted: formatTime() },
          };
        });
      }, 6000); // 6s to accept
    } else if (currentBooking.status === 'accepted') {
      timer = setTimeout(() => {
        setCurrentBooking((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            status: 'onWay',
            timeline: { ...prev.timeline, onWay: formatTime() },
          };
        });
      }, 6000); // 6s to start heading
    } else if (currentBooking.status === 'onWay') {
      // Simulate moving closer
      timer = setTimeout(() => {
        setCurrentBooking((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            status: 'arrived',
            eta: '0 mins',
            distance: '10m',
            timeline: { ...prev.timeline, arrived: formatTime() },
          };
        });
      }, 15000); // 15s transit
    }

    return () => clearTimeout(timer);
  }, [currentBooking?.status]);

  // Actions
  const addVehicle = (newVeh: Omit<Vehicle, 'id' | 'isDefault'>) => {
    setVehicles((prev) => {
      const nextId = prev.length > 0 ? Math.max(...prev.map((v) => v.id)) + 1 : 1;
      const isFirst = prev.length === 0;
      return [
        ...prev,
        {
          ...newVeh,
          id: nextId,
          isDefault: isFirst,
        },
      ];
    });
  };

  const setDefaultVehicle = (id: number) => {
    setVehicles((prev) =>
      prev.map((v) => ({
        ...v,
        isDefault: v.id === id,
      }))
    );
  };

  const deleteVehicle = (id: number) => {
    setVehicles((prev) => {
      const filtered = prev.filter((v) => v.id !== id);
      // Ensure there is still a default if we deleted the default one
      if (filtered.length > 0 && !filtered.some((v) => v.isDefault)) {
        filtered[0].isDefault = true;
      }
      return filtered;
    });
  };

  const requestMechanic = (mechanic: any, serviceName: string) => {
    const defaultVehicle = vehicles.find((v) => v.isDefault) || vehicles[0];
    const vehicleStr = defaultVehicle 
      ? `${defaultVehicle.color} ${defaultVehicle.brand} ${defaultVehicle.model} (${defaultVehicle.number})`
      : 'Registered Vehicle';

    const formatTime = () => {
      return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const newBooking: Booking = {
      id: `#VLX${Math.floor(100000 + Math.random() * 900000)}`,
      mechanicName: mechanic.name || 'Professional Mechanic',
      service: serviceName,
      date: new Date().toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' }),
      time: formatTime(),
      price: mechanic.visitCharge || '₹199',
      status: 'requested',
      vehicle: vehicleStr,
      eta: mechanic.eta || '8 mins',
      distance: mechanic.distance || '3.0 km',
      otp: Math.floor(1000 + Math.random() * 9000).toString(),
      visitCharge: mechanic.visitCharge || '₹199',
      serviceChargeEst: '₹300 - ₹800',
      timeline: {
        requested: formatTime(),
      },
    };

    setCurrentBooking(newBooking);
  };

  const cancelBooking = () => {
    if (!currentBooking) return;
    const cancelled: Booking = {
      ...currentBooking,
      status: 'cancelled',
    };
    setBookings((prev) => [cancelled, ...prev]);
    setCurrentBooking(null);
  };

  const startServiceSimulation = () => {
    // When driver starts the active service after mechanic arrives
    // Just mock progress it straight to completed soon
  };

  const completeBooking = (tipAmount: number = 0) => {
    if (!currentBooking) return;
    
    // Calculate final price
    const basePrice = parseInt(currentBooking.price.replace(/\D/g, '')) || 199;
    const estService = 450; // mock service charge
    const total = basePrice + estService + tipAmount;

    const completed: Booking = {
      ...currentBooking,
      status: 'completed',
      price: `₹${total}`,
      timeline: {
        ...currentBooking.timeline,
        completed: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    };

    // Deduct from wallet if user has balance, otherwise mock online payment
    setUser((prev) => {
      if (prev.walletBalance >= total) {
        return { ...prev, walletBalance: prev.walletBalance - total };
      }
      return prev;
    });

    setBookings((prev) => [completed, ...prev]);
    setCurrentBooking(null);
  };

  const addMoneyToWallet = (amount: number) => {
    setUser((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance + amount,
    }));
  };

  const upgradeToVelixPlus = () => {
    setUser((prev) => ({
      ...prev,
      velixPlus: {
        active: true,
        expiry: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' }),
      },
    }));
  };

  const addEmergencyContact = (name: string, phone: string) => {
    setUser((prev) => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, { name, phone }],
    }));
  };

  const removeEmergencyContact = (phone: string) => {
    setUser((prev) => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter((c) => c.phone !== phone),
    }));
  };

  const sendMessageToMechanic = (mechanicName: string, text: string) => {
    const formatTime = () => {
      return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const newMsg: Message = {
      id: Date.now(),
      text,
      sender: 'user',
      time: formatTime(),
    };

    setChatHistory((prev) => {
      const currentChat = prev[mechanicName] || [];
      return {
        ...prev,
        [mechanicName]: [...currentChat, newMsg],
      };
    });

    // Simulate reply from mechanic
    setTimeout(() => {
      const mechanicReplies = [
        "Yes, I'm on my way. Traffic is a bit slow.",
        "Got it, will carry the requested tools.",
        "I have arrived at your location. Please turn on hazard lights if possible.",
        "Okay, I am checking the issue now.",
      ];
      const randomReply = mechanicReplies[Math.floor(Math.random() * mechanicReplies.length)];

      const replyMsg: Message = {
        id: Date.now() + 1,
        text: randomReply,
        sender: 'mechanic',
        time: formatTime(),
      };

      setChatHistory((prev) => {
        const currentChat = prev[mechanicName] || [];
        return {
          ...prev,
          [mechanicName]: [...currentChat, replyMsg],
        };
      });
    }, 3000);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        vehicles,
        bookings,
        currentBooking,
        chatHistory,
        activeChatMechanic,
        addVehicle,
        setDefaultVehicle,
        deleteVehicle,
        requestMechanic,
        cancelBooking,
        startServiceSimulation,
        completeBooking,
        addMoneyToWallet,
        upgradeToVelixPlus,
        addEmergencyContact,
        removeEmergencyContact,
        setActiveChatMechanic,
        sendMessageToMechanic,
        isSOSModalActive,
        setSOSModalActive,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
