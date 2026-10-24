export interface CountryPremise {
  number: number;
  title: string;
  description: string;
}

export interface CountryContextSection {
  title: string;
  paragraphs?: string[];
  bulletPoints?: { label?: string; text: string }[];
}

export interface CountryActionData {
  actionNumber: number;
  actionThemeTitle: string; // e.g. "• Shared Commitments"
  title: string;
  paragraphs: string[];
  caseStudy?: {
    title: string;
    paragraphs: string[];
  };
  enabledSummary: string;
}

export interface CountryJourneyData {
  order?: number;
  published?: boolean;
  countryId: string; // e.g. 'sweden', 'brazil', 'morocco'
  countryName: string;
  flag: string;
  status: string; // 'Available' | 'Coming Soon'
  isReady: boolean;
  tagline: string;
  summary: string;
  keyMechanisms: string[];
  cardImage?: string;
  themeColor?: string;

  // Header
  headerSubtitle: string;
  headerTitle: string;
  headerDescription: string;

  // Tab A - Context
  tabATitle: string;
  tabASubtitle: string;
  premisesHeading?: string;
  premisesIntro?: string;
  premises: CountryPremise[];
  contextSections: CountryContextSection[];

  // Tab B - Multilevel Model & Diagram
  tabBTitle: string;
  tabBSubtitle: string;
  modelHeading: string;
  modelOverview: string;
  modelDiagramNote?: string;
  diagramImageUrl?: string; // If empty or not provided, falls back to hardcoded image
  diagramImageAlt?: string;

  actionsHeading: string;
  actionsSubtitle?: string;
  actions: CountryActionData[];
}
