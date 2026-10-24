import { actionsData as rawActions } from './actionsDataList';

export const actionsData = rawActions;

export const landingPageData = {
  hero: {
    badge: "Operational Blueprint",
    title: "Operationalizing Multilevel Governance & Climate Finance",
    subtitle: "A practical, 5-action toolkit designed for national, subnational, and local governments to break silos, accelerate investment pipelines, and scale systemic climate action.",
    cta: "Explore the 5 Actions",
    secondaryCta: "Learn About CHAMP"
  },
  champOpportunity: {
    title: "The CHAMP Initiative",
    goal: "The Coalition for High Ambition Multilevel Partnerships (CHAMP) aims to foster collaborative, multilevel governance between national and subnational governments to accelerate climate action and enhance Nationally Determined Contributions (NDCs).",
    points: [
      "Fostering formal institutional frameworks between national ministries and subnational governments.",
      "Bridging the planning-to-investment gap by packaging local project pipelines into investable portfolios.",
      "Unlocking public and private capital through aggregated procurement, pooled financing, and innovative de-risking mechanisms.",
      "Strengthening municipal capacities through peer networking, technical assistance, and national platforms."
    ],
    caseStudy: {
      title: "Sweden's Viable Cities Model",
      description: "Sweden pioneered Climate City Contracts connecting 23 municipalities with 6 national government agencies, driving collective mission-oriented innovation and systemic investments."
    },
    initiatives: [
      {
        name: "National Platforms",
        title: "Aligning policies, financing, and delivery frameworks across government levels",
        url: "https://www.cop28.com/en/cop28-uae-coalition-for-high-ambition-multilevel-partnerships-for-climate-action"
      },
      {
        name: "Climate City Contracts",
        title: "Binding collaborative commitments between national agencies, city governments, research, and civic actors",
        url: "https://viablecities.se/klimatkontrakt-2030"
      },
      {
        name: "Aggregated Financing",
        title: "Bundling municipal projects to achieve critical mass for institutional investors and MDBs",
        url: "https://www.climatepolicyinitiative.org"
      }
    ]
  }
};

export const deepDiveData = {
  sweden: {
    title: "Sweden's Viable Cities: A Mission-Driven Multilevel Governance Model",
    description: "Sweden's transition towards climate neutrality by 2030 is anchored by Viable Cities, a strategic innovation programme uniting 23 cities and 6 national agencies.",
    context: {
      title: "Context & Strategic Purpose",
      description: "Sweden recognized that municipal decarbonization cannot be achieved in isolation. Local actions require regulatory flexibility, national backing, and integrated investment frameworks.",
      purpose: "Through Climate City Contracts, national agencies and municipal leaders sign annual joint commitments to eliminate barriers, pilot systemic solutions, and co-invest in urban transitions."
    },
    governanceModel: {
      title: "The Governance & Delivery Model",
      pathwaysIntro: "The Swedish model integrates five key interconnected action pathways:",
      actionPathways: [
        {
          name: "Climate City Contract 2030",
          description: "An annual signed commitment between 23 mayors and heads of 6 national agencies outlining shared commitments and investment priorities."
        },
        {
          name: "System Demonstrators",
          description: "Large-scale, place-based living labs that test multiple interconnected technologies, policies, and business models simultaneously in real urban environments."
        },
        {
          name: "Intermediary Orchestration",
          description: "Viable Cities operates as an independent, trusted intermediary unit facilitating continuous dialogues, monitoring, and capacity building."
        },
        {
          name: "Multi-Agency National Alignment",
          description: "6 national agencies (Vinnova, Swedish Energy Agency, Formas, Tillväxtverket, Trafikverket, Boverket) coordinate funding calls and regulatory support."
        },
        {
          name: "Finance & Investment Lab",
          description: "Developing pooled municipal green finance, de-risking mechanisms, and private sector co-investment models for systemic scale."
        }
      ],
      orchestrationLogic: {
        title: "Key Orchestration Lessons",
        points: [
          "Establish neutral, trusted intermediaries capable of maintaining momentum across electoral cycles.",
          "Shift from isolated pilot projects to systemic portfolios with dedicated funding.",
          "Engage citizens and community stakeholders directly through participatory transition governance.",
          "Continuously feed subnational lessons back into national policy and legislative reforms."
        ]
      }
    }
  }
};
