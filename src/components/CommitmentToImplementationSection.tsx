import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronDown, ChevronUp, X, CheckCircle2, Maximize2 } from 'lucide-react';
import { getActionTheme } from '../utils/actionThemes';
import { RoadmapPillar, defaultChampRoadmapData } from '../data/champRoadmapData';
import { ChampPledge, defaultChampPledgesData } from '../data/champPledgesData';

interface CommitmentToImplementationSectionProps {
  onNavigateToStep?: (stepId: number) => void;
  onOpenRoadmap?: (componentId?: string) => void;
  roadmapPillars?: RoadmapPillar[];
  champPledges?: ChampPledge[];
}

const ACTION_METAS: Record<number, { id: number; title: string; desc: string }> = {
  1: { id: 1, title: "Shared commitments & platforms", desc: "Build cross-level consensus and shared ownership on climate investment targets." },
  2: { id: 2, title: "Enabling environments", desc: "Strengthen institutional frameworks, regulatory policies, and subnational capacity." },
  3: { id: 3, title: "Portfolios and pipelines", desc: "Plan, prepare, and implement subnational climate investment portfolios." },
  4: { id: 4, title: "Finance", desc: "Mobilize climate finance, shape markets, and scale project execution." },
  5: { id: 5, title: "Capacities and networks", desc: "Strengthen capacities, knowledge exchange, peer networks, and scale." }
};

export default function CommitmentToImplementationSection({
  onNavigateToStep,
  roadmapPillars = defaultChampRoadmapData,
  champPledges = defaultChampPledgesData
}: CommitmentToImplementationSectionProps) {
  const [activeModal, setActiveModal] = useState<'pledge' | 'roadmap' | 'toolkit' | null>(null);

  // States for Pledge modal
  const [expandedPledges, setExpandedPledges] = useState<Record<number, boolean>>({ 4: true });

  // States for Roadmap modal
  const [expandedPillars, setExpandedPillars] = useState<Record<number, boolean>>({ 3: true, 1: false, 2: false });
  const [expandedActivities, setExpandedActivities] = useState<Record<string, boolean>>({
    '3.1': true,
    '3.2': false,
    '3.3': false,
    '1.1': false,
    '1.2': false,
    '1.3': false,
    '2.1': false,
    '2.2': false,
    '2.3': false,
  });

  const pillars = (roadmapPillars && roadmapPillars.length > 0) ? roadmapPillars : defaultChampRoadmapData;
  const pledges = (champPledges && champPledges.length > 0) ? champPledges : defaultChampPledgesData;

  // Grab live activity titles for Card 3 from Pillar 3 if available
  const pillar3 = pillars.find(p => p.number === 3);
  const pillar3Title = pillar3?.title || "Pillar 3: Mobilizing Finance for Subnational Climate Action";
  const act31Title = pillar3?.activities.find(a => a.code === '3.1')?.title || "Integrate subnational priorities into national climate finance strategies and investment plans";
  const act32Title = pillar3?.activities.find(a => a.code === '3.2')?.title || "Enable a coordinated approach to project preparation across national and subnational levels";
  const act33Title = pillar3?.activities.find(a => a.code === '3.3')?.title || "Advocate for reform of finance institutions and climate funds to ease subnational access";

  const togglePledge = (id: number) => {
    setExpandedPledges(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleAllPledges = (expand: boolean) => {
    const nextState: Record<number, boolean> = {};
    pledges.forEach(p => {
      nextState[p.id] = expand;
    });
    setExpandedPledges(nextState);
  };

  const togglePillar = (num: number) => {
    setExpandedPillars(prev => ({
      ...prev,
      [num]: !prev[num]
    }));
  };

  const toggleActivity = (code: string) => {
    setExpandedActivities(prev => ({
      ...prev,
      [code]: !prev[code]
    }));
  };

  const handleActionNavigation = (actionId: number) => {
    setActiveModal(null);
    if (onNavigateToStep) {
      onNavigateToStep(actionId);
    }
  };

  return (
    <section className="w-full max-w-6xl mx-auto mb-6">
      {/* Title & Subtitle */}
      <div className="flex flex-col items-start text-left mb-6">
        <h2 className="title-h2 text-dark-green mb-2">
          From commitment to implementation
        </h2>
        <p className="body-text-md">
          Explore how the CHAMP Pledge, the Implementation Roadmap, and this Toolkit connect
        </p>
      </div>

      {/* 3 Connected Pathway-Style Cards with standardized heights and clean styling */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] items-stretch gap-0">
        
        {/* CARD 1: CHAMP Pledge */}
        <button
          type="button"
          onClick={() => setActiveModal('pledge')}
          className="text-left p-5 md:p-6 border border-line bg-surface hover:bg-paper transition-all duration-200 rounded-none flex flex-col justify-between focus:outline-none group cursor-pointer hover:border-[#207B6A] hover:shadow-xs"
        >
          <div>
            <h3 className="font-heading text-lg md:text-xl font-bold text-ink mb-2.5 leading-snug group-hover:text-[#207B6A] transition-colors">
              CHAMP Pledge
            </h3>

            <p className="text-xs md:text-[13px] text-ink-muted leading-relaxed font-light mb-4">
              The commitments made by national governments to strengthen collaboration with subnational governments on climate action.
            </p>
          </div>

          <div className="pt-3 border-t border-line/60 flex items-center justify-between text-xs font-semibold text-[#207B6A]">
            <span>Explore the Toolkit's focus within the Pledge</span>
            <Maximize2 size={15} className="shrink-0" />
          </div>
        </button>

        {/* Dotted Connector 1 -> 2 */}
        <div className="flex items-center justify-center shrink-0 py-2 md:py-0 md:px-3 h-auto" aria-hidden="true">
          {/* Mobile vertical dots */}
          <div className="md:hidden flex flex-col items-center gap-1.5 py-1">
            <span className="w-[2.4px] h-[2.4px] rounded-full bg-ink/60 shrink-0" />
            <span className="w-[2.4px] h-[2.4px] rounded-full bg-ink/60 shrink-0" />
            <span className="w-[2.4px] h-[2.4px] rounded-full bg-ink/60 shrink-0" />
          </div>
          {/* Desktop horizontal dots */}
          <div className="hidden md:flex items-center gap-1.5">
            <span className="w-[2.4px] h-[2.4px] rounded-full bg-ink/60 shrink-0" />
            <span className="w-[2.4px] h-[2.4px] rounded-full bg-ink/60 shrink-0" />
            <span className="w-[2.4px] h-[2.4px] rounded-full bg-ink/60 shrink-0" />
            <span className="w-[2.4px] h-[2.4px] rounded-full bg-ink/60 shrink-0" />
          </div>
        </div>

        {/* CARD 2: CHAMP Implementation Roadmap */}
        <button
          type="button"
          onClick={() => setActiveModal('roadmap')}
          className="text-left p-5 md:p-6 border border-line bg-surface hover:bg-paper transition-all duration-200 rounded-none flex flex-col justify-between focus:outline-none group cursor-pointer hover:border-[#207B6A] hover:shadow-xs"
        >
          <div>
            <h3 className="font-heading text-lg md:text-xl font-bold text-ink mb-2.5 leading-snug group-hover:text-[#207B6A] transition-colors">
              CHAMP Implementation Roadmap
            </h3>

            <p className="text-xs md:text-[13px] text-ink-muted leading-relaxed font-light mb-4">
              The 2026–2028 strategic priorities for advancing implementation of the CHAMP Pledge.
            </p>
          </div>

          <div className="pt-3 border-t border-line/60 flex items-center justify-between text-xs font-semibold text-[#207B6A]">
            <span>Explore the Toolkit's focus within the Roadmap</span>
            <Maximize2 size={15} className="shrink-0" />
          </div>
        </button>

        {/* Dotted Connector 2 -> 3 */}
        <div className="flex items-center justify-center shrink-0 py-2 md:py-0 md:px-3 h-auto" aria-hidden="true">
          {/* Mobile vertical dots */}
          <div className="md:hidden flex flex-col items-center gap-1.5 py-1">
            <span className="w-[2.4px] h-[2.4px] rounded-full bg-ink/60 shrink-0" />
            <span className="w-[2.4px] h-[2.4px] rounded-full bg-ink/60 shrink-0" />
            <span className="w-[2.4px] h-[2.4px] rounded-full bg-ink/60 shrink-0" />
          </div>
          {/* Desktop horizontal dots */}
          <div className="hidden md:flex items-center gap-1.5">
            <span className="w-[2.4px] h-[2.4px] rounded-full bg-ink/60 shrink-0" />
            <span className="w-[2.4px] h-[2.4px] rounded-full bg-ink/60 shrink-0" />
            <span className="w-[2.4px] h-[2.4px] rounded-full bg-ink/60 shrink-0" />
            <span className="w-[2.4px] h-[2.4px] rounded-full bg-ink/60 shrink-0" />
          </div>
        </div>

        {/* CARD 3: CHAMP Toolkit */}
        <button
          type="button"
          onClick={() => setActiveModal('toolkit')}
          className="text-left p-5 md:p-6 border border-line bg-surface hover:bg-paper transition-all duration-200 rounded-none flex flex-col justify-between focus:outline-none group cursor-pointer hover:border-[#207B6A] hover:shadow-xs"
        >
          <div>
            <h3 className="font-heading text-lg md:text-xl font-bold text-ink mb-2.5 leading-snug group-hover:text-[#207B6A] transition-colors">
              CHAMP Toolkit
            </h3>

            <p className="text-xs md:text-[13px] text-ink-muted leading-relaxed font-light mb-4">
              Toolkit's actions cover multilevel governance, investment planning, finance and implementation, and support the implementation of Pillar 3.
            </p>
          </div>

          <div className="pt-3 border-t border-line/60 flex items-center justify-between text-xs font-semibold text-[#207B6A]">
            <span>See how the Toolkit Actions map across Pillar 3</span>
            <Maximize2 size={15} className="shrink-0" />
          </div>
        </button>

      </div>

      {/* ================= MODALS ================= */}

      {/* MODAL 1: CHAMP PLEDGE (All 6 commitments, with investment commitment highlighted) */}
      <AnimatePresence>
        {activeModal === 'pledge' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="fixed inset-0 bg-ink/70 backdrop-blur-2xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-3xl max-h-[90vh] bg-surface border border-line shadow-2xl flex flex-col z-10 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-5 bg-paper border-b border-line flex items-start justify-between gap-4 shrink-0">
                <div className="space-y-1">
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-ink leading-snug">
                    CHAMP Pledge Commitments
                  </h3>
                  <p className="text-xs sm:text-sm text-ink-muted font-light">
                    The six commitments made by national governments to strengthen collaboration with subnational governments on climate action.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="p-1.5 text-ink-muted hover:text-ink transition-colors cursor-pointer shrink-0 border border-transparent hover:border-line"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body: All 6 Commitments */}
              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 bg-surface space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-line">
                  <span className="text-xs font-semibold uppercase tracking-wider text-ink font-heading">
                    All Six Commitments
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleAllPledges(true)}
                      className="text-[11px] text-ink-muted hover:text-[#207B6A] cursor-pointer transition-colors"
                    >
                      Expand all
                    </button>
                    <span className="text-line text-xs">|</span>
                    <button
                      type="button"
                      onClick={() => toggleAllPledges(false)}
                      className="text-[11px] text-ink-muted hover:text-[#207B6A] cursor-pointer transition-colors"
                    >
                      Collapse all
                    </button>
                  </div>
                </div>

                {pledges.map((pledge) => {
                  const isExpanded = !!expandedPledges[pledge.id];
                  const isHighlighted = pledge.isInvestment;

                  return (
                    <div
                      key={pledge.id}
                      className={`border transition-all ${
                        isHighlighted
                          ? 'bg-surface border-[#207B6A]'
                          : 'bg-paper border-line hover:border-ink/30'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => togglePledge(pledge.id)}
                        className="w-full p-4 text-left flex items-start justify-between gap-3.5 cursor-pointer group"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <span
                            className={`text-xs font-bold px-2 py-0.5 border shrink-0 mt-0.5 ${
                              isHighlighted
                                ? 'bg-[#207B6A] text-white border-[#207B6A]'
                                : 'bg-[#207B6A] text-white border-[#207B6A]'
                            }`}
                          >
                            {pledge.number}
                          </span>

                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className={`font-heading text-sm sm:text-base font-bold transition-colors leading-snug ${
                                isHighlighted ? 'text-[#207B6A]' : 'text-ink group-hover:text-[#207B6A]'
                              }`}>
                                {pledge.title}
                              </h4>
                              {isHighlighted && (
                                <span className="inline-flex items-center text-[10px] sm:text-[11px] font-bold text-white bg-[#207B6A] px-2 py-0.5 border border-[#207B6A]">
                                  Toolkit Focus
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="p-1 text-ink-muted group-hover:text-ink shrink-0 mt-0.5">
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </button>

                      {/* Expandable full text */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden border-t border-line/70 px-5 pb-4 pt-3.5 bg-surface"
                          >
                            <div className="text-xs sm:text-[13px] text-ink font-normal leading-relaxed pl-3 border-l-2 border-[#207B6A]">
                              <p className="italic text-ink/90 leading-relaxed mb-2">
                                "{pledge.fullText}"
                              </p>
                              {isHighlighted && (
                                <div className="mt-2.5 p-2.5 bg-[#207B6A] border border-[#207B6A] text-xs text-white font-medium flex items-start gap-2">
                                  <CheckCircle2 size={15} className="shrink-0 mt-0.5" />
                                  <span>
                                    <strong>Supported by this Toolkit:</strong> Actions 1 through 6 provide governments with practical guidance, decision frameworks, and tools to prepare pipelines and mobilize climate finance for subnational priorities.
                                  </span>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="px-6 py-3.5 bg-paper border-t border-line flex items-center justify-end shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-5 py-1.5 bg-ink text-surface text-xs font-semibold hover:bg-ink/90 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: CHAMP IMPLEMENTATION ROADMAP (All 3 pillars with Pillar 3 highlighted and 3.1-3.3 activities) */}
      <AnimatePresence>
        {activeModal === 'roadmap' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="fixed inset-0 bg-ink/70 backdrop-blur-2xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-3xl max-h-[90vh] bg-surface border border-line shadow-2xl flex flex-col z-10 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-5 bg-paper border-b border-line flex items-start justify-between gap-4 shrink-0">
                <div className="space-y-1">
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-ink leading-snug">
                    CHAMP Implementation Roadmap (2026–2028)
                  </h3>
                  <p className="text-xs sm:text-sm text-ink-muted font-light">
                    The strategic priorities for advancing implementation of the CHAMP Pledge across three pillars.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="p-1.5 text-ink-muted hover:text-ink transition-colors cursor-pointer shrink-0 border border-transparent hover:border-line"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body: All 3 Pillars (Pillar 3 highlighted with 3.1-3.3 activities) */}
              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 bg-surface space-y-4">
                <div className="pb-2 border-b border-line flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-ink font-heading">
                    Roadmap Strategic Pillars
                  </span>
                  <span className="text-xs text-ink-muted">
                    Click any pillar to view its activities
                  </span>
                </div>

                {pillars.map((pillar) => {
                  const isPillar3 = pillar.number === 3;
                  const isPillarExpanded = !!expandedPillars[pillar.number];

                  return (
                    <div
                      key={pillar.number}
                      className={`border transition-all ${
                        isPillar3
                          ? 'bg-surface border-[#207B6A]'
                          : 'bg-paper border-line hover:border-ink/30'
                      }`}
                    >
                      {/* Pillar Title Banner */}
                      <button
                        type="button"
                        onClick={() => togglePillar(pillar.number)}
                        className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-4 cursor-pointer group"
                      >
                        <div className="space-y-1.5 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className={`font-heading text-base sm:text-lg font-bold transition-colors leading-snug ${
                              isPillar3 ? 'text-[#207B6A]' : 'text-ink group-hover:text-[#207B6A]'
                            }`}>
                              {pillar.title}
                            </h4>
                            {isPillar3 && (
                              <span className="inline-flex items-center text-[10px] sm:text-[11px] font-bold text-white bg-[#207B6A] px-2 py-0.5 border border-[#207B6A] shrink-0">
                                Primary Toolkit Focus
                              </span>
                            )}
                          </div>

                          {pillar.overview && (
                            <p className="text-xs sm:text-[13px] text-ink-muted font-light leading-relaxed">
                              {pillar.overview}
                            </p>
                          )}
                        </div>

                        <div className="p-1 text-ink-muted group-hover:text-ink shrink-0 mt-0.5">
                          {isPillarExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                      </button>

                      {/* Expanded Activities */}
                      <AnimatePresence>
                        {isPillarExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden border-t border-line/70 p-4 sm:p-5 bg-surface space-y-3"
                          >
                            <div className="flex items-center justify-between pb-1.5 border-b border-line/60">
                              <span className="text-[11px] font-bold text-ink uppercase tracking-wider">
                                {isPillar3 ? "Pillar 3 Activities (3.1 – 3.3)" : `Pillar ${pillar.number} Activities`}
                              </span>
                              <span className="text-[11px] text-ink-muted">
                                {pillar.activities.length} Activities
                              </span>
                            </div>

                            <div className="space-y-2.5">
                              {pillar.activities.map((act) => {
                                const isActExpanded = !!expandedActivities[act.code];

                                return (
                                  <div
                                    key={act.code}
                                    className={`border transition-all ${
                                      isPillar3
                                        ? 'bg-paper border-[#207B6A]'
                                        : 'bg-paper border-line hover:border-ink/30'
                                    }`}
                                  >
                                    <button
                                      type="button"
                                      onClick={() => toggleActivity(act.code)}
                                      className="w-full p-3.5 text-left flex items-start justify-between gap-3 cursor-pointer group"
                                    >
                                      <div className="flex items-start gap-2.5 min-w-0">
                                        <span className="text-[11px] font-bold text-white bg-[#207B6A] px-2 py-0.5 border border-[#207B6A] shrink-0 mt-0.5">
                                          {act.code}
                                        </span>
                                        <span className="font-heading text-xs sm:text-sm font-bold text-ink group-hover:text-[#207B6A] transition-colors leading-snug">
                                          {act.title}
                                        </span>
                                      </div>

                                      <div className="text-ink-muted group-hover:text-ink shrink-0 mt-0.5">
                                        {isActExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                                      </div>
                                    </button>

                                    {/* Action Points / Bullets */}
                                    <AnimatePresence>
                                      {isActExpanded && (
                                        <motion.div
                                          initial={{ opacity: 0, height: 0 }}
                                          animate={{ opacity: 1, height: 'auto' }}
                                          exit={{ opacity: 0, height: 0 }}
                                          transition={{ duration: 0.2 }}
                                          className="overflow-hidden border-t border-line/60 px-4 pb-4 pt-3 bg-surface"
                                        >
                                          <ul className="space-y-2 text-xs text-ink font-normal leading-relaxed">
                                            {act.bullets.map((bullet, bIdx) => {
                                              const actorMatch = bullet.match(/\[([^\]]+)\]$/);
                                              const mainText = actorMatch ? bullet.slice(0, bullet.lastIndexOf('[')).trim() : bullet;
                                              const actor = actorMatch ? actorMatch[1] : null;

                                              return (
                                                <li key={bIdx} className="flex items-start gap-2">
                                                  <span className="w-1.5 h-1.5 rounded-full bg-[#207B6A] mt-1.5 shrink-0" />
                                                  <div className="flex-1">
                                                    <span>{mainText}</span>
                                                    {actor && (
                                                      <span className="ml-2 inline-block text-[11px] font-semibold text-white bg-[#207B6A] px-1.5 py-0.2 border border-[#207B6A]">
                                                        [{actor}]
                                                      </span>
                                                    )}
                                                  </div>
                                                </li>
                                              );
                                            })}
                                          </ul>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="px-6 py-3.5 bg-paper border-t border-line flex items-center justify-end shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-5 py-1.5 bg-ink text-surface text-xs font-semibold hover:bg-ink/90 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: CHAMP TOOLKIT (How Toolkit supports Pillar 3) */}
      <AnimatePresence>
        {activeModal === 'toolkit' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="fixed inset-0 bg-ink/70 backdrop-blur-2xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-3xl max-h-[90vh] bg-surface border border-line shadow-2xl flex flex-col z-10 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-5 bg-paper border-b border-line flex items-start justify-between gap-4 shrink-0">
                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-[#207B6A] uppercase tracking-wider font-heading">
                    CHAMP Implementation Roadmap
                  </div>
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-ink leading-snug">
                    Pillar 3: Scaling up and unlocking subnational climate finance for implementation
                  </h3>
                  <p className="text-xs sm:text-sm text-ink-muted font-light pt-0.5">
                    See how the five Toolkit Actions map across the three implementation priorities under Pillar 3.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="p-1.5 text-ink-muted hover:text-ink transition-colors cursor-pointer shrink-0 border border-transparent hover:border-line mt-0.5"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body: 3 Clean, Lightweight Rows with Clickable Action Chips */}
              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 bg-surface space-y-7">
                
                {/* Row 1: 3.1 */}
                <div className="space-y-3 pb-6 border-b border-line/70">
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-bold text-white bg-[#207B6A] px-2 py-0.5 border border-[#207B6A] shrink-0 mt-0.5 font-heading">
                      3.1
                    </span>
                    <h4 className="font-heading text-sm sm:text-base font-bold text-ink leading-snug">
                      {act31Title}
                    </h4>
                  </div>

                  <div className="pl-0 sm:pl-9 space-y-2">
                    <span className="text-[11px] text-ink-muted font-medium block">
                      Relevant Toolkit Actions
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      {[1, 3, 4].map(id => {
                        const theme = getActionTheme(id);
                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => handleActionNavigation(id)}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-paper hover:bg-surface border border-line hover:border-[#207B6A] transition-all text-left cursor-pointer group"
                          >
                            <span 
                              className="px-1.5 py-0.2 text-[10px] font-bold text-white shrink-0"
                              style={{ backgroundColor: theme.hex }}
                            >
                              0{id}
                            </span>
                            <span className="text-xs font-semibold text-ink group-hover:text-[#207B6A] transition-colors">
                              {ACTION_METAS[id].title}
                            </span>
                            <ArrowRight size={12} className="text-ink-muted group-hover:text-[#207B6A] group-hover:translate-x-0.5 transition-transform shrink-0" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Row 2: 3.2 */}
                <div className="space-y-3 pb-6 border-b border-line/70">
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-bold text-white bg-[#207B6A] px-2 py-0.5 border border-[#207B6A] shrink-0 mt-0.5 font-heading">
                      3.2
                    </span>
                    <h4 className="font-heading text-sm sm:text-base font-bold text-ink leading-snug">
                      {act32Title}
                    </h4>
                  </div>

                  <div className="pl-0 sm:pl-9 space-y-2">
                    <span className="text-[11px] text-ink-muted font-medium block">
                      Relevant Toolkit Actions
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      {[3, 4].map(id => {
                        const theme = getActionTheme(id);
                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => handleActionNavigation(id)}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-paper hover:bg-surface border border-line hover:border-[#207B6A] transition-all text-left cursor-pointer group"
                          >
                            <span 
                              className="px-1.5 py-0.2 text-[10px] font-bold text-white shrink-0"
                              style={{ backgroundColor: theme.hex }}
                            >
                              0{id}
                            </span>
                            <span className="text-xs font-semibold text-ink group-hover:text-[#207B6A] transition-colors">
                              {ACTION_METAS[id].title}
                            </span>
                            <ArrowRight size={12} className="text-ink-muted group-hover:text-[#207B6A] group-hover:translate-x-0.5 transition-transform shrink-0" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Row 3: 3.3 */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-bold text-white bg-[#207B6A] px-2 py-0.5 border border-[#207B6A] shrink-0 mt-0.5 font-heading">
                      3.3
                    </span>
                    <h4 className="font-heading text-sm sm:text-base font-bold text-ink leading-snug">
                      {act33Title}
                    </h4>
                  </div>

                  <div className="pl-0 sm:pl-9 space-y-2">
                    <span className="text-[11px] text-ink-muted font-medium block">
                      Relevant Toolkit Actions
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      {[2, 4, 5].map(id => {
                        const theme = getActionTheme(id);
                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => handleActionNavigation(id)}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-paper hover:bg-surface border border-line hover:border-[#207B6A] transition-all text-left cursor-pointer group"
                          >
                            <span 
                              className="px-1.5 py-0.2 text-[10px] font-bold text-white shrink-0"
                              style={{ backgroundColor: theme.hex }}
                            >
                              0{id}
                            </span>
                            <span className="text-xs font-semibold text-ink group-hover:text-[#207B6A] transition-colors">
                              {ACTION_METAS[id].title}
                            </span>
                            <ArrowRight size={12} className="text-ink-muted group-hover:text-[#207B6A] group-hover:translate-x-0.5 transition-transform shrink-0" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="px-6 py-3.5 bg-paper border-t border-line flex items-center justify-end shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-5 py-1.5 bg-ink text-surface text-xs font-semibold hover:bg-ink/90 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
