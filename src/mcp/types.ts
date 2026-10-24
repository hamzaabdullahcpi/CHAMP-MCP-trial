/**
 * CHAMP MCP Knowledge Assistant - Type Definitions
 * Strictly mapped to verified Airtable schema and MCP Tool Specifications.
 */

export interface ChampActionRecord {
  id: string; // Airtable Record ID (e.g. recQ8Zb1myageh9SH)
  actionNumber: number; // 1 to 5
  title: string;
  shortTitle?: string;
  description: string;
  systemsLogic?: string;
  themeColor?: string;
  pathwayIds: string[];
}

export interface ChampPathwayRecord {
  id: string; // Airtable Record ID (e.g. recWGEx5x7YpvT9ZP)
  pathwayTitle: string;
  belongsToActionId?: string;
  actionNumber?: number;
  order: number;
  overview?: string; // Authoritative explanatory field consolidating pathway concepts
  whatItIs?: string; // Deprecated / empty in Airtable; consolidated into overview
  whyItIsNeeded?: string; // Deprecated / empty in Airtable; consolidated into overview
  potentialNationalLead: string[];
  keyActors: string[];
  rawTransferabilityText?: string;
  transferabilityTitle?: string;
  transferabilityPreamble?: string;
  transferability: string[];
  enablingConditions?: string[]; // Deprecated - not a substantive category in Airtable
  implementationStepIds: string[];
  exampleIds: string[];
  resourceIds: string[];
  conceptBoxIds: string[];
}

export interface ChampGuidanceStepRecord {
  id: string;
  stepTitle: string;
  detailedContent: string;
  stepOrder: number;
  belongsToPathwayId?: string;
}

export interface ChampKeyResourceRecord {
  id: string;
  exampleTitle: string;
  type: "Illustrative Example" | "Tool" | "Peer Learning Example" | string;
  whySeeThisOrWhenToUseThis?: string;
  excerpt?: string;
  fullText?: string;
  learnMoreUrl?: string;
  order?: number;
  belongsToPathwayId?: string;
  subExampleIds?: string[];
}

export interface ChampSubExampleRecord {
  id: string;
  subExampleTitle: string;
  belongsToParentExampleId?: string;
  excerpt?: string;
  fullText?: string;
  learnMoreUrl?: string;
}

export interface ChampAdditionalResourceRecord {
  id: string;
  resourceTitle: string;
  resourceType?: string;
  publisherOrOrganization?: string;
  description?: string;
  resourceLink?: string;
  order?: number;
  belongsToPathwayId?: string;
}

export interface ChampConceptBoxRecord {
  id: string;
  boxTitle: string;
  category?: string;
  placement?: string;
  excerpt?: string;
  fullText?: string;
  learnMoreUrl?: string;
  order?: number;
  belongsToPathwayId?: string;
}

export interface ChampCountryJourneyRecord {
  id: string;
  countryId: string; // slug e.g. "sweden", "brazil"
  countryName: string;
  flagEmoji?: string;
  status: "Available" | "Coming Soon" | string;
  isReady: boolean;
  published: boolean;
  tagline?: string;
  summary?: string;
  keyMechanisms?: string[];
  cardImageUrl?: string;
  themeColor?: string;
  headerTitle?: string;
  headerSubtitle?: string;
  headerDescription?: string;
  tabATitle?: string;
  tabASubtitle?: string;
  premisesHeading?: string;
  premisesIntro?: string;
  tabBTitle?: string;
  tabBSubtitle?: string;
  modelHeading?: string;
  modelOverview?: string;
  modelDiagramNote?: string;
  diagramImageUrl?: string;
  diagramImageAlt?: string;
  actionsHeading?: string;
  actionsSubtitle?: string;
  order?: number;
}

export interface ChampCountrySectionRecord {
  id: string;
  title: string;
  belongsToCountry: string;
  sectionType: "Context Section" | "Central Premise" | string;
  order: number;
  content: string;
  bulletPoints?: string[];
}

export interface ChampCountryActionRecord {
  id: string;
  title: string;
  actionNumber: number;
  belongsToCountry: string;
  actionThemeTag?: string;
  content: string;
  caseStudyTitle?: string;
  caseStudyContent?: string;
  enabledAndOpportunity?: string;
}

export interface NationalLeadSummary {
  nationalLead: string;
  normalizedDisplayName: string;
  associatedPathwaysCount: number;
  linkedPathwayIds: string[];
  linkedPathways: {
    id: string;
    order: number;
    title: string;
    actionNumber?: number;
  }[];
}

export interface PersonalisedBriefing {
  selectedNationalLead: string;
  normalizedNationalLead: string;
  selectedAction: {
    actionNumber: number;
    title: string;
    description: string;
    id: string;
  };
  selectedCountry?: {
    countryId: string;
    countryName: string;
    status: string;
    isReady: boolean;
  } | null;

  // 10 Briefing Sections (A - J)
  sectionA_SelectedAction: {
    actionNumber: number;
    title: string;
    description: string;
    systemsLogic?: string;
    recordId: string;
  };
  sectionB_RelevantPathways: {
    matchedPathways: {
      id: string;
      title: string;
      order: number;
      overview?: string;
      whatItIs?: string;
      whyItIsNeeded?: string;
      potentialNationalLead: string[];
      evidenceExplanation: string;
    }[];
    otherPathwaysInAction: {
      id: string;
      title: string;
      order: number;
      potentialNationalLead: string[];
      distinctionNote: string;
    }[];
  };
  sectionC_InstitutionalRole: {
    documentedMandate: string;
    keyActorsToCollaborateWith: string[];
    roleDescription: string;
    isExplicitlyDocumented: boolean;
  };
  sectionD_PracticalImplementationSteps: {
    pathwayTitle: string;
    steps: {
      stepOrder: number;
      stepTitle: string;
      detailedContent: string;
      recordId: string;
    }[];
  }[];
  sectionE_CoordinationWithOtherActors: {
    leadActor: string;
    keyActors: string[];
    coordinationSummary: string;
  };
  sectionF_EnablingConditions: {
    pathwayTitle: string;
    conditions: string[];
    transferabilityConsiderations: string[];
  }[];
  sectionG_CountryExperiences: {
    selectedCountryEvidence?: {
      countryName: string;
      status: string;
      summary?: string;
      actionsInActionNumber: {
        title: string;
        content: string;
        caseStudyTitle?: string;
        caseStudyContent?: string;
        enabledAndOpportunity?: string;
      }[];
      relevantContextSections: {
        title: string;
        content: string;
      }[];
    } | null;
    otherRepositoryExamples: {
      countryOrInitiative: string;
      pathwayTitle: string;
      exampleTitle: string;
      type: string;
      excerpt?: string;
      fullText?: string;
      connectionLine?: string;
      learnMoreUrl?: string;
    }[];
  };
  sectionH_SupportingResources: {
    keyResources: {
      title: string;
      type: string;
      whyOrWhenNote?: string;
      excerpt?: string;
      fullText?: string;
      url?: string;
      subExamples?: {
        title: string;
        excerpt?: string;
        fullText?: string;
        url?: string;
      }[];
    }[];
    additionalResources: {
      title: string;
      type?: string;
      publisher?: string;
      description?: string;
      link?: string;
    }[];
    conceptBoxes: {
      title: string;
      category?: string;
      excerpt?: string;
      fullText?: string;
      link?: string;
    }[];
  };
  sectionI_SourceReferences: {
    recordType: string;
    recordId: string;
    title: string;
    url?: string;
    citation: string;
  }[];
  sectionJ_EvidenceGaps: string[];

  // Strict Source-Grounded A-F Presentation Structures
  sectionA_OfficialGuidance?: {
    action: {
      actionNumber: number;
      title: string;
      description: string;
      systemsLogic?: string;
      recordId: string;
      table: string;
    };
    pathways: {
      recordId: string;
      pathwayTitle: string;
      order: number;
      overview?: string;
      whatItIs?: string;
      whyItIsNeeded?: string;
      potentialNationalLead: string[];
      keyActors: string[];
      enablingConditions?: string[];
      isDirectNationalLeadMatch: boolean;
      table: string;
      implementationSteps: {
        stepOrder: number;
        stepTitle: string;
        detailedContent: string;
        recordId: string;
        table: string;
        field: string;
      }[];
    }[];
  };
  sectionB_AdaptationTransferability?: {
    pathwayTitle: string;
    pathwayRecordId: string;
    table: string;
    field: string;
    title?: string;
    preamble?: string;
    rawText?: string;
    considerations: string[];
  }[];
  sectionC_PeerLearningExamples?: {
    recordId: string;
    pathwayRecordId?: string;
    title: string;
    type: string;
    whySeeThisOrWhenToUseThis?: string;
    excerpt?: string;
    fullText?: string;
    verifiedUrl?: string;
    table: string;
    subExamples?: {
      recordId: string;
      title: string;
      excerpt?: string;
      fullText?: string;
      verifiedUrl?: string;
      table: string;
    }[];
  }[];
  sectionD_ToolsAndResources?: {
    tools: {
      recordId: string;
      pathwayRecordId?: string;
      title: string;
      whySeeThisOrWhenToUseThis?: string;
      fullText?: string;
      verifiedUrl?: string;
      table: string;
    }[];
    additionalResources: {
      recordId: string;
      title: string;
      type?: string;
      publisher?: string;
      description?: string;
      verifiedLink?: string;
      table: string;
    }[];
    conceptBoxes: {
      recordId: string;
      title: string;
      category?: string;
      excerpt?: string;
      fullText?: string;
      verifiedLink?: string;
      table: string;
    }[];
  };
  sectionE_CountryJourneyEvidence?: {
    requestedCountry?: string;
    status: string;
    isPublishedAndReady: boolean;
    evidenceMessage?: string;
    evidence?: {
      countryName: string;
      recordId: string;
      table: string;
      summary?: string;
      premises: { order: number; title: string; content: string; recordId: string }[];
      contextSections: { title: string; content: string; recordId: string }[];
      mappedActions: {
        actionNumber: number;
        title: string;
        content: string;
        caseStudyTitle?: string;
        caseStudyContent?: string;
        recordId: string;
      }[];
    } | null;
  };
  sectionF_Synthesis?: any;
  provenanceRecords?: FieldProvenance[];
  markdownBriefing?: string;
}

export type EvidenceLevel =
  | "official_toolkit"
  | "documented_peer_example"
  | "documented_country_journey"
  | "assistant_interpretation";

export interface FieldProvenance {
  sourceType: string;
  table: string;
  recordId: string;
  fieldName: string;
  entityTitle: string;
  evidenceLevel: EvidenceLevel;
  stepNumber?: number;
  verifiedUrl?: string;
}

