import React, { useState } from 'react';
import { PageTab, TeamMember } from '../types';
import { TEAM_MEMBERS } from '../data/projectData';
import { Users, Cpu, ArrowRight, ShieldCheck, Wrench, BookOpen } from 'lucide-react';

interface TeamViewProps {
  onSelectTab: (tab: PageTab) => void;
}

export const TeamView: React.FC<TeamViewProps> = ({ onSelectTab }) => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  return (
    <div className="w-full bg-[#F4F5F7] text-[#1A1A1A]">
      {/* 1. HERO */}
      <section className="border-b border-[#E2E4E8] bg-tech-grid pt-14 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#E2E4E8] text-[10px] font-mono font-bold uppercase tracking-wider text-[#374151]">
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              <span>ATL RESEARCH TEAM & CONTRIBUTORS</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-[#1A1A1A]">
              THE PEOPLE BEHIND SUNSTRIDE
            </h1>
            <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed">
              An interdisciplinary engineering team spanning embedded electronics, power harvesting physics, telematics, and industrial design.
            </p>
          </div>
        </div>
      </section>

      {/* 2. TEAM GRID */}
      <section className="py-20 border-b border-[#E2E4E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.id}
                id={`team-card-${member.id}`}
                onClick={() => setSelectedMember(member)}
                className="bg-white p-6 rounded-lg border border-[#E2E4E8] shadow-xs hover:border-[#94A3B8] transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-4">
                  {/* Top Avatar Badge */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-lg bg-[#1A1A1A] text-white flex items-center justify-center font-mono font-bold text-sm tracking-wider group-hover:bg-neutral-800 transition-colors">
                      {member.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                      ATL CORE
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold font-display text-lg text-[#1A1A1A] group-hover:text-emerald-700 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-xs font-mono font-semibold text-[#4B5563] mt-0.5">
                      {member.role}
                    </p>
                  </div>

                  <p className="text-xs text-[#4B5563] leading-relaxed">
                    {member.contribution}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F3F4F6] flex items-center justify-between text-xs font-mono text-[#6B7280]">
                  <span>{member.areaOfFocus.split('·')[0]}</span>
                  <span className="text-[#1A1A1A] font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    Details →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Member Details Modal */}
      {selectedMember && (
        <div
          id="team-member-modal"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="bg-white rounded-xl border border-[#E2E4E8] max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-[#F3F4F6] pb-4">
              <div>
                <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold uppercase">
                  {selectedMember.role}
                </span>
                <h3 className="text-2xl font-bold font-display text-[#1A1A1A] mt-1">
                  {selectedMember.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMember(null)}
                className="p-1 rounded text-neutral-400 hover:text-neutral-700 cursor-pointer font-mono text-xs"
              >
                [ESC / CLOSE]
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-mono font-bold text-[#1A1A1A] uppercase block mb-1">
                  CORE CONTRIBUTION:
                </span>
                <p className="text-[#4B5563] leading-relaxed">{selectedMember.contribution}</p>
              </div>

              <div>
                <span className="font-mono font-bold text-[#1A1A1A] uppercase block mb-1">
                  BIOGRAPHICAL CONTEXT:
                </span>
                <p className="text-[#4B5563] leading-relaxed">{selectedMember.bio}</p>
              </div>

              <div>
                <span className="font-mono font-bold text-[#1A1A1A] uppercase block mb-1.5">
                  TOOLS & METHODOLOGIES:
                </span>
                <div className="flex flex-wrap gap-1.5 font-mono">
                  {selectedMember.toolsUsed.map((tool, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-[#ECEEF2] text-[#374151] text-[11px]"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#F3F4F6] flex justify-end">
              <button
                onClick={() => setSelectedMember(null)}
                className="bg-[#1A1A1A] text-white px-4 py-2 rounded text-xs font-mono font-bold cursor-pointer"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
