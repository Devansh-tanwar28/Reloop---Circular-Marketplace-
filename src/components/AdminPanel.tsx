import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  Package, 
  Repeat, 
  Scale, 
  DollarSign, 
  CheckCircle, 
  Eye,
  LogOut,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { DamageClaim, UserAccount } from '../types';
import {
  apiGetAdminOverview,
  apiGetAdminUsers,
  apiVerifyAdminUser,
  apiGetAdminListings,
  apiDeleteAdminListing,
  apiGetAdminTransactions,
  apiGetClaims,
  apiAdminResolveClaim
} from '../services/api';

interface AdminPanelProps {
  onExitAdmin: () => void;
  onOpenDisputeDetail: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onExitAdmin,
  onOpenDisputeDetail
}) => {
  const [adminTab, setAdminTab] = useState<'overview' | 'disputes' | 'kyc' | 'listings' | 'transactions'>('overview');
  const [kycFilter, setKycFilter] = useState<'all' | 'pending' | 'approved'>('pending');
  const [liveStats, setLiveStats] = useState<any>(null);
  const [users, setUsers] = useState<(UserAccount & { verificationStatus?: string })[]>([]);
  const [claims, setClaims] = useState<DamageClaim[]>([]);
  const [listings, setListings] = useState<{ rentals: any[]; resell: any[] }>({ rentals: [], resell: [] });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadAllAdminData = useCallback(async () => {
    try {
      const [overview, userList, claimList, listingData, txList] = await Promise.all([
        apiGetAdminOverview(),
        apiGetAdminUsers(),
        apiGetClaims(),
        apiGetAdminListings(),
        apiGetAdminTransactions()
      ]);
      setLiveStats(overview);
      setUsers(userList);
      setClaims(claimList);
      setListings(listingData);
      setTransactions(txList);
    } catch (err: any) {
      setBanner({ type: 'error', message: err.message || 'Could not load admin telemetry.' });
    }
  }, []);

  useEffect(() => {
    loadAllAdminData();
  }, [loadAllAdminData]);

  const showBanner = (type: 'success' | 'error', message: string) => {
    setBanner({ type, message });
    setTimeout(() => setBanner(null), 5000);
  };

  const handleVerifyUser = async (u: UserAccount, status: 'approved' | 'rejected') => {
    try {
      await apiVerifyAdminUser(u.id, status);
      showBanner(
        'success',
        status === 'approved'
          ? `KYC for ${u.name} verified and Trusted Badge granted.`
          : `Re-upload requested from ${u.name}; notification queued.`
      );
      await loadAllAdminData();
    } catch (err: any) {
      showBanner('error', err.message || 'Verification action failed.');
    }
  };

  const handleResolveClaim = async (claimId: string, decision: 'award_owner' | 'dismiss_refund') => {
    try {
      const res = await apiAdminResolveClaim(claimId, decision);
      showBanner('success', res.message);
      await loadAllAdminData();
    } catch (err: any) {
      showBanner('error', err.message || 'Dispute resolution failed.');
    }
  };

  const handleRemoveListing = async (type: 'rental' | 'resell', id: string, name: string) => {
    try {
      await apiDeleteAdminListing(type, id);
      showBanner('success', `Listing "${name}" removed from marketplace.`);
      await loadAllAdminData();
    } catch (err: any) {
      showBanner('error', err.message || 'Could not remove listing.');
    }
  };

  const pendingKycUsers = users.filter(u => !u.verified);
  const filteredKycUsers = users.filter(u => {
    if (kycFilter === 'pending') return !u.verified;
    if (kycFilter === 'approved') return u.verified;
    return true;
  });
  const openClaims = claims.filter(c => c.status !== 'Resolved');

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
        
        {/* Action Feedback Banner */}
        {banner && (
          <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center space-x-2.5 ${
            banner.type === 'success'
              ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-200'
              : 'bg-red-950/70 border-red-500/40 text-red-200'
          }`}>
            {banner.type === 'success'
              ? <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              : <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
            <span>{banner.message}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex space-x-2 border-b border-white/10 pb-3 overflow-x-auto">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: Package },
            { id: 'disputes', label: `Damage Disputes (${openClaims.length})`, icon: Scale },
            { id: 'kyc', label: `KYC & User Verification (${pendingKycUsers.length})`, icon: Users },
            { id: 'listings', label: `Listing Moderation (${listings.rentals.length + listings.resell.length})`, icon: Repeat },
            { id: 'transactions', label: `Escrow Transactions (${transactions.length})`, icon: DollarSign }
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
                  {liveStats ? liveStats.totalUsers : users.length}
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">
                  {liveStats ? `${liveStats.verifiedUsers} verified` : 'Syncing...'}
                </span>
              </div>

              <div className="bg-[#233D4D] p-4 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[10px] text-gray-400 uppercase font-bold">Active Listings</span>
                <span className="text-2xl font-display font-extrabold text-white block">
                  {liveStats ? liveStats.activeRentalListings + liveStats.resellListings : listings.rentals.length + listings.resell.length}
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">Rent & Resell</span>
              </div>

              <div className="bg-[#233D4D] p-4 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[10px] text-gray-400 uppercase font-bold">Active Rentals</span>
                <span className="text-2xl font-display font-extrabold text-[#FE7F2D] block">
                  {liveStats ? liveStats.activeBookings : 0}
                </span>
                <span className="text-[10px] text-gray-300">Live in circulation</span>
              </div>

              <div className="bg-[#233D4D] p-4 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[10px] text-gray-400 uppercase font-bold">Repairs Logged</span>
                <span className="text-2xl font-display font-extrabold text-white block">
                  {liveStats ? liveStats.repairRequests : 0}
                </span>
                <span className="text-[10px] text-gray-300">Certified hubs</span>
              </div>

              <div className="bg-[#233D4D] p-4 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[10px] text-gray-400 uppercase font-bold">Open Disputes</span>
                <span className="text-2xl font-display font-extrabold text-amber-400 block">
                  {liveStats ? liveStats.activeDisputes : openClaims.length}
                </span>
                <span className="text-[10px] text-amber-300">Review required</span>
              </div>

              <div className="bg-[#233D4D] p-4 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[10px] text-gray-400 uppercase font-bold">Escrow Protected</span>
                <span className="text-2xl font-display font-extrabold text-white block">
                  {liveStats ? `₹${liveStats.totalDepositsHeldInEscrow.toLocaleString()}` : '₹0'}
                </span>
                <span className="text-[10px] text-emerald-400">Escrow vault live</span>
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
                      Condition Disputes Queue
                    </h3>
                  </div>
                  <span className="text-xs text-amber-400 font-bold">{openClaims.length} Pending</span>
                </div>

                <div className="space-y-3">
                  {claims.length > 0 ? claims.map((d) => (
                    <div key={d.id} className="bg-[#1A2E3B] p-4 rounded-2xl border border-white/5 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs font-bold text-white block">{d.productName}</span>
                          <span className="text-[11px] text-gray-400">Renter: {d.renterName} vs Owner: {d.ownerName}</span>
                        </div>
                        <span className="text-xs font-black text-[#FE7F2D]">₹{d.estimatedRepairCost.toLocaleString()}</span>
                      </div>
                      <p className="text-[11px] text-gray-300">{d.differenceDescription} (Status: {d.status})</p>
                      
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
                  )) : (
                    <p className="text-xs text-gray-400">No active damage disputes.</p>
                  )}
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
                  <span className="text-xs text-gray-400">{pendingKycUsers.length} Pending Approval</span>
                </div>

                <div className="space-y-3">
                  {pendingKycUsers.length > 0 ? pendingKycUsers.map((u) => (
                    <div key={u.id} className="bg-[#1A2E3B] p-4 rounded-2xl border border-white/5 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold text-white block">{u.name}</span>
                        <span className="text-[11px] text-gray-400">{u.email} • {u.verificationStatus || 'Pending Review'}</span>
                      </div>
                      <button
                        onClick={() => handleVerifyUser(u, 'approved')}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1 shrink-0"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    </div>
                  )) : (
                    <div className="bg-[#1A2E3B] p-4 rounded-2xl text-xs text-emerald-300 font-semibold">
                      All registered members have completed KYC verification.
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: DAMAGE DISPUTES VIEW */}
        {adminTab === 'disputes' && (
          <div className="bg-[#233D4D] rounded-3xl p-6 border border-white/10 space-y-6 animate-in fade-in">
            <div className="flex flex-wrap justify-between items-center gap-3">
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
              {claims.map((d) => (
                <div key={d.id} className="bg-[#1A2E3B] p-5 rounded-2xl space-y-3 border border-white/5">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-white">{d.productName} (Case {d.id})</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] bg-white/10 px-2.5 py-0.5 rounded-full font-bold text-gray-200">{d.status}</span>
                      <span className="text-xs text-[#FE7F2D] font-bold">Claim: ₹{d.estimatedRepairCost.toLocaleString()}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-300">
                    {d.differenceDescription} — Owner note: "{d.ownerNotes}"
                  </p>
                  {d.status !== 'Resolved' ? (
                    <div className="flex flex-wrap gap-3 pt-2">
                      <button
                        onClick={() => handleResolveClaim(d.id, 'award_owner')}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-lg"
                      >
                        Release Repair Amount to Owner
                      </button>
                      <button
                        onClick={() => handleResolveClaim(d.id, 'dismiss_refund')}
                        className="bg-gray-700 hover:bg-gray-600 text-white font-bold text-xs px-4 py-2 rounded-lg"
                      >
                        Dismiss Claim (Full Refund to Renter)
                      </button>
                    </div>
                  ) : (
                    <span className="inline-block text-xs text-emerald-400 font-bold">✓ Case settled & escrow ledger updated</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: KYC MODERATION */}
        {adminTab === 'kyc' && (
          <div className="bg-[#233D4D] rounded-3xl p-6 border border-white/10 space-y-4 animate-in fade-in">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-display font-extrabold text-white">
                Identity Verification & Govt ID Moderation
              </h2>
              <div className="flex space-x-1 bg-[#1A2E3B] p-1 rounded-xl">
                {(['pending', 'approved', 'all'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setKycFilter(f)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold capitalize ${
                      kycFilter === f ? 'bg-[#FE7F2D] text-[#000000]' : 'text-gray-300'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {filteredKycUsers.map((u) => (
                <div key={u.id} className="bg-[#1A2E3B] p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-sm font-bold text-white block">{u.name} ({u.email})</span>
                    <span className="text-xs text-gray-400">
                      Role: {u.role} • Location: {u.location} • Status: {u.verified ? 'Verified' : (u.verificationStatus || 'Pending Review')}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    {!u.verified && (
                      <button
                        onClick={() => handleVerifyUser(u, 'approved')}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-lg"
                      >
                        Approve & Verify
                      </button>
                    )}
                    <button
                      onClick={() => handleVerifyUser(u, 'rejected')}
                      className="bg-red-900/60 hover:bg-red-900 text-red-300 font-bold text-xs px-4 py-2 rounded-lg"
                    >
                      Request Re-upload
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: LISTING MODERATION */}
        {adminTab === 'listings' && (
          <div className="bg-[#233D4D] rounded-3xl p-6 border border-white/10 space-y-6 animate-in fade-in">
            <h2 className="text-lg font-display font-extrabold text-white">
              Marketplace Listing Moderation ({listings.rentals.length} Rent • {listings.resell.length} Resell)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...listings.rentals, ...listings.resell].map((item) => (
                <div key={`${item.type}-${item.id}`} className="bg-[#1A2E3B] p-4 rounded-2xl border border-white/5 flex items-center justify-between gap-3">
                  <div className="flex items-center space-x-3 min-w-0">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                    )}
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase font-black text-[#FE7F2D]">{item.type} • {item.category}</span>
                      <span className="text-xs font-bold text-white block truncate">{item.name}</span>
                      <span className="text-[11px] text-gray-400">{item.ownerName} • {item.priceLabel}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveListing(item.type, item.id, item.name)}
                    className="bg-red-900/50 hover:bg-red-800 text-red-200 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: ESCROW TRANSACTIONS */}
        {adminTab === 'transactions' && (
          <div className="bg-[#233D4D] rounded-3xl p-6 border border-white/10 space-y-4 animate-in fade-in">
            <h2 className="text-lg font-display font-extrabold text-white">
              Escrow & Wallet Transaction Ledger
            </h2>
            <div className="space-y-2.5">
              {transactions.map((tx) => (
                <div key={tx.id} className="bg-[#1A2E3B] p-4 rounded-2xl border border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-bold text-white block">{tx.description}</span>
                    <span className="text-[11px] text-gray-400 font-mono">
                      {tx.userName} • {tx.type} • Ref: {tx.referenceId || tx.id}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-[#FE7F2D] block">₹{Number(tx.amount).toLocaleString()}</span>
                    <span className="text-[10px] uppercase text-emerald-400 font-bold">{tx.status}</span>
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

