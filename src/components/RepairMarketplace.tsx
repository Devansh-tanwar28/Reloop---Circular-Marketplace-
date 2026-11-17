import React, { useState } from 'react';
import { 
  Search, 
  Wrench, 
  MapPin, 
  Star, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Cpu, 
  Zap, 
  PlusCircle,
  FileText
} from 'lucide-react';
import { RepairProvider, RepairRequest, ProductCategory } from '../types';

interface RepairMarketplaceProps {
  providers: RepairProvider[];
  activeRequests: RepairRequest[];
  onOpenCreateRepair: (category?: ProductCategory, providerName?: string) => void;
  onApproveQuotation?: (reqId: string) => void;
}

export const RepairMarketplace: React.FC<RepairMarketplaceProps> = ({
  providers,
  activeRequests,
  onOpenCreateRepair,
  onApproveQuotation
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'providers' | 'my-requests'>('providers');

  const categories = [
    'All',
    'Cameras',
    'Laptops',
    'Appliances',
    'Tools',
    'Electronics'
  ];

  const filteredProviders = providers.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="py-10 bg-[#EAECF0]/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-white px-3 py-1 rounded-full text-xs font-bold text-[#233D4D] border border-[#233D4D]/10 mb-2">
              <Wrench className="w-3.5 h-3.5 text-[#FE7F2D]" />
              <span>Right-to-Repair Network</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-[#000000] tracking-tight">
              Repair Instead of Replace.
            </h1>
            <p className="text-sm text-[#233D4D] mt-1">
              Connect with vetted micro-electronic, camera, appliance and hardware repair technicians in Bengaluru.
            </p>
          </div>

          {/* Quick Request Button */}
          <button
            id="btn-trigger-repair-request"
            onClick={() => onOpenCreateRepair()}
            className="bg-[#233D4D] hover:bg-[#233D4D]/90 text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-sm transition-all flex items-center space-x-2 shrink-0 active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-[#FE7F2D]" />
            <span>Create Repair Request</span>
          </button>
        </div>

        {/* Tab switch between Providers & My Repair Tracker */}
        <div className="flex space-x-2 border-b border-[#233D4D]/10 mb-6 pb-2">
          <button
            onClick={() => setActiveTab('providers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'providers'
                ? 'bg-[#233D4D] text-white shadow-xs'
                : 'text-[#233D4D] hover:bg-white'
            }`}
          >
            Certified Repair Specialists ({providers.length})
          </button>
          <button
            onClick={() => setActiveTab('my-requests')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'my-requests'
                ? 'bg-[#233D4D] text-white shadow-xs'
                : 'text-[#233D4D] hover:bg-white'
            }`}
          >
            <span>My Active Requests</span>
            <span className="w-5 h-5 rounded-full bg-[#FE7F2D] text-[#000000] text-[10px] font-black flex items-center justify-center">
              {activeRequests.length}
            </span>
          </button>
        </div>

        {activeTab === 'providers' ? (
          /* Specialists Directory View */
          <div className="space-y-6">
            
            {/* Search Bar & Category Filter */}
            <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#233D4D]/15 flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What needs fixing? (e.g. Shutter error, MacBook screen, motor, drone...)"
                  className="w-full pl-11 pr-4 py-2.5 bg-[#EAECF0] rounded-xl text-xs font-medium text-[#000000] focus:ring-2 focus:ring-[#FE7F2D] outline-none"
                />
              </div>

              <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-[#233D4D] text-white'
                        : 'bg-[#EAECF0] text-[#233D4D] hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Providers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProviders.map((prov) => (
                <div
                  key={prov.id}
                  id={`repair-provider-${prov.id}`}
                  className="bg-white rounded-2xl p-6 shadow-xs hover:shadow-lg transition-all border border-[#233D4D]/10 flex flex-col justify-between group"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3.5">
                        <img
                          src={prov.avatar}
                          alt={prov.name}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-[#233D4D]/20 shadow-xs"
                        />
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <h3 className="font-display font-extrabold text-base text-[#000000]">{prov.name}</h3>
                            {prov.verified && (
                              <span className="w-4 h-4 bg-[#FE7F2D] text-[#000000] rounded-full flex items-center justify-center text-[10px] font-black">
                                ✓
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-[#233D4D] mt-0.5 font-medium">
                            <span className="flex items-center text-[#FE7F2D] font-bold">
                              <Star className="w-3.5 h-3.5 fill-[#FE7F2D] mr-1" />
                              {prov.rating} ({prov.reviewsCount} reviews)
                            </span>
                            <span>•</span>
                            <span className="text-gray-500 font-semibold">{prov.distance} away</span>
                          </div>
                        </div>
                      </div>

                      <span className="text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                        {prov.availability.split(' ')[0]}
                      </span>
                    </div>

                    {/* Specialization */}
                    <div className="mt-4 bg-[#EAECF0] p-3 rounded-xl space-y-1">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#233D4D]">
                        Specialization
                      </div>
                      <p className="text-xs text-[#000000] font-semibold leading-tight">
                        {prov.specialization}
                      </p>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-3 mt-3 text-xs">
                      <div className="bg-[#EAECF0]/60 p-2.5 rounded-lg">
                        <span className="text-[10px] text-gray-500 block">Est. Labor / Diagnosis</span>
                        <span className="font-extrabold text-[#000000]">{prov.estimatedPrice}</span>
                      </div>
                      <div className="bg-[#EAECF0]/60 p-2.5 rounded-lg">
                        <span className="text-[10px] text-gray-500 block">Avg Turnaround</span>
                        <span className="font-extrabold text-[#233D4D]">{prov.turnaroundTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action CTA */}
                  <div className="mt-5 pt-3 border-t border-[#EAECF0] flex items-center justify-between">
                    <span className="text-[11px] text-gray-500">
                      {prov.completedRepairs}+ repairs completed
                    </span>
                    <button
                      id={`btn-request-repair-${prov.id}`}
                      onClick={() => onOpenCreateRepair(prov.category, prov.name)}
                      className="bg-[#233D4D] hover:bg-[#FE7F2D] hover:text-[#000000] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors flex items-center space-x-1.5"
                    >
                      <span>Request Repair</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              ))}
            </div>

          </div>
        ) : (
          /* Active Requests Tracker View */
          <div className="space-y-4">
            {activeRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl p-6 shadow-xs border border-[#233D4D]/10 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-[#233D4D] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        {req.category}
                      </span>
                      <span className="text-xs font-mono font-bold text-gray-500">ID: {req.id}</span>
                      <span className="text-xs text-gray-400">• Submitted on {req.submittedDate}</span>
                    </div>
                    <h3 className="text-lg font-display font-extrabold text-[#000000] mt-1">
                      {req.productName} ({req.brandModel})
                    </h3>
                  </div>

                  <span className="inline-block bg-[#FE7F2D]/20 text-[#000000] text-xs font-black px-3 py-1 rounded-full border border-[#FE7F2D]/40">
                    Status: {req.status}
                  </span>
                </div>

                <div className="bg-[#EAECF0] p-3 rounded-xl text-xs text-[#233D4D] flex items-start space-x-2">
                  <FileText className="w-4 h-4 text-[#233D4D] shrink-0 mt-0.5" />
                  <p><strong>Reported Problem:</strong> {req.problemDescription}</p>
                </div>

                {/* Progress bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-lg font-bold border border-emerald-200">
                    ✓ 1. Request Submitted
                  </div>
                  <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-lg font-bold border border-emerald-200">
                    ✓ 2. Provider: {req.providerName || 'TechFix Pro'}
                  </div>
                  <div className={`p-2.5 rounded-lg font-bold ${
                    req.status === 'Quotation' || req.status === 'In Repair' ? 'bg-amber-50 text-amber-900 border border-amber-300' : 'bg-gray-100 text-gray-400'
                  }`}>
                    3. Quotation: ₹{req.quotationAmount}
                  </div>
                  <div className={`p-2.5 rounded-lg font-bold ${
                    req.status === 'In Repair' ? 'bg-blue-50 text-blue-900 border border-blue-200' : 'bg-gray-100 text-gray-400'
                  }`}>
                    4. Repair in Progress
                  </div>
                </div>

                {req.status === 'Quotation' && (
                  <div className="bg-[#233D4D] text-white p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-300 block">Quotation received from {req.providerName}</span>
                      <span className="text-lg font-extrabold text-[#FE7F2D]">₹{req.quotationAmount} (Parts & 6-month warranty included)</span>
                    </div>
                    <button
                      onClick={() => {
                        if (onApproveQuotation) {
                          onApproveQuotation(req.id);
                        }
                      }}
                      className="bg-[#FE7F2D] hover:bg-[#FE7F2D]/90 text-[#000000] font-black text-xs px-4 py-2 rounded-lg transition-transform active:scale-95"
                    >
                      Approve & Authorize Repair
                    </button>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
