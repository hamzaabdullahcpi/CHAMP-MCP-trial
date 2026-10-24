import dotenv from 'dotenv';
dotenv.config();

const baseId = process.env.AIRTABLE_BASE_ID || process.env.VITE_AIRTABLE_BASE_ID;
const pat = process.env.AIRTABLE_PAT || process.env.AIRTABLE_API_KEY || process.env.VITE_AIRTABLE_PAT;

if (!baseId || !pat) {
  console.error("Missing Airtable credentials.");
  process.exit(1);
}

const CANONICAL_PATHWAY_ORDERS: Record<string, number> = {
  // Action 1
  "1.1": 1,
  "1.2": 2,
  // Action 2
  "2.1": 1,
  "2.2": 2,
  // Action 3
  "3.1": 1,
  "3.2": 2,
  "3.3": 3,
  // Action 4
  "4.1": 1,
  "4.2": 2,
  // Action 5
  "5.1": 1,
  "5.2": 2,
  "5.3": 3,
  "5.4": 4,
  // Action 6
  "6.1": 1,
  "6.2": 2,
};

async function main() {
  console.log("Fetching all Pathways from Airtable...");
  const res = await fetch(`https://api.airtable.com/v0/${baseId}/Pathways`, {
    headers: { Authorization: `Bearer ${pat}` }
  });
  if (!res.ok) throw new Error(`Failed: ${res.statusText}`);
  const data = await res.json();
  const records = data.records || [];

  const updates: { id: string; fields: Record<string, any> }[] = [];

  for (const rec of records) {
    const title = String(rec.fields["Pathway Title"] || rec.fields["Title"] || "").trim();
    let correctOrder = 1;

    const match = title.match(/^(\d+\.\d+)/);
    if (match && CANONICAL_PATHWAY_ORDERS[match[1]] !== undefined) {
      correctOrder = CANONICAL_PATHWAY_ORDERS[match[1]];
    } else if (title.includes("Joint Climate Commitments")) correctOrder = 1;
    else if (title.includes("Whole-of-Society")) correctOrder = 2;
    else if (title.includes("Enabling Framework")) correctOrder = 1;
    else if (title.includes("Reform Roadmaps")) correctOrder = 2;
    else if (title.includes("Recurring National") || title.includes("Coordination Mechanisms")) correctOrder = 1;
    else if (title.includes("National Platforms")) correctOrder = 2;
    else if (title.includes("Intermediary Coordination")) correctOrder = 3;
    else if (title.includes("Planning and Budgeting")) correctOrder = 1;
    else if (title.includes("Pipeline Development")) correctOrder = 2;
    else if (title.includes("Locally Anchored")) correctOrder = 1;
    else if (title.includes("Innovative Financial")) correctOrder = 2;
    else if (title.includes("Collaborative Portfolio")) correctOrder = 3;
    else if (title.includes("Aggregation")) correctOrder = 4;
    else if (title.includes("Capacity, Networking")) correctOrder = 1;
    else if (title.includes("Strategic Partnerships")) correctOrder = 2;

    console.log(`Pathway "${title}" -> Setting Order to ${correctOrder}`);
    updates.push({
      id: rec.id,
      fields: { "Order": correctOrder }
    });
  }

  for (let i = 0; i < updates.length; i += 10) {
    const chunk = updates.slice(i, i + 10);
    const patchRes = await fetch(`https://api.airtable.com/v0/${baseId}/Pathways`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${pat}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ records: chunk })
    });
    if (!patchRes.ok) {
      console.error("Error updating batch:", await patchRes.text());
    } else {
      console.log(`✓ Restored batch ${i / 10 + 1}`);
    }
  }

  console.log("✅ Successfully restored canonical pathway ordering in Airtable!");
}

main().catch(console.error);
