import React from 'react';
import { Ticket, Map, CalendarClock } from 'lucide-react';
import { eventData } from '../data/eventData';
import { usePaymentCards } from '../context/PaymentCardContext';

const stepIcons = [Ticket, Map, CalendarClock];

export default function PreparationSteps() {
  const { preparation } = eventData;
  const { locationConfig } = usePaymentCards();
  const eventTime = locationConfig?.eventTime || '2:00 PM – 5:00 PM';
  const eventDate = locationConfig?.eventDate || '18 October 2026';

  return (
    <section className="mt-16 sm:mt-20" aria-labelledby="prep-heading">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 items-start">
        {/* Left Column: Heading and Intro */}
        <div className="lg:col-span-5">
          <div className="mb-3 text-[10px] font-bold tracking-[0.3em] text-[#7AA5F2] uppercase">
            {preparation.kicker}
          </div>

          <h2
            id="prep-heading"
            className="font-serif text-3xl font-medium sm:text-4xl leading-tight text-white"
          >
            {preparation.heading}
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-[#9BB1D3]">
            {preparation.intro}
          </p>
        </div>

        {/* Right Column: Numbered Steps */}
        <div className="flex flex-col gap-3.5 lg:col-span-7">
          {preparation.steps.map((step, index) => {
            const Icon = stepIcons[index] || Ticket;
            return (
              <article
                key={step.number}
                className="group flex items-start gap-4 rounded-[15px] border border-[rgba(158,190,246,0.18)] bg-white/[0.02] p-5 transition-all duration-300 hover:border-[rgba(158,190,246,0.42)] hover:bg-white/[0.04] hover:translate-x-1"
              >
                {/* Step Number Badge */}
                <div
                  className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[11px] bg-[rgba(122,165,242,0.12)] text-xs font-bold text-[#7AA5F2] transition-colors group-hover:bg-[#7AA5F2] group-hover:text-[#070D1A]"
                  aria-label={`Step ${step.number}`}
                >
                  {step.number}
                </div>

                {/* Step Details */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-white group-hover:text-[#7AA5F2] transition-colors">
                      {step.title}
                    </h3>
                    <Icon className="h-3.5 w-3.5 text-[#7AA5F2]/50 group-hover:text-[#7AA5F2] transition-colors" />
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-[#9BB1D3]">
                    {step.number === 3
                      ? `The event is scheduled for ${eventTime} on ${eventDate}. Arrive 10–15 minutes early to grab your preferred seating and welcome beverage.`
                      : step.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
