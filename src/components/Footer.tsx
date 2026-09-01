import React from 'react';
import { PageTab } from '../types';
import { ArrowUpRight, Cpu, Radio, Sun } from 'lucide-react';
import { SunStrideLogo } from './SunStrideLogo';

interface FooterProps {
  onSelectTab: (tab: PageTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  const handleNavClick = (tab: PageTab) => {
    onSelectTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#14171C] text-[#D1D5DB] border-t border-neutral-800 transition-colors pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-800">
          {/* Col 1 & 2: Brand and Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-700/80 flex items-center justify-center p-1 shadow-xs">
                <SunStrideLogo size={30} darkTheme />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-white">
                SUNSTRIDE
              </span>
            </div>
            <p className="text-xs font-mono tracking-wider text-emerald-400 font-semibold uppercase">
              SMART MOBILITY. RENEWABLE ENERGY. ONE STATION.
            </p>
            <p className="text-sm text-neutral-400 max-w-md leading-relaxed">
              An engineering and applied research initiative exploring localized RFID vehicle tracking coupled with hybrid solar and piezoelectric energy harvesting for resilient civil infrastructure.
            </p>
            <div className="flex items-center gap-4 text-xs font-mono text-neutral-500 pt-2">
              <div className="flex items-center gap-1">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>SOLAR HARVESTING</span>
              </div>
              <div className="flex items-center gap-1">
                <Radio className="w-3.5 h-3.5 text-emerald-400" />
                <span>RFID TELEMETRY</span>
              </div>
              <div className="flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-sky-400" />
                <span>LOW POWER MCU</span>
              </div>
            </div>
          </div>

          {/* Col 3: Research & Architecture Navigation */}
          <div className="space-y-3 font-mono">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest border-b border-neutral-800 pb-2">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button
                  id="footer-link-home"
                  onClick={() => handleNavClick('home')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Home Overview
                </button>
              </li>
              <li>
                <button
                  id="footer-link-research"
                  onClick={() => handleNavClick('research')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Research & Areas
                </button>
              </li>
              <li>
                <button
                  id="footer-link-system"
                  onClick={() => handleNavClick('system')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  System Architecture
                </button>
              </li>
              <li>
                <button
                  id="footer-link-lab"
                  onClick={() => handleNavClick('lab')}
                  className="hover:text-emerald-400 text-emerald-400/90 font-semibold transition-colors cursor-pointer text-left flex items-center gap-1"
                >
                  <span>Interactive Lab</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Documentation & Analysis */}
          <div className="space-y-3 font-mono">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest border-b border-neutral-800 pb-2">
              Documentation
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button
                  id="footer-link-docs"
                  onClick={() => handleNavClick('docs')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Technical Specification
                </button>
              </li>
              <li>
                <button
                  id="footer-link-impact"
                  onClick={() => handleNavClick('impact')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Infrastructure Impact
                </button>
              </li>
              <li>
                <button
                  id="footer-link-team"
                  onClick={() => handleNavClick('team')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Project Credits & Mentor
                </button>
              </li>
              <li>
                <button
                  id="footer-link-about"
                  onClick={() => handleNavClick('about')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Why SunStride?
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Research Ethics & Status */}
          <div className="space-y-3 font-mono">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest border-b border-neutral-800 pb-2">
              Protocol
            </h4>
            <div className="p-3 rounded bg-neutral-900/90 border border-neutral-800 text-[11px] text-neutral-400 space-y-1.5">
              <div className="flex items-center justify-between text-neutral-300 font-semibold">
                <span>STAGE:</span>
                <span className="text-emerald-400">ATL PROTOTYPE</span>
              </div>
              <p className="text-[10px] text-neutral-500 leading-tight">
                Designed to investigate feasibility without marketing exaggeration or unverified commercial claims.
              </p>
              <button
                id="footer-link-contact"
                onClick={() => handleNavClick('contact')}
                className="inline-block mt-2 text-xs text-white underline decoration-neutral-600 hover:decoration-white cursor-pointer"
              >
                Inquire / Academic Contact →
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-500">
          <div>
            © 2026 SunStride Smart Station. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>ATL RESEARCH BENCH</span>
            <span>·</span>
            <span>PASSIVE RFID / HYBRID PV-PIEZO</span>
            <span>·</span>
            <span>PUBLIC MOBILITY LAB</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
