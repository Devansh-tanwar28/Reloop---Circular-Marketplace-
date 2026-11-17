import React, { useState } from 'react';
import { 
  RefreshCw, 
  Search, 
  ShieldCheck, 
  Sparkles, 
  PlusCircle, 
  User, 
  Menu, 
  X, 
  LayoutDashboard, 
  Wrench, 
  Repeat, 
  ShoppingBag,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { NavigationPage, UserAccount } from '../types';

interface NavbarProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  currentUser: UserAccount;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onOpenCreateListing: () => void;
  onOpenRepairRequest: () => void;
  onSearchOpen?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  currentUser,
  onOpenAuth,
  onOpenCreateListing,
  onOpenRepairRequest,
  onSearchOpen
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [createDropdownOpen, setCreateDropdownOpen] = useState(false);

  const navItems: { id: NavigationPage; label: string; icon?: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'rent', label: 'Rent' },
    { id: 'repair', label: 'Repair' },
    { id: 'resell', label: 'Resell' },
    { id: 'trust-safety', label: 'Trust & Safety' },
    { id: 'ai-insights', label: 'AI Features', badge: 'Smart' },
    { id: 'how-it-works', label: 'How It Works' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#233D4D] text-white shadow-md transition-all border-b border-[#233D4D]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="w-10 h-10 rounded-xl bg-[#FE7F2D] flex items-center justify-center shadow-inner text-[#000000] font-black">
              <RefreshCw className="w-5 h-5 text-[#000000] animate-spin-slow" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="font-display font-extrabold text-2xl tracking-tight text-white">Re<span className="text-[#FE7F2D]">Loop</span></span>
                <span className="bg-[#FE7F2D]/20 text-[#FE7F2D] text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider border border-[#FE7F2D]/30">Circular</span>
              </div>
              <span className="text-[11px] text-[#EAECF0]/70 font-medium hidden sm:inline-block">Rent • Repair • Resell</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => onNavigate(item.id)}
                  className={`relative px-3.5 py-2 text-sm font-semibold rounded-lg transition-all flex items-center space-x-1.5 ${
                    isActive 
                      ? 'bg-[#FE7F2D] text-[#000000] shadow-sm font-bold' 
                      : 'text-[#EAECF0] hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider ${
                      isActive ? 'bg-[#000000] text-[#FE7F2D]' : 'bg-[#FE7F2D] text-[#000000]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools */}
          <div className="hidden md:flex items-center space-x-3">
            
            {/* Quick Action Button Dropdown */}
            <div className="relative">
              <button
                id="btn-create-action-dropdown"
                onClick={() => setCreateDropdownOpen(!createDropdownOpen)}
                className="bg-[#FE7F2D] hover:bg-[#FE7F2D]/90 text-[#000000] text-sm font-bold px-3.5 py-2 rounded-lg flex items-center space-x-1.5 transition-all shadow-sm active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>List / Request</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {createDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-white text-[#000000] rounded-xl shadow-xl border border-[#EAECF0] py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onClick={() => setCreateDropdownOpen(false)}
                >
                  <button
                    onClick={() => onNavigate('resell')}
                    className="w-full text-left px-4 py-2.5 hover:bg-[#EAECF0]/60 flex items-center space-x-2.5 text-xs font-semibold text-[#233D4D]"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#FE7F2D]" />
                    <div>
                      <div className="font-bold text-[#000000]">Resell an Item</div>
                      <div className="text-[11px] text-gray-500">Sell unused gadgets & gear</div>
                    </div>
                  </button>
                  <button
                    onClick={onOpenRepairRequest}
                    className="w-full text-left px-4 py-2.5 hover:bg-[#EAECF0]/60 flex items-center space-x-2.5 text-xs font-semibold text-[#233D4D]"
                  >
                    <Wrench className="w-4 h-4 text-[#233D4D]" />
                    <div>
                      <div className="font-bold text-[#000000]">Request Repair</div>
                      <div className="text-[11px] text-gray-500">Get quotes from certified pros</div>
                    </div>
                  </button>
                  <button
                    onClick={() => onNavigate('rent')}
                    className="w-full text-left px-4 py-2.5 hover:bg-[#EAECF0]/60 flex items-center space-x-2.5 text-xs font-semibold text-[#233D4D]"
                  >
                    <Repeat className="w-4 h-4 text-[#FE7F2D]" />
                    <div>
                      <div className="font-bold text-[#000000]">List for Rent</div>
                      <div className="text-[11px] text-gray-500">Earn from idle high-value items</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Dashboard Link */}
            <button
              id="btn-nav-dashboard"
              onClick={() => onNavigate('dashboard')}
              className={`p-2 rounded-lg text-sm font-semibold transition-all flex items-center space-x-1.5 ${
                currentPage === 'dashboard'
                  ? 'bg-white/20 text-white'
                  : 'text-[#EAECF0] hover:text-white hover:bg-white/10'
              }`}
              title="Dashboard"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden xl:inline">Dashboard</span>
            </button>

            {/* Admin toggle */}
            <button
              id="btn-nav-admin"
              onClick={() => onNavigate('admin')}
              className={`text-xs px-2.5 py-1.5 rounded-md font-bold uppercase tracking-wider transition-all border ${
                currentPage === 'admin' 
                  ? 'bg-[#FE7F2D] text-[#000000] border-[#FE7F2D]' 
                  : 'bg-black/30 text-[#EAECF0] border-white/20 hover:border-[#FE7F2D]/60'
              }`}
            >
              Admin
            </button>

            {/* User Profile / Auth */}
            {currentUser ? (
              <div 
                id="btn-user-profile-trigger"
                onClick={() => onNavigate('profile')}
                className="flex items-center space-x-2.5 bg-black/20 hover:bg-black/40 p-1.5 pr-3 rounded-full cursor-pointer transition-all border border-white/10"
              >
                <div className="relative">
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name} 
                    className="w-7 h-7 rounded-full object-cover border border-[#FE7F2D]"
                  />
                  {currentUser.verified && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#FE7F2D] rounded-full flex items-center justify-center text-[8px] text-black font-black">
                      ✓
                    </span>
                  )}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-white leading-tight">{currentUser.name.split(' ')[0]}</span>
                  <span className="text-[10px] text-[#FE7F2D] font-medium leading-none">₹{currentUser.walletBalance.toLocaleString()}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="text-xs font-bold text-white hover:text-[#FE7F2D] px-3 py-2"
                >
                  Login
                </button>
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="bg-[#FE7F2D] text-[#000000] text-xs font-bold px-3.5 py-2 rounded-lg hover:bg-[#FE7F2D]/90 transition-all"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger button */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={() => onNavigate('admin')}
              className="text-[10px] bg-black/40 text-white font-bold px-2 py-1 rounded border border-white/20"
            >
              Admin
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-white hover:bg-white/10"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#233D4D] border-t border-white/10 px-4 pt-3 pb-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold flex items-center justify-between ${
                currentPage === item.id ? 'bg-[#FE7F2D] text-[#000000]' : 'text-white hover:bg-white/10'
              }`}
            >
              <span>{item.label}</span>
              {item.badge && (
                <span className="text-[10px] bg-black text-[#FE7F2D] px-1.5 py-0.5 rounded font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          <div className="pt-3 border-t border-white/10 flex flex-col space-y-2">
            <button
              onClick={() => {
                onNavigate('dashboard');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm font-semibold text-[#EAECF0] hover:text-white"
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                onNavigate('profile');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm font-semibold text-[#EAECF0] hover:text-white"
            >
              My Profile & Verification
            </button>
            <button
              onClick={() => {
                onOpenRepairRequest();
                setMobileMenuOpen(false);
              }}
              className="w-full bg-[#FE7F2D] text-[#000000] font-bold py-2.5 rounded-lg text-center text-sm"
            >
              Request Repair / List Item
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
