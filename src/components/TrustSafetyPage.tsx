import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Camera, 
  Scale, 
  CheckCircle2, 
  ArrowRight, 
  FileCheck, 
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Users
} from 'lucide-react';
import { NavigationPage } from '../types';

interface TrustSafetyPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const TrustSafetyPage: React.FC<TrustSafetyPageProps> = ({ onNavigate }) => {
  return (
    <div className="py-10 bg-[#EAECF0]/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 bg-white px-3.5 py-1.5 rounded-full text-xs font-bold text-[#233D4D] border border-[#233D4D]/10 mb-3 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Trust Infrastructure</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-[#000000] tracking-tight">
            Trust & Safety at Every Step
          </h1>
          <p className="mt-3 text-base text-[#233D4D]">
            A circular marketplace only functions when trust is mathematically and procedurally guaranteed. Here is how ReLoop protects every rental, repair, and resale.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          
          {/* Card 1: User Verification */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#233D4D]/10 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#233D4D] text-[#FE7F2D] flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-display font-extrabold text-lg text-[#000000] mb-2">
                User Verification
              </h3>
              <p className="text-xs text-[#233D4D] leading-relaxed mb-4">
                Government ID checks, phone OTP, and escrow payment tokenization ensure high-trust members across the community.
              </p>
            </div>
            <ul className="space-y-1.5 text-[11px] text-[#233D4D] font-semibold border-t border-[#EAECF0] pt-3">
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Govt ID & Address KYC</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Owner badges</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Security Deposit */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#233D4D]/10 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#FE7F2D] text-[#000000] flex items-center justify-center mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-display font-extrabold text-lg text-[#000000] mb-2">
                Security Deposit
              </h3>
              <p className="text-xs text-[#233D4D] leading-relaxed mb-4">
                Refundable deposits protect against damage or unreturned items. Funds remain locked in neutral Escrow until check-in is complete.
              </p>
            </div>
            <ul className="space-y-1.5 text-[11px] text-[#233D4D] font-semibold border-t border-[#EAECF0] pt-3">
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Escrow protected</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Instant auto-refund upon check-in</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Condition Evidence */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#233D4D]/10 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#233D4D] text-white flex items-center justify-center mb-4">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="font-display font-extrabold text-lg text-[#000000] mb-2">
                Condition Evidence
              </h3>
              <p className="text-xs text-[#233D4D] leading-relaxed mb-4">
                Pickup and return HD photographs establish an immutable condition record, preventing frivolous claims.
              </p>
            </div>
            <ul className="space-y-1.5 text-[11px] text-[#233D4D] font-semibold border-t border-[#EAECF0] pt-3">
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Time-stamped photo logs</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Assistive AI surface comparison</span>
              </li>
            </ul>
          </div>

          {/* Card 4: Dispute Resolution */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#233D4D]/10 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#233D4D] text-[#FE7F2D] flex items-center justify-center mb-4">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="font-display font-extrabold text-lg text-[#000000] mb-2">
                Dispute Resolution
              </h3>
              <p className="text-xs text-[#233D4D] leading-relaxed mb-4">
                Transparent claim interface allows mutual settlement or fast human arbitration based on verified pickup vs return evidence.
              </p>
            </div>
            <ul className="space-y-1.5 text-[11px] text-[#233D4D] font-semibold border-t border-[#EAECF0] pt-3">
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Neutral ReLoop arbitration team</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Standardized repair cost index</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Visual Lifecycle Process Diagram Card */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#233D4D]/15 space-y-8 mb-10">
          <div className="border-b border-[#EAECF0] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#233D4D]">End-to-End Visual Flow</span>
              <h2 className="font-display font-extrabold text-xl text-[#000000]">Condition & Deposit Lifecycle</h2>
            </div>
            <span className="text-xs text-gray-500 font-medium">Standardized for all rental transactions</span>
          </div>

          {/* 6 Step Visual Flow */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 relative">
            {[
              { phase: 'BEFORE RENTAL', label: 'Product Condition', sub: 'Baseline specs & photos logged', color: '#233D4D' },
              { phase: 'HANDOVER', label: 'Pickup Photos', sub: 'Dual party photo check-in', color: '#233D4D' },
              { phase: 'ACTIVE', label: 'Rental Period', sub: 'Escrow deposit securely held', color: '#FE7F2D' },
              { phase: 'RETURN', label: 'Return Photos', sub: 'Check-out photo submission', color: '#233D4D' },
              { phase: 'CHECK', label: 'Condition Check', sub: 'AI difference scan & review', color: '#FE7F2D' },
              { phase: 'CLOSURE', label: 'Refund / Claim', sub: 'Deposit released or adjusted', color: '#233D4D' }
            ].map((step, idx) => (
              <div 
                key={idx}
                className="bg-[#EAECF0] p-4 rounded-xl flex flex-col justify-between border border-[#233D4D]/10 relative"
              >
                <div>
                  <span className="text-[10px] font-black uppercase text-[#FE7F2D] block mb-1">
                    {step.phase}
                  </span>
                  <h4 className="font-display font-extrabold text-xs text-[#000000] mb-1">
                    {step.label}
                  </h4>
                  <p className="text-[11px] text-[#233D4D]">{step.sub}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#233D4D]/10 text-[10px] font-bold text-gray-500">
                  Stage 0{idx + 1}
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Demo CTA */}
          <div className="bg-[#233D4D] text-white p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-left">
              <h3 className="font-display font-extrabold text-base text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#FE7F2D]" />
                <span>Interactive Condition Review Prototype</span>
              </h3>
              <p className="text-xs text-[#EAECF0]/80">
                Experience our side-by-side photo difference inspector and AI damage flagging interface.
              </p>
            </div>

            <button
              onClick={() => onNavigate('damage-claim')}
              className="bg-[#FE7F2D] hover:bg-[#FE7F2D]/90 text-[#000000] font-black text-xs px-6 py-3 rounded-xl shadow-md transition-all shrink-0 flex items-center space-x-2 active:scale-95"
            >
              <span>Launch Dispute Inspector</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
