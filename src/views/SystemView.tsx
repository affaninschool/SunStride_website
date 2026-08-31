import React, { useState } from 'react';
import { PageTab } from '../types';
import { SYSTEM_COMPONENTS } from '../data/projectData';
import { 
  Cpu, 
  Radio, 
  Sun, 
  Footprints, 
  BatteryCharging, 
  Tv, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  Zap, 
  Info,
  CheckCircle2,
  Workflow
} from 'lucide-react';
import { motion } from 'motion/react';

interface SystemViewProps {
  onSelectTab: (tab: PageTab) => void;
}

export const SystemView: React.FC<SystemViewProps> = ({ onSelectTab }) => {
  const [selectedCompId, setSelectedCompId] = useState<string>('rfid-reader');
  const [activeLayer, setActiveLayer] = useState<'all' | 'transportation' | 'control' | 'information' | 'energy'>('all');

  const compIcons: Record<string, any> = {
    'rfid-reader': Radio,
    'solar-pv': Sun,
    'piezo-array': Footprints,
    'energy-management': BatteryCharging,
    'controller-mcu': Cpu,
    'display-interface': Tv,
  };

  const selectedComp = SYSTEM_COMPONENTS.find((c) => c.id === selectedCompId) || SYSTEM_COMPONENTS[0];
  const SelectedIcon = compIcons[selectedComp.id] || Cpu;

  return (
    <div className="w-full bg-[#F4F5F7] text-[#1A1A1A]">
      {/* 1. HERO */}
      <section className="border-b border-[#E2E4E8] bg-tech-grid pt-14 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#E2E4E8] text-[10px] font-mono font-bold uppercase tracking-wider text-[#374151]">
              <Workflow className="w-3.5 h-3.5 text-emerald-600" />
              <span>HARDWARE SCHEMATICS & DATA INTEGRATION</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-[#1A1A1A]">
              INSIDE SUNSTRIDE
            </h1>
            <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed">
              A closer look at how mobility, energy, and information come together inside the station.
            </p>
          </div>
        </div>
      </section>

      {/* 2. LAYER FILTER & ARCHITECTURE CANVAS */}
      <section className="py-16 border-b border-[#E2E4E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Layer Filter Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase text-[#6B7280]">ARCHITECTURAL LAYERS:</span>
            </div>
            <div className="flex flex-wrap gap-2 font-mono text-xs">
              {[
                { id: 'all', label: 'ALL LAYERS' },
                { id: 'transportation', label: '1. TRANSPORTATION' },
                { id: 'control', label: '2. CONTROL & LOGIC' },
                { id: 'information', label: '3. INFORMATION' },
                { id: 'energy', label: '4. ENERGY HARVESTING' },
              ].map((layer) => (
                <button
                  key={layer.id}
                  id={`layer-filter-btn-${layer.id}`}
                  onClick={() => setActiveLayer(layer.id as any)}
                  className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                    activeLayer === layer.id
                      ? 'bg-[#1A1A1A] text-white font-bold'
                      : 'bg-white text-[#4B5563] border border-[#E2E4E8] hover:bg-[#ECEEF2]'
                  }`}
                >
                  {layer.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Architectural Canvas */}
          <div className="w-full bg-[#14171C] text-white rounded-xl border border-neutral-800 p-6 lg:p-8 relative overflow-hidden diagram-area">
            <div className="absolute inset-0 bg-tech-grid-dark opacity-20 pointer-events-none" />

            <div className="relative z-10 space-y-8">
              {/* Architecture Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4 font-mono text-xs text-neutral-400">
                <div className="flex items-center gap-2 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-bold">SUNSTRIDE INTEGRATED ARCHITECTURE SCHEMA // V1.0</span>
                </div>
                <div>CLICK ANY BLOCK TO INSPECT SUBSYSTEM TELEMETRY</div>
              </div>

              {/* 4 Architectural Rows */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* 1. Transportation Layer */}
                <div className={`p-4 rounded-lg border transition-all ${
                  activeLayer === 'all' || activeLayer === 'transportation'
                    ? 'bg-neutral-900/90 border-emerald-500/60'
                    : 'bg-neutral-950/40 border-neutral-900 opacity-40'
                }`}>
                  <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400 mb-3">
                    <span>LAYER 01</span>
                    <span className="font-bold">TRANSPORTATION</span>
                  </div>
                  <div className="space-y-3">
                    <button
                      onClick={() => setSelectedCompId('rfid-reader')}
                      className={`w-full text-left p-3 rounded border text-xs font-mono transition-all cursor-pointer ${
                        selectedCompId === 'rfid-reader'
                          ? 'bg-emerald-950/80 border-emerald-400 text-white font-bold'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Radio className="w-4 h-4 text-emerald-400" />
                        <span>RFID Interrogator</span>
                      </div>
                      <span className="text-[10px] text-neutral-400 block">Bus Approach Detection</span>
                    </button>
                  </div>
                </div>

                {/* 2. Control Layer */}
                <div className={`p-4 rounded-lg border transition-all ${
                  activeLayer === 'all' || activeLayer === 'control'
                    ? 'bg-neutral-900/90 border-blue-500/60'
                    : 'bg-neutral-950/40 border-neutral-900 opacity-40'
                }`}>
                  <div className="flex items-center justify-between text-[10px] font-mono text-blue-400 mb-3">
                    <span>LAYER 02</span>
                    <span className="font-bold">CONTROL & LOGIC</span>
                  </div>
                  <div className="space-y-3">
                    <button
                      onClick={() => setSelectedCompId('controller-mcu')}
                      className={`w-full text-left p-3 rounded border text-xs font-mono transition-all cursor-pointer ${
                        selectedCompId === 'controller-mcu'
                          ? 'bg-blue-950/80 border-blue-400 text-white font-bold'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Cpu className="w-4 h-4 text-blue-400" />
                        <span>Station MCU Hub</span>
                      </div>
                      <span className="text-[10px] text-neutral-400 block">RISC-V Low Power Logic</span>
                    </button>
                  </div>
                </div>

                {/* 3. Information Layer */}
                <div className={`p-4 rounded-lg border transition-all ${
                  activeLayer === 'all' || activeLayer === 'information'
                    ? 'bg-neutral-900/90 border-sky-500/60'
                    : 'bg-neutral-950/40 border-neutral-900 opacity-40'
                }`}>
                  <div className="flex items-center justify-between text-[10px] font-mono text-sky-400 mb-3">
                    <span>LAYER 03</span>
                    <span className="font-bold">INFORMATION</span>
                  </div>
                  <div className="space-y-3">
                    <button
                      onClick={() => setSelectedCompId('display-interface')}
                      className={`w-full text-left p-3 rounded border text-xs font-mono transition-all cursor-pointer ${
                        selectedCompId === 'display-interface'
                          ? 'bg-sky-950/80 border-sky-400 text-white font-bold'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Tv className="w-4 h-4 text-sky-400" />
                        <span>Passenger Display</span>
                      </div>
                      <span className="text-[10px] text-neutral-400 block">Bistable Sunlight UI</span>
                    </button>
                  </div>
                </div>

                {/* 4. Energy Layer */}
                <div className={`p-4 rounded-lg border transition-all ${
                  activeLayer === 'all' || activeLayer === 'energy'
                    ? 'bg-neutral-900/90 border-amber-500/60'
                    : 'bg-neutral-950/40 border-neutral-900 opacity-40'
                }`}>
                  <div className="flex items-center justify-between text-[10px] font-mono text-amber-400 mb-3">
                    <span>LAYER 04</span>
                    <span className="font-bold">ENERGY HARVESTING</span>
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCompId('solar-pv')}
                      className={`w-full text-left p-2 rounded border text-[11px] font-mono transition-all cursor-pointer ${
                        selectedCompId === 'solar-pv'
                          ? 'bg-amber-950/80 border-amber-400 text-white font-bold'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Sun className="w-3.5 h-3.5 text-amber-400" />
                        <span>Canopy Solar Array</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setSelectedCompId('piezo-array')}
                      className={`w-full text-left p-2 rounded border text-[11px] font-mono transition-all cursor-pointer ${
                        selectedCompId === 'piezo-array'
                          ? 'bg-teal-950/80 border-teal-400 text-white font-bold'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Footprints className="w-3.5 h-3.5 text-teal-400" />
                        <span>Piezo Floor Matrix</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setSelectedCompId('energy-management')}
                      className={`w-full text-left p-2 rounded border text-[11px] font-mono transition-all cursor-pointer ${
                        selectedCompId === 'energy-management'
                          ? 'bg-indigo-950/80 border-indigo-400 text-white font-bold'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <BatteryCharging className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Hybrid Storage Hub</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Deep Component Inspector Panel */}
          <div className="bg-white p-6 sm:p-8 rounded-lg border border-[#E2E4E8] shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F3F4F6] pb-5">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#1A1A1A] text-white rounded-lg">
                  <SelectedIcon className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded">
                      SUBSYSTEM // {selectedComp.category.toUpperCase()}
                    </span>
                    <span className="font-mono text-xs text-[#6B7280]">{selectedComp.id}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-[#1A1A1A] mt-1">
                    {selectedComp.name}
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#374151] bg-[#F4F5F7] border border-[#E2E4E8] px-3 py-1.5 rounded self-start sm:self-auto">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>BENCH-VERIFIED MODULE</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-mono font-bold text-[#1A1A1A] uppercase tracking-wider mb-1">
                    Function & Principles
                  </h4>
                  <p className="text-sm text-[#4B5563] leading-relaxed">
                    {selectedComp.functionDesc}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-mono font-bold text-[#1A1A1A] uppercase tracking-wider mb-1">
                    Role in SunStride System
                  </h4>
                  <p className="text-sm text-[#4B5563] leading-relaxed">
                    {selectedComp.roleInSunstride}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-mono font-bold text-[#1A1A1A] uppercase tracking-wider mb-1">
                    Why It Matters for Civil Infrastructure
                  </h4>
                  <p className="text-sm text-[#4B5563] leading-relaxed">
                    {selectedComp.whyItMatters}
                  </p>
                </div>
              </div>

              {/* Hardware Specifications Table */}
              <div className="space-y-3 font-mono">
                <h4 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
                  Hardware Specifications & Bench Thresholds
                </h4>
                <div className="border border-[#E2E4E8] rounded-lg overflow-hidden">
                  <table className="w-full text-xs">
                    <tbody className="divide-y divide-[#F3F4F6]">
                      {Object.entries(selectedComp.specs).map(([specKey, specVal]) => (
                        <tr key={specKey} className="bg-white hover:bg-[#F4F5F7]">
                          <td className="py-2.5 px-3.5 text-[#6B7280] font-medium bg-[#FAFAFA] w-1/2">
                            {specKey}
                          </td>
                          <td className="py-2.5 px-3.5 text-[#1A1A1A] font-semibold">
                            {specVal}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    onClick={() => onSelectTab('lab')}
                    className="text-xs font-mono font-bold text-[#1A1A1A] hover:text-emerald-700 underline flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Test this module in the Interactive Lab</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
