import React, { useEffect } from 'react';
import { eventData } from '../data/eventData';
import { usePaymentCards } from '../context/PaymentCardContext';
import EventInfoCard from '../components/EventInfoCard';
import VenueCard from '../components/VenueCard';
import PreparationSteps from '../components/PreparationSteps';
import BookingCTA from '../components/BookingCTA';

export default function Location() {
  const { hero, overviewCards } = eventData;
  const { locationConfig } = usePaymentCards();
  const venue = locationConfig || eventData.venue;

  const liveOverviewCards = overviewCards.map((card) => {
    if (card.id === 'date') {
      return {
        ...card,
        value: venue.eventDate || card.value,
      };
    }
    if (card.id === 'time') {
      return {
        ...card,
        value: venue.eventTime || card.value,
      };
    }
    if (card.id === 'venue') {
      return {
        ...card,
        value: venue.venueName || venue.name || card.value,
        description: venue.address
          ? `${venue.address.split(',')[0]} • Tap for Directions`
          : card.description,
        href: venue.googleMapsUrl || eventData.venue.googleMapsUrl,
      };
    }
    return card;
  });

  useEffect(() => {
    document.title = `${venue.venueName || 'Location'} | Craftella`;
  }, [venue.venueName]);

  return (
    <div className="min-h-[75vh] overflow-hidden">
      {/* HERO SECTION */}
      <section
        className="relative px-6 py-20 sm:px-8 sm:py-24 md:py-28 text-center"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(87, 140, 230, 0.28), transparent 65%), linear-gradient(180deg, #131E33, #090E17)',
        }}
        aria-label="Location page hero"
      >
        <div className="mx-auto max-w-4xl">
          {/* Main Heading */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-[80px] font-medium leading-[1.08] tracking-[-0.03em] text-white">
            {hero.headingLine1}{' '}
            <span className="block font-serif italic text-[#7AA5F2]">
              {hero.headingLine2}
            </span>
          </h1>

          {/* Introduction paragraph */}
          <p className="mx-auto mt-6 max-w-[570px] text-sm leading-[1.9] text-[#9BB1D3]">
            {hero.description}
          </p>
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <div className="mx-auto w-[88%] max-w-[1120px] pb-24 pt-4 sm:pb-28">
        {/* EVENT OVERVIEW CARDS */}
        <section
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          aria-label="Event key details"
        >
          {liveOverviewCards.map((card) => (
            <EventInfoCard
              key={card.id}
              label={card.label}
              value={card.value}
              description={card.description}
              icon={card.icon}
              href={card.href}
            />
          ))}
        </section>

        {/* VENUE & DIRECTIONS SECTION */}
        <VenueCard />

        {/* ARRIVAL & PREPARATION SECTION */}
        <PreparationSteps />

        {/* BOOKING CALL TO ACTION */}
        <BookingCTA />
      </div>
    </div>
  );
}
