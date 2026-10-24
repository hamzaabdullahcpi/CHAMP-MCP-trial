import dotenv from 'dotenv';
dotenv.config();

const baseId = process.env.AIRTABLE_BASE_ID;
const pat = process.env.AIRTABLE_PAT;

if (!baseId || !pat) {
  console.error("Missing AIRTABLE_BASE_ID or AIRTABLE_PAT");
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${pat}`,
  "Content-Type": "application/json"
};

async function airtableFetch(endpoint: string, options: any = {}) {
  const url = `https://api.airtable.com/v0/${baseId}/${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) }
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Airtable error [${res.status}] ${url}: ${errText}`);
  }
  return res.json();
}

async function batchDelete(table: string, ids: string[]) {
  for (let i = 0; i < ids.length; i += 10) {
    const batch = ids.slice(i, i + 10);
    const query = batch.map(id => `records[]=${id}`).join('&');
    await airtableFetch(`${encodeURIComponent(table)}?${query}`, { method: 'DELETE' });
    console.log(`Deleted ${batch.length} records from ${table}`);
  }
}

async function batchCreate(table: string, records: any[]) {
  const results: any[] = [];
  for (let i = 0; i < records.length; i += 10) {
    const batch = records.slice(i, i + 10);
    const data = await airtableFetch(encodeURIComponent(table), {
      method: 'POST',
      body: JSON.stringify({ records: batch, typecast: true })
    });
    results.push(...data.records);
    console.log(`Created ${batch.length} records in ${table}`);
  }
  return results;
}

async function main() {
  const a5RecordId = "recCADScendAM5HBJ";

  console.log("=== STEP 1: Updating Action 5 in Airtable ===");
  await airtableFetch(`Actions/${a5RecordId}`, {
    method: "PATCH",
    body: JSON.stringify({
      fields: {
        "Title": "Strengthen Capacities and Networks",
        "Action Number": 5,
        "Description": "This Action helps national governments to support subnational and municipal governments in strengthening capacities and partnerships needed to scale urban climate investment. It covers practical capacity development, engagement with international networks and access to specialised expertise, financing partners and implementation support.",
        "Systems Logic": "Scaling urban climate investment beyond individual cities or regions requires technical capabilities and long-term access to expertise and resources. To this end, targeted capacity development can strengthen local skills in investment planning, financing and implementation. International networks and partnerships can help to connect national and subnational governments with specialised expertise, financing partners and opportunities for collective action. These approaches can help to overcome technical capacity gaps, strengthen financing outcomes and enhance implementation capabilities."
      }
    })
  });
  console.log("✓ Updated Action 5 Title, Description, and Systems Logic.");

  console.log("=== STEP 2: Cleaning up existing Action 5/6 Pathways and Child Records ===");
  const pRes = await airtableFetch("Pathways");
  const oldPathways = (pRes.records || []).filter((r: any) => {
    const title = r.fields["Pathway Title"] || "";
    return (
      r.fields["Belongs to Action"]?.includes(a5RecordId) ||
      title.startsWith("5.") ||
      title.startsWith("6.")
    );
  });

  const oldPathwayIds = oldPathways.map((r: any) => r.id);
  console.log(`Found ${oldPathwayIds.length} pathways to clean up:`, oldPathwayIds);

  if (oldPathwayIds.length > 0) {
    // 2a. Implementation Guidance
    const igRes = await airtableFetch("Implementation%20Guidance");
    const igToDelete = (igRes.records || [])
      .filter((r: any) => r.fields["Belongs to Pathway"]?.some((id: string) => oldPathwayIds.includes(id)))
      .map((r: any) => r.id);
    if (igToDelete.length > 0) {
      await batchDelete("Implementation Guidance", igToDelete);
    }

    // 2b. Key Resources and Sub-Examples
    const krRes = await airtableFetch("Key%20Resources");
    const krLinked = (krRes.records || [])
      .filter((r: any) => r.fields["Belongs to Pathway"]?.some((id: string) => oldPathwayIds.includes(id)));
    const krIds = krLinked.map((r: any) => r.id);

    if (krIds.length > 0) {
      const subRes = await airtableFetch("Sub-Examples");
      const subToDelete = (subRes.records || [])
        .filter((r: any) => r.fields["Belongs to Parent Example"]?.some((id: string) => krIds.includes(id)))
        .map((r: any) => r.id);
      if (subToDelete.length > 0) {
        await batchDelete("Sub-Examples", subToDelete);
      }
      await batchDelete("Key Resources", krIds);
    }

    // 2c. Concept Boxes
    const cbRes = await airtableFetch("Concept%20%26%20Explainer%20Boxes");
    const cbToDelete = (cbRes.records || [])
      .filter((r: any) => r.fields["Belongs to Pathway"]?.some((id: string) => oldPathwayIds.includes(id)))
      .map((r: any) => r.id);
    if (cbToDelete.length > 0) {
      await batchDelete("Concept & Explainer Boxes", cbToDelete);
    }

    // 2d. Delete old pathways
    await batchDelete("Pathways", oldPathwayIds);
    console.log("✓ Cleaned up old Action 5/6 pathways and their child records.");
  }

  console.log("=== STEP 3: Creating 2 Pathways for Action 5 ===");
  const pathwayPayloads = [
    {
      fields: {
        "Pathway Title": "5.1. Capacity Building for Urban Climate Investment",
        "Overview": "Cities and subnational governments often lack the technical, financial and institutional capacities needed to plan, finance and implement climate investments. Targeted capacity development can strengthen practical skills in investment planning, project preparation, financial management and implementation. National governments can identify common capacity gaps across cities and mobilize training, technical assistance and peer-to-peer exchanges to address them. This can reduce dependence on external support and improve the impact of climate finance.",
        "Potential National Lead": [
          "Urban / Local Government Ministry",
          "Planning Ministry"
        ],
        "Key Actors": [
          "Climate / Environment Ministry",
          "Relevant Sector Ministries",
          "Municipal / Subnational Finance Department",
          "Municipal / Subnational Planning Department",
          "National Development Banks",
          "Technical Assistance Providers",
          "MDB / DFI",
          "City Networks",
          "Academia / Research"
        ],
        "Transferability Considerations": `• Adapting training to local needs and capacities: Training content should reflect municipal responsibilities, existing technical skills and investment priorities. Standardised modules can be adapted to different institutional contexts.
• Considering delivery models and institutional capacity: National institutions, city networks, development banks, universities or international partners can deliver training, depending on available expertise and resources.
• Making support accessible across different contexts: Adapt the language, formats and delivery approaches of capacity-building programs to local needs. Provide additional support for cities with limited financial or institutional capacity.`,
        "Order": 1,
        "Belongs to Action": [a5RecordId]
      }
    },
    {
      fields: {
        "Pathway Title": "5.2. International Engagements and Networking",
        "Overview": "International networks and partnerships can help national and subnational governments to access specialised expertise, financing partners and opportunities for collective action on urban climate investment. These initiatives connect governments with international organisations, city networks, development institutions and private-sector actors to exchange practical experience, mobilize support and advance shared finance and implementation priorities. National governments can facilitate cities' participation in relevant international initiatives and help translate these connections into concrete opportunities for technical assistance, financing and initiatives that address common urban climate challenges.",
        "Potential National Lead": [
          "Climate / Environment Ministry",
          "Urban / Local Government Ministry"
        ],
        "Key Actors": [
          "Relevant Sector Ministries",
          "Municipal / Subnational Planning Department",
          "Municipal / Subnational Finance Department",
          "National Development Banks",
          "MDB / DFI",
          "City Networks",
          "Technical Assistance Providers",
          "Private Sector",
          "Philanthropic Actors"
        ],
        "Transferability Considerations": `• Aligning international engagement with domestic priorities: The relevance of international networks depends on how closely their thematic focus and support offerings match national and subnational climate investment needs.
• Considering access and participation barriers: Smaller cities may lack the resources, staff or international connections to participate effectively. National institutions or city associations can help to broaden access.
• Recognising different partnership models: International initiatives vary in their offerings, from knowledge exchange and technical assistance to financing and implementation support. Not all partnerships provide direct access to funding.
• Ensuring continuity beyond individual initiatives: International programmes may be time-bound or evolve over time. Lasting benefits depend on whether knowledge, relationships and capacities are retained within domestic institutions.`,
        "Order": 2,
        "Belongs to Action": [a5RecordId]
      }
    }
  ];

  const createdPathways = await batchCreate("Pathways", pathwayPayloads);
  const p51Id = createdPathways[0].id;
  const p52Id = createdPathways[1].id;
  console.log(`✓ Created 2 Pathways: 5.1 (${p51Id}), 5.2 (${p52Id})`);

  console.log("=== STEP 4: Creating Implementation Guidance Records ===");
  const guidanceRecords = [
    // Pathway 5.1 Guidance
    {
      fields: {
        "Step Title": "Identify technical capacity gaps",
        "Step Order": 1,
        "Detailed Content": "Work with cities and subnational governments to assess gaps in investment planning, financial management, project preparation and implementation skills.",
        "Belongs to Pathway": [p51Id]
      }
    },
    {
      fields: {
        "Step Title": "Develop targeted capacity-building programmes",
        "Step Order": 2,
        "Detailed Content": "Design training programmes around identified needs, with practical modules on climate investment planning, financing instruments, business models and infrastructure delivery.",
        "Belongs to Pathway": [p51Id]
      }
    },
    {
      fields: {
        "Step Title": "Mobilise technical expertise and training partners",
        "Step Order": 3,
        "Detailed Content": "Engage national development banks, training institutions, international organisations and technical assistance providers to deliver specialised training and mentoring.",
        "Belongs to Pathway": [p51Id]
      }
    },
    {
      fields: {
        "Step Title": "Combine training with practical application",
        "Step Order": 4,
        "Detailed Content": "Link capacity-building activities to ongoing municipal investment priorities and projects. Use workshops, exercises and hands-on support to help officials apply new skills.",
        "Belongs to Pathway": [p51Id]
      }
    },
    {
      fields: {
        "Step Title": "Institutionalize capacities and track progress",
        "Step Order": 5,
        "Detailed Content": "Embed acquired skills into municipal processes, guidance and staff development programmes. Assess improvements in financial management, investment readiness and implementation capabilities.",
        "Belongs to Pathway": [p51Id]
      }
    },

    // Pathway 5.2 Guidance
    {
      fields: {
        "Step Title": "Identify opportunities for international engagement",
        "Step Order": 1,
        "Detailed Content": "Assess where cities could benefit from international expertise, financing partnerships, market connections or collective action on shared climate challenges. Connect cities with relevant international initiatives.",
        "Belongs to Pathway": [p52Id]
      }
    },
    {
      fields: {
        "Step Title": "Support cities and subnationals through intermediation",
        "Step Order": 2,
        "Detailed Content": "Use intermediaries to help cities to navigate international programmes, eligibility requirements and funding opportunities, particularly where local capacities are limited.",
        "Belongs to Pathway": [p52Id]
      }
    },
    {
      fields: {
        "Step Title": "Mobilise finance partners around investment portfolios",
        "Step Order": 3,
        "Detailed Content": "Engage MDBs, DFIs, climate funds and private financiers around urban investment portfolios and identify opportunities for technical and financial support.",
        "Belongs to Pathway": [p52Id]
      }
    },
    {
      fields: {
        "Step Title": "Track partnership outcomes and remaining gaps",
        "Step Order": 4,
        "Detailed Content": "Monitor technical assistance, financing opportunities and implementation support mobilised through partnerships. Use findings to strengthen future engagement.",
        "Belongs to Pathway": [p52Id]
      }
    }
  ];

  await batchCreate("Implementation Guidance", guidanceRecords);
  console.log(`✓ Created ${guidanceRecords.length} Implementation Guidance records.`);

  console.log("=== STEP 5: Creating Key Resources in Airtable ===");
  const keyResourcesData = [
    // 5.1 Resources
    {
      fields: {
        "Example Title": "South Africa – DBSA Municipal Capacity Development Programme",
        "Type": "Peer Learning Example",
        "Order": 1,
        "Why see this / When to use this": "See how national development banks can partner with private actors to strengthen municipal financial management and infrastructure delivery capacities.",
        "Full Text / Concept Explanation": `South Africa illustrates how a national development bank can partner with the private sector to strengthen municipal technical and financial capacities. The Development Bank of Southern Africa (DBSA), in partnership with Anglo American, implemented a three-year programme across municipalities, investing over ZAR 120 million. The programme included hands-on training with support for infrastructure planning, revenue collection, financial management and service delivery. It trained 500 municipal officials and supported the development of 26 infrastructure master plans. Participating municipalities achieved an average 11.6% improvement in revenue collection.`,
        "Belongs to Pathway": [p51Id]
      }
    },
    {
      fields: {
        "Example Title": "C40 Cities Finance Facility – City Academy on Finance and Equity (CAFE)",
        "Type": "Peer Learning Example",
        "Order": 2,
        "Why see this / When to use this": "See how technical training can strengthen municipal financial skills and support the development of equitable, investment-ready climate projects.",
        "Full Text / Concept Explanation": `CAFE shows how international technical assistance programmes can strengthen municipal capacities for financing equitable climate infrastructure. Developed by the C40 Cities Finance Facility, the Academy provides structured training for mid- and senior-level officials from Global South cities. Through workshops and practical exercises, participants learn to assess financing instruments, develop project business models and integrate equity considerations into infrastructure planning and implementation. An accompanying workbook helps city teams apply these skills to their own investment priorities.`,
        "Belongs to Pathway": [p51Id]
      }
    },
    {
      fields: {
        "Example Title": "UrbanShift – City Academies",
        "Type": "Peer Learning Example",
        "Order": 3,
        "Why see this / When to use this": "See how international capacity-building programmes can strengthen municipal technical skills and support their application to local climate investments.",
        "Full Text / Concept Explanation": `UrbanShift Academies offer a peer-learning platform for cities working on integrated urban development. UrbanShift is a “one-stop” platform bringing together global, national and local champions, while offering a suite of capacity-building activities that includes finance academies and dialogues with the national government. The platform combines these learning activities with on-the-ground local projects, so cities can exchange experience, build strategic planning skills, and apply what they learn to integrated solutions in areas such as transport, housing, green infrastructure and waste.`,
        "Belongs to Pathway": [p51Id]
      }
    },

    // 5.2 Resources
    {
      fields: {
        "Example Title": "The Cities Climate Finance Leadership Alliance (CCFLA)",
        "Type": "Peer Learning Example",
        "Order": 1,
        "Why see this / When to use this": "See how international networks can help national and subnational governments to access specialised climate finance expertise, exchange practical experience and develop partnerships to address investment barriers.",
        "Full Text / Concept Explanation": `The Cities Climate Finance Leadership Alliance (CCFLA) provides a multi-level, multi-stakeholder space for practitioners to connect, exchange experience and build networks around urban climate finance. Through its thematic Action Groups, CCFLA members can convene around priority topics such as project preparation, adaptation finance, enabling environments, private finance and other emerging financing challenges, sharing practical approaches and identifying opportunities for collaboration. Participation is open across CCFLA’s diverse membership, including national governments, city networks and subnational actors, demand- and supply-side finance organizations, and expert and technical organizations, helping to connect perspectives across levels of government and across the climate finance ecosystem.`,
        "Belongs to Pathway": [p52Id]
      }
    },
    {
      fields: {
        "Example Title": "First Mover Cities Cohort",
        "Type": "Peer Learning Example",
        "Order": 2,
        "Why see this / When to use this": "See how international collaboration can help cities explore intra-city demand aggregation and strengthen their ability to shape markets for low-carbon solutions.",
        "Full Text / Concept Explanation": `First Mover Cities Cohort: First Mover Cities is an emerging city cohort being developed within the World Economic Forum's First Movers Coalition to explore approaches to intra-city aggregated purchasing power. It aims to bring together city governments, businesses across the supply and demand sides of the construction value chain, finance institutions and other partners to strengthen demand for low-carbon solutions. Initial work focuses on cement and concrete, using multistakeholder dialogues to exchange practical experience on green procurement governance, tender design, supplier engagement and coordination of public and private demand within cities. Through these exchanges, the cohort aims to help cities develop approaches that could eventually enable aggregated purchasing and create stronger market signals for low-carbon solutions. San Francisco, Boston, Oslo and Stockholm are the initial First Mover Cities, with ambitions to expand participation globally and potentially extend the approach to other urban sectors.`,
        "Belongs to Pathway": [p52Id]
      }
    },
    {
      fields: {
        "Example Title": "Global Platform for Sustainable Cities (GPSC)",
        "Type": "Peer Learning Example",
        "Order": 3,
        "Why see this / When to use this": "See how international partnerships can connect national and subnational governments with technical expertise, practical tools and implementation support for urban climate investments.",
        "Full Text / Concept Explanation": `Global Platform for Sustainable Cities (GPSC): GPSC shows how international partnerships can connect national and subnational governments with technical expertise, investment planning support and development-finance partners. Led by the World Bank and supported by the Global Environment Facility (GEF), GPSC provides knowledge exchange, capacity building and practical tools to help cities develop integrated urban investment approaches. It supports the wider GEF Sustainable Cities Programme, which includes a global knowledge platform with country-led, city-level projects financed through GEF resources and co-financing from development partners. This helps to connect national and local urban priorities with international expertise and financing opportunities for sustainable urban development.`,
        "Belongs to Pathway": [p52Id]
      }
    },
    {
      fields: {
        "Example Title": "UN-Habitat – RISE UP",
        "Type": "Peer Learning Example",
        "Order": 4,
        "Why see this / When to use this": "See how international partnerships can connect national and local governments with climate funds, technical expertise and financing opportunities for urban adaptation.",
        "Full Text / Concept Explanation": `UN-Habitat – RISE UP: RISE UP shows how international partnerships can mobilise finance and technical support for locally led climate adaptation. Established by UN-Habitat, the initiative has worked with national and local governments through its global, regional and country offices to connect urban resilience priorities with international financing partners. Through partnerships with the Adaptation Fund, Green Climate Fund and bilateral agencies, including Sweden's Sida, RISE UP reports mobilising over USD 150 million for urban climate resilience initiatives across nearly 30 countries. Although its flagship programme concluded in 2025, the RISE UP portfolio continues supporting cities with financing readiness, institutional capacity and implementation of resilience investments.`,
        "Belongs to Pathway": [p52Id]
      }
    }
  ];

  await batchCreate("Key Resources", keyResourcesData);
  console.log(`✓ Created ${keyResourcesData.length} Key Resources.`);

  console.log("=== STEP 6: Linking Additional Resources in Airtable ===");
  const arUpdates = [
    { id: 'recihIdmCPyVX1Wpy', pathway: [p51Id] },
    { id: 'recSszOfdmEPpT1ns', pathway: [p51Id] },
    { id: 'reckcyEELpP1EJodW', pathway: [p52Id] },
    { id: 'recYR6UD4qvqmfYlS', pathway: [p52Id] },
    { id: 'recLJrAYSkhXvI1Iw', pathway: [p52Id] },
    { id: 'recYrOjaYG6CjFFX1', pathway: [p52Id] },
    { id: 'recOYr9S6yAT6i0xp', pathway: [p52Id] },
    { id: 'recRF1WVImiZQgvoH', pathway: [p52Id] },
    { id: 'recD2qeWwhDiM2Mll', pathway: [p52Id] },
    { id: 'recZF2mdwwOAM8HkO', pathway: [p52Id] },
  ];

  for (const u of arUpdates) {
    try {
      await airtableFetch(`Additional%20Resources/${u.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ fields: { 'Pathway': u.pathway } })
      });
      console.log(`Linked AR ${u.id}`);
    } catch (e: any) {
      console.warn(`Could not link AR ${u.id}:`, e.message);
    }
  }

  console.log("\n=======================================================");
  console.log(" Action 5 Seeding Completed Successfully in Airtable! ");
  console.log("=======================================================");
}

main().catch(err => {
  console.error("FATAL ERROR in seeding Action 5:", err);
  process.exit(1);
});
