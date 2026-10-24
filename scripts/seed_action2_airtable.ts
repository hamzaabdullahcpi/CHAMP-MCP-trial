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
  const a2RecordId = "recbYjt3Sykcj2Xg0";
  const p21RecordId = "recYHYmT0t2O6FowD";
  const p22RecordId = "recEU7spqUr33oM9S";

  console.log("=== STEP 1: Updating Action 2 in Airtable ===");
  await airtableFetch(`Actions/${a2RecordId}`, {
    method: "PATCH",
    body: JSON.stringify({
      fields: {
        "Title": "Strengthen Enabling Environments for Climate Investment",
        "Action Number": 2,
        "Description": "This Action helps national governments to identify and address barriers to urban climate finance and implementation. These may include policy, financing, data and coordination barriers. Governments can use these findings to prioritise reforms that improve investment conditions for cities.",
        "Systems Logic": "Mobilizing urban climate finance requires more than the availability of capital. Policies, institutions, fiscal frameworks and regulatory conditions influence whether cities can prepare, finance and implement climate projects. National governments can address systemic barriers that cities cannot resolve alone, including borrowing restrictions, regulatory constraints and gaps in financial frameworks. Assessing these barriers and implementing targeted reforms can improve investment readiness, access to finance and implementation across cities."
      }
    })
  });
  console.log("✓ Updated Action 2 Title, Description, and Systems Logic.");

  console.log("=== STEP 2: Updating Pathway 2.1 and Pathway 2.2 in Airtable ===");
  await airtableFetch(`Pathways/${p21RecordId}`, {
    method: "PATCH",
    body: JSON.stringify({
      fields: {
        "Pathway Title": "2.1. Enabling Framework Conditions Assessments",
        "Overview": "Enabling framework conditions assessments help national and subnational governments to systematically identify barriers to urban climate investment. Through evidence collection and stakeholder engagement, they reveal how existing conditions across data, finance and governance affect investment and implementation across government levels. Findings can help governments to identify reform priorities requiring coordinated national and subnational action.",
        "Potential National Lead": [
          "Planning Ministry",
          "Urban / Local Government Ministry"
        ],
        "Key Actors": [
          "Finance Ministry",
          "Climate / Environment Ministry",
          "City / Subnational Coalitions",
          "Municipal / Subnational Finance Department",
          "Municipal / Subnational Planning Department",
          "Implementation Partner Organizations"
        ],
        "Transferability Considerations": `• Considering differences in institutional capacity: The scope and depth of assessments may vary depending on government capacity, data and available expertise.
• Accounting for data availability: Where climate, fiscal or investment data are limited, assessments may need to draw more heavily on stakeholder consultations and qualitative evidence.
• Linking assessments to the right institutions and reform opportunities: Findings are more likely to inform action when relevant institutions have the mandate, political support and capacity to pursue identified reforms.`,
        "Order": 1,
        "Belongs to Action": [a2RecordId]
      }
    })
  });
  console.log("✓ Updated Pathway 2.1.");

  await airtableFetch(`Pathways/${p22RecordId}`, {
    method: "PATCH",
    body: JSON.stringify({
      fields: {
        "Pathway Title": "2.2. Enabling Reforms for Urban Climate Investment",
        "Overview": "Enabling reforms help governments to address institutional barriers that constrain urban climate finance and implementation. Building on enabling framework conditions assessments, national and subnational governments can develop reform roadmaps that identify priority actions, institutional responsibilities, resources and implementation milestones. These roadmaps can help to sequence reforms across government institutions and coordinate financial and technical support for implementation.",
        "Potential National Lead": [
          "Finance Ministry",
          "Planning Ministry",
          "Urban / Local Government Ministry"
        ],
        "Key Actors": [
          "Sectoral Ministries (e.g., energy, transport)",
          "Municipal / Subnational Finance Department",
          "Municipal / Subnational Planning Department",
          "National Development Bank",
          "MDB / DFI",
          "Technical Assistance Providers"
        ],
        "Transferability Considerations": `• Reflecting political and legislative requirements: Some reforms require parliamentary approval, changes to legislation or agreement across government institutions. Roadmaps should account for these processes and realistic timelines.
• Considering institutional responsibilities across government levels: In centralised systems, national institutions may lead reforms, while decentralised systems may require greater subnational ownership and coordination.
• Accounting for fiscal space and financing arrangements: The availability of national grants, development finance and performance-linked incentives will affect how governments can support municipal reforms.
• Recognising differences in cities’ capacity: Cities with limited financial or technical capacity may need phased reforms, targeted technical assistance and additional support to implement improvement plans.`,
        "Order": 2,
        "Belongs to Action": [a2RecordId]
      },
      typecast: true
    })
  });
  console.log("✓ Updated Pathway 2.2.");

  console.log("=== STEP 3: Refreshing Implementation Guidance in Airtable ===");
  const igRes = await airtableFetch("Implementation%20Guidance");
  const igToDelete = (igRes.records || [])
    .filter((r: any) =>
      r.fields["Belongs to Pathway"]?.includes(p21RecordId) ||
      r.fields["Belongs to Pathway"]?.includes(p22RecordId)
    )
    .map((r: any) => r.id);

  if (igToDelete.length > 0) {
    console.log(`Deleting ${igToDelete.length} existing guidance records...`);
    await batchDelete("Implementation Guidance", igToDelete);
  }

  const newGuidance = [
    // 2.1 Guidance (7 items)
    {
      fields: {
        "Step Title": "Define the purpose and scope of the assessment",
        "Step Order": 1,
        "Detailed Content": "Identify the investment challenges the assessment should examine. Determine which institutions, government levels and financing systems should be included.",
        "Belongs to Pathway": [p21RecordId]
      }
    },
    {
      fields: {
        "Step Title": "Engage subnational governments early",
        "Step Order": 2,
        "Detailed Content": "While developing the purpose and scope of the assessment, involve cities and subnational authorities early to identify their specific investment challenges and priorities.",
        "Belongs to Pathway": [p21RecordId]
      }
    },
    {
      fields: {
        "Step Title": "Assess existing conditions",
        "Step Order": 3,
        "Detailed Content": "Review relevant policies, regulations, fiscal systems, financing frameworks, institutional arrangements and data. Consult stakeholders to understand how these work in practice.",
        "Belongs to Pathway": [p21RecordId]
      }
    },
    {
      fields: {
        "Step Title": "Identify barriers to investment",
        "Step Order": 4,
        "Detailed Content": "Determine which policy, fiscal, institutional, financing or data constraints are limiting urban climate investment. Distinguish national barriers from those that can be addressed locally.",
        "Belongs to Pathway": [p21RecordId]
      }
    },
    {
      fields: {
        "Step Title": "Validate findings across government levels",
        "Step Order": 5,
        "Detailed Content": "Discuss findings with cities, subnational governments and relevant national institutions. Use this process to confirm priorities and identify areas requiring joint action.",
        "Belongs to Pathway": [p21RecordId]
      }
    },
    {
      fields: {
        "Step Title": "Prioritise areas for reforms",
        "Step Order": 6,
        "Detailed Content": "Identify which barriers have the greatest effect on investment and implementation. Use the findings to inform reform priorities, technical assistance and financing support.",
        "Belongs to Pathway": [p21RecordId]
      }
    },
    {
      fields: {
        "Step Title": "Repeat the assessment when needed",
        "Step Order": 7,
        "Detailed Content": "Revisit priority areas as reforms progress and investment conditions change.",
        "Belongs to Pathway": [p21RecordId]
      }
    },

    // 2.2 Guidance (5 items)
    {
      fields: {
        "Step Title": "Prioritise reforms based on impact and feasibility",
        "Step Order": 1,
        "Detailed Content": "Identify barriers with the greatest effect on urban climate investment. Consider their urgency, political feasibility and potential benefits.",
        "Belongs to Pathway": [p22RecordId]
      }
    },
    {
      fields: {
        "Step Title": "For each priority, define the intended actions",
        "Step Order": 2,
        "Detailed Content": "Specify the actions required for each reform and identify the responsible institutions. Define milestones, resources and technical support where needed.",
        "Belongs to Pathway": [p22RecordId]
      }
    },
    {
      fields: {
        "Step Title": "Identify dependencies across government levels",
        "Step Order": 3,
        "Detailed Content": "Determine which reforms require national action and which can be implemented locally. Sequence connected reforms so that progress in one area enables another.",
        "Belongs to Pathway": [p22RecordId]
      }
    },
    {
      fields: {
        "Step Title": "Connect reforms with finance and technical support",
        "Step Order": 4,
        "Detailed Content": "Identify where public funding, development finance, technical assistance or performance-based incentives can support implementation.",
        "Belongs to Pathway": [p22RecordId]
      }
    },
    {
      fields: {
        "Step Title": "Track progress and revise the roadmap",
        "Step Order": 5,
        "Detailed Content": "Establish clear milestones and review progress periodically. Update priorities when reforms advance or new barriers emerge.",
        "Belongs to Pathway": [p22RecordId]
      }
    }
  ];

  await batchCreate("Implementation Guidance", newGuidance);
  console.log("✓ Created 12 Implementation Guidance records for Action 2 in Airtable.");

  console.log("=== STEP 4: Refreshing Key Resources (Tools & Examples) in Airtable ===");
  const krRes = await airtableFetch("Key%20Resources");
  const krToDelete = (krRes.records || [])
    .filter((r: any) =>
      r.fields["Belongs to Pathway"]?.includes(p21RecordId) ||
      r.fields["Belongs to Pathway"]?.includes(p22RecordId)
    )
    .map((r: any) => r.id);

  if (krToDelete.length > 0) {
    console.log(`Deleting ${krToDelete.length} existing Key Resources records...`);
    await batchDelete("Key Resources", krToDelete);
  }

  const newKeyResources = [
    // Pathway 2.1 Tools
    {
      fields: {
        "Example Title": "National Enabling Framework Conditions (EFC) Tool",
        "Type": "Tool",
        "Full Text / Concept Explanation": "The tool assesses national enabling conditions for urban climate finance across four categories: policy, budget and finance, climate data, and vertical and horizontal coordination. These cover 16 subcategories and 64 assessment dimensions. Through evidence collection, stakeholder consultations and analysis, the tool helps national governments understand existing enabling conditions, identify barriers to urban climate investment and prioritise areas for reform.",
        "Excerpt": "The tool assesses national enabling conditions for urban climate finance across four categories: policy, budget and finance, climate data, and vertical and horizontal coordination.",
        "Why see this / When to use this": "Why use this tool: Assess national policy, fiscal and institutional barriers to urban climate finance and identify reform priorities requiring national action.",
        "Order": 1,
        "Belongs to Pathway": [p21RecordId]
      }
    },
    {
      fields: {
        "Example Title": "Subnational Enabling Framework Conditions (EFC) Tool",
        "Type": "Tool",
        "Full Text / Concept Explanation": "The tool is designed primarily for subnational and municipal governments. It assesses enabling conditions for urban climate finance at the city, metropolitan, state or regional level. It covers 49 assessment dimensions across four categories and 13 subcategories. Through evidence collection, stakeholder consultations and analysis, it helps subnational governments identify strengths, investment barriers and areas for improvement. Used alongside the National EFC Tool, it helps identify barriers requiring action at different government levels.",
        "Excerpt": "The tool is designed primarily for subnational and municipal governments. It assesses enabling conditions for urban climate finance at the city, metropolitan, state or regional level.",
        "Why see this / When to use this": "Why use this tool: Assess local conditions affecting access to climate finance and identify improvements requiring subnational action.",
        "Order": 2,
        "Belongs to Pathway": [p21RecordId]
      }
    },

    // Pathway 2.1 Peer Learning Examples
    {
      fields: {
        "Example Title": "India – National Enabling Framework Conditions Assessment",
        "Type": "Peer Learning Example",
        "Full Text / Concept Explanation": "The India assessment illustrates how the national EFC tool works in practice. The pilot was led by GIZ, alongside the Indian Ministry of Housing and Urban Affairs, the National Institute of Urban Affairs and The Energy Research Institute. It included a desk review with seven stakeholder interviews and two roundtables in New Delhi attended by more than 80 participants. The findings on the four dimensions included gaps in local institutional mandates, own-source revenues and borrowings, city-level climate data and coordination between state and local governments. Each gap points to a specific reform — broadening grants from the national finance commission to support climate action, for instance, or issuing city climate action plan guidelines under national missions.",
        "Excerpt": "The India assessment illustrates how the national EFC tool works in practice. The pilot was led by GIZ, alongside the Indian Ministry of Housing and Urban Affairs, the National Institute of Urban Affairs and The Energy Research Institute...",
        "Why see this / When to use this": "Why see this: See how a national assessment can diagnose enabling environments related to national policy, data, finance and institutional coordination and make recommendations for reforms.",
        "Order": 3,
        "Belongs to Pathway": [p21RecordId]
      }
    },
    {
      fields: {
        "Example Title": "Indonesia – Subnational Enabling Framework Conditions Assessment",
        "Type": "Peer Learning Example",
        "Full Text / Concept Explanation": "Indonesia shows how a subnational assessment can identify strengths, gaps and opportunities to improve enabling conditions for urban climate finance. Conducted under the Urban-Act project, the assessment covered Medan City, Binjai City and Deli Serdang Regency (Mebidang) in North Sumatra. It found progress in integrating climate priorities into local development plans and using intergovernmental transfers for climate action. However, gaps remain in municipal climate budgeting, access to private and innovative finance, climate data and coordination across government levels. The assessment recommended extending climate budget tagging to municipalities, strengthening local revenue and financing options, and establishing a coordination team led by North Sumatra's Development Planning Agency. These recommendations aim to strengthen local financing conditions and align climate planning and implementation across government levels.",
        "Excerpt": "Indonesia shows how a subnational assessment can identify strengths, gaps and opportunities to improve enabling conditions for urban climate finance. Conducted under the Urban-Act project...",
        "Why see this / When to use this": "Why see this: See how a subnational assessment can identify existing strengths and gaps and inform recommendations to improve climate finance and multilevel governance.",
        "Order": 4,
        "Belongs to Pathway": [p21RecordId]
      }
    },
    {
      fields: {
        "Example Title": "India – Subnational Enabling Framework Conditions Assessment (Coimbatore)",
        "Type": "Peer Learning Example",
        "Full Text / Concept Explanation": "India shows how a subnational assessment can identify strengths, gaps and opportunities to improve urban climate finance across city and state governments. Conducted in Coimbatore, Tamil Nadu, the assessment examined climate policy, budgeting and finance, climate data and multilevel coordination. It found that Tamil Nadu state has established climate policies and financing institutions, while Coimbatore city has developed a Climate Resilient City Action Plan and mobilized finance through government programmes and other sources. However, gaps remain in city-level climate budgeting, access to finance, climate data and alignment between state and municipal planning. The assessment recommended strengthening climate budgeting, expanding state support for municipal climate investment and improving coordination between state and city institutions.",
        "Excerpt": "India shows how a subnational assessment can identify strengths, gaps and opportunities to improve urban climate finance across city and state governments. Conducted in Coimbatore, Tamil Nadu...",
        "Why see this / When to use this": "Why see this: See how a city-level assessment can identify existing strengths and gaps, and inform improvements to state and municipal policies, financing systems and coordination.",
        "Order": 5,
        "Belongs to Pathway": [p21RecordId]
      }
    },

    // Pathway 2.2 Tools
    {
      fields: {
        "Example Title": "Climate Finance Reform Compass (CPI)",
        "Type": "Tool",
        "Full Text / Concept Explanation": "The Climate Finance Reform Compass helps align government, civil society, and the private sector on the full range of financial architecture reforms needed to maximize climate finance opportunities. It provides an action-oriented framework for translating climate finance commitments and identified gaps into prioritized reform areas, milestones, and institutional actions. The Global Compass tracks progress across nine thematic areas for the international community to understand where progress is being made, where gaps persist, and how reforms can reinforce each other. Click here to know more.",
        "Excerpt": "The Climate Finance Reform Compass helps align government, civil society, and the private sector on the full range of financial architecture reforms needed to maximize climate finance opportunities...",
        "Why see this / When to use this": "Why use this tool: Identify climate-finance reform priorities, track progress and support coordination among institutions responsible for implementing reforms.",
        "Order": 1,
        "Belongs to Pathway": [p22RecordId]
      }
    },
    {
      fields: {
        "Example Title": "The Brazil Climate Finance Reform Compass",
        "Type": "Tool",
        "Full Text / Concept Explanation": "The Brazil Climate Finance Reform Compass adapts the global framework to national context, identifying gaps and reform priorities across the same nine thematic areas and mapping the institutions, actors and milestones needed to advance them. Both are designed as living tools that can be updated as policies, evidence and stakeholder priorities evolve, helping governments and other stakeholders coordinate reforms, track progress and strengthen alignment between climate finance and broader development priorities.",
        "Excerpt": "The Brazil Climate Finance Reform Compass adapts the global framework to national context, identifying gaps and reform priorities across the same nine thematic areas...",
        "Why see this / When to use this": "Why use this tool: See how a climate-finance reform framework can be tailored to national institutions, priorities and decision-making processes.",
        "Order": 2,
        "Belongs to Pathway": [p22RecordId]
      }
    },

    // Pathway 2.2 Peer Learning Examples
    {
      fields: {
        "Example Title": "Uganda – Support to Municipal Infrastructure Development (USMID)",
        "Type": "Peer Learning Example",
        "Full Text / Concept Explanation": "Uganda shows how national governments can support municipal reform planning through institutional assessments and performance-linked financing. Led by the Ministry of Lands, Housing and Urban Development, the programme began in 2013 with 14 municipalities. Technical, financial and institutional assessments informed a Programme Action Plan, outlining corrective actions, institutional responsibilities and implementation timelines. Municipalities also developed capacity-building plans addressing weaknesses in planning, revenue management, procurement and infrastructure delivery. Annual performance assessments linked infrastructure grants to improvements in municipal revenue collection, financial management, budgeting, procurement and service delivery. The programme closed in 2024 with a satisfactory outcome rating. Building on its achievements, Uganda secured approval in 2026 for the USD 540 million Uganda Cities and Municipalities Infrastructure Development (UCMID) programme, expanding support for municipal institutions and climate-smart infrastructure.",
        "Excerpt": "Uganda shows how national governments can support municipal reform planning through institutional assessments and performance-linked financing...",
        "Why see this / When to use this": "Why see this: See how national governments can connect institutional assessments, municipal reform plans and performance-linked financing to strengthen urban investment conditions.",
        "Order": 3,
        "Belongs to Pathway": [p22RecordId]
      }
    },
    {
      fields: {
        "Example Title": "South Africa – Metro Trading Services Reform Programme",
        "Type": "Peer Learning Example",
        "Full Text / Concept Explanation": "South Africa shows how national government can lead reform programs that build on municipal reform strategies. Led by the National Treasury, the programme aims to strengthen municipal finances and attract additional infrastructural investment. It responds to the declining financial and operational performance in water, sanitation, electricity and waste services across eight metropolitan municipalities. Participating municipalities have adopted reform strategies, institutional roadmaps, and business and investment plans. These set out institutional changes and investment priorities, while performance improvement plans establish measurable targets. A six-year, ZAR 54 billion (~USD 3.85 billion) performance-linked grant incentivises reforms, with funding tied to progress on the reforms against agreed targets.",
        "Excerpt": "South Africa shows how national government can lead reform programs that build on municipal reform strategies. Led by the National Treasury, the programme aims to strengthen municipal finances...",
        "Why see this / When to use this": "Why see this: See how national governments can support municipal reform roadmaps through institutional coordination and performance-linked financing.",
        "Order": 4,
        "Belongs to Pathway": [p22RecordId]
      }
    }
  ];

  await batchCreate("Key Resources", newKeyResources);
  console.log("✓ Created 9 Key Resources (Tools & Examples) for Action 2 in Airtable.");
  console.log("=== DONE: Action 2 successfully populated in Airtable! ===");
}

main().catch(err => {
  console.error("Error seeding Action 2 to Airtable:", err);
  process.exit(1);
});
