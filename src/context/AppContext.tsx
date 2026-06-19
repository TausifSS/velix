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
  
  // Role-Based extensions
  currentUserRole: 'user' | 'mechanic' | 'business' | 'admin';
  setCurrentUserRole: (role: 'user' | 'mechanic' | 'business' | 'admin') => void;
  mechanicFleet: any[];
  userReports: any[];
  submitMechanicKyc: (details: any) => void;
  verifyMechanicPartner: (id: string, status: 'approved' | 'rejected') => void;
  toggleMechanicOnline: (id: string) => void;
  addReport: (bookingId: string, issue: string) => void;
  updateUser: (data: Partial<User>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. User State
  const [user, setUser] = useState<User>({
    name: '',
    phone: '',
    email: '',
    walletBalance: 0,
    velixPlus: {
      active: false,
    },
    emergencyContacts: [],
  });

  // 2. Vehicles State
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  // 3. Bookings History
  const [bookings, setBookings] = useState<Booking[]>([]);

  // 4. Current Active Booking
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);

  // 5. Chat History
  const [chatHistory, setChatHistory] = useState<ChatHistory>({});

  const [activeChatMechanic, setActiveChatMechanic] = useState<string | null>(null);

  // 6. SOS Modal State
  const [isSOSModalActive, setSOSModalActive] = useState<boolean>(false);

  // 7. Role-Based States
  const [currentUserRole, setCurrentUserRole] = useState<'user' | 'mechanic' | 'business' | 'admin'>('user');
  const [mechanicFleet, setMechanicFleet] = useState<any[]>([]);
  const [userReports, setUserReports] = useState<any[]>([]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const submitMechanicKyc = (details: any) => {
    setMechanicFleet((prev) => {
      const exists = prev.some((m) => m.id === details.id || m.phone === details.phone);
      if (exists) {
        return prev.map((m) =>
          m.id === details.id || m.phone === details.phone
            ? { ...m, ...details, status: 'pending', verified: false }
            : m
        );
      } else {
        const newMech = {
          id: details.id || `M${Date.now()}`,
          name: details.name || 'New Garage Partner',
          rating: 5.0,
          reviews: 0,
          distance: '1.5 km',
          eta: '5 mins',
          visitCharge: '₹149',
          verified: false,
          services: details.services || ['Breakdown'],
          status: 'pending',
          kyc: {
            aadhaar: details.aadhaar || '',
            pan: details.pan || '',
            videoUrl: details.videoUrl || 'simulated_video.mp4',
          },
          phone: details.phone || '',
          online: false,
        };
        return [...prev, newMech];
      }
    });
  };

  const verifyMechanicPartner = (id: string, status: 'approved' | 'rejected') => {
    setMechanicFleet((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status, verified: status === 'approved' }
          : m
      )
    );
  };

  const toggleMechanicOnline = (id: string) => {
    setMechanicFleet((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, online: !m.online } : m
      )
    );
  };

  const addReport = (bookingId: string, issue: string) => {
    const booking = bookings.find((b) => b.id === bookingId) || currentBooking;
    const newReport = {
      id: `R${Date.now()}`,
      userName: user.name,
      bookingId: bookingId,
      mechanicName: booking ? booking.mechanicName : 'Unknown Mechanic',
      issue,
      status: 'pending',
      date: new Date().toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' }),
    };
    setUserReports((prev) => [newReport, ...prev]);
  };

  const updateUser = (data: Partial<User>) => {
    setUser((prev) => ({
      ...prev,
      ...data,
    }));
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
        currentUserRole,
        setCurrentUserRole,
        mechanicFleet,
        userReports,
        submitMechanicKyc,
        verifyMechanicPartner,
        toggleMechanicOnline,
        addReport,
        updateUser,
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
