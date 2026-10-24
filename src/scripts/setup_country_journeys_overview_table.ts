import dotenv from 'dotenv';
dotenv.config();

const baseId = process.env.AIRTABLE_BASE_ID || process.env.VITE_AIRTABLE_BASE_ID;
const pat = process.env.AIRTABLE_PAT || process.env.AIRTABLE_API_KEY || process.env.VITE_AIRTABLE_PAT;

export async function createCountryJourneysOverviewTable() {
  if (!baseId || !pat) {
    console.error("Missing AIRTABLE_BASE_ID or AIRTABLE_PAT");
    return;
  }

  console.log("Checking if 'Country Journeys Overview' table exists in Airtable...");
  const schemaRes = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {
    headers: { Authorization: `Bearer ${pat}` }
  });

  if (!schemaRes.ok) {
    console.error("Failed to fetch tables schema:", await schemaRes.text());
    return;
  }

  const schemaData = await schemaRes.json();
  let overviewTable = schemaData.tables?.find((t: any) => 
    t.name.toLowerCase() === 'country journeys overview' || 
    t.name.toLowerCase() === 'country journeys page' ||
    t.name.toLowerCase() === 'country journeys content' ||
    t.name.toLowerCase() === 'country journey main page'
  );

  if (!overviewTable) {
    console.log("Creating 'Country Journeys Overview' table in Airtable...");
    const createRes = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${pat}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: "Country Journeys Overview",
        description: "Titles, intro text, and callouts displayed on the main Country Journeys overview page",
        fields: [
          {
            name: "Label / Element",
            type: "singleLineText",
            description: "Human-friendly label describing what this field controls on the Country Journeys page"
          },
          {
            name: "Item Key",
            type: "singleLineText",
            description: "System identifier (e.g. page_title, page_eyebrow, featured_section_title, intro_p1, intro_p2, focus_note)"
          },
          {
            name: "Section",
            type: "singleSelect",
            options: {
              choices: [
                { name: "Header Section" },
                { name: "Introductory Copy" },
                { name: "Featured Section" },
                { name: "General" }
              ]
            }
          },
          {
            name: "Text Content",
            type: "multilineText",
            description: "The main text or copy displayed on the Country Journeys overview page"
          },
          {
            name: "Sub-Text / Secondary",
            type: "multilineText",
            description: "Optional secondary text, subtitle, or helper description"
          },
          {
            name: "Notes / Guidance",
            type: "multilineText",
            description: "Helpful guidance on where and how this appears on the page"
          }
        ]
      })
    });

    if (!createRes.ok) {
      console.error("Failed to create 'Country Journeys Overview' table:", await createRes.text());
      return;
    }

    overviewTable = await createRes.json();
    console.log("✓ 'Country Journeys Overview' table created successfully! Table ID:", overviewTable.id);
  } else {
    console.log(`'Country Journeys Overview' table already exists (Table ID: ${overviewTable.id}, Name: "${overviewTable.name}").`);
  }

  // Check records in the table
  console.log(`Checking records in '${overviewTable.name}' table...`);
  const recordsRes = await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(overviewTable.name)}`, {
    headers: { Authorization: `Bearer ${pat}` }
  });

  const recordsData = await recordsRes.json();
  const existingRecords = recordsData.records || [];
  console.log(`Found ${existingRecords.length} existing records in '${overviewTable.name}'.`);

  // Default seed records for Country Journeys Overview
  const seedItems = [
    {
      "Label / Element": "Page Tag / Eyebrow",
      "Item Key": "page_eyebrow",
      "Section": "Header Section",
      "Text Content": "Country Journeys",
      "Notes / Guidance": "Uppercase badge/tag displayed directly above the main page heading (alongside the globe icon)"
    },
    {
      "Label / Element": "Main Page Title (H1)",
      "Item Key": "page_title",
      "Section": "Header Section",
      "Text Content": "Country Journeys",
      "Notes / Guidance": "The primary main heading at the top of the Country Journeys overview page"
    },
    {
      "Label / Element": "Intro Paragraph 1",
      "Item Key": "intro_p1",
      "Section": "Introductory Copy",
      "Text Content": "The Country Journeys contain deep dive analysis grounded in real-world contexts, showcasing institutional relationships, learning loops, implementation cycles, accountability mechanisms, and enabling conditions required to implement and scale Implementation Pathways across different countries.",
      "Notes / Guidance": "First paragraph of the introductory context on the Country Journeys overview page"
    },
    {
      "Label / Element": "Intro Paragraph 2",
      "Item Key": "intro_p2",
      "Section": "Introductory Copy",
      "Text Content": "Country Journeys are intended not only to document implementation approaches, but also to showcase how cities, regions and national governments have co-developed practical solutions that can inform other CHAMP countries.",
      "Notes / Guidance": "Second paragraph of the introductory context"
    },
    {
      "Label / Element": "Special Focus / Callout Note",
      "Item Key": "focus_note",
      "Section": "Introductory Copy",
      "Text Content": "Special focus on the interactions between institutions and programs, governance capabilities, intermediary functions, financing and implementation platforms, and feedback loops required to sustain long-term climate investment.",
      "Notes / Guidance": "Highlighted callout text with the left border accent strip"
    },
    {
      "Label / Element": "Featured Countries Section Title",
      "Item Key": "featured_section_title",
      "Section": "Featured Section",
      "Text Content": "Featured Country Journeys",
      "Notes / Guidance": "Section title displayed right above the country cards slider and grid view"
    }
  ];

  if (existingRecords.length === 0) {
    console.log("Seeding default Country Journeys Overview content into Airtable...");
    for (const item of seedItems) {
      console.log(`Inserting: ${item["Label / Element"]}...`);
      const insertRes = await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(overviewTable.name)}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${pat}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fields: item
        })
      });
      if (!insertRes.ok) {
        console.error(`Failed to insert record:`, await insertRes.text());
      }
    }
    console.log("✓ Successfully seeded all Country Journeys Overview content into Airtable!");
  } else {
    console.log("Country Journeys Overview table already contains records. Verifying keys...");
    const existingKeys = existingRecords.map((r: any) => r.fields["Item Key"] || r.fields["Key"]);
    for (const item of seedItems) {
      if (!existingKeys.includes(item["Item Key"])) {
        console.log(`Adding missing key: ${item["Item Key"]}...`);
        await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(overviewTable.name)}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${pat}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fields: item
          })
        });
      }
    }
    console.log("✓ Country Journeys Overview table verified and updated.");
  }
}

if (process.argv[1]?.endsWith('setup_country_journeys_overview_table.ts')) {
  createCountryJourneysOverviewTable().catch(console.error);
}
