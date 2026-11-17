import React from 'react';
import { 
  Repeat, 
  ShoppingBag, 
  Wrench, 
  Wallet, 
  MessageSquare, 
  PlusCircle, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  RotateCcw,
  Sparkles,
  Lock,
  ArrowUpRight
} from 'lucide-react';
import { Booking, RepairRequest, ResellProduct, UserAccount, NavigationPage } from '../types';

interface UserDashboardProps {
  currentUser: UserAccount;
  bookings: Booking[];
  repairs: RepairRequest[];
  resellListings: ResellProduct[];
  onNavigate: (page: NavigationPage) => void;
  onOpenCreateListing: () => void;
  onOpenRepairRequest: () => void;
  onOpenDamageClaimDemo: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  currentUser,
  bookings,
  repairs,
  resellListings,
  onNavigate,
  onOpenCreateListing,
  onOpenRepairRequest,
  onOpenDamageClaimDemo
}) => {
  return (
    <div className="py-10 bg-[#EAECF0]/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Welcome Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#233D4D]/15 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#FE7F2D] shadow-sm"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#FE7F2D] text-[#000000] rounded-full flex items-center justify-center text-xs font-black">
                ✓
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-display font-extrabold text-[#000000]">
                  Welcome back, {currentUser.name}
                </h1>
                <span className="bg-emerald-50 text-emerald-800 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border border-emerald-200">
                  Verified Member
                </span>
              </div>
              <p className="text-xs text-[#233D4D] mt-0.5">
                {currentUser.location} • Community Trust Score: <strong className="text-[#FE7F2D]">99.8%</strong>
              </p>
            </div>
          </div>

          {/* Quick Actions Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigate('rent')}
              className="bg-[#FE7F2D] hover:bg-[#FE7F2D]/90 text-[#000000] font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center space-x-1.5 active:scale-95"
            >
              <Repeat className="w-4 h-4" />
              <span>Browse Rentals</span>
            </button>
            <button
              onClick={onOpenRepairRequest}
              className="bg-[#233D4D] hover:bg-[#233D4D]/90 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center space-x-1.5"
            >
              <Wrench className="w-4 h-4 text-[#FE7F2D]" />
              <span>Request Repair</span>
            </button>
            <button
              onClick={onOpenCreateListing}
              className="bg-[#EAECF0] hover:bg-gray-200 text-[#233D4D] font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center space-x-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List Item</span>
            </button>
          </div>
        </div>

        {/* Top 5 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          
          {/* Card 1: My Rentals */}
          <div className="bg-white p-5 rounded-2xl border border-[#233D4D]/10 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-[11px] uppercase font-bold tracking-wider text-[#233D4D]">My Rentals</span>
              <Repeat className="w-4 h-4 text-[#FE7F2D]" />
            </div>
            <div className="text-2xl font-display font-extrabold text-[#000000]">
              {bookings.length}
            </div>
            <span className="text-[10px] text-emerald-700 font-bold block">1 Active • 1 Completed</span>
          </div>

          {/* Card 2: My Listings */}
          <div className="bg-white p-5 rounded-2xl border border-[#233D4D]/10 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-[11px] uppercase font-bold tracking-wider text-[#233D4D]">My Listings</span>
              <ShoppingBag className="w-4 h-4 text-[#233D4D]" />
            </div>
            <div className="text-2xl font-display font-extrabold text-[#000000]">
              {resellListings.length}
            </div>
            <span className="text-[10px] text-gray-500 block">4 Inquiries Received</span>
          </div>

          {/* Card 3: Repair Requests */}
          <div className="bg-white p-5 rounded-2xl border border-[#233D4D]/10 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-[11px] uppercase font-bold tracking-wider text-[#233D4D]">Repair Requests</span>
              <Wrench className="w-4 h-4 text-[#FE7F2D]" />
            </div>
            <div className="text-2xl font-display font-extrabold text-[#000000]">
              {repairs.length}
            </div>
            <span className="text-[10px] text-amber-700 font-bold block">1 Quotation Pending</span>
          </div>

          {/* Card 4: Wallet Balance */}
          <div className="bg-white p-5 rounded-2xl border border-[#233D4D]/10 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-[11px] uppercase font-bold tracking-wider text-[#233D4D]">Wallet Balance</span>
              <Wallet className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-display font-extrabold text-[#000000]">
              ₹{currentUser.walletBalance.toLocaleString()}
            </div>
            <span className="text-[10px] text-gray-500 block">Available for checkout</span>
          </div>

          {/* Card 5: Escrow Deposits */}
          <div className="bg-[#233D4D] text-white p-5 rounded-2xl shadow-xs space-y-2 col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between text-[#EAECF0]">
              <span className="text-[11px] uppercase font-bold tracking-wider text-[#FE7F2D]">Escrow Locked</span>
              <Lock className="w-4 h-4 text-[#FE7F2D]" />
            </div>
            <div className="text-2xl font-display font-extrabold text-white">
              ₹{currentUser.depositLocked.toLocaleString()}
            </div>
            <span className="text-[10px] text-[#EAECF0] block">Auto-refund on return</span>
          </div>

        </div>

        {/* 2-Column Content: Active Rentals Tracker & Ongoing Repairs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          
          {/* Left Column: Active Rentals */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-extrabold text-lg text-[#000000]">
                Active & Upcoming Rentals
              </h2>
              <button onClick={() => onNavigate('rent')} className="text-xs font-bold text-[#FE7F2D] hover:underline">
                Find More Gear →
              </button>
            </div>

            <div className="space-y-4">
              {bookings.map((b) => (
                <div 
                  key={b.id}
                  className="bg-white rounded-2xl p-5 shadow-xs border border-[#233D4D]/10 space-y-4"
                >
                  <div className="flex items-center space-x-4">
                    <img 
                      src={b.productImage} 
                      alt={b.productName} 
                      className="w-16 h-16 rounded-xl object-cover border border-[#EAECF0]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-500 font-mono">ID: {b.id}</span>
                        <span className="text-xs font-extrabold bg-[#FE7F2D]/20 text-[#000000] px-2.5 py-0.5 rounded-full border border-[#FE7F2D]/30">
                          {b.status}
                        </span>
                      </div>
                      <h4 className="font-display font-extrabold text-sm text-[#000000] truncate mt-0.5">
                        {b.productName}
                      </h4>
                      <p className="text-xs text-[#233D4D] flex items-center space-x-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#FE7F2D]" />
                        <span>Owner: {b.ownerName} ({b.location})</span>
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-[#EAECF0] p-3 rounded-xl text-xs">
                    <div>
                      <span className="text-[10px] text-gray-500 block">Duration</span>
                      <span className="font-bold text-[#000000]">{b.days} Days</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 block">Return Due</span>
                      <span className="font-bold text-[#233D4D]">{b.returnDate.split(' ')[0]}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 block">Escrow Deposit</span>
                      <span className="font-bold text-emerald-700">₹{b.securityDeposit}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-gray-500">Pickup check-in verified with 4 photos</span>
                    <button
                      onClick={onOpenDamageClaimDemo}
                      className="text-xs font-bold bg-[#233D4D] text-white hover:bg-[#FE7F2D] hover:text-[#000000] px-3.5 py-1.5 rounded-lg transition-colors"
                    >
                      Inspect Condition Log
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Repair Requests & Quick Activities */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Ongoing Repairs */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-extrabold text-lg text-[#000000]">
                  Ongoing Repairs
                </h2>
                <button onClick={() => onNavigate('repair')} className="text-xs font-bold text-[#233D4D] hover:underline">
                  Repair Network →
                </button>
              </div>

              {repairs.map((r) => (
                <div 
                  key={r.id}
                  className="bg-white rounded-2xl p-5 shadow-xs border border-[#233D4D]/10 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase bg-[#233D4D] text-white px-2 py-0.5 rounded">
                      {r.category}
                    </span>
                    <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {r.status}
                    </span>
                  </div>

                  <h4 className="font-display font-extrabold text-sm text-[#000000]">
                    {r.productName}
                  </h4>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {r.problemDescription}
                  </p>

                  <div className="bg-[#EAECF0] p-2.5 rounded-xl flex items-center justify-between text-xs">
                    <span className="text-gray-500">Provider: {r.providerName || 'TechFix'}</span>
                    <span className="font-bold text-[#000000]">Quotation: ₹{r.quotationAmount}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Circular Impact Box */}
            <div className="bg-gradient-to-br from-[#233D4D] to-[#000000] text-white rounded-3xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center space-x-2 text-[#FE7F2D]">
                <RotateCcw className="w-5 h-5 animate-spin-slow" />
                <h3 className="font-display font-extrabold text-sm text-white">
                  Your ReLoop Circular Impact
                </h3>
              </div>
              <p className="text-xs text-[#EAECF0]/80">
                By renting and repairing instead of buying single-use new electronics:
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white/10 p-3 rounded-xl">
                  <span className="text-2xl font-extrabold text-[#FE7F2D] block">₹48,200</span>
                  <span className="text-[10px] text-gray-300">Capital Saved vs Buying</span>
                </div>
                <div className="bg-white/10 p-3 rounded-xl">
                  <span className="text-2xl font-extrabold text-emerald-400 block">34.5 kg</span>
                  <span className="text-[10px] text-gray-300">CO2 & E-Waste Avoided</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
