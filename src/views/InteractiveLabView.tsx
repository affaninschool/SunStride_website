import React, { useState } from 'react';
import { PageTab, BusData } from '../types';
import { INITIAL_BUSES, SYSTEM_COMPONENTS } from '../data/projectData';
import { 
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
  Link2, 
  AlertTriangle, 
  ArrowRight, 
  ExternalLink, 
  Sparkles, 
  HelpCircle, 
  Gauge, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  ShieldAlert, 
  X, 
  Volume2, 
  VolumeX, 
  Award,
  Zap
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
    '[BOOT] Node ESP8266-ATL-01 online. MFRC522 SPI ready.',
    '[READY] Click "SIMULATE APPROACH" to trigger arrival.'
  ]);
  const [rfidPacket, setRfidPacket] = useState<string | null>('A3 F2 19 7C');
  const [isUnknownTagTest, setIsUnknownTagTest] = useState<boolean>(false);

  const selectedBus = buses.find((b) => b.id === selectedBusId) || buses[0];

  // Beep sound simulator using Web Audio API
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
      // Audio not permitted or supported
    }
  };

  const handleSimulateArrival = () => {
    if (simState === 'approaching' || simState === 'detecting' || simState === 'processing') return;

    if (isUnknownTagTest) {
      setSimState('approaching');
      setSimLog((prev) => [
        `[0.0s] Unregistered RFID token approaching MFRC522 detection perimeter...`,
        ...prev,
      ]);

      setTimeout(() => {
        setSimState('detecting');
        setRfidPacket('E7 9A 41 BC');
        playBeep('detect');
        setSimLog((prev) => [
          `[1.1s] MFRC522 RF detected transponder UID: [E7 9A 41 BC]`,
          ...prev,
        ]);

        setTimeout(() => {
          setSimState('processing');
          setSimLog((prev) => [
            `[1.9s] ESP8266 MCU comparing UID with fleet database...`,
            ...prev,
          ]);

          setTimeout(() => {
            setSimState('rejected');
            playBeep('warn');
            setSimLog((prev) => [
              `[2.6s] ⚠️ ALERT: UID unrecognized. Access rejected. Display suppressed.`,
              ...prev,
            ]);
          }, 700);
        }, 700);
      }, 900);
      return;
    }

    setSimState('approaching');
    setSimLog((prev) => [
      `[0.0s] ${selectedBus.name} (${selectedBus.code}) approaching station bay...`,
      ...prev,
    ]);

    setTimeout(() => {
      setSimState('detecting');
      setRfidPacket(selectedBus.rfidUid);
      playBeep('detect');
      setSimLog((prev) => [
        `[1.1s] MFRC522 detected transponder UID: [${selectedBus.rfidUid}]`,
        ...prev,
      ]);

      setTimeout(() => {
        setSimState('processing');
        setSimLog((prev) => [
          `[1.9s] ESP8266 matched UID ➔ Verified: ${selectedBus.name}. Telematics logged.`,
          ...prev,
        ]);

        setTimeout(() => {
          setSimState('arrived');
          playBeep('success');
          setBuses((prev) =>
            prev.map((b) => (b.id === selectedBus.id ? { ...b, status: 'At Station', nextArrivalMinutes: 0 } : b))
          );
          setSimLog((prev) => [
            `[2.7s] Passenger Display updated: "${selectedBus.name} (${selectedBus.code})" DOCKED AT BAY 1.`,
            ...prev,
          ]);
        }, 700);
      }, 700);
    }, 900);
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
      '[MODE] Switched to UNREGISTERED RFID CARD TEST. Click "SIMULATE APPROACH".',
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
        `[SELECT] Selected ${bus.name} (${bus.code}). UID: ${bus.rfidUid}.`,
        ...prev,
      ]);
    }
  };

  // --- MODULE 02: ENERGY LAB STATE ---
  const [solarIrradiance, setSolarIrradiance] = useState<number>(68); // ~12.4W
  const [footTraffic, setFootTraffic] = useState<number>(45); // ~3.8W

  const solarOutputWatts = Number(((solarIrradiance / 100) * 18.2).toFixed(1));
  const piezoOutputWatts = Number(((footTraffic / 100) * 8.4).toFixed(1));
  const totalHarvestedWatts = Number((solarOutputWatts + piezoOutputWatts).toFixed(1));
  const stationBaseLoadWatts = 4.2;
  const netEnergyBalanceWatts = Number((totalHarvestedWatts - stationBaseLoadWatts).toFixed(1));
  const solarMixPct = totalHarvestedWatts > 0 ? Math.round((solarOutputWatts / totalHarvestedWatts) * 100) : 0;
  const piezoMixPct = 100 - solarMixPct;

  const setEnergyPreset = (name: 'dashboard' | 'noon' | 'rain' | 'night') => {
    if (name === 'dashboard') {
      setSolarIrradiance(68);
      setFootTraffic(45);
    } else if (name === 'noon') {
      setSolarIrradiance(98);
      setFootTraffic(20);
    } else if (name === 'rain') {
      setSolarIrradiance(18);
      setFootTraffic(85);
    } else if (name === 'night') {
      setSolarIrradiance(0);
      setFootTraffic(55);
    }
  };

  // --- MODULE 03: BUILD THE STATION STATE ---
  const initialNodes = [
    { id: 'solar', label: 'Solar Array', category: 'Energy', icon: Sun },
    { id: 'piezo', label: 'Piezo Matrix', category: 'Energy', icon: Footprints },
    { id: 'storage', label: 'LiFePO4 Buffer', category: 'Storage', icon: BatteryCharging },
    { id: 'controller', label: 'ESP8266 MCU', category: 'Brain', icon: Cpu },
    { id: 'rfid', label: 'MFRC522 RFID', category: 'Sensor', icon: Radio },
    { id: 'bus', label: 'Transit Bus', category: 'Vehicle', icon: Bus },
    { id: 'display', label: 'Passenger UI', category: 'Output', icon: Tv },
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
    <div className="w-full bg-[#F4F5F7] text-[#1A1A1A] min-h-screen">
      {/* ========================================================================= */}
      {/* 1. COMPACT EXHIBITION TOP BAR (NO SCROLL REQUIRED) */}
      {/* ========================================================================= */}
      <section className="bg-white border-b border-[#E2E4E8] py-2 px-4 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
          {/* Left: Brand & Telemetry Chip */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h1 className="text-base sm:text-lg font-bold font-display tracking-tight text-neutral-900">
                SUNSTRIDE LAB
              </h1>
            </div>
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-neutral-100 border border-neutral-300 text-[10px] font-mono font-semibold text-neutral-700">
              <span className="text-emerald-700 font-bold">ESP8266-ATL-01</span>
              <span>•</span>
              <span className="text-amber-700">MFRC522</span>
              <span>•</span>
              <span className="text-sky-700">5.1V (78%)</span>
            </div>
          </div>

          {/* Center: Module Switcher Tabs */}
          <div className="flex items-center gap-1 font-mono text-xs">
            {[
              { id: 'tracking', label: '01 / BUS TRACKING', icon: Bus },
              { id: 'energy', label: '02 / ENERGY LAB', icon: Sun },
              { id: 'builder', label: '03 / CIRCUIT', icon: Link2 },
              { id: 'explorer', label: '04 / CAD EXPLORER', icon: Cpu },
            ].map((mod) => {
              const isActive = activeModule === mod.id;
              const Icon = mod.icon;
              return (
                <button
                  key={mod.id}
                  id={`lab-tab-${mod.id}`}
                  onClick={() => setActiveModule(mod.id as any)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md font-semibold text-[11px] transition-all cursor-pointer ${
                    isActive
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-neutral-500'}`} />
                  <span>{mod.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right: Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              id="btn-teacher-speech-guide"
              onClick={() => setShowTeacherGuide(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-[11px] font-bold shadow-xs cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>SPEECH GUIDE</span>
            </button>

            <a
              id="btn-lab-to-dashboard"
              href="https://affaninschool.github.io/SunStride_Dashboard/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-neutral-900 hover:bg-neutral-800 text-amber-400 font-mono text-[11px] font-bold border border-neutral-700 shadow-xs cursor-pointer"
            >
              <Gauge className="w-3.5 h-3.5" />
              <span className="hidden md:inline">LIVE DASHBOARD</span>
              <ExternalLink className="w-3 h-3 text-neutral-400" />
            </a>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-md bg-neutral-100 border border-neutral-300 text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
              title={soundEnabled ? 'Mute' : 'Unmute'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-600" /> : <VolumeX className="w-3.5 h-3.5 text-neutral-400" />}
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. UNIFIED SCREEN-FIT MODULE ARENA */}
      {/* ========================================================================= */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-3 space-y-3">
        {/* ======================================================================= */}
        {/* MODULE 01: BUS TRACKING SIMULATOR (FITS ON ONE SCREEN WITHOUT SCROLL) */}
        {/* ======================================================================= */}
        {activeModule === 'tracking' && (
          <div className="space-y-2.5">
            {/* FLEET SELECTOR RIBBON (COMPACT) */}
            <div className="bg-white p-2 rounded-xl border border-[#E2E4E8] shadow-xs flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-mono font-bold text-neutral-600 flex items-center gap-1 pl-1">
                <Bus className="w-3.5 h-3.5 text-amber-500" />
                <span>SELECT FLEET BUS:</span>
              </span>

              <div className="flex flex-wrap items-center gap-1.5">
                {buses.map((bus) => {
                  const isSelected = selectedBusId === bus.id && !isUnknownTagTest;
                  const isAtStation = bus.status === 'At Station';
                  return (
                    <button
                      key={bus.id}
                      onClick={() => handleSelectBus(bus.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-amber-400/20 border-amber-500 text-neutral-950 font-bold ring-1 ring-amber-400'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <span className="font-bold">{bus.code}</span>
                      <span className="text-neutral-500 truncate max-w-[100px]">{bus.name}</span>
                      {isAtStation && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                    </button>
                  );
                })}

                {/* Unknown Tag Security Testing Button */}
                <button
                  onClick={handleSelectUnknownTest}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer border ${
                    isUnknownTagTest
                      ? 'bg-rose-100 border-rose-500 text-rose-950 font-bold ring-1 ring-rose-400'
                      : 'bg-rose-50/70 border-rose-200 text-rose-700 hover:bg-rose-100'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                  <span>TEST: UNREGISTERED CARD</span>
                </button>
              </div>
            </div>

            {/* INTEGRATED OUTPUT & SIMULATION GRID (ALL AT THE SAME EYE-LEVEL) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
              {/* LEFT 7 COLS: VISUAL ROAD, ANTENNA & SIMULATE BUTTON */}
              <div className="lg:col-span-7 bg-[#14171C] rounded-xl border border-neutral-800 p-3.5 text-white space-y-2.5 shadow-md">
                {/* STAGE HEADER: DOCKED ACTION BUTTONS ARE RIGHT HERE NEXT TO OUTPUT! */}
                <div className="flex items-center justify-between gap-2 border-b border-neutral-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-xs font-mono font-bold text-amber-400">
                      BAY 01 • MFRC522 RF ZONE
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      simState === 'arrived'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-700'
                        : simState === 'rejected'
                        ? 'bg-rose-950 text-rose-400 border border-rose-700'
                        : 'bg-neutral-900 text-neutral-400'
                    }`}>
                      {simState.toUpperCase()}
                    </span>
                  </div>

                  {/* ★ EASY FIX: SIMULATE APPROACH BUTTON RIGHT AT THE OUTPUT END! ★ */}
                  <div className="flex items-center gap-1.5">
                    <button
                      id="lab-bus-arrive-btn"
                      onClick={handleSimulateArrival}
                      disabled={simState === 'approaching' || simState === 'detecting' || simState === 'processing'}
                      className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-neutral-950 font-mono text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer shadow-md shadow-amber-500/20 transition-all active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>SIMULATE APPROACH</span>
                    </button>

                    <button
                      id="lab-bus-reset-btn"
                      onClick={handleResetSimulation}
                      className="flex items-center gap-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-mono text-xs px-2.5 py-1.5 rounded-lg cursor-pointer transition-all"
                      title="Reset Simulation"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>RESET</span>
                    </button>
                  </div>
                </div>

                {/* ANIMATED CANVAS STAGE (COMPACT ~175px HEIGHT) */}
                <div className="relative h-44 border border-neutral-800 rounded-lg bg-neutral-950 p-3 flex flex-col justify-between overflow-hidden">
                  {/* RFID Interrogation Zone Radius */}
                  <div className="absolute right-12 top-1/2 -translate-y-1/2 w-36 h-36 rounded-full border border-amber-500/20 flex items-center justify-center pointer-events-none">
                    <div className={`w-28 h-28 rounded-full border border-dashed ${
                      simState === 'rejected'
                        ? 'border-rose-400/70'
                        : simState === 'detecting'
                        ? 'border-amber-400/80 animate-spin'
                        : 'border-emerald-400/30'
                    }`} />
                    <div className="text-[8px] font-mono text-amber-400/70 absolute -bottom-3.5">
                      13.56 MHz PROXIMITY
                    </div>
                  </div>

                  {/* Approaching Transit Bus Object */}
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 z-20 flex items-center gap-2"
                    initial={{ left: '4%' }}
                    animate={{
                      left:
                        simState === 'idle'
                          ? '4%'
                          : simState === 'approaching'
                          ? '34%'
                          : simState === 'detecting' || simState === 'processing' || simState === 'arrived' || simState === 'rejected'
                          ? '60%'
                          : '4%',
                    }}
                    transition={{ duration: 0.9, ease: 'easeInOut' }}
                  >
                    <div className={`p-2.5 rounded-lg shadow-lg flex items-center gap-2 border ${
                      isUnknownTagTest
                        ? 'bg-rose-950 border-rose-500'
                        : 'bg-neutral-900 border-amber-500/70'
                    }`}>
                      <Bus className={`w-5 h-5 ${isUnknownTagTest ? 'text-rose-400' : 'text-amber-400'}`} />
                      <div className="text-xs font-mono leading-tight">
                        <span className="font-bold block text-white">
                          {isUnknownTagTest ? 'UNKNOWN TOKEN' : selectedBus.code}
                        </span>
                        <span className="text-[8px] text-neutral-400">
                          {isUnknownTagTest ? 'UNREGISTERED' : 'PASSIVE RFID'}
                        </span>
                      </div>
                    </div>

                    {/* Transponder RF wave pulse */}
                    {(simState === 'detecting' || simState === 'processing') && (
                      <div className={`w-6 h-6 rounded-full border-2 animate-ping ${
                        isUnknownTagTest ? 'border-rose-400' : 'border-amber-400'
                      }`} />
                    )}
                  </motion.div>

                  {/* Station Pole & Sensor Graphic */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                    <div className={`p-2 rounded-lg border transition-all ${
                      simState === 'arrived'
                        ? 'bg-emerald-950 border-emerald-400 text-emerald-300 ring-2 ring-emerald-500/40'
                        : simState === 'rejected'
                        ? 'bg-rose-950 border-rose-400 text-rose-300 ring-2 ring-rose-500/40'
                        : simState === 'detecting' || simState === 'processing'
                        ? 'bg-amber-950 border-amber-400 text-amber-300 animate-pulse'
                        : 'bg-neutral-900 border-neutral-700 text-neutral-400'
                    }`}>
                      <Radio className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-mono text-neutral-300 mt-1 font-semibold">STATION POLE</span>
                    <span className="text-[8px] font-mono text-amber-400">MFRC522</span>
                  </div>
                </div>

                {/* TELEMETRY PACKET & ROUTE BREADCRUMB STRIP */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  {/* Packet UID Card */}
                  <div className={`p-2 rounded border flex items-center justify-between ${
                    simState === 'rejected'
                      ? 'bg-rose-950/60 border-rose-800 text-rose-200'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-300'
                  }`}>
                    <div>
                      <span className="text-[9px] text-neutral-500 block">SCANNED UID:</span>
                      <span className={`font-bold ${simState === 'rejected' ? 'text-rose-400' : 'text-amber-400'}`}>
                        {rfidPacket || 'Awaiting tag...'}
                      </span>
                    </div>
                    <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                      simState === 'arrived' ? 'bg-emerald-950 text-emerald-400' : simState === 'rejected' ? 'bg-rose-950 text-rose-400' : 'text-neutral-500'
                    }`}>
                      {simState === 'arrived' ? 'VERIFIED ✓' : simState === 'rejected' ? 'DENIED ✗' : 'IDLE'}
                    </span>
                  </div>

                  {/* Route Stop Mini Path */}
                  <div className="p-2 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-neutral-500 block">ACTIVE ITINERARY:</span>
                      <span className="text-white font-semibold truncate block max-w-[190px]">
                        {!isUnknownTagTest && selectedBus.stops ? selectedBus.stops.join(' ➔ ') : 'Security Test Target'}
                      </span>
                    </div>
                    <span className="text-[9px] text-amber-400">STOP 2</span>
                  </div>
                </div>
              </div>

              {/* RIGHT 5 COLS: OUTPUT END (PASSENGER DISPLAY + FIRMWARE LOG) */}
              <div className="lg:col-span-5 space-y-2.5">
                {/* STATION PASSENGER DISPLAY (PID) */}
                <div className="bg-white p-3.5 rounded-xl border border-[#E2E4E8] shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                    <div className="flex items-center gap-1.5">
                      <Tv className="w-4 h-4 text-neutral-900" />
                      <span className="font-mono text-xs font-bold text-neutral-900">
                        PASSENGER DISPLAY (PID)
                      </span>
                    </div>
                    <span className="font-mono text-[9px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      BISTABLE E-PAPER (0W STANDBY)
                    </span>
                  </div>

                  {/* E-PAPER FRAME UI */}
                  <div className="p-3 bg-[#F0F2F5] border-2 border-neutral-900 rounded-lg font-mono space-y-2">
                    <div className="flex items-center justify-between border-b border-neutral-300 pb-1.5 text-[10px] text-neutral-600">
                      <span className="font-bold">SUNSTRIDE SMART SHELTER</span>
                      <span>14:28:10</span>
                    </div>

                    {isUnknownTagTest && simState === 'rejected' ? (
                      <div className="p-2.5 bg-rose-50 border border-rose-300 rounded space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-rose-800">UNKNOWN TOKEN</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-700 text-white">
                            ACCESS DENIED
                          </span>
                        </div>
                        <p className="text-[11px] text-rose-700 font-sans">Unregistered RFID Card Suppressed</p>
                        <div className="pt-1 text-[9px] text-rose-600 flex justify-between border-t border-rose-200">
                          <span>UID: E7 9A 41 BC</span>
                          <span>TAMPER LOG RECORDED</span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-2.5 bg-white border border-neutral-300 rounded space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-base font-bold text-neutral-950">
                            {selectedBus.code} • {selectedBus.name}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            simState === 'arrived' ? 'bg-emerald-600 text-white' : 'bg-neutral-200 text-neutral-800'
                          }`}>
                            {simState === 'arrived' ? 'AT BAY 1' : 'EN ROUTE'}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-600 font-sans">
                          Destination: <span className="font-semibold text-neutral-800">{selectedBus.destination}</span>
                        </p>
                        <div className="pt-1.5 text-[10px] text-neutral-500 flex justify-between border-t border-neutral-100">
                          <span>ETA: <strong className="text-neutral-900">{simState === 'arrived' ? 'NOW (DOCKED)' : `${selectedBus.nextArrivalMinutes} min`}</strong></span>
                          <span>Load: {selectedBus.occupancy}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* FIRMWARE EVENT LOG (COMPACT TERMINAL ~120px HEIGHT) */}
                <div className="p-2.5 bg-[#14171C] text-neutral-300 rounded-xl font-mono text-[10px] h-28 overflow-y-auto space-y-1 border border-neutral-800">
                  <div className="text-[9px] text-neutral-500 border-b border-neutral-800 pb-1 flex items-center justify-between">
                    <span>ESP8266 FIRMWARE LOG</span>
                    <span className="text-emerald-400">TELEMETRY STREAM</span>
                  </div>
                  {simLog.map((log, i) => (
                    <div key={i} className={`leading-tight ${log.includes('ALERT') ? 'text-rose-400 font-bold' : log.includes('updated') || log.includes('DOCKED') ? 'text-emerald-400 font-bold' : 'text-neutral-300'}`}>
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* TEACHER EXPLANATION QUICK FOOTER CUE */}
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-neutral-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 font-bold text-amber-900 text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>EXHIBITION QUICK CUE:</span>
                <span className="font-normal text-neutral-700">
                  "Passive RFID transponders cost under ₹20, require zero batteries, and detect bus arrivals in 2ms without cellular data fees!"
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* MODULE 02: ENERGY LAB & HARVESTING (COMPACT SCREEN-FIT) */}
        {/* ======================================================================= */}
        {activeModule === 'energy' && (
          <div className="space-y-3">
            {/* Quick Environmental Presets Bar */}
            <div className="p-2 bg-white rounded-xl border border-[#E2E4E8] shadow-xs flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <span className="font-bold text-neutral-700 flex items-center gap-1 pl-1">
                <Sliders className="w-3.5 h-3.5 text-amber-600" />
                <span>WEATHER PRESETS:</span>
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => setEnergyPreset('dashboard')}
                  className="px-2.5 py-1 rounded bg-amber-500 text-neutral-950 font-bold hover:bg-amber-400 transition-colors cursor-pointer"
                >
                  Dashboard (12.4W Solar / 3.8W Piezo)
                </button>
                <button
                  onClick={() => setEnergyPreset('noon')}
                  className="px-2.5 py-1 rounded bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  Peak Noon Sun
                </button>
                <button
                  onClick={() => setEnergyPreset('rain')}
                  className="px-2.5 py-1 rounded bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  Monsoon Rush (Low Sun + High Steps)
                </button>
                <button
                  onClick={() => setEnergyPreset('night')}
                  className="px-2.5 py-1 rounded bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  Night (100% Piezo Only)
                </button>
              </div>
            </div>

            {/* Controls and Yield Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
              {/* Left 6 Cols: Interactive Sliders */}
              <div className="lg:col-span-6 bg-white p-4 rounded-xl border border-[#E2E4E8] shadow-xs space-y-4">
                <h3 className="text-sm font-bold font-display text-neutral-900 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-emerald-600" />
                  <span>Environmental Input Sliders</span>
                </h3>

                {/* Solar Slider */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="font-bold flex items-center gap-1 text-neutral-800">
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      SOLAR IRRADIANCE
                    </span>
                    <span className="text-amber-600 font-bold">{solarIrradiance}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={solarIrradiance}
                    onChange={(e) => setSolarIrradiance(Number(e.target.value))}
                    className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                </div>

                {/* Foot Traffic Slider */}
                <div className="space-y-1 pt-2 border-t border-neutral-100">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="font-bold flex items-center gap-1 text-neutral-800">
                      <Footprints className="w-3.5 h-3.5 text-emerald-600" />
                      PEDESTRIAN STEPS (PIEZO)
                    </span>
                    <span className="text-emerald-700 font-bold">{footTraffic}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={footTraffic}
                    onChange={(e) => setFootTraffic(Number(e.target.value))}
                    className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                </div>

                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs font-mono text-neutral-600 space-y-1">
                  <span className="font-bold text-neutral-900 block text-[10px]">WHY DUAL-HARVESTING WINS:</span>
                  <p className="text-[11px] leading-relaxed">
                    When sunlight is zero (night or heavy rain), commuter footfall peaks during commute rush hours, generating kinetic micro-joules to maintain battery charge.
                  </p>
                </div>
              </div>

              {/* Right 6 Cols: Power Telemetry Readout */}
              <div className="lg:col-span-6 bg-[#14171C] text-white p-4 rounded-xl border border-neutral-800 space-y-3.5 shadow-md">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2 text-xs font-mono text-neutral-400">
                  <span className="text-emerald-400 font-bold">POWER MANAGEMENT TELEMETRY</span>
                  <span>BUFFER: 12.8V LiFePO4 (5.1V LOGIC)</span>
                </div>

                {/* Dual Gauges */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-2.5 bg-neutral-900 rounded-lg border border-neutral-800 font-mono">
                    <span className="text-[9px] text-neutral-400 block uppercase">Solar Array</span>
                    <span className="text-xl font-bold text-amber-400 font-display">{solarOutputWatts} W</span>
                  </div>
                  <div className="p-2.5 bg-neutral-900 rounded-lg border border-neutral-800 font-mono">
                    <span className="text-[9px] text-neutral-400 block uppercase">Piezo Kinetic</span>
                    <span className="text-xl font-bold text-emerald-400 font-display">{piezoOutputWatts} W</span>
                  </div>
                </div>

                {/* Mix Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-neutral-400">SOURCE MIX:</span>
                    <span className="text-white font-bold">{solarMixPct}% Solar • {piezoMixPct}% Piezo</span>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden flex bg-neutral-900 border border-neutral-800">
                    <div style={{ width: `${solarMixPct}%` }} className="bg-amber-400 transition-all duration-300" />
                    <div style={{ width: `${piezoMixPct}%` }} className="bg-emerald-400 transition-all duration-300" />
                  </div>
                </div>

                {/* Net Balance */}
                <div className="p-3 bg-neutral-900 rounded-lg border border-emerald-500/40 font-mono text-xs flex items-center justify-between">
                  <div>
                    <span className="text-neutral-400 block text-[9px]">TOTAL GENERATION:</span>
                    <span className="text-sm font-bold text-emerald-400">{totalHarvestedWatts} W</span>
                  </div>
                  <div className="text-right">
                    <span className="text-neutral-400 block text-[9px]">NET SURPLUS CHARGE:</span>
                    <span className={`text-sm font-bold ${netEnergyBalanceWatts >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {netEnergyBalanceWatts >= 0 ? `+${netEnergyBalanceWatts} W` : `${netEnergyBalanceWatts} W`}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div className="p-1.5 rounded bg-neutral-900 border border-neutral-800">
                    <span className="text-[8px] text-neutral-500 block">BATTERY</span>
                    <span className="font-bold text-white">78%</span>
                  </div>
                  <div className="p-1.5 rounded bg-neutral-900 border border-neutral-800">
                    <span className="text-[8px] text-neutral-500 block">VOLTAGE</span>
                    <span className="font-bold text-amber-400">5.1 V</span>
                  </div>
                  <div className="p-1.5 rounded bg-neutral-900 border border-neutral-800">
                    <span className="text-[8px] text-neutral-500 block">TODAY</span>
                    <span className="font-bold text-emerald-400">0.42 kWh</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* MODULE 03: CIRCUIT INTEGRATION & BUILDER (COMPACT SCREEN-FIT) */}
        {/* ======================================================================= */}
        {activeModule === 'builder' && (
          <div className="space-y-3">
            <div className="p-2.5 bg-white rounded-xl border border-[#E2E4E8] shadow-xs flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-neutral-800">
                TOPOLOGY OBJECTIVE: Connect Sources ➔ Battery ➔ MCU ➔ Sensor & Bus ➔ Display.
              </span>
              <button
                id="lab-builder-reset-btn"
                onClick={() => setConnectedPairs([{ from: 'solar', to: 'storage' }, { from: 'storage', to: 'controller' }])}
                className="text-neutral-600 hover:text-neutral-900 underline cursor-pointer"
              >
                Reset Links
              </button>
            </div>

            {/* Node Matrix Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
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
                    className={`p-2.5 rounded-lg border transition-all cursor-pointer font-mono text-xs text-center ${
                      isSelectedForConnect
                        ? 'bg-neutral-900 text-white border-neutral-900 ring-2 ring-amber-400'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mx-auto mb-1 ${isSelectedForConnect ? 'text-amber-400' : 'text-neutral-700'}`} />
                    <h4 className="font-bold text-[11px] truncate">{node.label}</h4>
                    <span className="text-[9px] text-neutral-500 block mt-0.5">{activeConnections.length} Links</span>
                  </div>
                );
              })}
            </div>

            {/* Diagnostics Feedback Card */}
            <div className="bg-[#14171C] text-white p-3.5 rounded-xl border border-neutral-800 space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <span className="text-amber-400 font-bold">CIRCUIT DIAGNOSTICS</span>
                <span>{connectedPairs.length} ACTIVE LINKS</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className={`p-2 rounded border text-center ${hasEnergyHarvesting ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300' : 'bg-neutral-900 border-neutral-800 text-neutral-500'}`}>
                  <span className="text-[10px] block">1. Energy ➔ Battery</span>
                  <span className="font-bold">{hasEnergyHarvesting ? '✓ LINKED' : '✗ OPEN'}</span>
                </div>
                <div className={`p-2 rounded border text-center ${hasPowerToMcu ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300' : 'bg-neutral-900 border-neutral-800 text-neutral-500'}`}>
                  <span className="text-[10px] block">2. Battery ➔ MCU</span>
                  <span className="font-bold">{hasPowerToMcu ? '✓ LINKED' : '✗ OPEN'}</span>
                </div>
                <div className={`p-2 rounded border text-center ${hasRfidDetection ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300' : 'bg-neutral-900 border-neutral-800 text-neutral-500'}`}>
                  <span className="text-[10px] block">3. Bus ➔ RFID ➔ MCU</span>
                  <span className="font-bold">{hasRfidDetection ? '✓ LINKED' : '✗ OPEN'}</span>
                </div>
                <div className={`p-2 rounded border text-center ${hasPassengerDisplay ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300' : 'bg-neutral-900 border-neutral-800 text-neutral-500'}`}>
                  <span className="text-[10px] block">4. MCU ➔ Display</span>
                  <span className="font-bold">{hasPassengerDisplay ? '✓ LINKED' : '✗ OPEN'}</span>
                </div>
              </div>

              {isCompleteCircuit ? (
                <div className="p-2.5 bg-emerald-900/60 border border-emerald-500 rounded-lg text-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>COMPLETE: Fully closed energy-aware transit detection loop established!</span>
                </div>
              ) : (
                <div className="p-2.5 bg-amber-950/60 border border-amber-500/50 rounded-lg text-amber-200 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>INCOMPLETE: Click two component cards above to establish links.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* MODULE 04: CAD EXPLORER (COMPACT SCREEN-FIT) */}
        {/* ======================================================================= */}
        {activeModule === 'explorer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
            {/* Visual Hotspot Schematic (Left 7 Cols) */}
            <div className="lg:col-span-7 bg-[#14171C] text-white p-3.5 rounded-xl border border-neutral-800 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2 text-xs font-mono text-neutral-400 mb-2">
                <span className="text-amber-400 font-bold">2D SCHEMATIC CAD VIEW</span>
                <span>CLICK HOTSPOT TO INSPECT</span>
              </div>

              <div className="relative h-60 border border-neutral-800 rounded-lg bg-neutral-950 p-4 flex flex-col justify-between">
                {/* Roof Canopy Hotspot */}
                <button
                  onClick={() => setExplorerComponentId('solar-pv')}
                  className={`absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg border font-mono text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                    explorerComponentId === 'solar-pv'
                      ? 'bg-amber-950 border-amber-400 text-amber-200 ring-1 ring-amber-400'
                      : 'bg-neutral-900 border-neutral-700 text-neutral-300'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>CANOPY SOLAR ARRAY</span>
                </button>

                {/* Middle Column: Display & MCU */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
                  <button
                    onClick={() => setExplorerComponentId('display-interface')}
                    className={`px-2.5 py-1.5 rounded-lg border font-mono text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                      explorerComponentId === 'display-interface'
                        ? 'bg-sky-950 border-sky-400 text-sky-200 ring-1 ring-sky-400'
                        : 'bg-neutral-900 border-neutral-700 text-neutral-300'
                    }`}
                  >
                    <Tv className="w-3.5 h-3.5 text-sky-400" />
                    <span>E-PAPER DISPLAY</span>
                  </button>

                  <button
                    onClick={() => setExplorerComponentId('controller-mcu')}
                    className={`px-2.5 py-1.5 rounded-lg border font-mono text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                      explorerComponentId === 'controller-mcu'
                        ? 'bg-blue-950 border-blue-400 text-blue-200 ring-1 ring-blue-400'
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
                  className={`absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg border font-mono text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                    explorerComponentId === 'rfid-reader'
                      ? 'bg-amber-950 border-amber-400 text-amber-200 ring-1 ring-amber-400'
                      : 'bg-neutral-900 border-neutral-700 text-neutral-300'
                  }`}
                >
                  <Radio className="w-3.5 h-3.5 text-amber-400" />
                  <span>MFRC522 RFID SENSOR</span>
                </button>

                {/* Floor Hotspot: Piezo Matrix */}
                <button
                  onClick={() => setExplorerComponentId('piezo-array')}
                  className={`absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg border font-mono text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                    explorerComponentId === 'piezo-array'
                      ? 'bg-emerald-950 border-emerald-400 text-emerald-200 ring-1 ring-emerald-400'
                      : 'bg-neutral-900 border-neutral-700 text-neutral-300'
                  }`}
                >
                  <Footprints className="w-3.5 h-3.5 text-emerald-400" />
                  <span>PIEZO FOOTSTEP MATRIX</span>
                </button>
              </div>
            </div>

            {/* Subsystem Specifications Card (Right 5 Cols) */}
            <div className="lg:col-span-5 bg-white p-4 rounded-xl border border-[#E2E4E8] shadow-xs space-y-2.5">
              <div className="border-b border-neutral-100 pb-2">
                <span className="text-[10px] font-mono font-bold text-amber-700 uppercase">
                  INSPECTING SUBSYSTEM
                </span>
                <h3 className="text-base font-bold font-display text-neutral-900">
                  {explorerComp.name}
                </h3>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-mono font-bold text-neutral-900 uppercase block text-[10px]">
                    FUNCTION:
                  </span>
                  <p className="text-neutral-600 leading-relaxed text-[11px]">{explorerComp.functionDesc}</p>
                </div>

                <div>
                  <span className="font-mono font-bold text-neutral-900 uppercase block text-[10px]">
                    WHY IT MATTERS IN SUNSTRIDE:
                  </span>
                  <p className="text-neutral-600 leading-relaxed text-[11px]">{explorerComp.whyItMatters}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-100">
                <button
                  onClick={() => onSelectTab('docs')}
                  className="text-xs font-mono font-bold text-neutral-900 underline hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>Full hardware specs in Documentation</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

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
                    <span className="font-bold text-emerald-700 block">1. Click "SIMULATE APPROACH"</span>
                    <p className="text-neutral-600 font-sans">
                      "Watch on screen as Solaris Express approaches. Its passive RFID card (UID: A3 F2 19 7C) passes our station sensor. Within 2 milliseconds, the ESP8266 microcontroller logs the arrival and updates the commuter e-Paper display."
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-neutral-50 border border-neutral-200 space-y-1.5">
                    <span className="font-bold text-amber-700 block">2. Click "Test: Unregistered Card"</span>
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
