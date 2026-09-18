import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { BANNER_SLIDES } from '../data/mockData';

interface HeroSliderProps {
  onNavigateTab: (tab: string) => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ onNavigateTab }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNER_SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? BANNER_SLIDES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % BANNER_SLIDES.length);
  };

  const slide = BANNER_SLIDES[currentSlide];

  return (
    <div className="relative w-full h-[380px] sm:h-[450px] md:h-[500px] lg:h-[540px] overflow-hidden bg-slate-900 select-none">
      {/* Background Image with subtle zoom transition */}
      {BANNER_SLIDES.map((item, idx) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          {/* Subtle gradient overlay to enhance text readability while maintaining bright school ambiance */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
        </div>
      ))}

      {/* Left Navigation Arrow - Matching image circular/semi-translucent chevron */}
      <button
        onClick={prevSlide}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm transition-all cursor-pointer shadow-lg hover:scale-105"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
      </button>

      {/* Right Navigation Arrow - Matching image circular/semi-translucent chevron */}
      <button
        onClick={nextSlide}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm transition-all cursor-pointer shadow-lg hover:scale-105"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
      </button>

      {/* Floating Center Caption Box - Exactly matching the translucent card in reference photo */}
      <div className="absolute bottom-6 sm:bottom-10 left-4 right-4 sm:left-12 sm:right-12 md:left-20 md:right-20 lg:left-32 lg:right-32 z-20 flex flex-col items-center">
        {/* Caption Header floating directly on top of the box */}
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white text-center drop-shadow-md mb-2 sm:mb-3 font-serif tracking-wide px-2">
          {slide.title}
        </h2>

        {/* The White Semi-Translucent Description Box - Exact replica of the reference screenshot */}
        <div className="w-full bg-white/95 backdrop-blur-md rounded-md p-4 sm:p-5 shadow-2xl border border-white/60 text-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 max-w-4xl">
          <div className="flex-1">
            <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">
              {slide.description}
            </p>
          </div>
          <button
            onClick={() => onNavigateTab(slide.actionTab)}
            className="self-end sm:self-center text-xs sm:text-sm font-bold text-[#432874] hover:text-purple-950 flex items-center gap-1 group whitespace-nowrap cursor-pointer transition-colors"
          >
            <span>{slide.linkText}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Slide Indicators / Dots */}
      <div className="absolute bottom-2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {BANNER_SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
              idx === currentSlide ? 'bg-amber-400 w-5' : 'bg-white/60 hover:bg-white'
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
