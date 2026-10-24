import fs from 'fs';
import path from 'path';

const action3Revised = {
  "id": 3,
  "title": "Plan, Prepare and Implement Climate Investment Portfolios",
  "description": "This Action helps national governments work with cities and subnational governments to plan, prepare and implement urban climate investment portfolios. It covers climate budgeting, investment planning, portfolio development, project preparation and collaborative implementation environments. These approaches connect shared climate priorities with financing opportunities and coordinated implementation.",
  "systemsLogic": "Climate priorities need to become clear investment opportunities before finance can be mobilized. To this end, investment planning and budgeting identify investment needs, responsibilities and available resources. Portfolio development combines projects with the policy, governance and other interventions needed for delivery, while identifying investment opportunities that can form project pipelines. Project preparation helps suitable investments to become finance-ready, while collaborative implementation environments bring actors together to address systemic barriers, test solutions and advance interconnected interventions. These processes reinforce one another as portfolios evolve.",
  "pathways": [
    {
      "title": "3.1. Local Climate Budgeting and Investment Planning",
      "overview": "Local climate budgeting and investment planning help cities integrate climate priorities into public spending and investment decisions. Climate action plans do not always identify investment costs, financing responsibilities or links to government budgets, making implementation difficult. Climate budgeting helps to integrate local climate targets into municipal and subnational budget planning, allocations, implementation and expenditure monitoring. It can be informed by multiyear financial and capital investment planning, which identifies future investment needs, costs and available resources. National governments can enable these processes by working with subnational governments to develop common green budget taxonomies, supportive public-finance regulations and reporting standards, alongside technical assistance.",
      "potentialNationalLead": [
        "Finance Ministry",
        "Urban / Local Government Ministry",
        "Planning Ministry"
      ],
      "keyActors": [
        "Municipal / Subnational Finance Department",
        "Municipal / Subnational Planning Department",
        "National Development Banks",
        "Technical Assistance Providers",
        "City Networks"
      ],
      "transferability": [
        "Considering flexibility in local budgeting systems: Where municipalities can modify budget classifications and reporting practices, climate budgeting may be easier to introduce. Where national regulations govern budgeting processes, local climate budget adoption may depend on changes or guidance from national authorities.",
        "Starting with simpler approaches and expanding over time: Countries where cities have limited technical capacity or climate data can begin with expenditure tagging and basic investment-cost estimates. More comprehensive climate budgeting and multiyear capital investment planning can follow as capacities improve."
      ],
      "order": 1,
      "implementationGuidance": [
        {
          "title": "Establish common climate budgeting guidance and standards",
          "content": "Work with subnational governments to develop and adopt taxonomies, budgeting methodologies and reporting standards that can be integrated into existing municipal budget systems."
        },
        {
          "title": "Align public-finance regulations with local climate budgeting",
          "content": "Review national accounting standards, budget formats and fiscal regulations to support the integration of climate priorities into local budgets and capital investment plans."
        },
        {
          "title": "Support climate-informed financial and investment planning",
          "content": "Provide guidance and technical assistance to help cities estimate climate investment costs, assess available resources and funding gaps, and prioritise investments within multiyear financial and capital investment plans. Identify where national funding, fiscal transfers or additional financing may be required."
        },
        {
          "title": "Strengthen municipal capacities",
          "content": "Support municipal finance, planning and climate departments through training, technical assistance and peer learning. Encourage coordination across departments throughout the budget cycle."
        },
        {
          "title": "Support monitoring and improvement",
          "content": "Encourage consistent reporting on climate-related budget allocations, expenditure and results. Use findings to improve national guidance and municipal budgeting practices over time."
        }
      ],
      "illustrativeExamples": [
        {
          "title": "India – CapaCITIES Programme",
          "type": "Peer Learning Example",
          "excerpt": "India illustrates how national government institutions and development partners can support local climate investment planning and budgeting through the CapaCITIES Programme.",
          "fullText": "India illustrates how national government institutions and development partners can support local climate investment planning and budgeting. Launched in 2016 with Swiss funding, CapaCITIES supported cities in developing Net-Zero Climate Resilient City Action Plans, identifying priority investments and strengthening municipal capacities. The National Institute of Urban Affairs (NIUA), an autonomous institution under the Ministry of Housing and Urban Affairs, partnered with the programme to ensure alignment of methodologies with national standards, facilitate engagement with municipal governments, adapt program tools for national use and connect project learnings with national policies and programmes. Across participating cities, the plans identified INR 7,142 billion (~USD 73 billion) in climate investment needs. A notable example is of Tirunelveli city’s Net Zero Climate-Resilient Cities Action Plan, supported by NIUA, under CapaCITIES, which identifies priority investments, indicative costs, potential financing sources and implementation responsibilities.",
          "connectionLine": "Why see this: See how national institutions can support local climate investment planning through coordination support, knowledge management and links to national programmes.",
          "order": 1
        },
        {
          "title": "Philippines – Local Climate Change Expenditure Tagging",
          "type": "Peer Learning Example",
          "excerpt": "The Philippines illustrates how national governments can institutionalise local climate budgeting and strengthen investment planning through common regulations, methodologies and technical support.",
          "fullText": "The Philippines illustrates how national governments can institutionalise local climate budgeting and strengthen investment planning through common regulations, methodologies and technical support. In 2015, the Climate Change Commission (CCC), Department of Budget and Management (DBM), and Department of the Interior and Local Government (DILG) issued joint guidelines for tagging climate-related expenditure in local Annual Investment Programs (AIPs), which identify planned local projects, activities, costs and funding sources for annual budgeting. The guidelines introduced common climate expenditure classifications, revised investment programme forms and reporting procedures. To support their adoption, the DBM incorporates tagging into local budget guidance, the CCC guides local governments in classifying climate-related expenditure and reviews the accuracy of these classifications, while the DILG facilitates implementation across local governments. Using these guidelines, provinces, cities and municipalities identify climate-related allocations and funding sources through their AIPs and prepare investment briefs to support prioritisation, expenditure monitoring and identification of financing needs.",
          "connectionLine": "Why see this: See how national regulations, common methodologies and technical support can connect local climate budgeting with investment planning and reporting.",
          "order": 2
        },
        {
          "title": "Sweden – Stockholm's Climate Budgeting and Investment Planning",
          "type": "Peer Learning Example",
          "excerpt": "Stockholm illustrates how cities can connect climate goals with municipal budgets and investment planning, with support from national agencies and programs.",
          "fullText": "Stockholm illustrates how cities can connect climate goals with municipal budgets and investment planning, with support from national agencies and programs. Its climate targets and implementation assignments are incorporated into the city's annual financial budget and monitored through its management system. Municipal departments and companies can also access a dedicated climate investment fund to support priority measures. As part of its Climate City Contract under the EU Cities Mission, Stockholm prepared a 2030 Climate Neutrality Investment Plan outlining how the city's transition could be financed, including investment responsibilities beyond the municipality. This planning takes place within Sweden's broader Climate City Contract process, coordinated through Viable Cities in partnership with national government agencies. The process provides a framework for national–local collaboration on climate priorities, investment needs and financing arrangements.",
          "connectionLine": "Why see this: See how national–local coordination can support municipal climate action and investment planning.",
          "order": 3
        },
        {
          "title": "C40 Climate Budgeting Framework (CBF)",
          "type": "Tool",
          "excerpt": "The framework helps cities establish credible climate budgeting processes that connect climate targets with annual or multiyear budget decisions.",
          "fullText": "The framework helps cities establish credible climate budgeting processes that connect climate targets with annual or multiyear budget decisions. It covers operating and capital budgets, emphasises leadership by municipal finance departments and coordination across departments, and integrates implementation responsibilities, monitoring and learning into regular budget cycles. C40's accompanying guidance also highlights how cities can use climate budgets to engage national governments on financing priority climate investments. National governments can further support adoption through compatible public-finance regulations, common budgeting guidance and technical assistance.",
          "connectionLine": "Why use this tool: Help cities integrate climate priorities into regular budgeting processes and identify opportunities for national support, including financing and enabling regulations.",
          "order": 4
        }
      ],
      "resources": [
        {
          "title": "Climate Budgeting Programme",
          "type": "Research Tool",
          "publisher": "C40",
          "link": "https://www.c40.org/what-we-do/raising-climate-ambition/climate-budgeting-programme/",
          "description": "",
          "order": 1
        },
        {
          "title": "State of Cities Climate Finance 2024 Report",
          "type": "Report",
          "publisher": "CCFLA",
          "link": "https://citiesclimatefinance.org/publications/2024-state-of-cities-climate-finance",
          "description": "Authoritative benchmark tracking global urban climate finance flows against the USD 4.3T annual target.",
          "order": 1
        },
        {
          "title": "City Climate Investment Planning Guide",
          "type": "Guide",
          "publisher": "EIB & GCoM",
          "link": "https://www.eib.org/",
          "description": "Step-by-step roadmap for translating municipal climate targets into bankable investment plans and capital budgets.",
          "order": 2
        },
        {
          "title": "NDC Investment Planning Guide and Checklist",
          "type": "Guide",
          "publisher": "NDC",
          "link": "https://ndcpartnership.org/knowledge-portal/climate-toolbox/ndc-investment-planning-guide-and-checklist",
          "description": "",
          "order": 4
        }
      ]
    },
    {
      "title": "3.2. Climate Portfolios and Project Pipelines",
      "overview": "Climate portfolios and pipelines bring together different types of projects and interventions around shared climate priorities. These may include infrastructure investments, policy and regulatory reforms, governance improvements, capacity building and other measures needed for implementation. By combining these interventions within a portfolio, governments can address systemic barriers that individual projects cannot resolve alone. As portfolios develop, suitable projects can be integrated into investment pipelines for further preparation and financing. National governments can support this process by coordinating national and subnational investment priorities, facilitating access to project preparation support and identifying opportunities to aggregate similar municipal projects into larger investment pipelines. This can improve investment readiness and help attract financing for projects that may be difficult to finance individually.",
      "potentialNationalLead": [
        "Planning Ministry",
        "Climate / Environment Ministry",
        "Urban / Local Government Ministry",
        "National Development Bank"
      ],
      "keyActors": [
        "Finance Ministry",
        "Relevant Sectoral Ministries",
        "Municipal / Subnational Planning Department",
        "Municipal / Subnational Finance Department",
        "National Infrastructure / Investment Agency",
        "MDB / DFI",
        "Technical Assistance Providers",
        "City Networks"
      ],
      "transferability": [
        "Adapting to institutional context: Portfolio development may be led by national agencies, regional authorities or cities, depending on their mandates and capacities.",
        "Accounting for differences in local capacity: Cities with limited technical expertise and capacities may need additional support to identify projects, assess investment needs and develop coordinated portfolios.",
        "Considering the maturity of investment opportunities: Some countries may already have investable municipal project pipelines, while others may need to identify investment opportunities. The level of technical assistance needed will vary accordingly.",
        "Assessing opportunities for project aggregation: Project aggregation may be relevant where municipalities have similar investment needs, but individual projects are too small to attract financing."
      ],
      "order": 2,
      "implementationGuidance": [
        {
          "title": "Support the development of coordinated portfolios",
          "content": "Convene relevant national and subnational institutions to identify complementary projects and interventions around shared climate priorities. These may include infrastructure, policy, regulatory and capacity-building measures, with clear responsibilities and sequencing."
        },
        {
          "title": "Identify emerging project pipelines",
          "content": "Assess which projects within portfolios have potential for financing and further preparation. Consider their climate impact, investment requirements and current readiness."
        },
        {
          "title": "Identify opportunities for project aggregation",
          "content": "Where cities have similar investment needs, explore coordinated project pipelines or common investment programmes to achieve scale and improve access to finance."
        },
        {
          "title": "Match projects with financing pathways",
          "content": "Identify projects requiring additional development finance or borrowing or having potential for private investment. Flag projects requiring further risk reduction."
        },
        {
          "title": "Connect pipelines with financiers",
          "content": "Present prepared projects and portfolios to relevant national banks, MDBs, climate funds and private investors."
        },
        {
          "title": "Establish arrangements for portfolio coordination",
          "content": "Assign responsibility for maintaining portfolios, coordinating institutions and tracking progress across projects and other interventions."
        }
      ],
      "illustrativeExamples": [
        {
          "title": "European Union – Mission for Climate-Neutral and Smart Cities",
          "type": "Peer Learning Example",
          "excerpt": "The EU Cities Mission illustrates how a supranational programme can support cities in developing coordinated climate transition portfolios.",
          "fullText": "The EU Cities Mission illustrates how a supranational programme can support cities in developing coordinated climate transition portfolios. Through NetZeroCities, 112 selected Mission Cities receive technical guidance, advisory support and peer learning to develop Climate City Contracts. These include Climate Neutrality Action Plans that bring together infrastructure, policy, governance and other interventions into coordinated portfolios. Cities also develop complementary Climate Neutrality Investment Plans that assess the capital needed to deliver these portfolios and identify potential public and private financing sources. The portfolio approach helps cities to move beyond individual projects and organise interventions around a shared climate mission, while involving local, regional and national stakeholders.",
          "connectionLine": "Why see this: See how a common framework, technical assistance and multilevel collaboration can support cities in developing integrated climate investment portfolios.",
          "order": 1
        },
        {
          "title": "EBRD Green Cities – Green City Action Plans",
          "type": "Peer Learning Example",
          "excerpt": "EBRD Green Cities illustrates how multilateral development banks and national institutions can support cities in developing integrated portfolios of climate projects and policy interventions.",
          "fullText": "EBRD Green Cities illustrates how multilateral development banks and national institutions can support cities in developing integrated portfolios of climate projects and policy interventions. Through Green City Action Plans (GCAPs), participating cities assess environmental challenges, identify priorities and develop pipelines of infrastructure investments, along with policy reforms and institutional measures. The plans identify expected benefits, indicative costs, financing options and implementation responsibilities. EBRD supports the process through technical assistance, policy dialogue and infrastructure financing.\n\nIn Egypt, the Green City Action Plan for 6th of October City was developed with the involvement of the New Urban Communities Authority (NUCA), a national government authority, and the city administration. Together, they engaged stakeholders to identify environmental priorities and develop a coordinated portfolio.",
          "connectionLine": "Why see this: See how development banks and national urban institutions can support city-level portfolio development, combining infrastructure investments with policy and institutional measures.",
          "order": 2
        },
        {
          "title": "Brazil – Green and Resilient Cities Programme (PCVR) Project Bank",
          "type": "Peer Learning Example",
          "excerpt": "Brazil illustrates how a national programme can identify and coordinate urban climate investment pipelines through the PCVR Project Bank.",
          "fullText": "Brazil illustrates how a national programme can identify and coordinate urban climate investment pipelines. Developed through a partnership involving the Ministry of the Environment and Climate Change, CCFLA and the University of Brasília, the PCVR Project Bank consolidates information on climate-related projects submitted by municipalities, states and public enterprises. The Bank has received 733 project submissions, including 487 submitted by municipal governments. The projects that reported estimated costs together require approximately BRL 14.1 billion (USD 2.6 billion) in financing. By mapping projects across sectors and stages of development, the Bank provides an overview of local investment needs and opportunities for project preparation. This can help development banks, technical assistance providers and financing partners identify opportunities to support municipal investment pipelines in Brazil.",
          "connectionLine": "Why see this: See how national programmes can consolidate municipal climate project proposals and identify investment needs.",
          "order": 3
        }
      ],
      "resources": [
        {
          "title": "Climate Action Planning Framework & Resource Center",
          "type": "Website",
          "publisher": "C40 Cities",
          "link": "https://www.c40.org/",
          "description": "Tools and project preparation facilities for developing bundled, cross-sector municipal project portfolios.",
          "order": 1
        },
        {
          "title": "Portfolio Development & Management",
          "type": "Report",
          "publisher": "UNDP",
          "link": "https://innovation.eurasia.undp.org/portfolio-development/",
          "description": "",
          "order": 2
        },
        {
          "title": "Under Pressure, Overdue: The Portfolio Approach and Financing Cities for Resilience",
          "type": "Report",
          "publisher": "Resilient Cities Network",
          "link": "https://resilientcitiesnetwork.org/under-pressure-overdue-the-portfolio-approach-and-financing-cities-for-resilience/",
          "description": "",
          "order": 3
        }
      ]
    },
    {
      "title": "3.3. Project Preparation",
      "overview": "Project preparation is the process of developing climate investment concepts into bankable projects that can secure financing from public or private sources. It can help to develop a pipeline of bankable projects from investment opportunities in project portfolios. Project preparation typically involves four stages: concept development, pre-feasibility, feasibility, and financial structuring and transactions. These stages help assess technical, financial, environmental, social and regulatory risks, and develop projects that meet financiers' requirements. However, cities often lack the technical expertise, institutional capacity and upfront resources needed for thorough project preparation. National governments can address these barriers by establishing or strengthening project preparation facilities (PPFs), facilitating project aggregation, and connecting municipal project pipelines with multilateral or national development banks and other financing partners.",
      "potentialNationalLead": [
        "National Development Bank",
        "Climate / Environment Ministry",
        "Urban / Local Government Ministry",
        "Planning Ministry"
      ],
      "keyActors": [
        "Finance Ministry",
        "Relevant Sectoral Ministries",
        "Municipal / Subnational Planning Department",
        "Municipal / Subnational Finance Department",
        "National Infrastructure / Investment Agency",
        "MDB / DFI",
        "Technical Assistance Providers",
        "City Networks"
      ],
      "transferability": [
        "Adapting to existing institutional arrangements: Project preparation support can be provided through national development banks, national PPFs or government agencies. The appropriate model depends on institutional mandates, technical capacities and available resources.",
        "Considering differences in municipal capacity to develop projects: Cities with limited technical and financial expertise may require more intensive support from early concept development. More capable municipalities may only need specialised assistance for feasibility studies, financial structuring or transactions.",
        "Ensuring sustained funding for project preparation: Preparation can be costly and may not lead to financing for every project. National programmes may consider dedicated grants, revolving preparation funds or development-partner support to cover preparation costs."
      ],
      "order": 3,
      "conceptBoxes": [
        {
          "title": "What are Project Preparation Facilities?",
          "category": "Core Concept",
          "section": "Overview",
          "excerpt": "Project Preparation Facilities (PPFs) are organizations, initiatives, or institutions that support cities in developing bankable, investment-ready projects, typically from a project’s concept, design, or scoping stage up to the financial close.",
          "fullText": "Project Preparation Facilities (PPFs) are organizations, initiatives, or institutions that support cities in developing bankable, investment-ready projects, typically from a project’s concept, design, or scoping stage up to the financial close. A PPF may provide technical and/or financial support. PPFs can provide a wide range of support depending on a project’s stage and sector. The overarching goal of PPFs is preparing bankable, or investment-ready, projects. A project is bankable, whether from public or private sources, when its risk-return profile meets investors’ criteria. Key criteria include the probability of success, sufficient estimated cash flows to cover costs and produce returns that meet investor expectations, and whether the project will be implemented by a creditworthy entity.",
          "order": 1
        }
      ],
      "implementationGuidance": [
        {
          "title": "Strengthen subnational access to project preparation support",
          "content": "Establish or strengthen national project preparation facilities (PPFs) or connect municipal pipelines with existing national and international PPFs. Provide funding and technical assistance where needed."
        },
        {
          "title": "Engage financing partners early",
          "content": "Involve national development banks, MDBs, climate funds and other potential financiers to understand their investment requirements. Use their inputs to guide urban and subnational project preparation."
        },
        {
          "title": "Coordinate preparation support across cities",
          "content": "Identify similar project preparation needs across municipalities. Explore shared technical assistance, standardised approaches or pooled preparation resources to reduce preparation costs and improve efficiency."
        },
        {
          "title": "Track project preparation outcomes",
          "content": "Monitor progress from concept development through feasibility and financial structuring. Address delays and connect sufficiently prepared projects with national and international financing opportunities."
        }
      ],
      "illustrativeExamples": [
        {
          "title": "South Africa – DBSA Municipal Project Preparation",
          "type": "Peer Learning Example",
          "excerpt": "South Africa illustrates how a national development bank can provide dedicated project preparation support to municipalities.",
          "fullText": "South Africa illustrates how a national development bank can provide dedicated project preparation support to municipalities. The Development Bank of Southern Africa (DBSA) manages ZAR 50 million (~USD 3 million) in project preparation funding through the national Infrastructure Fund for six municipalities, including Vhembe, Ugu and Sol Plaatje. The programme supports water, sanitation and electricity infrastructure projects through technical, financial, economic, environmental and socioeconomic feasibility studies. DBSA also helps municipalities assess implementation models, structure project financing and explore blended finance and private-sector participation. The programme aims to develop bankable municipal infrastructure projects and attract public and private investment.",
          "connectionLine": "Why see this: See how a national development bank can pool project preparation resources and expertise to help municipalities develop bankable infrastructure projects.",
          "order": 1
        },
        {
          "title": "Indonesia – Project Development Facility (PDF), Regional Infrastructure Development Fund",
          "type": "Peer Learning Example",
          "excerpt": "Indonesia illustrates how a national development finance institution can support subnational governments in preparing infrastructure projects for investment.",
          "fullText": "Indonesia illustrates how a national development finance institution can support subnational governments in preparing infrastructure projects for investment. PT Sarana Multi Infrastruktur (PT SMI), a state-owned institution under the Ministry of Finance, implemented the Regional Infrastructure Development Fund (RIDF), supported by the World Bank and Asian Infrastructure Investment Bank. Alongside infrastructure lending, RIDF established a Project Development Facility to help subnational governments to identify and prepare projects through feasibility studies, detailed engineering designs, environmental and social assessments, and procurement support. The facility was supported by a USD 3 million grant for technical assistance, complementing the fund's infrastructure lending. This helped address municipal project preparation gaps and connect local infrastructure proposals with financing opportunities.",
          "connectionLine": "Why see this: See how national development finance institutions can combine dedicated project preparation support with infrastructure lending to strengthen subnational investment pipelines.",
          "order": 2
        },
        {
          "title": "CCFLA – Project Preparation Resource Directory",
          "type": "Tool",
          "excerpt": "The Directory helps subnational governments and stakeholders identify project preparation facilities that can support them in developing green and resilient infrastructure.",
          "fullText": "The Directory helps subnational governments and stakeholders identify project preparation facilities that can support them in developing green and resilient infrastructure, including implementing more efficient heating and cooling systems, building renewable energy, setting up sustainable transit, or climate-proofing resilient infrastructure. Users can filter information by region, country, sector, project stage etc. to find the right PPFs for their project needs.",
          "connectionLine": "Why use this tool: Identify suitable PPFs that can provide technical and financial support for preparing urban climate projects.",
          "order": 3
        },
        {
          "title": "NDC Partnership - Project Preparation Support Database",
          "type": "Tool",
          "excerpt": "A searchable database of international, regional, national, and sub-national Project Preparation Facilities (PPFs) focused on supporting the preparation of climate-aligned projects.",
          "fullText": "It is a searchable database of international, regional, national, and sub-national Project Preparation Facilities (PPFs) focused on supporting the preparation of climate-aligned projects, as well as incubators and accelerators focused on supporting climate-aligned businesses.",
          "connectionLine": "Why use this tool: Find project preparation facilities and support programmes that match climate investment priorities and project development needs.",
          "order": 4
        },
        {
          "title": "ICLEI and Gap Fund - Capacity Development Toolkit for Early-Stage Project Preparation",
          "type": "Tool",
          "excerpt": "The toolkit provides 12 practical tools and templates developed through the Gap Fund Step-Up Project with cities in Africa and South America.",
          "fullText": "The toolkit provides 12 practical tools and templates developed through the Gap Fund Step-Up Project with cities in Africa and South America. It helps city officials and technical partners to assess technical capacity and data gaps, map stakeholders and risks, develop basic financial models and evaluate financing options. Each tool includes practical guidance and adaptable templates to strengthen early-stage project preparation.",
          "connectionLine": "Why use this tool: Strengthen municipal capacities to assess project feasibility, address preparation gaps and improve investment readiness.",
          "order": 5
        },
        {
          "title": "Urban-Act - Early-Stage City Climate Project Bankability Diagnostic Tool",
          "type": "Tool",
          "excerpt": "The tool is designed to support cities during the early stages of project preparation, from concept to pre-feasibility by applying a project finance lens to improve project viability and financeability.",
          "fullText": "The tool is designed to support cities during the early stages of project preparation, from concept to pre-feasibility by applying a project finance lens to improve project viability and financeability. It offers tailored checklists across six thematic investment areas to identify bankability gaps and finance-readiness issues, along with practical sector-specific recommendations to strengthen project design, financial viability, and access to climate finance.",
          "connectionLine": "Why use this tool: Identify bankability gaps in early-stage climate projects and determine the technical and financial preparation needed to address them.",
          "order": 6
        },
        {
          "title": "SOURCE – Sustainable Infrastructure Project Preparation Platform",
          "type": "Tool",
          "excerpt": "SOURCE is a digital project preparation and management platform providing standardised templates to define, prepare and manage sustainable infrastructure.",
          "fullText": "SOURCE is a digital project preparation and management platform developed through a multilateral development bank initiative and coordinated by the Sustainable Infrastructure Foundation. It provides standardised, sector-specific templates to help governments define, prepare and manage sustainable infrastructure projects throughout their lifecycle. Its features include project monitoring, document management, preparation guidance and tools for connecting projects with preparation facilities and potential financiers. SOURCE is used in more than 50 countries.",
          "connectionLine": "Why use this tool: Standardise infrastructure project preparation across government institutions and improve project quality, transparency and investment readiness.",
          "order": 7
        }
      ],
      "resources": [
        {
          "title": "GAP Fund: Unlocking Early-Stage Urban Climate Project Preparation",
          "type": "Guide",
          "publisher": "World Bank & EIB",
          "link": "https://www.cityclimategapfund.org/",
          "description": "Technical assistance and financial advisory for early-stage project origination and pipeline structuring.",
          "order": 1
        },
        {
          "title": "A Capacity Development Toolkit for Early-Stage Project Preparation",
          "type": "Guide",
          "publisher": "ICLEI",
          "link": "https://iclei.org/",
          "description": "",
          "order": 2
        }
      ]
    },
    {
      "title": "3.4. Portfolio Implementation Environments",
      "overview": "Portfolio implementation environments are place-based settings where public, private and civic actors can deliver, test and adapt interconnected climate interventions. Building on portfolio development, these environments can enable the implementation of different interventions across infrastructure, regulation, finance, procurement, technology and behaviour. They can address implementation barriers, test new solutions and business models, and generate evidence on what works under real-world conditions. This can reduce investment risks, improve delivery approaches and create opportunities to scale successful interventions. National governments can support these environments through implementation funding, technical assistance, regulatory flexibility and links to national investment programmes and financing partners.",
      "potentialNationalLead": [
        "Climate Ministry",
        "Urban / Local Government Ministry",
        "Relevant Sector Ministries",
        "National Innovation / Research Agency"
      ],
      "keyActors": [
        "City / Subnational Government",
        "Municipal Planning Department",
        "National Development Bank",
        "National Regulator",
        "Utilities",
        "Infrastructure Agencies",
        "MDB / DFI",
        "Technical Assistance Provider",
        "Commercial Lender",
        "Private Sector / Solution Providers",
        "Academia / Research Institutions",
        "Civil Society / Community Organisations",
        "City Network"
      ],
      "transferability": [
        "Adapting institutional arrangements while retaining core functions: Implementation environments should retain a shared mission, place-based focus, coordinated portfolio, feedback loops and learning processes. The institutions responsible for these functions can vary according to governance arrangements.",
        "Ensuring local ownership and institutional capacity: Local actors need sufficient authority, relationships and capacity to lead implementation. Where these are limited, national institutions or external partners may provide additional support.",
        "Considering funding and partnership arrangements: Funding models may combine grants, funded consortium roles, in-kind contributions and voluntary commitments. The appropriate mix depends on fiscal contexts, partner responsibilities and the resources needed for implementation.",
        "Adapting to different levels of implementation readiness: Less mature environments may require initial investment in institutional capacity, stakeholder engagement and portfolio development."
      ],
      "order": 4,
      "implementationGuidance": [
        {
          "title": "Support locally led implementation environments",
          "content": "Enable cities and local partners to define implementation challenges, intended outcomes and suitable testbeds. Build on existing institutions and provide support for implementing interconnected interventions across infrastructure, regulation, finance, procurement and technology."
        },
        {
          "title": "Engage actors responsible for implementation",
          "content": "Bring together relevant government agencies, utilities, businesses, financiers, communities and other implementation partners. Clarify their roles, contributions and responsibilities for delivering different interventions within the portfolio."
        },
        {
          "title": "Provide flexible implementation support",
          "content": "Connect local implementation environments with national funding programmes, grants, technical assistance and other resources. Allow flexibility to adapt activities and resource allocations as implementation progresses."
        },
        {
          "title": "Strengthen implementation management and orchestration",
          "content": "Support dedicated teams or intermediaries to manage implementation, resolve operational and institutional barriers, and maintain progress across interconnected interventions."
        },
        {
          "title": "Generate evidence to inform decisions",
          "content": "Support real-world testing and monitoring of costs, performance, business models and financing requirements. Use the findings to improve implementation approaches and inform future investment decisions."
        },
        {
          "title": "Support financing and wider adoption",
          "content": "Connect relevant interventions with project preparation facilities, financing partners, procurement programmes and national initiatives. Use implementation experience to support replication or expansion across other cities where appropriate."
        }
      ],
      "illustrativeExamples": [
        {
          "title": "System Demonstrators",
          "type": "Peer Learning Example",
          "excerpt": "System Demonstrators provide place-based environments where public, private and civic actors implement, test and adapt interconnected climate interventions around a shared mission.",
          "fullText": "System Demonstrators provide place-based environments where public, private and civic actors implement, test and adapt interconnected climate interventions. Rather than delivering isolated projects, they bring together infrastructure, regulation, finance, procurement, technology and behavioural interventions around a shared mission. Continuous implementation, monitoring and learning help identify barriers, test solutions and develop pathways for wider investment and scale. National governments and development partners can support these environments through funding, technical assistance, regulatory support and connections to wider investment programmes.",
          "connectionLine": "Why see this: See how nationally supported, place-based implementation environments can test interconnected climate interventions, overcome delivery barriers and create opportunities for investment and scale.",
          "order": 1,
          "subExamples": [
            {
              "title": "CoAction Lund",
              "excerpt": "CoAction Lund shows how a city-led system demonstrator can orchestrate a complex implementation ecosystem around a shared mission of climate neutrality by 2030.",
              "fullText": "CoAction Lund shows how a city-led system demonstrator can orchestrate a complex implementation ecosystem around a shared mission of climate neutrality by 2030. In Brunnshög, the municipality brought together infrastructure providers, employers, property owners, universities and solution providers to deliver more than 40 coordinated activities across mobility and energy, with funding kept flexible so that resources can shift toward the most promising models as learning emerges. One major “game changer” is EnergyNet, a decentralised local electricity network that enables buildings, vehicles and local energy resources to share renewable electricity.  By testing EnergyNet on ground, CoAction Lund has surfaced regulatory and market barriers around grid codes, data-sharing and local markets, helping inform the adjustments needed for scale and mainstream distributed energy systems in cities facing increasing electrification demands and grid constraints. Finally, a shared evaluation plan, based on agreed indicators, tracks both activities and system‑level outcomes, feeding into regular reflection and learning cycles. EnergyNet’s wider deployment is being explored through emerging local investment approaches."
            },
            {
              "title": "Bristol Thriving Places",
              "excerpt": "Bristol Thriving Places demonstrates how a system demonstrator can overcome a regulatory bottleneck into to implement infrastructure and scale through multilevel collaboration.",
              "fullText": "Bristol Thriving Places demonstrates how a system demonstrator can overcome a regulatory bottleneck into to implement infrastructure and scale through multilevel collaboration, including with the national government. In Bristol, the challenge was affordable, zero-carbon housing on small brownfield sites that conventional development treated as unviable; the city, working through Bristol City Council and the Bristol Housing Festival, convened a consortium led by social housing developer EDAROTH, together with housing associations, regeneration developer Igloo, energy, and digital infrastructure providers, government agencies, a private ‘gov-tech’ firm and research partners to deliver a portfolio of net-zero social homes, a multi-capital value toolkit, a policy and regulation discovery stream and a digital twin. The demonstrator’s key move was site aggregation: by treating many small council-owned sites as one programme, Bristol created the scale needed for delivery, prompted the council to review its treasury strategy to enable programme-level appraisal, and secured a development agreement of around £10 million through an existing national procurement framework. The model informed the UK government’s Small Sites Aggregator, a national programme launched by the Ministry of Housing, Communities and Local Government with private and public partners and an ambition of enabling 10,000 social rent homes a year."
            },
            {
              "title": "Green Routes, Bogotá",
              "excerpt": "Green Routes, Bogotá demonstrates how a system demonstrator can build a collaborative implementation environment around a shared evidence base.",
              "fullText": "Green Routes, Bogotá demonstrates how a system demonstrator can build a collaborative implementation environment around a shared evidence base. In Bogotá, the challenge was to coordinate thousands of freight operators in a citywide logistics system, so the demonstrator brought freight operators, shippers and public agencies together through the Urban Logistics Network, led by the city’s Secretariat of Mobility and working with the Secretariat of Environment. As part of the implementation, Green Routes, a consortium of four technology companies, developed a real-time routing platform, which is part of an interconnected portfolio or related actions, including emissions labelling, circulation rules, loading and unloading investments, sustainable driving guidelines and a proposed district freight fund. The platform’s key contribution is the negotiated data-sharing arrangement, which would give the city the evidence it needs to plan freight more effectively, while also helping operators optimise routes and costs. The next steps for this systems demonstrator are to develop business models and sustainable revenue streams."
            },
            {
              "title": "Stockholm’s STOLT system demonstrator",
              "excerpt": "Stockholm’s STOLT system demonstrator is advancing the city’s ambition for an emission-free inner city by 2030 through transport-system transformation.",
              "fullText": "Stockholm’s STOLT system demonstrator is advancing the city’s ambition for an emission-free inner city by 2030 by using the introduction of a Class 3 Environmental Zone and the Urban Environment Zone in Gamla Stan as strategic windows of opportunity for wider transport-system transformation. Rather than testing a single solution, STOLT coordinates a broad ecosystem of city departments, businesses, research and innovation actors, infrastructure stakeholders and civil society around a portfolio that includes stakeholder dialogue, fossil-free transport procurement, electrified construction, off-peak logistics and emerging concepts such as co-loading hubs. This coordination is particularly significant in Stockholm’s complex institutional setting – the demonstrator has succeeded in working across municipal departments and external stakeholders through recurring coordination, shared portfolio oversight and continuous adaptation. The result is not only a set of demonstrations, but an implementation environment that helps maintain a common direction, surface regulatory and operational bottlenecks, and connect learning across activities so that successful approaches can be institutionalized and replicated beyond the original testbeds."
            },
            {
              "title": "Makindye Ssabagabo’s Green Community Cities demonstrator",
              "excerpt": "Makindye Ssabagabo’s Green Community Cities demonstrator brings together municipal, UN-Habitat, Viable Cities and international partners to address affordable housing.",
              "fullText": "Makindye Ssabagabo’s Green Community Cities demonstrator brings together the municipality, UN-Habitat, Viable Cities and an international consortium working across urban planning, low-carbon construction, recycled building materials, organic-waste processing, water systems and finance to address affordable housing as a wider urban system. The model combined modular and incremental housing, circular-economy enterprises, renewable energy, water-saving technologies, skills development and local employment, supported through a proposed blend of grants, concessional capital, private investment, microfinance and cross-subsidisation between market-rate and affordable housing.  Experience from the Climate Smart Cities Challenge also surfaced an important implementation challenge – internationally assembled solution teams were more effective where they were strongly anchored in local actors and institutions, and that weaker local collaboration and national-local connections made implementation and scaling more difficult in cases such as Makindye than in more institutionally mature settings. The example therefore shows both the value of bringing diverse capabilities into a shared implementation portfolio and the importance of ensuring that orchestration is rooted in institutions with sufficient local mandate, relationships and capacity."
            },
            {
              "title": "System Demonstrators Grant Calls",
              "excerpt": "Sweden's Viable Cities programme has established grant calls to support the design and implementation of System Demonstrators.",
              "fullText": "Sweden's Viable Cities programme has established grant calls to support the design and implementation of System Demonstrators. These follow a phased approach, with an initial design stage supporting cities and consortia to develop their proposed interventions, followed by implementation funding for proposals meeting the relevant requirements. Building on this Swedish experience, the Viability Fund for Cities is exploring internationally coordinated grant calls, including common principles, eligibility criteria and funding arrangements across regions."
            }
          ]
        },
        {
          "title": "India – City Investments to Innovate, Integrate and Sustain (CITIIS 2.0)",
          "type": "Peer Learning Example",
          "excerpt": "India illustrates how a national programme can support municipal climate project implementation through financing, technical assistance and institutional oversight via CITIIS 2.0.",
          "fullText": "India illustrates how a national programme can support municipal climate project implementation through financing, technical assistance and institutional oversight. Led by the Ministry of Housing and Urban Affairs in partnership with NIUA, AFD, KfW and the European Union, CITIIS 2.0 supports up to 18 competitively selected city projects focused on circular economy and integrated waste management. A national Project Management Unit at NIUA coordinates programme delivery, monitoring and technical support. Selected cities receive assistance from domestic experts and international mentors on project management, environmental and social safeguards, and implementation challenges. The programme also supports state-level climate action and national institutional strengthening, helping connect municipal project delivery with wider government priorities.",
          "connectionLine": "Why see this: See how national governments can combine financing, technical assistance and institutional oversight to support the implementation of municipal climate projects.",
          "order": 2
        }
      ],
      "resources": [
        {
          "title": "System Demonstrators for Urban Transformations",
          "type": "Report",
          "publisher": "Viable Cities",
          "link": "https://viablecities.se/",
          "description": "",
          "order": 1
        },
        {
          "title": "A Guide to Collaborative Multi-level Governance for Climate Resilient Development",
          "type": "Guide",
          "publisher": "WRI",
          "link": "https://www.wri.org/",
          "description": "",
          "order": 2
        }
      ]
    }
  ]
};

const filePath = path.resolve('./src/data/actionsDataList.ts');
const content = fs.readFileSync(filePath, 'utf-8');

const regex3 = /\{\s*\"id\":\s*3,[\s\S]*?\n\s*\{\s*\"id\":\s*4,/;
const match = content.match(regex3);

if (!match) {
  console.error("Could not find Action 3 block ending at Action 4 in actionsDataList.ts");
  process.exit(1);
}

const action3Formatted = JSON.stringify(action3Revised, null, 2);
const indentedAction3 = action3Formatted.split('\n').map(l => '  ' + l).join('\n');

const replaced = content.replace(regex3, `${indentedAction3},\n  {\n    "id": 4,`);
fs.writeFileSync(filePath, replaced, 'utf-8');
console.log("Successfully updated Action 3 in actionsDataList.ts!");
