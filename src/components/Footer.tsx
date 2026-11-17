import React from 'react';
import { 
  Repeat, 
  Wrench, 
  ShoppingBag, 
  ShieldCheck, 
  Sparkles, 
  Scale, 
  RotateCcw,
  Heart,
  ExternalLink
} from 'lucide-react';
import { NavigationPage } from '../types';

interface FooterProps {
  onNavigate: (page: NavigationPage) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#233D4D] text-[#EAECF0] border-t border-white/10 pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-2.5 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-[#FE7F2D] flex items-center justify-center text-[#000000] font-display font-black text-lg shadow-sm">
                R
              </div>
              <span className="font-display font-black text-2xl tracking-tight text-white">
                Re<span className="text-[#FE7F2D]">Loop</span>
              </span>
            </div>

            <p className="text-xs text-[#EAECF0]/80 max-w-sm leading-relaxed">
              "One platform to Rent, Repair & Resell — giving products a longer life."
            </p>

            <div className="pt-2 text-xs text-[#EAECF0]/60 space-y-1">
              <p>Designed for Bengaluru's circular tech, creator, and builder ecosystem.</p>
              <div className="inline-flex items-center space-x-1 text-[#FE7F2D] text-xs font-semibold">
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Zero single-use electronics waste goal</span>
              </div>
            </div>
          </div>

          {/* Column 1: Ecosystem */}
          <div className="space-y-3">
            <h4 className="font-display font-extrabold text-xs text-white uppercase tracking-wider">
              Circular Marketplace
            </h4>
            <ul className="space-y-2 text-xs text-[#EAECF0]/80">
              <li>
                <button 
                  onClick={() => onNavigate('rent')} 
                  className="hover:text-[#FE7F2D] transition-colors"
                >
                  Rent Marketplace
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('repair')} 
                  className="hover:text-[#FE7F2D] transition-colors"
                >
                  Repair Services Network
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('resell')} 
                  className="hover:text-[#FE7F2D] transition-colors"
                >
                  Verified Resell Gear
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('how-it-works')} 
                  className="hover:text-[#FE7F2D] transition-colors"
                >
                  How Circular Flow Works
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Trust & Intelligence */}
          <div className="space-y-3">
            <h4 className="font-display font-extrabold text-xs text-white uppercase tracking-wider">
              Trust & Intelligence
            </h4>
            <ul className="space-y-2 text-xs text-[#EAECF0]/80">
              <li>
                <button 
                  onClick={() => onNavigate('trust-safety')} 
                  className="hover:text-[#FE7F2D] transition-colors"
                >
                  Trust & Safety Infrastructure
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('damage-claim')} 
                  className="hover:text-[#FE7F2D] transition-colors"
                >
                  Condition Review & Dispute Demo
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('ai-features')} 
                  className="hover:text-[#FE7F2D] transition-colors"
                >
                  AI Insights & Smart Pricing
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('dashboard')} 
                  className="hover:text-[#FE7F2D] transition-colors"
                >
                  My User Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform & Admin */}
          <div className="space-y-3">
            <h4 className="font-display font-extrabold text-xs text-white uppercase tracking-wider">
              Prototype Navigation
            </h4>
            <ul className="space-y-2 text-xs text-[#EAECF0]/80">
              <li>
                <button 
                  onClick={() => onNavigate('admin')} 
                  className="bg-[#1A2E3B] text-[#FE7F2D] hover:bg-[#FE7F2D] hover:text-[#000000] px-2.5 py-1 rounded-md text-xs font-bold transition-colors inline-block"
                >
                  ⚡ Admin Control Panel
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('profile')} 
                  className="hover:text-[#FE7F2D] transition-colors"
                >
                  User Profile & Badges
                </button>
              </li>
              <li className="text-[11px] text-gray-400 pt-1">
                Academic Prototype: Bengaluru 2026
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#EAECF0]/60 gap-3">
          <p>© 2026 ReLoop Platform. Circular Product Ecosystem Prototype.</p>
          <div className="flex items-center space-x-4">
            <span>#000000 • #233D4D • #FE7F2D • #EAECF0</span>
            <span>•</span>
            <span className="text-[#FE7F2D] font-bold">Rent • Repair • Resell</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
