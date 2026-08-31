import React, { useState } from 'react';
import { PageTab } from '../types';
import { Mail, ArrowRight, CheckCircle2, Send, MapPin } from 'lucide-react';

interface ContactViewProps {
  onSelectTab: (tab: PageTab) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ onSelectTab }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setIsSubmitted(true);
  };

  return (
    <div className="w-full bg-[#F4F5F7] text-[#1A1A1A]">
      {/* 1. HERO */}
      <section className="border-b border-[#E2E4E8] bg-tech-grid pt-14 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#E2E4E8] text-[10px] font-mono font-bold uppercase tracking-wider text-[#374151]">
              <Mail className="w-3.5 h-3.5 text-emerald-600" />
              <span>ACADEMIC & RESEARCH INQUIRIES</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-[#1A1A1A]">
              CONNECT WITH SUNSTRIDE
            </h1>
            <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed">
              We welcome dialogue with civil transit authorities, hardware researchers, and academic collaborators.
            </p>
          </div>
        </div>
      </section>

      {/* 2. FORM & LAB DETAILS */}
      <section className="py-20 border-b border-[#E2E4E8]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 sm:p-10 rounded-xl border border-[#E2E4E8] shadow-xs space-y-8">
            {isSubmitted ? (
              <div className="p-8 text-center space-y-4 font-mono">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display text-[#1A1A1A]">
                  MESSAGE RECEIVED
                </h3>
                <p className="text-xs text-[#4B5563] max-w-md mx-auto leading-relaxed">
                  Thank you for your interest in the SunStride project. The ATL engineering research team will review your inquiry.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setName('');
                    setEmail('');
                    setMessage('');
                  }}
                  className="inline-block text-xs text-neutral-800 underline font-bold cursor-pointer pt-2"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-mono font-bold text-[#1A1A1A] uppercase tracking-wider mb-2">
                    NAME
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dr. / Prof. / Engineer / Name"
                    className="w-full px-4 py-3 rounded-lg border border-[#D1D5DB] text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] font-sans"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-xs font-mono font-bold text-[#1A1A1A] uppercase tracking-wider mb-2">
                    EMAIL
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@institution.edu / organization.org"
                    className="w-full px-4 py-3 rounded-lg border border-[#D1D5DB] text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] font-sans"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-mono font-bold text-[#1A1A1A] uppercase tracking-wider mb-2">
                    MESSAGE
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please describe your research inquiry, technical question, or collaboration interest..."
                    className="w-full px-4 py-3 rounded-lg border border-[#D1D5DB] text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] font-sans resize-none"
                  />
                </div>

                <button
                  id="contact-submit-btn"
                  type="submit"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-neutral-800 text-white font-mono text-xs font-bold uppercase tracking-wider px-8 py-3.5 rounded transition-all cursor-pointer shadow-xs group"
                >
                  <span>SEND MESSAGE</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            )}

            <div className="pt-6 border-t border-[#F3F4F6] flex items-center justify-between text-xs font-mono text-[#6B7280]">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-neutral-400" />
                <span>ATL Engineering Research Facility · New Delhi, India</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
