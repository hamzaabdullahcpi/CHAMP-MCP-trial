import { motion } from "motion/react";
import MindMapGraphic from "./MindMapGraphic";
import SplitHero from "./SplitHero";

import { Bot } from "lucide-react";

interface ActionsOverviewProps {
  actionsData?: any[];
  onNavigateToStep: (stepId: number, pathwayIdx?: number, example?: any) => void;
  heroImage: string;
  onOpenAiAssistant?: () => void;
}

export default function ActionsOverview({ actionsData, onNavigateToStep, heroImage, onOpenAiAssistant }: ActionsOverviewProps) {
  return (
    <div className="w-full">
      <SplitHero title="Actions" imageUrl={heroImage} imageAlt="Aerial view of a city">
        <p className="body-text-md text-ink-muted">
          Click "Explore" on any action to see its implementation pathways and key resources below, or click (→) to open the action page.
          Use the filter to show only the pathways led by a specific actor.
        </p>
        {onOpenAiAssistant && (
          <div className="mt-4">
            <button
              type="button"
              onClick={onOpenAiAssistant}
              className="inline-flex items-center gap-1.5 body-text-sm font-semibold text-ink hover:text-accent cursor-pointer transition-colors"
            >
              AI assistant
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent border border-accent/40 px-1 py-0.5 leading-none">
                Beta
              </span>
              <Bot size={15} className="text-accent" aria-hidden="true" />
            </button>
          </div>
        )}
      </SplitHero>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 md:px-12 lg:px-16 pt-8 max-w-7xl mx-auto"
      >
        <MindMapGraphic
          onNavigateToStep={onNavigateToStep}
          actionsData={actionsData}
          showHeading={false}
          showFilter
          layout="vertical"
        />
      </motion.div>
    </div>
  );
}
