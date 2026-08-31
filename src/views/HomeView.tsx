import React, { useState } from 'react';
import { PageTab } from '../types';
import { 
  ArrowRight, 
  Radio, 
  Sun, 
  Footprints, 
  Cpu, 
  Tv, 
  BatteryCharging, 
  Bus, 
  Users, 
  CheckCircle2, 
  Activity,
  Layers,
  ArrowDown
} from 'lucide-react';
import { motion } from 'motion/react';

interface HomeViewProps {
  onSelectTab: (tab: PageTab) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onSelectTab }) => {
  const [selectedStationComponent, setSelectedStationComponent] = useState<string>('rfid');
  const [activeWorkFlowStep, setActiveWorkFlowStep] = useState<number>(1);
  const [heroPulseActive, setHeroPulseActive] = useState<boolean>(true);

  const stationComponents = [
    {
      id: 'rfid',
      label: 'RFID TRACKING',
      category: 'Telemetry',
      desc: 'Antenna at station approach interrogates approaching transit vehicles, decoding unique route tags without cellular reliance.',
      icon: Radio,
      color: 'emerald',
    },
    {
      id: 'control',
      label: 'CONTROL SYSTEM',
      category: 'Processing',
      desc: 'Sub-milliwatt embedded RISC-V microcontroller coordinates sensor interrupts, local timetable databases, and e-Paper refresh states.',
      icon: Cpu,
      color: 'blue',
    },
    {
      id: 'interface',
      label: 'LOCAL INFO INTERFACE',
      category: 'Commuter Display',
      desc: 'Bistable ultra-low-power digital screen showing route number, destination, and deterministic arrival times in high-contrast sunlight.',
      icon: Tv,
      color: 'sky',
    },
    {
      id: 'solar',
      label: 'SOLAR ENERGY',
      category: 'Primary Harvesting',
      desc: 'Canopy-mounted monocrystalline photovoltaic array engineered to harvest diffuse ambient and direct sunlight across daylight hours.',
      icon: Sun,
      color: 'amber',
    },
    {
      id: 'piezo',
      label: 'PIEZOELECTRIC ENERGY',
      category: 'Kinetic Harvesting',
      desc: 'Sub-floor piezoelectric ceramic transducers convert passenger compressive footstep force into auxiliary micro-electrical pulses.',
      icon: Footprints,
      color: 'teal',
    },
    {
      id: 'storage',
      label: 'ENERGY STORAGE',
      category: 'Power Management',
      desc: 'Low-loss buffer bank with multi-input conditioning circuitry balancing intermittent solar and kinetic inputs for 24/7 reliability.',
      icon: BatteryCharging,
      color: 'indigo',
    },
  ];

  return (
    <div className="w-full bg-[#F4F5F7] text-[#1A1A1A]">
      {/* 1. HERO SECTION */}
      <section className="relative w-full border-b border-[#E2E4E8] bg-tech-grid pt-12 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Scientific Status Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-[#E2E4E8]/90 border border-[#DCDFE4] text-[11px] font-mono font-semibold uppercase tracking-wider mb-6 text-[#374151]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>ATL ENGINEERING RESEARCH · APPLIED TRANSIT & HARVESTING SYSTEM</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Col: Headlines & Content */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1A1A1A] leading-[1.08] font-display">
                REIMAGINING THE BUS STATION FOR A SMARTER, GREENER INDIA.
              </h1>
              
              <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed max-w-2xl">
                SunStride is a smart bus station prototype combining RFID-based vehicle tracking with hybrid solar and piezoelectric energy generation.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <button
                  id="hero-primary-cta"
                  onClick={() => onSelectTab('system')}
                  className="flex items-center justify-center gap-2.5 bg-[#1A1A1A] hover:bg-neutral-800 text-white font-mono font-semibold text-xs uppercase tracking-wider px-6 py-3.5 rounded transition-all cursor-pointer shadow-xs group"
                >
                  <span>EXPLORE SUNSTRIDE</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  id="hero-secondary-cta"
                  onClick={() => onSelectTab('lab')}
                  className="flex items-center justify-center gap-2.5 bg-white hover:bg-neutral-50 border border-[#DCDFE4] text-[#1A1A1A] font-mono font-semibold text-xs uppercase tracking-wider px-6 py-3.5 rounded transition-all cursor-pointer shadow-xs group"
                >
                  <span>ENTER INTERACTIVE LAB</span>
                  <Activity className="w-4 h-4 text-emerald-600 group-hover:rotate-12 transition-transform" />
                </button>
              </div>

              {/* Research Scope Note */}
              <div className="pt-4 border-t border-[#E2E4E8] flex items-center gap-4 text-xs font-mono text-[#6B7280]">
                <span>CORE PARADIGM:</span>
                <span className="text-[#1A1A1A] font-semibold">SMART MOBILITY + RENEWABLE ENERGY</span>
              </div>
            </div>

            {/* Right Col: Hero Interactive Schematic Visual */}
            <div className="lg:col-span-5">
              <div className="w-full bg-[#14171C] text-white rounded-xl border border-neutral-800 p-5 shadow-xl relative overflow-hidden diagram-area">
                {/* Visual Header */}
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4 text-[11px] font-mono text-neutral-400">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>SYSTEM TOPOLOGY // LIVE FLOW</span>
                  </div>
                  <button
                    onClick={() => setHeroPulseActive(!heroPulseActive)}
                    className="text-[10px] text-neutral-400 hover:text-white px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700 cursor-pointer"
                  >
                    {heroPulseActive ? 'PAUSE PULSE' : 'RESUME PULSE'}
                  </button>
                </div>

                {/* Energy & Data Convergence Diagram */}
                <div className="relative py-2 space-y-4">
                  {/* Energy Harvesting Row */}
                  <div className="p-3 bg-neutral-900/90 rounded-lg border border-neutral-800 space-y-2">
                    <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                      <span>01. Hybrid Energy Domain</span>
                      <span className="text-amber-400 font-semibold">HARVESTING</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded bg-neutral-950 border border-neutral-800 flex items-center gap-2">
                        <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                        <div>
                          <span className="text-[11px] font-semibold block text-neutral-200">Solar PV</span>
                          <span className="text-[9px] text-neutral-400">Canopy Array</span>
                        </div>
                      </div>
                      <div className="p-2 rounded bg-neutral-950 border border-neutral-800 flex items-center gap-2">
                        <Footprints className="w-4 h-4 text-cyan-400 shrink-0" />
                        <div>
                          <span className="text-[11px] font-semibold block text-neutral-200">Piezo Floor</span>
                          <span className="text-[9px] text-neutral-400">Kinetic Matrix</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Flow Arrow */}
                  <div className="flex items-center justify-center text-neutral-500">
                    <ArrowDown className={`w-4 h-4 ${heroPulseActive ? 'animate-bounce text-emerald-400' : ''}`} />
                  </div>

                  {/* Center Station Hub */}
                  <div className="p-3.5 bg-neutral-900/90 rounded-lg border border-emerald-500/40 space-y-2 relative">
                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-300">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                        SUNSTRIDE STATION CORE
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 text-[9px]">
                        POWER & LOGIC BALANCED
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-snug">
                      Conditioning energy inputs while monitoring RFID proximity antenna loop.
                    </p>
                  </div>

                  {/* Flow Arrow */}
                  <div className="flex items-center justify-center text-neutral-500">
                    <ArrowDown className={`w-4 h-4 ${heroPulseActive ? 'animate-bounce text-emerald-400' : ''}`} />
                  </div>

                  {/* Transportation & Passenger Row */}
                  <div className="p-3 bg-neutral-900/90 rounded-lg border border-neutral-800 space-y-2">
                    <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                      <span>02. Mobility & Information Domain</span>
                      <span className="text-emerald-400 font-semibold">DETERMINISTIC</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded bg-neutral-950 border border-neutral-800 flex items-center gap-2">
                        <Bus className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div>
                          <span className="text-[11px] font-semibold block text-neutral-200">Bus Approach</span>
                          <span className="text-[9px] text-neutral-400">Passive RFID Tag</span>
                        </div>
                      </div>
                      <div className="p-2 rounded bg-neutral-950 border border-neutral-800 flex items-center gap-2">
                        <Users className="w-4 h-4 text-sky-400 shrink-0" />
                        <div>
                          <span className="text-[11px] font-semibold block text-neutral-200">Passenger Info</span>
                          <span className="text-[9px] text-neutral-400">Digital Display</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subtitle footer inside schematic */}
                <div className="mt-4 pt-3 border-t border-neutral-800 text-[10px] font-mono text-neutral-500 flex items-center justify-between">
                  <span>INPUT: SUN + STEP</span>
                  <span>DETECTION: 13.56 MHz RFID</span>
                  <span>OUTPUT: COMMUTER UI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM SECTION */}
      <section className="py-20 bg-[#ECEEF2] border-b border-[#E2E4E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="max-w-3xl mb-14">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[#6B7280] block mb-2">
              THE MOTIVATION
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-display tracking-tight text-[#1A1A1A]">
              TWO INFRASTRUCTURE PROBLEMS. ONE INTEGRATED APPROACH.
            </h2>
            <p className="mt-3 text-[#4B5563] text-sm sm:text-base leading-relaxed">
              Modern public transportation networks in developing urban contexts face structural constraints in information accessibility and energy reliance.
            </p>
          </div>

          {/* Problem Cards Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
            {/* 01 / TRANSPORTATION */}
            <div className="bg-white p-8 rounded-lg border border-[#E2E4E8] shadow-xs space-y-4 relative">
              <div className="flex items-center justify-between border-b border-[#F3F4F6] pb-4">
                <span className="font-mono text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                  01 / TRANSPORTATION CHALLENGE
                </span>
                <span className="font-mono text-xs text-[#9CA3AF]">PASSENGER FRICTION</span>
              </div>
              <h3 className="text-xl font-bold font-display text-[#1A1A1A]">
                Limited access to real-time bus information
              </h3>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                Public transportation users often lack convenient, direct access to real-time bus schedules at suburban or peri-urban stops. While app-based GPS tracking exists, it relies on personal smartphone ownership, continuous mobile cellular data, and suffers from latency and satellite signal loss in dense urban corridors.
              </p>
              <div className="p-3 bg-[#F4F5F7] rounded border border-[#E2E4E8] text-xs font-mono text-[#374151] space-y-1">
                <span className="font-semibold block text-[#1A1A1A]">SUNSTRIDE EXPLORATION:</span>
                <span>Localized RFID interrogation detecting transit vehicles directly at station arrival without requiring continuous cloud polling.</span>
              </div>
            </div>

            {/* 02 / ENERGY */}
            <div className="bg-white p-8 rounded-lg border border-[#E2E4E8] shadow-xs space-y-4 relative">
              <div className="flex items-center justify-between border-b border-[#F3F4F6] pb-4">
                <span className="font-mono text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">
                  02 / ENERGY CHALLENGE
                </span>
                <span className="font-mono text-xs text-[#9CA3AF]">INFRASTRUCTURE DEPENDENCE</span>
              </div>
              <h3 className="text-xl font-bold font-display text-[#1A1A1A]">
                Public infrastructure depends on conventional electricity
              </h3>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                Standard digital bus kiosks and illuminated signage require continuous grid electricity connection, which is costly to trench into existing streets and susceptible to grid outages. Millions of physical transit shelters remain passive concrete or metal sheds with zero smart capabilities due to grid constraints.
              </p>
              <div className="p-3 bg-[#F4F5F7] rounded border border-[#E2E4E8] text-xs font-mono text-[#374151] space-y-1">
                <span className="font-semibold block text-[#1A1A1A]">SUNSTRIDE EXPLORATION:</span>
                <span>Hybrid solar and piezoelectric energy harvesting generating localized power to sustain low-power digital interfaces independently.</span>
              </div>
            </div>
          </div>

          {/* Convergence Bar */}
          <div className="mt-10 p-5 bg-[#14171C] text-white rounded-lg flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>THE CONVERGENCE:</span>
              <span className="text-neutral-300">
                Low-Power Sensing (RFID) + Hybrid Micro-Generation (Solar + Piezo) = Autonomous Station Node
              </span>
            </div>
            <button
              onClick={() => onSelectTab('about')}
              className="text-emerald-400 hover:text-emerald-300 underline cursor-pointer text-left whitespace-nowrap"
            >
              Read full conceptual synthesis →
            </button>
          </div>
        </div>
      </section>

      {/* 3. WHAT IS SUNSTRIDE? SECTION */}
      <section className="py-20 bg-[#F4F5F7] border-b border-[#E2E4E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[#6B7280] block mb-2">
              SYSTEM ARCHITECTURE
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-display tracking-tight text-[#1A1A1A]">
              A BUS STATION DESIGNED AS A SYSTEM.
            </h2>
            <p className="mt-3 text-[#4B5563] text-sm sm:text-base leading-relaxed">
              SunStride integrates 6 modular subsystems into an interconnected civil unit. Select any component below to examine its engineering role:
            </p>
          </div>

          {/* Interactive Component Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Component Buttons List (Left 5 Cols) */}
            <div className="lg:col-span-5 space-y-2">
              {stationComponents.map((comp) => {
                const isSelected = selectedStationComponent === comp.id;
                const IconComponent = comp.icon;
                return (
                  <button
                    key={comp.id}
                    id={`station-comp-btn-${comp.id}`}
                    onClick={() => setSelectedStationComponent(comp.id)}
                    className={`w-full text-left p-3.5 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-xs'
                        : 'bg-white text-[#374151] border-[#E2E4E8] hover:bg-[#ECEEF2]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded ${isSelected ? 'bg-neutral-800 text-emerald-400' : 'bg-[#ECEEF2] text-[#1A1A1A]'}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-mono text-xs font-bold block">{comp.label}</span>
                        <span className={`text-[10px] ${isSelected ? 'text-neutral-400' : 'text-[#6B7280]'}`}>
                          {comp.category}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-[#9CA3AF]'}`} />
                  </button>
                );
              })}
            </div>

            {/* Component Detail Card (Right 7 Cols) */}
            <div className="lg:col-span-7">
              {(() => {
                const current = stationComponents.find((c) => c.id === selectedStationComponent) || stationComponents[0];
                const Icon = current.icon;
                return (
                  <div className="bg-white p-6 sm:p-8 rounded-lg border border-[#E2E4E8] shadow-xs space-y-6">
                    <div className="flex items-center justify-between border-b border-[#F3F4F6] pb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-[#1A1A1A] text-white rounded-md">
                          <Icon className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase text-[#6B7280] font-semibold">
                            MODULE SPECIFICATION // {current.category}
                          </span>
                          <h3 className="text-xl font-bold font-display text-[#1A1A1A]">
                            {current.label}
                          </h3>
                        </div>
                      </div>
                      <span className="font-mono text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded font-semibold">
                        ACTIVE SUBSYSTEM
                      </span>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-mono font-bold text-[#1A1A1A] uppercase tracking-wider">
                        Functional Description
                      </h4>
                      <p className="text-sm text-[#4B5563] leading-relaxed">
                        {current.desc}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#F3F4F6] text-xs font-mono">
                      <div className="p-3 bg-[#F4F5F7] rounded border border-[#E2E4E8]">
                        <span className="text-[#6B7280] block text-[10px]">INTEGRATION ROLE:</span>
                        <span className="font-semibold text-[#1A1A1A] mt-0.5 block">
                          Interconnected to Station MCU & Energy Conditioning
                        </span>
                      </div>
                      <div className="p-3 bg-[#F4F5F7] rounded border border-[#E2E4E8]">
                        <span className="text-[#6B7280] block text-[10px]">RESEARCH FOCUS:</span>
                        <span className="font-semibold text-[#1A1A1A] mt-0.5 block">
                          Sub-watt efficiency and deterministic local response
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        onClick={() => onSelectTab('system')}
                        className="text-xs font-mono font-bold text-[#1A1A1A] hover:text-emerald-700 underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>View full architectural schematics in System page</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION */}
      <section className="py-20 bg-[#14171C] text-white border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-emerald-400 block mb-2">
              DUAL SYSTEM WORKFLOW
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-display tracking-tight text-white">
              HOW IT WORKS: MOBILITY & ENERGY PATHS.
            </h2>
            <p className="mt-3 text-neutral-400 text-sm sm:text-base leading-relaxed">
              Step through the synchronized physical-to-digital workflows powering SunStride:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Path 1: Transportation Workflow */}
            <div className="bg-[#1C2028] p-6 sm:p-8 rounded-lg border border-neutral-800 space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <span className="text-xs font-mono font-bold text-emerald-400 tracking-wider">
                  PATH A // TRANSPORTATION & INFORMATION
                </span>
                <span className="text-[10px] font-mono text-neutral-500">5-STEP SEQUENCE</span>
              </div>

              <div className="space-y-4">
                {[
                  { step: '01', title: 'BUS APPROACHES', desc: 'Transit vehicle enters the 5-meter approach lane perimeter of the station.' },
                  { step: '02', title: 'RFID IDENTIFICATION', desc: 'Station interrogator scans vehicle transponder, extracting UID and route parameters.' },
                  { step: '03', title: 'STATION PROCESSES EVENT', desc: 'Microcontroller decodes UID, verifies route schedule from local lookup table.' },
                  { step: '04', title: 'INFORMATION IS UPDATED', desc: 'Display memory buffer recalculates dwell ETA, route status, and occupancy indicator.' },
                  { step: '05', title: 'PASSENGER RECEIVES BUS STATUS', desc: 'High-contrast bistable screen displays updated arrival info clearly to waiting commuters.' },
                ].map((item, idx) => {
                  const stepNum = idx + 1;
                  return (
                    <div
                      key={item.step}
                      onClick={() => setActiveWorkFlowStep(stepNum)}
                      className={`p-3.5 rounded border transition-all cursor-pointer flex items-start gap-3.5 ${
                        activeWorkFlowStep === stepNum
                          ? 'bg-neutral-900 border-emerald-500/80 text-white'
                          : 'bg-neutral-950/60 border-neutral-800/80 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <div className={`font-mono text-xs font-bold px-2 py-1 rounded shrink-0 ${
                        activeWorkFlowStep === stepNum ? 'bg-emerald-500 text-black' : 'bg-neutral-800 text-neutral-400'
                      }`}>
                        {item.step}
                      </div>
                      <div>
                        <h4 className="text-xs font-mono font-bold text-white mb-0.5">{item.title}</h4>
                        <p className="text-xs text-neutral-400 leading-normal">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Path 2: Energy Harvesting Workflow */}
            <div className="bg-[#1C2028] p-6 sm:p-8 rounded-lg border border-neutral-800 space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <span className="text-xs font-mono font-bold text-amber-400 tracking-wider">
                  PATH B // HYBRID ENERGY HARVESTING
                </span>
                <span className="text-[10px] font-mono text-neutral-500">POWER FLOW</span>
              </div>

              <div className="space-y-4">
                {/* Sunlight */}
                <div className="p-4 rounded bg-neutral-950/80 border border-neutral-800 flex items-start gap-3.5">
                  <Sun className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-mono font-bold text-amber-400 block">SUNLIGHT → SOLAR GENERATION</span>
                    <p className="text-xs text-neutral-400 mt-1 leading-normal">
                      Continuous daytime photon irradiance produces baseline DC electrical charge through canopy-mounted PV cells.
                    </p>
                  </div>
                </div>

                {/* Foot Pressure */}
                <div className="p-4 rounded bg-neutral-950/80 border border-neutral-800 flex items-start gap-3.5">
                  <Footprints className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-mono font-bold text-cyan-400 block">FOOT PRESSURE → PIEZOELECTRIC GENERATION</span>
                    <p className="text-xs text-neutral-400 mt-1 leading-normal">
                      Compressive force from passenger footfalls excites sub-floor ceramic discs, producing high-voltage micro-pulses.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center text-neutral-500">
                  <ArrowDown className="w-4 h-4 text-neutral-400 animate-pulse" />
                </div>

                {/* Energy Management */}
                <div className="p-4 rounded bg-neutral-950/80 border border-neutral-800 flex items-start gap-3.5">
                  <BatteryCharging className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-mono font-bold text-indigo-400 block">ENERGY MANAGEMENT & STORAGE</span>
                    <p className="text-xs text-neutral-400 mt-1 leading-normal">
                      Synchronous Schottky bridge rectification and buck converter regulate pulses into a stabilized DC storage bank.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center text-neutral-500">
                  <ArrowDown className="w-4 h-4 text-neutral-400 animate-pulse" />
                </div>

                {/* Station System */}
                <div className="p-4 rounded bg-neutral-900 border border-emerald-500/50 flex items-start gap-3.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-mono font-bold text-white block">STATION SYSTEM CONSUMPTION</span>
                    <p className="text-xs text-neutral-400 mt-1 leading-normal">
                      Power is directed strictly to low-power RFID interrogation sweeps and static bistable display refresh cycles.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINAL CALL TO ACTION */}
      <section className="py-20 bg-[#F4F5F7]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#6B7280] block">
            INTERACTIVE SIMULATION
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-[#1A1A1A]">
            EXPLORE THE SYSTEM.
          </h2>
          <p className="text-base sm:text-lg text-[#4B5563] max-w-2xl mx-auto leading-relaxed">
            Go beyond the prototype and explore the research, architecture, and interactive simulations behind SunStride.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="home-bottom-cta-lab"
              onClick={() => onSelectTab('lab')}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#1A1A1A] hover:bg-neutral-800 text-white font-mono font-semibold text-xs uppercase tracking-wider px-8 py-4 rounded transition-all cursor-pointer shadow-xs group"
            >
              <span>ENTER INTERACTIVE LAB</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              id="home-bottom-cta-research"
              onClick={() => onSelectTab('research')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-[#ECEEF2] border border-[#DCDFE4] text-[#1A1A1A] font-mono font-semibold text-xs uppercase tracking-wider px-6 py-4 rounded transition-all cursor-pointer shadow-xs"
            >
              <span>RESEARCH METHODOLOGY →</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
