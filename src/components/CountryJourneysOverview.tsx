import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight, LayoutGrid, SlidersHorizontal, Info } from 'lucide-react';
import { CountryJourneyData } from '../types/countryJourney';
import { defaultCountryJourneys } from '../data/countryJourneysData';
import { CountryJourneysOverviewContent, defaultCountryJourneysOverviewContent } from '../services/airtableService';
import { resolveAssetUrl } from '../utils/assetUtils';
import { toSentenceCase } from '../data/actionMenuTitles';
import SplitHero from './SplitHero';

interface CountryJourneysOverviewProps {
  countryJourneys?: CountryJourneyData[];
  overviewContent?: CountryJourneysOverviewContent;
  onSelectCountry: (countryId: string) => void;
  onNavigateToCoreAction?: (actionId: number) => void;
  heroImage: string;
}

export default function CountryJourneysOverview({ 
  countryJourneys = defaultCountryJourneys, 
  overviewContent = defaultCountryJourneysOverviewContent,
  onSelectCountry, 
  onNavigateToCoreAction,
  heroImage
}: CountryJourneysOverviewProps) {
  // Sort country journeys by order ascending (Sweden first, then Brazil, Morocco, etc.)
  const sortedJourneys = [...countryJourneys].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'slider' | 'grid'>('slider');

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);

      // Estimate active index based on scroll position
      const cardWidth = 360; // approximate card + gap
      const newIndex = Math.round(scrollLeft / cardWidth);
      setActiveIndex(Math.min(Math.max(0, newIndex), sortedJourneys.length - 1));
    }
  };

  useEffect(() => {
    checkScrollability();
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener('scroll', checkScrollability);
      window.addEventListener('resize', checkScrollability);
      return () => {
        el.removeEventListener('scroll', checkScrollability);
        window.removeEventListener('resize', checkScrollability);
      };
    }
  }, [sortedJourneys.length, viewMode]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 380;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollToCard = (index: number) => {
    if (scrollContainerRef.current) {
      const cardWidth = 380;
      scrollContainerRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="w-full pb-32">
      {/* Header: intro text on the left, photo on the right */}
      <SplitHero
        title={overviewContent.title || "Country Journeys"}
        imageUrl={heroImage}
        imageAlt="City skyline"
      >
        {/* Header keeps a single short intro, matching the Actions page header */}
        {overviewContent.introP1 && (
          <p className="body-text-md text-ink-muted">{overviewContent.introP1}</p>
        )}
      </SplitHero>

      <div className="px-6 md:px-12 lg:px-16 pt-12 max-w-7xl mx-auto">
      <div className="max-w-6xl mx-auto">
      {(overviewContent.introP2 || overviewContent.focusNote) && (
        <div className="body-text-md space-y-4 leading-relaxed max-w-4xl mb-12">
          {overviewContent.introP2 && (
            <p>{overviewContent.introP2}</p>
          )}
          {overviewContent.focusNote && (
            <p className="body-text-md text-ink-muted border-l-2 border-accent pl-4 py-1">
              {overviewContent.focusNote}
            </p>
          )}
        </div>
      )}

      {/* Featured Country Journeys Header & Controls */}
      <div className="mb-14">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="title-h2">
              {toSentenceCase(overviewContent.featuredSectionTitle || "Featured country journeys")}
            </h2>
          </div>

          {/* Controls: View Mode & Slider Navigation */}
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="inline-flex p-1 bg-surface border border-line rounded-none text-ink-muted">
              <button
                type="button"
                onClick={() => setViewMode('slider')}
                className={`p-1.5 rounded-none transition-all flex items-center gap-1.5 text-xs font-medium ${
                  viewMode === 'slider' 
                    ? 'bg-paper-strong text-accent' 
                    : 'text-ink-muted hover:text-ink'
                }`}
                title="Slider View"
              >
                <SlidersHorizontal size={15} />
                <span className="hidden md:inline">Slider</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-none transition-all flex items-center gap-1.5 text-xs font-medium ${
                  viewMode === 'grid' 
                    ? 'bg-paper-strong text-accent' 
                    : 'text-ink-muted hover:text-ink'
                }`}
                title="Grid View"
              >
                <LayoutGrid size={15} />
                <span className="hidden md:inline">Grid</span>
              </button>
            </div>

            {/* Slider Next / Prev Buttons */}
            {viewMode === 'slider' && sortedJourneys.length > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleScroll('left')}
                  disabled={!canScrollLeft}
                  className={`w-8 h-8 rounded-none border flex items-center justify-center transition-all ${
                    canScrollLeft 
                      ? 'bg-surface border-line text-ink hover:border-accent hover:text-accent' 
                      : 'border-line/40 text-ink-muted/30 cursor-not-allowed'
                  }`}
                  aria-label="Previous Country"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleScroll('right')}
                  disabled={!canScrollRight}
                  className={`w-8 h-8 rounded-none border flex items-center justify-center transition-all ${
                    canScrollRight 
                      ? 'bg-surface border-line text-ink hover:border-accent hover:text-accent' 
                      : 'border-line/40 text-ink-muted/30 cursor-not-allowed'
                  }`}
                  aria-label="Next Country"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Empty State if all unpublished */}
        {sortedJourneys.length === 0 ? (
          <div className="p-12 text-center bg-surface border border-line rounded-none">
            <Info size={32} className="mx-auto text-ink-muted mb-3" />
            <h3 className="body-text-md font-bold mb-1">
              No Country Journeys Published
            </h3>
            <p className="text-xs text-ink-muted max-w-md mx-auto">
              Make sure to check the <code>Published</code> box on your country records in Airtable to display them here.
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          /* GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedJourneys.map((j) => (
              <CountryCard
                key={j.countryId}
                journey={j}
                onSelectCountry={onSelectCountry}
              />
            ))}
          </div>
        ) : (
          /* SLIDER / CAROUSEL VIEW */
          <div className="relative">
            <div
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar scrollbar-none"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {sortedJourneys.map((j) => (
                <div 
                  key={j.countryId} 
                  className="w-[85vw] sm:w-[360px] md:w-[370px] flex-shrink-0 snap-start"
                >
                  <CountryCard
                    journey={j}
                    onSelectCountry={onSelectCountry}
                  />
                </div>
              ))}
            </div>

            {/* Slider Indicator Dots */}
            {sortedJourneys.length > 1 && (
              <div className="flex justify-center items-center gap-1.5 mt-4">
                {sortedJourneys.map((j, idx) => (
                  <button
                    key={j.countryId}
                    type="button"
                    onClick={() => scrollToCard(idx)}
                    className={`h-1.5 rounded-none transition-all duration-300 ${
                      activeIndex === idx 
                        ? 'w-6 bg-accent' 
                        : 'w-1.5 bg-line hover:bg-ink-muted/50'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      </div>
      </div>
    </div>
  );
}

/* Extracted Card Component for Crisp Consistency in Grid & Slider */
interface CountryCardProps {
  journey: CountryJourneyData;
  onSelectCountry: (countryId: string) => void;
}

function CountryCard({ journey: j, onSelectCountry }: CountryCardProps) {
  const isReady = j.isReady || j.status === 'Available';
  const isComingSoon = !isReady || j.status === 'Coming Soon';

  // Crisp text fallbacks
  const displayTagline = j.tagline || `${j.countryName} Multilevel Governance Model`;
  const displaySummary = j.summary || j.headerDescription || (
    isReady
      ? `Subnational climate governance frameworks, institutional platforms, and finance pathways in ${j.countryName}.`
      : `Country journey and multilevel governance analysis in preparation.`
  );

  return (
    <div
      className={`h-full rounded-none overflow-hidden flex flex-col transition-all duration-300 ${
        isReady 
          ? 'bg-surface border border-transparent hover:border-accent cursor-pointer group' 
          : 'bg-[#E5E7EB] dark:bg-slate-900/40 border border-line dark:border-slate-800/70 opacity-75 cursor-default select-none'
      }`}
      onClick={() => {
        if (isReady) {
          onSelectCountry(j.countryId);
        }
      }}
    >
      {/* Image Header */}
      <div className={`relative h-36 w-full overflow-hidden ${isReady ? 'bg-slate-900' : 'bg-line dark:bg-slate-800'}`}>
        {j.cardImage && (
          <img 
            src={resolveAssetUrl(j.cardImage, '')} 
            alt={j.countryName} 
            className={`w-full h-full object-cover ${
              isReady ? '' : 'grayscale contrast-75 brightness-95 opacity-70'
            }`} 
          />
        )}
        <div className={`absolute inset-0 ${isReady ? 'bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent' : 'bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent'}`} />
        
        <div className="absolute top-3 left-3.5 flex items-center gap-1.5">
          <span className="text-white font-heading font-semibold text-base sm:text-lg drop-shadow-md tracking-tight">
            {j.countryName}
          </span>
        </div>

        {isComingSoon && (
          <div className="absolute top-3 right-3">
            <span className="text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-none bg-slate-800/90 text-slate-200 border border-slate-600/50 backdrop-blur-xs">
              Coming Soon
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className={`body-text-md font-bold leading-snug mb-1.5 ${
            isReady ? '' : 'text-ink/80'
          }`}>
            {displayTagline}
          </h3>
          
          <p className={`body-text-sm leading-relaxed line-clamp-3 ${
            isReady ? 'text-ink-muted' : 'text-ink-muted/80'
          }`}>
            {displaySummary}
          </p>
        </div>

        {/* Key Mechanisms / Highlights Pills if present */}
        {j.keyMechanisms && j.keyMechanisms.length > 0 && (
          <div className="pt-1">
            <div className="flex flex-wrap gap-1">
              {j.keyMechanisms.slice(0, 3).map((mech, idx) => (
                <span 
                  key={idx} 
                  className={`text-[12px] px-2.5 py-1 rounded-none ${
                    isReady ? 'bg-ink-muted/10 text-ink' : 'bg-ink-muted/5 text-ink-muted/70'
                  }`}
                >
                  {mech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Link */}
        <div className="pt-2.5 border-t border-line/60 flex items-center justify-between mt-auto">
          <span className={`text-xs font-semibold flex items-center gap-0.5 ${
            isReady ? 'text-accent' : 'text-ink-muted/70'
          }`}>
            {isReady ? (
              <>
                Explore country journey
                <ArrowRight size={13} />
              </>
            ) : (
              <>
                In Development
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

