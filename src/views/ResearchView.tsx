import React, { useState } from 'react';
import { PageTab, ResearchArea, MethodologyStage } from '../types';
import { RESEARCH_AREAS, METHODOLOGY_STAGES } from '../data/projectData';
import { 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  Radio, 
  Sun, 
  Footprints, 
  Cpu, 
  Users, 
  FileText, 
  ArrowRight,
  FlaskConical,
  Gauge,
  Clock
} from 'lucide-react';

interface ResearchViewProps {
  onSelectTab: (tab: PageTab) => void;
}

export const ResearchView: React.FC<ResearchViewProps> = ({ onSelectTab }) => {
  const [selectedAreaId, setSelectedAreaId] = useState<string>('smart-trans');
  const [expandedStageId, setExpandedStageId] = useState<string>('stage-1');
  const [selectedDataCategory, setSelectedDataCategory] = useState<string>('solar');

  const iconsMap: Record<string, any> = {
    '01': Radio,
    '02': Sun,
    '03': Footprints,
    '04': Cpu,
    '05': Users,
  };

  const dataCategories = [
    { id: 'solar', label: 'Solar Generation', icon: Sun, parameter: 'Photovoltaic Yield vs Ambient Lux' },
    { id: 'piezo', label: 'Piezoelectric Output', icon: Footprints, parameter: 'Compressive Voltage Pulses / Step' },
    { id: 'consumption', label: 'Energy Consumption', icon: Gauge, parameter: 'MCU Active vs Standby Current' },
    { id: 'rfid', label: 'RFID Detection', icon: Radio, parameter: 'Read Success Rate vs Distance' },
    { id: 'response', label: 'System Response', icon: Clock, parameter: 'Vehicle Detect to Display Latency' },
    { id: 'testing', label: 'Testing Results', icon: FlaskConical, parameter: 'Benchtop Prototype Characterization' },
  ];

  return (
    <div className="w-full bg-[#F4F5F7] text-[#1A1A1A]">
      {/* 1. HERO */}
      <section className="border-b border-[#E2E4E8] bg-tech-grid pt-14 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#E2E4E8] text-[10px] font-mono font-bold uppercase tracking-wider text-[#374151]">
              <FlaskConical className="w-3.5 h-3.5 text-emerald-600" />
              <span>ACADEMIC & APPLIED RESEARCH PORTFOLIO</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-[#1A1A1A]">
              RESEARCH & ENGINEERING
            </h1>
            <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed">
              Exploring intelligent, energy-aware public transportation infrastructure through experimentation, prototyping, and system design.
            </p>
          </div>
        </div>
      </section>

      {/* 2. FIVE RESEARCH AREAS */}
      <section className="py-20 border-b border-[#E2E4E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[#6B7280] block mb-1">
              INVESTIGATION TRACKS
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#1A1A1A]">
              FIVE CORE RESEARCH DOMAINS
            </h2>
            <p className="text-sm text-[#4B5563] mt-2">
              SunStride bridges electrical hardware design, telematics, and civil infrastructure across five focused pillars.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Nav List */}
            <div className="lg:col-span-4 space-y-2">
              {RESEARCH_AREAS.map((area) => {
                const isSelected = selectedAreaId === area.id;
                const Icon = iconsMap[area.index] || Layers;
                return (
                  <button
                    key={area.id}
                    id={`research-area-btn-${area.id}`}
                    onClick={() => setSelectedAreaId(area.id)}
                    className={`w-full text-left p-4 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-xs'
                        : 'bg-white text-[#374151] border-[#E2E4E8] hover:bg-[#ECEEF2]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded ${
                        isSelected ? 'bg-neutral-800 text-emerald-400' : 'bg-[#E2E4E8] text-[#4B5563]'
                      }`}>
                        {area.index}
                      </span>
                      <div>
                        <h3 className="text-xs font-mono font-bold block">{area.title}</h3>
                        <span className={`text-[10px] line-clamp-1 ${isSelected ? 'text-neutral-400' : 'text-[#6B7280]'}`}>
                          {area.subtitle}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-emerald-400' : 'text-[#9CA3AF]'}`} />
                  </button>
                );
              })}
            </div>

            {/* Right Detailed Investigation Card */}
            <div className="lg:col-span-8">
              {(() => {
                const area = RESEARCH_AREAS.find((a) => a.id === selectedAreaId) || RESEARCH_AREAS[0];
                const Icon = iconsMap[area.index] || Layers;
                return (
                  <div className="bg-white p-6 sm:p-8 rounded-lg border border-[#E2E4E8] shadow-xs space-y-6">
                    <div className="flex items-start justify-between border-b border-[#F3F4F6] pb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                            RESEARCH DOMAIN // {area.index}
                          </span>
                          <span className="text-xs font-mono text-[#6B7280]">ATL LAB BENCH</span>
                        </div>
                        <h3 className="text-2xl font-bold font-display text-[#1A1A1A]">
                          {area.title}
                        </h3>
                        <p className="text-xs font-mono text-[#4B5563] mt-1">{area.subtitle}</p>
                      </div>
                      <div className="p-3 bg-[#1A1A1A] text-white rounded-lg hidden sm:block">
                        <Icon className="w-6 h-6 text-emerald-400" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-mono font-bold text-[#1A1A1A] uppercase tracking-wider">
                        Domain Abstract & Objective
                      </h4>
                      <p className="text-sm text-[#4B5563] leading-relaxed">
                        {area.description}
                      </p>
                    </div>

                    {/* Focus Points List */}
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-mono font-bold text-[#1A1A1A] uppercase tracking-wider">
                        Technical Focus Areas
                      </h4>
                      <div className="grid grid-cols-1 gap-2.5">
                        {area.focusPoints.map((point, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded bg-[#F4F5F7] border border-[#E2E4E8] text-xs text-[#374151] flex items-start gap-2.5"
                          >
                            <span className="font-mono text-emerald-600 font-bold">0{idx + 1}.</span>
                            <span>{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Key Research Questions & Current Phase */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#F3F4F6] font-mono text-xs">
                      <div className="p-3.5 bg-[#F4F5F7] rounded border border-[#E2E4E8] space-y-1.5">
                        <span className="text-[10px] text-[#6B7280] font-bold block uppercase">
                          CURRENT EXPERIMENTAL PHASE
                        </span>
                        <p className="text-xs text-[#1A1A1A] font-semibold">{area.currentPhase}</p>
                      </div>

                      <div className="p-3.5 bg-[#F4F5F7] rounded border border-[#E2E4E8] space-y-1.5">
                        <span className="text-[10px] text-[#6B7280] font-bold block uppercase">
                          KEY SCIENTIFIC INQUIRY
                        </span>
                        <ul className="text-[11px] text-[#4B5563] space-y-1 list-disc pl-3">
                          {area.keyQuestions.map((q, i) => (
                            <li key={i}>{q}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* 3. RESEARCH METHODOLOGY */}
      <section className="py-20 bg-[#ECEEF2] border-b border-[#E2E4E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[#6B7280] block mb-1">
              ENGINEERING LIFECYCLE
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#1A1A1A]">
              RESEARCH METHODOLOGY TIMELINE
            </h2>
            <p className="text-sm text-[#4B5563] mt-2">
              From formulation to prototype realization and laboratory iteration. Click any stage to inspect the technical deliverables:
            </p>
          </div>

          {/* Sequential Expandable Timeline */}
          <div className="space-y-3">
            {METHODOLOGY_STAGES.map((stage) => {
              const isExpanded = expandedStageId === stage.id;
              return (
                <div
                  key={stage.id}
                  id={`methodology-stage-${stage.id}`}
                  className="bg-white rounded-lg border border-[#E2E4E8] overflow-hidden transition-all shadow-xs"
                >
                  <button
                    onClick={() => setExpandedStageId(isExpanded ? '' : stage.id)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between hover:bg-[#F4F5F7] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-9 h-9 rounded flex items-center justify-center font-mono font-bold text-xs ${
                        isExpanded ? 'bg-[#1A1A1A] text-white' : 'bg-[#E2E4E8] text-[#374151]'
                      }`}>
                        {stage.number}
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-mono text-sm font-bold text-[#1A1A1A]">
                            {stage.title}
                          </h3>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                            stage.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : stage.status === 'In Progress'
                              ? 'bg-sky-50 text-sky-700 border border-sky-200'
                              : 'bg-neutral-100 text-neutral-600'
                          }`}>
                            {stage.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#6B7280] mt-0.5">{stage.shortDesc}</p>
                      </div>
                    </div>
                    <div className="text-[#9CA3AF]">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 border-t border-[#F3F4F6] bg-[#FAFAFA] space-y-4">
                      <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed pt-2">
                        {stage.details}
                      </p>

                      <div className="pt-2">
                        <span className="text-[10px] font-mono font-bold text-[#1A1A1A] uppercase tracking-wider block mb-2">
                          Key Deliverables & Documentation Artifacts:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {stage.deliverables.map((deliv, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 rounded bg-white border border-[#E2E4E8] text-[11px] font-mono text-[#374151]"
                            >
                              ✓ {deliv}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. RESEARCH DATA SECTION */}
      <section className="py-20 bg-[#F4F5F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[#6B7280] block mb-1">
              EXPERIMENTAL TELEMETRY & TESTING
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#1A1A1A]">
              RESEARCH DATA & TEST HARNESS
            </h2>
            <p className="text-sm text-[#4B5563] mt-2">
              SunStride adheres to rigorous scientific transparency. Below are experimental test beds configured for continuous laboratory data logging:
            </p>
          </div>

          {/* Data Category Switcher */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-8">
            {dataCategories.map((cat) => {
              const isSelected = selectedDataCategory === cat.id;
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  id={`data-cat-btn-${cat.id}`}
                  onClick={() => setSelectedDataCategory(cat.id)}
                  className={`p-3 rounded-lg border text-left font-mono transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                      : 'bg-white text-[#374151] border-[#E2E4E8] hover:bg-[#ECEEF2]'
                  }`}
                >
                  <Icon className={`w-4 h-4 mb-2 ${isSelected ? 'text-emerald-400' : 'text-[#6B7280]'}`} />
                  <span className="text-xs font-bold block">{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Data Display Card */}
          <div className="bg-white p-6 sm:p-8 rounded-lg border border-[#E2E4E8] shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F3F4F6] pb-4">
              <div>
                <span className="text-[10px] font-mono text-emerald-600 font-bold uppercase tracking-wider">
                  TELEMETRY LOG // HARNESS CALIBRATION
                </span>
                <h3 className="text-lg font-bold font-mono text-[#1A1A1A] mt-0.5">
                  {dataCategories.find((c) => c.id === selectedDataCategory)?.label}
                </h3>
              </div>
              <div className="px-3 py-1 bg-amber-50 border border-amber-200 rounded text-amber-800 text-[11px] font-mono font-semibold self-start sm:self-auto">
                DATA TO BE UPDATED // ONGOING ATL TESTING
              </div>
            </div>

            {/* Test Harness Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-[#E2E4E8] text-[#6B7280] bg-[#F4F5F7]">
                    <th className="py-2.5 px-3">METRIC PARAMETER</th>
                    <th className="py-2.5 px-3">EXPECTED PROFILE</th>
                    <th className="py-2.5 px-3">PROTOTYPE MEASUREMENT</th>
                    <th className="py-2.5 px-3">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3F4F6] text-[#374151]">
                  <tr>
                    <td className="py-3 px-3 font-semibold">Sensor Quiescent Current</td>
                    <td className="py-3 px-3 text-[#6B7280]">&lt; 20 µA in deep sleep</td>
                    <td className="py-3 px-3 text-neutral-800">18.4 µA (Bench test)</td>
                    <td className="py-3 px-3 text-emerald-600 font-semibold">VERIFIED</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold">RFID Interrogation Burst</td>
                    <td className="py-3 px-3 text-[#6B7280]">80–120 ms pulse window</td>
                    <td className="py-3 px-3 text-neutral-800">92 ms average</td>
                    <td className="py-3 px-3 text-emerald-600 font-semibold">VERIFIED</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold">Canopy Solar Yield (Monsoon)</td>
                    <td className="py-3 px-3 text-[#6B7280]">Diffuse radiation modeling</td>
                    <td className="py-3 px-3 text-amber-700 italic">LOGGING IN PROGRESS</td>
                    <td className="py-3 px-3 text-amber-600 font-semibold">TESTING</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold">Piezoelectric Tile Fatigue Life</td>
                    <td className="py-3 px-3 text-[#6B7280]">&gt; 100,000 cyclic deflections</td>
                    <td className="py-3 px-3 text-neutral-600 italic">DATA TO BE UPDATED</td>
                    <td className="py-3 px-3 text-sky-600 font-semibold">CALIBRATING</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 rounded bg-[#F4F5F7] border border-[#E2E4E8] text-xs font-mono text-[#4B5563] flex items-center justify-between">
              <span>Scientific Note: Quantitative figures are calibrated against benchtop physical instruments without extrapolating commercial field metrics.</span>
              <button
                onClick={() => onSelectTab('docs')}
                className="text-[#1A1A1A] font-bold underline hover:text-emerald-700 shrink-0 ml-4 cursor-pointer"
              >
                View Documentation →
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
