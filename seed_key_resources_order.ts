import dotenv from 'dotenv';
dotenv.config();

const baseId = process.env.AIRTABLE_BASE_ID || process.env.VITE_AIRTABLE_BASE_ID;
const pat = process.env.AIRTABLE_PAT || process.env.AIRTABLE_API_KEY || process.env.VITE_AIRTABLE_PAT;

if (!baseId || !pat) {
  console.error("Missing Airtable credentials in environment (AIRTABLE_BASE_ID / AIRTABLE_PAT).");
  process.exit(1);
}

async function fetchAllRecords(tableName: string) {
  let allRecords: any[] = [];
  let offset = '';
  do {
    const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}${offset ? `?offset=${offset}` : ''}`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${pat}` }
    });
    if (!response.ok) throw new Error(`Failed to fetch ${tableName}: ${response.statusText}`);
    const data = await response.json();
    allRecords = allRecords.concat((data as any).records || []);
    offset = (data as any).offset;
  } while (offset);
  return allRecords;
}

async function main() {
  console.log("1. Inspecting Airtable Schema...");
  const schemaRes = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {
    headers: { Authorization: `Bearer ${pat}` }
  });
  if (!schemaRes.ok) {
    throw new Error(`Failed to get schema: ${schemaRes.status} ${schemaRes.statusText}`);
  }
  const schemaData = await schemaRes.json();
  const tables = schemaData.tables || [];

  const keyResourcesTable = tables.find((t: any) => 
    t.name === 'Key Resources' || t.name === 'Illustrative Examples' || t.name === 'Examples'
  );

  if (!keyResourcesTable) {
    console.error("Could not find 'Key Resources' table. Available tables:", tables.map((t: any) => t.name));
    return;
  }

  console.log(`Found table: "${keyResourcesTable.name}" (ID: ${keyResourcesTable.id})`);
  let orderField = keyResourcesTable.fields?.find((f: any) => f.name === 'Order');

  if (!orderField) {
    console.log("Creating 'Order' number field in Airtable table:", keyResourcesTable.name);
    const createFieldRes = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables/${keyResourcesTable.id}/fields`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${pat}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: "Order",
        type: "number",
        options: { precision: 0 },
        description: "Display order / sequence number (e.g. 1, 2, 3...) for tools and illustrative examples under each pathway"
      })
    });
    if (!createFieldRes.ok) {
      console.error("Failed to create Order field:", await createFieldRes.text());
    } else {
      orderField = await createFieldRes.json();
      console.log("✓ Successfully created 'Order' field in Airtable!");
    }
  } else {
    console.log("✓ 'Order' field already exists in Airtable table:", keyResourcesTable.name);
  }

  console.log("\n2. Fetching records from", keyResourcesTable.name);
  const records = await fetchAllRecords(keyResourcesTable.name);
  console.log(`Fetched ${records.length} records.`);

  // Group records by linked Pathway so we can sequence them cleanly 1, 2, 3... per pathway
  const pathwayGroups = new Map<string, any[]>();
  for (const record of records) {
    const pathwayLink = (record.fields["Belongs to Pathway"] || record.fields["Pathway"] || ["ungrouped"])[0];
    if (!pathwayGroups.has(pathwayLink)) {
      pathwayGroups.set(pathwayLink, []);
    }
    pathwayGroups.get(pathwayLink)!.push(record);
  }

  const updates: { id: string; fields: Record<string, any> }[] = [];

  for (const [pathwayId, groupRecords] of pathwayGroups.entries()) {
    groupRecords.forEach((record, index) => {
      const currentOrder = record.fields["Order"];
      const newOrder = index + 1;
      // If currentOrder is undefined or null or not set, set it
      if (currentOrder === undefined || currentOrder === null) {
        updates.push({
          id: record.id,
          fields: {
            "Order": newOrder
          }
        });
      }
    });
  }

  console.log(`Found ${updates.length} records needing 'Order' numbers.`);

  // Batch update Airtable in chunks of 10
  for (let i = 0; i < updates.length; i += 10) {
    const chunk = updates.slice(i, i + 10);
    const patchRes = await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(keyResourcesTable.name)}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${pat}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ records: chunk })
    });
    if (!patchRes.ok) {
      console.error(`Error updating batch ${i / 10 + 1}:`, await patchRes.text());
    } else {
      console.log(`✓ Updated batch ${i / 10 + 1} (${chunk.length} records)`);
    }
  }

  console.log("\n✅ All Key Resources have been populated with Order numbers!");
}

main().catch(console.error);
