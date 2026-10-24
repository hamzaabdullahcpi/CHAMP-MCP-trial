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
  console.log("=== STEP 1: Updating Action 1 Record in Airtable ===");
  const a1RecordId = "recQ8Zb1myageh9SH";
  await airtableFetch(`Actions/${a1RecordId}`, {
    method: "PATCH",
    body: JSON.stringify({
      fields: {
        "Title": "Establish Multilevel Commitments and Platforms for Climate Investment",
        "Action Number": 1,
        "Description": "This Action helps national governments align national climate commitments with city and subnational priorities and establish platforms for coordinated implementation and investment. It supports governments to translate NDCs and other national commitments into shared priorities, clarify responsibilities and connect local investment needs with national and international support.",
        "Systems Logic": "Climate investment requires shared priorities and sustained coordination across government levels. Joint commitments can connect NDCs and other national goals with local priorities, responsibilities and investment needs. National coordination mechanisms can sustain coordination between governments and wider implementation actors. Country platforms can then connect urban priorities with national investment strategies and finance partners. Together, these mechanisms create the institutional foundations for investment planning, finance mobilization and implementation."
      }
    })
  });
  console.log("Updated Action 1 metadata.");

  console.log("=== STEP 2: Cleaning up old Action 1 and Action 3 Pathways and their child records ===");
  const pathwaysToDelete = [
    "recgu4oUzKXLVihBJ", // 1.1 Joint Climate Commitments
    "reccOoNzAQ1uFP8Zc", // 1.2 Whole-of-Society
    "recYmBefF5hPnVBpq", // 3.1 Recurring National-Subnational
    "rec3nWjmRlrRXkbhn", // 3.2 National Platforms
    "rec8hnhHBtpf8qQIC", // 3.3 Intermediary Coordination
  ];

  // 2a. Implementation Guidance
  const gData = await airtableFetch("Implementation%20Guidance");
  const gToDelete = (gData.records || [])
    .filter((r: any) => r.fields["Belongs to Pathway"]?.some((id: string) => pathwaysToDelete.includes(id)))
    .map((r: any) => r.id);
  if (gToDelete.length > 0) {
    console.log(`Deleting ${gToDelete.length} old Guidance records...`);
    await batchDelete("Implementation Guidance", gToDelete);
  }

  // 2b. Key Resources
  const krData = await airtableFetch("Key%20Resources");
  const krToDelete = (krData.records || [])
    .filter((r: any) => r.fields["Belongs to Pathway"]?.some((id: string) => pathwaysToDelete.includes(id)))
    .map((r: any) => r.id);
  if (krToDelete.length > 0) {
    console.log(`Deleting ${krToDelete.length} old Key Resources records...`);
    await batchDelete("Key Resources", krToDelete);
  }

  // 2c. Additional Resources
  const arData = await airtableFetch("Additional%20Resources");
  const arToDelete = (arData.records || [])
    .filter((r: any) => r.fields["Pathway"]?.some((id: string) => pathwaysToDelete.includes(id)))
    .map((r: any) => r.id);
  if (arToDelete.length > 0) {
    console.log(`Deleting ${arToDelete.length} old Additional Resources records...`);
    await batchDelete("Additional Resources", arToDelete);
  }

  // 2d. Pathways themselves
  console.log(`Deleting ${pathwaysToDelete.length} old Pathways records...`);
  await batchDelete("Pathways", pathwaysToDelete);

  console.log("=== STEP 3: Creating the 3 revised Pathways for Action 1 ===");
  const newPathways = [
    {
      fields: {
        "Pathway Title": "1.1 Multilevel Climate Commitments",
        "Belongs to Action": [a1RecordId],
        "Overview": "Multilevel climate commitments align national, subnational and city governments around shared climate priorities and responsibilities. They can help translate NDCs, NAPs and national climate strategies into locally relevant priorities, investment needs and implementation responsibilities. This creates a clearer link between national climate commitments, local action and climate finance.",
        "Potential National Lead": ["Ministry of Climate / Environment"],
        "Key Actors": [
          "Planning Ministry",
          "Finance Ministry",
          "City / Subnational Planning Department",
          "City / Subnational Finance Department",
          "City Networks",
          "National Funds"
        ],
        "Transferability Considerations": [
          "Adapting commitments to the context: Countries can embed multilevel commitments within NDCs, NAPs or national climate strategies. A separate multilevel commitment process may be useful where existing processes are insufficient.",
          "Setting common principles while allowing differentiated commitments: Establish a small set of core commitments for participating governments, while allowing cities to add more ambitious or more detailed commitments based on their climate priorities, institutional capacity and readiness.",
          "Ensuring broad and representative participation: Countries can involve cities directly, through subnational associations or through phased participation, depending on governance arrangements and institutional capacity.",
          "Aligning commitments with NDC review cycles: Where possible, countries should review commitments alongside NDC review periods so that those become part of routine decision-making."
        ].join("\n\n"),
        "Order": 1
      }
    },
    {
      fields: {
        "Pathway Title": "1.2 National Coordination Mechanisms",
        "Belongs to Action": [a1RecordId],
        "Overview": "National coordination mechanisms provide a structure for national and subnational governments to coordinate climate investment and implementation. They connect local priorities with national policies, programmes, finance and technical support. They can also enable whole-of-society engagement, bringing in businesses, finance institutions, academia, civil society and communities where needed. To sustain this coordination, mechanisms can include dedicated capacity to convene actors day-to-day, follow up on financing and implementation needs, and bring local feedback into national decision-making.",
        "Potential National Lead": ["Ministry of Climate / Environment", "Urban / Local Government Ministry"],
        "Key Actors": [
          "Planning Ministry",
          "Finance Ministry",
          "Municipal / Subnational Planning Department",
          "Municipal / Subnational Finance Department",
          "National Development Bank",
          "City Networks",
          "Private Sector",
          "Civil Society",
          "Academia"
        ],
        "Transferability Considerations": [
          "Adapting the form of coordination to national context: Countries can use a national coordination platform; recurring dialogue series, funder coordination mechanisms, or other arrangements suited to their priorities, governance system and institutional capacity.",
          "Assigning coordination responsibilities reflecting the governance system: In centralized systems, a national ministry may lead coordination. In decentralized systems, responsibilities may be shared across national, regional or state governments working with cities.",
          "Accounting for differences in local capacity: Where cities have different levels of capacity, coordination mechanisms may need to provide additional technical support to help lower-capacity cities participate effectively.",
          "Involving actors based on the issues being addressed: Financing barriers may require the leadership of finance ministries and financial institutions, while sector-specific challenges may also require coordinating relevant ministries or technical partners."
        ].join("\n\n"),
        "Order": 2
      }
    },
    {
      fields: {
        "Pathway Title": "1.3 Urban-Inclusive Country Platforms",
        "Belongs to Action": [a1RecordId],
        "Overview": "Urban-inclusive country platforms bring city and subnational priorities into nationally led processes for mobilizing climate and development finance. Country platforms align governments and development partners around a shared mission, such as climate action, Cities and subnational governments, however, are often not systematically represented in these platforms, despite their important role in climate action. Urban-inclusive platforms can address this gap by integrating urban and subnational priorities into platform governance, investment planning and financing. This can align national and local climate plans, strengthen urban investment pipelines, and mobilize public, development and private finance for local climate action.",
        "Potential National Lead": ["Finance Ministry", "Planning Ministry"],
        "Key Actors": [
          "Ministry of Climate / Environment",
          "Urban / Local Government Ministry",
          "Sectoral Ministries (e.g., energy, transport)",
          "National Development Banks",
          "Multilateral Development Banks",
          "City / Subnational Governments",
          "Bilateral Agencies",
          "City / Subnational Coalitions"
        ],
        "Transferability Considerations": [
          "Aligning leadership with institutional responsibilities: Country platforms may be led by finance or planning ministries or coordinated through central government institutions. Leadership should reflect existing responsibilities for investment planning and finance mobilization.",
          "Considering the governance system: Depending on the degree of decentralization and number of jurisdictions, cities may participate directly or through regional governments, municipal associations or other representative bodies.",
          "Accounting for differences in investment readiness: Smaller cities and those with limited technical or financial capacity may require additional project preparation support, financial intermediation or project aggregation to participate effectively.",
          "Adapting the platform's scope and financing arrangements: Countries can begin with investment portfolios in priority sectors and expand over time. Financing arrangements should reflect local borrowing powers, creditworthiness and access to capital."
        ].join("\n\n"),
        "Order": 3
      }
    }
  ];

  const createdPathways = await batchCreate("Pathways", newPathways);
  const p1_1_id = createdPathways[0].id;
  const p1_2_id = createdPathways[1].id;
  const p1_3_id = createdPathways[2].id;
  console.log(`Created pathways: 1.1 (${p1_1_id}), 1.2 (${p1_2_id}), 1.3 (${p1_3_id})`);

  console.log("=== STEP 4: Creating Implementation Guidance for the 3 Pathways ===");
  const guidanceRecords = [
    // Pathway 1.1 Guidance
    {
      fields: {
        "Step Title": "Align national and subnational climate priorities",
        "Belongs to Pathway": [p1_1_id],
        "Detailed Content": "Connect NDCs, NAPs and national climate priorities with subnational plans and priorities. Identify where local action contributes to national commitments.",
        "Step Order": 1
      }
    },
    {
      fields: {
        "Step Title": "Define complementary commitments and responsibilities",
        "Belongs to Pathway": [p1_1_id],
        "Detailed Content": "Agree what national and subnational governments will finance, regulate, coordinate, enable or implement. Identify where responsibilities are shared.",
        "Step Order": 2
      }
    },
    {
      fields: {
        "Step Title": "Connect commitments with investment",
        "Belongs to Pathway": [p1_1_id],
        "Detailed Content": "Link agreed priorities to investment plans, budgets and portfolios. Identify financing needs and where national programmes or external finance can support implementation.",
        "Step Order": 3
      }
    },
    {
      fields: {
        "Step Title": "Review progress and update commitments",
        "Belongs to Pathway": [p1_1_id],
        "Detailed Content": "Regularly assess progress, financing needs and implementation barriers. Use findings to update commitments and inform subsequent national and subnational planning.",
        "Step Order": 4
      }
    },

    // Pathway 1.2 Guidance
    {
      fields: {
        "Step Title": "Build the coordination mechanism on existing processes",
        "Belongs to Pathway": [p1_2_id],
        "Detailed Content": "Identify where climate, planning, budgeting and financing decisions already take place. Strengthen these processes rather than creating additional arrangements.",
        "Step Order": 1
      }
    },
    {
      fields: {
        "Step Title": "Clarify roles across government levels",
        "Belongs to Pathway": [p1_2_id],
        "Detailed Content": "Define which institutions are responsible for financing, regulating and implementing priority actions. Identify where responsibilities are shared and require national–subnational coordination.",
        "Step Order": 2
      }
    },
    {
      fields: {
        "Step Title": "Engage actors beyond government",
        "Belongs to Pathway": [p1_2_id],
        "Detailed Content": "Identify businesses, finance institutions, academia, civil society and community actors that influence climate action. Bring them into the coordination process to contribute finance, expertise, assets and implementation capacity.",
        "Step Order": 3
      }
    },
    {
      fields: {
        "Step Title": "Connect coordination to investment decisions",
        "Belongs to Pathway": [p1_2_id],
        "Detailed Content": "Use coordination mechanisms to identify investment needs, and coordinate finance, technical assistance or policy support needed to move climate priorities forward.",
        "Step Order": 4
      }
    },
    {
      fields: {
        "Step Title": "Provide capacity to sustain coordination",
        "Belongs to Pathway": [p1_2_id],
        "Detailed Content": "Identify a team or institution to convene actors, track local needs and agreed actions, and facilitate follow-up across national and subnational governments.",
        "Step Order": 5
      }
    },
    {
      fields: {
        "Step Title": "Review progress and improve national support",
        "Belongs to Pathway": [p1_2_id],
        "Detailed Content": "Regularly review implementation and financing barriers with subnational governments. Feed lessons into policies, programmes, funding decisions and subsequent coordination cycles.",
        "Step Order": 6
      }
    },

    // Pathway 1.3 Guidance
    {
      fields: {
        "Step Title": "Establish national ownership and mandate",
        "Belongs to Pathway": [p1_3_id],
        "Detailed Content": "Identify the national institution or group responsible for leading the platform. Define its purpose, responsibilities and relationship with existing government processes.",
        "Step Order": 1
      }
    },
    {
      fields: {
        "Step Title": "Create clear entry points for cities",
        "Belongs to Pathway": [p1_3_id],
        "Detailed Content": "Establish institutional arrangements for cities and subnational governments to bring finance and implementation needs into national discussions.",
        "Step Order": 2
      }
    },
    {
      fields: {
        "Step Title": "Align national and local investment priorities",
        "Belongs to Pathway": [p1_3_id],
        "Detailed Content": "Connect national climate and development objectives with city plans, investment portfolios and project pipelines.",
        "Step Order": 3
      }
    },
    {
      fields: {
        "Step Title": "Coordinate project preparation support",
        "Belongs to Pathway": [p1_3_id],
        "Detailed Content": "Engage project preparation facilities and development partners to strengthen urban pipelines and explore aggregation of smaller projects.",
        "Step Order": 4
      }
    },
    {
      fields: {
        "Step Title": "Bring finance partners into the process",
        "Belongs to Pathway": [p1_3_id],
        "Detailed Content": "Engage national and multilateral development banks, climate funds and private financiers around urban investment needs. Identify suitable public, concessional and private financing instruments.",
        "Step Order": 5
      }
    },
    {
      fields: {
        "Step Title": "Monitor progress and adapt support",
        "Belongs to Pathway": [p1_3_id],
        "Detailed Content": "Track the implementation of urban or subnational portfolios. Use findings to adjust financing arrangements, technical assistance and national support.",
        "Step Order": 6
      }
    }
  ];

  await batchCreate("Implementation Guidance", guidanceRecords);
  console.log(`Created ${guidanceRecords.length} Guidance records.`);

  console.log("=== STEP 5: Creating Peer Learning Examples and Tools in Key Resources ===");
  const keyResourceRecords = [
    // Pathway 1.1 Peer Learning Examples
    {
      fields: {
        "Example Title": "Chile – 2025 Nationally Determined Contribution (NDC)",
        "Belongs to Pathway": [p1_1_id],
        "Type": "Peer Learning Example",
        "Why see this / When to use this": "See how an NDC can connect subnational climate commitments with institutional responsibilities and actions for mobilizing finance.",
        "Full Text / Concept Explanation": "Chile shows how multilevel climate and investment commitments can be embedded within an NDC. Its 2025 NDC includes specific subnational commitments covering regional and municipal climate plans, institutional capacity and climate finance. Notably, Chile commits to establishing a national network to identify, mobilize and deploy subnational climate finance, with active participation from subnational governments. The NDC assigns responsibilities and deadlines for these commitments across government levels, creating a framework to link national ambition with local planning, finance and implementation.",
        "Order": 1
      }
    },
    {
      fields: {
        "Example Title": "Sweden – Climate City Contract 2030",
        "Belongs to Pathway": [p1_1_id],
        "Type": "Peer Learning Example",
        "Learn More URL": "https://viablecities.se/klimatkontrakt-2030",
        "Why see this / When to use this": "See how an iterative multilevel commitment process can link shared climate and investment goals across national and subnational governments.",
        "Full Text / Concept Explanation": "Sweden shows how a multilevel process can help national governments to establish and renew complementary climate commitments. As part of the Climate City Contracts, Swedish municipalities, national government agencies and Viable Cities make commitments around a shared climate-neutrality mission and review them annually. The contracts connect climate goals with portfolios of projects and investment planning. The process has expanded from nine municipalities in 2019 to 48 municipalities.",
        "Order": 2
      }
    },
    {
      fields: {
        "Example Title": "Rwanda – Nationally Determined Contribution (NDC) 3.0",
        "Belongs to Pathway": [p1_1_id],
        "Type": "Peer Learning Example",
        "Why see this / When to use this": "See how an NDC can connect national climate commitments with subnational investment planning and a national institution for mobilizing and deploying climate finance.",
        "Full Text / Concept Explanation": "Rwanda's NDC 3.0 commits to developing climate investment plans that can be implemented across all 30 districts. The Rwanda Green Fund (RGF) and district authorities are among the institutions responsible for financing and implementing this commitment. RGF already mobilizes climate finance and manages facilities that can finance national and local public-sector climate investments. This creates an institutional bridge between national climate commitments, district investment planning and Rwanda's wider climate-finance architecture.",
        "Order": 3
      }
    },
    // Pathway 1.1 Tools
    {
      fields: {
        "Example Title": "Climate Action Aggregation Tool (CAAT)",
        "Belongs to Pathway": [p1_1_id],
        "Type": "Tool",
        "Why see this / When to use this": "Assess how subnational climate commitments could contribute to national targets and incorporate them into NDC and investment planning.",
        "Full Text / Concept Explanation": "Developed by the Initiative for Climate Action Transparency, CAAT showcases a step-by-step process for national governments to quantify and quantify the aggregate GHG impact of climate actions by cities, regions and other non-state actors. It also accounts for overlaps between actions and national policies. National governments can use CAAT to incorporate subnational action into national climate targets, NDC development and investment planning.",
        "Order": 4
      }
    },

    // Pathway 1.2 Peer Learning Examples
    {
      fields: {
        "Example Title": "Sweden – Viable Cities",
        "Belongs to Pathway": [p1_2_id],
        "Type": "Peer Learning Example",
        "Learn More URL": "https://viablecities.se",
        "Why see this / When to use this": "See how a national coordination mechanism can enable multilevel coordination around climate action planning, investment and implementation.",
        "Full Text / Concept Explanation": "Sweden shows how a national coordination mechanism can connect local climate implementation with national priorities and investment support. Launched in 2017, Viable Cities coordinates 48 municipalities, six national government agencies and wider societal actors around a shared climate-neutrality mission. Within Viable Cities, Climate City Contract (CCC) 2030 provides a core multilevel coordination process. National agencies and municipalities participate in annual cycles linking local climate action and investment needs with national support. Cities also connect transition priorities with investment planning, budgets and procurement, helping identify where additional financing or national action is needed. Within CCCs, Transition Arenas extend coordination to businesses, academia and civil society, with Viable Cities providing methods, tools and peer learning for these local collaborations. Viable Cities also has a dedicated Coordination Function that analyses CCCs to identify local and regional needs, facilitates collaboration between cities and national agencies, and aligns CCC processes with national and EU initiatives. The evolution of Viable Cities has also helped to shape the national coordination approaches under the EU Cities Mission.",
        "Order": 1
      }
    },
    {
      fields: {
        "Example Title": "Brazil, Kazakhstan and Uzbekistan – CCFLA Local Hubs",
        "Belongs to Pathway": [p1_2_id],
        "Type": "Peer Learning Example",
        "Learn More URL": "https://citiesclimatefinance.org",
        "Why see this / When to use this": "See how intermediary platforms can support multilevel coordination and connect municipal climate investment priorities with project preparation and financing partners.",
        "Full Text / Concept Explanation": "CCFLA Local Hubs illustrate how intermediary platforms can bring together national and local governments, development partners and finance institutions around urban climate investment priorities. In Central Asia, the Hub convened 25 local governments, 10 national agencies and project preparation partners, including the Gap Fund and FELICITY II, to identify building-decarbonisation projects and connect cities with technical support. In Brazil, the Local Hub brings together over 50 local, national and international partners, supporting coordination through a community of practice and the Green and Resilient Cities Programme (PCVR) Project Bank. These arrangements help strengthen connections between municipal investment needs, national institutions and potential financing partners.",
        "Order": 2
      }
    },
    {
      fields: {
        "Example Title": "Croatia – National Multilevel Climate and Energy Dialogue",
        "Belongs to Pathway": [p1_2_id],
        "Type": "Peer Learning Example",
        "Why see this / When to use this": "See how national–local dialogue can surface local financing barriers and lead to the creation of platforms that connect cities with finance.",
        "Full Text / Concept Explanation": "Croatia shows how multilevel coordination can help national governments to identify subnational financing barriers and translate them into new institutional responses. Between 2022 and 2025, Croatia’s North-West Croatia Regional Energy and Climate Agency (REGEA) facilitated six multilevel climate and energy dialogues involving cities and regions, nine national ministries, businesses, academia and civil society. Initially focused on Croatia's National Energy and Climate Plan, the dialogues evolved to address practical barriers to local implementation, including access to finance. A dedicated dialogue on financing brought municipalities together with the Ministry of Finance and financial-sector actors to discuss how local climate plans could be funded. These discussions led to the creation of the Platform for Sustainable Finance and Energy Transition, providing a dedicated space to connect local financing needs with national and financial-sector actors. Croatia is now working to institutionalise the multilevel dialogue through an inter-ministerial structure involving national and municipal representatives.",
        "Order": 3
      }
    },
    {
      fields: {
        "Example Title": "Morocco – 4C Maroc",
        "Belongs to Pathway": [p1_2_id],
        "Type": "Peer Learning Example",
        "Learn More URL": "https://4cmaroc.org",
        "Why see this / When to use this": "See how a national coordination mechanism can link national and subnational governments with whole-of-society participation, technical capacity and climate-finance support.",
        "Full Text / Concept Explanation": "Morocco shows how a national coordination mechanism can connect national and local governments with wider actors around climate investment and implementation. The Climate Change Competence Centre of Morocco (4C Maroc) is a national platform for climate dialogue and capacity building. It supports Morocco’s climate protection policy and the national green investment plan. The platform brings together more than 15 national ministries, public institutions and associations representing local and regional governments to strengthen coordination between national and subnational climate action. 4C Maroc also brings businesses, civil society, research and training organisations into its governance through dedicated stakeholder groups. Alongside coordination, it supports NDC implementation, decision-making, capacity building and access to climate finance. The platforms has trained more than 800 local actors on subnational climate integration and climate finance and supported projects seeking climate finance under Morocco's NDC.",
        "Order": 4
      }
    },
    {
      fields: {
        "Example Title": "Sweden – Viability Fund for Cities",
        "Belongs to Pathway": [p1_2_id],
        "Type": "Peer Learning Example",
        "Why see this / When to use this": "See how multilevel coordination mechanisms is being developed to align different funding sources around urban climate investment portfolios and connect financing with market demand.",
        "Full Text / Concept Explanation": "The Viability Fund for Cities is an emerging mechanism to coordinate funding from different public and private funders towards urban climate investment portfolios. Building on Sweden's Viable Cities experience, it is being developed around three interconnected functions: ALIGN, bringing funders and implementation partners around shared climate transition portfolios and place-based interventions; CO-FINANCE, mobilising catalytic capital and coordinating contributions from different financing partners towards local investments; and DEMAND, aggregating purchasing demand to shape markets and support deployment of climate solutions. The initiative aims to mobilise EUR 10 billion in co-financing and EUR 10 billion in aggregated demand by 2030, through partnerships across national, subnational and international levels. Its institutional and financing arrangements remain under development and are intended to be adapted to different country contexts.",
        "Order": 5
      }
    },

    // Pathway 1.3 Peer Learning Examples
    {
      fields: {
        "Example Title": "Cameroon – Finance Your Cities Country Platform for Localizing Finance",
        "Belongs to Pathway": [p1_3_id],
        "Type": "Peer Learning Example",
        "Why see this / When to use this": "See how a country platform can integrate urban investment priorities into the national financial architecture, supported by a domestic financial intermediary.",
        "Full Text / Concept Explanation": "Cameroon shows how a country platform can be designed around urban investment and finance priorities from the outset. Announced at COP30, the platform brings national ministries, local and regional governments and the Special Council Support Fund for Mutual Assistance (FEICOM), Cameroon’s municipal financing institution, around a shared pipeline of climate and development projects. The platform aims to align national policies and investment plans with local climate priorities and connect local projects with national and international finance. FEICOM acts as a financial intermediary between cities and finance providers, aiming to connect local projects with private and international capital, as part of a portfolio approach.",
        "Order": 1
      }
    },
    {
      fields: {
        "Example Title": "South Africa – Just Energy Transition Partnership (JET-P)",
        "Belongs to Pathway": [p1_3_id],
        "Type": "Peer Learning Example",
        "Why see this / When to use this": "See how a country platform can integrate municipalities in national investment coordination and support portfolio development, project preparation and finance.",
        "Full Text / Concept Explanation": "South Africa shows how a country platform can create energy-related investment pathways for municipalities. South Africa’s Just Energy Transition Partnership mobilizes international support around the country’s transition, guided by its Just Energy Transition Investment and Implementation Plans. Municipalities have a dedicated portfolio within the platform, reflecting their major role in electricity distribution, energy access and local infrastructure. A JET Municipal Council, led by the South African Local Government Association (SALGA), provides a route for municipal participation in the country platform. It brings together municipal representatives, national ministries, the National Treasury, the Development Bank of Southern Africa (DBSA) and other energy-sector institutions. Through three workstreams covering municipal capability, financing and energy access, the Council identifies investment priorities, develops project pipelines and explores financing options for municipal infrastructure. Dedicated programmes within the municipal portfolio also support municipalities with project preparation and access to concessional and private finance.",
        "Order": 2
      }
    },
    // Pathway 1.3 Tools
    {
      fields: {
        "Example Title": "CCFLA’s Urban-Inclusive Country Platforms Framework",
        "Belongs to Pathway": [p1_3_id],
        "Type": "Tool",
        "Learn More URL": "https://citiesclimatefinance.org",
        "Why see this / When to use this": "Identify a practical roadmap to integrate urban and subnational priorities, investment pipelines and financing needs into country platforms.",
        "Full Text / Concept Explanation": "The framework provides guidance on how a country platform can be designed to systematically integrate cities and subnational priorities into country-platform governance, investment planning and financing. It addresses common barriers, including misalignment between national and local priorities, weak urban project pipelines, limited fiscal capacity and creditworthiness, and a lack of city-focused financial instruments The framework provides a phased roadmap that covers whole-of-government engagement, programme readiness, investment programming, financing and implementation. It identifies practical approaches for engaging cities and subnational governments, strengthening urban investment pipelines, aggregating smaller projects and connecting them with appropriate financing instruments through national and local financial institutions.",
        "Order": 3
      }
    }
  ];

  await batchCreate("Key Resources", keyResourceRecords);
  console.log(`Created ${keyResourceRecords.length} Key Resources records.`);

  console.log("=== Airtable seeding for Action 1 completed successfully! ===");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
