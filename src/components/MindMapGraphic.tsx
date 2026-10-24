import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { actionsData as fallbackActionsData } from '../data/content';
import { ArrowRight, Maximize2, X, ChevronDown, RotateCcw } from 'lucide-react';
import { ACTION_MENU_TITLES, toSentenceCase } from "../data/actionMenuTitles";
import { getActionTheme, actionAccentStyle } from '../utils/actionThemes';
import { ExampleModal } from './StepView';

const LEAD_ACTORS = [
  'Finance Ministry',
  'Planning Ministry',
  'Climate Ministry',
  'Urban / Local Government Ministry',
  'Industry Ministry',
  'Procurement Authority'
];

// Helper to match lead actors flexibly
function matchesActor(lead: string, filterActor: string): boolean {
  const a = (lead || '').trim().toLowerCase();
  const b = (filterActor || '').trim().toLowerCase();
  if (!a || !b) return false;
  if (a === b) return true;
  if (b.includes('climate') && a.includes('climate')) return true;
  if (b.includes('planning') && a.includes('planning')) return true;
  if (b.includes('finance') && a.includes('finance')) return true;
  if (b.includes('urban') && a.includes('urban')) return true;
  if (b.includes('industry') && a.includes('industry')) return true;
  if (b.includes('procurement') && a.includes('procurement')) return true;
  return false;
}

export default function MindMapGraphic({ 
  onNavigateToStep,
  actionsData: passedActions,
  showHeading = true,
  showFilter = true,
  layout = 'horizontal',
  showCardFooter = true,
  cardsNavigate = false,
  onExploreAll
}: { 
  onNavigateToStep: (stepId: number, pathwayIdx?: number, example?: any) => void;
  actionsData?: any[];
  showHeading?: boolean;
  showFilter?: boolean;
  // 'vertical' keeps the action cards in place and stacks pathways, then resources, below them
  layout?: 'horizontal' | 'vertical';
  // Pathway count + "Explore" row at the bottom of each action card
  showCardFooter?: boolean;
  // When true, clicking an action card opens that action's page instead of expanding it in place
  cardsNavigate?: boolean;
  // When set, an "Explore all actions" button is shown below the action cards
  onExploreAll?: () => void;
}) {
  const actions = passedActions && passedActions.length > 0 ? passedActions : fallbackActionsData;
  const [activeActionId, setActiveActionId] = useState<number | null>(null);
  const [activePathwayIdx, setActivePathwayIdx] = useState<number | null>(null);
  const [selectedActors, setSelectedActors] = useState<string[]>([]);
  // Example/tool opened in a popup on this page (rather than navigating to the action page)
  const [selectedExample, setSelectedExample] = useState<any | null>(null);

  // Toggle single lead actor in selected list
  const handleToggleActor = (actor: string) => {
    setSelectedActors((prev) => {
      if (prev.includes(actor)) {
        return prev.filter((a) => a !== actor);
      } else {
        return [...prev, actor];
      }
    });
  };

  const handleClearAll = () => {
    setSelectedActors([]);
  };

  // Filter actions and pathways based on selected lead actors
  const filteredActions = useMemo(() => {
    if (selectedActors.length === 0) {
      return actions.map((action) => ({
        ...action,
        displayPathways: (action.pathways || []).map((p: any, idx: number) => ({
          ...p,
          originalIndex: idx
        }))
      }));
    }

    return actions
      .map((action) => {
        const matching = (action.pathways || [])
          .map((p: any, idx: number) => ({ ...p, originalIndex: idx }))
          .filter((p: any) => {
            const leads: string[] = Array.isArray(p.potentialNationalLead) ? p.potentialNationalLead : [];
            return selectedActors.some((sel) => leads.some((lead) => matchesActor(lead, sel)));
          });
        return {
          ...action,
          displayPathways: matching
        };
      })
      .filter((action) => action.displayPathways.length > 0);
  }, [actions, selectedActors]);

  // If currently active action is no longer visible under the filter, fallback or adjust
  const activeAction = filteredActions.find((a) => a.id === activeActionId);
  const activeDisplayPathways = activeAction ? activeAction.displayPathways : [];
  const activePathway = activeAction && activePathwayIdx !== null ? activeDisplayPathways[activePathwayIdx] : null;
  const activeTheme = activeAction ? getActionTheme(activeAction.id) : null;

  // Keep activeActionId aligned if current active action is not in filtered list
  useEffect(() => {
    if (activeActionId !== null && filteredActions.length > 0) {
      const exists = filteredActions.some((a) => a.id === activeActionId);
      if (!exists) {
        setActiveActionId(filteredActions[0].id);
        setActivePathwayIdx(null);
      }
    }
  }, [filteredActions, activeActionId]);

  // Ensure activePathwayIdx stays within bounds of activeDisplayPathways
  useEffect(() => {
    if (activePathwayIdx !== null) {
      if (activeDisplayPathways.length === 0) {
        setActivePathwayIdx(null);
      } else if (activePathwayIdx >= activeDisplayPathways.length) {
        setActivePathwayIdx(0);
      }
    }
  }, [activeDisplayPathways, activePathwayIdx]);

  // Desktop columns for the action cards: 5 equal columns, with the expanded card
  // taking a wider column in the vertical layout (room for the "Go to action page" button).
  const actionGridColumns = Array.from({ length: Math.max(5, filteredActions.length) }, (_, i) => {
    const action = filteredActions[i];
    const expanded = layout === 'vertical' && action && action.id === activeActionId;
    return expanded ? 'minmax(0,1.35fr)' : 'minmax(0,1fr)';
  }).join(' ');

  return (
    <div className={`w-full flex flex-col items-center ${showHeading ? 'py-12' : 'pt-4 pb-12'} min-h-[520px]`}>
      {showHeading && (
      <div className="text-left mb-6 w-full max-w-6xl mx-auto flex flex-col items-start">
        <h2 className="title-h2 text-dark-green mb-2">
          Explore 5 actions
        </h2>
        <p className="body-text-md mb-3.5">
          {cardsNavigate
            ? "Click any action card to open its implementation pathways and key resources."
            : activeActionId 
            ? "Click any action card to switch, click pathways to view key resources, or click (→) to navigate directly." 
            : "Click any action card to explore its implementation pathways and key resources, or click (→) to navigate directly."}
        </p>
      </div>
      )}

      {/* Mind Map Canvas Container */}
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center overflow-x-auto pb-4 custom-scrollbar">
        {/* Actor filter: every lead actor as a clickable tag, styled like the actor tags on action pages */}
        {showFilter && (
          <div className="w-full max-w-6xl flex flex-col items-start gap-1.5 mb-4 px-1">
            <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">
              Filter by actor
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {/* "All" is selected when no actor is picked; clicking it clears the filter */}
              {[null, ...LEAD_ACTORS].map((actor) => {
                const isSelected = actor === null ? selectedActors.length === 0 : selectedActors.includes(actor);
                return (
                  <button
                    key={actor ?? 'all'}
                    type="button"
                    onClick={() => (actor === null ? handleClearAll() : handleToggleActor(actor))}
                    aria-pressed={isSelected}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[12px] text-ink rounded-none transition-colors select-none cursor-pointer ${
                      isSelected
                        ? 'font-medium bg-accent/15 hover:bg-accent/25'
                        : 'font-normal bg-ink-muted/10 hover:bg-ink-muted/20'
                    }`}
                  >
                    {actor ?? 'All'}
                    {actor !== null && isSelected && <X size={11} className="text-ink-muted" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Horizontal layout: way back to the grid once an action is expanded */}
        {activeActionId !== null && layout !== 'vertical' && (
          <div className="w-full max-w-5xl flex items-center mb-2.5 px-1">
            <button
              onClick={() => {
                setActiveActionId(null);
                setActivePathwayIdx(null);
              }}
              className="text-[11px] text-accent hover:underline lowercase font-medium cursor-pointer"
            >
              view grid
            </button>
          </div>
        )}

        {filteredActions.length === 0 ? (
          <div className="py-12 px-6 text-center max-w-md mx-auto bg-surface border border-dashed border-line">
            <h4 className="text-sm font-semibold text-ink mb-1">
              No pathways match the selected actor{selectedActors.length > 1 ? 's' : ''}
            </h4>
            <p className="text-xs text-ink-muted mb-4">
              Action 4 is currently populated with full actor targeting. Other actions will be populated soon.
            </p>
            <button
              onClick={handleClearAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-ink text-paper text-xs font-semibold rounded-none cursor-pointer"
            >
              <RotateCcw size={12} />
              <span>Show All Actions</span>
            </button>
          </div>
        ) : (!activeActionId || layout === 'vertical') ? (
          <div className="w-full max-w-6xl mx-auto flex flex-col">
          {/* Grid View: 5 Action Cards (stays visible in the vertical layout) */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:[grid-template-columns:var(--action-cols)] ${layout === 'vertical' ? 'gap-3' : 'gap-4'} w-full transition-[grid-template-columns] duration-200`}
            style={{ '--action-cols': actionGridColumns } as React.CSSProperties}
          >
            {filteredActions.map((action) => {
              const pathwayCount = action.displayPathways?.length || 0;
              const pathwayLabel = pathwayCount === 1 ? 'Pathway' : 'Pathways';
              const isSelected = activeActionId === action.id;

              return (
                <div
                  key={action.id}
                  onClick={() => {
                    if (cardsNavigate) {
                      onNavigateToStep(action.id);
                    } else if (isSelected) {
                      setActiveActionId(null);
                      setActivePathwayIdx(null);
                    } else {
                      setActiveActionId(action.id);
                      setActivePathwayIdx(0);
                    }
                  }}
                  aria-pressed={layout === 'vertical' ? isSelected : undefined}
                  /* Each card takes its action's colour: number, buttons, thick top border and hover outline.
                     Only the top has a border (side borders would mitre its ends); the outline is an inset ring. */
                  style={actionAccentStyle(action.id)}
                  className={`cursor-pointer flex flex-col justify-between p-4 border-t-[6px] border-accent shadow-2xs hover:ring-1 hover:ring-inset hover:ring-accent bg-surface ${layout === 'vertical' ? 'min-h-[175px]' : ''} overflow-hidden w-full relative rounded-none select-none ${
                    isSelected ? 'ring-1 ring-inset ring-accent' : ''
                  }`}
                >
                  <div className={`flex flex-col justify-between h-full ${layout === 'vertical' ? 'min-h-[145px]' : ''}`}>
                    <div>
                      <div className={`flex items-start justify-between gap-3 ${layout === 'vertical' ? 'mb-3' : 'mb-2'}`}>
                        <span 
                          className={`font-display ${layout === 'vertical' ? 'text-[38px]' : 'text-[30px]'} font-bold leading-none text-accent`}
                        >
                          {action.id}
                        </span>
                        
                        {/* Once a card with a footer is expanded, the arrow becomes a full "Go to action page" button */}
                        {showCardFooter && isSelected ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigateToStep(action.id);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-2 bg-accent text-white text-xs font-semibold rounded-none hover:bg-ink transition-colors cursor-pointer whitespace-nowrap"
                        >
                          Go to action page <ArrowRight size={14} strokeWidth={2.5} />
                        </button>
                        ) : (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigateToStep(action.id);
                          }}
                          title={`Go to Action ${action.id} Page`}
                          className="w-8 h-8 flex items-center justify-center text-ink-muted hover:text-accent group/btn cursor-pointer transition-colors"
                        >
                          <ArrowRight size={20} className="group-hover/btn:translate-x-0.5 transition-transform" />
                        </button>
                        )}
                      </div>

                      <h4 className={`${layout === 'vertical' ? 'body-text' : 'body-text-md'} font-bold leading-snug mb-1`}>
                        {ACTION_MENU_TITLES[action.id] ?? action.title}
                      </h4>
                      <p className={`body-text-sm text-ink-muted leading-snug ${layout === 'vertical' ? 'mb-3' : ''}`}>
                        {toSentenceCase(action.title)}
                      </p>
                    </div>

                    {showCardFooter && (
                    <div className="pt-3 border-t border-line/80 flex items-center justify-between gap-2 text-xs">
                      <span className="font-medium text-ink-muted">
                        {pathwayCount} {pathwayLabel}
                        {selectedActors.length > 0 && ` matching`}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isSelected) {
                            setActiveActionId(null);
                            setActivePathwayIdx(null);
                          } else {
                            setActiveActionId(action.id);
                            setActivePathwayIdx(0);
                          }
                        }}
                        aria-expanded={isSelected}
                        className="inline-flex items-center gap-0.5 text-accent text-xs font-semibold hover:underline underline-offset-2 cursor-pointer"
                      >
                        Explore
                        <ChevronDown size={14} strokeWidth={2.5} className={isSelected ? 'rotate-180' : ''} />
                      </button>
                    </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Vertical layout: pathways, then key resources, stacked below the action cards */}
          {layout === 'vertical' && activeAction && (
            <div className="w-full flex flex-col gap-8 mt-8" style={actionAccentStyle(activeAction.id)}>
              <section>
                <div className="flex items-baseline gap-2 mb-3">
                  <h3 className="body-text-md font-bold">
                    Implementation pathways
                  </h3>
                  <span className="body-text-sm text-ink-muted">
                    {ACTION_MENU_TITLES[activeAction.id] ?? activeAction.title} · {activeDisplayPathways.length}
                  </span>
                </div>
                <motion.div
                  key={`v-pathways-${activeAction.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.12, ease: "easeOut" }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
                >
                  {activeDisplayPathways.map((pathway: any, idx: number) => {
                    const isActive = activePathwayIdx === idx;
                    const originalIdx = pathway.originalIndex !== undefined ? pathway.originalIndex : idx;
                    const keyCount = pathway.illustrativeExamples?.length || 0;

                    return (
                      <div
                        key={idx}
                        onClick={() => setActivePathwayIdx(isActive ? null : idx)}
                        aria-pressed={isActive}
                        className={`p-4 cursor-pointer rounded-none flex flex-col gap-2 select-none border hover:border-accent ${
                          isActive ? 'border-accent bg-surface' : 'bg-surface border-line'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="body-text-sm font-semibold leading-snug break-words">
                            {pathway.title || pathway.name}
                          </h4>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigateToStep(activeAction.id, originalIdx);
                            }}
                            title="Go to Pathway Page"
                            className="shrink-0 w-6 h-6 flex items-center justify-center text-ink-muted hover:text-accent cursor-pointer transition-colors"
                          >
                            <ArrowRight size={14} />
                          </button>
                        </div>

                        {selectedActors.length > 0 && pathway.potentialNationalLead && pathway.potentialNationalLead.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {pathway.potentialNationalLead.map((lead: string, lIdx: number) => {
                              const isLeadSelected = selectedActors.some((sel) => matchesActor(lead, sel));
                              return (
                                <span
                                  key={lIdx}
                                  className={`px-1.5 py-0.5 text-[10px] rounded-none ${
                                    isLeadSelected
                                      ? 'bg-accent/15 text-accent font-semibold border border-accent/30'
                                      : 'bg-surface border border-line text-ink-muted'
                                  }`}
                                >
                                  {lead}
                                </span>
                              );
                            })}
                          </div>
                        )}

                        {keyCount > 0 && (
                          <span className="text-xs font-medium text-ink-muted mt-auto">
                            {keyCount} {keyCount === 1 ? 'Key Resource' : 'Key Resources'}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </motion.div>
              </section>

              {activePathway && (
                <section>
                  <div className="flex items-baseline gap-2 mb-3">
                    <h3 className="body-text-md font-bold">
                      Key resources
                    </h3>
                    <span className="body-text-sm text-ink-muted">
                      {activePathway.title || activePathway.name} · {activePathway.illustrativeExamples?.length || 0}
                    </span>
                  </div>
                  <motion.div
                    key={`v-resources-${activeAction.id}-${activePathwayIdx}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.12, ease: "easeOut" }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
                  >
                    {activePathway.illustrativeExamples && activePathway.illustrativeExamples.length > 0 ? (
                      activePathway.illustrativeExamples.map((ex: any, idx: number) => {
                        return (
                          <div
                            key={idx}
                            onClick={() => setSelectedExample(ex)}
                            className="p-4 cursor-pointer bg-surface border border-line hover:border-accent rounded-none flex items-start justify-between gap-2 select-none"
                          >
                            <div className="flex-1 min-w-0">
                              {ex.type && (
                                <span className="inline-block mb-1.5 px-1.5 py-0.5 rounded-none text-[10px] font-bold uppercase tracking-wider bg-surface border border-accent text-accent">
                                  {ex.type}
                                </span>
                              )}
                              <h4 className="body-text-sm font-medium leading-snug break-words">
                                {ex.title}
                              </h4>
                            </div>
                            <Maximize2 size={14} className="shrink-0 mt-0.5 text-accent" />
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-4 border border-dashed border-line text-center text-ink-muted text-xs italic bg-surface/30 rounded-none sm:col-span-2 lg:col-span-3">
                        No key resources in this pathway.
                      </div>
                    )}
                  </motion.div>
                </section>
              )}
            </div>
          )}
          </div>
        ) : (
          /* Expanded 3-Column View: Mid-Aligned (Centered), Stable, Zero-Jitter */
          <div className="w-full flex items-center justify-center gap-2.5 sm:gap-3.5 md:gap-4 min-w-0 min-h-[440px]">
            {/* Column 1: Action Cards Stack (Vertically Mid-Aligned) */}
            <div className="flex flex-col justify-center w-[200px] sm:w-[230px] md:w-[250px] shrink-0">
              <div className="text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-2 text-center flex items-center justify-center shrink-0">
                Actions
              </div>
              <div className="flex flex-col gap-2">
                {filteredActions.map((action) => {
                  const isSelected = activeActionId === action.id;
                  const theme = getActionTheme(action.id);

                  return (
                    <div
                      key={action.id}
                      onClick={() => {
                        if (isSelected) {
                          setActiveActionId(null);
                          setActivePathwayIdx(null);
                        } else {
                          setActiveActionId(action.id);
                          setActivePathwayIdx(0);
                        }
                      }}
                      style={{
                        borderLeftColor: isSelected ? theme.hex : 'transparent',
                        backgroundColor: isSelected ? theme.bgLight : undefined,
                        borderColor: isSelected ? theme.borderSubtle : undefined,
                      }}
                      className={`cursor-pointer group flex flex-col relative rounded-none select-none p-2.5 sm:p-3 border-t border-r border-b border-l-4 border-line transition-colors duration-150 ${
                        isSelected
                          ? 'shadow-xs z-10'
                          : 'bg-surface/70 hover:bg-surface opacity-85 hover:opacity-100'
                      }`}
                    >
                      <div className="flex flex-col min-w-0">
                        <div className="flex justify-between items-center mb-1 gap-1">
                          <span 
                            className="font-bold truncate text-[11px] tracking-wide"
                            style={{ color: isSelected ? theme.darkHex : theme.hex }}
                          >
                            Action {action.id}
                          </span>
                          
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigateToStep(action.id);
                            }}
                            title={`Go to Action ${action.id} Page`}
                            style={isSelected ? { backgroundColor: theme.hex, color: '#FFFFFF' } : {}}
                            className={`flex shrink-0 items-center justify-center rounded-none focus:outline-none cursor-pointer transition-colors ${
                              isSelected 
                                ? 'w-5.5 h-5.5 shadow-2xs' 
                                : 'bg-line/40 hover:text-white text-ink-muted w-5.5 h-5.5'
                            }`}
                          >
                            <ArrowRight size={11} className="stroke-[2.2]" />
                          </button>
                        </div>
                        
                        <h4 className={`line-clamp-2 break-words text-[12.5px] leading-snug font-medium ${isSelected ? 'text-ink font-semibold' : 'text-ink/80'}`}>
                          {toSentenceCase(action.title)}
                        </h4>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Connector Line 1 (Mid-Aligned with SVG Center) */}
            {activeAction && activeTheme && (
              <div className="hidden sm:flex items-center px-1 shrink-0 select-none">
                <svg width="14" height="2" className="overflow-visible">
                  <line 
                    x1="0" 
                    y1="1" 
                    x2="14" 
                    y2="1" 
                    stroke={activeTheme.hex} 
                    strokeWidth="2" 
                    strokeDasharray="3 2" 
                    strokeOpacity="0.5" 
                  />
                </svg>
              </div>
            )}

            {/* Column 2: Implementation Pathways (Mid-Aligned, Header immediately atop Cards, Zero-Jitter) */}
            {activeAction && activeTheme && (
              <div className="flex flex-col justify-center w-[240px] sm:w-[270px] md:w-[290px] shrink-0">
                <div className="text-[11px] font-bold uppercase tracking-wider mb-2 text-center flex items-center justify-center gap-1.5 text-ink-muted shrink-0">
                  <span>Implementation Pathways</span>
                  <span 
                    className="px-1.5 py-0.2 rounded-none text-[10px] font-bold"
                    style={{ backgroundColor: activeTheme.badgeBg, color: activeTheme.badgeText }}
                  >
                    {activeDisplayPathways.length}
                  </span>
                </div>

                <motion.div
                  key={`pathways-list-${activeAction.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.12, ease: "easeOut" }}
                  className="flex flex-col gap-2 max-h-[440px] overflow-y-auto custom-scrollbar pr-1 pb-1"
                >
                  {activeDisplayPathways.map((pathway: any, idx: number) => {
                    const isActive = activePathwayIdx === idx;
                    const originalIdx = pathway.originalIndex !== undefined ? pathway.originalIndex : idx;

                    return (
                      <div 
                        key={idx}
                        onClick={() => {
                          setActivePathwayIdx(isActive ? null : idx);
                        }}
                        style={{
                          borderLeftColor: isActive ? activeTheme.hex : 'transparent',
                          backgroundColor: isActive ? activeTheme.bgLight : undefined,
                          borderColor: isActive ? activeTheme.borderSubtle : undefined,
                        }}
                        className={`p-2.5 sm:p-3 cursor-pointer rounded-none flex flex-col gap-1.5 shrink-0 group/pathway select-none border-t border-r border-b border-l-4 border-line transition-colors duration-150 ${
                          isActive 
                            ? 'shadow-xs z-10' 
                            : 'bg-surface/70 hover:bg-surface'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1.5">
                          <div className="flex-1 min-w-0">
                            <h4 className={`text-[12.5px] font-medium leading-snug break-words ${isActive ? 'text-ink font-semibold' : 'text-ink/80 group-hover/pathway:text-ink'}`}>
                              {pathway.title || pathway.name}
                            </h4>
                          </div>

                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigateToStep(activeAction.id, originalIdx);
                            }}
                            title="Go to Pathway Page"
                            style={isActive ? { backgroundColor: activeTheme.hex, color: '#FFFFFF' } : {}}
                            className={`shrink-0 focus:outline-none w-5.5 h-5.5 flex items-center justify-center rounded-none cursor-pointer transition-colors ${
                              isActive
                                ? 'shadow-2xs'
                                : 'bg-line/40 text-ink-muted'
                            }`}
                          >
                            <ArrowRight size={11} className="stroke-[2.2]" />
                          </button>
                        </div>

                        {/* Lead Badge only if filtered */}
                        {selectedActors.length > 0 && pathway.potentialNationalLead && pathway.potentialNationalLead.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-0.5">
                            {pathway.potentialNationalLead.map((lead: string, lIdx: number) => {
                              const isLeadSelected = selectedActors.some(
                                (sel) => matchesActor(lead, sel)
                              );
                              return (
                                <span 
                                  key={lIdx} 
                                  className={`px-1.5 py-0.2 text-[9px] rounded-none ${
                                    isLeadSelected
                                      ? 'bg-accent/15 text-accent font-semibold border border-accent/30'
                                      : 'bg-surface border border-line text-ink-muted'
                                  }`}
                                >
                                  {lead}
                                </span>
                              );
                            })}
                          </div>
                        )}

                        {(() => {
                          const keyCount = pathway.illustrativeExamples?.length || 0;
                          if (keyCount === 0) return null;

                          return (
                            <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                              <span 
                                className="px-1.5 py-0.5 rounded-none text-[9px] font-semibold"
                                style={{ backgroundColor: activeTheme.bgMedium, color: activeTheme.darkHex }}
                              >
                                {keyCount} {keyCount === 1 ? 'Key Resource' : 'Key Resources'}
                              </span>
                            </div>
                          );
                        })()}
                      </div>
                    );
                  })}
                </motion.div>
              </div>
            )}

            {/* Connector Line 2 (Mid-Aligned with SVG Center) */}
            {activePathway && activeTheme && (
              <div className="hidden sm:flex items-center px-1 shrink-0 select-none">
                <svg width="14" height="2" className="overflow-visible">
                  <line 
                    x1="0" 
                    y1="1" 
                    x2="14" 
                    y2="1" 
                    stroke={activeTheme.hex} 
                    strokeWidth="2" 
                    strokeDasharray="3 2" 
                    strokeOpacity="0.5" 
                  />
                </svg>
              </div>
            )}

            {/* Column 3: Key Resources (Mid-Aligned, Header immediately atop Cards, Zero-Jitter) */}
            {activePathway && activeTheme && (
              <div className="flex flex-col justify-center w-[250px] sm:w-[280px] md:w-[305px] shrink-0">
                <div className="text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-2 text-center flex items-center justify-center gap-1.5 shrink-0">
                  <span>Key Resources</span>
                  {activePathway.illustrativeExamples && activePathway.illustrativeExamples.length > 0 && (
                    <span 
                      className="px-1.5 py-0.2 rounded-none text-[10px] font-bold"
                      style={{ backgroundColor: activeTheme.badgeBg, color: activeTheme.badgeText }}
                    >
                      {activePathway.illustrativeExamples.length}
                    </span>
                  )}
                </div>

                <motion.div
                  key={`resources-list-${activeAction.id}-${activePathwayIdx}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.12, ease: "easeOut" }}
                  className="flex flex-col gap-2 max-h-[440px] overflow-y-auto custom-scrollbar pr-1 pb-1"
                >
                  {activePathway.illustrativeExamples && activePathway.illustrativeExamples.length > 0 ? (
                    activePathway.illustrativeExamples.map((ex: any, idx: number) => {
                      return (
                        <div 
                          key={idx}
                          onClick={() => setSelectedExample(ex)}
                          className="p-2.5 sm:p-3 cursor-pointer bg-surface border border-line hover:shadow-2xs rounded-none flex items-start justify-between gap-2 group shrink-0 select-none transition-colors duration-150 hover:bg-surface/90"
                        >
                          <div className="flex-1 min-w-0">
                            {ex.type && (
                              <div className="mb-1.5">
                                <span 
                                  className="inline-block px-1.5 py-0.5 rounded-none text-[9.5px] font-semibold uppercase tracking-wider"
                                  style={{ 
                                    backgroundColor: activeTheme.bgMedium, 
                                    color: activeTheme.darkHex 
                                  }}
                                >
                                  {ex.type}
                                </span>
                              </div>
                            )}
                            <h4 
                              className="text-[12.5px] font-medium leading-snug text-ink/90 group-hover:text-ink break-words transition-colors"
                            >
                              {ex.title}
                            </h4>
                          </div>
                          <Maximize2 
                            size={12} 
                            className="shrink-0 text-ink-muted mt-0.5" 
                            style={{ color: activeTheme.hex }}
                          />
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-4 border border-dashed border-line text-center text-ink-muted text-[11px] italic shrink-0 bg-surface/30 rounded-none">
                      No key resources in this pathway.
                    </div>
                  )}
                </motion.div>
              </div>
            )}
          </div>
        )}
      </div>

      {onExploreAll && (
        <div className="w-full max-w-6xl mx-auto mt-6 flex justify-end">
          <button
            type="button"
            onClick={onExploreAll}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-sm font-semibold uppercase tracking-wider rounded-none hover:bg-dark-green transition-colors cursor-pointer"
          >
            Explore all actions <ArrowRight size={16} strokeWidth={2.5} />
          </button>
        </div>
      )}

      <ExampleModal
        example={selectedExample}
        theme={activeTheme ?? getActionTheme(1)}
        onClose={() => setSelectedExample(null)}
      />
    </div>
  );
}
