import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { landingPageData } from "../data/content";

interface IntroPageProps {
  onNext: () => void;
}

export default function IntroPage({ onNext }: IntroPageProps) {
  return (
    <div className="max-w-5xl mx-auto pb-20 pt-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 border-b border-line pb-12"
      >
        <h1 className="title-h1 mb-6">
          Introduction.
        </h1>
        <p className="body-text leading-relaxed max-w-3xl">
          The CHAMP Opportunity for Multilevel Governance and Climate Finance
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-surface border border-line mb-12"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-line">
          {/* Left Column: Main Content */}
          <div className="lg:col-span-7 p-10 md:p-14 border-b lg:border-b-0 lg:border-r border-line space-y-10">
            <div>
              <h2 className="title-h2 mb-6">
                {landingPageData.champOpportunity.title}
              </h2>
              <p className="body-text leading-relaxed">
                {landingPageData.champOpportunity.goal}
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-ink-muted">Content Focus:</h3>
              <ul className="space-y-4">
                {landingPageData.champOpportunity.points.map((point, idx) => (
                  <li key={idx} className="flex gap-4 text-ink font-light leading-relaxed">
                    <div className="w-1.5 h-1.5 bg-accent mt-2 shrink-0 rotate-45" />
                    <span className="text-[15px]">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4">
              <a 
                href="https://www.cop28.com/en/cop28-uae-coalition-for-high-ambition-multilevel-partnerships-for-climate-action" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-surface border border-line text-ink hover:bg-paper hover:border-ink transition-colors px-6 py-3 text-[13px] font-bold uppercase tracking-wider"
              >
                Know more about CHAMP and MLG
                <ArrowUpRight size={16} className="text-ink-muted shrink-0" />
              </a>
            </div>
          </div>

          {/* Right Column: Case Study */}
          <div className="lg:col-span-5 bg-slate-50 flex flex-col">
            <div className="h-64 w-full bg-slate-900 relative shrink-0 border-b border-line">
              <img 
                src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=800&q=80" 
                alt="Case Study Thumbnail" 
                className="w-full h-full object-cover mix-blend-luminosity opacity-70"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-6 left-6 bg-surface px-3 py-1.5 text-xs font-bold tracking-wider uppercase text-ink border border-line">
                Case Study
              </div>
            </div>
            <div className="p-10 flex-1 flex flex-col justify-center">
              <h3 className="font-heading text-2xl font-medium text-ink mb-4">
                {landingPageData.champOpportunity.caseStudy.title}
              </h3>
              <p className="body-text-sm leading-relaxed">
                {landingPageData.champOpportunity.caseStudy.description}
              </p>
            </div>
          </div>
        </div>

        {/* Key Initiatives & Partnerships (Cards) */}
        <div className="bg-slate-50 p-10 md:p-14">
          <div className="mb-10">
            <h3 className="font-heading text-2xl font-medium text-ink mb-2">
              Global Ecosystem & Key Initiatives
            </h3>
            <p className="body-text-sm">
              Key initiatives supporting CHAMP and synergies with the toolkit.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line">
            {landingPageData.champOpportunity.initiatives.map((init, idx) => (
              <a
                key={idx}
                href={init.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col justify-between p-8 bg-surface hover:bg-paper transition-colors"
              >
                <div>
                  <span className="text-xs font-sans font-bold uppercase tracking-wider text-ink-muted mb-4 block truncate">{init.name}</span>
                  <h4 className="font-semibold text-ink text-sm leading-relaxed">{init.title}</h4>
                </div>
                <div className="mt-8 flex justify-end">
                  <div className="w-8 h-8 flex items-center justify-center border border-line bg-surface group-hover:bg-accent group-hover:border-accent transition-colors">
                    <ArrowUpRight size={14} className="text-ink-muted group-hover:text-surface transition-colors" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          className="inline-flex items-center gap-3 bg-ink text-surface px-8 py-4 text-[14px] font-bold uppercase tracking-wider hover:bg-accent transition-colors"
        >
          Continue to Step 01: Assess Environments
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
