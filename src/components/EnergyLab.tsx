/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sun, 
  Footprints, 
  Zap, 
  RotateCcw, 
  Play, 
  Pause, 
  Sliders, 
  Cpu, 
  Info, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Gauge, 
  BatteryCharging, 
  Bus, 
  ChevronRight,
  Layers,
  Activity,
  Compass,
  Repeat,
  Clock
} from 'lucide-react';

interface EnergyLabProps {
  onExploreModule?: (moduleId: string) => void;
}

export const EnergyLab: React.FC<EnergyLabProps> = ({ onExploreModule }) => {
  // Active innovation sub-tab
  const [activeInnovation, setActiveInnovation] = useState<
    'suntrack' | 'stepvolt' | 'roadvolt' | 'brakeback' | 'ecofusion'
  >('suntrack');

  // Reduced motion preference
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  // ---------------------------------------------------------------------------
  // INNOVATION A: SUNTRACK STATE
  // ---------------------------------------------------------------------------
  // timeOfDay: 6 (06:00 sunrise) to 18 (18:00 sunset)
  const [timeOfDay, setTimeOfDay] = useState<number>(12); // noon default
  const [isSunPlaying, setIsSunPlaying] = useState<boolean>(false);
  const [suntrackComparisonMode, setSuntrackComparisonMode] = useState<'side-by-side' | 'overlay'>('side-by-side');

  // Calculate sun angle and elevation:
  // At 6am: angle = -75 deg, elevation = 15 deg
  // At 12pm: angle = 0 deg (overhead), elevation = 90 deg
  // At 6pm: angle = +75 deg, elevation = 15 deg
  const sunProgress = (timeOfDay - 6) / 12; // 0 to 1
  const sunAzimuthAngle = (sunProgress - 0.5) * 150; // -75 to +75 deg
  const sunElevation = Math.max(10, Math.sin(sunProgress * Math.PI) * 90); // 10 to 90 deg

  // Fixed Panel is permanently set at 25° south-facing inclination (fixed angle = 25°)
  // The incidence angle error is the difference between sun angle and fixed angle
  const fixedPanelAngle = 0; // horizontal with fixed 25 tilt conceptual
  const fixedAngleOffset = Math.abs(sunAzimuthAngle);
  // Cosine factor for fixed panel: cos(theta) where theta is angle offset in radians
  const fixedCosineFactor = Math.max(0.15, Math.cos((fixedAngleOffset * Math.PI) / 180));
  // Tracking Panel dynamically rotates to match sunAzimuthAngle:
  const trackerAngle = Math.max(-60, Math.min(60, sunAzimuthAngle * 0.85)); // servo rotation range +/- 60 deg
  const trackerAngleError = Math.abs(sunAzimuthAngle - trackerAngle);
  const trackerCosineFactor = Math.max(0.85, Math.cos((trackerAngleError * Math.PI) / 180));

  // Simulated power values (clearly labeled as illustrative simulation):
  // Baseline peak solar irradiance = 100% (12.0 W conceptual scale)
  const peakRatingW = 12.0;
  const fixedSimulatedWatts = Number((peakRatingW * fixedCosineFactor * (sunElevation / 90)).toFixed(2));
  const trackerSimulatedWatts = Number((peakRatingW * trackerCosineFactor * (sunElevation / 90)).toFixed(2));
  // Servo parasitic consumption during adjustment: ~0.8 W during movement
  const trackerParasiticWatts = isSunPlaying ? 0.75 : 0.05;
  const trackerNetWatts = Number(Math.max(0, trackerSimulatedWatts - trackerParasiticWatts).toFixed(2));

  // Sun simulation timer
  useEffect(() => {
    if (!isSunPlaying) return;
    const interval = setInterval(() => {
      setTimeOfDay((prev) => {
        if (prev >= 18) return 6;
        return Number((prev + 0.1).toFixed(1));
      });
    }, 150);
    return () => clearInterval(interval);
  }, [isSunPlaying]);

  // ---------------------------------------------------------------------------
  // INNOVATION B: STEPVOLT STATE
  // ---------------------------------------------------------------------------
  const [stepStage, setStepStage] = useState<number>(0); // 0: ready, 1: approach, 2: press, 3: compress, 4: rectify, 5: store
  const [stepEnergyJoules, setStepEnergyJoules] = useState<number>(0.0);
  const [isAutoStepping, setIsAutoStepping] = useState<boolean>(false);
  const [totalStepCount, setTotalStepCount] = useState<number>(0);

  const triggerFootstep = () => {
    if (stepStage !== 0 && !isAutoStepping) return;
    setStepStage(1);
    setTimeout(() => setStepStage(2), 250);
    setTimeout(() => {
      setStepStage(3);
      setTotalStepCount((c) => c + 1);
    }, 550);
    setTimeout(() => setStepStage(4), 900);
    setTimeout(() => {
      setStepStage(5);
      setStepEnergyJoules((prev) => Number((prev + 0.025).toFixed(3)));
    }, 1300);
    setTimeout(() => {
      if (!isAutoStepping) setStepStage(0);
    }, 2200);
  };

  useEffect(() => {
    if (!isAutoStepping) return;
    const interval = setInterval(() => {
      triggerFootstep();
    }, 2600);
    return () => clearInterval(interval);
  }, [isAutoStepping]);

  // ---------------------------------------------------------------------------
  // INNOVATION C: ROADVOLT STATE
  // ---------------------------------------------------------------------------
  const [roadBusStage, setRoadBusStage] = useState<number>(0); // 0: idle, 1: approaching, 2: crossing/depressed, 3: generator spinning, 4: charged
  const [roadEnergyBufferWh, setRoadEnergyBufferWh] = useState<number>(1.4);

  const triggerRoadVoltPass = () => {
    if (roadBusStage !== 0) return;
    setRoadBusStage(1); // approach
    setTimeout(() => setRoadBusStage(2), 700); // wheel depresses ramp
    setTimeout(() => setRoadBusStage(3), 1400); // generator spins
    setTimeout(() => {
      setRoadBusStage(4);
      setRoadEnergyBufferWh((prev) => Number((prev + 0.08).toFixed(2)));
    }, 2200);
    setTimeout(() => setRoadBusStage(0), 3200); // reset
  };

  // ---------------------------------------------------------------------------
  // INNOVATION D: BRAKEBACK STATE
  // ---------------------------------------------------------------------------
  const [brakeMode, setBrakeMode] = useState<'cruising' | 'braking'>('cruising');
  const [brakeBusSpeed, setBrakeBusSpeed] = useState<number>(45); // km/h
  const [recoveredJoules, setRecoveredJoules] = useState<number>(34.8); // kJ
  const [isBrakeAnimActive, setIsBrakeAnimActive] = useState<boolean>(false);

  const triggerRegenBraking = () => {
    if (isBrakeAnimActive) return;
    setIsBrakeAnimActive(true);
    setBrakeMode('braking');
    
    // Simulate deceleration
    const decInterval = setInterval(() => {
      setBrakeBusSpeed((prev) => {
        if (prev <= 0) {
          clearInterval(decInterval);
          setRecoveredJoules((j) => Number((j + 4.2).toFixed(1)));
          setTimeout(() => {
            setBrakeMode('cruising');
            setBrakeBusSpeed(45);
            setIsBrakeAnimActive(false);
          }, 1800);
          return 0;
        }
        return prev - 5;
      });
    }, 150);
  };

  // ---------------------------------------------------------------------------
  // INNOVATION E: ECOFUSION STATE
  // ---------------------------------------------------------------------------
  const [selectedPathway, setSelectedPathway] = useState<'all' | 'suntrack' | 'stepvolt' | 'roadvolt' | 'brakeback'>('all');

  return (
    <div className="w-full bg-[#F4F5F7] text-[#1A1A1A] space-y-6">
      {/* ========================================================================= */}
      {/* 1. HERO & PURPOSE STATEMENT */}
      {/* ========================================================================= */}
      <section className="bg-white rounded-2xl border border-[#E2E4E8] p-5 sm:p-7 shadow-xs relative overflow-hidden">
        {/* Subtle background ambient grid decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-500/10 via-emerald-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#14171C] text-white text-[11px] font-mono font-bold tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>ATL ADVANCED RESEARCH EXPANSION</span>
            </div>

            {/* Accessibility: Reduced Motion Toggle */}
            <button
              onClick={() => setReducedMotion(!reducedMotion)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer border ${
                reducedMotion 
                  ? 'bg-neutral-900 text-white border-neutral-800' 
                  : 'bg-neutral-100 text-neutral-600 border-neutral-200 hover:bg-neutral-200'
              }`}
              title="Toggle animation motion reduction"
            >
              <Activity className="w-3 h-3 text-amber-500" />
              <span>{reducedMotion ? 'REDUCED MOTION: ON' : 'REDUCED MOTION: OFF'}</span>
            </button>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-4xl font-bold font-display text-neutral-900 tracking-tight">
              SUNSTRIDE ENERGY LAB
            </h2>
            <p className="text-lg sm:text-xl font-medium text-amber-800 font-display italic">
              “Every Movement Has Potential.”
            </p>
            <p className="text-sm sm:text-base text-neutral-600 max-w-3xl leading-relaxed">
              Explore how intelligent solar positioning and energy recovery concepts could contribute to more sustainable transport infrastructure.
            </p>
          </div>

          {/* ===================================================================== */}
          {/* CRITICAL THREE-TIER INTEGRITY CLASSIFICATION LEGEND */}
          {/* ===================================================================== */}
          <div className="mt-4 pt-4 border-t border-neutral-200/80">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 mb-2.5 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>STRICT RESEARCH CLASSIFICATION & INTEGRITY FRAMEWORK</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
              {/* Box 1: WORKING PROTOTYPE */}
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-emerald-950 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[11px] text-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span>WORKING PROTOTYPE</span>
                </div>
                <p className="text-[11px] text-emerald-900/90 font-sans leading-relaxed">
                  ESP8266 NodeMCU, RC522 RFID reader, 4 registered RFID cards, LED & buzzer feedback, offline Wi-Fi AP, local dashboard & API.
                </p>
              </div>

              {/* Box 2: CONCEPTUAL MODEL */}
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-950 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[11px] text-amber-800">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>CONCEPTUAL MODEL</span>
                </div>
                <p className="text-[11px] text-amber-900/90 font-sans leading-relaxed">
                  Solar-tracking assembly, piezoelectric floor representation, speed-breaker kinetic recovery, vehicle regenerative braking.
                </p>
              </div>

              {/* Box 3: SIMULATED WEBSITE EXPERIENCE */}
              <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-200/80 text-sky-950 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[11px] text-sky-800">
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  <span>SIMULATED EXPERIENCE</span>
                </div>
                <p className="text-[11px] text-sky-900/90 font-sans leading-relaxed">
                  Animated energy flows, illustrative fixed vs tracking simulation, interactive road & footstep mechanics, educational diagrams.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. INNOVATION TAB SELECTOR */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white rounded-xl border border-[#E2E4E8] shadow-xs font-mono text-xs">
        {[
          { id: 'suntrack', label: 'INNOVATION A · SUNTRACK', sub: 'Intelligent Solar Tracking', icon: Sun },
          { id: 'stepvolt', label: 'INNOVATION B · STEPVOLT', sub: 'Footstep Piezoelectric', icon: Footprints },
          { id: 'roadvolt', label: 'INNOVATION C · ROADVOLT', sub: 'Speed-Breaker Recovery', icon: Zap },
          { id: 'brakeback', label: 'INNOVATION D · BRAKEBACK', sub: 'Regenerative Braking', icon: BatteryCharging },
          { id: 'ecofusion', label: 'INNOVATION E · ECOFUSION', sub: 'Unified Infrastructure', icon: Layers },
        ].map((item) => {
          const isActive = activeInnovation === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveInnovation(item.id as any)}
              className={`flex-1 min-w-[170px] flex items-center gap-2.5 p-2.5 rounded-lg text-left transition-all cursor-pointer ${
                isActive
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-neutral-50/80 text-neutral-700 hover:bg-neutral-100 border border-transparent'
              }`}
            >
              <div className={`p-1.5 rounded-md ${isActive ? 'bg-amber-400 text-neutral-950' : 'bg-neutral-200 text-neutral-700'}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="truncate">
                <span className="font-bold block text-[11px] truncate">{item.label}</span>
                <span className={`text-[10px] block truncate ${isActive ? 'text-neutral-300' : 'text-neutral-500'}`}>
                  {item.sub}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 3. INNOVATION A — SUNTRACK: INTELLIGENT SOLAR TRACKING */}
      {/* ========================================================================= */}
      {activeInnovation === 'suntrack' && (
        <div className="space-y-4">
          {/* Main Interactive Comparison Panel */}
          <div className="bg-white rounded-2xl border border-[#E2E4E8] p-4 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 uppercase">
                  REQUIRED SHOWCASE: FIXED PANEL VS SUNTRACK TRACKER
                </span>
                <h3 className="text-xl font-bold font-display text-neutral-900 mt-1">
                  SunTrack — Dynamic Astronomical Alignment
                </h3>
                <p className="text-xs text-neutral-600 max-w-2xl">
                  A rooftop solar panel actively steers its orientation toward the highest intensity light vector using light-dependent sensors and servo motors.
                </p>
              </div>

              {/* Time of Day Control & Playback */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSunPlaying(!isSunPlaying)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs font-bold transition-all cursor-pointer shadow-xs ${
                    isSunPlaying 
                      ? 'bg-amber-500 text-neutral-950' 
                      : 'bg-neutral-900 hover:bg-neutral-800 text-white'
                  }`}
                >
                  {isSunPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-amber-400" />}
                  <span>{isSunPlaying ? 'PAUSE SUN' : 'ORBIT SUN'}</span>
                </button>

                <button
                  onClick={() => {
                    setIsSunPlaying(false);
                    setTimeOfDay(12);
                  }}
                  className="p-1.5 rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors cursor-pointer"
                  title="Reset to Solar Noon (12:00)"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Time Slider & Preset Buttons */}
            <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/80 space-y-3 font-mono text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-neutral-800 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>SIMULATED TIME OF DAY:</span>
                  <span className="px-2 py-0.5 rounded bg-neutral-900 text-amber-400 font-bold text-sm">
                    {Math.floor(timeOfDay).toString().padStart(2, '0')}:
                    {Math.floor((timeOfDay % 1) * 60).toString().padStart(2, '0')} hrs
                  </span>
                </span>

                <div className="flex items-center gap-1.5">
                  <span className="text-neutral-500 text-[11px] mr-1">QUICK POSITIONS:</span>
                  {[
                    { label: '08:00 (Morning)', val: 8 },
                    { label: '12:00 (Solar Noon)', val: 12 },
                    { label: '15:30 (Afternoon)', val: 15.5 },
                    { label: '17:30 (Sunset)', val: 17.5 },
                  ].map((p) => (
                    <button
                      key={p.val}
                      onClick={() => {
                        setIsSunPlaying(false);
                        setTimeOfDay(p.val);
                      }}
                      className={`px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                        Math.abs(timeOfDay - p.val) < 0.3
                          ? 'bg-amber-500 text-neutral-950 font-extrabold'
                          : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider with visual gradient dawn to dusk */}
              <div className="space-y-1">
                <input
                  type="range"
                  min="6"
                  max="18"
                  step="0.1"
                  value={timeOfDay}
                  onChange={(e) => {
                    setIsSunPlaying(false);
                    setTimeOfDay(Number(e.target.value));
                  }}
                  className="w-full h-2.5 bg-gradient-to-r from-amber-300 via-amber-500 to-orange-400 rounded-lg appearance-none cursor-pointer accent-neutral-900"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                  <span>06:00 (Sunrise East)</span>
                  <span>09:00</span>
                  <span>12:00 (Zenith Noon)</span>
                  <span>15:00</span>
                  <span>18:00 (Sunset West)</span>
                </div>
              </div>
            </div>

            {/* SIDE-BY-SIDE INTERACTIVE VISUAL DEMONSTRATION (SVG CANVAS) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* LEFT: FIXED SOLAR PANEL */}
              <div className="bg-[#14171C] text-white p-4 rounded-xl border border-neutral-800 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2 text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-neutral-400" />
                    <span className="font-bold text-neutral-300">BENCHMARK: FIXED SOLAR PANEL</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700">
                    CONSTANT 25° ANGLE
                  </span>
                </div>

                {/* SVG Visual Stage */}
                <div className="h-56 w-full relative bg-neutral-950/70 rounded-lg border border-neutral-850 flex items-center justify-center overflow-hidden">
                  <svg viewBox="-120 -80 240 160" className="w-full h-full">
                    {/* Sky Arc Guide */}
                    <path
                      d="M -90 40 A 100 100 0 0 1 90 40"
                      fill="none"
                      stroke="#333A45"
                      strokeDasharray="3 3"
                      strokeWidth="1.2"
                    />

                    {/* Sun Position */}
                    {(() => {
                      const rad = ((sunProgress - 0.5) * Math.PI * 0.85);
                      const sunX = Math.sin(rad) * 95;
                      const sunY = -Math.cos(rad) * 65;
                      return (
                        <g transform={`translate(${sunX}, ${sunY})`}>
                          <circle r="12" fill="#F59E0B" opacity="0.25" />
                          <circle r="8" fill="#FBBF24" />
                          {/* Light Rays striking down */}
                          <line x1="0" y1="0" x2={-sunX * 0.75} y2={35 - sunY} stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.6" />
                          <line x1="-3" y1="0" x2={-sunX * 0.75 - 15} y2={35 - sunY} stroke="#F59E0B" strokeWidth="1" strokeDasharray="4 2" opacity="0.3" />
                          <line x1="3" y1="0" x2={-sunX * 0.75 + 15} y2={35 - sunY} stroke="#F59E0B" strokeWidth="1" strokeDasharray="4 2" opacity="0.3" />
                        </g>
                      );
                    })()}

                    {/* Bus Station Roof & Fixed Panel */}
                    <rect x="-70" y="45" width="140" height="6" rx="2" fill="#374151" />
                    <rect x="-15" y="51" width="30" height="25" fill="#1F2937" />
                    <text x="0" y="68" fill="#9CA3AF" fontSize="6" textAnchor="middle" fontFamily="monospace">STATION SHELTER</text>

                    {/* Fixed Panel Bracket */}
                    <polygon points="-2,45 2,45 2,38 -2,38" fill="#6B7280" />
                    {/* Fixed Panel: Permanent 0 horizontal / 15 deg tilt */}
                    <g transform="translate(0, 36) rotate(-10)">
                      <rect x="-35" y="-3" width="70" height="6" rx="1.5" fill="#1E3A8A" stroke="#3B82F6" strokeWidth="1" />
                      {/* Grid lines on panel */}
                      <line x1="-20" y1="-3" x2="-20" y2="3" stroke="#60A5FA" strokeWidth="0.8" />
                      <line x1="-5" y1="-3" x2="-5" y2="3" stroke="#60A5FA" strokeWidth="0.8" />
                      <line x1="10" y1="-3" x2="10" y2="3" stroke="#60A5FA" strokeWidth="0.8" />
                      <line x1="25" y1="-3" x2="25" y2="3" stroke="#60A5FA" strokeWidth="0.8" />
                    </g>

                    {/* Angular Error Arc */}
                    <text x="-80" y="-60" fill="#9CA3AF" fontSize="7" fontFamily="monospace">
                      INCIDENCE LOSS: {Math.round((1 - fixedCosineFactor) * 100)}%
                    </text>
                  </svg>

                  {/* Badging overlay */}
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-neutral-900/90 text-[10px] font-mono text-neutral-300 border border-neutral-700">
                    Incident Cosine factor: <strong className="text-amber-400">{(fixedCosineFactor * 100).toFixed(0)}%</strong>
                  </div>
                </div>

                {/* Telemetry Card */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 bg-neutral-900 rounded-lg border border-neutral-800">
                    <span className="text-[9px] text-neutral-400 block">SIMULATED OUTPUT</span>
                    <span className="text-lg font-bold text-neutral-200">{fixedSimulatedWatts} W</span>
                    <span className="text-[9px] text-neutral-500 block">Peak 12W Nominal</span>
                  </div>
                  <div className="p-2.5 bg-neutral-900 rounded-lg border border-neutral-800">
                    <span className="text-[9px] text-neutral-400 block">MECHANICAL STATUS</span>
                    <span className="text-sm font-bold text-neutral-400">STATIC (0W MOTOR)</span>
                    <span className="text-[9px] text-neutral-500 block">Zero moving parts</span>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-neutral-900/80 border border-neutral-800 text-[11px] text-neutral-400 leading-relaxed font-sans">
                  <strong>Limitation of Fixed Orientation:</strong> Because the panel cannot rotate, early morning and late afternoon sun rays strike at oblique angles, causing high cosine reflective losses and reduced electrical harvesting.
                </div>
              </div>

              {/* RIGHT: SUNTRACK INTELLIGENT TRACKER */}
              <div className="bg-[#14171C] text-white p-4 rounded-xl border border-amber-500/50 space-y-3 relative overflow-hidden shadow-md">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2 text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="font-bold text-amber-400">INNOVATION: SUNTRACK ACTIVE TRACKER</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800">
                    DYNAMIC SERVO ADJUSTMENT
                  </span>
                </div>

                {/* SVG Visual Stage */}
                <div className="h-56 w-full relative bg-neutral-950/70 rounded-lg border border-neutral-850 flex items-center justify-center overflow-hidden">
                  <svg viewBox="-120 -80 240 160" className="w-full h-full">
                    {/* Sky Arc Guide */}
                    <path
                      d="M -90 40 A 100 100 0 0 1 90 40"
                      fill="none"
                      stroke="#333A45"
                      strokeDasharray="3 3"
                      strokeWidth="1.2"
                    />

                    {/* Sun Position */}
                    {(() => {
                      const rad = ((sunProgress - 0.5) * Math.PI * 0.85);
                      const sunX = Math.sin(rad) * 95;
                      const sunY = -Math.cos(rad) * 65;
                      return (
                        <g transform={`translate(${sunX}, ${sunY})`}>
                          <circle r="12" fill="#F59E0B" opacity="0.35" />
                          <circle r="8" fill="#FBBF24" />
                          {/* Light Rays targeting tracking panel */}
                          <line x1="0" y1="0" x2={-sunX * 0.75} y2={35 - sunY} stroke="#F59E0B" strokeWidth="2" strokeDasharray="3 1" opacity="0.8" />
                          <line x1="-3" y1="0" x2={-sunX * 0.75 - 15} y2={35 - sunY} stroke="#F59E0B" strokeWidth="1" strokeDasharray="3 1" opacity="0.4" />
                          <line x1="3" y1="0" x2={-sunX * 0.75 + 15} y2={35 - sunY} stroke="#F59E0B" strokeWidth="1" strokeDasharray="3 1" opacity="0.4" />
                        </g>
                      );
                    })()}

                    {/* Bus Station Roof */}
                    <rect x="-70" y="45" width="140" height="6" rx="2" fill="#374151" />
                    <rect x="-15" y="51" width="30" height="25" fill="#1F2937" />
                    <text x="0" y="68" fill="#F59E0B" fontSize="6" textAnchor="middle" fontFamily="monospace">SUNSTRIDE SMART CANOPY</text>

                    {/* Servo Motor Housing & Pivot */}
                    <rect x="-6" y="38" width="12" height="7" rx="1.5" fill="#D97706" />
                    <circle cx="0" cy="38" r="3" fill="#111827" />

                    {/* Tracking Panel: dynamically rotates with trackerAngle! */}
                    <g transform={`translate(0, 36) rotate(${trackerAngle})`}>
                      <rect x="-35" y="-3" width="70" height="6" rx="1.5" fill="#1E3A8A" stroke="#60A5FA" strokeWidth="1.2" />
                      {/* Grid lines */}
                      <line x1="-20" y1="-3" x2="-20" y2="3" stroke="#93C5FD" strokeWidth="0.8" />
                      <line x1="-5" y1="-3" x2="-5" y2="3" stroke="#93C5FD" strokeWidth="0.8" />
                      <line x1="10" y1="-3" x2="10" y2="3" stroke="#93C5FD" strokeWidth="0.8" />
                      <line x1="25" y1="-3" x2="25" y2="3" stroke="#93C5FD" strokeWidth="0.8" />
                      {/* Dual LDR Sensors at edges */}
                      <circle cx="-32" cy="-4" r="1.5" fill="#EF4444" />
                      <circle cx="32" cy="-4" r="1.5" fill="#EF4444" />
                    </g>

                    <text x="-80" y="-60" fill="#F59E0B" fontSize="7" fontFamily="monospace">
                      TRACKING SERVO: {trackerAngle > 0 ? `+${trackerAngle.toFixed(0)}°` : `${trackerAngle.toFixed(0)}°`}
                    </text>
                  </svg>

                  {/* Badging overlay */}
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-amber-950/90 text-[10px] font-mono text-amber-300 border border-amber-700">
                    Optical Orthogonality: <strong className="text-white">{(trackerCosineFactor * 100).toFixed(0)}%</strong>
                  </div>
                </div>

                {/* Telemetry Card */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 bg-neutral-900 rounded-lg border border-neutral-800">
                    <span className="text-[9px] text-amber-400 block">SIMULATED HARVEST</span>
                    <span className="text-lg font-bold text-amber-400">{trackerSimulatedWatts} W</span>
                    <span className="text-[9px] text-neutral-400 block">Net ~{trackerNetWatts} W (post-servo)</span>
                  </div>
                  <div className="p-2.5 bg-neutral-900 rounded-lg border border-neutral-800">
                    <span className="text-[9px] text-neutral-400 block">TRACKING CONSUMPTION</span>
                    <span className="text-sm font-bold text-amber-300">~{trackerParasiticWatts} W PARASITIC</span>
                    <span className="text-[9px] text-neutral-500 block">Micro-servo + MCU logic</span>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-neutral-900/80 border border-neutral-800 text-[11px] text-neutral-400 leading-relaxed font-sans">
                  <strong>Engineering Trade-off:</strong> The tracker captures more photons across early mornings and late afternoons by maintaining perpendicularity. However, tracking adds mechanical gears, environmental wear, and electrical motor consumption.
                </div>
              </div>
            </div>

            {/* MANDATORY SCIENTIFIC SIMULATION DISCLAIMER BAR */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="font-bold text-neutral-900">SCIENTIFIC TRANSPARENCY NOTICE:</span>
                <span className="text-neutral-700 text-[11px]">
                  All power output values shown are illustrative mathematical simulations, not measured experimental lab results. The system has not been physically deployed outdoors.
                </span>
              </div>
            </div>

            {/* REAL-WORLD EXPERIMENTAL PROTOCOL & HARDWARE EXPLANATION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Architecture Diagram Card */}
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-2.5">
                <h4 className="font-mono text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-emerald-600" />
                  <span>CONCEPTUAL ARDUINO CONTROL ARCHITECTURE</span>
                </h4>
                <div className="space-y-2 text-xs text-neutral-700 leading-relaxed font-sans">
                  <p>
                    <strong>1. Dual LDR Light Sensors:</strong> Two light-dependent resistors mounted on opposing edges of the panel bracket form a differential voltage divider.
                  </p>
                  <p>
                    <strong>2. Arduino Nano Processing:</strong> The analog inputs read <code className="bg-neutral-200 px-1 py-0.5 rounded font-mono text-[11px]">A0</code> and <code className="bg-neutral-200 px-1 py-0.5 rounded font-mono text-[11px]">A1</code>. If <code className="bg-neutral-200 px-1 py-0.5 rounded font-mono text-[11px]">|V_A0 - V_A1| &gt; threshold</code>, a directional step is computed.
                  </p>
                  <p>
                    <strong>3. Pulse-Width Modulation (PWM) Servo:</strong> A micro-servo motor increments in 2° steps towards the higher photon flux until the differential voltage is neutralized.
                  </p>
                </div>
              </div>

              {/* Real World Testing Guide Card */}
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-2.5">
                <h4 className="font-mono text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-amber-600" />
                  <span>HOW A REAL EXPERIMENT WOULD TEST NET EFFICACY</span>
                </h4>
                <div className="space-y-1.5 text-xs text-neutral-700 leading-relaxed font-sans">
                  <p>To scientifically validate net energetic advantage in empirical field studies:</p>
                  <ul className="list-disc pl-4 space-y-1 text-[11px]">
                    <li><strong>Continuous Voltage & Current Logging:</strong> Log Voc, Isc, and Pmpp simultaneously on identical fixed and tracking panels using calibrated INA219 sensors.</li>
                    <li><strong>Parasitic Energy Subtraction:</strong> Measure the cumulative milliamp-hours consumed by the Arduino Nano and servo motor over a full 24-hour cycle.</li>
                    <li><strong>Net Energy Formula:</strong> Net Energy Gain = E(generated, tracking) &minus; E(motor/controller) &minus; E(fixed).</li>
                    <li><strong>Seasonal Variability:</strong> Track overcast monsoon days versus clear winter skies to determine if diffuse light diminishes tracking utility.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. INNOVATION B — STEPVOLT: PIEZOELECTRIC FOOTSTEP HARVESTING */}
      {/* ========================================================================= */}
      {activeInnovation === 'stepvolt' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E2E4E8] p-4 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase">
                  INNOVATION B · KINETIC SUB-FLOOR HARVESTING
                </span>
                <h3 className="text-xl font-bold font-display text-neutral-900 mt-1">
                  STEPVolt — Piezoelectric Footstep Mechanical Conversion
                </h3>
                <p className="text-xs text-neutral-600 max-w-2xl">
                  Sub-floor ceramic PZT transducer tiles convert mechanical pressure from passenger footsteps into low-voltage auxiliary electrical pulses.
                </p>
              </div>

              {/* Interactive Step Trigger */}
              <div className="flex items-center gap-2">
                <button
                  onClick={triggerFootstep}
                  disabled={stepStage !== 0 && !isAutoStepping}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-mono text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  <Footprints className="w-4 h-4" />
                  <span>SIMULATE FOOTSTEP (PRESS TILE)</span>
                </button>

                <button
                  onClick={() => setIsAutoStepping(!isAutoStepping)}
                  className={`px-3 py-2 rounded-md font-mono text-xs font-bold border transition-colors cursor-pointer ${
                    isAutoStepping 
                      ? 'bg-neutral-900 text-white border-neutral-800' 
                      : 'bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200'
                  }`}
                >
                  {isAutoStepping ? 'STOP RUSH HOUR' : 'AUTO RUSH HOUR'}
                </button>
              </div>
            </div>

            {/* 6-STEP ANIMATED CONVERSION STAGE (VISUAL PIPELINE) */}
            <div className="bg-[#14171C] text-white p-5 rounded-xl border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono border-b border-neutral-800 pb-2">
                <span className="text-emerald-400 font-bold">INTERACTIVE CONVERSION PIPELINE (6 STAGES)</span>
                <span className="text-neutral-400">TOTAL FOOTFALL STEPS: {totalStepCount}</span>
              </div>

              {/* Visual Interactive Diagram */}
              <div className="h-64 w-full relative bg-neutral-950/80 rounded-lg border border-neutral-850 flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 700 240" className="w-full h-full">
                  {/* Step 1 & 2: Approaching foot and tile */}
                  {/* Platform Base */}
                  <rect x="50" y="180" width="160" height="30" rx="4" fill="#1F2937" stroke="#374151" strokeWidth="1.5" />
                  <text x="130" y="200" fill="#9CA3AF" fontSize="10" textAnchor="middle" fontFamily="monospace">PLATFORM FOUNDATION</text>

                  {/* Springs */}
                  <line x1="80" y1="180" x2="80" y2={stepStage >= 3 ? "165" : "150"} stroke="#6B7280" strokeWidth="3" strokeDasharray="3 2" />
                  <line x1="180" y1="180" x2="180" y2={stepStage >= 3 ? "165" : "150"} stroke="#6B7280" strokeWidth="3" strokeDasharray="3 2" />

                  {/* Piezo Ceramic Disc Layer */}
                  <rect 
                    x="90" 
                    y={stepStage >= 3 ? "160" : "145"} 
                    width="80" 
                    height="12" 
                    rx="2" 
                    fill={stepStage >= 3 ? "#F59E0B" : "#059669"} 
                    stroke="#10B981" 
                    strokeWidth="1.5"
                    className="transition-all duration-300"
                  />
                  <text x="130" y={stepStage >= 3 ? "169" : "154"} fill="#FFFFFF" fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                    PZT PIEZO DISC
                  </text>

                  {/* Top Tile Plate (compresses down when stepped) */}
                  <rect 
                    x="60" 
                    y={stepStage >= 3 ? "148" : "130"} 
                    width="140" 
                    height="14" 
                    rx="3" 
                    fill="#374151" 
                    stroke="#4B5563" 
                    strokeWidth="1.5"
                    className="transition-all duration-300"
                  />
                  <text x="130" y={stepStage >= 3 ? "158" : "140"} fill="#E5E7EB" fontSize="8" textAnchor="middle" fontFamily="monospace">
                    MODULAR FLOOR TILE
                  </text>

                  {/* Foot Icon / Silhouette */}
                  <g 
                    transform={`translate(110, ${
                      stepStage === 0 ? "50" : stepStage === 1 ? "80" : stepStage >= 2 ? "110" : "110"
                    })`}
                    className="transition-all duration-300"
                  >
                    <path
                      d="M 10 0 C 25 0 35 15 35 30 C 35 40 20 45 10 45 C 5 45 0 35 0 20 C 0 8 5 0 10 0 Z"
                      fill={stepStage >= 2 ? "#10B981" : "#6B7280"}
                      opacity="0.9"
                    />
                    <text x="45" y="25" fill="#E5E7EB" fontSize="10" fontFamily="monospace">COMMUTER FOOT</text>
                  </g>

                  {/* Energy Pulse Wire to Rectifier (Stage 4) */}
                  <path
                    d="M 170 155 L 260 155 L 260 120 L 320 120"
                    fill="none"
                    stroke={stepStage >= 4 ? "#10B981" : "#374151"}
                    strokeWidth={stepStage >= 4 ? "3" : "1.5"}
                    strokeDasharray={stepStage >= 4 ? "4 2" : "none"}
                    className="transition-all duration-300"
                  />

                  {/* Rectifier Bridge Box */}
                  <rect x="320" y="95" width="110" height="50" rx="6" fill="#1F2937" stroke={stepStage >= 4 ? "#10B981" : "#4B5563"} strokeWidth="1.5" />
                  <text x="375" y="115" fill="#E5E7EB" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">FULL-BRIDGE</text>
                  <text x="375" y="130" fill="#9CA3AF" fontSize="8" textAnchor="middle" fontFamily="monospace">AC ➔ DC RECTIFIER</text>

                  {/* Wire to Storage Capacitor */}
                  <path
                    d="M 430 120 L 490 120"
                    fill="none"
                    stroke={stepStage >= 5 ? "#F59E0B" : "#374151"}
                    strokeWidth={stepStage >= 5 ? "3" : "1.5"}
                    strokeDasharray={stepStage >= 5 ? "4 2" : "none"}
                  />

                  {/* Storage Circuit (Stage 5) */}
                  <rect x="490" y="90" width="120" height="60" rx="6" fill="#111827" stroke={stepStage >= 5 ? "#F59E0B" : "#374151"} strokeWidth="1.5" />
                  <text x="550" y="112" fill="#F59E0B" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">STORAGE BUFFER</text>
                  <text x="550" y="127" fill="#9CA3AF" fontSize="8" textAnchor="middle" fontFamily="monospace">ELECTROLYTIC CAP</text>
                  <text x="550" y="141" fill="#10B981" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                    {stepStage === 5 ? "PULSE CAPTURED!" : "READY"}
                  </text>

                  {/* Auxiliary Indicator LED (Stage 6) */}
                  <g transform="translate(630, 105)">
                    <circle cx="15" cy="15" r="14" fill={stepStage >= 5 ? "#10B981" : "#1F2937"} stroke="#374151" strokeWidth="1.5" />
                    <circle cx="15" cy="15" r="8" fill={stepStage >= 5 ? "#34D399" : "#374151"} />
                    <text x="15" y="42" fill="#9CA3AF" fontSize="7" textAnchor="middle" fontFamily="monospace">MICRO-LED</text>
                  </g>
                </svg>
              </div>

              {/* 6 Stage Labels Explanation */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs font-mono">
                {[
                  { num: '1', title: 'Approach', desc: 'Commuter nears shelter tile', active: stepStage === 1 },
                  { num: '2', title: 'Contact', desc: 'Foot exerts ~600N downward force', active: stepStage === 2 },
                  { num: '3', title: 'Compression', desc: 'Tile displaces 1.5mm; PZT strains', active: stepStage === 3 },
                  { num: '4', title: 'Rectification', desc: 'Bridge diode converts AC spike to DC', active: stepStage === 4 },
                  { num: '5', title: 'Buffering', desc: 'Charge stored in low-ESR capacitor', active: stepStage === 5 },
                  { num: '6', title: 'Indicator', desc: 'Low-power status pulse registered', active: stepStage >= 5 },
                ].map((st) => (
                  <div
                    key={st.num}
                    className={`p-2 rounded-lg border transition-all ${
                      st.active
                        ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-xs'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                    }`}
                  >
                    <span className={`text-[10px] font-bold block ${st.active ? 'text-emerald-400' : 'text-neutral-500'}`}>
                      STAGE {st.num}
                    </span>
                    <strong className="text-white block text-[11px]">{st.title}</strong>
                    <span className="text-[10px] text-neutral-400 leading-tight block mt-0.5">{st.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* REALISTIC ENGINEERING DISCLOSURE: INTERMITTENT MICRO-POWER */}
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-2 text-xs leading-relaxed text-neutral-700 font-sans">
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-neutral-900">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>ENGINEERING REALITY CHECK: SCALE OF PIEZOELECTRIC HARVESTING</span>
              </div>
              <p>
                Piezoelectric materials harvest mechanical stress to produce brief, high-voltage, low-current spikes. Under typical pedestrian conditions, a single step generates merely <strong>several milli-joules (mJ) to micro-joules (&mu;J)</strong> of recoverable energy.
              </p>
              <p>
                <strong>This is NOT sufficient to independently power high-load station components</strong> such as cellular transceivers or large LED floodlights. In the SunStride vision, piezoelectric harvesting serves exclusively as an auxiliary trickle input for ultra-low-power RTC (real-time clock) backup or wake-up interrupt triggers during sunless monsoon periods.
              </p>
              <div className="font-mono text-[11px] text-neutral-500 pt-1 border-t border-neutral-200">
                Scientific commitment: SunStride does not report fictional wattage figures or claim impossible kinetic yields.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. INNOVATION C — ROADVOLT: SPEED-BREAKER ENERGY HARVESTING */}
      {/* ========================================================================= */}
      {activeInnovation === 'roadvolt' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E2E4E8] p-4 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 uppercase">
                  INNOVATION C · VEHICULAR MECHANICAL ROADWAY RECOVERY
                </span>
                <h3 className="text-xl font-bold font-display text-neutral-900 mt-1">
                  ROADVolt — Speed-Breaker Kinetic Harvesting Mechanism
                </h3>
                <p className="text-xs text-neutral-600 max-w-2xl">
                  A conceptual engineered speed-breaker recovers a portion of the mechanical deceleration energy as transit vehicles cross a purpose-designed road installation.
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={triggerRoadVoltPass}
                disabled={roadBusStage !== 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-mono text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                <Bus className="w-4 h-4" />
                <span>SIMULATE BUS PASSING SPEED-BREAKER</span>
              </button>
            </div>

            {/* ANIMATED CONVERSION STAGE */}
            <div className="bg-[#14171C] text-white p-5 rounded-xl border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono border-b border-neutral-800 pb-2">
                <span className="text-amber-400 font-bold">ROADVOLT VEHICLE PASS SIMULATION</span>
                <span className="text-neutral-400">
                  {roadBusStage === 0 && 'STATUS: STANDBY — READY FOR VEHICLE'}
                  {roadBusStage === 1 && 'STATUS: BUS APPROACHING INSTALLATION'}
                  {roadBusStage === 2 && 'STATUS: RAMP DEFLECTION (MECHANICAL ENGAGEMENT)'}
                  {roadBusStage === 3 && 'STATUS: GEARBOX ROTATION & DYNAMO CHARGING'}
                  {roadBusStage === 4 && 'STATUS: ENERGY PULSE STORED IN WAYSIDE BUFFER'}
                </span>
              </div>

              {/* SVG Demonstration */}
              <div className="h-64 w-full relative bg-neutral-950/80 rounded-lg border border-neutral-850 flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 700 240" className="w-full h-full">
                  {/* Road Asphalt Layer */}
                  <rect x="0" y="160" width="700" height="80" fill="#1E293B" />
                  <line x1="0" y1="160" x2="700" y2="160" stroke="#475569" strokeWidth="2" />
                  {/* Road Center Dotted Line */}
                  <line x1="0" y1="200" x2="700" y2="200" stroke="#FBBF24" strokeWidth="2" strokeDasharray="15 15" />

                  {/* Roadway Installation Pit */}
                  <rect x="290" y="160" width="120" height="50" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />

                  {/* Return Springs */}
                  <line x1="310" y1="205" x2="310" y2={roadBusStage === 2 ? "170" : "162"} stroke="#94A3B8" strokeWidth="3" strokeDasharray="3 2" />
                  <line x1="390" y1="205" x2="390" y2={roadBusStage === 2 ? "170" : "162"} stroke="#94A3B8" strokeWidth="3" strokeDasharray="3 2" />

                  {/* Articulated Speed Breaker Plate */}
                  <path
                    d={
                      roadBusStage === 2
                        ? "M 285 160 Q 350 163 415 160" // flattened/compressed
                        : "M 285 160 Q 350 142 415 160" // normal curved hump
                    }
                    fill="#D97706"
                    stroke="#F59E0B"
                    strokeWidth="3"
                    className="transition-all duration-300"
                  />
                  <text x="350" y="152" fill="#FFFFFF" fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                    ROADVOLT RAMP
                  </text>

                  {/* Rack & Pinion + Generator Dynamo below road */}
                  <g transform="translate(340, 175)">
                    {/* Rack shaft going down */}
                    <line x1="10" y1="0" x2="10" y2="20" stroke="#E2E8F0" strokeWidth="2.5" />
                    {/* Pinion Gear */}
                    <circle 
                      cx="22" 
                      cy="20" 
                      r="10" 
                      fill="#334155" 
                      stroke={roadBusStage >= 2 ? "#F59E0B" : "#64748B"} 
                      strokeWidth="2"
                      className={roadBusStage >= 2 && !reducedMotion ? "animate-spin" : ""}
                    />
                    {/* Generator Dynamo */}
                    <rect x="34" y="12" width="24" height="16" rx="2" fill="#1E293B" stroke="#F59E0B" strokeWidth="1" />
                    <text x="46" y="24" fill="#F59E0B" fontSize="6" textAnchor="middle" fontFamily="monospace">GEN</text>
                  </g>

                  {/* Energy Cable to Wayside Buffer */}
                  <path
                    d="M 405 195 L 480 195 L 480 120 L 530 120"
                    fill="none"
                    stroke={roadBusStage >= 3 ? "#F59E0B" : "#334155"}
                    strokeWidth={roadBusStage >= 3 ? "3" : "1.5"}
                    strokeDasharray={roadBusStage >= 3 ? "4 2" : "none"}
                    className="transition-all duration-300"
                  />

                  {/* Wayside Energy Storage Hub */}
                  <rect x="530" y="85" width="130" height="70" rx="8" fill="#111827" stroke={roadBusStage >= 3 ? "#F59E0B" : "#334155"} strokeWidth="1.5" />
                  <text x="595" y="110" fill="#F59E0B" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">WAYSIDE STORAGE</text>
                  <text x="595" y="125" fill="#9CA3AF" fontSize="8" textAnchor="middle" fontFamily="monospace">STATION BUFFER BANK</text>
                  <text x="595" y="142" fill="#10B981" fontSize="11" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                    {roadEnergyBufferWh.toFixed(2)} Wh
                  </text>

                  {/* Miniature Transit Bus Moving Across */}
                  {(() => {
                    let busX = 50;
                    if (roadBusStage === 1) busX = 180;
                    if (roadBusStage === 2) busX = 330;
                    if (roadBusStage === 3) busX = 480;
                    if (roadBusStage === 4) busX = 600;

                    return (
                      <g transform={`translate(${busX}, 90)`} className="transition-all duration-700 ease-in-out">
                        {/* Bus Body */}
                        <rect x="-60" y="0" width="120" height="55" rx="6" fill="#1E3A8A" stroke="#3B82F6" strokeWidth="1.5" />
                        {/* Roof stripe */}
                        <rect x="-58" y="4" width="116" height="6" rx="2" fill="#F59E0B" />
                        {/* Bus Windows */}
                        <rect x="-50" y="14" width="22" height="18" rx="2" fill="#93C5FD" opacity="0.8" />
                        <rect x="-22" y="14" width="22" height="18" rx="2" fill="#93C5FD" opacity="0.8" />
                        <rect x="6" y="14" width="22" height="18" rx="2" fill="#93C5FD" opacity="0.8" />
                        <rect x="34" y="14" width="18" height="18" rx="2" fill="#60A5FA" opacity="0.9" />
                        {/* Front windshield */}
                        <path d="M 52 14 L 56 32 L 52 32 Z" fill="#93C5FD" />
                        {/* Wheels */}
                        <circle cx="-35" cy="55" r="12" fill="#0F172A" stroke="#475569" strokeWidth="3" />
                        <circle cx="-35" cy="55" r="5" fill="#94A3B8" />
                        <circle cx="35" cy="55" r="12" fill="#0F172A" stroke="#475569" strokeWidth="3" />
                        <circle cx="35" cy="55" r="5" fill="#94A3B8" />
                        <text x="0" y="44" fill="#FFFFFF" fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="bold">SUNSTRIDE BUS</text>
                      </g>
                    );
                  })()}
                </svg>
              </div>

              {/* Exploded Conceptual Diagram Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded bg-neutral-900 border border-neutral-800">
                  <span className="text-amber-400 font-bold block text-[10px]">1. VEHICLE LOAD</span>
                  <span className="text-white block font-bold">Wheel Contact</span>
                  <span className="text-[10px] text-neutral-400 block mt-0.5">Heavy axle depression (~4–8 tons)</span>
                </div>
                <div className="p-2.5 rounded bg-neutral-900 border border-neutral-800">
                  <span className="text-amber-400 font-bold block text-[10px]">2. TRANSMISSION</span>
                  <span className="text-white block font-bold">Rack & Pinion</span>
                  <span className="text-[10px] text-neutral-400 block mt-0.5">Linear deflection ➔ Rotary flywheel</span>
                </div>
                <div className="p-2.5 rounded bg-neutral-900 border border-neutral-800">
                  <span className="text-amber-400 font-bold block text-[10px]">3. GENERATOR</span>
                  <span className="text-white block font-bold">Permanent Magnet</span>
                  <span className="text-[10px] text-neutral-400 block mt-0.5">BLDC dynamo producing DC rectified pulse</span>
                </div>
                <div className="p-2.5 rounded bg-neutral-900 border border-neutral-800">
                  <span className="text-amber-400 font-bold block text-[10px]">4. WAYSIDE BUFFER</span>
                  <span className="text-white block font-bold">Station Storage</span>
                  <span className="text-[10px] text-neutral-400 block mt-0.5">Trickle charge for shelter perimeter lights</span>
                </div>
              </div>
            </div>

            {/* REAL-WORLD ENGINEERING & ROAD SAFETY LIMITATIONS */}
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-2 text-xs text-neutral-700 leading-relaxed font-sans">
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-neutral-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>EXPLICIT ENGINEERING EVALUATION & PUBLIC ROAD DISCLAIMER</span>
              </div>
              <p>
                <strong>Conceptual Model Only:</strong> SunStride does NOT recommend or advocate modifying existing public asphalt roads without extensive structural studies.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="p-2.5 rounded bg-white border border-neutral-200 space-y-1">
                  <strong className="text-neutral-900 block font-mono text-[11px]">ROAD-SAFETY & VEHICLE COMFORT:</strong>
                  <p className="text-[11px]">
                    Mechanical road installations must never compromise emergency vehicle braking distance, motorcycle balance, or cause severe shock loads to passenger vehicle suspension systems.
                  </p>
                </div>
                <div className="p-2.5 rounded bg-white border border-neutral-200 space-y-1">
                  <strong className="text-neutral-900 block font-mono text-[11px]">DURABILITY & WATERPROOFING:</strong>
                  <p className="text-[11px]">
                    Sub-surface mechanical installations suffer extreme wear, road grit abrasion, and monsoon water pooling. Hermetic sealing and regular mechanical maintenance represent critical lifecycle hurdles.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. INNOVATION D — BRAKEBACK: REGENERATIVE BRAKING CONCEPT */}
      {/* ========================================================================= */}
      {activeInnovation === 'brakeback' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E2E4E8] p-4 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200 uppercase">
                  INNOVATION D · VEHICLE-LEVEL POWERTRAIN HARVESTING
                </span>
                <h3 className="text-xl font-bold font-display text-neutral-900 mt-1">
                  BrakeBack — Vehicle Regenerative Deceleration Concept
                </h3>
                <p className="text-xs text-neutral-600 max-w-2xl">
                  An appropriately equipped electric or hybrid transit bus captures kinetic energy during deceleration by operating its electric traction motor in generator mode.
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={triggerRegenBraking}
                disabled={isBrakeAnimActive}
                className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white font-mono text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                <BatteryCharging className="w-4 h-4 text-emerald-400" />
                <span>DECELERATE & RECOVER BRAKE ENERGY</span>
              </button>
            </div>

            {/* ANIMATED POWERTRAIN ENERGY FLUX STAGE */}
            <div className="bg-[#14171C] text-white p-5 rounded-xl border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono border-b border-neutral-800 pb-2">
                <span className="text-emerald-400 font-bold">VEHICLE POWERTRAIN STATE: {brakeMode.toUpperCase()}</span>
                <span className="text-neutral-400">SPEED: {brakeBusSpeed} km/h • RECOVERED: {recoveredJoules} kJ</span>
              </div>

              {/* SVG Comparison & Powertrain Demonstration */}
              <div className="h-64 w-full relative bg-neutral-950/80 rounded-lg border border-neutral-850 flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 700 240" className="w-full h-full">
                  {/* Road */}
                  <rect x="0" y="170" width="700" height="70" fill="#1E293B" />
                  <line x1="0" y1="170" x2="700" y2="170" stroke="#475569" strokeWidth="2" />
                  {/* Station Stop Marker */}
                  <rect x="520" y="110" width="12" height="60" fill="#374151" />
                  <rect x="500" y="100" width="50" height="15" rx="3" fill="#D97706" />
                  <text x="525" y="111" fill="#FFFFFF" fontSize="7" textAnchor="middle" fontFamily="monospace" fontWeight="bold">STATION STOP</text>

                  {/* Electric Bus Chassis (X-Ray view) */}
                  <g transform="translate(180, 75)">
                    {/* Bus Outline */}
                    <rect x="0" y="0" width="260" height="95" rx="10" fill="#111827" stroke="#3B82F6" strokeWidth="2" />
                    <text x="130" y="20" fill="#93C5FD" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                      ELECTRIC TRANSIT VEHICLE (POWERTRAIN X-RAY)
                    </text>

                    {/* Onboard Traction Battery Pack (Center) */}
                    <rect x="40" y="35" width="75" height="35" rx="4" fill="#1E3A8A" stroke={brakeMode === 'braking' ? "#10B981" : "#3B82F6"} strokeWidth="1.5" />
                    <text x="77" y="52" fill="#E2E8F0" fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="bold">HV BATTERY</text>
                    <text x="77" y="63" fill="#10B981" fontSize="7" textAnchor="middle" fontFamily="monospace">
                      {brakeMode === 'braking' ? "CHARGING ↑" : "PACK READY"}
                    </text>

                    {/* Bidirectional Inverter */}
                    <rect x="130" y="38" width="40" height="30" rx="3" fill="#374151" stroke="#6B7280" strokeWidth="1" />
                    <text x="150" y="55" fill="#FBBF24" fontSize="7" textAnchor="middle" fontFamily="monospace">INVERTER</text>

                    {/* Traction Motor / Generator (Rear axle) */}
                    <rect x="185" y="35" width="45" height="35" rx="4" fill="#047857" stroke={brakeMode === 'braking' ? "#34D399" : "#10B981"} strokeWidth="1.5" />
                    <text x="207" y="52" fill="#FFFFFF" fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="bold">MOTOR /</text>
                    <text x="207" y="63" fill="#A7F3D0" fontSize="7" textAnchor="middle" fontFamily="monospace">
                      {brakeMode === 'braking' ? "GENERATOR" : "TRACTION"}
                    </text>

                    {/* Animated Energy Flow Particles */}
                    {brakeMode === 'braking' ? (
                      // Deceleration: Energy flows FROM motor BACK to battery
                      <g>
                        <path d="M 185 52 L 115 52" fill="none" stroke="#10B981" strokeWidth="3" strokeDasharray="5 3" className="animate-pulse" />
                        <polygon points="115,52 125,48 125,56" fill="#10B981" />
                        <text x="150" y="32" fill="#10B981" fontSize="7" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                          REGEN REVERSE FLUX ➔
                        </text>
                      </g>
                    ) : (
                      // Cruising: Energy flows from battery to motor
                      <g>
                        <path d="M 115 52 L 185 52" fill="none" stroke="#60A5FA" strokeWidth="2" strokeDasharray="4 2" />
                        <polygon points="185,52 175,48 175,56" fill="#60A5FA" />
                      </g>
                    )}

                    {/* Wheels */}
                    <circle cx="35" cy="95" r="15" fill="#0F172A" stroke="#475569" strokeWidth="3" />
                    <circle cx="215" cy="95" r="15" fill="#0F172A" stroke="#475569" strokeWidth="3" />
                  </g>
                </svg>
              </div>

              {/* Side-by-Side Comparison: Friction Brakes vs Regenerative Brakes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1">
                  <div className="flex items-center justify-between text-neutral-400">
                    <span className="font-bold text-rose-400">CONVENTIONAL FRICTION BRAKES</span>
                    <span className="text-[10px]">100% THERMAL DISSIPATION</span>
                  </div>
                  <p className="text-[11px] text-neutral-300 font-sans leading-relaxed">
                    Kinetic energy (E = &frac12;mv&sup2;) is converted entirely into wasted heat (250&deg;C+) via friction pads, creating rotor wear and brake dust particulates with zero electrical recovery.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-emerald-950/50 border border-emerald-500/50 space-y-1">
                  <div className="flex items-center justify-between text-emerald-300">
                    <span className="font-bold">BRAKEBACK REGENERATIVE SYSTEM</span>
                    <span className="text-[10px]">UP TO 60–70% CAPTURE</span>
                  </div>
                  <p className="text-[11px] text-neutral-200 font-sans leading-relaxed">
                    The traction motor runs as a generator, creating electromagnetic counter-torque to slow the bus while steering recaptured electrons through the bidirectional inverter into onboard battery cells.
                  </p>
                </div>
              </div>
            </div>

            {/* MANDATORY HARDWARE SCOPE CLARIFICATION */}
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-2 text-xs text-neutral-700 leading-relaxed font-sans">
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-neutral-900">
                <Info className="w-4 h-4 text-sky-600" />
                <span>POWERTRAIN BOUNDARY & RFID INTEGRATION CLARIFICATION</span>
              </div>
              <p>
                <strong>Vehicle-Level Concept:</strong> BrakeBack is an advanced vehicular powertrain technology implemented within the bus itself. It is <strong>NOT a feature built into the stationary SunStride bus stop structure</strong>.
              </p>
              <p>
                <strong>No Misleading Association with RFID:</strong> SunStride's physical hardware prototype (ESP8266 and RC522) operates exclusively for transit vehicle identification and timetable broadcast. The RFID system does NOT harvest or process vehicle braking power.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. INNOVATION E — ECOFUSION: UNIFIED SUSTAINABLE INFRASTRUCTURE */}
      {/* ========================================================================= */}
      {activeInnovation === 'ecofusion' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E2E4E8] p-4 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-300 uppercase">
                  INNOVATION E · UNIFIED SYSTEM OVERVIEW
                </span>
                <h3 className="text-xl font-bold font-display text-neutral-900 mt-1">
                  EcoFusion — Holistic Transport Energy System Map
                </h3>
                <p className="text-xs text-neutral-600 max-w-2xl">
                  An illustrative architectural synthesis showing how intelligent solar positioning and multiple energy recovery concepts interrelate across smart transport infrastructure.
                </p>
              </div>

              {/* Pathway Filter Switcher */}
              <div className="flex flex-wrap items-center gap-1 font-mono text-xs">
                {[
                  { id: 'all', label: 'ALL PATHWAYS' },
                  { id: 'suntrack', label: '1. SUNTRACK' },
                  { id: 'stepvolt', label: '2. STEPVOLT' },
                  { id: 'roadvolt', label: '3. ROADVOLT' },
                  { id: 'brakeback', label: '4. BRAKEBACK' },
                ].map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => setSelectedPathway(btn.id as any)}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                      selectedPathway === btn.id
                        ? 'bg-neutral-900 text-white shadow-xs'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {/* UNIFIED INTERACTIVE LANDSCAPE MAP (STATION + ROAD + BUS + HARVESTERS) */}
            <div className="bg-[#14171C] text-white p-5 rounded-xl border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono border-b border-neutral-800 pb-2">
                <span className="text-amber-400 font-bold">ECOFUSION INTEGRATED CONCEPTUAL INFRASTRUCTURE</span>
                <span className="text-neutral-400">
                  {selectedPathway === 'all' && 'SHOWING COMPLETE MULTI-VECTOR ARCHITECTURE'}
                  {selectedPathway === 'suntrack' && 'HIGHLIGHTING ROOFTOP SOLAR TRACKING PATHWAY'}
                  {selectedPathway === 'stepvolt' && 'HIGHLIGHTING COMMUTER FOOTSTEP HARVESTING PATHWAY'}
                  {selectedPathway === 'roadvolt' && 'HIGHLIGHTING ROADWAY KINETIC DEFLECTION PATHWAY'}
                  {selectedPathway === 'brakeback' && 'HIGHLIGHTING BUS ONBOARD REGENERATIVE PATHWAY'}
                </span>
              </div>

              {/* Canvas SVG Map */}
              <div className="h-72 w-full relative bg-neutral-950/80 rounded-lg border border-neutral-850 flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 800 280" className="w-full h-full">
                  {/* Sky & Sun Background */}
                  <circle cx="120" cy="50" r="22" fill="#F59E0B" opacity="0.3" />
                  <circle cx="120" cy="50" r="14" fill="#FBBF24" />

                  {/* Roadway in foreground */}
                  <rect x="0" y="200" width="800" height="80" fill="#1E293B" />
                  <line x1="0" y1="200" x2="800" y2="200" stroke="#475569" strokeWidth="2" />
                  <line x1="0" y1="240" x2="800" y2="240" stroke="#FBBF24" strokeWidth="2" strokeDasharray="15 15" />

                  {/* --- COMPONENT 1: SUNSTRIDE SHELTER & SUNTRACK ROOF --- */}
                  <g opacity={selectedPathway === 'all' || selectedPathway === 'suntrack' ? 1 : 0.25} className="transition-opacity">
                    {/* Shelter Foundation & Canopy */}
                    <rect x="80" y="140" width="220" height="60" rx="3" fill="#111827" stroke="#374151" strokeWidth="1.5" />
                    {/* Columns */}
                    <rect x="110" y="140" width="8" height="60" fill="#4B5563" />
                    <rect x="260" y="140" width="8" height="60" fill="#4B5563" />
                    {/* Roof Canopy */}
                    <rect x="70" y="130" width="240" height="12" rx="3" fill="#374151" />
                    {/* SunTrack Rotating Panel */}
                    <g transform="translate(190, 115) rotate(-20)">
                      <rect x="-45" y="-4" width="90" height="8" rx="2" fill="#1E3A8A" stroke="#F59E0B" strokeWidth="1.5" />
                      <line x1="-25" y1="-4" x2="-25" y2="4" stroke="#60A5FA" />
                      <line x1="0" y1="-4" x2="0" y2="4" stroke="#60A5FA" />
                      <line x1="25" y1="-4" x2="25" y2="4" stroke="#60A5FA" />
                    </g>
                    {/* Sun rays to panel */}
                    <line x1="120" y1="65" x2="190" y2="110" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 2" />
                    <text x="190" y="98" fill="#F59E0B" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                      1. SUNTRACK SOLAR
                    </text>
                  </g>

                  {/* --- COMPONENT 2: STEPVOLT FLOOR TILES --- */}
                  <g opacity={selectedPathway === 'all' || selectedPathway === 'stepvolt' ? 1 : 0.25} className="transition-opacity">
                    <rect x="125" y="194" width="130" height="6" rx="1" fill="#10B981" />
                    <text x="190" y="185" fill="#34D399" fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                      2. STEPVOLT TILES
                    </text>
                  </g>

                  {/* --- COMPONENT 3: ROADVOLT SPEED-BREAKER --- */}
                  <g opacity={selectedPathway === 'all' || selectedPathway === 'roadvolt' ? 1 : 0.25} className="transition-opacity">
                    <path d="M 380 200 Q 420 188 460 200" fill="#D97706" stroke="#F59E0B" strokeWidth="2.5" />
                    <text x="420" y="178" fill="#F59E0B" fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                      3. ROADVOLT MECHANISM
                    </text>
                  </g>

                  {/* --- COMPONENT 4: TRANSIT BUS & BRAKEBACK REGEN --- */}
                  <g opacity={selectedPathway === 'all' || selectedPathway === 'brakeback' ? 1 : 0.25} className="transition-opacity">
                    <g transform="translate(560, 140)">
                      <rect x="0" y="0" width="160" height="58" rx="6" fill="#1E3A8A" stroke="#3B82F6" strokeWidth="1.5" />
                      <rect x="5" y="5" width="150" height="6" fill="#F59E0B" />
                      <circle cx="35" cy="58" r="11" fill="#0F172A" stroke="#475569" strokeWidth="3" />
                      <circle cx="125" cy="58" r="11" fill="#0F172A" stroke="#475569" strokeWidth="3" />
                      <text x="80" y="35" fill="#FFFFFF" fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="bold">TRANSIT BUS</text>
                    </g>
                    <text x="640" y="125" fill="#60A5FA" fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                      4. BRAKEBACK REGEN
                    </text>
                  </g>

                  {/* Central Station Battery & Management Buffer */}
                  <g transform="translate(160, 208)">
                    <rect x="0" y="0" width="60" height="26" rx="3" fill="#064E3B" stroke="#10B981" strokeWidth="1" />
                    <text x="30" y="12" fill="#A7F3D0" fontSize="6" textAnchor="middle" fontFamily="monospace" fontWeight="bold">STATION</text>
                    <text x="30" y="21" fill="#A7F3D0" fontSize="6" textAnchor="middle" fontFamily="monospace">BATTERY</text>
                  </g>
                </svg>
              </div>

              {/* Realism Matrix Table: Different Scales, Efficiencies & Roles */}
              <div className="space-y-2 pt-2">
                <div className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider">
                  SYSTEM REALISM MATRIX: ENERGY SCALES & BOUNDARIES
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-[11px] border border-neutral-800 rounded-lg overflow-hidden">
                    <thead className="bg-neutral-900 text-neutral-400 border-b border-neutral-800">
                      <tr>
                        <th className="p-2.5">INNOVATION</th>
                        <th className="p-2.5">ENERGY MECHANISM</th>
                        <th className="p-2.5">TYPICAL SCALE</th>
                        <th className="p-2.5">ROLE IN SUNSTRIDE</th>
                        <th className="p-2.5">PRIMARY CHALLENGE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800 text-neutral-300">
                      <tr className={selectedPathway === 'suntrack' ? 'bg-amber-950/40 text-amber-300' : ''}>
                        <td className="p-2.5 font-bold text-amber-400">SunTrack</td>
                        <td className="p-2.5">Photovoltaic Optical Tracking</td>
                        <td className="p-2.5">10–50 Watts</td>
                        <td className="p-2.5">Station logic & PID screen</td>
                        <td className="p-2.5 text-neutral-400">Parasitic motor draw & wind loads</td>
                      </tr>
                      <tr className={selectedPathway === 'stepvolt' ? 'bg-emerald-950/40 text-emerald-300' : ''}>
                        <td className="p-2.5 font-bold text-emerald-400">StepVolt</td>
                        <td className="p-2.5">PZT Ceramic Piezoelectric</td>
                        <td className="p-2.5">0.1–2 milli-Joules / step</td>
                        <td className="p-2.5">RTC timer & wake-up interrupt</td>
                        <td className="p-2.5 text-neutral-400">Highly intermittent, ultra-low power</td>
                      </tr>
                      <tr className={selectedPathway === 'roadvolt' ? 'bg-amber-950/40 text-amber-300' : ''}>
                        <td className="p-2.5 font-bold text-amber-300">RoadVolt</td>
                        <td className="p-2.5">Rack-and-Pinion Dynamo</td>
                        <td className="p-2.5">1–5 Watt-hours / vehicle</td>
                        <td className="p-2.5">Shelter perimeter night lights</td>
                        <td className="p-2.5 text-neutral-400">Road durability & water sealing</td>
                      </tr>
                      <tr className={selectedPathway === 'brakeback' ? 'bg-sky-950/40 text-sky-300' : ''}>
                        <td className="p-2.5 font-bold text-sky-400">BrakeBack</td>
                        <td className="p-2.5">Vehicle Regenerative Inverter</td>
                        <td className="p-2.5">50–200 kilo-Joules / stop</td>
                        <td className="p-2.5">Vehicle traction battery</td>
                        <td className="p-2.5 text-neutral-400">Vehicle-level; not station hardware</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* CRITICAL SCIENTIFIC REALITY DISCLAIMER */}
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-2 text-xs text-neutral-700 leading-relaxed font-sans">
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-neutral-900">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>SCIENTIFIC HONESTY: NO UNJUSTIFIED ADDITIVE CLAIMS</span>
              </div>
              <p>
                <strong>The EcoFusion overview is a conceptual systems framework, not an existing operational power grid.</strong>
              </p>
              <p>
                In electrical engineering, disparate energy sources with vast scale discrepancies (micro-joules from footsteps vs tens of watts from solar panels vs kilo-joules from moving buses) <strong>cannot be casually added together</strong> without discrete power conditioning stages, separate MPPT charge controllers, galvanic isolation, and careful accounting for conversion and storage thermodynamic losses.
              </p>
              <div className="font-mono text-[11px] text-neutral-500 pt-1 border-t border-neutral-200">
                SunStride documents each engineering pathway with rigorous realism, distinguishing working electronics from conceptual research innovations.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
