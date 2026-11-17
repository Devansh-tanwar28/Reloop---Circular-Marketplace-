export type NavigationPage = 
  | 'home' 
  | 'rent' 
  | 'repair' 
  | 'resell' 
  | 'trust-safety' 
  | 'damage-claim'
  | 'ai-insights' 
  | 'dashboard' 
  | 'profile' 
  | 'admin'
  | 'how-it-works';

export type ProductCategory = 
  | 'All'
  | 'Cameras' 
  | 'Laptops' 
  | 'Electronics' 
  | 'Tools' 
  | 'Furniture' 
  | 'Sports' 
  | 'Vehicles' 
  | 'Appliances' 
  | 'Other';

export type ProductCondition = 'Brand New' | 'Like New' | 'Good Condition' | 'Well Maintained';

export interface OwnerProfile {
  name: string;
  avatar: string;
  verified: boolean;
  rating: number;
  reviewsCount: number;
  responseRate: string;
  joinedDate: string;
  identityVerified: boolean;
}

export interface RentalProduct {
  id: string;
  name: string;
  category: ProductCategory;
  condition: ProductCondition;
  rating: number;
  reviewsCount: number;
  location: string;
  rentalPricePerDay: number;
  securityDeposit: number;
  availability: 'Available Now' | 'Reserved' | 'In Rental';
  images: string[];
  owner: OwnerProfile;
  description: string;
  features: string[];
  specifications: Record<string, string>;
  rentalTerms: string[];
  conditionDocumented: boolean;
  pickupEvidenceRequired: boolean;
  totalRentalsCompleted: number;
  aiSuggestedPrice?: number;
}

export interface ResellProduct {
  id: string;
  name: string;
  category: ProductCategory;
  brand: string;
  age: string;
  condition: ProductCondition;
  originalPrice: number;
  sellingPrice: number;
  location: string;
  seller: OwnerProfile;
  description: string;
  images: string[];
  interestedBuyers: number;
  postedDate: string;
  verifiedListing: boolean;
}

export interface RepairProvider {
  id: string;
  name: string;
  specialization: string;
  category: ProductCategory;
  rating: number;
  reviewsCount: number;
  distance: string;
  location: string;
  estimatedPrice: string;
  availability: string;
  verified: boolean;
  avatar: string;
  completedRepairs: number;
  turnaroundTime: string;
}

export interface RepairRequest {
  id: string;
  productName: string;
  category: ProductCategory;
  brandModel: string;
  problemDescription: string;
  image?: string;
  location: string;
  preferredDate: string;
  status: 'Submitted' | 'Provider Matching' | 'Inspection' | 'Quotation' | 'Approved' | 'In Repair' | 'Completed';
  quotationAmount?: number;
  providerName?: string;
  submittedDate: string;
}

export interface Booking {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  startDate: string;
  endDate: string;
  days: number;
  rentalAmount: number;
  securityDeposit: number;
  platformFee: number;
  totalAmount: number;
  status: 'Booking Confirmed' | 'Pickup Scheduled' | 'Rental Active' | 'Return Product' | 'Condition Verified' | 'Deposit Refunded';
  pickupDate: string;
  returnDate: string;
  ownerName: string;
  location: string;
  depositStatus: 'Held in Escrow' | 'Released' | 'Partial Deduction';
}

export interface DamageClaim {
  id: string;
  rentalId: string;
  productName: string;
  renterName: string;
  ownerName: string;
  beforeImage: string;
  afterImage: string;
  differenceDescription: string;
  aiConfidence: number;
  estimatedRepairCost: number;
  ownerNotes: string;
  renterNotes?: string;
  status: 'AI Flagged' | 'Under Review' | 'Disputed' | 'Accepted' | 'Admin Review' | 'Resolved';
  dateReported: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'renter' | 'owner' | 'repair_specialist' | 'admin';
  verified: boolean;
  rating: number;
  completedRentals: number;
  successfulSales: number;
  repairCount: number;
  walletBalance: number;
  depositLocked: number;
  earnings: number;
  location: string;
  phone: string;
  bio: string;
}
