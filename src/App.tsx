/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PageTab } from './types';
import { Preloader } from './components/Preloader';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { ResearchView } from './views/ResearchView';
import { SystemView } from './views/SystemView';
import { InteractiveLabView } from './views/InteractiveLabView';
import { ImpactView } from './views/ImpactView';
import { TeamView } from './views/TeamView';
import { AboutView } from './views/AboutView';
import { DocumentationView } from './views/DocumentationView';
import { ContactView } from './views/ContactView';

export default function App() {
  const [showPreloader, setShowPreloader] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<PageTab>('home');

  // Handle browser back/forward or tab selection
  const handleSelectTab = (tab: PageTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReplayPreloader = () => {
    setShowPreloader(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F5F7] text-[#1A1A1A] relative">
      {/* Custom Desktop RFID Scanning Cursor */}
      <CustomCursor />

      {/* System Initialization Preloader */}
      {showPreloader && (
        <Preloader onComplete={() => setShowPreloader(false)} />
      )}

      {/* Main App Layout */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onReplayPreloader={handleReplayPreloader}
      />

      <main className="flex-1 w-full">
        {activeTab === 'home' && <HomeView onSelectTab={handleSelectTab} />}
        {activeTab === 'research' && <ResearchView onSelectTab={handleSelectTab} />}
        {activeTab === 'system' && <SystemView onSelectTab={handleSelectTab} />}
        {activeTab === 'lab' && <InteractiveLabView onSelectTab={handleSelectTab} />}
        {activeTab === 'impact' && <ImpactView onSelectTab={handleSelectTab} />}
        {activeTab === 'team' && <TeamView onSelectTab={handleSelectTab} />}
        {activeTab === 'about' && <AboutView onSelectTab={handleSelectTab} />}
        {activeTab === 'docs' && <DocumentationView onSelectTab={handleSelectTab} />}
        {activeTab === 'contact' && <ContactView onSelectTab={handleSelectTab} />}
      </main>

      <Footer onSelectTab={handleSelectTab} />
    </div>
  );
}

