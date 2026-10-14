import React, { createContext, useContext, useState, useEffect } from 'react';
import { eventData } from '../data/eventData';

const PaymentCardContext = createContext(null);

const STORAGE_KEY_CARDS = 'craftella_payment_cards_v1';
const STORAGE_KEY_BOOKINGS = 'craftella_user_bookings_v1';
const STORAGE_KEY_PAYMENT_CONFIG = 'craftella_payment_config_v1';
const STORAGE_KEY_LOCATION_CONFIG = 'craftella_location_config_v1';
const STORAGE_KEY_ADMIN_AUTH = 'craftella_admin_auth_v1';

// Fixed Admin Credentials (hardcoded for administrator access)
export const FIXED_ADMIN_CREDENTIALS = {
  adminId: 'Sravanthi73',
  email: 'admin@craftella.com',
  password: '7995176068',
};

// Seed default cards if not in localStorage
const defaultInitialCards = eventData.tickets.map((t, idx) => ({
  ...t,
  category: idx === 2 ? 'Group Plan' : idx === 1 ? 'Popular Duo' : 'Individual',
  colorTheme: idx === 1 ? 'purple' : idx === 2 ? 'amber' : 'blue',
  status: 'active', // 'active' or 'paused'
  spotsLeft: idx === 0 ? 32 : idx === 1 ? 14 : 6,
  createdAt: new Date(Date.now() - (3 - idx) * 86400000).toISOString(),
}));

const defaultPaymentConfig = {
  upiId: '9701451646@ybl',
  payeeName: 'Craftella Events',
  qrImageUrl: '', // Custom uploaded QR image (base64) or remote URL
  paymentUrl: 'upi://pay?pa=9701451646@ybl&pn=Craftella&cu=INR',
  instructions: 'Scan this QR code with PhonePe, Google Pay or another UPI app.',
  updatedAt: new Date().toISOString(),
};

const defaultLocationConfig = {
  venueName: eventData.venue?.name || '55 Bistro',
  heading: eventData.venue?.heading || 'Meet us at 55 Bistro',
  kicker: eventData.venue?.kicker || 'FIND YOUR WAY',
  description:
    eventData.venue?.description ||
    'Your Craftella experience awaits. Use the official Google Maps link below to locate the venue and plan your journey.',
  address: '55 Bistro, 100 Feet Rd, Indiranagar, Bengaluru, Karnataka 560038',
  status: eventData.venue?.status || 'OFFICIAL EVENT VENUE',
  eventDate: 'Sunday, 18 October 2026',
  eventTime: '2:00 PM – 5:00 PM',
  infoText:
    eventData.venue?.infoText ||
    'Join us for Craftella on Sunday, 18 October 2026, from 2:00 PM to 5:00 PM.',
  googleMapsUrl: eventData.venue?.googleMapsUrl || 'https://maps.app.goo.gl/ucLTnMRVcffDAmKV7',
  buttonText: eventData.venue?.buttonText || 'Get Directions',
  note: eventData.venue?.note || 'Tap “Get Directions” to open the venue in Google Maps.',
  updatedAt: new Date().toISOString(),
};

const initialMockBookings = [
  {
    id: 'BK-8942',
    ticketCode: 'X8K9M2',
    ticketType: 'Duo',
    cardId: 'duo',
    quantity: 1,
    unitPrice: 899,
    totalPrice: 899,
    customerName: 'Aarav Patel',
    customerEmail: 'aarav.patel@example.com',
    whatsappNumber: '9876543210',
    city: 'Bengaluru',
    paymentMethod: 'UPI (9701451646@ybl)',
    utrNumber: '329482910492',
    status: 'Confirmed',
    bookedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    eventDate: 'Sunday, 18 October 2026',
    venue: '55 Bistro',
  },
  {
    id: 'BK-7319',
    ticketCode: 'Q4W7P9',
    ticketType: 'Single',
    cardId: 'single',
    quantity: 2,
    unitPrice: 499,
    totalPrice: 998,
    customerName: 'Priya Sundaram',
    customerEmail: 'priya.s@example.com',
    whatsappNumber: '9123456780',
    city: 'Chennai',
    paymentMethod: 'UPI (9701451646@ybl)',
    utrNumber: '918239019234',
    status: 'Confirmed',
    bookedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    eventDate: 'Sunday, 18 October 2026',
    venue: '55 Bistro',
  },
];

export function PaymentCardProvider({ children }) {
  // Load Cards
  const [cards, setCards] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CARDS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse cards from storage', e);
    }
    return defaultInitialCards;
  });

  // Load Bookings
  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BOOKINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse bookings from storage', e);
    }
    return initialMockBookings;
  });

  // Load Payment Config (QR image, UPI ID, payment URL, etc.)
  const [paymentConfig, setPaymentConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PAYMENT_CONFIG);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return { ...defaultPaymentConfig, ...parsed };
        }
      }
    } catch (e) {
      console.warn('Failed to parse payment config from storage', e);
    }
    return defaultPaymentConfig;
  });

  // Load Location / Venue Config
  const [locationConfig, setLocationConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LOCATION_CONFIG);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return { ...defaultLocationConfig, ...parsed };
        }
      }
    } catch (e) {
      console.warn('Failed to parse location config from storage', e);
    }
    return defaultLocationConfig;
  });

  // Notification Toast state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CARDS, JSON.stringify(cards));
    } catch (e) {
      console.error('Failed to save cards to localStorage', e);
    }
  }, [cards]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(bookings));
    } catch (e) {
      console.error('Failed to save bookings to localStorage', e);
    }
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PAYMENT_CONFIG, JSON.stringify(paymentConfig));
    } catch (e) {
      console.error('Failed to save payment config to localStorage', e);
    }
  }, [paymentConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LOCATION_CONFIG, JSON.stringify(locationConfig));
    } catch (e) {
      console.error('Failed to save location config to localStorage', e);
    }
  }, [locationConfig]);

  // Listen to cross-tab storage changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY_CARDS && e.newValue) {
        try {
          setCards(JSON.parse(e.newValue));
        } catch (err) {
          console.error(err);
        }
      }
      if (e.key === STORAGE_KEY_BOOKINGS && e.newValue) {
        try {
          setBookings(JSON.parse(e.newValue));
        } catch (err) {
          console.error(err);
        }
      }
      if (e.key === STORAGE_KEY_PAYMENT_CONFIG && e.newValue) {
        try {
          setPaymentConfig(JSON.parse(e.newValue));
        } catch (err) {
          console.error(err);
        }
      }
      if (e.key === STORAGE_KEY_LOCATION_CONFIG && e.newValue) {
        try {
          setLocationConfig(JSON.parse(e.newValue));
        } catch (err) {
          console.error(err);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // CRUD Operations for Cards
  const createCard = (newCardData) => {
    const numPrice = Number(newCardData.price) || 0;
    const formattedPrice = `₹${numPrice.toLocaleString('en-IN')}`;
    const id = newCardData.id || `card_${Date.now()}`;

    const newCard = {
      ...newCardData,
      id,
      price: numPrice,
      formattedPrice,
      status: newCardData.status || 'active',
      features: Array.isArray(newCardData.features)
        ? newCardData.features
        : (newCardData.features || '')
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
      recommended: Boolean(newCardData.recommended),
      spotsLeft: Number(newCardData.spotsLeft) || 25,
      createdAt: new Date().toISOString(),
    };

    setCards((prev) => [newCard, ...prev]);
    showToast(`Payment Card "${newCard.title}" created successfully and published live!`, 'success');
    return newCard;
  };

  const updateCard = (id, updatedData) => {
    setCards((prev) =>
      prev.map((card) => {
        if (card.id !== id) return card;
        const numPrice = updatedData.price !== undefined ? Number(updatedData.price) : card.price;
        const formattedPrice = `₹${numPrice.toLocaleString('en-IN')}`;
        return {
          ...card,
          ...updatedData,
          price: numPrice,
          formattedPrice,
          features: Array.isArray(updatedData.features)
            ? updatedData.features
            : (updatedData.features || '')
              .split('\n')
              .map((s) => s.trim())
              .filter(Boolean),
        };
      })
    );
    showToast(`Payment card updated successfully!`, 'info');
  };

  const deleteCard = (id) => {
    const cardToDelete = cards.find((c) => c.id === id);
    setCards((prev) => prev.filter((c) => c.id !== id));
    showToast(`Card "${cardToDelete?.title || id}" deleted.`, 'warning');
  };

  const toggleCardStatus = (id) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextStatus = c.status === 'active' ? 'paused' : 'active';
          showToast(
            `Card "${c.title}" is now ${nextStatus === 'active' ? 'Live for booking' : 'Hidden from booking'}.`,
            'info'
          );
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  const resetToDefaults = () => {
    setCards(defaultInitialCards);
    showToast('Reset cards to original defaults.', 'info');
  };

  // Payment Gateway / QR Configuration Operations
  const updatePaymentConfig = (newFields) => {
    setPaymentConfig((prev) => ({
      ...prev,
      ...newFields,
      updatedAt: new Date().toISOString(),
    }));
    showToast('Payment QR & gateway settings updated successfully!', 'success');
  };

  const deletePaymentImage = () => {
    setPaymentConfig((prev) => ({
      ...prev,
      qrImageUrl: '',
      updatedAt: new Date().toISOString(),
    }));
    showToast('Custom payment QR image removed. Default dynamic QR restored.', 'warning');
  };

  const deletePaymentUrl = () => {
    setPaymentConfig((prev) => ({
      ...prev,
      paymentUrl: '',
      updatedAt: new Date().toISOString(),
    }));
    showToast('Payment URL cleared successfully.', 'warning');
  };

  const resetPaymentConfig = () => {
    setPaymentConfig(defaultPaymentConfig);
    showToast('Payment gateway reset to default settings.', 'info');
  };

  // Location & Venue Operations
  const updateLocationConfig = (newFields) => {
    setLocationConfig((prev) => ({
      ...prev,
      ...newFields,
      updatedAt: new Date().toISOString(),
    }));
    showToast('Event location and venue details updated successfully!', 'success');
  };

  const resetLocationConfig = () => {
    setLocationConfig(defaultLocationConfig);
    showToast('Location reset back to original venue.', 'info');
  };

  // Admin Authentication (Fixed ID & Password)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  const loginAdmin = (identifier, password) => {
    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    const matchesId =
      cleanId === FIXED_ADMIN_CREDENTIALS.adminId.toLowerCase() ||
      cleanId === FIXED_ADMIN_CREDENTIALS.email.toLowerCase();
    const matchesPassword = cleanPass === FIXED_ADMIN_CREDENTIALS.password;

    if (matchesId && matchesPassword) {
      setIsAdminLoggedIn(true);
      try {
        localStorage.setItem(STORAGE_KEY_ADMIN_AUTH, 'true');
      } catch (e) {
        console.error(e);
      }
      showToast('Welcome back, Administrator!', 'success');
      return { success: true };
    }

    showToast('Invalid Admin ID or Password.', 'warning');
    return {
      success: false,
      error: 'Invalid Admin credentials. Use Admin ID: admin, Password: admin123',
    };
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    try {
      localStorage.removeItem(STORAGE_KEY_ADMIN_AUTH);
    } catch (e) {
      console.error(e);
    }
    showToast('Admin logged out successfully.', 'info');
  };

  // Add Booking
  const addBooking = (bookingData) => {
    const newBooking = {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      bookedAt: new Date().toISOString(),
      status: 'Confirmed',
      ...bookingData,
    };
    setBookings((prev) => [newBooking, ...prev]);
    showToast(`Booking confirmed for ${newBooking.ticketType}! Code: ${newBooking.ticketCode}`, 'success');
    return newBooking;
  };

  // Active cards visible to users
  const activeCards = cards.filter((c) => c.status === 'active');

  // Computed metrics
  const totalRevenue = bookings.reduce((sum, b) => sum + (Number(b.totalPrice) || 0), 0);
  const totalPassesSold = bookings.reduce((sum, b) => sum + (Number(b.quantity) || 0), 0);

  return (
    <PaymentCardContext.Provider
      value={{
        cards,
        activeCards,
        bookings,
        paymentConfig,
        toast,
        showToast,
        createCard,
        updateCard,
        deleteCard,
        toggleCardStatus,
        resetToDefaults,
        updatePaymentConfig,
        deletePaymentImage,
        deletePaymentUrl,
        resetPaymentConfig,
        locationConfig,
        updateLocationConfig,
        resetLocationConfig,
        addBooking,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        adminCredentials: FIXED_ADMIN_CREDENTIALS,
        stats: {
          totalCards: cards.length,
          activeCardsCount: activeCards.length,
          pausedCardsCount: cards.length - activeCards.length,
          totalRevenue,
          totalPassesSold,
          totalBookingsCount: bookings.length,
        },
      }}
    >
      {children}
      {/* Global Toast Banner */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-[rgba(158,190,246,0.3)] bg-[#0e1726]/95 px-5 py-3.5 shadow-[0_10px_35px_rgba(0,0,0,0.6)] backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-300">
          <div
            className={`h-2.5 w-2.5 rounded-full ${toast.type === 'success'
                ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                : toast.type === 'warning'
                  ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24]'
                  : 'bg-[#7AA5F2] shadow-[0_0_8px_#7AA5F2]'
              }`}
          />
          <p className="text-xs font-medium text-white max-w-sm">{toast.message}</p>
          <button
            onClick={() => setToast(null)}
            className="ml-2 text-xs text-[#9BB1D3] hover:text-white"
          >
            ✕
          </button>
        </div>
      )}
    </PaymentCardContext.Provider>
  );
}

export function usePaymentCards() {
  const context = useContext(PaymentCardContext);
  if (!context) {
    throw new Error('usePaymentCards must be used within a PaymentCardProvider');
  }
  return context;
}
