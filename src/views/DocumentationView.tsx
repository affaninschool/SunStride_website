import React, { useState } from 'react';
import { PageTab } from '../types';
import { FileText, Printer, Check, Copy, ChevronRight, Download, BookOpen, ShieldCheck } from 'lucide-react';

interface DocumentationViewProps {
  onSelectTab: (tab: PageTab) => void;
}

export const DocumentationView: React.FC<DocumentationViewProps> = ({ onSelectTab }) => {
  const [activeSection, setActiveSection] = useState<string>('sec-overview');
  const [copied, setCopied] = useState(false);

  const docSections = [
    { id: 'sec-overview', title: '1. Project Overview' },
    { id: 'sec-problem', title: '2. Problem Statement' },
    { id: 'sec-objectives', title: '3. Objectives' },
    { id: 'sec-system', title: '4. System Design' },
    { id: 'sec-hardware', title: '5. Hardware Specifications' },
    { id: 'sec-energy', title: '6. Energy System & Schematics' },
    { id: 'sec-software', title: '7. Software Logic & State Machine' },
    { id: 'sec-testing', title: '8. Testing Protocols' },
    { id: 'sec-results', title: '9. Qualitative Results' },
    { id: 'sec-limitations', title: '10. Limitations & Edge Cases' },
    { id: 'sec-future', title: '11. Future Scope' },
  ];

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(
      'SunStride Smart Station: Decentralized RFID Transit Tracking Coupled with Hybrid Photovoltaic and Piezoelectric Harvesting. ATL Engineering Research, 2026.'
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-[#F4F5F7] text-[#1A1A1A]">
      {/* 1. HERO */}
      <section className="border-b border-[#E2E4E8] bg-tech-grid pt-14 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#E2E4E8] text-[10px] font-mono font-bold uppercase tracking-wider text-[#374151]">
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                <span>FORMAL ENGINEERING WHITE PAPER & SPECIFICATIONS</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-[#1A1A1A]">
                TECHNICAL DOCUMENTATION
              </h1>
              <p className="text-base text-[#4B5563] leading-relaxed">
                Comprehensive engineering documentation covering hardware topologies, firmware loops, power conditioning circuits, and testing methodologies.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start md:self-auto font-mono text-xs">
              <button
                onClick={handleCopyCitation}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded bg-white border border-[#D1D5DB] text-[#374151] hover:bg-[#ECEEF2] cursor-pointer shadow-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'CITATION COPIED' : 'COPY CITATION'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DOCUMENTATION BODY WITH SIDEBAR TOC */}
      <section className="py-12 border-b border-[#E2E4E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Sticky Table of Contents (Left 4 Cols) */}
            <div className="lg:col-span-4">
              <div className="sticky top-28 bg-white p-5 rounded-lg border border-[#E2E4E8] shadow-xs space-y-3 font-mono">
                <div className="flex items-center justify-between border-b border-[#F3F4F6] pb-2">
                  <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
                    DOCUMENT SECTIONS
                  </span>
                  <span className="text-[10px] text-[#6B7280]">v1.0.4</span>
                </div>
                <nav className="space-y-1">
                  {docSections.map((sec) => {
                    const isActive = activeSection === sec.id;
                    return (
                      <a
                        key={sec.id}
                        href={`#${sec.id}`}
                        onClick={() => setActiveSection(sec.id)}
                        className={`block text-xs py-1.5 px-2.5 rounded transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#1A1A1A] text-white font-bold'
                            : 'text-[#4B5563] hover:text-[#1A1A1A] hover:bg-[#ECEEF2]'
                        }`}
                      >
                        {sec.title}
                      </a>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Document Content (Right 8 Cols) */}
            <div className="lg:col-span-8 bg-white p-6 sm:p-10 rounded-lg border border-[#E2E4E8] shadow-xs space-y-12 text-sm leading-relaxed text-[#374151]">
              {/* 1. PROJECT OVERVIEW */}
              <div id="sec-overview" className="space-y-3 scroll-mt-28">
                <span className="font-mono text-xs font-bold text-emerald-600 uppercase">SECTION 01</span>
                <h2 className="text-2xl font-bold font-display text-[#1A1A1A]">1. Project Overview</h2>
                <p>
                  SunStride is an engineering research prototype developed to investigate the synthesis of smart public transportation monitoring with decentralized hybrid renewable energy harvesting. The station integrates high-frequency RFID transponders for deterministic transit vehicle arrival detection and pairs this with dual-source micro-harvesting (canopy solar photovoltaic cells and sub-floor piezoelectric transducers) to power local commuter display interfaces independently of municipal electricity grids.
                </p>
              </div>

              {/* 2. PROBLEM STATEMENT */}
              <div id="sec-problem" className="space-y-3 scroll-mt-28 border-t border-[#F3F4F6] pt-8">
                <span className="font-mono text-xs font-bold text-emerald-600 uppercase">SECTION 02</span>
                <h2 className="text-2xl font-bold font-display text-[#1A1A1A]">2. Problem Statement</h2>
                <p>
                  Public transit passengers in emerging urban transit corridors frequently experience severe information deficits regarding approaching buses. Existing GPS-based fleet telemetry systems suffer from cellular dead-zones, high server latency, and necessitate individual commuter smartphone ownership. Simultaneously, equipping municipal bus shelters with continuous grid-powered digital kiosks requires extensive underground electrical conduit excavation, which is capital-intensive and vulnerable to municipal power interruptions.
                </p>
              </div>

              {/* 3. OBJECTIVES */}
              <div id="sec-objectives" className="space-y-3 scroll-mt-28 border-t border-[#F3F4F6] pt-8">
                <span className="font-mono text-xs font-bold text-emerald-600 uppercase">SECTION 03</span>
                <h2 className="text-2xl font-bold font-display text-[#1A1A1A]">3. Engineering Objectives</h2>
                <ul className="list-disc pl-5 space-y-2 text-[#4B5563]">
                  <li>Engineer a local vehicle proximity sensing loop utilizing passive RFID tags operating at 13.56 MHz / 865–868 MHz UHF with detection latencies under 100 milliseconds.</li>
                  <li>Design a dual-source power conditioning circuit integrating solar PV modules and PZT ceramic piezoelectric floor tiles.</li>
                  <li>Implement an ultra-low-power embedded state machine capable of operating with a total station continuous power draw below 5 Watts.</li>
                  <li>Deliver glanceable, direct-sunlight-legible arrival status to waiting commuters using bistable e-Paper display technology.</li>
                </ul>
              </div>

              {/* 4. SYSTEM DESIGN */}
              <div id="sec-system" className="space-y-3 scroll-mt-28 border-t border-[#F3F4F6] pt-8">
                <span className="font-mono text-xs font-bold text-emerald-600 uppercase">SECTION 04</span>
                <h2 className="text-2xl font-bold font-display text-[#1A1A1A]">4. System Architecture & Topology</h2>
                <p>
                  The system is architected as two decoupled, synchronized domains:
                </p>
                <div className="p-4 bg-[#F4F5F7] rounded border border-[#E2E4E8] font-mono text-xs space-y-2">
                  <div className="font-bold text-[#1A1A1A]">TELEMETRY DOMAIN:</div>
                  <div className="text-emerald-700">BUS (RFID TAG) ──[RF Field]──► STATION ANTENNA ──► MCU DECODE ──► PID DISPLAY</div>
                  <div className="font-bold text-[#1A1A1A] pt-2">ENERGY DOMAIN:</div>
                  <div className="text-amber-700">SOLAR (PV) + PIEZO (KINETIC) ──► SCHOTTKY RECTIFIER & MPPT ──► BUFFER BANK ──► MCU BUS</div>
                </div>
              </div>

              {/* 5. HARDWARE SPECIFICATIONS */}
              <div id="sec-hardware" className="space-y-3 scroll-mt-28 border-t border-[#F3F4F6] pt-8">
                <span className="font-mono text-xs font-bold text-emerald-600 uppercase">SECTION 05</span>
                <h2 className="text-2xl font-bold font-display text-[#1A1A1A]">5. Hardware Specifications</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs border border-[#E2E4E8]">
                    <thead className="bg-[#F4F5F7] text-[#6B7280] border-b border-[#E2E4E8]">
                      <tr>
                        <th className="py-2.5 px-3">SUBSYSTEM</th>
                        <th className="py-2.5 px-3">COMPONENT MODEL</th>
                        <th className="py-2.5 px-3">VOLTAGE / CURRENT</th>
                        <th className="py-2.5 px-3">OPERATING MODE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F3F4F6] text-[#374151]">
                      <tr>
                        <td className="py-2.5 px-3 font-semibold">RFID Reader</td>
                        <td className="py-2.5 px-3">ISO 18000-6C Transceiver</td>
                        <td className="py-2.5 px-3">3.3V / 120mA (Pulse)</td>
                        <td className="py-2.5 px-3">Intermittent 100ms Burst</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold">Solar Array</td>
                        <td className="py-2.5 px-3">Monocrystalline 50Wp</td>
                        <td className="py-2.5 px-3">18.2V Voc / 2.75A Isc</td>
                        <td className="py-2.5 px-3">Continuous Daylight</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold">Piezo Matrix</td>
                        <td className="py-2.5 px-3">PZT-5H Ceramic Discs</td>
                        <td className="py-2.5 px-3">Up to 45V pk / Rectified</td>
                        <td className="py-2.5 px-3">Impulse Footstep Force</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold">Station MCU</td>
                        <td className="py-2.5 px-3">32-bit RISC-V Core</td>
                        <td className="py-2.5 px-3">3.3V / 18µA (Deep Sleep)</td>
                        <td className="py-2.5 px-3">Interrupt Driven Wakeup</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 6. ENERGY SYSTEM */}
              <div id="sec-energy" className="space-y-3 scroll-mt-28 border-t border-[#F3F4F6] pt-8">
                <span className="font-mono text-xs font-bold text-emerald-600 uppercase">SECTION 06</span>
                <h2 className="text-2xl font-bold font-display text-[#1A1A1A]">6. Energy System & Power Conditioning</h2>
                <p>
                  To reconcile the disparity between continuous DC solar generation and high-voltage, low-current AC kinetic spikes from piezoelectric transducers, SunStride incorporates a multi-stage power conditioning board. Piezoelectric pulses pass through low-forward-drop Schottky bridge rectifiers into a decoupling ceramic reservoir before entering a buck-boost power stage. A 12.8V LiFePO4 cell bank serves as the centralized buffer.
                </p>
              </div>

              {/* 7. SOFTWARE LOGIC */}
              <div id="sec-software" className="space-y-3 scroll-mt-28 border-t border-[#F3F4F6] pt-8">
                <span className="font-mono text-xs font-bold text-emerald-600 uppercase">SECTION 07</span>
                <h2 className="text-2xl font-bold font-display text-[#1A1A1A]">7. Software Logic & State Machine</h2>
                <p>
                  The firmware operates under a strict deterministic event loop:
                </p>
                <div className="p-4 bg-[#14171C] text-white rounded font-mono text-xs space-y-1 shadow-md">
                  <div className="text-neutral-500">// SunStride Embedded Logic State Loop</div>
                  <div className="text-emerald-400">STATE_IDLE_STANDBY:</div>
                  <div className="pl-4 text-neutral-300">Set MCU to Deep Sleep (18 µA); Enable GPIO RFID Interrupt;</div>
                  <div className="text-emerald-400">STATE_RFID_WAKEUP:</div>
                  <div className="pl-4 text-neutral-300">Interrupt fired; Power interrogator; Read UID payload; Verify checksum;</div>
                  <div className="text-emerald-400">STATE_LOOKUP_TABLE:</div>
                  <div className="pl-4 text-neutral-300">Query internal SPI Flash table; Fetch route, destination, dwell window;</div>
                  <div className="text-emerald-400">STATE_DISPLAY_REFRESH:</div>
                  <div className="pl-4 text-neutral-300">Trigger bistable e-Paper differential update; Output visual status;</div>
                  <div className="text-emerald-400">STATE_RETURN_SLEEP:</div>
                  <div className="pl-4 text-neutral-300">Deassert display power; Re-arm interrupt; Return to STANDBY;</div>
                </div>
              </div>

              {/* 8. TESTING PROTOCOLS */}
              <div id="sec-testing" className="space-y-3 scroll-mt-28 border-t border-[#F3F4F6] pt-8">
                <span className="font-mono text-xs font-bold text-emerald-600 uppercase">SECTION 08</span>
                <h2 className="text-2xl font-bold font-display text-[#1A1A1A]">8. Laboratory Testing Protocols</h2>
                <p>
                  Experimental protocols evaluated antenna beam angle variations (0° to 45° offset), vehicle velocities up to 40 km/h, footstep compressive load profiles (400 N to 900 N), and solar IV curves across lux conditions ranging from 5,000 lux (cloudy twilight) to 100,000 lux (peak sunlight).
                </p>
              </div>

              {/* 9. QUALITATIVE RESULTS */}
              <div id="sec-results" className="space-y-3 scroll-mt-28 border-t border-[#F3F4F6] pt-8">
                <span className="font-mono text-xs font-bold text-emerald-600 uppercase">SECTION 09</span>
                <h2 className="text-2xl font-bold font-display text-[#1A1A1A]">9. Qualitative Results</h2>
                <p>
                  Bench testing confirmed that deterministic RFID interrogation delivers vehicle detection within 80–110 ms without false triggers from adjacent lanes when shielded horn antennas are deployed. The hybrid energy conditioning successfully prevented station brownouts across simulated day-night transition cycles.
                </p>
              </div>

              {/* 10. LIMITATIONS */}
              <div id="sec-limitations" className="space-y-3 scroll-mt-28 border-t border-[#F3F4F6] pt-8">
                <span className="font-mono text-xs font-bold text-emerald-600 uppercase">SECTION 10</span>
                <h2 className="text-2xl font-bold font-display text-[#1A1A1A]">10. Technical Limitations & Edge Cases</h2>
                <ul className="list-disc pl-5 space-y-2 text-[#4B5563]">
                  <li><strong>RFID Line-of-Sight Blockage:</strong> Extreme particulate accumulation or dense metal obstacles directly blocking the antenna aperture can attenuate signal read rates.</li>
                  <li><strong>Piezo Micro-Harvesting Scale:</strong> Piezoelectric footstep output provides intermittent auxiliary power, which is insufficient as a standalone primary source without baseline solar harvesting.</li>
                  <li><strong>Extreme Weather:</strong> Sustained monsoon seasons with &gt;7 consecutive overcast days require appropriate battery bank sizing to prevent deep discharge.</li>
                </ul>
              </div>

              {/* 11. FUTURE SCOPE */}
              <div id="sec-future" className="space-y-3 scroll-mt-28 border-t border-[#F3F4F6] pt-8">
                <span className="font-mono text-xs font-bold text-emerald-600 uppercase">SECTION 11</span>
                <h2 className="text-2xl font-bold font-display text-[#1A1A1A]">11. Future Scope & Field Trials</h2>
                <p>
                  Next steps include transitioning from benchtop testing to a physical field pilot on an active campus transit loop, developing automated OTA schedule sync protocols, and integrating carbon footprint telemetry for municipal sustainability auditing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
