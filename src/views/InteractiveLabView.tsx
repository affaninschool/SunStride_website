import React, { useState, useEffect } from 'react';
import { PageTab, BusData } from '../types';
import { INITIAL_BUSES, SYSTEM_COMPONENTS } from '../data/projectData';
import { 
  FlaskConical, 
  Bus, 
  Radio, 
  Sun, 
  Footprints, 
  Cpu, 
  Tv, 
  BatteryCharging, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Sliders, 
  Zap, 
  Info,
  Link2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InteractiveLabViewProps {
  onSelectTab: (tab: PageTab) => void;
}

export const InteractiveLabView: React.FC<InteractiveLabViewProps> = ({ onSelectTab }) => {
  const [activeModule, setActiveModule] = useState<'tracking' | 'energy' | 'builder' | 'explorer'>('tracking');

  // --- MODULE 01: BUS TRACKING SIMULATOR STATE ---
  const [buses, setBuses] = useState<BusData[]>(INITIAL_BUSES);
  const [selectedBusId, setSelectedBusId] = useState<string>('bus-a');
  const [simState, setSimState] = useState<'idle' | 'approaching' | 'detecting' | 'processing' | 'arrived' | 'departing'>('idle');
  const [simLog, setSimLog] = useState<string[]>(['Ready. Select a transit bus and trigger approach.']);
  const [rfidPacket, setRfidPacket] = useState<string | null>(null);

  const selectedBus = buses.find((b) => b.id === selectedBusId) || buses[0];

  const handleSimulateArrival = () => {
    if (simState !== 'idle' && simState !== 'arrived') return;

    setSimState('approaching');
    setSimLog((prev) => [
      `[0.0s] ${selectedBus.routeNumber} (${selectedBus.name}) approaching station perimeter...`,
      ...prev,
    ]);

    setTimeout(() => {
      setSimState('detecting');
      setRfidPacket(selectedBus.rfidUid);
      setSimLog((prev) => [
        `[1.2s] RFID Interrogator detected transponder UID: ${selectedBus.rfidUid}`,
        ...prev,
      ]);

      setTimeout(() => {
        setSimState('processing');
        setSimLog((prev) => [
          `[2.0s] Station MCU matching UID with local schedule table. Signal valid.`,
          ...prev,
        ]);

        setTimeout(() => {
          setSimState('arrived');
          setBuses((prev) =>
            prev.map((b) => (b.id === selectedBus.id ? { ...b, status: 'At Station', nextArrivalMinutes: 0 } : b))
          );
          setSimLog((prev) => [
            `[2.8s] Passenger Information Display refreshed: ${selectedBus.routeNumber} ARRIVED AT BAY 1.`,
            ...prev,
          ]);
        }, 800);
      }, 800);
    }, 1200);
  };

  const handleResetSimulation = () => {
    setSimState('idle');
    setRfidPacket(null);
    setBuses(INITIAL_BUSES);
    setSimLog(['Simulation reset. Standby.']);
  };

  // --- MODULE 02: ENERGY LAB STATE ---
  const [solarIrradiance, setSolarIrradiance] = useState<number>(65); // 0 to 100%
  const [footTraffic, setFootTraffic] = useState<number>(40); // 0 to 100%

  // Calculations (Conceptual simulation)
  const solarOutputWatts = Number(((solarIrradiance / 100) * 45).toFixed(1)); // max 45W
  const piezoOutputWatts = Number(((footTraffic / 100) * 8.5).toFixed(1)); // max 8.5W
  const totalHarvestedWatts = Number((solarOutputWatts + piezoOutputWatts).toFixed(1));
  const stationBaseLoadWatts = 4.2; // MCU + RFID scan pulse + Display refresh average
  const netEnergyBalanceWatts = Number((totalHarvestedWatts - stationBaseLoadWatts).toFixed(1));

  // --- MODULE 03: BUILD THE STATION STATE ---
  const initialNodes = [
    { id: 'solar', label: 'Solar Canopy Array', category: 'source', connectedTo: [] as string[] },
    { id: 'piezo', label: 'Piezo Floor Matrix', category: 'source', connectedTo: [] as string[] },
    { id: 'storage', label: 'Energy Management / Buffer', category: 'storage', connectedTo: [] as string[] },
    { id: 'rfid', label: 'RFID Interrogator', category: 'sensor', connectedTo: [] as string[] },
    { id: 'bus', label: 'Transit Bus (RFID Tag)', category: 'vehicle', connectedTo: [] as string[] },
    { id: 'controller', label: 'Station MCU Controller', category: 'controller', connectedTo: [] as string[] },
    { id: 'display', label: 'Passenger Information UI', category: 'output', connectedTo: [] as string[] },
  ];

  const [connectedPairs, setConnectedPairs] = useState<{ from: string; to: string }[]>([
    { from: 'solar', to: 'storage' },
  ]);
  const [selectedConnectFrom, setSelectedConnectFrom] = useState<string | null>(null);

  const toggleConnection = (fromId: string, toId: string) => {
    if (fromId === toId) return;
    const exists = connectedPairs.some(
      (p) => (p.from === fromId && p.to === toId) || (p.from === toId && p.to === fromId)
    );
    if (exists) {
      setConnectedPairs((prev) =>
        prev.filter((p) => !(p.from === fromId && p.to === toId) && !(p.from === toId && p.to === fromId))
      );
    } else {
      setConnectedPairs((prev) => [...prev, { from: fromId, to: toId }]);
    }
  };

  // Validation rules for station circuit
  const hasEnergyHarvesting =
    connectedPairs.some((p) => (p.from === 'solar' && p.to === 'storage') || (p.from === 'storage' && p.to === 'solar')) ||
    connectedPairs.some((p) => (p.from === 'piezo' && p.to === 'storage') || (p.from === 'storage' && p.to === 'piezo'));

  const hasPowerToMcu = connectedPairs.some(
    (p) => (p.from === 'storage' && p.to === 'controller') || (p.from === 'controller' && p.to === 'storage')
  );

  const hasRfidDetection =
    connectedPairs.some((p) => (p.from === 'bus' && p.to === 'rfid') || (p.from === 'rfid' && p.to === 'bus')) &&
    connectedPairs.some((p) => (p.from === 'rfid' && p.to === 'controller') || (p.from === 'controller' && p.to === 'rfid'));

  const hasPassengerDisplay = connectedPairs.some(
    (p) => (p.from === 'controller' && p.to === 'display') || (p.from === 'display' && p.to === 'controller')
  );

  const isCompleteCircuit = hasEnergyHarvesting && hasPowerToMcu && hasRfidDetection && hasPassengerDisplay;

  // --- MODULE 04: SYSTEM EXPLORER STATE ---
  const [explorerComponentId, setExplorerComponentId] = useState<string>('rfid-reader');
  const explorerComp = SYSTEM_COMPONENTS.find((c) => c.id === explorerComponentId) || SYSTEM_COMPONENTS[0];

  return (
    <div className="w-full bg-[#F4F5F7] text-[#1A1A1A]">
      {/* 1. HERO */}
      <section className="border-b border-[#E2E4E8] bg-tech-grid pt-14 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#E2E4E8] text-[10px] font-mono font-bold uppercase tracking-wider text-[#374151]">
              <FlaskConical className="w-3.5 h-3.5 text-emerald-600" />
              <span>INTERACTIVE ENGINEERING SANDBOX</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-[#1A1A1A]">
              ENTER THE SUNSTRIDE LAB
            </h1>
            <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed">
              Explore the system through interactive simulations, energy modeling, and virtual system integration experiments.
            </p>
          </div>

          {/* Module Selector Navigation Tabs */}
          <div className="mt-8 flex flex-wrap gap-2 font-mono text-xs">
            {[
              { id: 'tracking', label: '01 / BUS TRACKING SIMULATOR', icon: Bus },
              { id: 'energy', label: '02 / ENERGY LAB & HARVESTING', icon: Sun },
              { id: 'builder', label: '03 / BUILD THE STATION', icon: Link2 },
              { id: 'explorer', label: '04 / SYSTEM EXPLORER', icon: Cpu },
            ].map((mod) => {
              const isActive = activeModule === mod.id;
              const Icon = mod.icon;
              return (
                <button
                  key={mod.id}
                  id={`lab-tab-${mod.id}`}
                  onClick={() => setActiveModule(mod.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all cursor-pointer font-semibold ${
                    isActive
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-xs'
                      : 'bg-white text-[#374151] border-[#E2E4E8] hover:bg-[#ECEEF2]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-[#6B7280]'}`} />
                  <span>{mod.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. LAB MODULE CONTAINER */}
      <section className="py-12 border-b border-[#E2E4E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ========================================================================= */}
          {/* MODULE 01: BUS TRACKING SIMULATOR */}
          {/* ========================================================================= */}
          {activeModule === 'tracking' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono font-bold text-emerald-600 uppercase">
                    SIMULATION MODULE 01
                  </span>
                  <h2 className="text-2xl font-bold font-display text-[#1A1A1A]">
                    RFID Vehicle Proximity & Telemetry Simulator
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    id="lab-bus-arrive-btn"
                    onClick={handleSimulateArrival}
                    disabled={simState === 'approaching' || simState === 'detecting' || simState === 'processing'}
                    className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-neutral-800 disabled:opacity-50 text-white font-mono text-xs font-bold px-4 py-2 rounded cursor-pointer shadow-xs"
                  >
                    <Play className="w-3.5 h-3.5 fill-current text-emerald-400" />
                    <span>ARRIVE AT STATION</span>
                  </button>
                  <button
                    id="lab-bus-reset-btn"
                    onClick={handleResetSimulation}
                    className="flex items-center gap-1.5 bg-white hover:bg-[#ECEEF2] border border-[#DCDFE4] text-[#374151] font-mono text-xs px-3 py-2 rounded cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>RESET</span>
                  </button>
                </div>
              </div>

              {/* Bus Selection Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {buses.map((bus) => {
                  const isSelected = selectedBusId === bus.id;
                  return (
                    <div
                      key={bus.id}
                      onClick={() => setSelectedBusId(bus.id)}
                      className={`p-4 rounded-lg border transition-all cursor-pointer font-mono text-xs ${
                        isSelected
                          ? 'bg-white border-[#1A1A1A] shadow-xs ring-1 ring-[#1A1A1A]'
                          : 'bg-white border-[#E2E4E8] hover:border-[#DCDFE4]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-[#1A1A1A]">{bus.routeNumber}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          bus.status === 'At Station'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-neutral-100 text-neutral-600'
                        }`}>
                          {bus.status}
                        </span>
                      </div>
                      <p className="text-[#4B5563] font-sans text-sm font-medium">{bus.name}</p>
                      <div className="mt-3 pt-2 border-t border-[#F3F4F6] text-[11px] text-[#6B7280] flex justify-between">
                        <span>Tag: {bus.rfidUid.slice(0, 11)}...</span>
                        <span>{bus.occupancy} Load</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Virtual Station Simulator Stage */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Visual Stage (Left 7 Cols) */}
                <div className="lg:col-span-7 bg-[#14171C] rounded-xl border border-neutral-800 p-6 text-white relative overflow-hidden diagram-area">
                  <div className="absolute inset-0 bg-tech-grid-dark opacity-20 pointer-events-none" />

                  {/* Stage Status Header */}
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-6 text-xs font-mono text-neutral-400">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>STATION APPROACH BAY 01</span>
                    </div>
                    <span>SIMULATION PHASE: {simState.toUpperCase()}</span>
                  </div>

                  {/* Animated Road & Station Layout */}
                  <div className="relative h-64 border border-neutral-800 rounded-lg bg-neutral-950/80 p-4 flex flex-col justify-between overflow-hidden">
                    {/* RFID Interrogation Zone Radius */}
                    <div className="absolute right-12 top-1/2 -translate-y-1/2 w-36 h-36 rounded-full border border-emerald-500/20 flex items-center justify-center pointer-events-none">
                      <div className={`w-28 h-28 rounded-full border border-dashed border-emerald-400/40 ${simState === 'detecting' ? 'animate-spin' : ''}`} />
                      <div className="text-[9px] font-mono text-emerald-400/60 absolute -bottom-4">
                        RFID DETECTION ZONE
                      </div>
                    </div>

                    {/* Approaching Transit Bus Object */}
                    <motion.div
                      className="absolute top-1/2 -translate-y-1/2 z-20 flex items-center gap-3"
                      initial={{ left: '5%' }}
                      animate={{
                        left:
                          simState === 'idle'
                            ? '5%'
                            : simState === 'approaching'
                            ? '40%'
                            : simState === 'detecting' || simState === 'processing' || simState === 'arrived'
                            ? '65%'
                            : '5%',
                      }}
                      transition={{ duration: 1.2, ease: 'easeInOut' }}
                    >
                      <div className="p-3 bg-neutral-900 border border-emerald-500/60 rounded-lg shadow-lg flex items-center gap-2.5">
                        <Bus className="w-6 h-6 text-emerald-400" />
                        <div className="text-xs font-mono">
                          <span className="font-bold block text-white">{selectedBus.routeNumber}</span>
                          <span className="text-[9px] text-neutral-400">PASSIVE RFID TAG</span>
                        </div>
                      </div>

                      {/* Transponder RF wave pulse */}
                      {(simState === 'detecting' || simState === 'processing') && (
                        <div className="w-8 h-8 rounded-full border-2 border-emerald-400 animate-ping" />
                      )}
                    </motion.div>

                    {/* Station Pole & Interrogator Graphic */}
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                      <div className={`p-3 rounded-lg border ${
                        simState === 'detecting' || simState === 'processing' || simState === 'arrived'
                          ? 'bg-emerald-950/80 border-emerald-400 text-white'
                          : 'bg-neutral-900 border-neutral-700 text-neutral-400'
                      }`}>
                        <Radio className="w-6 h-6 text-emerald-400" />
                      </div>
                      <span className="text-[10px] font-mono text-neutral-300 mt-1 font-semibold">STATION POLE</span>
                      <span className="text-[8px] font-mono text-emerald-400">RFID READER</span>
                    </div>
                  </div>

                  {/* Packet Telemetry Payload */}
                  <div className="mt-4 p-3 bg-neutral-900 rounded border border-neutral-800 font-mono text-xs flex items-center justify-between">
                    <div>
                      <span className="text-neutral-400 text-[10px] block">INTERROGATION PACKET:</span>
                      <span className="text-emerald-400 font-semibold">{rfidPacket || 'Awaiting proximity trigger...'}</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      simState === 'arrived' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'text-neutral-500'
                    }`}>
                      {simState === 'arrived' ? 'EVENT PROCESSED' : 'IDLE'}
                    </span>
                  </div>
                </div>

                {/* Simulated Passenger Information Display (Right 5 Cols) */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-white p-5 rounded-xl border border-[#E2E4E8] shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-[#F3F4F6] pb-3">
                      <div className="flex items-center gap-2">
                        <Tv className="w-4 h-4 text-[#1A1A1A]" />
                        <span className="font-mono text-xs font-bold text-[#1A1A1A]">
                          STATION PASSENGER DISPLAY (PID)
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                        E-PAPER SIMULATION
                      </span>
                    </div>

                    {/* e-Paper Frame UI */}
                    <div className="p-4 bg-[#F0F2F5] border-2 border-[#1A1A1A] rounded-md font-mono space-y-3">
                      <div className="flex items-center justify-between border-b border-[#DCDFE4] pb-2 text-[11px] text-[#374151]">
                        <span className="font-bold">SUNSTRIDE CENTRAL STATION</span>
                        <span>14:28:04</span>
                      </div>

                      {/* Arriving Route Display */}
                      <div className="p-3 bg-white border border-[#DCDFE4] rounded space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-[#1A1A1A]">{selectedBus.routeNumber}</span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                            simState === 'arrived' ? 'bg-emerald-600 text-white' : 'bg-neutral-200 text-neutral-800'
                          }`}>
                            {simState === 'arrived' ? 'STATUS: AT BAY 1' : 'STATUS: EN ROUTE'}
                          </span>
                        </div>
                        <p className="text-xs text-[#4B5563] font-sans">{selectedBus.destination}</p>
                        <div className="pt-2 text-[11px] text-[#6B7280] flex justify-between border-t border-neutral-100">
                          <span>ETA: {simState === 'arrived' ? 'NOW' : `${selectedBus.nextArrivalMinutes} min`}</span>
                          <span>Load: {selectedBus.occupancy}</span>
                        </div>
                      </div>

                      {/* Notice */}
                      <p className="text-[10px] text-[#6B7280] italic">
                        Bistable display draws 0.0W holding static frame; refreshes only on RFID interrupt.
                      </p>
                    </div>

                    {/* Log Terminal Box */}
                    <div className="p-3 bg-[#14171C] text-neutral-300 rounded font-mono text-[11px] h-32 overflow-y-auto space-y-1">
                      <div className="text-[10px] text-neutral-500 border-b border-neutral-800 pb-1 mb-1">
                        EVENT EXECUTION LOG
                      </div>
                      {simLog.map((log, i) => (
                        <div key={i} className="leading-tight text-neutral-300">
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* MODULE 02: ENERGY LAB & HARVESTING */}
          {/* ========================================================================= */}
          {activeModule === 'energy' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono font-bold text-amber-600 uppercase">
                    SIMULATION MODULE 02
                  </span>
                  <h2 className="text-2xl font-bold font-display text-[#1A1A1A]">
                    Hybrid Renewable Energy & Harvesting Lab
                  </h2>
                </div>
                <div className="px-3 py-1 bg-[#ECEEF2] border border-[#DCDFE4] rounded text-neutral-700 text-xs font-mono font-semibold">
                  CONCEPTUAL SIMULATION // NOT SCIENTIFIC CLAIMS
                </div>
              </div>

              {/* Controls and Yield Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Interactive Sliders (Left 6 Cols) */}
                <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-xl border border-[#E2E4E8] shadow-xs space-y-6">
                  <h3 className="text-base font-bold font-display text-[#1A1A1A] flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-emerald-600" />
                    <span>Environmental Input Controls</span>
                  </h3>

                  {/* 1. Solar Input Slider */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="font-bold flex items-center gap-1.5 text-[#1A1A1A]">
                        <Sun className="w-4 h-4 text-amber-500" />
                        SOLAR IRRADIANCE
                      </span>
                      <span className="text-amber-600 font-bold">{solarIrradiance}% (Daylight flux)</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={solarIrradiance}
                      onChange={(e) => setSolarIrradiance(Number(e.target.value))}
                      className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-[#6B7280]">
                      <span>LOW (Overcast / Dusk)</span>
                      <span>MEDIUM (Diffuse)</span>
                      <span>HIGH (Peak Noon Sun)</span>
                    </div>
                  </div>

                  {/* 2. Foot Traffic Slider */}
                  <div className="space-y-2 pt-4 border-t border-[#F3F4F6]">
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="font-bold flex items-center gap-1.5 text-[#1A1A1A]">
                        <Footprints className="w-4 h-4 text-cyan-600" />
                        PEDESTRIAN FOOT TRAFFIC
                      </span>
                      <span className="text-cyan-700 font-bold">{footTraffic}% (Steps density)</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={footTraffic}
                      onChange={(e) => setFootTraffic(Number(e.target.value))}
                      className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-[#6B7280]">
                      <span>LOW (Off-peak)</span>
                      <span>MODERATE (Regular)</span>
                      <span>HIGH (Commute Rush)</span>
                    </div>
                  </div>

                  {/* Formula description */}
                  <div className="p-3.5 bg-[#F4F5F7] rounded border border-[#E2E4E8] text-xs font-mono text-[#4B5563] space-y-1">
                    <span className="font-bold text-[#1A1A1A] block uppercase text-[10px]">
                      HYBRID HARVESTING PHYSICS:
                    </span>
                    <p className="text-[11px] leading-relaxed">
                      Total Power = P_solar(Irradiance, Area, η_mppt) + P_piezo(Steps/min, Force, η_rectifier).
                    </p>
                  </div>
                </div>

                {/* Energy Balance Readout (Right 6 Cols) */}
                <div className="lg:col-span-6 bg-[#14171C] text-white p-6 sm:p-8 rounded-xl border border-neutral-800 space-y-6 shadow-md">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-3 text-xs font-mono text-neutral-400">
                    <span className="text-emerald-400 font-bold">POWER MANAGEMENT TELEMETRY</span>
                    <span>BUFFER BANK: 12.8V LiFePO4</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Solar Contribution */}
                    <div className="p-3.5 bg-neutral-900 rounded border border-neutral-800 font-mono">
                      <span className="text-[10px] text-neutral-400 uppercase block">Solar PV Output</span>
                      <span className="text-xl font-bold text-amber-400 font-display mt-1 block">
                        {solarOutputWatts} W
                      </span>
                      <span className="text-[9px] text-neutral-500">Canopy array yield</span>
                    </div>

                    {/* Piezo Contribution */}
                    <div className="p-3.5 bg-neutral-900 rounded border border-neutral-800 font-mono">
                      <span className="text-[10px] text-neutral-400 uppercase block">Piezo Kinetic Output</span>
                      <span className="text-xl font-bold text-cyan-400 font-display mt-1 block">
                        {piezoOutputWatts} W
                      </span>
                      <span className="text-[9px] text-neutral-500">Sub-floor rectified pulses</span>
                    </div>
                  </div>

                  {/* Total vs Load */}
                  <div className="p-4 bg-neutral-900/90 rounded border border-emerald-500/40 space-y-2 font-mono">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-300">TOTAL HARVESTED POWER:</span>
                      <span className="text-base font-bold text-emerald-400 font-display">{totalHarvestedWatts} W</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-400">STATION BASE LOAD:</span>
                      <span className="text-xs text-neutral-300">{stationBaseLoadWatts} W (MCU + RFID + e-Paper)</span>
                    </div>
                    <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs">
                      <span className="font-bold text-white">NET BUFFER BALANCE:</span>
                      <span className={`font-bold ${netEnergyBalanceWatts >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {netEnergyBalanceWatts >= 0 ? `+${netEnergyBalanceWatts} W (Surplus Charging)` : `${netEnergyBalanceWatts} W (Buffer Depleting)`}
                      </span>
                    </div>
                  </div>

                  <p className="text-[10px] font-mono text-neutral-500">
                    * Values shown are illustrative mathematical modeling based on bench prototype scaling factors.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* MODULE 03: BUILD THE STATION */}
          {/* ========================================================================= */}
          {activeModule === 'builder' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono font-bold text-sky-600 uppercase">
                    SIMULATION MODULE 03
                  </span>
                  <h2 className="text-2xl font-bold font-display text-[#1A1A1A]">
                    Station Circuit Integration & Link Builder
                  </h2>
                </div>
                <button
                  id="lab-builder-reset-btn"
                  onClick={() => setConnectedPairs([{ from: 'solar', to: 'storage' }])}
                  className="text-xs font-mono text-[#374151] hover:text-[#1A1A1A] underline cursor-pointer self-start sm:self-auto"
                >
                  Reset Link Matrix
                </button>
              </div>

              <div className="p-4 bg-white rounded-lg border border-[#E2E4E8] text-xs font-mono text-[#4B5563]">
                <span className="font-bold text-[#1A1A1A] block mb-1">ENGINEERING OBJECTIVE:</span>
                Create logical connections: <span className="font-semibold text-emerald-700">ENERGY SOURCES → ENERGY STORAGE → MCU CONTROLLER → SENSORS (RFID + BUS) → DISPLAY</span>.
                Select two components below to toggle a link.
              </div>

              {/* Node Matrix Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {initialNodes.map((node) => {
                  const isSelectedForConnect = selectedConnectFrom === node.id;
                  const activeConnections = connectedPairs.filter(
                    (p) => p.from === node.id || p.to === node.id
                  );

                  return (
                    <div
                      key={node.id}
                      onClick={() => {
                        if (!selectedConnectFrom) {
                          setSelectedConnectFrom(node.id);
                        } else {
                          toggleConnection(selectedConnectFrom, node.id);
                          setSelectedConnectFrom(null);
                        }
                      }}
                      className={`p-4 rounded-lg border transition-all cursor-pointer font-mono text-xs relative ${
                        isSelectedForConnect
                          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] ring-2 ring-emerald-400'
                          : 'bg-white text-[#374151] border-[#E2E4E8] hover:border-[#DCDFE4]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] uppercase text-[#6B7280] font-bold">
                          {node.category}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#ECEEF2] text-[#374151]">
                          {activeConnections.length} Links
                        </span>
                      </div>
                      <h4 className="font-bold text-sm mb-1">{node.label}</h4>
                      <div className="text-[10px] text-[#6B7280] pt-2 border-t border-[#F3F4F6]">
                        {isSelectedForConnect ? 'Click another component to connect' : 'Click to link'}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Circuit Diagnostics Feedback Card */}
              <div className="bg-[#14171C] text-white p-6 rounded-xl border border-neutral-800 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3 font-mono text-xs">
                  <span className="text-emerald-400 font-bold">INTEGRATED CIRCUIT DIAGNOSTICS</span>
                  <span>{connectedPairs.length} ACTIVE PHYSICAL LINKS</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
                  <div className={`p-3 rounded border ${hasEnergyHarvesting ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300' : 'bg-neutral-900 border-neutral-800 text-neutral-500'}`}>
                    <span>1. Power Harvester → Storage</span>
                    <span className="block font-bold mt-1">{hasEnergyHarvesting ? '✓ CONNECTED' : '✗ DISCONNECTED'}</span>
                  </div>

                  <div className={`p-3 rounded border ${hasPowerToMcu ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300' : 'bg-neutral-900 border-neutral-800 text-neutral-500'}`}>
                    <span>2. Storage → MCU Controller</span>
                    <span className="block font-bold mt-1">{hasPowerToMcu ? '✓ CONNECTED' : '✗ DISCONNECTED'}</span>
                  </div>

                  <div className={`p-3 rounded border ${hasRfidDetection ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300' : 'bg-neutral-900 border-neutral-800 text-neutral-500'}`}>
                    <span>3. Bus → RFID → MCU</span>
                    <span className="block font-bold mt-1">{hasRfidDetection ? '✓ CONNECTED' : '✗ DISCONNECTED'}</span>
                  </div>

                  <div className={`p-3 rounded border ${hasPassengerDisplay ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300' : 'bg-neutral-900 border-neutral-800 text-neutral-500'}`}>
                    <span>4. MCU → Passenger Display</span>
                    <span className="block font-bold mt-1">{hasPassengerDisplay ? '✓ CONNECTED' : '✗ DISCONNECTED'}</span>
                  </div>
                </div>

                {isCompleteCircuit ? (
                  <div className="p-3 bg-emerald-900/60 border border-emerald-500 rounded text-emerald-200 text-xs font-mono flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>SYSTEM COMPLETE: Fully closed energy-aware transit detection loop established.</span>
                  </div>
                ) : (
                  <div className="p-3 bg-amber-950/60 border border-amber-500/50 rounded text-amber-200 text-xs font-mono flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>INCOMPLETE TOPOLOGY: Link the remaining subsystems to complete the station loop.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* MODULE 04: SYSTEM EXPLORER */}
          {/* ========================================================================= */}
          {activeModule === 'explorer' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono font-bold text-teal-600 uppercase">
                    SIMULATION MODULE 04
                  </span>
                  <h2 className="text-2xl font-bold font-display text-[#1A1A1A]">
                    Station Anatomy & Component Explorer
                  </h2>
                </div>
              </div>

              {/* Exploded Station Layout Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Station Visual Hotspot Schematic (Left 7 Cols) */}
                <div className="lg:col-span-7 bg-[#14171C] text-white p-6 rounded-xl border border-neutral-800 relative overflow-hidden diagram-area">
                  <div className="absolute inset-0 bg-tech-grid-dark opacity-20 pointer-events-none" />

                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-3 text-xs font-mono text-neutral-400">
                      <span className="text-emerald-400 font-bold">2D SCHEMATIC CAD VIEW</span>
                      <span>SELECT HOTSPOT TO INSPECT</span>
                    </div>

                    {/* Schematic Station Graphic with Interactive Hotspots */}
                    <div className="relative h-72 border border-neutral-800 rounded-lg bg-neutral-950 p-6 flex flex-col justify-between">
                      {/* Roof Canopy Hotspot */}
                      <button
                        onClick={() => setExplorerComponentId('solar-pv')}
                        className={`absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded border font-mono text-xs transition-all cursor-pointer flex items-center gap-2 ${
                          explorerComponentId === 'solar-pv'
                            ? 'bg-amber-950 border-amber-400 text-amber-200 ring-1 ring-amber-400'
                            : 'bg-neutral-900 border-neutral-700 text-neutral-300'
                        }`}
                      >
                        <Sun className="w-4 h-4 text-amber-400" />
                        <span>CANOPY SOLAR PV</span>
                      </button>

                      {/* Middle Column: Display & MCU */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3">
                        <button
                          onClick={() => setExplorerComponentId('display-interface')}
                          className={`px-3 py-2 rounded border font-mono text-xs transition-all cursor-pointer flex items-center gap-2 ${
                            explorerComponentId === 'display-interface'
                              ? 'bg-sky-950 border-sky-400 text-sky-200 ring-1 ring-sky-400'
                              : 'bg-neutral-900 border-neutral-700 text-neutral-300'
                          }`}
                        >
                          <Tv className="w-3.5 h-3.5 text-sky-400" />
                          <span>PASSENGER UI</span>
                        </button>

                        <button
                          onClick={() => setExplorerComponentId('controller-mcu')}
                          className={`px-3 py-2 rounded border font-mono text-xs transition-all cursor-pointer flex items-center gap-2 ${
                            explorerComponentId === 'controller-mcu'
                              ? 'bg-blue-950 border-blue-400 text-blue-200 ring-1 ring-blue-400'
                              : 'bg-neutral-900 border-neutral-700 text-neutral-300'
                          }`}
                        >
                          <Cpu className="w-3.5 h-3.5 text-blue-400" />
                          <span>MCU LOGIC</span>
                        </button>
                      </div>

                      {/* Right Edge: RFID Reader */}
                      <button
                        onClick={() => setExplorerComponentId('rfid-reader')}
                        className={`absolute right-4 top-1/2 -translate-y-1/2 px-3 py-2 rounded border font-mono text-xs transition-all cursor-pointer flex items-center gap-2 ${
                          explorerComponentId === 'rfid-reader'
                            ? 'bg-emerald-950 border-emerald-400 text-emerald-200 ring-1 ring-emerald-400'
                            : 'bg-neutral-900 border-neutral-700 text-neutral-300'
                        }`}
                      >
                        <Radio className="w-3.5 h-3.5 text-emerald-400" />
                        <span>RFID ANTENNA</span>
                      </button>

                      {/* Floor Hotspot: Piezo Matrix */}
                      <button
                        onClick={() => setExplorerComponentId('piezo-array')}
                        className={`absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded border font-mono text-xs transition-all cursor-pointer flex items-center gap-2 ${
                          explorerComponentId === 'piezo-array'
                            ? 'bg-teal-950 border-teal-400 text-teal-200 ring-1 ring-teal-400'
                            : 'bg-neutral-900 border-neutral-700 text-neutral-300'
                        }`}
                      >
                        <Footprints className="w-4 h-4 text-teal-400" />
                        <span>PIEZO FOOTSTEP MATRIX</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Subsystem Specifications Card (Right 5 Cols) */}
                <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-[#E2E4E8] shadow-xs space-y-4">
                  <div className="border-b border-[#F3F4F6] pb-3">
                    <span className="text-[10px] font-mono font-bold text-emerald-600 uppercase">
                      INSPECTING COMPONENT
                    </span>
                    <h3 className="text-xl font-bold font-display text-[#1A1A1A] mt-0.5">
                      {explorerComp.name}
                    </h3>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="font-mono font-bold text-[#1A1A1A] uppercase block mb-0.5">
                        FUNCTION:
                      </span>
                      <p className="text-[#4B5563] leading-relaxed">{explorerComp.functionDesc}</p>
                    </div>

                    <div>
                      <span className="font-mono font-bold text-[#1A1A1A] uppercase block mb-0.5">
                        ROLE IN SUNSTRIDE:
                      </span>
                      <p className="text-[#4B5563] leading-relaxed">{explorerComp.roleInSunstride}</p>
                    </div>

                    <div>
                      <span className="font-mono font-bold text-[#1A1A1A] uppercase block mb-0.5">
                        WHY IT MATTERS:
                      </span>
                      <p className="text-[#4B5563] leading-relaxed">{explorerComp.whyItMatters}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#F3F4F6]">
                    <button
                      onClick={() => onSelectTab('docs')}
                      className="text-xs font-mono font-bold text-[#1A1A1A] underline hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Read full hardware specification in Documentation</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
