import React, { useEffect, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Radio,
  Cpu,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  Wifi,
  Sun,
  Footprints,
  Film,
} from 'lucide-react';

interface DemoChapter {
  time: number;
  label: string;
  title: string;
  serial: string;
  ledState: 'boot' | 'idle' | 'green' | 'red';
  buzzerActive: boolean;
  rfidTag: string;
  wifiStatus: string;
  cardPosition: 'away' | 'tapping' | 'holding' | 'unknown';
}

const DEMO_CHAPTERS: DemoChapter[] = [
  {
    time: 0,
    label: '00s',
    title: 'Power-On & ESP8266 SoftAP Boot',
    serial: '[00.4s] ESP8266 Boot OK | SoftAP "SunStride-Station" UP @ 192.168.4.1',
    ledState: 'boot',
    buzzerActive: false,
    rfidTag: 'STANDBY (13.56 MHz)',
    wifiStatus: 'SoftAP Broadcast Active',
    cardPosition: 'away',
  },
  {
    time: 6,
    label: '06s',
    title: 'Bus Card (SX-01) Approaches MFRC522',
    serial: '[06.2s] MFRC522 SPI IRQ! Card UID Read: [A3 F2 19 7C] (Latency: 84ms)',
    ledState: 'green',
    buzzerActive: true,
    rfidTag: 'UID: A3 F2 19 7C',
    wifiStatus: 'Updating /api/status...',
    cardPosition: 'tapping',
  },
  {
    time: 12,
    label: '12s',
    title: 'Green LED + Buzzer Chime + Local Web Update',
    serial: '[12.0s] MATCH: Solaris Express (SX-01) -> GREEN LED ON + BUZZER 880Hz + HTTP 200',
    ledState: 'green',
    buzzerActive: true,
    rfidTag: 'VERIFIED: SX-01 AT BAY',
    wifiStatus: 'Commuter Phone Refreshed',
    cardPosition: 'holding',
  },
  {
    time: 19,
    label: '19s',
    title: 'Unregistered Tag Security Test (Red LED + Warn Tone)',
    serial: '[19.5s] Unknown UID [E7 9A 41 BC] -> RED LED ON + 260Hz Alert; Feed Protected',
    ledState: 'red',
    buzzerActive: true,
    rfidTag: 'DENIED: E7 9A 41 BC',
    wifiStatus: 'Tamper Ignored on Display',
    cardPosition: 'unknown',
  },
  {
    time: 25,
    label: '25s',
    title: 'Solar + Piezo Buffer Rail Verification',
    serial: '[25.1s] TP4056 Rail: 5.10V Steady | Solar Primary + Piezo Pulse Ready',
    ledState: 'idle',
    buzzerActive: false,
    rfidTag: 'SCANNING LOOP READY',
    wifiStatus: '1 Client Connected (Offline)',
    cardPosition: 'away',
  },
];

export const BenchtopDemoProof: React.FC = () => {
  const [seconds, setSeconds] = useState<number>(6);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Pause automatically when browser tab becomes hidden
  useEffect(() => {
    const onVisChange = () => {
      if (document.hidden) {
        setIsPlaying(false);
      }
    };
    document.addEventListener('visibilitychange', onVisChange);
    return () => document.removeEventListener('visibilitychange', onVisChange);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setSeconds((prev) => (prev >= 30 ? 0 : prev + 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const currentChapter =
    [...DEMO_CHAPTERS].reverse().find((c) => seconds >= c.time) || DEMO_CHAPTERS[0];

  return (
    <div className="bg-white rounded-2xl border border-[#E2E4E8] shadow-xs overflow-hidden">
      {/* Header Bar */}
      <div className="px-4 py-3 bg-[#14171C] text-white flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
            <Film className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold tracking-wide text-white">
                30-SEC BENCHTOP PROTOTYPE DEMO REEL
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                ESP8266 + RC522 + LED/BUZZER
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 font-mono">
              Interactive hardware timing verification sequence (00:00 – 00:30)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            id="demo-reel-play-btn"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1.5 rounded-md font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
              isPlaying
                ? 'bg-amber-500 text-neutral-950'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? 'PAUSE 30s REEL' : 'PLAY 30s DEMO'}</span>
          </button>

          <button
            id="demo-reel-reset-btn"
            onClick={() => {
              setIsPlaying(false);
              setSeconds(0);
            }}
            className="p-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300 cursor-pointer"
            title="Restart 30s reel"
            aria-label="Restart 30s demo reel"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Benchtop Hardware Visual Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Left 7 Cols: Breadboard Hardware SVG Stage */}
        <div className="lg:col-span-7 bg-[#0F1217] p-4 border-b lg:border-b-0 lg:border-r border-neutral-800 relative">
          <svg
            viewBox="0 0 640 230"
            className="w-full h-52 sm:h-56 select-none"
            role="img"
            aria-label="Benchtop hardware setup with ESP8266, MFRC522 RFID reader, green and red LEDs, and active buzzer"
          >
            {/* Breadboard surface */}
            <rect x="16" y="18" width="608" height="194" rx="8" fill="#181C24" stroke="#2D3340" strokeWidth="1.5" />
            <line x1="28" y1="36" x2="612" y2="36" stroke="#EF4444" strokeWidth="1" strokeOpacity="0.4" />
            <line x1="28" y1="196" x2="612" y2="196" stroke="#3B82F6" strokeWidth="1" strokeOpacity="0.4" />

            {/* SPI Ribbon Wires (ESP8266 -> MFRC522) */}
            <path d="M 190 95 C 245 95, 250 75, 295 75" stroke="#F59E0B" strokeWidth="2.5" fill="none" />
            <path d="M 190 107 C 245 107, 250 93, 295 93" stroke="#10B981" strokeWidth="2.5" fill="none" />
            <path d="M 190 119 C 245 119, 250 111, 295 111" stroke="#38BDF8" strokeWidth="2.5" fill="none" />
            <path d="M 190 131 C 245 131, 250 129, 295 129" stroke="#A78BFA" strokeWidth="2.5" fill="none" />

            {/* ESP8266 NodeMCU Board */}
            <g transform="translate(46, 56)">
              <rect x="0" y="0" width="144" height="114" rx="6" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
              {/* ESP-12E Metal RF Shield */}
              <rect x="20" y="14" width="62" height="52" rx="3" fill="#94A3B8" stroke="#CBD5E1" />
              <text x="51" y="43" fill="#0F172A" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                ESP-12E
              </text>
              {/* Wi-Fi PCB antenna squiggle */}
              <path d="M 88 22 L 106 22 L 106 30 L 92 30 L 92 38 L 106 38" stroke="#FBBF24" strokeWidth="1.8" fill="none" />
              {/* Onboard Blue Status LED */}
              <circle
                cx="124"
                cy="24"
                r="4"
                fill={currentChapter.ledState === 'boot' ? '#38BDF8' : '#0284C7'}
                opacity={currentChapter.ledState === 'boot' ? 1 : 0.4}
              />
              <text x="72" y="88" fill="#E2E8F0" fontSize="9.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                NodeMCU ESP8266
              </text>
              <text x="72" y="102" fill="#34D399" fontSize="8" textAnchor="middle" fontFamily="monospace">
                {currentChapter.wifiStatus}
              </text>
            </g>

            {/* MFRC522 Blue PCB Reader */}
            <g transform="translate(295, 52)">
              <rect x="0" y="0" width="122" height="122" rx="6" fill="#1D4ED8" stroke="#60A5FA" strokeWidth="1.5" />
              {/* Copper Antenna Coil */}
              <rect x="16" y="14" width="90" height="62" rx="5" fill="none" stroke="#FBBF24" strokeWidth="2" />
              <rect x="24" y="22" width="74" height="46" rx="3" fill="none" stroke="#FBBF24" strokeWidth="1.4" />
              <text x="61" y="49" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                MFRC522
              </text>
              <text x="61" y="96" fill="#DBEAFE" fontSize="8.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                13.56 MHz COIL
              </text>
              <text x="61" y="110" fill="#FDE68A" fontSize="7.5" textAnchor="middle" fontFamily="monospace">
                {currentChapter.rfidTag}
              </text>
            </g>

            {/* Animated RFID Card / Bus Keychain */}
            <g
              transform={
                currentChapter.cardPosition === 'away'
                  ? 'translate(450, 26)'
                  : currentChapter.cardPosition === 'tapping'
                  ? 'translate(345, 58)'
                  : currentChapter.cardPosition === 'holding'
                  ? 'translate(330, 62)'
                  : 'translate(340, 60)'
              }
              style={{ transition: 'transform 0.6s ease' }}
            >
              <rect
                x="0"
                y="0"
                width="74"
                height="46"
                rx="5"
                fill={currentChapter.cardPosition === 'unknown' ? '#991B1B' : '#F8FAFC'}
                stroke={currentChapter.cardPosition === 'unknown' ? '#F87171' : '#F59E0B'}
                strokeWidth="2"
              />
              <text
                x="37"
                y="20"
                fill={currentChapter.cardPosition === 'unknown' ? '#FECACA' : '#0F172A'}
                fontSize="8"
                fontWeight="bold"
                textAnchor="middle"
                fontFamily="monospace"
              >
                {currentChapter.cardPosition === 'unknown' ? 'UNKNOWN' : 'BUS SX-01'}
              </text>
              <text
                x="37"
                y="34"
                fill={currentChapter.cardPosition === 'unknown' ? '#FCA5A5' : '#475569'}
                fontSize="7"
                textAnchor="middle"
                fontFamily="monospace"
              >
                {currentChapter.cardPosition === 'unknown' ? 'E7 9A 41 BC' : 'A3 F2 19 7C'}
              </text>
            </g>

            {/* Output LEDs & Piezo Buzzer Module (Right Side) */}
            <g transform="translate(468, 86)">
              <rect x="0" y="0" width="136" height="94" rx="6" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
              <text x="68" y="16" fill="#94A3B8" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                OUTPUT FEEDBACK
              </text>

              {/* Green Verified LED */}
              <circle
                cx="30"
                cy="44"
                r="10"
                fill={currentChapter.ledState === 'green' ? '#10B981' : '#064E3B'}
                stroke="#34D399"
                strokeWidth="1.5"
              />
              <text x="30" y="68" fill="#A7F3D0" fontSize="7.5" textAnchor="middle" fontFamily="monospace">
                VERIFIED
              </text>

              {/* Red Denied LED */}
              <circle
                cx="68"
                cy="44"
                r="10"
                fill={currentChapter.ledState === 'red' ? '#EF4444' : '#7F1D1D'}
                stroke="#F87171"
                strokeWidth="1.5"
              />
              <text x="68" y="68" fill="#FECACA" fontSize="7.5" textAnchor="middle" fontFamily="monospace">
                DENIED
              </text>

              {/* Active Piezo Buzzer */}
              <circle
                cx="108"
                cy="44"
                r="12"
                fill="#1E293B"
                stroke={currentChapter.buzzerActive ? '#FBBF24' : '#64748B'}
                strokeWidth="2"
              />
              <circle cx="108" cy="44" r="3.5" fill={currentChapter.buzzerActive ? '#FBBF24' : '#475569'} />
              <text x="108" y="68" fill="#FDE68A" fontSize="7.5" textAnchor="middle" fontFamily="monospace">
                {currentChapter.buzzerActive ? 'BEEP!' : 'BUZZER'}
              </text>

              <text x="68" y="84" fill="#64748B" fontSize="7" textAnchor="middle" fontFamily="monospace">
                D1 Buzzer · D2/D4 LEDs
              </text>
            </g>
          </svg>
        </div>

        {/* Right 5 Cols: Timeline Scrubber, Chapters & Serial Console */}
        <div className="lg:col-span-5 p-4 bg-[#F8F9FA] flex flex-col justify-between space-y-3">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="font-bold text-[#1A1A1A] flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-emerald-600" />
                <span>{currentChapter.title}</span>
              </span>
              <span className="tabular-nums font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                00:{String(seconds).padStart(2, '0')} / 00:30
              </span>
            </div>

            {/* Scrubber Slider */}
            <input
              type="range"
              min={0}
              max={30}
              step={1}
              value={seconds}
              onChange={(e) => {
                setIsPlaying(false);
                setSeconds(Number(e.target.value));
              }}
              aria-label="Benchtop hardware demo timeline scrubber"
              aria-valuetext={`${seconds} seconds: ${currentChapter.title}`}
              className="w-full h-1.5 bg-[#DCDFE4] rounded-lg appearance-none cursor-pointer accent-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            />

            {/* Chapter Stepper Chips */}
            <div className="flex flex-wrap gap-1.5">
              {DEMO_CHAPTERS.map((chap) => {
                const isActive = currentChapter.time === chap.time;
                return (
                  <button
                    key={chap.time}
                    onClick={() => {
                      setIsPlaying(false);
                      setSeconds(chap.time);
                    }}
                    className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-colors cursor-pointer border ${
                      isActive
                        ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                        : 'bg-white text-[#4B5563] border-[#E2E4E8] hover:bg-[#ECEEF2]'
                    }`}
                  >
                    {chap.label} · {chap.title.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Synchronized Serial Log Output */}
          <div className="p-3 rounded-lg bg-[#14171C] text-neutral-200 font-mono text-[11px] space-y-1.5 border border-neutral-800">
            <div className="flex items-center justify-between text-[9px] text-neutral-400 border-b border-neutral-800 pb-1">
              <span>SERIAL MONITOR (115200 BAUD)</span>
              <span className="text-emerald-400">LIVE BENCH REPLAY</span>
            </div>
            <div className="text-emerald-300 leading-relaxed min-h-[34px]">
              {currentChapter.serial}
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-[#6B7280] pt-1">
            <span className="flex items-center gap-1">
              <Sun className="w-3 h-3 text-amber-500" />
              <span>Solar + Piezo 5V Bench Feed</span>
            </span>
            <span className="flex items-center gap-1">
              <Wifi className="w-3 h-3 text-emerald-600" />
              <span>Zero Internet Required</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
