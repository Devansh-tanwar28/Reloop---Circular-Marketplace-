import React, { useState } from 'react';
import { 
  PlusCircle, 
  Search, 
  CreditCard, 
  ShieldCheck, 
  RotateCcw, 
  ArrowRight,
  Sparkles,
  Camera,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { NavigationPage } from '../types';

interface HowItWorksProps {
  onNavigate?: (page: NavigationPage) => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onNavigate }) => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      num: '01',
      title: 'LIST',
      summary: 'Owner lists a product.',
      detail: 'List any idle electronics, cameras, tools, or appliances. Upload photos, set rental/resell rates, or request a verified inspection.',
      icon: PlusCircle,
      badge: 'Owner / Seller'
    },
    {
      num: '02',
      title: 'DISCOVER',
      summary: 'Find based on filters.',
      detail: 'Users discover products filtered by category, micro-location radius, price, verified owner score, and live calendar availability.',
      icon: Search,
      badge: 'Renter / Buyer'
    },
    {
      num: '03',
      title: 'TRANSACT',
      summary: 'Rent, repair or resell securely.',
      detail: 'Escrow locks the security deposit and funds. Both parties receive a standardized digital agreement with clear terms.',
      icon: CreditCard,
      badge: 'Escrow Engine'
    },
    {
      num: '04',
      title: 'VERIFY',
      summary: 'Evidence & records build trust.',
      detail: 'Pickup and return photos are logged in timestamped condition ledgers. AI assists in detecting any condition differences.',
      icon: ShieldCheck,
      badge: 'AI & Trust'
    },
    {
      num: '05',
      title: 'RELOOP',
      summary: 'Product continues its lifecycle.',
      detail: 'Instead of becoming unused in a drawer or turning into e-waste, the product moves to its next user, repair shop, or happy owner.',
      icon: RotateCcw,
      badge: 'Zero Waste'
    }
  ];

  return (
    <section className="py-16 bg-white border-b border-[#233D4D]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 bg-[#EAECF0] px-3.5 py-1 rounded-full text-xs font-bold text-[#233D4D] mb-3">
            <RotateCcw className="w-3.5 h-3.5 text-[#FE7F2D]" />
            <span className="uppercase tracking-wider">How It Works</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#000000] tracking-tight">
            The 5-Step ReLoop Engine
          </h2>
          <p className="mt-3 text-base text-[#233D4D]">
            A seamless, verified flow designed to keep valuable gear actively useful while eliminating friction and fraud.
          </p>
        </div>

        {/* 5-Step Horizontal Process */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isSelected = activeStep === index;
            return (
              <div 
                key={step.num}
                id={`how-it-works-step-${step.num}`}
                onClick={() => setActiveStep(index)}
                className={`p-5 rounded-2xl cursor-pointer transition-all border flex flex-col justify-between relative group ${
                  isSelected 
                    ? 'bg-[#233D4D] text-white border-[#FE7F2D] shadow-lg ring-2 ring-[#FE7F2D]/40' 
                    : 'bg-[#EAECF0]/40 text-[#233D4D] border-[#EAECF0] hover:bg-[#EAECF0] hover:border-[#233D4D]/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xl font-display font-black ${
                      isSelected ? 'text-[#FE7F2D]' : 'text-[#233D4D]'
                    }`}>
                      {step.num}
                    </span>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-[#FE7F2D] text-[#000000]' : 'bg-white text-[#233D4D] shadow-xs'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-lg font-display font-extrabold tracking-tight mb-1">
                    {step.title}
                  </h3>
                  <p className={`text-xs font-semibold mb-3 ${isSelected ? 'text-[#EAECF0]' : 'text-[#233D4D]'}`}>
                    {step.summary}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-current/10">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    isSelected ? 'bg-white/10 text-[#FE7F2D]' : 'bg-[#233D4D]/10 text-[#233D4D]'
                  }`}>
                    {step.badge}
                  </span>
                </div>

                {/* Arrow connector between steps on desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-[#FE7F2D] text-[#000000] items-center justify-center shadow-sm">
                    <ArrowRight className="w-3.5 h-3.5 font-black" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Dynamic Detail Card of Selected Step */}
        <div className="mt-8 bg-[#EAECF0] rounded-2xl p-6 sm:p-8 border border-[#233D4D]/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-white bg-[#233D4D] px-2.5 py-0.5 rounded-full">
                Step {steps[activeStep].num} Deep Dive
              </span>
              <h3 className="text-xl font-display font-extrabold text-[#000000]">
                {steps[activeStep].title} — {steps[activeStep].summary}
              </h3>
            </div>
            <p className="text-sm text-[#233D4D] leading-relaxed">
              {steps[activeStep].detail}
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            {onNavigate && (
              <button
                onClick={() => onNavigate('rent')}
                className="bg-[#FE7F2D] hover:bg-[#FE7F2D]/90 text-[#000000] font-bold text-xs px-5 py-3 rounded-xl shadow-sm transition-all"
              >
                Experience Live Demo →
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
