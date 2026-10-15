import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { eventData } from '../data/eventData';
import {
  supabase,
  isSupabaseConfigured,
  dbFetchPaymentCards,
  dbUpsertPaymentCard,
  dbDeletePaymentCard,
  dbFetchBookings,
  dbInsertBooking,
  dbUpdateBookingStatus,
  dbDeleteBooking,
  dbFetchPaymentConfig,
  dbSavePaymentConfig,
  dbFetchLocationConfig,
  dbSaveLocationConfig,
  uploadAssetToStorage,
} from '../lib/supabase';

const PaymentCardContext = createContext(null);

const STORAGE_KEY_CARDS = 'craftella_payment_cards_v1';
const STORAGE_KEY_BOOKINGS = 'craftella_user_bookings_v1';
const STORAGE_KEY_PAYMENT_CONFIG = 'craftella_payment_config_v1';
const STORAGE_KEY_LOCATION_CONFIG = 'craftella_location_config_v1';
const STORAGE_KEY_ADMIN_AUTH = 'craftella_admin_auth_v1';

// Fixed Admin Credentials (fallback & organizer direct access)
export const FIXED_ADMIN_CREDENTIALS = {
  adminId: 'Sravanthi73',
  email: 'admin@craftella.com',
  password: '7995176068',
};

// Seed default cards
const defaultInitialCards = eventData.tickets.map((t, idx) => ({
  ...t,
  category: idx === 2 ? 'Group Plan' : idx === 1 ? 'Popular Duo' : 'Individual',
  colorTheme: idx === 1 ? 'purple' : idx === 2 ? 'amber' : 'blue',
  status: 'active',
  spotsLeft: idx === 0 ? 32 : idx === 1 ? 14 : 6,
  createdAt: new Date(Date.now() - (3 - idx) * 86400000).toISOString(),
}));

const defaultPaymentConfig = {
  upiId: '9701451646@ybl',
  payeeName: 'Craftella Events',
  qrImageUrl: '',
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
    receiptUrl: '',
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
    receiptUrl: '',
    status: 'Confirmed',
    bookedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    eventDate: 'Sunday, 18 October 2026',
    venue: '55 Bistro',
  },
];

export function PaymentCardProvider({ children }) {
  // Backend connection status
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [isLoadingBackend, setIsLoadingBackend] = useState(isSupabaseConfigured);

  // Cards State
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

  // Bookings State
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

  // Payment Config State
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

  // Location Config State
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

  // Toast State
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CARDS, JSON.stringify(cards));
    } catch (e) {
      console.error(e);
    }
  }, [cards]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(bookings));
    } catch (e) {
      console.error(e);
    }
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PAYMENT_CONFIG, JSON.stringify(paymentConfig));
    } catch (e) {
      console.error(e);
    }
  }, [paymentConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LOCATION_CONFIG, JSON.stringify(locationConfig));
    } catch (e) {
      console.error(e);
    }
  }, [locationConfig]);

  // ==============================================================================
  // SUPABASE INITIAL DATA FETCH & REALTIME SUBSCRIPTIONS
  // ==============================================================================
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setIsLoadingBackend(false);
      return;
    }

    let isMounted = true;

    async function loadSupabaseData() {
      setIsLoadingBackend(true);
      try {
        // Fetch all 4 data sets in parallel
        const [cardsRes, bookingsRes, payConfigRes, locConfigRes] = await Promise.all([
          dbFetchPaymentCards(),
          dbFetchBookings(),
          dbFetchPaymentConfig(),
          dbFetchLocationConfig(),
        ]);

        if (!isMounted) return;

        let connected = false;

        // Cards sync
        if (cardsRes.data && cardsRes.data.length > 0) {
          setCards(cardsRes.data);
          connected = true;
        } else if (cardsRes.data && cardsRes.data.length === 0) {
          // If Supabase table exists but is empty, seed defaults to database
          defaultInitialCards.forEach((c) => dbUpsertPaymentCard(c));
          connected = true;
        }

        // Bookings sync
        if (bookingsRes.data && bookingsRes.data.length > 0) {
          setBookings(bookingsRes.data);
          connected = true;
        }

        // Payment Config sync
        if (payConfigRes.data) {
          setPaymentConfig(payConfigRes.data);
          connected = true;
        } else if (!payConfigRes.error) {
          dbSavePaymentConfig(defaultPaymentConfig);
        }

        // Location Config sync
        if (locConfigRes.data) {
          setLocationConfig(locConfigRes.data);
          connected = true;
        } else if (!locConfigRes.error) {
          dbSaveLocationConfig(defaultLocationConfig);
        }

        if (connected || !cardsRes.error) {
          setIsBackendConnected(true);
          console.info('✓ Connected to Supabase backend successfully.');
        }
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to local cache:', err);
      } finally {
        if (isMounted) setIsLoadingBackend(false);
      }
    }

    loadSupabaseData();

    // Set up Realtime subscriptions for live multi-user sync
    const cardsChannel = supabase
      .channel('public:payment_cards')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'payment_cards' },
        async () => {
          const { data } = await dbFetchPaymentCards();
          if (data && isMounted) setCards(data);
        }
      )
      .subscribe();

    const bookingsChannel = supabase
      .channel('public:bookings')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        async (payload) => {
          if (!isMounted) return;
          const { data } = await dbFetchBookings();
          if (data) {
            setBookings(data);
            if (payload.eventType === 'INSERT') {
              showToast(`New booking placed for ${payload.new.ticket_type}!`, 'info');
            }
          }
        }
      )
      .subscribe();

    const configChannel = supabase
      .channel('public:config')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'payment_config' },
        async () => {
          const { data } = await dbFetchPaymentConfig();
          if (data && isMounted) setPaymentConfig(data);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'location_config' },
        async () => {
          const { data } = await dbFetchLocationConfig();
          if (data && isMounted) setLocationConfig(data);
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(cardsChannel);
      supabase.removeChannel(bookingsChannel);
      supabase.removeChannel(configChannel);
    };
  }, [showToast]);

  // ==============================================================================
  // CRUD OPERATIONS: PAYMENT CARDS
  // ==============================================================================
  const createCard = async (newCardData) => {
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

    // Optimistic local update
    setCards((prev) => [newCard, ...prev]);
    showToast(`Payment Card "${newCard.title}" created and published live!`, 'success');

    // Supabase DB insert
    if (isSupabaseConfigured && supabase) {
      const { error } = await dbUpsertPaymentCard(newCard);
      if (error) {
        console.error('Supabase createCard error:', error);
      }
    }

    return newCard;
  };

  const updateCard = async (id, updatedData) => {
    let updatedCard = null;
    setCards((prev) =>
      prev.map((card) => {
        if (card.id !== id) return card;
        const numPrice = updatedData.price !== undefined && updatedData.price !== '' ? Number(updatedData.price) : card.price;
        const formattedPrice = `₹${numPrice.toLocaleString('en-IN')}`;
        const spots =
          updatedData.spotsLeft !== undefined && updatedData.spotsLeft !== ''
            ? Number(updatedData.spotsLeft)
            : card.spotsLeft;
        const origPrice =
          updatedData.originalPrice !== undefined && updatedData.originalPrice !== ''
            ? Number(updatedData.originalPrice)
            : null;

        let parsedFeatures = card.features || [];
        if (Array.isArray(updatedData.features)) {
          parsedFeatures = updatedData.features;
        } else if (typeof updatedData.featuresText === 'string') {
          parsedFeatures = updatedData.featuresText.split('\n').map((s) => s.trim()).filter(Boolean);
        } else if (typeof updatedData.features === 'string') {
          parsedFeatures = updatedData.features.split('\n').map((s) => s.trim()).filter(Boolean);
        }

        updatedCard = {
          ...card,
          ...updatedData,
          price: numPrice,
          originalPrice: origPrice,
          spotsLeft: spots,
          formattedPrice,
          features: parsedFeatures,
        };
        return updatedCard;
      })
    );

    showToast(`Card "${updatedCard?.title || 'Pass'}" updated successfully!`, 'info');

    // Supabase DB update
    if (isSupabaseConfigured && supabase && updatedCard) {
      const { error } = await dbUpsertPaymentCard(updatedCard);
      if (error) console.error('Supabase updateCard error:', error);
    }
  };

  const deleteCard = async (id) => {
    const cardToDelete = cards.find((c) => c.id === id);
    setCards((prev) => prev.filter((c) => c.id !== id));
    showToast(`Card "${cardToDelete?.title || id}" deleted.`, 'warning');

    if (isSupabaseConfigured && supabase) {
      const { error } = await dbDeletePaymentCard(id);
      if (error) console.error('Supabase deleteCard error:', error);
    }
  };

  const toggleCardStatus = async (id) => {
    let modifiedCard = null;
    setCards((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextStatus = c.status === 'active' ? 'paused' : 'active';
          modifiedCard = { ...c, status: nextStatus };
          showToast(
            `Card "${c.title}" is now ${nextStatus === 'active' ? 'Live for booking' : 'Hidden from booking'}.`,
            'info'
          );
          return modifiedCard;
        }
        return c;
      })
    );

    if (isSupabaseConfigured && supabase && modifiedCard) {
      await dbUpsertPaymentCard(modifiedCard);
    }
  };

  const resetToDefaults = async () => {
    setCards(defaultInitialCards);
    showToast('Reset cards to original defaults.', 'info');

    if (isSupabaseConfigured && supabase) {
      for (const card of defaultInitialCards) {
        await dbUpsertPaymentCard(card);
      }
    }
  };

  // ==============================================================================
  // PAYMENT GATEWAY & CONFIG OPERATIONS
  // ==============================================================================
  const updatePaymentConfig = async (newFields) => {
    const updated = {
      ...paymentConfig,
      ...newFields,
      updatedAt: new Date().toISOString(),
    };
    setPaymentConfig(updated);
    showToast('Payment QR & gateway settings updated successfully!', 'success');

    if (isSupabaseConfigured && supabase) {
      const { error } = await dbSavePaymentConfig(updated);
      if (error) console.error('Supabase savePaymentConfig error:', error);
    }
  };

  const deletePaymentImage = async () => {
    const updated = {
      ...paymentConfig,
      qrImageUrl: '',
      updatedAt: new Date().toISOString(),
    };
    setPaymentConfig(updated);
    showToast('Custom payment QR image removed. Default dynamic QR restored.', 'warning');

    if (isSupabaseConfigured && supabase) {
      await dbSavePaymentConfig(updated);
    }
  };

  const deletePaymentUrl = async () => {
    const updated = {
      ...paymentConfig,
      paymentUrl: '',
      updatedAt: new Date().toISOString(),
    };
    setPaymentConfig(updated);
    showToast('Payment URL cleared successfully.', 'warning');

    if (isSupabaseConfigured && supabase) {
      await dbSavePaymentConfig(updated);
    }
  };

  const resetPaymentConfig = async () => {
    setPaymentConfig(defaultPaymentConfig);
    showToast('Payment gateway reset to default settings.', 'info');

    if (isSupabaseConfigured && supabase) {
      await dbSavePaymentConfig(defaultPaymentConfig);
    }
  };

  // ==============================================================================
  // LOCATION & VENUE OPERATIONS
  // ==============================================================================
  const updateLocationConfig = async (newFields) => {
    const updated = {
      ...locationConfig,
      ...newFields,
      name: newFields.venueName || newFields.name || locationConfig?.venueName || '55 Bistro',
      venueName: newFields.venueName || newFields.name || locationConfig?.venueName || '55 Bistro',
      updatedAt: new Date().toISOString(),
    };
    setLocationConfig(updated);
    try {
      localStorage.setItem(STORAGE_KEY_LOCATION_CONFIG, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to cache locationConfig:', e);
    }
    showToast('Event location and venue details updated successfully!', 'success');

    if (isSupabaseConfigured && supabase) {
      const { error } = await dbSaveLocationConfig(updated);
      if (error) {
        console.error('Supabase saveLocationConfig error:', error);
        showToast('Saved locally. Database sync warning: ' + (error.message || error), 'warning');
      }
    }
  };

  const resetLocationConfig = async () => {
    setLocationConfig(defaultLocationConfig);
    showToast('Location reset back to original venue.', 'info');

    if (isSupabaseConfigured && supabase) {
      await dbSaveLocationConfig(defaultLocationConfig);
    }
  };

  // ==============================================================================
  // ADMIN AUTHENTICATION
  // ==============================================================================
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  // Check Supabase session on startup
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAdminLoggedIn(true);
        localStorage.setItem(STORAGE_KEY_ADMIN_AUTH, 'true');
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsAdminLoggedIn(true);
        localStorage.setItem(STORAGE_KEY_ADMIN_AUTH, 'true');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loginAdmin = async (identifier, password) => {
    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    // 1. First attempt Supabase Auth if configured and email format
    if (isSupabaseConfigured && supabase && cleanId.includes('@')) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanId,
          password: cleanPass,
        });
        if (!error && data?.user) {
          setIsAdminLoggedIn(true);
          localStorage.setItem(STORAGE_KEY_ADMIN_AUTH, 'true');
          showToast('Welcome back, Administrator (Authenticated via Supabase)!', 'success');
          return { success: true, method: 'supabase' };
        }
      } catch (err) {
        console.warn('Supabase auth attempt failed, checking fallback:', err);
      }
    }

    // 2. Check Organizer Fixed Credentials
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
      return { success: true, method: 'organizer_key' };
    }

    showToast('Invalid Admin ID or Password.', 'warning');
    return {
      success: false,
      error: 'Invalid credentials. Please verify your Admin ID / Email and Password.',
    };
  };

  const logoutAdmin = async () => {
    setIsAdminLoggedIn(false);
    try {
      localStorage.removeItem(STORAGE_KEY_ADMIN_AUTH);
    } catch (e) {
      console.error(e);
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase sign out:', err);
      }
    }

    showToast('Admin logged out successfully.', 'info');
  };

  // ==============================================================================
  // BOOKINGS CRUD OPERATIONS
  // ==============================================================================
  const addBooking = async (bookingData) => {
    const newBooking = {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      bookedAt: new Date().toISOString(),
      status: 'Confirmed',
      ...bookingData,
    };

    // Optimistic local state update
    setBookings((prev) => [newBooking, ...prev]);

    // Decrement spotsLeft on the selected card
    if (bookingData.cardId) {
      setCards((prev) =>
        prev.map((c) => {
          if (c.id === bookingData.cardId && c.spotsLeft > 0) {
            const nextSpots = Math.max(0, c.spotsLeft - (bookingData.quantity || 1));
            const updatedCard = { ...c, spotsLeft: nextSpots };
            if (isSupabaseConfigured && supabase) {
              dbUpsertPaymentCard(updatedCard);
            }
            return updatedCard;
          }
          return c;
        })
      );
    }

    showToast(
      `Booking confirmed for ${newBooking.ticketType}! Ticket Code: ${newBooking.ticketCode}`,
      'success'
    );

    // Persist to Supabase Database
    if (isSupabaseConfigured && supabase) {
      const { error } = await dbInsertBooking(newBooking);
      if (error) {
        console.error('Supabase dbInsertBooking error:', error);
      }
    }

    return newBooking;
  };

  const updateBookingStatus = async (id, status) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
    showToast(`Booking ${id} status marked as "${status}".`, 'info');

    if (isSupabaseConfigured && supabase) {
      const { error } = await dbUpdateBookingStatus(id, status);
      if (error) console.error('Supabase updateBookingStatus error:', error);
    }
  };

  const deleteBooking = async (id) => {
    const bookingToDelete = bookings.find((b) => b.id === id);
    setBookings((prev) => prev.filter((b) => b.id !== id));
    showToast(`Booking "${bookingToDelete?.ticketCode || id}" removed.`, 'warning');

    if (isSupabaseConfigured && supabase) {
      const { error } = await dbDeleteBooking(id);
      if (error) console.error('Supabase deleteBooking error:', error);
    }
  };

  // Upload file asset to Supabase Storage (QR codes, receipt screenshots)
  const uploadAsset = async (file, folder = 'receipts') => {
    if (!isSupabaseConfigured || !supabase) {
      // Fallback: return base64 data url for offline / local mode
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve({ publicUrl: reader.result });
        reader.readAsDataURL(file);
      });
    }
    return uploadAssetToStorage(file, folder);
  };

  // Active cards visible to guests
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
        locationConfig,
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
        updateLocationConfig,
        resetLocationConfig,
        addBooking,
        updateBookingStatus,
        deleteBooking,
        uploadAsset,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        adminCredentials: FIXED_ADMIN_CREDENTIALS,
        isSupabaseConfigured,
        isBackendConnected,
        isLoadingBackend,
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
            className={`h-2.5 w-2.5 rounded-full ${
              toast.type === 'success'
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
