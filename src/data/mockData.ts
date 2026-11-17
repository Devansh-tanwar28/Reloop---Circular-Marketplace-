import { 
  RentalProduct, 
  ResellProduct, 
  RepairProvider, 
  RepairRequest, 
  Booking, 
  DamageClaim, 
  UserAccount 
} from '../types';

export const INITIAL_USER: UserAccount = {
  id: 'usr-101',
  name: 'Aarav Sharma',
  email: 'aarav.sharma@example.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'renter',
  verified: true,
  rating: 4.9,
  completedRentals: 14,
  successfulSales: 6,
  repairCount: 3,
  walletBalance: 8450,
  depositLocked: 3000,
  earnings: 24600,
  location: 'Indiranagar, Bengaluru',
  phone: '+91 98765 43210',
  bio: 'Visual designer & creator. Passionate about sustainable consumption and circular product lifecycles.'
};

export const MOCK_RENTAL_PRODUCTS: RentalProduct[] = [
  {
    id: 'rent-1',
    name: 'Sony Alpha A7 IV Full-Frame Camera',
    category: 'Cameras',
    condition: 'Like New',
    rating: 4.9,
    reviewsCount: 38,
    location: 'Koramangala, Bengaluru',
    rentalPricePerDay: 1200,
    securityDeposit: 6000,
    availability: 'Available Now',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80'
    ],
    owner: {
      name: 'Rohan Mehra',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      verified: true,
      rating: 4.95,
      reviewsCount: 52,
      responseRate: '15 mins',
      joinedDate: 'Mar 2023',
      identityVerified: true
    },
    description: '33MP Full-Frame Exmor R CMOS Sensor, 4K 60p 10-bit recording. Perfect for weddings, short films, and high-end commercial projects.',
    features: ['33MP Full-Frame', '4K 60fps Video', 'Dual SD card slots', 'Includes 2 Batteries & Charger', 'Lens mount cap & strap'],
    specifications: {
      'Sensor': '33MP Full-Frame Exmor R',
      'ISO Range': '100 - 51,200',
      'Battery': '2x NP-FZ100 (Included)',
      'Mount': 'Sony E-Mount'
    },
    rentalTerms: [
      'Original Government ID verification required at pickup',
      'Pre-rental video condition log recorded automatically',
      'Rain and dust protective gear must be used outdoors',
      'Security deposit refunded within 2 hours of verified return'
    ],
    conditionDocumented: true,
    pickupEvidenceRequired: true,
    totalRentalsCompleted: 44,
    aiSuggestedPrice: 1250
  },
  {
    id: 'rent-2',
    name: 'DJI Mavic 3 Pro Cine Drone Kit',
    category: 'Cameras',
    condition: 'Brand New',
    rating: 4.95,
    reviewsCount: 24,
    location: 'HSR Layout, Bengaluru',
    rentalPricePerDay: 2200,
    securityDeposit: 10000,
    availability: 'Available Now',
    images: [
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop&q=80'
    ],
    owner: {
      name: 'Pooja Hegde',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      verified: true,
      rating: 4.9,
      reviewsCount: 29,
      responseRate: '30 mins',
      joinedDate: 'Jan 2024',
      identityVerified: true
    },
    description: 'Triple-camera system with Hasselblad 4/3 CMOS camera, omnidirectional obstacle sensing, and 43-min flight time.',
    features: ['Hasselblad 4/3 CMOS', '3x Battery Fly-More Kit', 'DJI RC Pro Controller', 'ND Filter Set Included'],
    specifications: {
      'Max Flight Time': '43 mins per battery',
      'Video': '5.1K Apple ProRes / 4K 120fps',
      'Weight': '958 grams',
      'Transmission': '15km O3+'
    },
    rentalTerms: [
      'Drone pilot experience required or brief orientation check',
      'Comes with full propeller guards and hardcase',
      'GPS log auto-synced with rental check-in'
    ],
    conditionDocumented: true,
    pickupEvidenceRequired: true,
    totalRentalsCompleted: 19,
    aiSuggestedPrice: 2150
  },
  {
    id: 'rent-3',
    name: 'Apple MacBook Pro 16" (M3 Max, 64GB RAM)',
    category: 'Laptops',
    condition: 'Like New',
    rating: 4.88,
    reviewsCount: 19,
    location: 'Indiranagar, Bengaluru',
    rentalPricePerDay: 1800,
    securityDeposit: 15000,
    availability: 'Available Now',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80'
    ],
    owner: {
      name: 'Vikram Aditya',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      verified: true,
      rating: 5.0,
      reviewsCount: 41,
      responseRate: '5 mins',
      joinedDate: 'Aug 2022',
      identityVerified: true
    },
    description: 'Supercharged power for 3D rendering, machine learning modeling, and 8K multi-stream video editing. Pristine condition with AppleCare+ coverage.',
    features: ['M3 Max 16-core CPU, 40-core GPU', '64GB Unified Memory', '2TB Ultra-fast SSD', 'Liquid Retina XDR Display'],
    specifications: {
      'Processor': 'Apple M3 Max',
      'RAM': '64GB Unified',
      'Storage': '2TB SSD',
      'Battery Health': '98%'
    },
    rentalTerms: [
      'Standard data wiping protocol performed before and after rental',
      'Includes original MagSafe 140W charger and hard shell sleeve'
    ],
    conditionDocumented: true,
    pickupEvidenceRequired: true,
    totalRentalsCompleted: 31,
    aiSuggestedPrice: 1750
  },
  {
    id: 'rent-4',
    name: 'Bosch Professional 18V Cordless Power Drill & Tool Kit',
    category: 'Tools',
    condition: 'Good Condition',
    rating: 4.75,
    reviewsCount: 56,
    location: 'Whitefield, Bengaluru',
    rentalPricePerDay: 350,
    securityDeposit: 1500,
    availability: 'Available Now',
    images: [
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?w=800&auto=format&fit=crop&q=80'
    ],
    owner: {
      name: 'Karthik Rao',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      verified: true,
      rating: 4.8,
      reviewsCount: 63,
      responseRate: '40 mins',
      joinedDate: 'Jun 2023',
      identityVerified: true
    },
    description: 'Heavy duty brushless combi drill, complete bit set (masonry, wood, metal), 2x 4.0Ah batteries, and fast charger in robust L-BOXX.',
    features: ['18V Brushless Motor', '60Nm Torque', '28pc Drill Bit Accessories', 'Heavy-duty Carry Case'],
    specifications: {
      'Voltage': '18V Li-ion',
      'Chuck Capacity': '13mm Keyless',
      'Weight': '1.8 kg'
    },
    rentalTerms: [
      'Safety goggles and work gloves provided free of charge',
      'Clean before return'
    ],
    conditionDocumented: true,
    pickupEvidenceRequired: true,
    totalRentalsCompleted: 88,
    aiSuggestedPrice: 350
  },
  {
    id: 'rent-5',
    name: 'Breville Barista Touch Espresso Machine',
    category: 'Appliances',
    condition: 'Like New',
    rating: 4.92,
    reviewsCount: 16,
    location: 'Jayanagar, Bengaluru',
    rentalPricePerDay: 750,
    securityDeposit: 4000,
    availability: 'Available Now',
    images: [
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80'
    ],
    owner: {
      name: 'Ananya Deshmukh',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      verified: true,
      rating: 4.95,
      reviewsCount: 22,
      responseRate: '10 mins',
      joinedDate: 'Nov 2023',
      identityVerified: true
    },
    description: 'Automated touchscreen cafe-quality espresso machine with ThermoJet 3-second heat up and automatic microfoam milk texturing.',
    features: ['Integrated Burr Grinder', 'Touchscreen preset drinks', 'ThermoJet Fast Heat', 'Includes Milk Pitcher & Tamper'],
    specifications: {
      'Capacity': '2L Water Tank',
      'Pressure': '15 Bar Italian Pump',
      'Heating': 'ThermoJet System'
    },
    rentalTerms: [
      'Use only filtered or bottled water to prevent scale',
      'Includes complimentary bag of freshly roasted beans'
    ],
    conditionDocumented: true,
    pickupEvidenceRequired: true,
    totalRentalsCompleted: 23,
    aiSuggestedPrice: 800
  },
  {
    id: 'rent-6',
    name: 'Oculus Meta Quest 3 VR Gaming Headset (512GB)',
    category: 'Electronics',
    condition: 'Like New',
    rating: 4.85,
    reviewsCount: 42,
    location: 'Indiranagar, Bengaluru',
    rentalPricePerDay: 650,
    securityDeposit: 3500,
    availability: 'Available Now',
    images: [
      'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800&auto=format&fit=crop&q=80'
    ],
    owner: {
      name: 'Sameer Sen',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      verified: true,
      rating: 4.87,
      reviewsCount: 35,
      responseRate: '20 mins',
      joinedDate: 'Feb 2024',
      identityVerified: true
    },
    description: 'Next-gen breakthrough mixed reality headset with 4K+ Infinite Display, Touch Plus controllers with TruTouch haptics, loaded with top games.',
    features: ['Full Color Passthrough', '512GB Storage with 15 pre-installed games', 'Elite Strap with Battery Included', 'Sanitized silicone face guard'],
    specifications: {
      'Resolution': '2064x2208 per eye',
      'Refresh Rate': '120Hz',
      'Weight': '515g'
    },
    rentalTerms: [
      'Wiped and UV-C sanitized before handover',
      'Lens microfiber protector must remain when stored'
    ],
    conditionDocumented: true,
    pickupEvidenceRequired: true,
    totalRentalsCompleted: 50,
    aiSuggestedPrice: 650
  },
  {
    id: 'rent-7',
    name: 'Trek Marlin 7 Mountain Bike (Hydro Brakes)',
    category: 'Sports',
    condition: 'Good Condition',
    rating: 4.8,
    reviewsCount: 21,
    location: 'Sarjapur Road, Bengaluru',
    rentalPricePerDay: 450,
    securityDeposit: 2000,
    availability: 'Available Now',
    images: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&auto=format&fit=crop&q=80'
    ],
    owner: {
      name: 'Ritu Varma',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      verified: true,
      rating: 4.9,
      reviewsCount: 18,
      responseRate: '1 hour',
      joinedDate: 'May 2023',
      identityVerified: true
    },
    description: 'Smooth trail-ready mountain bike with RockShox lockout fork, 1x10 Shimano Deore drivetrain, and Shimano hydraulic disc brakes. Size M/L.',
    features: ['RockShox Judy Suspension', 'Shimano Deore 1x10', 'Hydraulic Disc Brakes', 'Includes Helmet & U-Lock'],
    specifications: {
      'Frame': 'Alpha Silver Aluminum',
      'Wheel Size': '29 inch',
      'Brakes': 'Shimano MT200 Hydraulic'
    },
    rentalTerms: ['Heavy duty lock provided', 'Wear helmet while riding'],
    conditionDocumented: true,
    pickupEvidenceRequired: true,
    totalRentalsCompleted: 27,
    aiSuggestedPrice: 450
  },
  {
    id: 'rent-8',
    name: 'Herman Miller Aeron Ergonomic Chair (Size B)',
    category: 'Furniture',
    condition: 'Like New',
    rating: 4.96,
    reviewsCount: 14,
    location: 'Koramangala, Bengaluru',
    rentalPricePerDay: 300,
    securityDeposit: 3000,
    availability: 'Available Now',
    images: [
      'https://images.unsplash.com/photo-1580481077194-0d5b512c0a96?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1589584649628-b80c5383569c?w=800&auto=format&fit=crop&q=80'
    ],
    owner: {
      name: 'Arjun Singhal',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      verified: true,
      rating: 4.97,
      reviewsCount: 33,
      responseRate: '15 mins',
      joinedDate: 'Oct 2022',
      identityVerified: true
    },
    description: 'The definitive gold-standard ergonomic office chair. Fully loaded with PostureFit SL, fully adjustable arms, and Pellicle 8Z breathable mesh.',
    features: ['PostureFit SL Support', 'Forward Tilt & Tilt Limiter', '3D Adjustable Armrests', 'Graphite Frame'],
    specifications: {
      'Size': 'Medium (Size B)',
      'Weight Capacity': '159 kg',
      'Adjustment': 'Full Harmonic Tilt'
    },
    rentalTerms: ['Delivered via doorstep concierge in protected transit wrap'],
    conditionDocumented: true,
    pickupEvidenceRequired: true,
    totalRentalsCompleted: 39,
    aiSuggestedPrice: 320
  }
];

export const MOCK_RESELL_PRODUCTS: ResellProduct[] = [
  {
    id: 'resell-1',
    name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    category: 'Electronics',
    brand: 'Sony',
    age: '8 months',
    condition: 'Like New',
    originalPrice: 29990,
    sellingPrice: 16500,
    location: 'Indiranagar, Bengaluru',
    seller: {
      name: 'Nikhil Roy',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      verified: true,
      rating: 4.9,
      reviewsCount: 14,
      responseRate: '10 mins',
      joinedDate: 'Apr 2023',
      identityVerified: true
    },
    description: 'Industry-leading noise cancellation, exceptional battery life (30+ hours). Original bill, retail box, carrying case, and audio cable included. No scuffs.',
    images: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
    ],
    interestedBuyers: 7,
    postedDate: '2 days ago',
    verifiedListing: true
  },
  {
    id: 'resell-2',
    name: 'Fujifilm X-T30 II Mirrorless Camera with 18-55mm Lens',
    category: 'Cameras',
    brand: 'Fujifilm',
    age: '1.2 years',
    condition: 'Like New',
    originalPrice: 88990,
    sellingPrice: 54000,
    location: 'Koramangala, Bengaluru',
    seller: {
      name: 'Maya Nambiar',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      verified: true,
      rating: 4.85,
      reviewsCount: 19,
      responseRate: '25 mins',
      joinedDate: 'Jan 2023',
      identityVerified: true
    },
    description: 'Iconic film simulations, 26.1MP X-Trans CMOS 4 sensor. Shutter count under 4,200. Clean optical glass with UV filter on since day one.',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80'
    ],
    interestedBuyers: 12,
    postedDate: '1 day ago',
    verifiedListing: true
  },
  {
    id: 'resell-3',
    name: 'Dell UltraSharp 27" 4K USB-C Monitor (U2723QE)',
    category: 'Electronics',
    brand: 'Dell',
    age: '1 year',
    condition: 'Good Condition',
    originalPrice: 52000,
    sellingPrice: 28500,
    location: 'HSR Layout, Bengaluru',
    seller: {
      name: 'Devraj Joshi',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      verified: true,
      rating: 5.0,
      reviewsCount: 8,
      responseRate: '1 hour',
      joinedDate: 'Sep 2023',
      identityVerified: true
    },
    description: 'IPS Black technology with 2000:1 contrast ratio, 90W USB-C Power Delivery, 98% DCI-P3 color gamut. Zero dead pixels.',
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80'
    ],
    interestedBuyers: 5,
    postedDate: '3 days ago',
    verifiedListing: true
  },
  {
    id: 'resell-4',
    name: 'DeWalt 20V Max Cordless Miter Saw & Stand',
    category: 'Tools',
    brand: 'DeWalt',
    age: '1.5 years',
    condition: 'Well Maintained',
    originalPrice: 42000,
    sellingPrice: 21000,
    location: 'Bellandur, Bengaluru',
    seller: {
      name: 'Rajesh Nair',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      verified: true,
      rating: 4.8,
      reviewsCount: 26,
      responseRate: '45 mins',
      joinedDate: 'Jul 2022',
      identityVerified: true
    },
    description: 'Precision compound miter saw used for DIY wood craft projects. Carbide blade sharp, includes heavy duty stand and dust collection bag.',
    images: [
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=80'
    ],
    interestedBuyers: 4,
    postedDate: '4 days ago',
    verifiedListing: true
  }
];

export const MOCK_REPAIR_PROVIDERS: RepairProvider[] = [
  {
    id: 'rep-1',
    name: 'TechFix Pro Labs',
    specialization: 'Camera Sensors, Lenses & Micro-electronics',
    category: 'Cameras',
    rating: 4.95,
    reviewsCount: 142,
    distance: '2.4 km',
    location: 'Indiranagar 100ft Road',
    estimatedPrice: '₹800 - ₹3,500',
    availability: 'Open Today (Until 8:00 PM)',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=150&auto=format&fit=crop&q=80',
    completedRepairs: 610,
    turnaroundTime: '24-48 hours'
  },
  {
    id: 'rep-2',
    name: 'iCircuit Board & Laptop Hospital',
    specialization: 'Logic Board Repair, Screen Replacement & Battery',
    category: 'Laptops',
    rating: 4.9,
    reviewsCount: 220,
    distance: '3.8 km',
    location: 'Koramangala 5th Block',
    estimatedPrice: '₹1,200 - ₹5,000',
    availability: 'Open Today (Until 9:00 PM)',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=150&auto=format&fit=crop&q=80',
    completedRepairs: 1240,
    turnaroundTime: 'Same Day / 24h'
  },
  {
    id: 'rep-3',
    name: 'GreenCycle Appliance & Motor Works',
    specialization: 'Coffee Machines, Motors, Blenders & Kitchen Tech',
    category: 'Appliances',
    rating: 4.82,
    reviewsCount: 88,
    distance: '4.1 km',
    location: 'HSR Layout Sector 2',
    estimatedPrice: '₹500 - ₹2,200',
    availability: 'Open Tomorrow (9:00 AM)',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=150&auto=format&fit=crop&q=80',
    completedRepairs: 430,
    turnaroundTime: '2-3 days'
  },
  {
    id: 'rep-4',
    name: 'VoltCraft Precision Power Tools',
    specialization: 'Armature Rewinding, Carbon Brushes, Drill Motors',
    category: 'Tools',
    rating: 4.88,
    reviewsCount: 96,
    distance: '5.2 km',
    location: 'BTM Layout',
    estimatedPrice: '₹400 - ₹1,800',
    availability: 'Open Today (Until 7:30 PM)',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=150&auto=format&fit=crop&q=80',
    completedRepairs: 512,
    turnaroundTime: '24-36 hours'
  }
];

export const MOCK_REPAIR_REQUESTS: RepairRequest[] = [
  {
    id: 'req-901',
    productName: 'Sony A7 III Shutter Mechanism Jam',
    category: 'Cameras',
    brandModel: 'Sony Alpha 7 III',
    problemDescription: 'Shutter gives Error 34 and gets stuck when firing bursts above 1/1000s.',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    location: 'Indiranagar, Bengaluru',
    preferredDate: '2026-08-25',
    status: 'In Repair',
    quotationAmount: 2400,
    providerName: 'TechFix Pro Labs',
    submittedDate: '2026-08-21'
  },
  {
    id: 'req-902',
    productName: 'MacBook Pro Trackpad Click Stuck',
    category: 'Laptops',
    brandModel: 'MacBook Pro 14" (2021)',
    problemDescription: 'Haptic feedback is intermittent and lower half does not click cleanly.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    location: 'Koramangala, Bengaluru',
    preferredDate: '2026-08-26',
    status: 'Quotation',
    quotationAmount: 1800,
    providerName: 'iCircuit Board & Laptop Hospital',
    submittedDate: '2026-08-22'
  }
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'bk-501',
    productId: 'rent-1',
    productName: 'Sony Alpha A7 IV Full-Frame Camera',
    productImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    startDate: '2026-08-28',
    endDate: '2026-08-30',
    days: 2,
    rentalAmount: 2400,
    securityDeposit: 6000,
    platformFee: 150,
    totalAmount: 8550,
    status: 'Pickup Scheduled',
    pickupDate: '2026-08-28 (10:00 AM)',
    returnDate: '2026-08-30 (06:00 PM)',
    ownerName: 'Rohan Mehra',
    location: 'Koramangala, Bengaluru',
    depositStatus: 'Held in Escrow'
  },
  {
    id: 'bk-502',
    productId: 'rent-4',
    productName: 'Bosch Professional 18V Cordless Power Drill Kit',
    productImage: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=80',
    startDate: '2026-08-15',
    endDate: '2026-08-18',
    days: 3,
    rentalAmount: 1050,
    securityDeposit: 1500,
    platformFee: 75,
    totalAmount: 2625,
    status: 'Deposit Refunded',
    pickupDate: '2026-08-15',
    returnDate: '2026-08-18',
    ownerName: 'Karthik Rao',
    location: 'Whitefield, Bengaluru',
    depositStatus: 'Released'
  }
];

export const MOCK_DAMAGE_CLAIM: DamageClaim = {
  id: 'clm-882',
  rentalId: 'bk-449',
  productName: 'DJI Ronin RS3 Gimbal Stabilizer',
  renterName: 'Vikram Chauhan',
  ownerName: 'Pooja Hegde',
  beforeImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80',
  afterImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80',
  differenceDescription: 'Noticeable 1.8cm hairline fracture and scuff on lower pan motor axis clamp arm.',
  aiConfidence: 94.2,
  estimatedRepairCost: 1450,
  ownerNotes: 'The stabilizer was handed over in pristine mint condition. Upon return check-in, motor arm #2 exhibited stress fracture and deep scratch.',
  renterNotes: 'The gimbal was stored in the original foam hard case. It may have occurred during normal balance adjustment, but I am open to fair evaluation.',
  status: 'AI Flagged',
  dateReported: '2026-08-22'
};
