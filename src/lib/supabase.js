import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('your-project-id')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

// ==============================================================================
// STORAGE HELPERS
// ==============================================================================
export async function uploadAssetToStorage(file, folder = 'uploads') {
  if (!isSupabaseConfigured || !supabase) {
    return { error: new Error('Supabase not configured') };
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('craftella-assets')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.error('Supabase storage upload error:', error);
      return { error };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('craftella-assets').getPublicUrl(data.path);

    return { publicUrl, path: data.path };
  } catch (err) {
    console.error('Storage upload exception:', err);
    return { error: err };
  }
}

// ==============================================================================
// PAYMENT CARDS API
// ==============================================================================
export async function dbFetchPaymentCards() {
  if (!isSupabaseConfigured || !supabase) return { data: null, error: 'Not configured' };
  try {
    const { data, error } = await supabase
      .from('payment_cards')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) return { data: null, error };
    // Map snake_case DB columns to camelCase expected by components
    const mapped = data.map((row) => ({
      id: row.id,
      title: row.title,
      type: row.type,
      subtitle: row.subtitle,
      price: Number(row.price),
      originalPrice: row.original_price ? Number(row.original_price) : undefined,
      formattedPrice: row.formatted_price || `₹${Number(row.price).toLocaleString('en-IN')}`,
      category: row.category,
      colorTheme: row.color_theme,
      status: row.status,
      spotsLeft: row.spots_left,
      features: Array.isArray(row.features) ? row.features : [],
      recommended: Boolean(row.recommended),
      createdAt: row.created_at,
    }));
    return { data: mapped, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function dbUpsertPaymentCard(card) {
  if (!isSupabaseConfigured || !supabase) return { data: null, error: 'Not configured' };
  try {
    const payload = {
      id: card.id,
      title: card.title,
      type: card.type || 'PASS',
      subtitle: card.subtitle || '',
      price: Number(card.price) || 0,
      original_price: card.originalPrice ? Number(card.originalPrice) : null,
      formatted_price: card.formattedPrice || `₹${Number(card.price).toLocaleString('en-IN')}`,
      category: card.category || 'Individual',
      color_theme: card.colorTheme || 'blue',
      status: card.status || 'active',
      spots_left: Number(card.spotsLeft) || 25,
      features: Array.isArray(card.features) ? card.features : [],
      recommended: Boolean(card.recommended),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('payment_cards')
      .upsert(payload)
      .select()
      .single();

    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function dbDeletePaymentCard(id) {
  if (!isSupabaseConfigured || !supabase) return { error: 'Not configured' };
  try {
    const { error } = await supabase.from('payment_cards').delete().eq('id', id);
    return { error };
  } catch (err) {
    return { error: err };
  }
}

// ==============================================================================
// BOOKINGS API
// ==============================================================================
export async function dbFetchBookings() {
  if (!isSupabaseConfigured || !supabase) return { data: null, error: 'Not configured' };
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('booked_at', { ascending: false });

    if (error) return { data: null, error };
    const mapped = data.map((b) => ({
      id: b.id,
      ticketCode: b.ticket_code,
      ticketType: b.ticket_type,
      cardId: b.card_id,
      quantity: b.quantity,
      unitPrice: Number(b.unit_price),
      totalPrice: Number(b.total_price),
      customerName: b.customer_name,
      customerEmail: b.customer_email,
      whatsappNumber: b.whatsapp_number,
      city: b.city,
      paymentMethod: b.payment_method,
      utrNumber: b.utr_number,
      receiptUrl: b.receipt_url,
      status: b.status,
      eventDate: b.event_date,
      venue: b.venue,
      bookedAt: b.booked_at,
    }));
    return { data: mapped, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function dbInsertBooking(booking) {
  if (!isSupabaseConfigured || !supabase) return { data: null, error: 'Not configured' };
  try {
    const payload = {
      id: booking.id,
      ticket_code: booking.ticketCode,
      ticket_type: booking.ticketType,
      card_id: booking.cardId || null,
      quantity: Number(booking.quantity) || 1,
      unit_price: Number(booking.unitPrice) || 0,
      total_price: Number(booking.totalPrice) || 0,
      customer_name: booking.customerName,
      customer_email: booking.customerEmail,
      whatsapp_number: booking.whatsappNumber,
      city: booking.city || '',
      payment_method: booking.paymentMethod || 'UPI',
      utr_number: booking.utrNumber || '',
      receipt_url: booking.receiptUrl || '',
      status: booking.status || 'Confirmed',
      event_date: booking.eventDate || 'Sunday, 18 October 2026',
      event_time: booking.eventTime || '2:00 PM – 5:00 PM',
      venue: booking.venue || '55 Bistro',
      booked_at: booking.bookedAt || new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('bookings')
      .insert(payload)
      .select()
      .single();

    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function dbUpdateBookingStatus(id, status) {
  if (!isSupabaseConfigured || !supabase) return { error: 'Not configured' };
  try {
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id);
    return { error };
  } catch (err) {
    return { error: err };
  }
}

export async function dbDeleteBooking(id) {
  if (!isSupabaseConfigured || !supabase) return { error: 'Not configured' };
  try {
    const { error } = await supabase.from('bookings').delete().eq('id', id);
    return { error };
  } catch (err) {
    return { error: err };
  }
}

// ==============================================================================
// PAYMENT CONFIG API
// ==============================================================================
export async function dbFetchPaymentConfig() {
  if (!isSupabaseConfigured || !supabase) return { data: null, error: 'Not configured' };
  try {
    const { data, error } = await supabase
      .from('payment_config')
      .select('*')
      .eq('id', 'primary')
      .maybeSingle();

    if (error || !data) return { data: null, error };
    return {
      data: {
        upiId: data.upi_id,
        payeeName: data.payee_name,
        qrImageUrl: data.qr_image_url || '',
        paymentUrl: data.payment_url || '',
        instructions: data.instructions,
        updatedAt: data.updated_at,
      },
      error: null,
    };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function dbSavePaymentConfig(config) {
  if (!isSupabaseConfigured || !supabase) return { error: 'Not configured' };
  try {
    const payload = {
      id: 'primary',
      upi_id: config.upiId,
      payee_name: config.payeeName,
      qr_image_url: config.qrImageUrl || '',
      payment_url: config.paymentUrl || '',
      instructions: config.instructions,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase
      .from('payment_config')
      .upsert(payload);
    return { error };
  } catch (err) {
    return { error: err };
  }
}

// ==============================================================================
// LOCATION CONFIG API
// ==============================================================================
export async function dbFetchLocationConfig() {
  if (!isSupabaseConfigured || !supabase) return { data: null, error: 'Not configured' };
  try {
    const { data, error } = await supabase
      .from('location_config')
      .select('*')
      .eq('id', 'primary')
      .maybeSingle();

    if (error || !data) return { data: null, error };
    return {
      data: {
        venueName: data.venue_name,
        heading: data.heading,
        kicker: data.kicker,
        description: data.description,
        address: data.address,
        status: data.status,
        eventDate: data.event_date,
        eventTime: data.event_time,
        infoText: data.info_text,
        googleMapsUrl: data.google_maps_url,
        buttonText: data.button_text,
        note: data.note,
        updatedAt: data.updated_at,
      },
      error: null,
    };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function dbSaveLocationConfig(config) {
  if (!isSupabaseConfigured || !supabase) return { error: 'Not configured' };
  try {
    const payload = {
      id: 'primary',
      venue_name: config.venueName,
      heading: config.heading,
      kicker: config.kicker,
      description: config.description,
      address: config.address,
      status: config.status,
      event_date: config.eventDate,
      event_time: config.eventTime,
      info_text: config.infoText,
      google_maps_url: config.googleMapsUrl,
      button_text: config.buttonText,
      note: config.note,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase
      .from('location_config')
      .upsert(payload);
    return { error };
  } catch (err) {
    return { error: err };
  }
}
