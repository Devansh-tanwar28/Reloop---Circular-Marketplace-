import React, { useState } from 'react';
import { 
  X, 
  Star, 
  MapPin, 
  ShieldCheck, 
  Calendar as CalendarIcon, 
  Camera, 
  FileText, 
  Lock, 
  UserCheck, 
  Sparkles, 
  Clock, 
  ArrowRight,
  CheckCircle,
  HelpCircle,
  Share2,
  Heart
} from 'lucide-react';
import { RentalProduct } from '../types';

interface ProductDetailModalProps {
  product: RentalProduct | null;
  onClose: () => void;
  onOpenBooking?: (product: RentalProduct, initialDays: number) => void;
  onRentNow?: (product: RentalProduct) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onOpenBooking,
  onRentNow
}) => {
  if (!product) return null;

  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'terms' | 'reviews'>('description');
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedDays, setSelectedDays] = useState(3);
  const [isSaved, setIsSaved] = useState(false);

  const estimatedRent = product.rentalPricePerDay * selectedDays;
  const platformFee = Math.round(estimatedRent * 0.05) + 50;
  const totalDue = estimatedRent + product.securityDeposit + platformFee;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-5xl w-full overflow-hidden shadow-2xl border border-[#233D4D]/20 my-8 flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="bg-[#233D4D] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <span className="bg-[#FE7F2D] text-[#000000] text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {product.category}
            </span>
            <span className="text-xs text-[#EAECF0]/80">ID: {product.id}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setIsSaved(!isSaved)} 
              className={`p-2 rounded-full hover:bg-white/10 transition-colors ${isSaved ? 'text-[#FE7F2D]' : 'text-white'}`}
              title="Save to favorites"
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-[#FE7F2D]' : ''}`} />
            </button>
            <button 
              onClick={onClose} 
              className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
              title="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Image Gallery */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-[#EAECF0] border border-[#233D4D]/10 shadow-inner group">
                <img 
                  src={product.images[selectedImageIdx] || product.images[0]} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-[#000000]/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>{product.condition}</span>
                </div>
                <div className="absolute bottom-3 right-3 bg-[#233D4D]/90 text-white text-xs font-bold px-3 py-1 rounded-lg backdrop-blur-xs flex items-center space-x-1">
                  <Camera className="w-3.5 h-3.5 text-[#FE7F2D]" />
                  <span>Condition Documented</span>
                </div>
              </div>

              {/* Gallery Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex space-x-3">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIdx(idx)}
                      className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImageIdx === idx ? 'border-[#FE7F2D] ring-2 ring-[#FE7F2D]/30' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Owner Trust & Verification Box */}
              <div className="bg-[#EAECF0] rounded-2xl p-5 border border-[#233D4D]/10">
                <div className="text-xs font-extrabold uppercase tracking-wider text-[#233D4D] mb-3">
                  Verified Gear Owner
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3.5">
                    <div className="relative">
                      <img 
                        src={product.owner.avatar} 
                        alt={product.owner.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-[#FE7F2D]" 
                      />
                      {product.owner.identityVerified && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#FE7F2D] text-[#000000] rounded-full flex items-center justify-center text-[10px] font-black">
                          ✓
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-display font-bold text-base text-[#000000]">{product.owner.name}</span>
                        <span className="text-[11px] bg-white text-[#233D4D] font-bold px-2 py-0.5 rounded-full border border-gray-300">
                          {product.owner.joinedDate}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-xs text-[#233D4D] mt-0.5 font-medium">
                        <span className="flex items-center text-[#FE7F2D] font-bold">
                          <Star className="w-3.5 h-3.5 fill-[#FE7F2D] mr-1" />
                          {product.owner.rating} ({product.owner.reviewsCount} reviews)
                        </span>
                        <span>•</span>
                        <span>Responds in {product.owner.responseRate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <span className="text-xs text-gray-500 block">Rentals Handled</span>
                    <span className="font-black text-sm text-[#000000]">{product.totalRentalsCompleted} completed</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Pricing & Booking Selector Card */}
            <div className="lg:col-span-5 space-y-6">
              
              <div>
                <div className="flex items-center space-x-2 text-xs font-semibold text-[#233D4D] mb-1">
                  <MapPin className="w-3.5 h-3.5 text-[#FE7F2D]" />
                  <span>{product.location}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[#000000] tracking-tight leading-snug">
                  {product.name}
                </h1>
                
                <div className="flex items-center space-x-3 mt-2.5">
                  <div className="flex items-center bg-[#FE7F2D]/15 text-[#000000] px-2.5 py-1 rounded-lg text-xs font-black">
                    <Star className="w-3.5 h-3.5 fill-[#FE7F2D] text-[#FE7F2D] mr-1" />
                    <span>{product.rating}</span>
                    <span className="text-gray-600 font-normal ml-1">({product.reviewsCount} reviews)</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                    ● {product.availability}
                  </span>
                </div>
              </div>

              {/* Price Banner */}
              <div className="bg-[#233D4D] text-white rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-3xl font-display font-extrabold text-[#FE7F2D]">₹{product.rentalPricePerDay.toLocaleString()}</span>
                    <span className="text-xs text-[#EAECF0] ml-1">/ day</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-gray-300 block">Refundable Deposit</span>
                    <span className="text-sm font-bold text-white">₹{product.securityDeposit.toLocaleString()}</span>
                  </div>
                </div>

                {/* Duration Slider / Selector */}
                <div className="bg-black/30 p-3.5 rounded-xl space-y-2">
                  <div className="flex justify-between text-xs font-bold text-[#EAECF0]">
                    <span>Rental Duration</span>
                    <span className="text-[#FE7F2D] font-extrabold text-sm">{selectedDays} {selectedDays === 1 ? 'Day' : 'Days'}</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="14" 
                    value={selectedDays} 
                    onChange={(e) => setSelectedDays(parseInt(e.target.value))}
                    className="w-full accent-[#FE7F2D] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400">
                    <span>1 day</span>
                    <span>7 days</span>
                    <span>14 days</span>
                  </div>
                </div>

                {/* Live Cost Breakdown calculation */}
                <div className="space-y-1.5 pt-2 border-t border-white/10 text-xs">
                  <div className="flex justify-between text-[#EAECF0]">
                    <span>Rental ({selectedDays} days × ₹{product.rentalPricePerDay})</span>
                    <span>₹{estimatedRent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[#EAECF0]">
                    <span>Security Deposit (100% Refundable)</span>
                    <span>₹{product.securityDeposit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[#EAECF0]">
                    <span>Trust & Platform Fee</span>
                    <span>₹{platformFee}</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-white/20">
                    <span>Total Payable Now</span>
                    <span className="text-[#FE7F2D]">₹{totalDue.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  id="btn-book-now-trigger"
                  onClick={() => {
                    if (onOpenBooking) {
                      onOpenBooking(product, selectedDays);
                    } else if (onRentNow) {
                      onRentNow(product);
                    }
                  }}
                  className="w-full bg-[#FE7F2D] hover:bg-[#FE7F2D]/90 text-[#000000] font-display font-extrabold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-base active:scale-98"
                >
                  <span>Book Now</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Trust Checklist */}
              <div className="bg-white rounded-2xl p-5 border border-[#EAECF0] shadow-xs space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-[#233D4D]">
                  ReLoop Trust & Safety Assurance
                </div>
                <div className="grid grid-cols-1 gap-2.5 text-xs text-[#233D4D]">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Verified Owner:</strong> Identity & address verified</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Condition Documented:</strong> High-res pre-inspection photos</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Pickup Evidence Required:</strong> Real-time photo check-in</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Secure Escrow:</strong> Deposit held in trust until return verified</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Digital Rental Agreement:</strong> Legally binding terms</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Bottom Tabs: Description, Specifications, Terms, Reviews */}
          <div className="border-t border-[#EAECF0] pt-6">
            <div className="flex space-x-2 border-b border-[#EAECF0] pb-2 overflow-x-auto">
              {[
                { id: 'description', label: 'Description' },
                { id: 'specifications', label: 'Specifications' },
                { id: 'terms', label: 'Rental Terms' },
                { id: 'reviews', label: `Reviews (${product.reviewsCount})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                    activeTab === tab.id 
                      ? 'bg-[#233D4D] text-white shadow-xs' 
                      : 'text-[#233D4D] hover:bg-[#EAECF0]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="py-6 text-sm text-[#233D4D] leading-relaxed">
              {activeTab === 'description' && (
                <div className="space-y-4">
                  <p>{product.description}</p>
                  <div>
                    <h4 className="font-extrabold text-[#000000] mb-2 text-xs uppercase tracking-wider">Package Inclusions:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {product.features.map((feat, i) => (
                        <div key={i} className="flex items-center space-x-2 bg-[#EAECF0]/60 px-3 py-2 rounded-lg text-xs font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FE7F2D]" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="bg-[#EAECF0]/60 p-3 rounded-xl flex justify-between text-xs">
                      <span className="font-bold text-[#000000]">{key}</span>
                      <span className="text-[#233D4D] font-medium">{val}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'terms' && (
                <div className="space-y-2.5">
                  {product.rentalTerms.map((term, i) => (
                    <div key={i} className="flex items-start space-x-2 text-xs bg-amber-50/70 border border-amber-200/60 p-3 rounded-xl text-amber-950 font-medium">
                      <ShieldCheck className="w-4 h-4 text-[#FE7F2D] shrink-0 mt-0.5" />
                      <span>{term}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-3">
                  <div className="bg-[#EAECF0]/60 p-4 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#000000]">Kavita S. — Verified Renter</span>
                      <span className="text-[10px] text-gray-500">2 weeks ago</span>
                    </div>
                    <div className="flex text-[#FE7F2D]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#FE7F2D]" />
                      ))}
                    </div>
                    <p className="text-xs text-[#233D4D]">
                      Product was in 100% mint condition with clean lenses. Handover and return via ReLoop pickup evidence was super smooth. Deposit released within 1 hour!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
