import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toSentenceCase } from '../data/actionMenuTitles';
import { actionAccentStyle } from '../utils/actionThemes';
import SwedenArchitectureDiagram from './SwedenArchitectureDiagram';
import { CountryJourneyData } from '../types/countryJourney';
import { swedenJourneyDefaultData } from '../data/countryJourneysData';

interface CountryJourneyProps {
  countryData?: CountryJourneyData;
  targetActionId?: number;
  onBackToJourneys?: () => void;
  onNavigateToCoreAction?: (actionId: number) => void;
}

export default function CountryJourney({ 
  countryData = swedenJourneyDefaultData, 
  targetActionId,
  onBackToJourneys, 
  onNavigateToCoreAction 
}: CountryJourneyProps) {
  const [activeTab, setActiveTab] = useState<'context' | 'model'>(() => targetActionId ? 'model' : 'context');
  const [highlightedActionId, setHighlightedActionId] = useState<number | null>(targetActionId || null);

  // Collapsible states for Action 1 to 6 (all collapsed by default)
  const [openActions, setOpenActions] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
  });

  // Handle targetActionId deep link from core action page
  useEffect(() => {
    if (targetActionId) {
      setActiveTab('model');
      setHighlightedActionId(targetActionId);
      setOpenActions(prev => ({
        ...prev,
        [targetActionId]: true
      }));

      // Scroll after DOM elements are mounted and laid out
      const attemptScroll = (attemptsLeft = 8) => {
        const el = document.getElementById(`country-action-${targetActionId}`);
        if (el) {
          // Native scroll into view
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          
          // Container-aware scroll adjustment for <main> wrapper
          const mainEl = document.querySelector('main');
          if (mainEl) {
            const elRect = el.getBoundingClientRect();
            const mainRect = mainEl.getBoundingClientRect();
            const targetScrollTop = mainEl.scrollTop + (elRect.top - mainRect.top) - 40;
            if (Math.abs(elRect.top - mainRect.top - 40) > 15) {
              mainEl.scrollTo({ top: Math.max(0, targetScrollTop), behavior: 'smooth' });
            }
          }
        } else if (attemptsLeft > 0) {
          setTimeout(() => attemptScroll(attemptsLeft - 1), 80);
        }
      };

      const timer1 = setTimeout(() => attemptScroll(8), 60);
      const timer2 = setTimeout(() => attemptScroll(4), 250);
      const timer3 = setTimeout(() => attemptScroll(2), 550);
      const clearHighlightTimer = setTimeout(() => setHighlightedActionId(null), 4000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(clearHighlightTimer);
      };
    }
  }, [targetActionId]);

  const toggleAction = (id: number) => {
    setOpenActions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const expandAllActions = () => {
    setOpenActions({ 1: true, 2: true, 3: true, 4: true, 5: true, 6: true });
  };

  const collapseAllActions = () => {
    setOpenActions({ 1: false, 2: false, 3: false, 4: false, 5: false, 6: false });
  };

  // If the country is not ready or has no content
  if (!countryData.isReady && (!countryData.contextSections || countryData.contextSections.length === 0)) {
    return (
      <div className="max-w-6xl mx-auto pb-36">
        <div className="mb-10">
          <div className="mb-5">
            <span className="font-bold tracking-[0.15em] uppercase text-xs text-accent">
              Country Journey
            </span>
          </div>
          
          <h1 className="title-h1 mb-6">
            {countryData.headerTitle || `${countryData.countryName}'s Journey to Multilevel Climate Implementation`}
          </h1>

          <p className="body-text-md leading-relaxed">
            {countryData.headerDescription || countryData.summary}
          </p>
        </div>

        <div className="p-12 bg-paper text-center py-24 space-y-3">
          <h3 className="body-text font-bold">
            {countryData.countryName} Country Journey Coming Soon
          </h3>
          <p className="body-text-sm max-w-md mx-auto leading-relaxed">
            We are structuring multilevel climate governance datasets, case studies, and architecture diagrams for {countryData.countryName}. Updates will synchronize automatically from Airtable.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-36">
      {/* Header Banner */}
      <div className="mb-10">
        <div className="mb-5">
          <span className="font-bold tracking-[0.15em] uppercase text-xs text-accent">
            Country Journey
          </span>
        </div>
        
        <h1 className="title-h1 mb-6">
          {countryData.headerTitle || `${countryData.countryName}’s Multilevel Governance and Implementation Journey`}
        </h1>

        <p className="body-text-md leading-relaxed">
          {countryData.headerDescription || countryData.summary}
        </p>
      </div>

      {/* Main Tabs Navigation (A & B) */}
      <div role="tablist" aria-label="Country journey sections" className="flex flex-col sm:flex-row border-b border-line mb-10">
        <button
          role="tab"
          aria-selected={activeTab === 'context'}
          onClick={() => setActiveTab('context')}
          className={`flex-1 min-w-0 text-left px-4 sm:px-5 py-4 border-b-4 sm:-mb-px cursor-pointer focus:outline-none ${
            activeTab === 'context'
              ? 'bg-paper-strong border-accent text-accent'
              : 'bg-surface border-transparent text-ink hover:text-accent'
          }`}
        >
          <span className="block text-[11px] font-bold uppercase tracking-wider mb-1">
            A · {countryData.tabATitle || 'The Context'}
          </span>
          <span className="block body-text-md font-bold leading-snug text-inherit">
            {countryData.tabASubtitle || 'An Evolving Mission-Oriented Approach to Urban Climate Transition'}
          </span>
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'model'}
          onClick={() => setActiveTab('model')}
          className={`flex-1 min-w-0 text-left px-4 sm:px-5 py-4 border-b-4 sm:-mb-px cursor-pointer focus:outline-none ${
            activeTab === 'model'
              ? 'bg-paper-strong border-accent text-accent'
              : 'bg-surface border-transparent text-ink hover:text-accent'
          }`}
        >
          <span className="block text-[11px] font-bold uppercase tracking-wider mb-1">
            B · {countryData.tabBTitle || 'The Multilevel Model'}
          </span>
          <span className="block body-text-md font-bold leading-snug text-inherit">
            {countryData.tabBSubtitle || 'Architecture Diagram & 6 Multilevel Governance Actions'}
          </span>
        </button>
      </div>

      {/* Tab Contents */}
      <AnimatePresence mode="wait">
        {activeTab === 'context' ? (
          /* =========================================================================
             TAB A: THE COUNTRY CONTEXT (CLEAN EDITORIAL TEXT, NO BOXES, CLEAN LISTS)
             ========================================================================= */
          <motion.div
            key="tab-a"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-12"
          >
            {/* Section 1: Central Premises if available */}
            {countryData.premises && countryData.premises.length > 0 && (
              <div className="space-y-4">
                <h2 className="title-h2">
                  {countryData.premisesHeading || `Central Premises of ${countryData.countryName}’s Multilevel Journey`}
                </h2>
                {countryData.premisesIntro && (
                  <p className="body-text-md leading-relaxed">
                    {countryData.premisesIntro}
                  </p>
                )}

                <div className="space-y-4 pt-2">
                  {countryData.premises.map((premise, idx) => (
                    <div key={idx} className="flex gap-4 items-center p-4 md:p-5 bg-paper">
                      <div className="w-8 shrink-0 font-display text-[28px] font-bold leading-none text-accent">
                        {premise.number || idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="body-text-md font-bold mb-1">
                          {premise.title}
                        </h3>
                        <p className="body-text-md leading-relaxed text-ink/90">
                          {premise.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <hr className="border-line" />
              </div>
            )}

            {/* Context Sections */}
            {countryData.contextSections && countryData.contextSections.map((section, secIdx) => (
              <div key={secIdx} className="space-y-4">
                <h2 className="title-h2">
                  {section.title}
                </h2>

                {section.paragraphs && section.paragraphs.map((p, pIdx) => (
                  <div key={pIdx} className="body-text-md leading-relaxed space-y-2">
                    <ReactMarkdown
                      components={{
                        strong: ({ children }) => <strong className="text-ink font-medium">{children}</strong>,
                        p: ({ children }) => <span>{children}</span>
                      }}
                    >
                      {p}
                    </ReactMarkdown>
                  </div>
                ))}

                {section.bulletPoints && section.bulletPoints.length > 0 && (
                  <ul className="space-y-2.5 pl-2 pt-1">
                    {section.bulletPoints.map((bp, bpIdx) => (
                      <li key={bpIdx} className="body-text-md flex items-start gap-3">
                        <span className="w-1.5 h-1.5 bg-accent mt-2.5 shrink-0" />
                        <span>
                          {bp.label && <strong className="text-ink font-medium">{bp.label} </strong>}
                          {bp.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {/* Transition to Model Link */}
            <div className="pt-4 border-t border-line flex items-center justify-between">
              <span className="body-text-sm text-ink-muted">
                Proceed to explore the architecture diagram and implementation pathways.
              </span>
              <button
                onClick={() => setActiveTab('model')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-sm font-semibold uppercase tracking-wider rounded-none hover:bg-ink transition-colors cursor-pointer"
              >
                View the multilevel model <ArrowRight size={16} strokeWidth={2.5} />
              </button>
            </div>
          </motion.div>
        ) : (
          /* =========================================================================
             TAB B: MULTILEVEL CLIMATE GOVERNANCE AND IMPLEMENTATION MODEL
             ========================================================================= */
          <motion.div
            key="tab-b"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-12"
          >
            {/* Overview & Architecture Diagram */}
            <div className="space-y-4">
              <div>
                <h3 className="title-h2 mb-3">
                  {countryData.modelHeading || `${countryData.countryName}’s Multilevel Climate Governance and Implementation Model`}
                </h3>
                <div className="body-text-md leading-relaxed">
                  <ReactMarkdown
                    components={{
                      strong: ({ children }) => <strong className="text-ink font-medium">{children}</strong>,
                      p: ({ children }) => <p className="mb-2">{children}</p>
                    }}
                  >
                    {countryData.modelOverview}
                  </ReactMarkdown>
                </div>
                {countryData.modelDiagramNote && (
                  <p className="body-text-sm leading-relaxed mt-1">
                    {countryData.modelDiagramNote}
                  </p>
                )}
              </div>

              {/* Minimal Clean Image Diagram Container with Fullscreen & Zoom */}
              {/* If countryData provides custom diagram image url, it passes down, else defaults to local sweden blueprint */}
              <SwedenArchitectureDiagram 
                customImageUrl={countryData.diagramImageUrl}
                customTitle={`${countryData.countryName}’s Multilevel Climate Governance Architecture`}
              />
            </div>

            {/* The Actions Header & Expand Controls */}
            {countryData.actions && countryData.actions.length > 0 && (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-line">
                  <div>
                    <h3 className="title-h2">
                      {countryData.actionsHeading || `${countryData.countryName}'s Journey Across the 6 Implementation Pathways`}
                    </h3>
                    <p className="body-text-md text-ink-muted mt-2">
                      {countryData.actionsSubtitle || `How the ${countryData.countryName} mission model maps into the Toolkit's 6 core multilevel climate governance actions.`}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-auto whitespace-nowrap">
                    <button
                      type="button"
                      onClick={expandAllActions}
                      className="px-2.5 py-1 bg-surface hover:bg-paper border border-line rounded-none text-[11px] font-medium text-ink transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Expand all
                    </button>
                    <button
                      type="button"
                      onClick={collapseAllActions}
                      className="px-2.5 py-1 bg-surface hover:bg-paper border border-line rounded-none text-[11px] font-medium text-ink-muted hover:text-ink transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Collapse all
                    </button>
                  </div>
                </div>

                {/* Render Actions */}
                {countryData.actions.map((act) => {
                  const actionNum = act.actionNumber;
                  const isOpen = openActions[actionNum];

                  const isHighlighted = highlightedActionId === actionNum;

                  return (
                    <div 
                      key={actionNum}
                      id={`country-action-${actionNum}`}
                      // Each action card uses its action's colour for the label, chevron, border and links
                      style={actionAccentStyle(actionNum)}
                      className={`bg-surface border rounded-none overflow-hidden scroll-mt-20 sm:scroll-mt-24 ${
                        isHighlighted ? 'border-accent' : 'border-line hover:border-accent'
                      }`}
                    >

                      <button
                        onClick={() => toggleAction(actionNum)}
                        className="w-full p-6 sm:p-8 flex items-start justify-between gap-4 text-left focus:outline-none cursor-pointer rounded-none"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <span className="font-bold tracking-[0.15em] uppercase text-xs text-accent">
                              Action {actionNum}
                            </span>
                            <span className="body-text-sm text-ink-muted">{toSentenceCase((act.actionThemeTitle || '').replace(/^[•\s]+/, ''))}</span>
                          </div>
                          <h4 className="body-text font-bold leading-snug">
                            {toSentenceCase(act.title || '')}
                          </h4>
                        </div>

                        <div className={`p-2 shrink-0 text-accent ${isOpen ? 'rotate-180' : ''}`}>
                          <ChevronDown size={20} />
                        </div>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-6 sm:p-8 pt-0 border-t border-line/60 space-y-6">
                              <div className="body-text-md leading-relaxed space-y-4 pt-6">
                                {act.paragraphs.map((p, pIdx) => (
                                  <div key={pIdx} className="space-y-2">
                                    <ReactMarkdown
                                      components={{
                                        strong: ({ children }) => <strong className="text-ink font-medium">{children}</strong>,
                                        p: ({ children }) => <p className="mb-2 leading-relaxed">{children}</p>,
                                        ol: ({ children }) => <ol className="list-decimal pl-5 space-y-2 mt-2">{children}</ol>,
                                        ul: ({ children }) => <ul className="list-disc pl-5 space-y-2 mt-2">{children}</ul>,
                                        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                                      }}
                                    >
                                      {p}
                                    </ReactMarkdown>
                                  </div>
                                ))}
                              </div>

                              {/* Case Study if present */}
                              {act.caseStudy && (act.caseStudy.title || (act.caseStudy.paragraphs && act.caseStudy.paragraphs.length > 0)) && (
                                <div className="mt-8 pt-6 border-t border-line/60">
                                  {act.caseStudy.title && (
                                    <h5 className="body-text-md font-bold mb-3 leading-snug">
                                      {act.caseStudy.title}
                                    </h5>
                                  )}
                                  {act.caseStudy.paragraphs && (
                                    <div className="body-text-md leading-relaxed space-y-3">
                                      {act.caseStudy.paragraphs.map((cp, cIdx) => (
                                        <div key={cIdx}>
                                          <ReactMarkdown
                                            components={{
                                              strong: ({ children }) => <strong className="text-ink font-medium">{children}</strong>,
                                              p: ({ children }) => <p className="mb-2 leading-relaxed">{children}</p>,
                                            }}
                                          >
                                            {cp}
                                          </ReactMarkdown>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* What this has enabled */}
                              {act.enabledSummary && (
                                <div className={act.caseStudy && (act.caseStudy.title || (act.caseStudy.paragraphs && act.caseStudy.paragraphs.length > 0)) ? "mt-8 pt-6 border-t border-line/60" : "mt-8"}>
                                  <div className="p-5 sm:p-6 bg-paper space-y-2">
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-accent">
                                      What this has enabled
                                    </div>
                                    <p className="body-text-md leading-relaxed">
                                      {act.enabledSummary}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {/* Seamless Action Guidance Link in Footer */}
                              {onNavigateToCoreAction && (
                                <div className="pt-4 border-t border-line/60 flex justify-end">
                                  <button
                                    type="button"
                                    onClick={() => onNavigateToCoreAction(actionNum)}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-accent text-white text-xs font-semibold rounded-none hover:bg-ink transition-colors cursor-pointer"
                                  >
                                    See related toolkit guidance <ArrowRight size={14} strokeWidth={2.5} />
                                  </button>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
