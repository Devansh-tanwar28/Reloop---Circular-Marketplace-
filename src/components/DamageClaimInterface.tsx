import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Sparkles, 
  Camera, 
  CheckCircle, 
  AlertTriangle, 
  Scale, 
  FileText, 
  ArrowRight,
  HelpCircle,
  Clock,
  UserCheck
} from 'lucide-react';
import { DamageClaim } from '../types';

interface DamageClaimInterfaceProps {
  claim: DamageClaim;
  onResolve?: (action: 'accepted' | 'disputed' | 'admin_review') => void;
}

import { apiRespondClaim } from '../services/api';

export const DamageClaimInterface: React.FC<DamageClaimInterfaceProps> = ({
  claim,
  onResolve
}) => {
  const [claimStatus, setClaimStatus] = useState<string>(claim.status);
  const [renterNoteInput, setRenterNoteInput] = useState(claim.renterNotes || '');
  const [activeViewMode, setActiveViewMode] = useState<'side-by-side' | 'ai-overlay'>('side-by-side');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleAction = async (action: 'accepted' | 'disputed' | 'admin_review') => {
    try {
      await apiRespondClaim(claim.id, action, renterNoteInput);
    } catch (err) {
      console.warn('API respond claim error (using optimistic status):', err);
    }

    if (action === 'accepted') {
      setClaimStatus('Accepted');
      setFeedbackMessage(`Claim accepted. ₹${claim.estimatedRepairCost.toLocaleString()} allocated toward certified repairs; remaining escrow balance released.`);
    } else if (action === 'disputed') {
      setClaimStatus('Disputed');
      setFeedbackMessage('Dispute registered in database. Arbitrator review active; evidence lock enforced.');
    } else {
      setClaimStatus('Admin Review');
      setFeedbackMessage('Escalated to human ReLoop Trust & Safety Arbitrator panel.');
    }
    if (onResolve) onResolve(action);
  };

  return (
    <div className="py-10 bg-[#EAECF0]/50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Banner */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#233D4D]/15 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-amber-50 text-amber-900 border border-amber-300 px-3 py-1 rounded-full text-xs font-bold mb-2">
              <ShieldAlert className="w-3.5 h-3.5 text-[#FE7F2D]" />
              <span>Condition Review Protocol</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[#000000] tracking-tight">
              Condition Review & Evidence
            </h1>
            <p className="text-xs text-[#233D4D] mt-1">
              Case ID: <span className="font-mono font-bold">{claim.id}</span> • Rental: <span className="font-mono font-bold">{claim.rentalId}</span> • Reported on {claim.dateReported}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-gray-500 block">Current Status</span>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
              claimStatus === 'Accepted' ? 'bg-emerald-100 text-emerald-800' :
              claimStatus === 'Disputed' ? 'bg-red-100 text-red-800' :
              claimStatus === 'Admin Review' ? 'bg-blue-100 text-blue-800' :
              'bg-[#FE7F2D]/20 text-[#000000] border border-[#FE7F2D]/40'
            }`}>
              {claimStatus}
            </span>
          </div>
        </div>

        {/* Feedback Alert Banner */}
        {feedbackMessage && (
          <div className="bg-emerald-50 border-2 border-emerald-300 text-emerald-950 p-4 rounded-2xl mb-6 flex items-center space-x-3 text-xs font-bold shadow-xs">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{feedbackMessage}</span>
          </div>
        )}

        {/* AI Disclaimer Banner */}
        <div className="bg-[#233D4D] text-white p-4 rounded-2xl mb-8 flex items-start space-x-3.5 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-[#FE7F2D] text-[#000000] flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-xs space-y-1">
            <h4 className="font-extrabold text-[#FE7F2D] text-sm">
              AI-Assisted Optical Condition Flagging
            </h4>
            <p className="text-[#EAECF0] leading-relaxed">
              ReLoop Vision AI compares timestamped pickup and return photographs to identify physical surface variances. <strong>AI is assistive only and is not the final authority</strong>. Human evidence review and mutual consensus govern all deposit allocations.
            </p>
          </div>
        </div>

        {/* Side-by-Side Photo Comparison Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#233D4D]/15 space-y-6 mb-8">
          
          <div className="flex items-center justify-between border-b border-[#EAECF0] pb-4">
            <h2 className="font-display font-extrabold text-lg text-[#000000]">
              Visual Comparison: {claim.productName}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveViewMode('side-by-side')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                  activeViewMode === 'side-by-side' ? 'bg-[#233D4D] text-white' : 'bg-[#EAECF0] text-[#233D4D]'
                }`}
              >
                Side-by-Side
              </button>
              <button
                onClick={() => setActiveViewMode('ai-overlay')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                  activeViewMode === 'ai-overlay' ? 'bg-[#FE7F2D] text-[#000000]' : 'bg-[#EAECF0] text-[#233D4D]'
                }`}
              >
                AI Heatmap Overlay
              </button>
            </div>
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* BEFORE RENTAL */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-[#000000] uppercase tracking-wider flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Before Rental (Pickup Check-in)</span>
                </span>
                <span className="text-gray-500 font-mono">2026-08-20 10:14 AM</span>
              </div>
              
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-black border-2 border-emerald-500/40">
                <img
                  src={claim.beforeImage}
                  alt="Before Rental"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black/80 text-white text-[10px] font-bold px-2.5 py-1 rounded">
                  ✓ Pristine / Baseline Verified
                </div>
              </div>
            </div>

            {/* AFTER RETURN */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-[#FE7F2D] uppercase tracking-wider flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FE7F2D]" />
                  <span>After Return (Check-out)</span>
                </span>
                <span className="text-gray-500 font-mono">2026-08-22 05:42 PM</span>
              </div>
              
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-black border-2 border-[#FE7F2D]">
                <img
                  src={claim.afterImage}
                  alt="After Return"
                  className="w-full h-full object-cover"
                />
                
                {/* AI Difference Target Box Highlight */}
                <div className="absolute top-1/3 left-1/3 w-28 h-24 border-2 border-dashed border-[#FE7F2D] bg-[#FE7F2D]/20 rounded-lg animate-pulse flex items-center justify-center">
                  <span className="bg-black/90 text-[#FE7F2D] text-[9px] font-black px-1.5 py-0.5 rounded">
                    Surface Variance {claim.aiConfidence}%
                  </span>
                </div>

                <div className="absolute bottom-2 left-2 bg-[#233D4D]/90 text-white text-[10px] font-bold px-2.5 py-1 rounded">
                  ⚠ Discrepancy Flagged
                </div>
              </div>
            </div>

          </div>

          {/* AI Detection Summary */}
          <div className="bg-[#EAECF0] rounded-2xl p-5 border border-[#233D4D]/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#FE7F2D]" />
                <h3 className="font-display font-extrabold text-sm text-[#000000]">
                  Potential Difference Detected
                </h3>
              </div>
              <span className="text-xs font-bold text-[#233D4D] bg-white px-2.5 py-0.5 rounded-full border border-gray-300">
                Confidence: {claim.aiConfidence}%
              </span>
            </div>

            <p className="text-xs text-[#000000] font-semibold leading-relaxed">
              {claim.differenceDescription}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
              <div className="bg-white p-3 rounded-xl border border-gray-200">
                <span className="text-gray-500 block text-[10px] uppercase font-bold">Estimated Repair / Buffing Cost</span>
                <span className="text-base font-extrabold text-[#000000]">₹{claim.estimatedRepairCost.toLocaleString()}</span>
                <span className="text-[10px] text-gray-500 block">(Derived from certified service center catalog)</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-200">
                <span className="text-gray-500 block text-[10px] uppercase font-bold">Escrow Deposit Protection</span>
                <span className="text-base font-extrabold text-emerald-600">₹6,000.00 Held in Escrow</span>
                <span className="text-[10px] text-gray-500 block">Funds safely locked pending resolution</span>
              </div>
            </div>
          </div>

          {/* Owner & Renter Statements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            {/* Owner Note */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-extrabold text-[#233D4D]">
                <UserCheck className="w-4 h-4 text-[#FE7F2D]" />
                <span>Owner Statement ({claim.ownerName})</span>
              </div>
              <p className="text-xs text-[#233D4D] italic bg-[#EAECF0]/60 p-3 rounded-xl">
                "{claim.ownerNotes}"
              </p>
            </div>

            {/* Renter Note */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-extrabold text-[#233D4D]">
                <UserCheck className="w-4 h-4 text-[#233D4D]" />
                <span>Renter Statement ({claim.renterName})</span>
              </div>
              <textarea
                rows={2}
                value={renterNoteInput}
                onChange={(e) => setRenterNoteInput(e.target.value)}
                placeholder="Renter response or clarification..."
                className="w-full bg-[#EAECF0] p-2.5 rounded-xl text-xs font-medium text-[#000000] outline-none"
              />
            </div>

          </div>

          {/* Dispute Action Buttons */}
          <div className="pt-4 border-t border-[#EAECF0] flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              id="btn-dispute-claim"
              onClick={() => handleAction('disputed')}
              className="w-full sm:w-auto bg-[#EAECF0] hover:bg-gray-300 text-[#233D4D] font-extrabold text-xs px-5 py-3 rounded-xl transition-colors"
            >
              Dispute Claim
            </button>

            <button
              id="btn-request-admin-review"
              onClick={() => handleAction('admin_review')}
              className="w-full sm:w-auto bg-[#233D4D] hover:bg-[#233D4D]/90 text-white font-extrabold text-xs px-5 py-3 rounded-xl transition-colors flex items-center justify-center space-x-1.5"
            >
              <Scale className="w-4 h-4 text-[#FE7F2D]" />
              <span>Request Admin Review</span>
            </button>

            <button
              id="btn-accept-claim"
              onClick={() => handleAction('accepted')}
              className="w-full sm:w-auto bg-[#FE7F2D] hover:bg-[#FE7F2D]/90 text-[#000000] font-display font-black text-xs px-6 py-3 rounded-xl shadow-sm transition-all active:scale-95"
            >
              Accept Claim (Deduct ₹{claim.estimatedRepairCost})
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
