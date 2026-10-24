import fs from 'fs';
import path from 'path';

const existingResources = [
  {
    title: "The Landscape of Project Preparation 2024",
    type: "Report",
    publisher: "CCFLA",
    link: "https://citiesclimatefinance.org/publications/the-landscape-of-project-preparation-2024",
    description: "",
    order: 1
  },
  {
    title: "Subnational Climate Finance & Multi-level Governance Frameworks",
    type: "Report",
    publisher: "OECD",
    link: "https://www.oecd.org/environment/",
    description: "Analytical framework evaluating legal, regulatory, and fiscal barriers to municipal climate investment.",
    order: 1
  },
  {
    title: "Enabling Frameworks for Subnational Climate Finance",
    type: "Report",
    publisher: "CCFLA",
    link: "https://citiesclimatefinance.org/",
    description: "Diagnosing national-local policy gaps and regulatory bottlenecks preventing capital flow to cities.",
    order: 2
  },
  {
    title: "Daring Cities 2025: Compendium of Good Practices and Resources",
    type: "Guide",
    publisher: "ICLEI",
    link: "https://iclei.org/e-library/daring-cities-2025-compendium-of-good-practices-and-resources/",
    description: "",
    order: 2
  },
  {
    title: "Thematic Call on LT-LEDS and NDC Alignment",
    type: "Guide",
    publisher: "NDC Partnership",
    link: "https://ndcpartnership.org/",
    description: "Framework for assessing alignment between long-term low-emission development strategies and municipal action.",
    order: 3
  },
  {
    title: "From Incentivizing to Enabling: A practitioner's guide to equitable climate action in cities",
    type: "Guide",
    publisher: "ICLEI",
    link: "https://iclei.org/e-library/from-incentivizing-to-enabling-a-practitioners-guide-to-equitable-climate-action-in-cities/",
    description: "",
    order: 3
  }
];

const action2Revised = {
  id: 2,
  description: "This Action helps national governments to identify and address barriers to urban climate finance and implementation. These may include policy, financing, data and coordination barriers. Governments can use these findings to prioritise reforms that improve investment conditions for cities.",
  systemsLogic: "Mobilizing urban climate finance requires more than the availability of capital. Policies, institutions, fiscal frameworks and regulatory conditions influence whether cities can prepare, finance and implement climate projects. National governments can address systemic barriers that cities cannot resolve alone, including borrowing restrictions, regulatory constraints and gaps in financial frameworks. Assessing these barriers and implementing targeted reforms can improve investment readiness, access to finance and implementation across cities.",
  pathways: [
    {
      title: "2.1. Enabling Framework Conditions Assessments",
      overview: "Enabling framework conditions assessments help national and subnational governments to systematically identify barriers to urban climate investment. Through evidence collection and stakeholder engagement, they reveal how existing conditions across data, finance and governance affect investment and implementation across government levels. Findings can help governments to identify reform priorities requiring coordinated national and subnational action.",
      potentialNationalLead: [
        "Planning Ministry",
        "Urban / Local Government Ministry"
      ],
      keyActors: [
        "Finance Ministry",
        "Climate / Environment Ministry",
        "City / Subnational Coalitions",
        "Municipal / Subnational Finance Department",
        "Municipal / Subnational Planning Department",
        "Implementation Partner Organizations"
      ],
      transferability: [
        "Considering differences in institutional capacity: The scope and depth of assessments may vary depending on government capacity, data and available expertise.",
        "Accounting for data availability: Where climate, fiscal or investment data are limited, assessments may need to draw more heavily on stakeholder consultations and qualitative evidence.",
        "Linking assessments to the right institutions and reform opportunities: Findings are more likely to inform action when relevant institutions have the mandate, political support and capacity to pursue identified reforms."
      ],
      order: 1,
      implementationGuidance: [
        {
          title: "Define the purpose and scope of the assessment",
          content: "Identify the investment challenges the assessment should examine. Determine which institutions, government levels and financing systems should be included."
        },
        {
          title: "Engage subnational governments early",
          content: "While developing the purpose and scope of the assessment, involve cities and subnational authorities early to identify their specific investment challenges and priorities."
        },
        {
          title: "Assess existing conditions",
          content: "Review relevant policies, regulations, fiscal systems, financing frameworks, institutional arrangements and data. Consult stakeholders to understand how these work in practice."
        },
        {
          title: "Identify barriers to investment",
          content: "Determine which policy, fiscal, institutional, financing or data constraints are limiting urban climate investment. Distinguish national barriers from those that can be addressed locally."
        },
        {
          title: "Validate findings across government levels",
          content: "Discuss findings with cities, subnational governments and relevant national institutions. Use this process to confirm priorities and identify areas requiring joint action."
        },
        {
          title: "Prioritise areas for reforms",
          content: "Identify which barriers have the greatest effect on investment and implementation. Use the findings to inform reform priorities, technical assistance and financing support."
        },
        {
          title: "Repeat the assessment when needed",
          content: "Revisit priority areas as reforms progress and investment conditions change."
        }
      ],
      illustrativeExamples: [
        {
          title: "National Enabling Framework Conditions (EFC) Tool",
          type: "Tool",
          excerpt: "The tool assesses national enabling conditions for urban climate finance across four categories: policy, budget and finance, climate data, and vertical and horizontal coordination...",
          fullText: "The tool assesses national enabling conditions for urban climate finance across four categories: policy, budget and finance, climate data, and vertical and horizontal coordination. These cover 16 subcategories and 64 assessment dimensions. Through evidence collection, stakeholder consultations and analysis, the tool helps national governments understand existing enabling conditions, identify barriers to urban climate investment and prioritise areas for reform.",
          connectionLine: "Why use this tool: Assess national policy, fiscal and institutional barriers to urban climate finance and identify reform priorities requiring national action.",
          link: "https://citiis.niua.in/",
          order: 1
        },
        {
          title: "Subnational Enabling Framework Conditions (EFC) Tool",
          type: "Tool",
          excerpt: "The tool is designed primarily for subnational and municipal governments. It assesses enabling conditions for urban climate finance at the city, metropolitan, state or regional level...",
          fullText: "The tool is designed primarily for subnational and municipal governments. It assesses enabling conditions for urban climate finance at the city, metropolitan, state or regional level. It covers 49 assessment dimensions across four categories and 13 subcategories. Through evidence collection, stakeholder consultations and analysis, it helps subnational governments identify strengths, investment barriers and areas for improvement. Used alongside the National EFC Tool, it helps identify barriers requiring action at different government levels.",
          connectionLine: "Why use this tool: Assess local conditions affecting access to climate finance and identify improvements requiring subnational action.",
          link: "https://www.climatepolicyinitiative.org/wp-content/uploads/2024/08/Subnational-Assessment-tool.pdf",
          order: 2
        },
        {
          title: "India – National Enabling Framework Conditions Assessment",
          type: "Peer Learning Example",
          excerpt: "The India assessment illustrates how the national EFC tool works in practice through multi-ministry roundtables and policy review...",
          fullText: "The India assessment illustrates how the national EFC tool works in practice. The pilot was led by GIZ, alongside the Indian Ministry of Housing and Urban Affairs, the National Institute of Urban Affairs and The Energy Research Institute. It included a desk review with seven stakeholder interviews and two roundtables in New Delhi attended by more than 80 participants. The findings on the four dimensions included gaps in local institutional mandates, own-source revenues and borrowings, city-level climate data and coordination between state and local governments. Each gap points to a specific reform — broadening grants from the national finance commission to support climate action, for instance, or issuing city climate action plan guidelines under national missions.",
          connectionLine: "Why see this: See how a national assessment can diagnose enabling environments related to national policy, data, finance and institutional coordination and make recommendations for reforms.",
          link: "https://citiis.niua.in/",
          order: 3
        },
        {
          title: "Indonesia – Subnational Enabling Framework Conditions Assessment",
          type: "Peer Learning Example",
          excerpt: "Indonesia shows how a subnational assessment can identify strengths, gaps and opportunities to improve enabling conditions for urban climate finance...",
          fullText: "Indonesia shows how a subnational assessment can identify strengths, gaps and opportunities to improve enabling conditions for urban climate finance. Conducted under the Urban-Act project, the assessment covered Medan City, Binjai City and Deli Serdang Regency (Mebidang) in North Sumatra. It found progress in integrating climate priorities into local development plans and using intergovernmental transfers for climate action. However, gaps remain in municipal climate budgeting, access to private and innovative finance, climate data and coordination across government levels. The assessment recommended extending climate budget tagging to municipalities, strengthening local revenue and financing options, and establishing a coordination team led by North Sumatra's Development Planning Agency. These recommendations aim to strengthen local financing conditions and align climate planning and implementation across government levels.",
          connectionLine: "Why see this: See how a subnational assessment can identify existing strengths and gaps and inform recommendations to improve climate finance and multilevel governance.",
          link: "",
          order: 4
        },
        {
          title: "India – Subnational Enabling Framework Conditions Assessment (Coimbatore)",
          type: "Peer Learning Example",
          excerpt: "India shows how a subnational assessment can identify strengths, gaps and opportunities to improve urban climate finance across city and state governments...",
          fullText: "India shows how a subnational assessment can identify strengths, gaps and opportunities to improve urban climate finance across city and state governments. Conducted in Coimbatore, Tamil Nadu, the assessment examined climate policy, budgeting and finance, climate data and multilevel coordination. It found that Tamil Nadu state has established climate policies and financing institutions, while Coimbatore city has developed a Climate Resilient City Action Plan and mobilized finance through government programmes and other sources. However, gaps remain in city-level climate budgeting, access to finance, climate data and alignment between state and municipal planning. The assessment recommended strengthening climate budgeting, expanding state support for municipal climate investment and improving coordination between state and city institutions.",
          connectionLine: "Why see this: See how a city-level assessment can identify existing strengths and gaps, and inform improvements to state and municipal policies, financing systems and coordination.",
          link: "",
          order: 5
        }
      ],
      resources: existingResources
    },
    {
      title: "2.2. Enabling Reforms for Urban Climate Investment",
      overview: "Enabling reforms help governments address regulatory, fiscal and institutional barriers that constrain urban climate investment. Building on enabling-environment assessments, national and subnational governments can develop reform roadmaps that identify priority actions, institutional responsibilities, resources and implementation milestones. They can also help to sequence reforms across government institutions and establish milestones for tracking progress. This provides a shared basis for national and subnational governments, development partners and finance institutions to coordinate support around agreed priorities.",
      potentialNationalLead: [
        "Finance Ministry",
        "Planning Ministry",
        "Urban / Local Government Ministry"
      ],
      keyActors: [
        "Relevant Sectoral Ministries",
        "Municipal / Subnational Finance Department",
        "Municipal / Subnational Planning Department",
        "National Development Bank",
        "MDB / DFI",
        "Technical Assistance Providers"
      ],
      transferability: [
        "Reflecting political and legislative requirements: Some reforms require parliamentary approval, changes to legislation or agreement across government institutions. Roadmaps should account for these processes and realistic timelines.",
        "Considering institutional responsibilities across government levels: In centralised systems, national institutions may lead reforms, while decentralised systems may require greater subnational ownership and coordination.",
        "Accounting for fiscal space and financing arrangements: The availability of national grants, development finance and performance-linked incentives will affect how governments can support municipal reforms.",
        "Recognising differences in cities’ capacity: Cities with limited financial or technical capacity may need phased reforms, targeted technical assistance and additional support to implement improvement plans."
      ],
      order: 2,
      implementationGuidance: [
        {
          title: "Prioritise reforms based on impact and feasibility",
          content: "Identify barriers with the greatest effect on urban climate investment. Consider their urgency, political feasibility and potential benefits."
        },
        {
          title: "For each priority, define the intended actions",
          content: "Specify the actions required for each reform and identify the responsible institutions. Define milestones, resources and technical support where needed."
        },
        {
          title: "Identify dependencies across government levels",
          content: "Determine which reforms require national action and which can be implemented locally. Sequence connected reforms so that progress in one area enables another."
        },
        {
          title: "Connect reforms with finance and technical support",
          content: "Identify where public funding, development finance, technical assistance or performance-based incentives can support implementation."
        },
        {
          title: "Track progress and revise the roadmap",
          content: "Establish clear milestones and review progress periodically. Update priorities when reforms advance or new barriers emerge."
        }
      ],
      illustrativeExamples: [
        {
          title: "Climate Finance Reform Compass (CPI)",
          type: "Tool",
          excerpt: "The Climate Finance Reform Compass helps align government, civil society, and the private sector on the full range of financial architecture reforms...",
          fullText: "The Climate Finance Reform Compass helps align government, civil society, and the private sector on the full range of financial architecture reforms needed to maximize climate finance opportunities. It provides an action-oriented framework for translating climate finance commitments and identified gaps into prioritized reform areas, milestones, and institutional actions. The Global Compass tracks progress across nine thematic areas for the international community to understand where progress is being made, where gaps persist, and how reforms can reinforce each other.",
          connectionLine: "Why use this tool: Identify climate-finance reform priorities, track progress and support coordination among institutions responsible for implementing reforms.",
          link: "https://www.climatepolicyinitiative.org/",
          order: 1
        },
        {
          title: "The Brazil Climate Finance Reform Compass",
          type: "Tool",
          excerpt: "The Brazil Climate Finance Reform Compass adapts the global framework to national context, identifying gaps and reform priorities...",
          fullText: "The Brazil Climate Finance Reform Compass adapts the global framework to national context, identifying gaps and reform priorities across the same nine thematic areas and mapping the institutions, actors and milestones needed to advance them. Both are designed as living tools that can be updated as policies, evidence and stakeholder priorities evolve, helping governments and other stakeholders coordinate reforms, track progress and strengthen alignment between climate finance and broader development priorities.",
          connectionLine: "Why use this tool: See how a climate-finance reform framework can be tailored to national institutions, priorities and decision-making processes.",
          link: "https://www.climatepolicyinitiative.org/",
          order: 2
        },
        {
          title: "Uganda – Support to Municipal Infrastructure Development (USMID)",
          type: "Peer Learning Example",
          excerpt: "Uganda shows how national governments can support municipal reform planning through institutional assessments and performance-linked financing...",
          fullText: "Uganda shows how national governments can support municipal reform planning through institutional assessments and performance-linked financing. Led by the Ministry of Lands, Housing and Urban Development, the programme began in 2013 with 14 municipalities. Technical, financial and institutional assessments informed a Programme Action Plan, outlining corrective actions, institutional responsibilities and implementation timelines. Municipalities also developed capacity-building plans addressing weaknesses in planning, revenue management, procurement and infrastructure delivery. Annual performance assessments linked infrastructure grants to improvements in municipal revenue collection, financial management, budgeting, procurement and service delivery. The programme closed in 2024 with a satisfactory outcome rating. Building on its achievements, Uganda secured approval in 2026 for the USD 540 million Uganda Cities and Municipalities Infrastructure Development (UCMID) programme, expanding support for municipal institutions and climate-smart infrastructure.",
          connectionLine: "Why see this: See how national governments can connect institutional assessments, municipal reform plans and performance-linked financing to strengthen urban investment conditions.",
          link: "",
          order: 3
        },
        {
          title: "South Africa – Metro Trading Services Reform Programme",
          type: "Peer Learning Example",
          excerpt: "South Africa shows how national government can lead reform programs that build on municipal reform strategies...",
          fullText: "South Africa shows how national government can lead reform programs that build on municipal reform strategies. Led by the National Treasury, the programme aims to strengthen municipal finances and attract additional infrastructural investment. It responds to the declining financial and operational performance in water, sanitation, electricity and waste services across eight metropolitan municipalities. Participating municipalities have adopted reform strategies, institutional roadmaps, and business and investment plans. These set out institutional changes and investment priorities, while performance improvement plans establish measurable targets. A six-year, ZAR 54 billion (~USD 3.85 billion) performance-linked grant incentivises reforms, with funding tied to progress on the reforms against agreed targets.",
          connectionLine: "Why see this: See how national governments can support municipal reform roadmaps through institutional coordination and performance-linked financing.",
          link: "",
          order: 4
        }
      ],
      resources: existingResources
    }
  ]
};

const filePath = path.resolve('./src/data/actionsDataList.ts');
const content = fs.readFileSync(filePath, 'utf-8');

const action2Start = content.indexOf('{\n    "id": 2,');
const action3Start = content.indexOf('{\n    "id": 3,');

if (action2Start === -1 || action3Start === -1) {
  console.error("Could not find start of Action 2 or Action 3 in actionsDataList.ts");
  process.exit(1);
}

const action2Formatted = JSON.stringify(action2Revised, null, 2);
const indentedAction2 = action2Formatted.split('\n').map(l => '  ' + l).join('\n');

const newContent = `${content.slice(0, action2Start)}${indentedAction2},\n  ${content.slice(action3Start)}`;
fs.writeFileSync(filePath, newContent, 'utf-8');
console.log("Successfully updated Action 2 with all new tools and peer learning examples in actionsDataList.ts!");
