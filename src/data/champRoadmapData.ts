export interface RoadmapActivity {
  code: string; // e.g. "1.1", "1.2"
  title: string; // e.g. "Enhance multilevel climate dialogue"
  bullets: string[]; // detailed bullet points with actors
  actionIds?: number[]; // mapping to core toolkit actions (e.g. for Pillar 3)
}

export interface RoadmapPillar {
  number: number;
  title: string;
  goal?: string;
  leadResponsibility?: string;
  overview: string;
  transitionNote?: string;
  activities: RoadmapActivity[];
}

export const defaultChampRoadmapData: RoadmapPillar[] = [
  {
    number: 1,
    title: "Pillar 1: Strengthening multilevel climate governance on the global stage",
    goal: "CHAMP-endorsing countries have deepened their engagement with the CHAMP coalition, and the global climate governance architecture has strengthened its recognition of subnational governments as critical partners to achieving the goals of the Paris Agreement.",
    leadResponsibility: "Steering Group and Secretariat, with active engagement from CHAMP endorsing countries.",
    overview: "Under this pillar, the CHAMP Steering Group works to deepen engagement with CHAMP endorsing countries, ensure subnational voices are heard more clearly in global climate decision making, seek greater recognition of the role of subnational governments across a targeted set of global climate governance instruments and reports and support transparent, country-led review processes.",
    transitionNote: "Building on the global engagement and governance architecture advanced under Pillar 1, Pillar 2 focuses on the practical, country-level conditions needed to deliver multilevel climate action on the ground.",
    activities: [
      {
        code: "1.1",
        title: "Enhance multilevel climate dialogue",
        bullets: [
          "Convene an annual High-Level Political Dialogue bringing together national and subnational leaders from CHAMP-endorsing countries to showcase progress and drive global engagement and diplomacy [Secretariat].",
          "Build formal links between CHAMP and other multilateral and sectoral initiatives to strengthen alignment and impact [Steering Group and Secretariat]."
        ],
        actionIds: [1, 3]
      },
      {
        code: "1.2",
        title: "Influence global climate governance instruments and reports",
        bullets: [
          "Secure strong recognition of multilevel partnerships as integral to effective climate action in the Global Implementation Accelerator (GIA) report [Steering Group].",
          "Facilitate a positive response to the IPCC Special Report on Climate Change and Cities (SR), highlighting the report's recognition of multilevel partnerships as a key enabler of climate action [Steering Group].",
          "Advocate for the Second Global Stocktake (GST2) to reiterate the value of local and subnational actors as indispensable partners to national governments for implementing climate action [Steering Group].",
          "Ensure Nationally Determined Contributions (NDCs) and National Adaptation Plans (NAPs) contain strengthened multilevel governance content that demonstrates intentional and strategic linkages between national and subnational levels [CHAMP-endorsing countries]."
        ],
        actionIds: [1, 2]
      },
      {
        code: "1.3",
        title: "Support transparent, country-led review processes",
        bullets: [
          "Provide guidance on integrating voluntary multilevel reviews into existing national reporting processes [Secretariat and CHAMP partners].",
          "Leverage Biennial Transparency Reports (BTRs) as a voluntary review of progress at national and subnational level on the implementation of CHAMP commitments [CHAMP-endorsing countries]."
        ],
        actionIds: [5]
      }
    ]
  },
  {
    number: 2,
    title: "Pillar 2: Catalysing partnerships for local climate delivery",
    goal: "CHAMP-endorsing countries have strengthened multilevel partnership mechanisms to ensure subnational priorities and efforts are integrated into the design, financing and delivery of Nationally Determined Contributions (NDCs) and National Adaptation Plans (NAPs).",
    leadResponsibility: "Secretariat and CHAMP partners, with CHAMP-endorsing countries as primary implementers.",
    overview: "Under this pillar, CHAMP-endorsing countries move from ambition to action, building the enabling conditions, partnerships and delivery mechanisms needed for effective multilevel climate implementation, including robust coordination mechanisms, integrated planning, and alignment between subnational priorities and national development policies.",
    transitionNote: "Leveraging the enabling conditions, partnerships and delivery mechanisms advanced under Pillar 2, Pillar 3 works to unlock the investment flows needed to sustain long-term multilevel climate action at scale.",
    activities: [
      {
        code: "2.1",
        title: "Support enabling conditions for multilevel climate implementation",
        bullets: [
          "Seek to coordinate CHAMP partner support around country needs, with a view to ensuring technical assistance, capacity building and other cooperation are complementary and strategically aligned with CHAMP priorities where possible [Secretariat and NDC Partnership].",
          "Where partner resources and mandates allow, provide targeted assistance to CHAMP endorsing countries to establish or strengthen coordination mechanisms, develop integrated implementation plans, and create a strong foundation for investment mobilisation [CHAMP partners]."
        ],
        actionIds: [2, 3]
      },
      {
        code: "2.2",
        title: "Ensure access to relevant data, knowledge and tools",
        bullets: [
          "Develop case studies, guidance, and other resources tailored to the multilevel implementation needs of CHAMP-endorsing countries and maintain a publicly accessible CHAMP knowledge hub, connecting with relevant content across partner-owned resource platforms [Secretariat and CHAMP partners].",
          "Publish an annual CHAMP progress, impact and learnings report to demonstrate the value of multilevel partnerships and support informed decision-making [Secretariat]."
        ],
        actionIds: [5]
      },
      {
        code: "2.3",
        title: "Facilitate knowledge exchange and good practice sharing",
        bullets: [
          "Convene peer exchanges for CHAMP-endorsing countries through dedicated CHAMP events and targeted participation at key international events to share experiences and practical approaches to implementation [Secretariat and CHAMP partners].",
          "Support ongoing knowledge sharing across the CHAMP community to enhance collaboration and promote good practice and shared learning on multilevel climate governance and implementation [Secretariat and CHAMP partners]."
        ],
        actionIds: [5]
      }
    ]
  },
  {
    number: 3,
    title: "Pillar 3: Scaling up and unlocking subnational climate finance for implementation",
    goal: "CHAMP-endorsing countries have established robust pathways to scale up and unlock subnational government access to climate finance, with subnational priorities integrated into national and global investment plans.",
    leadResponsibility: "Steering Group, Secretariat and CHAMP partners, with CHAMP-endorsing countries as primary implementers.",
    overview: "Under this pillar, CHAMP-endorsing countries move from planning to investment mobilisation by translating subnational climate priorities into investable projects, strengthening regulatory and institutional frameworks, and building reliable pathways for public and private finance to reach regional and local governments.",
    activities: [
      {
        code: "3.1",
        title: "Integrate subnational priorities into national climate finance strategies and investment plans",
        bullets: [
          "Facilitate coordination and knowledge exchange between CHAMP-endorsing countries and CHAMP partners on subnational climate finance strategies, engaging national finance ministries, planning agencies and other stakeholders to support integration of subnational priorities into national investment plans and sectoral policies [Secretariat and CHAMP partners]."
        ],
        actionIds: [1, 3, 4]
      },
      {
        code: "3.2",
        title: "Enable a coordinated approach to project preparation",
        bullets: [
          "Convene project preparation providers, national government ministries and finance institutions with a view to developing coordinated national-level approaches to project development [Secretariat and CHAMP partners].",
          "Where partner resources and mandates allow, provide capacity building and technical support for subnational project preparation in CHAMP-endorsing countries to strengthen the pipeline of bankable projects [CHAMP partners]."
        ],
        actionIds: [4]
      },
      {
        code: "3.3",
        title: "Advocate for reform of finance institutions and climate funds",
        bullets: [
          "Develop reform proposals or recommendations for domestic and international development finance institutions, and vertical climate funds so that they better reflect the needs, opportunities and constraints of subnational governments [Steering Group and CHAMP partners].",
          "Convene multi-stakeholder dialogues with domestic and international development finance institutions, and vertical climate funds to build consensus around reform needs and strengthen coordination on implementation [CHAMP partners].",
          "Champion reform of domestic finance institutions and vertical climate funds within national policy processes to increase subnational access to climate finance [CHAMP-endorsing countries]."
        ],
        actionIds: [2, 5]
      }
    ]
  }
];
