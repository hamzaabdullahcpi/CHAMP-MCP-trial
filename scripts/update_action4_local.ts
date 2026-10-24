import fs from 'fs';
import path from 'path';

const action4Revised = {
  "id": 4,
  "title": "Mobilize Finance and Shape Markets",
  "description": "This Action helps national governments to mobilize finance for implementing urban climate investment portfolios. It covers local climate funds and financing structures, financial instruments, and market-shaping approaches such as aggregated procurement. These approaches help cities to access capital, address financing barriers and create market conditions that support climate investment at scale.",
  "systemsLogic": "Investment-ready portfolios need appropriate financing arrangements. Local climate investment structures can manage and channel capital towards municipal investment portfolios. Financial instruments, including guarantees, concessional finance and insurance, can address specific risks and improve access to public and private investment. Aggregation approaches can create demand for climate solutions and support wider deployment. National governments can enable these approaches through funding, regulatory support, national development banks and partnerships with subnational governments and financing institutions.",
  "pathways": [
    {
      "title": "4.1. Local Climate Funds",
      "overview": "Local climate funds and financing structures mobilize and channel resources towards local climate priorities by connecting climate portfolios with suitable financing and implementation arrangements available at the city level. These funds can be capitalized through municipal or subnational budgets, national transfers, grants, philanthropic contributions and private capital, depending on their design. They can support investments that are difficult to finance through conventional municipal budgets or commercial sources alone. Local climate funds may take different forms, including municipal funds, community investment funds and devolved climate funds. National governments can support their establishment and operation through legal and fiscal frameworks, funding, technical assistance and partnerships with development banks and other financing institutions.",
      "potentialNationalLead": [
        "Finance Ministry",
        "Urban / Local Government Ministry"
      ],
      "keyActors": [
        "Municipal / Subnational Finance Department",
        "National Development Banks",
        "MDB / DFI",
        "Technical Assistance Providers",
        "Philanthropic Actors",
        "Private Sector",
        "Community Stakeholders"
      ],
      "transferability": [
        "Adapting to governance arrangements: Local climate funds may be established and managed by national or subnational governments or intermediaries, depending on institutional mandates, fiscal space, and fund management capacities.",
        "Ensuring local ownership: Fund structures should allow local governments and communities to identify investment priorities, even where national institutions or external partners provide financing and oversight.",
        "Considering funding sources and sustainability: Funds may draw on public budgets, national transfers, private contributions or international grants. Long-term sustainability may depend on reliable domestic resource mobilization."
      ],
      "order": 1,
      "implementationGuidance": [
        {
          "title": "Identify local financing needs and investment gaps",
          "content": "Start from city investment plans and portfolios. Assess project ownership, readiness, financing needs and potential revenue sources."
        },
        {
          "title": "Support the establishment of local climate funds",
          "content": "Help local or subnational governments to establish suitable fund arrangements, considering enabling legal frameworks, fiscal responsibilities and institutional capacities."
        },
        {
          "title": "Clarify governance arrangements",
          "content": "Agree on responsibilities for fund management, resource allocation and accountability. Ensure local governments retain ownership of investment priorities, with national oversight where appropriate."
        },
        {
          "title": "Mobilise resources for local funds",
          "content": "Connect funds with national funding programmes, fiscal transfers and development partners. Facilitate contributions from philanthropic organisations, businesses and other financing partners."
        },
        {
          "title": "Facilitate access to fund management expertise",
          "content": "Connect local governments with technical assistance providers and intermediaries to strengthen financial management, investment appraisal and performance monitoring."
        }
      ],
      "illustrativeExamples": [
        {
          "title": "Kenya – County Climate Change Funds (CCCFs)",
          "type": "Peer Learning Example",
          "excerpt": "Kenya demonstrates how devolved climate finance can enable locally led adaptation while remaining anchored in national policy.",
          "fullText": "Kenya demonstrate how devolved climate finance can enable locally led adaptation while remaining anchored in national policy. CCCFs were piloted in Isiolo in 2011–12 and later expanded to Garissa, Kitui, Makueni, Wajir and beyond. These funds identify, prioritize and finance local adaptation investments through county planning and budgeting systems, with county and ward committees steering decisions and local knowledge and climate information built into planning and monitoring. They are designed to blend resources from international climate finance, multilateral development banks, the private sector, national government transfers and counties’ own-source revenues. Several counties have legislated commitments of 1–2 per cent of development budgets to capitalise CCCFs. These commitments helped to attract external finance, including seed funding from the UK and Sweden. CCCFs are aligned with Kenya’s National Adaptation Plan (NAP), the National Climate Change Action Plan, and the Climate Change Act. The success of pilots helped to pave the way for national scale-up. By 2023 all 47 Kenyan counties had CCCFs in place, creating the basis for a new Financing Locally Led Climate Action Program funded by the World Bank and the governments of Denmark and Sweden, and led by the National Treasury.",
          "connectionLine": "Why see this: See how national governments can support local climate funds that combine local decision-making, domestic resources and external climate finance.",
          "order": 1
        },
        {
          "title": "Italy – ForestaMi Fund, Milan",
          "type": "Peer Learning Example",
          "excerpt": "Milan illustrates how municipal and subnational governments can work with philanthropic institutions to establish dedicated funds for local climate action.",
          "fullText": "Milan illustrates how municipal and subnational governments can work with philanthropic institutions to establish dedicated funds for local climate action. Launched in 2019, Forestami brings together the Municipality and Metropolitan City of Milan, Lombardy Region, universities, foundations and other local institutions to support urban forestry and climate resilience. A local fund was established within Fondazione di Comunità Milano to mobilise contributions from businesses and citizens towards the goal of planting three million trees by 2030. In April 2025, the initiative transitioned into Fondazione Forestami, an independent nonprofit foundation responsible for expanding its activities across the metropolitan area and beyond. The city of Lund in Sweden is also planning to replicate this model to accelerate municipal tree planting, which will not only improve local climatic conditions but also provide additional economic value to businesses through place-based improvements.",
          "connectionLine": "Why see this: See how governments can partner with philanthropic institutions to establish and manage local climate funds.",
          "order": 2
        },
        {
          "title": "United Kingdom – Bristol's Local Climate Investment Funds",
          "type": "Peer Learning Example",
          "excerpt": "Bristol shows how municipalities can mobilize community and private capital for climate action through local funds.",
          "fullText": "Bristol shows how municipalities can mobilize community and private capital for climate action through local funds. Through its Climate Action Investment initiative, developed under the EU NetZeroCities Pilot Cities Programme, Bristol City Council enables residents and businesses to invest as little as GBP 5 in energy-efficiency and renewable-energy improvements to council-owned buildings. The initiative raised over GBP 500,000 in its first five weeks towards an initial GBP 1 million target, offering investors a five-year loan with 4.2% annual interest. Separately, the Bristol City Leap Community Energy Fund provides GBP 1.5 million in grants and loans for community-led energy projects, funded equally by private partners Ameresco and Vattenfall. The Bristol City Leap model also informed the UK government's Local Net Zero Accelerator programme, which supported a pilot in York and North Yorkshire to explore replicating its approach to mobilising private investment for local net-zero projects.",
          "connectionLine": "Why see this: See how cities can mobilize community and private capital through local funds, and how national governments can support the replication of successful models.",
          "order": 3
        },
        {
          "title": "Bhutan – Local Climate Adaptive Living Facility (LoCAL)",
          "type": "Peer Learning Example",
          "excerpt": "Bhutan illustrates how national governments can channel climate finance to local authorities through existing fiscal transfer systems.",
          "fullText": "Bhutan illustrates how national governments can channel climate finance to local authorities through existing fiscal transfer systems. Introduced in 2011 through a partnership between the Royal Government of Bhutan and UNCDF, LoCAL uses performance-based climate resilience grants and technical assistance to finance locally identified adaptation investments. The programme expanded to over 100 local governments, financing more than 350 adaptation investments by 2023. Building on this experience, Bhutan has integrated LoCAL into its national local government financing system and planned to mobilize domestic resources through the same grant mechanism. This would allow the government to sustain and expand local adaptation financing beyond the initial international support. Accordingly, Bhutan has incorporated performance-based grants into its central budgeting system and included climate vulnerability in the formula for allocating resources to local governments.",
          "connectionLine": "Why see this: See how national governments can use international climate finance to establish local funding mechanisms and transition towards domestic financing and ownership.",
          "order": 4
        }
      ],
      "resources": [
        {
          "title": "Catalytic Capital & De-Risking Instruments for Cities",
          "type": "Report",
          "publisher": "CCFLA",
          "link": "https://citiesclimatefinance.org/",
          "description": "",
          "order": 1
        },
        {
          "title": "Subnational Green Bonds & Blended Finance Guidebook",
          "type": "Guide",
          "publisher": "FMDV",
          "link": "https://fmdv.net/",
          "description": "",
          "order": 2
        }
      ]
    },
    {
      "title": "4.2. Financial Instruments and Mechanisms",
      "overview": "Financial instruments and risk-sharing mechanisms help to mobilize climate finance by improving financing conditions, reducing risks and attracting additional capital. These include green bonds, concessional finance, guarantees, insurance and other instruments that address specific financing barriers. They can also be used within blended finance arrangements to mobilize private investment alongside public or concessional resources. The choice of instruments depends on project risks, financing needs, local market conditions and the fiscal or financial capacities of governments. National governments can facilitate cities or subnational governments’ access to these instruments through national development banks, public finance, regulatory frameworks and partnerships with MDBs, DFIs and private financiers. This can help cities and subnational governments to access suitable financing for implementing their climate investment portfolios.",
      "potentialNationalLead": [
        "Finance Ministry",
        "National Development Bank",
        "Climate / Environment Ministry"
      ],
      "keyActors": [
        "City / Subnational Government",
        "Relevant Sector Ministries",
        "MDB / DFI",
        "Commercial Lenders",
        "Institutional Investors",
        "Insurers",
        "Guarantee Providers",
        "Technical Assistance Providers"
      ],
      "transferability": [
        "Accounting for fiscal and regulatory conditions: Municipal borrowing limits, guarantee regulations and financial market regulations may determine which instruments subnational governments can access.",
        "Considering domestic financial market maturity: Access to commercial lenders, institutional investors and insurers varies across countries. Less developed markets may require additional public support or international financing partners.",
        "Assessing institutional and financial capacities: Instruments such as green bonds and guarantees require specialised expertise, creditworthiness and financial management capacities that may not be available across all municipalities."
      ],
      "order": 2,
      "conceptBoxes": [
        {
          "title": "What is Blended Finance?",
          "category": "Financial Mechanism",
          "section": "Overview",
          "excerpt": "Blended finance is the strategic use of a limited amount of concessional public or philanthropic capital to mobilize additional finance, primarily from commercial and private sources — toward sustainable development and climate goals.",
          "fullText": "Blended finance is the strategic use of a limited amount of concessional public or philanthropic capital to mobilize additional finance, primarily from commercial and private sources — toward sustainable development and climate goals. Rather than a single financial instrument, it is a structuring approach: public actors (donors, development agencies, philanthropies, and development finance institutions) absorb or share risks that would otherwise deter private investors, improving a project's risk-return profile enough to attract market-rate capital. The concessional capital at the core of a blended structure can take several forms, including grants, concessional debt or equity, guarantees, and other risk-sharing facilities. These de-risking mechanisms matter most in emerging markets and developing economies, where country-specific risk accounts for between 60 and 90 percent of investors' risk considerations, and where about 80–90 percent of climate mitigation investment is expected to come from the private sector. The overarching goal is to crowd in private money that would not have been invested otherwise, deploying only as much public subsidy as is needed to make a project viable.",
          "order": 1
        }
      ],
      "implementationGuidance": [
        {
          "title": "Identify financing barriers",
          "content": "Work with cities, subnational governments and financing partners to assess risks, financing needs and barriers that affect priority urban climate investments."
        },
        {
          "title": "Match financial instruments to financing needs and capacities",
          "content": "Identify where guarantees, concessional loans, insurance, green bonds, local-currency financing or other instruments could address specific barriers and improve financing conditions."
        },
        {
          "title": "Use public finance strategically",
          "content": "Deploy national or concessional resources to reduce investment risks and mobilise additional capital. Consider blended finance arrangements where appropriate."
        },
        {
          "title": "Mobilise financial and technical partners",
          "content": "Engage development banks, insurers, investors and technical assistance providers to design aggregation arrangements, manage risks and support municipal participation."
        },
        {
          "title": "Align financial instruments with national programmes",
          "content": "Integrate them into existing funding programmes or investment structures where possible."
        },
        {
          "title": "Monitor financing outcomes",
          "content": "Track capital mobilised, financing costs, risk reduction and investment outcomes. Use findings to improve the effectiveness of financial instruments over time."
        }
      ],
      "illustrativeExamples": [
        {
          "title": "India – Tamil Nadu Water and Sanitation Pooled Fund",
          "type": "Peer Learning Example",
          "excerpt": "India illustrates how state and national governments can use credit enhancement to help smaller municipalities access long-term infrastructure finance.",
          "fullText": "India illustrates how state and national governments can use credit enhancement to help smaller municipalities access long-term infrastructure finance. Established by the Government of Tamil Nadu in 2002, the Water and Sanitation Pooled Fund pooled the borrowing needs of 13 municipalities and issued a USD 6.2 million bond for water and sanitation investments. To reduce investor risks, the state government established reserve funds and escrow accounts to intercept fiscal transfers if repayments fell short, while a USAID partial guarantee provided additional protection. This blended finance arrangement helped to secure an AA credit rating and 15-year financing for municipalities that would otherwise struggle to access capital markets independently. Building on pooled financing experiences in Tamil Nadu and other states, India's national government established the Pooled Finance Development Fund in 2006 to support state-level financing entities through credit enhancement and project preparation assistance.",
          "connectionLine": "Why see this: See how state and national governments can use blended finance, guarantees and credit enhancement to improve smaller municipalities' access to long-term infrastructure finance.",
          "order": 1
        },
        {
          "title": "Nigeria – InfraCredit",
          "type": "Peer Learning Example",
          "excerpt": "Nigeria shows how a nationally backed credit-enhancement facility can mobilise domestic capital for climate-related infrastructure.",
          "fullText": "Nigeria shows how a nationally backed credit-enhancement facility can mobilise domestic capital for climate-related infrastructure. Established in 2017 through a partnership between the Nigeria Sovereign Investment Authority and PIDG's GuarantCo, InfraCredit provides local-currency guarantees that improve the credit quality of infrastructure bonds and attract long-term investment from domestic pension funds, insurers and banks. By the end of 2024, it had guaranteed 24 transactions, mobilising over NGN 200 billion in private investment and supporting nearly NGN 150 billion in bond issuances. These include North South Power's NGN 8.5 billion green bond, Nigeria's first certified corporate green bond. Its approach has informed similar credit-enhancement facilities in Pakistan and Kenya, demonstrating how nationally supported guarantees can expand domestic infrastructure financing.",
          "connectionLine": "Why see this: See how national institutions can partner with development finance organisations to reduce credit risks and mobilize long-term domestic capital for green infrastructure investments.",
          "order": 2
        },
        {
          "title": "Brazil – BNDES Climate Fund (Fundo Clima)",
          "type": "Peer Learning Example",
          "excerpt": "Brazil illustrates how national governments can provide preferential long-term lending for municipal climate investments.",
          "fullText": "Brazil illustrates how national governments can provide preferential long-term lending for municipal climate investments. Coordinated by the Ministry of the Environment and Climate Change and operated by national development bank BNDES, Fundo Clima enables municipalities and other subnational borrowers to access climate financing on preferential terms, including extended repayment periods and grace periods. In May 2026, BNDES announced BRL 500 million in financing for Belo Horizonte's municipal climate-resilience investment plan, including BRL 480 million from Fundo Clima. The financing will support flood and landslide prevention, green infrastructure and restoration of rivers and water sources.",
          "connectionLine": "Why see this: See how national governments can leverage national development banks to offer preferential, long-term climate lending for municipal infrastructure investments.",
          "order": 3
        },
        {
          "title": "CCFLA Financial Instruments Toolkit",
          "type": "Tool",
          "excerpt": "An interactive resource that helps practitioners explore financial instruments for urban climate projects, including how different instruments work and the contexts in which they may be relevant.",
          "fullText": "The CCFLA Financial Instruments Toolkit is an interactive resource that helps practitioners explore financial instruments for urban climate projects, including how different instruments work and the contexts in which they may be relevant. It provides structured guidance on navigating the spectrum of urban climate finance instruments—from debt, equity, and guarantees to results-based financing and blended capital structures—helping project developers and municipal leaders match the right financial mechanisms to their specific infrastructure and resilience needs.",
          "connectionLine": "Why use this tool: Identify financial instruments suited to specific urban climate investment needs, financing barriers and local market conditions.",
          "order": 4
        },
        {
          "title": "ICLEI Climate Finance Decision-Making Tree",
          "type": "Tool",
          "excerpt": "Helps local and regional governments navigate different financing options through a series of guiding questions.",
          "fullText": "ICLEI climate finance decision-making tree helps local and regional governments navigate different financing options through a series of guiding questions. It provides an overview of each financing tool, including its advantages, disadvantages, and relevant case studies. An overview of the decision-making tree and available financing tools is provided below.",
          "connectionLine": "Why use this tool: Compare financing options and identify instruments appropriate to local government capacities, investment requirements and financing conditions.",
          "order": 5
        }
      ],
      "resources": [
        {
          "title": "Climate Policy Initiative: Mobilizing Private Capital for Subnational Resilience",
          "type": "Report",
          "publisher": "CPI",
          "link": "https://www.climatepolicyinitiative.org/",
          "description": "",
          "order": 1
        },
        {
          "title": "Investing in Cities: Strengthening Urban Resilience Finance",
          "type": "Report",
          "publisher": "World Bank",
          "link": "https://www.worldbank.org/",
          "description": "",
          "order": 2
        }
      ]
    },
    {
      "title": "4.3. Financial Aggregation and Market Shaping",
      "overview": "Financial aggregation brings together multiple investments, financing providers, borrowers or buyers to improve access to finance and achieve scale for urban climate investments. Supply-side aggregation combines capital from different financing providers to support larger or more diversified investment portfolios. Demand-side aggregation pools the borrowing or purchasing power of cities and other actors to improve financing terms, reduce costs and strengthen market demand. This can include pooled municipal borrowing, collective insurance arrangements and aggregated procurement of climate-aligned goods and services. National governments can enable aggregation through financial intermediaries, risk-sharing mechanisms, procurement frameworks and partnerships across cities, helping overcome financing barriers and create stronger market signals for climate solutions.",
      "potentialNationalLead": [
        "Finance Ministry",
        "National Development Bank",
        "Urban / Local Government Ministry",
        "National Procurement Authority"
      ],
      "keyActors": [
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
      "transferability": [
        "Considering market size and participation: Aggregation requires sufficient participation from cities, borrowers, lenders or buyers to achieve economies of scale. Benefits depend on the volume and similarity of their financing or purchasing needs.",
        "Adapting to institutional arrangements: Aggregation may be managed by national agencies, municipally owned intermediaries or intermunicipal partnerships, depending on governance structures and institutional capacities.",
        "Accounting for legal and regulatory conditions: Municipal borrowing powers, insurance regulations and procurement policies will affect which aggregation approaches are feasible across countries."
      ],
      "order": 3,
      "implementationGuidance": [
        {
          "title": "Identify opportunities for aggregation",
          "content": "Work with cities, subnational governments and financing partners to identify common borrowing, insurance or purchasing needs that could benefit from aggregation."
        },
        {
          "title": "Select suitable aggregation approaches",
          "content": "Assess whether pooling financing sources, municipal borrowing, insurance risks or purchasing demand could improve access to finance, reduce costs or strengthen market demand."
        },
        {
          "title": "Address regulatory and institutional barriers",
          "content": "Review municipal borrowing powers, procurement policies and financial regulations that may restrict aggregation. Support reforms or enabling arrangements where feasible."
        },
        {
          "title": "Mobilise financial and technical partners",
          "content": "Engage development banks, insurers, investors and technical assistance providers to structure aggregation mechanisms, share risks and support municipal participation."
        },
        {
          "title": "Support aggregated purchasing and market development",
          "content": "Help public and private buyers coordinate purchasing demand and engage suppliers around common specifications, investment needs and deployment opportunities."
        },
        {
          "title": "Track aggregation outcomes and support scale",
          "content": "Assess whether aggregation improves financing access, reduces costs or strengthens market demand. Use findings to expand successful approaches across municipalities."
        }
      ],
      "illustrativeExamples": [
        {
          "title": "Sweden – Kommuninvest",
          "type": "Peer Learning Example",
          "excerpt": "Sweden illustrates how municipalities and regions can aggregate borrowing demand to access long-term financing on more favourable terms.",
          "fullText": "Sweden illustrates how municipalities and regions can aggregate borrowing demand to access long-term financing on more favourable terms. Kommuninvest is a municipally owned financial institution that raises capital from financial markets and lends to its members. Backed by joint guarantees from its 282 municipal and 15 regional members, the model reduces borrowing costs and improves access to capital for local infrastructure investments, including climate-related projects. In 2025, Kommuninvest's total lending reached SEK 563.9 billion, demonstrating the scale of pooled municipal financing. Sweden's legal framework for municipal borrowing enables this model, and Kommuninvest operates under the supervision of the Swedish Financial Supervisory Authority. Kommuninvest provides long-term debt financing but does not generally cover early-stage project preparation, risk capital or climate portfolio orchestration. While Kommuninvest provides long-term debt financing, there are avenues to enhance its offerings to municipalities in the form of early-stage project preparation, risk capital or coordination of climate investment portfolios.",
          "connectionLine": "Why see this: See how municipalities can jointly establish a financial intermediary to aggregate borrowing needs, reduce financing costs and access capital markets for local investments, with national regulatory oversight.",
          "order": 1
        },
        {
          "title": "Argentina – RAMCC Trust Fund",
          "type": "Peer Learning Example",
          "excerpt": "Argentina shows how municipalities can jointly aggregate purchasing demand to reduce costs and finance local climate investments.",
          "fullText": "Argentina shows how municipalities can jointly aggregate purchasing demand to reduce costs and finance local climate investments. Established in 2018 by the Argentine Network of Municipalities against Climate Change (RAMCC), the Trust Fund enables participating municipalities to pool resources and procure climate-smart technologies collectively. Its governance includes an Assembly of Mayors representing participating municipalities, an elected executive committee and a technical secretariat supporting project development and financing. The Fund has supported joint procurement of LED streetlighting, helping municipalities to achieve economies of scale, reduce procurement costs and improve energy efficiency. The model demonstrates how intermunicipal cooperation can strengthen purchasing power and support implementation of local climate action plans.",
          "connectionLine": "Why see this: See how municipalities can establish a shared financing and procurement mechanism to aggregate demand, reduce costs and implement climate investments.",
          "order": 2
        },
        {
          "title": "India – Grand Challenge for Electric Buses",
          "type": "Peer Learning Example",
          "excerpt": "India shows how national governments can aggregate municipal purchasing demand to reduce costs and accelerate the deployment of low-carbon transport.",
          "fullText": "India shows how national governments can aggregate municipal purchasing demand to reduce costs and accelerate the deployment of low-carbon transport. Led by Convergence Energy Services Limited (CESL), a subsidiary of the Ministry of Power's Energy Efficiency Services Limited (EESL), the Grand Challenge pooled demand for electric buses across multiple cities through a single procurement process. CESL worked with participating cities to assess fleet requirements, routes and charging infrastructure, while engaging manufacturers to develop standardised tender specifications. Supported by national subsidies and some state contributions, the programme used gross-cost contracts under which private operators finance, own and operate buses and charging infrastructure for 12 years, reducing upfront capital requirements for municipalities. This approach helped to achieve economies of scale, lower procurement costs and support wider adoption of electric buses.",
          "connectionLine": "Why see this: See how national institutions can aggregate purchasing demand across cities, coordinate procurement and use public support to reduce costs and accelerate low-carbon infrastructure deployment.",
          "order": 3
        },
        {
          "title": "Philippines – City Disaster Insurance Pool (PCDIP)",
          "type": "Peer Learning Example",
          "excerpt": "The Philippines illustrates how national governments can help cities pool insurance demand and disaster risks to access more affordable climate-risk protection.",
          "fullText": "The Philippines illustrates how national governments can help cities pool insurance demand and disaster risks to access more affordable climate-risk protection. Led by the Department of Finance with technical support from the Asian Development Bank (ADB), the proposed PCDIP was designed around ten participating cities, including Quezon City, Davao City, Iloilo City and Marikina City. The model envisaged pooling municipal insurance demand through the Government Service Insurance System (GSIS), with risks transferred to international reinsurance markets. By aggregating demand and diversifying risks across cities, the proposed mechanism aimed to reduce insurance costs and improve coverage against typhoons and earthquakes. Parametric insurance was designed to enable payouts within 15 business days of qualifying disasters, helping cities access funds for early recovery.",
          "connectionLine": "Why see this: See how national governments can help cities to aggregate insurance demand, pool disaster risks and access more affordable climate-risk protection.",
          "order": 4
        },
        {
          "title": "First Mover Cities Cohort",
          "type": "Peer Learning Example",
          "excerpt": "The First Mover Cities Cohort brings together city representatives, private actors, and partners to discuss green procurement governance and tender design.",
          "fullText": "First Mover Cities Cohort is a dialogue series hosted by the First Movers Coalition, World Economic Forum. The cohort will bring together city representatives, private actors, and other partners to discuss green procurement governance, tender design, and how to turn fragmented demand into clearer market signals. The cohort is engaging cities such as Seattle and San Francisco.",
          "connectionLine": "Why see this: See how cities and private partners can coordinate procurement governance and turn fragmented demand into clearer market signals for green solutions.",
          "order": 5
        },
        {
          "title": "C40 Clean Construction Accelerator",
          "type": "Peer Learning Example",
          "excerpt": "Shows how city action can move beyond municipal projects and help reshape the wider construction market.",
          "fullText": "C40 Clean Construction Accelerator shows how city action can move beyond municipal projects and help reshape the wider construction market. It is an initiative that brings together eight cities to help transform the building and construction industry. In the accelerator, mayors commit to reusing and retrofitting existing buildings first, leading by example through municipal procurement, demanding transparency through whole-life carbon assessments, building joint roadmaps with stakeholders, approving at least one net-zero flagship project, assessing resilience impacts, and advocating for action at national and higher levels. These commitments translating into practice – cities are using procurement to push whole-life cycle assessments and low-carbon materials, coordinating across departments, working with private-sector partners such as the North American Electric Construction Coalition, and pressing national governments to remove policy barriers.",
          "connectionLine": "Why see this: See how cities can use municipal procurement commitments to reshape private construction markets and push low-carbon standards.",
          "order": 6
        },
        {
          "title": "Intra-City Aggregated Procurement Models",
          "type": "Tool",
          "excerpt": "Framework identifying four approaches cities can use to coordinate public and private demand for low-carbon solutions.",
          "fullText": "Intra-City Aggregated Procurement Models: This framework identifies four approaches cities can use to coordinate public and private demand for low-carbon solutions: market facilitation, material-based mandates, performance-based mandates and tender-based incentives. It explains how cities can use procurement and regulatory powers to create stronger market signals, while national governments can support adoption through enabling regulations, common standards, financing and technical assistance. Developed for green cement and concrete, the approaches can be adapted to other sectors based on local procurement powers and market conditions.",
          "connectionLine": "Why use this tool: Identify suitable approaches for coordinating city-wide purchasing demand and shaping markets for low-carbon solutions.",
          "order": 7
        }
      ],
      "resources": [
        {
          "title": "Aggregated and Green Public Procurement Playbook",
          "type": "Guide",
          "publisher": "OECD",
          "link": "https://www.oecd.org/",
          "description": "",
          "order": 1
        },
        {
          "title": "Accelerating sustainable urban futures: a practical guide for challenge-driven innovation in cities",
          "type": "Guide",
          "publisher": "Viable Cities",
          "link": "https://viablecities.se/",
          "description": "",
          "order": 2
        }
      ]
    }
  ]
};

const filePath = path.resolve('./src/data/actionsDataList.ts');
const content = fs.readFileSync(filePath, 'utf-8');

const regex4 = /\{\s*\"id\":\s*4,[\s\S]*?\n\s*\{\s*\"id\":\s*5,/;
const match = content.match(regex4);

if (!match) {
  console.error("Could not find Action 4 block ending at Action 5 in actionsDataList.ts");
  process.exit(1);
}

const action4Formatted = JSON.stringify(action4Revised, null, 2);
const indentedAction4 = action4Formatted.split('\n').map(l => '  ' + l).join('\n');

const replaced = content.replace(regex4, `${indentedAction4},\n  {\n    "id": 5,`);
fs.writeFileSync(filePath, replaced, 'utf-8');
console.log("Successfully updated Action 4 in actionsDataList.ts!");
