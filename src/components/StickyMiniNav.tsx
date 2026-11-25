import React, { useEffect, useRef, useState, useCallback } from 'react';
import { PageTab } from '../types';
import { ArrowUp, Compass } from 'lucide-react';

interface StickyMiniNavProps {
  activeTab: PageTab;
  hideContentBar?: boolean;
}

interface NavSection {
  id: string;
  label: string;
  element: HTMLElement;
}

const LONG_PAGE_THRESHOLD_PX = 2500;
const REVEAL_SCROLL_Y = 140;

const TAB_LABELS: Record<PageTab, string> = {
  home: 'HOME',
  research: 'RESEARCH',
  system: 'SYSTEM',
  lab: 'INTERACTIVE LAB',
  impact: 'IMPACT',
  team: 'TEAM',
  about: 'ABOUT',
  docs: 'DOCS',
  contact: 'CONTACT',
};

function formatSectionLabel(rawText: string, index: number, isHero: boolean): string {
  if (isHero) return 'Overview';

  const upper = rawText.toUpperCase();
  if (upper.includes('WHAT IS SUNSTRIDE')) return 'Concept';
  if (upper.includes('STATION HARDWARE')) return 'Hardware';
  if (upper.includes('HOW THE SYSTEM WORKS')) return 'Workflow';
  if (upper.includes('TEAM, ATL MENTOR')) return 'Team & ATL';
  if (upper.includes('READY TO INSPECT')) return 'Explore';
  if (upper.includes('REAL-WORLD TRANSIT PROBLEMS')) return 'Problems';
  if (upper.includes('FIVE CORE RESEARCH')) return 'Domains';
  if (upper.includes('RESEARCH METHODOLOGY')) return 'Methodology';
  if (upper.includes('RESEARCH DATA')) return 'Test Data';
  if (upper.includes('ARCHITECTURAL LAYERS')) return 'Layers';
  if (upper.includes('THE MINDS BEHIND')) return 'Overview';
  if (upper.includes('INCUBATED AT')) return 'Institution';
  if (upper.includes('AFFAN ADIL')) return 'Creators';
  if (upper.includes('NURTURING GRASSROOTS')) return 'ATL Vision';
  if (upper.includes('SUNSTRIDE ENERGY LAB')) return 'Energy Lab';
  if (upper.includes('PROJECT OVERVIEW')) return 'Overview';
  if (upper.includes('PROBLEM STATEMENT')) return 'Problem';
  if (upper.includes('ENGINEERING OBJECTIVES')) return 'Objectives';
  if (upper.includes('SYSTEM ARCHITECTURE')) return 'Architecture';
  if (upper.includes('HARDWARE SPECIFICATIONS')) return 'Hardware';
  if (upper.includes('ENERGY SYSTEM')) return 'Energy';
  if (upper.includes('SOFTWARE LOGIC')) return 'Software';
  if (upper.includes('LABORATORY TESTING')) return 'Testing';
  if (upper.includes('QUALITATIVE RESULTS')) return 'Results';
  if (upper.includes('TECHNICAL LIMITATIONS')) return 'Limits';
  if (upper.includes('FUTURE SCOPE')) return 'Scope';

  // Clean fallback: strip numeric prefixes and condense to max 2 words
  const cleaned = rawText
    .replace(/^\d+\.\s*/, '')
    .replace(/[^a-zA-Z0-9\s&-]/g, ' ')
    .trim();
  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length === 0) return `Section ${index + 1}`;
  const snippet = words.slice(0, 2).join(' ');
  return snippet.length > 18 ? `${snippet.slice(0, 16)}…` : snippet;
}

export const StickyMiniNav: React.FC<StickyMiniNavProps> = ({ activeTab, hideContentBar = false }) => {
  const [pageHeight, setPageHeight] = useState<number>(0);
  const [scrollY, setScrollY] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [sections, setSections] = useState<NavSection[]>([]);
  const [activeSectionIndex, setActiveSectionIndex] = useState<number>(0);

  const navStripRef = useRef<HTMLDivElement | null>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);

  const isLongPage = pageHeight >= LONG_PAGE_THRESHOLD_PX;
  const isMiniNavVisible = isLongPage && scrollY > REVEAL_SCROLL_Y && !hideContentBar;

  const collectSections = useCallback(() => {
    const mainEl = document.querySelector('main');
    if (!mainEl) return;

    const docHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body ? document.body.scrollHeight : 0
    );
    setPageHeight(docHeight);

    if (docHeight < LONG_PAGE_THRESHOLD_PX) {
      setSections([]);
      return;
    }

    const discovered: NavSection[] = [];

    if (activeTab === 'docs') {
      const docNodes = Array.from(mainEl.querySelectorAll<HTMLElement>('[id^="sec-"]'));
      docNodes.forEach((el, idx) => {
        if (el.offsetParent === null) return;
        const heading = el.querySelector('h2, h3');
        const label = formatSectionLabel(heading?.textContent || `Section ${idx + 1}`, idx, false);
        discovered.push({
          id: el.id || `mini-nav-doc-${idx}`,
          label: `${String(idx + 1).padStart(2, '0')} ${label}`,
          element: el,
        });
      });
    } else if (activeTab === 'lab') {
      const labCandidates = Array.from(
        mainEl.querySelectorAll<HTMLElement>('h1, h2, h3')
      ).filter((el) => {
        if (el.offsetParent === null) return false;
        const text = (el.textContent || '').trim();
        if (!text) return false;
        // Include primary lab title, EnergyLab hero, active innovation heading, and calculator heading
        return (
          el.tagName === 'H1' ||
          el.tagName === 'H2' ||
          el.className.includes('text-xl') ||
          text.includes('Ambient Dual-Harvesting')
        );
      });

      labCandidates.forEach((heading, idx) => {
        const container = heading.closest('section') || heading.parentElement?.parentElement || heading;
        const label = formatSectionLabel(heading.textContent || '', idx, heading.tagName === 'H1');
        discovered.push({
          id: `mini-nav-lab-${idx}`,
          label: `${String(idx + 1).padStart(2, '0')} ${label}`,
          element: container as HTMLElement,
        });
      });
    } else {
      const rootWrapper = mainEl.firstElementChild;
      const topSections = rootWrapper
        ? Array.from(rootWrapper.children).filter(
            (child): child is HTMLElement => child.tagName.toLowerCase() === 'section'
          )
        : Array.from(mainEl.querySelectorAll<HTMLElement>('section'));

      // Filter out hidden or ultra-tiny bar sections
      const visibleSections = topSections.filter(
        (sec) => sec.offsetParent !== null && sec.getBoundingClientRect().height > 56
      );

      visibleSections.forEach((sec, idx) => {
        const explicitLabel = sec.getAttribute('data-nav-label');
        const h1 = sec.querySelector('h1');
        const h2 = sec.querySelector('h2');
        const h3 = sec.querySelector('h3');
        const rawText = explicitLabel || h1?.textContent || h2?.textContent || h3?.textContent || '';
        const label = explicitLabel || formatSectionLabel(rawText, idx, Boolean(h1) && idx === 0);

        discovered.push({
          id: sec.id || `mini-nav-sec-${idx}`,
          label: `${String(idx + 1).padStart(2, '0')} ${label}`,
          element: sec,
        });
      });
    }

    setSections(discovered);
  }, [activeTab]);

  const updateScrollMetrics = useCallback(() => {
    const currentY = window.scrollY || window.pageYOffset || 0;
    const docHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body ? document.body.scrollHeight : 0
    );
    const viewportHeight = window.innerHeight || 1;
    const maxScrollable = Math.max(1, docHeight - viewportHeight);
    const pct = Math.min(100, Math.max(0, (currentY / maxScrollable) * 100));

    setPageHeight(docHeight);
    setScrollY(currentY);
    setScrollProgress(pct);

    if (sections.length > 0) {
      const headerEl = document.querySelector('header');
      const headerHeight = headerEl ? headerEl.getBoundingClientRect().height : 120;
      const threshold = headerHeight + 56;

      // If at the bottom of the page, mark the final section active
      if (currentY + viewportHeight >= docHeight - 28) {
        setActiveSectionIndex(sections.length - 1);
        return;
      }

      let currentIdx = 0;
      for (let i = 0; i < sections.length; i++) {
        const rect = sections[i].element.getBoundingClientRect();
        if (rect.top <= threshold) {
          currentIdx = i;
        } else {
          break;
        }
      }
      setActiveSectionIndex(currentIdx);
    }
  }, [sections]);

  // Measure height & discover sections whenever tab changes or DOM updates
  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      collectSections();
      updateScrollMetrics();
    });

    const resizeObserver = new ResizeObserver(() => {
      collectSections();
      updateScrollMetrics();
    });

    if (document.body) {
      resizeObserver.observe(document.body);
    }

    const mainEl = document.querySelector('main');
    const mutationObserver = new MutationObserver(() => {
      requestAnimationFrame(() => {
        collectSections();
        updateScrollMetrics();
      });
    });

    if (mainEl) {
      mutationObserver.observe(mainEl, { childList: true, subtree: true });
    }

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [activeTab, collectSections, updateScrollMetrics]);

  // Listen to scroll and resize events cleanly with rAF throttling
  useEffect(() => {
    const handleScrollOrResize = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        updateScrollMetrics();
      });
    };

    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [updateScrollMetrics]);

  // Keep active mini-nav button centered inside its horizontal scroll strip without scrolling the page
  useEffect(() => {
    const strip = navStripRef.current;
    const activeBtn = buttonRefs.current[activeSectionIndex];
    if (!strip || !activeBtn || !isMiniNavVisible) return;

    const targetLeft =
      activeBtn.offsetLeft - strip.clientWidth / 2 + activeBtn.clientWidth / 2;
    strip.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: 'smooth',
    });
  }, [activeSectionIndex, isMiniNavVisible]);

  const prefersReducedMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleJumpToSection = (index: number) => {
    const target = sections[index]?.element;
    if (!target) return;

    const headerEl = document.querySelector('header');
    const headerHeight = headerEl ? headerEl.getBoundingClientRect().height : 128;
    const topOffset = target.getBoundingClientRect().top + window.scrollY - headerHeight - 12;

    window.scrollTo({
      top: Math.max(0, topOffset),
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  };

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  };

  if (!isLongPage) {
    return null;
  }

  const roundedPct = Math.round(scrollProgress);

  return (
    <div
      id="sticky-mini-nav"
      aria-label="Page section navigation and reading progress"
      className="w-full"
    >
      {/* Collapsible Sticky Mini-Nav Strip (appears after scrolling past hero on 2500px+ pages) */}
      <div
        className={`overflow-hidden transition-all duration-200 ease-out bg-[#ECEEF2]/95 backdrop-blur-md ${
          isMiniNavVisible
            ? 'max-h-12 opacity-100 border-t border-[#DCDFE4]'
            : 'max-h-0 opacity-0 pointer-events-none border-t-0'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-between gap-3">
          {/* Left: Current View Label + Section Jump Links */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="hidden md:flex items-center gap-1.5 pr-2.5 border-r border-[#D1D5DB] shrink-0 font-mono text-[10px] font-bold uppercase tracking-wider text-[#4B5563]">
              <Compass className="w-3.5 h-3.5 text-emerald-600" />
              <span>{TAB_LABELS[activeTab]}</span>
            </div>

            {sections.length > 0 && (
              <div
                ref={navStripRef}
                className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1"
                style={{ scrollbarWidth: 'none' }}
              >
                {sections.map((sec, idx) => {
                  const isActive = idx === activeSectionIndex;
                  return (
                    <button
                      key={sec.id}
                      ref={(el) => {
                        buttonRefs.current[idx] = el;
                      }}
                      id={`mini-nav-btn-${idx}`}
                      onClick={() => handleJumpToSection(idx)}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono whitespace-nowrap shrink-0 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${
                        isActive
                          ? 'bg-[#1A1A1A] text-white font-bold shadow-2xs'
                          : 'text-[#4B5563] hover:text-[#1A1A1A] hover:bg-white/80 font-medium'
                      }`}
                    >
                      {sec.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Live Progress Telemetry + Back to Top Button */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div
              className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-[#374151] pr-1"
              title={`Page height: ${pageHeight}px`}
            >
              <div className="w-14 h-1.5 rounded-full bg-[#D1D5DB] overflow-hidden">
                <div
                  className="h-full bg-emerald-600 transition-[width] duration-100"
                  style={{ width: `${scrollProgress}%` }}
                />
              </div>
              <span className="tabular-nums font-bold w-8 text-right text-[#1A1A1A]">
                {roundedPct}%
              </span>
            </div>

            <button
              id="mini-nav-back-to-top"
              onClick={handleBackToTop}
              aria-label="Back to top"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1A1A1A] hover:bg-neutral-800 text-white font-mono text-[11px] font-bold transition-all cursor-pointer shrink-0 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Back to top</span>
            </button>
          </div>
        </div>
      </div>

      {/* Full-Width Scroll Progress Bar docked on the bottom edge of Header */}
      <div
        role="progressbar"
        aria-label="Page scroll progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={roundedPct}
        className="w-full h-[3px] bg-[#E2E4E8] relative overflow-hidden"
      >
        <div
          className="h-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-400 transition-[width] duration-75 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </div>
  );
};
