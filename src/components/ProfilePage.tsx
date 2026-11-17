import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Star, 
  CheckCircle, 
  Repeat, 
  ShoppingBag, 
  Wrench, 
  Wallet, 
  Key, 
  Bell, 
  LogOut, 
  FileText,
  MapPin,
  Phone,
  Mail,
  Edit2
} from 'lucide-react';
import { UserAccount } from '../types';

interface ProfilePageProps {
  currentUser?: UserAccount | null;
  onLogout?: () => void;
  onOpenAuth?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  currentUser,
  onLogout,
  onOpenAuth
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'escrow'>('profile');

  if (!currentUser) {
    return (
      <div className="py-16 bg-[#EAECF0]/50 min-h-screen flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-sm border border-[#233D4D]/15">
          <div className="w-16 h-16 rounded-full bg-[#EAECF0] text-[#233D4D] flex items-center justify-center mx-auto">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-display font-extrabold text-[#000000]">
            Sign In to View Profile
          </h2>
          <p className="text-xs text-[#233D4D] leading-relaxed">
            Please log in or select a demo persona to access your rental history, KYC status, and escrow wallet.
          </p>
          {onOpenAuth && (
            <button
              onClick={onOpenAuth}
              className="w-full bg-[#FE7F2D] hover:bg-[#FE7F2D]/90 text-[#000000] font-black py-3 rounded-xl text-xs transition-all shadow-xs"
            >
              Sign In / Switch Persona
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 bg-[#EAECF0]/50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Card Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#233D4D]/15 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
            
            {/* Avatar */}
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-24 h-24 rounded-3xl object-cover border-4 border-[#FE7F2D] shadow-md"
              />
              <div className="absolute -bottom-2 -right-2 bg-[#FE7F2D] text-[#000000] text-xs font-black px-2 py-0.5 rounded-full flex items-center shadow-xs">
                ✓ Verified
              </div>
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h1 className="text-2xl font-display font-extrabold text-[#000000]">
                    {currentUser.name}
                  </h1>
                  <p className="text-xs text-[#233D4D] flex items-center justify-center sm:justify-start space-x-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#FE7F2D]" />
                    <span>{currentUser.location}</span>
                  </p>
                </div>

                {/* Verified User Badge & Actions */}
                <div className="flex items-center space-x-2 mx-auto sm:mx-0">
                  <div className="inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 px-3.5 py-1.5 rounded-full text-xs font-extrabold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>✓ Verified User</span>
                  </div>
                  {onLogout && (
                    <button
                      onClick={onLogout}
                      className="p-1.5 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Log Out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-xs text-[#233D4D] mt-3 leading-relaxed">
                {currentUser.bio}
              </p>

              {/* Rating & Contact */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4 text-xs font-semibold text-[#233D4D]">
                <span className="flex items-center text-[#FE7F2D] font-bold">
                  <Star className="w-4 h-4 fill-[#FE7F2D] mr-1" />
                  {currentUser.rating} / 5.0 Rating (Trust Verified)
                </span>
                <span>•</span>
                <span className="flex items-center text-gray-600">
                  <Mail className="w-3.5 h-3.5 mr-1" />
                  {currentUser.email}
                </span>
                <span>•</span>
                <span className="flex items-center text-gray-600">
                  <Phone className="w-3.5 h-3.5 mr-1" />
                  {currentUser.phone}
                </span>
              </div>

            </div>

          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-[#233D4D]/10 text-center space-y-1">
            <Repeat className="w-5 h-5 text-[#FE7F2D] mx-auto" />
            <span className="text-2xl font-display font-extrabold text-[#000000] block">{currentUser.completedRentals}</span>
            <span className="text-[11px] font-bold text-gray-500 uppercase">Completed Rentals</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#233D4D]/10 text-center space-y-1">
            <ShoppingBag className="w-5 h-5 text-[#233D4D] mx-auto" />
            <span className="text-2xl font-display font-extrabold text-[#000000] block">{currentUser.successfulSales}</span>
            <span className="text-[11px] font-bold text-gray-500 uppercase">Successful Sales</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#233D4D]/10 text-center space-y-1">
            <Wrench className="w-5 h-5 text-[#FE7F2D] mx-auto" />
            <span className="text-2xl font-display font-extrabold text-[#000000] block">{currentUser.repairCount}</span>
            <span className="text-[11px] font-bold text-gray-500 uppercase">Repair History</span>
          </div>

          <div className="bg-[#233D4D] text-white p-5 rounded-2xl text-center space-y-1">
            <Wallet className="w-5 h-5 text-[#FE7F2D] mx-auto" />
            <span className="text-2xl font-display font-extrabold text-white block">₹{currentUser.earnings.toLocaleString()}</span>
            <span className="text-[11px] font-bold text-[#EAECF0] uppercase">Total Earnings</span>
          </div>
        </div>

        {/* Settings / Security Tabs */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#233D4D]/15 space-y-6">
          <div className="flex space-x-2 border-b border-[#EAECF0] pb-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'profile' ? 'bg-[#233D4D] text-white' : 'text-[#233D4D] hover:bg-[#EAECF0]'
              }`}
            >
              Account Details
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'security' ? 'bg-[#233D4D] text-white' : 'text-[#233D4D] hover:bg-[#EAECF0]'
              }`}
            >
              Security & KYC Documents
            </button>
            <button
              onClick={() => setActiveTab('escrow')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'escrow' ? 'bg-[#233D4D] text-white' : 'text-[#233D4D] hover:bg-[#EAECF0]'
              }`}
            >
              Escrow Payout Settings
            </button>
          </div>

          {activeTab === 'profile' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-500 font-bold mb-1">Full Legal Name</label>
                  <input type="text" readOnly value={currentUser.name} className="w-full bg-[#EAECF0] p-2.5 rounded-xl font-bold text-[#000000]" />
                </div>
                <div>
                  <label className="block text-gray-500 font-bold mb-1">Email Address</label>
                  <input type="email" readOnly value={currentUser.email} className="w-full bg-[#EAECF0] p-2.5 rounded-xl font-bold text-[#000000]" />
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="text-gray-500">Need to update bank or contact information?</span>
                <button onClick={() => alert('Profile settings updated successfully.')} className="bg-[#FE7F2D] text-[#000000] font-black px-4 py-2 rounded-xl">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-3 text-xs">
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-950 block">Government Aadhaar / ID Card</span>
                  <span className="text-[11px] text-emerald-800">Verified by ReLoop Trust Engine</span>
                </div>
                <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  ✓ Approved
                </span>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-950 block">Two-Factor Authentication (2FA)</span>
                  <span className="text-[11px] text-emerald-800">Securing wallet withdrawals & escrow authorizations</span>
                </div>
                <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  ✓ Active
                </span>
              </div>
            </div>
          )}

          {activeTab === 'escrow' && (
            <div className="space-y-3 text-xs">
              <div className="bg-[#EAECF0] p-4 rounded-xl space-y-2">
                <div className="flex justify-between">
                  <span className="font-bold text-[#000000]">Linked Bank Account (UPI / IMPS)</span>
                  <span className="text-[#FE7F2D] font-bold">Default for Payouts</span>
                </div>
                <p className="text-gray-600 font-mono">HDFC Bank ••••••4902 (IFSC: HDFC0000240)</p>
                <p className="text-[11px] text-gray-500">Earnings and escrow security deposits are automatically transferred within 2 hours of return check-in.</p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
