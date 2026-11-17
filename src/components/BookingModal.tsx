import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  AlertCircle, 
  ArrowRight, 
  Check, 
  Lock, 
  FileCheck,
  RotateCcw
} from 'lucide-react';
import { RentalProduct, Booking } from '../types';

import { apiBookRental } from '../services/api';

interface BookingModalProps {
  product: RentalProduct | null;
  initialDays?: number;
  onClose: () => void;
  onBookingComplete?: (newBooking: Booking) => void;
  onBookingConfirmed?: (newBooking: Booking) => void;
  currentUserId?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  product,
  initialDays = 3,
  onClose,
  onBookingComplete,
  onBookingConfirmed,
  currentUserId = 'usr-101'
}) => {
  if (!product) return null;

  const [days, setDays] = useState(initialDays);
  const [startDate, setStartDate] = useState('2026-08-26');
  const [agreeToTerms, setAgreeToTerms] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  const rentalAmount = product.rentalPricePerDay * days;
  const securityDeposit = product.securityDeposit;
  const platformFee = Math.round(rentalAmount * 0.05) + 50;
  const totalAmount = rentalAmount + securityDeposit + platformFee;

  // Calculate return date
  const startD = new Date(startDate);
  const endD = new Date(startD);
  endD.setDate(startD.getDate() + days);
  const endDateStr = endD.toISOString().split('T')[0];

  const handleConfirm = async () => {
    setIsProcessing(true);
    setErrorMessage(null);
    try {
      const newBooking = await apiBookRental(product.id, {
        startDate,
        days,
        renterId: currentUserId
      });

      setConfirmedBooking(newBooking);
      setIsProcessing(false);
      if (onBookingComplete) onBookingComplete(newBooking);
      if (onBookingConfirmed) onBookingConfirmed(newBooking);
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err.message || 'Booking failed. Product might be unavailable on these dates.');
    }
  };

  const lifecycleStages = [
    { title: 'Booking Confirmed', desc: 'Deposit secured in Escrow', active: true, completed: true },
    { title: 'Pickup Scheduled', desc: 'Photo inspection check-in', active: true, completed: false },
    { title: 'Rental Active', desc: 'Item in your trusted care', active: false, completed: false },
    { title: 'Return Product', desc: 'Handover & condition upload', active: false, completed: false },
    { title: 'Condition Verified', desc: 'AI + Owner comparison check', active: false, completed: false },
    { title: 'Deposit Refunded', desc: '100% escrow release to wallet', active: false, completed: false },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#233D4D]/20 my-8">
        
        {/* Modal Header */}
        <div className="bg-[#233D4D] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-[#FE7F2D]" />
            <h3 className="font-display font-extrabold text-lg">
              {confirmedBooking ? 'Rental Booking Confirmed' : 'Secure Rental Checkout'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8">
          
          {!confirmedBooking ? (
            /* Booking Form State */
            <div className="space-y-6">
              
              {/* Product mini card */}
              <div className="flex items-center space-x-4 bg-[#EAECF0] p-4 rounded-2xl border border-[#233D4D]/10">
                <img 
                  src={product.images[0]} 
                  alt={product.name}
                  className="w-16 h-16 rounded-xl object-cover border border-white shrink-0" 
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-extrabold uppercase bg-white text-[#233D4D] px-2 py-0.5 rounded">
                    {product.category}
                  </span>
                  <h4 className="font-display font-bold text-sm text-[#000000] truncate mt-1">
                    {product.name}
                  </h4>
                  <div className="flex items-center space-x-2 text-xs text-[#233D4D] mt-0.5">
                    <MapPin className="w-3 h-3 text-[#FE7F2D]" />
                    <span>{product.location}</span>
                  </div>
                </div>
              </div>

              {/* Date & Duration Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#233D4D] mb-1.5">
                    Rental Start Date
                  </label>
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-[#EAECF0] border border-[#233D4D]/20 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#000000] focus:ring-2 focus:ring-[#FE7F2D] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#233D4D] mb-1.5">
                    Duration: {days} Days (Returns {endDateStr})
                  </label>
                  <input 
                    type="range"
                    min="1"
                    max="14"
                    value={days}
                    onChange={(e) => setDays(parseInt(e.target.value))}
                    className="w-full mt-2 accent-[#FE7F2D]"
                  />
                </div>
              </div>

              {/* Price Calculation Card */}
              <div className="bg-[#233D4D] text-white rounded-2xl p-5 space-y-3 shadow-inner">
                <div className="flex justify-between items-center text-xs text-[#EAECF0]">
                  <span>Rental: ({days} days × ₹{product.rentalPricePerDay})</span>
                  <span className="font-bold text-white">₹{rentalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-[#EAECF0]">
                  <span className="flex items-center space-x-1">
                    <span>Security Deposit (Escrow Protected)</span>
                    <Lock className="w-3 h-3 text-[#FE7F2D]" />
                  </span>
                  <span className="font-bold text-white">₹{securityDeposit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-[#EAECF0]">
                  <span>Platform & Trust Fee</span>
                  <span className="font-bold text-white">₹{platformFee}</span>
                </div>
                
                <div className="border-t border-white/20 pt-3 flex justify-between items-baseline">
                  <div>
                    <span className="text-xs uppercase font-extrabold tracking-wider text-[#EAECF0]">Total Amount</span>
                    <div className="text-[10px] text-gray-300">Deposit is 100% refunded after check-in</div>
                  </div>
                  <span className="text-2xl font-display font-extrabold text-[#FE7F2D]">
                    ₹{totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Agreement checkbox */}
              <div className="flex items-start space-x-3 bg-amber-50/80 border border-amber-200 p-3.5 rounded-xl">
                <input 
                  type="checkbox" 
                  id="agree-terms"
                  checked={agreeToTerms} 
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="mt-0.5 rounded accent-[#FE7F2D]" 
                />
                <label htmlFor="agree-terms" className="text-xs text-amber-950 font-medium cursor-pointer">
                  I agree to the <strong>ReLoop Digital Rental Agreement</strong>, identity verification, and photo check-in at pickup & return.
                </label>
              </div>

              {/* Error banner if booking fails */}
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 font-bold flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Confirm CTA */}
              <button
                id="btn-confirm-rental-booking"
                disabled={!agreeToTerms || isProcessing}
                onClick={handleConfirm}
                className="w-full bg-[#FE7F2D] hover:bg-[#FE7F2D]/90 disabled:opacity-50 text-[#000000] font-display font-extrabold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-base active:scale-98"
              >
                {isProcessing ? (
                  <span>Securing Escrow Deposit...</span>
                ) : (
                  <>
                    <span>Confirm Booking (Pay ₹{totalAmount.toLocaleString()})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </div>
          ) : (
            /* Booking Confirmed State with Lifecycle Timeline */
            <div className="space-y-6 animate-in fade-in">
              
              <div className="text-center py-3">
                <div className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-md animate-bounce-short">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <h4 className="text-2xl font-display font-extrabold text-[#000000]">
                  Booking Confirmed!
                </h4>
                <p className="text-xs text-[#233D4D] font-medium mt-1">
                  Booking ID: <strong className="font-mono text-black">{confirmedBooking.id}</strong> • Escrow Deposit locked safely
                </p>
              </div>

              {/* Visual 6-Stage Timeline */}
              <div className="bg-[#EAECF0] rounded-2xl p-5 border border-[#233D4D]/10 space-y-4">
                <div className="text-xs font-black uppercase tracking-wider text-[#233D4D]">
                  Rental Lifecycle Tracker
                </div>

                <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-[#233D4D]/20">
                  {lifecycleStages.map((stage, idx) => (
                    <div key={idx} className="flex items-start space-x-3.5 relative z-10">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        stage.completed 
                          ? 'bg-[#FE7F2D] text-[#000000] shadow-xs' 
                          : stage.active 
                            ? 'bg-[#233D4D] text-white ring-4 ring-[#FE7F2D]/20' 
                            : 'bg-white text-gray-400 border border-gray-300'
                      }`}>
                        {stage.completed ? '✓' : idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-extrabold ${stage.active || stage.completed ? 'text-[#000000]' : 'text-gray-500'}`}>
                            {stage.title}
                          </span>
                          {stage.completed && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                              Done
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#233D4D]">{stage.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Steps Card */}
              <div className="bg-[#233D4D] text-white p-4 rounded-xl text-xs space-y-1">
                <div className="font-extrabold text-[#FE7F2D] flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Next Step: Pickup Check-in</span>
                </div>
                <p className="text-[#EAECF0]">
                  Meet with <strong>{confirmedBooking.ownerName}</strong> on {confirmedBooking.pickupDate} at {confirmedBooking.location}. Complete the 30-second camera condition log to activate rental.
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="w-full bg-[#FE7F2D] hover:bg-[#FE7F2D]/90 text-[#000000] font-bold py-3 rounded-xl text-sm transition-all"
                >
                  Done / View in Dashboard
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
