const fs = require('fs');
const path = require('path');
const https = require('https');

// Load environment variables from .env if present
try {
  require('dotenv').config();
} catch (e) {}

const baseId = process.env.AIRTABLE_BASE_ID || process.env.VITE_AIRTABLE_BASE_ID;
const pat = process.env.AIRTABLE_PAT || process.env.VITE_AIRTABLE_PAT || process.env.AIRTABLE_API_KEY;

const outDir = path.join(__dirname, 'public', 'api');
const outFile = path.join(outDir, 'content.json');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function fetchAirtableJson(url, token) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`Failed to parse JSON response: ${e.message}`));
          }
        } else {
          reject(new Error(`Airtable HTTP error ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Airtable request timed out'));
    });
    req.end();
  });
}

async function fetchTable(tableName, base, token) {
  let allRecords = [];
  let offset = '';
  do {
    const url = `https://api.airtable.com/v0/${base}/${encodeURIComponent(tableName)}${offset ? `?offset=${offset}` : ''}`;
    const data = await fetchAirtableJson(url, token);
    allRecords = allRecords.concat(data.records || []);
    offset = data.offset;
  } while (offset);
  return allRecords;
}

function sanitizeText(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/\[([^\]]+)\]\(https:\/\/airtable\.com[^)]*\)/g, '$1')
    .replace(/\u00A0/g, ' ')
    .trim();
}

function formatAirtableData(actionsRecords, pathwaysRecords, guidanceRecords, examplesRecords, subExamplesRecords, conceptBoxRecords = [], resourcesRecords = []) {
  const formattedActions = actionsRecords.map((a) => {
    const actionId = a.fields['Action Number'] || 0;
    const actionTitle = sanitizeText(a.fields['Title'] || 'Untitled Action');
    const actionDesc = sanitizeText(a.fields['Description'] || '');
    const systemsLogic = sanitizeText(a.fields['Systems Logic'] || '');

    const myPathways = pathwaysRecords
      .filter((p) => {
        const linkedAction = p.fields['Belongs to Action'];
        return linkedAction && linkedAction.includes(a.id);
      })
      .sort((x, y) => (Number(x.fields['Order']) || 99) - (Number(y.fields['Order']) || 99))
      .map((p) => {
        const pathwayTitle = sanitizeText(p.fields['Pathway Title'] || 'Untitled Pathway');
        const pathwayDesc = sanitizeText(p.fields['Overview'] || '');
        const whatItIs = sanitizeText(p.fields['What it is'] || '');
        const whyItIsNeeded = sanitizeText(p.fields['Why it is needed'] || '');
        const orderNum = Number(p.fields['Order']) || 0;
        const keyActors = (p.fields['Key Actors'] || []).map((act) => sanitizeText(act));
        const transferability = (p.fields['Transferability Considerations'] || '')
          .split(/\r?\n/)
          .map((s) => sanitizeText(s.replace(/^(?:[-*+•—–·◦⁃]|\d+\.)\s*/, '')))
          .filter(Boolean);
        const enablingConditions = (p.fields['Enabling Conditions'] || '')
          .split(/\r?\n/)
          .map((s) => sanitizeText(s.replace(/^(?:[-*+•—–·◦⁃]|\d+\.)\s*/, '')))
          .filter(Boolean);

        const myGuidance = guidanceRecords
          .filter((g) => {
            const linkedPathway = g.fields['Belongs to Pathway'];
            return linkedPathway && linkedPathway.includes(p.id);
          })
          .sort((x, y) => (x.fields['Step Order'] || 0) - (y.fields['Step Order'] || 0))
          .map((g) => {
            const rawTitle = sanitizeText(g.fields['Step Title'] || '');
            const rawContent = sanitizeText(g.fields['Detailed Content'] || '');
            return {
              title: rawTitle || 'Untitled Step',
              content: rawContent || '',
            };
          });

        const myExamples = examplesRecords
          .filter((e) => {
            const linkedPathway = e.fields['Belongs to Pathway'];
            return linkedPathway && linkedPathway.includes(p.id);
          })
          .map((e) => {
            const mySubExamples = subExamplesRecords
              .filter((sub) => {
                const linkedExample = sub.fields['Belongs to Parent Example'];
                return linkedExample && linkedExample.includes(e.id);
              })
              .map((sub) => ({
                title: sanitizeText(sub.fields['Sub-Example Title'] || 'Untitled Sub-Example'),
                excerpt: sanitizeText(sub.fields['Excerpt'] || ''),
                fullText: sanitizeText(sub.fields['Full Text'] || ''),
                link: (sub.fields['Learn More URL'] || '').trim(),
              }));

            return {
              title: sanitizeText(e.fields['Example Title'] || e.fields['Title'] || 'Untitled Example'),
              type: sanitizeText(e.fields['Type'] || e.fields['Resource Type'] || 'Illustrative Example'),
              excerpt: sanitizeText(e.fields['Excerpt'] || ''),
              fullText: sanitizeText(e.fields['Full Text / Concept Explanation'] || e.fields['Full Text'] || ''),
              link: (e.fields['Learn More URL'] || '').trim(),
              subExamples: mySubExamples.length > 0 ? mySubExamples : undefined,
            };
          });

        const myConceptBoxes = conceptBoxRecords
          .filter((cb) => {
            const linkedPathway = cb.fields['Belongs to Pathway'];
            return linkedPathway && linkedPathway.includes(p.id);
          })
          .sort((x, y) => (x.fields['Order'] || 0) - (y.fields['Order'] || 0))
          .map((cb) => ({
            title: sanitizeText(cb.fields['Box Title'] || cb.fields['Title'] || 'Untitled Box'),
            category: sanitizeText(cb.fields['Tag / Category'] || cb.fields['Category'] || 'Core Concept'),
            excerpt: sanitizeText(cb.fields['Excerpt / Summary'] || cb.fields['Excerpt'] || ''),
            fullText: sanitizeText(cb.fields['Full Text / Explanation'] || cb.fields['Full Text'] || cb.fields['Detailed Content'] || ''),
            section: cb.fields['Placement / Section'] || cb.fields['Section'] || 'Illustrative Examples',
            link: (cb.fields['Learn More URL'] || cb.fields['Link'] || '').trim(),
            order: cb.fields['Order'] || 0,
          }));

        const myResources = resourcesRecords
          .filter((r) => {
            const linkedPathway = r.fields['Pathway'] || r.fields['Belongs to Pathway'];
            return linkedPathway && linkedPathway.includes(p.id);
          })
          .sort((x, y) => (Number(x.fields['Order']) || 0) - (Number(y.fields['Order']) || 0))
          .map((r) => ({
            title: sanitizeText(r.fields['Resource Title'] || r.fields['Title'] || 'Untitled Resource'),
            type: sanitizeText(r.fields['Resource Type'] || r.fields['Type'] || 'Report / Study'),
            publisher: sanitizeText(r.fields['Publisher / Organization'] || r.fields['Publisher'] || ''),
            link: (r.fields['Resource Link'] || r.fields['Link'] || r.fields['URL'] || '').trim(),
            description: sanitizeText(r.fields['Description'] || r.fields['Summary'] || ''),
            order: Number(r.fields['Order']) || 0,
          }));

        return {
          title: pathwayTitle,
          overview: pathwayDesc,
          whatItIs,
          whyItIsNeeded,
          keyActors,
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
      systemsLogic: systemsLogic,
      pathways: myPathways,
    };
  });

  formattedActions.sort((a, b) => a.id - b.id);
  return formattedActions;
}

async function fetchTableSafely(tableNameVariants, base, token) {
  for (const name of tableNameVariants) {
    try {
      const records = await fetchTable(name, base, token);
      return records;
    } catch (e) {
      // try next variant
    }
  }
  return [];
}

function formatHomePageData(homeRecords = []) {
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
      partner2Name: "Viable Cities",
      partner2LogoUrl: "https://images.squarespace-cdn.com/content/v1/59e86b55aeb625e2140eec1a/1634044375194-3G0ZG1T5HGMGNB2QSEYU/1.+VC_Logotyp_PRIM%C3%84R_RGB.png",
      supportedByLabel: "Supported by",
      supportedByName: "Sweden",
      supportedByLogoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Flag_of_Sweden.svg/3840px-Flag_of_Sweden.svg.png"
    }
  };

  const result = {
    hero: { ...defaultHomePage.hero },
    partnership: { ...defaultHomePage.partnership }
  };

  if (!homeRecords || homeRecords.length === 0) return result;

  for (const record of homeRecords) {
    const f = record.fields || {};
    const key = String(f["Item Key"] || f["Key"] || f["Element Key"] || f["Label / Element"] || "").toLowerCase().trim();
    const text = sanitizeText(f["Text Content"] || f["Content"] || f["Text"] || f["Value"] || "");
    const subText = sanitizeText(f["Sub-Text / Secondary"] || f["Sub-Text"] || f["Secondary"] || f["Subtitle"] || f["Badge"] || "");
    const url = sanitizeText(f["Image / Link URL"] || f["Image URL"] || f["URL"] || f["Link"] || "");

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
    } else if (key.includes("partner_1") || key.includes("partner 1") || key.includes("ccfla")) {
      if (text) result.partnership.partner1Name = text;
      if (url) result.partnership.partner1LogoUrl = url;
    } else if (key.includes("partner_2") || key.includes("partner 2") || key.includes("viable cities")) {
      if (text) result.partnership.partner2Name = text;
      if (url) result.partnership.partner2LogoUrl = url;
    } else if (key.includes("supported_by") || key.includes("supported by") || key.includes("sponsor") || key.includes("sweden")) {
      if (text) result.partnership.supportedByName = text;
      if (subText) result.partnership.supportedByLabel = subText;
      if (url) result.partnership.supportedByLogoUrl = url;
    }
  }

  return result;
}

function formatCountryJourneysData(countryRecords = [], sectionRecords = [], actionRecords = []) {
  // If no records from airtable, we return null to let defaultCountryJourneys be used
  if (!countryRecords || countryRecords.length === 0) return null;

  const sortedCountryRecords = [...countryRecords].sort((a, b) => {
    const orderA = Number(a.fields?.["Order"]) || 99;
    const orderB = Number(b.fields?.["Order"]) || 99;
    return orderA - orderB;
  });

  return sortedCountryRecords.map((cRec) => {
    const f = cRec.fields || {};
    const published = f["Published"] === true || f["Show in Toolkit"] === true;
    if (!published) return null;

    const countryId = String(f["Country ID"] || f["Slug"] || f["Country"] || "").toLowerCase().trim();
    const countryName = sanitizeText(f["Country Name"] || f["Country"] || countryId.toUpperCase());
    const flag = sanitizeText(f["Flag Emoji"] || f["Flag"] || "🌍");
    const status = sanitizeText(f["Status"] || "Available");
    const isReady = f["Is Ready"] !== undefined ? Boolean(f["Is Ready"]) : (status === "Available");
    const order = Number(f["Order"]) || 99;
    const tagline = sanitizeText(f["Tagline"] || "");
    const summary = sanitizeText(f["Summary"] || "");

    let keyMechanisms = [];
    const rawHighlights = f["Key Highlights"] || f["Key Mechanisms"];
    if (rawHighlights) {
      if (Array.isArray(rawHighlights)) {
        keyMechanisms = rawHighlights.map(sanitizeText).filter(Boolean);
      } else {
        keyMechanisms = String(rawHighlights)
          .split(/\r?\n|,/)
          .map(s => sanitizeText(s.replace(/^[•\-\*]\s*/, '')))
          .filter(Boolean);
      }
    }

    let cardImage = "";
    if (Array.isArray(f["Card Image Attachment"]) && f["Card Image Attachment"].length > 0) {
      cardImage = f["Card Image Attachment"][0].url;
    } else if (Array.isArray(f["Card Image"]) && f["Card Image"].length > 0) {
      cardImage = f["Card Image"][0].url;
    } else if (f["Card Image URL"] || f["Cover Image"] || f["Card Image"]) {
      cardImage = sanitizeText(f["Card Image URL"] || f["Cover Image"] || f["Card Image"] || "");
    }

    const themeColor = sanitizeText(f["Theme Color"] || "#3c4799");

    let diagramImageUrl = "";
    if (Array.isArray(f["Diagram Attachment"]) && f["Diagram Attachment"].length > 0) {
      diagramImageUrl = f["Diagram Attachment"][0].url;
    } else if (Array.isArray(f["Diagram Image Attachment"]) && f["Diagram Image Attachment"].length > 0) {
      diagramImageUrl = f["Diagram Image Attachment"][0].url;
    } else if (Array.isArray(f["Diagram Image"]) && f["Diagram Image"].length > 0) {
      diagramImageUrl = f["Diagram Image"][0].url;
    } else if (f["Diagram Image URL"] || f["Diagram Image"]) {
      diagramImageUrl = sanitizeText(f["Diagram Image URL"] || f["Diagram Image"] || "");
    }
    // Hardcoded fallback for sweden
    if (!diagramImageUrl && countryId === 'sweden') {
      diagramImageUrl = "/sweden-model-architecture.png";
    }

    // Process Sections & Premises
    const linkedSections = sectionRecords.filter((s) => {
      const belongs = s.fields["Belongs to Country"] || s.fields["Country"] || s.fields["Country ID"];
      if (Array.isArray(belongs)) return belongs.includes(cRec.id) || belongs.includes(countryId);
      return belongs === cRec.id || String(belongs).toLowerCase() === countryId;
    }).sort((a, b) => (Number(a.fields["Order"]) || 0) - (Number(b.fields["Order"]) || 0));

    const premises = [];
    const contextSections = [];

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
            .map((p) => sanitizeText(p))
            .filter(Boolean);

          let bulletPoints = [];
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
    const linkedActions = actionRecords.filter((a) => {
      const belongs = a.fields["Belongs to Country"] || a.fields["Country"] || a.fields["Country ID"];
      if (Array.isArray(belongs)) return belongs.includes(cRec.id) || belongs.includes(countryId);
      return belongs === cRec.id || String(belongs).toLowerCase() === countryId;
    }).sort((a, b) => (Number(a.fields["Action Number"] || a.fields["Order"]) || 0) - (Number(b.fields["Action Number"] || b.fields["Order"]) || 0));

    let actions = [];
    if (linkedActions.length > 0) {
      actions = linkedActions.map((aRec) => {
        const af = aRec.fields || {};
        const actionNumber = Number(af["Action Number"] || af["Number"] || af["Order"]) || 1;
        const paragraphs = (af["Content"] || af["Detailed Content"] || af["Paragraphs"] || "")
          .split(/\n\n+/)
          .map((p) => sanitizeText(p))
          .filter(Boolean);

        let caseStudy = undefined;
        if (af["Case Study Title"] || af["Case Study Content"]) {
          caseStudy = {
            title: sanitizeText(af["Case Study Title"] || "Case Study"),
            paragraphs: (af["Case Study Content"] || "")
              .split(/\n\n+/)
              .map((p) => sanitizeText(p))
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
      headerTitle: sanitizeText(f["Header Title"] || `${countryName}’s Multilevel Governance and Implementation Journey`),
      headerSubtitle: sanitizeText(f["Header Subtitle"] || `• ${countryName} Deep Dive`),
      headerDescription: sanitizeText(f["Header Description"] || summary),
      tabATitle: sanitizeText(f["Tab A Title"] || "The Context"),
      tabASubtitle: sanitizeText(f["Tab A Subtitle"] || "An Evolving Mission-Oriented Approach"),
      premisesHeading: sanitizeText(f["Premises Heading"] || `Central Premises of ${countryName}’s Journey`),
      premisesIntro: sanitizeText(f["Premises Intro"] || ""),
      premises,
      contextSections,
      tabBTitle: sanitizeText(f["Tab B Title"] || "The Multilevel Model"),
      tabBSubtitle: sanitizeText(f["Tab B Subtitle"] || "Architecture Diagram & 6 Multilevel Governance Actions"),
      modelHeading: sanitizeText(f["Model Heading"] || `${countryName}’s Multilevel Model`),
      modelOverview: sanitizeText(f["Model Overview"] || ""),
      modelDiagramNote: sanitizeText(f["Model Diagram Note"] || "Click on the image or the Fullscreen button to zoom and pan."),
      diagramImageUrl,
      diagramImageAlt: sanitizeText(f["Diagram Image Alt"] || `${countryName} Architecture Diagram`),
      actionsHeading: sanitizeText(f["Actions Heading"] || `${countryName}'s Journey Across the 6 Action Pathways`),
      actionsSubtitle: sanitizeText(f["Actions Subtitle"] || ""),
      actions,
    };
  }).filter(Boolean);
}

async function main() {
  if (baseId && pat) {
    try {
      console.log(`[Airtable Build Sync] Fetching live data from Base ID: ${baseId}...`);
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
        actionRecords
      ] = await Promise.all([
        fetchTable('Actions', baseId, pat),
        fetchTable('Pathways', baseId, pat),
        fetchTable('Implementation Guidance', baseId, pat),
        fetchTableSafely(['Key Resources', 'Illustrative Examples', 'Examples'], baseId, pat),
        fetchTable('Sub-Examples', baseId, pat),
        fetchTableSafely(['Concept & Explainer Boxes', 'Concept Boxes', 'Explainer Boxes'], baseId, pat),
        fetchTableSafely(['Additional Resources', 'Further Resources', 'Resources'], baseId, pat),
        fetchTableSafely(['Home Page', 'Landing Page', 'Home Page Content', 'Home Content'], baseId, pat),
        fetchTableSafely(['Country Journeys', 'Country Deep Dives', 'Countries'], baseId, pat),
        fetchTableSafely(['Country Sections', 'Country Context Sections', 'Journey Sections'], baseId, pat),
        fetchTableSafely(['Country Actions', 'Country Journey Actions', 'Journey Actions'], baseId, pat),
      ]);

      const formatted = formatAirtableData(actions, pathways, guidance, examples, subExamples, conceptBoxes, resources);
      const homePage = formatHomePageData(homeRecords);
      const countryJourneys = formatCountryJourneysData(countryRecords, sectionRecords, actionRecords);

      const output = {
        success: true,
        source: 'airtable_api_build_sync',
        lastUpdated: new Date().toISOString(),
        formattedActions: formatted,
        homePageContent: homePage,
        countryJourneys: countryJourneys || undefined
      };

      fs.writeFileSync(outFile, JSON.stringify(output, null, 2), 'utf-8');
      console.log(`[Airtable Build Sync] Successfully written ${formatted.length} actions, Home Page content and Country Journeys to ${outFile}`);
      return;
    } catch (err) {
      console.warn(`[Airtable Build Sync] Failed to fetch live data from Airtable: ${err.message}. Generating static fallback...`);
    }
  } else {
    console.log('[Airtable Build Sync] No AIRTABLE_BASE_ID / AIRTABLE_PAT found in build environment.');
  }

  // Fallback
  if (!fs.existsSync(outFile)) {
    const output = {
      success: true,
      source: 'local_fallback',
      lastUpdated: new Date().toISOString(),
      formattedActions: [],
      homePageContent: formatHomePageData([]),
    };
    fs.writeFileSync(outFile, JSON.stringify(output, null, 2), 'utf-8');
    console.log(`[Airtable Build Sync] Initialized placeholder at ${outFile}`);
  }
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.warn('[Airtable Build Sync Notice] Proceeding with static dataset:', e.message);
    process.exit(0);
  });
