import React, { useState } from 'react';
import { HARDWARE_BOM, WIRING_PINOUT } from '../data/projectData';
import { downloadOnePageSpecPdf } from '../utils/specPdfGenerator';
import {
  Cpu,
  Radio,
  Sun,
  Footprints,
  Tv,
  BatteryCharging,
  FileDown,
  Table,
  Layers,
  Zap,
  CheckCircle2,
} from 'lucide-react';

interface CircuitSchematicProps {
  connectedPairs: { from: string; to: string }[];
  onQuickHighlight?: (pair: [string, string]) => void;
}

export const CircuitSchematicAndThumbnails: React.FC<CircuitSchematicProps> = ({
  connectedPairs,
  onQuickHighlight,
}) => {
  const [selectedThumb, setSelectedThumb] = useState<'power' | 'spi' | 'output'>('power');

  const isLinked = (a: string, b: string) =>
    connectedPairs.some((p) => (p.from === a && p.to === b) || (p.from === b && p.to === a));

  const solarLinked = isLinked('solar', 'storage');
  const piezoLinked = isLinked('piezo', 'storage');
  const mcuPowerLinked = isLinked('storage', 'controller');
  const rfidLinked = isLinked('rfid', 'controller');
  const busRfidLinked = isLinked('bus', 'rfid');
  const displayLinked = isLinked('controller', 'display');

  const thumbnails = [
    {
      id: 'power' as const,
      title: 'Sub-Circuit A: Hybrid Power',
      spec: '6V PV + PZT Schottky -> TP4056 -> 5V',
      active: solarLinked || piezoLinked || mcuPowerLinked,
      pair: ['solar', 'storage'] as [string, string],
    },
    {
      id: 'spi' as const,
      title: 'Sub-Circuit B: MFRC522 SPI',
      spec: 'D5 SCK · D6 MISO · D7 MOSI · D8 SS',
      active: rfidLinked && busRfidLinked,
      pair: ['rfid', 'controller'] as [string, string],
    },
    {
      id: 'output' as const,
      title: 'Sub-Circuit C: UI & Feedback',
      spec: 'I2C OLED + D1 Buzzer + SoftAP Web',
      active: displayLinked,
      pair: ['controller', 'display'] as [string, string],
    },
  ];

  return (
    <div className="space-y-3">
      {/* Live Interactive SVG Wiring Schematic + Preview Thumbnails */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        <div className="lg:col-span-8 bg-[#0F1217] rounded-xl border border-neutral-800 p-3.5 text-white">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-2.5 text-[11px] font-mono text-neutral-400">
            <span className="text-amber-400 font-bold">LIVE CIRCUIT SCHEMATIC PREVIEW (TRACES ILLUMINATE AS LINKED)</span>
            <span className="hidden sm:inline">3.3V LOGIC / 5V POWER RAIL</span>
          </div>

          <svg viewBox="0 0 680 220" className="w-full h-48 sm:h-56 select-none" role="img" aria-label="SunStride interactive electrical schematic">
            {/* Grid lines */}
            <defs>
              <pattern id="circuitGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1E293B" strokeWidth="0.6" />
              </pattern>
            </defs>
            <rect width="680" height="220" rx="6" fill="url(#circuitGrid)" />

            {/* Traces */}
            {/* Solar -> Storage */}
            <path
              d="M 120 48 L 210 48 L 210 92"
              fill="none"
              stroke={solarLinked ? '#F59E0B' : '#334155'}
              strokeWidth={solarLinked ? 3 : 1.5}
              strokeDasharray={solarLinked ? undefined : '4 4'}
            />
            {/* Piezo -> Storage */}
            <path
              d="M 120 165 L 210 165 L 210 128"
              fill="none"
              stroke={piezoLinked ? '#10B981' : '#334155'}
              strokeWidth={piezoLinked ? 3 : 1.5}
              strokeDasharray={piezoLinked ? undefined : '4 4'}
            />
            {/* Storage -> MCU */}
            <path
              d="M 270 110 L 335 110"
              fill="none"
              stroke={mcuPowerLinked ? '#FBBF24' : '#334155'}
              strokeWidth={mcuPowerLinked ? 3.5 : 1.5}
              strokeDasharray={mcuPowerLinked ? undefined : '4 4'}
            />
            {/* MCU <-> RFID (SPI 4-wire bundle) */}
            <path
              d="M 435 95 L 495 95 L 495 62"
              fill="none"
              stroke={rfidLinked ? '#10B981' : '#334155'}
              strokeWidth={rfidLinked ? 3 : 1.5}
              strokeDasharray={rfidLinked ? undefined : '4 4'}
            />
            {/* Bus -> RFID RF field */}
            <path
              d="M 555 44 L 605 44"
              fill="none"
              stroke={busRfidLinked ? '#38BDF8' : '#334155'}
              strokeWidth={busRfidLinked ? 2.5 : 1.5}
              strokeDasharray="3 3"
            />
            {/* MCU -> Display */}
            <path
              d="M 435 130 L 495 130 L 495 166"
              fill="none"
              stroke={displayLinked ? '#38BDF8' : '#334155'}
              strokeWidth={displayLinked ? 3 : 1.5}
              strokeDasharray={displayLinked ? undefined : '4 4'}
            />

            {/* Blocks */}
            {/* Solar PV */}
            <g transform="translate(24, 24)">
              <rect width="96" height="46" rx="5" fill="#1E293B" stroke={solarLinked ? '#F59E0B' : '#475569'} strokeWidth="1.5" />
              <text x="48" y="21" fill="#FBBF24" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">SOLAR PV 6V</text>
              <text x="48" y="34" fill="#94A3B8" fontSize="7.5" textAnchor="middle" fontFamily="monospace">1N5819 Diode</text>
            </g>

            {/* Piezo Array */}
            <g transform="translate(24, 142)">
              <rect width="96" height="46" rx="5" fill="#1E293B" stroke={piezoLinked ? '#10B981' : '#475569'} strokeWidth="1.5" />
              <text x="48" y="21" fill="#34D399" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">PIEZO PZT</text>
              <text x="48" y="34" fill="#94A3B8" fontSize="7.5" textAnchor="middle" fontFamily="monospace">Bridge Rectifier</text>
            </g>

            {/* TP4056 + Battery */}
            <g transform="translate(168, 86)">
              <rect width="102" height="48" rx="5" fill="#064E3B" stroke={mcuPowerLinked ? '#10B981' : '#334155'} strokeWidth="1.5" />
              <text x="51" y="21" fill="#A7F3D0" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">TP4056 + CELL</text>
              <text x="51" y="35" fill="#6EE7B7" fontSize="7.5" textAnchor="middle" fontFamily="monospace">5V / 3.3V Reg</text>
            </g>

            {/* ESP8266 NodeMCU */}
            <g transform="translate(335, 76)">
              <rect width="100" height="68" rx="6" fill="#1E293B" stroke={mcuPowerLinked ? '#60A5FA' : '#475569'} strokeWidth="2" />
              <text x="50" y="24" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">ESP8266</text>
              <text x="50" y="39" fill="#93C5FD" fontSize="7.5" textAnchor="middle" fontFamily="monospace">SPI + SoftAP</text>
              <text x="50" y="54" fill="#64748B" fontSize="7" textAnchor="middle" fontFamily="monospace">D1..D8 GPIO</text>
            </g>

            {/* MFRC522 */}
            <g transform="translate(465, 22)">
              <rect width="90" height="44" rx="5" fill="#1D4ED8" stroke={rfidLinked ? '#34D399' : '#475569'} strokeWidth="1.5" />
              <text x="45" y="20" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">MFRC522</text>
              <text x="45" y="33" fill="#DBEAFE" fontSize="7.5" textAnchor="middle" fontFamily="monospace">13.56 MHz SPI</text>
            </g>

            {/* Bus Tag */}
            <g transform="translate(605, 24)">
              <rect width="58" height="40" rx="5" fill="#0F172A" stroke={busRfidLinked ? '#38BDF8' : '#475569'} strokeWidth="1.5" />
              <text x="29" y="19" fill="#38BDF8" fontSize="8.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">BUS</text>
              <text x="29" y="31" fill="#94A3B8" fontSize="7" textAnchor="middle" fontFamily="monospace">RFID UID</text>
            </g>

            {/* Passenger Display + LEDs */}
            <g transform="translate(465, 148)">
              <rect width="198" height="48" rx="5" fill="#1E293B" stroke={displayLinked ? '#38BDF8' : '#475569'} strokeWidth="1.5" />
              <text x="99" y="21" fill="#7DD3FC" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">PASSENGER UI + LED/BUZZER</text>
              <text x="99" y="35" fill="#94A3B8" fontSize="7.5" textAnchor="middle" fontFamily="monospace">Local HTTP Portal + OLED</text>
            </g>
          </svg>
        </div>

        {/* Right 4 Cols: 3 Circuit Preview Thumbnails */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-[10px] font-mono font-bold text-[#6B7280] uppercase tracking-wider px-1">
            CIRCUIT PREVIEW THUMBNAILS
          </div>
          {thumbnails.map((thumb) => {
            const isSel = selectedThumb === thumb.id;
            return (
              <button
                key={thumb.id}
                onClick={() => {
                  setSelectedThumb(thumb.id);
                  if (onQuickHighlight && !thumb.active) {
                    onQuickHighlight(thumb.pair);
                  }
                }}
                className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                  isSel
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                    : 'bg-white text-[#1A1A1A] border-[#E2E4E8] hover:bg-[#F8F9FA]'
                }`}
              >
                {/* Mini SVG Thumbnail */}
                <div className="w-16 h-11 rounded bg-[#0F1217] border border-neutral-700 shrink-0 flex items-center justify-center p-1">
                  {thumb.id === 'power' && (
                    <svg viewBox="0 0 60 36" className="w-full h-full">
                      <rect x="3" y="4" width="16" height="11" rx="2" fill="#F59E0B" />
                      <rect x="3" y="21" width="16" height="11" rx="2" fill="#10B981" />
                      <line x1="19" y1="9" x2="34" y2="18" stroke="#FBBF24" strokeWidth="1.8" />
                      <line x1="19" y1="26" x2="34" y2="18" stroke="#34D399" strokeWidth="1.8" />
                      <rect x="34" y="10" width="22" height="16" rx="2" fill="#065F46" stroke="#34D399" />
                    </svg>
                  )}
                  {thumb.id === 'spi' && (
                    <svg viewBox="0 0 60 36" className="w-full h-full">
                      <rect x="4" y="8" width="20" height="20" rx="2" fill="#334155" stroke="#93C5FD" />
                      <line x1="24" y1="12" x2="36" y2="12" stroke="#F59E0B" strokeWidth="1.5" />
                      <line x1="24" y1="18" x2="36" y2="18" stroke="#10B981" strokeWidth="1.5" />
                      <line x1="24" y1="24" x2="36" y2="24" stroke="#38BDF8" strokeWidth="1.5" />
                      <rect x="36" y="8" width="20" height="20" rx="2" fill="#1D4ED8" stroke="#60A5FA" />
                    </svg>
                  )}
                  {thumb.id === 'output' && (
                    <svg viewBox="0 0 60 36" className="w-full h-full">
                      <rect x="4" y="8" width="18" height="20" rx="2" fill="#334155" />
                      <line x1="22" y1="18" x2="34" y2="18" stroke="#38BDF8" strokeWidth="2" />
                      <rect x="34" y="6" width="22" height="14" rx="2" fill="#0284C7" />
                      <circle cx="40" cy="28" r="3" fill="#10B981" />
                      <circle cx="50" cy="28" r="3" fill="#F59E0B" />
                    </svg>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-mono text-[11px] font-bold truncate">{thumb.title}</span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded shrink-0 ${
                        thumb.active
                          ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                          : isSel
                          ? 'bg-neutral-800 text-neutral-400'
                          : 'bg-neutral-100 text-neutral-500'
                      }`}
                    >
                      {thumb.active ? 'LINKED' : 'CLICK'}
                    </span>
                  </div>
                  <p className={`text-[10px] font-mono truncate mt-0.5 ${isSel ? 'text-neutral-300' : 'text-[#6B7280]'}`}>
                    {thumb.spec}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface CadBlueprintProps {
  selectedId: string;
  onSelectComponent: (id: string) => void;
}

export const CadBlueprintAndThumbnails: React.FC<CadBlueprintProps> = ({
  selectedId,
  onSelectComponent,
}) => {
  const cadHotspots = [
    { id: 'solar-pv', label: 'Canopy Solar PV', code: 'CAD-01', x: 260, y: 46, color: '#F59E0B' },
    { id: 'display-interface', label: 'E-Paper / OLED UI', code: 'CAD-02', x: 185, y: 122, color: '#38BDF8' },
    { id: 'controller-mcu', label: 'ESP8266 Enclosure', code: 'CAD-03', x: 325, y: 120, color: '#60A5FA' },
    { id: 'rfid-reader', label: 'MFRC522 Pylon', code: 'CAD-04', x: 475, y: 136, color: '#FBBF24' },
    { id: 'piezo-array', label: 'Piezo Floor Mat', code: 'CAD-05', x: 255, y: 196, color: '#10B981' },
  ];

  return (
    <div className="space-y-3">
      {/* True 2D Orthographic CAD Blueprint SVG */}
      <div className="bg-[#0B111E] text-white p-3.5 rounded-xl border border-slate-800 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs font-mono text-slate-400 mb-2.5">
          <span className="text-sky-400 font-bold">ORTHOGRAPHIC 2D CAD BLUEPRINT (SCALE 1:25 · MM)</span>
          <span className="hidden sm:inline">CLICK HOTSPOT OR THUMBNAIL TO INSPECT</span>
        </div>

        <svg
          viewBox="0 0 600 235"
          className="w-full h-56 sm:h-64 select-none"
          role="img"
          aria-label="2D CAD orthographic blueprint of the SunStride bus shelter"
        >
          <defs>
            <pattern id="cadBlueGrid" width="16" height="16" patternUnits="userSpaceOnUse">
              <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#1E293B" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="600" height="235" rx="6" fill="#070D19" />
          <rect width="600" height="235" rx="6" fill="url(#cadBlueGrid)" />

          {/* Dimension Line Top: 2400 mm Shelter Span */}
          <line x1="110" y1="20" x2="415" y2="20" stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 2" />
          <text x="262" y="15" fill="#7DD3FC" fontSize="8" textAnchor="middle" fontFamily="monospace">
            2400 mm CANOPY SPAN (15° TILT)
          </text>

          {/* Ground Concrete Plinth */}
          <line x1="55" y1="206" x2="545" y2="206" stroke="#475569" strokeWidth="2" />

          {/* Shelter Roof Canopy & Tilted Solar Array */}
          <polygon points="105,64 415,48 415,58 105,74" fill="#1E293B" stroke="#94A3B8" strokeWidth="1.5" />
          <polygon
            points="125,52 395,38 395,48 125,62"
            fill={selectedId === 'solar-pv' ? '#78350F' : '#1E3A8A'}
            stroke="#F59E0B"
            strokeWidth={selectedId === 'solar-pv' ? 2.5 : 1.5}
          />

          {/* Structural Pillars */}
          <rect x="135" y="72" width="10" height="134" fill="#334155" stroke="#64748B" />
          <rect x="375" y="59" width="10" height="147" fill="#334155" stroke="#64748B" />

          {/* Back Panel + Commuter Display */}
          <rect x="145" y="88" width="230" height="86" fill="#0F172A" stroke="#334155" strokeDasharray="4 2" />
          <rect
            x="162"
            y="102"
            width="78"
            height="48"
            rx="3"
            fill="#0C4A6E"
            stroke={selectedId === 'display-interface' ? '#38BDF8' : '#0284C7'}
            strokeWidth={selectedId === 'display-interface' ? 2.5 : 1.2}
          />
          <text x="201" y="124" fill="#E0F2FE" fontSize="7.5" textAnchor="middle" fontFamily="monospace">E-PAPER PID</text>
          <text x="201" y="136" fill="#7DD3FC" fontSize="6.5" textAnchor="middle" fontFamily="monospace">ARRIVAL SCREEN</text>

          {/* ESP8266 IP65 Control Box */}
          <rect
            x="295"
            y="102"
            width="62"
            height="42"
            rx="3"
            fill="#172554"
            stroke={selectedId === 'controller-mcu' ? '#60A5FA' : '#3B82F6'}
            strokeWidth={selectedId === 'controller-mcu' ? 2.5 : 1.2}
          />
          <text x="326" y="121" fill="#DBEAFE" fontSize="7.5" textAnchor="middle" fontFamily="monospace">ESP8266</text>
          <text x="326" y="133" fill="#93C5FD" fontSize="6.5" textAnchor="middle" fontFamily="monospace">IP65 CORE</text>

          {/* Piezoelectric Floor Mat */}
          <rect
            x="158"
            y="194"
            width="202"
            height="12"
            rx="2"
            fill={selectedId === 'piezo-array' ? '#065F46' : '#064E3B'}
            stroke="#10B981"
            strokeWidth={selectedId === 'piezo-array' ? 2.5 : 1.5}
          />
          <text x="259" y="220" fill="#6EE7B7" fontSize="7.5" textAnchor="middle" fontFamily="monospace">
            RECESSED PZT PIEZO FLOOR MAT (1800 x 600 mm)
          </text>

          {/* Approach RFID Pylon */}
          <rect x="468" y="114" width="14" height="92" fill="#334155" stroke="#64748B" />
          <rect
            x="456"
            y="120"
            width="38"
            height="32"
            rx="4"
            fill="#451A03"
            stroke={selectedId === 'rfid-reader' ? '#FBBF24' : '#D97706'}
            strokeWidth={selectedId === 'rfid-reader' ? 2.5 : 1.5}
          />
          <path d="M 500 128 Q 515 136 500 144" fill="none" stroke="#FBBF24" strokeWidth="1.5" />
          <path d="M 508 122 Q 527 136 508 150" fill="none" stroke="#FBBF24" strokeWidth="1.2" opacity="0.6" />
          <text x="475" y="170" fill="#FDE68A" fontSize="7.5" textAnchor="middle" fontFamily="monospace">MFRC522</text>

          {/* Interactive Hotspot Rings */}
          {cadHotspots.map((spot) => {
            const active = selectedId === spot.id;
            return (
              <g
                key={spot.id}
                onClick={() => onSelectComponent(spot.id)}
                className="cursor-pointer"
              >
                <circle
                  cx={spot.x}
                  cy={spot.y}
                  r={active ? 10 : 7}
                  fill={spot.color}
                  fillOpacity={active ? 0.35 : 0.15}
                  stroke={spot.color}
                  strokeWidth={active ? 2 : 1.2}
                />
                <circle cx={spot.x} cy={spot.y} r="3" fill={spot.color} />
              </g>
            );
          })}
        </svg>
      </div>

      {/* 5 Clickable Subsystem CAD Preview Thumbnails */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {cadHotspots.map((spot) => {
          const isSelected = selectedId === spot.id;
          return (
            <button
              key={spot.id}
              onClick={() => onSelectComponent(spot.id)}
              className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-xs'
                  : 'bg-white text-[#1A1A1A] border-[#E2E4E8] hover:bg-[#F4F5F7]'
              }`}
            >
              <div className="h-9 rounded bg-[#070D19] border border-slate-800 mb-1.5 flex items-center justify-center px-2">
                <svg viewBox="0 0 80 28" className="w-full h-full">
                  <rect x="2" y="2" width="76" height="24" rx="2" fill="none" stroke="#1E293B" strokeWidth="1" />
                  {spot.id === 'solar-pv' && (
                    <polygon points="14,18 66,8 66,13 14,23" fill="none" stroke="#F59E0B" strokeWidth="2" />
                  )}
                  {spot.id === 'display-interface' && (
                    <rect x="22" y="6" width="36" height="16" rx="2" fill="none" stroke="#38BDF8" strokeWidth="2" />
                  )}
                  {spot.id === 'controller-mcu' && (
                    <rect x="26" y="6" width="28" height="16" rx="2" fill="none" stroke="#60A5FA" strokeWidth="2" />
                  )}
                  {spot.id === 'rfid-reader' && (
                    <>
                      <rect x="22" y="7" width="22" height="14" rx="2" fill="none" stroke="#FBBF24" strokeWidth="1.8" />
                      <path d="M 50 9 Q 58 14 50 19" fill="none" stroke="#FBBF24" strokeWidth="1.5" />
                    </>
                  )}
                  {spot.id === 'piezo-array' && (
                    <>
                      <rect x="14" y="12" width="52" height="6" rx="1" fill="none" stroke="#10B981" strokeWidth="1.8" />
                      <circle cx="26" cy="15" r="2" fill="#10B981" />
                      <circle cx="40" cy="15" r="2" fill="#10B981" />
                      <circle cx="54" cy="15" r="2" fill="#10B981" />
                    </>
                  )}
                </svg>
              </div>
              <span className="font-mono text-[9px] text-emerald-500 font-bold block">{spot.code}</span>
              <span className="font-mono text-[10px] font-bold block truncate">{spot.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const BomAndWiringReference: React.FC = () => {
  const [activeRefTab, setActiveRefTab] = useState<'bom' | 'wiring'>('bom');
  const totalCost = HARDWARE_BOM.reduce((acc, row) => acc + row.qty * row.unitCostInr, 0);

  return (
    <div className="bg-white rounded-2xl border border-[#E2E4E8] shadow-xs overflow-hidden">
      <div className="p-4 sm:p-5 bg-[#FAFAFA] border-b border-[#E2E4E8] flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase tracking-wider">
            EXHIBITION HARDWARE PROOF // BOM &amp; PINOUT
          </span>
          <h3 className="text-base sm:text-lg font-bold font-display text-[#1A1A1A]">
            Bill of Materials (₹{totalCost.toLocaleString('en-IN')}) &amp; ESP8266 Wiring Table
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-[#ECEEF2] p-0.5 rounded-lg border border-[#DCDFE4] font-mono text-xs">
            <button
              id="ref-tab-bom"
              onClick={() => setActiveRefTab('bom')}
              className={`px-3 py-1.5 rounded-md font-bold cursor-pointer transition-all ${
                activeRefTab === 'bom' ? 'bg-[#1A1A1A] text-white' : 'text-[#4B5563]'
              }`}
            >
              Bill of Materials
            </button>
            <button
              id="ref-tab-wiring"
              onClick={() => setActiveRefTab('wiring')}
              className={`px-3 py-1.5 rounded-md font-bold cursor-pointer transition-all ${
                activeRefTab === 'wiring' ? 'bg-[#1A1A1A] text-white' : 'text-[#4B5563]'
              }`}
            >
              Wiring Table
            </button>
          </div>

          <button
            id="btn-download-spec-pdf-lab"
            onClick={downloadOnePageSpecPdf}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold cursor-pointer shadow-xs"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>1-Page Spec PDF</span>
          </button>
        </div>
      </div>

      {activeRefTab === 'bom' ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-[#F4F5F7] text-[#6B7280] border-b border-[#E2E4E8]">
              <tr>
                <th className="py-2.5 px-4">COMPONENT</th>
                <th className="py-2.5 px-4">TECHNICAL SPEC</th>
                <th className="py-2.5 px-4">QTY</th>
                <th className="py-2.5 px-4">COST (INR)</th>
                <th className="py-2.5 px-4">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6] text-[#1A1A1A]">
              {HARDWARE_BOM.map((item) => (
                <tr key={item.id} className="hover:bg-[#F9FAFB]">
                  <td className="py-2.5 px-4 font-bold">{item.part}</td>
                  <td className="py-2.5 px-4 text-[#4B5563] font-sans text-xs">{item.spec}</td>
                  <td className="py-2.5 px-4 tabular-nums">{item.qty}</td>
                  <td className="py-2.5 px-4 tabular-nums font-semibold">
                    ₹{(item.qty * item.unitCostInr).toLocaleString('en-IN')}
                  </td>
                  <td className="py-2.5 px-4">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        item.status === 'Working Prototype'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-[#14171C] text-white font-mono text-xs">
              <tr>
                <td colSpan={3} className="py-3 px-4 font-bold text-neutral-300">
                  TOTAL ATL BENCH PROTOTYPE COST (vs Commercial ₹1,50,000+ Smart Kiosk)
                </td>
                <td colSpan={2} className="py-3 px-4 font-bold text-emerald-400 text-sm">
                  ₹{totalCost.toLocaleString('en-IN')}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-[#F4F5F7] text-[#6B7280] border-b border-[#E2E4E8]">
              <tr>
                <th className="py-2.5 px-4">MODULE</th>
                <th className="py-2.5 px-4">MODULE PIN</th>
                <th className="py-2.5 px-4">ESP8266 PIN</th>
                <th className="py-2.5 px-4">GPIO</th>
                <th className="py-2.5 px-4">SIGNAL / FUNCTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6] text-[#1A1A1A]">
              {WIRING_PINOUT.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#F9FAFB]">
                  <td className="py-2.5 px-4 font-bold">{row.module}</td>
                  <td className="py-2.5 px-4 text-amber-700 font-bold">{row.modulePin}</td>
                  <td className="py-2.5 px-4 text-emerald-700 font-bold">{row.espPin}</td>
                  <td className="py-2.5 px-4 text-[#6B7280]">{row.gpio}</td>
                  <td className="py-2.5 px-4 font-sans text-xs text-[#374151]">{row.signalRole}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
