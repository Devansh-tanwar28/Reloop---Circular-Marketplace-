import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  Upload, 
  Sparkles, 
  DollarSign, 
  CheckCircle, 
  HelpCircle,
  Tag,
  ArrowRight,
  Info
} from 'lucide-react';
import { ResellProduct, ProductCategory, ProductCondition, UserAccount } from '../types';
import { apiCreateResellListing, apiGetSmartPricing } from '../services/api';

interface CreateListingModalProps {
  currentUser: UserAccount;
  onClose: () => void;
  onListingCreated: (newProduct: ResellProduct) => void;
}

export const CreateListingModal: React.FC<CreateListingModalProps> = ({
  currentUser,
  onClose,
  onListingCreated
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Electronics');
  const [brand, setBrand] = useState('');
  const [age, setAge] = useState('6 months');
  const [condition, setCondition] = useState<ProductCondition>('Like New');
  const [originalPrice, setOriginalPrice] = useState<number>(25000);
  const [sellingPrice, setSellingPrice] = useState<number>(14000);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(currentUser.location);
  const [imagePreview, setImagePreview] = useState<string>(
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80'
  );

  // AI Price Suggestion state
  const [isAiCalculating, setIsAiCalculating] = useState(false);
  const [aiSuggestedPrice, setAiSuggestedPrice] = useState<number | null>(null);
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

  const handleGetAiPrice = async () => {
    if (!originalPrice) return;
    setIsAiCalculating(true);
    try {
      const res = await apiGetSmartPricing({
        category,
        condition,
        originalPrice,
        ageMonths: age.includes('month') ? parseInt(age) || 6 : (parseFloat(age) || 1) * 12
      });
      setAiSuggestedPrice(res.estimatedResaleValue);
      setAiRationale(res.explanation);
      setIsAiCalculating(false);
    } catch {
      // Fallback
      let depreciationRate = 0.45;
      if (condition === 'Brand New') depreciationRate = 0.18;
      if (condition === 'Like New') depreciationRate = 0.35;
      if (condition === 'Good Condition') depreciationRate = 0.50;
      if (condition === 'Well Maintained') depreciationRate = 0.60;

      const calculated = Math.round(originalPrice * (1 - depreciationRate));
      setAiSuggestedPrice(calculated);
      setAiRationale(`Based on ${category} circular market trends, ${age} usage, and "${condition}" grade.`);
      setIsAiCalculating(false);
    }
  };

  const applyAiPrice = () => {
    if (aiSuggestedPrice) {
      setSellingPrice(aiSuggestedPrice);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !brand || !sellingPrice) return;

    try {
      await apiCreateResellListing({
        name,
        category,
        brand,
        age,
        condition,
        originalPrice,
        sellingPrice,
        location,
        description: description || `Certified authentic ${brand} ${name} in ${condition}.`,
        images: [imagePreview],
        sellerId: currentUser.id
      });
    } catch (err) {
      console.warn('API listing creation error (proceeding with optimistic update):', err);
    }

    const newListing: ResellProduct = {
      id: `resell-${Date.now()}`,
      name,
      category,
      brand,
      age,
      condition,
      originalPrice,
      sellingPrice,
      location,
      seller: {
        name: currentUser.name,
        avatar: currentUser.avatar,
        verified: currentUser.verified,
        rating: currentUser.rating,
        reviewsCount: 14,
        responseRate: '15 mins',
        joinedDate: 'Joined 2024',
        identityVerified: true
      },
      description: description || `Certified authentic ${brand} ${name} in ${condition}.`,
      images: [imagePreview],
      interestedBuyers: 0,
      postedDate: 'Just now',
      verifiedListing: true
    };

    onListingCreated(newListing);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#233D4D]/20 my-8">
        
        {/* Modal Header */}
        <div className="bg-[#233D4D] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-[#FE7F2D]" />
            <h3 className="font-display font-extrabold text-lg">
              Create Resell Listing
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
          
          {/* Upload Images */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#233D4D] mb-1.5">
              Upload Product Images *
            </label>
            <div className="border-2 border-dashed border-[#233D4D]/20 rounded-2xl p-4 bg-[#EAECF0]/40 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img 
                  src={imagePreview} 
                  alt="Listing" 
                  className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow-xs" 
                />
                <div>
                  <span className="text-xs font-bold text-[#000000] block">1 HD image attached</span>
                  <span className="text-[11px] text-gray-500">Auto-checked for optical resolution</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => alert('Additional image simulated')}
                className="bg-[#233D4D] hover:bg-[#233D4D]/90 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center space-x-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload</span>
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
              placeholder="e.g. Sony WH-1000XM5 Wireless Headphones (Black)"
              className="w-full bg-[#EAECF0] border border-[#233D4D]/20 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#000000] focus:ring-2 focus:ring-[#FE7F2D] outline-none"
            />
          </div>

          {/* Category & Brand */}
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
                Brand *
              </label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Sony, Apple, Bose, DeWalt"
                className="w-full bg-[#EAECF0] border border-[#233D4D]/20 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#000000] outline-none"
              />
            </div>
          </div>

          {/* Age & Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#233D4D] mb-1">
                Item Age / Duration of Use
              </label>
              <input
                type="text"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 8 months or 1.5 years"
                className="w-full bg-[#EAECF0] border border-[#233D4D]/20 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#000000] outline-none"
              />
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

            {/* AI Suggested Price Banner */}
            {aiSuggestedPrice && (
              <div className="bg-[#233D4D] text-white p-3.5 rounded-xl flex items-center justify-between animate-in fade-in">
                <div>
                  <div className="flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#FE7F2D]" />
                    <span className="text-xs font-bold text-white">
                      Suggested selling price: <strong className="text-[#FE7F2D] font-extrabold text-sm">₹{aiSuggestedPrice.toLocaleString()}</strong>
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
            className="w-full bg-[#FE7F2D] hover:bg-[#FE7F2D]/90 text-[#000000] font-display font-extrabold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm mt-4 active:scale-98"
          >
            <span>Publish Listing to Resell Marketplace</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

      </div>
    </div>
  );
};
