import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  Sparkles,
  MapPin,
  ShieldCheck,
  ArrowRight,
  Lock,
  Copy,
  Upload,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';
import { usePaymentCards } from '../context/PaymentCardContext';

export default function BookTickets() {
  const { activeCards, addBooking, paymentConfig, uploadAsset, locationConfig } = usePaymentCards();

  const [selectedTicketId, setSelectedTicketId] = useState(
    activeCards[0]?.id || 'single'
  );
  const [quantity, setQuantity] = useState(1);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [city, setCity] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Dynamic Payment Settings configured by Admin
  const activeUpiId = paymentConfig?.upiId || '9701451646@ybl';
  const customQrImage = paymentConfig?.qrImageUrl;
  const paymentInstructions =
    paymentConfig?.instructions ||
    'Scan this QR code with PhonePe, Google Pay or another UPI app.';

  // Payment Step State (Image 1)
  const [paymentStep, setPaymentStep] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [confirmPaymentCompleted, setConfirmPaymentCompleted] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  // Keep selectedTicketId valid if cards change
  useEffect(() => {
    if (activeCards.length > 0 && !activeCards.some((c) => c.id === selectedTicketId)) {
      setSelectedTicketId(activeCards[0].id);
    }
  }, [activeCards, selectedTicketId]);

  useEffect(() => {
    document.title = 'Book Tickets | Craftella';
  }, []);

  const selectedTicket = activeCards.find((t) => t.id === selectedTicketId) || activeCards[0] || {
    id: 'pass',
    title: 'Workshop Pass',
    price: 499,
    formattedPrice: '₹499',
    type: 'PASS',
  };

  const totalPrice = (selectedTicket.price || 499) * quantity;

  // Step 1: User fills info & proceeds to payment screen
  const handleProceedToPayment = (e) => {
    e.preventDefault();
    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    if (cleanNumber.length !== 10) {
      alert('Please enter a valid 10-digit WhatsApp number.');
      return;
    }
    if (!agreeTerms) {
      alert('Please agree to the workshop booking terms.');
      return;
    }
    setPaymentStep(true);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Step 2: Handle Screenshot Upload
  const handleScreenshotChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshotFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Copy UPI ID to clipboard
  const handleCopyUpi = () => {
    navigator.clipboard.writeText(activeUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  // Step 3: Complete Booking & Verify Payment (transitions to Image 2)
  const handleConfirmUpiPayment = async (e) => {
    e.preventDefault();
    if (!utrNumber.trim()) {
      alert('Please enter your UTR / Transaction ID.');
      return;
    }
    if (!confirmPaymentCompleted) {
      alert('Please check the confirmation box indicating you have completed the payment.');
      return;
    }

    setIsSubmittingPayment(true);

    let receiptUrl = '';
    if (screenshotFile) {
      try {
        const uploadRes = await uploadAsset(screenshotFile, 'receipts');
        if (uploadRes?.publicUrl) {
          receiptUrl = uploadRes.publicUrl;
        }
      } catch (err) {
        console.warn('Receipt upload exception:', err);
      }
    }

    // Generate 6-character booking code as mentioned in Step 01
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const bookingPayload = {
      ticketCode: code,
      ticketType: selectedTicket.title,
      cardId: selectedTicket.id,
      quantity,
      unitPrice: selectedTicket.price,
      totalPrice,
      date: locationConfig?.eventDate || 'Sunday, 18 October 2026',
      time: locationConfig?.eventTime || '2:00 PM – 5:00 PM',
      venue: locationConfig?.venueName || '55 Bistro',
      customerName: customerName || 'Valued Guest',
      customerEmail: customerEmail || 'guest@example.com',
      whatsappNumber,
      city,
      utrNumber,
      receiptUrl,
      paymentMethod: `UPI (${activeUpiId})`,
      status: 'Confirmed',
    };

    // Save to shared context, Supabase, and localStorage
    await addBooking(bookingPayload);

    setConfirmedBooking({
      ...bookingPayload,
      name: customerName || 'Valued Guest',
    });
    setIsSubmittingPayment(false);
    setPaymentStep(false);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleBookAnother = () => {
    setConfirmedBooking(null);
    setPaymentStep(false);
    setUtrNumber('');
    setScreenshotFile(null);
    setScreenshotPreview(null);
    setConfirmPaymentCompleted(false);
  };

  return (
    <div className="min-h-screen pb-24">
      {/* INTRO HERO */}
      <section className="relative px-6 py-16 sm:px-8 sm:py-20 text-center overflow-hidden">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-serif text-4xl sm:text-6xl font-medium tracking-tight text-white leading-tight">
            Choose your <br />
            <span className="italic text-[#7AA5F2]">pass.</span>
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-[#9BB1D3]">
            Select the pass that works for you. Passes are synced in real-time from our curator and admin desk.
          </p>
        </div>
      </section>

      {/* MAIN BOOKING CONTENT */}
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        {paymentStep && !confirmedBooking ? (
          /* STEP 2: THE 2-COLUMN UPI PAYMENT CARD (IMAGE 1) */
          <div className="mx-auto max-w-4xl animate-in zoom-in-95 duration-300">
            <button
              type="button"
              onClick={() => setPaymentStep(false)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#9BB1D3] hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>← Back to Reservation Details</span>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {/* LEFT CARD: PAY VIA UPI */}
              <div className="flex flex-col justify-between rounded-3xl border border-[rgba(244,63,94,0.22)] bg-gradient-to-b from-[#180E18] to-[#110811] p-6 sm:p-7 shadow-2xl relative">
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

                  {/* Amount to pay */}
                  <div className="mt-6 text-center">
                    <div className="text-[10px] font-bold tracking-[0.25em] text-[#9BB1D3] uppercase">
                      AMOUNT TO PAY
                    </div>
                    <div className="mt-1 text-4xl sm:text-5xl font-extrabold text-[#F43F5E] tracking-tight">
                      ₹{totalPrice}
                    </div>
                  </div>

                  {/* QR Code Container */}
                  <div className="mt-6 flex flex-col items-center">
                    <div className="relative rounded-2xl bg-white p-4 shadow-xl border-2 border-white/90">
                      {customQrImage ? (
                        <img
                          src={customQrImage}
                          alt="UPI Payment QR Code"
                          className="h-44 w-44 object-contain rounded-xl"
                        />
                      ) : (
                        <>
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi%3A%2F%2Fpay%3Fpa%3D${encodeURIComponent(activeUpiId)}%26pn%3D${encodeURIComponent(paymentConfig?.payeeName || 'Craftella')}%26am%3D${totalPrice}%26cu%3DINR`}
                            alt="UPI Payment QR Code"
                            className="h-44 w-44 object-contain"
                          />
                          {/* Centered PhonePe Badge */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#5f259f] border-2 border-white shadow-md">
                              <span className="text-white font-black text-sm tracking-tighter">पे</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    <p className="mt-4 text-center text-xs text-[#9BB1D3] max-w-xs leading-relaxed">
                      {paymentInstructions}
                    </p>
                  </div>
                </div>

                {/* Bottom UPI ID Box */}
                <div className="mt-6 rounded-2xl border border-[rgba(244,63,94,0.2)] bg-black/40 p-3.5 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[9px] font-bold tracking-[0.2em] text-[#9BB1D3] uppercase block">
                      UPI ID
                    </span>
                    <span className="font-mono text-sm font-bold text-white tracking-wide">
                      {activeUpiId}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/[0.06] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/[0.12] transition-colors"
                  >
                    {copiedUpi ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-300">COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>COPY</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Direct Payment Link / URL (if configured) */}
                {paymentConfig?.paymentUrl && (
                  <div className="mt-3">
                    <a
                      href={paymentConfig.paymentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 rounded-2xl border border-[rgba(244,63,94,0.3)] bg-gradient-to-r from-[#F43F5E]/15 to-[#FB7185]/10 p-3 text-xs font-bold text-white hover:border-[#F43F5E] hover:from-[#F43F5E]/25 hover:to-[#FB7185]/20 transition-all shadow-md group"
                    >
                      <ExternalLink className="h-3.5 w-3.5 text-[#F43F5E] group-hover:scale-110 transition-transform" />
                      <span>Open Payment App / UPI Link Directly</span>
                    </a>
                  </div>
                )}
              </div>

              {/* RIGHT CARD: YOUR BOOKING */}
              <div className="flex flex-col justify-between rounded-3xl border border-[rgba(244,63,94,0.22)] bg-gradient-to-b from-[#180E18] to-[#110811] p-6 sm:p-7 shadow-2xl relative">
                <form onSubmit={handleConfirmUpiPayment} className="flex flex-col h-full justify-between space-y-5">
                  <div>
                    {/* Header */}
                    <div className="text-[11px] font-bold tracking-[0.2em] text-[#F43F5E] uppercase mb-4">
                      YOUR BOOKING
                    </div>

                    {/* Booking Title & Price */}
                    <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
                      <div>
                        <h3 className="font-serif text-2xl font-medium text-white">
                          {selectedTicket.title} Entry
                        </h3>
                        <p className="text-xs text-[#9BB1D3] mt-0.5">
                          {quantity} {quantity > 1 ? 'persons' : 'person'}
                        </p>
                      </div>
                      <div className="text-2xl font-extrabold text-[#F43F5E]">
                        ₹{totalPrice}
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4 mt-5">
                      {/* UTR / Transaction ID */}
                      <div>
                        <label className="block text-xs font-semibold text-[#CBD8ED] mb-1">
                          UTR / Transaction ID *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Enter your transaction ID"
                          value={utrNumber}
                          onChange={(e) => setUtrNumber(e.target.value)}
                          className="w-full rounded-xl border border-[rgba(158,190,246,0.2)] bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-[#9BB1D3]/50 focus:border-[#F43F5E] focus:outline-none focus:ring-1 focus:ring-[#F43F5E] transition-colors font-mono"
                        />
                        <p className="mt-1 text-[11px] text-[#9BB1D3]/80">
                          You can find this in your UPI payment transaction details.
                        </p>
                      </div>

                      {/* Payment Screenshot Upload */}
                      <div>
                        <label className="block text-xs font-semibold text-[#CBD8ED] mb-1.5">
                          Payment Screenshot *
                        </label>
                        <label className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[rgba(244,63,94,0.3)] bg-black/30 p-5 cursor-pointer hover:border-[#F43F5E] hover:bg-black/50 transition-all text-center relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleScreenshotChange}
                            className="hidden"
                          />
                          {screenshotPreview ? (
                            <div className="flex items-center gap-3 w-full">
                              <img
                                src={screenshotPreview}
                                alt="Payment Preview"
                                className="h-14 w-14 object-cover rounded-xl border border-white/20"
                              />
                              <div className="text-left flex-1 truncate">
                                <span className="text-xs font-medium text-white truncate block">
                                  {screenshotFile?.name || 'screenshot.png'}
                                </span>
                                <span className="text-[10px] text-emerald-400">
                                  Screenshot uploaded successfully
                                </span>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F43F5E]/15 text-[#F43F5E] mb-2 group-hover:scale-105 transition-transform">
                                <Upload className="h-5 w-5" />
                              </div>
                              <span className="text-xs font-semibold text-white">
                                Upload payment screenshot
                              </span>
                              <span className="text-[10px] text-[#9BB1D3] mt-0.5">
                                PNG, JPG or JPEG • Max 5MB
                              </span>
                            </>
                          )}
                        </label>
                      </div>

                      {/* Checkbox */}
                      <div className="pt-2">
                        <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#CBD8ED]">
                          <input
                            type="checkbox"
                            required
                            checked={confirmPaymentCompleted}
                            onChange={(e) => setConfirmPaymentCompleted(e.target.checked)}
                            className="mt-0.5 h-4 w-4 rounded border-[rgba(158,190,246,0.3)] bg-black/40 text-[#F43F5E] focus:ring-[#F43F5E]"
                          />
                          <span className="text-[11px] text-[#CBD8ED] leading-tight select-none">
                            I have completed the payment of the amount shown above.
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmittingPayment}
                      className="w-full rounded-xl bg-gradient-to-r from-[#e11d48] to-[#f43f5e] py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(244,63,94,0.35)] hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmittingPayment ? (
                        <>
                          <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          <span>Submitting Booking to Database...</span>
                        </>
                      ) : (
                        <>
                          <span>Complete Booking &amp; Verify Payment</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : confirmedBooking ? (
          /* STEP 3: BOOKING CONFIRMATION MODAL / CARD (IMAGE 2) */
          <div className="mx-auto max-w-xl rounded-3xl border border-[#7AA5F2] bg-gradient-to-br from-[#16233B] to-[#0A101C] p-8 sm:p-10 text-center shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#7AA5F2] text-[#070D1A]">
              <Sparkles className="h-8 w-8" />
            </div>

            <div className="mt-6 inline-block rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
              Booking Confirmed
            </div>

            <h2 className="mt-3 font-serif text-3xl font-medium text-white">
              You're Going to Craftella!
            </h2>
            <p className="mt-2 text-xs text-[#9BB1D3]">
              Thank you {confirmedBooking.name}. Please keep your 6-character ticket code ready for entry at {confirmedBooking.venue || locationConfig?.venueName || '55 Bistro'}.
            </p>

            {/* Ticket Code Box */}
            <div className="mt-6 rounded-2xl border border-[rgba(158,190,246,0.3)] bg-black/40 p-5">
              <span className="text-[10px] font-bold tracking-[0.25em] text-[#9BB1D3] uppercase">YOUR TICKET CODE</span>
              <div className="mt-1 font-mono text-3xl font-extrabold tracking-widest text-[#7AA5F2]">
                {confirmedBooking.ticketCode}
              </div>
              <p className="mt-1.5 text-[11px] text-[#9BB1D3]">
                Save this code or screenshot this confirmation screen
              </p>
            </div>

            {/* Event Summary */}
            <div className="mt-6 space-y-2 text-left rounded-xl bg-white/[0.02] p-4 text-xs text-[#CBD8ED]">
              <div className="flex justify-between">
                <span className="text-[#9BB1D3]">Pass:</span>
                <span className="font-semibold text-white">{confirmedBooking.ticketType} (Qty: {confirmedBooking.quantity})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9BB1D3]">Date & Time:</span>
                <span className="font-semibold text-white">{confirmedBooking.date} • {confirmedBooking.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9BB1D3]">Venue:</span>
                <span className="font-semibold text-white">{confirmedBooking.venue}</span>
              </div>
              {confirmedBooking.whatsappNumber && (
                <div className="flex justify-between">
                  <span className="text-[#9BB1D3]">WhatsApp:</span>
                  <span className="font-semibold text-white">{confirmedBooking.whatsappNumber}</span>
                </div>
              )}
              {confirmedBooking.city && (
                <div className="flex justify-between">
                  <span className="text-[#9BB1D3]">City:</span>
                  <span className="font-semibold text-white">{confirmedBooking.city}</span>
                </div>
              )}
              {confirmedBooking.utrNumber && (
                <div className="flex justify-between">
                  <span className="text-[#9BB1D3]">UTR / Txn ID:</span>
                  <span className="font-mono font-semibold text-emerald-400">{confirmedBooking.utrNumber}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-white/10 pt-2 font-bold text-white">
                <span>Total Paid:</span>
                <span className="text-[#7AA5F2]">₹{confirmedBooking.totalPrice}</span>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/location"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#7AA5F2] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#070D1A] hover:bg-[#578CE6] transition-all"
              >
                <MapPin className="h-4 w-4" />
                <span>View Venue &amp; Directions</span>
              </Link>
              <button
                type="button"
                onClick={handleBookAnother}
                className="inline-flex items-center justify-center rounded-lg border border-white/20 px-6 py-3 text-xs font-semibold text-white hover:bg-white/10 transition-all"
              >
                Book Another Pass
              </button>
            </div>
          </div>
        ) : (
          /* STEP 1: TICKET SELECTION & GUEST INFORMATION FORM */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Ticket Cards Selection */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[10px] font-bold tracking-[0.2em] text-[#9BB1D3] uppercase">
                  1. SELECT PAYMENT CARD / TIER ({activeCards.length} Available)
                </div>
                <Link to="/admin" className="text-[10px] text-[#7AA5F2] hover:underline">
                  + Admin: Create New Card
                </Link>
              </div>

              {activeCards.length === 0 ? (
                <div className="rounded-2xl border border-[rgba(158,190,246,0.2)] bg-[#111B2D] p-8 text-center text-xs text-[#9BB1D3]">
                  No payment cards currently active. Please visit <Link to="/admin" className="text-[#7AA5F2] underline">Admin Dashboard</Link> to create or publish passes.
                </div>
              ) : (
                activeCards.map((ticket) => {
                  const isSelected = selectedTicketId === ticket.id;
                  return (
                    <div
                      key={ticket.id}
                      onClick={() => setSelectedTicketId(ticket.id)}
                      className={`cursor-pointer rounded-2xl border p-5 sm:p-6 transition-all duration-200 relative ${
                        isSelected
                          ? 'border-[#7AA5F2] bg-gradient-to-r from-[rgba(122,165,242,0.15)] to-[rgba(17,27,45,0.95)] shadow-[0_0_25px_rgba(122,165,242,0.18)] ring-1 ring-[#7AA5F2]'
                          : 'border-[rgba(158,190,246,0.2)] bg-[#111B2D] hover:border-[rgba(158,190,246,0.38)] hover:bg-[#152136]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold tracking-[0.2em] text-[#7AA5F2] uppercase">
                            {ticket.type}
                          </span>
                          {ticket.recommended && (
                            <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[9px] font-bold text-amber-300 uppercase tracking-widest">
                              Recommended
                            </span>
                          )}
                        </div>
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs ${
                            isSelected
                              ? 'border-[#7AA5F2] bg-[#7AA5F2] text-[#070D1A] font-bold'
                              : 'border-[rgba(158,190,246,0.3)] bg-transparent'
                          }`}
                        >
                          {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                        </div>
                      </div>

                      <div className="mt-3 flex items-baseline justify-between">
                        <div>
                          <h3 className="font-serif text-2xl font-medium text-white">{ticket.title}</h3>
                          <p className="text-xs text-[#9BB1D3] mt-0.5">{ticket.subtitle}</p>
                        </div>
                        <div className="text-2xl font-bold text-[#7AA5F2]">{ticket.formattedPrice || `₹${ticket.price}`}</div>
                      </div>

                      <ul className="mt-4 space-y-1.5 border-t border-[rgba(158,190,246,0.12)] pt-3 text-xs text-[#9BB1D3]">
                        {ticket.features && ticket.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="text-[#7AA5F2]">✦</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })
              )}
            </div>

            {/* Right: Quantity & Guest Information (Card 1) */}
            <div className="lg:col-span-5">
              <div className="sticky top-28 rounded-2xl border border-[rgba(244,63,94,0.25)] bg-[#111B2D] p-6 sm:p-7 shadow-xl">
                <div className="border-b border-white/10 pb-3 mb-5">
                  <div className="text-[11px] font-bold tracking-[0.2em] text-[#F43F5E] uppercase">
                    YOUR INFORMATION
                  </div>
                  <p className="text-xs text-[#9BB1D3] mt-1">
                    All fields marked with * are required.
                  </p>
                </div>

                <form onSubmit={handleProceedToPayment} className="space-y-4">
                  {/* Quantity */}
                  <div>
                    <label className="block text-xs font-semibold text-[#CBD8ED] mb-1.5">
                      Quantity of Passes
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-[rgba(158,190,246,0.25)] bg-white/[0.04] text-white hover:bg-[#7AA5F2]/20 transition-colors"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center font-mono text-lg font-bold text-white">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.min(10, quantity + 1))}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-[rgba(158,190,246,0.25)] bg-white/[0.04] text-white hover:bg-[#7AA5F2]/20 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Full Name * */}
                  <div>
                    <label className="block text-xs font-semibold text-[#CBD8ED] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full rounded-lg border border-[rgba(158,190,246,0.2)] bg-black/35 px-3.5 py-2.5 text-xs text-white placeholder-[#9BB1D3]/50 focus:border-[#F43F5E] focus:outline-none focus:ring-1 focus:ring-[#F43F5E] transition-colors"
                    />
                  </div>

                  {/* WhatsApp Number * */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-[#CBD8ED]">
                        WhatsApp Number *
                      </label>
                      <span className="text-[10px] text-[#9BB1D3]">
                        {whatsappNumber.length}/10 digits
                      </span>
                    </div>
                    <input
                      type="tel"
                      required
                      inputMode="numeric"
                      pattern="[0-9]{10}"
                      maxLength={10}
                      placeholder="Enter 10-digit WhatsApp number"
                      value={whatsappNumber}
                      onChange={(e) => {
                        const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setWhatsappNumber(digitsOnly);
                      }}
                      className="w-full rounded-lg border border-[rgba(158,190,246,0.2)] bg-black/35 px-3.5 py-2.5 text-xs text-white placeholder-[#9BB1D3]/50 focus:border-[#F43F5E] focus:outline-none focus:ring-1 focus:ring-[#F43F5E] transition-colors font-mono tracking-wider"
                    />
                    <p className="mt-1 text-[11px] text-[#9BB1D3]/80">
                      Your ticket will be sent to this WhatsApp number.
                    </p>
                  </div>

                  {/* Email Address * */}
                  <div>
                    <label className="block text-xs font-semibold text-[#CBD8ED] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full rounded-lg border border-[rgba(158,190,246,0.2)] bg-black/35 px-3.5 py-2.5 text-xs text-white placeholder-[#9BB1D3]/50 focus:border-[#F43F5E] focus:outline-none focus:ring-1 focus:ring-[#F43F5E] transition-colors"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-xs font-semibold text-[#CBD8ED] mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full rounded-lg border border-[rgba(158,190,246,0.2)] bg-black/35 px-3.5 py-2.5 text-xs text-white placeholder-[#9BB1D3]/50 focus:border-[#F43F5E] focus:outline-none focus:ring-1 focus:ring-[#F43F5E] transition-colors"
                    />
                  </div>

                  {/* Terms Checkbox */}
                  <div className="pt-1">
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#CBD8ED]">
                      <input
                        type="checkbox"
                        required
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-[rgba(158,190,246,0.3)] bg-black/40 text-[#F43F5E] focus:ring-[#F43F5E]"
                      />
                      <span className="text-[11px] text-[#CBD8ED] leading-tight select-none">
                        I confirm that the information provided is correct and I agree to the workshop booking terms.
                      </span>
                    </label>
                  </div>

                  {/* Summary */}
                  <div className="rounded-xl border border-[rgba(158,190,246,0.15)] bg-white/[0.02] p-4 text-xs space-y-2 mt-2">
                    <div className="flex justify-between text-[#CBD8ED]">
                      <span>Selected Pass:</span>
                      <span className="font-semibold text-white">{selectedTicket.title}</span>
                    </div>
                    <div className="flex justify-between text-[#CBD8ED]">
                      <span>Price per pass:</span>
                      <span>₹{selectedTicket.price}</span>
                    </div>
                    <div className="flex justify-between border-t border-white/10 pt-2 font-bold text-white text-sm">
                      <span>Total Amount:</span>
                      <span className="text-[#7AA5F2]">₹{totalPrice.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-gradient-to-r from-[#e11d48] to-[#f43f5e] py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(244,63,94,0.35)] hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                  >
                    <span>Continue to Payment</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
