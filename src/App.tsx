import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CoreServices } from './components/CoreServices';
import { HowItWorks } from './components/HowItWorks';
import { RentMarketplace } from './components/RentMarketplace';
import { ProductDetailModal } from './components/ProductDetailModal';
import { BookingModal } from './components/BookingModal';
import { RepairMarketplace } from './components/RepairMarketplace';
import { CreateRepairModal } from './components/CreateRepairModal';
import { ResellMarketplace } from './components/ResellMarketplace';
import { CreateListingModal } from './components/CreateListingModal';
import { TrustSafetyPage } from './components/TrustSafetyPage';
import { DamageClaimInterface } from './components/DamageClaimInterface';
import { AiInsightsDashboard } from './components/AiInsightsDashboard';
import { UserDashboard } from './components/UserDashboard';
import { ProfilePage } from './components/ProfilePage';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';

import { 
  MOCK_RENTAL_PRODUCTS, 
  MOCK_RESELL_PRODUCTS, 
  MOCK_REPAIR_PROVIDERS, 
  MOCK_BOOKINGS, 
  MOCK_REPAIR_REQUESTS, 
  MOCK_DAMAGE_CLAIM, 
  INITIAL_USER 
} from './data/mockData';

import { 
  NavigationPage, 
  RentalProduct, 
  ResellProduct, 
  Booking, 
  RepairRequest, 
  ProductCategory,
  UserAccount
} from './types';

import {
  apiGetRentals,
  apiGetResellProducts,
  apiGetRepairProviders,
  apiGetBookings,
  apiGetRepairRequests,
  apiGetClaims,
  apiGetCurrentUser,
  apiApproveQuotation,
  setAuthToken
} from './services/api';

export default function App() {
  // Navigation State
  const [currentPage, setCurrentPage] = useState<NavigationPage>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Data Collections State (initialized with mock, synced with DB)
  const [rentalProducts, setRentalProducts] = useState<RentalProduct[]>(MOCK_RENTAL_PRODUCTS);
  const [resellProducts, setResellProducts] = useState<ResellProduct[]>(MOCK_RESELL_PRODUCTS);
  const [repairProviders, setRepairProviders] = useState(MOCK_REPAIR_PROVIDERS);
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [repairRequests, setRepairRequests] = useState<RepairRequest[]>(MOCK_REPAIR_REQUESTS);
  const [damageClaim, setDamageClaim] = useState(MOCK_DAMAGE_CLAIM);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(INITIAL_USER);

  // Modal States
  const [selectedRentalProduct, setSelectedRentalProduct] = useState<RentalProduct | null>(null);
  const [bookingProduct, setBookingProduct] = useState<RentalProduct | null>(null);
  const [bookingDays, setBookingDays] = useState<number>(3);
  const [isCreateRepairOpen, setIsCreateRepairOpen] = useState(false);
  const [repairPreselectCategory, setRepairPreselectCategory] = useState<ProductCategory | undefined>(undefined);
  const [repairPreselectProvider, setRepairPreselectProvider] = useState<string | undefined>(undefined);
  const [isCreateListingOpen, setIsCreateListingOpen] = useState(false);
  const [listingInitialMode, setListingInitialMode] = useState<'resell' | 'rent'>('resell');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const refreshCurrentUser = async () => {
    try {
      const user = await apiGetCurrentUser();
      if (user) setCurrentUser(user);
    } catch {
      // Ignore if unauthenticated
    }
  };

  // Load actual data from SQLite REST Backend on mount
  React.useEffect(() => {
    // 1. Check logged in user
    apiGetCurrentUser().then(user => {
      if (user) setCurrentUser(user);
    }).catch(() => {});

    // 2. Fetch rental products
    apiGetRentals().then(data => {
      if (data && data.length > 0) setRentalProducts(data);
    }).catch(err => console.warn('Using baseline rentals:', err));

    // 3. Fetch resell products
    apiGetResellProducts().then(data => {
      if (data && data.length > 0) setResellProducts(data);
    }).catch(err => console.warn('Using baseline resell:', err));

    // 4. Fetch repair providers
    apiGetRepairProviders().then(data => {
      if (data && data.length > 0) setRepairProviders(data);
    }).catch(err => console.warn('Using baseline providers:', err));

    // 5. Fetch bookings
    apiGetBookings().then(data => {
      if (data && data.length > 0) setBookings(data);
    }).catch(err => console.warn('Using baseline bookings:', err));

    // 6. Fetch repair requests
    apiGetRepairRequests().then(data => {
      if (data && data.length > 0) setRepairRequests(data);
    }).catch(err => console.warn('Using baseline repairs:', err));

    // 7. Fetch damage claims
    apiGetClaims().then(data => {
      if (data && data.length > 0) setDamageClaim(data[0]);
    }).catch(err => console.warn('Using baseline claims:', err));
  }, []);

  // Handlers
  const handleNavigate = (page: NavigationPage) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openCreateListing = (mode: 'resell' | 'rent' = 'resell') => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setListingInitialMode(mode);
    setIsCreateListingOpen(true);
  };

  const handleLogout = () => {
    setAuthToken(null);
    setCurrentUser(null);
    showToast('Logged out of ReLoop.');
  };

  const handleOpenRentalDetail = (product: RentalProduct) => {
    setSelectedRentalProduct(product);
  };

  const handleStartBooking = (product: RentalProduct, days = 3) => {
    setSelectedRentalProduct(null);
    setBookingDays(days);
    setBookingProduct(product);
  };

  const handleBookingConfirmed = (newBooking: Booking) => {
    setBookings(prev => [newBooking, ...prev]);
    setBookingProduct(null);
    refreshCurrentUser();
    showToast(`Rental for ${newBooking.productName} confirmed! Security deposit placed in Escrow.`);
    setCurrentPage('dashboard');
  };

  const handleBookingStatusUpdated = (
    bookingId: string,
    newStatus: Booking['status'],
    depositStatus: Booking['depositStatus']
  ) => {
    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status: newStatus, depositStatus } : b))
    );
    refreshCurrentUser();
    showToast(`Booking ${bookingId} updated to: ${newStatus}`);
  };

  const handleOpenCreateRepair = (category?: ProductCategory, providerName?: string) => {
    setRepairPreselectCategory(category);
    setRepairPreselectProvider(providerName);
    setIsCreateRepairOpen(true);
  };

  const handleRepairSubmitted = (newReq: RepairRequest) => {
    setRepairRequests(prev => [newReq, ...prev]);
    showToast(`Repair request for ${newReq.productName} submitted to technicians!`);
  };

  const handleApproveQuotation = async (reqId: string) => {
    try {
      await apiApproveQuotation(reqId);
    } catch (err) {
      console.warn('API approve error:', err);
    }
    setRepairRequests(prev => prev.map(r => (r.id === reqId ? { ...r, status: 'Approved' } : r)));
    showToast('Quotation approved! Technician scheduled to begin repair.');
  };

  const handleListingCreated = (newListing: ResellProduct) => {
    setResellProducts(prev => [newListing, ...prev]);
    showToast(`Listing for ${newListing.name} published to Resell marketplace!`);
    setCurrentPage('resell');
  };

  const handleRentalCreated = (newRental: RentalProduct) => {
    setRentalProducts(prev => [newRental, ...prev]);
    showToast(`Rental listing for ${newRental.name} published to Rent marketplace!`);
    setCurrentPage('rent');
  };

  const handlePurchaseSuccess = (product: ResellProduct) => {
    setResellProducts(prev => prev.filter(p => p.id !== product.id));
    refreshCurrentUser();
    showToast(`Order confirmed for ${product.name}! Funds held in Buyer Protection Escrow.`);
  };

  // If in Admin View mode, render Admin Panel directly
  if (currentPage === 'admin') {
    return (
      <AdminPanel 
        onExitAdmin={() => setCurrentPage('home')}
        onOpenDisputeDetail={() => setCurrentPage('damage-claim')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#EAECF0]/30 text-[#000000] flex flex-col font-sans selection:bg-[#FE7F2D] selection:text-black">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#233D4D] text-white px-5 py-3.5 rounded-2xl shadow-2xl border-2 border-[#FE7F2D] text-xs font-bold flex items-center space-x-2.5 animate-in slide-in-from-bottom-5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FE7F2D] animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar 
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenCreateListing={openCreateListing}
        onOpenRepairRequest={() => handleOpenCreateRepair()}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onSearchOpen={() => handleNavigate('rent')}
      />

      {/* Page Routing */}
      <main className="flex-1">
        
        {/* 1. HOME VIEW */}
        {currentPage === 'home' && (
          <>
            <HeroSection 
              onNavigate={handleNavigate}
              onOpenCreateListing={() => openCreateListing('resell')}
            />

            <CoreServices onNavigate={handleNavigate} />

            <div id="home-featured-rentals">
              <RentMarketplace 
                products={rentalProducts}
                onSelectProduct={handleOpenRentalDetail}
                onOpenBooking={handleStartBooking}
                onOpenCreateRental={() => openCreateListing('rent')}
                initialSearchQuery={searchQuery}
              />
            </div>

            <HowItWorks onNavigate={handleNavigate} />
          </>
        )}

        {/* 2. RENT MARKETPLACE VIEW */}
        {currentPage === 'rent' && (
          <RentMarketplace 
            products={rentalProducts}
            onSelectProduct={handleOpenRentalDetail}
            onOpenBooking={handleStartBooking}
            onOpenCreateRental={() => openCreateListing('rent')}
            initialSearchQuery={searchQuery}
          />
        )}

        {/* 3. REPAIR MARKETPLACE VIEW */}
        {currentPage === 'repair' && (
          <RepairMarketplace 
            providers={repairProviders}
            activeRequests={repairRequests}
            onOpenCreateRepair={handleOpenCreateRepair}
            onApproveQuotation={handleApproveQuotation}
          />
        )}

        {/* 4. RESELL MARKETPLACE VIEW */}
        {currentPage === 'resell' && (
          <ResellMarketplace 
            products={resellProducts}
            currentUserId={currentUser?.id}
            onPurchaseSuccess={handlePurchaseSuccess}
            onOfferSent={(prod) => showToast(`Offer inquiry sent to ${prod.seller.name}!`)}
            onOpenCreateListing={() => openCreateListing('resell')}
          />
        )}

        {/* 5. HOW IT WORKS VIEW */}
        {currentPage === 'how-it-works' && (
          <div className="py-6">
            <HowItWorks onNavigate={handleNavigate} />
          </div>
        )}

        {/* 6. TRUST & SAFETY VIEW */}
        {currentPage === 'trust-safety' && (
          <TrustSafetyPage onNavigate={handleNavigate} />
        )}

        {/* 7. DAMAGE CLAIM DISPUTE INSPECTOR */}
        {currentPage === 'damage-claim' && (
          <DamageClaimInterface 
            claim={damageClaim}
            onResolve={(action) => {
              showToast(`Dispute case updated: ${action.toUpperCase()}`);
            }}
          />
        )}

        {/* 8. AI INSIGHTS DASHBOARD */}
        {currentPage === 'ai-insights' && (
          <AiInsightsDashboard />
        )}

        {/* 9. USER DASHBOARD */}
        {currentPage === 'dashboard' && (
          <UserDashboard 
            currentUser={currentUser || INITIAL_USER}
            bookings={bookings}
            repairs={repairRequests}
            resellListings={resellProducts}
            onNavigate={handleNavigate}
            onOpenCreateListing={() => openCreateListing('resell')}
            onOpenRepairRequest={() => handleOpenCreateRepair()}
            onOpenDamageClaimDemo={() => handleNavigate('damage-claim')}
            onBookingStatusUpdated={handleBookingStatusUpdated}
          />
        )}

        {/* 10. USER PROFILE */}
        {currentPage === 'profile' && (
          <ProfilePage 
            currentUser={currentUser}
            onLogout={handleLogout}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onUserUpdated={(updatedUser) => {
              setCurrentUser(updatedUser);
              showToast('Account profile updated.');
            }}
          />
        )}

      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Global Modals */}

      {/* Modal A: Product Detail Modal */}
      {selectedRentalProduct && (
        <ProductDetailModal 
          product={selectedRentalProduct}
          onClose={() => setSelectedRentalProduct(null)}
          onRentNow={(prod) => handleStartBooking(prod, 3)}
          onOpenBooking={handleStartBooking}
        />
      )}

      {/* Modal B: Booking Flow Modal */}
      {bookingProduct && (
        <BookingModal 
          product={bookingProduct}
          initialDays={bookingDays}
          onClose={() => setBookingProduct(null)}
          onBookingConfirmed={handleBookingConfirmed}
          currentUserId={currentUser?.id || 'usr-101'}
        />
      )}

      {/* Modal C: Create Repair Request Modal */}
      {isCreateRepairOpen && (
        <CreateRepairModal 
          onClose={() => setIsCreateRepairOpen(false)}
          onSubmit={handleRepairSubmitted}
          preselectedCategory={repairPreselectCategory}
          preselectedProvider={repairPreselectProvider}
          currentUserId={currentUser?.id}
        />
      )}

      {/* Modal D: Create Resell / Rental Listing Modal */}
      {isCreateListingOpen && (
        <CreateListingModal 
          currentUser={currentUser || INITIAL_USER}
          initialMode={listingInitialMode}
          onClose={() => setIsCreateListingOpen(false)}
          onListingCreated={handleListingCreated}
          onRentalCreated={handleRentalCreated}
        />
      )}

      {/* Modal E: Authentication & Persona Switcher Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={(user) => {
          setCurrentUser(user);
          showToast(`Signed in as ${user.name}`);
        }}
        currentUser={currentUser}
      />

    </div>
  );
}
