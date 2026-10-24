import { actionsData } from "../data/content";
import { CountryJourneyData } from "../types/countryJourney";
import { defaultCountryJourneys, swedenJourneyDefaultData } from "../data/countryJourneysData";
import { RoadmapPillar, defaultChampRoadmapData } from "../data/champRoadmapData";
import { ChampPledge, defaultChampPledgesData } from "../data/champPledgesData";

export interface SubExample {
  title: string;
  excerpt?: string;
  fullText?: string;
  link?: string;
}

export interface IllustrativeExample {
  title: string;
  type?: "Illustrative Example" | "Tool" | string;
  excerpt?: string;
  fullText?: string;
  link?: string;
  connectionLine?: string;
  order?: number;
  subExamples?: SubExample[];
}

export interface ImplementationStep {
  title: string;
  content: string;
}

export interface ConceptBox {
  id?: string;
  title: string;
  category?: string;
  excerpt?: string;
  fullText?: string;
  section?: string;
  link?: string;
  order?: number;
}

export interface ResourceItem {
  title: string;
  type?: string;
  publisher?: string;
  link?: string;
  description?: string;
  order?: number;
}

export interface Pathway {
  title: string;
  overview?: string;
  whatItIs?: string;
  whyItIsNeeded?: string;
  potentialNationalLead?: string[];
  keyActors?: string[];
  transferabilityTitle?: string;
  transferabilityPreamble?: string;
  transferability?: string[];
  enablingConditions?: string[];
  implementationGuidance?: ImplementationStep[];
  illustrativeExamples?: IllustrativeExample[];
  conceptBoxes?: ConceptBox[];
  resources?: ResourceItem[];
  order?: number;
}

export interface Action {
  id: number;
  title: string;
  description: string;
  systemsLogic?: string;
  pathways: Pathway[];
}

export interface HomePageHero {
  eyebrow: string;
  titleBadge: string;
  titleMain: string;
  titleSub: string;
  description: string;
  imageUrl: string;
}

export interface HomePagePartnership {
  title: string;
  description: string;
  partner1Name: string;
  partner1LogoUrl: string;
  partner1Url?: string;
  partner2Name: string;
  partner2LogoUrl: string;
  partner2Url?: string;
  learnMoreLabel?: string;
  supportedByLabel: string;
  supportedByName: string;
  supportedByLogoUrl: string;
}

export interface ToolkitSectionItem {
  name: string;
  heading: string;
  description: string;
}

export interface HowToUseContent {
  title: string;
  intro: string;
  items: ToolkitSectionItem[];
}

export interface HomePageContent {
  hero: HomePageHero;
  partnership: HomePagePartnership;
  howToUse?: HowToUseContent;
}

export const defaultHowToUseContent: HowToUseContent = {
  title: "How to Use the Toolkit",
  intro: "The CHAMP Toolkit is designed primarily for national governments, working with cities and subnational authorities, Friends of CHAMP and development partners, to mobilize finance for implementation of urban and subnational climate action.\n\nExplore the 5 Actions — each containing Implementation Pathways, practical guidance, tools and illustrative examples.",
  items: [
    {
      name: "Actions",
      heading: "Start with what needs to happen.",
      description:
        "Five interconnected areas of action that help national and subnational governments strengthen the governance, investment and implementation systems needed to deliver CHAMP commitments.",
    },
    {
      name: "Implementation Pathways",
      heading: "Choose a way to put the Action into practice.",
      description:
        "Practical approaches to finance and implementation that national governments and their partners can adapt to their context.",
    },
    {
      name: "Implementation Guidance",
      heading: "Follow practical guidance for each pathway.",
      description:
        "Key steps and considerations to help national governments and partners apply the pathways. Implementation guidance will include Illustrative Examples showing real-world applications of each Implementation Pathway and Tools, which are practical frameworks and resources supporting the implementation.",
    },
    {
      name: "Country Journeys",
      heading: "See how the pieces connect.",
      description:
        "Deeper country examples showing how multiple Actions and pathways connect across levels of government as part of a wider climate governance, investment and implementation system.",
    },
  ],
};

export const defaultHomePageContent: HomePageContent = {
  hero: {
    eyebrow: "A toolkit for national governments, cities and friends of CHAMP",
    titleBadge: "CHAMP",
    titleMain: "Toolkit",
    titleSub: "for Multilevel Climate governance and finance.",
    description: "Supporting the ‘CHAMP Investment Pledge’ delivery through guidance on policy reform, governance, investment pipelines, project aggregation and financial instruments.",
    imageUrl: "/images/hero-city.jpg",
  },
  partnership: {
    title: "A Joint Contribution to CHAMP",
    description: "This toolkit is a strategic partnership between CCFLA and Viable Cities. A key goal of this toolkit is to showcase impactful multilevel governance initiatives championed in Sweden.",
    partner1Name: "CCFLA",
    partner1LogoUrl: "https://www.climatepolicyinitiative.org/wp-content/uploads/2020/09/CCFLA-hero.png",
    partner1Url: "https://citiesclimatefinance.org",
    partner2Name: "Viable Cities",
    partner2LogoUrl: "https://images.squarespace-cdn.com/content/v1/59e86b55aeb625e2140eec1a/1634044375194-3G0ZG1T5HGMGNB2QSEYU/1.+VC_Logotyp_PRIM%C3%84R_RGB.png",
    partner2Url: "https://viablecities.se",
    learnMoreLabel: "Learn more:",
    supportedByLabel: "Supported by",
    supportedByName: "Sweden",
    supportedByLogoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Flag_of_Sweden.svg/3840px-Flag_of_Sweden.svg.png",
  },
  howToUse: defaultHowToUseContent,
};

export interface CountryJourneysOverviewContent {
  badge: string;
  title: string;
  introP1: string;
  introP2: string;
  focusNote: string;
  featuredSectionTitle: string;
}

export const defaultCountryJourneysOverviewContent: CountryJourneysOverviewContent = {
  badge: "Country Journeys",
  title: "Country Journeys",
  introP1: "The Country Journeys contain deep dive analysis grounded in real-world contexts, showcasing institutional relationships, learning loops, implementation cycles, accountability mechanisms, and enabling conditions required to implement and scale Implementation Pathways across different countries.",
  introP2: "Country Journeys are intended not only to document implementation approaches, but also to showcase how cities, regions and national governments have co-developed practical solutions that can inform other CHAMP countries.",
  focusNote: "Special focus on the interactions between institutions and programs, governance capabilities, intermediary functions, financing and implementation platforms, and feedback loops required to sustain long-term climate investment.",
  featuredSectionTitle: "Featured Country Journeys",
};

export function parseCountryJourneysOverviewRecords(
  overviewRecords: any[] = [],
  countryRecords: any[] = [],
  homeRecords: any[] = []
): CountryJourneysOverviewContent {
  const result: CountryJourneysOverviewContent = {
    ...defaultCountryJourneysOverviewContent,
  };

  // 1. Parse from dedicated "Country Journeys Overview" table
  if (overviewRecords && overviewRecords.length > 0) {
    // Check row-based key-value pairs
    for (const record of overviewRecords) {
      const f = record.fields || {};
      const key = String(f["Item Key"] || f["Key"] || f["Element Key"] || f["Label / Element"] || "").toLowerCase().trim();
      const text = String(f["Text Content"] || f["Content"] || f["Text"] || f["Value"] || "").trim();
      const subText = String(f["Sub-Text / Secondary"] || f["Sub-Text"] || f["Secondary"] || f["Subtitle"] || "").trim();

      if (!text && !subText) continue;

      if (key.includes("page_eyebrow") || key.includes("eyebrow") || key.includes("badge") || key.includes("tag")) {
        result.badge = text || subText;
      } else if (key.includes("page_title") || key.includes("main_title") || key.includes("main page title") || key === "title") {
        result.title = text;
      } else if (key.includes("intro_p1") || key.includes("paragraph 1") || key.includes("intro p1") || key.includes("intro 1")) {
        result.introP1 = text;
      } else if (key.includes("intro_p2") || key.includes("paragraph 2") || key.includes("intro p2") || key.includes("intro 2")) {
        result.introP2 = text;
      } else if (key.includes("focus_note") || key.includes("focus note") || key.includes("callout") || key.includes("special focus")) {
        result.focusNote = text;
      } else if (key.includes("featured_section_title") || key.includes("featured title") || key.includes("featured section") || key.includes("case studies")) {
        result.featuredSectionTitle = text;
      }
    }

    // Check single-record column-based schema
    if (overviewRecords.length === 1) {
      const f = overviewRecords[0].fields || {};
      if (f["Page Tag / Eyebrow"] || f["Page Eyebrow"] || f["Badge"]) {
        result.badge = f["Page Tag / Eyebrow"] || f["Page Eyebrow"] || f["Badge"];
      }
      if (f["Main Page Title"] || f["Page Title"] || f["Title"]) {
        result.title = f["Main Page Title"] || f["Page Title"] || f["Title"];
      }
      if (f["Intro Paragraph 1"] || f["Intro 1"] || f["Description 1"]) {
        result.introP1 = f["Intro Paragraph 1"] || f["Intro 1"] || f["Description 1"];
      }
      if (f["Intro Paragraph 2"] || f["Intro 2"] || f["Description 2"]) {
        result.introP2 = f["Intro Paragraph 2"] || f["Intro 2"] || f["Description 2"];
      }
      if (f["Special Focus / Callout Note"] || f["Callout Note"] || f["Focus Note"]) {
        result.focusNote = f["Special Focus / Callout Note"] || f["Callout Note"] || f["Focus Note"];
      }
      if (f["Featured Countries Section Title"] || f["Featured Section Title"] || f["Featured Title"]) {
        result.featuredSectionTitle = f["Featured Countries Section Title"] || f["Featured Section Title"] || f["Featured Title"];
      }
    }
  }

  // 2. Fallback check: if there is an overview record in "Country Journeys" table
  if (countryRecords && countryRecords.length > 0) {
    const overviewRow = countryRecords.find(r => {
      const id = String(r.fields?.["Country ID"] || r.fields?.["Slug"] || "").toLowerCase().trim();
      const name = String(r.fields?.["Country Name"] || r.fields?.["Country"] || "").toLowerCase().trim();
      return id === 'overview' || id === 'main' || id === 'journeys' || name === 'country journeys overview';
    });
    if (overviewRow) {
      const f = overviewRow.fields || {};
      if (f["Header Title"] || f["Country Name"]) result.title = f["Header Title"] || f["Country Name"];
      if (f["Header Subtitle"] || f["Tagline"]) result.badge = f["Header Subtitle"] || f["Tagline"];
      if (f["Summary"] || f["Header Description"]) result.introP1 = f["Summary"] || f["Header Description"];
      if (f["Actions Heading"]) result.featuredSectionTitle = f["Actions Heading"];
    }
  }

  // 3. Fallback check: Home Page records with keys for country journeys overview
  if (homeRecords && homeRecords.length > 0) {
    for (const r of homeRecords) {
      const f = r.fields || {};
      const key = String(f["Item Key"] || f["Key"] || "").toLowerCase().trim();
      const text = String(f["Text Content"] || f["Content"] || "").trim();
      if (!text) continue;
      if (key.includes("country_journey_title") || key.includes("country_journeys_title")) {
        result.title = text;
      } else if (key.includes("country_journey_featured") || key.includes("country_journeys_featured")) {
        result.featuredSectionTitle = text;
      }
    }
  }

  return result;
}

export function parseHomePageRecords(homeRecords: any[]): HomePageContent {
  const result: HomePageContent = {
    hero: { ...defaultHomePageContent.hero },
    partnership: { ...defaultHomePageContent.partnership },
    howToUse: {
      title: defaultHowToUseContent.title,
      intro: defaultHowToUseContent.intro,
      items: defaultHowToUseContent.items.map(item => ({ ...item })),
    },
  };

  if (!homeRecords || homeRecords.length === 0) {
    return result;
  }

  for (const record of homeRecords) {
    const f = record.fields || {};
    const key = String(f["Item Key"] || f["Key"] || f["Element Key"] || f["Label / Element"] || "").toLowerCase().trim();
    const label = String(f["Label / Element"] || "").toLowerCase().trim();
    const text = (f["Text Content"] || f["Content"] || f["Text"] || f["Value"] || "").trim();
    const subText = (f["Sub-Text / Secondary"] || f["Sub-Text"] || f["Secondary"] || f["Subtitle"] || f["Badge"] || "").trim();
    const url = (f["Image / Link URL"] || f["Image URL"] || f["URL"] || f["Link"] || "").trim();

    if (key.includes("hero_eyebrow") || key.includes("eyebrow") || key.includes("tag")) {
      if (text) result.hero.eyebrow = text;
    } else if (key.includes("hero_title") || key.includes("main title")) {
      if (text) result.hero.titleMain = text;
      if (subText) result.hero.titleBadge = subText;
    } else if (key.includes("hero_subtitle") || key.includes("subtitle")) {
      if (text) result.hero.titleSub = text;
    } else if (key.includes("hero_description") || key.includes("hero description") || key.includes("intro paragraph")) {
      if (text) result.hero.description = text;
    } else if (key.includes("hero_image") || key.includes("background image")) {
      if (url) result.hero.imageUrl = url;
      else if (text && text.startsWith("http")) result.hero.imageUrl = text;
    } else if (key.includes("partnership_title") || key.includes("partnership section title") || key.includes("contribution title")) {
      if (text) result.partnership.title = text;
    } else if (key.includes("partnership_description") || key.includes("partnership body") || key.includes("partnership desc")) {
      if (text) result.partnership.description = text;
    } else if (key.includes("learn_more_ccfla") || key.includes("partner_1_link") || key.includes("ccfla_link") || key.includes("partner_1_url")) {
      if (text) result.partnership.partner1Name = text;
      if (url) result.partnership.partner1Url = url;
      else if (text && (text.startsWith("http://") || text.startsWith("https://"))) result.partnership.partner1Url = text;
    } else if (key.includes("learn_more_viable") || key.includes("partner_2_link") || key.includes("viable_cities_link") || key.includes("partner_2_url")) {
      if (text) result.partnership.partner2Name = text;
      if (url) result.partnership.partner2Url = url;
      else if (text && (text.startsWith("http://") || text.startsWith("https://"))) result.partnership.partner2Url = text;
    } else if (key.includes("learn_more_label") || key.includes("learn_more_title") || key.includes("learn more text")) {
      if (text) result.partnership.learnMoreLabel = text;
    } else if (key.includes("partner_1") || key.includes("partner 1") || key.includes("ccfla")) {
      if (text) result.partnership.partner1Name = text;
      if (url) result.partnership.partner1LogoUrl = url;
      if (subText && (subText.startsWith("http://") || subText.startsWith("https://"))) {
        result.partnership.partner1Url = subText;
      }
    } else if (key.includes("partner_2") || key.includes("partner 2") || key.includes("viable cities")) {
      if (text) result.partnership.partner2Name = text;
      if (url) result.partnership.partner2LogoUrl = url;
      if (subText && (subText.startsWith("http://") || subText.startsWith("https://"))) {
        result.partnership.partner2Url = subText;
      }
    } else if (key.includes("supported_by") || key.includes("supported by") || key.includes("sponsor") || key.includes("sweden")) {
      if (text) result.partnership.supportedByName = text;
      if (subText) result.partnership.supportedByLabel = subText;
      if (url) result.partnership.supportedByLogoUrl = url;
    } else if (key.includes("how_to_use_intro") || key.includes("how_to_use_text") || label.includes("how to use: intro") || label.includes("how to use intro")) {
      if (text && result.howToUse) result.howToUse.intro = text;
    } else if (key.includes("how_to_use_title") || label.includes("how to use: modal title") || label.includes("how to use title")) {
      if (text && result.howToUse) result.howToUse.title = text;
    } else if (key.includes("how_to_use_actions") || key.includes("how_to_use_item_1") || label.includes("how to use: actions") || label === "actions") {
      if (result.howToUse) {
        const item = result.howToUse.items.find(i => i.name === "Actions");
        if (item) {
          if (subText) item.heading = subText;
          if (text) item.description = text;
        }
      }
    } else if (key.includes("how_to_use_pathways") || key.includes("how_to_use_item_2") || label.includes("how to use: implementation pathways") || label.includes("how to use: pathways")) {
      if (result.howToUse) {
        const item = result.howToUse.items.find(i => i.name === "Implementation Pathways");
        if (item) {
          if (subText) item.heading = subText;
          if (text) item.description = text;
        }
      }
    } else if (key.includes("how_to_use_guidance") || key.includes("how_to_use_item_3") || label.includes("how to use: implementation guidance") || label.includes("how to use: guidance")) {
      if (result.howToUse) {
        const item = result.howToUse.items.find(i => i.name === "Implementation Guidance");
        if (item) {
          if (subText) item.heading = subText;
          if (text) item.description = text;
        }
      }
    } else if (key.includes("how_to_use_journeys") || key.includes("how_to_use_item_4") || label.includes("how to use: country journeys") || label.includes("how to use: journeys")) {
      if (result.howToUse) {
        const item = result.howToUse.items.find(i => i.name === "Country Journeys");
        if (item) {
          if (subText) item.heading = subText;
          if (text) item.description = text;
        }
      }
    }
  }

  if (homeRecords.length === 1) {
    const f = homeRecords[0].fields || {};
    if (f["Hero Eyebrow"]) result.hero.eyebrow = f["Hero Eyebrow"];
    if (f["Hero Title"]) result.hero.titleMain = f["Hero Title"];
    if (f["Hero Badge"]) result.hero.titleBadge = f["Hero Badge"];
    if (f["Hero Subtitle"]) result.hero.titleSub = f["Hero Subtitle"];
    if (f["Hero Description"]) result.hero.description = f["Hero Description"];
    if (f["Hero Image URL"]) result.hero.imageUrl = f["Hero Image URL"];
    if (f["Partnership Title"]) result.partnership.title = f["Partnership Title"];
    if (f["Partnership Description"]) result.partnership.description = f["Partnership Description"];
    if (f["Partner 1 Name"]) result.partnership.partner1Name = f["Partner 1 Name"];
    if (f["Partner 1 Logo"]) result.partnership.partner1LogoUrl = f["Partner 1 Logo"];
    if (f["Partner 1 URL"] || f["Partner 1 Link"]) result.partnership.partner1Url = f["Partner 1 URL"] || f["Partner 1 Link"];
    if (f["Partner 2 Name"]) result.partnership.partner2Name = f["Partner 2 Name"];
    if (f["Partner 2 Logo"]) result.partnership.partner2LogoUrl = f["Partner 2 Logo"];
    if (f["Partner 2 URL"] || f["Partner 2 Link"]) result.partnership.partner2Url = f["Partner 2 URL"] || f["Partner 2 Link"];
    if (f["Learn More Label"]) result.partnership.learnMoreLabel = f["Learn More Label"];
    if (f["Supported By Label"]) result.partnership.supportedByLabel = f["Supported By Label"];
    if (f["Supported By Name"]) result.partnership.supportedByName = f["Supported By Name"];
    if (f["Supported By Logo"]) result.partnership.supportedByLogoUrl = f["Supported By Logo"];
    if (f["How to Use Intro"] || f["How to Use Description"]) {
      if (result.howToUse) result.howToUse.intro = f["How to Use Intro"] || f["How to Use Description"];
    }
    if (f["How to Use Title"]) {
      if (result.howToUse) result.howToUse.title = f["How to Use Title"];
    }
  }

  return result;
}

/**
 * Standardized Country Journeys Parser
 * Reads from:
 * 1. "Country Journeys" (Main records for each country)
 * 2. "Country Sections" (Tab A context sections, bullet points, and premises)
 * 3. "Country Actions" (Tab B 6 Actions mapping, case studies, enabled summaries)
 */
export function parseCountryJourneyRecords(
  countryRecords: any[] = [],
  sectionRecords: any[] = [],
  actionRecords: any[] = []
): CountryJourneyData[] {
  if (!countryRecords || countryRecords.length === 0) {
    return defaultCountryJourneys;
  }

  const result: CountryJourneyData[] = [];

  for (const cRec of countryRecords) {
    const f = cRec.fields || {};
    const published = f["Published"] === true || f["Show in Toolkit"] === true;
    if (!published) continue;

    const countryId = String(f["Country ID"] || f["Slug"] || f["Country"] || "").toLowerCase().trim();
    if (!countryId) continue;

    // Find fallback default if available (e.g. sweden)
    const fallback: CountryJourneyData = defaultCountryJourneys.find(d => d.countryId === countryId) || {
      order: 99,
      countryId,
      countryName: f["Country Name"] || f["Country"] || countryId.toUpperCase(),
      flag: f["Flag Emoji"] || f["Flag"] || "🌍",
      status: f["Status"] || "Available",
      isReady: f["Is Ready"] !== undefined ? Boolean(f["Is Ready"]) : true,
      tagline: f["Tagline"] || "",
      summary: f["Summary"] || "",
      keyMechanisms: [],
      cardImage: "",
      themeColor: f["Theme Color"] || "#207B6A",
      headerSubtitle: `• ${f["Country Name"] || countryId} Deep Dive`,
      headerTitle: `${f["Country Name"] || countryId}’s Multilevel Governance and Implementation Journey`,
      headerDescription: f["Summary"] || "",
      tabATitle: "The Context",
      tabASubtitle: "An Evolving Mission-Oriented Approach",
      premisesHeading: "Central Premises",
      premisesIntro: "",
      premises: [],
      contextSections: [],
      tabBTitle: "The Multilevel Model",
      tabBSubtitle: "Architecture Diagram & 5 Multilevel Governance Actions",
      modelHeading: `${f["Country Name"] || countryId}’s Multilevel Climate Governance Model`,
      modelOverview: "",
      modelDiagramNote: "Click on the image or the Fullscreen button to zoom and pan.",
      diagramImageUrl: "",
      diagramImageAlt: `${f["Country Name"] || countryId} Architecture Diagram`,
      actionsHeading: `${f["Country Name"] || countryId}'s Journey Across the 5 Actions`,
      actionsSubtitle: "",
      actions: [],
    };

    const countryName = f["Country Name"] || f["Country"] || fallback.countryName;
    const flag = f["Flag Emoji"] || f["Flag"] || fallback.flag;
    const status = f["Status"] || (f["Is Ready"] === false ? "Coming Soon" : fallback.status);
    const isReady = f["Is Ready"] !== undefined ? Boolean(f["Is Ready"]) : (status === "Available");
    const order = Number(f["Order"]) || fallback.order || 99;
    const tagline = f["Tagline"] !== undefined ? f["Tagline"] : fallback.tagline;
    const summary = f["Summary"] !== undefined ? f["Summary"] : fallback.summary;
    
    // Key Mechanisms / Highlights
    let keyMechanisms: string[] = fallback.keyMechanisms || [];
    const rawHighlights = f["Key Highlights"] !== undefined ? f["Key Highlights"] : f["Key Mechanisms"];
    if (rawHighlights !== undefined) {
      if (Array.isArray(rawHighlights)) {
        keyMechanisms = rawHighlights.map(s => String(s).trim()).filter(Boolean);
      } else {
        keyMechanisms = String(rawHighlights).split(/\r?\n|,/).map(s => s.replace(/^[•\-\*]\s*/, '').trim()).filter(Boolean);
      }
    }

    let cardImage = fallback.cardImage;
    if (Array.isArray(f["Card Image Attachment"]) && f["Card Image Attachment"].length > 0) {
      cardImage = f["Card Image Attachment"][0].url;
    } else if (Array.isArray(f["Card Image"]) && f["Card Image"].length > 0) {
      cardImage = f["Card Image"][0].url;
    } else if (f["Card Image URL"] || f["Cover Image"] || f["Card Image"]) {
      cardImage = f["Card Image URL"] || f["Cover Image"] || f["Card Image"] || fallback.cardImage;
    }
    const themeColor = f["Theme Color"] || fallback.themeColor;

    // Header & Tabs
    const headerTitle = f["Header Title"] || fallback.headerTitle;
    const headerSubtitle = f["Header Subtitle"] || fallback.headerSubtitle;
    const headerDescription = f["Header Description"] || fallback.headerDescription;

    const tabATitle = f["Tab A Title"] || fallback.tabATitle;
    const tabASubtitle = f["Tab A Subtitle"] || fallback.tabASubtitle;
    const premisesHeading = f["Premises Heading"] || fallback.premisesHeading;
    const premisesIntro = f["Premises Intro"] !== undefined ? f["Premises Intro"] : fallback.premisesIntro;

    const tabBTitle = f["Tab B Title"] || fallback.tabBTitle;
    const tabBSubtitle = f["Tab B Subtitle"] || fallback.tabBSubtitle;
    const modelHeading = f["Model Heading"] || fallback.modelHeading;
    const modelOverview = f["Model Overview"] || fallback.modelOverview;
    const modelDiagramNote = f["Model Diagram Note"] || fallback.modelDiagramNote;
    
    // Diagram image: check Attachment array or string URL
    let diagramImageUrl = "";
    if (Array.isArray(f["Diagram Attachment"]) && f["Diagram Attachment"].length > 0) {
      diagramImageUrl = f["Diagram Attachment"][0].url;
    } else if (Array.isArray(f["Diagram Image Attachment"]) && f["Diagram Image Attachment"].length > 0) {
      diagramImageUrl = f["Diagram Image Attachment"][0].url;
    } else if (Array.isArray(f["Diagram Image"]) && f["Diagram Image"].length > 0) {
      diagramImageUrl = f["Diagram Image"][0].url;
    } else if (f["Diagram Image URL"] || f["Diagram Image"]) {
      diagramImageUrl = f["Diagram Image URL"] || f["Diagram Image"] || "";
    }
    // If empty, keep hardcoded fallback diagram (e.g. '/sweden-model-architecture.png')
    if (!diagramImageUrl && fallback.diagramImageUrl) {
      diagramImageUrl = fallback.diagramImageUrl;
    }

    const actionsHeading = f["Actions Heading"] || fallback.actionsHeading;
    const actionsSubtitle = f["Actions Subtitle"] || fallback.actionsSubtitle;

    // 1. Process Sections & Premises linked to this country
    const linkedSections = sectionRecords.filter((s: any) => {
      const belongs = s.fields["Belongs to Country"] || s.fields["Country"] || s.fields["Country ID"];
      if (Array.isArray(belongs)) return belongs.includes(cRec.id) || belongs.includes(countryId);
      return belongs === cRec.id || String(belongs).toLowerCase() === countryId;
    }).sort((a: any, b: any) => (Number(a.fields["Order"]) || 0) - (Number(b.fields["Order"]) || 0));

    const premises: any[] = [];
    const contextSections: any[] = [];

    if (linkedSections.length > 0) {
      for (const sRec of linkedSections) {
        const sf = sRec.fields || {};
        const sectionType = String(sf["Section Type"] || sf["Type"] || "").toLowerCase();
        
        if (sectionType.includes("premise")) {
          premises.push({
            number: Number(sf["Order"] || sf["Number"]) || (premises.length + 1),
            title: sf["Title"] || sf["Section Title"] || "",
            description: sf["Content"] || sf["Description"] || "",
          });
        } else {
          // Normal Context Section
          const paragraphs = (sf["Content"] || sf["Paragraphs"] || "")
            .split(/\n\n+/)
            .map((p: string) => p.trim())
            .filter(Boolean);

          let bulletPoints: { label?: string; text: string }[] = [];
          if (sf["Bullet Points"]) {
            const rawBullets = String(sf["Bullet Points"]).split(/\r?\n/).filter(Boolean);
            bulletPoints = rawBullets.map(b => {
              const cleaned = b.replace(/^[•\-\*]\s*/, '').trim();
              const colonIdx = cleaned.indexOf(':');
              if (colonIdx > 0 && colonIdx < 40) {
                return {
                  label: cleaned.slice(0, colonIdx).trim(),
                  text: cleaned.slice(colonIdx + 1).trim()
                };
              }
              return { text: cleaned };
            });
          }

          contextSections.push({
            title: sf["Title"] || sf["Section Title"] || "",
            paragraphs: paragraphs.length > 0 ? paragraphs : undefined,
            bulletPoints: bulletPoints.length > 0 ? bulletPoints : undefined,
          });
        }
      }
    }

    // 2. Process Actions linked to this country
    const linkedActions = actionRecords.filter((a: any) => {
      const belongs = a.fields["Belongs to Country"] || a.fields["Country"] || a.fields["Country ID"];
      if (Array.isArray(belongs)) return belongs.includes(cRec.id) || belongs.includes(countryId);
      return belongs === cRec.id || String(belongs).toLowerCase() === countryId;
    }).sort((a: any, b: any) => (Number(a.fields["Action Number"] || a.fields["Order"]) || 0) - (Number(b.fields["Action Number"] || b.fields["Order"]) || 0));

    let actions: any[] = [];
    if (linkedActions.length > 0) {
      actions = linkedActions.map((aRec: any) => {
        const af = aRec.fields || {};
        const actionNumber = Number(af["Action Number"] || af["Number"] || af["Order"]) || 1;
        const paragraphs = (af["Content"] || af["Detailed Content"] || af["Paragraphs"] || "")
          .split(/\n\n+/)
          .map((p: string) => p.trim())
          .filter(Boolean);

        let caseStudy: any = undefined;
        if (af["Case Study Title"] || af["Case Study Content"]) {
          caseStudy = {
            title: af["Case Study Title"] || "Case Study",
            paragraphs: (af["Case Study Content"] || "")
              .split(/\n\n+/)
              .map((p: string) => p.trim())
              .filter(Boolean),
          };
        }

        return {
          actionNumber,
          actionThemeTitle: af["Action Theme Tag"] || af["Theme"] || "",
          title: af["Title"] || af["Action Title"] || `Action ${actionNumber}`,
          paragraphs,
          caseStudy,
          enabledSummary: af["Enabled & Opportunity"] || af["Enabled Summary"] || af["Opportunity"] || "",
        };
      });
    }

    result.push({
      order,
      published,
      countryId,
      countryName,
      flag,
      status,
      isReady,
      tagline,
      summary,
      keyMechanisms,
      cardImage,
      themeColor,

      headerTitle,
      headerSubtitle,
      headerDescription,

      tabATitle,
      tabASubtitle,
      premisesHeading,
      premisesIntro,
      premises: premises.length > 0 ? premises : fallback.premises,
      contextSections: contextSections.length > 0 ? contextSections : fallback.contextSections,

      tabBTitle,
      tabBSubtitle,
      modelHeading,
      modelOverview,
      modelDiagramNote,
      diagramImageUrl,
      diagramImageAlt: f["Diagram Image Alt"] || fallback.diagramImageAlt,

      actionsHeading,
      actionsSubtitle,
      actions: actions.length > 0 ? actions : fallback.actions,
    });
  }

  // Sort by order ascending
  result.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

  return result;
}

export function parseChampRoadmapRecords(roadmapRecords: any[] = []): RoadmapPillar[] {
  if (!roadmapRecords || roadmapRecords.length === 0) {
    return defaultChampRoadmapData;
  }

  const ACTION_MAPPING: Record<string, number[]> = {
    "1.1": [1, 3],
    "1.2": [1, 2],
    "1.3": [6],
    "2.1": [2, 3],
    "2.2": [6],
    "2.3": [6],
    "3.1": [1, 3, 4],
    "3.2": [4],
    "3.3": [2, 5, 6]
  };

  const pillarsMap = new Map<number, RoadmapPillar>();

  for (const p of defaultChampRoadmapData) {
    pillarsMap.set(p.number, {
      ...p,
      activities: []
    });
  }

  const sortedRecords = [...roadmapRecords].sort((a, b) => {
    const orderA = Number(a.fields?.["Order"] ?? 0);
    const orderB = Number(b.fields?.["Order"] ?? 0);
    return orderA - orderB;
  });

  for (const rec of sortedRecords) {
    const f = rec.fields || {};
    const code = String(f["Activity Code"] || f["Code"] || "").trim();
    if (!code) continue;

    const pillarNum = Number(f["Pillar Number"]) || parseInt(code.charAt(0)) || 1;
    let pillar = pillarsMap.get(pillarNum);
    if (!pillar) {
      pillar = {
        number: pillarNum,
        title: f["Pillar Title"] || `Pillar ${pillarNum}`,
        goal: f["Pillar Goal"] || f["Goal"] || "",
        leadResponsibility: f["Lead Responsibility"] || "",
        overview: f["Pillar Overview"] || f["Overview"] || "",
        transitionNote: f["Transition Note"] || undefined,
        activities: []
      };
      pillarsMap.set(pillarNum, pillar);
    } else {
      if (f["Pillar Title"]) pillar.title = f["Pillar Title"];
      if (f["Pillar Goal"]) pillar.goal = f["Pillar Goal"];
      if (f["Lead Responsibility"]) pillar.leadResponsibility = f["Lead Responsibility"];
      if (f["Pillar Overview"]) pillar.overview = f["Pillar Overview"];
      if (f["Transition Note"]) pillar.transitionNote = f["Transition Note"];
    }

    const rawBullets = f["Detailed Bullets"] || f["Bullets"] || f["Bullet Points"] || "";
    let bullets: string[] = [];
    if (Array.isArray(rawBullets)) {
      bullets = rawBullets.map(b => String(b).trim()).filter(Boolean);
    } else if (typeof rawBullets === 'string') {
      bullets = rawBullets
        .split(/\r?\n/)
        .map(b => b.replace(/^[•\-\*]\s*/, '').trim())
        .filter(Boolean);
    }

    const fallbackAct = defaultChampRoadmapData
      .find(p => p.number === pillarNum)
      ?.activities.find(a => a.code === code);

    pillar.activities.push({
      code,
      title: f["Activity Title"] || f["Title"] || fallbackAct?.title || code,
      bullets: bullets.length > 0 ? bullets : (fallbackAct?.bullets || []),
      actionIds: fallbackAct?.actionIds || ACTION_MAPPING[code] || []
    });
  }

  const result: RoadmapPillar[] = [];
  for (let i = 1; i <= 3; i++) {
    const p = pillarsMap.get(i);
    if (p && p.activities.length > 0) {
      result.push(p);
    } else {
      const def = defaultChampRoadmapData.find(d => d.number === i);
      if (def) result.push(def);
    }
  }

  return result;
}

export function parseChampPledgeRecords(pledgeRecords: any[] = []): ChampPledge[] {
  if (!pledgeRecords || pledgeRecords.length === 0) {
    return defaultChampPledgesData;
  }

  const sorted = [...pledgeRecords].sort((a, b) => {
    const oA = Number(a.fields?.["Order"] ?? a.fields?.["Pledge Number"] ?? 0);
    const oB = Number(b.fields?.["Order"] ?? b.fields?.["Pledge Number"] ?? 0);
    return oA - oB;
  });

  const parsed: ChampPledge[] = sorted.map((r, idx) => {
    const f = r.fields || {};
    const num = Number(f["Pledge Number"]) || (idx + 1);
    const label = f["Pledge Label"] || `Pledge 0${num}`;
    const fallback = defaultChampPledgesData.find(p => p.id === num) || defaultChampPledgesData[idx] || defaultChampPledgesData[0];
    return {
      id: num,
      number: label,
      title: f["Title"] || fallback.title,
      shortDesc: f["Short Description"] || fallback.shortDesc,
      fullText: f["Full Text"] || fallback.fullText,
      isInvestment: Boolean(f["Is Investment Focus"] ?? fallback.isInvestment),
      order: Number(f["Order"]) || num
    };
  });

  return parsed.length > 0 ? parsed : defaultChampPledgesData;
}

async function fetchTableClient(tableName: string, baseId: string, token: string): Promise<any[]> {
  let allRecords: any[] = [];
  let offset = '';
  do {
    const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}${offset ? `?offset=${offset}` : ''}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Airtable API error ${response.status} for ${tableName}: ${response.statusText}`);
    }
    const data = await response.json();
    allRecords = allRecords.concat((data as any).records || []);
    offset = (data as any).offset;
  } while (offset);
  return allRecords;
}

async function fetchTableClientSafely(tableNameVariants: string[], baseId: string, token: string): Promise<any[]> {
  for (const name of tableNameVariants) {
    try {
      const records = await fetchTableClient(name, baseId, token);
      return records;
    } catch (e) {
      // try next variant
    }
  }
  return [];
}

function parseAirtableRecords(
  actionsRecords: any[],
  pathwaysRecords: any[],
  guidanceRecords: any[],
  examplesRecords: any[],
  subExamplesRecords: any[],
  conceptBoxRecords: any[] = [],
  resourcesRecords: any[] = []
): Action[] {
  const formattedActions: Action[] = actionsRecords.map((a: any) => {
    const actionId = Number(a.fields["Action Number"] || 0);
    const actionTitle = a.fields["Title"] || "Untitled Action";
    const actionDesc = a.fields["Description"] || "";
    const systemsLogic = a.fields["Systems Logic"] || "";

    const myPathways: Pathway[] = pathwaysRecords
      .filter((p: any) => {
        const linkedAction = p.fields["Belongs to Action"];
        return linkedAction && linkedAction.includes(a.id);
      })
      .sort((x: any, y: any) => {
        const titleX = String(x.fields["Pathway Title"] || x.fields["Title"] || "");
        const titleY = String(y.fields["Pathway Title"] || y.fields["Title"] || "");
        const matchX = titleX.match(/^(\d+)\.(\d+)/);
        const matchY = titleY.match(/^(\d+)\.(\d+)/);
        if (matchX && matchY) {
          const numX = Number(matchX[1]) * 100 + Number(matchX[2]);
          const numY = Number(matchY[1]) * 100 + Number(matchY[2]);
          if (numX !== numY) return numX - numY;
        }
        return (Number(x.fields["Order"]) || 99) - (Number(y.fields["Order"]) || 99);
      })
      .map((p: any) => {
        const pathwayTitle = p.fields["Pathway Title"] || "Untitled Pathway";
        const pathwayDesc = p.fields["Overview"] || "";
        const whatItIs = p.fields["What it is"] || "";
        const whyItIsNeeded = p.fields["Why it is needed"] || "";
        const orderNum = Number(p.fields["Order"]) || 0;
        const normalizeActor = (actor: string) => {
          if (actor === "Ministry of Climate / Environment") return "Climate / Environment Ministry";
          if (actor === "Sectoral Ministries (e.g., energy, transport)") return "Relevant Sectoral Ministries";
          if (actor === "Local Implementation Agency") return "Implementation Partner Organizations";
          return actor;
        };

        const potentialNationalLead = Array.isArray(p.fields["Potential National Lead"])
          ? p.fields["Potential National Lead"].map(normalizeActor)
          : p.fields["Potential National Lead"]
          ? [normalizeActor(p.fields["Potential National Lead"])]
          : undefined;
        const keyActors = Array.isArray(p.fields["Key Actors"])
          ? p.fields["Key Actors"].map(normalizeActor)
          : p.fields["Key Actors"]
          ? [normalizeActor(p.fields["Key Actors"])]
          : [];

        const rawTransferability = (p.fields["Transferability Considerations"] || "").trim();
        let transferabilityTitle: string | undefined = undefined;
        let transferabilityPreamble: string | undefined = undefined;
        let transferability: string[] = [];

        if (rawTransferability) {
          const rawLines = rawTransferability.split(/\r?\n/).map((s: string) => s.trim()).filter(Boolean);
          const preambleLines: string[] = [];
          const itemLines: string[] = [];

          for (const line of rawLines) {
            const isBullet = /^(?:[-*+•—–·◦⁃]|\d+[\.\)])\s*/.test(line);
            if (isBullet) {
              itemLines.push(line.replace(/^(?:[-*+•—–·◦⁃]|\d+[\.\)])\s*/, "").trim());
            } else if (itemLines.length === 0) {
              if (/^(?:actions to enable|how to enable|transferability)/i.test(line)) {
                transferabilityTitle = line.replace(/[:]\s*$/, "").trim();
              } else {
                preambleLines.push(line);
              }
            }
          }

          transferability = itemLines.length > 0 ? itemLines : rawLines;
          if (preambleLines.length > 0) {
            transferabilityPreamble = preambleLines.join(" ");
          }
        }

        // Default title for Pathway 6.1 if appropriate
        if (pathwayTitle.toLowerCase().includes("capacity building") && !transferabilityTitle && transferability.length > 0) {
          transferabilityTitle = "Actions to enable EMDE city participation";
        }

        const enablingConditions = (p.fields["Enabling Conditions"] || "")
          .split(/\r?\n/)
          .map((s: string) => s.replace(/^(?:[-*+•—–·◦⁃]|\d+\.)\s*/, "").trim())
          .filter(Boolean);

        const myGuidance: ImplementationStep[] = guidanceRecords
          .filter((g: any) => {
            const linkedPathway = g.fields["Belongs to Pathway"];
            return linkedPathway && linkedPathway.includes(p.id);
          })
          .sort((x: any, y: any) => (x.fields["Step Order"] || 0) - (y.fields["Step Order"] || 0))
          .map((g: any) => ({
            title: g.fields["Step Title"] || "Untitled Step",
            content: g.fields["Detailed Content"] || "",
          }));

        const myExamples: IllustrativeExample[] = examplesRecords
          .filter((e: any) => {
            const linkedPathway = e.fields["Belongs to Pathway"];
            return linkedPathway && linkedPathway.includes(p.id);
          })
          .map((e: any) => {
            const mySubExamples: SubExample[] = subExamplesRecords
              .filter((sub: any) => {
                const linkedExample = sub.fields["Belongs to Parent Example"];
                return linkedExample && linkedExample.includes(e.id);
              })
              .map((sub) => ({
                title: sub.fields["Sub-Example Title"] || "Untitled Sub-Example",
                excerpt: sub.fields["Excerpt"] || "",
                fullText: sub.fields["Full Text"] || "",
                link: sub.fields["Learn More URL"] || "",
              }));

            const connectionLine = 
              e.fields["Why see this / When to use this"] ||
              e.fields["When to use this / Why see this"] ||
              e.fields["Connection Line"] ||
              e.fields["Contextual Guidance"] ||
              e.fields["Guidance Note"] ||
              "";

            const rawOrder = 
              e.fields["Order"] ??
              e.fields["Resource Order"] ??
              e.fields["Sequence"] ??
              e.fields["Display Order"] ??
              e.fields["Sort Order"] ??
              e.fields["Position"] ??
              e.fields["Number"];
            const order = rawOrder !== undefined && rawOrder !== null && rawOrder !== "" && !isNaN(Number(rawOrder))
              ? Number(rawOrder)
              : undefined;

            return {
              title: e.fields["Example Title"] || e.fields["Title"] || "Untitled Example",
              type: e.fields["Type"] || e.fields["Resource Type"] || "Illustrative Example",
              excerpt: e.fields["Excerpt"] || "",
              fullText: e.fields["Full Text / Concept Explanation"] || e.fields["Full Text"] || "",
              link: e.fields["Learn More URL"] || "",
              connectionLine: connectionLine ? String(connectionLine).trim() : undefined,
              order,
              subExamples: mySubExamples.length > 0 ? mySubExamples : undefined,
            };
          })
          .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));

        const myConceptBoxes: ConceptBox[] = conceptBoxRecords
          .filter((cb: any) => {
            const linkedPathway = cb.fields["Belongs to Pathway"];
            return linkedPathway && linkedPathway.includes(p.id);
          })
          .sort((x: any, y: any) => (x.fields["Order"] || 0) - (y.fields["Order"] || 0))
          .map((cb: any) => ({
            title: cb.fields["Box Title"] || cb.fields["Title"] || "Untitled Box",
            category: cb.fields["Tag / Category"] || cb.fields["Category"] || "Core Concept",
            excerpt: cb.fields["Excerpt / Summary"] || cb.fields["Excerpt"] || "",
            fullText: cb.fields["Full Text / Explanation"] || cb.fields["Full Text"] || cb.fields["Detailed Content"] || "",
            section: cb.fields["Placement / Section"] || cb.fields["Section"] || "Illustrative Examples",
            link: cb.fields["Learn More URL"] || cb.fields["Link"] || "",
            order: cb.fields["Order"] || 0,
          }));

        const myResources: ResourceItem[] = resourcesRecords
          .filter((r: any) => {
            const linkedPathway = r.fields["Pathway"] || r.fields["Belongs to Pathway"];
            return linkedPathway && linkedPathway.includes(p.id);
          })
          .sort((x: any, y: any) => (Number(x.fields["Order"]) || 0) - (Number(y.fields["Order"]) || 0))
          .map((r: any) => ({
            title: r.fields["Resource Title"] || r.fields["Title"] || "Untitled Resource",
            type: r.fields["Resource Type"] || r.fields["Type"] || "Report / Study",
            publisher: r.fields["Publisher / Organization"] || r.fields["Publisher"] || "",
            link: r.fields["Resource Link"] || r.fields["Link"] || r.fields["URL"] || "",
            description: r.fields["Description"] || r.fields["Summary"] || "",
            order: Number(r.fields["Order"]) || 0,
          }));

        return {
          title: pathwayTitle,
          overview: pathwayDesc,
          whatItIs,
          whyItIsNeeded,
          potentialNationalLead,
          keyActors,
          transferabilityTitle,
          transferabilityPreamble,
          transferability,
          enablingConditions,
          order: orderNum,
          implementationGuidance: myGuidance.length > 0 ? myGuidance : undefined,
          illustrativeExamples: myExamples.length > 0 ? myExamples : undefined,
          conceptBoxes: myConceptBoxes.length > 0 ? myConceptBoxes : undefined,
          resources: myResources.length > 0 ? myResources : undefined,
        };
      });

    return {
      id: actionId,
      title: actionTitle,
      description: actionDesc,
      systemsLogic,
      pathways: myPathways,
    };
  });

  formattedActions.sort((a, b) => a.id - b.id);
  return formattedActions;
}

export interface AirtablePayload {
  actions: Action[];
  homePage: HomePageContent;
  countryJourneys: CountryJourneyData[];
  countryJourneysOverview: CountryJourneysOverviewContent;
  roadmapPillars: RoadmapPillar[];
  champPledges: ChampPledge[];
}

let cachedAirtablePromise: Promise<AirtablePayload> | null = null;

export function fetchAirtableAllContent(): Promise<AirtablePayload> {
  if (!cachedAirtablePromise) {
    cachedAirtablePromise = (async () => {
      const baseId =
        (typeof process !== "undefined" && process.env?.AIRTABLE_BASE_ID) ||
        import.meta.env.VITE_AIRTABLE_BASE_ID;
      const pat =
        (typeof process !== "undefined" && (process.env?.AIRTABLE_PAT || process.env?.AIRTABLE_API_KEY)) ||
        import.meta.env.VITE_AIRTABLE_PAT;

      let loadedActions: Action[] | null = null;
      let loadedHomePage: HomePageContent | null = null;
      let loadedCountryJourneys: CountryJourneyData[] | null = null;
      let loadedCountryJourneysOverview: CountryJourneysOverviewContent | null = null;
      let loadedRoadmapPillars: RoadmapPillar[] | null = null;
      let loadedChampPledges: ChampPledge[] | null = null;

      // Strategy 1: Check if client-side Airtable credentials are available in environment
      if (baseId && pat) {
        try {
          console.log(`[Airtable] Fetching directly from Airtable API (Base: ${baseId})...`);
          const [
            actions, 
            pathways, 
            guidance, 
            examples, 
            subExamples, 
            conceptBoxes, 
            resources, 
            homeRecords,
            countryRecords,
            sectionRecords,
            actionRecords,
            roadmapRecords,
            pledgeRecords,
            overviewRecords
          ] = await Promise.all([
            fetchTableClient("Actions", baseId, pat),
            fetchTableClient("Pathways", baseId, pat),
            fetchTableClient("Implementation Guidance", baseId, pat),
            fetchTableClientSafely(["Key Resources", "Illustrative Examples", "Examples"], baseId, pat),
            fetchTableClient("Sub-Examples", baseId, pat),
            fetchTableClientSafely(["Concept & Explainer Boxes", "Concept Boxes", "Explainer Boxes"], baseId, pat),
            fetchTableClientSafely(["Additional Resources", "Further Resources", "Resources"], baseId, pat),
            fetchTableClientSafely(["Home Page", "Landing Page", "Home Page Content", "Home Content"], baseId, pat),
            fetchTableClientSafely(["Country Journeys", "Country Deep Dives", "Countries"], baseId, pat),
            fetchTableClientSafely(["Country Sections", "Country Context Sections", "Journey Sections"], baseId, pat),
            fetchTableClientSafely(["Country Actions", "Country Journey Actions", "Journey Actions"], baseId, pat),
            fetchTableClientSafely(["CHAMP Implementation Roadmap", "Roadmap", "CHAMP Roadmap"], baseId, pat),
            fetchTableClientSafely(["CHAMP Pledges", "Pledges", "CHAMP Pledge"], baseId, pat),
            fetchTableClientSafely(["Country Journeys Overview", "Country Journeys Page", "Country Journeys Content", "Country Journey Overview"], baseId, pat),
          ]);

          const formatted = parseAirtableRecords(actions, pathways, guidance, examples, subExamples, conceptBoxes, resources);
          if (formatted.length > 0) {
            loadedActions = formatted;
            console.log(`[Airtable] Successfully loaded ${formatted.length} actions from live Airtable API.`);
          }

          if (homeRecords && homeRecords.length > 0) {
            loadedHomePage = parseHomePageRecords(homeRecords);
            console.log(`[Airtable] Successfully loaded Home Page content from live Airtable API.`);
          }

          if (countryRecords && countryRecords.length > 0) {
            loadedCountryJourneys = parseCountryJourneyRecords(countryRecords, sectionRecords, actionRecords);
            console.log(`[Airtable] Successfully loaded ${loadedCountryJourneys.length} country journeys from live Airtable API.`);
          }

          // Parse Country Journeys Overview
          loadedCountryJourneysOverview = parseCountryJourneysOverviewRecords(overviewRecords, countryRecords, homeRecords);
          console.log(`[Airtable] Successfully loaded Country Journeys Overview content from live Airtable API.`);

          if (roadmapRecords && roadmapRecords.length > 0) {
            loadedRoadmapPillars = parseChampRoadmapRecords(roadmapRecords);
            console.log(`[Airtable] Successfully loaded ${loadedRoadmapPillars.length} roadmap pillars from live Airtable API.`);
          }

          if (pledgeRecords && pledgeRecords.length > 0) {
            loadedChampPledges = parseChampPledgeRecords(pledgeRecords);
            console.log(`[Airtable] Successfully loaded ${loadedChampPledges.length} pledges from live Airtable API.`);
          }
        } catch (err) {
          console.warn("[Airtable] Direct client-side fetch failed, trying static/server endpoints:", err);
        }
      }

      // Strategy 2: Try static content.json
      if (!loadedActions || !loadedHomePage || loadedCountryJourneys === null || !loadedCountryJourneysOverview || !loadedRoadmapPillars || !loadedChampPledges) {
        try {
          const staticRes = await fetch("./api/content.json");
          if (staticRes.ok) {
            const data = await staticRes.json();
            if (!loadedActions && data?.formattedActions && Array.isArray(data.formattedActions) && data.formattedActions.length > 0) {
              loadedActions = data.formattedActions;
            }
            if (!loadedHomePage && data?.homePageContent) {
              loadedHomePage = data.homePageContent;
            }
            if (loadedCountryJourneys === null && data?.countryJourneys && Array.isArray(data.countryJourneys)) {
              loadedCountryJourneys = data.countryJourneys;
            }
            if (!loadedCountryJourneysOverview && data?.countryJourneysOverview) {
              loadedCountryJourneysOverview = data.countryJourneysOverview;
            }
            if (!loadedRoadmapPillars && data?.roadmapPillars && Array.isArray(data.roadmapPillars)) {
              loadedRoadmapPillars = data.roadmapPillars;
            }
            if (!loadedChampPledges && data?.champPledges && Array.isArray(data.champPledges)) {
              loadedChampPledges = data.champPledges;
            }
          }
        } catch (err) {
          // Continue
        }
      }

      // Strategy 3: Try Express backend route (/api/content)
      if (!loadedActions || !loadedHomePage || loadedCountryJourneys === null || !loadedCountryJourneysOverview || !loadedRoadmapPillars || !loadedChampPledges) {
        try {
          const serverRes = await fetch("/api/content", { cache: "no-store" });
          if (serverRes.ok) {
            const data = await serverRes.json();
            if (!loadedActions && data?.formattedActions && Array.isArray(data.formattedActions) && data.formattedActions.length > 0) {
              loadedActions = data.formattedActions;
            }
            if (!loadedHomePage && data?.homePageContent) {
              loadedHomePage = data.homePageContent;
            }
            if (loadedCountryJourneys === null && data?.countryJourneys && Array.isArray(data.countryJourneys)) {
              loadedCountryJourneys = data.countryJourneys;
            }
            if (!loadedCountryJourneysOverview && data?.countryJourneysOverview) {
              loadedCountryJourneysOverview = data.countryJourneysOverview;
            }
            if (!loadedRoadmapPillars && data?.roadmapPillars && Array.isArray(data.roadmapPillars)) {
              loadedRoadmapPillars = data.roadmapPillars;
            }
            if (!loadedChampPledges && data?.champPledges && Array.isArray(data.champPledges)) {
              loadedChampPledges = data.champPledges;
            }
          }
        } catch (err) {
          // Continue
        }
      }

      return {
        actions: loadedActions || (actionsData as Action[]),
        homePage: loadedHomePage || defaultHomePageContent,
        countryJourneys: loadedCountryJourneys !== null ? loadedCountryJourneys : defaultCountryJourneys,
        countryJourneysOverview: loadedCountryJourneysOverview || defaultCountryJourneysOverviewContent,
        roadmapPillars: loadedRoadmapPillars || defaultChampRoadmapData,
        champPledges: loadedChampPledges || defaultChampPledgesData,
      };
    })();
  }
  return cachedAirtablePromise;
}

export async function fetchAirtableHomePageContent(): Promise<HomePageContent> {
  const { homePage } = await fetchAirtableAllContent();
  return homePage;
}

export async function fetchAirtableContent(): Promise<Action[]> {
  const { actions } = await fetchAirtableAllContent();
  return actions;
}

export async function fetchAirtableCountryJourneys(): Promise<CountryJourneyData[]> {
  const { countryJourneys } = await fetchAirtableAllContent();
  return countryJourneys;
}

export async function fetchAirtableCountryJourneysOverview(): Promise<CountryJourneysOverviewContent> {
  const { countryJourneysOverview } = await fetchAirtableAllContent();
  return countryJourneysOverview;
}

export async function fetchAirtableRoadmap(): Promise<RoadmapPillar[]> {
  const { roadmapPillars } = await fetchAirtableAllContent();
  return roadmapPillars;
}

export async function fetchAirtableChampPledges(): Promise<ChampPledge[]> {
  const { champPledges } = await fetchAirtableAllContent();
  return champPledges;
}
