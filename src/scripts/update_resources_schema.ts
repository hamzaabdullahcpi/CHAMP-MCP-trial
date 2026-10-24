import dotenv from 'dotenv';
dotenv.config();

const baseId = process.env.AIRTABLE_BASE_ID || process.env.VITE_AIRTABLE_BASE_ID;
const pat = process.env.AIRTABLE_PAT || process.env.AIRTABLE_API_KEY || process.env.VITE_AIRTABLE_PAT;

async function updateAirtableSchemaAndData() {
  if (!baseId || !pat) {
    console.error("Missing AIRTABLE_BASE_ID or AIRTABLE_PAT");
    return;
  }

  // 1. Get base metadata
  console.log("Fetching base metadata...");
  const metaRes = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {
    headers: { Authorization: `Bearer ${pat}` }
  });

  if (!metaRes.ok) {
    console.error("Failed to fetch tables:", await metaRes.text());
    return;
  }

  const metaData = await metaRes.json();
  const tables = metaData.tables || [];

  const examplesTable = tables.find((t: any) => 
    t.name.toLowerCase() === 'illustrative examples' || 
    t.name.toLowerCase() === 'key resources' || 
    t.name.toLowerCase() === 'examples'
  );

  const furtherResourcesTable = tables.find((t: any) => 
    t.name.toLowerCase() === 'further resources' || 
    t.name.toLowerCase() === 'additional resources' || 
    t.name.toLowerCase() === 'resources'
  );

  if (!examplesTable) {
    console.error("Could not find Illustrative Examples / Key Resources table!");
    return;
  }

  console.log(`Found Examples Table: "${examplesTable.name}" (ID: ${examplesTable.id})`);

  // Check if 'Type' or 'Resource Type' field exists
  const hasTypeField = examplesTable.fields.some((f: any) => 
    f.name.toLowerCase() === 'type' || 
    f.name.toLowerCase() === 'resource type' || 
    f.name.toLowerCase() === 'tag' ||
    f.name.toLowerCase() === 'category'
  );

  if (!hasTypeField) {
    console.log("Adding 'Type' field (Single Select: 'Illustrative Example' | 'Tool') to table...");
    const addFieldRes = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables/${examplesTable.id}/fields`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${pat}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: "Type",
        type: "singleSelect",
        description: "Tag specifying whether this resource is an Illustrative Example or a Tool",
        options: {
          choices: [
            { name: "Illustrative Example", color: "blueLight2" },
            { name: "Tool", color: "tealLight2" }
          ]
        }
      })
    });

    if (!addFieldRes.ok) {
      console.warn("Failed to add SingleSelect field via Meta API:", await addFieldRes.text());
      // Try singleLineText if singleSelect choice format fails
      const fallbackFieldRes = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables/${examplesTable.id}/fields`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${pat}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: "Type",
          type: "singleLineText",
          description: "Tag specifying whether this resource is an Illustrative Example or a Tool"
        })
      });
      if (!fallbackFieldRes.ok) {
        console.error("Failed to add singleLineText field as well:", await fallbackFieldRes.text());
      } else {
        console.log("✓ Added 'Type' field as singleLineText.");
      }
    } else {
      console.log("✓ Added 'Type' field as singleSelect with 'Illustrative Example' and 'Tool'.");
    }
  } else {
    console.log("Field 'Type' or 'Resource Type' already exists in Examples table.");
  }

  // Check if we can rename tables to 'Key Resources' and 'Additional Resources'
  try {
    if (examplesTable.name !== "Key Resources") {
      console.log(`Attempting to rename table "${examplesTable.name}" to "Key Resources"...`);
      const renameRes = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables/${examplesTable.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${pat}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: "Key Resources",
          description: "Key resources for pathways, categorized as Illustrative Examples or Tools"
        })
      });
      if (renameRes.ok) {
        console.log("✓ Successfully renamed table to 'Key Resources' in Airtable!");
      } else {
        console.log("Table rename note:", await renameRes.text());
      }
    }
  } catch (e) {
    console.log("Table rename error (will support both names in code):", e);
  }

  if (furtherResourcesTable && furtherResourcesTable.name !== "Additional Resources") {
    try {
      console.log(`Attempting to rename table "${furtherResourcesTable.name}" to "Additional Resources"...`);
      const renameRes = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables/${furtherResourcesTable.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${pat}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: "Additional Resources",
          description: "Additional reading, guidelines, and external resources"
        })
      });
      if (renameRes.ok) {
        console.log("✓ Successfully renamed table to 'Additional Resources' in Airtable!");
      } else {
        console.log("Table rename note:", await renameRes.text());
      }
    } catch (e) {
      console.log("Table rename error (will support both names in code):", e);
    }
  }

  // Now let's populate/tag existing records in Examples table
  console.log("Fetching existing records in Key Resources / Illustrative Examples...");
  const fetchRecordsRes = await fetch(`https://api.airtable.com/v0/${baseId}/${examplesTable.id}`, {
    headers: { Authorization: `Bearer ${pat}` }
  });

  if (fetchRecordsRes.ok) {
    const recData = await fetchRecordsRes.json();
    const records = recData.records || [];
    console.log(`Found ${records.length} records. Updating/verifying 'Type' tags...`);

    // Identify which ones are Tools vs Illustrative Examples
    const toolKeywords = [
      "tool", "toolkit", "calculator", "framework", "matrix", "platform", 
      "portal", "index", "generator", "simulator", "model", "assessment tool",
      "planning tool", "screening tool", "database", "repository"
    ];

    // Batch update in chunks of 10
    const updates: any[] = [];
    for (const rec of records) {
      const title = String(rec.fields["Example Title"] || rec.fields["Title"] || "").toLowerCase();
      const excerpt = String(rec.fields["Excerpt"] || "").toLowerCase();
      const existingType = rec.fields["Type"] || rec.fields["Resource Type"];

      if (!existingType) {
        // Check if title or excerpt suggests tool
        const isTool = toolKeywords.some(kw => title.includes(kw) || excerpt.includes(kw));
        const assignedType = isTool ? "Tool" : "Illustrative Example";

        updates.push({
          id: rec.id,
          fields: {
            Type: assignedType
          }
        });
      }
    }

    if (updates.length > 0) {
      console.log(`Updating ${updates.length} records with Type tags...`);
      for (let i = 0; i < updates.length; i += 10) {
        const batch = updates.slice(i, i + 10);
        const batchRes = await fetch(`https://api.airtable.com/v0/${baseId}/${examplesTable.id}`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${pat}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ records: batch })
        });
        if (!batchRes.ok) {
          console.warn("Failed batch update:", await batchRes.text());
        }
      }
      console.log("✓ Successfully updated record Type tags!");
    } else {
      console.log("All records already have Type tags.");
    }
  }

  console.log("✓ Airtable schema and data update complete!");
}

updateAirtableSchemaAndData().catch(console.error);
