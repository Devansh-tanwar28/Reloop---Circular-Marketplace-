import {
  RentalProduct,
  ResellProduct,
  RepairProvider,
  RepairRequest,
  Booking,
  DamageClaim,
  UserAccount,
  ProductCategory
} from '../types';

const TOKEN_KEY = 'reloop_auth_token';

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

const getHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// -------------------------------------------------------------
// 1. AUTH & USERS API
// -------------------------------------------------------------
export const apiLogin = async (email: string, password: string): Promise<{ user: UserAccount; token: string }> => {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to login');
  }
  const data = await res.json();
  setAuthToken(data.token);
  return data;
};

export const apiRegister = async (payload: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: string;
  location?: string;
  bio?: string;
}): Promise<{ user: UserAccount; token: string }> => {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to register');
  }
  const data = await res.json();
  setAuthToken(data.token);
  return data;
};

export const apiGetCurrentUser = async (): Promise<UserAccount | null> => {
  const token = getAuthToken();
  if (!token) return null;
  const res = await fetch('/api/auth/me', {
    headers: getHeaders(),
  });
  if (!res.ok) return null;
  return res.json();
};

export const apiGetAllUsers = async (): Promise<UserAccount[]> => {
  const res = await fetch('/api/users');
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
};

export const apiUpdateUser = async (
  userId: string,
  payload: { name?: string; phone?: string; location?: string; bio?: string }
): Promise<UserAccount> => {
  const res = await fetch(`/api/users/${userId}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to update profile');
  }
  return res.json();
};

export const apiGetTransactions = async (userId?: string) => {
  const url = new URL('/api/transactions', window.location.origin);
  if (userId) url.searchParams.set('userId', userId);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch transactions');
  return res.json();
};

export const apiGetNotifications = async (userId?: string) => {
  const url = new URL('/api/notifications', window.location.origin);
  if (userId) url.searchParams.set('userId', userId);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch notifications');
  return res.json();
};

export const apiMarkNotificationRead = async (id: string) => {
  const res = await fetch(`/api/notifications/${id}/read`, {
    method: 'PATCH',
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error('Failed to update notification');
  return res.json();
};

// -------------------------------------------------------------
// 2. RENT MARKETPLACE API
// -------------------------------------------------------------
export const apiGetRentals = async (params?: {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
}): Promise<RentalProduct[]> => {
  const url = new URL('/api/rentals', window.location.origin);
  if (params?.category && params.category !== 'All') url.searchParams.set('category', params.category);
  if (params?.search) url.searchParams.set('search', params.search);
  if (params?.minPrice) url.searchParams.set('minPrice', String(params.minPrice));
  if (params?.maxPrice) url.searchParams.set('maxPrice', String(params.maxPrice));
  if (params?.location) url.searchParams.set('location', params.location);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch rental products');
  return res.json();
};

export const apiCreateRental = async (payload: Partial<RentalProduct> & { ownerId?: string }): Promise<RentalProduct> => {
  const res = await fetch('/api/rentals', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create listing');
  }
  return res.json();
};

export const apiBookRental = async (productId: string, payload: {
  startDate: string;
  days: number;
  renterId?: string;
}): Promise<Booking> => {
  const res = await fetch(`/api/rentals/${productId}/book`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to complete booking');
  }
  return res.json();
};

// -------------------------------------------------------------
// 3. TRUST & SAFETY: BOOKINGS & DISPUTES API
// -------------------------------------------------------------
export const apiGetBookings = async (userId?: string): Promise<Booking[]> => {
  const url = new URL('/api/bookings', window.location.origin);
  if (userId) url.searchParams.set('userId', userId);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch bookings');
  return res.json();
};

export const apiUpdateBookingStatus = async (id: string, status: string) => {
  const res = await fetch(`/api/bookings/${id}/status`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update booking status');
  return res.json();
};

export const apiGetClaims = async (): Promise<DamageClaim[]> => {
  const res = await fetch('/api/claims');
  if (!res.ok) throw new Error('Failed to fetch claims');
  return res.json();
};

export const apiRespondClaim = async (id: string, action: 'accepted' | 'disputed' | 'admin_review', renterNotes?: string) => {
  const res = await fetch(`/api/claims/${id}/respond`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ action, renterNotes }),
  });
  if (!res.ok) throw new Error('Failed to update claim');
  return res.json();
};

// -------------------------------------------------------------
// 4. REPAIR MARKETPLACE API
// -------------------------------------------------------------
export const apiGetRepairProviders = async (params?: { category?: string; search?: string }): Promise<RepairProvider[]> => {
  const url = new URL('/api/repair/providers', window.location.origin);
  if (params?.category && params.category !== 'All') url.searchParams.set('category', params.category);
  if (params?.search) url.searchParams.set('search', params.search);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch repair providers');
  return res.json();
};

export const apiGetRepairRequests = async (userId?: string): Promise<RepairRequest[]> => {
  const url = new URL('/api/repair/requests', window.location.origin);
  if (userId) url.searchParams.set('userId', userId);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch repair requests');
  return res.json();
};

export const apiCreateRepairRequest = async (payload: {
  productName: string;
  category: ProductCategory;
  brandModel: string;
  problemDescription: string;
  image?: string;
  location: string;
  preferredDate: string;
  providerName?: string;
  userId?: string;
}): Promise<RepairRequest> => {
  const res = await fetch('/api/repair/requests', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to submit repair request');
  }
  return res.json();
};

export const apiApproveQuotation = async (requestId: string) => {
  const res = await fetch(`/api/repair/requests/${requestId}/approve-quotation`, {
    method: 'POST',
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error('Failed to approve quotation');
  return res.json();
};

// -------------------------------------------------------------
// 5. RESELL MARKETPLACE API
// -------------------------------------------------------------
export const apiGetResellProducts = async (params?: { category?: string; search?: string }): Promise<ResellProduct[]> => {
  const url = new URL('/api/resell', window.location.origin);
  if (params?.category && params.category !== 'All') url.searchParams.set('category', params.category);
  if (params?.search) url.searchParams.set('search', params.search);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch resell products');
  return res.json();
};

export const apiCreateResellListing = async (payload: Partial<ResellProduct> & { sellerId?: string }): Promise<ResellProduct> => {
  const res = await fetch('/api/resell', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create resell listing');
  }
  return res.json();
};

export const apiCreateResellOffer = async (productId: string, payload: { buyerId?: string; offerAmount: number; message?: string }) => {
  const res = await fetch(`/api/resell/${productId}/offer`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to submit offer');
  }
  return res.json();
};

export const apiPurchaseResellProduct = async (productId: string, buyerId?: string) => {
  const res = await fetch(`/api/resell/${productId}/purchase`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ buyerId }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to complete purchase');
  }
  return res.json();
};

// -------------------------------------------------------------
// 6. ADMIN & AI API
// -------------------------------------------------------------
export const apiGetAdminOverview = async () => {
  const res = await fetch('/api/admin/overview');
  if (!res.ok) throw new Error('Failed to fetch admin overview');
  return res.json();
};

export const apiGetAdminUsers = async () => {
  const res = await fetch('/api/admin/users');
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
};

export const apiVerifyAdminUser = async (userId: string, status: 'approved' | 'rejected') => {
  const res = await fetch(`/api/admin/users/${userId}/verify`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update verification status');
  return res.json();
};

export const apiGetAdminListings = async () => {
  const res = await fetch('/api/admin/listings');
  if (!res.ok) throw new Error('Failed to fetch listings');
  return res.json();
};

export const apiDeleteAdminListing = async (type: 'rental' | 'resell', id: string) => {
  const res = await fetch(`/api/admin/listings/${type}/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error('Failed to remove listing');
  return res.json();
};

export const apiGetAdminTransactions = async () => {
  const res = await fetch('/api/admin/transactions');
  if (!res.ok) throw new Error('Failed to fetch transactions');
  return res.json();
};

export const apiAdminResolveClaim = async (claimId: string, decision: 'award_owner' | 'dismiss_refund') => {
  const res = await fetch(`/api/claims/${claimId}/admin-decision`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ decision }),
  });
  if (!res.ok) throw new Error('Failed to resolve claim');
  return res.json();
};

export const apiCalculateRentVsBuy = async (params: {
  plannedDays: number;
  itemRetailPrice: number;
  dailyRentalRate: number;
}) => {
  const res = await fetch('/api/ai/rent-vs-buy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('Calculation failed');
  return res.json();
};

export const apiGetSmartPricing = async (params: {
  category: string;
  condition: string;
  originalPrice: number;
  ageMonths: number;
  brand?: string;
}) => {
  const res = await fetch('/api/ai/pricing-recommendation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('Pricing recommendation failed');
  return res.json();
};

export const apiInspectDamage = async (params: {
  productName: string;
  ownerNotes: string;
  estimatedRepairCost: number;
}) => {
  const res = await fetch('/api/ai/damage-inspect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('Inspection failed');
  return res.json();
};
