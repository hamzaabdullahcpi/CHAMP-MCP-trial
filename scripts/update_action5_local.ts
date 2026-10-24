import fs from 'fs';
import path from 'path';

const action5Revised = {
  "id": 5,
  "title": "Strengthen Capacities and Networks",
  "description": "This Action helps national governments to support subnational and municipal governments in strengthening capacities and partnerships needed to scale urban climate investment. It covers practical capacity development, engagement with international networks and access to specialised expertise, financing partners and implementation support.",
  "systemsLogic": "Scaling urban climate investment beyond individual cities or regions requires technical capabilities and long-term access to expertise and resources. To this end, targeted capacity development can strengthen local skills in investment planning, financing and implementation. International networks and partnerships can help to connect national and subnational governments with specialised expertise, financing partners and opportunities for collective action. These approaches can help to overcome technical capacity gaps, strengthen financing outcomes and enhance implementation capabilities.",
  "pathways": [
    {
      "title": "5.1. Capacity Building for Urban Climate Investment",
      "overview": "Cities and subnational governments often lack the technical, financial and institutional capacities needed to plan, finance and implement climate investments. Targeted capacity development can strengthen practical skills in investment planning, project preparation, financial management and implementation. National governments can identify common capacity gaps across cities and mobilize training, technical assistance and peer-to-peer exchanges to address them. This can reduce dependence on external support and improve the impact of climate finance.",
      "potentialNationalLead": [
        "Urban / Local Government Ministry",
        "Planning Ministry"
      ],
      "keyActors": [
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
      "transferability": [
        "Adapting training to local needs and capacities: Training content should reflect municipal responsibilities, existing technical skills and investment priorities. Standardised modules can be adapted to different institutional contexts.",
        "Considering delivery models and institutional capacity: National institutions, city networks, development banks, universities or international partners can deliver training, depending on available expertise and resources.",
        "Making support accessible across different contexts: Adapt the language, formats and delivery approaches of capacity-building programs to local needs. Provide additional support for cities with limited financial or institutional capacity."
      ],
      "order": 1,
      "implementationGuidance": [
        {
          "title": "Identify technical capacity gaps",
          "content": "Work with cities and subnational governments to assess gaps in investment planning, financial management, project preparation and implementation skills."
        },
        {
          "title": "Develop targeted capacity-building programmes",
          "content": "Design training programmes around identified needs, with practical modules on climate investment planning, financing instruments, business models and infrastructure delivery."
        },
        {
          "title": "Mobilise technical expertise and training partners",
          "content": "Engage national development banks, training institutions, international organisations and technical assistance providers to deliver specialised training and mentoring."
        },
        {
          "title": "Combine training with practical application",
          "content": "Link capacity-building activities to ongoing municipal investment priorities and projects. Use workshops, exercises and hands-on support to help officials apply new skills."
        },
        {
          "title": "Institutionalize capacities and track progress",
          "content": "Embed acquired skills into municipal processes, guidance and staff development programmes. Assess improvements in financial management, investment readiness and implementation capabilities."
        }
      ],
      "illustrativeExamples": [
        {
          "title": "South Africa – DBSA Municipal Capacity Development Programme",
          "type": "Peer Learning Example",
          "excerpt": "South Africa illustrates how a national development bank can partner with the private sector to strengthen municipal technical and financial capacities.",
          "fullText": "South Africa illustrates how a national development bank can partner with the private sector to strengthen municipal technical and financial capacities. The Development Bank of Southern Africa (DBSA), in partnership with Anglo American, implemented a three-year programme across municipalities, investing over ZAR 120 million. The programme included hands-on training with support for infrastructure planning, revenue collection, financial management and service delivery. It trained 500 municipal officials and supported the development of 26 infrastructure master plans. Participating municipalities achieved an average 11.6% improvement in revenue collection.",
          "connectionLine": "Why see this: See how national development banks can partner with private actors to strengthen municipal financial management and infrastructure delivery capacities.",
          "order": 1
        },
        {
          "title": "C40 Cities Finance Facility – City Academy on Finance and Equity (CAFE)",
          "type": "Peer Learning Example",
          "excerpt": "CAFE shows how international technical assistance programmes can strengthen municipal capacities for financing equitable climate infrastructure.",
          "fullText": "CAFE shows how international technical assistance programmes can strengthen municipal capacities for financing equitable climate infrastructure. Developed by the C40 Cities Finance Facility, the Academy provides structured training for mid- and senior-level officials from Global South cities. Through workshops and practical exercises, participants learn to assess financing instruments, develop project business models and integrate equity considerations into infrastructure planning and implementation. An accompanying workbook helps city teams apply these skills to their own investment priorities.",
          "connectionLine": "Why see this: See how technical training can strengthen municipal financial skills and support the development of equitable, investment-ready climate projects.",
          "order": 2
        },
        {
          "title": "UrbanShift – City Academies",
          "type": "Peer Learning Example",
          "excerpt": "UrbanShift Academies offer a peer-learning platform for cities working on integrated urban development.",
          "fullText": "UrbanShift Academies offer a peer-learning platform for cities working on integrated urban development. UrbanShift is a “one-stop” platform bringing together global, national and local champions, while offering a suite of capacity-building activities that includes finance academies and dialogues with the national government. The platform combines these learning activities with on-the-ground local projects, so cities can exchange experience, build strategic planning skills, and apply what they learn to integrated solutions in areas such as transport, housing, green infrastructure and waste.",
          "connectionLine": "Why see this: See how international capacity-building programmes can strengthen municipal technical skills and support their application to local climate investments.",
          "order": 3
        }
      ],
      "resources": [
        {
          "title": "CCFLA Capacity Development Directory",
          "type": "Tool",
          "publisher": "CCFLA",
          "link": "https://citiesclimatefinance.org",
          "description": "",
          "order": 1
        }
      ]
    },
    {
      "title": "5.2. International Engagements and Networking",
      "overview": "International networks and partnerships can help national and subnational governments to access specialised expertise, financing partners and opportunities for collective action on urban climate investment. These initiatives connect governments with international organisations, city networks, development institutions and private-sector actors to exchange practical experience, mobilize support and advance shared finance and implementation priorities. National governments can facilitate cities' participation in relevant international initiatives and help translate these connections into concrete opportunities for technical assistance, financing and initiatives that address common urban climate challenges.",
      "potentialNationalLead": [
        "Climate / Environment Ministry",
        "Urban / Local Government Ministry"
      ],
      "keyActors": [
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
      "transferability": [
        "Aligning international engagement with domestic priorities: The relevance of international networks depends on how closely their thematic focus and support offerings match national and subnational climate investment needs.",
        "Considering access and participation barriers: Smaller cities may lack the resources, staff or international connections to participate effectively. National institutions or city associations can help to broaden access.",
        "Recognising different partnership models: International initiatives vary in their offerings, from knowledge exchange and technical assistance to financing and implementation support. Not all partnerships provide direct access to funding.",
        "Ensuring continuity beyond individual initiatives: International programmes may be time-bound or evolve over time. Lasting benefits depend on whether knowledge, relationships and capacities are retained within domestic institutions."
      ],
      "order": 2,
      "implementationGuidance": [
        {
          "title": "Identify opportunities for international engagement",
          "content": "Assess where cities could benefit from international expertise, financing partnerships, market connections or collective action on shared climate challenges. Connect cities with relevant international initiatives."
        },
        {
          "title": "Support cities and subnationals through intermediation",
          "content": "Use intermediaries to help cities to navigate international programmes, eligibility requirements and funding opportunities, particularly where local capacities are limited."
        },
        {
          "title": "Mobilise finance partners around investment portfolios",
          "content": "Engage MDBs, DFIs, climate funds and private financiers around urban investment portfolios and identify opportunities for technical and financial support."
        },
        {
          "title": "Track partnership outcomes and remaining gaps",
          "content": "Monitor technical assistance, financing opportunities and implementation support mobilised through partnerships. Use findings to strengthen future engagement."
        }
      ],
      "illustrativeExamples": [
        {
          "title": "The Cities Climate Finance Leadership Alliance (CCFLA)",
          "type": "Peer Learning Example",
          "excerpt": "The Cities Climate Finance Leadership Alliance (CCFLA) provides a multi-level, multi-stakeholder space for practitioners to connect...",
          "fullText": "The Cities Climate Finance Leadership Alliance (CCFLA) provides a multi-level, multi-stakeholder space for practitioners to connect, exchange experience and build networks around urban climate finance. Through its thematic Action Groups, CCFLA members can convene around priority topics such as project preparation, adaptation finance, enabling environments, private finance and other emerging financing challenges, sharing practical approaches and identifying opportunities for collaboration. Participation is open across CCFLA’s diverse membership, including national governments, city networks and subnational actors, demand- and supply-side finance organizations, and expert and technical organizations, helping to connect perspectives across levels of government and across the climate finance ecosystem.",
          "connectionLine": "Why see this: See how international networks can help national and subnational governments to access specialised climate finance expertise, exchange practical experience and develop partnerships to address investment barriers.",
          "order": 1
        },
        {
          "title": "First Mover Cities Cohort",
          "type": "Peer Learning Example",
          "excerpt": "First Mover Cities is an emerging city cohort being developed within the World Economic Forum's First Movers Coalition...",
          "fullText": "First Mover Cities is an emerging city cohort being developed within the World Economic Forum's First Movers Coalition to explore approaches to intra-city aggregated purchasing power. It aims to bring together city governments, businesses across the supply and demand sides of the construction value chain, finance institutions and other partners to strengthen demand for low-carbon solutions. Initial work focuses on cement and concrete, using multistakeholder dialogues to exchange practical experience on green procurement governance, tender design, supplier engagement and coordination of public and private demand within cities. Through these exchanges, the cohort aims to help cities develop approaches that could eventually enable aggregated purchasing and create stronger market signals for low-carbon solutions. San Francisco, Boston, Oslo and Stockholm are the initial First Mover Cities, with ambitions to expand participation globally and potentially extend the approach to other urban sectors.",
          "connectionLine": "Why see this: See how international collaboration can help cities explore intra-city demand aggregation and strengthen their ability to shape markets for low-carbon solutions.",
          "order": 2
        },
        {
          "title": "Global Platform for Sustainable Cities (GPSC)",
          "type": "Peer Learning Example",
          "excerpt": "GPSC shows how international partnerships can connect national and subnational governments with technical expertise...",
          "fullText": "GPSC shows how international partnerships can connect national and subnational governments with technical expertise, investment planning support and development-finance partners. Led by the World Bank and supported by the Global Environment Facility (GEF), GPSC provides knowledge exchange, capacity building and practical tools to help cities develop integrated urban investment approaches. It supports the wider GEF Sustainable Cities Programme, which includes a global knowledge platform with country-led, city-level projects financed through GEF resources and co-financing from development partners. This helps to connect national and local urban priorities with international expertise and financing opportunities for sustainable urban development.",
          "connectionLine": "Why see this: See how international partnerships can connect national and subnational governments with technical expertise, practical tools and implementation support for urban climate investments.",
          "order": 3
        },
        {
          "title": "UN-Habitat – RISE UP",
          "type": "Peer Learning Example",
          "excerpt": "RISE UP shows how international partnerships can mobilise finance and technical support for locally led climate adaptation.",
          "fullText": "RISE UP shows how international partnerships can mobilise finance and technical support for locally led climate adaptation. Established by UN-Habitat, the initiative has worked with national and local governments through its global, regional and country offices to connect urban resilience priorities with international financing partners. Through partnerships with the Adaptation Fund, Green Climate Fund and bilateral agencies, including Sweden's Sida, RISE UP reports mobilising over USD 150 million for urban climate resilience initiatives across nearly 30 countries. Although its flagship programme concluded in 2025, the RISE UP portfolio continues supporting cities with financing readiness, institutional capacity and implementation of resilience investments.",
          "connectionLine": "Why see this: See how international partnerships can connect national and local governments with climate funds, technical expertise and financing opportunities for urban adaptation.",
          "order": 4
        }
      ],
      "resources": [
        {
          "title": "CHAMP Initiative: Coalition for High Ambition Multilevel Partnerships",
          "type": "Report",
          "publisher": "COP28 Presidency / High-Level Champions",
          "link": "https://www.cop28.com/en/cop28-uae-coalition-for-high-ambition-multilevel-partnerships-for-climate-action",
          "description": "Official declaration and operational roadmap for 77+ signatory countries and institutional partner coalitions.",
          "order": 1
        }
      ]
    }
  ]
};

const filePath = path.resolve('./src/data/actionsDataList.ts');
const content = fs.readFileSync(filePath, 'utf-8');

const regex5 = /\{\s*\"id\":\s*5,[\s\S]*?\n\s*\}\s*\n\];/;
const match = content.match(regex5);

if (!match) {
  console.error("Could not find Action 5 block at end of actionsDataList.ts");
  process.exit(1);
}

const action5Formatted = JSON.stringify(action5Revised, null, 2);
const indentedAction5 = action5Formatted.split('\n').map(l => '  ' + l).join('\n');

const replaced = content.replace(regex5, `${indentedAction5}\n];`);
fs.writeFileSync(filePath, replaced, 'utf-8');
console.log("Successfully updated Action 5 in actionsDataList.ts!");
