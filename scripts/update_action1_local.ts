import fs from 'fs';
import path from 'path';

const action1Revised = {
  id: 1,
  title: "Establish Multilevel Commitments and Platforms for Climate Investment",
  description: "This Action helps national governments align national climate commitments with city and subnational priorities and establish platforms for coordinated implementation and investment. It supports governments to translate NDCs and other national commitments into shared priorities, clarify responsibilities and connect local investment needs with national and international support.",
  systemsLogic: "Climate investment requires shared priorities and sustained coordination across government levels. Joint commitments can connect NDCs and other national goals with local priorities, responsibilities and investment needs. National coordination mechanisms can sustain coordination between governments and wider implementation actors. Country platforms can then connect urban priorities with national investment strategies and finance partners. Together, these mechanisms create the institutional foundations for investment planning, finance mobilization and implementation.",
  pathways: [
    {
      title: "1.1 Multilevel Climate Commitments",
      overview: "Multilevel climate commitments align national, subnational and city governments around shared climate priorities and responsibilities. They can help translate NDCs, NAPs and national climate strategies into locally relevant priorities, investment needs and implementation responsibilities. This creates a clearer link between national climate commitments, local action and climate finance.",
      potentialNationalLead: ["Climate / Environment Ministry"],
      keyActors: [
        "Planning Ministry",
        "Finance Ministry",
        "City / Subnational Planning Department",
        "City / Subnational Finance Department",
        "City Networks",
        "National Funds"
      ],
      transferability: [
        "Adapting commitments to the context: Countries can embed multilevel commitments within NDCs, NAPs or national climate strategies. A separate multilevel commitment process may be useful where existing processes are insufficient.",
        "Setting common principles while allowing differentiated commitments: Establish a small set of core commitments for participating governments, while allowing cities to add more ambitious or more detailed commitments based on their climate priorities, institutional capacity and readiness.",
        "Ensuring broad and representative participation: Countries can involve cities directly, through subnational associations or through phased participation, depending on governance arrangements and institutional capacity.",
        "Aligning commitments with NDC review cycles: Where possible, countries should review commitments alongside NDC review periods so that those become part of routine decision-making."
      ],
      order: 1,
      implementationGuidance: [
        {
          title: "Align national and subnational climate priorities",
          content: "Connect NDCs, NAPs and national climate priorities with subnational plans and priorities. Identify where local action contributes to national commitments."
        },
        {
          title: "Define complementary commitments and responsibilities",
          content: "Agree what national and subnational governments will finance, regulate, coordinate, enable or implement. Identify where responsibilities are shared."
        },
        {
          title: "Connect commitments with investment",
          content: "Link agreed priorities to investment plans, budgets and portfolios. Identify financing needs and where national programmes or external finance can support implementation."
        },
        {
          title: "Review progress and update commitments",
          content: "Regularly assess progress, financing needs and implementation barriers. Use findings to update commitments and inform subsequent national and subnational planning."
        }
      ],
      illustrativeExamples: [
        {
          title: "Chile – 2025 Nationally Determined Contribution (NDC)",
          type: "Peer Learning Example",
          excerpt: "Chile shows how multilevel climate and investment commitments can be embedded within an NDC. Its 2025 NDC includes specific subnational commitments covering regional and municipal climate plans, institutional capacity and climate finance...",
          fullText: "Chile shows how multilevel climate and investment commitments can be embedded within an NDC. Its 2025 NDC includes specific subnational commitments covering regional and municipal climate plans, institutional capacity and climate finance. Notably, Chile commits to establishing a national network to identify, mobilize and deploy subnational climate finance, with active participation from subnational governments. The NDC assigns responsibilities and deadlines for these commitments across government levels, creating a framework to link national ambition with local planning, finance and implementation.",
          connectionLine: "Why see this: See how an NDC can connect subnational climate commitments with institutional responsibilities and actions for mobilizing finance.",
          order: 1
        },
        {
          title: "Sweden – Climate City Contract 2030",
          type: "Peer Learning Example",
          excerpt: "Sweden shows how a multilevel process can help national governments to establish and renew complementary climate commitments...",
          fullText: "Sweden shows how a multilevel process can help national governments to establish and renew complementary climate commitments. As part of the Climate City Contracts, Swedish municipalities, national government agencies and Viable Cities make commitments around a shared climate-neutrality mission and review them annually. The contracts connect climate goals with portfolios of projects and investment planning. The process has expanded from nine municipalities in 2019 to 48 municipalities.",
          connectionLine: "Why see this: See how an iterative multilevel commitment process can link shared climate and investment goals across national and subnational governments.",
          link: "https://viablecities.se/klimatkontrakt-2030",
          order: 2
        },
        {
          title: "Rwanda – Nationally Determined Contribution (NDC) 3.0",
          type: "Peer Learning Example",
          excerpt: "Rwanda's NDC 3.0 commits to developing climate investment plans that can be implemented across all 30 districts...",
          fullText: "Rwanda's NDC 3.0 commits to developing climate investment plans that can be implemented across all 30 districts. The Rwanda Green Fund (RGF) and district authorities are among the institutions responsible for financing and implementing this commitment. RGF already mobilizes climate finance and manages facilities that can finance national and local public-sector climate investments. This creates an institutional bridge between national climate commitments, district investment planning and Rwanda's wider climate-finance architecture.",
          connectionLine: "Why see this: See how an NDC can connect national climate commitments with subnational investment planning and a national institution for mobilizing and deploying climate finance.",
          order: 3
        },
        {
          title: "Climate Action Aggregation Tool (CAAT)",
          type: "Tool",
          excerpt: "Developed by the Initiative for Climate Action Transparency, CAAT showcases a step-by-step process for national governments to quantify and quantify the aggregate GHG impact of climate actions by cities, regions and other non-state actors...",
          fullText: "Developed by the Initiative for Climate Action Transparency, CAAT showcases a step-by-step process for national governments to quantify and quantify the aggregate GHG impact of climate actions by cities, regions and other non-state actors. It also accounts for overlaps between actions and national policies. National governments can use CAAT to incorporate subnational action into national climate targets, NDC development and investment planning.",
          connectionLine: "Why use this: Assess how subnational climate commitments could contribute to national targets and incorporate them into NDC and investment planning.",
          order: 4
        }
      ]
    },
    {
      title: "1.2 National Coordination Mechanisms",
      overview: "National coordination mechanisms provide a structure for national and subnational governments to coordinate climate investment and implementation. They connect local priorities with national policies, programmes, finance and technical support. They can also enable whole-of-society engagement, bringing in businesses, finance institutions, academia, civil society and communities where needed. To sustain this coordination, mechanisms can include dedicated capacity to convene actors day-to-day, follow up on financing and implementation needs, and bring local feedback into national decision-making.",
      potentialNationalLead: ["Climate / Environment Ministry", "Urban / Local Government Ministry"],
      keyActors: [
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
      transferability: [
        "Adapting the form of coordination to national context: Countries can use a national coordination platform; recurring dialogue series, funder coordination mechanisms, or other arrangements suited to their priorities, governance system and institutional capacity.",
        "Assigning coordination responsibilities reflecting the governance system: In centralized systems, a national ministry may lead coordination. In decentralized systems, responsibilities may be shared across national, regional or state governments working with cities.",
        "Accounting for differences in local capacity: Where cities have different levels of capacity, coordination mechanisms may need to provide additional technical support to help lower-capacity cities participate effectively.",
        "Involving actors based on the issues being addressed: Financing barriers may require the leadership of finance ministries and financial institutions, while sector-specific challenges may also require coordinating relevant ministries or technical partners."
      ],
      order: 2,
      implementationGuidance: [
        {
          title: "Build the coordination mechanism on existing processes",
          content: "Identify where climate, planning, budgeting and financing decisions already take place. Strengthen these processes rather than creating additional arrangements."
        },
        {
          title: "Clarify roles across government levels",
          content: "Define which institutions are responsible for financing, regulating and implementing priority actions. Identify where responsibilities are shared and require national–subnational coordination."
        },
        {
          title: "Engage actors beyond government",
          content: "Identify businesses, finance institutions, academia, civil society and community actors that influence climate action. Bring them into the coordination process to contribute finance, expertise, assets and implementation capacity."
        },
        {
          title: "Connect coordination to investment decisions",
          content: "Use coordination mechanisms to identify investment needs, and coordinate finance, technical assistance or policy support needed to move climate priorities forward."
        },
        {
          title: "Provide capacity to sustain coordination",
          content: "Identify a team or institution to convene actors, track local needs and agreed actions, and facilitate follow-up across national and subnational governments."
        },
        {
          title: "Review progress and improve national support",
          content: "Regularly review implementation and financing barriers with subnational governments. Feed lessons into policies, programmes, funding decisions and subsequent coordination cycles."
        }
      ],
      illustrativeExamples: [
        {
          title: "Sweden – Viable Cities",
          type: "Peer Learning Example",
          excerpt: "Sweden shows how a national coordination mechanism can connect local climate implementation with national priorities and investment support...",
          fullText: "Sweden shows how a national coordination mechanism can connect local climate implementation with national priorities and investment support. Launched in 2017, Viable Cities coordinates 48 municipalities, six national government agencies and wider societal actors around a shared climate-neutrality mission. Within Viable Cities, Climate City Contract (CCC) 2030 provides a core multilevel coordination process. National agencies and municipalities participate in annual cycles linking local climate action and investment needs with national support. Cities also connect transition priorities with investment planning, budgets and procurement, helping identify where additional financing or national action is needed. Within CCCs, Transition Arenas extend coordination to businesses, academia and civil society, with Viable Cities providing methods, tools and peer learning for these local collaborations. Viable Cities also has a dedicated Coordination Function that analyses CCCs to identify local and regional needs, facilitates collaboration between cities and national agencies, and aligns CCC processes with national and EU initiatives. The evolution of Viable Cities has also helped to shape the national coordination approaches under the EU Cities Mission.",
          connectionLine: "Why see this: See how a national coordination mechanism can enable multilevel coordination around climate action planning, investment and implementation.",
          link: "https://viablecities.se",
          order: 1
        },
        {
          title: "Brazil, Kazakhstan and Uzbekistan – CCFLA Local Hubs",
          type: "Peer Learning Example",
          excerpt: "CCFLA Local Hubs illustrate how intermediary platforms can bring together national and local governments, development partners and finance institutions around urban climate investment priorities...",
          fullText: "CCFLA Local Hubs illustrate how intermediary platforms can bring together national and local governments, development partners and finance institutions around urban climate investment priorities. In Central Asia, the Hub convened 25 local governments, 10 national agencies and project preparation partners, including the Gap Fund and FELICITY II, to identify building-decarbonisation projects and connect cities with technical support. In Brazil, the Local Hub brings together over 50 local, national and international partners, supporting coordination through a community of practice and the Green and Resilient Cities Programme (PCVR) Project Bank. These arrangements help strengthen connections between municipal investment needs, national institutions and potential financing partners.",
          connectionLine: "Why see this: See how intermediary platforms can support multilevel coordination and connect municipal climate investment priorities with project preparation and financing partners.",
          link: "https://citiesclimatefinance.org",
          order: 2
        },
        {
          title: "Croatia – National Multilevel Climate and Energy Dialogue",
          type: "Peer Learning Example",
          excerpt: "Croatia shows how multilevel coordination can help national governments to identify subnational financing barriers and translate them into new institutional responses...",
          fullText: "Croatia shows how multilevel coordination can help national governments to identify subnational financing barriers and translate them into new institutional responses. Between 2022 and 2025, Croatia’s North-West Croatia Regional Energy and Climate Agency (REGEA) facilitated six multilevel climate and energy dialogues involving cities and regions, nine national ministries, businesses, academia and civil society. Initially focused on Croatia's National Energy and Climate Plan, the dialogues evolved to address practical barriers to local implementation, including access to finance. A dedicated dialogue on financing brought municipalities together with the Ministry of Finance and financial-sector actors to discuss how local climate plans could be funded. These discussions led to the creation of the Platform for Sustainable Finance and Energy Transition, providing a dedicated space to connect local financing needs with national and financial-sector actors. Croatia is now working to institutionalise the multilevel dialogue through an inter-ministerial structure involving national and municipal representatives.",
          connectionLine: "Why see this: See how national–local dialogue can surface local financing barriers and lead to the creation of platforms that connect cities with finance.",
          order: 3
        },
        {
          title: "Morocco – 4C Maroc",
          type: "Peer Learning Example",
          excerpt: "Morocco shows how a national coordination mechanism can connect national and local governments with wider actors around climate investment and implementation...",
          fullText: "Morocco shows how a national coordination mechanism can connect national and local governments with wider actors around climate investment and implementation. The Climate Change Competence Centre of Morocco (4C Maroc) is a national platform for climate dialogue and capacity building. It supports Morocco’s climate protection policy and the national green investment plan. The platform brings together more than 15 national ministries, public institutions and associations representing local and regional governments to strengthen coordination between national and subnational climate action. 4C Maroc also brings businesses, civil society, research and training organisations into its governance through dedicated stakeholder groups. Alongside coordination, it supports NDC implementation, decision-making, capacity building and access to climate finance. The platforms has trained more than 800 local actors on subnational climate integration and climate finance and supported projects seeking climate finance under Morocco's NDC.",
          connectionLine: "Why see this: See how a national coordination mechanism can link national and subnational governments with whole-of-society participation, technical capacity and climate-finance support.",
          link: "https://4cmaroc.org",
          order: 4
        },
        {
          title: "Sweden – Viability Fund for Cities",
          type: "Peer Learning Example",
          excerpt: "The Viability Fund for Cities is an emerging mechanism to coordinate funding from different public and private funders towards urban climate investment portfolios...",
          fullText: "The Viability Fund for Cities is an emerging mechanism to coordinate funding from different public and private funders towards urban climate investment portfolios. Building on Sweden's Viable Cities experience, it is being developed around three interconnected functions: ALIGN, bringing funders and implementation partners around shared climate transition portfolios and place-based interventions; CO-FINANCE, mobilising catalytic capital and coordinating contributions from different financing partners towards local investments; and DEMAND, aggregating purchasing demand to shape markets and support deployment of climate solutions. The initiative aims to mobilise EUR 10 billion in co-financing and EUR 10 billion in aggregated demand by 2030, through partnerships across national, subnational and international levels. Its institutional and financing arrangements remain under development and are intended to be adapted to different country contexts.",
          connectionLine: "Why see this: See how multilevel coordination mechanisms is being developed to align different funding sources around urban climate investment portfolios and connect financing with market demand.",
          order: 5
        }
      ]
    },
    {
      title: "1.3 Urban-Inclusive Country Platforms",
      overview: "Urban-inclusive country platforms bring city and subnational priorities into nationally led processes for mobilizing climate and development finance. Country platforms align governments and development partners around a shared mission, such as climate action, Cities and subnational governments, however, are often not systematically represented in these platforms, despite their important role in climate action. Urban-inclusive platforms can address this gap by integrating urban and subnational priorities into platform governance, investment planning and financing. This can align national and local climate plans, strengthen urban investment pipelines, and mobilize public, development and private finance for local climate action.",
      potentialNationalLead: ["Finance Ministry", "Planning Ministry"],
      keyActors: [
        "Ministry of Climate / Environment",
        "Urban / Local Government Ministry",
        "Sectoral Ministries (e.g., energy, transport)",
        "National Development Banks",
        "Multilateral Development Banks",
        "City / Subnational Governments",
        "Bilateral Agencies",
        "City / Subnational Coalitions"
      ],
      transferability: [
        "Aligning leadership with institutional responsibilities: Country platforms may be led by finance or planning ministries or coordinated through central government institutions. Leadership should reflect existing responsibilities for investment planning and finance mobilization.",
        "Considering the governance system: Depending on the degree of decentralization and number of jurisdictions, cities may participate directly or through regional governments, municipal associations or other representative bodies.",
        "Accounting for differences in investment readiness: Smaller cities and those with limited technical or financial capacity may require additional project preparation support, financial intermediation or project aggregation to participate effectively.",
        "Adapting the platform's scope and financing arrangements: Countries can begin with investment portfolios in priority sectors and expand over time. Financing arrangements should reflect local borrowing powers, creditworthiness and access to capital."
      ],
      order: 3,
      implementationGuidance: [
        {
          title: "Establish national ownership and mandate",
          content: "Identify the national institution or group responsible for leading the platform. Define its purpose, responsibilities and relationship with existing government processes."
        },
        {
          title: "Create clear entry points for cities",
          content: "Establish institutional arrangements for cities and subnational governments to bring finance and implementation needs into national discussions."
        },
        {
          title: "Align national and local investment priorities",
          content: "Connect national climate and development objectives with city plans, investment portfolios and project pipelines."
        },
        {
          title: "Coordinate project preparation support",
          content: "Engage project preparation facilities and development partners to strengthen urban pipelines and explore aggregation of smaller projects."
        },
        {
          title: "Bring finance partners into the process",
          content: "Engage national and multilateral development banks, climate funds and private financiers around urban investment needs. Identify suitable public, concessional and private financing instruments."
        },
        {
          title: "Monitor progress and adapt support",
          content: "Track the implementation of urban or subnational portfolios. Use findings to adjust financing arrangements, technical assistance and national support."
        }
      ],
      illustrativeExamples: [
        {
          title: "Cameroon – Finance Your Cities Country Platform for Localizing Finance",
          type: "Peer Learning Example",
          excerpt: "Cameroon shows how a country platform can be designed around urban investment and finance priorities from the outset...",
          fullText: "Cameroon shows how a country platform can be designed around urban investment and finance priorities from the outset. Announced at COP30, the platform brings national ministries, local and regional governments and the Special Council Support Fund for Mutual Assistance (FEICOM), Cameroon’s municipal financing institution, around a shared pipeline of climate and development projects. The platform aims to align national policies and investment plans with local climate priorities and connect local projects with national and international finance. FEICOM acts as a financial intermediary between cities and finance providers, aiming to connect local projects with private and international capital, as part of a portfolio approach.",
          connectionLine: "Why see this: See how a country platform can integrate urban investment priorities into the national financial architecture, supported by a domestic financial intermediary.",
          order: 1
        },
        {
          title: "South Africa – Just Energy Transition Partnership (JET-P)",
          type: "Peer Learning Example",
          excerpt: "South Africa shows how a country platform can create energy-related investment pathways for municipalities...",
          fullText: "South Africa shows how a country platform can create energy-related investment pathways for municipalities. South Africa’s Just Energy Transition Partnership mobilizes international support around the country’s transition, guided by its Just Energy Transition Investment and Implementation Plans. Municipalities have a dedicated portfolio within the platform, reflecting their major role in electricity distribution, energy access and local infrastructure. A JET Municipal Council, led by the South African Local Government Association (SALGA), provides a route for municipal participation in the country platform. It brings together municipal representatives, national ministries, the National Treasury, the Development Bank of Southern Africa (DBSA) and other energy-sector institutions. Through three workstreams covering municipal capability, financing and energy access, the Council identifies investment priorities, develops project pipelines and explores financing options for municipal infrastructure. Dedicated programmes within the municipal portfolio also support municipalities with project preparation and access to concessional and private finance.",
          connectionLine: "Why see this: See how a country platform can integrate municipalities in national investment coordination and support portfolio development, project preparation and finance.",
          order: 2
        },
        {
          title: "CCFLA’s Urban-Inclusive Country Platforms Framework",
          type: "Tool",
          excerpt: "The framework provides guidance on how a country platform can be designed to systematically integrate cities and subnational priorities into country-platform governance, investment planning and financing...",
          fullText: "The framework provides guidance on how a country platform can be designed to systematically integrate cities and subnational priorities into country-platform governance, investment planning and financing. It addresses common barriers, including misalignment between national and local priorities, weak urban project pipelines, limited fiscal capacity and creditworthiness, and a lack of city-focused financial instruments The framework provides a phased roadmap that covers whole-of-government engagement, programme readiness, investment programming, financing and implementation. It identifies practical approaches for engaging cities and subnational governments, strengthening urban investment pipelines, aggregating smaller projects and connecting them with appropriate financing instruments through national and local financial institutions.",
          connectionLine: "Why use this tool: Identify a practical roadmap to integrate urban and subnational priorities, investment pipelines and financing needs into country platforms.",
          link: "https://citiesclimatefinance.org",
          order: 3
        }
      ]
    }
  ]
};

const filePath = path.resolve('./src/data/actionsDataList.ts');
const content = fs.readFileSync(filePath, 'utf-8');

// Parse the file or replace Action 1
const startMarker = 'export const actionsData = [';
const action2Start = '  {\n    "id": 2,\n    "title": "Strengthen Enabling Environments for Climate Investment",';

const idxAction2 = content.indexOf(action2Start);
if (idxAction2 === -1) {
  console.error("Could not find start of Action 2 in actionsDataList.ts");
  process.exit(1);
}

const action1Formatted = JSON.stringify(action1Revised, null, 2);
// Indent by 2 spaces
const indentedAction1 = action1Formatted.split('\n').map(l => '  ' + l).join('\n');

const newContent = `${startMarker}\n${indentedAction1},\n${content.slice(idxAction2)}`;
fs.writeFileSync(filePath, newContent, 'utf-8');
console.log("Successfully updated Action 1 in actionsDataList.ts!");
