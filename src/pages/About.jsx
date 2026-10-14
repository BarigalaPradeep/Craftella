import React, { useEffect } from 'react';
import { Sparkles, Heart, Palette, Users } from 'lucide-react';
import BookingCTA from '../components/BookingCTA';

export default function About() {
  useEffect(() => {
    document.title = 'About Us | Craftella';
  }, []);

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative px-6 py-20 sm:px-8 sm:py-24 text-center overflow-hidden">
        <div className="mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(158,190,246,0.25)] bg-[rgba(122,165,242,0.08)] px-4 py-2 text-[10px] font-bold tracking-[0.25em] text-[#7AA5F2] uppercase">
            <Sparkles className="w-3 h-3 text-[#578CE6]" />
            <span>CRAFTELLA</span>
          </div>

          <h1 className="mt-6 font-serif text-4xl sm:text-6xl md:text-7xl font-medium tracking-tight text-white leading-tight">
            Creativity <br />
            <span className="italic text-[#7AA5F2]">with a little sparkle.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm sm:text-base leading-relaxed text-[#9BB1D3]">
            Craftella is a creative art experience designed to bring people together, slow down, and create something beautiful with their own hands.
          </p>
        </div>
      </section>

      {/* STORY SECTION */}
      <section className="border-t border-[rgba(158,190,246,0.15)] bg-gradient-to-b from-[#111B2D] to-[#090E17] py-16 sm:py-24 px-6 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
            <div className="md:col-span-4">
              <span className="text-xs font-bold tracking-[0.25em] text-[#7AA5F2] uppercase">01 / OUR STORY</span>
              <h2 className="mt-3 font-serif text-3xl font-medium text-white leading-tight">
                Art doesn't have to be complicated.
              </h2>
            </div>

            <div className="md:col-span-8 space-y-4 text-sm sm:text-base leading-relaxed text-[#9BB1D3]">
              <p>
                At Craftella, we believe creativity should be fun, relaxing, and accessible to everyone. You don't need to be an expert painter or seasoned artist to create something stunning.
              </p>
              <p>
                Craftella was created as an experience where you can step away from your everyday screen routine, enjoy great music, and spend a few tranquil hours creating something dazzling with your own hands.
              </p>
              <p>
                With rhinestones, colors, music, and good company, our workshop is all about enjoying the process—not worrying about perfection.
              </p>
            </div>
          </div>

          {/* Highlights grid */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-[rgba(158,190,246,0.2)] bg-[#111B2D] p-6">
              <Palette className="h-6 w-6 text-[#7AA5F2] mb-4" />
              <h3 className="font-serif text-lg text-white font-medium">All Supplies Included</h3>
              <p className="mt-2 text-xs text-[#9BB1D3] leading-relaxed">
                Premium canvas, assorted shimmering rhinestones, precision tools, and adhesives are all provided.
              </p>
            </div>

            <div className="rounded-2xl border border-[rgba(158,190,246,0.2)] bg-[#111B2D] p-6">
              <Heart className="h-6 w-6 text-[#7AA5F2] mb-4" />
              <h3 className="font-serif text-lg text-white font-medium">Relaxing Atmosphere</h3>
              <p className="mt-2 text-xs text-[#9BB1D3] leading-relaxed">
                Warm ambience at 55 Bistro with curated beats and delicious drinks to fuel your creative spirit.
              </p>
            </div>

            <div className="rounded-2xl border border-[rgba(158,190,246,0.2)] bg-[#111B2D] p-6">
              <Users className="h-6 w-6 text-[#7AA5F2] mb-4" />
              <h3 className="font-serif text-lg text-white font-medium">Take It Home</h3>
              <p className="mt-2 text-xs text-[#9BB1D3] leading-relaxed">
                Walk away with a finished, ready-to-hang sparkling masterpiece crafted uniquely by you.
              </p>
            </div>
          </div>

          {/* CTA Component */}
          <div className="mt-16">
            <BookingCTA />
          </div>
        </div>
      </section>
    </div>
  );
}
