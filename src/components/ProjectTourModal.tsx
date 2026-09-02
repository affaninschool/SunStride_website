import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Sun,
  Footprints,
  Radio,
  Zap,
  Clock,
  CheckCircle2,
  Award,
  Globe,
  BatteryCharging,
  Shield,
  Layers,
  ArrowRight,
  ExternalLink,
  Volume2,
  VolumeX,
  Compass
} from 'lucide-react';
import { SunStrideLogo } from './SunStrideLogo';

interface ProjectTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToLab?: () => void;
  onNavigateToDocs?: () => void;
}

interface TourSlide {
  id: number;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  analogy: string;
  mainConcept: string;
  keyPoints: { icon: any; title: string; desc: string }[];
  didYouKnow: string;
  visualType: 'overview' | 'problem' | 'solar' | 'piezo' | 'hybrid' | 'rfid' | 'display' | 'rugged' | 'impact' | 'future';
}

const TOUR_SLIDES: TourSlide[] = [
  {
    id: 1,
    badge: 'SLIDE 01 / 10 · THE BIG PICTURE',
    badgeColor: 'emerald',
    title: 'Meet SunStride: The Smart, Self-Powered Bus Stop',
    subtitle: 'An eco-friendly transit shelter that runs entirely without grid electricity.',
    analogy: 'Imagine a bus stop that behaves like a living organism—drinking sunlight from its roof and drawing electrical energy from every footstep commuters take on its floor.',
    mainConcept:
      'SunStride reimagines urban public transportation by uniting two distinct technologies into one compact station: hybrid renewable micro-harvesting (Solar + Piezoelectric) and automatic vehicle arrival tracking via passive RFID.',
    keyPoints: [
      {
        icon: Sun,
        title: 'Zero Grid Power Needed',
        desc: 'Operates 100% self-reliantly without connecting to municipal power lines.',
      },
      {
        icon: Radio,
        title: 'Automatic Bus Sensing',
        desc: 'Instantly identifies approaching buses in under 15 milliseconds.',
      },
      {
        icon: Zap,
        title: 'Always Active',
        desc: 'Provides real-time route info to commuters all day and night.',
      },
    ],
    didYouKnow: 'Over 80% of bus stops in developing regions lack electrical power connections due to expensive trenching costs.',
    visualType: 'overview',
  },
  {
    id: 2,
    badge: 'SLIDE 02 / 10 · THE PROBLEM',
    badgeColor: 'rose',
    title: 'The Commuter Uncertainty Dilemma',
    subtitle: 'Why traditional bus stations leave millions in the dark.',
    analogy: 'Waiting for a bus without information feels like waiting in an airport with broken flight boards—you never know if your bus passed 2 minutes ago or is arriving in 20 minutes.',
    mainConcept:
      'In India, millions of commuters lose valuable hours daily because conventional smart boards are expensive, consume too much grid power, and fail in remote or weather-challenged corridors.',
    keyPoints: [
      {
        icon: Clock,
        title: 'High Waiting Uncertainty',
        desc: 'Unpredictable arrival schedules discourage passengers from choosing public transit.',
      },
      {
        icon: Zap,
        title: 'Heavy Grid Dependence',
        desc: 'Existing LED electronic display signboards draw heavy 50W–150W grid power.',
      },
      {
        icon: Shield,
        title: 'Maintenance Roadblocks',
        desc: 'Underground wiring and recurring cellular data subscription bills lead to abandoned installations.',
      },
    ],
    didYouKnow: 'Studies show that providing real-time transit info reduces perceived commuter wait times by over 30%.',
    visualType: 'problem',
  },
  {
    id: 3,
    badge: 'SLIDE 03 / 10 · ENERGY SOURCE 1',
    badgeColor: 'amber',
    title: 'Harvesting the Sun: Solar Photovoltaics',
    subtitle: 'Capturing clean solar energy from the shelter canopy.',
    analogy: 'The shelter roof acts as a solar shield that turns scorching tropical heat into useful electrical juice.',
    mainConcept:
      'High-efficiency monocrystalline solar panels are integrated directly into the roof canopy. The system captures daylight and regulates current through an intelligent Maximum Power Point Tracking (MPPT) circuit.',
    keyPoints: [
      {
        icon: Sun,
        title: 'Daylight Charging',
        desc: 'Generates up to 35W peak clean energy during daylight hours.',
      },
      {
        icon: BatteryCharging,
        title: 'Smart MPPT Controller',
        desc: 'Boosts low-light harvesting efficiency even during monsoon or overcast skies.',
      },
      {
        icon: Layers,
        title: 'Durable LiFePO4 Storage',
        desc: 'Safely stores power in long-life lithium iron phosphate battery cells.',
      },
    ],
    didYouKnow: 'Monocrystalline solar cells convert over 21% of incident sunlight directly into usable electrical current.',
    visualType: 'solar',
  },
  {
    id: 4,
    badge: 'SLIDE 04 / 10 · ENERGY SOURCE 2',
    badgeColor: 'sky',
    title: 'Walking Energy: Piezoelectric Footsteps',
    subtitle: 'Turning passenger footsteps into instant electrical voltage.',
    analogy: 'Every step you take exerts mechanical force. Piezoelectric crystals squeeze that weight like a sponge, spraying out sparks of clean electricity!',
    mainConcept:
      'Piezoelectric ceramic transducers (PZT) embedded beneath the station passenger floor compress microscopically under footsteps, generating AC voltage pulses that are rectified and stored instantly.',
    keyPoints: [
      {
        icon: Footprints,
        title: 'Harvest Rush Hours',
        desc: 'Crowded morning and evening commute hours generate peak kinetic power.',
      },
      {
        icon: Zap,
        title: 'Mechanical to Electrical',
        desc: 'Direct solid-state conversion with zero moving gears or maintenance parts.',
      },
      {
        icon: Sparkles,
        title: 'Symbiotic Eco-System',
        desc: 'Commuters actively power the very station that serves their travel info.',
      },
    ],
    didYouKnow: 'An average human step delivers roughly 500 Newtons of force—enough to produce a burst of 15 to 45 volts across a piezo array.',
    visualType: 'piezo',
  },
  {
    id: 5,
    badge: 'SLIDE 05 / 10 · POWER MANAGEMENT',
    badgeColor: 'violet',
    title: 'The Micro-Power Brain: Hybrid Management',
    subtitle: 'How SunStride stays alive for 72+ hours without sun.',
    analogy: 'Think of the Power Management Unit as a strict household finance manager that never wastes a single micro-watt and prioritizes emergency reserve power.',
    mainConcept:
      'Solar and piezoelectric voltages arrive at different strengths. A specialized Power Management Unit (PMU) filters, steps up, and blends both sources seamlessly before feeding the microcontroller.',
    keyPoints: [
      {
        icon: Zap,
        title: 'Sub-Milliwatt Sleep Mode',
        desc: 'Draws less than 0.8 mW in idle standby, waking only when sensors trigger.',
      },
      {
        icon: BatteryCharging,
        title: 'Multi-Stage Rectification',
        desc: 'Converts chaotic piezo AC spikes into stable 3.3V DC power.',
      },
      {
        icon: Clock,
        title: '72-Hour Autonomy',
        desc: 'Can operate continuously for three full days in total darkness.',
      },
    ],
    didYouKnow: 'By utilizing sleep cycling, SunStride uses 94% less electricity than standard commercial smart bus kiosks.',
    visualType: 'hybrid',
  },
  {
    id: 6,
    badge: 'SLIDE 06 / 10 · VEHICLE TRACKING',
    badgeColor: 'emerald',
    title: 'Passive RFID: Tracking Without Internet or GPS',
    subtitle: 'Ultra-low-cost, battery-free vehicle identification.',
    analogy: 'Similar to the Fastag on highway toll booths, but redesigned to operate in micro-seconds at the bus station stop line with zero monthly subscription cost.',
    mainConcept:
      'Each bus carries a batteryless UHF RFID tag costing less than ₹50. When the bus enters the 3 to 8 meter detection zone, the station interrogator beams a radio signal that powers the tag and reads its unique ID in under 15ms.',
    keyPoints: [
      {
        icon: Radio,
        title: 'Zero Vehicle Batteries',
        desc: 'Tags are completely passive and last 10+ years with zero maintenance.',
      },
      {
        icon: Globe,
        title: 'No Internet Needed',
        desc: 'Works in remote mountain roads, tunnels, and areas with zero cellular signals.',
      },
      {
        icon: Shield,
        title: '100% Reliable Accuracy',
        desc: 'Immune to GPS drift, tall building signal blockage, or cloud outages.',
      },
    ],
    didYouKnow: 'Passive RFID tags draw power wirelessly directly from the radio wave emitted by the reader antenna.',
    visualType: 'rfid',
  },
  {
    id: 7,
    badge: 'SLIDE 07 / 10 · COMMUTER EXPERIENCE',
    badgeColor: 'amber',
    title: 'The Passenger Screen: Clear, Instant, Bistable',
    subtitle: 'Displaying arrival times clearly under blazing midday sun.',
    analogy: 'Like an Amazon Kindle e-reader, the screen uses almost zero electricity when showing static text, and looks sharper the brighter the sun shines.',
    mainConcept:
      'When a bus approaches, the station micro-controller decodes the tag, matches it with local route tables, and refreshes the passenger display with Route Number, Destination, and Next Departure Time.',
    keyPoints: [
      {
        icon: Zap,
        title: 'Bistable E-Paper Technology',
        desc: 'Consumes power only during the split-second when text updates.',
      },
      {
        icon: Sun,
        title: 'Glanceable Direct-Sun Readability',
        desc: 'High-contrast monochrome display never suffers from sunlight washouts.',
      },
      {
        icon: Award,
        title: 'Inclusive Audio Tone',
        desc: 'Generates a soft alert chime to inform visually challenged commuters.',
      },
    ],
    didYouKnow: 'E-paper screens use reflective ambient light instead of harsh power-hungry backlights.',
    visualType: 'display',
  },
  {
    id: 8,
    badge: 'SLIDE 08 / 10 · ENGINEERING FOR INDIA',
    badgeColor: 'sky',
    title: 'Built Tough for Indian Climates & Streets',
    subtitle: 'Weather-sealed, tamper-resistant, and modular.',
    analogy: 'Engineered like an off-road utility vehicle: simple, durable, dust-proof, and repairable with basic tools.',
    mainConcept:
      'SunStride was designed from day one to withstand severe monsoons, extreme summer temperatures up to 50°C, high dust levels, and rough daily urban use.',
    keyPoints: [
      {
        icon: Shield,
        title: 'IP65 Enclosure Protection',
        desc: 'Seals sensitive electronics against heavy rain, humidity, and fine dust.',
      },
      {
        icon: Layers,
        title: 'Modular Retrofit Design',
        desc: 'Can be bolted onto existing metal or concrete bus shelters in just 2 hours.',
      },
      {
        icon: Sparkles,
        title: 'Vibration Dampened',
        desc: 'Piezo tiles are shock-mounted to absorb heavy stampedes safely.',
      },
    ],
    didYouKnow: 'India has over 1.5 million bus stops, making low-cost retrofit capabilities essential for nationwide adoption.',
    visualType: 'rugged',
  },
  {
    id: 9,
    badge: 'SLIDE 09 / 10 · THE SUSTAINABILITY IMPACT',
    badgeColor: 'emerald',
    title: 'Clean Energy & Greener Cities for All',
    subtitle: 'Supporting the United Nations Sustainable Development Goals.',
    analogy: 'If every bus stop generates its own energy and eliminates paper timetables, cities save millions of kilowatt-hours and reduce thousands of tons of CO2.',
    mainConcept:
      'SunStride demonstrates that public transit infrastructure can be a producer of green energy rather than just an electricity consumer, accelerating the transition to clean smart cities.',
    keyPoints: [
      {
        icon: Globe,
        title: 'UN SDG 7, 9 & 11',
        desc: 'Promotes affordable clean energy, resilient infrastructure, and sustainable cities.',
      },
      {
        icon: Footprints,
        title: 'Encourages Public Transit',
        desc: 'Reliable bus tracking shifts commuters away from carbon-heavy private cars.',
      },
      {
        icon: Sun,
        title: 'Zero Carbon Footprint',
        desc: '100% powered by daylight and kinetic human motion.',
      },
    ],
    didYouKnow: 'Transitioning 1,000 bus stops to self-powered micro-harvesting saves over 120,000 kWh of grid electricity every year.',
    visualType: 'impact',
  },
  {
    id: 10,
    badge: 'SLIDE 10 / 10 · THE ATL VISION & NEXT STEPS',
    badgeColor: 'violet',
    title: 'From Student Tinkering to Smart Infrastructure',
    subtitle: 'Born in Atal Tinkering Labs: Where young innovators build the future.',
    analogy: 'SunStride is proof that grassroots innovation and hands-on tinkering can solve real-world civic challenges in our own neighborhoods.',
    mainConcept:
      'Conceived and engineered as an applied prototype, SunStride is now expanding toward multi-station mesh communication, SOS safety beacons, and crowd density telemetry.',
    keyPoints: [
      {
        icon: Sparkles,
        title: 'ATL Innovation Spirit',
        desc: 'Built through iterative experimentation, 3D prototyping, and code.',
      },
      {
        icon: Compass,
        title: 'Mesh Station Networks',
        desc: 'Future prototypes relay bus positions station-to-station via LoRa radio.',
      },
      {
        icon: CheckCircle2,
        title: 'Explore Live in the Lab',
        desc: 'You can test the interactive simulation right here on this website!',
      },
    ],
    didYouKnow: 'Atal Tinkering Labs foster hands-on STEM problem solving across thousands of schools in India.',
    visualType: 'future',
  },
];

export const ProjectTourModal: React.FC<ProjectTourModalProps> = ({
  isOpen,
  onClose,
  onNavigateToLab,
  onNavigateToDocs,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [timerSpeed] = useState<number>(12000); // 12 seconds per slide = 120 seconds (2 mins) total
  const autoPlayRef = useRef<any>(null);

  const currentSlide = TOUR_SLIDES[currentSlideIndex];

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentSlideIndex]);

  // Autoplay timer
  useEffect(() => {
    if (!isOpen || !isPlaying) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      return;
    }

    const intervalStep = 100;
    const stepIncrement = (intervalStep / timerSpeed) * 100;

    autoPlayRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNextAuto();
          return 0;
        }
        return prev + stepIncrement;
      });
    }, intervalStep);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isOpen, isPlaying, currentSlideIndex, timerSpeed]);

  const handleNextAuto = () => {
    setCurrentSlideIndex((prev) => {
      if (prev < TOUR_SLIDES.length - 1) {
        return prev + 1;
      } else {
        setIsPlaying(false);
        return prev;
      }
    });
  };

  const handleNext = () => {
    setProgress(0);
    if (currentSlideIndex < TOUR_SLIDES.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setProgress(0);
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  };

  const handleGoToSlide = (idx: number) => {
    setProgress(0);
    setCurrentSlideIndex(idx);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const restartTour = () => {
    setCurrentSlideIndex(0);
    setProgress(0);
    setIsPlaying(true);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        data-tour-modal="true"
        className="tour-modal-overlay fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 select-none"
      >
        {/* Modal Window Container */}
        <motion.div
          data-tour-modal="true"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="tour-modal-container relative w-full max-w-5xl bg-[#121417] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-white max-h-[92vh]"
        >
          {/* TOP BAR: Header & Controls */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-800 bg-neutral-950/80">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-700 flex items-center justify-center p-1 shadow-xs">
                <SunStrideLogo size={26} darkTheme />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-sm tracking-tight text-white">SUNSTRIDE GUIDED TOUR</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    2 MIN EXPEDITION
                  </span>
                </div>
                <p className="text-[10px] font-mono text-neutral-400">BEGINNER-FRIENDLY PROJECT WALKTHROUGH</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-mono text-neutral-300 hover:text-white transition-all cursor-pointer"
                title={isPlaying ? 'Pause Auto-Play' : 'Start Auto-Play (2 mins total)'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                <span className="hidden sm:inline">{isPlaying ? 'PAUSE' : 'AUTO-PLAY'}</span>
              </button>

              <button
                onClick={restartTour}
                className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-400 hover:text-white transition-all cursor-pointer"
                title="Restart Tour from Slide 1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-neutral-900 hover:bg-rose-950/60 border border-neutral-700 hover:border-rose-700 text-neutral-400 hover:text-rose-400 transition-all cursor-pointer ml-1"
                title="Close Tour (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* SLIDE PROGRESS BAR */}
          <div className="w-full bg-neutral-900 h-1 relative overflow-hidden">
            {/* Base overall progress */}
            <div
              className="absolute left-0 top-0 bottom-0 bg-neutral-700 transition-all duration-300"
              style={{ width: `${((currentSlideIndex + 1) / TOUR_SLIDES.length) * 100}%` }}
            />
            {/* Active slide timer progress if playing */}
            {isPlaying && (
              <div
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-amber-400 to-emerald-400"
                style={{
                  left: `${(currentSlideIndex / TOUR_SLIDES.length) * 100}%`,
                  width: `${(1 / TOUR_SLIDES.length) * progress}%`,
                }}
              />
            )}
          </div>

          {/* MAIN SLIDE CONTENT BODY */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 md:p-8 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Header info */}
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-neutral-900 border border-neutral-700 text-[11px] font-mono font-bold tracking-wider text-amber-400">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{currentSlide.badge}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display tracking-tight text-white">
                    {currentSlide.title}
                  </h2>
                  <p className="text-sm sm:text-base text-neutral-300 font-medium leading-relaxed">
                    {currentSlide.subtitle}
                  </p>
                </div>

                {/* Grid: Analogy & Visual Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left 7 Columns: Beginner Concept & Analogy */}
                  <div className="lg:col-span-7 space-y-5">
                    {/* The "Simple Analogy" Box */}
                    <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-amber-950/30 via-neutral-900/60 to-neutral-900 border border-amber-500/30 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Simple Analogy for Beginners</span>
                      </div>
                      <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed italic">
                        "{currentSlide.analogy}"
                      </p>
                    </div>

                    {/* Main Concept Explanation */}
                    <div className="p-4 sm:p-5 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-2">
                      <div className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
                        HOW IT WORKS IN REAL LIFE
                      </div>
                      <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                        {currentSlide.mainConcept}
                      </p>
                    </div>

                    {/* 3 Key Takeaways */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {currentSlide.keyPoints.map((pt, pIdx) => {
                        const Icon = pt.icon;
                        return (
                          <div
                            key={pIdx}
                            className="p-3.5 rounded-lg bg-neutral-950/80 border border-neutral-800 space-y-1.5"
                          >
                            <div className="flex items-center gap-2 text-emerald-400">
                              <Icon className="w-4 h-4" />
                              <span className="text-xs font-mono font-bold">{pt.title}</span>
                            </div>
                            <p className="text-[11px] text-neutral-400 leading-relaxed">{pt.desc}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right 5 Columns: Interactive Visual Diagram Card */}
                  <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                    {/* Visual Stage Card */}
                    <div className="p-5 rounded-xl bg-neutral-950 border border-neutral-800 relative overflow-hidden flex flex-col justify-center min-h-[220px]">
                      {/* Background grid accent */}
                      <div className="absolute inset-0 bg-tech-grid opacity-10 pointer-events-none" />

                      {/* Visual rendering based on slide theme */}
                      {currentSlide.visualType === 'overview' && (
                        <div className="relative z-10 text-center space-y-3">
                          <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-center p-2 mx-auto shadow-lg shadow-amber-500/10">
                            <SunStrideLogo size={52} darkTheme />
                          </div>
                          <div className="text-xs font-mono font-bold text-amber-400">
                            HYBRID ECO-TRANSIT CORRIDOR
                          </div>
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-700/50 text-[10px] font-mono text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>100% OFF-GRID & AUTONOMOUS</span>
                          </div>
                        </div>
                      )}

                      {currentSlide.visualType === 'problem' && (
                        <div className="relative z-10 space-y-3">
                          <div className="p-3 rounded bg-rose-950/40 border border-rose-800/50 flex items-center gap-3">
                            <X className="w-5 h-5 text-rose-400 shrink-0" />
                            <span className="text-xs text-neutral-300 font-mono">No Bus Arrival Info Available</span>
                          </div>
                          <div className="p-3 rounded bg-rose-950/40 border border-rose-800/50 flex items-center gap-3">
                            <X className="w-5 h-5 text-rose-400 shrink-0" />
                            <span className="text-xs text-neutral-300 font-mono">Huge Electricity Bills for Cities</span>
                          </div>
                          <div className="p-3 rounded bg-emerald-950/50 border border-emerald-700/50 flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                            <span className="text-xs text-emerald-300 font-mono">SunStride Fixes Both at Once!</span>
                          </div>
                        </div>
                      )}

                      {currentSlide.visualType === 'solar' && (
                        <div className="relative z-10 text-center space-y-3">
                          <div className="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400 animate-pulse">
                            <Sun className="w-8 h-8" />
                          </div>
                          <div className="text-xs font-mono font-bold text-amber-400">
                            PHOTOVOLTAIC HARVESTING ENGINE
                          </div>
                          <div className="p-2.5 rounded bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-neutral-300">
                            Daylight Influx ➔ MPPT Booster ➔ Battery
                          </div>
                        </div>
                      )}

                      {currentSlide.visualType === 'piezo' && (
                        <div className="relative z-10 text-center space-y-3">
                          <div className="w-14 h-14 rounded-full bg-sky-500/20 border border-sky-500/40 flex items-center justify-center mx-auto text-sky-400 animate-bounce">
                            <Footprints className="w-7 h-7" />
                          </div>
                          <div className="text-xs font-mono font-bold text-sky-400">
                            PIEZOELECTRIC TRANSDUCER ARRAY
                          </div>
                          <div className="p-2.5 rounded bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-neutral-300">
                            Foot Pressure ➔ PZT Crystal ➔ Power Spike
                          </div>
                        </div>
                      )}

                      {currentSlide.visualType === 'hybrid' && (
                        <div className="relative z-10 space-y-3 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <span className="text-xs font-mono px-2 py-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              SOLAR
                            </span>
                            <span className="text-neutral-500 font-bold">+</span>
                            <span className="text-xs font-mono px-2 py-1 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                              PIEZO
                            </span>
                          </div>
                          <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/40 flex items-center justify-center mx-auto text-violet-400">
                            <Zap className="w-5 h-5" />
                          </div>
                          <div className="text-xs font-mono font-bold text-violet-400">
                            INTELLIGENT DUAL RECTIFIER (PMU)
                          </div>
                        </div>
                      )}

                      {currentSlide.visualType === 'rfid' && (
                        <div className="relative z-10 text-center space-y-3">
                          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 animate-pulse">
                            <Radio className="w-7 h-7" />
                          </div>
                          <div className="text-xs font-mono font-bold text-emerald-400">
                            UHF PASSIVE RFID INTERROGATOR
                          </div>
                          <div className="p-2.5 rounded bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-neutral-300">
                            Bus Approaches ➔ &lt;15ms Read ➔ UID Verified
                          </div>
                        </div>
                      )}

                      {currentSlide.visualType === 'display' && (
                        <div className="relative z-10 p-3 rounded-lg bg-neutral-900 border border-neutral-700 text-left space-y-2 font-mono">
                          <div className="flex justify-between items-center text-[10px] text-emerald-400 border-b border-neutral-800 pb-1">
                            <span>STATION PASSENGER SCREEN</span>
                            <span className="animate-pulse">● LIVE</span>
                          </div>
                          <div className="text-xs font-bold text-white">ROUTE 402B → CENTRAL TERMINAL</div>
                          <div className="text-[11px] text-amber-400">ARRIVING NOW (PLATFORM 1)</div>
                          <div className="text-[10px] text-neutral-400">NEXT: ROUTE 108 IN 12 MIN</div>
                        </div>
                      )}

                      {currentSlide.visualType === 'rugged' && (
                        <div className="relative z-10 text-center space-y-3">
                          <div className="w-12 h-12 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center mx-auto text-sky-400">
                            <Shield className="w-6 h-6" />
                          </div>
                          <div className="text-xs font-mono font-bold text-sky-300">
                            RUGGED WEATHERPROOF ARCHITECTURE
                          </div>
                          <div className="text-[11px] font-mono text-neutral-400">
                            IP65 Sealed · Anti-Vandal · 50°C Certified
                          </div>
                        </div>
                      )}

                      {currentSlide.visualType === 'impact' && (
                        <div className="relative z-10 space-y-2">
                          <div className="p-2 rounded bg-emerald-950/60 border border-emerald-700/60 text-xs font-mono text-emerald-300 flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            <span>100% Zero-Carbon Microgrid</span>
                          </div>
                          <div className="p-2 rounded bg-amber-950/60 border border-amber-700/60 text-xs font-mono text-amber-300 flex items-center gap-2">
                            <Award className="w-4 h-4" />
                            <span>Affordable Civic Transit Access</span>
                          </div>
                        </div>
                      )}

                      {currentSlide.visualType === 'future' && (
                        <div className="relative z-10 text-center space-y-3">
                          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400">
                            <Sparkles className="w-7 h-7" />
                          </div>
                          <div className="text-xs font-mono font-bold text-white">
                            READY TO TEST IT YOURSELF?
                          </div>
                          <p className="text-[11px] text-neutral-400">
                            Step into the 3D Interactive Lab or review the official engineering whitepapers!
                          </p>
                        </div>
                      )}
                    </div>

                    {/* "Did You Know" Scientific Fact */}
                    <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-400 uppercase">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Did You Know?</span>
                      </div>
                      <p className="text-xs text-neutral-300 leading-relaxed">
                        {currentSlide.didYouKnow}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* BOTTOM BAR: Navigation & Step Dots */}
          <div className="px-5 py-4 border-t border-neutral-800 bg-neutral-950/90 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Step Selector Dots */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1">
              {TOUR_SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => handleGoToSlide(idx)}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    idx === currentSlideIndex
                      ? 'w-7 bg-amber-400'
                      : idx < currentSlideIndex
                      ? 'w-2.5 bg-emerald-500/80 hover:bg-emerald-400'
                      : 'w-2.5 bg-neutral-700 hover:bg-neutral-500'
                  }`}
                  title={`Go to Slide ${s.id}: ${s.title}`}
                />
              ))}
              <span className="text-[10px] font-mono text-neutral-400 ml-2">
                {currentSlideIndex + 1}/{TOUR_SLIDES.length}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              {/* Previous Slide Button */}
              <button
                onClick={handlePrev}
                disabled={currentSlideIndex === 0}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-mono text-xs font-semibold transition-all ${
                  currentSlideIndex === 0
                    ? 'opacity-40 bg-neutral-900 text-neutral-600 cursor-not-allowed border border-neutral-800'
                    : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white cursor-pointer border border-neutral-700'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>PREV</span>
              </button>

              {/* Next or Finish Button */}
              {currentSlideIndex < TOUR_SLIDES.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 font-mono text-xs font-bold transition-all cursor-pointer shadow-md shadow-amber-500/10 group"
                >
                  <span>NEXT SLIDE</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  {onNavigateToLab && (
                    <button
                      onClick={() => {
                        onClose();
                        onNavigateToLab();
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-mono text-xs font-bold transition-all cursor-pointer shadow-md shadow-emerald-500/20"
                    >
                      <span>ENTER LAB</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-mono text-xs font-semibold transition-all cursor-pointer"
                  >
                    <span>CLOSE TOUR</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
