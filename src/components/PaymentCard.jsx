import React from 'react';
import { Sparkles, Check, Flame, ShieldCheck } from 'lucide-react';

const themeStyles = {
  blue: {
    accent: '#7AA5F2',
    accentText: 'text-[#7AA5F2]',
    accentBg: 'bg-[#7AA5F2]',
    borderActive: 'border-[#7AA5F2]',
    ring: 'ring-[#7AA5F2]',
    shadowGlow: 'shadow-[0_0_30px_rgba(122,165,242,0.2)]',
    badgeBg: 'bg-[#7AA5F2]/15 text-[#7AA5F2]',
    gradient: 'from-[rgba(122,165,242,0.12)] to-[rgba(17,27,45,0.95)]',
  },
  purple: {
    accent: '#C084FC',
    accentText: 'text-[#C084FC]',
    accentBg: 'bg-[#C084FC]',
    borderActive: 'border-[#C084FC]',
    ring: 'ring-[#C084FC]',
    shadowGlow: 'shadow-[0_0_30px_rgba(192,132,252,0.22)]',
    badgeBg: 'bg-purple-500/15 text-purple-300',
    gradient: 'from-[rgba(192,132,252,0.14)] to-[rgba(26,16,43,0.95)]',
  },
  amber: {
    accent: '#FBBF24',
    accentText: 'text-[#FBBF24]',
    accentBg: 'bg-[#FBBF24]',
    borderActive: 'border-[#FBBF24]',
    ring: 'ring-[#FBBF24]',
    shadowGlow: 'shadow-[0_0_30px_rgba(251,191,36,0.2)]',
    badgeBg: 'bg-amber-500/15 text-amber-300',
    gradient: 'from-[rgba(251,191,36,0.12)] to-[rgba(36,25,12,0.95)]',
  },
  emerald: {
    accent: '#34D399',
    accentText: 'text-[#34D399]',
    accentBg: 'bg-[#34D399]',
    borderActive: 'border-[#34D399]',
    ring: 'ring-[#34D399]',
    shadowGlow: 'shadow-[0_0_30px_rgba(52,211,153,0.2)]',
    badgeBg: 'bg-emerald-500/15 text-emerald-300',
    gradient: 'from-[rgba(52,211,153,0.12)] to-[rgba(10,34,25,0.95)]',
  },
  rose: {
    accent: '#FB7185',
    accentText: 'text-[#FB7185]',
    accentBg: 'bg-[#FB7185]',
    borderActive: 'border-[#FB7185]',
    ring: 'ring-[#FB7185]',
    shadowGlow: 'shadow-[0_0_30px_rgba(251,113,133,0.2)]',
    badgeBg: 'bg-rose-500/15 text-rose-300',
    gradient: 'from-[rgba(251,113,133,0.12)] to-[rgba(38,15,22,0.95)]',
  },
};

export default function PaymentCard({
  card,
  isSelected = false,
  onSelect,
  showSelectButton = false,
  actionButtonText = 'Select Pass',
  adminView = false,
  onEdit,
  onDelete,
  onToggleStatus,
}) {
  const theme = themeStyles[card.colorTheme] || themeStyles.blue;
  const isPaused = card.status === 'paused';

  return (
    <div
      onClick={!adminView && onSelect ? () => onSelect(card) : undefined}
      className={`payment-card spotlight-card group relative flex flex-col justify-between rounded-3xl border p-6 transition-all duration-300 ${
        isPaused ? 'opacity-65 grayscale-[30%]' : ''
      } ${
        isSelected
          ? `${theme.borderActive} bg-gradient-to-b ${theme.gradient} ${theme.shadowGlow} ring-1 ${theme.ring} scale-[1.01] animate-pulse-glow`
          : 'border-[rgba(158,190,246,0.18)] bg-[#111B2D]/90 hover:border-[rgba(158,190,246,0.38)] hover:bg-[#152136] hover:-translate-y-1 hover:shadow-2xl'
      } ${!adminView ? 'cursor-pointer' : ''}`}
    >
      {/* Top Badges */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.2em] uppercase transition-transform group-hover:scale-105 ${theme.badgeBg}`}
          >
            {card.type || 'WORKSHOP PASS'}
          </span>

          {card.recommended && (
            <span className="animate-shimmer-sweep inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-black shadow-md shadow-amber-500/30">
              <Flame className="h-3 w-3 fill-black text-black animate-twinkle" />
              <span>Recommended</span>
            </span>
          )}

          {adminView && (
            <span
              className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                isPaused
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              {isPaused ? 'Draft / Hidden' : 'Live for Users'}
            </span>
          )}
        </div>

        {/* Selected or Status check */}
        {!adminView && (
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs transition-colors ${
              isSelected
                ? `${theme.borderActive} ${theme.accentBg} text-white font-bold`
                : 'border-[rgba(158,190,246,0.3)] bg-transparent'
            }`}
          >
            {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
          </div>
        )}
      </div>

      {/* Main Details */}
      <div className="mt-5">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-serif text-2xl sm:text-3xl font-medium text-white tracking-tight">
            {card.title}
          </h3>
          <div className="text-right">
            <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${theme.accentText}`}>
              {card.formattedPrice || `₹${card.price}`}
            </div>
            {card.originalPrice && (
              <span className="text-[11px] text-[#9BB1D3] line-through">
                ₹{card.originalPrice}
              </span>
            )}
          </div>
        </div>

        <p className="mt-1 text-xs text-[#9BB1D3] leading-relaxed">
          {card.subtitle || 'Entry for Craftella workshop experience'}
        </p>
      </div>

      {/* Features List */}
      <div className="mt-6 border-t border-[rgba(158,190,246,0.12)] pt-4">
        <span className="text-[9px] font-bold tracking-[0.2em] text-[#9BB1D3]/80 uppercase block mb-2.5">
          What is included:
        </span>
        <ul className="space-y-2 text-xs text-[#CBD8ED]">
          {card.features && card.features.length > 0 ? (
            card.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className={`mt-0.5 shrink-0 ${theme.accentText}`}>✦</span>
                <span className="leading-snug">{feature}</span>
              </li>
            ))
          ) : (
            <li className="text-[11px] text-[#9BB1D3] italic">All event materials included</li>
          )}
        </ul>
      </div>

      {/* Bottom Footer Details & Actions */}
      <div className="mt-6 pt-4 border-t border-[rgba(158,190,246,0.12)]">
        {/* Availability info */}
        <div className="flex items-center justify-between text-[11px] text-[#9BB1D3] mb-4">
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className={`h-3 w-3 ${theme.accentText}`} />
            <span>Instant Confirmation</span>
          </span>
          {card.spotsLeft && (
            <span className="font-medium text-amber-300/90">
              Only {card.spotsLeft} passes left
            </span>
          )}
        </div>

        {/* Action Button for User View */}
        {!adminView && showSelectButton && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onSelect) onSelect(card);
            }}
            className={`w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 ${
              isSelected
                ? `${theme.accentBg} text-white shadow-lg shadow-${card.colorTheme}-500/20`
                : 'border border-[rgba(158,190,246,0.25)] bg-white/[0.04] text-white hover:border-[#7AA5F2] hover:bg-[#7AA5F2]/10'
            }`}
          >
            <span>{isSelected ? 'Pass Selected' : actionButtonText}</span>
            <Check className={`h-3.5 w-3.5 ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
          </button>
        )}

        {/* Admin Quick Action Controls */}
        {adminView && (
          <div className="flex items-center justify-between gap-2 pt-2">
            <button
              type="button"
              onClick={() => onToggleStatus && onToggleStatus(card.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                isPaused
                  ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                  : 'bg-white/[0.06] text-[#CBD8ED] hover:bg-white/[0.12]'
              }`}
            >
              {isPaused ? 'Publish Live' : 'Hide from Users'}
            </button>

            <div className="flex items-center gap-2">
              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(card)}
                  className="rounded-lg border border-[rgba(158,190,246,0.25)] bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white hover:border-[#7AA5F2] hover:bg-[#7AA5F2]/15 transition-colors"
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(card.id)}
                  className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
