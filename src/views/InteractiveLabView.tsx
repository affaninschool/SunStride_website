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
  ArrowRight,
  ExternalLink,
  Sparkles,
  HelpCircle,
  Activity,
  Gauge,
  MapPin,
  ChevronRight,
  Clock,
  ShieldCheck,
  ShieldAlert,
  X,
  Volume2,
  VolumeX,
  Award,
  Layers,
  Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InteractiveLabViewProps {
  onSelectTab: (tab: PageTab) => void;
}

export const InteractiveLabView: React.FC<InteractiveLabViewProps> = ({ onSelectTab }) => {
  const [activeModule, setActiveModule] = useState<'tracking' | 'energy' | 'builder' | 'explorer'>('tracking');
  const [showTeacherGuide, setShowTeacherGuide] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // --- MODULE 01: BUS TRACKING SIMULATOR STATE ---
  const [buses, setBuses] = useState<BusData[]>(INITIAL_BUSES);
  const [selectedBusId, setSelectedBusId] = useState<string>('bus-sx01');
  const [simState, setSimState] = useState<'idle' | 'approaching' | 'detecting' | 'processing' | 'arrived' | 'rejected'>('idle');
  const [simLog, setSimLog] = useState<string[]>([
    '[SYSTEM BOOT] Station node ESP8266-ATL-01 online on local bus.',
    '[HARDWARE] MFRC522 13.56 MHz RFID reader initialized.',
    '[READY] Select any bus or the Unknown Card test, then click "Simulate Arrival".'
  ]);
  const [rfidPacket, setRfidPacket] = useState<string | null>('A3 F2 19 7C');
  const [isUnknownTagTest, setIsUnknownTagTest] = useState<boolean>(false);

  const selectedBus = buses.find((b) => b.id === selectedBusId) || buses[0];

  // Beep sound simulator using Web Audio API for tactile exhibition experience
  const playBeep = (type: 'detect' | 'success' | 'warn') => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'detect') {
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'success') {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16); // G5
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
        osc.start();
        osc.stop(ctx.currentTime + 0.28);
      } else {
        osc.frequency.setValueAtTime(260, ctx.currentTime);
        osc.frequency.setValueAtTime(220, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch {
      // Audio not permitted or supported; silent fallback
    }
  };

  const handleSimulateArrival = () => {
    if (simState === 'approaching' || simState === 'detecting' || simState === 'processing') return;

    if (isUnknownTagTest) {
      // Simulation of an unregistered RFID card / intruder tag
      setSimState('approaching');
      setSimLog((prev) => [
        `[0.0s] Approaching object with unregistered RFID token enters MFRC522 detection perimeter...`,
        ...prev,
      ]);

      setTimeout(() => {
        setSimState('detecting');
        setRfidPacket('E7 9A 41 BC');
        playBeep('detect');
        setSimLog((prev) => [
          `[1.1s] MFRC522 RF interrogation detected transponder: UID [E7 9A 41 BC]`,
          ...prev,
        ]);

        setTimeout(() => {
          setSimState('processing');
          setSimLog((prev) => [
            `[1.9s] ESP8266 MCU comparing UID [E7 9A 41 BC] with authorized transit fleet table...`,
            ...prev,
          ]);

          setTimeout(() => {
            setSimState('rejected');
            playBeep('warn');
            setSimLog((prev) => [
              `[2.6s] ⚠️ SECURITY ALERT: UID not recognized. Access/logging rejected. Display suppressed.`,
              ...prev,
            ]);
          }, 800);
        }, 800);
      }, 1100);
      return;
    }

    // Normal authorized bus arrival
    setSimState('approaching');
    setSimLog((prev) => [
      `[0.0s] ${selectedBus.name} (${selectedBus.code || selectedBus.routeNumber}) approaching station bay...`,
      ...prev,
    ]);

    setTimeout(() => {
      setSimState('detecting');
      setRfidPacket(selectedBus.rfidUid);
      playBeep('detect');
      setSimLog((prev) => [
        `[1.1s] MFRC522 RF interrogation detected vehicle transponder: UID [${selectedBus.rfidUid}]`,
        ...prev,
      ]);

      setTimeout(() => {
        setSimState('processing');
        setSimLog((prev) => [
          `[1.9s] ESP8266 MCU matched UID [${selectedBus.rfidUid}] ➔ Verified: ${selectedBus.name}. Local telematics updated.`,
          ...prev,
        ]);

        setTimeout(() => {
          setSimState('arrived');
          playBeep('success');
          setBuses((prev) =>
            prev.map((b) => (b.id === selectedBus.id ? { ...b, status: 'At Station', nextArrivalMinutes: 0 } : b))
          );
          setSimLog((prev) => [
            `[2.7s] Passenger Information Display refreshed: "${selectedBus.name} (${selectedBus.code})" DOCKED AT BAY 1.`,
            ...prev,
          ]);
        }, 800);
      }, 800);
    }, 1100);
  };

  const handleResetSimulation = () => {
    setSimState('idle');
    setIsUnknownTagTest(false);
    setRfidPacket(selectedBus.rfidUid);
    setBuses(INITIAL_BUSES);
    setSimLog([
      '[RESET] Simulation reset to standby state.',
      '[READY] Ready for next exhibition demonstration.'
    ]);
  };

  const handleSelectUnknownTest = () => {
    setIsUnknownTagTest(true);
    setSimState('idle');
    setRfidPacket('E7 9A 41 BC');
    setSimLog((prev) => [
      '[MODE] Switched to UNREGISTERED RFID CARD TEST. Click "Simulate Approach" to test rejection.',
      ...prev,
    ]);
  };

  const handleSelectBus = (busId: string) => {
    setIsUnknownTagTest(false);
    setSelectedBusId(busId);
    const bus = buses.find((b) => b.id === busId);
    if (bus) {
      setRfidPacket(bus.rfidUid);
      setSimState('idle');
      setSimLog((prev) => [
        `[SELECT] Selected ${bus.name} (${bus.code}). RFID transponder UID: ${bus.rfidUid}.`,
        ...prev,
      ]);
    }
  };

  // --- MODULE 02: ENERGY LAB STATE ---
  // Default values tuned to match the user's dashboard (12.4W Solar, 3.8W Piezo, 78% battery)
  const [solarIrradiance, setSolarIrradiance] = useState<number>(68); // ~12.4W
  const [footTraffic, setFootTraffic] = useState<number>(45); // ~3.8W

  // Energy calculations
  const solarOutputWatts = Number(((solarIrradiance / 100) * 18.2).toFixed(1)); // max ~18.2W for station bench
  const piezoOutputWatts = Number(((footTraffic / 100) * 8.4).toFixed(1)); // max ~8.4W
  const totalHarvestedWatts = Number((solarOutputWatts + piezoOutputWatts).toFixed(1));
  const stationBaseLoadWatts = 4.2; // MCU + MFRC522 + e-Paper refresh average load
  const netEnergyBalanceWatts = Number((totalHarvestedWatts - stationBaseLoadWatts).toFixed(1));
  const solarMixPct = totalHarvestedWatts > 0 ? Math.round((solarOutputWatts / totalHarvestedWatts) * 100) : 0;
  const piezoMixPct = 100 - solarMixPct;

  // Preset environmental scenarios for quick exhibition demos
  const setEnergyPreset = (name: 'dashboard' | 'noon' | 'rain' | 'night') => {
    if (name === 'dashboard') {
      setSolarIrradiance(68); // ~12.4W
      setFootTraffic(45);     // ~3.8W
    } else if (name === 'noon') {
      setSolarIrradiance(98); // ~17.8W
      setFootTraffic(20);     // ~1.7W
    } else if (name === 'rain') {
      setSolarIrradiance(18); // ~3.3W (dark overcast monsoon)
      setFootTraffic(85);     // ~7.1W (heavy pedestrian foot traffic)
    } else if (name === 'night') {
      setSolarIrradiance(0);  // 0.0W (night)
      setFootTraffic(55);     // ~4.6W (pedestrians walking home)
    }
  };

  // --- MODULE 03: BUILD THE STATION STATE ---
  const initialNodes = [
    { id: 'solar', label: 'Canopy Solar Array', category: 'Energy Source', icon: Sun },
    { id: 'piezo', label: 'Sub-floor Piezo Matrix', category: 'Energy Source', icon: Footprints },
    { id: 'storage', label: 'LiFePO4 Buffer & BMS', category: 'Power Storage', icon: BatteryCharging },
    { id: 'controller', label: 'ESP8266 Station MCU', category: 'Central Controller', icon: Cpu },
    { id: 'rfid', label: 'MFRC522 RFID Reader', category: 'Proximity Sensor', icon: Radio },
    { id: 'bus', label: 'Transit Bus (Passive Tag)', category: 'Vehicle Target', icon: Bus },
    { id: 'display', label: 'Passenger Info Display', category: 'Civil Interface', icon: Tv },
  ];

  const [connectedPairs, setConnectedPairs] = useState<{ from: string; to: string }[]>([
    { from: 'solar', to: 'storage' },
    { from: 'storage', to: 'controller' },
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
      {/* ========================================================================= */}
      {/* 1. EXHIBITION TOP BANNER & QUICK LAUNCHPAD */}
      {/* ========================================================================= */}
      <section className="border-b border-[#E2E4E8] bg-tech-grid pt-10 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Header Metadata & Badge */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] font-mono font-bold text-amber-700">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span>EXHIBITION DEMONSTRATION SUITE • ATL LAB PROTOTYPE</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-[#1A1A1A]">
                SUNSTRIDE INTERACTIVE LAB
              </h1>
              <p className="text-sm sm:text-base text-[#4B5563] max-w-2xl leading-relaxed">
                Hands-on simulation bench designed for teachers, evaluators, and judges. Test real-time RFID bus tracking, dual-source hybrid harvesting (Solar + Piezo), and smart commuter telemetry.
              </p>
            </div>

            {/* Quick Actions & Live Dashboard Links */}
            <div className="flex flex-wrap items-center gap-3">
              {/* How to explain to teachers modal button */}
              <button
                id="btn-teacher-speech-guide"
                onClick={() => setShowTeacherGuide(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <HelpCircle className="w-4 h-4" />
                <span>HOW TO EXPLAIN TO TEACHERS</span>
              </button>

              {/* Direct Dashboard Link */}
              <a
                id="btn-lab-to-dashboard"
                href="https://affaninschool.github.io/SunStride_Dashboard/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0A0A0A] hover:bg-neutral-800 text-amber-400 font-mono text-xs font-bold transition-all border border-neutral-800 shadow-sm cursor-pointer"
              >
                <Gauge className="w-4 h-4" />
                <span>OPEN LIVE DASHBOARD</span>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
              </a>

              {/* Sound Toggle */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2.5 rounded-lg bg-white border border-[#E2E4E8] text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
                title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-neutral-400" />}
              </button>
            </div>
          </div>

          {/* EXHIBITION QUICK-DEMO BAR */}
          <div className="p-4 rounded-xl bg-white border border-[#E2E4E8] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <div className="text-xs font-mono">
                <span className="text-neutral-500 block text-[10px]">HARDWARE BENCH TELEMETRY:</span>
                <span className="font-bold text-neutral-800">
                  Node: <span className="text-emerald-700">ESP8266-ATL-01</span> • RFID: <span className="text-amber-700">MFRC522</span> • Voltage: <span className="text-sky-700">5.1V (LiFePO4)</span>
                </span>
              </div>
            </div>

            {/* Quick Demo Trigger Buttons */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
              <button
                id="quick-demo-solaris"
                onClick={() => {
                  handleSelectBus('bus-sx01');
                  setTimeout(() => handleSimulateArrival(), 200);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-mono text-xs font-bold cursor-pointer transition-all"
              >
                <Play className="w-3 h-3 fill-current text-amber-600" />
                <span>DEMO: SOLARIS EXPRESS</span>
              </button>

              <button
                id="quick-demo-unknown-tag"
                onClick={() => {
                  handleSelectUnknownTest();
                  setTimeout(() => handleSimulateArrival(), 200);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-800 font-mono text-xs font-bold cursor-pointer transition-all"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                <span>TEST: UNREGISTERED CARD</span>
              </button>

              <button
                id="quick-demo-reset"
                onClick={handleResetSimulation}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-700 font-mono text-xs cursor-pointer transition-all"
              >
                <RotateCcw className="w-3 h-3" />
                <span>RESET</span>
              </button>
            </div>
          </div>

          {/* Module Selector Navigation Tabs */}
          <div className="flex flex-wrap gap-2 font-mono text-xs">
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
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-[#6B7280]'}`} />
                  <span>{mod.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. LAB MODULE CONTAINER */}
      {/* ========================================================================= */}
      <section className="py-10 border-b border-[#E2E4E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ========================================================================= */}
          {/* MODULE 01: BUS TRACKING SIMULATOR */}
          {/* ========================================================================= */}
          {activeModule === 'tracking' && (
            <div className="space-y-8">
              {/* Module Header & Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono font-bold text-amber-600 uppercase">
                    SIMULATION MODULE 01 • RFID PROXIMITY & VEHICLE DETECTION
                  </span>
                  <h2 className="text-2xl font-bold font-display text-[#1A1A1A]">
                    Automated Vehicle Tracking Simulator
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Demonstrates how passive high-frequency RFID transponders communicate with the MFRC522 sensor on the station.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    id="lab-bus-arrive-btn"
                    onClick={handleSimulateArrival}
                    disabled={simState === 'approaching' || simState === 'detecting' || simState === 'processing'}
                    className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-neutral-800 disabled:opacity-50 text-white font-mono text-xs font-bold px-4 py-2.5 rounded-lg cursor-pointer shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-current text-amber-400" />
                    <span>SIMULATE APPROACH</span>
                  </button>
                  <button
                    id="lab-bus-reset-btn"
                    onClick={handleResetSimulation}
                    className="flex items-center gap-1.5 bg-white hover:bg-[#ECEEF2] border border-[#DCDFE4] text-[#374151] font-mono text-xs px-3 py-2.5 rounded-lg cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>RESET</span>
                  </button>
                </div>
              </div>

              {/* Transit Bus Fleet Cards (From User's Live Dashboard) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
                  <span>SELECT TRANSIT FLEET BUS TO SIMULATE:</span>
                  <span className="text-[11px] text-amber-700 font-semibold">CLICK ANY CARD TO TEST ITS RFID TAG</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {buses.map((bus) => {
                    const isSelected = selectedBusId === bus.id && !isUnknownTagTest;
                    const isAtStation = bus.status === 'At Station';
                    return (
                      <div
                        key={bus.id}
                        onClick={() => handleSelectBus(bus.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer font-mono text-xs relative ${
                          isSelected
                            ? 'bg-amber-50/70 border-amber-500 shadow-sm ring-2 ring-amber-400/40'
                            : 'bg-white border-[#E2E4E8] hover:border-neutral-400'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded text-[11px]">
                            {bus.code}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            isAtStation
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-neutral-100 text-neutral-600'
                          }`}>
                            {bus.status}
                          </span>
                        </div>
                        <p className="text-neutral-900 font-sans text-sm font-bold truncate">{bus.name}</p>
                        <p className="text-[11px] text-neutral-500 truncate">{bus.routeNumber}</p>
                        
                        <div className="mt-2.5 pt-2 border-t border-neutral-100 text-[10px] text-neutral-600 flex items-center justify-between">
                          <span className="text-amber-700 font-bold">UID: {bus.rfidUid}</span>
                          <span>{bus.occupancy}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Unknown Tag Security Testing Card */}
                <div
                  onClick={handleSelectUnknownTest}
                  className={`p-3 rounded-lg border transition-all cursor-pointer font-mono text-xs flex items-center justify-between ${
                    isUnknownTagTest
                      ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-400/40'
                      : 'bg-white border-dashed border-rose-300 hover:bg-rose-50/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <div>
                      <span className="font-bold text-rose-900">SECURITY TEST: Unregistered RFID Card / Keyfob</span>
                      <span className="text-[11px] text-neutral-500 block">UID: E7 9A 41 BC (Not in fleet database - tests access rejection)</span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${isUnknownTagTest ? 'bg-rose-600 text-white' : 'bg-rose-100 text-rose-700'}`}>
                    {isUnknownTagTest ? 'SELECTED' : 'TEST REJECTION'}
                  </span>
                </div>
              </div>

              {/* Selected Bus Route Stop Timeline (Matches Live Dashboard) */}
              {!isUnknownTagTest && selectedBus.stops && (
                <div className="p-4 rounded-xl bg-white border border-[#E2E4E8] shadow-xs space-y-3 font-mono">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-neutral-700 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-500" />
                      <span>{selectedBus.name} ({selectedBus.code}) • ROUTE ITINERARY & DETECTION STOPS</span>
                    </span>
                    <span className="text-[11px] text-neutral-500">STATION STOP 2 OF {selectedBus.stops.length}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
                    {selectedBus.stops.map((stopName, idx) => {
                      const isSunstrideStop = stopName.includes('SunStride');
                      const isPassed = idx < (isSunstrideStop ? 1 : 0);
                      const isCurrent = isSunstrideStop;
                      return (
                        <div
                          key={idx}
                          className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 ${
                            isCurrent
                              ? 'bg-amber-50 border-amber-400 text-amber-950 font-bold'
                              : isPassed
                              ? 'bg-neutral-50 border-neutral-200 text-neutral-500'
                              : 'bg-white border-neutral-200 text-neutral-700'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                            isCurrent ? 'bg-amber-500 text-neutral-950 font-bold' : 'bg-neutral-200 text-neutral-600'
                          }`}>
                            {idx + 1}
                          </div>
                          <div className="truncate">
                            <span className="truncate block">{stopName}</span>
                            <span className="text-[9px] text-neutral-500 block">
                              {isCurrent ? (simState === 'arrived' ? 'DOCKED AT BAY 1' : 'STATION RFID SENSOR') : `Platform ${(idx % 2) + 1}`}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Virtual Station Simulator Stage */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Visual Stage (Left 7 Cols) */}
                <div className="lg:col-span-7 bg-[#14171C] rounded-xl border border-neutral-800 p-6 text-white relative overflow-hidden diagram-area">
                  <div className="absolute inset-0 bg-tech-grid-dark opacity-20 pointer-events-none" />

                  {/* Stage Status Header */}
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-6 text-xs font-mono text-neutral-400">
                    <div className="flex items-center gap-2 text-amber-400">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      <span>STATION APPROACH BAY 01 • RFID INTERROGATION BEAM</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      simState === 'arrived'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-700'
                        : simState === 'rejected'
                        ? 'bg-rose-950 text-rose-400 border border-rose-700'
                        : 'bg-neutral-900 text-neutral-300'
                    }`}>
                      PHASE: {simState.toUpperCase()}
                    </span>
                  </div>

                  {/* Animated Road & Station Layout */}
                  <div className="relative h-64 border border-neutral-800 rounded-lg bg-neutral-950/80 p-4 flex flex-col justify-between overflow-hidden">
                    {/* RFID Interrogation Zone Radius */}
                    <div className="absolute right-14 top-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-amber-500/20 flex items-center justify-center pointer-events-none">
                      <div className={`w-32 h-32 rounded-full border border-dashed ${
                        simState === 'rejected'
                          ? 'border-rose-400/60'
                          : simState === 'detecting'
                          ? 'border-amber-400/60 animate-spin'
                          : 'border-emerald-400/30'
                      }`} />
                      <div className="text-[9px] font-mono text-amber-400/80 absolute -bottom-5">
                        MFRC522 RF SCAN ZONE (13.56 MHz)
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
                            ? '35%'
                            : simState === 'detecting' || simState === 'processing' || simState === 'arrived' || simState === 'rejected'
                            ? '62%'
                            : '5%',
                      }}
                      transition={{ duration: 1.1, ease: 'easeInOut' }}
                    >
                      <div className={`p-3 rounded-lg shadow-lg flex items-center gap-2.5 border ${
                        isUnknownTagTest
                          ? 'bg-rose-950/90 border-rose-500/80'
                          : 'bg-neutral-900 border-amber-500/70'
                      }`}>
                        <Bus className={`w-6 h-6 ${isUnknownTagTest ? 'text-rose-400' : 'text-amber-400'}`} />
                        <div className="text-xs font-mono">
                          <span className="font-bold block text-white">
                            {isUnknownTagTest ? 'UNKNOWN VEHICLE' : selectedBus.code}
                          </span>
                          <span className="text-[9px] text-neutral-400">
                            {isUnknownTagTest ? 'UNREGISTERED TAG' : 'PASSIVE RFID TRANSPONDER'}
                          </span>
                        </div>
                      </div>

                      {/* Transponder RF wave pulse */}
                      {(simState === 'detecting' || simState === 'processing') && (
                        <div className={`w-8 h-8 rounded-full border-2 animate-ping ${
                          isUnknownTagTest ? 'border-rose-400' : 'border-amber-400'
                        }`} />
                      )}
                    </motion.div>

                    {/* Station Pole & Interrogator Graphic */}
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                      <div className={`p-3 rounded-lg border transition-all ${
                        simState === 'arrived'
                          ? 'bg-emerald-950/90 border-emerald-400 text-emerald-300 ring-2 ring-emerald-500/40'
                          : simState === 'rejected'
                          ? 'bg-rose-950/90 border-rose-400 text-rose-300 ring-2 ring-rose-500/40'
                          : simState === 'detecting' || simState === 'processing'
                          ? 'bg-amber-950/90 border-amber-400 text-amber-300 animate-pulse'
                          : 'bg-neutral-900 border-neutral-700 text-neutral-400'
                      }`}>
                        <Radio className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-mono text-neutral-300 mt-1 font-semibold">STATION POLE</span>
                      <span className="text-[8px] font-mono text-amber-400">MFRC522 SENSOR</span>
                    </div>
                  </div>

                  {/* Packet Telemetry Payload Card */}
                  <div className={`mt-4 p-3 rounded border font-mono text-xs flex items-center justify-between ${
                    simState === 'rejected'
                      ? 'bg-rose-950/50 border-rose-800 text-rose-200'
                      : 'bg-neutral-900 border-neutral-800'
                  }`}>
                    <div>
                      <span className="text-neutral-400 text-[10px] block">INTERROGATION PACKET (HEX UID):</span>
                      <span className={`font-bold ${simState === 'rejected' ? 'text-rose-400' : 'text-amber-400'}`}>
                        {rfidPacket || 'Awaiting proximity trigger...'}
                      </span>
                    </div>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded font-bold ${
                      simState === 'arrived'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : simState === 'rejected'
                        ? 'bg-rose-950 text-rose-400 border border-rose-700'
                        : 'text-neutral-500'
                    }`}>
                      {simState === 'arrived' ? 'FLEET VERIFIED ✓' : simState === 'rejected' ? 'ACCESS DENIED ✗' : 'STANDBY'}
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
                      <span className="font-mono text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        E-PAPER LOW POWER UI
                      </span>
                    </div>

                    {/* e-Paper Frame UI */}
                    <div className="p-4 bg-[#F0F2F5] border-2 border-[#1A1A1A] rounded-lg font-mono space-y-3">
                      <div className="flex items-center justify-between border-b border-[#DCDFE4] pb-2 text-[11px] text-[#374151]">
                        <span className="font-bold">SUNSTRIDE STATION • NODE ATL-01</span>
                        <span>14:28:10</span>
                      </div>

                      {/* Display Content based on State */}
                      {isUnknownTagTest && simState === 'rejected' ? (
                        <div className="p-3 bg-rose-50 border border-rose-300 rounded space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-base font-bold text-rose-800">UNKNOWN TOKEN</span>
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-700 text-white">
                              REJECTED
                            </span>
                          </div>
                          <p className="text-xs text-rose-700 font-sans">Unregistered RFID Tag Detected</p>
                          <div className="pt-2 text-[10px] text-rose-600 flex justify-between border-t border-rose-200">
                            <span>UID: E7 9A 41 BC</span>
                            <span>SECURITY LOG RECORDED</span>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-white border border-[#DCDFE4] rounded space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-[#1A1A1A]">
                              {selectedBus.code}
                            </span>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                              simState === 'arrived' ? 'bg-emerald-600 text-white' : 'bg-neutral-200 text-neutral-800'
                            }`}>
                              {simState === 'arrived' ? 'STATUS: AT BAY 1' : 'STATUS: EN ROUTE'}
                            </span>
                          </div>
                          <p className="text-xs text-[#4B5563] font-sans font-semibold">{selectedBus.name}</p>
                          <p className="text-[11px] text-neutral-500 font-sans">➔ To: {selectedBus.destination}</p>
                          <div className="pt-2 text-[11px] text-[#6B7280] flex justify-between border-t border-neutral-100">
                            <span>ETA: {simState === 'arrived' ? 'NOW (DOCKED)' : `${selectedBus.nextArrivalMinutes} min`}</span>
                            <span>Load: {selectedBus.occupancy}</span>
                          </div>
                        </div>
                      )}

                      {/* e-Paper static power savings notice */}
                      <p className="text-[10px] text-[#6B7280] italic">
                        Bistable e-Paper display consumes zero standby wattage. Refreshes only when MFRC522 triggers an arrival interrupt.
                      </p>
                    </div>

                    {/* Log Terminal Box */}
                    <div className="p-3 bg-[#14171C] text-neutral-300 rounded font-mono text-[11px] h-36 overflow-y-auto space-y-1">
                      <div className="text-[10px] text-neutral-500 border-b border-neutral-800 pb-1 mb-1 flex items-center justify-between">
                        <span>EVENT EXECUTION LOG</span>
                        <span className="text-emerald-400">ESP8266 FIRMWARE</span>
                      </div>
                      {simLog.map((log, i) => (
                        <div key={i} className={`leading-tight ${log.includes('ALERT') ? 'text-rose-400 font-bold' : log.includes('ARRIVED') ? 'text-emerald-400 font-bold' : 'text-neutral-300'}`}>
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Teacher Explanation Callout */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-neutral-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-amber-900 font-bold">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>TEACHER DEMO TIP: Why RFID over GPS?</span>
                </div>
                <span className="text-[11px] text-neutral-600">
                  RFID has zero monthly SIM card fees, zero cloud satellite latency, and operates 100% locally even during internet power cuts.
                </span>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* MODULE 02: ENERGY LAB & HARVESTING */}
          {/* ========================================================================= */}
          {activeModule === 'energy' && (
            <div className="space-y-8">
              {/* Module Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono font-bold text-amber-600 uppercase">
                    SIMULATION MODULE 02 • HYBRID ENERGY HARVESTING
                  </span>
                  <h2 className="text-2xl font-bold font-display text-[#1A1A1A]">
                    Solar & Piezoelectric Power Simulator
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Modeled after the SunStride bench prototype (matching live dashboard values: ~12.4W Solar + ~3.8W Piezo).
                  </p>
                </div>
                <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-mono font-bold">
                  AUTONOMOUS OFF-GRID SYSTEM
                </div>
              </div>

              {/* Quick Environmental Preset Buttons */}
              <div className="p-3.5 bg-white rounded-xl border border-[#E2E4E8] shadow-xs flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-mono font-bold text-neutral-700 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-amber-600" />
                  <span>EXHIBITION QUICK PRESETS:</span>
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setEnergyPreset('dashboard')}
                    className="px-3 py-1 rounded bg-amber-500 text-neutral-950 font-mono text-xs font-bold hover:bg-amber-400 transition-colors cursor-pointer"
                  >
                    Dashboard Benchmark (12.4W + 3.8W)
                  </button>
                  <button
                    onClick={() => setEnergyPreset('noon')}
                    className="px-3 py-1 rounded bg-neutral-100 text-neutral-700 font-mono text-xs font-semibold hover:bg-neutral-200 transition-colors cursor-pointer"
                  >
                    Peak Noon Sun
                  </button>
                  <button
                    onClick={() => setEnergyPreset('rain')}
                    className="px-3 py-1 rounded bg-neutral-100 text-neutral-700 font-mono text-xs font-semibold hover:bg-neutral-200 transition-colors cursor-pointer"
                  >
                    Monsoon Rush (Low Sun + High Footfall)
                  </button>
                  <button
                    onClick={() => setEnergyPreset('night')}
                    className="px-3 py-1 rounded bg-neutral-100 text-neutral-700 font-mono text-xs font-semibold hover:bg-neutral-200 transition-colors cursor-pointer"
                  >
                    Night Mode (100% Piezo Kinetic)
                  </button>
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
                        CANOPY SOLAR IRRADIANCE
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
                      <span>0% (Night / Heavy Cloud)</span>
                      <span>50% (Overcast)</span>
                      <span>100% (Direct Summer Sun)</span>
                    </div>
                  </div>

                  {/* 2. Foot Traffic Slider */}
                  <div className="space-y-2 pt-4 border-t border-[#F3F4F6]">
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="font-bold flex items-center gap-1.5 text-[#1A1A1A]">
                        <Footprints className="w-4 h-4 text-emerald-600" />
                        PEDESTRIAN FOOT TRAFFIC (PIEZO)
                      </span>
                      <span className="text-emerald-700 font-bold">{footTraffic}% (Step impact density)</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={footTraffic}
                      onChange={(e) => setFootTraffic(Number(e.target.value))}
                      className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-[#6B7280]">
                      <span>LOW (Quiet Hours)</span>
                      <span>MEDIUM (Regular Day)</span>
                      <span>HIGH (Peak Commute Rush)</span>
                    </div>
                  </div>

                  {/* Dual Harvester Complementarity Explanation */}
                  <div className="p-4 bg-[#F4F5F7] rounded-lg border border-[#E2E4E8] text-xs font-mono text-[#4B5563] space-y-1.5">
                    <span className="font-bold text-[#1A1A1A] block uppercase text-[10px] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>WHY DUAL-SOURCE IS GROUNDBREAKING:</span>
                    </span>
                    <p className="text-[11px] leading-relaxed">
                      Solar powers the station during sunny midday hours. But during evening rush hours (6 PM - 9 PM) or rainy monsoons when solar drops, hundreds of commuters step on the piezoelectric tiles, keeping the battery charged!
                    </p>
                  </div>
                </div>

                {/* Energy Balance Readout (Right 6 Cols) */}
                <div className="lg:col-span-6 bg-[#14171C] text-white p-6 sm:p-8 rounded-xl border border-neutral-800 space-y-6 shadow-md">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-3 text-xs font-mono text-neutral-400">
                    <span className="text-emerald-400 font-bold">POWER MANAGEMENT TELEMETRY</span>
                    <span>BUFFER: 12.8V LiFePO4 (5.1V LOGIC)</span>
                  </div>

                  {/* Dual Energy Gauges */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Solar Yield */}
                    <div className="p-3.5 bg-neutral-900 rounded-lg border border-neutral-800 font-mono">
                      <span className="text-[10px] text-neutral-400 uppercase block">Solar Array Yield</span>
                      <span className="text-2xl font-bold text-amber-400 font-display mt-1 block">
                        {solarOutputWatts} W
                      </span>
                      <span className="text-[10px] text-neutral-500">Canopy Photovoltaic</span>
                    </div>

                    {/* Piezo Yield */}
                    <div className="p-3.5 bg-neutral-900 rounded-lg border border-neutral-800 font-mono">
                      <span className="text-[10px] text-neutral-400 uppercase block">Piezo Kinetic Yield</span>
                      <span className="text-2xl font-bold text-emerald-400 font-display mt-1 block">
                        {piezoOutputWatts} W
                      </span>
                      <span className="text-[10px] text-neutral-500">Sub-floor rectified pulses</span>
                    </div>
                  </div>

                  {/* Proportional Mix Bar (Like live dashboard) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-neutral-400">GENERATION SOURCE MIX:</span>
                      <span className="text-white font-bold">{solarMixPct}% Solar • {piezoMixPct}% Piezo</span>
                    </div>
                    <div className="h-3.5 rounded-full overflow-hidden flex bg-neutral-900 border border-neutral-800">
                      <div
                        style={{ width: `${solarMixPct}%` }}
                        className="bg-amber-400 transition-all duration-300"
                        title={`Solar: ${solarMixPct}%`}
                      />
                      <div
                        style={{ width: `${piezoMixPct}%` }}
                        className="bg-emerald-400 transition-all duration-300"
                        title={`Piezo: ${piezoMixPct}%`}
                      />
                    </div>
                  </div>

                  {/* Net Power Calculation */}
                  <div className="p-4 bg-neutral-900/90 rounded-lg border border-emerald-500/40 space-y-2.5 font-mono">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-300">TOTAL HARVESTED POWER:</span>
                      <span className="text-lg font-bold text-emerald-400 font-display">{totalHarvestedWatts} W</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-400">STATION BASE CONSUMPTION:</span>
                      <span className="text-xs text-neutral-300">{stationBaseLoadWatts} W (ESP8266 + MFRC522 + Display)</span>
                    </div>
                    <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs">
                      <span className="font-bold text-white">NET BATTERY BALANCE:</span>
                      <span className={`font-bold ${netEnergyBalanceWatts >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {netEnergyBalanceWatts >= 0 ? `+${netEnergyBalanceWatts} W (Charging Storage Bank)` : `${netEnergyBalanceWatts} W (Discharging)`}
                      </span>
                    </div>
                  </div>

                  {/* Benchmark Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-1">
                    <div className="p-2 rounded bg-neutral-900 border border-neutral-800">
                      <span className="text-[10px] text-neutral-500 block">BATTERY</span>
                      <span className="font-bold text-white">78%</span>
                    </div>
                    <div className="p-2 rounded bg-neutral-900 border border-neutral-800">
                      <span className="text-[10px] text-neutral-500 block">LOGIC VOLTAGE</span>
                      <span className="font-bold text-amber-400">5.1 V</span>
                    </div>
                    <div className="p-2 rounded bg-neutral-900 border border-neutral-800">
                      <span className="text-[10px] text-neutral-500 block">TODAY HARVEST</span>
                      <span className="font-bold text-emerald-400">0.42 kWh</span>
                    </div>
                  </div>
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
                    SIMULATION MODULE 03 • PHYSICAL ARCHITECTURE
                  </span>
                  <h2 className="text-2xl font-bold font-display text-[#1A1A1A]">
                    Station Circuit Integration & Link Builder
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Connect the hardware subsystems into a complete, functioning smart bus shelter topology.
                  </p>
                </div>
                <button
                  id="lab-builder-reset-btn"
                  onClick={() => setConnectedPairs([{ from: 'solar', to: 'storage' }, { from: 'storage', to: 'controller' }])}
                  className="text-xs font-mono text-neutral-600 hover:text-neutral-900 underline cursor-pointer self-start sm:self-auto"
                >
                  Reset Link Matrix
                </button>
              </div>

              <div className="p-4 bg-white rounded-lg border border-[#E2E4E8] text-xs font-mono text-[#4B5563]">
                <span className="font-bold text-[#1A1A1A] block mb-1">ENGINEERING OBJECTIVE:</span>
                Create logical connections: <span className="font-semibold text-emerald-700">ENERGY SOURCES → BATTERY STORAGE → ESP8266 MCU → RFID SENSOR (WITH BUS) → PASSENGER DISPLAY</span>.
                Select any component card below, then select another to create or remove an electrical/data link.
              </div>

              {/* Node Matrix Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {initialNodes.map((node) => {
                  const isSelectedForConnect = selectedConnectFrom === node.id;
                  const activeConnections = connectedPairs.filter(
                    (p) => p.from === node.id || p.to === node.id
                  );
                  const Icon = node.icon;

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
                      className={`p-4 rounded-xl border transition-all cursor-pointer font-mono text-xs relative ${
                        isSelectedForConnect
                          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] ring-2 ring-amber-400'
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
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={`w-4 h-4 ${isSelectedForConnect ? 'text-amber-400' : 'text-neutral-700'}`} />
                        <h4 className="font-bold text-sm">{node.label}</h4>
                      </div>
                      <div className="text-[10px] text-[#6B7280] pt-2 border-t border-[#F3F4F6]">
                        {isSelectedForConnect ? 'Click another component to link' : 'Click to select and wire'}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Circuit Diagnostics Feedback Card */}
              <div className="bg-[#14171C] text-white p-6 rounded-xl border border-neutral-800 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3 font-mono text-xs">
                  <span className="text-amber-400 font-bold">INTEGRATED CIRCUIT DIAGNOSTICS</span>
                  <span>{connectedPairs.length} ACTIVE PHYSICAL/DATA LINKS</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
                  <div className={`p-3 rounded-lg border ${hasEnergyHarvesting ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300' : 'bg-neutral-900 border-neutral-800 text-neutral-500'}`}>
                    <span>1. Power Harvester → Storage</span>
                    <span className="block font-bold mt-1">{hasEnergyHarvesting ? '✓ CONNECTED' : '✗ DISCONNECTED'}</span>
                  </div>

                  <div className={`p-3 rounded-lg border ${hasPowerToMcu ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300' : 'bg-neutral-900 border-neutral-800 text-neutral-500'}`}>
                    <span>2. Storage → ESP8266 MCU</span>
                    <span className="block font-bold mt-1">{hasPowerToMcu ? '✓ CONNECTED' : '✗ DISCONNECTED'}</span>
                  </div>

                  <div className={`p-3 rounded-lg border ${hasRfidDetection ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300' : 'bg-neutral-900 border-neutral-800 text-neutral-500'}`}>
                    <span>3. Bus Tag → MFRC522 → MCU</span>
                    <span className="block font-bold mt-1">{hasRfidDetection ? '✓ CONNECTED' : '✗ DISCONNECTED'}</span>
                  </div>

                  <div className={`p-3 rounded-lg border ${hasPassengerDisplay ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300' : 'bg-neutral-900 border-neutral-800 text-neutral-500'}`}>
                    <span>4. MCU → Passenger Display</span>
                    <span className="block font-bold mt-1">{hasPassengerDisplay ? '✓ CONNECTED' : '✗ DISCONNECTED'}</span>
                  </div>
                </div>

                {isCompleteCircuit ? (
                  <div className="p-3.5 bg-emerald-900/60 border border-emerald-500 rounded-lg text-emerald-200 text-xs font-mono flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>SYSTEM COMPLETE: Fully closed energy-aware transit detection loop established! The station can power itself and track arriving transit vehicles.</span>
                  </div>
                ) : (
                  <div className="p-3.5 bg-amber-950/60 border border-amber-500/50 rounded-lg text-amber-200 text-xs font-mono flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
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
                    SIMULATION MODULE 04 • HARDWARE ANATOMY
                  </span>
                  <h2 className="text-2xl font-bold font-display text-[#1A1A1A]">
                    Station Anatomy & Component Explorer
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Click any hotspot in the 2D CAD blueprint to inspect its engineering specs.
                  </p>
                </div>
              </div>

              {/* Exploded Station Layout Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Station Visual Hotspot Schematic (Left 7 Cols) */}
                <div className="lg:col-span-7 bg-[#14171C] text-white p-6 rounded-xl border border-neutral-800 relative overflow-hidden diagram-area">
                  <div className="absolute inset-0 bg-tech-grid-dark opacity-20 pointer-events-none" />

                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-3 text-xs font-mono text-neutral-400">
                      <span className="text-amber-400 font-bold">2D SCHEMATIC CAD VIEW</span>
                      <span>SELECT HOTSPOT TO INSPECT</span>
                    </div>

                    {/* Schematic Station Graphic with Interactive Hotspots */}
                    <div className="relative h-72 border border-neutral-800 rounded-lg bg-neutral-950 p-6 flex flex-col justify-between">
                      {/* Roof Canopy Hotspot */}
                      <button
                        onClick={() => setExplorerComponentId('solar-pv')}
                        className={`absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg border font-mono text-xs transition-all cursor-pointer flex items-center gap-2 ${
                          explorerComponentId === 'solar-pv'
                            ? 'bg-amber-950 border-amber-400 text-amber-200 ring-1 ring-amber-400 shadow-md shadow-amber-500/20'
                            : 'bg-neutral-900 border-neutral-700 text-neutral-300'
                        }`}
                      >
                        <Sun className="w-4 h-4 text-amber-400" />
                        <span>CANOPY SOLAR ARRAY</span>
                      </button>

                      {/* Middle Column: Display & MCU */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3">
                        <button
                          onClick={() => setExplorerComponentId('display-interface')}
                          className={`px-3 py-2 rounded-lg border font-mono text-xs transition-all cursor-pointer flex items-center gap-2 ${
                            explorerComponentId === 'display-interface'
                              ? 'bg-sky-950 border-sky-400 text-sky-200 ring-1 ring-sky-400 shadow-md shadow-sky-500/20'
                              : 'bg-neutral-900 border-neutral-700 text-neutral-300'
                          }`}
                        >
                          <Tv className="w-3.5 h-3.5 text-sky-400" />
                          <span>E-PAPER DISPLAY</span>
                        </button>

                        <button
                          onClick={() => setExplorerComponentId('controller-mcu')}
                          className={`px-3 py-2 rounded-lg border font-mono text-xs transition-all cursor-pointer flex items-center gap-2 ${
                            explorerComponentId === 'controller-mcu'
                              ? 'bg-blue-950 border-blue-400 text-blue-200 ring-1 ring-blue-400 shadow-md shadow-blue-500/20'
                              : 'bg-neutral-900 border-neutral-700 text-neutral-300'
                          }`}
                        >
                          <Cpu className="w-3.5 h-3.5 text-blue-400" />
                          <span>ESP8266 MCU</span>
                        </button>
                      </div>

                      {/* Right Edge: RFID Reader */}
                      <button
                        onClick={() => setExplorerComponentId('rfid-reader')}
                        className={`absolute right-4 top-1/2 -translate-y-1/2 px-3 py-2 rounded-lg border font-mono text-xs transition-all cursor-pointer flex items-center gap-2 ${
                          explorerComponentId === 'rfid-reader'
                            ? 'bg-amber-950 border-amber-400 text-amber-200 ring-1 ring-amber-400 shadow-md shadow-amber-500/20'
                            : 'bg-neutral-900 border-neutral-700 text-neutral-300'
                        }`}
                      >
                        <Radio className="w-3.5 h-3.5 text-amber-400" />
                        <span>MFRC522 RFID SENSOR</span>
                      </button>

                      {/* Floor Hotspot: Piezo Matrix */}
                      <button
                        onClick={() => setExplorerComponentId('piezo-array')}
                        className={`absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg border font-mono text-xs transition-all cursor-pointer flex items-center gap-2 ${
                          explorerComponentId === 'piezo-array'
                            ? 'bg-emerald-950 border-emerald-400 text-emerald-200 ring-1 ring-emerald-400 shadow-md shadow-emerald-500/20'
                            : 'bg-neutral-900 border-neutral-700 text-neutral-300'
                        }`}
                      >
                        <Footprints className="w-4 h-4 text-emerald-400" />
                        <span>PIEZO FOOTSTEP MATRIX</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Subsystem Specifications Card (Right 5 Cols) */}
                <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-[#E2E4E8] shadow-xs space-y-4">
                  <div className="border-b border-[#F3F4F6] pb-3">
                    <span className="text-[10px] font-mono font-bold text-amber-700 uppercase">
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
                      className="text-xs font-mono font-bold text-[#1A1A1A] underline hover:text-amber-700 flex items-center gap-1 cursor-pointer"
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

      {/* ========================================================================= */}
      {/* 3. TEACHER & JUDGE EXPLANATION MODAL (POPUP FOR AFFAN AT EXHIBITION) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showTeacherGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl border border-neutral-300 shadow-2xl p-6 sm:p-8 space-y-6 text-[#1A1A1A]"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-neutral-200 pb-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-amber-100 text-amber-900 text-xs font-mono font-bold uppercase">
                    <Award className="w-3.5 h-3.5 text-amber-700" />
                    <span>EXHIBITION PRESENTATION CHEAT SHEET</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-neutral-900 mt-1">
                    How to Explain SunStride to Teachers & Judges
                  </h3>
                  <p className="text-xs text-neutral-500 font-mono">
                    Prepared for Affan Adil (Class VIII) • PM Shri Jawahar Navodaya Vidyalaya
                  </p>
                </div>
                <button
                  onClick={() => setShowTeacherGuide(false)}
                  className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-600 cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 1. 15-Second Elevator Pitch */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                <span className="font-mono text-xs font-bold text-amber-900 uppercase flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  <span>STEP 1: THE 15-SECOND PITCH (Say this when teachers first walk up)</span>
                </span>
                <p className="text-sm font-sans font-medium text-neutral-900 leading-relaxed italic bg-white p-3 rounded-lg border border-amber-200">
                  "Respected Teachers, I am Affan Adil from Class VIII. SunStride is a 100% self-powered, smart bus station. It solves two big urban problems at once: commuter waiting uncertainty and heavy electricity bills. Instead of relying on expensive GPS, our station detects arriving transit buses in real-time using low-cost RFID, and generates its own power from roof solar panels and passenger footsteps!"
                </p>
              </div>

              {/* 2. 60-Second Interactive Demonstration Script */}
              <div className="space-y-3">
                <span className="font-mono text-xs font-bold text-neutral-900 uppercase flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 text-emerald-600" />
                  <span>STEP 2: THE 60-SECOND INTERACTIVE WALKTHROUGH (Do this on screen)</span>
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-3.5 rounded-lg bg-neutral-50 border border-neutral-200 space-y-1.5">
                    <span className="font-bold text-emerald-700 block">1. Click "Solaris Express"</span>
                    <p className="text-neutral-600 font-sans">
                      "Watch on screen as Solaris Express approaches. Its passive RFID card (UID: A3 F2 19 7C) passes our station sensor. Within 2 milliseconds, the ESP8266 microcontroller logs the arrival and updates the commuter e-Paper display."
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-neutral-50 border border-neutral-200 space-y-1.5">
                    <span className="font-bold text-amber-700 block">2. Click "Test Unknown Card"</span>
                    <p className="text-neutral-600 font-sans">
                      "Notice what happens if an unregistered or foreign RFID card passes by. The station denies it, flashes red, and refuses to log it into the public transit feed. This prevents any security tampering."
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-neutral-50 border border-neutral-200 space-y-1.5">
                    <span className="font-bold text-sky-700 block">3. Open Energy Lab Tab</span>
                    <p className="text-neutral-600 font-sans">
                      "Here we show our dual harvesting. Solar produces ~12.4W during the day. When commuters arrive during evening rush hours or rain, the piezoelectric floor tiles generate an additional ~3.8W, keeping the 12.8V battery bank charged 24/7."
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. Top Teacher & Judge Questions & Answers */}
              <div className="space-y-3">
                <span className="font-mono text-xs font-bold text-neutral-900 uppercase flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>STEP 3: TOP 4 TEACHER & JUDGE QUESTIONS (WINNING ANSWERS)</span>
                </span>

                <div className="space-y-2 text-xs font-sans">
                  <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200 space-y-1">
                    <strong className="text-neutral-900 block font-mono">Q1: "Why did you use RFID instead of GPS in buses?"</strong>
                    <p className="text-neutral-600 leading-relaxed">
                      <strong>Answer:</strong> "GPS trackers require expensive monthly cellular SIM cards (₹300/month per bus), consume high battery, and fail in urban concrete tunnels. A passive RFID card costs under ₹20, requires zero batteries, lasts 10+ years, and verifies arrival at the shelter with zero internet latency."
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200 space-y-1">
                    <strong className="text-neutral-900 block font-mono">Q2: "What happens during night or heavy rainy monsoons when there is no sun?"</strong>
                    <p className="text-neutral-600 leading-relaxed">
                      <strong>Answer:</strong> "That is why we designed a hybrid system! When rain clouds block sunlight, commuter pedestrian foot traffic increases under the sheltered floor. The piezoelectric PZT discs harvest micro-joules from footsteps, and our LiFePO4 battery buffer bank stores enough energy for 72 continuous off-grid hours."
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200 space-y-1">
                    <strong className="text-neutral-900 block font-mono">Q3: "How much does this prototype cost compared to commercial smart bus kiosks?"</strong>
                    <p className="text-neutral-600 leading-relaxed">
                      <strong>Answer:</strong> "Commercial smart kiosks with high-power TV screens and cellular modems cost over ₹1,50,000 to install and have recurring electricity bills. Our SunStride prototype costs under ₹3,500 using an ESP8266 MCU, MFRC522 sensor, bistable e-Paper, and mini solar-piezo harvesters."
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200 space-y-1">
                    <strong className="text-neutral-900 block font-mono">Q4: "Who helped you build this?"</strong>
                    <p className="text-neutral-600 leading-relaxed">
                      <strong>Answer:</strong> "I conceptualized, designed, and coded the project in our school's Atal Tinkering Lab (PM Shri Jawahar Navodaya Vidyalaya) under the mentorship and guidance of our ATL Lab Mentor, Mrinmoy Chowhan."
                    </p>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowTeacherGuide(false)}
                  className="px-5 py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-xs font-bold cursor-pointer"
                >
                  I'M READY TO PRESENT! (CLOSE)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
