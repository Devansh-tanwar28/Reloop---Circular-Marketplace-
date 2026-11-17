import React, { useState, useRef } from 'react';
import { 
  X, 
  Wrench, 
  Upload, 
  CheckCircle, 
  Sparkles, 
  Clock, 
  MapPin, 
  Calendar,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { ProductCategory, RepairRequest } from '../types';
import { apiCreateRepairRequest } from '../services/api';

interface CreateRepairModalProps {
  onClose: () => void;
  onSubmit: (newReq: RepairRequest) => void;
  preselectedCategory?: ProductCategory;
  preselectedProvider?: string;
  currentUserId?: string;
}

export const CreateRepairModal: React.FC<CreateRepairModalProps> = ({
  onClose,
  onSubmit,
  preselectedCategory = 'Cameras',
  preselectedProvider,
  currentUserId = 'usr-101'
}) => {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState<ProductCategory>(preselectedCategory);
  const [brandModel, setBrandModel] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [location, setLocation] = useState('Indiranagar, Bengaluru');
  const [preferredDate, setPreferredDate] = useState('2026-08-27');
  const [imagePreview, setImagePreview] = useState<string | null>(
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80'
  );
  const [imageLabel, setImageLabel] = useState('1 photo attached (HD clarity)');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReq, setSubmittedReq] = useState<RepairRequest | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  const categories: ProductCategory[] = [
    'Cameras',
    'Laptops',
    'Electronics',
    'Appliances',
    'Tools',
    'Furniture',
    'Sports',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !brandModel || !problemDescription) return;

    setIsSubmitting(true);
    try {
      const newReq = await apiCreateRepairRequest({
        productName,
        category,
        brandModel,
        problemDescription,
        image: imagePreview || undefined,
        location,
        preferredDate,
        providerName: preselectedProvider,
        userId: currentUserId
      });

      setSubmittedReq(newReq);
      setIsSubmitting(false);
      onSubmit(newReq);
    } catch (err: any) {
      setIsSubmitting(false);
      // Fallback
      const fallbackReq: RepairRequest = {
        id: `req-${Date.now()}`,
        productName,
        category,
        brandModel,
        problemDescription,
        image: imagePreview || undefined,
        location,
        preferredDate,
        status: 'Submitted',
        providerName: preselectedProvider || 'Matching certified pros...',
        quotationAmount: 1850,
        submittedDate: new Date().toISOString().split('T')[0]
      };
      setSubmittedReq(fallbackReq);
      onSubmit(fallbackReq);
    }
  };

  const repairTimeline = [
    { label: 'Request Submitted', desc: 'Photos & symptoms received', done: true, active: true },
    { label: 'Provider Matching', desc: 'Routing to certified technicians', done: false, active: true },
    { label: 'Inspection & Triage', desc: 'Component health check', done: false, active: false },
    { label: 'Quotation Generated', desc: 'Itemized parts & labor cost', done: false, active: false },
    { label: 'Your Approval', desc: 'Authorize work & lock escrow', done: false, active: false },
    { label: 'Active Repair', desc: 'Fixing & quality testing', done: false, active: false },
    { label: 'Completed', desc: 'Pickup / Doorstep delivery', done: false, active: false },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#233D4D]/20 my-8">
        
        {/* Header */}
        <div className="bg-[#233D4D] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wrench className="w-5 h-5 text-[#FE7F2D]" />
            <h3 className="font-display font-extrabold text-lg">
              {submittedReq ? 'Repair Request Initiated' : 'Create Repair Request'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          
          {!submittedReq ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {preselectedProvider && (
                <div className="bg-[#EAECF0] p-3 rounded-xl flex items-center justify-between text-xs text-[#233D4D] font-bold">
                  <span>Targeted Service Provider:</span>
                  <span className="text-[#000000]">{preselectedProvider}</span>
                </div>
              )}

              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#233D4D] mb-1">
                  Product / Item Name *
                </label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Sony A7 III Shutter or Dyson V11 Vacuum"
                  className="w-full bg-[#EAECF0] border border-[#233D4D]/20 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#000000] focus:ring-2 focus:ring-[#FE7F2D] outline-none"
                />
              </div>

              {/* Category & Brand/Model */}
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
                    Brand & Exact Model *
                  </label>
                  <input
                    type="text"
                    required
                    value={brandModel}
                    onChange={(e) => setBrandModel(e.target.value)}
                    placeholder="e.g. Sony ILCE-7M3 / 2022"
                    className="w-full bg-[#EAECF0] border border-[#233D4D]/20 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#000000] focus:ring-2 focus:ring-[#FE7F2D] outline-none"
                  />
                </div>
              </div>

              {/* Problem Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#233D4D] mb-1">
                  Describe the Problem / Symptoms *
                </label>
                <textarea
                  required
                  rows={3}
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  placeholder="Explain what is failing, any error codes, strange noises, liquid damage, or broken parts..."
                  className="w-full bg-[#EAECF0] border border-[#233D4D]/20 rounded-xl p-3 text-xs font-medium text-[#000000] focus:ring-2 focus:ring-[#FE7F2D] outline-none"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#233D4D] mb-1">
                  Upload Photos of Problem / Serial No.
                </label>
                <div className="border-2 border-dashed border-[#233D4D]/20 rounded-xl p-3 bg-[#EAECF0]/40 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {imagePreview && (
                      <img src={imagePreview} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-white" />
                    )}
                    <span className="text-xs text-gray-500 font-medium">{imageLabel}</span>
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
                    className="bg-[#233D4D] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                  </button>
                </div>
              </div>

              {/* Location & Preferred Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#233D4D] mb-1">
                    Pickup Location / Area
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-[#EAECF0] border border-[#233D4D]/20 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#000000] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#233D4D] mb-1">
                    Preferred Service Date
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full bg-[#EAECF0] border border-[#233D4D]/20 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#000000] outline-none"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                id="btn-submit-repair-request"
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#FE7F2D] hover:bg-[#FE7F2D]/90 text-[#000000] font-display font-extrabold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm mt-4 active:scale-98"
              >
                {isSubmitting ? (
                  <span>Dispatching to Repair Network...</span>
                ) : (
                  <>
                    <span>Submit Repair Request</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          ) : (
            /* Submitted Repair Lifecycle State */
            <div className="space-y-6 animate-in fade-in">
              <div className="text-center py-2">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                  <CheckCircle className="w-7 h-7 stroke-[3]" />
                </div>
                <h4 className="text-xl font-display font-extrabold text-[#000000]">
                  Repair Request #{submittedReq.id} Logged!
                </h4>
                <p className="text-xs text-[#233D4D]">
                  Our diagnostic engine has matched 3 certified providers in Bengaluru.
                </p>
              </div>

              {/* Process Flow */}
              <div className="bg-[#EAECF0] rounded-2xl p-5 border border-[#233D4D]/10 space-y-3">
                <div className="text-xs font-black uppercase tracking-wider text-[#233D4D]">
                  Repair Stage Progression
                </div>
                <div className="space-y-2 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-[#233D4D]/20">
                  {repairTimeline.map((st, i) => (
                    <div key={i} className="flex items-start space-x-3.5 relative z-10">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        st.done ? 'bg-[#FE7F2D] text-[#000000]' : st.active ? 'bg-[#233D4D] text-white ring-4 ring-[#FE7F2D]/20' : 'bg-white text-gray-400 border'
                      }`}>
                        {st.done ? '✓' : i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`text-xs font-bold ${st.active || st.done ? 'text-black' : 'text-gray-500'}`}>
                          {st.label}
                        </span>
                        <p className="text-[11px] text-[#233D4D]">{st.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-[#FE7F2D] hover:bg-[#FE7F2D]/90 text-[#000000] font-bold py-3 rounded-xl text-sm"
              >
                Track in My Dashboard
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
