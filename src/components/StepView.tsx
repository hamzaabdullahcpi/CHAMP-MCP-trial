import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ChevronDown, ChevronUp, X, CheckCircle2, Lightbulb, Maximize2, ArrowUpRight, ArrowRight, HelpCircle, Info } from 'lucide-react';
import { getActionTheme, actionAccentStyle, ActionTheme } from '../utils/actionThemes';
import { ACTION_MENU_TITLES, toSentenceCase } from '../data/actionMenuTitles';
import { enhanceAction5Examples, getAction5Connection } from '../data/action5ResourceConnections';

function CollapsibleList({ 
  title, 
  items, 
  preamble,
  theme, 
  defaultOpen = false 
}: { 
  title: string; 
  items: string[]; 
  preamble?: string;
  theme?: ActionTheme; 
  defaultOpen?: boolean; 
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  if (!items || items.length === 0) return null;

  return (
    <div className="mb-2 border border-line bg-paper overflow-hidden transition-all rounded-none">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 hover:bg-surface/50 transition-colors focus:outline-none cursor-pointer"
      >
        <h4 className="text-[13px] font-bold text-ink-muted uppercase tracking-[0.1em]">{title}</h4>
        <div className={`shrink-0 w-8 h-8 rounded-none flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
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
            <div className="p-6 pt-3 bg-surface border-t border-line space-y-4">
              {preamble && (
                <p className="body-text-md leading-relaxed mb-2">{preamble}</p>
              )}
              <ul className="space-y-3.5">
                {items.map((item, idx) => {
                  const cleanedItem = item.replace(/^(?:[-*+•—–·◦⁃]|\d+[\.\)])\s*/, '').trim();
                  return (
                    <li key={idx} className="body-text-md flex items-start gap-3.5 leading-relaxed">
                      <div 
                        className="w-4 h-4 mt-[5px] shrink-0 flex items-center justify-center"
                        style={{ color: theme?.hex || 'var(--accent)' }}
                      >
                        <CheckCircle2 size={15} />
                      </div>
                      <span className="flex-1 min-w-0">{cleanedItem}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PathwayActorMapping({
  potentialNationalLead,
  keyActors,
  theme,
}: {
  potentialNationalLead?: string[];
  keyActors?: string[];
  theme?: ActionTheme;
}) {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const leads = Array.isArray(potentialNationalLead) ? potentialNationalLead.filter(Boolean) : [];
  const rawActors = Array.isArray(keyActors) ? keyActors.filter(Boolean) : [];
  // Filter out any lead that might already appear in keyActors to avoid duplicate display
  const filteredActors = rawActors.filter((actor) => !leads.includes(actor));

  if (leads.length === 0 && filteredActors.length === 0) return null;

  const tooltipText =
    "This refers to the relevant ministry for the pathway, such as transport, energy, housing, water or waste.";

  const renderChip = (actor: string, isLead: boolean) => {
    const isSectorMinistry =
      actor.trim().toLowerCase() === "sector ministry" ||
      actor.trim().toLowerCase() === "relevant sector ministry";
    const tooltipId = `${isLead ? "lead" : "actor"}-${actor}`;
    const showTooltip = activeTooltip === tooltipId;

    return (
      <span
        key={actor}
        className={`relative inline-flex items-center gap-1.5 px-2.5 py-1 text-[12px] rounded-none transition-colors select-none ${
          isLead
            ? "font-medium text-ink bg-accent/15"
            : "font-normal text-ink bg-ink-muted/10"
        }`}
      >
        <span>{actor}</span>
        {isSectorMinistry && (
          <span className="relative inline-flex items-center">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveTooltip(showTooltip ? null : tooltipId);
              }}
              onMouseEnter={() => setActiveTooltip(tooltipId)}
              onMouseLeave={() => setActiveTooltip(null)}
              onFocus={() => setActiveTooltip(tooltipId)}
              onBlur={() => setActiveTooltip(null)}
              className="ml-0.5 text-ink-muted hover:text-ink focus:outline-none cursor-help p-0.5"
              aria-label="More information about Sector Ministry"
            >
              <HelpCircle size={12} className="stroke-[1.75]" />
            </button>
            {showTooltip && (
              <span
                role="tooltip"
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-40 w-64 p-2.5 bg-ink text-paper text-[11px] leading-relaxed rounded-none shadow-lg pointer-events-none font-normal normal-case"
              >
                {tooltipText}
                <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-ink" />
              </span>
            )}
          </span>
        )}
      </span>
    );
  };

  return (
    <div className="pt-5 pb-1 border-t border-line space-y-5">
      {leads.length > 0 && (
        <div className="space-y-1.5">
          <h5 className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">
            Potential national lead
          </h5>
          <div className="flex flex-wrap items-center gap-1.5">
            {leads.map((lead) => renderChip(lead, true))}
          </div>
        </div>
      )}

      {filteredActors.length > 0 && (
        <div className="space-y-1.5">
          <h5 className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">
            Key actors
          </h5>
          <div className="flex flex-wrap items-center gap-1.5">
            {filteredActors.map((actor) => renderChip(actor, false))}
          </div>
        </div>
      )}
    </div>
  );
}

function ExpandableText({ title, content, theme }: { title: string, content: string, theme?: ActionTheme }) {
  const [expanded, setExpanded] = useState(false);
  const THRESHOLD = 220;
  const isLong = Boolean(content && content.length > THRESHOLD);
  
  if (!content) return null;

  const getTruncatedSnippet = (str: string, maxLen: number) => {
    const sub = str.slice(0, maxLen);
    const lastSpace = sub.lastIndexOf(' ');
    const cut = (lastSpace > 80 ? sub.slice(0, lastSpace) : sub).trim();
    return cut.replace(/[,;:.!?\-—]+$/, '');
  };

  const accentColor = theme?.hex || 'var(--accent, #008080)';

  return (
    <div className="flex flex-col h-full">
      {title && <h4 className="text-[12px] font-bold text-ink-muted uppercase tracking-widest mb-3">{title}</h4>}
      <div className="body-text-md leading-relaxed">
        {!isLong ? (
          <p>{content}</p>
        ) : !expanded ? (
          <p>
            <span>{getTruncatedSnippet(content, THRESHOLD)}...</span>
            <button 
              type="button"
              onClick={() => setExpanded(true)}
              className="inline-flex items-center justify-center ml-1.5 p-1 rounded-none align-middle transition-colors cursor-pointer focus:outline-none"
              style={{ color: accentColor }}
              title="Expand text"
              aria-label="Expand text"
            >
              <ChevronDown size={14} className="stroke-[2.5]" />
            </button>
          </p>
        ) : (
          <p>
            <span>{content}</span>
            <button 
              type="button"
              onClick={() => setExpanded(false)}
              className="inline-flex items-center justify-center ml-1.5 p-1 rounded-none align-middle transition-colors cursor-pointer focus:outline-none"
              style={{ color: accentColor }}
              title="Collapse text"
              aria-label="Collapse text"
            >
              <ChevronUp size={14} className="stroke-[2.5]" />
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

function renderFormattedInline(inlineStr: string): React.ReactNode {
  if (!inlineStr || typeof inlineStr !== 'string') return null;

  // Replace internal Airtable link markdown [Text](https://airtable.com/...) with just Text
  const sanitized = inlineStr.replace(/\[([^\]]+)\]\(https:\/\/airtable\.com[^)]*\)/g, '$1');

  // Tokenize markdown links: [Text](url) and bold **bold**
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIdx = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(sanitized)) !== null) {
    if (match.index > lastIdx) {
      const textChunk = sanitized.substring(lastIdx, match.index);
      parts.push(...renderBoldItalic(textChunk, `text-${lastIdx}`));
    }
    const linkText = match[1];
    const linkUrl = match[2];
    parts.push(
      <a 
        key={`link-${match.index}`} 
        href={linkUrl} 
        target="_blank" 
        rel="noreferrer"
        className="text-accent underline underline-offset-3 hover:text-ink font-medium transition-colors inline-flex items-center gap-0.5"
      >
        {linkText}
        <ArrowUpRight size={13} className="inline ml-0.5 opacity-80 shrink-0" />
      </a>
    );
    lastIdx = linkRegex.lastIndex;
    if (match.index === linkRegex.lastIndex) {
      linkRegex.lastIndex++;
    }
  }

  if (lastIdx < sanitized.length) {
    parts.push(...renderBoldItalic(sanitized.substring(lastIdx), `text-${lastIdx}`));
  }

  return parts;
}

function renderBoldItalic(text: string, keyPrefix: string): React.ReactNode[] {
  // Simple bold parser for **text**
  const boldParts = text.split(/\*\*([^*]+)\*\*/g);
  if (boldParts.length === 1) return [text];

  return boldParts.map((chunk, i) => {
    if (i % 2 === 1) {
      return <strong key={`${keyPrefix}-b-${i}`} className="font-semibold text-ink">{chunk}</strong>;
    }
    return chunk;
  });
}

function RichTextRenderer({ text, textClass }: { text: string, textClass: string }) {
  if (!text) return null;

  // Clean raw text from internal Airtable URL artifacts and non-breaking spaces
  const cleaned = text
    .replace(/\[([^\]]+)\]\(https:\/\/airtable\.com[^)]*\)/g, '$1')
    .replace(/\u00A0/g, ' ')
    .trim();

  const rawLines = cleaned.split(/\r?\n/);
  
  type Block = { type: 'paragraph'; content: string } | { type: 'list'; items: string[] };
  const blocks: Block[] = [];
  let currentList: string[] | null = null;

  rawLines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      if (currentList) {
        blocks.push({ type: 'list', items: currentList });
        currentList = null;
      }
      return;
    }

    const bulletMatch = trimmed.match(/^(?:[-*+•—–·◦⁃]|\d+[\.\)])\s*(.*)/);
    if (bulletMatch) {
      if (!currentList) currentList = [];
      const itemContent = bulletMatch[1].replace(/^(?:[-*+•—–·◦⁃]|\d+[\.\)])\s*/, '').trim();
      currentList.push(itemContent);
    } else {
      if (currentList) {
        blocks.push({ type: 'list', items: currentList });
        currentList = null;
      }
      blocks.push({ type: 'paragraph', content: trimmed });
    }
  });

  if (currentList) {
    blocks.push({ type: 'list', items: currentList });
  }

  return (
    <div className="space-y-4">
      {blocks.map((block, bIdx) => {
        if (block.type === 'list') {
          return (
            <div key={bIdx} className="my-3 space-y-3 pl-0.5">
              {block.items.map((item, iIdx) => (
                <div key={iIdx} className="flex items-start gap-3">
                  <div className="w-4 h-4 mt-[5px] shrink-0 flex items-center justify-center text-accent">
                    <CheckCircle2 size={15} />
                  </div>
                  <div className={`flex-1 ${textClass} text-ink/90`}>
                    {renderFormattedInline(item)}
                  </div>
                </div>
              ))}
            </div>
          );
        }

        return (
          <p key={bIdx} className={`${textClass}`}>
            {renderFormattedInline(block.content)}
          </p>
        );
      })}
    </div>
  );
}

function ExpandableBox({ title, content, link, theme }: { title: string, content: string, link?: string, theme?: ActionTheme }) {
  const [expanded, setExpanded] = useState(false);
  if (!content) return null;
  
  const accentColor = theme?.hex || 'var(--color-accent)';
  const bgColor = theme?.bgSubtle || 'var(--color-accent-light)';
  const borderColor = theme?.borderSubtle || 'color-mix(in srgb, var(--color-accent) 20%, transparent)';
  
  return (
    <div 
      className="text-ink p-6 border shadow-2xs rounded-none"
      style={{
        backgroundColor: bgColor,
        borderColor: borderColor,
        borderLeftWidth: 4,
        borderLeftColor: accentColor
      }}
    >
      <div 
        className="flex items-start justify-between cursor-pointer group"
        onClick={() => setExpanded(!expanded)}
      >
        <h6 
          className="font-heading text-[17px] font-semibold flex items-center gap-3 pr-4 transition-colors"
          style={{ color: theme?.darkHex || accentColor }}
        >
          <Lightbulb size={20} style={{ color: accentColor }} className="shrink-0" />
          {title}
        </h6>
        <div 
          className={`shrink-0 rounded-none transition-transform duration-300 mt-0.5 ${expanded ? 'rotate-180' : ''}`}
          style={{ color: accentColor }}
        >
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
            <div className="pt-5 border-t border-line mt-5">
              <div className="mb-4">
                <RichTextRenderer text={content} textClass="body-text-md leading-relaxed" />
              </div>
              {link && (
                <a 
                  href={link} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-paper border text-[12px] font-bold uppercase tracking-wider hover:text-white transition-colors shadow-2xs rounded-none"
                  style={{
                    borderColor: borderColor,
                    color: accentColor
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = accentColor;
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '';
                    e.currentTarget.style.color = accentColor;
                  }}
                >
                  Learn More
                  <ArrowUpRight size={13} />
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ConceptBoxCard({ box, theme }: { box: any, theme?: ActionTheme }) {
  const [expanded, setExpanded] = useState(false);
  if (!box) return null;

  const contentText = box.fullText || box.excerpt || box.content || '';
  const accentColor = theme?.hex || 'var(--color-accent)';
  const bgColor = theme?.bgSubtle || 'var(--color-accent-light)';
  const borderColor = theme?.borderSubtle || 'color-mix(in srgb, var(--color-accent) 25%, transparent)';

  return (
    <div 
      className="w-full bg-paper border shadow-2xs rounded-none p-6 md:p-7 transition-all my-3"
      style={{
        backgroundColor: bgColor,
        borderColor: borderColor
      }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start justify-between gap-3 text-left focus:outline-none group cursor-pointer"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Lightbulb size={22} style={{ color: accentColor }} className="shrink-0 transition-transform group-hover:scale-110" />
          <h4 
            className="font-heading font-semibold text-[17px] md:text-[18px] leading-snug"
            style={{ color: theme?.darkHex || accentColor }}
          >
            {box.title}
          </h4>
        </div>
        <div 
          className={`p-1.5 rounded-none transition-all shrink-0 ${expanded ? 'rotate-180' : ''}`}
          style={{ color: accentColor }}
        >
          <ChevronDown size={18} />
        </div>
      </button>

      <AnimatePresence>
        {expanded && contentText && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pt-5 mt-4 border-t border-line space-y-4">
              <RichTextRenderer text={contentText} textClass="body-text-md leading-relaxed" />
              
              {box.link && (
                <div className="pt-2">
                  <a
                    href={box.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-paper border text-[12px] font-bold uppercase tracking-wider hover:text-white transition-colors shadow-2xs rounded-none"
                    style={{
                      borderColor: borderColor,
                      color: accentColor
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = accentColor;
                      e.currentTarget.style.color = '#ffffff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '';
                      e.currentTarget.style.color = accentColor;
                    }}
                  >
                    Learn More & Resources
                    <ArrowUpRight size={13} />
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SmartClampedStep({ 
  title, 
  content, 
  isPreamble 
}: { 
  title?: string; 
  content?: string; 
  isPreamble?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const cleanTitle = (title || '').trim().replace(/^\*\*+|\*\*+$/g, '').trim().replace(/[:.]\s*$/, '');
  const rawContent = (content || '').trim();

  // If no content, just render title (or vice versa)
  const fullText = cleanTitle && rawContent ? `${cleanTitle}: ${rawContent}` : (cleanTitle || rawContent);
  const THRESHOLD = 220;
  const isLong = Boolean(rawContent && rawContent.length > THRESHOLD);

  if (!fullText) return null;

  if (isPreamble || !cleanTitle) {
    return (
      <p className="body-text-md leading-relaxed text-ink/90">
        {renderFormattedInline(fullText)}
      </p>
    );
  }

  // Find a natural word boundary for content near THRESHOLD
  const getTruncatedContent = (str: string, maxLen: number) => {
    const sub = str.slice(0, maxLen);
    const lastSpace = sub.lastIndexOf(' ');
    const cut = (lastSpace > 60 ? sub.slice(0, lastSpace) : sub).trim();
    return cut.replace(/[,;:.!?\-—]+$/, '');
  };

  const truncated = isLong ? getTruncatedContent(rawContent, THRESHOLD) : rawContent;

  return (
    <p className="body-text-md leading-relaxed text-ink/90">
      {cleanTitle && (
        <strong className="font-semibold text-ink">
          {cleanTitle}
          {rawContent ? ': ' : ''}
        </strong>
      )}
      {!isLong || isExpanded ? (
        <>
          <span>{renderFormattedInline(rawContent)}</span>
          {isLong && (
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="inline-flex items-center justify-center ml-1.5 p-0.5 rounded text-accent/75 hover:text-accent hover:bg-accent/10 align-middle transition-colors cursor-pointer focus:outline-none"
              title="Collapse guidance"
              aria-label="Collapse guidance"
            >
              <ChevronUp size={14} className="stroke-[2.5]" />
            </button>
          )}
        </>
      ) : (
        <>
          <span>{renderFormattedInline(truncated)}...</span>
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="inline-flex items-center justify-center ml-1.5 p-0.5 rounded text-accent/75 hover:text-accent hover:bg-accent/10 align-middle transition-colors cursor-pointer focus:outline-none"
            title="Expand guidance"
            aria-label="Expand guidance"
          >
            <ChevronDown size={14} className="stroke-[2.5]" />
          </button>
        </>
      )}
    </p>
  );
}

function getCleanStep(title?: string, content?: string) {
  const t = (title || '').trim();
  const c = (content || '').trim();

  const cleanTitleRaw = t.replace(/^\*\*+|\*\*+$/g, '').trim();
  const cleanTitle = cleanTitleRaw.replace(/[:.]\s*$/, '');

  if (!c && !cleanTitle) return { title: '', content: '' };
  if (!c) return { title: cleanTitle, content: '' };
  if (!cleanTitle) return { title: '', content: c };

  const normalize = (s: string) => s.trim().replace(/\s+/g, ' ').replace(/[.\s]+$/, '').toLowerCase();
  const normT = normalize(cleanTitleRaw);
  const normC = normalize(c);

  // Exact match
  if (normT === normC) {
    return { title: cleanTitle, content: '' };
  }

  // If content already starts with the title
  if (normC.startsWith(normT)) {
    const remaining = c.slice(cleanTitleRaw.length).replace(/^[:.\s-]+/, '').trim();
    return { title: cleanTitle, content: remaining };
  }

  return { title: cleanTitle, content: c };
}

function GuidanceList({ items, theme }: { items: any[], theme?: ActionTheme }) {
  if (!items || !Array.isArray(items) || items.length === 0) return null;

  const firstItem = items[0] || {};
  const firstClean = getCleanStep(
    typeof firstItem === 'string' ? firstItem : firstItem.title, 
    typeof firstItem === 'string' ? firstItem : firstItem.content
  );
  const firstCombined = firstClean.title && firstClean.content 
    ? `${firstClean.title}: ${firstClean.content}` 
    : (firstClean.title || firstClean.content);

  const isPreamble = items.length > 1 && (
    firstCombined.toLowerCase().includes('following') ||
    firstCombined.toLowerCase().includes('iterative') ||
    firstCombined.toLowerCase().includes('process that') ||
    firstCombined.length < 120
  );

  const preambleItem = isPreamble ? firstClean : null;
  const stepItems = isPreamble ? items.slice(1) : items;

  const callouts: any[] = [];
  const cleanPoints = stepItems.map(p => {
    if (!p) return null;
    if (typeof p === 'string') return { title: '', content: p };
    if (p.callout) {
      callouts.push(p.callout);
      const { callout, ...rest } = p;
      return rest;
    }
    return p;
  }).filter(Boolean) as any[];

  return (
    <div className="space-y-6">
      {preambleItem && (
        <div className="pb-1">
          <SmartClampedStep title={preambleItem.title} content={preambleItem.content} isPreamble={true} />
        </div>
      )}
      
      <div className="space-y-4">
        {cleanPoints.map((item, idx) => {
          const { title, content } = getCleanStep(item.title, item.content);
          if (!title && !content) return null;

          return (
            <div 
              key={idx} 
              className="flex gap-4 items-center p-4 md:p-5 rounded-none bg-grey-light"
            >
              <div className="w-8 shrink-0 font-display text-[28px] font-bold leading-none text-accent">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <SmartClampedStep title={title} content={content} />
              </div>
            </div>
          );
        })}
      </div>

      {callouts.length > 0 && (
        <div className="mt-10 space-y-4 pt-6 border-t border-line">
          {callouts.map((c, i) => (
            <ExpandableBox key={i} title={c.title} content={c.content} theme={theme} />
          ))}
        </div>
      )}
    </div>
  );
}

function PathwayCard({ 
  pathway, 
  onSelectExample,
  theme,
  actionId,
  onNavigateToCountry
}: { 
  pathway: any; 
  onSelectExample: (ex: any) => void;
  initialTab?: 'overview' | 'guidance';
  theme?: ActionTheme;
  actionId?: number;
  onNavigateToCountry?: (countryId: string, actionId?: number) => void;
}) {
  if (!pathway) return null;

  const isAction5 = Number(actionId) === 5;
  const rawExamples = pathway.illustrativeExamples || [];
  const enhancedExamples = isAction5 ? enhanceAction5Examples(pathway.title, rawExamples) : rawExamples;
  const displayExamples = [...enhancedExamples].sort((a: any, b: any) => {
    const orderA = typeof a.order === 'number' && !isNaN(a.order) ? a.order : 9999;
    const orderB = typeof b.order === 'number' && !isNaN(b.order) ? b.order : 9999;
    return orderA - orderB;
  });

  const exampleConceptBoxes = (pathway.conceptBoxes || []).filter((b: any) => 
    !b.section || b.section.toLowerCase().includes('example') || b.section.toLowerCase().includes('illustrative')
  );

  const guidanceConceptBoxes = (pathway.conceptBoxes || []).filter((b: any) => 
    b.section && (b.section.toLowerCase().includes('guidance') || b.section.toLowerCase().includes('implementation'))
  );

  const overviewConceptBoxes = (pathway.conceptBoxes || []).filter((b: any) => 
    b.section && b.section.toLowerCase().includes('overview')
  );

  const overviewText = pathway.overview || '';

  const renderResourceCard = (example: any, i: number) => {
    const isTool = String(example.type || '').toLowerCase().includes('tool') ||
      /tool|toolkit|calculator|matrix|framework|simulator|portal|index|model|guide/i.test(example.title || '') ||
      Boolean(example.isTool);
    const connInfo = getAction5Connection(example.title, example.type);
    const directConn = example.connectionLine || (connInfo ? `${connInfo.prefix} ${connInfo.text}` : '');
    
    const connPrefix = isTool ? 'Why use this:' : 'Why see this:';
    let connBody = '';
    if (directConn) {
      // Strip any existing prefix variants to prevent duplication
      connBody = directConn.replace(/^(?:why see this|why use this tool|why use this|when to use this)\s*[:\-]\s*/gi, '').trim();
    }
    
    // If empty, clean contextual fallback
    if (!connBody) {
      connBody = isTool
        ? 'Identify suitable tools, diagnostic checklists and frameworks to support this pathway.'
        : 'See how national and subnational governments put this implementation pathway into practice.';
    }
    const finalConnLine = `${connPrefix} ${connBody}`;

    return (
      <button 
        key={i}
        type="button"
        onClick={() => onSelectExample({
          ...example,
          connectionLine: finalConnLine,
          isTool
        })}
        className="group p-4 sm:p-5 bg-grey-light hover:bg-surface transition-colors border border-transparent hover:border-accent text-left h-full flex flex-col focus:outline-none relative overflow-hidden rounded-none cursor-pointer"
      >

        {/* Tag Badge: Tool vs Peer Learning Example / Illustrative Example */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-accent">
            {isTool ? 'Tool' : (example.type || 'Peer Learning Example')}
          </span>

          <Maximize2 size={16} className="shrink-0 text-ink-muted" />
        </div>

        <h5 
          className="body-text-md font-bold leading-snug mb-1.5"
        >
          {example.title}
        </h5>

        <p className="body-text-md text-ink-muted leading-relaxed line-clamp-2 pt-1">
          {example.excerpt}
        </p>

        {example.subExamples && example.subExamples.length > 0 && (
          <div className="mt-2 pt-1.5 border-t border-line/60 flex items-center gap-1.5 text-[10.5px] font-medium text-ink-muted">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme?.hex || 'var(--color-accent)' }} />
            <span>Includes {example.subExamples.length} {example.subExamples.length === 1 ? 'case study' : 'case studies'}</span>
          </div>
        )}

        {/* Connection line ("Why see this"), pinned to the bottom of the card */}
        <div 
          className="mt-auto pt-3"
        >
          <div
            className="body-text-sm leading-snug py-1.5 px-3 border-l-2 border-accent"
          >
            <span className="font-semibold text-ink">
              {connPrefix}{' '}
            </span>
            <span className="text-ink-muted">
              {connBody}
            </span>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="bg-surface border border-line relative overflow-hidden flex flex-col rounded-none">

      <div className="px-6 md:px-8 pt-6 md:pt-8 bg-surface shrink-0">
        <h3 className="title-h2">
          {pathway.title || pathway.name}
        </h3>
      </div>

      {/* Unified Single Tab / View */}
      <div className="p-6 md:p-8 space-y-8 min-h-[350px]">
        {/* 1. Overview Section */}
        {overviewText && (
          <div className="space-y-3">
            <h4 className="body-text font-bold">
              Overview
            </h4>
            <RichTextRenderer text={overviewText} textClass="body-text-md leading-relaxed text-ink/90" />
            
            {overviewConceptBoxes.length > 0 && (
              <div className="pt-3 space-y-3">
                {overviewConceptBoxes.map((box: any, i: number) => (
                  <ConceptBoxCard key={i} box={box} theme={theme} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Actor Mapping: Potential National Lead & Key Actors */}
        <PathwayActorMapping
          potentialNationalLead={pathway.potentialNationalLead}
          keyActors={pathway.keyActors}
          theme={theme}
        />

        {/* 2. Implementation Guidance for National Governments */}
        {pathway.implementationGuidance && pathway.implementationGuidance.length > 0 && (
          <div className="pt-8 border-t border-line space-y-5">
            <h4 className="body-text font-bold">
              Implementation guidance for national governments
            </h4>

            <GuidanceList items={pathway.implementationGuidance} theme={theme} />

            {guidanceConceptBoxes.length > 0 && (
              <div className="pt-2 space-y-3">
                {guidanceConceptBoxes.map((box: any, i: number) => (
                  <ConceptBoxCard key={i} box={box} theme={theme} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. Peer Learning / Illustrative Examples and Tools */}
        {((displayExamples && displayExamples.length > 0) || exampleConceptBoxes.length > 0) && (() => {
          const hasPeerLearning = displayExamples.some((ex: any) => 
            String(ex.type || '').toLowerCase().includes('peer learning')
          );
          const sectionTitle = hasPeerLearning 
            ? "Peer learning examples and tools" 
            : "Illustrative examples and tools";

          return (
            <div className="pt-8 border-t border-line space-y-4">
              <div className="flex items-center gap-2.5">
                <h4 className="body-text font-bold">
                  {sectionTitle}
                </h4>
              </div>

              {displayExamples && displayExamples.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  {displayExamples.map((example: any, i: number) => renderResourceCard(example, i))}
                </div>
              )}

              {exampleConceptBoxes.length > 0 && (
                <div className="pt-2 space-y-3">
                  {exampleConceptBoxes.map((box: any, i: number) => (
                    <ConceptBoxCard key={i} box={box} theme={theme} />
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {/* 4. Transferability Considerations */}
        {pathway.transferability && pathway.transferability.length > 0 && (
          <div className="pt-8 border-t border-line space-y-3">
            <CollapsibleList 
              title={pathway.transferabilityTitle || "Transferability Considerations"} 
              items={pathway.transferability} 
              preamble={pathway.transferabilityPreamble}
              theme={theme} 
              defaultOpen={false} 
            />
          </div>
        )}
      </div>
    </div>
  );
}


// Popup showing a peer learning example or tool in full. Used on action pages and the Actions overview.
export function ExampleModal({ example, theme, onClose }: { example: any | null, theme: ActionTheme, onClose: () => void }) {
  // Close on Escape
  useEffect(() => {
    if (!example) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [example, onClose]);

  return (
    <AnimatePresence>
      {example && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm"
          style={actionAccentStyle(theme.id)}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 15 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="bg-surface border border-line shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col rounded-none overflow-hidden"
          >
            {/* Modal Header: tag and title styled like the example card */}
            <div className="px-6 pt-6 md:px-10 md:pt-8 flex items-start justify-between gap-6 shrink-0">
              <div className="flex-1">
                <span className="block mb-2 text-[10px] font-bold uppercase tracking-wider text-accent">
                  {example.isTool || String(example.type || '').toLowerCase().includes('tool')
                    ? 'Tool'
                    : (example.type || 'Peer Learning Example')}
                </span>
                <h3 className="body-text font-bold leading-snug">
                  {example.title}
                </h3>
              </div>
              <button 
                onClick={onClose}
                className="p-1 text-ink-muted hover:text-ink shrink-0 cursor-pointer focus:outline-none"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-6 pb-6 pt-4 md:px-10 md:pb-10 md:pt-5 overflow-y-auto custom-scrollbar">
              <div className="mb-6">
                <RichTextRenderer text={example.fullText || example.content || example.excerpt} textClass="body-text-md leading-relaxed" />
              </div>
              {example.link && (
                <div className="mb-6">
                  <a 
                    href={example.link} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-paper border border-line text-[13px] font-bold uppercase tracking-wider text-ink transition-colors rounded-none"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = theme.hex;
                      e.currentTarget.style.color = theme.darkHex;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '';
                      e.currentTarget.style.color = '';
                    }}
                  >
                    Know More
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              )}

              {/* Sub-Examples */}
              {example.subExamples && example.subExamples.length > 0 && (
                <div className="mt-8 space-y-4 pt-6 border-t border-line">
                  <h5 className="text-[12px] font-bold text-ink-muted uppercase tracking-widest mb-3">Associated Highlights & Case Notes</h5>
                  {example.subExamples.map((subEx: any, i: number) => (
                    <ExpandableBox 
                      key={i} 
                      title={subEx.title} 
                      content={subEx.fullText || subEx.excerpt || subEx.content} 
                      link={subEx.link}
                      theme={theme}
                    />
                  ))}
                </div>
              )}

              {/* Connection Line ("Why see this"), at the bottom like on the card */}
              {(() => {
                const connInfo = getAction5Connection(example.title, example.type);
                const fullConn = example.connectionLine || (connInfo ? `${connInfo.prefix} ${connInfo.text}` : '');
                const isTool = String(example.type || '').toLowerCase().includes('tool') || 
                  /tool|toolkit|calculator|matrix|framework|simulator|portal|index|model|guide/i.test(example.title || '') ||
                  Boolean(example.isTool);
                const prefix = isTool ? 'Why use this:' : 'Why see this:';
                let body = '';
                if (fullConn) {
                  body = fullConn.replace(/^(?:why see this|why use this tool|why use this|when to use this)\s*[:\-]\s*/gi, '').trim();
                }
                
                if (!body) {
                  body = isTool
                    ? 'Identify suitable tools, diagnostic checklists and frameworks to support this pathway.'
                    : 'See how national and subnational governments put this implementation pathway into practice.';
                }

                return (
                  <div 
                    className="mt-8 py-1.5 px-4 border-l-2 border-accent body-text-sm leading-relaxed"
                  >
                    <span className="font-semibold text-ink">
                      {prefix}{' '}
                    </span>
                    <span className="text-ink-muted">
                      {body}
                    </span>
                  </div>
                );
              })()}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function StepView({ 
  step, 
  onBack, 
  onNext, 
  onPrev, 
  isFirst, 
  isLast,
  initialDeepLink,
  onClearDeepLink,
  onNavigateToCountry,
  onOpenRoadmap
}: { 
  step: any; 
  onBack?: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  initialDeepLink?: any;
  onClearDeepLink?: () => void;
  onNavigateToCountry?: (countryId: string, actionId?: number) => void;
  onOpenRoadmap?: (componentId?: string) => void;
  onOpenAiAssistant?: () => void;
}) {
  const [isSystemsLogicOpen, setIsSystemsLogicOpen] = useState(false);
  const systemsLogicRef = useRef<HTMLDivElement>(null);

  // Close the systems logic popup on outside click or Escape
  useEffect(() => {
    if (!isSystemsLogicOpen) return;
    const onClick = (e: MouseEvent) => {
      if (systemsLogicRef.current && !systemsLogicRef.current.contains(e.target as Node)) setIsSystemsLogicOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsSystemsLogicOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [isSystemsLogicOpen]);
  const [activePathwayIndex, setActivePathwayIndex] = useState(0);
  const [selectedExample, setSelectedExample] = useState<any | null>(null);

  const actionTheme = getActionTheme(step?.id);

  // Consume and initialize deep-link target exactly once
  useEffect(() => {
    if (initialDeepLink) {
      setActivePathwayIndex(initialDeepLink.pathwayIndex || 0);
      if (initialDeepLink.example) {
        setSelectedExample(initialDeepLink.example);
      } else {
        setSelectedExample(null);
      }
      onClearDeepLink?.();
    }
  }, [initialDeepLink, onClearDeepLink]);

  // Reset pathway view when step ID changes
  useEffect(() => {
    if (!initialDeepLink) {
      setActivePathwayIndex(0);
      setSelectedExample(null);
      setIsSystemsLogicOpen(false);
    }
  }, [step?.id]);

  const handleCloseModal = () => {
    setSelectedExample(null);
    onClearDeepLink?.();
  };


  if (!step) return null;

  const hasLogic = Boolean(step.systemsLogic);
  const pathways = step.pathways || [];

  return (
    <div className="max-w-6xl mx-auto pb-24" style={actionAccentStyle(step.id)}>
      {/* Header Navigation */}
      <div className="mb-10">
        
        <div className="flex items-center gap-3 mb-5">
          <span 
            className="font-bold tracking-[0.15em] uppercase text-xs text-accent"
          >
            Action {step.id}
          </span>
        </div>
        
        <h1 className="title-h1 mb-6">{toSentenceCase(step.title || '')}</h1>

        {step.description && (
          <p className="body-text-md leading-relaxed">{step.description}</p>
        )}
      </div>

      {/* Main Section: Implementation Pathways */}
      <div className="mb-8">
        <p className="body-text-sm text-ink-muted mb-2">
          Select an implementation pathway to view its overview, key resources and implementation guidance.
        </p>

        {/* Systems logic: label with an (i) that opens the explanation in a small popup */}
        {/* Systems logic trigger bar */}
        {hasLogic && (
          <div className="flex items-center mb-4">
            <div className="relative" ref={systemsLogicRef}>
              <button
                type="button"
                onClick={() => setIsSystemsLogicOpen(!isSystemsLogicOpen)}
                className="inline-flex items-center gap-1.5 body-text-sm font-semibold text-ink hover:text-accent cursor-pointer"
                aria-expanded={isSystemsLogicOpen}
                aria-controls="systems-logic-popup"
              >
                Systems logic
                <Info size={15} className="text-accent" aria-hidden="true" />
              </button>

              <AnimatePresence>
                {isSystemsLogicOpen && (
                  <motion.div
                    id="systems-logic-popup"
                    role="dialog"
                    aria-label="Systems logic"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-2 z-30 w-[min(560px,calc(100vw-3rem))] bg-surface border border-line shadow-lg p-5"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-accent">
                        How these implementation pathways connect
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsSystemsLogicOpen(false)}
                        className="text-ink-muted hover:text-ink cursor-pointer shrink-0"
                        aria-label="Close systems logic"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <p className="body-text-sm leading-relaxed">
                      {step.systemsLogic}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Pathway tabs: the selected tab joins the pathway content below */}
        {pathways.length > 1 && (
          <div role="tablist" aria-label="Implementation pathways" className="relative z-10 flex flex-col sm:flex-row">
            {pathways.map((p: any, idx: number) => {
              const isSelected = activePathwayIndex === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActivePathwayIndex(idx)}
                  className={`relative flex-1 min-w-0 text-left px-4 sm:px-5 py-4 border-b-4 cursor-pointer focus:outline-none ${
                    isSelected
                      ? 'bg-grey-light border-accent text-accent'
                      : 'bg-surface border-transparent text-ink hover:text-accent'
                  }`}
                >
                  <span className="block text-[11px] font-bold uppercase tracking-wider mb-1">
                    Pathway {idx + 1}
                  </span>
                  <span className="block body-text-md font-bold leading-snug text-inherit">
                    {p.title || p.name}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Active Pathway Details Card */}
        {pathways.length > 0 && (() => {
          const safeActiveIndex = Math.max(0, Math.min(activePathwayIndex, pathways.length - 1));
          const currentPathway = pathways[safeActiveIndex] || pathways[0];
          if (!currentPathway) return null;

          return (
            <AnimatePresence mode="wait">
              <motion.div
                key={safeActiveIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <PathwayCard 
                  pathway={currentPathway} 
                  onSelectExample={setSelectedExample} 
                  theme={actionTheme}
                  actionId={Number(step.id)}
                  onNavigateToCountry={onNavigateToCountry}
                />
              </motion.div>
            </AnimatePresence>
          );
        })()}
      </div>

      {/* Illustrative Example Modal */}
      <ExampleModal example={selectedExample} theme={actionTheme} onClose={handleCloseModal} />

      {/* Navigation Footer */}
      <div className="mt-20 pt-10 border-t border-line flex items-center justify-between">
        <button
          onClick={onPrev}
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-paper border border-line font-bold text-[13px] uppercase tracking-wider text-ink hover:bg-surface hover:shadow-sm transition-all focus:outline-none rounded-none cursor-pointer"
        >
          <ArrowLeft size={16} />
          {isFirst ? 'Overview' : 'Previous Action'}
        </button>

        {!isLast && onNext && (
          <button
            onClick={onNext}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-teal text-white font-bold text-[13px] uppercase tracking-wider shadow-md hover:brightness-110 hover:shadow-lg transition-all focus:outline-none rounded-none cursor-pointer ml-auto"
          >
            Next Action
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

export default StepView;
