import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Footprints, Radio, Cpu, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import { SunStrideLogo } from './SunStrideLogo';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const initSteps = [
    { text: 'POWER SYSTEM ........ OK', delay: 400 },
    { text: 'ENERGY INPUT ........ OK', delay: 900 },
    { text: 'RFID SYSTEM ......... OK', delay: 1400 },
    { text: 'DATA SYSTEM ......... OK', delay: 1900 },
    { text: 'INTERFACE ........... OK', delay: 2400 },
    { text: 'SYSTEM ONLINE', delay: 2900 },
  ];

  useEffect(() => {
    // Step timer sequence
    const timers: NodeJS.Timeout[] = [];

    initSteps.forEach((item, index) => {
      const t = setTimeout(() => {
        setStep(index + 1);
        setLogs((prev) => [...prev, item.text]);
      }, item.delay);
      timers.push(t);
    });

    const completionTimer = setTimeout(() => {
      setIsCompleted(true);
      const exitTimer = setTimeout(() => {
        onComplete();
      }, 700);
      timers.push(exitTimer);
    }, 3800);
    timers.push(completionTimer);

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [onComplete]);

  const handleSkip = () => {
    onComplete();
  };

  return (
    <AnimatePresence>
      {!isCompleted ? (
        <motion.div
          id="preloader-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
          className="fixed inset-0 z-50 bg-[#0c0e12] text-[#F3F4F6] flex flex-col items-center justify-center p-6 select-none font-mono"
        >
          {/* Skip button top-right */}
          <button
            id="preloader-skip-btn"
            onClick={handleSkip}
            className="absolute top-6 right-6 px-3 py-1.5 rounded text-xs tracking-wider text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-600 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>SKIP INITIALIZATION</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* Center Technical Box */}
          <div className="w-full max-w-xl mx-auto flex flex-col items-center">
            {/* Header branding */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8 flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-700/80 flex items-center justify-center p-2 mb-3 shadow-lg shadow-amber-500/5">
                <SunStrideLogo size={52} darkTheme />
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs tracking-[0.25em] text-neutral-400 font-semibold uppercase">
                  SMART STATION / SYSTEM INITIALIZATION
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-display">
                SUNSTRIDE
              </h1>
              <p className="text-xs text-neutral-500 tracking-wider mt-1">
                ATL ENGINEERING & RESEARCH INITIATIVE
              </p>
            </motion.div>

            {/* Technical Interactive Schematic Visual */}
            <div className="w-full h-44 md:h-52 bg-[#12161f] border border-neutral-800 rounded-lg relative overflow-hidden p-4 mb-8 flex items-center justify-between">
              {/* Background grid */}
              <div className="absolute inset-0 bg-tech-grid-dark opacity-30 pointer-events-none" />

              {/* Left Column: Energy Inputs */}
              <div className="flex flex-col gap-6 z-10">
                {/* Solar Source */}
                <motion.div
                  initial={{ opacity: 0.3 }}
                  animate={{
                    opacity: step >= 1 ? 1 : 0.3,
                    scale: step >= 1 ? [1, 1.05, 1] : 1,
                  }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-2.5 bg-neutral-900/80 border border-neutral-700/60 px-2.5 py-1.5 rounded"
                >
                  <Sun className={`w-4 h-4 ${step >= 1 ? 'text-amber-400' : 'text-neutral-500'}`} />
                  <div className="text-[11px] leading-tight">
                    <span className="text-neutral-400 block">SOLAR PV</span>
                    <span className="text-[9px] text-amber-400/90">{step >= 1 ? 'HARVESTING' : 'IDLE'}</span>
                  </div>
                </motion.div>

                {/* Piezo Source */}
                <motion.div
                  initial={{ opacity: 0.3 }}
                  animate={{
                    opacity: step >= 2 ? 1 : 0.3,
                    scale: step >= 2 ? [1, 1.05, 1] : 1,
                  }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-2.5 bg-neutral-900/80 border border-neutral-700/60 px-2.5 py-1.5 rounded"
                >
                  <Footprints className={`w-4 h-4 ${step >= 2 ? 'text-cyan-400' : 'text-neutral-500'}`} />
                  <div className="text-[11px] leading-tight">
                    <span className="text-neutral-400 block">PIEZO MATRIX</span>
                    <span className="text-[9px] text-cyan-400/90">{step >= 2 ? 'KINETIC READY' : 'IDLE'}</span>
                  </div>
                </motion.div>
              </div>

              {/* Center Schematic: Station Hub */}
              <div className="relative z-10 flex flex-col items-center justify-center">
                {/* Energy converge signal SVG lines */}
                <svg className="absolute w-48 h-32 -z-1 pointer-events-none" viewBox="0 0 192 128">
                  {/* Solar Line */}
                  <path
                    d="M 10 32 L 96 64"
                    fill="none"
                    stroke={step >= 2 ? '#fbbf24' : '#374151'}
                    strokeWidth="1.5"
                    strokeDasharray={step >= 2 ? '4 3' : 'none'}
                    className={step >= 2 ? 'animate-signal-flow' : ''}
                  />
                  {/* Piezo Line */}
                  <path
                    d="M 10 96 L 96 64"
                    fill="none"
                    stroke={step >= 2 ? '#22d3ee' : '#374151'}
                    strokeWidth="1.5"
                    strokeDasharray={step >= 2 ? '4 3' : 'none'}
                    className={step >= 2 ? 'animate-signal-flow' : ''}
                  />
                  {/* Bus RFID Line */}
                  <path
                    d="M 180 64 L 96 64"
                    fill="none"
                    stroke={step >= 3 ? '#34d399' : '#374151'}
                    strokeWidth="1.5"
                    strokeDasharray={step >= 3 ? '4 3' : 'none'}
                    className={step >= 3 ? 'animate-signal-flow' : ''}
                  />
                </svg>

                {/* Central Station Graphic Box */}
                <motion.div
                  animate={{
                    borderColor: step >= 4 ? '#34d399' : '#374151',
                    boxShadow: step >= 5 ? '0 0 20px rgba(52, 211, 153, 0.2)' : 'none',
                  }}
                  className="w-24 h-24 rounded-lg bg-[#0e121a] border-2 flex flex-col items-center justify-center p-2 text-center relative"
                >
                  <Cpu className={`w-6 h-6 mb-1 ${step >= 4 ? 'text-emerald-400' : 'text-neutral-500'}`} />
                  <span className="text-[10px] font-bold text-white tracking-wider">STATION</span>
                  <span className="text-[8px] text-neutral-400 mt-0.5">
                    {step >= 5 ? 'ACTIVE INTERFACE' : 'BOOTING'}
                  </span>

                  {/* Radiating pulse ring when RFID active */}
                  {step >= 3 && (
                    <div className="absolute inset-0 rounded-lg border border-emerald-400/40 animate-ping pointer-events-none" />
                  )}
                </motion.div>
              </div>

              {/* Right Column: Approaching Bus & RFID */}
              <div className="flex flex-col gap-6 z-10 items-end">
                <motion.div
                  initial={{ opacity: 0.3, x: 10 }}
                  animate={{
                    opacity: step >= 3 ? 1 : 0.3,
                    x: step >= 3 ? 0 : 10,
                  }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-2.5 bg-neutral-900/80 border border-neutral-700/60 px-2.5 py-1.5 rounded"
                >
                  <div className="text-[11px] text-right leading-tight">
                    <span className="text-neutral-400 block">TRANSIT BUS</span>
                    <span className="text-[9px] text-emerald-400/90">{step >= 3 ? 'APPROACHING' : 'STANDBY'}</span>
                  </div>
                  <Radio className={`w-4 h-4 ${step >= 3 ? 'text-emerald-400' : 'text-neutral-500'}`} />
                </motion.div>

                {/* RFID Tag Status */}
                <motion.div
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: step >= 3 ? 1 : 0.3 }}
                  className="px-2 py-1 rounded bg-neutral-950 border border-neutral-800 text-[9px] text-neutral-400 text-right"
                >
                  <span>TAG ID: </span>
                  <span className="text-emerald-400 font-mono">
                    {step >= 3 ? 'E2-80-11-70-20-A1' : 'SCANNING...'}
                  </span>
                </motion.div>
              </div>
            </div>

            {/* Terminal Log Console */}
            <div className="w-full bg-[#0a0c10] border border-neutral-800/80 rounded-md p-3 font-mono text-xs space-y-1.5 shadow-inner">
              <div className="flex items-center justify-between text-[10px] text-neutral-500 border-b border-neutral-800/60 pb-1.5 mb-1.5">
                <span>TERMINAL://SUNSTRIDE/SYS_BOOT</span>
                <span>BAUD: 115200</span>
              </div>

              {logs.map((log, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between"
                >
                  <span className="text-neutral-300">{log}</span>
                  <span className="text-emerald-400 text-[11px] font-semibold">
                    {log === 'SYSTEM ONLINE' ? 'ONLINE' : 'OK'}
                  </span>
                </motion.div>
              ))}

              {step < initSteps.length && (
                <div className="flex items-center gap-1.5 text-neutral-500 pt-1">
                  <span className="w-1.5 h-3 bg-neutral-400 animate-pulse" />
                  <span className="text-[11px]">Processing system diagnostics...</span>
                </div>
              )}
            </div>

            {/* Bottom Status Ticker */}
            <div className="mt-4 flex items-center gap-2 text-xs text-neutral-400">
              {step >= 6 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-emerald-400 font-semibold"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>SUNSTRIDE // ONLINE — INITIALIZING HOMEPAGE</span>
                </motion.div>
              ) : (
                <div className="flex items-center gap-2 text-neutral-500">
                  <Zap className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                  <span>Configuring energy harvesting & RFID transponder links...</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
