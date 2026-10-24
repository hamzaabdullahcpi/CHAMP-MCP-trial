import dotenv from 'dotenv';
dotenv.config();
import { defaultChampRoadmapData } from './src/data/champRoadmapData';

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

async function main() {
  if (!baseId || !pat) {
    console.error("Airtable Base ID or PAT not found in environment.");
    return;
  }

  console.log("Checking Airtable Base for 'CHAMP Implementation Roadmap' table...");
  const tables = await getExistingTables();
  const tableName = "CHAMP Implementation Roadmap";
  let roadmapTable = tables.find((t: any) => t.name === tableName);

  if (!roadmapTable) {
    console.log(`Creating table "${tableName}"...`);
    roadmapTable = await createTable({
      name: tableName,
      description: "CHAMP Implementation Roadmap pillars, goals, responsibilities, activities and detailed action points",
      fields: [
        {
          name: "Activity Code",
          type: "singleLineText",
          description: "e.g. 1.1, 1.2, 2.1, 3.1"
        },
        {
          name: "Pillar Number",
          type: "number",
          options: { precision: 0 },
          description: "1, 2, or 3"
        },
        {
          name: "Pillar Title",
          type: "singleLineText"
        },
        {
          name: "Activity Title",
          type: "singleLineText"
        },
        {
          name: "Detailed Bullets",
          type: "multilineText",
          description: "Exact bullet points with responsible actors in brackets"
        },
        {
          name: "Pillar Goal",
          type: "multilineText"
        },
        {
          name: "Lead Responsibility",
          type: "multilineText"
        },
        {
          name: "Pillar Overview",
          type: "multilineText"
        },
        {
          name: "Transition Note",
          type: "multilineText"
        },
        {
          name: "Order",
          type: "number",
          options: { precision: 0 }
        }
      ]
    });
    console.log(`✓ Created table "${tableName}" (id: ${roadmapTable.id})`);
  } else {
    console.log(`Table "${tableName}" already exists.`);
  }

  // Check if existing records are present
  const checkRes = await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`, {
    headers: { Authorization: `Bearer ${pat}` }
  });
  const checkData = await checkRes.json();
  const existingRecords = checkData.records || [];

  if (existingRecords.length > 0) {
    console.log(`Found ${existingRecords.length} existing records in "${tableName}". Deleting old records to re-seed exact content...`);
    for (const rec of existingRecords) {
      await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}/${rec.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${pat}` }
      });
      await sleep(150);
    }
  }

  // Prepare records to insert
  const recordsToInsert: any[] = [];
  let orderCounter = 1;

  for (const pillar of defaultChampRoadmapData) {
    for (const act of pillar.activities) {
      recordsToInsert.push({
        "Activity Code": act.code,
        "Pillar Number": pillar.number,
        "Pillar Title": pillar.title,
        "Activity Title": act.title,
        "Detailed Bullets": act.bullets.map(b => `• ${b}`).join("\n\n"),
        "Pillar Goal": pillar.goal,
        "Lead Responsibility": pillar.leadResponsibility,
        "Pillar Overview": pillar.overview,
        "Transition Note": pillar.transitionNote || "",
        "Order": orderCounter++
      });
    }
  }

  console.log(`Inserting ${recordsToInsert.length} exact roadmap records into "${tableName}"...`);
  for (let i = 0; i < recordsToInsert.length; i += 10) {
    const chunk = recordsToInsert.slice(i, i + 10);
    const postRes = await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${pat}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        records: chunk.map(fields => ({ fields }))
      })
    });
    const postData = await postRes.json();
    if (!postRes.ok) {
      console.error(`Error inserting chunk:`, postData);
    } else {
      console.log(`✓ Inserted ${chunk.length} records successfully.`);
    }
    await sleep(250);
  }

  console.log("All exact CHAMP Implementation Roadmap records pushed to Airtable successfully!");
}

main().catch(err => {
  console.error("Script failed:", err);
});
