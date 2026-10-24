import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HowToUseContent, defaultHowToUseContent } from "../services/airtableService";

interface HowToUseSectionProps {
  id?: string;
  content?: HowToUseContent;
}

// "How to use this Toolkit" as a homepage section: intro + one item per carousel slide.
export default function HowToUseSection({ id, content }: HowToUseSectionProps) {
  const title = content?.title || defaultHowToUseContent.title;
  const intro = content?.intro || defaultHowToUseContent.intro;
  const introParagraphs = intro
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  const items = content?.items && content.items.length > 0 ? content.items : defaultHowToUseContent.items;

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const total = items.length;
  const item = items[index];

  const goTo = (next: number) => {
    const wrapped = (next + total) % total;
    setDirection(next > index ? 1 : -1);
    setIndex(wrapped);
  };

  return (
    <section id={id} className="w-full max-w-6xl mx-auto scroll-mt-6">
      <div className="mb-6">
        <h2 className="title-h2 text-dark-green mb-2">{title}</h2>
        <div className="body-text-md space-y-2 max-w-4xl">
          {introParagraphs.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </div>

      <div
        className="relative bg-surface border border-line"
        role="region"
        aria-roledescription="carousel"
        aria-label={title}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") goTo(index + 1);
          if (e.key === "ArrowLeft") goTo(index - 1);
        }}
      >
        <div className="overflow-hidden min-h-[220px]">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              initial={{ opacity: 0, x: direction * 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -24 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="grid grid-cols-1 md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_340px] gap-8 md:gap-12 items-center p-6 sm:p-8 md:p-10"
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${total}`}
            >
              <div className="text-left">
                <span className="block text-xs font-bold text-accent uppercase tracking-wider mb-2">
                  {item.name}
                </span>
                <h3 className="body-text font-bold leading-snug mb-2">{item.heading}</h3>
                <p className="body-text-md text-ink-muted leading-relaxed max-w-2xl">{item.description}</p>
              </div>
              <HierarchyDiagram step={index} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4 px-6 sm:px-8 md:px-10 py-4 border-t border-line">
          <div className="flex items-center gap-2">
            {items.map((it, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}: ${it.name}`}
                aria-current={i === index}
                className={`h-1.5 cursor-pointer transition-all ${
                  i === index ? "w-8 bg-accent" : "w-4 bg-line hover:bg-ink-muted/40"
                }`}
              />
            ))}
            <span className="ml-2 body-text-sm text-ink-muted">
              {index + 1} / {total}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Previous slide"
              className="w-9 h-9 flex items-center justify-center border border-line text-ink-muted hover:text-accent hover:border-accent cursor-pointer transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Next slide"
              className="w-9 h-9 flex items-center justify-center border border-line text-ink-muted hover:text-accent hover:border-accent cursor-pointer transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// Simplified version of the Actions page layout: 5 actions, then pathways, then key resources.
// step 0-2 highlights one level; step 3 (Country Journeys) traces a path across levels and actions.
function HierarchyDiagram({ step }: { step: number }) {
  const on = "fill-accent stroke-accent";
  const off = "fill-surface stroke-line";
  const linkOn = "stroke-accent";
  const linkOff = "stroke-line";

  const actionX = [16, 76, 136, 196, 256]; // 48px squares, 12px gap
  const blockX = [16, 116, 216]; // 88px blocks, 12px gap
  const journey = step === 3;

  // Slide 1 highlights the single action whose pathways branch out below it
  const actionOn = (i: number) => (step === 0 && i === 3) || (journey && (i === 1 || i === 3));
  const pathwayOn = (i: number) => step === 1 || (journey && (i === 0 || i === 2));
  const resourceOn = (i: number) => step === 2 || (journey && i === 1);

  return (
    <svg
      viewBox="0 0 320 236"
      className="w-full max-w-[340px] mx-auto md:mx-0"
      role="img"
      aria-label="Toolkit structure: actions, implementation pathways and key resources"
    >
      {/* Connectors: one action branching to its pathways, one pathway to its resources;
          on the journey slide, a path linking two actions down to a shared resource */}
      {journey ? (
        <g className={`${linkOn} fill-none`} strokeWidth={2}>
          <path d="M100 64 V82 H60 V100" />
          <path d="M220 64 V82 H260 V100" />
          <path d="M60 136 V150 H160 V168" />
          <path d="M260 136 V150 H160" />
        </g>
      ) : (
        <g className={`${linkOff} fill-none`} strokeWidth={1.5} strokeDasharray="3 3">
          <path d="M220 64 V82 H60 V100 M160 82 V100 M220 82 H260 V100" />
          <path d="M60 136 V150 H260 V168 M60 150 V168 M160 150 V168" />
        </g>
      )}

      {/* Level 1: actions */}
      {actionX.map((x, i) => (
        <g key={`a${i}`}>
          <rect x={x} y={16} width={48} height={48} strokeWidth={1.5} className={actionOn(i) ? on : off} />
          <rect x={x + 8} y={26} width={10} height={10} className={actionOn(i) ? "fill-surface" : "fill-line"} />
        </g>
      ))}

      {/* Level 2: implementation pathways */}
      {blockX.map((x, i) => (
        <g key={`p${i}`}>
          <rect x={x} y={100} width={88} height={36} strokeWidth={1.5} className={pathwayOn(i) ? on : off} />
          <rect x={x + 10} y={112} width={52} height={4} className={pathwayOn(i) ? "fill-surface" : "fill-line"} />
          <rect x={x + 10} y={121} width={34} height={4} className={pathwayOn(i) ? "fill-surface/70" : "fill-line"} />
        </g>
      ))}

      {/* Level 3: key resources */}
      {blockX.map((x, i) => (
        <g key={`r${i}`}>
          <rect x={x} y={168} width={88} height={52} strokeWidth={1.5} className={resourceOn(i) ? on : off} />
          <rect x={x + 10} y={180} width={24} height={6} className={resourceOn(i) ? "fill-surface/70" : "fill-accent-light"} />
          <rect x={x + 10} y={194} width={60} height={4} className={resourceOn(i) ? "fill-surface" : "fill-line"} />
          <rect x={x + 10} y={203} width={44} height={4} className={resourceOn(i) ? "fill-surface" : "fill-line"} />
        </g>
      ))}
    </svg>
  );
}
