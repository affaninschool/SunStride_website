import React from 'react';
import { PageTab } from '../types';
import { 
  Globe, 
  Leaf, 
  Accessibility, 
  Maximize2, 
  GraduationCap, 
  ArrowRight,
  TrendingUp,
  MapPin
} from 'lucide-react';

interface ImpactViewProps {
  onSelectTab: (tab: PageTab) => void;
}

export const ImpactView: React.FC<ImpactViewProps> = ({ onSelectTab }) => {
  const impactPillars = [
    {
      id: 'mobility',
      title: 'MOBILITY',
      subtitle: 'Accessible Transit Information',
      icon: Globe,
      color: 'emerald',
      desc: 'Potentially improve direct access to bus arrival information at localized bus stops, eliminating the strict requirement for commuter smartphone ownership and mobile internet connectivity.',
    },
    {
      id: 'sustainability',
      title: 'SUSTAINABILITY',
      subtitle: 'Decentralized Micro-Harvesting',
      icon: Leaf,
      color: 'amber',
      desc: 'Integrate hybrid solar photovoltaic and piezoelectric kinetic energy generation directly into municipal transit shelters, reducing parasitic load on municipal electrical distribution.',
    },
    {
      id: 'accessibility',
      title: 'ACCESSIBILITY',
      subtitle: 'Universal Visual Legibility',
      icon: Accessibility,
      color: 'sky',
      desc: 'Provide high-contrast, glare-resistant bistable arrival screens that remain legible under direct sunlight, assisting elderly passengers and daily transit riders.',
    },
    {
      id: 'scalability',
      title: 'SCALABILITY',
      subtitle: 'Modular Civil Retrofitting',
      icon: Maximize2,
      color: 'blue',
      desc: 'Explore how modular embedded RFID nodes and localized solar kits can be cost-effectively retrofitted onto existing non-electrified bus shelters across tier-2 and tier-3 cities.',
    },
    {
      id: 'education',
      title: 'EDUCATION',
      subtitle: 'ATL Engineering Pedagogy',
      icon: GraduationCap,
      color: 'teal',
      desc: 'Demonstrate real-world applications of embedded systems, wireless RFID physics, and energy harvesting transducers for young engineers and researchers.',
    },
  ];

  const visionPhases = [
    {
      phase: '01',
      title: '1 LABORATORY PROTOTYPE',
      badge: 'CURRENT STATE',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      desc: 'Bench-scale functional unit validating RFID proximity reading, hybrid Schottky power conditioning, and bistable display refresh logic.',
    },
    {
      phase: '02',
      title: '1 SMART FIELD STATION',
      badge: 'NEXT HORIZON',
      badgeColor: 'bg-sky-50 text-sky-800 border-sky-300',
      desc: 'Piloting a full-scale physical shelter installation on an active educational campus or municipal test transit route.',
    },
    {
      phase: '03',
      title: 'CORRIDOR OF MULTIPLE STATIONS',
      badge: 'SCALING STAGE',
      badgeColor: 'bg-neutral-100 text-neutral-700 border-neutral-300',
      desc: 'Deploying a 5-to-10 station synchronized arterial route to benchmark vehicle dwell optimization and maintenance durability.',
    },
    {
      phase: '04',
      title: 'SMART TRANSIT NETWORK',
      badge: 'LONG-TERM VISION',
      badgeColor: 'bg-neutral-100 text-neutral-700 border-neutral-300',
      desc: 'Interconnected regional public transit grid featuring decentralized energy nodes and deterministic arrival feeds.',
    },
  ];

  return (
    <div className="w-full bg-[#F4F5F7] text-[#1A1A1A]">
      {/* 1. HERO */}
      <section className="border-b border-[#E2E4E8] bg-tech-grid pt-14 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#E2E4E8] text-[10px] font-mono font-bold uppercase tracking-wider text-[#374151]">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>CIVIC & INFRASTRUCTURAL RELEVANCE</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-[#1A1A1A]">
              DESIGNED FOR REAL-WORLD INFRASTRUCTURE
            </h1>
            <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed">
              Evaluating the potential long-term benefits of energy-autonomous public transit nodes without overstating experimental outcomes.
            </p>
          </div>
        </div>
      </section>

      {/* 2. FIVE IMPACT PILLARS */}
      <section className="py-20 border-b border-[#E2E4E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[#6B7280] block mb-1">
              THE VALUE PILLARS
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#1A1A1A]">
              FIVE DIMENSIONS OF SYSTEM VALUE
            </h2>
            <p className="text-sm text-[#4B5563] mt-2">
              How SunStride conceptual architecture aligns with municipal and commuter priorities:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {impactPillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.id}
                  className="bg-white p-6 rounded-lg border border-[#E2E4E8] shadow-xs space-y-4 hover:border-[#DCDFE4] transition-all"
                >
                  <div className="flex items-center justify-between border-b border-[#F3F4F6] pb-3">
                    <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {pillar.title}
                    </span>
                    <Icon className="w-5 h-5 text-[#6B7280]" />
                  </div>
                  <h3 className="font-bold font-display text-base text-[#1A1A1A]">
                    {pillar.subtitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. FUTURE VISION & EXPANSION ROADMAP */}
      <section className="py-20 bg-[#ECEEF2] border-b border-[#E2E4E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-mono font-bold text-amber-600 uppercase tracking-widest block mb-1">
                CONCEPTUAL ROADMAP
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#1A1A1A]">
                FUTURE VISION & PROGRESSION
              </h2>
            </div>
            <div className="px-3 py-1 bg-amber-50 border border-amber-300 rounded text-amber-900 text-xs font-mono font-bold self-start sm:self-auto">
              FUTURE VISION // CONCEPTUAL TARGETS
            </div>
          </div>

          {/* Sequential 4-Phase Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {visionPhases.map((phase) => (
              <div
                key={phase.phase}
                className="bg-white p-6 rounded-lg border border-[#E2E4E8] shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded bg-[#1A1A1A] text-white font-mono font-bold text-xs flex items-center justify-center">
                      {phase.phase}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${phase.badgeColor}`}>
                      {phase.badge}
                    </span>
                  </div>
                  <h3 className="font-bold font-mono text-sm text-[#1A1A1A]">
                    {phase.title}
                  </h3>
                  <p className="text-xs text-[#4B5563] leading-relaxed">
                    {phase.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Schematic India Map Corridor Callout */}
          <div className="mt-10 p-6 bg-[#14171C] text-white rounded-xl border border-neutral-800 font-mono space-y-3 shadow-md">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
              <MapPin className="w-4 h-4" />
              <span>POTENTIAL URBAN APPLICATION CORRIDORS</span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed max-w-3xl">
              Targeted exploration focuses on suburban transit feeders in metropolitan clusters (e.g. Delhi NCR, Bengaluru outer ring, Pune industrial corridors) where un-electrified bus stops currently leave commuters without arrival transparency.
            </p>
            <div className="pt-2 text-[10px] text-neutral-500">
              * SunStride is currently an ATL engineering prototype under active bench research and does not claim commercial nation-wide rollout.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
