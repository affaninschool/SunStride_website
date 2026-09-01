import React, { useState } from 'react';
import { PageTab, TeamMember } from '../types';
import { TEAM_MEMBERS } from '../data/projectData';
import {
  Users,
  Award,
  Sparkles,
  ExternalLink,
  GraduationCap,
  HeartHandshake,
  CheckCircle2,
  Building2,
  Cpu,
  Sun,
  Footprints,
  Radio,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { SunStrideLogo } from '../components/SunStrideLogo';

interface TeamViewProps {
  onSelectTab: (tab: PageTab) => void;
}

export const TeamView: React.FC<TeamViewProps> = ({ onSelectTab }) => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const affan = TEAM_MEMBERS.find((m) => m.id === 'affan-adil') || TEAM_MEMBERS[0];
  const mrinmoy = TEAM_MEMBERS.find((m) => m.id === 'mrinmoy-chowhan') || TEAM_MEMBERS[1];

  return (
    <div className="w-full bg-[#F4F5F7] text-[#1A1A1A]">
      {/* 1. HERO BANNER */}
      <section className="border-b border-[#E2E4E8] bg-tech-grid pt-14 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#E2E4E8] text-[11px] font-mono font-bold uppercase tracking-wider text-[#374151] border border-[#DCDFE4]">
              <Award className="w-4 h-4 text-amber-600" />
              <span>PROJECT CREDITS & MENTORSHIP</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-[#1A1A1A]">
              THE MINDS BEHIND SUNSTRIDE
            </h1>
            <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed">
              Conceived and engineered by a young student innovator from Class VIII, developed in the Atal Tinkering Lab with dedicated mentor guidance.
            </p>
          </div>
        </div>
      </section>

      {/* 2. INSTITUTIONAL ACCREDITATION BAR */}
      <section className="bg-white border-b border-[#E2E4E8] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#F8F9FB] border border-[#E2E4E8]">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#1A1A1A] text-white flex items-center justify-center p-2 shadow-xs shrink-0">
                <Building2 className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase tracking-wider block">
                  INCUBATED AT
                </span>
                <h3 className="font-display font-bold text-base text-[#1A1A1A]">
                  PM Shri Jawahar Navodaya Vidyalaya
                </h3>
                <p className="text-xs font-mono text-[#6B7280]">
                  Atal Tinkering Lab (ATL) · Atal Innovation Mission (NITI Aayog)
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#4B5563]">
              <span className="px-3 py-1 rounded bg-white border border-[#E2E4E8] font-semibold text-[#1A1A1A]">
                Class VIII Student Innovation
              </span>
              <span className="px-3 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">
                100% Student-Led Prototype
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRIMARY CARDS: AFFAN ADIL & MRINMOY CHOWHAN */}
      <section className="py-16 border-b border-[#E2E4E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* PRIMARY INNOVATOR CARD: AFFAN ADIL */}
          <div className="bg-white rounded-2xl border-2 border-[#1A1A1A] p-6 sm:p-10 shadow-md relative overflow-hidden space-y-8">
            {/* Background watermarked emblem */}
            <div className="absolute right-4 -bottom-6 opacity-5 pointer-events-none hidden sm:block">
              <SunStrideLogo size={260} />
            </div>

            {/* Header: Title & Badges */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#E2E4E8] pb-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#1A1A1A] text-white flex items-center justify-center font-display font-bold text-2xl sm:text-3xl shadow-sm shrink-0 border border-neutral-700">
                  AA
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-100 border border-amber-300 text-[11px] font-mono font-bold text-amber-900 uppercase mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    <span>SOLE PROJECT CREATOR & INNOVATOR</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-bold font-display text-[#1A1A1A]">
                    Affan Adil
                  </h2>
                  <p className="text-sm font-mono font-bold text-emerald-700 mt-1">
                    Student · Class VIII · PM Shri Jawahar Navodaya Vidyalaya
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:items-end gap-1 font-mono text-xs text-[#6B7280]">
                <span className="px-3 py-1 rounded bg-[#1A1A1A] text-white font-bold text-[11px]">
                  ALL INVENTIVE CREDITS
                </span>
                <span className="text-[11px]">Sole Concept & System Design</span>
              </div>
            </div>

            {/* Bio & Project Scope */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-5">
                <div>
                  <h4 className="font-mono text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-2">
                    BIOGRAPHICAL CONTEXT & INVENTIVE VISION
                  </h4>
                  <p className="text-sm sm:text-base text-[#374151] leading-relaxed">
                    Affan Adil is a Class VIII student at PM Shri Jawahar Navodaya Vidyalaya. Driven by the vision of making civic public transport smarter and completely green, Affan conceptualized and engineered the <strong>SunStride Smart Transit Shelter</strong> in the school’s Atal Tinkering Lab.
                  </p>
                </div>

                <div>
                  <h4 className="font-mono text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-2">
                    CORE SCIENTIFIC & ENGINEERING CONTRIBUTIONS
                  </h4>
                  <p className="text-sm text-[#4B5563] leading-relaxed">
                    {affan.contribution}
                  </p>
                </div>

                {/* 3 Pillars Designed by Affan */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 rounded-lg bg-[#F8F9FB] border border-[#E2E4E8] space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-700 font-mono text-xs font-bold">
                      <Sun className="w-4 h-4" />
                      <span>Solar MPPT Canopy</span>
                    </div>
                    <p className="text-[11px] text-[#6B7280]">
                      Designed high-efficiency daylight harvesting with zero grid wiring.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#F8F9FB] border border-[#E2E4E8] space-y-1">
                    <div className="flex items-center gap-1.5 text-sky-700 font-mono text-xs font-bold">
                      <Footprints className="w-4 h-4" />
                      <span>Piezo Floor Array</span>
                    </div>
                    <p className="text-[11px] text-[#6B7280]">
                      Engineered kinetic step transducers to capture energy during rush hours.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#F8F9FB] border border-[#E2E4E8] space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-700 font-mono text-xs font-bold">
                      <Radio className="w-4 h-4" />
                      <span>Passive RFID Bus Sensing</span>
                    </div>
                    <p className="text-[11px] text-[#6B7280]">
                      Created sub-15ms vehicle tracking without needing internet or GPS.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Key Focus Areas & Tools */}
              <div className="lg:col-span-4 bg-[#F8F9FB] p-5 rounded-xl border border-[#E2E4E8] space-y-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <h5 className="text-xs font-mono font-bold text-[#1A1A1A] uppercase mb-1.5">
                      AREAS OF FOCUS
                    </h5>
                    <p className="text-xs font-mono text-[#4B5563] leading-relaxed">
                      {affan.areaOfFocus}
                    </p>
                  </div>

                  <div>
                    <h5 className="text-xs font-mono font-bold text-[#1A1A1A] uppercase mb-2">
                      TOOLS & DISCIPLINES
                    </h5>
                    <div className="flex flex-wrap gap-1.5 font-mono">
                      {affan.toolsUsed.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-white border border-[#DCDFE4] text-[#374151] text-[10px] font-semibold"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Sole inventor and primary creator of all project modules.</span>
                </div>
              </div>
            </div>
          </div>


          {/* PROJECT MENTOR & HELPER CARD: MRINMOY CHOWHAN */}
          <div className="bg-white rounded-2xl border border-[#E2E4E8] p-6 sm:p-10 shadow-sm relative space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#E2E4E8] pb-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-neutral-900 text-amber-400 flex items-center justify-center font-display font-bold text-2xl sm:text-3xl shadow-sm shrink-0 border border-neutral-700">
                  MC
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-sky-100 border border-sky-300 text-[11px] font-mono font-bold text-sky-900 uppercase mb-1">
                    <HeartHandshake className="w-3.5 h-3.5 text-sky-700" />
                    <span>PROJECT MENTOR & HELPER</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#1A1A1A]">
                    Mrinmoy Chowhan
                  </h2>
                  <p className="text-sm font-mono font-bold text-[#4B5563] mt-1">
                    ATL Lab Mentor · Engineering Guide · PM Shri JNV
                  </p>
                </div>
              </div>

              {/* Prominent Portfolio Link */}
              <a
                id="mentor-portfolio-link"
                href="https://mrinmoychowhan.lovable.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#1A1A1A] hover:bg-neutral-800 text-white font-mono font-bold text-xs px-5 py-3 rounded-lg transition-all shadow-xs group border border-neutral-700 cursor-pointer"
              >
                <span>VISIT MRINMOY'S PORTFOLIO</span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>

            {/* Mentor Details */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-4">
                <div>
                  <h4 className="font-mono text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-2">
                    MENTORSHIP & GUIDANCE ROLE
                  </h4>
                  <p className="text-sm sm:text-base text-[#374151] leading-relaxed">
                    {mrinmoy.bio}
                  </p>
                </div>

                <div>
                  <h4 className="font-mono text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-2">
                    SUPPORT & TECHNICAL ADVISING
                  </h4>
                  <p className="text-sm text-[#4B5563] leading-relaxed">
                    {mrinmoy.contribution}
                  </p>
                </div>

                <div className="pt-2">
                  <a
                    href="https://mrinmoychowhan.lovable.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
                  >
                    <span>View full developer & mentor portfolio at mrinmoychowhan.lovable.app →</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Tools & Mentorship Scope */}
              <div className="lg:col-span-4 bg-[#F8F9FB] p-5 rounded-xl border border-[#E2E4E8] space-y-4">
                <div>
                  <h5 className="text-xs font-mono font-bold text-[#1A1A1A] uppercase mb-1.5">
                    MENTORSHIP EXPERTISE
                  </h5>
                  <p className="text-xs font-mono text-[#4B5563] leading-relaxed">
                    {mrinmoy.areaOfFocus}
                  </p>
                </div>

                <div>
                  <h5 className="text-xs font-mono font-bold text-[#1A1A1A] uppercase mb-2">
                    METHODOLOGIES & LAB TOOLS
                  </h5>
                  <div className="flex flex-wrap gap-1.5 font-mono">
                    {mrinmoy.toolsUsed.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-white border border-[#DCDFE4] text-[#374151] text-[10px] font-semibold"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="https://mrinmoychowhan.lovable.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 rounded bg-white hover:bg-neutral-50 border border-[#DCDFE4] text-xs font-mono font-semibold text-[#1A1A1A] flex items-center justify-between group transition-colors"
                  >
                    <span>Open Portfolio</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#6B7280] group-hover:text-[#1A1A1A]" />
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. ATAL TINKERING LAB ECOSYSTEM */}
      <section className="py-16 bg-white border-b border-[#E2E4E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-mono font-bold text-emerald-700 uppercase">
              THE LAB & THE VISION
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#1A1A1A]">
              NURTURING GRASSROOTS CIVIC INNOVATION
            </h2>
            <p className="text-sm text-[#4B5563] leading-relaxed">
              How PM Shri Jawahar Navodaya Vidyalaya’s Atal Tinkering Lab enables students to solve real community challenges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-[#F8F9FB] border border-[#E2E4E8] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#1A1A1A] text-white flex items-center justify-center font-mono text-sm font-bold">
                01
              </div>
              <h4 className="font-bold font-display text-base text-[#1A1A1A]">Hands-On Experimentation</h4>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                Students test electronic sensors, microcontrollers, and renewable energy modules directly with physical breadboards and oscilloscopes.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#F8F9FB] border border-[#E2E4E8] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#1A1A1A] text-white flex items-center justify-center font-mono text-sm font-bold">
                02
              </div>
              <h4 className="font-bold font-display text-base text-[#1A1A1A]">Community-Centred Problem Solving</h4>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                Rather than theoretical models, projects target everyday civic challenges like rural bus scheduling and clean off-grid power.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#F8F9FB] border border-[#E2E4E8] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#1A1A1A] text-white flex items-center justify-center font-mono text-sm font-bold">
                03
              </div>
              <h4 className="font-bold font-display text-base text-[#1A1A1A]">Dedicated Mentorship</h4>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                ATL mentors provide guidance, safety standards, and engineering methodology to turn raw student concepts into working prototypes.
              </p>
            </div>
          </div>

          {/* Quick CTA to explore documentation or lab */}
          <div className="p-6 rounded-xl bg-[#1A1A1A] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-display font-bold text-lg text-white">
                Explore the Complete Engineering Documentation
              </h4>
              <p className="text-xs font-mono text-neutral-400">
                Detailed research specifications, circuit schematics, and testing logs.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onSelectTab('docs')}
                className="px-4 py-2 rounded bg-white text-[#1A1A1A] font-mono text-xs font-bold hover:bg-neutral-100 transition-colors cursor-pointer flex items-center gap-2"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>READ SPECS</span>
              </button>
              <button
                onClick={() => onSelectTab('lab')}
                className="px-4 py-2 rounded bg-amber-400 text-neutral-950 font-mono text-xs font-bold hover:bg-amber-300 transition-colors cursor-pointer flex items-center gap-2"
              >
                <span>OPEN LAB</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
