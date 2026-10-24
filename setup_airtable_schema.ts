import dotenv from 'dotenv';
dotenv.config();

const baseId = process.env.AIRTABLE_BASE_ID || process.env.VITE_AIRTABLE_BASE_ID;
const pat = process.env.AIRTABLE_PAT || process.env.AIRTABLE_API_KEY || process.env.VITE_AIRTABLE_PAT;

async function setupAirtableSchemaAndOrders() {
  console.log("Fetching tables schema from Airtable...");
  const schemaRes = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {
    headers: { Authorization: `Bearer ${pat}` }
  });
  const schemaData = await schemaRes.json();
  
  const pathwaysTable = schemaData.tables?.find((t: any) => t.name === 'Pathways');
  const keyResourcesTable = schemaData.tables?.find((t: any) => t.name === 'Key Resources' || t.name === 'Illustrative Examples' || t.name === 'Examples');
  const resourcesTable = schemaData.tables?.find((t: any) => t.name === 'Further Resources' || t.name === 'Resources' || t.name === 'Additional Resources');

  if (!pathwaysTable) {
    console.error("Pathways table not found!");
    return;
  }

  // 1. Add Order column to Pathways table if not present
  const pathwayOrderField = pathwaysTable.fields?.find((f: any) => f.name === 'Order');
  if (!pathwayOrderField) {
    console.log("Adding 'Order' field to Pathways table...");
    const addFieldRes = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables/${pathwaysTable.id}/fields`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${pat}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: "Order",
        type: "number",
        options: { precision: 0 },
        description: "Display order for pathways within the action"
      })
    });
    if (addFieldRes.ok) {
      console.log("✓ Added 'Order' field to Pathways table!");
    } else {
      console.error("Failed to add Order to Pathways:", await addFieldRes.json());
    }
  } else {
    console.log("Pathways table already has 'Order' field.");
  }

  // 2. Add Order column to Key Resources table (Illustrative Examples & Tools) if not present
  if (keyResourcesTable) {
    const keyResOrderField = keyResourcesTable.fields?.find((f: any) => f.name === 'Order');
    if (!keyResOrderField) {
      console.log("Adding 'Order' field to Key Resources table...");
      const addKeyResFieldRes = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables/${keyResourcesTable.id}/fields`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${pat}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: "Order",
          type: "number",
          options: { precision: 0 },
          description: "Display order / sequence number (1, 2, 3...) for tools and illustrative examples under each pathway"
        })
      });
      if (addKeyResFieldRes.ok) {
        console.log("✓ Added 'Order' field to Key Resources table!");
      } else {
        console.error("Failed to add Order to Key Resources:", await addKeyResFieldRes.json());
      }
    } else {
      console.log("Key Resources table already has 'Order' field.");
    }
  }

  // 2. Enhance Further Resources table schema
  if (resourcesTable) {
    const pubField = resourcesTable.fields?.find((f: any) => f.name === 'Publisher / Organization' || f.name === 'Publisher');
    if (!pubField) {
      console.log("Adding 'Publisher / Organization' field to Further Resources...");
      await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables/${resourcesTable.id}/fields`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${pat}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: "Publisher / Organization",
          type: "singleLineText",
          description: "e.g. CCFLA, OECD, UNDP, GCoM, World Bank"
        })
      });
    }

    const resOrderField = resourcesTable.fields?.find((f: any) => f.name === 'Order');
    if (!resOrderField) {
      console.log("Adding 'Order' field to Further Resources...");
      await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables/${resourcesTable.id}/fields`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${pat}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: "Order",
          type: "number",
          options: { precision: 0 }
        })
      });
    }
  }

  // 3. Set the Pathway Orders according to user specifications:
  // Action 3:
  // 1. National Platforms
  // 2. Overarching, Iterative Coordination Mechanisms
  // 3. Intermediary Coordination, Facilitation and Accountability Function
  console.log("Fetching all pathway records...");
  const pRes = await fetch(`https://api.airtable.com/v0/${baseId}/Pathways`, {
    headers: { Authorization: `Bearer ${pat}` }
  });
  const pData = await pRes.json();

  const pathwayOrderMap: Record<string, number> = {
    // Action 1
    "Joint Political Commitments, Dialogues and Coalitions": 1,
    
    // Action 2
    "National and subnational enabling environments assessments": 1,

    // Action 3 (Explicitly requested by user)
    "National Platforms": 1,
    "Overarching, Iterative Coordination Mechanisms": 2,
    "Intermediary Coordination, Facilitation and Accountability Function": 3,

    // Action 4
    "Joint Climate Investment Planning and Budgeting": 1,
    "Portfolio and Pipeline Development": 2,

    // Action 5
    "Locally Anchored Multilevel Climate Finance Structures": 1,
    "Innovative and De-risking Financial Tools and Mechanisms": 2,
    "Collaborative Portfolio Implementation Environments": 3,
    "Aggregated Procurement as a Market-Shaping and Industrial Transition Mechanism": 4,

    // Action 6
    "Strategic Partnerships for Finance Mobilization and Implementation at Scale": 1,
    "Capacity Building, Peer Learning and Networking": 2
  };

  for (const r of pData.records || []) {
    const title = r.fields['Pathway Title'];
    const order = pathwayOrderMap[title] || 1;
    console.log(`Setting Order ${order} for Pathway "${title}" (${r.id})...`);
    await fetch(`https://api.airtable.com/v0/${baseId}/Pathways/${r.id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${pat}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fields: {
          "Order": order
        }
      })
    });
  }

  // 4. Seed Further Resources for pathways in Airtable if empty or undefined
  console.log("Checking Further Resources records...");
  const rRes = await fetch(`https://api.airtable.com/v0/${baseId}/Further%20Resources`, {
    headers: { Authorization: `Bearer ${pat}` }
  });
  const rData = await rRes.json();

  // Find pathway IDs by title
  const pathwayIdByTitle: Record<string, string> = {};
  for (const r of pData.records || []) {
    pathwayIdByTitle[r.fields['Pathway Title']] = r.id;
  }

  // Sample curated real resources to seed
  const sampleResources = [
    {
      title: "CCFLA State of Cities Climate Finance Report",
      pathway: pathwayIdByTitle["Locally Anchored Multilevel Climate Finance Structures"] || Object.values(pathwayIdByTitle)[0],
      type: "Report / Study",
      link: "https://www.citiesclimatefinance.org",
      publisher: "Cities Climate Finance Leadership Alliance (CCFLA)",
      description: "Comprehensive tracking of urban climate finance flows, systemic bottlenecks, and financial intermediary models.",
      order: 1
    },
    {
      title: "OECD Subnational Climate Finance & Multilevel Governance Guidance",
      pathway: pathwayIdByTitle["National Platforms"] || Object.values(pathwayIdByTitle)[0],
      type: "Guide / Playbook",
      link: "https://www.oecd.org/environment/cc/subnational-climate-governance.htm",
      publisher: "OECD",
      description: "Policy recommendations and case studies on aligning national climate targets with municipal budgetary structures.",
      order: 1
    },
    {
      title: "GCoM Multilevel Governance Toolkit for Cities & Regions",
      pathway: pathwayIdByTitle["Overarching, Iterative Coordination Mechanisms"] || Object.values(pathwayIdByTitle)[0],
      type: "Tool / Template",
      link: "https://www.globalcovenantofmayors.org",
      publisher: "Global Covenant of Mayors (GCoM)",
      description: "Actionable frameworks for institutionalizing joint federal-municipal climate consultation mechanisms.",
      order: 1
    },
    {
      title: "UNDP / WRI Project Preparation Facilities Navigator",
      pathway: pathwayIdByTitle["Portfolio and Pipeline Development"] || Object.values(pathwayIdByTitle)[0],
      type: "Tool / Template",
      link: "https://www.undp.org",
      publisher: "UNDP & WRI",
      description: "Catalog of global project preparation facilities supporting subnational bankable project development.",
      order: 1
    },
    {
      title: "EIB Green Municipal Bonds & Aggregation Guide",
      pathway: pathwayIdByTitle["Innovative and De-risking Financial Tools and Mechanisms"] || Object.values(pathwayIdByTitle)[0],
      type: "Guide / Playbook",
      link: "https://www.eib.org",
      publisher: "European Investment Bank (EIB)",
      description: "Technical playbook on pooled municipal bond issuances, credit guarantees, and blended concessional finance.",
      order: 1
    }
  ];

  // If table only has undefined or dummy records, clean them up and seed rich records
  for (const r of rData.records || []) {
    if (!r.fields['Resource Title'] || r.fields['Resource Title'] === 'undefined') {
      console.log(`Deleting invalid resource record ${r.id}...`);
      await fetch(`https://api.airtable.com/v0/${baseId}/Further%20Resources/${r.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${pat}` }
      });
    }
  }

  // Add new resources if count is low
  if ((rData.records || []).filter((r: any) => r.fields['Resource Title'] && r.fields['Resource Title'] !== 'undefined').length === 0) {
    console.log("Seeding curated Further Resources into Airtable...");
    for (const item of sampleResources) {
      if (!item.pathway) continue;
      await fetch(`https://api.airtable.com/v0/${baseId}/Further%20Resources`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${pat}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fields: {
            "Resource Title": item.title,
            "Pathway": [item.pathway],
            "Resource Type": item.type,
            "Resource Link": item.link,
            "Publisher / Organization": item.publisher,
            "Description": item.description,
            "Order": item.order
          }
        })
      });
    }
    console.log("✓ Seeded sample resources into Airtable!");
  }

  console.log("Airtable schema setup and order numbering completed!");
}

setupAirtableSchemaAndOrders().catch(console.error);
