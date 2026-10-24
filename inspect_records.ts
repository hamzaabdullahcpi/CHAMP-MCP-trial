import dotenv from 'dotenv';
dotenv.config();

const baseId = process.env.AIRTABLE_BASE_ID || process.env.VITE_AIRTABLE_BASE_ID;
const pat = process.env.AIRTABLE_PAT || process.env.AIRTABLE_API_KEY || process.env.VITE_AIRTABLE_PAT;

async function checkPathwaysAndResources() {
  console.log("=== Pathways Records ===");
  const pRes = await fetch(`https://api.airtable.com/v0/${baseId}/Pathways`, {
    headers: { Authorization: `Bearer ${pat}` }
  });
  const pData = await pRes.json();
  for (const r of pData.records || []) {
    console.log(`- [${r.id}] "${r.fields['Pathway Title']}" -> Action: ${JSON.stringify(r.fields['Belongs to Action'])}`);
  }

  console.log("\n=== Further Resources Records ===");
  const rRes = await fetch(`https://api.airtable.com/v0/${baseId}/Further%20Resources`, {
    headers: { Authorization: `Bearer ${pat}` }
  });
  const rData = await rRes.json();
  for (const r of rData.records || []) {
    console.log(`- [${r.id}] "${r.fields['Resource Title']}"`, r.fields);
  }
}

checkPathwaysAndResources().catch(console.error);
