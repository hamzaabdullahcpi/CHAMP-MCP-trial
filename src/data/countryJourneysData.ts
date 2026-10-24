import { CountryJourneyData } from '../types/countryJourney';

export const swedenJourneyDefaultData: CountryJourneyData = {
  order: 1,
  countryId: 'sweden',
  countryName: 'Sweden',
  flag: '🇸🇪',
  status: 'Available',
  isReady: true,
  tagline: 'Sweden: An Evolving Mission-Oriented Approach to Urban Climate Transition',
  summary: 'Showcasing how Viable Cities, Climate City Contract 2030, the Coordination Function, and System Demonstrators form an interconnected multilevel delivery system spanning 48 municipalities and 6 national agencies.',
  keyMechanisms: [
    'Viable Cities Platform',
    'Climate City Contract 2030',
    'System Demonstrators',
    'EnergyNet Local Energy',
    'Viability Fund for Cities',
  ],
  cardImage: 'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?auto=format&fit=crop&w=800&q=80',
  themeColor: '#207B6A',

  headerSubtitle: '• Sweden Deep Dive',
  headerTitle: 'Sweden’s Multilevel Governance and Implementation Journey',
  headerDescription:
    'An in-depth analysis of Sweden’s evolving mission-oriented innovation ecosystem, demonstrating how municipal autonomy, recurring political contracts, system demonstrators, and emerging local investment structures connect into a continuous multilevel delivery architecture.',

  tabATitle: 'The Swedish Context',
  tabASubtitle: 'An Evolving Mission-Oriented Approach to Urban Climate Transition',
  premisesHeading: 'Two Central Premises of Sweden’s Multilevel Journey',
  premises: [
    {
      number: 1,
      title: '1) No Actor Can Deliver the Transition Alone',
      description:
        'No single actor or level of government can deliver the transition alone. Municipalities can act as a “gathering force”, connecting their own mandates with businesses, utilities, property owners and citizens whose decisions are also necessary for transition.',
    },
    {
      number: 2,
      title: '2) Finance Follows Governance',
      description:
        'Finance becomes more effective when the governance and implementation systems needed to organize collective action are in place. Political direction, local ownership, coordination and credible portfolios create the conditions for financing needs to become clearer and for finance actors to engage.',
    },
  ],

  contextSections: [
    {
      title: 'An Evolving, Iterative Multilevel Climate Action Model',
      paragraphs: [
        "Sweden's multilevel climate action model has evolved iteratively, as successive stages of climate action exposed new financing, implementation and coordination challenges and opportunities. This evolution has been shaped by strong municipal autonomy, a well-developed research and innovation system, established municipal financing capacity and a governance culture that supports experimentation and learning across institutional boundaries.",
      ],
    },
    {
      title: 'Municipalities as a "Gathering Force"',
      paragraphs: [
        'Swedish municipalities have substantial responsibility for systems central to climate transition, including spatial planning, infrastructure, municipal companies, procurement and investment. Yet many regulatory, financial and infrastructure conditions are determined nationally or at European level, while businesses, utilities, property owners and citizens control important assets and decisions.',
        'A central premise of the Swedish approach is therefore that no single actor or level of government can deliver the transition alone. Municipalities can instead act as a “gathering force”, connecting their own mandates with actors whose decisions are also necessary for transition. This has encouraged a shift from traditional municipal governance toward more network-based, multilevel forms of governance and coordination.',
      ],
    },
    {
      title: 'Viable Cities: A National Platform Orchestrating the Swedish Ecosystem',
      paragraphs: [
        "Sweden's multilevel model developed through its mission-oriented innovation ecosystem. Viable Cities was established in 2017 and progressively brought municipalities, national agencies, research institutions, businesses and civil society around the mission of climate-neutral cities by 2030. Rather than attempting national scale immediately, the programme developed approaches with pioneer municipalities",
      ],
      bulletPoints: [
        { label: '9 Pioneer Municipalities', text: 'in 2019' },
        { label: '23 Municipalities', text: 'in 2021' },
        { label: '48 Municipalities', text: 'in 2024 (representing approximately half of Sweden\'s total population)' },
      ],
    },
    {
      title: 'Climate City Contracts: Integrating Climate Action into Coordination and Planning Process',
      paragraphs: [
        "As participation grew, experience demonstrated that a shared mission needed to be translated into durable political commitments, locally owned transition processes and continuous national–local coordination. Climate City Contract 2030 along with Transition Arenas and later Samordningsfunktionen (the Coordination Function) developed within this context. Importantly, the emerging governance process was designed to interact with municipalities' ordinary planning, budgeting and political cycles and to be reviewed and renewed over time, rather than becoming a parallel climate-governance structure.",
        "The process has also helped national agencies identify how their programmes, policy instruments and funding calls can be better coordinated with municipal implementation needs and with one another.",
      ],
    },
    {
      title: 'System Demonstrators: Collaborative Implementation Environments',
      paragraphs: [
        "Sweden’s work on System Demonstrators predates the first Climate City Contract and developed from earlier experience with innovation and pilots. A recurring challenge was that pilots could produce results without a clear pathway towards wider implementation and scale. This experience also highlighted that technology alone was insufficient when policy, finance, business models and other conditions shaped implementation.",
        "System Demonstrators were developed to bring multiple actors and interventions together around bounded, real-world transition challenges and coordinated portfolios of action. Examples in Lund and Stockholm demonstrate this approach across areas including energy, mobility and transport. From 2021 onwards, System Demonstrators were progressively connected to the wider Climate City Contract process.",
      ],
    },
    {
      title: 'Bridging the Financing Gap: Local Climate Investment Structures & Viability Fund',
      paragraphs: [
        "As these governance and delivery approaches matured, they exposed a further gap between transition priorities and finance. Urban transition portfolios can involve multiple owners, different risk and maturity profiles and enabling interventions that are not themselves investable. Sweden already has strong municipal borrowing capacity through Kommuninvest, but conventional debt does not by itself provide project preparation, portfolio structuring, catalytic capital or coordination across actors and assets. This has led to emerging work on Local Climate Investment Structures, including learning from the EnergyNet use case, to better connect locally owned transition priorities with investment and finance.",
        "This evolution reflects a second core principle emphasized by Viable Cities: finance follows governance. This does not mean that finance only enters after governance is complete. Rather, political direction, local ownership, coordination and credible portfolios create the conditions for financing needs to become clearer and for finance actors to engage. The financing challenge is therefore also a governance and implementation challenge: connecting actors, priorities, investment planning, finance and procurement into a coherent system.",
        "This thinking has informed the emerging Viability Fund for Cities, intended to strengthen connections between systemic urban transformation, local investment and national and international finance. In parallel, work on aggregated demand and market shaping, including First Mover Cities, reflects recognition that finance alone is insufficient for scale: cities and other urban actors can also use coordinated purchasing and credible demand signals to help create markets for transition solutions.",
        "Part B examines the mechanisms that emerged through this evolution and how they interact across the Toolkit's five Actions.",
      ],
    },
  ],

  tabBTitle: 'The Multilevel Model',
  tabBSubtitle: 'Architecture Diagram & 5 Multilevel Governance Actions',
  modelHeading: 'Sweden’s Multilevel Climate Governance and Implementation Model',
  modelOverview:
    'Sweden’s experience brings together mechanisms at different stages of maturity. Viable Cities, Climate City Contract 2030, the Coordination Function and System Demonstrators are established components, while Local Climate Investment Structures, the Viability Fund for Cities and stronger aggregated-demand and finance interfaces are being developed. The diagram above shows how these programs form a continuous multilevel implementation system. \n\nBelow sections describe how Sweden has embarked on the 5 Actions as part of its multilevel climate finance and implementation journey.',
  modelDiagramNote:
    'The diagram below illustrates how these programs form a continuous multilevel implementation system. Click on the image or the Fullscreen button to zoom and pan.',
  diagramImageUrl: '/sweden-model-architecture.png',
  diagramImageAlt: 'Sweden’s Multilevel Climate Governance and Implementation Architecture',

  actionsHeading: "Sweden's Journey Across the 5 Actions",
  actionsSubtitle: "Below sections describe how Sweden has embarked on the 5 Actions as part of its multilevel climate finance and implementation journey.",
  actions: [
    {
      actionNumber: 1,
      actionThemeTitle: '• Commitments & Platforms',
      title: 'Establish Multilevel Commitments and Platforms for Climate Investment',
      paragraphs: [
        'Climate City Contract 2030 (CCC) provides a recurring process for municipalities, national agencies and Viable Cities to establish and renew shared climate commitments. Transition Arenas extend local ownership to businesses, academia and civil society, while Joint Commitments help groups of municipalities address shared challenges.',
        "Viable Cities serves as Sweden's national coordination platform, connecting municipalities, six national agencies and wider transition actors. Its dedicated Coordination Function identifies recurring municipal needs, facilitates national–local collaboration and feeds lessons into subsequent CCC cycles. National agencies also use joint action planning to connect their commitments with national programmes and policy instruments.",
        'Building on this experience, the emerging Viability Fund for Cities is exploring ways to coordinate different funding sources across government levels, around urban climate investment portfolios. It seeks to connect systemic implementation with finance, demand and wider scaling. Its architecture combines three reinforcing functions: \n\n1) ALIGN, focused on aligning funders, programmes and implementation partners around common System Demonstrators principles; \n2) CO-FINANCE, mobilizing catalytic capital to help scale opportunities emerging from System Demonstrators, transition portfolios and local climate investment structures; and\n3) DEMAND, connecting these efforts with aggregated demand and market shaping.',
      ],
      enabledSummary:
        'Sweden has expanded from nine participating municipalities in 2019 to 48, establishing recurring multilevel commitments and coordination. The opportunity is to strengthen connections between these arrangements, investment decisions and national support.',
    },
    {
      actionNumber: 2,
      actionThemeTitle: '• Enabling Environments',
      title: 'Strengthen Enabling Environments for Climate Investment',
      paragraphs: [
        "Sweden's approach illustrates a continuous process of assessing enabling-environments. Climate City Contracts and Transition Arenas have surfaced implementation barriers and needs, while the Coordination Function identifies recurring governance and finance gaps across municipalities.",
        'System Demonstrators deepen this diagnostic function through real-world implementation. They examine key barriers and transformation potential across governance, regulation, finance and business models, infrastructure, behaviour and technology, allowing cities and partners to understand not only whether an intervention works but what surrounding conditions must change for systemic transformation to occur.',
      ],
      enabledSummary:
        'barriers identified through local experience can become inputs into subsequent portfolios, coordination and policy discussions. The opportunity is converting dispersed implementation evidence into sufficiently systematic information that national actors can act upon.',
    },
    {
      actionNumber: 3,
      actionThemeTitle: '• Investment Portfolios',
      title: 'Plan, Prepare and Implement Climate Investment Portfolios',
      paragraphs: [
        'Climate City Contracts help to translate shared commitments into locally owned transition priorities. Through Transition Arenas and related planning processes, municipalities and their partners organize these priorities into transition portfolios, which include interconnected actions spanning investment, policy, governance, procurement and capacity. As these portfolios mature, cities can identify their investment needs and develop investment plans for the components requiring finance. This process is still at different stages across participating municipalities, so not all Swedish cities yet have mature investment plans.',
        "Transition portfolios also provide the strategic basis for System Demonstrators. While Climate City Contracts address the municipality's wider transition, System Demonstrators focus on more bounded systemic challenges and are increasingly grounded in cities' Climate City Contract priorities and portfolios. This helps ensure that demonstration activity contributes to the wider transition rather than operating as a standalone pilot. System Demonstrators’ role in implementing these portfolios and creating pathways to finance and scale is discussed under Action 4.",
      ],
      caseStudy: {
        title: 'EnergyNet’s Portfolio Approach',
        paragraphs: [
          'EnergyNet shows why transition priorities need to be organized as portfolios rather than standalone projects. EnergyNet is a decentralized local electricity network architecture that enables buildings, vehicles and local energy resources to share renewable electricity, reducing dependence on conventional grid reinforcement. It was identified as a potential system gamechanger within CoAction Lund’s work on local energy systems. Its implementation is connected to a wider set of interventions across buildings, energy infrastructure, mobility and multiple public and private actors. The portfolio approach helps identify these interdependencies and the combination of actions needed to enable the transition, while also surfacing investment needs and barriers for further preparation.',
        ],
      },
      enabledSummary:
        'Sweden has progressively connected shared political commitments with locally anchored portfolios and investment needs, creating a clearer bridge between climate governance and investment planning. The opportunity is to strengthen investment planning and preparation across municipalities with different levels of capacity and maturity, while retaining the broader systemic interventions needed to deliver the transition.',
    },
    {
      actionNumber: 4,
      actionThemeTitle: '• Mobilize Finance & Shape Markets',
      title: 'Mobilize Finance and Shape Markets',
      paragraphs: [
        'The transition portfolios developed under Climate City Contracts contain different types of interventions and therefore require different pathways to implementation and scale. Sweden is increasingly connecting three such functions: systemic implementation through System Demonstrators, preparation and financing through emerging Local Climate Investment Structures, and aggregated demand and market shaping to support wider uptake.',
        "System Demonstrators help implement transition portfolios through interconnected interventions across governance, infrastructure, finance, technology and markets. Sweden's demonstrators in Lund and Stockholm illustrate how implementation can reveal investable opportunities, financing barriers and enabling conditions for wider adoption. As shown by Sweden’s Lund and Stockholm System Demonstrators, not every intervention needs to become a bankable project. Investment pipelines can emerge from the wider portfolio of systemic interventions rather than defining that portfolio itself.",
        'This creates the rationale for emerging Local Climate Investment Structures. These are being conceptualised as locally anchored arrangements to translate suitable components of climate transition portfolios into prepared and financed investments. The proposed model combines two complementary functions:\n\n• Local Transition Governance Function: Establishes local ownership and mandate, coordinates the wider transition portfolio, and supports monitoring and learning. This helps ensure that investment decisions remain connected to the city\'s wider climate priorities.\n• Local Investment Function: Identifies and prepares investable opportunities within the portfolio, structures risks and financing arrangements, and matches investments with suitable sources of capital. This could include engaging financial institutions, mobilizing catalytic capital and identifying opportunities for reinvestment.',
        'The conceptual framework illustrated below identifies five interconnected steps for developing these structures:\n1. ANCHOR: Connect investment activity to locally defined transition priorities and establish a local mandate.\n2. GOVERN: Clarify portfolio governance, ownership, decision-making and coordination.\n3. PREPARE: Prioritise and prepare investments, including assessing their financing needs.\n4. ORGANISE: Select an appropriate institutional and financial structure based on local circumstances.\n5. CONNECT: Link local investment opportunities with national platforms, policymakers and financing partners.',
        'Importantly, these structures are not envisaged as a single prescribed fund or financial vehicle. Depending on local circumstances, their functions could be delivered through municipal balance sheets, public banks, funds, trusts, SPVs, bonds or delegated fund managers. The underlying functions are intended to remain consistent, while their institutional and financial arrangements would reflect local mandates, fiscal capacities and market conditions.',
        'Sweden already has a strong foundation for conventional municipal finance through Kommuninvest, which provides long-term pooled municipal debt. The emerging investment architecture is intended to complement this strength by addressing functions that debt alone does not provide, including early-stage preparation, catalytic or risk-bearing capital, portfolio structuring and coordination across multiple actors. A stronger interface between Kommuninvest, Viable Cities and locally anchored climate investment structures is therefore being explored.',
        'Finally, aggregated demand and market shaping initiatives emerging in Sweden provide a complementary route to scale. Ongoing work with First Mover Cities brings cities and other actors across urban value chains together to articulate shared needs, engage suppliers early and advance coordinated procurement and purchasing. These approaches are also being explored in connection with System Demonstrators, where a working hypothesis is that demonstrators could generate evidence and help de-risk solutions for wider adoption. Earlier visibility of aggregated, credible demand could also help identify which solutions have potential for demonstration, financing and scale.',
      ],
      caseStudy: {
        title: 'EnergyNet: Illustrating the need for Local Climate Investment Structures in Sweden',
        paragraphs: [
          'EnergyNet illustrates how systemic implementation can generate interconnected investment needs across multiple actors and assets. Identified as a potential system gamechanger within CoAction Lund, EnergyNet proposes a decentralised local energy architecture connecting buildings, utilities, grids, storage and mobility. Scaling this approach would require investments involving multiple public and private owners, with different risks, revenue models and financing requirements. Some investments may access conventional finance, while others may require project preparation, guarantees or catalytic capital.',
          'EnergyNet is being explored as a practical use case for emerging Local Climate Investment Structures in Sweden. It can help test how investment opportunities within a wider transition portfolio might be prepared, coordinated and matched with appropriate sources of capital.',
        ],
      },
      enabledSummary:
        'Sweden is beginning to connect systemic implementation, investment preparation, finance and market demand rather than treating them as separate processes. The key opportunity is now to strengthen these interfaces while maintaining local ownership and ensuring that finance supports the wider transition portfolio rather than narrowing it to standalone bankable projects.',
    },
    {
      actionNumber: 5,
      actionThemeTitle: '• Capacities & Networks',
      title: 'Strengthen Capacities and Networks',
      paragraphs: [
        'Collective capacity building have been central to how the Swedish model has expanded. Rather than expecting every municipality to develop transition capabilities independently, Viable Cities creates recurring spaces for cities to learn from one another and jointly develop approaches to shared challenges. Transition Arenas (discussed in Action 1) provide spaces for exchange, learning and joint problem-solving, while Joint Commitments enable groups of cities to develop approaches around common priorities and progress from different levels of readiness.',
        'The Coordination Function helps carry this learning across the wider multilevel governance system. By analysing recurring municipal needs and experiences and facilitating dialogue between cities and national agencies, it can help turn learning from individual municipalities and initiatives into inputs for wider coordination and subsequent Climate City Contract cycles. In this way, learning can move both horizontally between cities and vertically between local and national levels, rather than remaining within individual projects or municipalities.',
        'Learning is also increasingly connected to implementation and scaling. Joint Commitments are structured around Initiate, Establish and Transform, allowing cities to move from building shared understanding and capacity toward institutionalizing and scaling new approaches. System Demonstrators similarly capture learning through implementation and use it to identify institutional, investment and market pathways for wider adoption.',
        'Sweden is also expanding international engagement to support implementation and scale. Viable Cities connects Swedish municipalities with European and international initiatives, creating opportunities to exchange expertise, develop common approaches and explore partnerships around climate investment. Emerging international collaborations on System Demonstrators aim to establish shared principles that can be adapted across countries, while connecting cities with technical expertise and potential implementation partners.',
        'Engagement with the World Economic Forum\'s First Mover Cities cohort and Cities Climate Finance Leadership Alliance provides other examples of expanding international networks around aggregated purchasing and climate financing.',
      ],
      enabledSummary:
        'Sweden has developed a learning architecture connecting peer exchange, intermediary coordination, implementation experience and international partnerships. The opportunity is to translate learning into transformative changes in institutional capacity, policy and finance, and to scale approaches across places.',
    },
  ],
};

export const defaultCountryJourneys: CountryJourneyData[] = [
  swedenJourneyDefaultData,
  {
    order: 2,
    countryId: 'brazil',
    countryName: 'Brazil',
    flag: '🇧🇷',
    status: 'Coming Soon',
    isReady: false,
    tagline: '',
    summary: '',
    keyMechanisms: [],
    cardImage: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=800&q=80',
    themeColor: '#5d8d8b',
    headerSubtitle: '• Brazil Overview',
    headerTitle: "Brazil's Journey to Multilevel Climate Implementation",
    headerDescription:
      'Subnational climate governance frameworks and climate finance implementation in Brazil.',
    tabATitle: 'The Brazilian Context',
    tabASubtitle: 'Federal-Subnational Articulation and Climate Finance Windows',
    premises: [],
    contextSections: [],
    tabBTitle: 'The Multilevel Model',
    tabBSubtitle: 'Governance Structure & Action Pathways',
    modelHeading: "Brazil's Multilevel Climate Architecture",
    modelOverview: 'Content coming soon...',
    actionsHeading: "Brazil's Implementation Pathways",
    actions: [],
  },
  {
    order: 3,
    countryId: 'morocco',
    countryName: 'Morocco',
    flag: '🇲🇦',
    status: 'Coming Soon',
    isReady: false,
    tagline: '',
    summary: '',
    keyMechanisms: [],
    cardImage: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=800&q=80',
    themeColor: '#F56E28',
    headerSubtitle: '• Morocco Overview',
    headerTitle: "Morocco's Journey to Multilevel Climate Implementation",
    headerDescription:
      'Territorial climate planning and climate adaptation finance across Moroccan territories.',
    tabATitle: 'The Moroccan Context',
    tabASubtitle: 'Territorial Decentralization & Adaptation Finance',
    premises: [],
    contextSections: [],
    tabBTitle: 'The Multilevel Model',
    tabBSubtitle: 'Governance Structure & Action Pathways',
    modelHeading: "Morocco's Multilevel Climate Architecture",
    modelOverview: 'Content coming soon...',
    actionsHeading: "Morocco's Implementation Pathways",
    actions: [],
  },
];
