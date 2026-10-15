import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  PlusCircle,
  CreditCard,
  Users,
  TrendingUp,
  Layers,
  Eye,
  CheckCircle2,
  Trash2,
  Edit3,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  Filter,
  DollarSign,
  Info,
  QrCode,
  Upload,
  Image as ImageIcon,
  Copy,
  Lock,
  Check,
  LogOut,
  MapPin,
  Navigation,
  Calendar,
  Clock,
  Search,
  FileText,
  Database,
  Download,
  FileSpreadsheet,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { usePaymentCards } from '../context/PaymentCardContext';
import PaymentCard from '../components/PaymentCard';
import AdminLogin from './AdminLogin';

const themeOptions = [
  { id: 'blue', label: 'Royal Blue', color: '#7AA5F2' },
  { id: 'purple', label: 'Cosmic Violet', color: '#C084FC' },
  { id: 'amber', label: 'Golden Amber', color: '#FBBF24' },
  { id: 'emerald', label: 'Emerald Jade', color: '#34D399' },
  { id: 'rose', label: 'Ruby Rose', color: '#FB7185' },
];

const featurePresets = [
  '1x Rhinestone canvas art kit',
  'All sparkling craft supplies included',
  'Beverage & artisan refreshments',
  'Take home your customized artwork',
  'Reserved adjacent seating',
  'Dedicated artist mentor assistance',
  'Private luxury table setup',
  'Deluxe rhinestone embellishment pack',
  'Commemorative Craftella Certificate',
];

export default function AdminDashboard() {
  const {
    cards,
    activeCards,
    bookings,
    stats,
    paymentConfig,
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
    isAdminLoggedIn,
    logoutAdmin,
    updateBookingStatus,
    deleteBooking,
    uploadAsset,
    isBackendConnected,
    isSupabaseConfigured,
    showToast,
  } = usePaymentCards();

  // If not logged in as admin, render AdminLogin page
  if (!isAdminLoggedIn) {
    return <AdminLogin />;
  }

  const [activeTab, setActiveTab] = useState('cards'); // 'cards' | 'gateway' | 'location' | 'bookings'
  const [editingCard, setEditingCard] = useState(null);

  // New Card Form State
  const [formData, setFormData] = useState({
    title: '',
    type: 'SPECIAL PASS',
    subtitle: 'Entry for one person with custom artwork',
    price: '',
    originalPrice: '',
    colorTheme: 'blue',
    category: 'Special Edition',
    spotsLeft: 20,
    recommended: false,
    status: 'active',
  });

  const [featuresList, setFeaturesList] = useState([
    '1x Rhinestone canvas art kit',
    'All sparkling craft supplies included',
    'Beverage & light refreshments',
  ]);
  const [newFeatureText, setNewFeatureText] = useState('');
  const [filterTheme, setFilterTheme] = useState('all');

  // Bookings filtering & preview states
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('all');
  const [previewReceiptUrl, setPreviewReceiptUrl] = useState(null);
  const [isUploadingQr, setIsUploadingQr] = useState(false);

  // Gateway / Payment QR Form State
  const [gatewayForm, setGatewayForm] = useState({
    upiId: '9701451646@ybl',
    payeeName: 'Craftella Events',
    qrImageUrl: '',
    paymentUrl: 'upi://pay?pa=9701451646@ybl&pn=Craftella&cu=INR',
    instructions: 'Scan this QR code with PhonePe, Google Pay or another UPI app.',
  });
  const [previewCopied, setPreviewCopied] = useState(false);

  // Location / Venue Form State
  const [locationForm, setLocationForm] = useState({
    venueName: '55 Bistro',
    heading: 'Meet us at 55 Bistro',
    kicker: 'FIND YOUR WAY',
    description:
      'Your Craftella experience awaits. Use the official Google Maps link below to locate the venue and plan your journey.',
    address: '55 Bistro, 100 Feet Rd, Indiranagar, Bengaluru, Karnataka 560038',
    status: 'OFFICIAL EVENT VENUE',
    eventDate: 'Sunday, 18 October 2026',
    eventTime: '2:00 PM – 5:00 PM',
    infoText:
      'Join us for Craftella on Sunday, 18 October 2026, from 2:00 PM to 5:00 PM.',
    googleMapsUrl: 'https://maps.app.goo.gl/ucLTnMRVcffDAmKV7',
    buttonText: 'Get Directions',
    note: 'Tap “Get Directions” to open the venue in Google Maps.',
  });

  // Sync locationForm when locationConfig loads or changes
  useEffect(() => {
    if (locationConfig) {
      setLocationForm((prev) => ({
        ...prev,
        ...locationConfig,
      }));
    }
  }, [locationConfig]);

  // Sync gatewayForm when paymentConfig loads or changes
  useEffect(() => {
    if (paymentConfig) {
      setGatewayForm({
        upiId: paymentConfig.upiId || '9701451646@ybl',
        payeeName: paymentConfig.payeeName || 'Craftella Events',
        qrImageUrl: paymentConfig.qrImageUrl || '',
        paymentUrl: paymentConfig.paymentUrl || 'upi://pay?pa=9701451646@ybl&pn=Craftella&cu=INR',
        instructions:
          paymentConfig.instructions ||
          'Scan this QR code with PhonePe, Google Pay or another UPI app.',
      });
    }
  }, [paymentConfig]);

  useEffect(() => {
    document.title = 'Admin Dashboard | Craftella';
  }, []);

  const handleAddFeature = () => {
    if (newFeatureText.trim()) {
      setFeaturesList([...featuresList, newFeatureText.trim()]);
      setNewFeatureText('');
    }
  };

  const handleRemoveFeature = (indexToRemove) => {
    setFeaturesList(featuresList.filter((_, idx) => idx !== indexToRemove));
  };

  const handleAddPreset = (preset) => {
    if (!featuresList.includes(preset)) {
      setFeaturesList([...featuresList, preset]);
    }
  };

  const handleCreateCardSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price) {
      alert('Please provide a title and price.');
      return;
    }

    createCard({
      ...formData,
      features: featuresList,
    });

    // Reset Form
    setFormData({
      title: '',
      type: 'SPECIAL PASS',
      subtitle: 'Entry for one person with custom artwork',
      price: '',
      originalPrice: '',
      colorTheme: 'blue',
      category: 'Special Edition',
      spotsLeft: 20,
      recommended: false,
      status: 'active',
    });
    setFeaturesList([
      '1x Rhinestone canvas art kit',
      'All sparkling craft supplies included',
      'Beverage & light refreshments',
    ]);
  };

  // Edit card handler
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingCard) return;

    updateCard(editingCard.id, {
      ...editingCard,
    });
    setEditingCard(null);
  };

  // Upload Payment QR image file to Supabase Storage
  const handlePaymentImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File exceeds 5MB limit. Please upload an image under 5MB.');
        return;
      }
      setIsUploadingQr(true);
      try {
        const uploadRes = await uploadAsset(file, 'qr-codes');
        if (uploadRes?.publicUrl) {
          setGatewayForm((prev) => ({
            ...prev,
            qrImageUrl: uploadRes.publicUrl,
          }));
        }
      } catch (err) {
        console.error('Failed to upload QR image to storage:', err);
      } finally {
        setIsUploadingQr(false);
      }
    }
  };

  // Save Gateway settings
  const handleSaveGateway = (e) => {
    e.preventDefault();
    updatePaymentConfig(gatewayForm);
  };

  // Save Location settings
  const handleSaveLocation = (e) => {
    e.preventDefault();
    updateLocationConfig(locationForm);
  };

  // Export Customer Bookings to Excel (.xlsx)
  const handleExportExcel = (dataToExport = bookings, filenamePrefix = 'Craftella_Bookings') => {
    if (!dataToExport || dataToExport.length === 0) {
      if (showToast) showToast('No booking data available to export.', 'error');
      return;
    }

    try {
      // 1. Prepare detailed rows for Bookings sheet
      const sheetData = dataToExport.map((b, index) => ({
        'S.No': index + 1,
        'Booking ID': b.id || '',
        'Ticket Code': b.ticketCode || '',
        'Customer Name': b.customerName || '',
        'Customer Email': b.customerEmail || '',
        'WhatsApp Number': b.whatsappNumber || '',
        'City': b.city || '',
        'Pass Tier': b.ticketType || '',
        'Quantity': Number(b.quantity) || 1,
        'Unit Price (INR)': Number(b.unitPrice) || 0,
        'Total Amount (INR)': Number(b.totalPrice) || 0,
        'Payment Method': b.paymentMethod || 'UPI',
        'UTR / Ref Number': b.utrNumber || '',
        'Payment Status': b.status || 'Confirmed',
        'Event Date': b.eventDate || 'Sunday, 18 October 2026',
        'Event Time': b.eventTime || '2:00 PM – 5:00 PM',
        'Venue': b.venue || '55 Bistro',
        'Booked At': b.bookedAt ? new Date(b.bookedAt).toLocaleString('en-IN') : '',
        'Receipt URL': b.receiptUrl || '',
      }));

      const worksheet = XLSX.utils.json_to_sheet(sheetData);

      // Auto-fit column widths for clear readability in Excel
      worksheet['!cols'] = [
        { wch: 6 },  // S.No
        { wch: 14 }, // Booking ID
        { wch: 14 }, // Ticket Code
        { wch: 24 }, // Customer Name
        { wch: 30 }, // Customer Email
        { wch: 16 }, // WhatsApp
        { wch: 18 }, // City
        { wch: 16 }, // Pass Tier
        { wch: 10 }, // Quantity
        { wch: 16 }, // Unit Price
        { wch: 18 }, // Total Amount
        { wch: 16 }, // Payment Method
        { wch: 22 }, // UTR
        { wch: 16 }, // Status
        { wch: 22 }, // Event Date
        { wch: 18 }, // Event Time
        { wch: 16 }, // Venue
        { wch: 22 }, // Booked At
        { wch: 36 }, // Receipt URL
      ];

      // 2. Prepare Summary Sheet
      const totalRevenue = dataToExport.reduce((sum, b) => sum + (Number(b.totalPrice) || 0), 0);
      const totalPasses = dataToExport.reduce((sum, b) => sum + (Number(b.quantity) || 0), 0);
      const confirmedCount = dataToExport.filter((b) => b.status === 'Confirmed').length;
      const pendingCount = dataToExport.filter((b) => b.status === 'Pending Verification').length;
      const cancelledCount = dataToExport.filter((b) => b.status === 'Cancelled').length;

      const summaryData = [
        { Metric: 'Report Generated At', Value: new Date().toLocaleString('en-IN') },
        { Metric: 'Total Bookings', Value: dataToExport.length },
        { Metric: 'Total Passes Sold', Value: totalPasses },
        { Metric: 'Total Revenue (INR)', Value: `₹${totalRevenue.toLocaleString('en-IN')}` },
        { Metric: 'Confirmed Bookings', Value: confirmedCount },
        { Metric: 'Pending Verifications', Value: pendingCount },
        { Metric: 'Cancelled Bookings', Value: cancelledCount },
      ];

      const summarySheet = XLSX.utils.json_to_sheet(summaryData);
      summarySheet['!cols'] = [{ wch: 24 }, { wch: 32 }];

      // 3. Assemble Workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Bookings Details');
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Revenue Summary');

      // 4. Download file
      const dateStr = new Date().toISOString().split('T')[0];
      XLSX.writeFile(workbook, `${filenamePrefix}_${dateStr}.xlsx`);

      if (showToast) {
        showToast(`Excel spreadsheet downloaded (${dataToExport.length} bookings)!`, 'success');
      }
    } catch (err) {
      console.error('Export to Excel error:', err);
      if (showToast) showToast('Failed to generate Excel file.', 'error');
    }
  };

  // Export to CSV fallback
  const handleExportCsv = (dataToExport = bookings) => {
    if (!dataToExport || dataToExport.length === 0) {
      if (showToast) showToast('No booking data to export.', 'error');
      return;
    }
    try {
      const headers = [
        'Booking ID',
        'Ticket Code',
        'Customer Name',
        'Customer Email',
        'WhatsApp Number',
        'City',
        'Pass Tier',
        'Quantity',
        'Unit Price (INR)',
        'Total Amount (INR)',
        'Payment Method',
        'UTR Number',
        'Status',
        'Event Date',
        'Event Time',
        'Venue',
        'Booked At',
        'Receipt URL',
      ];

      const csvRows = [
        headers.join(','),
        ...dataToExport.map((b) =>
          [
            `"${b.id || ''}"`,
            `"${b.ticketCode || ''}"`,
            `"${(b.customerName || '').replace(/"/g, '""')}"`,
            `"${(b.customerEmail || '').replace(/"/g, '""')}"`,
            `"${b.whatsappNumber || ''}"`,
            `"${(b.city || '').replace(/"/g, '""')}"`,
            `"${b.ticketType || ''}"`,
            b.quantity || 1,
            b.unitPrice || 0,
            b.totalPrice || 0,
            `"${b.paymentMethod || 'UPI'}"`,
            `"${b.utrNumber || ''}"`,
            `"${b.status || 'Confirmed'}"`,
            `"${b.eventDate || ''}"`,
            `"${b.eventTime || ''}"`,
            `"${b.venue || ''}"`,
            `"${b.bookedAt ? new Date(b.bookedAt).toLocaleString('en-IN') : ''}"`,
            `"${b.receiptUrl || ''}"`,
          ].join(',')
        ),
      ];

      const blob = new Blob(['\uFEFF' + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Craftella_Bookings_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      if (showToast) showToast('CSV file downloaded successfully!', 'success');
    } catch (err) {
      console.error('Export CSV error:', err);
      if (showToast) showToast('Failed to generate CSV file.', 'error');
    }
  };

  // Preview object for real-time card preview
  const previewCard = {
    id: 'preview',
    title: formData.title || 'Pass Title Preview',
    type: formData.type || 'PASS TIER',
    subtitle: formData.subtitle || 'Card subtitle description goes here',
    price: formData.price ? Number(formData.price) : 699,
    formattedPrice: formData.price ? `₹${Number(formData.price).toLocaleString('en-IN')}` : '₹699',
    originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
    features: featuresList.length > 0 ? featuresList : ['Includes all standard craft tools'],
    colorTheme: formData.colorTheme,
    recommended: formData.recommended,
    status: formData.status,
    spotsLeft: formData.spotsLeft || 20,
  };

  const filteredCards =
    filterTheme === 'all'
      ? cards
      : cards.filter(
          (c) =>
            c.colorTheme === filterTheme ||
            (filterTheme === 'active' && c.status === 'active') ||
            (filterTheme === 'paused' && c.status === 'paused')
        );

  return (
    <div className="min-h-screen bg-[#090E17] text-[#F4F8FF] pb-24">
      {/* Top Banner / Breadcrumb */}
      <div className="border-b border-[rgba(158,190,246,0.15)] bg-[#0C1322] px-6 py-4 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7AA5F2]/20 text-[#7AA5F2] ring-1 ring-[#7AA5F2]/40">
              <Layers className="h-4 w-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-bold text-white tracking-wide">
                  Craftella Admin Center
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider border flex items-center gap-1.5 ${
                    isBackendConnected
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  }`}
                  title={
                    isBackendConnected
                      ? 'Live connection to Supabase PostgreSQL database active'
                      : 'Running in Local Storage Cache Mode. Set up .env with Supabase credentials to connect live database.'
                  }
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isBackendConnected
                        ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                        : 'bg-amber-400'
                    }`}
                  />
                  <span>{isBackendConnected ? 'Supabase Live' : 'Local Storage Mode'}</span>
                </span>
              </div>
              <p className="text-[11px] text-[#9BB1D3]">
                Manage payment cards, ticket tiers &amp; event booking offerings
              </p>
            </div>
          </div>

          {/* Quick Links & Actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/book-tickets"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[rgba(158,190,246,0.25)] bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-[#CBD8ED] hover:border-[#7AA5F2] hover:bg-[#7AA5F2]/10 hover:text-white transition-all"
            >
              <Eye className="h-3.5 w-3.5 text-[#7AA5F2]" />
              <span>View Live Booking Page</span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </Link>

            <button
              type="button"
              onClick={logoutAdmin}
              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 hover:text-white transition-all"
              title="Sign out of Admin Dashboard"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 sm:px-8 pt-8">
        {/* KPI STATS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl border border-[rgba(158,190,246,0.18)] bg-[#111B2D] p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#9BB1D3] uppercase">
                TOTAL PAYMENT CARDS
              </span>
              <CreditCard className="h-4 w-4 text-[#7AA5F2]" />
            </div>
            <div className="mt-3 text-3xl font-extrabold text-white">{stats.totalCards}</div>
            <p className="mt-1 text-[11px] text-[#9BB1D3]">
              {stats.activeCardsCount} active on booking page
            </p>
          </div>

          <div className="rounded-2xl border border-[rgba(158,190,246,0.18)] bg-[#111B2D] p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#9BB1D3] uppercase">
                ACTIVE ON BOOKING PAGE
              </span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-3 text-3xl font-extrabold text-emerald-400">
              {stats.activeCardsCount}
            </div>
            <p className="mt-1 text-[11px] text-[#9BB1D3]">
              {stats.pausedCardsCount} draft or paused
            </p>
          </div>

          <div className="rounded-2xl border border-[rgba(158,190,246,0.18)] bg-[#111B2D] p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#9BB1D3] uppercase">
                PASSES SOLD / BOOKINGS
              </span>
              <Users className="h-4 w-4 text-[#C084FC]" />
            </div>
            <div className="mt-3 text-3xl font-extrabold text-white">
              {stats.totalPassesSold} <span className="text-sm font-normal text-[#9BB1D3]">passes</span>
            </div>
            <p className="mt-1 text-[11px] text-[#9BB1D3]">
              Across {stats.totalBookingsCount} guest transactions
            </p>
          </div>

          <div className="rounded-2xl border border-[rgba(158,190,246,0.18)] bg-[#111B2D] p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#9BB1D3] uppercase">
                TOTAL TICKET REVENUE
              </span>
              <TrendingUp className="h-4 w-4 text-[#FBBF24]" />
            </div>
            <div className="mt-3 text-3xl font-extrabold text-[#FBBF24]">
              ₹{stats.totalRevenue.toLocaleString('en-IN')}
            </div>
            <p className="mt-1 text-[11px] text-[#9BB1D3]">Live calculation from bookings</p>
          </div>
        </div>

        {/* TAB CONTROLS */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(158,190,246,0.15)] pb-4 mb-8">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('cards')}
              className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'cards'
                  ? 'bg-[#7AA5F2] text-white shadow-lg shadow-[#7AA5F2]/20'
                  : 'bg-white/[0.04] text-[#CBD8ED] hover:bg-white/[0.08]'
              }`}
            >
              Payment Cards Manager ({cards.length})
            </button>

            <button
              onClick={() => setActiveTab('gateway')}
              className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeTab === 'gateway'
                  ? 'bg-[#F43F5E] text-white shadow-lg shadow-[#F43F5E]/30'
                  : 'bg-white/[0.04] text-[#CBD8ED] hover:bg-white/[0.08]'
              }`}
            >
              <QrCode className="h-3.5 w-3.5" />
              <span>Payment QR &amp; Gateway Settings</span>
            </button>

            <button
              onClick={() => setActiveTab('location')}
              className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeTab === 'location'
                  ? 'bg-[#FBBF24] text-white shadow-lg shadow-[#FBBF24]/30'
                  : 'bg-white/[0.04] text-[#CBD8ED] hover:bg-white/[0.08]'
              }`}
            >
              <MapPin className="h-3.5 w-3.5" />
              <span>Event Location &amp; Venue</span>
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'bookings'
                  ? 'bg-[#7AA5F2] text-white shadow-lg shadow-[#7AA5F2]/20'
                  : 'bg-white/[0.04] text-[#CBD8ED] hover:bg-white/[0.08]'
              }`}
            >
              Guest Bookings &amp; Orders ({bookings.length})
            </button>
          </div>

          <button
            onClick={() => {
              if (window.confirm('Reset all payment cards back to the default original catalog?')) {
                resetToDefaults();
              }
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[rgba(158,190,246,0.2)] bg-white/[0.02] px-3 py-1.5 text-xs text-[#9BB1D3] hover:text-white hover:border-[#7AA5F2]/50 transition-colors"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Reset Default Cards</span>
          </button>
        </div>

        {/* TAB 1: CARDS MANAGER */}
        {activeTab === 'cards' && (
          <div className="space-y-12">
            {/* SECTION: CREATE NEW PAYMENT CARD */}
            <div className="rounded-3xl border border-[rgba(158,190,246,0.2)] bg-gradient-to-b from-[#111B2D] to-[#0A101C] p-6 sm:p-8 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[rgba(158,190,246,0.15)]">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#7AA5F2]/15 px-3 py-1 text-[10px] font-bold text-[#7AA5F2] uppercase tracking-widest">
                    <PlusCircle className="h-3 w-3" />
                    <span>Create &amp; Publish</span>
                  </div>
                  <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-medium text-white">
                    Create New Payment Card
                  </h2>
                  <p className="text-xs text-[#9BB1D3] mt-1">
                    Once created, this card will immediately display on the Ticket Booking page (/book-tickets) and the Home page.
                  </p>
                </div>
              </div>

              {/* Form & Live Preview Split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
                {/* Form column */}
                <form onSubmit={handleCreateCardSubmit} className="lg:col-span-7 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#CBD8ED] mb-1">
                        Card Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. VIP Masterclass Pass"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full rounded-xl border border-[rgba(158,190,246,0.2)] bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-[#9BB1D3]/50 focus:border-[#7AA5F2] focus:outline-none focus:ring-1 focus:ring-[#7AA5F2]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#CBD8ED] mb-1">
                        Badge / Tier Label
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. VIP ACCESS / EARLY BIRD"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full rounded-xl border border-[rgba(158,190,246,0.2)] bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-[#9BB1D3]/50 focus:border-[#7AA5F2] focus:outline-none focus:ring-1 focus:ring-[#7AA5F2]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#CBD8ED] mb-1">
                        Price (₹) *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        placeholder="e.g. 1299"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full rounded-xl border border-[rgba(158,190,246,0.2)] bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-[#9BB1D3]/50 focus:border-[#7AA5F2] focus:outline-none focus:ring-1 focus:ring-[#7AA5F2]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#CBD8ED] mb-1">
                        Original Price (Optional)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 1699"
                        value={formData.originalPrice}
                        onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                        className="w-full rounded-xl border border-[rgba(158,190,246,0.2)] bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-[#9BB1D3]/50 focus:border-[#7AA5F2] focus:outline-none focus:ring-1 focus:ring-[#7AA5F2]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#CBD8ED] mb-1">
                        Available Spots
                      </label>
                      <input
                        type="number"
                        min="1"
                        placeholder="e.g. 20"
                        value={formData.spotsLeft}
                        onChange={(e) => setFormData({ ...formData, spotsLeft: e.target.value })}
                        className="w-full rounded-xl border border-[rgba(158,190,246,0.2)] bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-[#9BB1D3]/50 focus:border-[#7AA5F2] focus:outline-none focus:ring-1 focus:ring-[#7AA5F2]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#CBD8ED] mb-1">
                      Short Subtitle / Description
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Full entry for 1 person with premium crystal canvas kit"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      className="w-full rounded-xl border border-[rgba(158,190,246,0.2)] bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-[#9BB1D3]/50 focus:border-[#7AA5F2] focus:outline-none focus:ring-1 focus:ring-[#7AA5F2]"
                    />
                  </div>

                  {/* Theme Accent Picker */}
                  <div>
                    <label className="block text-xs font-semibold text-[#CBD8ED] mb-2">
                      Card Aesthetic Accent Theme
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                      {themeOptions.map((th) => (
                        <button
                          key={th.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, colorTheme: th.id })}
                          className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                            formData.colorTheme === th.id
                              ? 'border-[#7AA5F2] bg-[#7AA5F2]/20 text-white shadow-md'
                              : 'border-[rgba(158,190,246,0.2)] bg-white/[0.02] text-[#9BB1D3] hover:bg-white/[0.06]'
                          }`}
                        >
                          <span
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: th.color }}
                          />
                          <span>{th.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Features Builder */}
                  <div>
                    <label className="block text-xs font-semibold text-[#CBD8ED] mb-1">
                      Features &amp; Inclusions ({featuresList.length})
                    </label>

                    {/* Quick presets */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      <span className="text-[10px] text-[#9BB1D3] self-center mr-1">Quick add:</span>
                      {featurePresets.slice(0, 4).map((preset, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleAddPreset(preset)}
                          className="rounded-full border border-[rgba(158,190,246,0.2)] bg-white/[0.03] px-2 py-0.5 text-[10px] text-[#CBD8ED] hover:border-[#7AA5F2] hover:bg-[#7AA5F2]/10 transition-colors"
                        >
                          + {preset.slice(0, 24)}...
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add a benefit (e.g. Free beverage voucher)..."
                        value={newFeatureText}
                        onChange={(e) => setNewFeatureText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddFeature();
                          }
                        }}
                        className="flex-1 rounded-xl border border-[rgba(158,190,246,0.2)] bg-black/40 px-3.5 py-2 text-xs text-white placeholder-[#9BB1D3]/50 focus:border-[#7AA5F2] focus:outline-none focus:ring-1 focus:ring-[#7AA5F2]"
                      />
                      <button
                        type="button"
                        onClick={handleAddFeature}
                        className="rounded-xl bg-[#7AA5F2] px-4 py-2 text-xs font-bold text-white hover:bg-[#578CE6] transition-colors"
                      >
                        Add
                      </button>
                    </div>

                    {/* Current Features List */}
                    <div className="mt-3 space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {featuresList.map((feat, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-1.5 text-xs text-[#CBD8ED]"
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-[#7AA5F2]">✦</span>
                            <span>{feat}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFeature(idx)}
                            className="text-[#9BB1D3] hover:text-rose-400 p-1"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <label className="flex items-center gap-3 cursor-pointer rounded-xl border border-[rgba(158,190,246,0.15)] bg-white/[0.02] p-3 hover:bg-white/[0.04]">
                      <input
                        type="checkbox"
                        checked={formData.recommended}
                        onChange={(e) =>
                          setFormData({ ...formData, recommended: e.target.checked })
                        }
                        className="h-4 w-4 rounded border-[#7AA5F2] text-[#7AA5F2] focus:ring-[#7AA5F2]"
                      />
                      <div>
                        <div className="text-xs font-semibold text-white">Recommended Pass</div>
                        <div className="text-[10px] text-[#9BB1D3]">Display highlighted badge</div>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer rounded-xl border border-[rgba(158,190,246,0.15)] bg-white/[0.02] p-3 hover:bg-white/[0.04]">
                      <input
                        type="checkbox"
                        checked={formData.status === 'active'}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            status: e.target.checked ? 'active' : 'paused',
                          })
                        }
                        className="h-4 w-4 rounded border-[#7AA5F2] text-[#7AA5F2] focus:ring-[#7AA5F2]"
                      />
                      <div>
                        <div className="text-xs font-semibold text-white">Publish Live Immediately</div>
                        <div className="text-[10px] text-[#9BB1D3]">Visible on Ticket Booking page</div>
                      </div>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#7AA5F2] to-[#578CE6] py-3.5 px-6 text-xs font-extrabold uppercase tracking-widest text-white shadow-[0_0_25px_rgba(122,165,242,0.4)] hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer"
                    >
                      <Sparkles className="h-4 w-4 text-white" />
                      <span className="text-white font-bold">Publish Payment Card Live</span>
                    </button>
                  </div>
                </form>

                {/* Right Column: Real-Time Live Preview */}
                <div className="lg:col-span-5 flex flex-col justify-start">
                  <div className="sticky top-24">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold tracking-[0.2em] text-[#9BB1D3] uppercase flex items-center gap-1.5">
                        <Eye className="h-3 w-3 text-[#7AA5F2]" />
                        <span>Live Card Preview</span>
                      </span>
                      <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/15 px-2 py-0.5 rounded-full">
                        As seen by visitors
                      </span>
                    </div>

                    <div className="rounded-2xl border border-dashed border-[rgba(158,190,246,0.3)] p-3 bg-black/20">
                      <PaymentCard
                        card={previewCard}
                        isSelected={true}
                        showSelectButton={true}
                        actionButtonText="Select Pass"
                      />
                    </div>

                    <div className="mt-3 flex items-start gap-2 rounded-xl border border-[rgba(158,190,246,0.15)] bg-white/[0.02] p-3 text-[11px] text-[#9BB1D3]">
                      <Info className="h-4 w-4 text-[#7AA5F2] shrink-0 mt-0.5" />
                      <span>
                        When submitted, this card is immediately saved to localStorage and rendered inside the <strong className="text-white">Ticket Booking</strong> page (/book-tickets) and <strong className="text-white">Home</strong> page.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION: ALL EXISTING PAYMENT CARDS */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-serif text-2xl font-medium text-white">
                    Existing Payment Cards Catalog
                  </h3>
                  <p className="text-xs text-[#9BB1D3] mt-0.5">
                    Toggle visibility, edit details, or remove cards from the booking page.
                  </p>
                </div>

                {/* Filter tags */}
                <div className="flex items-center gap-2">
                  <Filter className="h-3.5 w-3.5 text-[#9BB1D3]" />
                  <select
                    value={filterTheme}
                    onChange={(e) => setFilterTheme(e.target.value)}
                    className="rounded-lg border border-[rgba(158,190,246,0.2)] bg-[#111B2D] px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#7AA5F2]"
                  >
                    <option value="all">All Cards ({cards.length})</option>
                    <option value="active">Live on Dashboard Only</option>
                    <option value="paused">Draft / Hidden Only</option>
                    <option value="blue">Royal Blue Theme</option>
                    <option value="purple">Cosmic Violet Theme</option>
                    <option value="amber">Golden Amber Theme</option>
                    <option value="emerald">Emerald Theme</option>
                    <option value="rose">Ruby Rose Theme</option>
                  </select>
                </div>
              </div>

              {filteredCards.length === 0 ? (
                <div className="rounded-2xl border border-[rgba(158,190,246,0.2)] bg-[#111B2D]/50 p-12 text-center">
                  <CreditCard className="mx-auto h-8 w-8 text-[#9BB1D3] mb-2" />
                  <h4 className="text-sm font-semibold text-white">No payment cards match this filter</h4>
                  <p className="text-xs text-[#9BB1D3] mt-1">Try selecting "All Cards" or create a new card above.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCards.map((card) => (
                    <PaymentCard
                      key={card.id}
                      card={card}
                      adminView={true}
                      onEdit={(c) => setEditingCard({ ...c, featuresText: c.features.join('\n') })}
                      onDelete={(id) => {
                        if (window.confirm(`Are you sure you want to delete "${card.title}"?`)) {
                          deleteCard(id);
                        }
                      }}
                      onToggleStatus={(id) => toggleCardStatus(id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: UPI PAYMENT QR & GATEWAY SETTINGS */}
        {activeTab === 'gateway' && (
          <div className="space-y-8">
            <div className="rounded-3xl border border-[rgba(244,63,94,0.25)] bg-gradient-to-b from-[#180E18] to-[#0E060E] p-6 sm:p-8 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#F43F5E]/15 px-3 py-1 text-[10px] font-bold text-[#F43F5E] uppercase tracking-widest">
                    <QrCode className="h-3 w-3" />
                    <span>UPI Gateway &amp; QR Manager</span>
                  </div>
                  <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-medium text-white">
                    Payment Image &amp; Gateway Settings
                  </h2>
                  <p className="text-xs text-[#9BB1D3] mt-1">
                    Upload your payment QR image, configure payment URL &amp; UPI ID, and edit or delete anytime. Changes sync instantly to customer checkout.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Reset all payment gateway settings back to system defaults?')) {
                        resetPaymentConfig();
                      }
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/[0.03] px-3.5 py-2 text-xs font-semibold text-[#CBD8ED] hover:bg-white/[0.08] transition-colors"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Reset to Defaults</span>
                  </button>
                </div>
              </div>

              {/* ACTIVE PAYMENT ASSETS STATUS & DIRECT ACTIONS (EDIT & DELETE) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {/* 1. PAYMENT IMAGE STATUS & ACTIONS */}
                <div className="rounded-2xl border border-[rgba(244,63,94,0.2)] bg-black/40 p-4.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold tracking-[0.2em] text-[#9BB1D3] uppercase flex items-center gap-1.5">
                        <ImageIcon className="h-3.5 w-3.5 text-[#F43F5E]" />
                        <span>Payment QR Image</span>
                      </span>
                      {paymentConfig?.qrImageUrl ? (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          Custom Image
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">
                          Default Dynamic QR
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 my-2">
                      <div className="h-14 w-14 shrink-0 rounded-xl bg-white p-1 border border-white/20 flex items-center justify-center overflow-hidden">
                        {paymentConfig?.qrImageUrl ? (
                          <img
                            src={paymentConfig.qrImageUrl}
                            alt="Payment QR"
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <QrCode className="h-8 w-8 text-[#070D1A]" />
                        )}
                      </div>
                      <div className="truncate">
                        <span className="text-xs font-bold text-white block truncate">
                          {paymentConfig?.qrImageUrl ? 'Custom QR Code Active' : 'Auto-generated QR'}
                        </span>
                        <span className="text-[10px] text-[#9BB1D3] block mt-0.5">
                          {paymentConfig?.qrImageUrl ? 'Displayed at customer checkout' : 'Generates QR for entered UPI ID'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-white/10 mt-2">
                    <label
                      htmlFor="payment-image-upload"
                      className="cursor-pointer flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-[rgba(244,63,94,0.3)] bg-[#F43F5E]/10 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-[#F43F5E]/20 transition-colors"
                    >
                      <Edit3 className="h-3 w-3 text-[#F43F5E]" />
                      <span>{paymentConfig?.qrImageUrl ? 'Edit / Replace Image' : 'Upload Image'}</span>
                    </label>

                    {paymentConfig?.qrImageUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete the custom payment image? It will revert to the default dynamic QR.')) {
                            deletePaymentImage();
                            setGatewayForm((prev) => ({ ...prev, qrImageUrl: '' }));
                          }
                        }}
                        className="inline-flex items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 hover:text-white transition-colors"
                        title="Delete custom payment image"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. PAYMENT URL STATUS & ACTIONS */}
                <div className="rounded-2xl border border-[rgba(244,63,94,0.2)] bg-black/40 p-4.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold tracking-[0.2em] text-[#9BB1D3] uppercase flex items-center gap-1.5">
                        <ExternalLink className="h-3.5 w-3.5 text-[#F43F5E]" />
                        <span>Payment URL / Link</span>
                      </span>
                      {paymentConfig?.paymentUrl ? (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          Configured
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-[#9BB1D3] bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                          None (QR Only)
                        </span>
                      )}
                    </div>

                    <div className="my-2">
                      <span className="text-xs font-bold text-white block">
                        {paymentConfig?.paymentUrl ? 'Direct UPI / Checkout Link' : 'No Payment URL Configured'}
                      </span>
                      <div className="font-mono text-[11px] text-[#9BB1D3] bg-white/[0.03] p-1.5 rounded-lg border border-white/5 mt-1 truncate">
                        {paymentConfig?.paymentUrl || 'Click Edit to add a direct payment link'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-white/10 mt-2">
                    {paymentConfig?.paymentUrl && (
                      <a
                        href={paymentConfig.paymentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1 rounded-lg border border-white/20 bg-white/[0.05] px-2.5 py-1.5 text-xs font-semibold text-[#CBD8ED] hover:bg-white/[0.1] transition-colors"
                        title="Test Payment URL"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>Test Link</span>
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById('payment-url-input');
                        if (el) {
                          el.focus();
                          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                      }}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-[rgba(244,63,94,0.3)] bg-[#F43F5E]/10 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-[#F43F5E]/20 transition-colors"
                    >
                      <Edit3 className="h-3 w-3 text-[#F43F5E]" />
                      <span>{paymentConfig?.paymentUrl ? 'Edit URL' : 'Add URL'}</span>
                    </button>

                    {paymentConfig?.paymentUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm('Delete and clear the payment URL? Customers will only pay via QR code.')) {
                            deletePaymentUrl();
                            setGatewayForm((prev) => ({ ...prev, paymentUrl: '' }));
                          }
                        }}
                        className="inline-flex items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 hover:text-white transition-colors"
                        title="Delete Payment URL"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 3. ACTIVE UPI ID & PAYEE */}
                <div className="rounded-2xl border border-[rgba(244,63,94,0.2)] bg-black/40 p-4.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold tracking-[0.2em] text-[#9BB1D3] uppercase flex items-center gap-1.5">
                        <Lock className="h-3.5 w-3.5 text-[#F43F5E]" />
                        <span>UPI ID (VPA) &amp; Payee</span>
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        Live Active
                      </span>
                    </div>

                    <div className="my-2">
                      <span className="font-mono text-sm font-bold text-white block truncate">
                        {paymentConfig?.upiId || '9701451646@ybl'}
                      </span>
                      <span className="text-[11px] text-[#9BB1D3] block mt-0.5 truncate">
                        Payee: {paymentConfig?.payeeName || 'Craftella Events'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-white/10 mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(paymentConfig?.upiId || '9701451646@ybl');
                        setPreviewCopied(true);
                        setTimeout(() => setPreviewCopied(false), 2000);
                      }}
                      className="inline-flex items-center gap-1 rounded-lg border border-white/20 bg-white/[0.05] px-2.5 py-1.5 text-xs font-semibold text-[#CBD8ED] hover:bg-white/[0.1] transition-colors"
                    >
                      <Copy className="h-3 w-3" />
                      <span>{previewCopied ? 'Copied' : 'Copy'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById('payment-upi-input');
                        if (el) {
                          el.focus();
                          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                      }}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-[rgba(244,63,94,0.3)] bg-[#F43F5E]/10 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-[#F43F5E]/20 transition-colors"
                    >
                      <Edit3 className="h-3 w-3 text-[#F43F5E]" />
                      <span>Edit UPI ID</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Grid: Settings Form & Real-time Customer Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 pt-6 border-t border-white/10">
                {/* Form Column */}
                <form onSubmit={handleSaveGateway} className="lg:col-span-7 space-y-6">
                  {/* Upload Payment Image */}
                  <div className="rounded-2xl border border-[rgba(244,63,94,0.2)] bg-black/25 p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <label className="block text-xs font-bold text-white uppercase tracking-wider">
                          1. Upload / Edit Payment QR Image
                        </label>
                        <p className="text-[11px] text-[#9BB1D3] mt-0.5">
                          Upload your merchant QR screenshot or image file to show on customer checkout.
                        </p>
                      </div>
                      {gatewayForm.qrImageUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('Delete custom payment image and revert to default dynamic QR?')) {
                              deletePaymentImage();
                              setGatewayForm((prev) => ({ ...prev, qrImageUrl: '' }));
                            }
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 hover:text-rose-300 transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>Delete Image</span>
                        </button>
                      )}
                    </div>

                    {/* Image Dropzone */}
                    <label
                      htmlFor="payment-image-upload"
                      className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[rgba(244,63,94,0.3)] bg-black/40 p-5 cursor-pointer hover:border-[#F43F5E] hover:bg-black/60 transition-all text-center relative"
                    >
                      <input
                        id="payment-image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handlePaymentImageFileChange}
                        className="hidden"
                      />
                      {gatewayForm.qrImageUrl ? (
                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                          <img
                            src={gatewayForm.qrImageUrl}
                            alt="Current Payment QR"
                            className="h-24 w-24 object-contain rounded-xl border border-white/20 bg-white p-1 shadow-lg shrink-0"
                          />
                          <div className="text-left flex-1">
                            <span className="text-xs font-bold text-white block">
                              Custom Payment QR Active
                            </span>
                            <span className="text-[11px] text-emerald-400 block mt-0.5">
                              ✓ Ready for customer checkout
                            </span>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="inline-flex items-center gap-1 rounded-md bg-[#F43F5E]/20 px-2 py-1 text-[10px] font-bold text-white">
                                <Edit3 className="h-3 w-3" /> Click to Replace File
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  if (window.confirm('Delete this payment image?')) {
                                    deletePaymentImage();
                                    setGatewayForm((prev) => ({ ...prev, qrImageUrl: '' }));
                                  }
                                }}
                                className="inline-flex items-center gap-1 rounded-md bg-rose-500/20 px-2 py-1 text-[10px] font-bold text-rose-300 hover:bg-rose-500/30"
                              >
                                <Trash2 className="h-3 w-3" /> Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F43F5E]/15 text-[#F43F5E] mb-2 group-hover:scale-105 transition-transform">
                            <Upload className="h-6 w-6" />
                          </div>
                          <span className="text-xs font-semibold text-white">
                            Click or drag to upload new Payment QR Image
                          </span>
                          <span className="text-[10px] text-[#9BB1D3] mt-0.5">
                            PNG, JPG, JPEG, WEBP or SVG • Max 5MB
                          </span>
                        </>
                      )}
                    </label>

                    {/* Or Image URL */}
                    <div className="mt-4">
                      <label className="block text-[11px] font-semibold text-[#CBD8ED] mb-1">
                        Or Paste Remote Image URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="https://example.com/payment-qr.png"
                          value={gatewayForm.qrImageUrl?.startsWith('data:') ? '' : gatewayForm.qrImageUrl}
                          onChange={(e) =>
                            setGatewayForm({ ...gatewayForm, qrImageUrl: e.target.value })
                          }
                          className="flex-1 rounded-xl border border-[rgba(158,190,246,0.2)] bg-black/40 px-3.5 py-2 text-xs text-white placeholder-[#9BB1D3]/50 focus:border-[#F43F5E] focus:outline-none focus:ring-1 focus:ring-[#F43F5E]"
                        />
                        {gatewayForm.qrImageUrl && !gatewayForm.qrImageUrl.startsWith('data:') && (
                          <button
                            type="button"
                            onClick={() => {
                              deletePaymentImage();
                              setGatewayForm((prev) => ({ ...prev, qrImageUrl: '' }));
                            }}
                            className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-300 hover:bg-rose-500/20"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Payment URL & UPI Credentials */}
                  <div className="rounded-2xl border border-[rgba(244,63,94,0.2)] bg-black/25 p-5 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                        2. Payment URL &amp; UPI Gateway Credentials
                      </label>
                      <p className="text-[11px] text-[#9BB1D3]">
                        Enter the payment intent URL or UPI app link for direct customer payments.
                      </p>
                    </div>

                    {/* Payment URL */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-semibold text-[#CBD8ED]">
                          Direct Payment URL / Intent Link
                        </label>
                        {gatewayForm.paymentUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm('Delete and clear the payment URL?')) {
                                deletePaymentUrl();
                                setGatewayForm((prev) => ({ ...prev, paymentUrl: '' }));
                              }
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 hover:text-rose-300 transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Delete URL</span>
                          </button>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <input
                          id="payment-url-input"
                          type="text"
                          placeholder="e.g. upi://pay?pa=9701451646@ybl&pn=Craftella&cu=INR"
                          value={gatewayForm.paymentUrl}
                          onChange={(e) =>
                            setGatewayForm({ ...gatewayForm, paymentUrl: e.target.value })
                          }
                          className="flex-1 rounded-xl border border-[rgba(158,190,246,0.2)] bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-[#9BB1D3]/50 focus:border-[#F43F5E] focus:outline-none focus:ring-1 focus:ring-[#F43F5E] font-mono text-[11px]"
                        />
                        {gatewayForm.paymentUrl && (
                          <a
                            href={gatewayForm.paymentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-xl border border-white/20 bg-white/[0.05] px-3 py-2.5 text-xs font-semibold text-[#CBD8ED] hover:bg-white/[0.1] transition-colors flex items-center gap-1 shrink-0"
                            title="Test this URL"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Test</span>
                          </a>
                        )}
                      </div>
                      <p className="mt-1 text-[10px] text-[#9BB1D3]/70">
                        Supports standard UPI deep links (upi://pay?...) or external checkout web URLs.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* UPI ID */}
                      <div>
                        <label className="block text-xs font-semibold text-[#CBD8ED] mb-1">
                          UPI ID / VPA *
                        </label>
                        <input
                          id="payment-upi-input"
                          type="text"
                          required
                          placeholder="e.g. 9701451646@ybl"
                          value={gatewayForm.upiId}
                          onChange={(e) =>
                            setGatewayForm({ ...gatewayForm, upiId: e.target.value })
                          }
                          className="w-full rounded-xl border border-[rgba(158,190,246,0.2)] bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-[#9BB1D3]/50 focus:border-[#F43F5E] focus:outline-none focus:ring-1 focus:ring-[#F43F5E] font-mono"
                        />
                      </div>

                      {/* Payee Name */}
                      <div>
                        <label className="block text-xs font-semibold text-[#CBD8ED] mb-1">
                          Payee / Business Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Craftella Events"
                          value={gatewayForm.payeeName}
                          onChange={(e) =>
                            setGatewayForm({ ...gatewayForm, payeeName: e.target.value })
                          }
                          className="w-full rounded-xl border border-[rgba(158,190,246,0.2)] bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-[#9BB1D3]/50 focus:border-[#F43F5E] focus:outline-none focus:ring-1 focus:ring-[#F43F5E]"
                        />
                      </div>
                    </div>

                    {/* Instructions */}
                    <div>
                      <label className="block text-xs font-semibold text-[#CBD8ED] mb-1">
                        Instructions Displayed to Customers
                      </label>
                      <textarea
                        rows={2}
                        value={gatewayForm.instructions}
                        onChange={(e) =>
                          setGatewayForm({ ...gatewayForm, instructions: e.target.value })
                        }
                        className="w-full rounded-xl border border-[rgba(158,190,246,0.2)] bg-black/40 p-3 text-xs text-white placeholder-[#9BB1D3]/50 focus:border-[#F43F5E] focus:outline-none focus:ring-1 focus:ring-[#F43F5E]"
                      />
                    </div>
                  </div>

                  {/* Submit / Edit Actions */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#e11d48] to-[#f43f5e] py-3.5 px-6 text-xs font-extrabold uppercase tracking-widest text-white shadow-[0_0_25px_rgba(244,63,94,0.4)] hover:brightness-110 active:scale-[0.99] transition-all"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>Save &amp; Publish Payment Settings</span>
                    </button>

                    {gatewayForm.qrImageUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm('Delete custom payment image?')) {
                            deletePaymentImage();
                            setGatewayForm((prev) => ({ ...prev, qrImageUrl: '' }));
                          }
                        }}
                        className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3.5 text-xs font-bold text-rose-300 hover:bg-rose-500/20 transition-colors flex items-center gap-1.5"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete Image</span>
                      </button>
                    )}

                    {gatewayForm.paymentUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm('Delete custom payment URL?')) {
                            deletePaymentUrl();
                            setGatewayForm((prev) => ({ ...prev, paymentUrl: '' }));
                          }
                        }}
                        className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3.5 text-xs font-bold text-rose-300 hover:bg-rose-500/20 transition-colors flex items-center gap-1.5"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete URL</span>
                      </button>
                    )}
                  </div>
                </form>

                {/* Right Column: Real-Time Preview of Customer UPI Card */}
                <div className="lg:col-span-5 flex flex-col justify-start">
                  <div className="sticky top-24">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold tracking-[0.2em] text-[#9BB1D3] uppercase flex items-center gap-1.5">
                        <Eye className="h-3 w-3 text-[#F43F5E]" />
                        <span>Customer Live Checkout Preview</span>
                      </span>
                      <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/15 px-2 py-0.5 rounded-full">
                        Live Preview
                      </span>
                    </div>

                    {/* Preview Card matching Image 1 */}
                    <div className="flex flex-col justify-between rounded-3xl border border-[rgba(244,63,94,0.22)] bg-gradient-to-b from-[#180E18] to-[#110811] p-6 shadow-2xl relative">
                      <div>
                        {/* Top Bar */}
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold tracking-[0.2em] text-[#F43F5E] uppercase">
                            PAY VIA UPI
                          </span>
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                            <Lock className="h-3 w-3" />
                            <span>SECURE</span>
                          </span>
                        </div>

                        {/* Amount */}
                        <div className="mt-5 text-center">
                          <div className="text-[10px] font-bold tracking-[0.25em] text-[#9BB1D3] uppercase">
                            AMOUNT TO PAY
                          </div>
                          <div className="mt-1 text-4xl font-extrabold text-[#F43F5E] tracking-tight">
                            ₹499
                          </div>
                        </div>

                        {/* QR Code Container */}
                        <div className="mt-5 flex flex-col items-center">
                          <div className="relative rounded-2xl bg-white p-3.5 shadow-xl border-2 border-white/90">
                            {gatewayForm.qrImageUrl ? (
                              <img
                                src={gatewayForm.qrImageUrl}
                                alt="Custom Payment QR Code"
                                className="h-40 w-40 object-contain rounded-xl"
                              />
                            ) : (
                              <>
                                <img
                                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi%3A%2F%2Fpay%3Fpa%3D${encodeURIComponent(
                                    gatewayForm.upiId || '9701451646@ybl'
                                  )}%26pn%3DCraftella%26am%3D499%26cu%3DINR`}
                                  alt="Default UPI QR Code"
                                  className="h-40 w-40 object-contain"
                                />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5f259f] border-2 border-white shadow-md">
                                    <span className="text-white font-black text-xs">पे</span>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>

                          <p className="mt-3 text-center text-xs text-[#9BB1D3] max-w-xs leading-relaxed">
                            {gatewayForm.instructions}
                          </p>
                        </div>
                      </div>

                      {/* Bottom UPI ID Box */}
                      <div className="mt-5 rounded-2xl border border-[rgba(244,63,94,0.2)] bg-black/40 p-3 flex items-center justify-between gap-2">
                        <div className="truncate">
                          <span className="text-[9px] font-bold tracking-[0.2em] text-[#9BB1D3] uppercase block">
                            UPI ID
                          </span>
                          <span className="font-mono text-xs font-bold text-white truncate block">
                            {gatewayForm.upiId}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(gatewayForm.upiId);
                            setPreviewCopied(true);
                            setTimeout(() => setPreviewCopied(false), 2000);
                          }}
                          className="inline-flex items-center gap-1 rounded-xl border border-white/20 bg-white/[0.06] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-white/[0.12] transition-colors shrink-0"
                        >
                          {previewCopied ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-400" />
                              <span className="text-emerald-300">COPIED</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>COPY</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 flex items-start gap-2 rounded-xl border border-[rgba(158,190,246,0.15)] bg-white/[0.02] p-3 text-[11px] text-[#9BB1D3]">
                      <Info className="h-4 w-4 text-[#F43F5E] shrink-0 mt-0.5" />
                      <span>
                        Any edits or images uploaded here instantly reflect on the customer checkout screen at <strong className="text-white">/book-tickets</strong>.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: EVENT LOCATION & VENUE */}
        {activeTab === 'location' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl font-medium text-white flex items-center gap-2">
                  <MapPin className="h-6 w-6 text-[#FBBF24]" />
                  <span>Event Venue &amp; Location Management</span>
                </h3>
                <p className="text-xs text-[#9BB1D3] mt-0.5">
                  Update event venue name, address, Google Maps directions link, and timings shown on the public site and tickets.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="/location"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[rgba(158,190,246,0.25)] bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-[#CBD8ED] hover:bg-white/[0.08] hover:text-white transition-colors"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>View Public /location</span>
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </a>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Reset venue and location back to default Indiranagar 55 Bistro settings?')) {
                      resetLocationConfig();
                    }
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[rgba(158,190,246,0.2)] bg-white/[0.02] px-3.5 py-2 text-xs font-semibold text-[#9BB1D3] hover:text-white hover:border-[#FBBF24]/50 transition-colors"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Reset Venue Defaults</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT COLUMN: EDIT FORM */}
              <div className="lg:col-span-7 space-y-6">
                <form onSubmit={handleSaveLocation} className="space-y-6">
                  {/* Card 1: Core Venue Identifiers */}
                  <div className="rounded-2xl border border-[rgba(158,190,246,0.2)] bg-[#111B2D] p-6 shadow-xl space-y-4">
                    <div className="flex items-center gap-2 border-b border-[rgba(158,190,246,0.12)] pb-3">
                      <MapPin className="h-4 w-4 text-[#FBBF24]" />
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                        Venue Identity &amp; Titles
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#CBD8ED] mb-1.5">
                          Venue Name <span className="text-[#F43F5E]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={locationForm.venueName}
                          onChange={(e) =>
                            setLocationForm({ ...locationForm, venueName: e.target.value })
                          }
                          placeholder="e.g. 55 Bistro"
                          className="w-full rounded-xl border border-[rgba(158,190,246,0.2)] bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-[#FBBF24] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#CBD8ED] mb-1.5">
                          Status Badge Text
                        </label>
                        <input
                          type="text"
                          value={locationForm.status}
                          onChange={(e) =>
                            setLocationForm({ ...locationForm, status: e.target.value })
                          }
                          placeholder="e.g. OFFICIAL EVENT VENUE"
                          className="w-full rounded-xl border border-[rgba(158,190,246,0.2)] bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-[#FBBF24] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#CBD8ED] mb-1.5">
                          Section Kicker / Tagline
                        </label>
                        <input
                          type="text"
                          value={locationForm.kicker}
                          onChange={(e) =>
                            setLocationForm({ ...locationForm, kicker: e.target.value })
                          }
                          placeholder="e.g. FIND YOUR WAY"
                          className="w-full rounded-xl border border-[rgba(158,190,246,0.2)] bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-[#FBBF24] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#CBD8ED] mb-1.5">
                          Main Heading
                        </label>
                        <input
                          type="text"
                          value={locationForm.heading}
                          onChange={(e) =>
                            setLocationForm({ ...locationForm, heading: e.target.value })
                          }
                          placeholder="e.g. Meet us at 55 Bistro"
                          className="w-full rounded-xl border border-[rgba(158,190,246,0.2)] bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-[#FBBF24] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#CBD8ED] mb-1.5">
                        Overview Description
                      </label>
                      <textarea
                        rows={2}
                        value={locationForm.description}
                        onChange={(e) =>
                          setLocationForm({ ...locationForm, description: e.target.value })
                        }
                        placeholder="Brief overview text introducing the venue"
                        className="w-full rounded-xl border border-[rgba(158,190,246,0.2)] bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-[#FBBF24] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Card 2: Date, Time & Event Note */}
                  <div className="rounded-2xl border border-[rgba(158,190,246,0.2)] bg-[#111B2D] p-6 shadow-xl space-y-4">
                    <div className="flex items-center gap-2 border-b border-[rgba(158,190,246,0.12)] pb-3">
                      <Calendar className="h-4 w-4 text-[#7AA5F2]" />
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                        Event Schedule &amp; Date
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#CBD8ED] mb-1.5">
                          Event Date <span className="text-[#F43F5E]">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={locationForm.eventDate}
                            onChange={(e) =>
                              setLocationForm({ ...locationForm, eventDate: e.target.value })
                            }
                            placeholder="e.g. Sunday, 18 October 2026"
                            className="w-full rounded-xl border border-[rgba(158,190,246,0.2)] bg-black/40 px-3.5 py-2.5 pl-9 text-xs text-white placeholder-slate-500 focus:border-[#7AA5F2] focus:outline-none"
                          />
                          <Calendar className="h-4 w-4 text-[#9BB1D3] absolute left-3 top-3 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#CBD8ED] mb-1.5">
                          Event Time / Hours <span className="text-[#F43F5E]">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={locationForm.eventTime}
                            onChange={(e) =>
                              setLocationForm({ ...locationForm, eventTime: e.target.value })
                            }
                            placeholder="e.g. 2:00 PM – 5:00 PM"
                            className="w-full rounded-xl border border-[rgba(158,190,246,0.2)] bg-black/40 px-3.5 py-2.5 pl-9 text-xs text-white placeholder-slate-500 focus:border-[#7AA5F2] focus:outline-none"
                          />
                          <Clock className="h-4 w-4 text-[#9BB1D3] absolute left-3 top-3 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#CBD8ED] mb-1.5">
                        Venue Details Note
                      </label>
                      <textarea
                        rows={2}
                        value={locationForm.infoText}
                        onChange={(e) =>
                          setLocationForm({ ...locationForm, infoText: e.target.value })
                        }
                        placeholder="Detailed info or special instructions shown inside the venue card"
                        className="w-full rounded-xl border border-[rgba(158,190,246,0.2)] bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-[#7AA5F2] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Card 3: Address & Google Maps Navigation */}
                  <div className="rounded-2xl border border-[rgba(158,190,246,0.2)] bg-[#111B2D] p-6 shadow-xl space-y-4">
                    <div className="flex items-center gap-2 border-b border-[rgba(158,190,246,0.12)] pb-3">
                      <Navigation className="h-4 w-4 text-[#34D399]" />
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                        Address &amp; Google Maps Navigation
                      </h4>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#CBD8ED] mb-1.5">
                        Full Address &amp; Landmark <span className="text-[#F43F5E]">*</span>
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={locationForm.address}
                        onChange={(e) =>
                          setLocationForm({ ...locationForm, address: e.target.value })
                        }
                        placeholder="e.g. 55 Bistro, 100 Feet Rd, Indiranagar, Bengaluru, Karnataka 560038"
                        className="w-full rounded-xl border border-[rgba(158,190,246,0.2)] bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-[#34D399] focus:outline-none font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#CBD8ED] mb-1.5">
                        Google Maps Directions URL <span className="text-[#F43F5E]">*</span>
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          required
                          value={locationForm.googleMapsUrl}
                          onChange={(e) =>
                            setLocationForm({ ...locationForm, googleMapsUrl: e.target.value })
                          }
                          placeholder="https://maps.app.goo.gl/..."
                          className="flex-1 rounded-xl border border-[rgba(158,190,246,0.2)] bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-[#34D399] focus:outline-none font-mono"
                        />
                        {locationForm.googleMapsUrl && (
                          <a
                            href={locationForm.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-[rgba(158,190,246,0.25)] bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-[#34D399] hover:bg-[#34D399]/10 transition-colors shrink-0"
                            title="Test this Google Maps link in a new tab"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            <span>Test</span>
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#CBD8ED] mb-1.5">
                          Directions Button Label
                        </label>
                        <input
                          type="text"
                          value={locationForm.buttonText}
                          onChange={(e) =>
                            setLocationForm({ ...locationForm, buttonText: e.target.value })
                          }
                          placeholder="e.g. Get Directions"
                          className="w-full rounded-xl border border-[rgba(158,190,246,0.2)] bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-[#34D399] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#CBD8ED] mb-1.5">
                          Help Note
                        </label>
                        <input
                          type="text"
                          value={locationForm.note}
                          onChange={(e) =>
                            setLocationForm({ ...locationForm, note: e.target.value })
                          }
                          placeholder="e.g. Tap “Get Directions” to open Google Maps"
                          className="w-full rounded-xl border border-[rgba(158,190,246,0.2)] bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-[#34D399] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-white shadow-lg shadow-[#FBBF24]/20 hover:from-[#F59E0B] hover:to-[#D97706] hover:shadow-[#FBBF24]/40 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                    >
                      <Check className="h-4 w-4 stroke-[3] text-white" />
                      <span className="text-white font-bold">Save &amp; Publish Location Changes</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (locationConfig) {
                          setLocationForm(locationConfig);
                        }
                      }}
                      className="rounded-xl border border-[rgba(158,190,246,0.2)] bg-white/[0.02] px-4 py-3 text-xs font-semibold text-[#CBD8ED] hover:bg-white/[0.06] transition-colors"
                    >
                      Discard Unsaved Edits
                    </button>
                  </div>
                </form>
              </div>

              {/* RIGHT COLUMN: LIVE REAL-TIME PREVIEW */}
              <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
                <div className="rounded-2xl border border-[rgba(158,190,246,0.25)] bg-[#111B2D] p-5 shadow-2xl relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-[rgba(158,190,246,0.15)] pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#FBBF24] animate-ping" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Live Venue Card Preview
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#FBBF24] bg-[#FBBF24]/10 px-2 py-0.5 rounded border border-[#FBBF24]/20">
                      Real-Time
                    </span>
                  </div>

                  <p className="text-[11px] text-[#9BB1D3] mb-4">
                    This is an exact preview of how the venue card appears to guests on the website:
                  </p>

                  {/* Rendered Preview Card */}
                  <div className="rounded-2xl border border-[rgba(158,190,246,0.25)] bg-[#0A101C] p-5 shadow-xl space-y-4">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(158,190,246,0.25)] bg-[rgba(122,165,242,0.08)] px-3 py-1 text-[10px] font-bold tracking-[0.18em] text-[#7AA5F2]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#578CE6] animate-pulse" />
                      <span>{locationForm.status || 'OFFICIAL EVENT VENUE'}</span>
                    </div>

                    {/* Venue Name */}
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-[#7AA5F2] font-semibold">
                        {locationForm.kicker || 'FIND YOUR WAY'}
                      </div>
                      <h4 className="font-serif text-2xl font-medium text-white mt-0.5">
                        {locationForm.venueName || 'Venue Name'}
                      </h4>
                    </div>

                    {/* Address with Icon */}
                    <div className="flex items-start gap-2 text-xs text-[#7AA5F2] font-medium bg-[#7AA5F2]/5 p-3 rounded-xl border border-[#7AA5F2]/20">
                      <MapPin className="h-4 w-4 text-[#FBBF24] shrink-0 mt-0.5" />
                      <span className="leading-relaxed">
                        {locationForm.address || 'Venue address will appear here...'}
                      </span>
                    </div>

                    {/* Schedule Pills */}
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="flex items-center gap-1.5 rounded-lg bg-white/[0.03] p-2 text-[#CBD8ED] border border-white/5">
                        <Calendar className="h-3.5 w-3.5 text-[#FBBF24] shrink-0" />
                        <span className="truncate">{locationForm.eventDate || 'Date'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 rounded-lg bg-white/[0.03] p-2 text-[#CBD8ED] border border-white/5">
                        <Clock className="h-3.5 w-3.5 text-[#34D399] shrink-0" />
                        <span className="truncate">{locationForm.eventTime || 'Time'}</span>
                      </div>
                    </div>

                    {/* Info Text */}
                    {locationForm.infoText && (
                      <p className="text-xs text-[#9BB1D3] leading-relaxed line-clamp-3">
                        {locationForm.infoText}
                      </p>
                    )}

                    {/* Mock Directions Button */}
                    <div className="pt-2">
                      <a
                        href={locationForm.googleMapsUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#7AA5F2] bg-[#7AA5F2] py-2.5 text-xs font-extrabold uppercase tracking-wider text-white transition-all hover:bg-[#578CE6] hover:border-[#578CE6]"
                      >
                        <Navigation className="h-3.5 w-3.5 text-white" />
                        <span className="text-white font-bold">{locationForm.buttonText || 'Get Directions'}</span>
                        <ExternalLink className="h-3 w-3 text-white" />
                      </a>
                      {locationForm.note && (
                        <p className="text-[10px] text-center text-[#9BB1D3] mt-2">
                          {locationForm.note}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex items-start gap-2 rounded-xl border border-[rgba(158,190,246,0.15)] bg-white/[0.02] p-3 text-[11px] text-[#9BB1D3]">
                    <Info className="h-4 w-4 text-[#FBBF24] shrink-0 mt-0.5" />
                    <span>
                      Clicking <strong className="text-white">Save &amp; Publish Location Changes</strong> immediately updates the venue details on <strong className="text-white">/location</strong>, the home page banner, and customer tickets.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BOOKINGS & ORDERS */}
        {activeTab === 'bookings' && (() => {
          const filteredBookings = bookings.filter((b) => {
            const matchesQuery =
              !bookingSearch.trim() ||
              b.customerName?.toLowerCase().includes(bookingSearch.toLowerCase()) ||
              b.customerEmail?.toLowerCase().includes(bookingSearch.toLowerCase()) ||
              b.ticketCode?.toLowerCase().includes(bookingSearch.toLowerCase()) ||
              b.utrNumber?.toLowerCase().includes(bookingSearch.toLowerCase());
            const matchesStatus =
              bookingStatusFilter === 'all' || b.status === bookingStatusFilter;
            return matchesQuery && matchesStatus;
          });

          return (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-2xl font-medium text-white">
                    Customer Bookings &amp; Passes Sold
                  </h3>
                  <p className="text-xs text-[#9BB1D3] mt-0.5">
                    Real-time list of bookings placed via the Book Tickets checkout flow, synchronized with Supabase.
                  </p>
                </div>

                {/* Search & Filter Bar */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#9BB1D3]" />
                    <input
                      type="text"
                      placeholder="Search by name, email, code, UTR..."
                      value={bookingSearch}
                      onChange={(e) => setBookingSearch(e.target.value)}
                      className="rounded-lg border border-[rgba(158,190,246,0.2)] bg-[#111B2D] pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#9BB1D3]/60 focus:outline-none focus:border-[#7AA5F2]"
                    />
                  </div>

                  <select
                    value={bookingStatusFilter}
                    onChange={(e) => setBookingStatusFilter(e.target.value)}
                    className="rounded-lg border border-[rgba(158,190,246,0.2)] bg-[#111B2D] px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#7AA5F2]"
                  >
                    <option value="all">All Statuses ({bookings.length})</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Pending Verification">Pending Verification</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>

                  {/* Download Excel Spreadsheet */}
                  <button
                    type="button"
                    onClick={() => handleExportExcel(filteredBookings)}
                    disabled={filteredBookings.length === 0}
                    className="flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-emerald-950/50 transition-all hover:scale-[1.02] active:scale-95"
                    title="Download all customer bookings details as an Excel spreadsheet (.xlsx)"
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    <span>Download Excel</span>
                    <span className="rounded-full bg-emerald-800/80 px-1.5 py-0.2 text-[10px] text-emerald-200">
                      {filteredBookings.length}
                    </span>
                  </button>

                  {/* CSV Export Option */}
                  <button
                    type="button"
                    onClick={() => handleExportCsv(filteredBookings)}
                    disabled={filteredBookings.length === 0}
                    className="flex items-center gap-1.5 rounded-lg border border-[rgba(158,190,246,0.2)] bg-[#111B2D] hover:bg-white/[0.05] disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1.5 text-xs text-[#CBD8ED] transition-colors"
                    title="Download as CSV format"
                  >
                    <Download className="h-3.5 w-3.5 text-[#9BB1D3]" />
                    <span>CSV</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-[rgba(158,190,246,0.2)] bg-[#111B2D] shadow-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[rgba(158,190,246,0.15)] bg-white/[0.03] text-[10px] font-bold uppercase tracking-wider text-[#9BB1D3]">
                      <th className="py-3.5 px-4">Booking ID</th>
                      <th className="py-3.5 px-4">Ticket Code</th>
                      <th className="py-3.5 px-4">Customer Details</th>
                      <th className="py-3.5 px-4">Pass Tier</th>
                      <th className="py-3.5 px-4">Quantity</th>
                      <th className="py-3.5 px-4">Amount</th>
                      <th className="py-3.5 px-4">Proof</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(158,190,246,0.08)] text-[#CBD8ED]">
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="py-8 text-center text-xs text-[#9BB1D3]">
                          No bookings match your current filter.
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3.5 px-4 font-mono font-medium text-white">
                            {booking.id}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-mono font-bold text-[#7AA5F2] bg-[#7AA5F2]/10 px-2 py-0.5 rounded border border-[#7AA5F2]/30">
                              {booking.ticketCode}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-white">{booking.customerName}</div>
                            <div className="text-[11px] text-[#9BB1D3]">{booking.customerEmail}</div>
                            {booking.whatsappNumber && (
                              <div className="text-[10px] text-emerald-400 font-medium">
                                WhatsApp: {booking.whatsappNumber}
                              </div>
                            )}
                            {booking.city && (
                              <div className="text-[10px] text-[#CBD8ED]/70">City: {booking.city}</div>
                            )}
                            {booking.utrNumber && (
                              <div className="text-[10px] font-mono text-[#FBBF24]">
                                UTR: {booking.utrNumber}
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-medium text-white">
                            {booking.ticketType}
                          </td>
                          <td className="py-3.5 px-4">
                            {booking.quantity} pass{booking.quantity > 1 ? 'es' : ''}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-[#FBBF24]">
                            ₹{booking.totalPrice?.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3.5 px-4">
                            {booking.receiptUrl ? (
                              <button
                                type="button"
                                onClick={() => setPreviewReceiptUrl(booking.receiptUrl)}
                                className="inline-flex items-center gap-1 rounded bg-[#7AA5F2]/15 px-2 py-1 text-[10px] font-semibold text-[#7AA5F2] hover:bg-[#7AA5F2]/25 transition-colors cursor-pointer"
                              >
                                <ImageIcon className="h-3 w-3" />
                                <span>View Proof</span>
                              </button>
                            ) : (
                              <span className="text-[10px] text-[#9BB1D3]/50">None</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <select
                              value={booking.status || 'Confirmed'}
                              onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                              className={`rounded-lg px-2 py-1 text-[10px] font-semibold border focus:outline-none cursor-pointer ${
                                booking.status === 'Confirmed'
                                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                  : booking.status === 'Cancelled'
                                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                                  : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                              }`}
                            >
                              <option value="Confirmed" className="bg-[#111B2D] text-white">Confirmed</option>
                              <option value="Pending Verification" className="bg-[#111B2D] text-white">Pending Verification</option>
                              <option value="Cancelled" className="bg-[#111B2D] text-white">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-4 text-[#9BB1D3]">
                            {new Date(booking.bookedAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Delete booking ${booking.id} (${booking.ticketCode})? This action cannot be undone.`)) {
                                  deleteBooking(booking.id);
                                }
                              }}
                              className="text-rose-400 hover:text-rose-300 p-1 rounded hover:bg-rose-500/10 transition-colors cursor-pointer"
                              title="Delete Booking"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })()}
      </div>

      {/* EDIT MODAL FOR PAYMENT CARDS */}
      {editingCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl border border-[#7AA5F2] bg-[#111B2D] p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[rgba(158,190,246,0.15)]">
              <h3 className="font-serif text-xl font-medium text-white">
                Edit Payment Card: {editingCard.title}
              </h3>
              <button
                onClick={() => setEditingCard(null)}
                className="text-[#9BB1D3] hover:text-white text-lg p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-[#CBD8ED] mb-1">
                  Card Title
                </label>
                <input
                  type="text"
                  required
                  value={editingCard.title}
                  onChange={(e) => setEditingCard({ ...editingCard, title: e.target.value })}
                  className="w-full rounded-xl border border-[rgba(158,190,246,0.2)] bg-black/40 px-3.5 py-2 text-xs text-white focus:border-[#7AA5F2] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#CBD8ED] mb-1">
                    Badge / Tier
                  </label>
                  <input
                    type="text"
                    value={editingCard.type}
                    onChange={(e) => setEditingCard({ ...editingCard, type: e.target.value })}
                    className="w-full rounded-xl border border-[rgba(158,190,246,0.2)] bg-black/40 px-3.5 py-2 text-xs text-white focus:border-[#7AA5F2] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#CBD8ED] mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={editingCard.price}
                    onChange={(e) => setEditingCard({ ...editingCard, price: e.target.value })}
                    className="w-full rounded-xl border border-[rgba(158,190,246,0.2)] bg-black/40 px-3.5 py-2 text-xs text-white focus:border-[#7AA5F2] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#CBD8ED] mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={editingCard.subtitle}
                  onChange={(e) => setEditingCard({ ...editingCard, subtitle: e.target.value })}
                  className="w-full rounded-xl border border-[rgba(158,190,246,0.2)] bg-black/40 px-3.5 py-2 text-xs text-white focus:border-[#7AA5F2] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#CBD8ED] mb-1">
                  Features (One per line)
                </label>
                <textarea
                  rows={4}
                  value={editingCard.featuresText}
                  onChange={(e) =>
                    setEditingCard({
                      ...editingCard,
                      featuresText: e.target.value,
                      features: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className="w-full rounded-xl border border-[rgba(158,190,246,0.2)] bg-black/40 p-3 text-xs text-white focus:border-[#7AA5F2] focus:outline-none font-sans"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingCard.recommended}
                    onChange={(e) =>
                      setEditingCard({ ...editingCard, recommended: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-[#7AA5F2] text-[#7AA5F2]"
                  />
                  <span>Mark as Recommended</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingCard(null)}
                  className="rounded-xl border border-white/20 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#7AA5F2] px-5 py-2 text-xs font-bold text-white hover:bg-[#578CE6] transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PAYMENT PROOF PREVIEW MODAL */}
      {previewReceiptUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative max-w-lg w-full rounded-3xl border border-[rgba(158,190,246,0.3)] bg-[#111B2D] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h4 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-[#7AA5F2]" />
                <span>Payment Proof Receipt</span>
              </h4>
              <button
                type="button"
                onClick={() => setPreviewReceiptUrl(null)}
                className="text-[#9BB1D3] hover:text-white p-1"
              >
                ✕
              </button>
            </div>
            <div className="rounded-xl overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center max-h-[70vh]">
              <img
                src={previewReceiptUrl}
                alt="Payment Proof"
                className="max-h-[68vh] w-auto object-contain"
              />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <a
                href={previewReceiptUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#7AA5F2] hover:underline"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Open Original Image</span>
              </a>
              <button
                type="button"
                onClick={() => setPreviewReceiptUrl(null)}
                className="rounded-xl bg-white/[0.08] hover:bg-white/[0.12] px-4 py-2 text-xs font-semibold text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
