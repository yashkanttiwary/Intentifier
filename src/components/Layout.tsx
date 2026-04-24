import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { Home, Target, Gift, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export function Layout() {
  const navigate = useNavigate();
  const clearApiKey = useAuthStore(s => s.clearApiKey);

  const handleLogout = () => {
    clearApiKey();
    navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f7f4] text-[#1a1a1a] font-sans overflow-hidden">
      {/* Top Banner/Header */}
      <header className="flex-none p-4 pb-0 flex items-center justify-between border-b border-black/10 pb-4 relative z-20">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tighter">
            Intentifier
          </h1>
          <span className="text-[10px] uppercase tracking-[0.2em] opacity-50">Activation Journey</span>
        </div>
        <button onClick={handleLogout} className="p-2 opacity-60 hover:opacity-100 hover:line-through transition-all text-[11px] uppercase tracking-widest font-semibold flex flex-col items-center gap-1" title="Log Out">
          <LogOut size={16} />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 p-4">
        <div className="max-w-md mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="flex-none fixed bottom-0 w-full bg-[#f8f7f4] border-t border-black/10 z-20">
        <div className="max-w-md mx-auto flex items-center justify-around p-3">
          <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center gap-1 opacity-50 hover:opacity-100 hover:line-through transition-all text-[10px] uppercase tracking-widest font-semibold">
            <Home size={20} />
            <span>Home</span>
          </button>
          <button onClick={() => navigate('/create-intent')} className="flex flex-col items-center gap-1 opacity-50 hover:opacity-100 hover:line-through transition-all text-[10px] uppercase tracking-widest font-semibold">
            <Target size={20} />
            <span>Intent</span>
          </button>
          <button className="flex flex-col items-center gap-1 opacity-30 hover:opacity-100 hover:line-through transition-all text-[10px] uppercase tracking-widest font-semibold">
            <Gift size={20} />
            <span>Rewards</span>
          </button>
          <button className="flex flex-col items-center gap-1 opacity-30 hover:opacity-100 hover:line-through transition-all text-[10px] uppercase tracking-widest font-semibold">
            <User size={20} />
            <span>Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
