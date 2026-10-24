/**
 * CHAMP MCP Read-Only Airtable Client
 * Provides secure, allowlisted, cached, and rate-limit resilient access to the CHAMP Airtable knowledge base.
 */

import {
  ChampActionRecord,
  ChampPathwayRecord,
  ChampGuidanceStepRecord,
  ChampKeyResourceRecord,
  ChampSubExampleRecord,
  ChampAdditionalResourceRecord,
  ChampConceptBoxRecord,
  ChampCountryJourneyRecord,
  ChampCountrySectionRecord,
  ChampCountryActionRecord
} from "./types";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export class ChampAirtableClient {
  private baseId: string;
  private pat: string;
  private cache: Map<string, CacheEntry<any>> = new Map();
  private cacheTtlMs: number = 5 * 60 * 1000; // 5 minutes default TTL

  constructor(baseId?: string, pat?: string, cacheTtlMs?: number) {
    this.baseId =
      baseId ||
      process.env.AIRTABLE_BASE_ID ||
      process.env.VITE_AIRTABLE_BASE_ID ||
      "";
    this.pat =
      pat ||
      process.env.AIRTABLE_PAT ||
      process.env.AIRTABLE_API_KEY ||
      process.env.VITE_AIRTABLE_PAT ||
      "";

    if (cacheTtlMs !== undefined) {
      this.cacheTtlMs = cacheTtlMs;
    }
  }

  public isConfigured(): boolean {
    return Boolean(this.baseId && this.pat);
  }

  public clearCache(): void {
    this.cache.clear();
  }

  private sanitizeText(val: any): string {
    if (val === null || val === undefined) return "";
    if (typeof val !== "string") return String(val).trim();
    return val
      .replace(/\[([^\]]+)\]\(https:\/\/airtable\.com[^)]*\)/g, "$1")
      .replace(/\u00A0/g, " ")
      .trim();
  }

  public normalizeActor(actor: string): string {
    const cleaned = this.sanitizeText(actor);
    if (!cleaned) return "";
    const lower = cleaned.toLowerCase();
    if (lower.includes("ministry of climate") || lower === "climate / environment ministry") {
      return "Climate / Environment Ministry";
    }
    if (lower.includes("urban") && lower.includes("local government")) {
      return "Urban / Local Government Ministry";
    }
    if (lower.includes("planning ministry") || lower === "national planning agency") {
      return "Planning Ministry";
    }
    if (lower.includes("finance ministry") || lower === "ministry of finance") {
      return "Finance Ministry";
    }
    if (lower.includes("development bank")) {
      return "National Development Bank";
    }
    if (lower.includes("sector") && lower.includes("ministr")) {
      return "Relevant Sector Ministry";
    }
    if (lower.includes("innovation") || lower.includes("research agency")) {
      return "National Innovation / Research Agency";
    }
    if (lower.includes("procurement")) {
      return "National Procurement Authority";
    }
    return cleaned;
  }

  private async fetchTableWithRetry(tableName: string): Promise<any[]> {
    if (!this.isConfigured()) {
      throw new Error("Airtable client is not configured: AIRTABLE_BASE_ID or AIRTABLE_PAT missing.");
    }

    const cacheKey = `table_${tableName}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTtlMs) {
      return cached.data;
    }

    let allRecords: any[] = [];
    let offset = "";
    const maxRetries = 4;

    do {
      let attempt = 0;
      let success = false;
      let lastError: any = null;

      while (attempt <= maxRetries && !success) {
        attempt++;
        try {
          const url = `https://api.airtable.com/v0/${this.baseId}/${encodeURIComponent(tableName)}${
            offset ? `?offset=${offset}` : ""
          }`;

          const res = await fetch(url, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${this.pat}`,
              Accept: "application/json"
            }
          });

          if (res.status === 429) {
            // Rate limit exceeded: back off with jitter
            const backoff = 1000 * Math.pow(2, attempt) + Math.random() * 500;
            console.warn(`[Airtable 429 Rate Limit] Backing off ${Math.round(backoff)}ms for ${tableName}...`);
            await new Promise((r) => setTimeout(r, backoff));
            continue;
          }

          if (!res.ok) {
            const errBody = await res.text().catch(() => "");
            throw new Error(`Airtable error ${res.status} for table '${tableName}': ${errBody}`);
          }

          const data: any = await res.json();
          allRecords = allRecords.concat(data.records || []);
          offset = data.offset || "";
          success = true;
        } catch (err: any) {
          lastError = err;
          if (attempt <= maxRetries) {
            const delay = 500 * Math.pow(2, attempt);
            await new Promise((r) => setTimeout(r, delay));
          }
        }
      }

      if (!success) {
        throw lastError || new Error(`Failed to fetch ${tableName} after ${maxRetries} attempts.`);
      }
    } while (offset);

    this.cache.set(cacheKey, { data: allRecords, timestamp: Date.now() });
    return allRecords;
  }

  private async fetchTableSafely(tableVariants: string[]): Promise<any[]> {
    for (const name of tableVariants) {
      try {
        const records = await this.fetchTableWithRetry(name);
        if (records && records.length > 0) return records;
      } catch (e) {
        // Continue to next variant
      }
    }
    return [];
  }

  // 1. Core CHAMP Actions (Strictly 5 official actions)
  public async getActions(): Promise<ChampActionRecord[]> {
    const rawRecords = await this.fetchTableWithRetry("Actions");
    const actions: ChampActionRecord[] = rawRecords.map((r: any) => {
      const f = r.fields || {};
      const actionNum = Number(f["Action Number"] || 0);
      const title = this.sanitizeText(f["Title"] || f["Action Title"] || `Action ${actionNum}`);
      const shortTitle = this.sanitizeText(f["Short Title"] || "");
      const description = this.sanitizeText(f["Description"] || "");
      const systemsLogic = this.sanitizeText(f["Systems Logic"] || "");
      const themeColor = this.sanitizeText(f["Theme Color"] || "");
      const pathwayIds = Array.isArray(f["Pathways"]) ? f["Pathways"] : [];

      return {
        id: r.id,
        actionNumber: actionNum,
        title,
        shortTitle: shortTitle || undefined,
        description,
        systemsLogic: systemsLogic || undefined,
        themeColor: themeColor || undefined,
        pathwayIds
      };
    });

    actions.sort((a, b) => a.actionNumber - b.actionNumber);
    return actions;
  }

  // 2. Pathways
  public async getPathways(): Promise<ChampPathwayRecord[]> {
    const rawRecords = await this.fetchTableWithRetry("Pathways");
    const pathways: ChampPathwayRecord[] = rawRecords.map((r: any) => {
      const f = r.fields || {};
      const title = this.sanitizeText(f["Pathway Title"] || f["Title"] || "Untitled Pathway");
      const belongsToAction = Array.isArray(f["Belongs to Action"]) ? f["Belongs to Action"][0] : f["Belongs to Action"];
      const order = Number(f["Order"]) || 0;
      const whatItIs = this.sanitizeText(f["What it is"] || "");
      const whyItIsNeeded = this.sanitizeText(f["Why it is needed"] || "");
      const overview = this.sanitizeText(f["Overview"] || "");

      // Potential National Lead (multipleSelects)
      const rawLeads = f["Potential National Lead"];
      let potentialNationalLead: string[] = [];
      if (Array.isArray(rawLeads)) {
        potentialNationalLead = rawLeads.map((l: any) => this.normalizeActor(String(l))).filter(Boolean);
      } else if (rawLeads) {
        potentialNationalLead = [this.normalizeActor(String(rawLeads))];
      }

      // Key Actors (multipleSelects)
      const rawActors = f["Key Actors"];
      let keyActors: string[] = [];
      if (Array.isArray(rawActors)) {
        keyActors = rawActors.map((a: any) => this.normalizeActor(String(a))).filter(Boolean);
      } else if (rawActors) {
        keyActors = [this.normalizeActor(String(rawActors))];
      }

      // Transferability Considerations
      const rawTransferability = this.sanitizeText(f["Transferability Considerations"] || "");
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
            itemLines.push(this.sanitizeText(line.replace(/^(?:[-*+•—–·◦⁃]|\d+[\.\)])\s*/, "")));
          } else if (itemLines.length === 0) {
            if (/^(?:actions to enable|how to enable|transferability)/i.test(line)) {
              transferabilityTitle = this.sanitizeText(line.replace(/[:]\s*$/, ""));
            } else {
              preambleLines.push(this.sanitizeText(line));
            }
          }
        }
        transferability = itemLines.length > 0 ? itemLines : rawLines.map((l) => this.sanitizeText(l));
        if (preambleLines.length > 0) {
          transferabilityPreamble = preambleLines.join(" ");
        }
      }

      // Enabling Conditions
      const rawEnabling = this.sanitizeText(f["Enabling Conditions"] || "");
      const enablingConditions = rawEnabling
        ? rawEnabling.split(/\r?\n/).map((s) => this.sanitizeText(s.replace(/^(?:[-*+•—–·◦⁃]|\d+\.)\s*/, ""))).filter(Boolean)
        : [];

      // Linked IDs
      const implementationStepIds = Array.isArray(f["Implementation Steps"])
        ? f["Implementation Steps"]
        : Array.isArray(f["Implementation Guidance"])
        ? f["Implementation Guidance"]
        : [];
      const exampleIds = Array.isArray(f["Examples"])
        ? f["Examples"]
        : Array.isArray(f["Key Resources"])
        ? f["Key Resources"]
        : [];
      const resourceIds = Array.isArray(f["Resources"])
        ? f["Resources"]
        : Array.isArray(f["Additional Resources"])
        ? f["Additional Resources"]
        : [];
      const conceptBoxIds = Array.isArray(f["Concept & Explainer Boxes"]) ? f["Concept & Explainer Boxes"] : [];

      return {
        id: r.id,
        pathwayTitle: title,
        belongsToActionId: belongsToAction,
        order,
        whatItIs: whatItIs || undefined,
        whyItIsNeeded: whyItIsNeeded || undefined,
        overview: overview || undefined,
        potentialNationalLead,
        keyActors,
        rawTransferabilityText: rawTransferability || undefined,
        transferabilityTitle,
        transferabilityPreamble,
        transferability,
        enablingConditions,
        implementationStepIds,
        exampleIds,
        resourceIds,
        conceptBoxIds
      };
    });

    pathways.sort((a, b) => a.order - b.order);
    return pathways;
  }

  // 3. Implementation Guidance
  public async getImplementationGuidance(): Promise<ChampGuidanceStepRecord[]> {
    const rawRecords = await this.fetchTableWithRetry("Implementation Guidance");
    const steps: ChampGuidanceStepRecord[] = rawRecords.map((r: any) => {
      const f = r.fields || {};
      const stepOrder = Number(f["Step Order"]) || 0;
      const stepTitle = this.sanitizeText(f["Step Title"] || `Step ${stepOrder}`);
      const detailedContent = this.sanitizeText(f["Detailed Content"] || "");
      const belongsToPathwayId = Array.isArray(f["Belongs to Pathway"]) ? f["Belongs to Pathway"][0] : f["Belongs to Pathway"];

      return {
        id: r.id,
        stepTitle,
        detailedContent,
        stepOrder,
        belongsToPathwayId
      };
    });

    steps.sort((a, b) => a.stepOrder - b.stepOrder);
    return steps;
  }

  // 4. Key Resources (Illustrative Examples & Tools)
  public async getKeyResources(): Promise<ChampKeyResourceRecord[]> {
    const rawRecords = await this.fetchTableSafely(["Key Resources", "Illustrative Examples", "Examples"]);
    const resources: ChampKeyResourceRecord[] = rawRecords.map((r: any) => {
      const f = r.fields || {};
      const title = this.sanitizeText(f["Example Title"] || f["Title"] || "Untitled Resource");
      const type = this.sanitizeText(f["Type"] || f["Resource Type"] || "Illustrative Example");
      const whyOrWhen = this.sanitizeText(
        f["Why see this / When to use this"] ||
        f["When to use this / Why see this"] ||
        f["Connection Line"] ||
        f["Contextual Guidance"] ||
        ""
      );
      const excerpt = this.sanitizeText(f["Excerpt"] || "");
      const fullText = this.sanitizeText(f["Full Text / Concept Explanation"] || f["Full Text"] || "");
      const learnMoreUrl = this.sanitizeText(f["Learn More URL"] || f["URL"] || f["Link"] || "");
      const rawOrder = f["Order"] ?? f["Resource Order"] ?? f["Position"];
      const order = rawOrder !== undefined && !isNaN(Number(rawOrder)) ? Number(rawOrder) : undefined;
      const belongsToPathwayId = Array.isArray(f["Belongs to Pathway"]) ? f["Belongs to Pathway"][0] : f["Belongs to Pathway"];
      const subExampleIds = Array.isArray(f["Sub-Examples"]) ? f["Sub-Examples"] : [];

      return {
        id: r.id,
        exampleTitle: title,
        type,
        whySeeThisOrWhenToUseThis: whyOrWhen || undefined,
        excerpt: excerpt || undefined,
        fullText: fullText || undefined,
        learnMoreUrl: learnMoreUrl || undefined,
        order,
        belongsToPathwayId,
        subExampleIds
      };
    });

    resources.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
    return resources;
  }

  // 5. Sub-Examples
  public async getSubExamples(): Promise<ChampSubExampleRecord[]> {
    const rawRecords = await this.fetchTableWithRetry("Sub-Examples");
    return rawRecords.map((r: any) => {
      const f = r.fields || {};
      return {
        id: r.id,
        subExampleTitle: this.sanitizeText(f["Sub-Example Title"] || f["Title"] || "Untitled Sub-Example"),
        belongsToParentExampleId: Array.isArray(f["Belongs to Parent Example"]) ? f["Belongs to Parent Example"][0] : f["Belongs to Parent Example"],
        excerpt: this.sanitizeText(f["Excerpt"] || "") || undefined,
        fullText: this.sanitizeText(f["Full Text"] || "") || undefined,
        learnMoreUrl: this.sanitizeText(f["Learn More URL"] || "") || undefined
      };
    });
  }

  // 6. Additional Resources
  public async getAdditionalResources(): Promise<ChampAdditionalResourceRecord[]> {
    const rawRecords = await this.fetchTableSafely(["Additional Resources", "Further Resources", "Resources"]);
    return rawRecords.map((r: any) => {
      const f = r.fields || {};
      const rawOrder = f["Order"];
      return {
        id: r.id,
        resourceTitle: this.sanitizeText(f["Resource Title"] || f["Title"] || "Untitled Resource"),
        resourceType: this.sanitizeText(f["Resource Type"] || f["Type"] || "") || undefined,
        publisherOrOrganization: this.sanitizeText(f["Publisher / Organization"] || f["Publisher"] || "") || undefined,
        description: this.sanitizeText(f["Description"] || f["Summary"] || "") || undefined,
        resourceLink: this.sanitizeText(f["Resource Link"] || f["Link"] || f["URL"] || "") || undefined,
        order: rawOrder !== undefined && !isNaN(Number(rawOrder)) ? Number(rawOrder) : undefined,
        belongsToPathwayId: Array.isArray(f["Pathway"]) ? f["Pathway"][0] : Array.isArray(f["Belongs to Pathway"]) ? f["Belongs to Pathway"][0] : undefined
      };
    });
  }

  // 7. Concept & Explainer Boxes
  public async getConceptBoxes(): Promise<ChampConceptBoxRecord[]> {
    const rawRecords = await this.fetchTableSafely(["Concept & Explainer Boxes", "Concept Boxes", "Explainer Boxes"]);
    return rawRecords.map((r: any) => {
      const f = r.fields || {};
      return {
        id: r.id,
        boxTitle: this.sanitizeText(f["Box Title"] || f["Title"] || "Untitled Box"),
        category: this.sanitizeText(f["Tag / Category"] || f["Category"] || "") || undefined,
        placement: this.sanitizeText(f["Placement / Section"] || f["Section"] || "") || undefined,
        excerpt: this.sanitizeText(f["Excerpt / Summary"] || f["Excerpt"] || "") || undefined,
        fullText: this.sanitizeText(f["Full Text / Explanation"] || f["Full Text"] || "") || undefined,
        learnMoreUrl: this.sanitizeText(f["Learn More URL"] || f["Link"] || "") || undefined,
        order: Number(f["Order"]) || 0,
        belongsToPathwayId: Array.isArray(f["Belongs to Pathway"]) ? f["Belongs to Pathway"][0] : f["Belongs to Pathway"]
      };
    });
  }

  // 8. Country Journeys
  public async getCountryJourneys(includeUnpublished = false): Promise<ChampCountryJourneyRecord[]> {
    const rawRecords = await this.fetchTableSafely(["Country Journeys", "Country Deep Dives", "Countries"]);
    const countries: ChampCountryJourneyRecord[] = [];

    for (const r of rawRecords) {
      const f = r.fields || {};
      const published = f["Published"] === true || f["Show in Toolkit"] === true;
      if (!published && !includeUnpublished) continue;

      const countryId = String(f["Country ID"] || f["Slug"] || f["Country"] || "").toLowerCase().trim();
      if (!countryId) continue;

      const status = this.sanitizeText(f["Status"] || (f["Is Ready"] === false ? "Coming Soon" : "Available"));
      const isReady = f["Is Ready"] !== undefined ? Boolean(f["Is Ready"]) : status === "Available";

      let keyMechanisms: string[] = [];
      const rawHighlights = f["Key Highlights"] !== undefined ? f["Key Highlights"] : f["Key Mechanisms"];
      if (rawHighlights) {
        if (Array.isArray(rawHighlights)) {
          keyMechanisms = rawHighlights.map((k) => this.sanitizeText(k)).filter(Boolean);
        } else {
          keyMechanisms = String(rawHighlights).split(/\r?\n|,/).map((s) => this.sanitizeText(s.replace(/^[•\-\*]\s*/, ""))).filter(Boolean);
        }
      }

      countries.push({
        id: r.id,
        countryId,
        countryName: this.sanitizeText(f["Country Name"] || f["Country"] || countryId.toUpperCase()),
        flagEmoji: this.sanitizeText(f["Flag Emoji"] || f["Flag"] || "🌍"),
        status,
        isReady,
        published,
        tagline: this.sanitizeText(f["Tagline"] || "") || undefined,
        summary: this.sanitizeText(f["Summary"] || "") || undefined,
        keyMechanisms,
        cardImageUrl: this.sanitizeText(f["Card Image URL"] || "") || undefined,
        themeColor: this.sanitizeText(f["Theme Color"] || "#207B6A"),
        headerTitle: this.sanitizeText(f["Header Title"] || "") || undefined,
        headerSubtitle: this.sanitizeText(f["Header Subtitle"] || "") || undefined,
        headerDescription: this.sanitizeText(f["Header Description"] || "") || undefined,
        tabATitle: this.sanitizeText(f["Tab A Title"] || "The Context") || undefined,
        tabASubtitle: this.sanitizeText(f["Tab A Subtitle"] || "") || undefined,
        premisesHeading: this.sanitizeText(f["Premises Heading"] || "Central Premises") || undefined,
        premisesIntro: this.sanitizeText(f["Premises Intro"] || "") || undefined,
        tabBTitle: this.sanitizeText(f["Tab B Title"] || "The Multilevel Model") || undefined,
        tabBSubtitle: this.sanitizeText(f["Tab B Subtitle"] || "") || undefined,
        modelHeading: this.sanitizeText(f["Model Heading"] || "") || undefined,
        modelOverview: this.sanitizeText(f["Model Overview"] || "") || undefined,
        modelDiagramNote: this.sanitizeText(f["Model Diagram Note"] || "") || undefined,
        diagramImageUrl: this.sanitizeText(f["Diagram Image URL"] || "") || undefined,
        diagramImageAlt: this.sanitizeText(f["Diagram Image Alt"] || "") || undefined,
        actionsHeading: this.sanitizeText(f["Actions Heading"] || "") || undefined,
        actionsSubtitle: this.sanitizeText(f["Actions Subtitle"] || "") || undefined,
        order: Number(f["Order"]) || 99
      });
    }

    countries.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
    return countries;
  }

  // 9. Country Sections
  public async getCountrySections(countryIdOrSlug?: string): Promise<ChampCountrySectionRecord[]> {
    const rawRecords = await this.fetchTableSafely(["Country Sections", "Country Context Sections", "Journey Sections"]);
    const sections: ChampCountrySectionRecord[] = [];

    for (const r of rawRecords) {
      const f = r.fields || {};
      const rawCountry = f["Belongs to Country"] || f["Country"] || f["Country ID"] || "";
      const belongsToCountry = Array.isArray(rawCountry)
        ? String(rawCountry[0]).toLowerCase().trim()
        : String(rawCountry).toLowerCase().trim();

      if (countryIdOrSlug && belongsToCountry !== countryIdOrSlug.toLowerCase().trim()) {
        continue;
      }

      const content = this.sanitizeText(f["Content"] || f["Paragraphs"] || "");
      let bulletPoints: string[] = [];
      if (f["Bullet Points"]) {
        bulletPoints = String(f["Bullet Points"])
          .split(/\r?\n/)
          .map((b) => this.sanitizeText(b.replace(/^[•\-\*]\s*/, "")))
          .filter(Boolean);
      }

      sections.push({
        id: r.id,
        title: this.sanitizeText(f["Title"] || f["Section Title"] || "Untitled Section"),
        belongsToCountry,
        sectionType: this.sanitizeText(f["Section Type"] || f["Type"] || "Context Section"),
        order: Number(f["Order"]) || 0,
        content,
        bulletPoints: bulletPoints.length > 0 ? bulletPoints : undefined
      });
    }

    sections.sort((a, b) => a.order - b.order);
    return sections;
  }

  // 10. Country Actions
  public async getCountryActions(countryIdOrSlug?: string): Promise<ChampCountryActionRecord[]> {
    const rawRecords = await this.fetchTableSafely(["Country Actions", "Country Journey Actions", "Journey Actions"]);
    const actions: ChampCountryActionRecord[] = [];

    for (const r of rawRecords) {
      const f = r.fields || {};
      const rawCountry = f["Belongs to Country"] || f["Country"] || f["Country ID"] || "";
      const belongsToCountry = Array.isArray(rawCountry)
        ? String(rawCountry[0]).toLowerCase().trim()
        : String(rawCountry).toLowerCase().trim();

      if (countryIdOrSlug && belongsToCountry !== countryIdOrSlug.toLowerCase().trim()) {
        continue;
      }

      const actionNumber = Number(f["Action Number"] || f["Number"] || f["Order"]) || 1;
      const title = this.sanitizeText(f["Title"] || f["Action Title"] || `Action ${actionNumber}`);
      const content = this.sanitizeText(f["Content"] || f["Detailed Content"] || f["Paragraphs"] || "");
      const caseStudyTitle = this.sanitizeText(f["Case Study Title"] || "");
      const caseStudyContent = this.sanitizeText(f["Case Study Content"] || "");
      const enabledAndOpportunity = this.sanitizeText(f["Enabled & Opportunity"] || f["Opportunity"] || "");
      const actionThemeTag = this.sanitizeText(f["Action Theme Tag"] || f["Theme"] || "");

      actions.push({
        id: r.id,
        title,
        actionNumber,
        belongsToCountry,
        actionThemeTag: actionThemeTag || undefined,
        content,
        caseStudyTitle: caseStudyTitle || undefined,
        caseStudyContent: caseStudyContent || undefined,
        enabledAndOpportunity: enabledAndOpportunity || undefined
      });
    }

    actions.sort((a, b) => a.actionNumber - b.actionNumber);
    return actions;
  }
}

export const defaultAirtableClient = new ChampAirtableClient();
