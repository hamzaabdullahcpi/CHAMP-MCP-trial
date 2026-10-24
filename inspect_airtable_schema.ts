import dotenv from 'dotenv';
dotenv.config();

const baseId = process.env.AIRTABLE_BASE_ID || process.env.VITE_AIRTABLE_BASE_ID;
const pat = process.env.AIRTABLE_PAT || process.env.AIRTABLE_API_KEY || process.env.VITE_AIRTABLE_PAT;

async function inspectAirtable() {
  const schemaRes = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {
    headers: { Authorization: `Bearer ${pat}` }
  });
  const schemaData = await schemaRes.json();
  console.log("Tables in Airtable Base:");
  for (const t of schemaData.tables || []) {
    console.log(`\nTable: "${t.name}" (id: ${t.id})`);
    console.log("Fields:", t.fields.map((f: any) => `${f.name} (${f.type})`));
  }
}

inspectAirtable().catch(console.error);
