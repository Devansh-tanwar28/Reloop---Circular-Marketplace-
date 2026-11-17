import React, { useState, useRef } from 'react';
import { 
  X, 
  ShoppingBag, 
  Upload, 
  Sparkles, 
  ArrowRight,
  Repeat,
  AlertCircle
} from 'lucide-react';
import { RentalProduct, ResellProduct, ProductCategory, ProductCondition, UserAccount } from '../types';
import { apiCreateRental, apiCreateResellListing, apiGetSmartPricing } from '../services/api';

interface CreateListingModalProps {
  currentUser: UserAccount;
  initialMode?: 'resell' | 'rent';
  onClose: () => void;
  onListingCreated: (newProduct: ResellProduct) => void;
  onRentalCreated?: (newProduct: RentalProduct) => void;
}

export const CreateListingModal: React.FC<CreateListingModalProps> = ({
  currentUser,
  initialMode = 'resell',
  onClose,
  onListingCreated,
  onRentalCreated
}) => {
  const [listingType, setListingType] = useState<'resell' | 'rent'>(initialMode);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Electronics');
  const [brand, setBrand] = useState('');
  const [age, setAge] = useState('6 months');
  const [condition, setCondition] = useState<ProductCondition>('Like New');
  const [originalPrice, setOriginalPrice] = useState<number>(25000);
  const [sellingPrice, setSellingPrice] = useState<number>(14000);
  const [dailyRate, setDailyRate] = useState<number>(500);
  const [securityDeposit, setSecurityDeposit] = useState<number>(3500);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(currentUser.location || 'Indiranagar, Bengaluru');
  const [imagePreview, setImagePreview] = useState<string>(
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80'
  );
  const [imageLabel, setImageLabel] = useState<string>('Default HD reference photo attached');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // AI Price Suggestion state
  const [isAiCalculating, setIsAiCalculating] = useState(false);
  const [aiSuggestedPrice, setAiSuggestedPrice] = useState<number | null>(null);
  const [aiSuggestedDeposit, setAiSuggestedDeposit] = useState<number | null>(null);
  const [aiRationale, setAiRationale] = useState<string | null>(null);

  const categories: ProductCategory[] = [
    'Cameras',
    'Laptops',
    'Electronics',
    'Tools',
    'Appliances',
    'Sports',
    'Furniture',
    'Other'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImagePreview(reader.result);
        setImageLabel(`Uploaded: ${file.name}`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGetAiPrice = async () => {
    if (!originalPrice) return;
    setIsAiCalculating(true);
    try {
      const res = await apiGetSmartPricing({
        category,
        brand,
        condition,
        originalPrice,
        ageMonths: age.includes('month') ? parseInt(age) || 6 : (parseFloat(age) || 1) * 12
      });
      if (listingType === 'rent') {
        setAiSuggestedPrice(res.suggestedDailyRate);
        setAiSuggestedDeposit(res.suggestedSecurityDeposit);
      } else {
        setAiSuggestedPrice(res.estimatedResaleValue);
        setAiSuggestedDeposit(null);
      }
      setAiRationale(res.explanation);
    } catch {
      if (listingType === 'rent') {
        setAiSuggestedPrice(Math.round(originalPrice * 0.018));
        setAiSuggestedDeposit(Math.round(originalPrice * 0.15));
      } else {
        setAiSuggestedPrice(Math.round(originalPrice * 0.6));
        setAiSuggestedDeposit(null);
      }
      setAiRationale(`Based on ${category} circular market trends and "${condition}" grade.`);
    } finally {
      setIsAiCalculating(false);
    }
  };

  const applyAiPrice = () => {
    if (aiSuggestedPrice) {
      if (listingType === 'rent') {
        setDailyRate(aiSuggestedPrice);
        if (aiSuggestedDeposit) setSecurityDeposit(aiSuggestedDeposit);
      } else {
        setSellingPrice(aiSuggestedPrice);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (listingType === 'rent') {
        const created = await apiCreateRental({
          name,
          category,
          condition,
          location,
          rentalPricePerDay: dailyRate,
          securityDeposit,
          description: description || `Verified ${brand || ''} ${name} available for circular rental in ${location}.`,
          images: [imagePreview],
          ownerId: currentUser.id
        });
        if (onRentalCreated) onRentalCreated(created);
        onClose();
      } else {
        const created = await apiCreateResellListing({
          name,
          category,
          brand: brand || 'ReLoop Verified',
          age,
          condition,
          originalPrice,
          sellingPrice,
          location,
          description: description || `Certified authentic ${brand} ${name} in ${condition}.`,
          images: [imagePreview],
          sellerId: currentUser.id
        });
        onListingCreated(created);
        onClose();
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to publish listing.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#233D4D]/20 my-8">
        
        {/* Modal Header */}
        <div className="bg-[#233D4D] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {listingType === 'rent' ? (
              <Repeat className="w-5 h-5 text-[#FE7F2D]" />
            ) : (
              <ShoppingBag className="w-5 h-5 text-[#FE7F2D]" />
            )}
            <h3 className="font-display font-extrabold text-lg">
              {listingType === 'rent' ? 'Create Rental Listing' : 'Create Resell Listing'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
          
          {/* Listing Type Switcher */}
          <div className="flex bg-[#EAECF0] p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setListingType('resell');
                setAiSuggestedPrice(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
                listingType === 'resell' ? 'bg-white text-[#000000] shadow-xs' : 'text-[#233D4D]'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#FE7F2D]" />
              <span>Resell Item</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setListingType('rent');
                setAiSuggestedPrice(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
                listingType === 'rent' ? 'bg-white text-[#000000] shadow-xs' : 'text-[#233D4D]'
              }`}
            >
              <Repeat className="w-3.5 h-3.5 text-[#FE7F2D]" />
              <span>List for Rent</span>
            </button>
          </div>

          {submitError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 font-bold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Upload Images */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#233D4D] mb-1.5">
              Product Image *
            </label>
            <div className="border-2 border-dashed border-[#233D4D]/20 rounded-2xl p-4 bg-[#EAECF0]/40 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img 
                  src={imagePreview} 
                  alt="Listing" 
                  className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow-xs" 
                />
                <div>
                  <span className="text-xs font-bold text-[#000000] block">{imageLabel}</span>
                  <span className="text-[11px] text-gray-500">Auto-checked for optical resolution</span>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-[#233D4D] hover:bg-[#233D4D]/90 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center space-x-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Photo</span>
              </button>
            </div>
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#233D4D] mb-1">
              Product Title *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={listingType === 'rent' ? 'e.g. DJI RS3 Pro Gimbal Stabilizer' : 'e.g. Sony WH-1000XM5 Wireless Headphones (Black)'}
              className="w-full bg-[#EAECF0] border border-[#233D4D]/20 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#000000] focus:ring-2 focus:ring-[#FE7F2D] outline-none"
            />
          </div>

          {/* Category & Brand/Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#233D4D] mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-[#EAECF0] border border-[#233D4D]/20 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#000000] outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#233D4D] mb-1">
                {listingType === 'rent' ? 'Pickup Area / Location *' : 'Brand *'}
              </label>
              {listingType === 'rent' ? (
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Indiranagar, Bengaluru"
                  className="w-full bg-[#EAECF0] border border-[#233D4D]/20 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#000000] outline-none"
                />
              ) : (
                <input
                  type="text"
                  required
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Sony, Apple, Bose, DeWalt"
                  className="w-full bg-[#EAECF0] border border-[#233D4D]/20 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#000000] outline-none"
                />
              )}
            </div>
          </div>

          {/* Age & Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#233D4D] mb-1">
                {listingType === 'rent' ? 'Brand / Model' : 'Item Age / Duration of Use'}
              </label>
              {listingType === 'rent' ? (
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Sony, DJI, Bosch"
                  className="w-full bg-[#EAECF0] border border-[#233D4D]/20 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#000000] outline-none"
                />
              ) : (
                <input
                  type="text"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 8 months or 1.5 years"
                  className="w-full bg-[#EAECF0] border border-[#233D4D]/20 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#000000] outline-none"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#233D4D] mb-1">
                Physical Condition *
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="w-full bg-[#EAECF0] border border-[#233D4D]/20 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#000000] outline-none"
              >
                <option value="Brand New">Brand New (Unopened box)</option>
                <option value="Like New">Like New (Mint, zero scratches)</option>
                <option value="Good Condition">Good Condition (Minor cosmetic use)</option>
                <option value="Well Maintained">Well Maintained (Fully functional)</option>
              </select>
            </div>
          </div>

          {/* Pricing Section with AI Price Suggestion Tool */}
          <div className="bg-[#EAECF0] rounded-2xl p-4 border border-[#233D4D]/15 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#233D4D]">
                Pricing & Valuation
              </span>
              <button
                type="button"
                id="btn-get-ai-price"
                onClick={handleGetAiPrice}
                disabled={isAiCalculating}
                className="bg-[#233D4D] hover:bg-[#FE7F2D] hover:text-[#000000] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FE7F2D]" />
                <span>{isAiCalculating ? 'Analyzing Market...' : 'Get AI Price Suggestion'}</span>
              </button>
            </div>

            {listingType === 'resell' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#233D4D] mb-1">
                    Original Retail MRP (₹)
                  </label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(parseInt(e.target.value) || 0)}
                    className="w-full bg-white border border-[#233D4D]/20 rounded-xl px-3 py-2 text-xs font-bold text-[#000000] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#233D4D] mb-1">
                    Your Asking Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(parseInt(e.target.value) || 0)}
                    className="w-full bg-white border border-[#233D4D]/20 rounded-xl px-3 py-2 text-xs font-black text-[#FE7F2D] outline-none"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#233D4D] mb-1">
                    Item MRP (₹)
                  </label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(parseInt(e.target.value) || 0)}
                    className="w-full bg-white border border-[#233D4D]/20 rounded-xl px-3 py-2 text-xs font-bold text-[#000000] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#233D4D] mb-1">
                    Daily Rent (₹/day) *
                  </label>
                  <input
                    type="number"
                    required
                    value={dailyRate}
                    onChange={(e) => setDailyRate(parseInt(e.target.value) || 0)}
                    className="w-full bg-white border border-[#233D4D]/20 rounded-xl px-3 py-2 text-xs font-black text-[#FE7F2D] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#233D4D] mb-1">
                    Escrow Deposit (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={securityDeposit}
                    onChange={(e) => setSecurityDeposit(parseInt(e.target.value) || 0)}
                    className="w-full bg-white border border-[#233D4D]/20 rounded-xl px-3 py-2 text-xs font-bold text-[#233D4D] outline-none"
                  />
                </div>
              </div>
            )}

            {/* AI Suggested Price Banner */}
            {aiSuggestedPrice && (
              <div className="bg-[#233D4D] text-white p-3.5 rounded-xl flex items-center justify-between gap-3 animate-in fade-in">
                <div>
                  <div className="flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#FE7F2D]" />
                    <span className="text-xs font-bold text-white">
                      {listingType === 'rent' ? 'Suggested Daily Rate:' : 'Suggested Selling Price:'}{' '}
                      <strong className="text-[#FE7F2D] font-extrabold text-sm">
                        ₹{aiSuggestedPrice.toLocaleString()}{listingType === 'rent' ? '/day' : ''}
                      </strong>
                      {aiSuggestedDeposit && (
                        <span className="text-[11px] text-gray-300 ml-2">(Deposit: ₹{aiSuggestedDeposit.toLocaleString()})</span>
                      )}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#EAECF0]/80 mt-0.5">
                    <span className="font-semibold uppercase text-[#FE7F2D]">AI-assisted recommendation:</span> {aiRationale}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={applyAiPrice}
                  className="bg-[#FE7F2D] text-[#000000] text-xs font-bold px-3 py-1.5 rounded-lg shrink-0 hover:bg-[#FE7F2D]/90"
                >
                  Apply Price
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#233D4D] mb-1">
              Description & Included Accessories
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mention if box, bills, warranty cards, cables or cases are included..."
              className="w-full bg-[#EAECF0] border border-[#233D4D]/20 rounded-xl p-3 text-xs font-medium text-[#000000] outline-none"
            />
          </div>

          {/* Submit */}
          <button
            id="btn-publish-listing"
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#FE7F2D] hover:bg-[#FE7F2D]/90 disabled:opacity-50 text-[#000000] font-display font-extrabold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm mt-4 active:scale-98"
          >
            <span>
              {isSubmitting
                ? 'Publishing Listing...'
                : listingType === 'rent'
                  ? 'Publish Gear to Rent Marketplace'
                  : 'Publish Listing to Resell Marketplace'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

      </div>
    </div>
  );
};

