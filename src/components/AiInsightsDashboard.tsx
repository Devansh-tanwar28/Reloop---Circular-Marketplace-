import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Calculator, 
  Camera, 
  Zap
} from 'lucide-react';
import { ProductCategory, ProductCondition } from '../types';
import { apiCalculateRentVsBuy, apiGetSmartPricing, apiInspectDamage } from '../services/api';

export const AiInsightsDashboard: React.FC = () => {
  // Rent vs Buy Calculator State
  const [plannedDays, setPlannedDays] = useState<number>(4);
  const [itemRetailPrice, setItemRetailPrice] = useState<number>(45000);
  const [dailyRentalRate, setDailyRentalRate] = useState<number>(1200);
  const [rentVsBuyResult, setRentVsBuyResult] = useState<any>(null);

  // Smart Pricing Tool State
  const [pricingCategory, setPricingCategory] = useState<ProductCategory>('Cameras');
  const [pricingCondition, setPricingCondition] = useState<ProductCondition>('Like New');
  const [pricingOriginalMRP, setPricingOriginalMRP] = useState<number>(65000);
  const [pricingAgeMonths, setPricingAgeMonths] = useState<number>(10);
  const [pricingResult, setPricingResult] = useState<any>(null);

  // Assistive Vision Damage Triage State
  const [damageSummary, setDamageSummary] = useState<string>(
    'Potential visual difference detected between pickup and return images on lens ring mount.'
  );
  const [damageSource, setDamageSource] = useState<string>('optical-triage');
  const [isInspecting, setIsInspecting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      apiCalculateRentVsBuy({ plannedDays, itemRetailPrice, dailyRentalRate })
        .then(setRentVsBuyResult)
        .catch(() => {});
    }, 150);
    return () => clearTimeout(timer);
  }, [plannedDays, itemRetailPrice, dailyRentalRate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      apiGetSmartPricing({
        category: pricingCategory,
        condition: pricingCondition,
        originalPrice: pricingOriginalMRP,
        ageMonths: pricingAgeMonths
      })
        .then(setPricingResult)
        .catch(() => {});
    }, 200);
    return () => clearTimeout(timer);
  }, [pricingCategory, pricingCondition, pricingOriginalMRP, pricingAgeMonths]);

  // Fallback computed values before API responds
  const totalRentCost = rentVsBuyResult?.totalRentalCost ?? ((dailyRentalRate * plannedDays) + 150);
  const savings = rentVsBuyResult?.capitalSaved ?? Math.max(0, itemRetailPrice - totalRentCost);
  const breakEvenDays = rentVsBuyResult?.breakEvenDays ?? (dailyRentalRate > 0 ? Math.ceil(itemRetailPrice / dailyRentalRate) : 999);
  const isRentRecommended = rentVsBuyResult?.isRentRecommended ?? (plannedDays < breakEvenDays);

  const calculatedRentalPerDay = pricingResult?.suggestedDailyRate ?? Math.round(pricingOriginalMRP * 0.018);
  const calculatedResellValue = pricingResult?.estimatedResaleValue ?? Math.round(pricingOriginalMRP * (1 - (0.025 * pricingAgeMonths + (pricingCondition === 'Like New' ? 0.15 : 0.30))));

  const handleRunDamageInspection = async () => {
    setIsInspecting(true);
    try {
      const res = await apiInspectDamage({
        productName: 'Sony Alpha A7 IV Full-Frame Camera',
        ownerNotes: 'Hairline surface scratch 1.8mm long near outer lens mount ring.',
        estimatedRepairCost: 3500
      });
      setDamageSummary(res.summary);
      setDamageSource(res.aiSource || 'heuristic-triage');
    } catch {
      // Keep current summary
    } finally {
      setIsInspecting(false);
    }
  };

  return (
    <div className="py-10 bg-[#EAECF0]/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center space-x-2 bg-[#233D4D] text-white px-3.5 py-1.5 rounded-full text-xs font-bold mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#FE7F2D]" />
            <span className="uppercase tracking-wider">AI Intelligence Suite</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-[#000000] tracking-tight">
            AI-Powered Circular Decision Tools
          </h1>
          <p className="text-sm text-[#233D4D] mt-1 max-w-2xl">
            Assistive decision algorithms designed to price fairly, evaluate physical wear-and-tear, and compute accurate Rent vs Buy economics.
          </p>
          
          <div className="mt-3 inline-block bg-amber-50 border border-amber-300 text-amber-950 text-xs px-3 py-1 rounded-lg font-medium">
            <strong>Engine Mode:</strong> {pricingResult?.aiSource === 'gemini-4-hydrogen' ? 'Live Gemini AI + Circular Economic Model' : 'Circular Economic Model (Rule-based fallback active when Gemini API key is unconfigured)'}
          </div>
        </div>

        {/* 2-Column Grid for Interactive AI Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          
          {/* Tool 1: Interactive Rent vs Buy Calculator */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#233D4D]/15 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between border-b border-[#EAECF0] pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-[#FE7F2D] text-[#000000] flex items-center justify-center font-bold">
                    <Calculator className="w-4 h-4" />
                  </div>
                  <h3 className="font-display font-extrabold text-lg text-[#000000]">
                    Rent vs. Buy Calculator
                  </h3>
                </div>
                <span className="text-[10px] font-black uppercase bg-[#EAECF0] text-[#233D4D] px-2 py-0.5 rounded">
                  Economic Model
                </span>
              </div>

              <p className="text-xs text-[#233D4D] mb-5">
                Calculate whether renting or buying outright offers better capital efficiency for your specific usage duration.
              </p>

              {/* Sliders & Inputs */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold text-[#233D4D] mb-1">
                    <span>Planned Usage Days</span>
                    <span className="text-[#FE7F2D] font-extrabold text-sm">{plannedDays} Days</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="60"
                    value={plannedDays}
                    onChange={(e) => setPlannedDays(parseInt(e.target.value))}
                    className="w-full accent-[#FE7F2D]"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400">
                    <span>Weekend (2d)</span>
                    <span>1 Month (30d)</span>
                    <span>2 Months (60d)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-[#233D4D] mb-1">
                      New Item Retail MRP (₹)
                    </label>
                    <input
                      type="number"
                      value={itemRetailPrice}
                      onChange={(e) => setItemRetailPrice(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#EAECF0] border border-[#233D4D]/15 rounded-xl px-3 py-2 text-xs font-bold text-[#000000] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#233D4D] mb-1">
                      Rental Rate (₹/day)
                    </label>
                    <input
                      type="number"
                      value={dailyRentalRate}
                      onChange={(e) => setDailyRentalRate(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#EAECF0] border border-[#233D4D]/15 rounded-xl px-3 py-2 text-xs font-bold text-[#FE7F2D] outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendation Result Card */}
            <div className="bg-[#233D4D] text-white p-5 rounded-2xl space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span>Total Rent Cost ({plannedDays} days):</span>
                <span className="font-extrabold text-white text-sm">₹{totalRentCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span>Buy Outright Cost:</span>
                <span className="font-extrabold text-gray-300">₹{itemRetailPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-xs border-t border-white/10 pt-2">
                <span>Break-even Duration:</span>
                <span className="font-bold text-[#FE7F2D]">{breakEvenDays} Days of active use</span>
              </div>

              {/* Big AI Verdict */}
              <div className="bg-black/40 p-3.5 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 block font-bold">Economic Verdict</span>
                  <span className={`text-base font-display font-extrabold ${isRentRecommended ? 'text-emerald-400' : 'text-[#FE7F2D]'}`}>
                    RECOMMENDATION: {isRentRecommended ? 'RENT PRODUCT' : 'BUY OR RESELL'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 block">Upfront Capital Saved</span>
                  <span className="text-sm font-black text-white">₹{Math.max(0, savings).toLocaleString()}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Tool 2: Smart Pricing Engine */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#233D4D]/15 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between border-b border-[#EAECF0] pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-[#233D4D] text-white flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4 text-[#FE7F2D]" />
                  </div>
                  <h3 className="font-display font-extrabold text-lg text-[#000000]">
                    Smart Pricing Engine
                  </h3>
                </div>
                <span className="text-[10px] font-black uppercase bg-[#FE7F2D]/20 text-[#000000] px-2 py-0.5 rounded">
                  AI-Assisted
                </span>
              </div>

              <p className="text-xs text-[#233D4D] mb-5">
                Automatically estimate optimal daily rental yield and secondary market resell valuation based on product depreciation curves.
              </p>

              {/* Form Controls */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#233D4D] mb-1">
                      Category
                    </label>
                    <select
                      value={pricingCategory}
                      onChange={(e) => setPricingCategory(e.target.value as any)}
                      className="w-full bg-[#EAECF0] border border-[#233D4D]/15 rounded-xl px-3 py-2 text-xs font-bold text-[#000000] outline-none"
                    >
                      <option value="Cameras">Cameras & Lenses</option>
                      <option value="Laptops">Laptops & Computing</option>
                      <option value="Tools">Power Tools & Hardware</option>
                      <option value="Appliances">Home Appliances</option>
                      <option value="Electronics">Audio & Electronics</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#233D4D] mb-1">
                      Condition Grade
                    </label>
                    <select
                      value={pricingCondition}
                      onChange={(e) => setPricingCondition(e.target.value as any)}
                      className="w-full bg-[#EAECF0] border border-[#233D4D]/15 rounded-xl px-3 py-2 text-xs font-bold text-[#000000] outline-none"
                    >
                      <option value="Brand New">Brand New (Mint)</option>
                      <option value="Like New">Like New (Mint)</option>
                      <option value="Good Condition">Good Condition</option>
                      <option value="Well Maintained">Well Maintained</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#233D4D] mb-1">
                      Original MRP (₹)
                    </label>
                    <input
                      type="number"
                      value={pricingOriginalMRP}
                      onChange={(e) => setPricingOriginalMRP(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#EAECF0] border border-[#233D4D]/15 rounded-xl px-3 py-2 text-xs font-bold text-[#000000] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#233D4D] mb-1">
                      Age (Months of use)
                    </label>
                    <input
                      type="number"
                      value={pricingAgeMonths}
                      onChange={(e) => setPricingAgeMonths(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#EAECF0] border border-[#233D4D]/15 rounded-xl px-3 py-2 text-xs font-bold text-[#000000] outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Pricing Output */}
            <div className="bg-[#EAECF0] rounded-2xl p-5 border border-[#233D4D]/10 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-gray-200">
                  <span className="text-[10px] uppercase font-bold text-gray-500 block">
                    Recommended Daily Rent
                  </span>
                  <span className="text-xl font-display font-extrabold text-[#FE7F2D]">
                    ₹{calculatedRentalPerDay.toLocaleString()}
                    <span className="text-xs text-gray-500 font-normal"> /day</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                    Deposit: ₹{(pricingResult?.suggestedSecurityDeposit ?? Math.round(pricingOriginalMRP * 0.15)).toLocaleString()}
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-gray-200">
                  <span className="text-[10px] uppercase font-bold text-gray-500 block">
                    Recommended Resell Price
                  </span>
                  <span className="text-xl font-display font-extrabold text-[#233D4D]">
                    ₹{calculatedResellValue.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-gray-500 block mt-0.5">
                    Depreciated {pricingAgeMonths}mo
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-[#233D4D] bg-white/60 p-2.5 rounded-lg text-center font-medium">
                ✨ <strong>{pricingResult?.aiSource === 'gemini-4-hydrogen' ? 'Gemini AI rationale:' : 'Economic model rationale:'}</strong>{' '}
                {pricingResult?.explanation || 'Calibrated with local circular marketplace depreciation curves.'}
              </div>
            </div>

          </div>

        </div>

        {/* Damage Detection & Product Recommendations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Tool 3: Damage Detection */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#233D4D]/15 space-y-4">
            <div className="flex items-center justify-between border-b border-[#EAECF0] pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-[#233D4D] text-white flex items-center justify-center font-bold">
                  <Camera className="w-4 h-4 text-[#FE7F2D]" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-base text-[#000000]">
                    Assistive Condition Inspection
                  </h3>
                  <span className="text-[10px] text-gray-500">Source: {damageSource}</span>
                </div>
              </div>
              <button
                onClick={handleRunDamageInspection}
                disabled={isInspecting}
                className="bg-[#233D4D] hover:bg-[#FE7F2D] hover:text-[#000000] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
              >
                {isInspecting ? 'Inspecting...' : 'Run Inspection Triage'}
              </button>
            </div>

            <p className="text-xs text-[#233D4D] leading-relaxed">
              Compares baseline handover evidence and return notes to highlight potential variances for human arbitrator review.
            </p>

            <div className="bg-[#EAECF0] rounded-2xl p-4 flex items-center space-x-4">
              <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-black shrink-0 border-2 border-[#FE7F2D]">
                <img
                  src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80"
                  alt="Scanned item"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#FE7F2D]/20 flex items-center justify-center">
                  <span className="bg-black text-[#FE7F2D] text-[8px] font-black px-1 rounded">
                    Diff 94%
                  </span>
                </div>
              </div>
              <div className="text-xs space-y-1">
                <span className="font-extrabold text-[#000000] block">Surface Variance Flagged</span>
                <p className="text-[#233D4D]">
                  "{damageSummary}"
                </p>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded inline-block">
                  Auto-routed to Condition Review
                </span>
              </div>
            </div>
          </div>

          {/* Tool 4: Circular Recommendations */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#233D4D]/15 space-y-4">
            <div className="flex items-center space-x-2 border-b border-[#EAECF0] pb-3">
              <div className="w-8 h-8 rounded-lg bg-[#FE7F2D] text-[#000000] flex items-center justify-center font-bold">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-base text-[#000000]">
                  Smart Product Recommendations
                </h3>
                <span className="text-[10px] text-gray-500">Project-based bundling</span>
              </div>
            </div>

            <p className="text-xs text-[#233D4D] leading-relaxed">
              Based on circular usage frequency, ReLoop groups complementary rental gear for creators and builders.
            </p>

            <div className="space-y-2 text-xs">
              <div className="bg-[#EAECF0] p-3 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-[#000000] block">Weekend Indie Filmmaker Kit</span>
                  <span className="text-[11px] text-gray-600">Sony A7 IV + DJI RS3 Gimbal + Wireless Mic</span>
                </div>
                <span className="text-xs font-black text-[#FE7F2D]">₹1,850/day</span>
              </div>

              <div className="bg-[#EAECF0] p-3 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-[#000000] block">DIY Home Renovation Kit</span>
                  <span className="text-[11px] text-gray-600">Bosch 18V Drill + Laser Level + Dust Extractor</span>
                </div>
                <span className="text-xs font-black text-[#FE7F2D]">₹650/day</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

