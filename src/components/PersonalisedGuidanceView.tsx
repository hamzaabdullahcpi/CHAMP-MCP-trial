import { useState, useEffect } from "react";
import { 
  Sparkles, 
  ChevronRight, 
  Building2, 
  Globe2, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  Users, 
  FileText, 
  ExternalLink, 
  Copy, 
  Check, 
  RefreshCw,
  SlidersHorizontal,
  ArrowLeft,
  Bot,
  HelpCircle,
  ShieldCheck,
  MessageSquare,
  Terminal
} from "lucide-react";
import { Action } from "../services/airtableService";
import { CountryJourneyData } from "../types/countryJourney";
import { getActionTheme } from "../utils/actionThemes";
import { PersonalisedBriefing } from "../mcp/types";

interface PersonalisedGuidanceViewProps {
  actionsData: Action[];
  countryJourneys: CountryJourneyData[];
  onNavigateToAction?: (actionId: number) => void;
  onNavigateToCountry?: (countryId: string) => void;
  onBack?: () => void;
}

export default function PersonalisedGuidanceView({
  actionsData,
  countryJourneys,
  onNavigateToAction,
  onNavigateToCountry,
  onBack
}: PersonalisedGuidanceViewProps) {
  // Step 1: National Lead
  const [selectedLead, setSelectedLead] = useState<string>("");
  const [availableLeads, setAvailableLeads] = useState<string[]>([]);
  
  // Step 2: Country (Optional)
  const [selectedCountry, setSelectedCountry] = useState<string>("");

  // Step 3: CHAMP Action / Implementation Priority (1 to 5)
  const [selectedActionId, setSelectedActionId] = useState<number>(1);

  // Briefing state
  const [isGenerating, setIsGenerating] = useState(false);
  const [briefing, setBriefing] = useState<PersonalisedBriefing | null>(null);
  const [activeMainTab, setActiveMainTab] = useState<"ai-connect" | "in-browser">("ai-connect");
  const [selectedPlatform, setSelectedPlatform] = useState<"chatgpt" | "claude">("chatgpt");
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedClaudeConfig, setCopiedClaudeConfig] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedQuestion, setCopiedQuestion] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Extract unique Potential National Leads dynamically from live pathways
  useEffect(() => {
    // 1. Try to fetch from /api/guidance/leads
    fetch("/api/guidance/leads")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.leads && Array.isArray(data.leads) && data.leads.length > 0) {
          const names = data.leads.map((l: any) => l.normalizedDisplayName || l.nationalLead);
          setAvailableLeads(names);
          if (!selectedLead && names.length > 0) {
            setSelectedLead(names[0]);
          }
          return;
        }
        throw new Error("API not available, fallback to actionsData");
      })
      .catch(() => {
        // Fallback: extract from actionsData prop
        const leadsSet = new Set<string>();
        for (const a of actionsData) {
          for (const p of a.pathways || []) {
            if (p.potentialNationalLead && Array.isArray(p.potentialNationalLead)) {
              p.potentialNationalLead.forEach((l) => leadsSet.add(l.trim()));
            }
          }
        }
        const fallbackList = Array.from(leadsSet).sort();
        setAvailableLeads(fallbackList);
        if (!selectedLead && fallbackList.length > 0) {
          setSelectedLead(fallbackList[0]);
        }
      });
  }, [actionsData]);

  // Published countries for Step 2
  const publishedCountries = countryJourneys.filter(
    (c) => c.published !== false && (c.isReady || c.status === "Available")
  );

  // Only the 5 official CHAMP Actions
  const officialActions = [...actionsData]
    .filter((a) => a.id >= 1 && a.id <= 5)
    .sort((a, b) => a.id - b.id);

  // Generate Briefing Handler
  const handleGenerate = async () => {
    if (!selectedLead) return;
    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/guidance/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          national_lead: selectedLead,
          action_id: selectedActionId,
          country: selectedCountry || undefined,
          include_country_examples: true
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.briefing) {
          setBriefing(data.briefing);
          setActiveMainTab("in-browser");
          return;
        }
      }

      // If backend call failed or endpoint not reachable, build from local client data
      buildLocalBriefingFallback();
    } catch (err: any) {
      console.warn("Generating guidance using local data fallback:", err);
      buildLocalBriefingFallback();
    } finally {
      setIsGenerating(false);
    }
  };

  const buildLocalBriefingFallback = () => {
    const act = officialActions.find((a) => a.id === selectedActionId) || officialActions[0];
    const actPathways = act.pathways || [];

    const matchedPathways = actPathways.filter((p) =>
      (p.potentialNationalLead || []).some(
        (l) => l.toLowerCase().trim() === selectedLead.toLowerCase().trim()
      )
    );
    const otherPathways = actPathways.filter(
      (p) =>
        !(p.potentialNationalLead || []).some(
          (l) => l.toLowerCase().trim() === selectedLead.toLowerCase().trim()
        )
    );

    const activePathways = matchedPathways.length > 0 ? matchedPathways : actPathways;
    const allKeyActors = new Set<string>();
    activePathways.forEach((p) => (p.keyActors || []).forEach((k) => allKeyActors.add(k)));

    const stepsByPathway = activePathways.map((p) => ({
      pathwayTitle: p.title,
      steps: (p.implementationGuidance || []).map((g, idx) => ({
        stepOrder: idx + 1,
        stepTitle: g.title,
        detailedContent: g.content,
        recordId: `step-${idx + 1}`
      }))
    }));

    const keyRes = activePathways.flatMap((p) =>
      (p.illustrativeExamples || []).map((e) => ({
        title: e.title,
        type: e.type || "Illustrative Example",
        whyOrWhenNote: e.connectionLine,
        excerpt: e.excerpt,
        fullText: e.fullText,
        url: e.link
      }))
    );

    const countryObj = selectedCountry
      ? countryJourneys.find((c) => c.countryId === selectedCountry.toLowerCase())
      : null;

    setBriefing({
      selectedNationalLead: selectedLead,
      normalizedNationalLead: selectedLead,
      selectedAction: {
        actionNumber: act.id,
        title: act.title,
        description: act.description,
        id: `act-${act.id}`
      },
      selectedCountry: countryObj
        ? {
            countryId: countryObj.countryId,
            countryName: countryObj.countryName,
            status: countryObj.status || "Available",
            isReady: countryObj.isReady
          }
        : null,
      sectionA_SelectedAction: {
        actionNumber: act.id,
        title: act.title,
        description: act.description,
        systemsLogic: act.systemsLogic,
        recordId: `act-${act.id}`
      },
      sectionB_RelevantPathways: {
        matchedPathways: matchedPathways.map((p, idx) => ({
          id: `p-${idx}`,
          title: p.title,
          order: idx + 1,
          overview: p.overview,
          whatItIs: p.whatItIs,
          whyItIsNeeded: p.whyItIsNeeded,
          potentialNationalLead: p.potentialNationalLead || [],
          evidenceExplanation: `Pathways table designates ${selectedLead} as a Potential National Lead.`
        })),
        otherPathwaysInAction: otherPathways.map((p, idx) => ({
          id: `op-${idx}`,
          title: p.title,
          order: idx + 1,
          potentialNationalLead: p.potentialNationalLead || [],
          distinctionNote: `General guidance under Action ${act.id}. Leads: ${(p.potentialNationalLead || []).join(", ")}`
        }))
      },
      sectionC_InstitutionalRole: {
        documentedMandate: `The ${selectedLead} is recognized as an institutional lead under Action ${act.id}.`,
        keyActorsToCollaborateWith: Array.from(allKeyActors),
        roleDescription:
          matchedPathways.length > 0
            ? `Based on CHAMP records, your institution leads ${matchedPathways.map((p) => p.title).join("; ")}.`
            : `General coordination and support role across Action ${act.id} pathways.`,
        isExplicitlyDocumented: matchedPathways.length > 0
      },
      sectionD_PracticalImplementationSteps: stepsByPathway,
      sectionE_CoordinationWithOtherActors: {
        leadActor: selectedLead,
        keyActors: Array.from(allKeyActors),
        coordinationSummary: `Requires coordination between ${selectedLead} and: ${Array.from(allKeyActors).join(", ")}.`
      },
      sectionF_EnablingConditions: activePathways.map((p) => ({
        pathwayTitle: p.title,
        conditions: p.enablingConditions || [],
        transferabilityConsiderations: p.transferability || []
      })),
      sectionG_CountryExperiences: {
        selectedCountryEvidence: countryObj
          ? {
              countryName: countryObj.countryName,
              status: countryObj.status || "Available",
              summary: countryObj.summary,
              actionsInActionNumber: (countryObj.actions || [])
                .filter((ca) => ca.actionNumber === act.id)
                .map((ca) => ({
                  title: ca.title,
                  content: ca.paragraphs?.join("\n\n") || "",
                  caseStudyTitle: ca.caseStudy?.title,
                  caseStudyContent: ca.caseStudy?.paragraphs?.join("\n\n"),
                  enabledAndOpportunity: ca.enabledSummary
                })),
              relevantContextSections: (countryObj.contextSections || []).slice(0, 2).map((cs) => ({
                title: cs.title,
                content: cs.paragraphs?.join("\n\n") || ""
              }))
            }
          : null,
        otherRepositoryExamples: keyRes.map((kr) => ({
          countryOrInitiative: kr.title.split("–")[0].trim(),
          pathwayTitle: "Core Toolkit Example",
          exampleTitle: kr.title,
          type: kr.type,
          excerpt: kr.excerpt,
          fullText: kr.fullText,
          connectionLine: kr.whyOrWhenNote,
          learnMoreUrl: kr.url
        }))
      },
      sectionH_SupportingResources: {
        keyResources: keyRes,
        additionalResources: [],
        conceptBoxes: []
      },
      sectionI_SourceReferences: [
        {
          recordType: "Actions Table",
          recordId: `Action ${act.id}`,
          title: act.title,
          citation: `CHAMP Actions Table`
        }
      ],
      sectionJ_EvidenceGaps:
        matchedPathways.length === 0
          ? [`No Pathway under Action ${act.id} explicitly designates '${selectedLead}' as primary lead.`]
          : []
    });
  };

  const currentTheme = getActionTheme(selectedActionId);

  const serverUrl = "https://champ-mcp-knowledge-server.onrender.com/mcp";

  const claudeConfigSnippet = JSON.stringify({
    mcpServers: {
      champ: {
        command: "npx",
        args: ["-y", "mcp-remote", "https://champ-mcp-knowledge-server.onrender.com/mcp"]
      }
    }
  }, null, 2);

  const copyToClipboard = (text: string, setter: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const copyQuestionToClipboard = (question: string) => {
    navigator.clipboard.writeText(question);
    setCopiedQuestion(question);
    setTimeout(() => setCopiedQuestion(null), 2000);
  };

  const copyPromptForChatGPT = () => {
    const promptText = `# System Instructions: CHAMP Knowledge Assistant

You are the CHAMP Knowledge Assistant, grounded exclusively in the CHAMP Toolkit for Multilevel Climate Governance and Finance.

## Mandatory Answering Rules:
1. Answer substantive questions ONLY using retrieved evidence from the CHAMP MCP server tools.
2. NEVER use general model training knowledge as an alternative source of climate governance facts.
3. NEVER use external web browsing to fill gaps.
4. If the repository does not contain sufficient evidence, state verbatim:
   "I couldn't find sufficient information in the CHAMP knowledge repository to answer that question."
5. For personalised implementation guidance:
   - Identify the user's Potential National Lead.
   - Ground priorities strictly in one of the 5 official CHAMP Actions (Action 1 to Action 5).
   - Call the 'get_guidance_by_national_lead' MCP tool.
   - Present the 10-section briefing (A through J).
   - Accurately cite Airtable record IDs and links.
   - Never invent mandates, actions, or country achievements.`;

    copyToClipboard(promptText, setCopiedPrompt);
  };

  const sampleQuestions = [
    {
      category: "5 Core Actions",
      query: "What are the 5 official CHAMP actions and their key implementation pathways?"
    },
    {
      category: "National Lead Guidance",
      query: "What implementation priorities does CHAMP recommend for the Ministry of Environment under Action 1?"
    },
    {
      category: "Country Models",
      query: "Summarize the multilevel climate governance models and practices from Japan, France, and Brazil."
    },
    {
      category: "Subnational Finance",
      query: "What enabling conditions and finance mechanisms are highlighted in CHAMP for subnational climate action?"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-line mb-8">
        <div>
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink uppercase tracking-wider mb-2 cursor-pointer transition-colors"
            >
              <ArrowLeft size={14} /> Back to Overview
            </button>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-accent/10 text-accent border border-accent/20">
              CHAMP AI Assistant
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Server Ready & Operational
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-ink mt-2 tracking-tight">
            Connect to ChatGPT or Claude
          </h1>
          <p className="text-sm sm:text-base text-ink-muted mt-1 max-w-2xl">
            Give your AI assistant direct access to the official CHAMP Toolkit. Ask questions, compare country practices, and get verified climate governance advice without writing code.
          </p>
        </div>

        {/* View Switcher: AI Assistant vs In-Browser Generator */}
        <div className="flex items-center bg-paper p-1 border border-line shrink-0">
          <button
            onClick={() => setActiveMainTab("ai-connect")}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeMainTab === "ai-connect"
                ? "bg-surface text-ink shadow-xs border border-line font-bold"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            <Sparkles size={13} className="text-accent" />
            AI Assistant
          </button>
          <button
            onClick={() => setActiveMainTab("in-browser")}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              activeMainTab === "in-browser"
                ? "bg-surface text-ink shadow-xs border border-line font-bold"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            In-Browser Briefing
          </button>
        </div>
      </div>

      {activeMainTab === "ai-connect" ? (
        <div className="space-y-8">
          {/* Platform Selector Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedPlatform("chatgpt")}
              className={`p-5 text-left border transition-all cursor-pointer flex items-start gap-4 ${
                selectedPlatform === "chatgpt"
                  ? "bg-surface border-accent shadow-xs ring-1 ring-accent"
                  : "bg-paper border-line hover:border-ink-muted/50"
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <Bot size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-lg text-ink">ChatGPT</span>
                  <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800">
                    1-Click OAuth
                  </span>
                </div>
                <p className="text-xs text-ink-muted mt-1">
                  Connect via ChatGPT Connected Apps. Just paste the URL and click Approve.
                </p>
              </div>
            </button>

            <button
              onClick={() => setSelectedPlatform("claude")}
              className={`p-5 text-left border transition-all cursor-pointer flex items-start gap-4 ${
                selectedPlatform === "claude"
                  ? "bg-surface border-accent shadow-xs ring-1 ring-accent"
                  : "bg-paper border-line hover:border-ink-muted/50"
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                <Terminal size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-lg text-ink">Claude</span>
                  <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-amber-100 text-amber-900">
                    Desktop & Web
                  </span>
                </div>
                <p className="text-xs text-ink-muted mt-1">
                  Connect via Claude Desktop configuration or remote MCP connector.
                </p>
              </div>
            </button>
          </div>

          {/* Platform Specific Guidance */}
          {selectedPlatform === "chatgpt" ? (
            <div className="bg-surface border border-line p-6 sm:p-8 space-y-8">
              {/* The Concise Info Box */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-accent block mb-1">
                  Step 1 • The Only Link You Need
                </span>
                <h3 className="text-xl font-display font-bold text-ink">
                  CHAMP Server URL
                </h3>
                <p className="text-xs text-ink-muted mt-1">
                  Copy this link. This is the only address you need to paste into ChatGPT.
                </p>

                <div className="mt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="flex-1 p-3 bg-paper border border-line font-mono text-xs sm:text-sm text-ink break-all select-all">
                    {serverUrl}
                  </div>
                  <button
                    onClick={() => copyToClipboard(serverUrl, setCopiedUrl)}
                    className="px-5 py-3 bg-accent text-surface text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                  >
                    {copiedUrl ? <Check size={16} /> : <Copy size={16} />}
                    {copiedUrl ? "Link Copied!" : "Copy URL"}
                  </button>
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-ink-muted">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Authentication setting in ChatGPT: Select <strong>OAuth</strong> (handles sign-in automatically).</span>
                </div>
              </div>

              {/* 3 Step Guide for Non-Developers */}
              <div className="border-t border-line pt-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-ink mb-4">
                  How to Connect in 3 Simple Steps
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-paper border border-line flex flex-col justify-between">
                    <div>
                      <div className="w-7 h-7 rounded-full bg-accent text-surface text-xs font-bold flex items-center justify-center mb-3">
                        1
                      </div>
                      <h4 className="font-bold text-sm text-ink mb-1">Open Settings</h4>
                      <p className="text-xs text-ink-muted leading-relaxed">
                        In ChatGPT, click your profile name at the bottom-left, click <strong>Settings</strong>, then select <strong>Connected Apps</strong> (or Workspaces).
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-paper border border-line flex flex-col justify-between">
                    <div>
                      <div className="w-7 h-7 rounded-full bg-accent text-surface text-xs font-bold flex items-center justify-center mb-3">
                        2
                      </div>
                      <h4 className="font-bold text-sm text-ink mb-1">Add CHAMP Server</h4>
                      <p className="text-xs text-ink-muted leading-relaxed">
                        Click <strong>Add New App</strong>, paste the copied link, and choose <strong>OAuth</strong> as the authentication type. Click <strong>Connect</strong> and then <strong>Approve</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-paper border border-line flex flex-col justify-between">
                    <div>
                      <div className="w-7 h-7 rounded-full bg-accent text-surface text-xs font-bold flex items-center justify-center mb-3">
                        3
                      </div>
                      <h4 className="font-bold text-sm text-ink mb-1">Start Chatting</h4>
                      <p className="text-xs text-ink-muted leading-relaxed">
                        You're all set! Open any new conversation. ChatGPT will now automatically consult the CHAMP Toolkit to answer your questions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sample Questions to Try */}
              <div className="border-t border-line pt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-ink">
                    Try Asking ChatGPT These Questions
                  </h3>
                  <span className="text-xs text-ink-muted">Click to copy prompt</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {sampleQuestions.map((q, idx) => {
                    const isCopied = copiedQuestion === q.query;
                    return (
                      <button
                        key={idx}
                        onClick={() => copyQuestionToClipboard(q.query)}
                        className="p-3.5 bg-paper border border-line hover:border-accent text-left transition-colors cursor-pointer group flex items-start justify-between gap-3"
                      >
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-accent block mb-1">
                            {q.category}
                          </span>
                          <p className="text-xs font-medium text-ink group-hover:text-accent transition-colors">
                            "{q.query}"
                          </p>
                        </div>
                        <span className="shrink-0 text-ink-muted group-hover:text-accent">
                          {isCopied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Optional Custom Instructions */}
              <div className="border-t border-line pt-6">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-ink">
                      Optional: Custom Instructions for ChatGPT
                    </h4>
                    <p className="text-xs text-ink-muted">
                      Paste this into ChatGPT's "Custom Instructions" if you want to strictly prevent outside web browsing.
                    </p>
                  </div>
                  <button
                    onClick={copyPromptForChatGPT}
                    className="px-2.5 py-1 text-xs font-semibold bg-paper border border-line hover:border-accent text-ink transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    {copiedPrompt ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                    {copiedPrompt ? "Copied!" : "Copy Instructions"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Claude Guidance */
            <div className="bg-surface border border-line p-6 sm:p-8 space-y-8">
              {/* Claude Desktop Snippet */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-accent block mb-1">
                  For Claude Desktop (Mac / Windows)
                </span>
                <h3 className="text-xl font-display font-bold text-ink">
                  Claude Configuration Snippet
                </h3>
                <p className="text-xs text-ink-muted mt-1">
                  Add this block to your Claude Desktop config file to automatically enable the CHAMP Toolkit.
                </p>

                <div className="mt-3 relative">
                  <pre className="p-4 bg-paper border border-line font-mono text-xs text-ink overflow-x-auto whitespace-pre">
{claudeConfigSnippet}
                  </pre>
                  <button
                    onClick={() => copyToClipboard(claudeConfigSnippet, setCopiedClaudeConfig)}
                    className="absolute top-3 right-3 px-3 py-1.5 bg-accent text-surface text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    {copiedClaudeConfig ? <Check size={14} /> : <Copy size={14} />}
                    {copiedClaudeConfig ? "Config Copied!" : "Copy Configuration"}
                  </button>
                </div>

                <div className="mt-3 p-3 bg-paper border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="text-xs text-ink-muted">
                    <span>Using Claude Web with Remote MCP? Use this endpoint: </span>
                    <strong className="text-ink font-mono">{serverUrl}</strong>
                  </div>
                  <button
                    onClick={() => copyToClipboard(serverUrl, setCopiedUrl)}
                    className="text-xs font-bold text-accent hover:underline cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    {copiedUrl ? "Copied!" : "Copy Link"}
                  </button>
                </div>
              </div>

              {/* 3 Step Guide for Claude Desktop */}
              <div className="border-t border-line pt-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-ink mb-4">
                  How to Set Up in Claude Desktop (3 Steps)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-paper border border-line flex flex-col justify-between">
                    <div>
                      <div className="w-7 h-7 rounded-full bg-accent text-surface text-xs font-bold flex items-center justify-center mb-3">
                        1
                      </div>
                      <h4 className="font-bold text-sm text-ink mb-1">Open Settings</h4>
                      <p className="text-xs text-ink-muted leading-relaxed">
                        In Claude Desktop, click <strong>Claude</strong> in the menu bar, open <strong>Settings</strong>, and click the <strong>Developer</strong> tab.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-paper border border-line flex flex-col justify-between">
                    <div>
                      <div className="w-7 h-7 rounded-full bg-accent text-surface text-xs font-bold flex items-center justify-center mb-3">
                        2
                      </div>
                      <h4 className="font-bold text-sm text-ink mb-1">Edit Configuration</h4>
                      <p className="text-xs text-ink-muted leading-relaxed">
                        Click <strong>Edit Config</strong> to open <code className="text-[11px] bg-paper px-1 py-0.5 border border-line">claude_desktop_config.json</code>. Paste the configuration block above, then save.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-paper border border-line flex flex-col justify-between">
                    <div>
                      <div className="w-7 h-7 rounded-full bg-accent text-surface text-xs font-bold flex items-center justify-center mb-3">
                        3
                      </div>
                      <h4 className="font-bold text-sm text-ink mb-1">Restart Claude</h4>
                      <p className="text-xs text-ink-muted leading-relaxed">
                        Restart Claude Desktop. You will see a small hammer icon in your chat bar indicating the CHAMP Toolkit is ready!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sample Questions to Try */}
              <div className="border-t border-line pt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-ink">
                    Try Asking Claude These Questions
                  </h3>
                  <span className="text-xs text-ink-muted">Click to copy prompt</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {sampleQuestions.map((q, idx) => {
                    const isCopied = copiedQuestion === q.query;
                    return (
                      <button
                        key={idx}
                        onClick={() => copyQuestionToClipboard(q.query)}
                        className="p-3.5 bg-paper border border-line hover:border-accent text-left transition-colors cursor-pointer group flex items-start justify-between gap-3"
                      >
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-accent block mb-1">
                            {q.category}
                          </span>
                          <p className="text-xs font-medium text-ink group-hover:text-accent transition-colors">
                            "{q.query}"
                          </p>
                        </div>
                        <span className="shrink-0 text-ink-muted group-hover:text-accent">
                          {isCopied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Non-Developer Assurance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-surface border border-line">
              <div className="flex items-center gap-2 mb-2 text-ink">
                <ShieldCheck size={18} className="text-emerald-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider">No Coding Needed</h4>
              </div>
              <p className="text-xs text-ink-muted leading-relaxed">
                Connect in under a minute by simply copying and pasting the link. No programming or terminal knowledge required.
              </p>
            </div>

            <div className="p-4 bg-surface border border-line">
              <div className="flex items-center gap-2 mb-2 text-ink">
                <BookOpen size={18} className="text-accent" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Official CHAMP Evidence</h4>
              </div>
              <p className="text-xs text-ink-muted leading-relaxed">
                Answers are grounded directly in the verified CHAMP Airtable repository, preventing AI hallucinations.
              </p>
            </div>

            <div className="p-4 bg-surface border border-line">
              <div className="flex items-center gap-2 mb-2 text-ink">
                <Globe2 size={18} className="text-amber-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Secure & Read-Only</h4>
              </div>
              <p className="text-xs text-ink-muted leading-relaxed">
                The AI assistant can only read published toolkit guidance and country case studies. It cannot modify any data.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* In-Browser Briefing Builder (Existing Guided Selection Experience) */
        /* Guided Selection Experience */
        <div className="space-y-8">
          {/* Step Selector Card */}
          <div className="bg-surface border border-line p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-6">
              <SlidersHorizontal size={18} className="text-accent" />
              <h2 className="text-xl font-display font-bold text-ink">
                Configure Your Implementation Profile
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1: Potential National Lead */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-accent text-surface text-[11px] font-bold flex items-center justify-center">
                    1
                  </span>
                  Select your Potential National Lead
                </label>
                <p className="text-xs text-ink-muted">
                  Populated dynamically from the Airtable Pathways table.
                </p>
                <div className="relative">
                  <select
                    value={selectedLead}
                    onChange={(e) => setSelectedLead(e.target.value)}
                    className="w-full p-2.5 bg-paper border border-line text-sm text-ink focus:outline-hidden focus:border-accent appearance-none cursor-pointer pr-8 font-medium"
                  >
                    {availableLeads.map((lead) => (
                      <option key={lead} value={lead}>
                        {lead}
                      </option>
                    ))}
                  </select>
                  <Building2 size={16} className="absolute right-3 top-3 text-ink-muted pointer-events-none" />
                </div>
              </div>

              {/* Step 2: Country (optional) */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-accent text-surface text-[11px] font-bold flex items-center justify-center">
                    2
                  </span>
                  Select your country (optional)
                </label>
                <p className="text-xs text-ink-muted">
                  Provides contextual evidence from published Country Journeys.
                </p>
                <div className="relative">
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full p-2.5 bg-paper border border-line text-sm text-ink focus:outline-hidden focus:border-accent appearance-none cursor-pointer pr-8 font-medium"
                  >
                    <option value="">No country selected (Global Toolkit)</option>
                    {publishedCountries.map((c) => (
                      <option key={c.countryId} value={c.countryId}>
                        {c.flag ? `${c.flag} ` : ""}{c.countryName}
                      </option>
                    ))}
                  </select>
                  <Globe2 size={16} className="absolute right-3 top-3 text-ink-muted pointer-events-none" />
                </div>
              </div>

              {/* Step 3: CHAMP Action / Implementation Priority */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-accent text-surface text-[11px] font-bold flex items-center justify-center">
                    3
                  </span>
                  CHAMP Action / Priority
                </label>
                <p className="text-xs text-ink-muted">
                  Strictly one of the 5 official Actions from Airtable.
                </p>
                <div className="relative">
                  <select
                    value={selectedActionId}
                    onChange={(e) => setSelectedActionId(Number(e.target.value))}
                    className="w-full p-2.5 bg-paper border border-line text-sm text-ink focus:outline-hidden focus:border-accent appearance-none cursor-pointer pr-8 font-medium"
                  >
                    {officialActions.map((a) => (
                      <option key={a.id} value={a.id}>
                        Action {a.id}: {a.title}
                      </option>
                    ))}
                  </select>
                  <Layers size={16} className="absolute right-3 top-3 text-ink-muted pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Action Card Preview */}
            {officialActions.find((a) => a.id === selectedActionId) && (
              <div 
                className="mt-6 p-4 border-l-4 border-line bg-paper text-xs text-ink-muted"
                style={{ borderLeftColor: currentTheme.hex }}
              >
                <span className="font-bold text-ink block mb-1">
                  Selected Action {selectedActionId}: {officialActions.find((a) => a.id === selectedActionId)?.title}
                </span>
                <p className="line-clamp-2">
                  {officialActions.find((a) => a.id === selectedActionId)?.description}
                </p>
              </div>
            )}

            {/* Generate Button */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-line">
              <span className="text-xs text-ink-muted">
                Profile: <strong>{selectedLead || "None"}</strong> • <strong>{selectedCountry ? selectedCountry.toUpperCase() : "Global"}</strong> • <strong>Action {selectedActionId}</strong>
              </span>

              <button
                onClick={handleGenerate}
                disabled={isGenerating || !selectedLead}
                className="w-full sm:w-auto px-6 py-3 bg-accent text-surface font-display font-bold text-sm uppercase tracking-wider hover:opacity-95 transition-opacity disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Generating Guidance...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Generate My CHAMP Implementation Guidance
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Briefing Presentation (Sections A - J) */}
          {briefing && (
            <div className="bg-surface border border-line shadow-xs divide-y divide-line">
              {/* Header Badge Bar */}
              <div className="p-6 sm:p-8 bg-paper flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-accent">
                    Official CHAMP Implementation Briefing
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink mt-1">
                    Guidance for {briefing.normalizedNationalLead}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span 
                      className="px-2.5 py-0.5 text-xs font-bold text-surface"
                      style={{ backgroundColor: currentTheme.hex }}
                    >
                      Action {briefing.sectionA_SelectedAction.actionNumber}
                    </span>
                    {briefing.selectedCountry ? (
                      <span className="px-2.5 py-0.5 text-xs font-semibold bg-surface border border-line text-ink">
                        Country Context: {briefing.selectedCountry.countryName}
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 text-xs font-semibold bg-surface border border-line text-ink-muted">
                        Global Repository Context
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    const text = `# CHAMP Guidance for ${briefing.normalizedNationalLead}\n\nAction: ${briefing.sectionA_SelectedAction.title}\n\n${briefing.sectionA_SelectedAction.description}`;
                    navigator.clipboard.writeText(text);
                    setCopiedText(true);
                    setTimeout(() => setCopiedText(false), 2000);
                  }}
                  className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-surface border border-line text-ink hover:text-accent transition-colors flex items-center gap-1.5 self-start cursor-pointer"
                >
                  {copiedText ? <Check size={14} /> : <Copy size={14} />}
                  {copiedText ? "Copied" : "Copy Summary"}
                </button>
              </div>

              {/* Section A: Selected CHAMP Action */}
              <div className="p-6 sm:p-8 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-accent block">
                  Section A: Your Selected CHAMP Action
                </span>
                <h3 className="text-xl font-display font-bold text-ink">
                  Action {briefing.sectionA_SelectedAction.actionNumber}: {briefing.sectionA_SelectedAction.title}
                </h3>
                <p className="text-sm text-ink leading-relaxed">
                  {briefing.sectionA_SelectedAction.description}
                </p>
                {briefing.sectionA_SelectedAction.systemsLogic && (
                  <div className="mt-4 p-4 bg-paper border-l-2 border-accent text-xs text-ink-muted">
                    <span className="font-bold text-ink block mb-1">Systems Logic:</span>
                    <p>{briefing.sectionA_SelectedAction.systemsLogic}</p>
                  </div>
                )}
              </div>

              {/* Section B: Relevant Pathways */}
              <div className="p-6 sm:p-8 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-accent block">
                  Section B: Relevant Pathways for Your National Lead
                </span>
                {briefing.sectionB_RelevantPathways.matchedPathways.length > 0 ? (
                  <div className="space-y-4">
                    <p className="text-sm text-ink">
                      The following implementation pathways explicitly match <strong>{briefing.normalizedNationalLead}</strong> as a Potential National Lead:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {briefing.sectionB_RelevantPathways.matchedPathways.map((p) => (
                        <div key={p.id} className="p-4 bg-paper border border-line space-y-2">
                          <div className="flex items-start justify-between">
                            <h4 className="font-bold text-sm text-ink">{p.title}</h4>
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              Direct Lead Match
                            </span>
                          </div>
                          {p.whatItIs && (
                            <p className="text-xs text-ink-muted line-clamp-3">
                              <span className="font-semibold text-ink">What it is:</span> {p.whatItIs}
                            </p>
                          )}
                          <div className="pt-2 text-[11px] font-mono text-ink-muted">
                            Record ID: {p.id}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                    No individual pathway under Action {briefing.sectionA_SelectedAction.actionNumber} explicitly lists {briefing.normalizedNationalLead} as its designated lead. General guidance under this action is shown below.
                  </div>
                )}

                {briefing.sectionB_RelevantPathways.otherPathwaysInAction.length > 0 && (
                  <div className="pt-2">
                    <span className="text-xs font-bold text-ink uppercase tracking-wider block mb-2">
                      Other Pathways Under Action {briefing.sectionA_SelectedAction.actionNumber} (General Action Context):
                    </span>
                    <ul className="text-xs text-ink-muted space-y-1">
                      {briefing.sectionB_RelevantPathways.otherPathwaysInAction.map((op) => (
                        <li key={op.id} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-ink-muted shrink-0" />
                          <span><strong>{op.title}</strong> — {op.distinctionNote}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Section C: Institutional Role */}
              <div className="p-6 sm:p-8 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-accent block">
                  Section C: Your Institution's Potential Role
                </span>
                <p className="text-sm text-ink leading-relaxed">
                  {briefing.sectionC_InstitutionalRole.roleDescription}
                </p>
                <div className="p-3 bg-paper border border-line text-xs">
                  <span className="font-bold text-ink">Key Collaborating Actors:</span>{" "}
                  <span className="text-ink-muted">
                    {briefing.sectionC_InstitutionalRole.keyActorsToCollaborateWith.join(", ")}
                  </span>
                </div>
              </div>

              {/* Section D: Practical Implementation Steps */}
              <div className="p-6 sm:p-8 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-accent block">
                  Section D: Practical Implementation Steps
                </span>
                <div className="space-y-6">
                  {briefing.sectionD_PracticalImplementationSteps.map((pwSteps, pIdx) => (
                    <div key={pIdx} className="space-y-3">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-ink border-b border-line pb-1">
                        Guidance for: {pwSteps.pathwayTitle}
                      </h4>
                      <div className="space-y-3">
                        {pwSteps.steps.map((st) => (
                          <div key={st.stepOrder} className="flex items-start gap-3 p-3 bg-paper border border-line">
                            <span 
                              className="w-6 h-6 rounded-full text-surface text-xs font-bold flex items-center justify-center shrink-0 mt-0.5"
                              style={{ backgroundColor: currentTheme.hex }}
                            >
                              {st.stepOrder}
                            </span>
                            <div>
                              <h5 className="font-bold text-xs text-ink">{st.stepTitle}</h5>
                              <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                                {st.detailedContent}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section E: Coordination with Other Actors */}
              <div className="p-6 sm:p-8 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-accent block">
                  Section E: Coordination With Other Actors
                </span>
                <p className="text-sm text-ink leading-relaxed">
                  {briefing.sectionE_CoordinationWithOtherActors.coordinationSummary}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {briefing.sectionE_CoordinationWithOtherActors.keyActors.map((actor, idx) => (
                    <span key={idx} className="px-2.5 py-1 text-xs bg-paper border border-line text-ink font-medium">
                      {actor}
                    </span>
                  ))}
                </div>
              </div>

              {/* Section F: Enabling Conditions */}
              <div className="p-6 sm:p-8 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-accent block">
                  Section F: Enabling Conditions & Transferability Considerations
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {briefing.sectionF_EnablingConditions.map((ec, idx) => (
                    <div key={idx} className="p-4 bg-paper border border-line space-y-3">
                      <h4 className="font-bold text-xs text-ink uppercase tracking-wider border-b border-line pb-1">
                        {ec.pathwayTitle}
                      </h4>
                      <div>
                        <span className="text-[11px] font-bold text-accent block mb-1">Enabling Conditions:</span>
                        <ul className="text-xs text-ink-muted space-y-1">
                          {ec.conditions.length > 0 ? (
                            ec.conditions.map((c, cIdx) => (
                              <li key={cIdx} className="flex items-start gap-1.5">
                                <span className="text-accent mt-0.5">•</span>
                                <span>{c}</span>
                              </li>
                            ))
                          ) : (
                            <li>General institutional and legal conditions apply.</li>
                          )}
                        </ul>
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-ink block mb-1">Transferability:</span>
                        <ul className="text-xs text-ink-muted space-y-1">
                          {ec.transferabilityConsiderations.length > 0 ? (
                            ec.transferabilityConsiderations.map((t, tIdx) => (
                              <li key={tIdx} className="flex items-start gap-1.5">
                                <span className="text-ink mt-0.5">•</span>
                                <span>{t}</span>
                              </li>
                            ))
                          ) : (
                            <li>Adapt to national and subnational fiscal framework.</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section G: Country Experiences */}
              <div className="p-6 sm:p-8 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-accent block">
                  Section G: Country Experiences
                </span>
                {briefing.sectionG_CountryExperiences.selectedCountryEvidence ? (
                  <div className="p-4 bg-paper border-l-4 border-accent space-y-3">
                    <h4 className="font-bold text-sm text-ink">
                      Documented Journey: {briefing.sectionG_CountryExperiences.selectedCountryEvidence.countryName}
                    </h4>
                    {briefing.sectionG_CountryExperiences.selectedCountryEvidence.summary && (
                      <p className="text-xs text-ink-muted">
                        {briefing.sectionG_CountryExperiences.selectedCountryEvidence.summary}
                      </p>
                    )}
                    {briefing.sectionG_CountryExperiences.selectedCountryEvidence.actionsInActionNumber.map((act, aIdx) => (
                      <div key={aIdx} className="pt-2 border-t border-line space-y-2">
                        <span className="font-bold text-xs text-ink block">{act.title}</span>
                        <p className="text-xs text-ink-muted line-clamp-4">{act.content}</p>
                        {act.caseStudyTitle && (
                          <div className="p-3 bg-surface border border-line text-xs">
                            <span className="font-bold text-accent block">Case Study: {act.caseStudyTitle}</span>
                            <p className="text-ink-muted mt-1">{act.caseStudyContent}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : briefing.selectedCountry ? (
                  <div className="p-4 bg-paper border border-line text-xs text-ink-muted">
                    No published deep-dive records are currently verified in the repository for {briefing.selectedCountry.countryName}.
                  </div>
                ) : (
                  <p className="text-xs text-ink-muted">
                    No country was selected. Practical peer learning examples from the core toolkit are highlighted below.
                  </p>
                )}

                {briefing.sectionG_CountryExperiences.otherRepositoryExamples.length > 0 && (
                  <div className="pt-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-ink block mb-2">
                      Repository Peer Learning Examples & Tools:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {briefing.sectionG_CountryExperiences.otherRepositoryExamples.slice(0, 4).map((ex, exIdx) => (
                        <div key={exIdx} className="p-3 bg-paper border border-line space-y-1">
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-surface border border-line text-ink">
                            {ex.type}
                          </span>
                          <h5 className="font-bold text-xs text-ink">{ex.exampleTitle}</h5>
                          {ex.connectionLine && (
                            <p className="text-[11px] text-accent italic">{ex.connectionLine}</p>
                          )}
                          {ex.excerpt && (
                            <p className="text-xs text-ink-muted line-clamp-2">{ex.excerpt}</p>
                          )}
                          {ex.learnMoreUrl && (
                            <a
                              href={ex.learnMoreUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] font-semibold text-accent hover:underline inline-flex items-center gap-1 pt-1"
                            >
                              Learn More <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Section H: Supporting Resources */}
              <div className="p-6 sm:p-8 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-accent block">
                  Section H: Supporting Resources
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {briefing.sectionH_SupportingResources.keyResources.slice(0, 4).map((res, rIdx) => (
                    <div key={rIdx} className="p-3 bg-paper border border-line space-y-1">
                      <span className="text-[10px] uppercase font-bold text-accent">{res.type}</span>
                      <h5 className="font-bold text-xs text-ink">{res.title}</h5>
                      {res.whyOrWhenNote && (
                        <p className="text-[11px] text-ink-muted italic">{res.whyOrWhenNote}</p>
                      )}
                      {res.url && (
                        <a
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] font-semibold text-accent hover:underline inline-flex items-center gap-1"
                        >
                          Source Tool / Portal <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Section I: Traceable Source References */}
              <div className="p-6 sm:p-8 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-accent block">
                  Section I: Traceable Source References
                </span>
                <div className="p-4 bg-paper border border-line text-xs font-mono text-ink-muted space-y-1">
                  {briefing.sectionI_SourceReferences.map((ref, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-ink font-semibold">[{ref.recordType}]</span>
                      <span>{ref.title}</span>
                      <span className="text-[10px] bg-surface px-1.5 py-0.5 border border-line">
                        {ref.recordId}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section J: Evidence Gaps */}
              <div className="p-6 sm:p-8 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-accent block">
                  Section J: Evidence Gaps & Boundaries
                </span>
                {briefing.sectionJ_EvidenceGaps.length > 0 ? (
                  <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
                    {briefing.sectionJ_EvidenceGaps.map((gap, gIdx) => (
                      <p key={gIdx}>• {gap}</p>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-ink-muted">
                    All guidance and evidence presented in this briefing are directly grounded in verified records from the official CHAMP Airtable repository.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
