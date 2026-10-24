import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight } from 'lucide-react';
import { getActionTheme } from '../utils/actionThemes';
import { RoadmapPillar, defaultChampRoadmapData } from '../data/champRoadmapData';

export interface ChampRoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToAction: (actionId: number) => void;
  highlightedComponent?: string | string[]; // e.g. '3.1', '3.2', '3.3' or '3.1, 3.2'
  roadmapPillars?: RoadmapPillar[];
}

interface ActionMeta {
  id: number;
  title: string;
  subtitle: string;
}

const ACTION_METAS: Record<number, ActionMeta> = {
  1: { id: 1, title: "Shared Commitments", subtitle: "Political alignment & collective ownership" },
  2: { id: 2, title: "Enabling Environments", subtitle: "Policy, legal & regulatory frameworks" },
  3: { id: 3, title: "Governance and Coordination", subtitle: "Coordination structures & vertical integration" },
  4: { id: 4, title: "Investment Planning", subtitle: "Project pipelines & capital strategies" },
  5: { id: 5, title: "Finance and Implementation", subtitle: "Diversified public & private instruments" },
  6: { id: 6, title: "Learning and Scale", subtitle: "Monitoring, iteration & continuous scaling" },
};

export default function ChampRoadmapModal({
  isOpen,
  onClose,
  onNavigateToAction,
  highlightedComponent,
  roadmapPillars = defaultChampRoadmapData
}: ChampRoadmapModalProps) {
  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleActionClick = (actionId: number) => {
    onClose();
    onNavigateToAction(actionId);
  };

  const pillars = (roadmapPillars && roadmapPillars.length > 0) ? roadmapPillars : defaultChampRoadmapData;
  const pillar3 = pillars.find(p => p.number === 3) || defaultChampRoadmapData[2];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-ink/70 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl max-h-[92vh] bg-surface border border-line shadow-2xl flex flex-col z-10 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Bar Header */}
          <div className="px-6 md:px-8 py-5 bg-paper border-b border-line flex items-start justify-between gap-4 shrink-0">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-[10px] sm:text-[11px] font-bold text-white uppercase tracking-[0.2em] bg-[#207B6A] px-2.5 py-0.5 border border-[#207B6A]">
                  CHAMP Implementation Roadmap 2026–2028
                </span>
              </div>
              <h2 className="title-h2">
                {pillar3.title}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-ink-muted hover:text-ink hover:bg-surface transition-colors rounded-none border border-transparent hover:border-line cursor-pointer shrink-0"
              aria-label="Close roadmap explainer"
            >
              <X size={18} className="stroke-[1.75]" />
            </button>
          </div>

          {/* Context Narrative Banner */}
          <div className="body-text-sm px-6 md:px-8 py-3 bg-grey-light border-b border-line leading-relaxed flex items-start gap-2.5 shrink-0">
            <span className="w-1.5 h-1.5 bg-[#207B6A] mt-1.5 shrink-0 rounded-full"></span>
            <p>
              The CHAMP Implementation Roadmap translates national commitments into action across three interconnected pillars. <strong>Pillar 3 focuses on subnational climate finance</strong>. All five Toolkit Actions map against and support these three finance activities.
            </p>
          </div>

          {/* Modal Body - Scrollable Activities List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 space-y-4">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-ink-muted">
                Pillar 3 Activities & Mapped Toolkit Actions
              </h3>
              <span className="text-[11.5px] text-ink-muted font-light">
                Click any action to open its guidance page
              </span>
            </div>

            {pillar3.activities.map((act) => {
              const highlightedList = Array.isArray(highlightedComponent)
                ? highlightedComponent
                : (highlightedComponent ? highlightedComponent.split(/[,&/]/).map(s => s.trim()) : []);
              const isTargeted = highlightedList.includes(act.code) || highlightedComponent === act.code;

              return (
                <div
                  key={act.code}
                  className={`border transition-all ${
                    isTargeted
                      ? 'bg-surface border-[#207B6A] ring-1 ring-[#207B6A]'
                      : 'bg-surface border-line hover:border-ink-muted/30'
                  }`}
                >
                  <div className="p-5">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                      {/* Left: Pillar code and updated activity title */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2.5">
                          <span className="text-[11px] font-bold text-white bg-[#207B6A] px-2.5 py-0.5 border border-[#207B6A]">
                            Activity {act.code}
                          </span>
                        </div>

                        <h4 className="font-heading text-base md:text-lg font-bold text-ink leading-snug">
                          {act.title}
                        </h4>
                      </div>

                      {/* Right: Mapped Actions Supporting This */}
                      <div className="lg:w-80 shrink-0 flex flex-col gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 lg:border-l lg:pl-5 border-line">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                          Actions Supporting This
                        </span>
                        <div className="flex flex-col gap-1.5">
                          {(act.actionIds || []).map((actionId) => {
                            const theme = getActionTheme(actionId);
                            const meta = ACTION_METAS[actionId];
                            return (
                              <button
                                key={actionId}
                                onClick={() => handleActionClick(actionId)}
                                className="w-full flex items-center justify-between px-3 py-2 border border-line bg-surface text-left transition-colors group cursor-pointer"
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.borderColor = theme.hex;
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.borderColor = '';
                                }}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span 
                                    className="px-1.5 py-0.5 text-[10px] font-bold text-white shrink-0"
                                    style={{ backgroundColor: theme.hex }}
                                  >
                                    0{actionId}
                                  </span>
                                  <span className="text-xs font-semibold text-ink truncate">
                                    {meta?.title || `Action 0${actionId}`}
                                  </span>
                                </div>
                                <ArrowRight 
                                  size={13} 
                                  className="shrink-0 ml-1 text-ink-muted group-hover:text-ink group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" 
                                  style={{ color: theme.hex }}
                                />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Footer Bar - Clean, without 'Endorsed by 70+ countries' */}
          <div className="px-6 md:px-8 py-4 bg-paper border-t border-line flex items-center justify-end shrink-0">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-ink text-surface text-xs font-semibold hover:bg-ink/90 transition-colors cursor-pointer"
            >
              Return to Toolkit
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
