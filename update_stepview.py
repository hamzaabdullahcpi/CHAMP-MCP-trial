import os

new_code = """import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft,
  Users,
  ChevronDown,
  X,
  CheckCircle2,
  Lightbulb,
  Link as LinkIcon,
  FileText,
  Video,
  ExternalLink
} from 'lucide-react';

function CollapsibleList({ title, items }: { title: string, items: string[] }) {
  const [isOpen, setIsOpen] = useState(false);
  if (!items || items.length === 0) return null;

  return (
    <div className="mb-2 border border-line bg-paper overflow-hidden transition-all hover:border-accent/30 shadow-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 hover:bg-surface/50 transition-colors focus:outline-none"
      >
        <h4 className="text-[13px] font-bold text-ink-muted uppercase tracking-[0.1em]">{title}</h4>
        <div className={`shrink-0 w-8 h-8 flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown size={18} className="stroke-[1.5] text-ink" />
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
            <div className="p-5 pt-3 bg-surface border-t border-line">
              <ul className="space-y-4">
                {items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-4 text-ink leading-relaxed font-light text-[15px]">
                    <CheckCircle2 size={18} className="shrink-0 text-accent mt-1 opacity-70" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function KeyActors({ actors }: { actors: string[] }) {
  if (!actors || actors.length === 0) return null;
  return (
    <div className="mt-8 p-6 bg-paper border border-line">
      <h4 className="text-[12px] font-bold text-ink-muted uppercase tracking-widest mb-4">Key Actors</h4>
      <div className="flex flex-wrap gap-2.5">
        {actors.map((actor, idx) => (
          <span key={idx} className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-surface border border-line text-[13px] font-medium text-ink shadow-sm">
            <Users size={14} className="text-accent opacity-70" />
            {actor}
          </span>
        ))}
      </div>
    </div>
  );
}

function ExpandableText({ title, content }: { title: string, content: string }) {
  const [expanded, setExpanded] = useState(false);
  
  if (!content) return null;

  return (
    <div className="flex flex-col h-full">
      {title && <h4 className="text-[12px] font-bold text-ink-muted uppercase tracking-widest mb-3">{title}</h4>}
      <div className={`relative transition-all duration-300 ${expanded ? '' : 'line-clamp-4'}`}>
        <p className="text-ink leading-relaxed font-light text-[15px]">{content}</p>
      </div>
      <button 
        onClick={() => setExpanded(!expanded)}
        className="text-accent text-[12px] font-bold tracking-widest uppercase mt-4 self-start hover:text-ink transition-colors flex items-center gap-1 focus:outline-none"
      >
        {expanded ? "Show Less" : "Read More"}
      </button>
    </div>
  );
}

function ExpandableBox({ title, content, icon: Icon = Lightbulb }: { title: string, content: string, icon?: any }) {
  const [expanded, setExpanded] = useState(false);
  if (!content) return null;
  
  return (
    <div className="bg-accent/5 text-ink p-6 border border-accent/20 border-l-4 border-l-accent shadow-sm rounded-sm">
      <div 
        className="flex items-start justify-between cursor-pointer group"
        onClick={() => setExpanded(!expanded)}
      >
        <h6 className="font-heading text-[17px] font-medium text-ink flex items-center gap-3 pr-4 group-hover:text-accent transition-colors">
          <Icon size={18} className="text-accent shrink-0" />
          {title}
        </h6>
        <div className={`shrink-0 transition-transform duration-300 mt-0.5 text-ink-muted group-hover:text-ink ${expanded ? 'rotate-180' : ''}`}>
          <ChevronDown size={18} />
        </div>
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-5 border-t border-accent/10 mt-5">
              <p className="text-ink/80 leading-[1.8] font-light text-[15px] whitespace-pre-wrap">{content}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SmartClampedText({ text }: { text: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current) {
        const { scrollHeight, clientHeight } = textRef.current;
        // Only measure truncation when text is clamped
        if (!isExpanded) {
          setIsTruncated(scrollHeight > clientHeight + 2); 
        }
      }
    };

    checkTruncation();
    window.addEventListener('resize', checkTruncation);
    return () => window.removeEventListener('resize', checkTruncation);
  }, [text, isExpanded]);

  return (
    <div>
      <div 
        ref={textRef} 
        className={`relative transition-all duration-300 text-ink leading-[1.7] font-light text-[15px] ${!isExpanded ? 'line-clamp-3' : ''}`}
      >
        {text}
      </div>
      {(isTruncated || isExpanded) && (
        <button 
          onClick={() => setIsExpanded(!isExpanded)} 
          className="mt-3 text-accent text-[11px] font-bold tracking-widest uppercase flex items-center gap-1 focus:outline-none hover:text-ink transition-colors"
        >
          {isExpanded ? 'Show Less' : 'Read More'}
          <ChevronDown size={14} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      )}
    </div>
  );
}

function GuidanceList({ items }: { items: any[] }) {
  if (!items || items.length === 0) return null;

  // The first item is the preamble/subtitle
  const preamble = items[0];
  const points = items.slice(1);
  
  // Extract callouts from the points
  const callouts: any[] = [];
  const cleanPoints = points.map(p => {
    if (p.callout) {
      callouts.push(p.callout);
      const { callout, ...rest } = p;
      return rest;
    }
    return p;
  });

  return (
    <div className="space-y-8">
      {preamble && (
        <p className="text-ink leading-relaxed font-light text-[16px]">
          {preamble.content || preamble.title}
        </p>
      )}
      
      <div className="space-y-8 mt-6">
        {cleanPoints.map((item, idx) => {
          // Combine title and content if they differ
          const fullText = item.title === item.content 
            ? item.title 
            : `${item.title}. ${item.content}`;
            
          return (
            <div key={idx} className="flex gap-4 items-start">
              <div className="flex items-center justify-center w-6 h-6 shrink-0 rounded-full bg-accent/10 border border-accent/20 text-accent text-[12px] font-bold mt-0.5">
                {idx + 1}
              </div>
              <div className="flex-1">
                <SmartClampedText text={fullText} />
              </div>
            </div>
          );
        })}
      </div>

      {callouts.length > 0 && (
        <div className="mt-12 space-y-4 pt-8 border-t border-line">
          {callouts.map((c, i) => (
            <ExpandableBox key={i} title={c.title} content={c.content} />
          ))}
        </div>
      )}
    </div>
  );
}

function PathwayCard({ pathway, onSelectExample }: { pathway: any, onSelectExample: (ex: any) => void }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'examples' | 'guidance'>('overview');

  return (
    <div className="bg-surface border border-line shadow-sm relative overflow-hidden flex flex-col">
      {/* Decorative Accent Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-accent/60"></div>

      <div className="p-8 md:p-10 bg-paper border-b border-line shrink-0">
        <h3 className="font-heading font-medium text-2xl md:text-3xl text-ink">
          {pathway.title || pathway.name}
        </h3>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-line bg-paper overflow-x-auto hide-scrollbar shrink-0">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-4 px-6 text-[13px] font-bold uppercase tracking-widest whitespace-nowrap transition-colors focus:outline-none
            ${activeTab === 'overview' ? 'text-accent border-b-2 border-accent bg-accent/5' : 'text-ink-muted hover:text-ink hover:bg-surface'}`}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('examples')}
          className={`flex-1 py-4 px-6 text-[13px] font-bold uppercase tracking-widest whitespace-nowrap transition-colors focus:outline-none
            ${activeTab === 'examples' ? 'text-accent border-b-2 border-accent bg-accent/5' : 'text-ink-muted hover:text-ink hover:bg-surface'}`}
        >
          Illustrative Examples
        </button>
        <button 
          onClick={() => setActiveTab('guidance')}
          className={`flex-1 py-4 px-6 text-[13px] font-bold uppercase tracking-widest whitespace-nowrap transition-colors focus:outline-none
            ${activeTab === 'guidance' ? 'text-accent border-b-2 border-accent bg-accent/5' : 'text-ink-muted hover:text-ink hover:bg-surface'}`}
        >
          Implementation Guidance
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-8 md:p-10 min-h-[350px]">
        <AnimatePresence mode="wait">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {pathway.whatItIs && (
                  <ExpandableText title="What it is" content={pathway.whatItIs} />
                )}
                {pathway.whyItIsNeeded && (
                  <ExpandableText title="Why it is needed" content={pathway.whyItIsNeeded} />
                )}
                {!pathway.whatItIs && pathway.overview && (
                  <ExpandableText title="Overview" content={pathway.overview} />
                )}
              </div>
              
              {pathway.keyActors && pathway.keyActors.length > 0 && (
                <KeyActors actors={pathway.keyActors} />
              )}
            </motion.div>
          )}

          {/* Illustrative Examples Tab */}
          {activeTab === 'examples' && (
            <motion.div
              key="examples"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {pathway.illustrativeExamples && pathway.illustrativeExamples.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {pathway.illustrativeExamples.map((example: any, i: number) => (
                    <button 
                      key={i}
                      onClick={() => onSelectExample(example)}
                      className="group p-6 md:p-8 bg-paper border border-line text-left hover:border-accent hover:shadow-md transition-all duration-300 h-full flex flex-col focus:outline-none relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-accent scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300"></div>
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <h5 className="font-heading font-medium text-[18px] text-ink group-hover:text-accent transition-colors leading-snug">
                          {example.title}
                        </h5>
                        <div className="p-2 bg-surface border border-line text-ink-muted group-hover:bg-accent group-hover:text-white group-hover:border-accent rounded-full transition-colors shrink-0 shadow-sm">
                          <ChevronRight size={14} />
                        </div>
                      </div>
                      <p className="text-ink-muted text-[14px] leading-relaxed font-light line-clamp-3">
                        {example.excerpt}
                      </p>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-ink-muted font-light text-[15px] italic">No illustrative examples available.</p>
              )}
            </motion.div>
          )}

          {/* Implementation Guidance Tab */}
          {activeTab === 'guidance' && (
            <motion.div
              key="guidance"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-12"
            >
              {/* 1. Core Guidance */}
              {pathway.implementationGuidance && pathway.implementationGuidance.length > 0 && (
                <div>
                  <GuidanceList items={pathway.implementationGuidance} />
                </div>
              )}

              {/* 2. Transferability and Enabling Conditions */}
              {((pathway.transferability && pathway.transferability.length > 0) || 
                (pathway.enablingConditions && pathway.enablingConditions.length > 0)) && (
                <div className="pt-8 border-t border-line">
                  <div className="space-y-4">
                    {pathway.transferability && pathway.transferability.length > 0 && (
                      <CollapsibleList title="Transferability Considerations" items={pathway.transferability} />
                    )}
                    {pathway.enablingConditions && pathway.enablingConditions.length > 0 && (
                      <CollapsibleList title="Enabling Conditions" items={pathway.enablingConditions} />
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Additional Resources footer inside the card */}
      <div className="p-8 md:px-10 border-t border-line bg-surface/50 mt-auto shrink-0">
        <h4 className="text-[12px] font-bold text-ink-muted uppercase tracking-widest mb-5 flex items-center gap-2">
          <LinkIcon size={14} /> Resources & Further Reading
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="#" className="flex items-center justify-between p-4 bg-paper border border-line hover:border-accent hover:shadow-sm transition-all group rounded-sm focus:outline-none">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-surface rounded-full text-accent group-hover:bg-accent/10 transition-colors">
                <FileText size={16} />
              </div>
              <span className="text-[14px] font-medium text-ink group-hover:text-accent transition-colors">Implementation Playbook (PDF)</span>
            </div>
            <ExternalLink size={14} className="text-ink-muted group-hover:text-accent transition-colors" />
          </a>
          <a href="#" className="flex items-center justify-between p-4 bg-paper border border-line hover:border-accent hover:shadow-sm transition-all group rounded-sm focus:outline-none">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-surface rounded-full text-accent group-hover:bg-accent/10 transition-colors">
                <Video size={16} />
              </div>
              <span className="text-[14px] font-medium text-ink group-hover:text-accent transition-colors">Webinar: Strategy Overview</span>
            </div>
            <ExternalLink size={14} className="text-ink-muted group-hover:text-accent transition-colors" />
          </a>
        </div>
      </div>
    </div>
  );
}

export function StepView({ 
  step, 
  onBack, 
  onNext, 
  onPrev, 
  isFirst, 
  isLast 
}: { 
  step: any; 
  onBack?: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}) {
  const [selectedExample, setSelectedExample] = useState<any | null>(null);

  if (!step) return null;

  const handleCloseModal = () => {
    setSelectedExample(null);
  };

  return (
    <div className="max-w-4xl mx-auto pb-24">
      {/* Header */}
      <div className="mb-14">
        <button 
          onClick={onPrev}
          className="inline-flex items-center text-sm font-medium text-ink-muted hover:text-ink transition-colors mb-8 group focus:outline-none"
        >
          <ChevronRight size={16} className="rotate-180 mr-1 transition-transform group-hover:-translate-x-1" />
          {isFirst ? 'Back to Overview' : 'Previous Action'}
        </button>
        
        <div className="flex items-center gap-3 mb-5">
          <span className="text-accent font-bold tracking-[0.15em] uppercase text-xs px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
            Action {step.id}
          </span>
        </div>
        
        <h1 className="font-heading text-4xl md:text-5xl font-medium text-ink mb-6 leading-[1.15]">{step.title}</h1>
        
        {step.description && (
          <p className="text-lg md:text-xl text-ink-muted leading-relaxed font-light">{step.description}</p>
        )}
      </div>

      {/* Systems Logic */}
      {step.systemsLogic && (
        <div className="mb-16 p-8 md:p-10 bg-surface border border-line shadow-sm border-l-4 border-l-accent">
          <h2 className="font-heading text-lg font-bold text-ink mb-3 tracking-wide">Systems Logic</h2>
          <p className="text-ink leading-relaxed text-[16px] md:text-[17px] font-light">
            {step.systemsLogic}
          </p>
        </div>
      )}

      {/* Action Pathways */}
      {step.pathways && step.pathways.length > 0 && (
        <div>
          <h2 className="font-heading text-2xl md:text-3xl font-medium text-ink mb-10 pb-4 border-b border-line">
            Action Pathways
          </h2>
          
          <div className="space-y-16">
            {step.pathways.map((pathway: any, index: number) => (
              <PathwayCard 
                key={index} 
                pathway={pathway} 
                onSelectExample={(ex) => {
                  setSelectedExample(ex);
                }} 
              />
            ))}
          </div>
        </div>
      )}

      {/* Illustrative Example Modal */}
      <AnimatePresence>
        {selectedExample && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 15 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface border border-line shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col rounded-sm overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 md:px-10 md:py-8 border-b border-line flex items-center justify-between bg-paper shrink-0">
                <div className="flex-1 pr-6">
                  <h3 className="font-heading text-2xl md:text-3xl font-medium text-ink leading-tight">
                    {selectedExample.title}
                  </h3>
                </div>
                <button 
                  onClick={handleCloseModal}
                  className="p-2.5 bg-surface border border-line hover:bg-line/50 transition-colors shrink-0 rounded-full focus:outline-none"
                >
                  <X size={20} className="text-ink" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 md:p-10 overflow-y-auto">
                <p className="text-ink leading-[1.8] font-light text-[16px] md:text-[17px] whitespace-pre-wrap">
                  {selectedExample.fullText}
                </p>

                {/* Nested Sub-Examples / Highlight callouts */}
                {selectedExample.subExamples && selectedExample.subExamples.length > 0 && (
                  <div className="mt-10 space-y-6">
                    {selectedExample.subExamples.map((subEx: any, i: number) => (
                      <ExpandableBox 
                        key={i} 
                        title={subEx.title} 
                        content={subEx.fullText || subEx.excerpt} 
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Footer */}
      <div className="mt-20 pt-10 border-t border-line flex items-center justify-between">
        <button
          onClick={onPrev}
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-paper border border-line font-bold text-[13px] uppercase tracking-wider text-ink hover:bg-surface hover:shadow-sm transition-all focus:outline-none"
        >
          <ChevronRight size={16} className="rotate-180" />
          {isFirst ? 'Overview' : 'Previous Action'}
        </button>

        {!isLast && onNext && (
          <button
            onClick={onNext}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-accent text-white font-bold text-[13px] uppercase tracking-wider shadow-md hover:bg-accent/90 hover:shadow-lg transition-all focus:outline-none"
          >
            Next Action
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

export default StepView;
"""
with open("src/components/StepView.tsx", "w") as f:
    f.write(new_code)
