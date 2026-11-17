import React from 'react';
import { 
  Calendar, 
  Wrench, 
  ShoppingBag, 
  CheckCircle2, 
  ArrowRight, 
  Shield, 
  FileCheck, 
  Clock, 
  DollarSign, 
  MessageSquare, 
  Sparkles 
} from 'lucide-react';
import { NavigationPage } from '../types';

interface CoreServicesProps {
  onNavigate: (page: NavigationPage) => void;
}

export const CoreServices: React.FC<CoreServicesProps> = ({ onNavigate }) => {
  return (
    <section className="py-16 bg-[#EAECF0]/60 border-b border-[#233D4D]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 bg-white px-3 py-1 rounded-full border border-[#233D4D]/10 mb-3 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#FE7F2D]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#233D4D]">Ecosystem Pillars</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#000000] tracking-tight">
            Three Ways to Close the Loop
          </h2>
          <p className="mt-3 text-base text-[#233D4D] font-normal">
            Whether you want short-term access, reliable repair diagnostics, or to liquidate pre-owned gear with documented condition.
          </p>
        </div>

        {/* 3 Large Interactive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* 1. RENT CARD (#FE7F2D main accent) */}
          <div 
            id="card-service-rent"
            className="bg-white rounded-2xl p-7 shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-[#FE7F2D] flex flex-col justify-between group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FE7F2D]/10 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />

            <div>
              <div className="w-14 h-14 rounded-xl bg-[#FE7F2D] text-[#000000] flex items-center justify-center mb-6 shadow-sm">
                <Calendar className="w-7 h-7" />
              </div>

              <div className="inline-block text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#FE7F2D]/20 text-[#000000] mb-2">
                Short-Term Access
              </div>

              <h3 className="text-2xl font-display font-extrabold text-[#000000] tracking-tight mb-3">
                RENT
              </h3>

              <p className="text-sm font-medium text-[#233D4D] mb-6 leading-relaxed">
                Rent products when you need them — without buying them.
              </p>

              {/* Features list */}
              <ul className="space-y-3 mb-8">
                <li className="flex items-start space-x-2.5 text-xs text-[#233D4D] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#FE7F2D] shrink-0 mt-0.5" />
                  <span>Flexible duration (Daily, weekly, or monthly)</span>
                </li>
                <li className="flex items-start space-x-2.5 text-xs text-[#233D4D] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#FE7F2D] shrink-0 mt-0.5" />
                  <span>Security deposit held safely in Escrow</span>
                </li>
                <li className="flex items-start space-x-2.5 text-xs text-[#233D4D] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#FE7F2D] shrink-0 mt-0.5" />
                  <span>100% Verified listings & owner background</span>
                </li>
                <li className="flex items-start space-x-2.5 text-xs text-[#233D4D] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#FE7F2D] shrink-0 mt-0.5" />
                  <span>Condition tracking & photo timestamp logs</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onNavigate('rent')}
              className="w-full bg-[#FE7F2D] hover:bg-[#FE7F2D]/90 text-[#000000] font-extrabold py-3.5 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center space-x-2 text-sm active:scale-98"
            >
              <span>Explore Rentals</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 2. REPAIR CARD (#233D4D dominant accent) */}
          <div 
            id="card-service-repair"
            className="bg-[#233D4D] text-white rounded-2xl p-7 shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-white/30 flex flex-col justify-between group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />

            <div>
              <div className="w-14 h-14 rounded-xl bg-white text-[#233D4D] flex items-center justify-center mb-6 shadow-sm">
                <Wrench className="w-7 h-7" />
              </div>

              <div className="inline-block text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded bg-white/15 text-[#EAECF0] mb-2">
                Lifespan Extension
              </div>

              <h3 className="text-2xl font-display font-extrabold text-white tracking-tight mb-3">
                REPAIR
              </h3>

              <p className="text-sm font-medium text-[#EAECF0] mb-6 leading-relaxed">
                Give your products a second life through trusted repair services.
              </p>

              {/* Features list */}
              <ul className="space-y-3 mb-8">
                <li className="flex items-start space-x-2.5 text-xs text-[#EAECF0] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#FE7F2D] shrink-0 mt-0.5" />
                  <span>Instant repair requests with photo diagnostics</span>
                </li>
                <li className="flex items-start space-x-2.5 text-xs text-[#EAECF0] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#FE7F2D] shrink-0 mt-0.5" />
                  <span>Vetted local specialist service providers</span>
                </li>
                <li className="flex items-start space-x-2.5 text-xs text-[#EAECF0] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#FE7F2D] shrink-0 mt-0.5" />
                  <span>Transparent competitive quotations</span>
                </li>
                <li className="flex items-start space-x-2.5 text-xs text-[#EAECF0] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#FE7F2D] shrink-0 mt-0.5" />
                  <span>Real-time stage-by-stage repair tracking</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onNavigate('repair')}
              className="w-full bg-white hover:bg-[#EAECF0] text-[#233D4D] font-extrabold py-3.5 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center space-x-2 text-sm active:scale-98"
            >
              <span>Find Repair</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 3. RESELL CARD (Balanced combo #FE7F2D and #233D4D) */}
          <div 
            id="card-service-resell"
            className="bg-white rounded-2xl p-7 shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-[#233D4D] flex flex-col justify-between group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#233D4D]/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />

            <div>
              <div className="w-14 h-14 rounded-xl bg-[#233D4D] text-[#FE7F2D] flex items-center justify-center mb-6 shadow-sm">
                <ShoppingBag className="w-7 h-7" />
              </div>

              <div className="inline-block text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#233D4D]/10 text-[#233D4D] mb-2">
                Circular Secondary Market
              </div>

              <h3 className="text-2xl font-display font-extrabold text-[#000000] tracking-tight mb-3">
                RESELL
              </h3>

              <p className="text-sm font-medium text-[#233D4D] mb-6 leading-relaxed">
                Turn unused products into value by selling them to someone who needs them.
              </p>

              {/* Features list */}
              <ul className="space-y-3 mb-8">
                <li className="flex items-start space-x-2.5 text-xs text-[#233D4D] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#233D4D] shrink-0 mt-0.5" />
                  <span>Easy 2-minute listing with AI price guidance</span>
                </li>
                <li className="flex items-start space-x-2.5 text-xs text-[#233D4D] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#233D4D] shrink-0 mt-0.5" />
                  <span>Certified condition & original purchase specs</span>
                </li>
                <li className="flex items-start space-x-2.5 text-xs text-[#233D4D] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#233D4D] shrink-0 mt-0.5" />
                  <span>Direct buyer interaction with identity check</span>
                </li>
                <li className="flex items-start space-x-2.5 text-xs text-[#233D4D] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#233D4D] shrink-0 mt-0.5" />
                  <span>Secure payout directly to your bank account</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onNavigate('resell')}
              className="w-full bg-[#233D4D] hover:bg-[#233D4D]/90 text-white font-extrabold py-3.5 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center space-x-2 text-sm active:scale-98"
            >
              <span>Start Selling</span>
              <ArrowRight className="w-4 h-4 text-[#FE7F2D]" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
