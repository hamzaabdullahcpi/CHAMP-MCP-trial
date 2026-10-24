import dotenv from 'dotenv';
dotenv.config();

import { ACTION_5_RESOURCE_CONNECTIONS } from '../data/action5ResourceConnections';

const baseId = process.env.AIRTABLE_BASE_ID || process.env.VITE_AIRTABLE_BASE_ID;
const pat = process.env.AIRTABLE_PAT || process.env.AIRTABLE_API_KEY || process.env.VITE_AIRTABLE_PAT;

async function updateAirtable() {
  if (!baseId || !pat) {
    console.error("Missing AIRTABLE_BASE_ID or AIRTABLE_PAT");
    return;
  }

  console.log("1. Fetching base metadata from Airtable...");
  const metaRes = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {
    headers: { Authorization: `Bearer ${pat}` }
  });

  if (!metaRes.ok) {
    console.error("Failed to fetch tables:", await metaRes.text());
    return;
  }

  const metaData = await metaRes.json();
  const tables = metaData.tables || [];

  const keyResourcesTable = tables.find((t: any) => 
    t.name.toLowerCase() === 'key resources' || 
    t.name.toLowerCase() === 'illustrative examples' || 
    t.name.toLowerCase() === 'examples'
  );

  const guidanceTable = tables.find((t: any) => 
    t.name.toLowerCase() === 'implementation guidance' || 
    t.name.toLowerCase() === 'guidance'
  );

  if (!keyResourcesTable) {
    console.error("Key Resources table not found!");
    return;
  }

  if (!guidanceTable) {
    console.error("Implementation Guidance table not found!");
    return;
  }

  // --- STEP 1: Add 'Why see this / When to use this' column to Key Resources table ---
  const hasConnectionColumn = keyResourcesTable.fields.some((f: any) => 
    f.name.toLowerCase().includes('why see this') || 
    f.name.toLowerCase().includes('when to use this') ||
    f.name.toLowerCase() === 'connection line' ||
    f.name.toLowerCase() === 'contextual guidance'
  );

  if (!hasConnectionColumn) {
    console.log("Adding 'Why see this / When to use this' field to Key Resources table...");
    const addFieldRes = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables/${keyResourcesTable.id}/fields`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${pat}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: "Why see this / When to use this",
        type: "multilineText",
        description: "Contextual guidance note for why to see this example or when to use this tool (e.g. 'When to use this: ...' or 'Why see this: ...'). If left blank, frontend provides fallback."
      })
    });

    if (addFieldRes.ok) {
      console.log("✓ Added 'Why see this / When to use this' column to Key Resources!");
    } else {
      console.warn("Failed adding as multilineText, trying singleLineText:", await addFieldRes.text());
      const fallbackRes = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables/${keyResourcesTable.id}/fields`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${pat}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: "Why see this / When to use this",
          type: "singleLineText",
          description: "Contextual guidance note (e.g. 'When to use this: ...' or 'Why see this: ...')"
        })
      });
      if (fallbackRes.ok) {
        console.log("✓ Added 'Why see this / When to use this' column as singleLineText!");
      } else {
        console.error("Failed to add field:", await fallbackRes.text());
      }
    }
  } else {
    console.log("Column 'Why see this / When to use this' already exists in Key Resources.");
  }

  // --- STEP 2: Populate Action 5 Key Resources connection notes in Airtable ---
  console.log("Fetching existing records in Key Resources table...");
  let allKeyResourceRecords: any[] = [];
  let offset = '';
  do {
    const url = `https://api.airtable.com/v0/${baseId}/${keyResourcesTable.id}${offset ? `?offset=${offset}` : ''}`;
    const rRes = await fetch(url, { headers: { Authorization: `Bearer ${pat}` } });
    const rData = await rRes.json();
    allKeyResourceRecords = allKeyResourceRecords.concat(rData.records || []);
    offset = rData.offset;
  } while (offset);

  console.log(`Found ${allKeyResourceRecords.length} records in Key Resources.`);

  const keyResourceUpdates: any[] = [];
  for (const rec of allKeyResourceRecords) {
    const title = String(rec.fields["Example Title"] || rec.fields["Title"] || "").trim();
    const cleanTitleKey = title.toLowerCase().replace(/['"’]/g, '');
    
    // Check if we have a connection for this title
    let matchKey = Object.keys(ACTION_5_RESOURCE_CONNECTIONS).find(k => 
      cleanTitleKey.includes(k) || k.includes(cleanTitleKey)
    );

    if (matchKey) {
      const conn = ACTION_5_RESOURCE_CONNECTIONS[matchKey];
      const fullLine = `${conn.prefix} ${conn.text}`;
      const currentVal = rec.fields["Why see this / When to use this"];
      
      if (!currentVal) {
        keyResourceUpdates.push({
          id: rec.id,
          fields: {
            "Why see this / When to use this": fullLine,
            "Type": conn.type
          }
        });
      }
    }
  }

  if (keyResourceUpdates.length > 0) {
    console.log(`Updating ${keyResourceUpdates.length} Key Resource records with contextual guidance...`);
    for (let i = 0; i < keyResourceUpdates.length; i += 10) {
      const batch = keyResourceUpdates.slice(i, i + 10);
      const patchRes = await fetch(`https://api.airtable.com/v0/${baseId}/${keyResourcesTable.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${pat}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ records: batch })
      });
      if (!patchRes.ok) {
        console.warn("Batch patch error:", await patchRes.text());
      }
    }
    console.log("✓ Successfully updated Key Resource records!");
  } else {
    console.log("Key Resource connection lines already populated where applicable.");
  }

  // --- STEP 3: Unify Implementation Guidance to single format in Airtable ---
  console.log("Fetching Implementation Guidance records...");
  let allGuidanceRecords: any[] = [];
  let gOffset = '';
  do {
    const url = `https://api.airtable.com/v0/${baseId}/${guidanceTable.id}${gOffset ? `?offset=${gOffset}` : ''}`;
    const gRes = await fetch(url, { headers: { Authorization: `Bearer ${pat}` } });
    const gData = await gRes.json();
    allGuidanceRecords = allGuidanceRecords.concat(gData.records || []);
    gOffset = gData.offset;
  } while (gOffset);

  console.log(`Found ${allGuidanceRecords.length} records in Implementation Guidance.`);

  const guidanceUpdates: any[] = [];
  for (const gRec of allGuidanceRecords) {
    const t = String(gRec.fields["Step Title"] || "").trim();
    const c = String(gRec.fields["Detailed Content"] || "").trim();

    const normalize = (s: string) => s.trim().replace(/\s+/g, ' ').replace(/[.\s]+$/, '').toLowerCase();
    const normT = normalize(t);
    const normC = normalize(c);

    // If title and content are distinct (e.g. title is a short headline and content is the detail),
    // unite them into a single continuous format so there are no separate bold headlines!
    if (t && c && normT !== normC && !normC.startsWith(normT) && !normC.includes(normT) && !normT.includes(normC)) {
      const cleanTitle = t.replace(/[:.]\s*$/, '');
      const unifiedText = `${cleanTitle}: ${c}`;

      guidanceUpdates.push({
        id: gRec.id,
        fields: {
          "Step Title": unifiedText.slice(0, 100) + (unifiedText.length > 100 ? '...' : ''),
          "Detailed Content": unifiedText
        }
      });
    }
  }

  if (guidanceUpdates.length > 0) {
    console.log(`Unifying ${guidanceUpdates.length} Implementation Guidance records into single format...`);
    for (let i = 0; i < guidanceUpdates.length; i += 10) {
      const batch = guidanceUpdates.slice(i, i + 10);
      const patchRes = await fetch(`https://api.airtable.com/v0/${baseId}/${guidanceTable.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${pat}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ records: batch })
      });
      if (!patchRes.ok) {
        console.warn("Guidance batch patch error:", await patchRes.text());
      }
    }
    console.log("✓ Successfully unified Implementation Guidance records!");
  } else {
    console.log("Implementation Guidance records are already in single format.");
  }

  console.log("=== Airtable schema and data update complete! ===");
}

updateAirtable().catch(console.error);
