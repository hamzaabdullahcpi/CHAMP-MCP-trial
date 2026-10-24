import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { actionsData } from "./src/data/content";
import { defaultCountryJourneys, swedenJourneyDefaultData } from "./src/data/countryJourneysData";
import { defaultChampRoadmapData } from "./src/data/champRoadmapData";
import { defaultChampPledgesData } from "./src/data/champPledgesData";
import { createMcpExpressRouter } from "./src/mcp/server";

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Middleware
  app.use(express.json({ limit: "5mb" }));

  // CORS
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-MCP-Token, X-Requested-With, Accept");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  // Mount MCP router for /health, /mcp, /mcp/sse, and /api/guidance
  app.use("/", createMcpExpressRouter());

  // Cached live actions data container
  let latestActionsData: any[] = actionsData;

  // Helper to sanitize strings
  const sanitizeText = (str: any) => {
    if (!str || typeof str !== 'string') return '';
    return str
      .replace(/\[([^\]]+)\]\(https:\/\/airtable\.com[^)]*\)/g, '$1')
      .replace(/\u00A0/g, ' ')
      .trim();
  };

  // API Route to fetch from Airtable
  app.get("/api/content", async (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    const baseId = process.env.AIRTABLE_BASE_ID;
    const pat = process.env.AIRTABLE_PAT;
    
    if (!baseId || !pat) {
      return res.status(503).json({ error: "Airtable credentials not configured yet." });
    }

    try {
      const fetchTable = async (tableName: string) => {
        let allRecords: any[] = [];
        let offset = '';
        do {
          const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}${offset ? `?offset=${offset}` : ''}`;
          const response = await fetch(url, {
            headers: { Authorization: `Bearer ${pat}` }
          });
          if (!response.ok) throw new Error(`Failed to fetch ${tableName}: ${response.statusText}`);
          const data = await response.json();
          allRecords = allRecords.concat((data as any).records);
          offset = (data as any).offset;
        } while (offset);
        return allRecords;
      };

      const fetchTableSafely = async (tableNameVariants: string[]) => {
        for (const name of tableNameVariants) {
          try {
            const records = await fetchTable(name);
            return records;
          } catch (e) {
            // try next
          }
        }
        return [];
      };

      const [
        actionsRecords,
        pathwaysRecords,
        examplesRecords,
        subExamplesRecords,
        guidanceRecords,
        conceptBoxRecords,
        resourcesRecords,
        homeRecords,
        countryRecords,
        sectionRecords,
        actionRecords,
        roadmapRecords,
        pledgesRecords,
        overviewRecords
      ] = await Promise.all([
        fetchTable('Actions'),
        fetchTable('Pathways'),
        fetchTableSafely(['Key Resources', 'Illustrative Examples', 'Examples']),
        fetchTable('Sub-Examples'),
        fetchTable('Implementation Guidance'),
        fetchTableSafely(['Concept & Explainer Boxes', 'Concept Boxes', 'Explainer Boxes']),
        fetchTableSafely(['Additional Resources', 'Further Resources', 'Resources']),
        fetchTableSafely(['Home Page', 'Landing Page', 'Home Page Content', 'Home Content']),
        fetchTableSafely(['Country Journeys', 'Country Deep Dives', 'Countries']),
        fetchTableSafely(['Country Sections', 'Country Context Sections', 'Journey Sections']),
        fetchTableSafely(['Country Actions', 'Country Journey Actions', 'Journey Actions']),
        fetchTableSafely(['CHAMP Implementation Roadmap', 'Roadmap', 'CHAMP Roadmap']),
        fetchTableSafely(['CHAMP Pledges', 'Pledges', 'CHAMP Pledge']),
        fetchTableSafely(['Country Journeys Overview', 'Country Journeys Page', 'Country Journeys Content', 'Country Journey Overview'])
      ]);

      // Default home page content fallback
      const defaultHomePage = {
        hero: {
          eyebrow: "A toolkit for national governments, cities and friends of CHAMP",
          titleBadge: "CHAMP",
          titleMain: "Toolkit",
          titleSub: "for Multilevel Climate governance and finance.",
          description: "Supporting the ‘CHAMP Investment Pledge’ delivery through guidance on policy reform, governance, investment pipelines, project aggregation and financial instruments.",
          imageUrl: "https://plus.unsplash.com/premium_photo-1697729968500-d0c63fd49bfa?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
          supportedByLogoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Flag_of_Sweden.svg/3840px-Flag_of_Sweden.svg.png"
        },
        howToUse: {
          title: "How to Use the Toolkit",
          intro: "The CHAMP Toolkit is designed primarily for national governments, working with cities and subnational authorities, Friends of CHAMP and development partners, to mobilize finance for implementation of urban and subnational climate action.\n\nExplore the 5 Actions — each containing Implementation Pathways, practical guidance, tools and illustrative examples.",
          items: [
            {
              name: "Actions",
              heading: "Start with what needs to happen.",
              description: "Five interconnected areas of action that help national and subnational governments strengthen the governance, investment and implementation systems needed to deliver CHAMP commitments."
            },
            {
              name: "Implementation Pathways",
              heading: "Choose a way to put the Action into practice.",
              description: "Practical approaches to finance and implementation that national governments and their partners can adapt to their context."
            },
            {
              name: "Implementation Guidance",
              heading: "Follow practical guidance for each pathway.",
              description: "Key steps and considerations to help national governments and partners apply the pathways. Implementation guidance will include Illustrative Examples showing real-world applications of each Implementation Pathway and Tools, which are practical frameworks and resources supporting the implementation."
            },
            {
              name: "Country Journeys",
              heading: "See how the pieces connect.",
              description: "Deeper country examples showing how multiple Actions and pathways connect across levels of government as part of a wider climate governance, investment and implementation system."
            }
          ]
        }
      };

      // Parse Home Page records
      const homePageContent = {
        ...defaultHomePage,
        hero: { ...defaultHomePage.hero },
        partnership: { ...defaultHomePage.partnership },
        howToUse: {
          ...defaultHomePage.howToUse,
          items: defaultHomePage.howToUse.items.map(it => ({ ...it }))
        }
      };
      if (homeRecords && homeRecords.length > 0) {
        for (const record of homeRecords) {
          const f = record.fields || {};
          const key = String(f["Item Key"] || f["Key"] || f["Element Key"] || f["Label / Element"] || "").toLowerCase().trim();
          const text = sanitizeText(f["Text Content"] || f["Content"] || f["Text"] || f["Value"] || "");
          const subText = sanitizeText(f["Sub-Text / Secondary"] || f["Sub-Text"] || f["Secondary"] || f["Subtitle"] || f["Badge"] || "");
          const url = sanitizeText(f["Image / Link URL"] || f["Image URL"] || f["URL"] || f["Link"] || "");

          if (key.includes("hero_eyebrow") || key.includes("eyebrow") || key.includes("tag")) {
            if (text) homePageContent.hero.eyebrow = text;
          } else if (key.includes("hero_title") || key.includes("main title")) {
            if (text) homePageContent.hero.titleMain = text;
            if (subText) homePageContent.hero.titleBadge = subText;
          } else if (key.includes("hero_subtitle") || key.includes("subtitle")) {
            if (text) homePageContent.hero.titleSub = text;
          } else if (key.includes("hero_description") || key.includes("hero description") || key.includes("intro paragraph")) {
            if (text) homePageContent.hero.description = text;
          } else if (key.includes("hero_image") || key.includes("background image")) {
            if (url) homePageContent.hero.imageUrl = url;
            else if (text && text.startsWith("http")) homePageContent.hero.imageUrl = text;
          } else if (key.includes("partnership_title") || key.includes("partnership section title") || key.includes("contribution title")) {
            if (text) homePageContent.partnership.title = text;
          } else if (key.includes("partnership_description") || key.includes("partnership body") || key.includes("partnership desc")) {
            if (text) homePageContent.partnership.description = text;
          } else if (key.includes("learn_more_ccfla") || key.includes("partner_1_link") || key.includes("ccfla_link") || key.includes("partner_1_url")) {
            if (text) homePageContent.partnership.partner1Name = text;
            if (url) homePageContent.partnership.partner1Url = url;
            else if (text && (text.startsWith("http://") || text.startsWith("https://"))) homePageContent.partnership.partner1Url = text;
          } else if (key.includes("learn_more_viable") || key.includes("partner_2_link") || key.includes("viable_cities_link") || key.includes("partner_2_url")) {
            if (text) homePageContent.partnership.partner2Name = text;
            if (url) homePageContent.partnership.partner2Url = url;
            else if (text && (text.startsWith("http://") || text.startsWith("https://"))) homePageContent.partnership.partner2Url = text;
          } else if (key.includes("learn_more_label") || key.includes("learn_more_title") || key.includes("learn more text")) {
            if (text) homePageContent.partnership.learnMoreLabel = text;
          } else if (key.includes("partner_1") || key.includes("partner 1") || key.includes("ccfla")) {
            if (text) homePageContent.partnership.partner1Name = text;
            if (url) homePageContent.partnership.partner1LogoUrl = url;
            if (subText && (subText.startsWith("http://") || subText.startsWith("https://"))) {
              homePageContent.partnership.partner1Url = subText;
            }
          } else if (key.includes("partner_2") || key.includes("partner 2") || key.includes("viable cities")) {
            if (text) homePageContent.partnership.partner2Name = text;
            if (url) homePageContent.partnership.partner2LogoUrl = url;
            if (subText && (subText.startsWith("http://") || subText.startsWith("https://"))) {
              homePageContent.partnership.partner2Url = subText;
            }
          } else if (key.includes("supported_by") || key.includes("supported by") || key.includes("sponsor") || key.includes("sweden")) {
            if (text) homePageContent.partnership.supportedByName = text;
            if (subText) homePageContent.partnership.supportedByLabel = subText;
            if (url) homePageContent.partnership.supportedByLogoUrl = url;
          } else if (key.includes("how_to_use_intro") || key.includes("how_to_use_text") || key.includes("how to use: intro") || key.includes("how to use intro")) {
            if (text && homePageContent.howToUse) homePageContent.howToUse.intro = text;
          } else if (key.includes("how_to_use_title") || key.includes("how to use: modal title") || key.includes("how to use title")) {
            if (text && homePageContent.howToUse) homePageContent.howToUse.title = text;
          } else if (key.includes("how_to_use_actions") || key.includes("how_to_use_item_1") || key.includes("how to use: actions") || key === "actions") {
            if (homePageContent.howToUse) {
              const item = homePageContent.howToUse.items.find(i => i.name === "Actions");
              if (item) {
                if (subText) item.heading = subText;
                if (text) item.description = text;
              }
            }
          } else if (key.includes("how_to_use_pathways") || key.includes("how_to_use_item_2") || key.includes("how to use: implementation pathways") || key.includes("how to use: pathways")) {
            if (homePageContent.howToUse) {
              const item = homePageContent.howToUse.items.find(i => i.name === "Implementation Pathways");
              if (item) {
                if (subText) item.heading = subText;
                if (text) item.description = text;
              }
            }
          } else if (key.includes("how_to_use_guidance") || key.includes("how_to_use_item_3") || key.includes("how to use: implementation guidance") || key.includes("how to use: guidance")) {
            if (homePageContent.howToUse) {
              const item = homePageContent.howToUse.items.find(i => i.name === "Implementation Guidance");
              if (item) {
                if (subText) item.heading = subText;
                if (text) item.description = text;
              }
            }
          } else if (key.includes("how_to_use_journeys") || key.includes("how_to_use_item_4") || key.includes("how to use: country journeys") || key.includes("how to use: journeys")) {
            if (homePageContent.howToUse) {
              const item = homePageContent.howToUse.items.find(i => i.name === "Country Journeys");
              if (item) {
                if (subText) item.heading = subText;
                if (text) item.description = text;
              }
            }
          }
        }
      }

      // Stitch Part 1 Actions together
      const formattedActions = actionsRecords.map((a: any) => {
        const actionId = a.fields["Action Number"] || 0;
        const actionTitle = sanitizeText(a.fields["Title"] || "Untitled Action");
        const actionDesc = sanitizeText(a.fields["Description"] || "");
        const systemsLogic = sanitizeText(a.fields["Systems Logic"] || "");
        
        // Find pathways linked to this action
        const myPathways = pathwaysRecords.filter((p: any) => {
            const linkedAction = p.fields["Belongs to Action"];
            return linkedAction && linkedAction.includes(a.id);
        }).sort((x: any, y: any) => {
            const titleX = sanitizeText(x.fields["Pathway Title"] || x.fields["Title"] || "");
            const titleY = sanitizeText(y.fields["Pathway Title"] || y.fields["Title"] || "");
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
            const pathwayTitle = sanitizeText(p.fields["Pathway Title"] || "Untitled Pathway");
            const pathwayDesc = sanitizeText(p.fields["Overview"] || "");
            const whatItIs = sanitizeText(p.fields["What it is"] || "");
            const whyItIsNeeded = sanitizeText(p.fields["Why it is needed"] || "");
            const orderNum = Number(p.fields["Order"]) || 0;
            const rawLead = p.fields["Potential National Lead"];
            const potentialNationalLead = Array.isArray(rawLead)
                ? rawLead.map((act: any) => sanitizeText(act)).filter(Boolean)
                : rawLead
                ? [sanitizeText(rawLead)]
                : undefined;
            const keyActors = (p.fields["Key Actors"] || []).map((act: any) => sanitizeText(act)).filter(Boolean);
            const transferability = (p.fields["Transferability Considerations"] || "").split(/\r?\n/).map((s:string) => sanitizeText(s.replace(/^(?:[-*+•—–·◦⁃]|\d+\.)\s*/, ''))).filter(Boolean);
            const enablingConditions = (p.fields["Enabling Conditions"] || "").split(/\r?\n/).map((s:string) => sanitizeText(s.replace(/^(?:[-*+•—–·◦⁃]|\d+\.)\s*/, ''))).filter(Boolean);
            
            // Find guidance linked to this pathway
            const myGuidance = guidanceRecords.filter((g: any) => {
                const linkedPathway = g.fields["Belongs to Pathway"];
                return linkedPathway && linkedPathway.includes(p.id);
            }).sort((a:any, b:any) => (a.fields["Step Order"] || 0) - (b.fields["Step Order"] || 0))
            .map((g: any) => ({
                title: sanitizeText(g.fields["Step Title"] || "Untitled Step"),
                content: sanitizeText(g.fields["Detailed Content"] || "")
            }));

            // Find examples linked to this pathway
            const myExamples = examplesRecords.filter((e: any) => {
                const linkedPathway = e.fields["Belongs to Pathway"];
                return linkedPathway && linkedPathway.includes(p.id);
            }).map((e: any) => {
                const mySubExamples = subExamplesRecords.filter((sub: any) => {
                    const linkedExample = sub.fields["Belongs to Parent Example"];
                    return linkedExample && linkedExample.includes(e.id);
                }).map((sub: any) => ({
                    title: sanitizeText(sub.fields["Sub-Example Title"] || "Untitled Sub-Example"),
                    excerpt: sanitizeText(sub.fields["Excerpt"] || ""),
                    fullText: sanitizeText(sub.fields["Full Text"] || ""),
                    link: (sub.fields["Learn More URL"] || "").trim()
                }));

                const connectionLine = sanitizeText(
                    e.fields["Why see this / When to use this"] ||
                    e.fields["When to use this / Why see this"] ||
                    e.fields["Connection Line"] ||
                    e.fields["Contextual Guidance"] ||
                    e.fields["Guidance Note"] ||
                    ""
                );

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
                    title: sanitizeText(e.fields["Example Title"] || e.fields["Title"] || "Untitled Example"),
                    type: sanitizeText(e.fields["Type"] || e.fields["Resource Type"] || "Illustrative Example"),
                    excerpt: sanitizeText(e.fields["Excerpt"] || ""),
                    fullText: sanitizeText(e.fields["Full Text / Concept Explanation"] || e.fields["Full Text"] || ""),
                    link: (e.fields["Learn More URL"] || "").trim(),
                    connectionLine: connectionLine || undefined,
                    order,
                    subExamples: mySubExamples.length > 0 ? mySubExamples : undefined
                };
            }).sort((a: any, b: any) => (a.order ?? 9999) - (b.order ?? 9999));

            // Find concept boxes linked to this pathway
            const myConceptBoxes = conceptBoxRecords.filter((cb: any) => {
                const linkedPathway = cb.fields["Belongs to Pathway"];
                return linkedPathway && linkedPathway.includes(p.id);
            }).sort((a: any, b: any) => (a.fields["Order"] || 0) - (b.fields["Order"] || 0))
            .map((cb: any) => ({
                title: sanitizeText(cb.fields["Box Title"] || cb.fields["Title"] || "Untitled Box"),
                category: sanitizeText(cb.fields["Tag / Category"] || cb.fields["Category"] || "Core Concept"),
                excerpt: sanitizeText(cb.fields["Excerpt / Summary"] || cb.fields["Excerpt"] || ""),
                fullText: sanitizeText(cb.fields["Full Text / Explanation"] || cb.fields["Full Text"] || cb.fields["Detailed Content"] || ""),
                section: sanitizeText(cb.fields["Placement / Section"] || cb.fields["Section"] || "Illustrative Examples"),
                link: (cb.fields["Learn More URL"] || cb.fields["Link"] || "").trim(),
                order: cb.fields["Order"] || 0
            }));

            // Find resources linked to this pathway
            const myResources = resourcesRecords.filter((r: any) => {
                const linkedPathway = r.fields["Pathway"] || r.fields["Belongs to Pathway"];
                return linkedPathway && linkedPathway.includes(p.id);
            }).sort((a: any, b: any) => (Number(a.fields["Order"]) || 0) - (Number(b.fields["Order"]) || 0))
            .map((r: any) => ({
                title: sanitizeText(r.fields["Resource Title"] || r.fields["Title"] || "Untitled Resource"),
                type: sanitizeText(r.fields["Resource Type"] || r.fields["Type"] || "Report / Study"),
                publisher: sanitizeText(r.fields["Publisher / Organization"] || r.fields["Publisher"] || ""),
                link: (r.fields["Resource Link"] || r.fields["Link"] || r.fields["URL"] || "").trim(),
                description: sanitizeText(r.fields["Description"] || r.fields["Summary"] || ""),
                order: Number(r.fields["Order"]) || 0
            }));

            return {
                title: pathwayTitle,
                overview: pathwayDesc,
                whatItIs,
                whyItIsNeeded,
                potentialNationalLead: potentialNationalLead && potentialNationalLead.length > 0 ? potentialNationalLead : undefined,
                keyActors,
                transferability,
                enablingConditions,
                order: orderNum,
                implementationGuidance: myGuidance.length > 0 ? myGuidance : undefined,
                illustrativeExamples: myExamples.length > 0 ? myExamples : undefined,
                conceptBoxes: myConceptBoxes.length > 0 ? myConceptBoxes : undefined,
                resources: myResources.length > 0 ? myResources : undefined
            };
        });

        return {
            id: actionId,
            title: actionTitle,
            description: actionDesc,
            systemsLogic: systemsLogic,
            pathways: myPathways
        };
      });

      formattedActions.sort((a: any, b: any) => a.id - b.id);
      if (formattedActions.length > 0) {
        latestActionsData = formattedActions;
      }

      // Parse Country Journeys records
      let countryJourneys = [...defaultCountryJourneys];
      if (countryRecords && countryRecords.length > 0) {
        countryJourneys = countryRecords.map((cRec: any) => {
          const f = cRec.fields || {};
          const published = f["Published"] === true || f["Show in Toolkit"] === true;
          if (!published) return null;

          const countryId = String(f["Country ID"] || f["Slug"] || f["Country"] || "").toLowerCase().trim();
          if (!countryId) return null;

          const fallback = defaultCountryJourneys.find(d => d.countryId === countryId) || swedenJourneyDefaultData;

          const countryName = sanitizeText(f["Country Name"] || f["Country"] || fallback.countryName);
          const flag = sanitizeText(f["Flag Emoji"] || f["Flag"] || fallback.flag);
          const status = sanitizeText(f["Status"] || fallback.status);
          const isReady = f["Is Ready"] !== undefined ? Boolean(f["Is Ready"]) : (status === "Available");
          const order = Number(f["Order"]) || fallback.order || 99;
          const tagline = sanitizeText(f["Tagline"] || fallback.tagline);
          const summary = sanitizeText(f["Summary"] || fallback.summary);

          let keyMechanisms: string[] = fallback.keyMechanisms || [];
          const rawHighlights = f["Key Highlights"] !== undefined ? f["Key Highlights"] : f["Key Mechanisms"];
          if (rawHighlights !== undefined) {
            if (Array.isArray(rawHighlights)) keyMechanisms = rawHighlights.map((s: any) => sanitizeText(s)).filter(Boolean);
            else keyMechanisms = String(rawHighlights).split(/\r?\n|,/).map(s => sanitizeText(s.replace(/^[•\-\*]\s*/, ''))).filter(Boolean);
          }

          let cardImage = sanitizeText(f["Card Image URL"] || f["Cover Image"] || f["Card Image"] || fallback.cardImage);
          if (Array.isArray(f["Card Image Attachment"]) && f["Card Image Attachment"].length > 0) {
            cardImage = f["Card Image Attachment"][0].url;
          }

          const themeColor = sanitizeText(f["Theme Color"] || fallback.themeColor);

          // Diagram image: fallback to hardcoded if not present
          let diagramImageUrl = sanitizeText(f["Diagram Image URL"] || f["Diagram Image"] || "");
          if (Array.isArray(f["Diagram Attachment"]) && f["Diagram Attachment"].length > 0) {
            diagramImageUrl = f["Diagram Attachment"][0].url;
          }
          if (!diagramImageUrl && fallback.diagramImageUrl) {
            diagramImageUrl = fallback.diagramImageUrl;
          }

          // Process Sections & Premises
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
                  title: sanitizeText(sf["Title"] || sf["Section Title"] || ""),
                  description: sanitizeText(sf["Content"] || sf["Description"] || ""),
                });
              } else {
                const paragraphs = (sf["Content"] || sf["Paragraphs"] || "")
                  .split(/\n\n+/)
                  .map((p: string) => sanitizeText(p))
                  .filter(Boolean);

                let bulletPoints: { label?: string; text: string }[] = [];
                if (sf["Bullet Points"]) {
                  const rawBullets = String(sf["Bullet Points"]).split(/\r?\n/).filter(Boolean);
                  bulletPoints = rawBullets.map(b => {
                    const cleaned = sanitizeText(b.replace(/^[•\-\*]\s*/, ''));
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
                  title: sanitizeText(sf["Title"] || sf["Section Title"] || ""),
                  paragraphs: paragraphs.length > 0 ? paragraphs : undefined,
                  bulletPoints: bulletPoints.length > 0 ? bulletPoints : undefined,
                });
              }
            }
          }

          // Process Actions
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
                .map((p: string) => sanitizeText(p))
                .filter(Boolean);

              let caseStudy: any = undefined;
              if (af["Case Study Title"] || af["Case Study Content"]) {
                caseStudy = {
                  title: sanitizeText(af["Case Study Title"] || "Case Study"),
                  paragraphs: (af["Case Study Content"] || "")
                    .split(/\n\n+/)
                    .map((p: string) => sanitizeText(p))
                    .filter(Boolean),
                };
              }

              return {
                actionNumber,
                actionThemeTitle: sanitizeText(af["Action Theme Tag"] || af["Theme"] || ""),
                title: sanitizeText(af["Title"] || af["Action Title"] || `Action ${actionNumber}`),
                paragraphs,
                caseStudy,
                enabledSummary: sanitizeText(af["Enabled & Opportunity"] || af["Enabled Summary"] || af["Opportunity"] || ""),
              };
            });
          }

          return {
            order,
            published: true,
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
            headerTitle: sanitizeText(f["Header Title"] || fallback.headerTitle),
            headerSubtitle: sanitizeText(f["Header Subtitle"] || fallback.headerSubtitle),
            headerDescription: sanitizeText(f["Header Description"] || fallback.headerDescription),
            tabATitle: sanitizeText(f["Tab A Title"] || fallback.tabATitle),
            tabASubtitle: sanitizeText(f["Tab A Subtitle"] || fallback.tabASubtitle),
            premisesHeading: sanitizeText(f["Premises Heading"] || fallback.premisesHeading),
            premisesIntro: sanitizeText(f["Premises Intro"] || fallback.premisesIntro),
            premises: premises.length > 0 ? premises : fallback.premises,
            contextSections: contextSections.length > 0 ? contextSections : fallback.contextSections,
            tabBTitle: sanitizeText(f["Tab B Title"] || fallback.tabBTitle),
            tabBSubtitle: sanitizeText(f["Tab B Subtitle"] || fallback.tabBSubtitle),
            modelHeading: sanitizeText(f["Model Heading"] || fallback.modelHeading),
            modelOverview: sanitizeText(f["Model Overview"] || fallback.modelOverview),
            modelDiagramNote: sanitizeText(f["Model Diagram Note"] || fallback.modelDiagramNote),
            diagramImageUrl,
            diagramImageAlt: sanitizeText(f["Diagram Image Alt"] || fallback.diagramImageAlt),
            actionsHeading: sanitizeText(f["Actions Heading"] || fallback.actionsHeading),
            actionsSubtitle: sanitizeText(f["Actions Subtitle"] || fallback.actionsSubtitle),
            actions: actions.length > 0 ? actions : fallback.actions,
          };
        }).filter(Boolean);

        countryJourneys.sort((a: any, b: any) => (a.order ?? 99) - (b.order ?? 99));
      }

      // Parse Roadmap
      let roadmapPillars = defaultChampRoadmapData;
      if (roadmapRecords && roadmapRecords.length > 0) {
        const ACTION_MAPPING: Record<string, number[]> = {
          "1.1": [1, 3], "1.2": [1, 2], "1.3": [6],
          "2.1": [2, 3], "2.2": [6], "2.3": [6],
          "3.1": [1, 3, 4], "3.2": [4], "3.3": [2, 5, 6]
        };
        const pillarsMap = new Map<number, any>();
        for (const p of defaultChampRoadmapData) {
          pillarsMap.set(p.number, { ...p, activities: [] });
        }
        for (const rec of roadmapRecords) {
          const f = rec.fields || {};
          const code = String(f["Activity Code"] || f["Code"] || "").trim();
          if (!code) continue;
          const pillarNum = Number(f["Pillar Number"]) || parseInt(code.charAt(0)) || 1;
          let pillar = pillarsMap.get(pillarNum);
          if (pillar) {
            if (f["Pillar Title"]) pillar.title = sanitizeText(f["Pillar Title"]);
            if (f["Pillar Goal"]) pillar.goal = sanitizeText(f["Pillar Goal"]);
            if (f["Lead Responsibility"]) pillar.leadResponsibility = sanitizeText(f["Lead Responsibility"]);
            if (f["Pillar Overview"]) pillar.overview = sanitizeText(f["Pillar Overview"]);
            const rawBullets = f["Detailed Bullets"] || f["Bullets"] || "";
            let bullets: string[] = [];
            if (typeof rawBullets === 'string') {
              bullets = rawBullets.split(/\r?\n/).map((b: string) => b.replace(/^[•\-\*]\s*/, '').trim()).filter(Boolean);
            }
            const fallbackAct = defaultChampRoadmapData.find(p => p.number === pillarNum)?.activities.find(a => a.code === code);
            pillar.activities.push({
              code,
              title: sanitizeText(f["Activity Title"] || fallbackAct?.title || code),
              bullets: bullets.length > 0 ? bullets : (fallbackAct?.bullets || []),
              actionIds: fallbackAct?.actionIds || ACTION_MAPPING[code] || []
            });
          }
        }
        const builtPillars = [1, 2, 3].map(num => pillarsMap.get(num)).filter(Boolean);
        if (builtPillars.some(p => p.activities.length > 0)) {
          roadmapPillars = builtPillars;
        }
      }

      // Parse Pledges
      let champPledges = defaultChampPledgesData;
      if (pledgesRecords && pledgesRecords.length > 0) {
        const sortedPledges = [...pledgesRecords].sort((a, b) => {
          const oA = Number(a.fields?.["Order"] ?? a.fields?.["Pledge Number"] ?? 0);
          const oB = Number(b.fields?.["Order"] ?? b.fields?.["Pledge Number"] ?? 0);
          return oA - oB;
        });
        champPledges = sortedPledges.map((r, idx) => {
          const f = r.fields || {};
          const num = Number(f["Pledge Number"]) || (idx + 1);
          const label = sanitizeText(f["Pledge Label"] || `Pledge 0${num}`);
          const fallback = defaultChampPledgesData.find(p => p.id === num) || defaultChampPledgesData[idx] || defaultChampPledgesData[0];
          return {
            id: num,
            number: label,
            title: sanitizeText(f["Title"] || fallback.title),
            shortDesc: sanitizeText(f["Short Description"] || fallback.shortDesc),
            fullText: sanitizeText(f["Full Text"] || fallback.fullText),
            isInvestment: Boolean(f["Is Investment Focus"] ?? fallback.isInvestment),
            order: Number(f["Order"]) || num
          };
        });
      }

      // Default Country Journeys Overview content fallback
      const defaultCountryJourneysOverview = {
        badge: "Country Journeys",
        title: "Country Journeys",
        introP1: "The Country Journeys contain deep dive analysis grounded in real-world contexts, showcasing institutional relationships, learning loops, implementation cycles, accountability mechanisms, and enabling conditions required to implement and scale Implementation Pathways across different countries.",
        introP2: "Country Journeys are intended not only to document implementation approaches, but also to showcase how cities, regions and national governments have co-developed practical solutions that can inform other CHAMP countries.",
        focusNote: "Special focus on the interactions between institutions and programs, governance capabilities, intermediary functions, financing and implementation platforms, and feedback loops required to sustain long-term climate investment.",
        featuredSectionTitle: "Featured Country Journeys"
      };

      const countryJourneysOverview = { ...defaultCountryJourneysOverview };
      if (overviewRecords && overviewRecords.length > 0) {
        for (const record of overviewRecords) {
          const f = record.fields || {};
          const key = String(f["Item Key"] || f["Key"] || f["Element Key"] || f["Label / Element"] || "").toLowerCase().trim();
          const text = sanitizeText(f["Text Content"] || f["Content"] || f["Text"] || f["Value"] || "");
          const subText = sanitizeText(f["Sub-Text / Secondary"] || f["Sub-Text"] || f["Secondary"] || f["Subtitle"] || "");

          if (!text && !subText) continue;

          if (key.includes("page_eyebrow") || key.includes("eyebrow") || key.includes("badge") || key.includes("tag")) {
            countryJourneysOverview.badge = text || subText;
          } else if (key.includes("page_title") || key.includes("main_title") || key.includes("main page title") || key === "title") {
            countryJourneysOverview.title = text;
          } else if (key.includes("intro_p1") || key.includes("paragraph 1") || key.includes("intro p1") || key.includes("intro 1")) {
            countryJourneysOverview.introP1 = text;
          } else if (key.includes("intro_p2") || key.includes("paragraph 2") || key.includes("intro p2") || key.includes("intro 2")) {
            countryJourneysOverview.introP2 = text;
          } else if (key.includes("focus_note") || key.includes("focus note") || key.includes("callout") || key.includes("special focus")) {
            countryJourneysOverview.focusNote = text;
          } else if (key.includes("featured_section_title") || key.includes("featured title") || key.includes("featured section") || key.includes("case studies")) {
            countryJourneysOverview.featuredSectionTitle = text;
          }
        }
      }

      res.json({
        success: true,
        formattedActions,
        homePageContent,
        countryJourneys,
        countryJourneysOverview,
        roadmapPillars,
        champPledges
      });
    } catch (error: any) {
      console.error("Airtable fetch error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
