import React from 'react';
import { PageTab } from '../types';
import { BookOpen, ArrowRight, HelpCircle, Lightbulb, Wrench, CheckCircle } from 'lucide-react';

interface AboutViewProps {
  onSelectTab: (tab: PageTab) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onSelectTab }) => {
  return (
    <div className="w-full bg-[#F4F5F7] text-[#1A1A1A]">
      {/* 1. HERO */}
      <section className="border-b border-[#E2E4E8] bg-tech-grid pt-14 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#E2E4E8] text-[10px] font-mono font-bold uppercase tracking-wider text-[#374151]">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>PROJECT GENESIS & SCIENTIFIC INQUIRY</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-[#1A1A1A]">
              WHY SUNSTRIDE?
            </h1>
            <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed">
              The story of how an inquiry into urban public transit friction led to a physical hybrid-energy prototype.
            </p>
          </div>
        </div>
      </section>

      {/* 2. FOUR-STAGE NARRATIVE */}
      <section className="py-20 border-b border-[#E2E4E8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Stage 1: The Problem */}
          <div className="border-l-2 border-neutral-300 pl-6 sm:pl-8 space-y-3 relative">
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center text-[9px] font-mono font-bold">
              1
            </div>
            <span className="font-mono text-xs font-bold text-neutral-500 uppercase tracking-wider">
              STAGE 01 // OBSERVATION
            </span>
            <h2 className="text-2xl font-bold font-display text-[#1A1A1A]">
              THE PROBLEM
            </h2>
            <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed">
              In most cities, everyday bus commuters face severe information asymmetry. Passengers arrive at stops without knowing whether the previous bus passed two minutes ago or if the next is delayed. Concurrently, electrifying remote bus shelters requires digging cable trenches and connecting to strained municipal utility grids. As a result, countless physical shelters remain dark, passive structures.
            </p>
          </div>

          {/* Stage 2: The Question */}
          <div className="border-l-2 border-emerald-500 pl-6 sm:pl-8 space-y-3 relative bg-emerald-50/40 p-6 rounded-r-lg border-y border-r border-[#E2E4E8]">
            <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] font-mono font-bold">
              2
            </div>
            <span className="font-mono text-xs font-bold text-emerald-700 uppercase tracking-wider">
              STAGE 02 // RESEARCH HYPOTHESIS
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#1A1A1A] italic">
              "What if a bus station could intelligently communicate with buses while generating part of its own energy?"
            </h2>
            <p className="text-sm text-[#4B5563] leading-relaxed">
              Rather than waiting for citywide grid overhauls or expecting every passenger to possess an active smartphone data plan, could localized embedded sensors and distributed micro-energy harvesting create a self-sustaining transit information station?
            </p>
          </div>

          {/* Stage 3: The Approach */}
          <div className="border-l-2 border-neutral-300 pl-6 sm:pl-8 space-y-3 relative">
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center text-[9px] font-mono font-bold">
              3
            </div>
            <span className="font-mono text-xs font-bold text-neutral-500 uppercase tracking-wider">
              STAGE 03 // ARCHITECTURAL FORMULATION
            </span>
            <h2 className="text-2xl font-bold font-display text-[#1A1A1A]">
              THE APPROACH
            </h2>
            <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed">
              We decoupled the system into two synchronized paths:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs pt-2">
              <div className="p-4 bg-white rounded border border-[#E2E4E8] space-y-1 shadow-xs">
                <span className="font-bold text-emerald-700 block">DETERMINISTIC TELEMETRY</span>
                <p className="text-[#6B7280]">
                  Near-field RFID identification detects approaching buses locally with zero cloud dependencies and sub-100ms response.
                </p>
              </div>
              <div className="p-4 bg-white rounded border border-[#E2E4E8] space-y-1 shadow-xs">
                <span className="font-bold text-amber-700 block">HYBRID HARVESTING</span>
                <p className="text-[#6B7280]">
                  Overhead solar panels capture daylight while sub-floor piezoelectric transducers capture pedestrian kinetic pulses during rush hours.
                </p>
              </div>
            </div>
          </div>

          {/* Stage 4: The Prototype */}
          <div className="border-l-2 border-neutral-300 pl-6 sm:pl-8 space-y-3 relative">
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center text-[9px] font-mono font-bold">
              4
            </div>
            <span className="font-mono text-xs font-bold text-neutral-500 uppercase tracking-wider">
              STAGE 04 // PHYSICAL EMBODIMENT
            </span>
            <h2 className="text-2xl font-bold font-display text-[#1A1A1A]">
              THE PROTOTYPE: SUNSTRIDE SMART STATION
            </h2>
            <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed">
              SunStride stands today as a physical laboratory proof-of-concept. It proves that with thoughtful sub-milliwatt electronic design and passive micro-harvesting, civil public infrastructure can become active, communicative, and energy-aware.
            </p>

            <div className="pt-4">
              <button
                onClick={() => onSelectTab('system')}
                className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-neutral-800 text-white font-mono text-xs font-bold px-5 py-3 rounded transition-all cursor-pointer shadow-xs"
              >
                <span>EXPLORE TECHNICAL SYSTEM ARCHITECTURE →</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
