import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle,
  KeyRound,
  Sparkles
} from 'lucide-react';
import { UserAccount } from '../types';
import { apiLogin, apiRegister } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserAccount) => void;
  currentUser: UserAccount | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  currentUser
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('aakash.verma@example.com');
  const [password, setPassword] = useState('••••••••');
  const [name, setName] = useState('Aakash Verma');
  const [location, setLocation] = useState('Indiranagar, Bengaluru');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const demoAccounts: UserAccount[] = [
    {
      id: 'usr-101',
      name: 'Aakash Verma',
      email: 'aakash.verma@example.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      role: 'renter',
      location: 'Indiranagar, Bengaluru',
      verified: true,
      rating: 4.96,
      phone: '+91 98450 12345',
      bio: 'Commercial filmmaker and lens enthusiast. Active circular renter and gear protector.',
      walletBalance: 8450,
      depositLocked: 6000,
      completedRentals: 18,
      successfulSales: 7,
      repairCount: 3,
      earnings: 42800
    },
    {
      id: 'usr-102',
      name: 'Sneha Rao',
      email: 'sneha.rao@techfix.in',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
      role: 'repair_specialist',
      location: 'Koramangala, Bengaluru',
      verified: true,
      rating: 4.98,
      phone: '+91 98860 99887',
      bio: 'Certified electronics diagnostics technician. Specializes in optics, gimbal calibrating and battery restoration.',
      walletBalance: 14200,
      depositLocked: 2500,
      completedRentals: 26,
      successfulSales: 12,
      repairCount: 48,
      earnings: 98500
    },
    {
      id: 'usr-103',
      name: 'Vikram Seth',
      email: 'vikram.seth@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      role: 'owner',
      location: 'HSR Layout, Bengaluru',
      verified: true,
      rating: 4.88,
      phone: '+91 99001 54321',
      bio: 'Maker and DIY enthusiast. Renting power tools and 3D printing equipment.',
      walletBalance: 3200,
      depositLocked: 0,
      completedRentals: 6,
      successfulSales: 2,
      repairCount: 1,
      earnings: 12400
    }
  ];

  const [authError, setAuthError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);

    try {
      if (isSignUp) {
        const { user } = await apiRegister({
          name: name || 'New ReLoop User',
          email,
          password,
          phone: '+91 98765 00000',
          role: 'renter',
          location: location || 'Bengaluru'
        });
        setIsLoading(false);
        onLogin(user);
        onClose();
      } else {
        const { user } = await apiLogin(email, password);
        setIsLoading(false);
        onLogin(user);
        onClose();
      }
    } catch (err: any) {
      setIsLoading(false);
      setAuthError(err.message || 'Authentication failed. Please check credentials.');
    }
  };

  const handleSelectDemo = async (user: UserAccount) => {
    setIsLoading(true);
    try {
      // Login with standard password123 for demo user
      const { user: authedUser } = await apiLogin(user.email, 'password123');
      setIsLoading(false);
      onLogin(authedUser);
      onClose();
    } catch {
      setIsLoading(false);
      onLogin(user);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-[#233D4D]/20 my-8">
        
        {/* Modal Header */}
        <div className="bg-[#233D4D] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-[#FE7F2D] text-[#000000] flex items-center justify-center font-display font-black text-sm">
              R
            </div>
            <div>
              <h3 className="font-display font-extrabold text-base">
                {isSignUp ? 'Join ReLoop Community' : 'Sign in to ReLoop'}
              </h3>
              <p className="text-[10px] text-[#EAECF0]/80">Rent • Repair • Resell with Escrow Trust</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {/* Fast Switch Tabs */}
          <div className="flex bg-[#EAECF0] p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                !isSignUp ? 'bg-white text-[#000000] shadow-xs' : 'text-[#233D4D] hover:text-[#000000]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                isSignUp ? 'bg-white text-[#000000] shadow-xs' : 'text-[#233D4D] hover:text-[#000000]'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Quick Demo Switcher */}
          <div className="bg-[#EAECF0]/60 p-3.5 rounded-2xl border border-[#233D4D]/10 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-extrabold text-[#233D4D]">
              <span className="flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-[#FE7F2D]" />
                <span>One-Click Demo Personas</span>
              </span>
              <span className="text-[10px] text-gray-500 font-normal">Click to test instant login</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleSelectDemo(acc)}
                  className="bg-white hover:bg-[#FE7F2D]/15 hover:border-[#FE7F2D] p-2 rounded-xl border border-gray-200 text-left transition-all group flex flex-col items-center text-center"
                >
                  <img
                    src={acc.avatar}
                    alt={acc.name}
                    className="w-8 h-8 rounded-full object-cover mb-1 border border-[#FE7F2D]"
                  />
                  <span className="text-[11px] font-bold text-[#000000] truncate w-full group-hover:text-[#FE7F2D]">
                    {acc.name.split(' ')[0]}
                  </span>
                  <span className="text-[9px] text-gray-500 truncate w-full">
                    ★ {acc.rating}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-bold">
                {authError}
              </div>
            )}
            {isSignUp && (
              <>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#233D4D] mb-1">
                    Full Legal Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Aakash Verma"
                      className="w-full bg-[#EAECF0] border border-[#233D4D]/15 rounded-xl pl-10 pr-3.5 py-2.5 text-xs font-bold text-[#000000] focus:ring-2 focus:ring-[#FE7F2D] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#233D4D] mb-1">
                    City / Neighborhood
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Indiranagar, Bengaluru"
                    className="w-full bg-[#EAECF0] border border-[#233D4D]/15 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#000000] focus:ring-2 focus:ring-[#FE7F2D] outline-none"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#233D4D] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@domain.com"
                  className="w-full bg-[#EAECF0] border border-[#233D4D]/15 rounded-xl pl-10 pr-3.5 py-2.5 text-xs font-bold text-[#000000] focus:ring-2 focus:ring-[#FE7F2D] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#233D4D] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#EAECF0] border border-[#233D4D]/15 rounded-xl pl-10 pr-3.5 py-2.5 text-xs font-bold text-[#000000] focus:ring-2 focus:ring-[#FE7F2D] outline-none"
                />
              </div>
            </div>

            {/* Security note */}
            <div className="flex items-center space-x-2 text-[10px] text-gray-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Protected by ReLoop 256-bit encrypted escrow authentication</span>
            </div>

            {/* Submit Button */}
            <button
              id="btn-auth-submit"
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#FE7F2D] hover:bg-[#FE7F2D]/90 text-[#000000] font-display font-black py-3 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-xs active:scale-98"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>{isSignUp ? 'Create Verified Account' : 'Sign In to Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
