import dotenv from 'dotenv';
dotenv.config();

const baseId = process.env.AIRTABLE_BASE_ID || process.env.VITE_AIRTABLE_BASE_ID;
const pat = process.env.AIRTABLE_PAT || process.env.AIRTABLE_API_KEY || process.env.VITE_AIRTABLE_PAT;

// Pathway mappings: Title match -> Allocated Key Actors
export const PATHWAY_ACTOR_MAPPINGS: Record<string, string[]> = {
  // Action 1
  "Joint Political Commitments, Dialogues and Coalitions": [
    "National Government",
    "Subnational Government",
    "Civil Society",
    "Community Stakeholders",
    "City Networks",
    "Private Investors"
  ],

  // Action 2
  "National and subnational enabling environments assessments": [
    "National Government",
    "Subnational Government",
    "City Networks",
    "Technical Assistance Providers",
    "Development Finance Institutions",
    "Civil Society"
  ],

  // Action 3
  "Overarching, Iterative Coordination Mechanisms": [
    "National Government",
    "Subnational Government",
    "City Networks",
    "Utilities",
    "Civil Society",
    "Technical Assistance Providers"
  ],
  "National Platforms": [
    "National Government",
    "Subnational Government",
    "Multilateral Development Banks",
    "Development Finance Institutions",
    "National Development Banks",
    "Climate Funds",
    "Donors",
    "Private Investors"
  ],
  "Intermediary Coordination, Facilitation and Accountability Function": [
    "National Government",
    "Subnational Government",
    "Technical Assistance Providers",
    "City Networks",
    "Civil Society",
    "Philanthropic Actors",
    "Community Stakeholders"
  ],

  // Action 4
  "Joint Climate Investment Planning and Budgeting": [
    "National Government",
    "Subnational Government",
    "Utilities",
    "Infrastructure Developers",
    "Community Stakeholders",
    "National Development Banks"
  ],
  "Portfolio and Pipeline Development": [
    "National Government",
    "Subnational Government",
    "Technical Assistance Providers",
    "Infrastructure Developers",
    "Utilities",
    "Private Investors",
    "Development Finance Institutions",
    "Civil Society"
  ],

  // Action 5
  "Locally Anchored Multilevel Climate Finance Structures": [
    "National Government",
    "Subnational Government",
    "National Development Banks",
    "Commercial Banks",
    "Private Investors",
    "Special Purpose Vehicles",
    "Philanthropic Actors",
    "Community Stakeholders"
  ],
  "Innovative and De-risking Financial Tools and Mechanisms": [
    "National Government",
    "Subnational Government",
    "Multilateral Development Banks",
    "Development Finance Institutions",
    "National Development Banks",
    "Climate Funds",
    "Insurers",
    "Commercial Banks",
    "Private Investors",
    "Donors"
  ],
  "Collaborative Portfolio Implementation Environments": [
    "National Government",
    "Subnational Government",
    "Infrastructure Developers",
    "Utilities",
    "Procurement Actors",
    "Private Investors",
    "Civil Society",
    "Community Stakeholders"
  ],
  "Aggregated Procurement as a Market-Shaping and Industrial Transition Mechanism": [
    "National Government",
    "Subnational Government",
    "Procurement Actors",
    "Utilities",
    "Infrastructure Developers",
    "Special Purpose Vehicles"
  ],

  // Action 6
  "Capacity Building, Peer Learning and Networking": [
    "National Government",
    "Subnational Government",
    "City Networks",
    "Technical Assistance Providers",
    "Development Finance Institutions",
    "Multilateral Development Banks"
  ],
  "Strategic Partnerships for Finance Mobilization and Implementation at Scale": [
    "National Government",
    "Subnational Government",
    "Development Finance Institutions",
    "Multilateral Development Banks",
    "Climate Funds",
    "Philanthropic Actors",
    "Donors",
    "Technical Assistance Providers"
  ]
};

async function updateKeyActors() {
  if (!baseId || !pat) {
    console.error("Missing AIRTABLE_BASE_ID or AIRTABLE_PAT");
    return;
  }

  console.log("1. Fetching existing records in Pathways from Airtable...");
  const fetchRecordsRes = await fetch(`https://api.airtable.com/v0/${baseId}/Pathways`, {
    headers: { Authorization: `Bearer ${pat}` }
  });

  if (!fetchRecordsRes.ok) {
    console.error("Failed to fetch pathways records:", await fetchRecordsRes.text());
    return;
  }

  const recData = await fetchRecordsRes.json();
  const records = recData.records || [];
  console.log(`Found ${records.length} pathways.`);

  const updates: any[] = [];
  for (const rec of records) {
    const title = (rec.fields["Pathway Title"] || rec.fields["Title"] || "").trim();
    const allocatedActors = PATHWAY_ACTOR_MAPPINGS[title];

    if (allocatedActors) {
      console.log(`Mapping "${title}" ->\n  ${allocatedActors.join(', ')}`);
      updates.push({
        id: rec.id,
        fields: {
          "Key Actors": allocatedActors
        }
      });
    } else {
      console.warn(`No mapping found for pathway title: "${title}"`);
    }
  }

  // Batch update in chunks of 10 with typecast: true
  for (let i = 0; i < updates.length; i += 10) {
    const batch = updates.slice(i, i + 10);
    const updateRes = await fetch(`https://api.airtable.com/v0/${baseId}/Pathways`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${pat}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        typecast: true,
        records: batch
      })
    });

    if (!updateRes.ok) {
      console.error("Batch update error:", await updateRes.text());
    } else {
      console.log(`✓ Successfully updated batch ${i / 10 + 1} (${batch.length} records).`);
    }
  }

  console.log("✓ All pathways updated in Airtable with new Key Actors successfully!");
}

updateKeyActors().catch(console.error);
