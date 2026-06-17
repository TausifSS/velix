import { AppProvider } from './context/AppContext';
import { MobileApp } from './pages/MobileApp';

export const AppLayout = () => {
  return (
    <div className="h-screen w-full bg-[#0d0f14] flex items-center justify-center overflow-hidden font-sans select-none">
      {/* Centered simulated mobile viewport */}
      <MobileApp />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
}