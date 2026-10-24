import dotenv from 'dotenv';
dotenv.config();
import { defaultCountryJourneys, swedenJourneyDefaultData } from './src/data/countryJourneysData';

const baseId = process.env.AIRTABLE_BASE_ID || process.env.VITE_AIRTABLE_BASE_ID;
const pat = process.env.AIRTABLE_PAT || process.env.AIRTABLE_API_KEY || process.env.VITE_AIRTABLE_PAT;

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getExistingTables() {
  const res = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {
    headers: { Authorization: `Bearer ${pat}` }
  });
  const data = await res.json();
  return data.tables || [];
}

async function createTable(tableDef: any) {
  const res = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${pat}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(tableDef)
  });
  const result = await res.json();
  if (!res.ok) {
    throw new Error(`Failed to create table ${tableDef.name}: ${JSON.stringify(result)}`);
  }
  return result;
}

async function batchInsert(tableName: string, records: any[]) {
  // Airtable allows up to 10 records per POST request
  for (let i = 0; i < records.length; i += 10) {
    const chunk = records.slice(i, i + 10);
    const res = await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${pat}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        records: chunk.map(fields => ({ fields }))
      })
    });
    const data = await res.json();
    if (!res.ok) {
      console.error(`Error inserting into ${tableName}:`, data);
    } else {
      console.log(`✓ Inserted ${chunk.length} records into "${tableName}"`);
    }
    await sleep(250); // Respect Airtable rate limit (5 req/sec)
  }
}

async function main() {
  console.log("Connecting to Airtable with PAT and Base ID...");
  const tables = await getExistingTables();
  console.log("Current tables in Base:", tables.map((t: any) => t.name));

  // 1. Ensure "Country Journeys" table exists
  let countryJourneysTable = tables.find((t: any) => t.name === 'Country Journeys');
  if (!countryJourneysTable) {
    console.log("Creating 'Country Journeys' table...");
    countryJourneysTable = await createTable({
      name: "Country Journeys",
      description: "Country Deep Dives metadata, overview cards, and model diagram settings",
      fields: [
        { name: "Country ID", type: "singleLineText", description: "Unique slug e.g. sweden, brazil, morocco" },
        { name: "Country Name", type: "singleLineText" },
        { name: "Flag Emoji", type: "singleLineText" },
        { name: "Status", type: "singleLineText" },
        { name: "Is Ready", type: "checkbox", options: { icon: "check", color: "greenBright" } },
        { name: "Tagline", type: "singleLineText" },
        { name: "Summary", type: "multilineText" },
        { name: "Key Mechanisms", type: "multilineText" },
        { name: "Card Image URL", type: "singleLineText" },
        { name: "Theme Color", type: "singleLineText" },
        { name: "Header Title", type: "singleLineText" },
        { name: "Header Subtitle", type: "singleLineText" },
        { name: "Header Description", type: "multilineText" },
        { name: "Tab A Title", type: "singleLineText" },
        { name: "Tab A Subtitle", type: "singleLineText" },
        { name: "Premises Heading", type: "singleLineText" },
        { name: "Premises Intro", type: "multilineText" },
        { name: "Tab B Title", type: "singleLineText" },
        { name: "Tab B Subtitle", type: "singleLineText" },
        { name: "Model Heading", type: "singleLineText" },
        { name: "Model Overview", type: "multilineText" },
        { name: "Model Diagram Note", type: "singleLineText" },
        { name: "Diagram Image URL", type: "singleLineText" },
        { name: "Diagram Image Alt", type: "singleLineText" },
        { name: "Actions Heading", type: "singleLineText" },
        { name: "Actions Subtitle", type: "singleLineText" }
      ]
    });
    console.log("✓ Created 'Country Journeys' table!");
  } else {
    console.log("'Country Journeys' table already exists.");
  }

  // 2. Ensure "Country Sections" table exists
  let countrySectionsTable = tables.find((t: any) => t.name === 'Country Sections');
  if (!countrySectionsTable) {
    console.log("Creating 'Country Sections' table...");
    countrySectionsTable = await createTable({
      name: "Country Sections",
      description: "Editorial context sections, bullet points, and central premises for Tab A",
      fields: [
        { name: "Title", type: "singleLineText", description: "Section or premise headline" },
        { name: "Belongs to Country", type: "singleLineText", description: "Country ID (e.g. sweden, brazil)" },
        { name: "Section Type", type: "singleLineText", description: "Context Section or Central Premise" },
        { name: "Order", type: "number", options: { precision: 0 } },
        { name: "Content", type: "multilineText" },
        { name: "Bullet Points", type: "multilineText" }
      ]
    });
    console.log("✓ Created 'Country Sections' table!");
  } else {
    console.log("'Country Sections' table already exists.");
  }

  // 3. Ensure "Country Actions" table exists
  let countryActionsTable = tables.find((t: any) => t.name === 'Country Actions');
  if (!countryActionsTable) {
    console.log("Creating 'Country Actions' table...");
    countryActionsTable = await createTable({
      name: "Country Actions",
      description: "Mapping of 6 Actions, deep case studies, and opportunities for Tab B",
      fields: [
        { name: "Title", type: "singleLineText", description: "Action title" },
        { name: "Belongs to Country", type: "singleLineText", description: "Country ID (e.g. sweden, brazil)" },
        { name: "Action Number", type: "number", options: { precision: 0 } },
        { name: "Action Theme Tag", type: "singleLineText", description: "e.g. • Shared Commitments" },
        { name: "Content", type: "multilineText" },
        { name: "Case Study Title", type: "singleLineText" },
        { name: "Case Study Content", type: "multilineText" },
        { name: "Enabled & Opportunity", type: "multilineText" }
      ]
    });
    console.log("✓ Created 'Country Actions' table!");
  } else {
    console.log("'Country Actions' table already exists.");
  }

  // 4. Check existing records in "Country Journeys" and seed if empty
  const existingCRes = await fetch(`https://api.airtable.com/v0/${baseId}/Country%20Journeys`, {
    headers: { Authorization: `Bearer ${pat}` }
  });
  const existingCData = await existingCRes.json();
  const existingCountryIds = (existingCData.records || []).map((r: any) => String(r.fields["Country ID"]).toLowerCase());

  console.log("Existing Country Journeys records in Airtable:", existingCountryIds);

  // Prepare Country Journeys records to insert
  const countryJourneysToInsert: any[] = [];
  for (const c of defaultCountryJourneys) {
    if (!existingCountryIds.includes(c.countryId.toLowerCase())) {
      countryJourneysToInsert.push({
        "Country ID": c.countryId,
        "Country Name": c.countryName,
        "Flag Emoji": c.flag,
        "Status": c.status,
        "Is Ready": c.isReady,
        "Tagline": c.tagline,
        "Summary": c.summary,
        "Key Mechanisms": c.keyMechanisms.join("\n• "),
        "Card Image URL": c.cardImage,
        "Theme Color": c.themeColor,
        "Header Title": c.headerTitle,
        "Header Subtitle": c.headerSubtitle,
        "Header Description": c.headerDescription,
        "Tab A Title": c.tabATitle,
        "Tab A Subtitle": c.tabASubtitle,
        "Premises Heading": c.premisesHeading,
        "Premises Intro": c.premisesIntro,
        "Tab B Title": c.tabBTitle,
        "Tab B Subtitle": c.tabBSubtitle,
        "Model Heading": c.modelHeading,
        "Model Overview": c.modelOverview,
        "Model Diagram Note": c.modelDiagramNote,
        "Diagram Image URL": c.diagramImageUrl,
        "Diagram Image Alt": c.diagramImageAlt,
        "Actions Heading": c.actionsHeading,
        "Actions Subtitle": c.actionsSubtitle
      });
    }
  }

  if (countryJourneysToInsert.length > 0) {
    console.log(`Inserting ${countryJourneysToInsert.length} countries into 'Country Journeys'...`);
    await batchInsert("Country Journeys", countryJourneysToInsert);
  }

  // 5. Seed "Country Sections" (Sweden's premises and context sections)
  const existingSectionsRes = await fetch(`https://api.airtable.com/v0/${baseId}/Country%20Sections`, {
    headers: { Authorization: `Bearer ${pat}` }
  });
  const existingSectionsData = await existingSectionsRes.json();
  if ((existingSectionsData.records || []).length === 0) {
    console.log("Seeding Sweden's premises and context sections into 'Country Sections'...");
    const sectionsToInsert: any[] = [];

    // Premises
    for (const p of swedenJourneyDefaultData.premises) {
      sectionsToInsert.push({
        "Title": p.title,
        "Belongs to Country": "sweden",
        "Section Type": "Central Premise",
        "Order": p.number,
        "Content": p.description,
      });
    }

    // Context Sections
    let secOrder = 10;
    for (const cs of swedenJourneyDefaultData.contextSections) {
      secOrder++;
      const bulletText = cs.bulletPoints
        ? cs.bulletPoints.map(b => b.label ? `• ${b.label}: ${b.text}` : `• ${b.text}`).join("\n")
        : "";
      sectionsToInsert.push({
        "Title": cs.title,
        "Belongs to Country": "sweden",
        "Section Type": "Context Section",
        "Order": secOrder,
        "Content": (cs.paragraphs || []).join("\n\n"),
        "Bullet Points": bulletText
      });
    }

    await batchInsert("Country Sections", sectionsToInsert);
  }

  // 6. Seed "Country Actions" (Sweden's 6 Actions mappings)
  const existingActionsRes = await fetch(`https://api.airtable.com/v0/${baseId}/Country%20Actions`, {
    headers: { Authorization: `Bearer ${pat}` }
  });
  const existingActionsData = await existingActionsRes.json();
  if ((existingActionsData.records || []).length === 0) {
    console.log("Seeding Sweden's 6 Actions into 'Country Actions'...");
    const actionsToInsert: any[] = [];
    for (const a of swedenJourneyDefaultData.actions) {
      actionsToInsert.push({
        "Title": a.title,
        "Belongs to Country": "sweden",
        "Action Number": a.actionNumber,
        "Action Theme Tag": a.actionThemeTitle,
        "Content": (a.paragraphs || []).join("\n\n"),
        "Case Study Title": a.caseStudy?.title || "",
        "Case Study Content": (a.caseStudy?.paragraphs || []).join("\n\n"),
        "Enabled & Opportunity": a.enabledSummary || ""
      });
    }
    await batchInsert("Country Actions", actionsToInsert);
  }

  console.log("✨ All Airtable Country Journeys tables and records have been successfully seeded!");
}

main().catch(console.error);
