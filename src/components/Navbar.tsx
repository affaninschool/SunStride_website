import React, { useState } from 'react';
import { PageTab } from '../types';
import { Radio, ArrowRight, Menu, X, Cpu, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  activeTab: PageTab;
  onSelectTab: (tab: PageTab) => void;
  onReplayPreloader?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onSelectTab, onReplayPreloader }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: PageTab; label: string }[] = [
    { id: 'home', label: 'HOME' },
    { id: 'research', label: 'RESEARCH' },
    { id: 'system', label: 'SYSTEM' },
    { id: 'lab', label: 'INTERACTIVE LAB' },
    { id: 'impact', label: 'IMPACT' },
    { id: 'team', label: 'TEAM' },
  ];

  const secondaryItems: { id: PageTab; label: string }[] = [
    { id: 'about', label: 'ABOUT' },
    { id: 'docs', label: 'DOCUMENTATION' },
    { id: 'contact', label: 'CONTACT' },
  ];

  const handleNavClick = (tab: PageTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F4F5F7]/95 backdrop-blur-md border-b border-[#E2E4E8] transition-colors">
      {/* Top Engineering Telemetry Bar */}
      <div className="w-full bg-[#14171C] text-[#9CA3AF] text-[10px] sm:text-[11px] font-mono px-4 sm:px-8 py-1.5 flex items-center justify-between border-b border-neutral-800">
        <div className="flex items-center gap-3 sm:gap-6 overflow-hidden text-ellipsis whitespace-nowrap">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold">SYS STATUS: ONLINE</span>
          </div>
          <div className="hidden md:flex items-center gap-1">
            <Radio className="w-3 h-3 text-neutral-400" />
            <span>RFID PROTOCOL: ISO/IEC 18000-6C</span>
          </div>
          <div className="hidden lg:flex items-center gap-1">
            <Cpu className="w-3 h-3 text-neutral-400" />
            <span>HYBRID POWER: SOLAR + PIEZO HARVESTING</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-neutral-400">ATL RESEARCH PROTOTYPE // V1.0</span>
          {onReplayPreloader && (
            <button
              id="replay-init-btn"
              onClick={onReplayPreloader}
              className="text-[10px] text-neutral-400 hover:text-white underline decoration-neutral-600 cursor-pointer"
              title="Re-run system initialization sequence"
            >
              [REPLAY INIT]
            </button>
          )}
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          id="nav-brand-logo"
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded bg-[#1A1A1A] text-white flex items-center justify-center font-display font-bold text-sm tracking-tighter group-hover:bg-neutral-800 transition-colors shadow-xs">
            SS
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-base sm:text-lg tracking-tight text-[#1A1A1A]">
                SUNSTRIDE
              </span>
              <span className="text-[9px] font-mono uppercase bg-[#E2E4E8] text-[#374151] px-1.5 py-0.5 rounded font-medium">
                RESEARCH
              </span>
            </div>
            <span className="text-[10px] text-[#6B7280] font-mono tracking-wider -mt-0.5 hidden sm:block">
              SMART MOBILITY & RENEWABLE STATION
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-2 text-xs font-semibold tracking-wider font-mono transition-all rounded relative cursor-pointer ${
                  isActive
                    ? 'text-[#1A1A1A] bg-[#E2E4E8]/80 font-bold'
                    : 'text-[#4B5563] hover:text-[#1A1A1A] hover:bg-[#E8EAEE]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#1A1A1A] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Button & Secondary Links */}
        <div className="hidden lg:flex items-center gap-4">
          <button
            id="nav-cta-interactive-lab"
            onClick={() => handleNavClick('lab')}
            className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-neutral-800 text-[#F4F5F7] text-xs font-mono font-semibold px-4 py-2 rounded transition-all cursor-pointer shadow-xs group"
          >
            <span>ENTER INTERACTIVE LAB</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Mobile Hamburger Menu Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-[#374151] hover:text-[#1A1A1A] hover:bg-[#E2E4E8] transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#F4F5F7] border-b border-[#E2E4E8] px-4 pt-2 pb-6 space-y-3 shadow-lg">
          <div className="text-[11px] font-mono font-semibold text-[#6B7280] uppercase tracking-wider px-2 pt-2">
            Main Sections
          </div>
          <div className="grid grid-cols-1 gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-3 py-2.5 rounded text-sm font-mono flex items-center justify-between ${
                    isActive
                      ? 'bg-[#1A1A1A] text-white font-bold'
                      : 'text-[#374151] hover:bg-[#ECEEF2]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                </button>
              );
            })}
          </div>

          <div className="text-[11px] font-mono font-semibold text-[#6B7280] uppercase tracking-wider px-2 pt-3 border-t border-[#E2E4E8]">
            Documentation & System
          </div>
          <div className="grid grid-cols-3 gap-1">
            {secondaryItems.map((item) => (
              <button
                key={item.id}
                id={`mobile-sec-nav-link-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className="px-2.5 py-2 text-center text-xs font-mono rounded text-[#4B5563] bg-[#ECEEF2] hover:bg-[#E2E4E8]"
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            id="mobile-cta-lab-btn"
            onClick={() => handleNavClick('lab')}
            className="w-full mt-3 flex items-center justify-center gap-2 bg-[#1A1A1A] text-white py-3 rounded font-mono text-xs font-bold"
          >
            <span>ENTER INTERACTIVE LAB →</span>
          </button>
        </div>
      )}
    </header>
  );
};
