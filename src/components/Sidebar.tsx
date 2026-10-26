import { 
  Home, 
  X, 
  Compass
} from "lucide-react";
import { CountryJourneyData } from "../types/countryJourney";
import { ACTION_MENU_TITLES } from "../data/actionMenuTitles";
import { defaultCountryJourneys } from "../data/countryJourneysData";
import { actionAccentStyle } from "../utils/actionThemes";

interface SidebarProps {
  currentStep: number | string;
  setCurrentStep: (step: number | string) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
  countryJourneys?: CountryJourneyData[];
}

export default function Sidebar({ 
  currentStep, 
  setCurrentStep, 
  isOpen, 
  toggleSidebar,
  countryJourneys = defaultCountryJourneys
}: SidebarProps) {

  const navItemsGeneral: { id: number | string, label: string }[] = [
    { id: 0, label: "Home" },
  ];

  const navItemsCoreActions: { id: number | string, label: string }[] = [
    ...[1, 2, 3, 4, 5].map((id) => ({ id, label: `${id}. ${ACTION_MENU_TITLES[id]}` })),
  ];

  const navItemsCountryJourneys: { id: number | string, label: string }[] = [
    ...countryJourneys.map(j => ({
      id: j.countryId,
      label: j.countryName
    }))
  ];

  const handleNavClick = (id: number | string) => {
    setCurrentStep(id);
  };

  // Top-level link (Home) styled like the section headers below them
  const renderTopLink = (item: { id: number | string, label: string }) => {
    const isActive = currentStep === item.id;
    return (
      <button
        key={item.id}
        onClick={() => handleNavClick(item.id)}
        aria-current={isActive ? "page" : undefined}
        className={`w-full text-left px-6 py-2 border-l-2 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors ${
          isActive
            ? "bg-[#E5E7EB] border-accent text-ink"
            : "border-transparent text-ink-muted hover:bg-[#E5E7EB]/50 hover:border-accent/50 hover:text-ink"
        }`}
      >
        {item.label}
      </button>
    );
  };

  // Section header: the label opens the section's overview page; its items are always listed below
  const renderSectionHeader = (label: string, pageId: string) => {
    const isActive = currentStep === pageId;
    return (
      <button
        onClick={() => handleNavClick(pageId)}
        aria-current={isActive ? "page" : undefined}
        className={`w-full text-left mb-1 px-6 py-2 border-l-2 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors ${
          isActive
            ? "bg-[#E5E7EB] border-accent text-ink"
            : "border-transparent text-ink-muted hover:bg-[#E5E7EB]/50 hover:border-accent/50 hover:text-ink"
        }`}
      >
        {label}
      </button>
    );
  };

  const renderNavItems = (items: { id: number | string, label: string }[]) => {
    return items.map((item) => {
      const isActive = currentStep === item.id;
      return (
        <button
          key={item.id}
          onClick={() => handleNavClick(item.id)}
          // Core actions use their own page colour for the side bar
          style={typeof item.id === 'number' ? actionAccentStyle(item.id) : undefined}
          className={`group w-full flex items-center justify-between px-6 py-1.5 text-sm transition-all duration-200 border-l-2 ${
            isActive
              ? "bg-[#E5E7EB] border-accent text-ink font-semibold"
              : "border-transparent text-ink-muted hover:bg-[#E5E7EB]/50 hover:border-accent/50 hover:text-ink font-medium"
          }`}
        >
          <span className="text-left tracking-tight">{item.label}</span>
        </button>
      );
    });
  };

  return (
    <div 
      className={`w-72 h-screen bg-surface border-r border-line flex flex-col fixed left-0 top-0 z-50 transition-all duration-300 ease-in-out ${
        isOpen ? 'translate-x-0 shadow-2xl md:shadow-lg' : '-translate-x-full shadow-none'
      } overflow-hidden`}
    >
      <div className="p-6 border-b border-line flex justify-between items-center shrink-0">
        <div>
          <h1 className="font-display font-bold text-[28px] text-ink leading-[1.2] tracking-tight">
            <button
              type="button"
              onClick={() => handleNavClick(0)}
              className="cursor-pointer hover:opacity-70 transition-opacity"
              title="Go to homepage"
            >
              CHAMP Toolkit
            </button>
          </h1>
          <p className="text-[10px] text-accent tracking-[0.1em] mt-1">
            FOR NATIONAL GOVERNMENTS, CITIES AND FRIENDS OF CHAMP
          </p>
        </div>
        <button 
          onClick={toggleSidebar}
          className="p-1.5 text-ink-muted hover:text-ink hover:bg-paper transition-colors rounded-sm cursor-pointer"
          aria-label="Close Sidebar"
        >
          <X size={16} className="stroke-[1.5]" />
        </button>
      </div>

      <nav className="flex-1 py-6 flex flex-col overflow-y-auto custom-scrollbar">
        <div className="mb-4">
          {navItemsGeneral.map(renderTopLink)}
        </div>

        <div className="mb-4">
          {renderSectionHeader("Actions", "actions")}
          {renderNavItems(navItemsCoreActions)}
        </div>

        <div>
          {renderSectionHeader("Country Journeys", "journeys")}
          {renderNavItems(navItemsCountryJourneys)}
        </div>
      </nav>
    </div>
  );
}
