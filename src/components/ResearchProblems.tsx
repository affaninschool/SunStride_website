import React, { useState } from 'react';
import { PageTab } from '../types';
import { RESEARCH_PROBLEMS } from '../data/projectData';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Radio, 
  Sun, 
  WifiOff, 
  Bus, 
  Smartphone, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  SlidersHorizontal, 
  Table, 
  LayoutGrid, 
  ShieldAlert, 
  Cpu, 
  Zap, 
  Compass, 
  Info,
  ExternalLink,
  ChevronRight,
  Activity,
  Footprints
} from 'lucide-react';

interface ResearchProblemsProps {
  onSelectTab?: (tab: PageTab) => void;
}

export const ResearchProblems: React.FC<ResearchProblemsProps> = ({ onSelectTab }) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'telematics' | 'energy' | 'connectivity' | 'identification'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'inspector' | 'matrix'>('grid');
  const [activeProblemId, setActiveProblemId] = useState<string>('problem-1');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const getProblemIcon = (category: string, id: string) => {
    switch (id) {
      case 'problem-1':
        return Radio;
      case 'problem-2':
        return Zap;
      case 'problem-3':
        return WifiOff;
      case 'problem-4':
        return Bus;
      case 'problem-5':
        return Smartphone;
      case 'problem-6':
        return Sun;
      default:
        return Layers;
    }
  };

  const filteredProblems = selectedFilter === 'all' 
    ? RESEARCH_PROBLEMS 
    : RESEARCH_PROBLEMS.filter(p => p.category === selectedFilter);

  const activeProblem = RESEARCH_PROBLEMS.find(p => p.id === activeProblemId) || RESEARCH_PROBLEMS[0];
  const ActiveIcon = getProblemIcon(activeProblem.category, activeProblem.id);

  return (
    <section className="py-20 bg-[#F4F5F7] border-b border-[#E2E4E8] relative overflow-hidden">
      {/* Blueprint grid subtle decoration */}
      <div className="absolute inset-0 bg-tech-grid opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#E2E4E8] text-[11px] font-mono font-bold uppercase tracking-wider text-[#1A1A1A]">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>RESEARCH FORMULATION // SECTION 02</span>
              <span className="text-neutral-400">·</span>
              <span className="text-emerald-700">6 EMPIRICAL DEFICITS IDENTIFIED</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display tracking-tight text-[#1A1A1A]">
              REAL-WORLD TRANSIT PROBLEMS &amp; SUNSTRIDE COUNTERMEASURES
            </h2>
            
            <p className="text-base text-[#4B5563] leading-relaxed">
              Every feature of SunStride was engineered to dismantle a specific structural failure in municipal and rural transit stops. Here is the rigorous formulation of the six core problems and their dedicated hardware-software solutions.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-[#E2E4E8] shadow-xs self-start md:self-auto shrink-0 font-mono text-xs">
            <div className="px-3 py-1.5 bg-[#F4F5F7] rounded border border-[#E2E4E8]">
              <span className="text-[10px] text-[#6B7280] block font-semibold uppercase">TOTAL AUDITED</span>
              <span className="text-sm font-bold text-[#1A1A1A]">6 Problems</span>
            </div>
            <div className="px-3 py-1.5 bg-emerald-50 rounded border border-emerald-200 text-emerald-800">
              <span className="text-[10px] text-emerald-600 block font-semibold uppercase">INTERVENTIONS</span>
              <span className="text-sm font-bold text-emerald-700">6 Solutions</span>
            </div>
          </div>
        </div>

        {/* Interactive Control Ribbon: Filter Pills & View Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#E2E4E8]">
          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#6B7280] uppercase tracking-wider mr-1 hidden sm:inline">
              DOMAIN FILTER:
            </span>
            {[
              { id: 'all', label: 'All Problems (6)' },
              { id: 'telematics', label: 'Commuter Telematics (2)' },
              { id: 'energy', label: 'Renewable Power (2)' },
              { id: 'connectivity', label: 'Rural Connectivity (1)' },
              { id: 'identification', label: 'Fleet Identification (1)' },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  selectedFilter === filter.id
                    ? 'bg-[#1A1A1A] text-white shadow-xs'
                    : 'bg-white text-[#4B5563] border border-[#E2E4E8] hover:bg-[#ECEEF2]'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-[#E2E4E8] self-start sm:self-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1.5 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#1A1A1A] text-white'
                  : 'text-[#6B7280] hover:text-[#1A1A1A]'
              }`}
              title="Dual Problem-Solution Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid View</span>
            </button>
            <button
              onClick={() => setViewMode('inspector')}
              className={`px-2.5 py-1.5 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'inspector'
                  ? 'bg-[#1A1A1A] text-white'
                  : 'text-[#6B7280] hover:text-[#1A1A1A]'
              }`}
              title="Interactive Deep Dive Inspector"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Deep Inspector</span>
            </button>
            <button
              onClick={() => setViewMode('matrix')}
              className={`px-2.5 py-1.5 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'matrix'
                  ? 'bg-[#1A1A1A] text-white'
                  : 'text-[#6B7280] hover:text-[#1A1A1A]'
              }`}
              title="Comparative Engineering Matrix Table"
            >
              <Table className="w-3.5 h-3.5" />
              <span>Matrix Table</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: DUAL BLUEPRINT GRID VIEW                                          */}
        {/* ========================================================================= */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProblems.map((prob) => {
              const Icon = getProblemIcon(prob.category, prob.id);
              const isHovered = hoveredCard === prob.id;

              return (
                <div
                  key={prob.id}
                  id={`research-problem-card-${prob.id}`}
                  onMouseEnter={() => setHoveredCard(prob.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`bg-white rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs relative ${
                    isHovered
                      ? 'border-[#1A1A1A] shadow-md -translate-y-1'
                      : 'border-[#E2E4E8] hover:border-neutral-400'
                  }`}
                >
                  {/* Top Header Banner */}
                  <div className="p-5 sm:p-6 pb-4 border-b border-[#F3F4F6] bg-gradient-to-b from-[#FAFAFA] to-white">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#1A1A1A] text-white">
                          #{prob.number}
                        </span>
                        <span className="font-mono text-[10px] text-[#6B7280] uppercase tracking-wider font-semibold">
                          {prob.code}
                        </span>
                      </div>
                      
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#F4F5F7] text-[#4B5563] border border-[#E2E4E8]">
                        {prob.categoryLabel}
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-[#F4F5F7] text-[#1A1A1A] border border-[#E2E4E8] shrink-0">
                        <Icon className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold font-display text-[#1A1A1A] leading-snug">
                          {prob.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Middle Content: Problem vs Solution Dual Panes */}
                  <div className="p-5 sm:p-6 space-y-4 flex-1">
                    {/* The Core Problem Box */}
                    <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200/80 space-y-2">
                      <div className="flex items-center gap-1.5 text-rose-800 font-mono text-[11px] font-bold uppercase tracking-wider">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span>Core Problem</span>
                      </div>
                      <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed font-sans">
                        {prob.coreProblem}
                      </p>
                    </div>

                    {/* The SunStride Solution Box */}
                    <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
                      <div className="flex items-center gap-1.5 text-emerald-900 font-mono text-[11px] font-bold uppercase tracking-wider">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>SunStride Solution</span>
                      </div>
                      <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed font-sans font-medium">
                        {prob.solution}
                      </p>
                    </div>

                    {/* Scientific / Practical Testing Note (if any) */}
                    {prob.note && (
                      <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-900 space-y-1">
                        <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-amber-800">
                          <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>Scientific Specification &amp; Qualification</span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-amber-900/90 leading-relaxed font-mono">
                          {prob.note}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Footer: Hardware Blueprint & Action */}
                  <div className="px-5 sm:px-6 py-4 bg-[#F8F9FA] border-t border-[#E2E4E8] flex items-center justify-between gap-2 font-mono text-xs">
                    <div className="flex items-center gap-1 text-[11px] text-[#6B7280] truncate max-w-[180px]">
                      <Cpu className="w-3.5 h-3.5 shrink-0 text-neutral-500" />
                      <span className="truncate">{prob.hardwareStack[0]}</span>
                    </div>

                    <button
                      onClick={() => {
                        setActiveProblemId(prob.id);
                        setViewMode('inspector');
                      }}
                      className="inline-flex items-center gap-1 text-emerald-700 font-bold hover:text-emerald-800 transition-colors cursor-pointer text-xs"
                    >
                      <span>Deep Dive</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: INTERACTIVE DEEP DIVE INSPECTOR                                   */}
        {/* ========================================================================= */}
        {viewMode === 'inspector' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Problem Switcher List */}
            <div className="lg:col-span-4 space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#6B7280] block mb-2 px-1">
                SELECT A TRANSIT DEFICIT:
              </span>
              {RESEARCH_PROBLEMS.map((prob) => {
                const isSelected = activeProblemId === prob.id;
                const Icon = getProblemIcon(prob.category, prob.id);

                return (
                  <button
                    key={prob.id}
                    onClick={() => setActiveProblemId(prob.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-sm'
                        : 'bg-white text-[#374151] border-[#E2E4E8] hover:bg-[#ECEEF2]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                        isSelected ? 'bg-neutral-800 text-emerald-400' : 'bg-[#F4F5F7] text-[#1A1A1A]'
                      }`}>
                        {prob.number}
                      </div>
                      <div>
                        <h4 className="text-xs font-mono font-bold line-clamp-1">{prob.title}</h4>
                        <span className={`text-[10px] font-mono ${isSelected ? 'text-neutral-400' : 'text-[#6B7280]'}`}>
                          {prob.code} · {prob.categoryLabel}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-emerald-400' : 'text-[#9CA3AF]'}`} />
                  </button>
                );
              })}
            </div>

            {/* Right Detailed Engineering Canvas */}
            <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E4E8] shadow-xs space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#F3F4F6] pb-5">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded bg-[#1A1A1A] text-white font-mono text-xs font-bold">
                      PROBLEM #{activeProblem.number}
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono text-xs font-bold border border-emerald-200">
                      {activeProblem.code}
                    </span>
                    <span className="text-xs font-mono text-[#6B7280]">
                      {activeProblem.categoryLabel}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold font-display text-[#1A1A1A]">
                    {activeProblem.title}
                  </h3>
                </div>

                <div className="p-3 rounded-xl bg-[#F4F5F7] border border-[#E2E4E8] self-start sm:self-auto">
                  <ActiveIcon className="w-7 h-7 text-emerald-600" />
                </div>
              </div>

              {/* Side-by-side or stacked problem vs solution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Deficit Column */}
                <div className="p-5 rounded-xl bg-rose-50/60 border border-rose-200 space-y-3">
                  <div className="flex items-center gap-2 text-rose-800 font-mono text-xs font-bold uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>The Core Problem &amp; Real Deficit</span>
                  </div>
                  <p className="text-sm text-neutral-900 leading-relaxed font-sans">
                    {activeProblem.coreProblem}
                  </p>
                  <div className="pt-2 border-t border-rose-200/60">
                    <span className="text-[10px] font-mono text-rose-700 font-bold block uppercase mb-1">
                      Consequences of Status Quo:
                    </span>
                    <p className="text-xs text-neutral-700 leading-normal">
                      {activeProblem.statusQuoDeficit}
                    </p>
                  </div>
                </div>

                {/* Solution Column */}
                <div className="p-5 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-900 font-mono text-xs font-bold uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>SunStride Engineering Solution</span>
                  </div>
                  <p className="text-sm text-neutral-900 leading-relaxed font-sans font-medium">
                    {activeProblem.solution}
                  </p>
                  <div className="pt-2 border-t border-emerald-200/60">
                    <span className="text-[10px] font-mono text-emerald-800 font-bold block uppercase mb-1">
                      Direct Operational Advantage:
                    </span>
                    <p className="text-xs text-neutral-700 leading-normal">
                      {activeProblem.sunstrideAdvantage}
                    </p>
                  </div>
                </div>
              </div>

              {/* Special Note / Qualification Banner (e.g. for Problem 4 or Problem 6) */}
              {activeProblem.note && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h5 className="font-mono text-xs font-bold text-amber-900 uppercase tracking-wide">
                      Academic &amp; Prototyping Qualification Notice:
                    </h5>
                    <p className="font-mono text-xs text-amber-800 leading-relaxed">
                      {activeProblem.note}
                    </p>
                  </div>
                </div>
              )}

              {/* Technical Mechanism & Signal Flow Schema */}
              <div className="p-5 rounded-xl bg-[#F8F9FA] border border-[#E2E4E8] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#1A1A1A] uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-emerald-600" />
                    TECHNICAL INTERVENTION MECHANISM
                  </span>
                  <span className="text-[10px] font-mono text-[#6B7280]">
                    STAGE: {activeProblem.impactMetrics?.stage}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-mono text-[#374151] leading-relaxed">
                  {activeProblem.technicalMechanism}
                </p>

                {/* Hardware Stack Chips */}
                <div className="pt-3 border-t border-[#E2E4E8]">
                  <span className="text-[10px] font-mono font-bold text-[#6B7280] uppercase tracking-wider block mb-2">
                    HARDWARE / EMBEDDED SYSTEM STACK:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeProblem.hardwareStack.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md bg-white border border-[#E2E4E8] font-mono text-xs text-[#1A1A1A] shadow-2xs"
                      >
                        ⚡ {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Interactive Action Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <span className="text-xs font-mono text-[#6B7280]">
                  Intervention Feasibility: <strong className="text-[#1A1A1A]">{activeProblem.impactMetrics?.feasibility}</strong>
                </span>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {onSelectTab && (
                    <button
                      onClick={() => onSelectTab('lab')}
                      className="flex-1 sm:flex-initial px-4 py-2 bg-[#1A1A1A] text-white rounded-lg text-xs font-mono font-bold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Simulate in Interactive Lab</span>
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                    </button>
                  )}
                  {onSelectTab && (
                    <button
                      onClick={() => onSelectTab('system')}
                      className="flex-1 sm:flex-initial px-4 py-2 bg-white border border-[#E2E4E8] text-[#1A1A1A] rounded-lg text-xs font-mono font-bold hover:bg-[#F4F5F7] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>View Hardware CAD</span>
                      <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: COMPARATIVE ENGINEERING MATRIX TABLE                              */}
        {/* ========================================================================= */}
        {viewMode === 'matrix' && (
          <div className="bg-white rounded-2xl border border-[#E2E4E8] shadow-xs overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-[#F3F4F6] bg-[#FAFAFA] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-emerald-600 font-bold uppercase tracking-wider">
                  SCIENTIFIC COMPARISON // STATUS QUO VS. SUNSTRIDE
                </span>
                <h3 className="text-xl font-bold font-display text-[#1A1A1A] mt-0.5">
                  Full 6-Problem Architectural Matrix
                </h3>
              </div>
              <span className="text-xs font-mono text-[#6B7280]">
                All 6 items verified against ATL experimental prototype
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-[#E2E4E8] text-[#6B7280] bg-[#F4F5F7]">
                    <th className="py-3 px-4 font-bold"># ID</th>
                    <th className="py-3 px-4 font-bold">PROBLEM TITLE</th>
                    <th className="py-3 px-4 font-bold">CORE DEFICIT (STATUS QUO)</th>
                    <th className="py-3 px-4 font-bold">SUNSTRIDE SOLUTION</th>
                    <th className="py-3 px-4 font-bold">KEY QUALIFICATION / MECHANISM</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3F4F6] text-[#374151]">
                  {RESEARCH_PROBLEMS.map((prob) => (
                    <tr key={prob.id} className="hover:bg-[#F9FAFB] transition-colors">
                      <td className="py-4 px-4 font-bold text-[#1A1A1A]">
                        <span className="px-2 py-0.5 bg-[#E2E4E8] rounded text-[11px]">
                          {prob.number}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-bold text-[#1A1A1A] min-w-[200px]">
                        <div>{prob.title}</div>
                        <span className="text-[10px] text-[#6B7280] font-normal">{prob.categoryLabel}</span>
                      </td>
                      <td className="py-4 px-4 text-rose-950 bg-rose-50/30 max-w-xs font-sans text-xs">
                        {prob.coreProblem}
                      </td>
                      <td className="py-4 px-4 text-emerald-950 bg-emerald-50/30 max-w-xs font-sans text-xs font-medium">
                        {prob.solution}
                      </td>
                      <td className="py-4 px-4 text-neutral-600 max-w-xs text-[11px]">
                        {prob.note ? (
                          <span className="text-amber-800 font-semibold bg-amber-50 px-2 py-1 rounded block">
                            ⚠ {prob.note}
                          </span>
                        ) : (
                          prob.technicalMechanism
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-[#F8F9FA] border-t border-[#E2E4E8] text-xs font-mono text-[#6B7280] flex flex-col sm:flex-row items-center justify-between gap-3">
              <span>SunStride Atal Tinkering Lab Project (PM Shri Jawahar Navodaya Vidyalaya)</span>
              <button
                onClick={() => setViewMode('grid')}
                className="text-emerald-700 font-bold hover:underline cursor-pointer"
              >
                Switch to Card Grid View ↑
              </button>
            </div>
          </div>
        )}

        {/* Artistic Interactive Transit Signal Architecture Diagram */}
        <div className="mt-12 p-6 sm:p-8 bg-[#14171C] text-white rounded-2xl border border-neutral-800 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-tech-grid-dark opacity-30 pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  SYSTEM SIGNAL ARCHITECTURE // PROBLEM-TO-SOLUTION TOPOLOGY
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-white mt-1">
                  How SunStride Intercepts Transit Deficits Offline
                </h3>
              </div>
              <span className="text-xs font-mono text-neutral-400">
                0% Cellular Dependency · 100% Edge Autonomous
              </span>
            </div>

            {/* 4-Stage Visual Workflow Pipeline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-rose-400">STAGE 01</span>
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                </div>
                <h4 className="text-sm font-bold text-white font-display">Commuter Enters Stop</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Solves <strong>#01</strong>, <strong>#03</strong> &amp; <strong>#05</strong>: Commuter connects to the local "SunStride-Station" Wi-Fi portal without internet or cellular plan.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-400">STAGE 02</span>
                  <Zap className="w-4 h-4 text-amber-400" />
                </div>
                <h4 className="text-sm font-bold text-white font-display">Self-Powered Logic</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Solves <strong>#02</strong> &amp; <strong>#06</strong>: Rooftop solar canopy and experimental floor piezo tiles buffer power to Lithium storage, operating off-grid.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-sky-400">STAGE 03</span>
                  <Radio className="w-4 h-4 text-sky-400" />
                </div>
                <h4 className="text-sm font-bold text-white font-display">RFID Interrogation</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Solves <strong>#04</strong>: Approaching bus tag triggers the RC522 antenna at 13.56 MHz, validating the bus identifier instantly.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-400">STAGE 04</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <h4 className="text-sm font-bold text-white font-display">Instant Dashboard Update</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Solves <strong>#01</strong>: Local web server serves arrival update to passenger phones &amp; station OLED display in &lt; 100 ms.
                </p>
              </div>
            </div>

            {/* Bottom Callout */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>All 6 problem-solution mappings validated in benchtop hardware trials.</span>
              </div>
              {onSelectTab && (
                <button
                  onClick={() => onSelectTab('lab')}
                  className="text-emerald-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Launch Simulation in Interactive Lab</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
