import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Camera, 
  SlidersHorizontal, 
  ArrowUpDown, 
  CheckCircle2, 
  Sparkles,
  Calendar,
  Layers,
  ChevronDown
} from 'lucide-react';
import { RentalProduct, ProductCategory, ProductCondition } from '../types';

interface RentMarketplaceProps {
  products: RentalProduct[];
  onSelectProduct: (product: RentalProduct) => void;
  onOpenBooking: (product: RentalProduct, days: number) => void;
}

export const RentMarketplace: React.FC<RentMarketplaceProps> = ({
  products,
  onSelectProduct,
  onOpenBooking
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [selectedCondition, setSelectedCondition] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [sortBy, setSortBy] = useState<'recommended' | 'price-low' | 'price-high' | 'rating'>('recommended');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  const categories: ProductCategory[] = [
    'All',
    'Cameras',
    'Laptops',
    'Electronics',
    'Tools',
    'Appliances',
    'Sports',
    'Furniture'
  ];

  const locations = ['All', 'Indiranagar', 'Koramangala', 'HSR Layout', 'Whitefield', 'Jayanagar'];

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesLocation = selectedLocation === 'All' || p.location.toLowerCase().includes(selectedLocation.toLowerCase());
    const matchesCondition = selectedCondition === 'All' || p.condition === selectedCondition;
    const matchesPrice = p.rentalPricePerDay <= maxPrice;

    return matchesSearch && matchesCategory && matchesLocation && matchesCondition && matchesPrice;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.rentalPricePerDay - b.rentalPricePerDay;
    if (sortBy === 'price-high') return b.rentalPricePerDay - a.rentalPricePerDay;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // recommended
  });

  return (
    <div className="py-10 bg-[#EAECF0]/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 bg-white px-3 py-1 rounded-full text-xs font-bold text-[#233D4D] border border-[#233D4D]/10 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#FE7F2D]" />
                <span>Verified Rental Inventory</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-[#000000] tracking-tight">
                Find Something You Need
              </h1>
              <p className="text-sm text-[#233D4D] mt-1">
                High-end cameras, computing power, tools & gear with escrow deposits and condition guarantees.
              </p>
            </div>

            {/* Quick stats pill */}
            <div className="flex items-center space-x-3 bg-white p-2 rounded-xl border border-[#233D4D]/10 text-xs font-bold text-[#233D4D] shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Escrow Protected</span>
              <span className="text-gray-300">|</span>
              <Camera className="w-4 h-4 text-[#FE7F2D]" />
              <span>Photo Condition Verified</span>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#233D4D]/15 mb-8 space-y-4">
          
          {/* Main Search Input */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                id="input-rental-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cameras, laptops, tools, bikes, gear..."
                className="w-full pl-12 pr-4 py-3 bg-[#EAECF0] rounded-xl text-sm font-medium text-[#000000] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FE7F2D] border border-transparent"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-black"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <div className="relative shrink-0 w-full sm:w-auto">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full bg-[#EAECF0] text-xs font-bold text-[#233D4D] px-4 py-3 rounded-xl appearance-none pr-8 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FE7F2D]"
                >
                  <option value="recommended">Sort: Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
                <ArrowUpDown className="w-3.5 h-3.5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilterDrawer(!showFilterDrawer)}
                className="sm:hidden bg-[#233D4D] text-white p-3 rounded-xl shrink-0"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Category Chips Scroll */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                id={`cat-chip-${cat.toLowerCase()}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#FE7F2D] text-[#000000] shadow-xs'
                    : 'bg-[#EAECF0] text-[#233D4D] hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Secondary Filters (Location, Price, Condition) */}
          <div className={`pt-3 border-t border-[#EAECF0] grid grid-cols-1 sm:grid-cols-3 gap-4 ${showFilterDrawer ? 'block' : 'hidden sm:grid'}`}>
            
            {/* Location selector */}
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#233D4D] mb-1">
                Location Area
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full bg-[#EAECF0] text-xs font-bold text-[#233D4D] px-3 py-2 rounded-lg outline-none"
              >
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc === 'All' ? 'All Bengaluru Areas' : loc}</option>
                ))}
              </select>
            </div>

            {/* Condition selector */}
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#233D4D] mb-1">
                Minimum Condition
              </label>
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="w-full bg-[#EAECF0] text-xs font-bold text-[#233D4D] px-3 py-2 rounded-lg outline-none"
              >
                <option value="All">All Conditions</option>
                <option value="Brand New">Brand New</option>
                <option value="Like New">Like New</option>
                <option value="Good Condition">Good Condition</option>
              </select>
            </div>

            {/* Max Daily Price Slider */}
            <div>
              <div className="flex justify-between text-[11px] font-extrabold uppercase tracking-wider text-[#233D4D] mb-1">
                <span>Max Daily Rent</span>
                <span className="text-[#FE7F2D]">₹{maxPrice.toLocaleString()}/day</span>
              </div>
              <input
                type="range"
                min="300"
                max="3000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full accent-[#FE7F2D]"
              />
            </div>

          </div>

        </div>

        {/* Results Count & Active Filter Tags */}
        <div className="flex items-center justify-between mb-6 text-xs text-[#233D4D]">
          <span className="font-bold">
            Showing <span className="text-[#000000] font-black">{filteredProducts.length}</span> available items
          </span>
          {(selectedCategory !== 'All' || selectedLocation !== 'All' || searchQuery !== '') && (
            <button 
              onClick={() => {
                setSelectedCategory('All');
                setSelectedLocation('All');
                setSelectedCondition('All');
                setSearchQuery('');
                setMaxPrice(3000);
              }}
              className="text-[#FE7F2D] hover:underline font-bold"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                id={`rental-card-${product.id}`}
                className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all border border-[#233D4D]/10 flex flex-col justify-between group"
              >
                {/* Card Top: Image & Badges */}
                <div 
                  className="relative aspect-4/3 overflow-hidden bg-[#EAECF0] cursor-pointer"
                  onClick={() => onSelectProduct(product)}
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Condition badge */}
                  <div className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{product.condition}</span>
                  </div>

                  {/* Rating badge */}
                  <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-[#000000] text-[11px] font-black px-2 py-0.5 rounded-lg flex items-center shadow-xs">
                    <Star className="w-3 h-3 fill-[#FE7F2D] text-[#FE7F2D] mr-1" />
                    <span>{product.rating}</span>
                  </div>

                  {/* Verified Owner chip */}
                  <div className="absolute bottom-2.5 left-2.5 bg-[#233D4D]/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3 text-[#FE7F2D]" />
                    <span>Verified Owner</span>
                  </div>
                </div>

                {/* Card Middle: Info */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-[#233D4D] font-semibold mb-1">
                      <span className="text-gray-500 uppercase font-bold text-[10px] tracking-wider">{product.category}</span>
                      <span className="flex items-center text-gray-600">
                        <MapPin className="w-3 h-3 text-[#FE7F2D] mr-0.5" />
                        {product.location.split(',')[0]}
                      </span>
                    </div>

                    <h3 
                      onClick={() => onSelectProduct(product)}
                      className="font-display font-extrabold text-sm text-[#000000] line-clamp-2 leading-snug group-hover:text-[#FE7F2D] transition-colors cursor-pointer"
                    >
                      {product.name}
                    </h3>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="pt-2 border-t border-[#EAECF0] space-y-1">
                    <div className="flex items-baseline justify-between">
                      <span className="text-lg font-display font-extrabold text-[#000000]">
                        ₹{product.rentalPricePerDay.toLocaleString()}
                        <span className="text-[11px] text-gray-500 font-normal"> / day</span>
                      </span>
                      <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                        Available
                      </span>
                    </div>

                    <div className="text-[11px] text-gray-500 flex justify-between">
                      <span>Security Deposit:</span>
                      <span className="font-bold text-[#233D4D]">₹{product.securityDeposit.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Card Bottom: Action Buttons */}
                <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSelectProduct(product)}
                    className="bg-[#EAECF0] hover:bg-[#233D4D] hover:text-white text-[#233D4D] text-xs font-bold py-2 rounded-xl text-center transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    id={`btn-rent-now-${product.id}`}
                    onClick={() => onOpenBooking(product, 3)}
                    className="bg-[#FE7F2D] hover:bg-[#FE7F2D]/90 text-[#000000] text-xs font-black py-2 rounded-xl text-center shadow-xs transition-all active:scale-95"
                  >
                    Rent Now
                  </button>
                </div>

              </div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="bg-white rounded-2xl p-12 text-center max-w-md mx-auto border border-[#233D4D]/10 space-y-4">
            <div className="w-16 h-16 bg-[#EAECF0] rounded-full flex items-center justify-center mx-auto text-gray-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-display font-extrabold text-[#000000]">No matching rental products</h3>
            <p className="text-xs text-[#233D4D]">
              Try adjusting your category, price range, or clearing the search terms.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedLocation('All');
                setSearchQuery('');
                setMaxPrice(3000);
              }}
              className="bg-[#FE7F2D] text-[#000000] font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs"
            >
              Clear Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
