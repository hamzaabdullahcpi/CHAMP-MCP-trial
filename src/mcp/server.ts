/**
 * CHAMP Model Context Protocol (MCP) Server
 * Connects AI Assistants (including ChatGPT custom MCP connections) to the CHAMP Airtable knowledge base.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";
import express, { Request, Response, NextFunction } from "express";
import { defaultToolsService, ChampToolsService } from "./tools";
import { defaultAirtableClient } from "./airtableClient";
import { defaultOAuthServer, OAuthServer } from "./oauth";

export interface CreateMcpServerOptions {
  toolsService?: ChampToolsService;
  oauthServer?: OAuthServer;
  serverName?: string;
  serverVersion?: string;
}

export const MCP_SYSTEM_INSTRUCTIONS_OBJECT = {
  role: "CHAMP Source-Grounded Implementation Companion",
  authoritativeSourcePolicy: "Use ONLY evidence retrieved from CHAMP MCP tools. Overview is the authoritative explanatory field for Pathways ('What It Is' and 'Why It Is Needed' are consolidated into 'Overview' in Airtable; do not report them as missing). There is NO Enabling Conditions content category in the Toolkit; do NOT include enabling conditions or confuse them with Transferability Considerations. If unretrieved, state verbatim: 'This is not specified in the available CHAMP Toolkit content.' Do NOT fill evidence gaps using general model knowledge.",
  planningArtifactProhibition: "CRITICAL: DO NOT GENERATE IMPLEMENTATION ROADMAPS, WORKPLANS, PHASES, DELIVERABLES, MILESTONES, OR TIMELINES. The CHAMP Toolkit contains guidance, not prescribed planning sequences. Do NOT organize CHAMP content into Phase 1, Phase 2, Phase 3, Phase 4, Deliverables lists, Milestones, Action plans, Workplans, Timelines, or Synthesized implementation sequences. When asked for a roadmap, plan, or next steps: 1. State clearly that the CHAMP Toolkit does not prescribe an implementation roadmap or planning sequence. 2. Present the relevant CHAMP Pathways and their existing implementation guidance as documented options and guidance. 3. Keep implementation steps attached to their originating Pathway. 4. Do not combine steps from multiple Pathways into a new sequence. Knowledge synthesis is permitted. Implementation plan synthesis is strictly prohibited.",
  nonPrescriptiveTone: "CRITICAL: Do NOT be overly prescriptive. Focus strictly on evidence from the Toolkit. Do NOT provide policy recommendations, advice, or action items outside of CHAMP Toolkit guidance.",
  naturalCitationPresentation: "CRITICAL: Present responses using clean natural citations (e.g. 'CHAMP Action 4', 'Pathway 4.2', 'Sweden's Country Journey'). Do NOT clutter user-facing markdown responses with raw Airtable record IDs ('rec...') or raw markdown database tables. All technical provenance (table, recordId, fieldName, evidenceLevel) is preserved in structured JSON.",
  verbatimPresentation: "Reproduce implementation guidance steps verbatim in original ascending order (1, 2, 3...). Reproduce Transferability Considerations verbatim under 'How to Adapt This Pathway to Your Context'.",
  prohibitOfficialWord: "Do NOT use the word 'official' to describe guidance or content unless referring to a user's role (e.g. 'Finance Ministry official') or quoting source text. Use 'CHAMP Toolkit', 'CHAMP guidance', or 'CHAMP Airtable knowledge base'.",
  responseStructure: [
    "Organise results by Pathway rather than by abstract advisory categories.",
    "For each relevant Pathway: 1. Pathway title and Action context, 2. Overview (from Airtable Overview field), 3. Implementation Guidance (steps as written in Airtable), 4. Transferability Considerations (as written in Airtable), 5. Relevant Examples and Tools (linked from Airtable)."
  ]
};

export const MCP_SYSTEM_INSTRUCTIONS_TEXT = `You are the CHAMP Knowledge Assistant, connected via MCP to the CHAMP Toolkit and Country Journeys Airtable knowledge base.

Your mission is to serve as a faithful interpreter and source-grounded implementation companion, NOT an independent climate policy adviser or implementation consultant.

CRITICAL OPERATIONAL RULES:
1. STRICT PLANNING-ARTIFACT PROHIBITION:
   - DO NOT GENERATE IMPLEMENTATION ROADMAPS, WORKPLANS, PHASES, DELIVERABLES, MILESTONES, OR TIMELINES.
   - The CHAMP Toolkit contains guidance, not prescribed planning sequences.
   - Do NOT organize CHAMP content into:
     * Phase 1, Phase 2, Phase 3, Phase 4, etc.
     * Deliverables lists or matrices
     * Milestones or artificial deadlines
     * Action plans or workplans
     * 30/60/90-day plans or 12-month plans
     * Synthesized implementation sequences
   - When asked for a roadmap, plan, or next steps:
     1. State clearly that the CHAMP Toolkit does not prescribe an implementation roadmap or planning sequence.
     2. Present the relevant CHAMP Pathways and their existing implementation guidance as documented options and guidance.
     3. Keep implementation steps attached to their originating Pathway.
     4. Do not combine steps from multiple Pathways into a new sequence.
   - KNOWLEDGE SYNTHESIS IS ALLOWED. IMPLEMENTATION PLAN SYNTHESIS IS STRICTLY PROHIBITED.

2. AUTHORITATIVE SOURCE POLICY & TOOLKIT EVIDENCE FOCUS:
   - Use ONLY evidence retrieved from the CHAMP MCP tools.
   - Overview is the authoritative explanatory field for Pathways. The Airtable fields 'What It Is' and 'Why It Is Needed' are consolidated into 'Overview'; do NOT rely on empty fields or report them as missing knowledge when Overview is present.
   - There is NO Enabling Conditions content category in the knowledge base. Do NOT include Enabling Conditions in responses or confuse Transferability Considerations with Enabling Conditions.
   - Focus strictly on documented evidence from the Toolkit.
   - Do NOT be overly prescriptive or directive. Present retrieved evidence as documented options rather than commanding prescriptions.
   - Do NOT provide policy recommendations, action items, or advice outside of CHAMP Toolkit guidance.
   - If the knowledge base does not contain the requested information, state verbatim:
     "This is not specified in the available CHAMP Toolkit content."
   - Do NOT use general model knowledge to fill evidence gaps.

3. SOURCE-PRESERVING OUTPUT STRUCTURE:
   - Organize results by Pathway rather than by abstract advisory categories or consulting roadmaps.
   - For each relevant Pathway:
     1. Pathway title and Action context
     2. Overview (from Airtable Overview field)
     3. Implementation Guidance (the steps as written in Airtable, in ascending step order)
     4. Transferability Considerations (as written in Airtable)
     5. Relevant Examples and Tools (linked from Airtable)

4. PROHIBIT 'OFFICIAL' IN MODEL-GENERATED CONTENT:
   - Replace 'official' with:
     * CHAMP Toolkit
     * CHAMP guidance
     * CHAMP Airtable knowledge base
     * Documented in the CHAMP knowledge base
   - Only use 'official' when referring to a user's role (e.g. 'Finance Ministry official') or when it appears in retrieved source text.

5. NATURAL CITATIONS & CLEAN MARKDOWN:
   - Use clean, natural references in user-facing markdown (e.g. 'CHAMP Action 4', 'Pathway 4.2', 'Sweden's Country Journey', 'Step 1').
   - Do NOT clutter user-facing markdown responses with raw Airtable record IDs ('rec...') or raw markdown database citation tables. Full field-level provenance is preserved in structured JSON for technical auditability.`;

export function createChampMcpServer(options: CreateMcpServerOptions = {}): McpServer {
  const tools = options.toolsService || defaultToolsService;
  const server = new McpServer({
    name: options.serverName || "champ-knowledge-assistant",
    version: options.serverVersion || "1.0.0"
  });

  // =========================================================================
  // TOOL 1: search_champ_knowledge
  // =========================================================================
  server.tool(
    "search_champ_knowledge",
    "Authoritative source search across the CHAMP Core Toolkit and Country Journeys. Returns verified excerpts with field-level provenance (table, record ID, field name, verified source links, and explicit evidenceLevel). If no matching content is found, returns 'This is not specified in the available CHAMP Toolkit content.' CRITICAL PROHIBITION: DO NOT GENERATE IMPLEMENTATION ROADMAPS, WORKPLANS, PHASES (Phase 1, Phase 2...), DELIVERABLES, MILESTONES, OR TIMELINES. Quote guidance steps verbatim in original order. The CHAMP Toolkit provides guidance, not prescribed planning sequences.",
    {
      query: z.string().describe("Search keywords or thematic phrases (e.g. 'green bond', 'multilevel platform', 'Sweden')"),
      content_type: z
        .enum(["Core Toolkit", "Country Journeys", "both"])
        .optional()
        .describe("Restrict search scope: 'Core Toolkit', 'Country Journeys', or 'both' (default)"),
      country: z.string().optional().describe("Optional country name or slug to filter country journey content (e.g. 'sweden')"),
      national_lead: z.string().optional().describe("Optional Potential National Lead filter (e.g. 'Finance Ministry')"),
      action_id: z.number().int().min(1).max(5).optional().describe("Optional CHAMP Action Number (1 to 5)"),
      limit: z.number().int().min(1).max(30).optional().describe("Maximum number of results to return (default 10)")
    },
    async (params) => {
      try {
        const result = await tools.searchChampKnowledge(params);
        const enriched = {
          _instructions_for_assistant: MCP_SYSTEM_INSTRUCTIONS_OBJECT,
          ...result
        };
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(enriched, null, 2)
            }
          ]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Search error: ${err.message}`
            }
          ]
        };
      }
    }
  );

  // =========================================================================
  // TOOL 2: list_champ_actions
  // =========================================================================
  server.tool(
    "list_champ_actions",
    "Retrieve the five official CHAMP Actions directly from Airtable. Returns official Action Number, official title, description, record ID, linked pathway identifiers, and evidenceLevel 'official_toolkit'. Authoritative source of truth: the AI client must never invent, renumber, rename, or paraphrase official CHAMP actions.",
    {},
    async () => {
      try {
        const result = await tools.listChampActions();
        const enriched = {
          _instructions_for_assistant: MCP_SYSTEM_INSTRUCTIONS_OBJECT,
          ...result
        };
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(enriched, null, 2)
            }
          ]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Failed to retrieve CHAMP Actions from Airtable: ${err.message}`
            }
          ]
        };
      }
    }
  );

  // =========================================================================
  // TOOL 3: get_toolkit_pathway
  // =========================================================================
  server.tool(
    "get_toolkit_pathway",
    "Retrieve complete, authoritative evidence for a CHAMP Pathway by its identifier (record ID, order like '1.1' or '3.3', or title). Returns: (1) Overview as authoritative explanatory field, (2) Verbatim implementation guidance steps in strict ascending stepOrder, (3) Verbatim Transferability Considerations ('How to Adapt This Pathway to Your Context'), (4) Linked Peer Learning Examples, (5) Linked Tools & Additional Resources, (6) Concept Boxes, and (7) Field-level provenance with evidenceLevel. CRITICAL AI INSTRUCTION: Use Overview as authoritative pathway explanation; What It Is and Why It Is Needed are empty and consolidated into Overview. There is NO Enabling Conditions category in the Toolkit. Reproduce official implementation steps and transferability verbatim in original order without paraphrasing or inventing timelines, roadmaps, or milestones. In user markdown responses, use clean natural references without raw record IDs or raw citation tables.",
    {
      pathway_identifier: z
        .string()
        .describe("Pathway record ID (e.g. 'recWGEx5x7YpvT9ZP'), pathway number/order (e.g. '1.1', '3.3'), or title substring")
    },
    async (params) => {
      try {
        const result = await tools.getToolkitPathway(params);
        const enriched = {
          _instructions_for_assistant: MCP_SYSTEM_INSTRUCTIONS_OBJECT,
          ...result
        };
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(enriched, null, 2)
            }
          ]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Failed to retrieve pathway: ${err.message}`
            }
          ]
        };
      }
    }
  );

  // =========================================================================
  // TOOL 4: get_country_journey
  // =========================================================================
  server.tool(
    "get_country_journey",
    "Retrieve published Country Journey evidence from Airtable. Excludes unpublished or draft content. If country has no published journey, returns 'This is not specified in the available CHAMP Toolkit content.' CRITICAL AI INSTRUCTION: Do NOT fabricate national commitments, progress, budgets, KPIs, or governance mechanisms not contained in the returned record. All returned items are tagged with evidenceLevel 'documented_country_journey'.",
    {
      country: z.string().describe("Country slug or name (e.g. 'sweden' or 'Sweden')"),
      topic: z.string().optional().describe("Optional topic or thematic keyword to filter sections and mapped actions")
    },
    async (params) => {
      try {
        const result = await tools.getCountryJourney(params);
        const enriched = {
          _instructions_for_assistant: MCP_SYSTEM_INSTRUCTIONS_OBJECT,
          ...result
        };
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(enriched, null, 2)
            }
          ]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Failed to retrieve country journey: ${err.message}`
            }
          ]
        };
      }
    }
  );

  // =========================================================================
  // TOOL 5: compare_country_approaches
  // =========================================================================
  server.tool(
    "compare_country_approaches",
    "Compare documented governance and climate finance mechanisms across published Country Journeys. Identifies documented similarities, differences, and explicitly flags evidence gaps where data is not recorded in Airtable. The AI client must not extrapolate ungrounded claims beyond the documented evidence.",
    {
      countries: z.array(z.string()).min(1).describe("List of country names or slugs to compare (e.g. ['sweden', 'brazil'])"),
      topic: z.string().describe("Topic or governance mechanism to compare (e.g. 'financial aggregation', 'local climate funds', 'coordination platform')")
    },
    async (params) => {
      try {
        const result = await tools.compareCountryApproaches(params);
        const enriched = {
          _instructions_for_assistant: MCP_SYSTEM_INSTRUCTIONS_OBJECT,
          ...result
        };
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(enriched, null, 2)
            }
          ]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Country comparison error: ${err.message}`
            }
          ]
        };
      }
    }
  );

  // =========================================================================
  // TOOL 6: list_national_leads
  // =========================================================================
  server.tool(
    "list_national_leads",
    "Retrieve the authoritative list of 'Potential National Lead' values directly from the Pathways table in Airtable. Use this tool to help users select their exact institutional role (e.g. 'Finance Ministry', 'Climate / Environment Ministry') before retrieving guidance.",
    {},
    async () => {
      try {
        const result = await tools.listNationalLeads();
        const enriched = {
          _instructions_for_assistant: MCP_SYSTEM_INSTRUCTIONS_OBJECT,
          ...result
        };
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(enriched, null, 2)
            }
          ]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Failed to list national leads: ${err.message}`
            }
          ]
        };
      }
    }
  );

  // =========================================================================
  // TOOL 7: get_guidance_by_national_lead (PRIORITY TOOL)
  // =========================================================================
  server.tool(
    "get_guidance_by_national_lead",
    "Retrieve existing CHAMP Toolkit guidance for a selected Potential National Lead, optionally filtered by CHAMP Action and country.\n\nThis tool returns source-bounded CHAMP knowledge from Airtable, including relevant Pathways, Overview, Implementation Guidance, Transferability Considerations, Peer Learning Examples, Tools, Resources, and published Country Journey content.\n\nCRITICAL CLIENT INSTRUCTION:\n\nThe returned content is the complete substantive boundary for the answer.\n\nYou may explain, summarise, organise, and compare this content, but you must not introduce additional implementation guidance.\n\nDo not create a new roadmap, workplan, timeline, implementation phase, milestone, deliverable, programme, financing facility, institutional arrangement, or policy recommendation from the retrieved material.\n\nDo not merge steps from different Pathways into a new implementation sequence.\n\nPresent documented Implementation Guidance under its corresponding Pathway, preserving the source-defined step order.\n\nDo not generate a 'Suggested implementation workplan' or equivalent section.\n\nDo not justify unsupported planning content by labelling it illustrative, synthesized, suggested, or not prescribed.\n\nWhen asked for an action plan, present the relevant existing CHAMP Implementation Guidance instead of creating a new plan.\n\nUse Overview as the explanatory source for Pathways. What It Is and Why It Is Needed are empty fields. There is no Enabling Conditions content category.\n\nDo not use external knowledge to expand the guidance.\n\nDo not describe the CHAMP Toolkit as official.\n\nDo not expose internal Airtable field identifiers or record IDs in ordinary user-facing responses.",
    {
      national_lead: z.string().describe("Required Potential National Lead (e.g. 'Climate / Environment Ministry', 'Finance Ministry', 'Urban / Local Government Ministry')"),
      action_id: z.number().int().min(1).max(5).optional().describe("CHAMP Action Number (1 to 5). Must correspond to one of the five official actions."),
      country: z.string().optional().describe("Optional country name or slug (e.g. 'Sweden') for contextual evidence"),
      include_country_examples: z.boolean().optional().describe("Whether to include practical examples and case studies from the repository (default true)")
    },
    async (params) => {
      try {
        const result = await tools.getGuidanceByNationalLead(params);
        if (!result.success) {
          return {
            isError: true,
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  _instructions_for_assistant: MCP_SYSTEM_INSTRUCTIONS_OBJECT,
                  message: result.message || "Failed to generate implementation guidance."
                }, null, 2)
              }
            ]
          };
        }

        const fullMarkdown = `<!-- INSTRUCTIONS FOR AI ASSISTANT:
${MCP_SYSTEM_INSTRUCTIONS_TEXT}
-->

${result.markdownBriefing || JSON.stringify(result.briefing, null, 2)}`;

        return {
          content: [
            {
              type: "text",
              text: fullMarkdown
            }
          ]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Guidance generation error: ${err.message}`
            }
          ]
        };
      }
    }
  );// =========================================================================
  // MCP PROMPT 1: champ_system_instructions
  // =========================================================================
  server.prompt(
    "champ_system_instructions",
    "Authoritative system instructions and operational prompt guidelines for the CHAMP Knowledge Assistant",
    {
      national_lead: z.string().optional().describe("Optional Potential National Lead institutional role to contextualize instructions")
    },
    async (params) => {
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: MCP_SYSTEM_INSTRUCTIONS_TEXT + (params.national_lead ? `\n\nTarget Institutional Role: ${params.national_lead}` : "")
            }
          }
        ]
      };
    }
  );

  return server;
}

/**
 * Express router mounting the MCP protocol endpoints, authentication, and /health
 */
export function createMcpExpressRouter(options: CreateMcpServerOptions = {}): express.Router {
  const router = express.Router();
  const tools = options.toolsService || defaultToolsService;
  const mcpServer = createChampMcpServer(options);

  // Active SSE transports container: sessionId -> SSEServerTransport
  const sseTransports = new Map<string, SSEServerTransport>();

  const oauth = options.oauthServer || defaultOAuthServer;
  const authMiddleware = oauth.createAuthMiddleware();

  // Enable URL-encoded parsing for OAuth form submissions
  router.use(express.urlencoded({ extended: true }));

  // =========================================================================
  // OAUTH 2.1 & RFC 9728 / RFC 8414 DISCOVERY ENDPOINTS
  // =========================================================================

  // RFC 9728: Protected Resource Metadata
  router.get("/.well-known/oauth-protected-resource", (req: Request, res: Response) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(oauth.getProtectedResourceMetadata(req));
  });

  // RFC 8414: Authorization Server Metadata
  router.get("/.well-known/oauth-authorization-server", (req: Request, res: Response) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(oauth.getAuthorizationServerMetadata(req));
  });

  // OpenID Connect Discovery alias
  router.get("/.well-known/openid-configuration", (req: Request, res: Response) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(oauth.getAuthorizationServerMetadata(req));
  });

  // RFC 7591: Dynamic Client Registration
  router.post("/oauth/register", (req: Request, res: Response) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    try {
      const client = oauth.registerClient(req.body || {});
      return res.status(201).json({
        client_id: client.clientId,
        client_secret: client.clientSecret,
        client_name: client.clientName,
        redirect_uris: client.redirectUris,
        grant_types: client.grantTypes,
        response_types: client.responseTypes,
        token_endpoint_auth_method: "none",
        client_id_issued_at: Math.floor(client.createdAt / 1000)
      });
    } catch (err: any) {
      return res.status(400).json({
        error: "invalid_client_metadata",
        error_description: err.message
      });
    }
  });

  // OIDC Userinfo endpoints (queried by ChatGPT during action discovery)
  const handleUserinfo = (req: Request, res: Response) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json({
      sub: "champ-climate-assistant-user",
      name: "CHAMP National Lead",
      preferred_username: "champ_lead",
      email: "lead@champ.local",
      email_verified: true
    });
  };
  router.get("/oauth/userinfo", authMiddleware, handleUserinfo);
  router.get("/userinfo", authMiddleware, handleUserinfo);

  // JWKS endpoints
  const handleJwks = (req: Request, res: Response) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json({ keys: [] });
  };
  router.get("/oauth/jwks.json", handleJwks);
  router.get("/.well-known/jwks.json", handleJwks);

  // GET /oauth/authorize — Browser authorization screen
  router.get("/oauth/authorize", (req: Request, res: Response) => {
    const clientId = (req.query.client_id as string) || "chatgpt-mcp-client";
    const redirectUri = req.query.redirect_uri as string;
    const state = req.query.state as string | undefined;
    const codeChallenge = req.query.code_challenge as string | undefined;
    const codeChallengeMethod = (req.query.code_challenge_method as string) || "S256";
    const scope = (req.query.scope as string) || "mcp:read mcp:tools";
    const autoApprove = req.query.auto_approve === "true";

    if (!redirectUri) {
      return res.status(400).send("Missing required parameter: redirect_uri");
    }

    if (!oauth.validateRedirectUri(clientId, redirectUri)) {
      return res.status(400).send(`Invalid or insecure redirect_uri: ${redirectUri}. OAuth 2.1 requires HTTPS.`);
    }

    // Auto-approval mode if requested or for automated test runs
    if (autoApprove) {
      const code = oauth.createAuthCode({
        clientId,
        redirectUri,
        codeChallenge: codeChallenge || "",
        codeChallengeMethod,
        scope
      });
      const targetUrl = new URL(redirectUri);
      targetUrl.searchParams.set("code", code);
      if (state) targetUrl.searchParams.set("state", state);
      return res.redirect(302, targetUrl.toString());
    }

    // Render HTML consent screen
    const html = oauth.renderConsentHtml({
      clientId,
      redirectUri,
      state,
      codeChallenge,
      codeChallengeMethod,
      scope
    });
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  });

  // POST /oauth/authorize — Handles consent form submission
  router.post("/oauth/authorize", (req: Request, res: Response) => {
    const {
      client_id = "chatgpt-mcp-client",
      redirect_uri,
      state,
      code_challenge,
      code_challenge_method = "S256",
      scope = "mcp:read mcp:tools",
      action
    } = req.body;

    if (!redirect_uri) {
      return res.status(400).send("Missing required parameter: redirect_uri");
    }

    if (!oauth.validateRedirectUri(client_id, redirect_uri)) {
      return res.status(400).send(`Invalid or insecure redirect_uri: ${redirect_uri}`);
    }

    const targetUrl = new URL(redirect_uri);

    if (action === "approve" || action === "Authorize & Connect" || !action) {
      const code = oauth.createAuthCode({
        clientId: client_id,
        redirectUri: redirect_uri,
        codeChallenge: code_challenge || "",
        codeChallengeMethod: code_challenge_method,
        scope
      });
      targetUrl.searchParams.set("code", code);
      if (state) targetUrl.searchParams.set("state", state);
      return res.redirect(302, targetUrl.toString());
    } else {
      targetUrl.searchParams.set("error", "access_denied");
      targetUrl.searchParams.set("error_description", "User denied authorization request");
      if (state) targetUrl.searchParams.set("state", state);
      return res.redirect(302, targetUrl.toString());
    }
  });

  // POST /oauth/token — Exchanges authorization code for access token or refreshes
  router.post("/oauth/token", (req: Request, res: Response) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Pragma", "no-cache");

    try {
      const body = req.body || {};
      let clientId = body.client_id;
      const grantType = body.grant_type;
      const code = body.code;
      const redirectUri = body.redirect_uri;
      const codeVerifier = body.code_verifier;
      const refreshToken = body.refresh_token;

      // Check HTTP Basic Authorization header if client_id not in body
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Basic ")) {
        try {
          const decoded = Buffer.from(authHeader.slice(6), "base64").toString("utf-8");
          const [u] = decoded.split(":");
          if (u) clientId = decodeURIComponent(u);
        } catch {
          // ignore parsing error
        }
      }

      if (grantType === "authorization_code") {
        if (!code) {
          return res.status(400).json({
            error: "invalid_request",
            error_description: "Missing required parameter: code"
          });
        }

        const result = oauth.exchangeCodeForToken({
          code,
          clientId,
          redirectUri,
          codeVerifier
        });

        return res.json({
          access_token: result.accessToken,
          token_type: result.tokenType || "Bearer",
          expires_in: result.expiresIn,
          refresh_token: result.refreshToken,
          scope: result.scope
        });
      } else if (grantType === "refresh_token") {
        if (!refreshToken) {
          return res.status(400).json({
            error: "invalid_request",
            error_description: "Missing required parameter: refresh_token"
          });
        }

        const result = oauth.refreshAccessToken(refreshToken);
        return res.json({
          access_token: result.accessToken,
          token_type: result.tokenType || "Bearer",
          expires_in: result.expiresIn,
          refresh_token: result.refreshToken,
          scope: result.scope
        });
      } else {
        return res.status(400).json({
          error: "unsupported_grant_type",
          error_description: `Grant type '${grantType}' is not supported. Use 'authorization_code' or 'refresh_token'.`
        });
      }
    } catch (err: any) {
      return res.status(400).json({
        error: "invalid_grant",
        error_description: err.message
      });
    }
  });

  // Health-check endpoint
  router.get("/health", async (req, res) => {
    try {
      const isConfigured = defaultAirtableClient.isConfigured();
      let actionsCount = 0;
      let countryCount = 0;
      let status = "healthy";

      if (isConfigured) {
        try {
          const [actions, countries] = await Promise.all([
            defaultAirtableClient.getActions(),
            defaultAirtableClient.getCountryJourneys(true)
          ]);
          actionsCount = actions.length;
          countryCount = countries.length;
        } catch (e: any) {
          status = "degraded_airtable_fetch_failed";
        }
      } else {
        status = "unconfigured_credentials_missing";
      }

      res.status(status === "healthy" ? 200 : 200).json({
        status,
        service: "CHAMP MCP Knowledge Assistant",
        uptimeSeconds: Math.round(process.uptime()),
        timestamp: new Date().toISOString(),
        version: "1.0.0",
        airtable: {
          configured: isConfigured,
          actionsCount,
          countryCount
        },
        mcpEndpoints: {
          streamableHttp: "/mcp",
          sseEndpoint: "/mcp/sse",
          messagesEndpoint: "/mcp/messages"
        },
        oauth: {
          enabled: true,
          type: "OAuth 2.1 (RFC 8414 & RFC 9728)",
          protectedResourceMetadata: "/.well-known/oauth-protected-resource",
          authorizationServerMetadata: "/.well-known/oauth-authorization-server",
          authorizeEndpoint: "/oauth/authorize",
          tokenEndpoint: "/oauth/token",
          registrationEndpoint: "/oauth/register"
        }
      });
    } catch (err: any) {
      res.status(500).json({ status: "error", error: err.message });
    }
  });

  // REST helper endpoints for Web UI and ChatGPT Custom Actions
  router.get("/api/guidance/leads", async (req, res) => {
    try {
      const leads = await tools.listNationalLeads();
      res.json(leads);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  router.post("/api/guidance/generate", authMiddleware, async (req, res) => {
    try {
      const { national_lead, action_id, country, include_country_examples } = req.body;
      const result = await tools.getGuidanceByNationalLead({
        national_lead,
        action_id: action_id ? Number(action_id) : undefined,
        country,
        include_country_examples: include_country_examples !== false
      });
      res.json(result);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  router.get("/api/actions", authMiddleware, async (req, res) => {
    try {
      const result = await tools.listChampActions();
      res.json(result);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  router.get("/api/pathway", authMiddleware, async (req, res) => {
    try {
      const pathway_identifier = (req.query.pathway_identifier || req.query.id || req.query.title) as string;
      if (!pathway_identifier) {
        return res.status(400).json({ error: "Missing required query parameter: pathway_identifier" });
      }
      const result = await tools.getToolkitPathway({ pathway_identifier });
      res.json(result);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  router.get("/api/country", authMiddleware, async (req, res) => {
    try {
      const country = (req.query.country || req.query.name) as string;
      const topic = req.query.topic as string | undefined;
      if (!country) {
        return res.status(400).json({ error: "Missing required query parameter: country" });
      }
      const result = await tools.getCountryJourney({ country, topic });
      res.json(result);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  router.post("/api/country/compare", authMiddleware, async (req, res) => {
    try {
      const { countries, topic } = req.body;
      if (!countries || !Array.isArray(countries) || !topic) {
        return res.status(400).json({ error: "Missing required fields: countries (array) and topic (string)" });
      }
      const result = await tools.compareCountryApproaches({ countries, topic });
      res.json(result);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  router.get("/api/search", authMiddleware, async (req, res) => {
    try {
      const query = req.query.query as string;
      if (!query) {
        return res.status(400).json({ error: "Missing required query parameter: query" });
      }
      const content_type = req.query.content_type as any;
      const country = req.query.country as string | undefined;
      const national_lead = req.query.national_lead as string | undefined;
      const action_id = req.query.action_id ? Number(req.query.action_id) : undefined;
      const limit = req.query.limit ? Number(req.query.limit) : 10;

      const result = await tools.searchChampKnowledge({
        query,
        content_type,
        country,
        national_lead,
        action_id,
        limit
      });
      res.json(result);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // OpenAPI 3.1 schema for ChatGPT Custom GPT Actions
  router.get("/openapi.json", (req, res) => {
    const host = req.get("host") || "champ-mcp-knowledge-server.onrender.com";
    const protocol = req.protocol === "http" && host.includes("localhost") ? "http" : "https";
    const serverUrl = `${protocol}://${host}`;

    res.json({
      openapi: "3.1.0",
      info: {
        title: "CHAMP MCP Knowledge Assistant API",
        description: "Official read-only Model Context Protocol API connecting ChatGPT directly to the CHAMP Toolkit Airtable knowledge base.",
        version: "1.0.0"
      },
      servers: [{ url: serverUrl }],
      paths: {
        "/api/actions": {
          get: {
            operationId: "list_champ_actions",
            summary: "Retrieve the 5 official CHAMP Actions dynamically from Airtable.",
            responses: { "200": { description: "The 5 official CHAMP actions" } }
          }
        },
        "/api/guidance/generate": {
          post: {
            operationId: "get_guidance_by_national_lead",
            summary: "Retrieve existing CHAMP Toolkit guidance for a selected Potential National Lead from Airtable.",
            description: "Retrieve existing CHAMP Toolkit guidance for a selected Potential National Lead, optionally filtered by CHAMP Action and country. Returns source-bounded CHAMP knowledge from Airtable organised by pathway.",
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["national_lead"],
                    properties: {
                      national_lead: { type: "string", description: "Potential National Lead (e.g. Finance Ministry, Climate / Environment Ministry)" },
                      action_id: { type: "integer", minimum: 1, maximum: 5, description: "CHAMP Action Number (1 to 5)" },
                      country: { type: "string", description: "Optional country name or slug (e.g. Sweden)" },
                      include_country_examples: { type: "boolean", default: true }
                    }
                  }
                }
              }
            },
            responses: { "200": { description: "Source-bounded CHAMP Toolkit guidance" } }
          }
        },
        "/api/guidance/leads": {
          get: {
            operationId: "list_national_leads",
            summary: "List all Potential National Leads and their associated pathway counts.",
            responses: { "200": { description: "List of Potential National Leads" } }
          }
        },
        "/api/pathway": {
          get: {
            operationId: "get_toolkit_pathway",
            summary: "Retrieve a complete CHAMP Pathway with guidance, examples, and resources.",
            parameters: [
              { name: "pathway_identifier", in: "query", required: true, schema: { type: "string" }, description: "Pathway record ID (e.g. recWGEx5x7YpvT9ZP), order (e.g. 1.1), or title" }
            ],
            responses: { "200": { description: "Pathway details" } }
          }
        },
        "/api/country": {
          get: {
            operationId: "get_country_journey",
            summary: "Retrieve a published Country Journey overview, context, and mapped actions.",
            parameters: [
              { name: "country", in: "query", required: true, schema: { type: "string" }, description: "Country slug or name (e.g. Sweden)" },
              { name: "topic", in: "query", required: false, schema: { type: "string" }, description: "Optional topic filter" }
            ],
            responses: { "200": { description: "Country journey data" } }
          }
        },
        "/api/country/compare": {
          post: {
            operationId: "compare_country_approaches",
            summary: "Compare published country experiences and governance approaches.",
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["countries", "topic"],
                    properties: {
                      countries: { type: "array", items: { type: "string" }, description: "Country names" },
                      topic: { type: "string", description: "Comparison topic" }
                    }
                  }
                }
              }
            },
            responses: { "200": { description: "Comparison results" } }
          }
        },
        "/api/search": {
          get: {
            operationId: "search_champ_knowledge",
            summary: "Search across approved Core Toolkit and Country Journey records.",
            parameters: [
              { name: "query", in: "query", required: true, schema: { type: "string" }, description: "Search query" },
              { name: "content_type", in: "query", required: false, schema: { type: "string", enum: ["Core Toolkit", "Country Journeys", "both"] } },
              { name: "country", in: "query", required: false, schema: { type: "string" } },
              { name: "national_lead", in: "query", required: false, schema: { type: "string" } },
              { name: "action_id", in: "query", required: false, schema: { type: "integer" } },
              { name: "limit", in: "query", required: false, schema: { type: "integer", default: 10 } }
            ],
            responses: { "200": { description: "Search results" } }
          }
        }
      }
    });
  });

  // List of official CHAMP MCP Tools with standard JSON Schema definitions
  const officialToolsList = [
    {
      name: "search_champ_knowledge",
      description: "Search approved content across the Core Toolkit and Country Journeys. Returns relevant excerpts, parent Action and Pathway relationships, record IDs, and source links.",
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string", description: "Search keywords or thematic phrases (e.g. 'green bond', 'multilevel platform', 'Sweden')" },
          content_type: { type: "string", enum: ["Core Toolkit", "Country Journeys", "both"], description: "Restrict search scope: 'Core Toolkit', 'Country Journeys', or 'both' (default)" },
          country: { type: "string", description: "Optional country name or slug to filter country journey content (e.g. 'sweden')" },
          national_lead: { type: "string", description: "Optional Potential National Lead filter (e.g. 'Finance Ministry')" },
          action_id: { type: "integer", minimum: 1, maximum: 5, description: "Optional CHAMP Action Number (1 to 5)" },
          limit: { type: "integer", minimum: 1, maximum: 30, description: "Maximum number of results to return (default 10)" }
        },
        required: ["query"]
      }
    },
    {
      name: "list_champ_actions",
      description: "Retrieve the five official CHAMP Actions dynamically from Airtable. Returns official Action Number, official title, description, record ID, and linked pathway identifiers. Reports any discrepancy if not exactly five.",
      inputSchema: {
        type: "object",
        properties: {}
      }
    },
    {
      name: "get_toolkit_pathway",
      description: "Retrieve a complete CHAMP Pathway by verified identifier (record ID, order like '1.1', or title). Returns parent Action, Potential National Lead, What it is, Why it is needed, Key Actors, Enabling Conditions, Transferability, sequential Implementation Guidance, Key Resources, Sub-Examples, and Additional Resources.",
      inputSchema: {
        type: "object",
        properties: {
          pathway_identifier: { type: "string", description: "Pathway record ID (e.g. 'recWGEx5x7YpvT9ZP'), pathway number/order (e.g. '1.1', '3.2'), or title substring" }
        },
        required: ["pathway_identifier"]
      }
    },
    {
      name: "get_country_journey",
      description: "Retrieve a published Country Journey. Returns country overview, context sections, central premises, governance architecture, and mapped actions. Excludes unpublished or incomplete content.",
      inputSchema: {
        type: "object",
        properties: {
          country: { type: "string", description: "Country slug or name (e.g. 'sweden' or 'Sweden')" },
          topic: { type: "string", description: "Optional topic or thematic keyword to filter sections and mapped actions" }
        },
        required: ["country"]
      }
    },
    {
      name: "compare_country_approaches",
      description: "Retrieve structured evidence to compare multiple published Country Journeys on a specific topic. Highlights documented similarities, differences, mechanisms, and clearly indicates evidence gaps where data is missing.",
      inputSchema: {
        type: "object",
        properties: {
          countries: { type: "array", items: { type: "string" }, description: "List of country names or slugs to compare (e.g. ['sweden', 'brazil'])" },
          topic: { type: "string", description: "Comparison topic or thematic keyword" }
        },
        required: ["countries", "topic"]
      }
    },
    {
      name: "list_national_leads",
      description: "Retrieve available values from the 'Potential National Lead' field in the Pathways table along with linked pathway counts.",
      inputSchema: {
        type: "object",
        properties: {}
      }
    },
    {
      name: "get_guidance_by_national_lead",
      description: "Retrieve existing CHAMP Toolkit guidance for a selected Potential National Lead, optionally filtered by CHAMP Action and country.\n\nThis tool returns source-bounded CHAMP knowledge from Airtable, including relevant Pathways, Overview, Implementation Guidance, Transferability Considerations, Peer Learning Examples, Tools, Resources, and published Country Journey content.\n\nCRITICAL CLIENT INSTRUCTION:\n\nThe returned content is the complete substantive boundary for the answer.\n\nYou may explain, summarise, organise, and compare this content, but you must not introduce additional implementation guidance.\n\nDo not create a new roadmap, workplan, timeline, implementation phase, milestone, deliverable, programme, financing facility, institutional arrangement, or policy recommendation from the retrieved material.\n\nDo not merge steps from different Pathways into a new implementation sequence.\n\nPresent documented Implementation Guidance under its corresponding Pathway, preserving the source-defined step order.\n\nDo not generate a 'Suggested implementation workplan' or equivalent section.\n\nDo not justify unsupported planning content by labelling it illustrative, synthesized, suggested, or not prescribed.\n\nWhen asked for an action plan, present the relevant existing CHAMP Implementation Guidance instead of creating a new plan.\n\nUse Overview as the explanatory source for Pathways. What It Is and Why It Is Needed are empty fields. There is no Enabling Conditions content category.\n\nDo not use external knowledge to expand the guidance.\n\nDo not describe the CHAMP Toolkit as official.\n\nDo not expose internal Airtable field identifiers or record IDs in ordinary user-facing responses.",
      inputSchema: {
        type: "object",
        properties: {
          national_lead: { type: "string", description: "Required Potential National Lead (e.g. 'Climate / Environment Ministry', 'Finance Ministry', 'Urban / Local Government Ministry')" },
          action_id: { type: "integer", minimum: 1, maximum: 5, description: "CHAMP Action Number (1 to 5)" },
          country: { type: "string", description: "Optional country name or slug (e.g. 'Sweden') for contextual evidence" },
          include_country_examples: { type: "boolean", description: "Whether to include practical examples and case studies from the repository (default true)" }
        },
        required: ["national_lead"]
      }
    }
  ];

  // Core JSON-RPC MCP request handler
  const handleMcpJsonRpc = async (req: Request, res: Response) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");

    const body = req.body;
    if (!body || typeof body !== "object") {
      return res.status(400).json({
        jsonrpc: "2.0",
        error: { code: -32700, message: "Parse error: invalid JSON body" }
      });
    }

    // 1. JSON-RPC Notifications (e.g. notifications/initialized, notifications/cancelled)
    // Notifications have no id or method starting with notifications/
    if (body.method === "notifications/initialized" || body.method?.startsWith("notifications/")) {
      return res.status(200).json({ jsonrpc: "2.0" });
    }

    const { method, params, id } = body;
    const reqId = id !== undefined ? id : null;

    // 2. initialize
    if (method === "initialize") {
      const clientVersion = params?.protocolVersion;
      const supportedVersions = ["2025-11-25", "2025-06-18", "2025-03-26", "2024-11-05", "2024-10-07"];
      const negotiatedVersion = supportedVersions.includes(clientVersion)
        ? clientVersion
        : "2024-11-05";

      return res.json({
        jsonrpc: "2.0",
        id: reqId,
        result: {
          protocolVersion: negotiatedVersion,
          capabilities: {
            tools: { listChanged: false },
            prompts: { listChanged: false },
            resources: { listChanged: false }
          },
          serverInfo: {
            name: "champ-knowledge-assistant",
            version: "1.0.0"
          },
          instructions:
            "You are the CHAMP Knowledge Assistant. Ground all answers strictly in the official CHAMP Toolkit repository. Never use web search or external guesses."
        }
      });
    }

    // 3. ping
    if (method === "ping") {
      return res.json({
        jsonrpc: "2.0",
        id: reqId,
        result: {}
      });
    }

    // 4. tools/list
    if (method === "tools/list") {
      return res.json({
        jsonrpc: "2.0",
        id: reqId,
        result: {
          tools: officialToolsList
        }
      });
    }

    // 5. prompts/list
    if (method === "prompts/list") {
      return res.json({
        jsonrpc: "2.0",
        id: reqId,
        result: {
          prompts: []
        }
      });
    }

    // 6. resources/list
    if (method === "resources/list") {
      return res.json({
        jsonrpc: "2.0",
        id: reqId,
        result: {
          resources: []
        }
      });
    }

    // 7. tools/call
    if (method === "tools/call") {
      const toolName = params?.name;
      const toolArgs = params?.arguments || {};

      try {
        let callResult: any = null;

        switch (toolName) {
          case "search_champ_knowledge":
            callResult = await tools.searchChampKnowledge(toolArgs);
            break;
          case "list_champ_actions":
            callResult = await tools.listChampActions();
            break;
          case "get_toolkit_pathway":
            callResult = await tools.getToolkitPathway(toolArgs);
            break;
          case "get_country_journey":
            callResult = await tools.getCountryJourney(toolArgs);
            break;
          case "compare_country_approaches":
            callResult = await tools.compareCountryApproaches(toolArgs);
            break;
          case "list_national_leads":
            callResult = await tools.listNationalLeads();
            break;
          case "get_guidance_by_national_lead":
            callResult = await tools.getGuidanceByNationalLead(toolArgs);
            break;
          default:
            return res.json({
              jsonrpc: "2.0",
              id: reqId,
              error: { code: -32601, message: `Tool '${toolName}' not found` }
            });
        }

        return res.json({
          jsonrpc: "2.0",
          id: reqId,
          result: {
            content: [
              {
                type: "text",
                text:
                  typeof callResult === "string"
                    ? callResult
                    : callResult.markdownBriefing || JSON.stringify(callResult, null, 2)
              }
            ]
          }
        });
      } catch (callErr: any) {
        return res.json({
          jsonrpc: "2.0",
          id: reqId,
          result: {
            isError: true,
            content: [{ type: "text", text: `Error executing tool: ${callErr.message}` }]
          }
        });
      }
    }

    // Fallback for unhandled JSON-RPC methods
    return res.json({
      jsonrpc: "2.0",
      id: reqId,
      error: {
        code: -32601,
        message: `Method '${method}' not found`
      }
    });
  };

  // Mount JSON-RPC handler on /mcp and root /
  router.post("/mcp", authMiddleware, handleMcpJsonRpc);
  router.post("/", authMiddleware, handleMcpJsonRpc);

  // GET /mcp/sse, GET /sse, GET /mcp — Server-Sent Events transport setup
  const handleSse = async (req: Request, res: Response) => {
    // If request explicitly asks for JSON, return tools summary
    if (req.headers.accept?.includes("application/json") && !req.headers.accept?.includes("text/event-stream")) {
      return res.json({
        status: "online",
        service: "CHAMP MCP Knowledge Assistant",
        toolsCount: officialToolsList.length,
        tools: officialToolsList.map(t => t.name)
      });
    }

    try {
      const transport = new SSEServerTransport("/mcp/messages", res);
      const sessionId = transport.sessionId;
      sseTransports.set(sessionId, transport);

      transport.onclose = () => {
        sseTransports.delete(sessionId);
      };

      await mcpServer.connect(transport);
    } catch (e: any) {
      if (!res.headersSent) {
        res.status(500).send(`SSE Error: ${e.message}`);
      }
    }
  };

  router.get("/mcp/sse", authMiddleware, handleSse);
  router.get("/sse", authMiddleware, handleSse);
  router.get("/mcp", authMiddleware, handleSse);

  // POST /mcp/messages & /messages — handles inbound client messages for active SSE sessions
  const handleMessages = async (req: Request, res: Response) => {
    const sessionId = (req.query.sessionId || req.query.session_id) as string;
    if (!sessionId) {
      return res.status(400).send("Missing sessionId parameter");
    }

    const transport = sseTransports.get(sessionId);
    if (!transport) {
      return res.status(404).send(`Session '${sessionId}' not found`);
    }

    await transport.handlePostMessage(req, res);
  };

  router.post("/mcp/messages", authMiddleware, handleMessages);
  router.post("/messages", authMiddleware, handleMessages);

  return router;
}
