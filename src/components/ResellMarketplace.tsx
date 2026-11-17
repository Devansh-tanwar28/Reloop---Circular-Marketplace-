import React, { useState } from 'react';
import { 
  Search, 
  ShoppingBag, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Tag, 
  PlusCircle, 
  Sparkles, 
  Clock, 
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  Users
} from 'lucide-react';
import { ResellProduct } from '../types';
import { apiPurchaseResellProduct, apiCreateResellOffer } from '../services/api';

interface ResellMarketplaceProps {
  products: ResellProduct[];
  currentUserId?: string;
  onOpenCreateListing: () => void;
  onSelectProduct?: (product: ResellProduct) => void;
  onPurchaseSuccess?: (product: ResellProduct) => void;
  onOfferSent?: (product: ResellProduct) => void;
}

export const ResellMarketplace: React.FC<ResellMarketplaceProps> = ({
  products,
  currentUserId = 'usr-101',
  onOpenCreateListing,
  onSelectProduct,
  onPurchaseSuccess,
  onOfferSent
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedResellItem, setSelectedResellItem] = useState<ResellProduct | null>(null);
  const [purchaseSuccessItem, setPurchaseSuccessItem] = useState<ResellProduct | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerAmount, setOfferAmount] = useState<number>(0);
  const [offerMessage, setOfferMessage] = useState('');
  const [offerConfirmation, setOfferConfirmation] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const categories = [
    'All',
    'Electronics',
    'Cameras',
    'Laptops',
    'Tools',
    'Appliances',
    'Sports'
  ];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
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
              <ShoppingBag className="w-3.5 h-3.5 text-[#FE7F2D]" />
              <span>Verified Pre-Owned Exchange</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-[#000000] tracking-tight">
              Give Your Unused Products a New Owner.
            </h1>
            <p className="text-sm text-[#233D4D] mt-1">
              Buy and sell authenticated gear with historical maintenance records, transparent pricing, and buyer protection.
            </p>
          </div>

          <button
            id="btn-create-resell-listing"
            onClick={onOpenCreateListing}
            className="bg-[#233D4D] hover:bg-[#FE7F2D] hover:text-[#000000] text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-sm transition-all flex items-center space-x-2 shrink-0 active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-[#FE7F2D]" />
            <span>+ Create Listing</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#233D4D]/15 mb-8 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by model, brand, headphones, monitors..."
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

        {/* Resell Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((item) => {
            const savingsPercent = Math.round(((item.originalPrice - item.sellingPrice) / item.originalPrice) * 100);

            return (
              <div
                key={item.id}
                id={`resell-item-${item.id}`}
                className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all border border-[#233D4D]/10 flex flex-col justify-between group"
              >
                {/* Image & Badges */}
                <div 
                  className="relative aspect-4/3 overflow-hidden bg-[#EAECF0] cursor-pointer"
                  onClick={() => setSelectedResellItem(item)}
                >
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Savings Discount Badge */}
                  <div className="absolute top-2.5 left-2.5 bg-[#FE7F2D] text-[#000000] text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                    {savingsPercent}% OFF MRP
                  </div>

                  {/* Age badge */}
                  <div className="absolute top-2.5 right-2.5 bg-black/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    Age: {item.age}
                  </div>

                  {/* Verified Listing badge */}
                  <div className="absolute bottom-2.5 left-2.5 bg-[#233D4D]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3 text-[#FE7F2D]" />
                    <span>ReLoop Inspected</span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-[#233D4D] font-semibold mb-1">
                      <span className="text-gray-500 uppercase font-bold text-[10px]">{item.brand}</span>
                      <span className="flex items-center text-gray-600">
                        <MapPin className="w-3 h-3 text-[#FE7F2D] mr-0.5" />
                        {item.location.split(',')[0]}
                      </span>
                    </div>

                    <h3 
                      onClick={() => setSelectedResellItem(item)}
                      className="font-display font-extrabold text-sm text-[#000000] line-clamp-2 leading-snug group-hover:text-[#FE7F2D] transition-colors cursor-pointer"
                    >
                      {item.name}
                    </h3>
                  </div>

                  {/* Pricing Comparison */}
                  <div className="pt-2 border-t border-[#EAECF0] space-y-1">
                    <div className="flex items-baseline justify-between">
                      <span className="text-lg font-display font-extrabold text-[#000000]">
                        ₹{item.sellingPrice.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-400 line-through">
                        MRP ₹{item.originalPrice.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-gray-500">
                      <span>Condition: <strong className="text-[#233D4D]">{item.condition}</strong></span>
                      <span className="flex items-center text-[#233D4D]">
                        <Users className="w-3 h-3 text-[#FE7F2D] mr-1" />
                        {item.interestedBuyers} interested
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setSelectedResellItem(item);
                      setShowOfferForm(false);
                      setOfferConfirmation(null);
                      setActionError(null);
                    }}
                    className="bg-[#EAECF0] hover:bg-[#233D4D] hover:text-white text-[#233D4D] text-xs font-bold py-2 rounded-xl text-center transition-colors"
                  >
                    View Product
                  </button>
                  <button
                    onClick={() => {
                      setSelectedResellItem(item);
                      setOfferAmount(Math.round(item.sellingPrice * 0.92));
                      setShowOfferForm(true);
                      setOfferConfirmation(null);
                      setActionError(null);
                    }}
                    className="bg-[#233D4D] hover:bg-[#FE7F2D] hover:text-[#000000] text-white text-xs font-bold py-2 rounded-xl text-center shadow-xs transition-colors"
                  >
                    Make Offer
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Resell Item Detail Modal if clicked */}
        {selectedResellItem && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-extrabold uppercase bg-[#FE7F2D]/20 text-[#000000] px-2 py-0.5 rounded">
                    {selectedResellItem.category} • {selectedResellItem.brand}
                  </span>
                  <h3 className="font-display font-extrabold text-lg text-[#000000] mt-1">{selectedResellItem.name}</h3>
                </div>
                <button 
                  onClick={() => {
                    setSelectedResellItem(null);
                    setPurchaseSuccessItem(null);
                  }}
                  className="text-gray-400 hover:text-black font-bold p-1"
                >
                  ✕
                </button>
              </div>

              {purchaseSuccessItem ? (
                <div className="p-6 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                    ✓
                  </div>
                  <h4 className="text-lg font-display font-extrabold text-emerald-950">
                    Purchase Order Confirmed!
                  </h4>
                  <p className="text-xs text-emerald-800">
                    Payment of ₹{purchaseSuccessItem.sellingPrice.toLocaleString()} is securely held in ReLoop Buyer Protection Escrow until you inspect and verify the item upon delivery.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedResellItem(null);
                      setPurchaseSuccessItem(null);
                    }}
                    className="bg-[#233D4D] text-white text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-[#233D4D]/90"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <img 
                    src={selectedResellItem.images[0]} 
                    alt={selectedResellItem.name} 
                    className="w-full h-56 rounded-2xl object-cover" 
                  />

                  <div className="grid grid-cols-2 gap-3 text-xs bg-[#EAECF0] p-3.5 rounded-xl">
                    <div>
                      <span className="text-gray-500 block">Selling Price:</span>
                      <span className="text-base font-extrabold text-[#000000]">₹{selectedResellItem.sellingPrice.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Original Price (New):</span>
                      <span className="text-sm font-bold text-gray-500 line-through">₹{selectedResellItem.originalPrice.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Item Usage Age:</span>
                      <span className="font-bold text-[#233D4D]">{selectedResellItem.age}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Verified Seller:</span>
                      <span className="font-bold text-[#233D4D]">{selectedResellItem.seller.name} (★ {selectedResellItem.seller.rating})</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#233D4D] leading-relaxed">
                    {selectedResellItem.description}
                  </p>

                  {actionError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-800">
                      {actionError}
                    </div>
                  )}

                  {offerConfirmation && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-900">
                      {offerConfirmation}
                    </div>
                  )}

                  {showOfferForm && (
                    <div className="bg-[#EAECF0] p-4 rounded-2xl space-y-2.5 border border-[#233D4D]/15">
                      <div className="text-xs font-extrabold text-[#233D4D]">Submit Protected Offer</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="number"
                          value={offerAmount}
                          onChange={(e) => setOfferAmount(parseInt(e.target.value) || 0)}
                          placeholder="Offer ₹"
                          className="bg-white rounded-xl px-3 py-2 text-xs font-bold text-[#000000] outline-none"
                        />
                        <input
                          type="text"
                          value={offerMessage}
                          onChange={(e) => setOfferMessage(e.target.value)}
                          placeholder="Note to seller (optional)"
                          className="bg-white rounded-xl px-3 py-2 text-xs font-medium text-[#000000] outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          setActionError(null);
                          try {
                            await apiCreateResellOffer(selectedResellItem.id, {
                              buyerId: currentUserId,
                              offerAmount: offerAmount || selectedResellItem.sellingPrice,
                              message: offerMessage || 'Interested in purchasing with Buyer Protection.'
                            });
                            setOfferConfirmation(`Offer of ₹${(offerAmount || selectedResellItem.sellingPrice).toLocaleString()} sent to ${selectedResellItem.seller.name}!`);
                            setShowOfferForm(false);
                            if (onOfferSent) onOfferSent(selectedResellItem);
                          } catch (err: any) {
                            setActionError(err.message || 'Could not send offer.');
                          }
                        }}
                        className="w-full bg-[#233D4D] text-white font-bold py-2 rounded-xl text-xs hover:bg-[#233D4D]/90"
                      >
                        Send Offer to Seller
                      </button>
                    </div>
                  )}

                  <div className="flex space-x-3 pt-2">
                    <button
                      onClick={() => {
                        setOfferAmount(Math.round(selectedResellItem.sellingPrice * 0.92));
                        setShowOfferForm(!showOfferForm);
                      }}
                      className="flex-1 bg-[#233D4D] text-white font-bold py-3 rounded-xl text-xs hover:bg-[#233D4D]/90"
                    >
                      {showOfferForm ? 'Hide Offer Form' : 'Chat & Make Offer'}
                    </button>
                    <button
                      disabled={isPurchasing}
                      onClick={async () => {
                        setIsPurchasing(true);
                        setActionError(null);
                        try {
                          await apiPurchaseResellProduct(selectedResellItem.id, currentUserId);
                          setPurchaseSuccessItem(selectedResellItem);
                          if (onPurchaseSuccess) onPurchaseSuccess(selectedResellItem);
                        } catch (err: any) {
                          setActionError(err.message || 'Purchase could not be completed.');
                        } finally {
                          setIsPurchasing(false);
                        }
                      }}
                      className="flex-1 bg-[#FE7F2D] text-[#000000] font-black py-3 rounded-xl text-xs hover:bg-[#FE7F2D]/90 shadow-sm disabled:opacity-50"
                    >
                      {isPurchasing ? 'Processing...' : 'Buy Now (Protected Escrow)'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
