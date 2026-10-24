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
  const a4RecordId = "receq4NAEIFCVdNcD";

  console.log("=== STEP 1: Updating Action 4 in Airtable ===");
  await airtableFetch(`Actions/${a4RecordId}`, {
    method: "PATCH",
    body: JSON.stringify({
      fields: {
        "Title": "Mobilize Finance and Shape Markets",
        "Action Number": 4,
        "Description": "This Action helps national governments to mobilize finance for implementing urban climate investment portfolios. It covers local climate funds and financing structures, financial instruments, and market-shaping approaches such as aggregated procurement. These approaches help cities to access capital, address financing barriers and create market conditions that support climate investment at scale.",
        "Systems Logic": "Investment-ready portfolios need appropriate financing arrangements. Local climate investment structures can manage and channel capital towards municipal investment portfolios. Financial instruments, including guarantees, concessional finance and insurance, can address specific risks and improve access to public and private investment. Aggregation approaches can create demand for climate solutions and support wider deployment. National governments can enable these approaches through funding, regulatory support, national development banks and partnerships with subnational governments and financing institutions."
      }
    })
  });
  console.log("✓ Updated Action 4 Title, Description, and Systems Logic.");

  console.log("=== STEP 2: Checking existing Pathways linked to Action 4 ===");
  const pRes = await airtableFetch("Pathways");
  const existingA4Pathways = (pRes.records || []).filter((r: any) =>
    r.fields["Belongs to Action"]?.includes(a4RecordId) ||
    String(r.fields["Pathway Title"] || "").startsWith("4.")
  );

  if (existingA4Pathways.length > 0) {
    const oldPathwayIds = existingA4Pathways.map((r: any) => r.id);
    console.log(`Found ${oldPathwayIds.length} existing pathways for Action 4. Cleaning up child records first...`);

    // Delete child Guidance
    const igRes = await airtableFetch("Implementation%20Guidance");
    const igToDelete = (igRes.records || [])
      .filter((r: any) => r.fields["Belongs to Pathway"]?.some((id: string) => oldPathwayIds.includes(id)))
      .map((r: any) => r.id);
    if (igToDelete.length > 0) {
      await batchDelete("Implementation Guidance", igToDelete);
    }

    // Delete child Key Resources and Sub-Examples
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

    // Delete child Concept Boxes linked to old pathways
    const cbRes = await airtableFetch("Concept%20%26%20Explainer%20Boxes");
    const cbToDelete = (cbRes.records || [])
      .filter((r: any) => r.fields["Belongs to Pathway"]?.some((id: string) => oldPathwayIds.includes(id)))
      .map((r: any) => r.id);
    if (cbToDelete.length > 0) {
      await batchDelete("Concept & Explainer Boxes", cbToDelete);
    }

    // Delete old pathways
    await batchDelete("Pathways", oldPathwayIds);
    console.log("✓ Cleaned up old Action 4 pathways and children.");
  }

  console.log("=== STEP 3: Creating 3 Pathways for Action 4 ===");
  const pathwayPayloads = [
    {
      fields: {
        "Pathway Title": "4.1. Local Climate Funds",
        "Overview": "Local climate funds and financing structures mobilize and channel resources towards local climate priorities by connecting climate portfolios with suitable financing and implementation arrangements available at the city level. These funds can be capitalized through municipal or subnational budgets, national transfers, grants, philanthropic contributions and private capital, depending on their design. They can support investments that are difficult to finance through conventional municipal budgets or commercial sources alone. Local climate funds may take different forms, including municipal funds, community investment funds and devolved climate funds. National governments can support their establishment and operation through legal and fiscal frameworks, funding, technical assistance and partnerships with development banks and other financing institutions.",
        "Potential National Lead": [
          "Finance Ministry",
          "Urban / Local Government Ministry"
        ],
        "Key Actors": [
          "Municipal / Subnational Finance Department",
          "National Development Banks",
          "MDB / DFI",
          "Technical Assistance Providers",
          "Philanthropic Actors",
          "Private Sector",
          "Community Stakeholders"
        ],
        "Transferability Considerations": `• Adapting to governance arrangements: Local climate funds may be established and managed by national or subnational governments or intermediaries, depending on institutional mandates, fiscal space, and fund management capacities.
• Ensuring local ownership: Fund structures should allow local governments and communities to identify investment priorities, even where national institutions or external partners provide financing and oversight.
• Considering funding sources and sustainability: Funds may draw on public budgets, national transfers, private contributions or international grants. Long-term sustainability may depend on reliable domestic resource mobilization.`,
        "Order": 1,
        "Belongs to Action": [a4RecordId]
      }
    },
    {
      fields: {
        "Pathway Title": "4.2. Financial Instruments and Mechanisms",
        "Overview": "Financial instruments and risk-sharing mechanisms help to mobilize climate finance by improving financing conditions, reducing risks and attracting additional capital. These include green bonds, concessional finance, guarantees, insurance and other instruments that address specific financing barriers. They can also be used within blended finance arrangements to mobilize private investment alongside public or concessional resources. The choice of instruments depends on project risks, financing needs, local market conditions and the fiscal or financial capacities of governments. National governments can facilitate cities or subnational governments’ access to these instruments through national development banks, public finance, regulatory frameworks and partnerships with MDBs, DFIs and private financiers. This can help cities and subnational governments to access suitable financing for implementing their climate investment portfolios.",
        "Potential National Lead": [
          "Finance Ministry",
          "National Development Bank",
          "Climate / Environment Ministry"
        ],
        "Key Actors": [
          "City / Subnational Government",
          "Relevant Sector Ministries",
          "MDB / DFI",
          "Commercial Lenders",
          "Institutional Investors",
          "Insurers",
          "Guarantee Providers",
          "Technical Assistance Providers"
        ],
        "Transferability Considerations": `• Accounting for fiscal and regulatory conditions: Municipal borrowing limits, guarantee regulations and financial market regulations may determine which instruments subnational governments can access.
• Considering domestic financial market maturity: Access to commercial lenders, institutional investors and insurers varies across countries. Less developed markets may require additional public support or international financing partners.
• Assessing institutional and financial capacities: Instruments such as green bonds and guarantees require specialised expertise, creditworthiness and financial management capacities that may not be available across all municipalities.`,
        "Order": 2,
        "Belongs to Action": [a4RecordId]
      }
    },
    {
      fields: {
        "Pathway Title": "4.3. Financial Aggregation and Market Shaping",
        "Overview": "Financial aggregation brings together multiple investments, financing providers, borrowers or buyers to improve access to finance and achieve scale for urban climate investments. Supply-side aggregation combines capital from different financing providers to support larger or more diversified investment portfolios. Demand-side aggregation pools the borrowing or purchasing power of cities and other actors to improve financing terms, reduce costs and strengthen market demand. This can include pooled municipal borrowing, collective insurance arrangements and aggregated procurement of climate-aligned goods and services. National governments can enable aggregation through financial intermediaries, risk-sharing mechanisms, procurement frameworks and partnerships across cities, helping overcome financing barriers and create stronger market signals for climate solutions.",
        "Potential National Lead": [
          "Finance Ministry",
          "National Development Bank",
          "Urban / Local Government Ministry",
          "National Procurement Authority"
        ],
        "Key Actors": [
          "Relevant Sector Ministries",
          "Municipal / Subnational Finance Department",
          "Municipal / Subnational Procurement Department",
          "Municipal / Subnational Planning Department",
          "MDB / DFI",
          "Commercial Lenders",
          "Institutional Investors",
          "Insurers",
          "Private Sector",
          "City Networks"
        ],
        "Transferability Considerations": `• Considering market size and participation: Aggregation requires sufficient participation from cities, borrowers, lenders or buyers to achieve economies of scale. Benefits depend on the volume and similarity of their financing or purchasing needs.
• Adapting to institutional arrangements: Aggregation may be managed by national agencies, municipally owned intermediaries or intermunicipal partnerships, depending on governance structures and institutional capacities.
• Accounting for legal and regulatory conditions: Municipal borrowing powers, insurance regulations and procurement policies will affect which aggregation approaches are feasible across countries.`,
        "Order": 3,
        "Belongs to Action": [a4RecordId]
      }
    }
  ];

  const createdPathways = await batchCreate("Pathways", pathwayPayloads);
  const p41Id = createdPathways[0].id;
  const p42Id = createdPathways[1].id;
  const p43Id = createdPathways[2].id;
  console.log(`✓ Created 3 Pathways: 4.1 (${p41Id}), 4.2 (${p42Id}), 4.3 (${p43Id})`);

  console.log("=== STEP 4: Creating Implementation Guidance Records ===");
  const guidanceRecords = [
    // Pathway 4.1 Guidance
    {
      fields: {
        "Step Title": "Identify local financing needs and investment gaps",
        "Step Order": 1,
        "Detailed Content": "Start from city investment plans and portfolios. Assess project ownership, readiness, financing needs and potential revenue sources.",
        "Belongs to Pathway": [p41Id]
      }
    },
    {
      fields: {
        "Step Title": "Support the establishment of local climate funds",
        "Step Order": 2,
        "Detailed Content": "Help local or subnational governments to establish suitable fund arrangements, considering enabling legal frameworks, fiscal responsibilities and institutional capacities.",
        "Belongs to Pathway": [p41Id]
      }
    },
    {
      fields: {
        "Step Title": "Clarify governance arrangements",
        "Step Order": 3,
        "Detailed Content": "Agree on responsibilities for fund management, resource allocation and accountability. Ensure local governments retain ownership of investment priorities, with national oversight where appropriate.",
        "Belongs to Pathway": [p41Id]
      }
    },
    {
      fields: {
        "Step Title": "Mobilise resources for local funds",
        "Step Order": 4,
        "Detailed Content": "Connect funds with national funding programmes, fiscal transfers and development partners. Facilitate contributions from philanthropic organisations, businesses and other financing partners.",
        "Belongs to Pathway": [p41Id]
      }
    },
    {
      fields: {
        "Step Title": "Facilitate access to fund management expertise",
        "Step Order": 5,
        "Detailed Content": "Connect local governments with technical assistance providers and intermediaries to strengthen financial management, investment appraisal and performance monitoring.",
        "Belongs to Pathway": [p41Id]
      }
    },

    // Pathway 4.2 Guidance
    {
      fields: {
        "Step Title": "Identify financing barriers",
        "Step Order": 1,
        "Detailed Content": "Work with cities, subnational governments and financing partners to assess risks, financing needs and barriers that affect priority urban climate investments.",
        "Belongs to Pathway": [p42Id]
      }
    },
    {
      fields: {
        "Step Title": "Match financial instruments to financing needs and capacities",
        "Step Order": 2,
        "Detailed Content": "Identify where guarantees, concessional loans, insurance, green bonds, local-currency financing or other instruments could address specific barriers and improve financing conditions.",
        "Belongs to Pathway": [p42Id]
      }
    },
    {
      fields: {
        "Step Title": "Use public finance strategically",
        "Step Order": 3,
        "Detailed Content": "Deploy national or concessional resources to reduce investment risks and mobilise additional capital. Consider blended finance arrangements where appropriate.",
        "Belongs to Pathway": [p42Id]
      }
    },
    {
      fields: {
        "Step Title": "Mobilise financial and technical partners",
        "Step Order": 4,
        "Detailed Content": "Engage development banks, insurers, investors and technical assistance providers to design aggregation arrangements, manage risks and support municipal participation.",
        "Belongs to Pathway": [p42Id]
      }
    },
    {
      fields: {
        "Step Title": "Align financial instruments with national programmes",
        "Step Order": 5,
        "Detailed Content": "Integrate them into existing funding programmes or investment structures where possible.",
        "Belongs to Pathway": [p42Id]
      }
    },
    {
      fields: {
        "Step Title": "Monitor financing outcomes",
        "Step Order": 6,
        "Detailed Content": "Track capital mobilised, financing costs, risk reduction and investment outcomes. Use findings to improve the effectiveness of financial instruments over time.",
        "Belongs to Pathway": [p42Id]
      }
    },

    // Pathway 4.3 Guidance
    {
      fields: {
        "Step Title": "Identify opportunities for aggregation",
        "Step Order": 1,
        "Detailed Content": "Work with cities, subnational governments and financing partners to identify common borrowing, insurance or purchasing needs that could benefit from aggregation.",
        "Belongs to Pathway": [p43Id]
      }
    },
    {
      fields: {
        "Step Title": "Select suitable aggregation approaches",
        "Step Order": 2,
        "Detailed Content": "Assess whether pooling financing sources, municipal borrowing, insurance risks or purchasing demand could improve access to finance, reduce costs or strengthen market demand.",
        "Belongs to Pathway": [p43Id]
      }
    },
    {
      fields: {
        "Step Title": "Address regulatory and institutional barriers",
        "Step Order": 3,
        "Detailed Content": "Review municipal borrowing powers, procurement policies and financial regulations that may restrict aggregation. Support reforms or enabling arrangements where feasible.",
        "Belongs to Pathway": [p43Id]
      }
    },
    {
      fields: {
        "Step Title": "Mobilise financial and technical partners",
        "Step Order": 4,
        "Detailed Content": "Engage development banks, insurers, investors and technical assistance providers to structure aggregation mechanisms, share risks and support municipal participation.",
        "Belongs to Pathway": [p43Id]
      }
    },
    {
      fields: {
        "Step Title": "Support aggregated purchasing and market development",
        "Step Order": 5,
        "Detailed Content": "Help public and private buyers coordinate purchasing demand and engage suppliers around common specifications, investment needs and deployment opportunities.",
        "Belongs to Pathway": [p43Id]
      }
    },
    {
      fields: {
        "Step Title": "Track aggregation outcomes and support scale",
        "Step Order": 6,
        "Detailed Content": "Assess whether aggregation improves financing access, reduces costs or strengthens market demand. Use findings to expand successful approaches across municipalities.",
        "Belongs to Pathway": [p43Id]
      }
    }
  ];

  await batchCreate("Implementation Guidance", guidanceRecords);
  console.log(`✓ Created ${guidanceRecords.length} Implementation Guidance records.`);

  console.log("=== STEP 5: Creating Concept & Explainer Box for Pathway 4.2 ===");
  const conceptBoxRecords = [
    {
      fields: {
        "Box Title": "What is Blended Finance?",
        "Tag / Category": "Financial Mechanism",
        "Placement / Section": "Overview",
        "Excerpt / Summary": "Blended finance is the strategic use of a limited amount of concessional public or philanthropic capital to mobilize additional finance, primarily from commercial and private sources — toward sustainable development and climate goals.",
        "Full Text / Explanation": `Blended finance is the strategic use of a limited amount of concessional public or philanthropic capital to mobilize additional finance, primarily from commercial and private sources — toward sustainable development and climate goals. Rather than a single financial instrument, it is a structuring approach: public actors (donors, development agencies, philanthropies, and development finance institutions) absorb or share risks that would otherwise deter private investors, improving a project's risk-return profile enough to attract market-rate capital. The concessional capital at the core of a blended structure can take several forms, including grants, concessional debt or equity, guarantees, and other risk-sharing facilities. These de-risking mechanisms matter most in emerging markets and developing economies, where country-specific risk accounts for between 60 and 90 percent of investors' risk considerations, and where about 80–90 percent of climate mitigation investment is expected to come from the private sector. The overarching goal is to crowd in private money that would not have been invested otherwise, deploying only as much public subsidy as is needed to make a project viable.`,
        "Order": 1,
        "Belongs to Pathway": [p42Id]
      }
    }
  ];
  await batchCreate("Concept & Explainer Boxes", conceptBoxRecords);
  console.log("✓ Created Concept Box for Pathway 4.2.");

  console.log("=== STEP 6: Creating Key Resources in Airtable ===");
  const keyResourcesData = [
    // 4.1 Resources
    {
      fields: {
        "Example Title": "Kenya – County Climate Change Funds (CCCFs)",
        "Type": "Peer Learning Example",
        "Order": 1,
        "Why see this / When to use this": "See how national governments can support local climate funds that combine local decision-making, domestic resources and external climate finance.",
        "Excerpt": "Kenya demonstrates how devolved climate finance can enable locally led adaptation while remaining anchored in national policy.",
        "Full Text / Concept Explanation": `Kenya demonstrate how devolved climate finance can enable locally led adaptation while remaining anchored in national policy. CCCFs were piloted in Isiolo in 2011–12 and later expanded to Garissa, Kitui, Makueni, Wajir and beyond. These funds identify, prioritize and finance local adaptation investments through county planning and budgeting systems, with county and ward committees steering decisions and local knowledge and climate information built into planning and monitoring. They are designed to blend resources from international climate finance, multilateral development banks, the private sector, national government transfers and counties’ own-source revenues. Several counties have legislated commitments of 1–2 per cent of development budgets to capitalise CCCFs. These commitments helped to attract external finance, including seed funding from the UK and Sweden. CCCFs are aligned with Kenya’s National Adaptation Plan (NAP), the National Climate Change Action Plan, and the Climate Change Act. The success of pilots helped to pave the way for national scale-up. By 2023 all 47 Kenyan counties had CCCFs in place, creating the basis for a new Financing Locally Led Climate Action Program funded by the World Bank and the governments of Denmark and Sweden, and led by the National Treasury.`,
        "Belongs to Pathway": [p41Id]
      }
    },
    {
      fields: {
        "Example Title": "Italy – ForestaMi Fund, Milan",
        "Type": "Peer Learning Example",
        "Order": 2,
        "Why see this / When to use this": "See how governments can partner with philanthropic institutions to establish and manage local climate funds.",
        "Excerpt": "Milan illustrates how municipal and subnational governments can work with philanthropic institutions to establish dedicated funds for local climate action.",
        "Full Text / Concept Explanation": `Milan illustrates how municipal and subnational governments can work with philanthropic institutions to establish dedicated funds for local climate action. Launched in 2019, Forestami brings together the Municipality and Metropolitan City of Milan, Lombardy Region, universities, foundations and other local institutions to support urban forestry and climate resilience. A local fund was established within Fondazione di Comunità Milano to mobilise contributions from businesses and citizens towards the goal of planting three million trees by 2030. In April 2025, the initiative transitioned into Fondazione Forestami, an independent nonprofit foundation responsible for expanding its activities across the metropolitan area and beyond. The city of Lund in Sweden is also planning to replicate this model to accelerate municipal tree planting, which will not only improve local climatic conditions but also provide additional economic value to businesses through place-based improvements.`,
        "Belongs to Pathway": [p41Id]
      }
    },
    {
      fields: {
        "Example Title": "United Kingdom – Bristol's Local Climate Investment Funds",
        "Type": "Peer Learning Example",
        "Order": 3,
        "Why see this / When to use this": "See how cities can mobilize community and private capital through local funds, and how national governments can support the replication of successful models.",
        "Excerpt": "Bristol shows how municipalities can mobilize community and private capital for climate action through local funds.",
        "Full Text / Concept Explanation": `Bristol shows how municipalities can mobilize community and private capital for climate action through local funds. Through its Climate Action Investment initiative, developed under the EU NetZeroCities Pilot Cities Programme, Bristol City Council enables residents and businesses to invest as little as GBP 5 in energy-efficiency and renewable-energy improvements to council-owned buildings. The initiative raised over GBP 500,000 in its first five weeks towards an initial GBP 1 million target, offering investors a five-year loan with 4.2% annual interest. Separately, the Bristol City Leap Community Energy Fund provides GBP 1.5 million in grants and loans for community-led energy projects, funded equally by private partners Ameresco and Vattenfall. The Bristol City Leap model also informed the UK government's Local Net Zero Accelerator programme, which supported a pilot in York and North Yorkshire to explore replicating its approach to mobilising private investment for local net-zero projects.`,
        "Belongs to Pathway": [p41Id]
      }
    },
    {
      fields: {
        "Example Title": "Bhutan – Local Climate Adaptive Living Facility (LoCAL)",
        "Type": "Peer Learning Example",
        "Order": 4,
        "Why see this / When to use this": "See how national governments can use international climate finance to establish local funding mechanisms and transition towards domestic financing and ownership.",
        "Excerpt": "Bhutan illustrates how national governments can channel climate finance to local authorities through existing fiscal transfer systems.",
        "Full Text / Concept Explanation": `Bhutan illustrates how national governments can channel climate finance to local authorities through existing fiscal transfer systems. Introduced in 2011 through a partnership between the Royal Government of Bhutan and UNCDF, LoCAL uses performance-based climate resilience grants and technical assistance to finance locally identified adaptation investments. The programme expanded to over 100 local governments, financing more than 350 adaptation investments by 2023. Building on this experience, Bhutan has integrated LoCAL into its national local government financing system and planned to mobilize domestic resources through the same grant mechanism. This would allow the government to sustain and expand local adaptation financing beyond the initial international support. Accordingly, Bhutan has incorporated performance-based grants into its central budgeting system and included climate vulnerability in the formula for allocating resources to local governments.`,
        "Belongs to Pathway": [p41Id]
      }
    },

    // 4.2 Resources
    {
      fields: {
        "Example Title": "India – Tamil Nadu Water and Sanitation Pooled Fund",
        "Type": "Peer Learning Example",
        "Order": 1,
        "Why see this / When to use this": "See how state and national governments can use blended finance, guarantees and credit enhancement to improve smaller municipalities' access to long-term infrastructure finance.",
        "Excerpt": "India illustrates how state and national governments can use credit enhancement to help smaller municipalities access long-term infrastructure finance.",
        "Full Text / Concept Explanation": `India illustrates how state and national governments can use credit enhancement to help smaller municipalities access long-term infrastructure finance. Established by the Government of Tamil Nadu in 2002, the Water and Sanitation Pooled Fund pooled the borrowing needs of 13 municipalities and issued a USD 6.2 million bond for water and sanitation investments. To reduce investor risks, the state government established reserve funds and escrow accounts to intercept fiscal transfers if repayments fell short, while a USAID partial guarantee provided additional protection. This blended finance arrangement helped to secure an AA credit rating and 15-year financing for municipalities that would otherwise struggle to access capital markets independently. Building on pooled financing experiences in Tamil Nadu and other states, India's national government established the Pooled Finance Development Fund in 2006 to support state-level financing entities through credit enhancement and project preparation assistance.`,
        "Belongs to Pathway": [p42Id]
      }
    },
    {
      fields: {
        "Example Title": "Nigeria – InfraCredit",
        "Type": "Peer Learning Example",
        "Order": 2,
        "Why see this / When to use this": "See how national institutions can partner with development finance organisations to reduce credit risks and mobilize long-term domestic capital for green infrastructure investments.",
        "Excerpt": "Nigeria shows how a nationally backed credit-enhancement facility can mobilise domestic capital for climate-related infrastructure.",
        "Full Text / Concept Explanation": `Nigeria shows how a nationally backed credit-enhancement facility can mobilise domestic capital for climate-related infrastructure. Established in 2017 through a partnership between the Nigeria Sovereign Investment Authority and PIDG's GuarantCo, InfraCredit provides local-currency guarantees that improve the credit quality of infrastructure bonds and attract long-term investment from domestic pension funds, insurers and banks. By the end of 2024, it had guaranteed 24 transactions, mobilising over NGN 200 billion in private investment and supporting nearly NGN 150 billion in bond issuances. These include North South Power's NGN 8.5 billion green bond, Nigeria's first certified corporate green bond. Its approach has informed similar credit-enhancement facilities in Pakistan and Kenya, demonstrating how nationally supported guarantees can expand domestic infrastructure financing.`,
        "Belongs to Pathway": [p42Id]
      }
    },
    {
      fields: {
        "Example Title": "Brazil – BNDES Climate Fund (Fundo Clima)",
        "Type": "Peer Learning Example",
        "Order": 3,
        "Why see this / When to use this": "See how national governments can leverage national development banks to offer preferential, long-term climate lending for municipal infrastructure investments.",
        "Excerpt": "Brazil illustrates how national governments can provide preferential long-term lending for municipal climate investments.",
        "Full Text / Concept Explanation": `Brazil illustrates how national governments can provide preferential long-term lending for municipal climate investments. Coordinated by the Ministry of the Environment and Climate Change and operated by national development bank BNDES, Fundo Clima enables municipalities and other subnational borrowers to access climate financing on preferential terms, including extended repayment periods and grace periods. In May 2026, BNDES announced BRL 500 million in financing for Belo Horizonte's municipal climate-resilience investment plan, including BRL 480 million from Fundo Clima. The financing will support flood and landslide prevention, green infrastructure and restoration of rivers and water sources.`,
        "Belongs to Pathway": [p42Id]
      }
    },
    {
      fields: {
        "Example Title": "CCFLA Financial Instruments Toolkit",
        "Type": "Tool",
        "Order": 4,
        "Why see this / When to use this": "Identify financial instruments suited to specific urban climate investment needs, financing barriers and local market conditions.",
        "Excerpt": "An interactive resource that helps practitioners explore financial instruments for urban climate projects, including how different instruments work and the contexts in which they may be relevant.",
        "Full Text / Concept Explanation": `The CCFLA Financial Instruments Toolkit is an interactive resource that helps practitioners explore financial instruments for urban climate projects, including how different instruments work and the contexts in which they may be relevant. It provides structured guidance on navigating the spectrum of urban climate finance instruments—from debt, equity, and guarantees to results-based financing and blended capital structures—helping project developers and municipal leaders match the right financial mechanisms to their specific infrastructure and resilience needs.`,
        "Belongs to Pathway": [p42Id]
      }
    },
    {
      fields: {
        "Example Title": "ICLEI Climate Finance Decision-Making Tree",
        "Type": "Tool",
        "Order": 5,
        "Why see this / When to use this": "Compare financing options and identify instruments appropriate to local government capacities, investment requirements and financing conditions.",
        "Excerpt": "Helps local and regional governments navigate different financing options through a series of guiding questions.",
        "Full Text / Concept Explanation": `ICLEI climate finance decision-making tree helps local and regional governments navigate different financing options through a series of guiding questions. It provides an overview of each financing tool, including its advantages, disadvantages, and relevant case studies. An overview of the decision-making tree and available financing tools is provided below.`,
        "Belongs to Pathway": [p42Id]
      }
    },

    // 4.3 Resources
    {
      fields: {
        "Example Title": "Sweden – Kommuninvest",
        "Type": "Peer Learning Example",
        "Order": 1,
        "Why see this / When to use this": "See how municipalities can jointly establish a financial intermediary to aggregate borrowing needs, reduce financing costs and access capital markets for local investments, with national regulatory oversight.",
        "Excerpt": "Sweden illustrates how municipalities and regions can aggregate borrowing demand to access long-term financing on more favourable terms.",
        "Full Text / Concept Explanation": `Sweden illustrates how municipalities and regions can aggregate borrowing demand to access long-term financing on more favourable terms. Kommuninvest is a municipally owned financial institution that raises capital from financial markets and lends to its members. Backed by joint guarantees from its 282 municipal and 15 regional members, the model reduces borrowing costs and improves access to capital for local infrastructure investments, including climate-related projects. In 2025, Kommuninvest's total lending reached SEK 563.9 billion, demonstrating the scale of pooled municipal financing. Sweden's legal framework for municipal borrowing enables this model, and Kommuninvest operates under the supervision of the Swedish Financial Supervisory Authority. Kommuninvest provides long-term debt financing but does not generally cover early-stage project preparation, risk capital or climate portfolio orchestration. While Kommuninvest provides long-term debt financing, there are avenues to enhance its offerings to municipalities in the form of early-stage project preparation, risk capital or coordination of climate investment portfolios.`,
        "Belongs to Pathway": [p43Id]
      }
    },
    {
      fields: {
        "Example Title": "Argentina – RAMCC Trust Fund",
        "Type": "Peer Learning Example",
        "Order": 2,
        "Why see this / When to use this": "See how municipalities can establish a shared financing and procurement mechanism to aggregate demand, reduce costs and implement climate investments.",
        "Excerpt": "Argentina shows how municipalities can jointly aggregate purchasing demand to reduce costs and finance local climate investments.",
        "Full Text / Concept Explanation": `Argentina shows how municipalities can jointly aggregate purchasing demand to reduce costs and finance local climate investments. Established in 2018 by the Argentine Network of Municipalities against Climate Change (RAMCC), the Trust Fund enables participating municipalities to pool resources and procure climate-smart technologies collectively. Its governance includes an Assembly of Mayors representing participating municipalities, an elected executive committee and a technical secretariat supporting project development and financing. The Fund has supported joint procurement of LED streetlighting, helping municipalities to achieve economies of scale, reduce procurement costs and improve energy efficiency. The model demonstrates how intermunicipal cooperation can strengthen purchasing power and support implementation of local climate action plans.`,
        "Belongs to Pathway": [p43Id]
      }
    },
    {
      fields: {
        "Example Title": "India – Grand Challenge for Electric Buses",
        "Type": "Peer Learning Example",
        "Order": 3,
        "Why see this / When to use this": "See how national institutions can aggregate purchasing demand across cities, coordinate procurement and use public support to reduce costs and accelerate low-carbon infrastructure deployment.",
        "Excerpt": "India shows how national governments can aggregate municipal purchasing demand to reduce costs and accelerate the deployment of low-carbon transport.",
        "Full Text / Concept Explanation": `India shows how national governments can aggregate municipal purchasing demand to reduce costs and accelerate the deployment of low-carbon transport. Led by Convergence Energy Services Limited (CESL), a subsidiary of the Ministry of Power's Energy Efficiency Services Limited (EESL), the Grand Challenge pooled demand for electric buses across multiple cities through a single procurement process. CESL worked with participating cities to assess fleet requirements, routes and charging infrastructure, while engaging manufacturers to develop standardised tender specifications. Supported by national subsidies and some state contributions, the programme used gross-cost contracts under which private operators finance, own and operate buses and charging infrastructure for 12 years, reducing upfront capital requirements for municipalities. This approach helped to achieve economies of scale, lower procurement costs and support wider adoption of electric buses.`,
        "Belongs to Pathway": [p43Id]
      }
    },
    {
      fields: {
        "Example Title": "Philippines – City Disaster Insurance Pool (PCDIP)",
        "Type": "Peer Learning Example",
        "Order": 4,
        "Why see this / When to use this": "See how national governments can help cities to aggregate insurance demand, pool disaster risks and access more affordable climate-risk protection.",
        "Excerpt": "The Philippines illustrates how national governments can help cities pool insurance demand and disaster risks to access more affordable climate-risk protection.",
        "Full Text / Concept Explanation": `The Philippines illustrates how national governments can help cities pool insurance demand and disaster risks to access more affordable climate-risk protection. Led by the Department of Finance with technical support from the Asian Development Bank (ADB), the proposed PCDIP was designed around ten participating cities, including Quezon City, Davao City, Iloilo City and Marikina City. The model envisaged pooling municipal insurance demand through the Government Service Insurance System (GSIS), with risks transferred to international reinsurance markets. By aggregating demand and diversifying risks across cities, the proposed mechanism aimed to reduce insurance costs and improve coverage against typhoons and earthquakes. Parametric insurance was designed to enable payouts within 15 business days of qualifying disasters, helping cities access funds for early recovery.`,
        "Belongs to Pathway": [p43Id]
      }
    },
    {
      fields: {
        "Example Title": "First Mover Cities Cohort",
        "Type": "Peer Learning Example",
        "Order": 5,
        "Why see this / When to use this": "See how cities and private partners can coordinate procurement governance and turn fragmented demand into clearer market signals for green solutions.",
        "Excerpt": "The First Mover Cities Cohort brings together city representatives, private actors, and partners to discuss green procurement governance and tender design.",
        "Full Text / Concept Explanation": `First Mover Cities Cohort is a dialogue series hosted by the First Movers Coalition, World Economic Forum. The cohort will bring together city representatives, private actors, and other partners to discuss green procurement governance, tender design, and how to turn fragmented demand into clearer market signals. The cohort is engaging cities such as Seattle and San Francisco.`,
        "Belongs to Pathway": [p43Id]
      }
    },
    {
      fields: {
        "Example Title": "C40 Clean Construction Accelerator",
        "Type": "Peer Learning Example",
        "Order": 6,
        "Why see this / When to use this": "See how cities can use municipal procurement commitments to reshape private construction markets and push low-carbon standards.",
        "Excerpt": "Shows how city action can move beyond municipal projects and help reshape the wider construction market.",
        "Full Text / Concept Explanation": `C40 Clean Construction Accelerator shows how city action can move beyond municipal projects and help reshape the wider construction market. It is an initiative that brings together eight cities to help transform the building and construction industry. In the accelerator, mayors commit to reusing and retrofitting existing buildings first, leading by example through municipal procurement, demanding transparency through whole-life carbon assessments, building joint roadmaps with stakeholders, approving at least one net-zero flagship project, assessing resilience impacts, and advocating for action at national and higher levels. These commitments translating into practice – cities are using procurement to push whole-life cycle assessments and low-carbon materials, coordinating across departments, working with private-sector partners such as the North American Electric Construction Coalition, and pressing national governments to remove policy barriers.`,
        "Belongs to Pathway": [p43Id]
      }
    },
    {
      fields: {
        "Example Title": "Intra-City Aggregated Procurement Models",
        "Type": "Tool",
        "Order": 7,
        "Why see this / When to use this": "Identify suitable approaches for coordinating city-wide purchasing demand and shaping markets for low-carbon solutions.",
        "Excerpt": "Framework identifying four approaches cities can use to coordinate public and private demand for low-carbon solutions.",
        "Full Text / Concept Explanation": `Intra-City Aggregated Procurement Models: This framework identifies four approaches cities can use to coordinate public and private demand for low-carbon solutions: market facilitation, material-based mandates, performance-based mandates and tender-based incentives. It explains how cities can use procurement and regulatory powers to create stronger market signals, while national governments can support adoption through enabling regulations, common standards, financing and technical assistance. Developed for green cement and concrete, the approaches can be adapted to other sectors based on local procurement powers and market conditions.`,
        "Belongs to Pathway": [p43Id]
      }
    }
  ];

  await batchCreate("Key Resources", keyResourcesData);
  console.log(`✓ Created ${keyResourcesData.length} Key Resources.`);

  console.log("=== STEP 7: Linking Additional Resources in Airtable ===");
  const arUpdates = [
    { id: 'rec3zrRUUGEvSSv97', pathway: [p41Id] },
    { id: 'recs1g0b7dWGDXo76', pathway: [p41Id] },
    { id: 'recqW0Gitzyqdxdlu', pathway: [p42Id] },
    { id: 'recxcgZq3uD6u3jZu', pathway: [p42Id] },
    { id: 'recUASL5speEuV4Au', pathway: [p43Id] },
    { id: 'rec53LUafEi6Rql8p', pathway: [p43Id] },
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
  console.log(" Action 4 Seeding Completed Successfully in Airtable! ");
  console.log("=======================================================");
}

main().catch(err => {
  console.error("FATAL ERROR in seeding Action 4:", err);
  process.exit(1);
});
