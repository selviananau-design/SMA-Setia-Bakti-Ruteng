import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, X } from 'lucide-react';
import { INITIAL_EVENTS } from '../data/mockData';
import { SchoolEvent } from '../types';

interface UpcomingEventsProps {
  onNavigateTab: (tab: string) => void;
  events?: SchoolEvent[];
}

export const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ onNavigateTab, events: propEvents }) => {
  const [selectedEvent, setSelectedEvent] = useState<SchoolEvent | null>(null);
  const [startIndex, setStartIndex] = useState(0);

  const events = propEvents && propEvents.length > 0 ? propEvents : INITIAL_EVENTS;

  const handlePrev = () => {
    setStartIndex((prev) => (prev > 0 ? prev - 1 : Math.max(0, events.length - 4)));
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev + 4 < events.length ? prev + 1 : 0));
  };

  return (
    <section className="w-full py-8 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header with line and 'Lihat Semua Agenda >' */}
        <div className="flex items-center justify-between border-b-2 border-purple-800 pb-2 mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#321759] font-serif tracking-tight flex items-center gap-2.5">
            <span>Agenda & Kegiatan Mendatang</span>
            <span className="text-xs font-sans font-normal text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full hidden sm:inline-block">
              Kalender Sekolah
            </span>
          </h2>
          <button
            onClick={() => onNavigateTab('berita')}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#522d8a] hover:text-purple-950 transition-colors cursor-pointer group"
          >
            <Calendar className="w-4 h-4 text-[#522d8a]" />
            <span>Lihat Semua Agenda &gt;</span>
          </button>
        </div>

        {/* 4-Column Carousel Container matching the reference image */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-slate-300 shadow-md text-slate-600 hover:text-purple-900 hover:border-purple-600 flex items-center justify-center transition-all cursor-pointer"
            aria-label="Agenda Sebelumnya"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Grid of 4 Events */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {events.slice(startIndex, startIndex + 4).map((evt) => (
              <div
                key={evt.id}
                className="bg-white rounded-lg p-4 border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Big Date Badge matching Jul 20, Jul 21 in photo */}
                  <div className="flex items-baseline gap-2 mb-3">
                    <div className="text-[#3b1d70] font-serif leading-none">
                      <span className="block text-sm font-bold tracking-wider uppercase">
                        {evt.month}
                      </span>
                      <span className="block text-3xl sm:text-4xl font-extrabold">{evt.day}</span>
                    </div>
                    <div className="flex-1 pl-2 border-l border-slate-200">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-purple-800 transition-colors line-clamp-2 leading-snug">
                        {evt.title}
                      </h3>
                    </div>
                  </div>

                  {/* Day, Time and Snippet */}
                  <div className="space-y-1.5 text-xs text-slate-600 mb-3">
                    <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <span className="text-purple-700">🗓</span>
                      <span>{evt.day} {evt.month} {evt.year}</span>
                    </p>
                    <p className="text-slate-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-purple-600" />
                      <span>{evt.time}</span>
                    </p>
                    <p className="text-slate-600 line-clamp-3 text-xs leading-relaxed pt-1">
                      {evt.description}
                    </p>
                  </div>
                </div>

                {/* Read More Link */}
                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedEvent(evt)}
                    className="text-xs font-bold text-[#522d8a] hover:text-purple-950 transition-colors cursor-pointer group-hover:translate-x-0.5 transition-transform"
                  >
                    Lihat Detail &gt;
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-slate-300 shadow-md text-slate-600 hover:text-purple-900 hover:border-purple-600 flex items-center justify-center transition-all cursor-pointer"
            aria-label="Agenda Berikutnya"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-[#432874] text-white p-5 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white text-[#432874] rounded-lg p-2 text-center min-w-[54px] shadow">
                  <span className="block text-xs font-bold uppercase">{selectedEvent.month}</span>
                  <span className="block text-2xl font-extrabold">{selectedEvent.day}</span>
                </div>
                <div>
                  <span className="bg-purple-900 text-purple-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    {selectedEvent.category}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold mt-1 text-white leading-tight">
                    {selectedEvent.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs sm:text-sm text-slate-700">
              <div className="grid grid-cols-2 gap-2 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-700" />
                  <span>{selectedEvent.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-purple-700" />
                  <span className="truncate">{selectedEvent.location}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Deskripsi Kegiatan:</h4>
                <p className="leading-relaxed text-slate-600">{selectedEvent.description}</p>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-xs">
                <p className="font-semibold">Catatan Kehadiran:</p>
                <p>
                  Seluruh siswa dan pihak terkait diwajibkan hadir 15 menit sebelum kegiatan dimulai
                  mengenakan seragam rapi sesuai ketentuan tata tertib sekolah.
                </p>
              </div>
            </div>

            <div className="bg-slate-100 px-5 py-3 flex justify-end">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-1.5 bg-[#432874] text-white text-xs font-semibold rounded hover:bg-[#341b5e] transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
