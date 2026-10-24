import { useState, useEffect, useRef } from "react";
import { resolveAssetUrl, defaultHeroImage } from "./utils/assetUtils";
import countryJourneysHeroImage from "./assets/country-journeys-hero.jpg";
import Sidebar from "./components/Sidebar";
import LandingPage from "./components/LandingPage";
import ActionsOverview from "./components/ActionsOverview";
import Breadcrumb, { BreadcrumbItem } from "./components/Breadcrumb";
import Footer from "./components/Footer";
import { ACTION_MENU_TITLES } from "./data/actionMenuTitles";
import StepView from "./components/StepView";
import CountryJourneysOverview from "./components/CountryJourneysOverview";
import CountryJourney from "./components/CountryJourney";
import ChampRoadmapModal from "./components/ChampRoadmapModal";
import PersonalisedGuidanceView from "./components/PersonalisedGuidanceView";
import ErrorBoundary from "./components/ErrorBoundary";
import { actionsData } from "./data/content";
import { defaultCountryJourneys } from "./data/countryJourneysData";
import { CountryJourneyData } from "./types/countryJourney";
import { 
  fetchAirtableAllContent, 
  defaultHomePageContent, 
  HomePageContent,
  CountryJourneysOverviewContent,
  defaultCountryJourneysOverviewContent
} from "./services/airtableService";
import { RoadmapPillar, defaultChampRoadmapData } from "./data/champRoadmapData";
import { ChampPledge, defaultChampPledgesData } from "./data/champPledgesData";
import { Menu } from "lucide-react";

export default function App() {
  const [currentStep, setCurrentStep] = useState<number | string>(0);
  const [deepLinkTarget, setDeepLinkTarget] = useState<any>(null);
  const [countryJourneyTarget, setCountryJourneyTarget] = useState<{ countryId: string; actionId?: number } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isRoadmapOpen, setIsRoadmapOpen] = useState(false);
  const [roadmapComponentId, setRoadmapComponentId] = useState<string | undefined>(undefined);

  const handleOpenRoadmap = (componentId?: string) => {
    setRoadmapComponentId(componentId);
    setIsRoadmapOpen(true);
  };
  const [liveActionsData, setLiveActionsData] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("champ_actions_cache_v6");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return actionsData;
  });
  const [liveHomePageData, setLiveHomePageData] = useState<HomePageContent>(() => {
    try {
      const saved = localStorage.getItem("champ_home_page_cache_v4");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return defaultHomePageContent;
  });
  const [liveCountryJourneys, setLiveCountryJourneys] = useState<CountryJourneyData[]>(() => {
    try {
      const saved = localStorage.getItem("champ_country_journeys_cache_v4");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return defaultCountryJourneys;
  });
  const [liveCountryJourneysOverview, setLiveCountryJourneysOverview] = useState<CountryJourneysOverviewContent>(() => {
    try {
      const saved = localStorage.getItem("champ_country_journeys_overview_cache_v4");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return defaultCountryJourneysOverviewContent;
  });
  const [liveRoadmapPillars, setLiveRoadmapPillars] = useState<RoadmapPillar[]>(() => {
    try {
      const saved = localStorage.getItem("champ_roadmap_cache_v4");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return defaultChampRoadmapData;
  });
  const [liveChampPledges, setLiveChampPledges] = useState<ChampPledge[]>(() => {
    try {
      const saved = localStorage.getItem("champ_pledges_cache_v4");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return defaultChampPledgesData;
  });
  const [isLoadingData, setIsLoadingData] = useState(true);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let isMounted = true;
    const loadContent = async () => {
      try {
        const { actions, homePage, countryJourneys, countryJourneysOverview, roadmapPillars, champPledges } = await fetchAirtableAllContent();
        if (isMounted) {
          if (actions && actions.length > 0) {
            setLiveActionsData(actions);
            try { localStorage.setItem("champ_actions_cache_v6", JSON.stringify(actions)); } catch (e) {}
          }
          if (homePage) {
            setLiveHomePageData(homePage);
            try { localStorage.setItem("champ_home_page_cache_v4", JSON.stringify(homePage)); } catch (e) {}
          }
          if (countryJourneys) {
            setLiveCountryJourneys(countryJourneys);
            try { localStorage.setItem("champ_country_journeys_cache", JSON.stringify(countryJourneys)); } catch (e) {}
          }
          if (countryJourneysOverview) {
            setLiveCountryJourneysOverview(countryJourneysOverview);
            try { localStorage.setItem("champ_country_journeys_overview_cache", JSON.stringify(countryJourneysOverview)); } catch (e) {}
          }
          if (roadmapPillars && roadmapPillars.length > 0) {
            setLiveRoadmapPillars(roadmapPillars);
            try { localStorage.setItem("champ_roadmap_cache", JSON.stringify(roadmapPillars)); } catch (e) {}
          }
          if (champPledges && champPledges.length > 0) {
            setLiveChampPledges(champPledges);
            try { localStorage.setItem("champ_pledges_cache", JSON.stringify(champPledges)); } catch (e) {}
          }
        }
      } catch (err) {
        console.error("Failed to load content, using local fallback", err);
      } finally {
        if (isMounted) {
          setIsLoadingData(false);
        }
      }
    };
    loadContent();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    // If navigating directly to a targeted action card in a country journey, do not reset scroll to top
    if (countryJourneyTarget) return;
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
    window.scrollTo({ top: 0 });
  }, [currentStep, countryJourneyTarget]);

  // Check if currentStep matches a country journey
  const matchedCountry = typeof currentStep === 'string' 
    ? liveCountryJourneys.find(c => c.countryId === currentStep.toLowerCase()) 
    : undefined;

  // Action pages (1-5), country journey pages, and guidance sit on a white background
  const isActionPage = typeof currentStep === 'number' && currentStep >= 1;

  // Breadcrumb trail for pages below a section (an action, a country), plus the
  // width that lines it up with that page's own content.
  const goTo = (step: number | string) => () => { setDeepLinkTarget(null); setCountryJourneyTarget(null); setCurrentStep(step); };
  const actionsCrumb: BreadcrumbItem = { label: 'Actions', onClick: goTo('actions') };
  const journeysCrumb: BreadcrumbItem = { label: 'Country Journeys', onClick: goTo('journeys') };
  const breadcrumb: { items: BreadcrumbItem[]; width: string } | null =
    isActionPage ? { items: [actionsCrumb, { label: ACTION_MENU_TITLES[Number(currentStep)] ?? `Action ${currentStep}` }], width: 'max-w-6xl mx-auto' }
    : matchedCountry ? { items: [journeysCrumb, { label: matchedCountry.countryName }], width: 'max-w-6xl mx-auto' }
    : currentStep === 'guidance' ? { items: [{ label: 'Home', onClick: goTo(0) }, { label: 'AI Assistant' }], width: 'max-w-6xl mx-auto' }
    : null;

  return (
    <div className="min-h-screen bg-paper flex font-sans selection:bg-accent selection:text-surface">
      <Sidebar 
        currentStep={currentStep} 
        setCurrentStep={setCurrentStep} 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        countryJourneys={liveCountryJourneys}
      />
      
      <main 
        ref={mainRef} 
        className={`flex-1 min-h-screen overflow-y-auto transition-all duration-300 ${
          isSidebarOpen ? 'ml-0 md:ml-72' : 'ml-0'
        } ${isActionPage || matchedCountry || currentStep === 'guidance' ? 'bg-surface' : ''}`}
      >
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="fixed top-6 left-6 z-50 p-2.5 bg-surface shadow-sm border border-line text-ink hover:text-accent hover:bg-paper transition-colors rounded-none cursor-pointer"
            aria-label="Open Sidebar"
          >
            <Menu size={20} className="stroke-[1.5]" />
          </button>
        )}

        {/* Homepage and the two overview pages have full-bleed headers; other pages sit in a padded column */}
        <div className={currentStep === 0 || currentStep === 'actions' || currentStep === 'journeys' ? "w-full pb-24" : "px-6 md:px-12 lg:px-16 pt-8 pb-24 max-w-7xl mx-auto"}>
          {breadcrumb && (
            <div className={`${breadcrumb.width} mb-8`}>
              <Breadcrumb items={breadcrumb.items} />
            </div>
          )}
          <ErrorBoundary>
            {currentStep === 0 ? (
              <LandingPage 
                onStart={() => setCurrentStep(1)} 
                onIntro={() => setCurrentStep(1)} 
                actionsData={liveActionsData}
                homePageData={liveHomePageData}
                roadmapPillars={liveRoadmapPillars}
                champPledges={liveChampPledges}
                onNavigateToStep={(id, pathwayIdx, example) => {
                    setCurrentStep(id);
                    if (pathwayIdx !== undefined) setDeepLinkTarget({ pathwayIndex: pathwayIdx, example });
                    else setDeepLinkTarget(null);
                  }}
                onOpenRoadmap={handleOpenRoadmap}
                onExploreAllActions={() => setCurrentStep('actions')}
                onExploreCountryJourneys={() => setCurrentStep('journeys')}
                countryJourneysImage={liveCountryJourneys.find(c => c.cardImage)?.cardImage}
              />
            ) : currentStep === 'actions' ? (
              <ActionsOverview
                actionsData={liveActionsData}
                heroImage={resolveAssetUrl(liveHomePageData?.hero?.imageUrl, defaultHeroImage)}
                onNavigateToStep={(id, pathwayIdx, example) => {
                    setCurrentStep(id);
                    if (pathwayIdx !== undefined) setDeepLinkTarget({ pathwayIndex: pathwayIdx, example });
                    else setDeepLinkTarget(null);
                  }}
              />
            ) : currentStep === 'guidance' ? (
              <PersonalisedGuidanceView 
                actionsData={liveActionsData}
                countryJourneys={liveCountryJourneys}
                onNavigateToAction={(actionId) => setCurrentStep(actionId)}
                onNavigateToCountry={(countryId) => setCurrentStep(countryId)}
                onBack={() => setCurrentStep(0)}
              />
            ) : currentStep === 'journeys' ? (
              <CountryJourneysOverview 
                countryJourneys={liveCountryJourneys}
                heroImage={countryJourneysHeroImage}
                overviewContent={liveCountryJourneysOverview}
                onSelectCountry={(countryId) => setCurrentStep(countryId)}
                onNavigateToCoreAction={(actionId) => setCurrentStep(actionId)}
              />
            ) : matchedCountry ? (
              <CountryJourney 
                countryData={matchedCountry}
                targetActionId={countryJourneyTarget?.countryId === matchedCountry.countryId ? countryJourneyTarget.actionId : undefined}
                onBackToJourneys={() => {
                  setCountryJourneyTarget(null);
                  setCurrentStep('journeys');
                }}
                onNavigateToCoreAction={(actionId) => {
                  setCountryJourneyTarget(null);
                  setDeepLinkTarget(null);
                  setCurrentStep(actionId);
                }}
              />
            ) : (
              <StepView 
                step={liveActionsData.find(s => Number(s.id) === Number(currentStep)) || liveActionsData[0]} 
                initialDeepLink={deepLinkTarget}
                onClearDeepLink={() => setDeepLinkTarget(null)}
                onNext={typeof currentStep === 'number' && currentStep < 5 ? () => { setDeepLinkTarget(null); setCurrentStep(currentStep + 1); } : undefined}
                onPrev={() => { 
                  setDeepLinkTarget(null); 
                  if (typeof currentStep === 'number') {
                    setCurrentStep(currentStep > 1 ? currentStep - 1 : 0);
                  } else {
                    setCurrentStep(0);
                  }
                }}
                isFirst={currentStep === 1 || Number(currentStep) === 1}
                isLast={currentStep === 5 || Number(currentStep) === 5}
                onNavigateToCountry={(countryId, actionId) => {
                  setCountryJourneyTarget({ countryId, actionId: actionId ? Number(actionId) : undefined });
                  setCurrentStep(countryId);
                }}
                onOpenRoadmap={handleOpenRoadmap}
              />
            )}
          </ErrorBoundary>
        </div>

        <Footer partnership={liveHomePageData?.partnership} onNavigate={(step) => goTo(step)()} />
      </main>

      {/* CHAMP Implementation Roadmap Explainer Modal */}
      <ChampRoadmapModal 
        isOpen={isRoadmapOpen}
        onClose={() => setIsRoadmapOpen(false)}
        onNavigateToAction={(actionId) => {
          setDeepLinkTarget(null);
          setCountryJourneyTarget(null);
          setCurrentStep(actionId);
          setIsRoadmapOpen(false);
        }}
        highlightedComponent={roadmapComponentId}
        roadmapPillars={liveRoadmapPillars}
      />
    </div>
  );
}
