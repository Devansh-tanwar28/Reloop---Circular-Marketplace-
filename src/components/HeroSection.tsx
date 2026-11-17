import React, { useState } from 'react';
import { 
  Repeat, 
  Wrench, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Leaf, 
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  Package,
  Layers
} from 'lucide-react';
import { NavigationPage } from '../types';

interface HeroSectionProps {
  onNavigate: (page: NavigationPage) => void;
  onOpenCreateListing: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate, onOpenCreateListing }) => {
  const [activeCycleStep, setActiveCycleStep] = useState<number>(2); // Default on RENT

  const cycleSteps = [
    {
      id: 0,
      label: 'OWN',
      subtitle: 'Acquire high quality products',
      icon: Package,
      desc: 'You buy or hold premium equipment, electronics, or gear with durable utility.',
      color: '#233D4D'
    },
    {
      id: 1,
      label: 'USE',
      subtitle: 'Active user lifecycle',
      icon: Layers,
      desc: 'Enjoy full utility while keeping the product in documented, certified condition.',
      color: '#233D4D'
    },
    {
      id: 2,
      label: 'RENT',
      subtitle: 'Share idle value',
      icon: Repeat,
      desc: 'Monetize idle days. Renters get access without heavy purchase costs; owners earn passive income.',
      color: '#FE7F2D'
    },
    {
      id: 3,
      label: 'REUSE',
      subtitle: 'Multiple happy renters',
      icon: RotateCcw,
      desc: 'Escrow deposits & timestamped condition logs protect both parties at every handover.',
      color: '#FE7F2D'
    },
    {
      id: 4,
      label: 'REPAIR',
      subtitle: 'Restore & extend health',
      icon: Wrench,
      desc: 'Certified repair specialists diagnose & fix wear-and-tear before obsolescence occurs.',
      color: '#233D4D'
    },
    {
      id: 5,
      label: 'RESELL',
      subtitle: 'Pass to next owner',
      icon: ShoppingBag,
      desc: 'Liquidate verified gear with full maintenance pedigree. The loop continues for a new owner!',
      color: '#FE7F2D'
    }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#EAECF0] to-[#EAECF0]/50 pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-[#233D4D]/10">
      
      {/* Subtle background circular accent */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FE7F2D]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#233D4D]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* Tagline pill */}
            <div className="inline-flex items-center space-x-2 bg-white px-3.5 py-1.5 rounded-full border border-[#233D4D]/15 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#FE7F2D] animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#233D4D]">The Circular Commerce Platform</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-[#000000] tracking-tight leading-[1.08]">
              Give Every Product a <span className="text-[#FE7F2D] underline decoration-[#233D4D]/20 decoration-wavy decoration-2">Longer Life.</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-lg sm:text-xl text-[#233D4D] font-normal leading-relaxed max-w-xl">
              <strong>Rent</strong> what you need. <strong>Repair</strong> what you own. <strong>Resell</strong> what you no longer use.
            </p>

            {/* Differentiator bullet points */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 pb-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-[#233D4D]">
                <ShieldCheck className="w-4 h-4 text-[#FE7F2D] shrink-0" />
                <span>Verified Escrow</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-bold text-[#233D4D]">
                <Sparkles className="w-4 h-4 text-[#FE7F2D] shrink-0" />
                <span>AI Condition Proof</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-bold text-[#233D4D]">
                <Leaf className="w-4 h-4 text-[#233D4D] shrink-0" />
                <span>Zero-Waste Loop</span>
              </div>
            </div>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                id="hero-btn-explore"
                onClick={() => onNavigate('rent')}
                className="bg-[#FE7F2D] hover:bg-[#FE7F2D]/90 text-[#000000] font-bold px-7 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center space-x-2 text-base active:scale-95"
              >
                <span>Explore Marketplace</span>
                <ArrowRight className="w-4 h-4 text-[#000000]" />
              </button>

              <button
                id="hero-btn-list"
                onClick={() => onNavigate('resell')}
                className="bg-[#233D4D] hover:bg-[#233D4D]/90 text-white font-bold px-6 py-3.5 rounded-xl shadow-sm transition-all flex items-center space-x-2 text-base"
              >
                <span>List an Item</span>
              </button>
            </div>

            {/* Micro stats banner */}
            <div className="pt-6 border-t border-[#233D4D]/10 flex items-center space-x-8 text-xs text-[#233D4D]">
              <div>
                <span className="font-extrabold text-base text-[#000000] block">14,200+</span>
                <span className="text-gray-600">Products Circulating</span>
              </div>
              <div className="w-px h-8 bg-gray-300" />
              <div>
                <span className="font-extrabold text-base text-[#000000] block">₹2.4 Cr+</span>
                <span className="text-gray-600">Value Preserved</span>
              </div>
              <div className="w-px h-8 bg-gray-300" />
              <div>
                <span className="font-extrabold text-base text-[#000000] block">99.4%</span>
                <span className="text-gray-600">Dispute-Free Rate</span>
              </div>
            </div>

          </div>

          {/* Right Column: Circular Lifecycle Visual Illustration */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-[#233D4D]/15 relative">
              
              {/* Header inside card */}
              <div className="flex items-center justify-between pb-4 border-b border-[#EAECF0]">
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#233D4D]">Circular Lifecycle Architecture</h2>
                  <p className="text-sm font-extrabold text-[#000000]">Product Journey on ReLoop</p>
                </div>
                <div className="flex items-center space-x-1 bg-[#EAECF0] px-2.5 py-1 rounded-full text-[11px] font-bold text-[#233D4D]">
                  <RotateCcw className="w-3.5 h-3.5 text-[#FE7F2D]" />
                  <span>Continuous Flow</span>
                </div>
              </div>

              {/* Lifecycle Interactive Visual Grid */}
              <div className="py-6 relative">
                
                {/* Horizontal flow line indicator */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 relative z-10">
                  {cycleSteps.map((step, idx) => {
                    const isSelected = activeCycleStep === step.id;
                    const IconComp = step.icon;
                    return (
                      <button
                        key={step.id}
                        id={`lifecycle-node-${step.label.toLowerCase()}`}
                        onClick={() => setActiveCycleStep(step.id)}
                        className={`flex flex-col items-center p-2.5 rounded-xl transition-all text-center relative group ${
                          isSelected 
                            ? 'bg-[#233D4D] text-white shadow-md ring-2 ring-[#FE7F2D]' 
                            : 'bg-[#EAECF0]/60 hover:bg-[#EAECF0] text-[#233D4D]'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1.5 transition-transform group-hover:scale-110 ${
                          isSelected ? 'bg-[#FE7F2D] text-[#000000]' : 'bg-white text-[#233D4D] shadow-xs'
                        }`}>
                          <IconComp className="w-4 h-4" />
                        </div>
                        <span className="text-[11px] font-black tracking-tight">{step.label}</span>
                        <span className="text-[9px] opacity-70 font-semibold mt-0.5">0{idx + 1}</span>

                        {/* Arrow indicator between nodes */}
                        {idx < cycleSteps.length - 1 && (
                          <div className="hidden sm:block absolute -right-2 top-6 z-20 text-[#FE7F2D] text-xs font-bold">
                            →
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Return Loop Back Line Animation */}
                <div className="mt-4 pt-4 border-t border-dashed border-[#233D4D]/20 flex items-center justify-between text-xs text-[#233D4D] px-2 bg-[#EAECF0]/30 rounded-lg py-2">
                  <div className="flex items-center space-x-2">
                    <RotateCcw className="w-4 h-4 text-[#FE7F2D] animate-spin-slow" />
                    <span className="font-bold">Next Owner Takes Over</span>
                  </div>
                  <span className="text-[11px] text-gray-500 italic">Loop repeats instead of disposal</span>
                  <span className="font-mono text-[11px] font-bold text-[#FE7F2D]">Zero E-Waste</span>
                </div>

              </div>

              {/* Dynamic Information Panel about the active stage */}
              <div className="bg-[#233D4D] text-white p-4 rounded-xl flex items-start space-x-3.5 transition-all">
                <div className="w-9 h-9 rounded-lg bg-[#FE7F2D] text-[#000000] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  {activeCycleStep + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold text-white flex items-center space-x-1.5">
                      <span>Phase: {cycleSteps[activeCycleStep].label}</span>
                      <span className="text-xs text-[#FE7F2D] font-normal">— {cycleSteps[activeCycleStep].subtitle}</span>
                    </h3>
                  </div>
                  <p className="text-xs text-[#EAECF0]/90 mt-1 leading-relaxed">
                    {cycleSteps[activeCycleStep].desc}
                  </p>
                </div>
              </div>

              {/* Quick Action links for the 3 major pillars */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                <button
                  onClick={() => onNavigate('rent')}
                  className="bg-[#EAECF0] hover:bg-[#FE7F2D] hover:text-[#000000] text-[#233D4D] text-xs font-bold py-2 rounded-lg text-center transition-colors"
                >
                  Rent Gear →
                </button>
                <button
                  onClick={() => onNavigate('repair')}
                  className="bg-[#EAECF0] hover:bg-[#233D4D] hover:text-white text-[#233D4D] text-xs font-bold py-2 rounded-lg text-center transition-colors"
                >
                  Book Repair →
                </button>
                <button
                  onClick={() => onNavigate('resell')}
                  className="bg-[#EAECF0] hover:bg-[#FE7F2D] hover:text-[#000000] text-[#233D4D] text-xs font-bold py-2 rounded-lg text-center transition-colors"
                >
                  Resell Item →
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
