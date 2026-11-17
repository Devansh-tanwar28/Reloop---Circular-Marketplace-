import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Users, 
  Package, 
  Repeat, 
  Wrench, 
  Scale, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Search, 
  Filter, 
  ArrowUpRight,
  Sparkles,
  Lock,
  Eye,
  LogOut
} from 'lucide-react';
import { NavigationPage } from '../types';

interface AdminPanelProps {
  onExitAdmin: () => void;
  onOpenDisputeDetail: () => void;
}

import { apiGetAdminOverview } from '../services/api';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onExitAdmin,
  onOpenDisputeDetail
}) => {
  const [adminTab, setAdminTab] = useState<'overview' | 'disputes' | 'kyc' | 'listings' | 'transactions'>('overview');
  const [kycFilter, setKycFilter] = useState<'all' | 'pending' | 'approved'>('pending');
  const [liveStats, setLiveStats] = useState<any>(null);

  React.useEffect(() => {
    apiGetAdminOverview()
      .then(data => setLiveStats(data))
      .catch(err => console.warn('Could not load live admin stats:', err));
  }, []);

  const pendingKycUsers = [
    { id: 'usr-892', name: 'Vikram Seth', email: 'vikram.seth@gmail.com', idType: 'Aadhaar Card', submitted: '10 mins ago', status: 'Pending Review', score: '98%' },
    { id: 'usr-893', name: 'Ananya Roy', email: 'ananya.roy@outlook.com', idType: 'Passport', submitted: '1 hour ago', status: 'Pending Review', score: '95%' },
    { id: 'usr-894', name: 'Karthik Raja', email: 'karthik@techcorp.in', idType: 'Driving License', submitted: '3 hours ago', status: 'Pending Review', score: '99%' }
  ];

  const disputes = [
    { id: 'disp-001', product: 'Sony A7 IV Full-Frame Camera', renter: 'Rahul Sharma', owner: 'Aakash Verma', claim: '₹3,500', aiConfidence: '94%', reason: 'Optical difference detected on lens ring mount', date: '2026-08-23' },
    { id: 'disp-002', product: 'DJI Mavic Air 2 Fly More', renter: 'Pooja Nair', owner: 'Karan Mehra', claim: '₹1,200', aiConfidence: '88%', reason: 'Propeller guard hairline stress fracture', date: '2026-08-21' }
  ];

  return (
    <div className="bg-[#1A2E3B] text-[#EAECF0] min-h-screen">
      
      {/* Admin Top Navigation */}
      <header className="bg-[#233D4D] border-b border-white/10 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#FE7F2D] text-[#000000] flex items-center justify-center font-display font-black text-sm">
            R
          </div>
          <div>
            <span className="font-display font-extrabold text-sm text-white tracking-wider">
              ReLoop ADMIN CONTROL PANEL
            </span>
            <span className="text-[10px] text-gray-400 block font-mono">
              Live Trust & Safety Environment • v2.4
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-xs bg-emerald-900/60 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30 flex items-center space-x-1.5 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Escrow Vault: Healthy</span>
          </span>

          <button
            onClick={onExitAdmin}
            className="bg-[#FE7F2D] hover:bg-[#FE7F2D]/90 text-[#000000] font-black text-xs px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit to Main App</span>
          </button>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Navigation Tabs */}
        <div className="flex space-x-2 border-b border-white/10 pb-3 overflow-x-auto">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: Package },
            { id: 'disputes', label: 'Damage Disputes (2)', icon: Scale },
            { id: 'kyc', label: 'KYC & User Verification (3)', icon: Users },
            { id: 'listings', label: 'Listing Moderation', icon: Repeat },
            { id: 'transactions', label: 'Escrow Transactions', icon: DollarSign }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = adminTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-[#FE7F2D] text-[#000000] shadow-sm'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {adminTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in">
            
            {/* Top 6 KPI Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-[#233D4D] p-4 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[10px] text-gray-400 uppercase font-bold">Total Users</span>
                <span className="text-2xl font-display font-extrabold text-white block">
                  {liveStats ? liveStats.totalUsers : '3,420'}
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">
                  {liveStats ? `${liveStats.verifiedUsers} verified` : '+18% this month'}
                </span>
              </div>

              <div className="bg-[#233D4D] p-4 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[10px] text-gray-400 uppercase font-bold">Active Listings</span>
                <span className="text-2xl font-display font-extrabold text-white block">
                  {liveStats ? liveStats.activeRentalListings + liveStats.resellListings : '1,840'}
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">Rent & Resell</span>
              </div>

              <div className="bg-[#233D4D] p-4 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[10px] text-gray-400 uppercase font-bold">Active Rentals</span>
                <span className="text-2xl font-display font-extrabold text-[#FE7F2D] block">
                  {liveStats ? liveStats.activeBookings : '214'}
                </span>
                <span className="text-[10px] text-gray-300">Live in circulation</span>
              </div>

              <div className="bg-[#233D4D] p-4 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[10px] text-gray-400 uppercase font-bold">Repairs in Progress</span>
                <span className="text-2xl font-display font-extrabold text-white block">
                  {liveStats ? liveStats.repairRequests : '46'}
                </span>
                <span className="text-[10px] text-gray-300">Certified hubs</span>
              </div>

              <div className="bg-[#233D4D] p-4 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[10px] text-gray-400 uppercase font-bold">Open Disputes</span>
                <span className="text-2xl font-display font-extrabold text-amber-400 block">
                  {liveStats ? liveStats.activeDisputes : '2'}
                </span>
                <span className="text-[10px] text-amber-300">Review required</span>
              </div>

              <div className="bg-[#233D4D] p-4 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[10px] text-gray-400 uppercase font-bold">Escrow Protected</span>
                <span className="text-2xl font-display font-extrabold text-white block">
                  {liveStats ? `₹${(liveStats.totalDepositsHeldInEscrow / 1000).toFixed(1)}k` : '₹14.8L'}
                </span>
                <span className="text-[10px] text-emerald-400">Zero fraud rate</span>
              </div>
            </div>

            {/* Live Moderation Queues */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Damage Disputes Preview */}
              <div className="bg-[#233D4D] rounded-3xl p-6 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Scale className="w-5 h-5 text-[#FE7F2D]" />
                    <h3 className="font-display font-extrabold text-base text-white">
                      Active Condition Disputes
                    </h3>
                  </div>
                  <span className="text-xs text-amber-400 font-bold">Requires Arbitration</span>
                </div>

                <div className="space-y-3">
                  {disputes.map((d) => (
                    <div key={d.id} className="bg-[#1A2E3B] p-4 rounded-2xl border border-white/5 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs font-bold text-white block">{d.product}</span>
                          <span className="text-[11px] text-gray-400">Renter: {d.renter} vs Owner: {d.owner}</span>
                        </div>
                        <span className="text-xs font-black text-[#FE7F2D]">{d.claim}</span>
                      </div>
                      <p className="text-[11px] text-gray-300">{d.reason} (AI confidence: {d.aiConfidence})</p>
                      
                      <div className="flex justify-end pt-2">
                        <button
                          onClick={onOpenDisputeDetail}
                          className="bg-[#FE7F2D] hover:bg-[#FE7F2D]/90 text-[#000000] font-black text-xs px-3.5 py-1.5 rounded-lg flex items-center space-x-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect Evidence & Settle</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending KYC Users Preview */}
              <div className="bg-[#233D4D] rounded-3xl p-6 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-display font-extrabold text-base text-white">
                      Identity Verification Queue
                    </h3>
                  </div>
                  <span className="text-xs text-gray-400">3 Pending Approval</span>
                </div>

                <div className="space-y-3">
                  {pendingKycUsers.map((u) => (
                    <div key={u.id} className="bg-[#1A2E3B] p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-white block">{u.name}</span>
                        <span className="text-[11px] text-gray-400">{u.idType} • OCR Match {u.score}</span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => alert(`KYC for ${u.name} verified and badge granted.`)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: DAMAGE DISPUTES VIEW */}
        {adminTab === 'disputes' && (
          <div className="bg-[#233D4D] rounded-3xl p-6 border border-white/10 space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-display font-extrabold text-white">
                Dispute Resolution & Escrow Adjudication
              </h2>
              <button
                onClick={onOpenDisputeDetail}
                className="bg-[#FE7F2D] text-[#000000] font-black text-xs px-4 py-2 rounded-xl"
              >
                Open Full Screen Dispute Inspector
              </button>
            </div>

            <div className="space-y-4">
              {disputes.map((d) => (
                <div key={d.id} className="bg-[#1A2E3B] p-5 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-white">{d.product} (Case {d.id})</span>
                    <span className="text-xs text-[#FE7F2D] font-bold">Claim: {d.claim}</span>
                  </div>
                  <p className="text-xs text-gray-300">
                    Dual Photo inspection found {d.reason}. AI Optical confidence: {d.aiConfidence}.
                  </p>
                  <div className="flex space-x-3 pt-2">
                    <button
                      onClick={() => alert(`Escrow funds of ${d.claim} awarded to owner for repairs. Remainder returned to renter.`)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-lg"
                    >
                      Release Repair Amount to Owner
                    </button>
                    <button
                      onClick={() => alert('Full deposit refunded to renter as normal wear & tear.')}
                      className="bg-gray-700 hover:bg-gray-600 text-white font-bold text-xs px-4 py-2 rounded-lg"
                    >
                      Dismiss Claim (Full Refund to Renter)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: KYC MODERATION */}
        {adminTab === 'kyc' && (
          <div className="bg-[#233D4D] rounded-3xl p-6 border border-white/10 space-y-4 animate-in fade-in">
            <h2 className="text-lg font-display font-extrabold text-white">
              Identity Verification & Aadhaar / Govt ID Moderation
            </h2>
            <div className="space-y-3">
              {pendingKycUsers.map((u) => (
                <div key={u.id} className="bg-[#1A2E3B] p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-white block">{u.name} ({u.email})</span>
                    <span className="text-xs text-gray-400">Document: {u.idType} • Auto-OCR Accuracy: {u.score}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => alert(`KYC for ${u.name} approved.`)}
                      className="bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-lg"
                    >
                      Approve & Verify
                    </button>
                    <button
                      onClick={() => alert(`Document rejected. User notified to re-upload clear photo.`)}
                      className="bg-red-900/60 text-red-300 font-bold text-xs px-4 py-2 rounded-lg"
                    >
                      Request Re-upload
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
