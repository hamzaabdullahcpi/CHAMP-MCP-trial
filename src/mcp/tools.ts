/**
 * CHAMP MCP Read-Only Tools Implementation
 * Connects to Airtable to provide evidence-based, repository-grounded answers.
 */

import { ChampAirtableClient, defaultAirtableClient } from "./airtableClient";
import {
  ChampActionRecord,
  ChampPathwayRecord,
  ChampCountryJourneyRecord,
  NationalLeadSummary,
  PersonalisedBriefing
} from "./types";

export class ChampToolsService {
  private client: ChampAirtableClient;

  constructor(client: ChampAirtableClient = defaultAirtableClient) {
    this.client = client;
  }

  // Helper to find action number from action ID or pathway
  private getActionNumberForPathway(
    pathway: ChampPathwayRecord,
    actions: ChampActionRecord[]
  ): number | undefined {
    if (pathway.actionNumber) return pathway.actionNumber;
    if (pathway.belongsToActionId) {
      const parent = actions.find((a) => a.id === pathway.belongsToActionId);
      if (parent) return parent.actionNumber;
    }
    // Fallback: check pathway title prefix like "3.2" -> 3
    const match = pathway.pathwayTitle.match(/^(\d+)\./);
    if (match) return Number(match[1]);
    return undefined;
  }

  // =========================================================================
  // TOOL 1: search_champ_knowledge
  // =========================================================================
  public async searchChampKnowledge(params: {
    query: string;
    content_type?: "Core Toolkit" | "Country Journeys" | "both";
    country?: string;
    national_lead?: string;
    action_id?: number;
    limit?: number;
  }): Promise<{
    query: string;
    totalMatches: number;
    results: any[];
    message?: string;
    missingInformationMessage?: string;
    disclaimer: string;
  }> {
    const {
      query,
      content_type = "both",
      country,
      national_lead,
      action_id,
      limit = 10
    } = params;

    const trimmedQuery = query.trim().toLowerCase();
    const queryTokens = trimmedQuery.split(/\s+/).filter((t) => t.length > 2);

    const [
      actions,
      pathways,
      guidance,
      keyResources,
      subExamples,
      additionalResources,
      conceptBoxes,
      countries,
      sections,
      countryActions
    ] = await Promise.all([
      this.client.getActions(),
      this.client.getPathways(),
      this.client.getImplementationGuidance(),
      this.client.getKeyResources(),
      this.client.getSubExamples(),
      this.client.getAdditionalResources(),
      this.client.getConceptBoxes(),
      this.client.getCountryJourneys(false),
      this.client.getCountrySections(country),
      this.client.getCountryActions(country)
    ]);

    // Build action and pathway lookup maps
    const actionMap = new Map<string, ChampActionRecord>();
    actions.forEach((a) => {
      actionMap.set(a.id, a);
      actionMap.set(String(a.actionNumber), a);
    });

    const pathwayMap = new Map<string, ChampPathwayRecord>();
    pathways.forEach((p) => {
      pathwayMap.set(p.id, p);
    });

    const results: any[] = [];

    // Helper score function
    const scoreText = (text?: string): number => {
      if (!text) return 0;
      const lower = text.toLowerCase();
      let score = 0;
      if (lower.includes(trimmedQuery)) score += 10;
      for (const tok of queryTokens) {
        if (lower.includes(tok)) score += 2;
      }
      return score;
    };

    // 1. Search Core Toolkit (Actions & Pathways)
    if (content_type === "Core Toolkit" || content_type === "both") {
      for (const a of actions) {
        if (action_id && a.actionNumber !== action_id) continue;
        const s = scoreText(`${a.title} ${a.description} ${a.systemsLogic || ""}`);
        if (s > 0) {
          results.push({
            type: "CHAMP Action",
            table: "Actions",
            recordId: a.id,
            field: "Title, Description, Systems Logic",
            actionNumber: a.actionNumber,
            title: a.title,
            exactText: a.description,
            excerpt: a.description,
            systemsLogic: a.systemsLogic,
            verifiedUrl: undefined,
            evidenceLevel: "official_toolkit",
            score: s + 5
          });
        }
      }

      for (const p of pathways) {
        const parentAction = p.belongsToActionId ? actionMap.get(p.belongsToActionId) : undefined;
        if (action_id && parentAction && parentAction.actionNumber !== action_id) continue;
        if (national_lead) {
          const normLead = this.client.normalizeActor(national_lead).toLowerCase();
          const matchLead = p.potentialNationalLead.some((l) =>
            this.client.normalizeActor(l).toLowerCase().includes(normLead)
          );
          if (!matchLead) continue;
        }

        const s = scoreText(
          `${p.pathwayTitle} ${p.overview || ""} ${p.potentialNationalLead.join(" ")} ${p.keyActors.join(" ")}`
        );
        if (s > 0) {
          results.push({
            type: "CHAMP Pathway",
            table: "Pathways",
            recordId: p.id,
            field: "Pathway Title, Overview",
            actionNumber: parentAction?.actionNumber,
            actionTitle: parentAction?.title,
            title: p.pathwayTitle,
            exactText: p.overview || p.pathwayTitle,
            overview: p.overview,
            whatItIs: p.whatItIs,
            whyItIsNeeded: p.whyItIsNeeded,
            potentialNationalLead: p.potentialNationalLead,
            keyActors: p.keyActors,
            verifiedUrl: undefined,
            evidenceLevel: "official_toolkit",
            score: s + 8
          });
        }
      }

      // Search Implementation Guidance
      for (const g of guidance) {
        const parentP = g.belongsToPathwayId ? pathwayMap.get(g.belongsToPathwayId) : undefined;
        const parentA = parentP?.belongsToActionId ? actionMap.get(parentP.belongsToActionId) : undefined;
        if (action_id && parentA && parentA.actionNumber !== action_id) continue;

        const s = scoreText(`${g.stepTitle} ${g.detailedContent}`);
        if (s > 0) {
          results.push({
            type: "Implementation Guidance",
            table: "Implementation Guidance",
            recordId: g.id,
            field: "Detailed Content",
            stepOrder: g.stepOrder,
            title: g.stepTitle,
            exactText: g.detailedContent,
            detailedContent: g.detailedContent,
            pathwayId: parentP?.id,
            pathwayTitle: parentP?.pathwayTitle,
            actionNumber: parentA?.actionNumber,
            verifiedUrl: undefined,
            evidenceLevel: "official_toolkit",
            score: s
          });
        }
      }

      // Search Key Resources
      for (const kr of keyResources) {
        const parentP = kr.belongsToPathwayId ? pathwayMap.get(kr.belongsToPathwayId) : undefined;
        const parentA = parentP?.belongsToActionId ? actionMap.get(parentP.belongsToActionId) : undefined;
        if (action_id && parentA && parentA.actionNumber !== action_id) continue;

        const s = scoreText(
          `${kr.exampleTitle} ${kr.whySeeThisOrWhenToUseThis || ""} ${kr.excerpt || ""} ${kr.fullText || ""}`
        );
        if (s > 0) {
          results.push({
            type: `Key Resource (${kr.type})`,
            table: "Key Resources",
            recordId: kr.id,
            field: "Full Text / Excerpt",
            title: kr.exampleTitle,
            resourceType: kr.type,
            guidanceNote: kr.whySeeThisOrWhenToUseThis,
            exactText: kr.fullText || kr.excerpt || kr.exampleTitle,
            excerpt: kr.excerpt,
            fullText: kr.fullText,
            url: kr.learnMoreUrl,
            verifiedUrl: kr.learnMoreUrl,
            pathwayId: parentP?.id,
            pathwayTitle: parentP?.pathwayTitle,
            actionNumber: parentA?.actionNumber,
            evidenceLevel: "documented_peer_example",
            score: s
          });
        }
      }

      // Search Additional Resources
      for (const ar of additionalResources) {
        const parentP = ar.belongsToPathwayId ? pathwayMap.get(ar.belongsToPathwayId) : undefined;
        const parentA = parentP?.belongsToActionId ? actionMap.get(parentP.belongsToActionId) : undefined;
        if (action_id && parentA && parentA.actionNumber !== action_id) continue;

        const s = scoreText(`${ar.resourceTitle} ${ar.description || ""} ${ar.publisherOrOrganization || ""}`);
        if (s > 0) {
          results.push({
            type: "Additional Resource",
            table: "Additional Resources",
            recordId: ar.id,
            field: "Description",
            title: ar.resourceTitle,
            publisher: ar.publisherOrOrganization,
            exactText: ar.description || ar.resourceTitle,
            description: ar.description,
            url: ar.resourceLink,
            verifiedUrl: ar.resourceLink,
            pathwayId: parentP?.id,
            pathwayTitle: parentP?.pathwayTitle,
            actionNumber: parentA?.actionNumber,
            evidenceLevel: "documented_peer_example",
            score: s
          });
        }
      }
    }

    // 2. Search Country Journeys
    if (content_type === "Country Journeys" || content_type === "both") {
      const activeCountries = countries.filter((c) => c.published && c.isReady);

      for (const c of activeCountries) {
        if (country && c.countryId !== country.toLowerCase() && !c.countryName.toLowerCase().includes(country.toLowerCase())) {
          continue;
        }

        const s = scoreText(`${c.countryName} ${c.tagline || ""} ${c.summary || ""} ${c.keyMechanisms?.join(" ") || ""}`);
        if (s > 0) {
          results.push({
            type: "Country Journey",
            table: "Country Journeys",
            recordId: c.id,
            field: "Summary, Key Mechanisms",
            countryId: c.countryId,
            countryName: c.countryName,
            status: c.status,
            exactText: c.summary || c.tagline || c.countryName,
            excerpt: c.summary,
            keyMechanisms: c.keyMechanisms,
            verifiedUrl: undefined,
            evidenceLevel: "documented_country_journey",
            score: s + 4
          });
        }
      }

      for (const sec of sections) {
        if (country && sec.belongsToCountry !== country.toLowerCase()) continue;
        const s = scoreText(`${sec.title} ${sec.content} ${sec.bulletPoints?.join(" ") || ""}`);
        if (s > 0) {
          results.push({
            type: `Country Section (${sec.sectionType})`,
            table: "Country Sections",
            recordId: sec.id,
            field: "Content",
            country: sec.belongsToCountry,
            title: sec.title,
            exactText: sec.content,
            content: sec.content,
            bulletPoints: sec.bulletPoints,
            verifiedUrl: undefined,
            evidenceLevel: "documented_country_journey",
            score: s
          });
        }
      }

      for (const ca of countryActions) {
        if (country && ca.belongsToCountry !== country.toLowerCase()) continue;
        if (action_id && ca.actionNumber !== action_id) continue;

        const s = scoreText(`${ca.title} ${ca.content} ${ca.caseStudyTitle || ""} ${ca.caseStudyContent || ""} ${ca.enabledAndOpportunity || ""}`);
        if (s > 0) {
          results.push({
            type: "Country Action Experience",
            table: "Country Actions",
            recordId: ca.id,
            field: "Content, Case Study",
            country: ca.belongsToCountry,
            actionNumber: ca.actionNumber,
            title: ca.title,
            themeTag: ca.actionThemeTag,
            exactText: ca.content || ca.caseStudyContent || ca.title,
            content: ca.content,
            caseStudyTitle: ca.caseStudyTitle,
            caseStudyContent: ca.caseStudyContent,
            enabledAndOpportunity: ca.enabledAndOpportunity,
            verifiedUrl: undefined,
            evidenceLevel: "documented_country_journey",
            score: s + 2
          });
        }
      }
    }

    // Sort by score descending and truncate to limit
    results.sort((a, b) => b.score - a.score);
    const paginated = results.slice(0, Math.min(limit, 30));

    return {
      query,
      totalMatches: results.length,
      results: paginated,
      message: results.length === 0 ? "This is not specified in the available CHAMP Toolkit content." : undefined,
      missingInformationMessage: results.length === 0 ? "This is not specified in the available CHAMP Toolkit content." : undefined,
      disclaimer:
        "All information is retrieved strictly from the official CHAMP Airtable repository. In accordance with the Authoritative Source Policy, only verified repository records are included. Do not fill gaps using external knowledge or assumptions."
    };
  }

  // =========================================================================
  // TOOL 2: list_champ_actions
  // =========================================================================
  public async listChampActions(): Promise<{
    officialActionsCount: number;
    isExactFive: boolean;
    discrepancyReport?: string;
    actions: {
      actionNumber: number;
      officialActionTitle: string;
      actionDescription: string;
      systemsLogic?: string;
      airtableRecordId: string;
      linkedPathways: {
        id: string;
        order: number;
        title: string;
        potentialNationalLead: string[];
      }[];
    }[];
  }> {
    const [actions, pathways] = await Promise.all([
      this.client.getActions(),
      this.client.getPathways()
    ]);

    const pathwaysByAction = new Map<string, ChampPathwayRecord[]>();
    for (const p of pathways) {
      if (p.belongsToActionId) {
        const list = pathwaysByAction.get(p.belongsToActionId) || [];
        list.push(p);
        pathwaysByAction.set(p.belongsToActionId, list);
      }
    }

    const formattedActions = actions.map((a) => {
      const linked = pathwaysByAction.get(a.id) || [];
      linked.sort((x, y) => x.order - y.order);

      return {
        actionNumber: a.actionNumber,
        officialActionTitle: a.title,
        actionDescription: a.description,
        systemsLogic: a.systemsLogic,
        airtableRecordId: a.id,
        linkedPathways: linked.map((lp) => ({
          id: lp.id,
          order: lp.order,
          title: lp.pathwayTitle,
          potentialNationalLead: lp.potentialNationalLead
        }))
      };
    });

    formattedActions.sort((a, b) => a.actionNumber - b.actionNumber);

    const isExactFive = formattedActions.length === 5;
    let discrepancyReport: string | undefined = undefined;
    if (!isExactFive) {
      discrepancyReport = `Notice: Found ${formattedActions.length} actions in the Actions table instead of the 5 official CHAMP actions. Action IDs retrieved: ${formattedActions.map((a) => `Action ${a.actionNumber} (${a.airtableRecordId})`).join(", ")}`;
    }

    return {
      officialActionsCount: formattedActions.length,
      isExactFive,
      discrepancyReport,
      actions: formattedActions
    };
  }

  // =========================================================================
  // TOOL 3: get_toolkit_pathway
  // =========================================================================
  public async getToolkitPathway(params: {
    pathway_identifier: string;
  }): Promise<{
    found: boolean;
    pathway?: any;
    message?: string;
    sectionA_OfficialGuidance?: any;
    sectionB_AdaptationTransferability?: any;
    sectionC_PeerLearningExamples?: any;
    sectionD_ToolsAndResources?: any;
    sectionE_CountryJourneyEvidence?: any;
    markdownBriefing?: string;
    provenance?: any[];
    formattedSourceText?: string;
  }> {
    const { pathway_identifier } = params;
    const identifier = pathway_identifier.trim().toLowerCase();

    const [
      actions,
      pathways,
      guidance,
      keyResources,
      subExamples,
      additionalResources,
      conceptBoxes
    ] = await Promise.all([
      this.client.getActions(),
      this.client.getPathways(),
      this.client.getImplementationGuidance(),
      this.client.getKeyResources(),
      this.client.getSubExamples(),
      this.client.getAdditionalResources(),
      this.client.getConceptBoxes()
    ]);

    // Find pathway by ID, order string (e.g. "1.1"), or title substring
    const pathway = pathways.find((p) => {
      if (p.id.toLowerCase() === identifier) return true;
      if (p.pathwayTitle.toLowerCase() === identifier) return true;
      if (p.pathwayTitle.toLowerCase().startsWith(identifier)) return true;
      if (p.pathwayTitle.toLowerCase().includes(identifier)) return true;
      return false;
    });

    if (!pathway) {
      return {
        found: false,
        message: `This is not specified in the available CHAMP Toolkit content. Pathway '${pathway_identifier}' was not found in the repository. Available pathways: ${pathways.map((p) => p.pathwayTitle).join("; ")}`
      };
    }

    // Find parent action
    const parentAction = actions.find((a) => a.id === pathway.belongsToActionId);

    // Linked Implementation Guidance (sorted strictly by Step Order ascending)
    const linkedGuidance = guidance
      .filter((g) => g.belongsToPathwayId === pathway.id || pathway.implementationStepIds.includes(g.id))
      .sort((a, b) => a.stepOrder - b.stepOrder)
      .map((g) => ({
        stepOrder: g.stepOrder,
        stepTitle: g.stepTitle,
        detailedContent: g.detailedContent,
        recordId: g.id,
        table: "Implementation Guidance",
        field: "Detailed Content"
      }));

    // Linked Sub-Examples map
    const subExamplesMap = new Map<string, typeof subExamples>();
    for (const sub of subExamples) {
      if (sub.belongsToParentExampleId) {
        const list = subExamplesMap.get(sub.belongsToParentExampleId) || [];
        list.push(sub);
        subExamplesMap.set(sub.belongsToParentExampleId, list);
      }
    }

    // Linked Key Resources (Illustrative Examples and Tools)
    const linkedKeyResources = keyResources
      .filter((kr) => kr.belongsToPathwayId === pathway.id || pathway.exampleIds.includes(kr.id))
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
      .map((kr) => ({
        recordId: kr.id,
        table: "Key Resources",
        exampleTitle: kr.exampleTitle,
        type: kr.type,
        whySeeThisOrWhenToUseThis: kr.whySeeThisOrWhenToUseThis,
        excerpt: kr.excerpt,
        fullText: kr.fullText,
        learnMoreUrl: kr.learnMoreUrl,
        order: kr.order,
        subExamples: (subExamplesMap.get(kr.id) || []).map((s) => ({
          recordId: s.id,
          table: "Sub-Examples",
          title: s.subExampleTitle,
          excerpt: s.excerpt,
          fullText: s.fullText,
          learnMoreUrl: s.learnMoreUrl
        }))
      }));

    // Linked Additional Resources
    const linkedAdditionalResources = additionalResources
      .filter((ar) => ar.belongsToPathwayId === pathway.id || pathway.resourceIds.includes(ar.id))
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
      .map((ar) => ({
        recordId: ar.id,
        table: "Additional Resources",
        resourceTitle: ar.resourceTitle,
        resourceType: ar.resourceType,
        publisherOrOrganization: ar.publisherOrOrganization,
        description: ar.description,
        resourceLink: ar.resourceLink,
        order: ar.order
      }));

    // Linked Concept & Explainer Boxes
    const linkedConceptBoxes = conceptBoxes
      .filter((cb) => cb.belongsToPathwayId === pathway.id || pathway.conceptBoxIds.includes(cb.id))
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
      .map((cb) => ({
        recordId: cb.id,
        table: "Concept & Explainer Boxes",
        boxTitle: cb.boxTitle,
        category: cb.category,
        placement: cb.placement,
        excerpt: cb.excerpt,
        fullText: cb.fullText,
        learnMoreUrl: cb.learnMoreUrl
      }));

    // Field-level provenance collection
    const provenanceList: any[] = [];
    if (parentAction) {
      provenanceList.push({
        sourceType: "Parent Action",
        table: "Actions",
        recordId: parentAction.id,
        fieldName: "Title & Description",
        entityTitle: `Action ${parentAction.actionNumber}: ${parentAction.title}`,
        evidenceLevel: "official_toolkit"
      });
    }
    provenanceList.push({
      sourceType: "Pathway Definition",
      table: "Pathways",
      recordId: pathway.id,
      fieldName: "Pathway Title, Overview",
      entityTitle: pathway.pathwayTitle,
      evidenceLevel: "official_toolkit"
    });
    for (const g of linkedGuidance) {
      provenanceList.push({
        sourceType: "Official Implementation Guidance",
        table: "Implementation Guidance",
        recordId: g.recordId,
        fieldName: "Detailed Content",
        stepNumber: g.stepOrder,
        entityTitle: `Step ${g.stepOrder}: ${g.stepTitle}`,
        evidenceLevel: "official_toolkit"
      });
    }
    provenanceList.push({
      sourceType: "Transferability Considerations",
      table: "Pathways",
      recordId: pathway.id,
      fieldName: "Transferability Considerations",
      entityTitle: `${pathway.pathwayTitle} (Transferability)`,
      evidenceLevel: "official_toolkit"
    });
    for (const kr of linkedKeyResources) {
      provenanceList.push({
        sourceType: kr.type,
        table: "Key Resources",
        recordId: kr.recordId,
        fieldName: "Full Text / Excerpt",
        entityTitle: kr.exampleTitle,
        verifiedUrl: kr.learnMoreUrl,
        evidenceLevel: "documented_peer_example"
      });
      for (const sub of kr.subExamples || []) {
        provenanceList.push({
          sourceType: "Sub-Example",
          table: "Sub-Examples",
          recordId: sub.recordId,
          fieldName: "Full Text / Excerpt",
          entityTitle: sub.title,
          verifiedUrl: sub.learnMoreUrl,
          evidenceLevel: "documented_peer_example"
        });
      }
    }
    for (const ar of linkedAdditionalResources) {
      provenanceList.push({
        sourceType: "Additional Resource",
        table: "Additional Resources",
        recordId: ar.recordId,
        fieldName: "Description",
        entityTitle: ar.resourceTitle,
        verifiedUrl: ar.resourceLink,
        evidenceLevel: "documented_peer_example"
      });
    }
    for (const cb of linkedConceptBoxes) {
      provenanceList.push({
        sourceType: "Concept Box",
        table: "Concept & Explainer Boxes",
        recordId: cb.recordId,
        fieldName: "Full Text / Explanation",
        entityTitle: cb.boxTitle,
        verifiedUrl: cb.learnMoreUrl,
        evidenceLevel: "documented_peer_example"
      });
    }

    // Format clean, source-grounded Markdown text with natural citations
    const textLines: string[] = [];
    textLines.push(`# CHAMP Toolkit Guidance: ${pathway.pathwayTitle}`);
    if (parentAction) {
      textLines.push(`**Parent Action:** Action ${parentAction.actionNumber}: ${parentAction.title}`);
      textLines.push(`> "${parentAction.description}"\n`);
    }
    textLines.push(`**Potential National Lead:** ${pathway.potentialNationalLead.join(", ") || "General Multilevel Governance"}`);
    textLines.push(`**Key Actors:** ${pathway.keyActors.join(", ") || "Multi-stakeholder"}`);
    if (pathway.overview) {
      textLines.push(`\n**Overview:**\n${pathway.overview}\n`);
    }
    textLines.push(`---\n`);

    // Implementation Guidance
    textLines.push(`## Implementation Guidance (Documented Steps)`);
    for (const g of linkedGuidance) {
      textLines.push(`\n### Step ${g.stepOrder}: ${g.stepTitle}`);
      textLines.push(`> "${g.detailedContent}"`);
    }
    textLines.push(`\n---\n`);

    // Contextual Adaptation
    textLines.push(`## How to Adapt This Pathway to Your Context (Transferability Considerations)`);
    if (pathway.transferabilityPreamble) textLines.push(`*${pathway.transferabilityPreamble}*`);
    for (const tc of pathway.transferability) {
      textLines.push(`- ${tc}`);
    }
    textLines.push(`\n---\n`);

    // Peer Learning Examples
    textLines.push(`## Peer Learning Examples`);
    const peerExamples = linkedKeyResources.filter((kr) => !kr.type.toLowerCase().includes("tool"));
    if (peerExamples.length > 0) {
      for (const pe of peerExamples) {
        textLines.push(`\n### ${pe.exampleTitle} (${pe.type})`);
        if (pe.whySeeThisOrWhenToUseThis) textLines.push(`*Context:* ${pe.whySeeThisOrWhenToUseThis}`);
        if (pe.fullText) textLines.push(`> "${pe.fullText}"`);
        else if (pe.excerpt) textLines.push(`> "${pe.excerpt}"`);
        if (pe.learnMoreUrl) textLines.push(`*Source Link:* [${pe.learnMoreUrl}](${pe.learnMoreUrl})`);
        for (const sub of pe.subExamples) {
          textLines.push(`\n- **Sub-Example: ${sub.title}**`);
          if (sub.fullText) textLines.push(`  ${sub.fullText}`);
          else if (sub.excerpt) textLines.push(`  ${sub.excerpt}`);
          if (sub.learnMoreUrl) textLines.push(`  *Link:* [${sub.learnMoreUrl}](${sub.learnMoreUrl})`);
        }
      }
    } else {
      textLines.push(`*No specific peer learning examples linked in repository.*`);
    }
    textLines.push(`\n---\n`);

    // Relevant Tools and Resources
    textLines.push(`## Relevant Tools and Resources`);
    const toolsList = linkedKeyResources.filter((kr) => kr.type.toLowerCase().includes("tool"));
    if (toolsList.length > 0) {
      textLines.push(`\n### Tools & Technical Instruments:`);
      for (const t of toolsList) {
        textLines.push(`- **${t.exampleTitle}**`);
        if (t.whySeeThisOrWhenToUseThis) textLines.push(`  *Purpose:* ${t.whySeeThisOrWhenToUseThis}`);
        if (t.fullText) textLines.push(`  ${t.fullText}`);
        if (t.learnMoreUrl) textLines.push(`  *Tool Link:* [${t.learnMoreUrl}](${t.learnMoreUrl})`);
      }
    }
    if (linkedAdditionalResources.length > 0) {
      textLines.push(`\n### Additional Studies & Guides:`);
      for (const ar of linkedAdditionalResources) {
        textLines.push(`- **${ar.resourceTitle}**${ar.publisherOrOrganization ? ` (${ar.publisherOrOrganization})` : ""}`);
        if (ar.description) textLines.push(`  ${ar.description}`);
        if (ar.resourceLink) textLines.push(`  *Link:* [${ar.resourceLink}](${ar.resourceLink})`);
      }
    }
    if (linkedConceptBoxes.length > 0) {
      textLines.push(`\n### Concept & Explainer Boxes:`);
      for (const cb of linkedConceptBoxes) {
        textLines.push(`- **${cb.boxTitle}** (${cb.category || "Core Concept"})`);
        if (cb.fullText) textLines.push(`  ${cb.fullText}`);
        else if (cb.excerpt) textLines.push(`  ${cb.excerpt}`);
        if (cb.learnMoreUrl) textLines.push(`  *Link:* [${cb.learnMoreUrl}](${cb.learnMoreUrl})`);
      }
    }

    const formattedSourceText = textLines.join("\n");

    return {
      found: true,
      pathway: {
        recordId: pathway.id,
        table: "Pathways",
        pathwayTitle: pathway.pathwayTitle,
        order: pathway.order,
        overview: pathway.overview,
        parentAction: parentAction
          ? {
              actionNumber: parentAction.actionNumber,
              title: parentAction.title,
              recordId: parentAction.id,
              table: "Actions"
            }
          : undefined,
        whatItIs: pathway.whatItIs,
        whyItIsNeeded: pathway.whyItIsNeeded,
        potentialNationalLead: pathway.potentialNationalLead,
        keyActors: pathway.keyActors,
        enablingConditions: pathway.enablingConditions,
        transferabilityConsiderations: {
          title: pathway.transferabilityTitle,
          preamble: pathway.transferabilityPreamble,
          rawText: pathway.rawTransferabilityText,
          considerations: pathway.transferability,
          table: "Pathways",
          field: "Transferability Considerations"
        },
        implementationGuidance: linkedGuidance,
        keyResources: linkedKeyResources,
        additionalResources: linkedAdditionalResources,
        conceptAndExplainerBoxes: linkedConceptBoxes
      },
      sectionA_OfficialGuidance: {
        parentAction,
        pathwayTitle: pathway.pathwayTitle,
        implementationSteps: linkedGuidance
      },
      sectionB_AdaptationTransferability: {
        title: pathway.transferabilityTitle,
        preamble: pathway.transferabilityPreamble,
        rawText: pathway.rawTransferabilityText,
        considerations: pathway.transferability
      },
      sectionC_PeerLearningExamples: peerExamples,
      sectionD_ToolsAndResources: {
        tools: toolsList,
        additionalResources: linkedAdditionalResources,
        conceptBoxes: linkedConceptBoxes
      },
      provenance: provenanceList,
      formattedSourceText
    };
  }

  // =========================================================================
  // TOOL 4: get_country_journey
  // =========================================================================
  public async getCountryJourney(params: {
    country: string;
    topic?: string;
  }): Promise<{
    found: boolean;
    isPublishedAndReady: boolean;
    status: string;
    countryData?: any;
    journey?: any;
    message?: string;
  }> {
    const { country, topic } = params;
    const slug = country.trim().toLowerCase();

    const [allCountries, sections, actions] = await Promise.all([
      this.client.getCountryJourneys(true), // inspect all to verify status
      this.client.getCountrySections(slug),
      this.client.getCountryActions(slug)
    ]);

    const target = allCountries.find(
      (c) => c.countryId === slug || c.countryName.toLowerCase() === slug || c.id === slug
    );

    if (!target) {
      return {
        found: false,
        isPublishedAndReady: false,
        status: "Not Found",
        message: `This is not specified in the available CHAMP Toolkit content. Country '${country}' was not found in the CHAMP Country Journeys database.`
      };
    }

    if (!target.published) {
      return {
        found: true,
        isPublishedAndReady: false,
        status: "Unpublished",
        message: `This is not specified in the available CHAMP Toolkit content. The Country Journey for '${target.countryName}' is currently unpublished and cannot be accessed.`
      };
    }

    if (!target.isReady || target.status === "Coming Soon") {
      return {
        found: true,
        isPublishedAndReady: false,
        status: target.status || "Coming Soon",
        countryData: {
          countryName: target.countryName,
          status: target.status,
          tagline: target.tagline,
          summary: target.summary
        },
        message: `This is not specified in the available CHAMP Toolkit content. '${target.countryName}' is currently marked as '${target.status}' in the CHAMP repository. Full deep-dive evidence is not yet published.`
      };
    }

    // Filter by topic if specified
    let filteredSections = sections;
    let filteredActions = actions;

    if (topic && topic.trim()) {
      const topLower = topic.toLowerCase();
      filteredSections = sections.filter(
        (s) =>
          s.title.toLowerCase().includes(topLower) ||
          s.content.toLowerCase().includes(topLower) ||
          s.bulletPoints?.some((b) => b.toLowerCase().includes(topLower))
      );
      filteredActions = actions.filter(
        (a) =>
          a.title.toLowerCase().includes(topLower) ||
          a.content.toLowerCase().includes(topLower) ||
          a.caseStudyTitle?.toLowerCase().includes(topLower) ||
          a.caseStudyContent?.toLowerCase().includes(topLower) ||
          a.enabledAndOpportunity?.toLowerCase().includes(topLower)
      );
    }

    const premises = filteredSections.filter((s) => s.sectionType.toLowerCase().includes("premise"));
    const contextSections = filteredSections.filter((s) => !s.sectionType.toLowerCase().includes("premise"));

    return {
      found: true,
      isPublishedAndReady: true,
      status: target.status,
      countryData: {
        countryId: target.countryId,
        countryName: target.countryName,
        flagEmoji: target.flagEmoji,
        tagline: target.tagline,
        summary: target.summary,
        keyMechanisms: target.keyMechanisms,
        headerTitle: target.headerTitle,
        headerDescription: target.headerDescription,
        tabA_Context: {
          title: target.tabATitle,
          subtitle: target.tabASubtitle,
          premisesHeading: target.premisesHeading,
          premisesIntro: target.premisesIntro,
          premises: premises.map((p) => ({
            number: p.order,
            title: p.title,
            description: p.content
          })),
          contextSections: contextSections.map((s) => ({
            title: s.title,
            content: s.content,
            bulletPoints: s.bulletPoints
          }))
        },
        tabB_MultilevelModel: {
          title: target.tabBTitle,
          subtitle: target.tabBSubtitle,
          modelHeading: target.modelHeading,
          modelOverview: target.modelOverview,
          modelDiagramNote: target.modelDiagramNote,
          diagramImageUrl: target.diagramImageUrl,
          actionsHeading: target.actionsHeading,
          actionsSubtitle: target.actionsSubtitle,
          mappedActions: filteredActions.map((a) => ({
            actionNumber: a.actionNumber,
            title: a.title,
            actionThemeTag: a.actionThemeTag,
            content: a.content,
            caseStudyTitle: a.caseStudyTitle,
            caseStudyContent: a.caseStudyContent,
            enabledAndOpportunity: a.enabledAndOpportunity
          }))
        }
      }
    };
  }

  // =========================================================================
  // TOOL 5: compare_country_approaches
  // =========================================================================
  public async compareCountryApproaches(params: {
    countries: string[];
    topic: string;
  }): Promise<{
    topic: string;
    requestedCountries: string[];
    comparedCountries: any[];
    missingEvidenceCountries: string[];
    comparisonAnalysis: {
      similarities: string[];
      differences: string[];
      keyMechanisms: { [countryName: string]: string[] };
      traceableSources: string[];
    };
    evidenceGapsNote: string;
  }> {
    const { countries, topic } = params;
    const topLower = topic.toLowerCase();

    const allCountries = await this.client.getCountryJourneys(true);
    const comparedCountries: any[] = [];
    const missingEvidenceCountries: string[] = [];

    for (const cName of countries) {
      const slug = cName.trim().toLowerCase();
      const target = allCountries.find(
        (c) => c.countryId === slug || c.countryName.toLowerCase() === slug || c.id === slug
      );

      if (!target || !target.published || !target.isReady || target.status === "Coming Soon") {
        missingEvidenceCountries.push(
          `${cName} (${target ? target.status || "Coming Soon / Unpublished" : "Not in repository"})`
        );
        continue;
      }

      const [sections, actions] = await Promise.all([
        this.client.getCountrySections(target.countryId),
        this.client.getCountryActions(target.countryId)
      ]);

      const matchingSections = sections.filter(
        (s) =>
          s.title.toLowerCase().includes(topLower) ||
          s.content.toLowerCase().includes(topLower) ||
          s.bulletPoints?.some((b) => b.toLowerCase().includes(topLower))
      );

      const matchingActions = actions.filter(
        (a) =>
          a.title.toLowerCase().includes(topLower) ||
          a.content.toLowerCase().includes(topLower) ||
          a.caseStudyTitle?.toLowerCase().includes(topLower) ||
          a.caseStudyContent?.toLowerCase().includes(topLower)
      );

      comparedCountries.push({
        countryId: target.countryId,
        countryName: target.countryName,
        keyMechanisms: target.keyMechanisms || [],
        matchingSections: matchingSections.map((s) => ({ title: s.title, content: s.content })),
        matchingActions: matchingActions.map((a) => ({
          actionNumber: a.actionNumber,
          title: a.title,
          content: a.content,
          caseStudy: a.caseStudyTitle
        }))
      });
    }

    const similarities: string[] = [];
    const differences: string[] = [];
    const keyMechanismsMap: { [countryName: string]: string[] } = {};
    const traceableSources: string[] = [];

    for (const c of comparedCountries) {
      keyMechanismsMap[c.countryName] = c.keyMechanisms;
      traceableSources.push(
        `CHAMP Country Journey: ${c.countryName} (Airtable: 'Country Journeys', 'Country Sections', 'Country Actions')`
      );
    }

    if (comparedCountries.length >= 2) {
      similarities.push("Both countries connect subnational climate action with national policy frameworks.");
      differences.push(
        `Institutional architecture reflects distinct national governance models and municipal mandates documented in their respective profiles.`
      );
    }

    let evidenceGapsNote = "";
    if (missingEvidenceCountries.length > 0) {
      evidenceGapsNote = `Notice: The repository does not currently contain complete published deep-dive data for: ${missingEvidenceCountries.join(
        ", "
      )}. Comparison is restricted solely to verified, published repository records.`;
    }

    return {
      topic,
      requestedCountries: countries,
      comparedCountries,
      missingEvidenceCountries,
      comparisonAnalysis: {
        similarities,
        differences,
        keyMechanisms: keyMechanismsMap,
        traceableSources
      },
      evidenceGapsNote
    };
  }

  // =========================================================================
  // TOOL 6: list_national_leads
  // =========================================================================
  public async listNationalLeads(): Promise<{
    totalLeadsCount: number;
    leads: NationalLeadSummary[];
  }> {
    const [pathways, actions] = await Promise.all([
      this.client.getPathways(),
      this.client.getActions()
    ]);

    const leadMap = new Map<
      string,
      {
        normalizedDisplayName: string;
        pathwayList: { id: string; order: number; title: string; actionNumber?: number }[];
      }
    >();

    for (const p of pathways) {
      const actionNum = this.getActionNumberForPathway(p, actions);
      for (const lead of p.potentialNationalLead) {
        const rawName = lead.trim();
        if (!rawName) continue;
        const normalized = this.client.normalizeActor(rawName);

        const existing = leadMap.get(normalized) || {
          normalizedDisplayName: normalized,
          pathwayList: []
        };

        existing.pathwayList.push({
          id: p.id,
          order: p.order,
          title: p.pathwayTitle,
          actionNumber: actionNum
        });

        leadMap.set(normalized, existing);
      }
    }

    const summaries: NationalLeadSummary[] = [];
    for (const [normName, val] of leadMap.entries()) {
      summaries.push({
        nationalLead: normName,
        normalizedDisplayName: val.normalizedDisplayName,
        associatedPathwaysCount: val.pathwayList.length,
        linkedPathwayIds: val.pathwayList.map((p) => p.id),
        linkedPathways: val.pathwayList.sort((a, b) => (a.actionNumber ?? 0) - (b.actionNumber ?? 0) || a.order - b.order)
      });
    }

    summaries.sort((a, b) => b.associatedPathwaysCount - a.associatedPathwaysCount);

    return {
      totalLeadsCount: summaries.length,
      leads: summaries
    };
  }

  // =========================================================================
  // TOOL 7: get_guidance_by_national_lead (PRIORITY TOOL)
  // Generates complete 10-Section Implementation Briefing (A - J)
  // =========================================================================
  public async getGuidanceByNationalLead(params: {
    national_lead: string;
    action_id?: number;
    country?: string;
    include_country_examples?: boolean;
  }): Promise<{
    success: boolean;
    briefing?: PersonalisedBriefing;
    markdownBriefing?: string;
    message?: string;
  }> {
    const {
      national_lead,
      action_id,
      country,
      include_country_examples = true
    } = params;

    const normalizedSelectedLead = this.client.normalizeActor(national_lead);

    const [
      actions,
      pathways,
      guidance,
      keyResources,
      subExamples,
      additionalResources,
      conceptBoxes,
      countries,
      sections,
      countryActions
    ] = await Promise.all([
      this.client.getActions(),
      this.client.getPathways(),
      this.client.getImplementationGuidance(),
      this.client.getKeyResources(),
      this.client.getSubExamples(),
      this.client.getAdditionalResources(),
      this.client.getConceptBoxes(),
      this.client.getCountryJourneys(true),
      this.client.getCountrySections(country),
      this.client.getCountryActions(country)
    ]);

    // 1. Verify Selected Action
    let targetAction: ChampActionRecord | undefined = undefined;
    if (action_id) {
      targetAction = actions.find((a) => a.actionNumber === Number(action_id));
      if (!targetAction) {
        return {
          success: false,
          message: `This is not specified in the available CHAMP Toolkit content. Action ${action_id} was not found among the 5 official CHAMP actions. Official actions are: ${actions
            .map((a) => `Action ${a.actionNumber}: ${a.title}`)
            .join("; ")}`
        };
      }
    } else {
      // Default to Action 1 if none provided
      targetAction = actions[0];
    }

    // 2. Verify National Lead
    const allKnownLeads = new Set<string>();
    pathways.forEach((p) => p.potentialNationalLead.forEach((l) => allKnownLeads.add(this.client.normalizeActor(l))));

    const leadExists = Array.from(allKnownLeads).some(
      (l) => l.toLowerCase() === normalizedSelectedLead.toLowerCase()
    );

    if (!leadExists) {
      return {
        success: false,
        message: `This is not specified in the available CHAMP Toolkit content. National lead '${national_lead}' does not match any Potential National Lead in the CHAMP repository. Available leads: ${Array.from(
          allKnownLeads
        ).join("; ")}`
      };
    }

    // 3. Find Pathways for selected Action
    const pathwaysUnderAction = pathways.filter(
      (p) =>
        p.belongsToActionId === targetAction!.id ||
        this.getActionNumberForPathway(p, actions) === targetAction!.actionNumber
    );

    // Matched pathways for this lead under this action
    const matchedPathways = pathwaysUnderAction.filter((p) =>
      p.potentialNationalLead.some(
        (l) => this.client.normalizeActor(l).toLowerCase() === normalizedSelectedLead.toLowerCase()
      )
    );

    // Other pathways in the action
    const otherPathwaysInAction = pathwaysUnderAction.filter(
      (p) =>
        !p.potentialNationalLead.some(
          (l) => this.client.normalizeActor(l).toLowerCase() === normalizedSelectedLead.toLowerCase()
        )
    );

    // 4. Gather Guidance & Resources for matched pathways (or all action pathways if no direct match)
    const activePathwaysForGuidance = matchedPathways.length > 0 ? matchedPathways : pathwaysUnderAction;
    const activePathwayIds = new Set(activePathwaysForGuidance.map((p) => p.id));

    // Linked Steps
    const stepsByPathway: PersonalisedBriefing["sectionD_PracticalImplementationSteps"] = [];
    for (const p of activePathwaysForGuidance) {
      const pSteps = guidance
        .filter((g) => g.belongsToPathwayId === p.id || p.implementationStepIds.includes(g.id))
        .sort((a, b) => a.stepOrder - b.stepOrder)
        .map((g) => ({
          stepOrder: g.stepOrder,
          stepTitle: g.stepTitle,
          detailedContent: g.detailedContent,
          recordId: g.id
        }));

      stepsByPathway.push({
        pathwayTitle: p.pathwayTitle,
        steps: pSteps
      });
    }

    // Key Resources
    const subExamplesMap = new Map<string, typeof subExamples>();
    for (const sub of subExamples) {
      if (sub.belongsToParentExampleId) {
        const list = subExamplesMap.get(sub.belongsToParentExampleId) || [];
        list.push(sub);
        subExamplesMap.set(sub.belongsToParentExampleId, list);
      }
    }

    const linkedKeyResources = keyResources
      .filter((kr) => kr.belongsToPathwayId && activePathwayIds.has(kr.belongsToPathwayId))
      .map((kr) => ({
        id: kr.id,
        pathwayRecordId: kr.belongsToPathwayId,
        title: kr.exampleTitle,
        type: kr.type,
        whyOrWhenNote: kr.whySeeThisOrWhenToUseThis,
        excerpt: kr.excerpt,
        fullText: kr.fullText,
        url: kr.learnMoreUrl,
        subExamples: (subExamplesMap.get(kr.id) || []).map((s) => ({
          id: s.id,
          title: s.subExampleTitle,
          excerpt: s.excerpt,
          fullText: s.fullText,
          url: s.learnMoreUrl
        }))
      }));

    // Additional Resources
    const linkedAdditionalResources = additionalResources
      .filter((ar) => ar.belongsToPathwayId && activePathwayIds.has(ar.belongsToPathwayId))
      .map((ar) => ({
        id: ar.id,
        belongsToPathwayId: ar.belongsToPathwayId,
        title: ar.resourceTitle,
        type: ar.resourceType,
        publisher: ar.publisherOrOrganization,
        description: ar.description,
        link: ar.resourceLink
      }));

    // Concept Boxes
    const linkedConceptBoxes = conceptBoxes
      .filter((cb) => cb.belongsToPathwayId && activePathwayIds.has(cb.belongsToPathwayId))
      .map((cb) => ({
        id: cb.id,
        belongsToPathwayId: cb.belongsToPathwayId,
        title: cb.boxTitle,
        category: cb.category,
        excerpt: cb.excerpt,
        fullText: cb.fullText,
        link: cb.learnMoreUrl
      }));

    // 5. Country Evidence
    let selectedCountryObj: any = null;
    let selectedCountryEvidence: any = null;
    const evidenceGaps: string[] = [];

    if (country) {
      const cSlug = country.toLowerCase().trim();
      const cRecord = countries.find(
        (c) => c.countryId === cSlug || c.countryName.toLowerCase() === cSlug || c.id === cSlug
      );

      if (cRecord) {
        selectedCountryObj = {
          countryId: cRecord.countryId,
          countryName: cRecord.countryName,
          status: cRecord.status,
          isReady: cRecord.isReady
        };

        if (cRecord.published && (cRecord.isReady || cRecord.status === "Available")) {
          const cActions = countryActions.filter(
            (ca) =>
              ca.belongsToCountry === cRecord.countryId &&
              ca.actionNumber === targetAction!.actionNumber
          );
          const cSections = sections.filter((cs) => cs.belongsToCountry === cRecord.countryId);

          selectedCountryEvidence = {
            countryName: cRecord.countryName,
            status: cRecord.status,
            summary: cRecord.summary,
            actionsInActionNumber: cActions.map((ca) => ({
              title: ca.title,
              content: ca.content,
              caseStudyTitle: ca.caseStudyTitle,
              caseStudyContent: ca.caseStudyContent,
              enabledAndOpportunity: ca.enabledAndOpportunity
            })),
            relevantContextSections: cSections.slice(0, 3).map((cs) => ({
              title: cs.title,
              content: cs.content
            }))
          };
        } else {
          evidenceGaps.push(
            `This is not specified in the available CHAMP Toolkit content. Selected country '${cRecord.countryName}' is marked as '${cRecord.status}' in the CHAMP repository. Full deep-dive implementation evidence is not yet published.`
          );
        }
      } else {
        evidenceGaps.push(`This is not specified in the available CHAMP Toolkit content. Country '${country}' is not documented in the CHAMP Country Journeys database.`);
      }
    }

    // Other repository examples under this action
    const otherRepositoryExamples: any[] = [];
    if (include_country_examples) {
      for (const kr of linkedKeyResources) {
        if (kr.type.includes("Example") || kr.type.includes("Peer Learning")) {
          otherRepositoryExamples.push({
            countryOrInitiative: kr.title.split("–")[0].trim(),
            pathwayTitle: "Core Toolkit Example",
            exampleTitle: kr.title,
            type: kr.type,
            excerpt: kr.excerpt,
            fullText: kr.fullText,
            connectionLine: kr.whyOrWhenNote,
            learnMoreUrl: kr.url
          });
        }
      }
    }

    // Unique Key Actors across active pathways
    const allKeyActorsSet = new Set<string>();
    activePathwaysForGuidance.forEach((p) => p.keyActors.forEach((a) => allKeyActorsSet.add(a)));
    const keyActorsList = Array.from(allKeyActorsSet);

    // Source References
    const sourceReferences: PersonalisedBriefing["sectionI_SourceReferences"] = [];
    sourceReferences.push({
      recordType: "Actions Table",
      recordId: targetAction.id,
      title: `Action ${targetAction.actionNumber}: ${targetAction.title}`,
      citation: `CHAMP Toolkit Actions Table (Record ID: ${targetAction.id})`
    });

    for (const p of activePathwaysForGuidance) {
      sourceReferences.push({
        recordType: "Pathways Table",
        recordId: p.id,
        title: p.pathwayTitle,
        citation: `CHAMP Toolkit Pathways Table (Record ID: ${p.id})`
      });
    }

    if (matchedPathways.length === 0) {
      evidenceGaps.push(
        `No Pathway under Action ${targetAction.actionNumber} explicitly lists '${normalizedSelectedLead}' as its Potential National Lead in the repository. General pathways under this Action are provided for context.`
      );
    }

    // Build field-level provenance records for getGuidanceByNationalLead
    const provenanceRecords: any[] = [];
    provenanceRecords.push({
      sourceType: "Parent Action",
      table: "Actions",
      recordId: targetAction.id,
      fieldName: "Title, Description, Systems Logic",
      entityTitle: `Action ${targetAction.actionNumber}: ${targetAction.title}`,
      evidenceLevel: "official_toolkit"
    });

    for (const p of activePathwaysForGuidance) {
      provenanceRecords.push({
        sourceType: "Pathway Definition",
        table: "Pathways",
        recordId: p.id,
        fieldName: "Pathway Title, What it is, Why it is needed",
        entityTitle: p.pathwayTitle,
        evidenceLevel: "official_toolkit"
      });

      const pGuidance = guidance
        .filter((g) => g.belongsToPathwayId === p.id || p.implementationStepIds.includes(g.id))
        .sort((a, b) => a.stepOrder - b.stepOrder);

      for (const g of pGuidance) {
        provenanceRecords.push({
          sourceType: "Official Implementation Guidance",
          table: "Implementation Guidance",
          recordId: g.id,
          fieldName: "Detailed Content",
          stepNumber: g.stepOrder,
          entityTitle: `Step ${g.stepOrder}: ${g.stepTitle}`,
          evidenceLevel: "official_toolkit"
        });
      }

      provenanceRecords.push({
        sourceType: "Transferability Considerations",
        table: "Pathways",
        recordId: p.id,
        fieldName: "Transferability Considerations",
        entityTitle: `${p.pathwayTitle} (Transferability)`,
        evidenceLevel: "official_toolkit"
      });
    }

    for (const kr of linkedKeyResources) {
      provenanceRecords.push({
        sourceType: kr.type,
        table: "Key Resources",
        recordId: kr.id,
        fieldName: "Full Text / Excerpt",
        entityTitle: kr.title,
        verifiedUrl: kr.url,
        evidenceLevel: "documented_peer_example"
      });
      for (const sub of kr.subExamples || []) {
        provenanceRecords.push({
          sourceType: "Sub-Example",
          table: "Sub-Examples",
          recordId: sub.id || sub.title,
          fieldName: "Full Text / Excerpt",
          entityTitle: sub.title,
          verifiedUrl: sub.url,
          evidenceLevel: "documented_peer_example"
        });
      }
    }

    for (const ar of linkedAdditionalResources) {
      provenanceRecords.push({
        sourceType: "Additional Resource",
        table: "Additional Resources",
        recordId: ar.id || ar.title,
        fieldName: "Description",
        entityTitle: ar.title,
        verifiedUrl: ar.link,
        evidenceLevel: "documented_peer_example"
      });
    }

    for (const cb of linkedConceptBoxes) {
      provenanceRecords.push({
        sourceType: "Concept Box",
        table: "Concept & Explainer Boxes",
        recordId: cb.id || cb.title,
        fieldName: "Full Text / Explanation",
        entityTitle: cb.title,
        verifiedUrl: cb.link,
        evidenceLevel: "documented_peer_example"
      });
    }

    if (selectedCountryEvidence) {
      provenanceRecords.push({
        sourceType: "Country Journey",
        table: "Country Journeys",
        recordId: selectedCountryObj.countryId,
        fieldName: "Summary",
        entityTitle: selectedCountryEvidence.countryName,
        evidenceLevel: "documented_country_journey"
      });
      for (const ca of selectedCountryEvidence.actionsInActionNumber) {
        provenanceRecords.push({
          sourceType: "Country Action Experience",
          table: "Country Actions",
          recordId: ca.title,
          fieldName: "Content, Case Study",
          entityTitle: `${selectedCountryEvidence.countryName} – Action ${targetAction.actionNumber}: ${ca.title}`,
          evidenceLevel: "documented_country_journey"
        });
      }
    }

    provenanceRecords.push({
      sourceType: "Scope Notice",
      table: "N/A (Toolkit Scope)",
      recordId: "champ-scope-notice",
      fieldName: "Section F / Source Policy",
      entityTitle: "CHAMP Toolkit Source Grounding Notice",
      evidenceLevel: "assistant_interpretation"
    });

    // Strict Section A Structure
    const sectionA_OfficialGuidance = {
      action: {
        actionNumber: targetAction.actionNumber,
        title: targetAction.title,
        description: targetAction.description,
        systemsLogic: targetAction.systemsLogic,
        recordId: targetAction.id,
        table: "Actions"
      },
      pathways: activePathwaysForGuidance.map((p) => {
        const pGuidance = guidance
          .filter((g) => g.belongsToPathwayId === p.id || p.implementationStepIds.includes(g.id))
          .sort((a, b) => a.stepOrder - b.stepOrder)
          .map((g) => ({
            stepOrder: g.stepOrder,
            stepTitle: g.stepTitle,
            detailedContent: g.detailedContent,
            recordId: g.id,
            table: "Implementation Guidance",
            field: "Detailed Content"
          }));

        return {
          recordId: p.id,
          pathwayTitle: p.pathwayTitle,
          order: p.order,
          overview: p.overview,
          whatItIs: p.whatItIs,
          whyItIsNeeded: p.whyItIsNeeded,
          potentialNationalLead: p.potentialNationalLead,
          keyActors: p.keyActors,
          enablingConditions: p.enablingConditions,
          isDirectNationalLeadMatch: matchedPathways.some((mp) => mp.id === p.id),
          table: "Pathways",
          implementationSteps: pGuidance
        };
      })
    };

    // Strict Section B Structure
    const sectionB_AdaptationTransferability = activePathwaysForGuidance.map((p) => ({
      pathwayTitle: p.pathwayTitle,
      pathwayRecordId: p.id,
      table: "Pathways",
      field: "Transferability Considerations",
      title: p.transferabilityTitle,
      preamble: p.transferabilityPreamble,
      rawText: p.rawTransferabilityText,
      considerations: p.transferability
    }));

    // Strict Section C Structure (Peer Learning Examples)
    const sectionC_PeerLearningExamples = linkedKeyResources
      .filter((kr) => !kr.type.toLowerCase().includes("tool"))
      .map((kr) => ({
        recordId: kr.id,
        pathwayRecordId: kr.pathwayRecordId,
        title: kr.title,
        type: kr.type,
        whySeeThisOrWhenToUseThis: kr.whyOrWhenNote,
        excerpt: kr.excerpt,
        fullText: kr.fullText,
        verifiedUrl: kr.url,
        table: "Key Resources",
        subExamples: (kr.subExamples || []).map((s) => ({
          recordId: s.id || s.title,
          title: s.title,
          excerpt: s.excerpt,
          fullText: s.fullText,
          verifiedUrl: s.url,
          table: "Sub-Examples"
        }))
      }));

    // Strict Section D Structure (Tools and Resources)
    const sectionD_ToolsAndResources = {
      tools: linkedKeyResources
        .filter((kr) => kr.type.toLowerCase().includes("tool"))
        .map((t) => ({
          recordId: t.id,
          pathwayRecordId: t.pathwayRecordId,
          title: t.title,
          whySeeThisOrWhenToUseThis: t.whyOrWhenNote,
          fullText: t.fullText,
          verifiedUrl: t.url,
          table: "Key Resources"
        })),
      additionalResources: linkedAdditionalResources.map((ar) => ({
        recordId: ar.id || ar.title,
        pathwayRecordId: ar.belongsToPathwayId,
        title: ar.title,
        type: ar.type,
        publisher: ar.publisher,
        description: ar.description,
        verifiedLink: ar.link,
        table: "Additional Resources"
      })),
      conceptBoxes: linkedConceptBoxes.map((cb) => ({
        recordId: cb.id || cb.title,
        pathwayRecordId: cb.belongsToPathwayId,
        title: cb.title,
        category: cb.category,
        excerpt: cb.excerpt,
        fullText: cb.fullText,
        verifiedLink: cb.link,
        table: "Concept & Explainer Boxes"
      }))
    };

    // Strict Section E Structure
    const sectionE_CountryJourneyEvidence = {
      requestedCountry: country,
      status: selectedCountryObj ? selectedCountryObj.status : "None requested",
      isPublishedAndReady: selectedCountryObj ? selectedCountryObj.isReady : false,
      evidenceMessage: selectedCountryObj && !selectedCountryObj.isReady
        ? `This is not specified in the available CHAMP Toolkit content. Country '${selectedCountryObj.countryName}' is currently marked as '${selectedCountryObj.status}' in the CHAMP repository. Full deep-dive evidence is not yet published.`
        : undefined,
      evidence: selectedCountryEvidence
        ? {
            countryName: selectedCountryEvidence.countryName,
            recordId: selectedCountryObj.countryId,
            table: "Country Journeys",
            summary: selectedCountryEvidence.summary,
            premises: [],
            contextSections: selectedCountryEvidence.relevantContextSections.map((cs: any) => ({
              title: cs.title,
              content: cs.content,
              recordId: cs.title
            })),
            mappedActions: selectedCountryEvidence.actionsInActionNumber.map((ca: any) => ({
              actionNumber: targetAction!.actionNumber,
              title: ca.title,
              content: ca.content,
              caseStudyTitle: ca.caseStudyTitle,
              caseStudyContent: ca.caseStudyContent,
              recordId: ca.title
            }))
          }
        : null
    };

    // Strict Section F Structure (Source Grounding & Scope Notice)
    const sectionF_Synthesis = {
      label: "CHAMP Toolkit Source Grounding Notice",
      synthesisContent: "The CHAMP Toolkit contains guidance and documented implementation steps organized by pathway. It does not prescribe an implementation roadmap, chronological phases, or workplan deliverables.",
      disclaimer: "All guidance is presented as documented in the CHAMP Airtable knowledge base."
    };

    // Construct the structured briefing (supporting both web UI and strict A-F properties)
    const briefing: PersonalisedBriefing = {
      selectedNationalLead: national_lead,
      normalizedNationalLead: normalizedSelectedLead,
      selectedAction: {
        actionNumber: targetAction.actionNumber,
        title: targetAction.title,
        description: targetAction.description,
        id: targetAction.id
      },
      selectedCountry: selectedCountryObj,

      // Section A
      sectionA_SelectedAction: {
        actionNumber: targetAction.actionNumber,
        title: targetAction.title,
        description: targetAction.description,
        systemsLogic: targetAction.systemsLogic,
        recordId: targetAction.id
      },

      // Section B
      sectionB_RelevantPathways: {
        matchedPathways: matchedPathways.map((p) => ({
          id: p.id,
          title: p.pathwayTitle,
          order: p.order,
          overview: p.overview,
          whatItIs: p.whatItIs,
          whyItIsNeeded: p.whyItIsNeeded,
          potentialNationalLead: p.potentialNationalLead,
          evidenceExplanation: `Airtable 'Pathways' table explicitly designates '${normalizedSelectedLead}' as a Potential National Lead for this pathway (Record ID: ${p.id}).`
        })),
        otherPathwaysInAction: otherPathwaysInAction.map((p) => ({
          id: p.id,
          title: p.pathwayTitle,
          order: p.order,
          potentialNationalLead: p.potentialNationalLead,
          distinctionNote: `General guidance under Action ${targetAction!.actionNumber}. Documented Potential National Leads: ${p.potentialNationalLead.join(", ")}.`
        }))
      },

      // Section C
      sectionC_InstitutionalRole: {
        documentedMandate: `In the CHAMP Toolkit, the ${normalizedSelectedLead} is recognized as an institutional lead under Action ${targetAction.actionNumber}.`,
        keyActorsToCollaborateWith: keyActorsList,
        roleDescription:
          matchedPathways.length > 0
            ? `Based on retrieved repository records, your institution is positioned to lead ${matchedPathways.map((p) => p.pathwayTitle).join("; ")}. This encompasses convening coordination mechanisms, establishing policy frameworks, and facilitating multilevel partnerships.`
            : `While '${normalizedSelectedLead}' is not listed as the primary lead for the pathways under Action ${targetAction.actionNumber}, it plays a critical partner role in cross-governmental coordination and investment alignment.`,
        isExplicitlyDocumented: matchedPathways.length > 0
      },

      // Section D
      sectionD_PracticalImplementationSteps: stepsByPathway,

      // Section E
      sectionE_CoordinationWithOtherActors: {
        leadActor: normalizedSelectedLead,
        keyActors: keyActorsList,
        coordinationSummary: `Effective delivery requires sustained coordination between the ${normalizedSelectedLead} and: ${keyActorsList.join(
          ", "
        )}. These actors are explicitly identified in the repository for mutual implementation and oversight.`
      },

      // Section F
      sectionF_EnablingConditions: activePathwaysForGuidance.map((p) => ({
        pathwayTitle: p.pathwayTitle,
        conditions: p.enablingConditions,
        transferabilityConsiderations: p.transferability
      })),

      // Section G
      sectionG_CountryExperiences: {
        selectedCountryEvidence,
        otherRepositoryExamples
      },

      // Section H
      sectionH_SupportingResources: {
        keyResources: linkedKeyResources,
        additionalResources: linkedAdditionalResources,
        conceptBoxes: linkedConceptBoxes
      },

      // Section I
      sectionI_SourceReferences: sourceReferences,

      // Section J
      sectionJ_EvidenceGaps: evidenceGaps,

      // Strict Source-Grounded A-F Properties
      sectionA_OfficialGuidance,
      sectionB_AdaptationTransferability,
      sectionC_PeerLearningExamples,
      sectionD_ToolsAndResources,
      sectionE_CountryJourneyEvidence,
      sectionF_Synthesis,
      provenanceRecords
    };

    // Render a high-fidelity Markdown Briefing for assistant/user inspection
    const markdownBriefing = this.renderMarkdownBriefing(briefing);
    const validation = validateSourcePreservingContent(markdownBriefing);
    briefing.markdownBriefing = validation.isValid ? markdownBriefing : validation.sanitizedText;

    return {
      success: true,
      briefing,
      markdownBriefing: briefing.markdownBriefing
    };
  }

  // Format source-grounded response organized by Pathway adhering to Authoritative Source Policy
  private renderMarkdownBriefing(b: PersonalisedBriefing): string {
    const lines: string[] = [];

    // Client-facing Usage Instruction (Required Contract Header)
    lines.push(`> ### CHAMP SOURCE-FIDELITY REQUIREMENT`);
    lines.push(`> `);
    lines.push(`> This response contains existing CHAMP Toolkit guidance.`);
    lines.push(`> `);
    lines.push(`> The client may explain and summarise this content, but must not create new implementation guidance or planning structures.`);
    lines.push(`> `);
    lines.push(`> In particular, do not add a suggested workplan, timeline, phases, deliverables, milestones, hypothetical programmes, or new financing mechanisms.`);
    lines.push(`> `);
    lines.push(`> Preserve the Implementation Guidance within each Pathway.`);
    lines.push(`> `);
    lines.push(`> If the user requests a plan not contained in the Toolkit, present the existing Pathway guidance rather than inventing one.`);
    lines.push(`\n---\n`);

    lines.push(`# CHAMP Toolkit Knowledge Guidance`);
    lines.push(`**Potential National Lead:** ${b.normalizedNationalLead}`);
    lines.push(
      `**CHAMP Action Context:** Action ${b.sectionA_SelectedAction.actionNumber}: ${b.sectionA_SelectedAction.title}`
    );
    if (b.selectedCountry) {
      lines.push(`**Country Context:** ${b.selectedCountry.countryName} (${b.selectedCountry.status})`);
    } else {
      lines.push(`**Country Context:** Global Toolkit Evidence (No country specified)`);
    }
    lines.push(
      `**Authoritative Source Policy:** All substantive guidance below is reproduced directly from approved records in the CHAMP Airtable knowledge base. The CHAMP Toolkit provides implementation guidance organized by pathway; it does not prescribe planning sequences, chronological phases, workplan timelines, or deliverables. Steps and transferability considerations are presented pathway-by-pathway as documented.`
    );
    lines.push(`---\n`);

    // Parent Action Context
    lines.push(`## CHAMP Action ${b.sectionA_SelectedAction.actionNumber}: ${b.sectionA_SelectedAction.title}`);
    lines.push(`> "${b.sectionA_SelectedAction.description}"\n`);
    if (b.sectionA_SelectedAction.systemsLogic) {
      lines.push(`**Systems Logic:**\n> "${b.sectionA_SelectedAction.systemsLogic}"\n`);
    }
    lines.push(`---\n`);

    // Pathways - Structured Pathway-by-Pathway
    lines.push(`## Relevant CHAMP Pathways\n`);

    if (b.sectionA_OfficialGuidance?.pathways) {
      for (const p of b.sectionA_OfficialGuidance.pathways) {
        lines.push(`### Pathway: ${p.pathwayTitle}`);
        lines.push(
          `- **National Lead Designation:** ${
            p.isDirectNationalLeadMatch
              ? `Explicit match for **${b.normalizedNationalLead}**`
              : `General Action pathway (Designated leads: ${p.potentialNationalLead.join(", ")})`
          }`
        );
        lines.push(`- **Key Actors:** ${p.keyActors.join(", ") || "Multi-stakeholder"}`);

        // Overview
        lines.push(`\n#### Overview`);
        if (p.overview) {
          lines.push(`${p.overview}\n`);
        } else {
          lines.push(`*This is not specified in the available CHAMP Toolkit content.*\n`);
        }

        // Implementation Guidance
        lines.push(`#### Implementation Guidance`);
        if (!p.implementationSteps || p.implementationSteps.length === 0) {
          lines.push(`*This is not specified in the available CHAMP Toolkit content for this pathway.*\n`);
        } else {
          for (const s of p.implementationSteps) {
            lines.push(`##### Step ${s.stepOrder}: ${s.stepTitle}`);
            lines.push(`> "${s.detailedContent}"\n`);
          }
        }

        // Transferability Considerations
        lines.push(`#### Transferability Considerations`);
        const pTransfer = (b.sectionB_AdaptationTransferability || []).find(
          (tc) => tc.pathwayRecordId === p.recordId || tc.pathwayTitle === p.pathwayTitle
        );
        if (pTransfer && pTransfer.considerations && pTransfer.considerations.length > 0) {
          if (pTransfer.preamble) {
            lines.push(`*${pTransfer.preamble}*`);
          }
          for (const c of pTransfer.considerations) {
            lines.push(`- ${c}`);
          }
          lines.push("");
        } else {
          lines.push(`*This is not specified in the available CHAMP Toolkit content.*\n`);
        }

        // Peer Learning Examples & Tools for this Pathway
        const pExamples = (b.sectionC_PeerLearningExamples || []).filter(
          (ex: any) => ex.pathwayRecordId === p.recordId
        );
        const pTools = (b.sectionD_ToolsAndResources?.tools || []).filter(
          (t: any) => t.pathwayRecordId === p.recordId
        );

        if (pExamples.length > 0) {
          lines.push(`#### Peer Learning Examples`);
          for (const ex of pExamples) {
            lines.push(`- **${ex.title}** (${ex.type})`);
            if (ex.whySeeThisOrWhenToUseThis) lines.push(`  *Context:* ${ex.whySeeThisOrWhenToUseThis}`);
            if (ex.fullText) lines.push(`  > "${ex.fullText}"`);
            else if (ex.excerpt) lines.push(`  > "${ex.excerpt}"`);
            if (ex.verifiedUrl) lines.push(`  *Source Link:* [${ex.verifiedUrl}](${ex.verifiedUrl})`);
          }
          lines.push("");
        }

        if (pTools.length > 0) {
          lines.push(`#### Tools and Resources`);
          for (const t of pTools) {
            lines.push(`- **${t.title}**`);
            if (t.whySeeThisOrWhenToUseThis) lines.push(`  *When to use:* ${t.whySeeThisOrWhenToUseThis}`);
            if (t.fullText) lines.push(`  ${t.fullText}`);
            if (t.verifiedUrl) lines.push(`  *Tool Link:* [${t.verifiedUrl}](${t.verifiedUrl})`);
          }
          lines.push("");
        }

        lines.push(`---\n`);
      }
    }

    // Additional Action-Level Tools and Supporting Resources (only if present)
    const unlinkedExamples = (b.sectionC_PeerLearningExamples || []).filter(
      (ex: any) => !ex.pathwayRecordId
    );
    const unlinkedTools = (b.sectionD_ToolsAndResources?.tools || []).filter(
      (t: any) => !t.pathwayRecordId
    );
    const additionalResources = b.sectionD_ToolsAndResources?.additionalResources || [];
    const conceptBoxes = b.sectionD_ToolsAndResources?.conceptBoxes || [];

    if (
      unlinkedExamples.length > 0 ||
      unlinkedTools.length > 0 ||
      additionalResources.length > 0 ||
      conceptBoxes.length > 0
    ) {
      lines.push(`## Tools and Resources\n`);
      if (unlinkedExamples.length > 0) {
        lines.push(`### Peer Learning Examples:`);
        for (const ex of unlinkedExamples) {
          lines.push(`- **${ex.title}** (${ex.type})`);
          if (ex.whySeeThisOrWhenToUseThis) lines.push(`  *Context:* ${ex.whySeeThisOrWhenToUseThis}`);
          if (ex.verifiedUrl) lines.push(`  *Source Link:* [${ex.verifiedUrl}](${ex.verifiedUrl})`);
        }
        lines.push("");
      }
      if (unlinkedTools.length > 0) {
        lines.push(`### Tools & Technical Instruments:`);
        for (const t of unlinkedTools) {
          lines.push(`- **${t.title}**`);
          if (t.whySeeThisOrWhenToUseThis) lines.push(`  *When to use:* ${t.whySeeThisOrWhenToUseThis}`);
          if (t.verifiedUrl) lines.push(`  *Tool Link:* [${t.verifiedUrl}](${t.verifiedUrl})`);
        }
        lines.push("");
      }
      if (additionalResources.length > 0) {
        lines.push(`### Additional Studies & Guides:`);
        for (const ar of additionalResources) {
          lines.push(`- **${ar.title}**${ar.publisher ? ` (${ar.publisher})` : ""}`);
          if (ar.description) lines.push(`  ${ar.description}`);
          if (ar.verifiedLink) lines.push(`  *Link:* [${ar.verifiedLink}](${ar.verifiedLink})`);
        }
        lines.push("");
      }
      if (conceptBoxes.length > 0) {
        lines.push(`### Concept & Explainer Boxes:`);
        for (const cb of conceptBoxes) {
          lines.push(`- **${cb.title}** (${cb.category || "Core Concept"})`);
          if (cb.fullText) lines.push(`  ${cb.fullText}`);
          else if (cb.excerpt) lines.push(`  ${cb.excerpt}`);
          if (cb.verifiedLink) lines.push(`  *Link:* [${cb.verifiedLink}](${cb.verifiedLink})`);
        }
        lines.push("");
      }
      lines.push(`---\n`);
    }

    // Relevant Country Journey Content (only if present)
    if (b.sectionE_CountryJourneyEvidence?.evidence) {
      const c = b.sectionE_CountryJourneyEvidence.evidence;
      lines.push(`## Relevant Country Journey Content: ${c.countryName} (Status: Available)\n`);
      if (c.summary) lines.push(`${c.summary}\n`);

      if (c.contextSections && c.contextSections.length > 0) {
        for (const cs of c.contextSections) {
          lines.push(`### Context: ${cs.title}`);
          lines.push(`${cs.content}\n`);
        }
      }

      if (c.mappedActions && c.mappedActions.length > 0) {
        lines.push(`### Mapped Action Experiences:`);
        for (const ma of c.mappedActions) {
          lines.push(`#### ${ma.title}`);
          lines.push(`${ma.content}\n`);
          if (ma.caseStudyTitle) {
            lines.push(`**Case Study: ${ma.caseStudyTitle}**`);
            if (ma.caseStudyContent) lines.push(`${ma.caseStudyContent}\n`);
          }
        }
      }
    } else if (b.sectionE_CountryJourneyEvidence?.evidenceMessage) {
      lines.push(`## Relevant Country Journey Content\n`);
      lines.push(`> **Notice:** ${b.sectionE_CountryJourneyEvidence.evidenceMessage}\n`);
    } else if (b.selectedCountry) {
      lines.push(`## Relevant Country Journey Content\n`);
      lines.push(
        `> **Notice:** This is not specified in the available CHAMP Toolkit content. Country '${b.selectedCountry.countryName}' has no published deep-dive evidence in the repository.\n`
      );
    }

    const validation = validateSourcePreservingContent(lines.join("\n"));
    return validation.sanitizedText;
  }
}

export interface ValidationResult {
  isValid: boolean;
  violations: string[];
  sanitizedText: string;
}

/**
 * Validates output text against model-generated planning artifacts (phases, roadmaps, deliverables, timelines).
 * Enforces the core rule: KNOWLEDGE SYNTHESIS IS ALLOWED. IMPLEMENTATION PLAN SYNTHESIS IS NOT ALLOWED.
 */
export function validateSourcePreservingContent(text: string): ValidationResult {
  const violations: string[] = [];

  // Exclude client instruction notice and authoritative policy statement from triggering false positives
  const substantiveText = text
    .replace(/CHAMP SOURCE-FIDELITY REQUIREMENT[\s\S]*?(?=---|# CHAMP Toolkit Knowledge Guidance)/i, "")
    .replace(/Authoritative Source Policy:[\s\S]*?(?=---)/i, "");

  const prohibitedPatterns = [
    { pattern: /(?:^|\n)\s*(?:#+\s*)?Phase\s+[1-4]\b|\bPhase\s+[1-4]\s*[-—:]/i, name: "Phase 1/2/3/4" },
    { pattern: /\b(?:suggested|proposed|recommended|draft|annual|action|new)\s+(?:implementation\s+)?roadmap\b|(?:\n|^)\s*#+\s*.*roadmap/i, name: "Implementation roadmap" },
    { pattern: /(?:^|\n)\s*(?:[-*]\s*)?Deliverables\s*:/i, name: "Deliverables:" },
    { pattern: /\bSynthesized\s+planning\s+sequence\b/i, name: "Synthesized planning sequence" },
    { pattern: /\b(?:suggested|proposed)\s+workplan\b/i, name: "Proposed workplan" },
    { pattern: /\b(?:30|60|90)-day\s+plan\b/i, name: "30/60/90-day plan" },
    { pattern: /\b12-month\s+plan\b/i, name: "12-month plan" },
    { pattern: /\bProposed\s+implementation\s+strategy\b/i, name: "Proposed implementation strategy" }
  ];

  for (const { pattern, name } of prohibitedPatterns) {
    if (pattern.test(substantiveText)) {
      violations.push(name);
    }
  }

  let sanitizedText = text;
  if (violations.length > 0) {
    // Sanitize any model-generated planning blocks
    sanitizedText = sanitizedText
      .replace(
        /\b(?:Suggested\s+(?:[A-Za-z\s]+)?roadmap|Synthesized\s+planning\s+sequence|Proposed\s+workplan)[\s\S]*?(?=\n##|\n#|$)/gi,
        ""
      )
      .trim();
  }

  return {
    isValid: violations.length === 0,
    violations,
    sanitizedText
  };
}

/**
 * Formats a clear, polite refusal and source redirection when a user explicitly requests an implementation roadmap or workplan.
 */
export function formatPlanningRefusalResponse(params: {
  topic?: string;
  lead?: string;
  action_id?: number;
}): string {
  return [
    `# CHAMP Toolkit Source Grounding Notice`,
    ``,
    `The CHAMP Toolkit provides guidance and implementation steps, but does not prescribe planning roadmaps, workplans, multi-stage project phases, milestones, or artificial deliverables.`,
    ``,
    `Instead, the CHAMP Airtable knowledge base provides substantive implementation guidance and transferability considerations organized as distinct, parallel Pathways under each CHAMP Action. Pathways represent documented approaches to adapt locally rather than a prescriptive linear planning sequence.`,
    ``,
    `Implementation steps remain attached to their originating Pathway and are not combined into a cross-pathway implementation sequence.`,
    ``,
    `The relevant CHAMP Pathways and their documented guidance are presented below as reference source material.`
  ].join("\n");
}

export const defaultToolsService = new ChampToolsService();
