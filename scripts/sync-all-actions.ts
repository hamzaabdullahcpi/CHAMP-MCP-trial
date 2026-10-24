import dotenv from 'dotenv';
dotenv.config();

const baseId = process.env.AIRTABLE_BASE_ID || process.env.VITE_AIRTABLE_BASE_ID;
const pat = process.env.AIRTABLE_PAT || process.env.AIRTABLE_API_KEY || process.env.VITE_AIRTABLE_PAT;

const headers = {
  Authorization: `Bearer ${pat}`,
  'Content-Type': 'application/json'
};

async function airtableFetch(url: string, options: any = {}) {
  const res = await fetch(url, { ...options, headers: { ...headers, ...options.headers } });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Airtable error ${res.status}: ${text}`);
  }
  return res.json();
}

async function syncActions2_3_4_6() {
  console.log('=== Starting Full Sync for Actions 2, 3, 4, 6 ===');

  // Fetch all Actions & Pathways
  const actionsData = await airtableFetch(`https://api.airtable.com/v0/${baseId}/Actions`);
  const pathwaysData = await airtableFetch(`https://api.airtable.com/v0/${baseId}/Pathways`);
  const guidanceData = await airtableFetch(`https://api.airtable.com/v0/${baseId}/Implementation%20Guidance`);
  const resourcesData = await airtableFetch(`https://api.airtable.com/v0/${baseId}/Key%20Resources`);

  const actions = actionsData.records;
  const pathways = pathwaysData.records;

  // -------------------------------------------------------------
  // ACTION 2
  // -------------------------------------------------------------
  console.log('\n--- Syncing Action 2 ---');
  const a2 = actions.find((r: any) => r.fields['Action Number'] === 2 || r.fields['Action Number'] === '2');
  if (a2) {
    await airtableFetch(`https://api.airtable.com/v0/${baseId}/Actions/${a2.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        fields: {
          'Title': 'Strengthen Enabling Environments for Climate Investment',
          'Description': 'This Action helps national governments identify and address barriers to urban climate investment and implementation. These may include policy, fiscal, institutional, financing, data and coordination barriers. Governments can use these findings to prioritise reforms that improve investment conditions for cities and subnational governments.',
          'Systems Logic': 'Climate finance depends on more than the availability of capital. Policies, institutions and fiscal systems determine whether climate priorities can become financeable portfolios. National governments can address barriers that cities cannot resolve alone, including borrowing rules and financial frameworks. Stronger enabling environments can therefore improve project preparation, access to finance and implementation across cities.'
        }
      })
    });
    console.log('✓ Action 2 updated');
  }

  // Pathway 2.1
  const p2_1 = pathways.find((r: any) => String(r.fields['Pathway Title']).startsWith('2.1'));
  if (p2_1) {
    await airtableFetch(`https://api.airtable.com/v0/${baseId}/Pathways/${p2_1.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        fields: {
          'Pathway Title': '2.1 Enabling Framework Conditions Assessments',
          'Overview': 'Enabling environment assessments identify the conditions that support or constrain urban climate investment. These assessments can be conducted across national and subnational governance levels. Governments often know that climate investment is not progressing but may lack a systematic way to identify where the challenges lie and which reforms should be prioritised. An enabling environment assessment helps make these challenges visible and determine areas of coordinated reforms.',
          'What it is': '',
          'Why it is needed': '',
          'Enabling Conditions': '',
          'Transferability Considerations': `• Adapt the assessment methodology to context. Where subnational climate, fiscal and governance data are limited, lean on interviews and policy review — as the India pilot did with its desk review and seven stakeholder interviews to better understand intergovernmental relationships, mandates and local financial systems.
• Deploy the national and subnational tools together where possible, so a new jurisdiction is assessed as a coherent multilevel system rather than at a single level in isolation, with the national baseline framing the subnational diagnosis, as in the India and Indonesia pilots.
• Secure access to stakeholders and source documentation for the data-collection, inception and validation steps — much as the India pilot used its two New Delhi roundtables to confirm findings.
• Ground the assessment in government ownership and existing planning and budget cycles, so its recommendations are taken up as reforms. In India, the gaps mapped directly onto instruments already in use, such as Central Finance Commission grants and the National Mission for Sustainable Habitat.
• Identify technical partners to run the workshops, interpret the results and translate findings into roadmaps, as GIZ did alongside MoHUA, NIUA and TERI in the India pilot.`
        }
      })
    });
    console.log('✓ Pathway 2.1 updated');
  }

  // Pathway 2.2
  const p2_2 = pathways.find((r: any) => String(r.fields['Pathway Title']).startsWith('2.2'));
  if (p2_2) {
    await airtableFetch(`https://api.airtable.com/v0/${baseId}/Pathways/${p2_2.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        fields: {
          'Pathway Title': '2.2 Reform Roadmaps for Urban Climate Investment',
          'Overview': 'Reform roadmaps help translate enabling-environment assessment findings into a prioritised reform program to improve urban climate investment conditions. EFC assessments may identify investment barriers but establishing which should be addressed first needs political decision making. To this end, reform roadmaps can help governments to identify national priority areas, responsibilities, milestones and required technical assistance, funds and partnerships needed to implement reforms. The roadmaps also help develop a shared basis for development and finance partners to target support towards agreed national priorities.',
          'What it is': '',
          'Why it is needed': '',
          'Enabling Conditions': '',
          'Transferability Considerations': `• Anchor the reform roadmaps to national or subnational governments, development partners, municipal associations or other intermediaries, depending on who has the mandate and capacity to support reform.
• Develop national- and subnational-level reforms together, particularly in contexts where challenges to climate finance and implementation arise from borrowing regulations, mandates or other legal factors beyond municipal control.
• Use an iterative approach to build capacity to implement reform roadmaps. Governments could progress from awareness and self-assessment to more intensive technical assistance as their needs and readiness develop.`
        }
      })
    });
    console.log('✓ Pathway 2.2 updated');
  }

  // -------------------------------------------------------------
  // ACTION 3
  // -------------------------------------------------------------
  console.log('\n--- Syncing Action 3 ---');
  const a3 = actions.find((r: any) => r.fields['Action Number'] === 3 || r.fields['Action Number'] === '3');
  if (a3) {
    await airtableFetch(`https://api.airtable.com/v0/${baseId}/Actions/${a3.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        fields: {
          'Title': 'Establish Multilevel Platforms for Coordinated Investment',
          'Description': 'This Action helps national governments establish long-term coordination with cities and subnational governments. It covers national platforms, recurring coordination processes and dedicated intermediary functions. Together, these mechanisms can align local investment needs with national policies, programmes, finance and implementation support.',
          'Systems Logic': 'Urban climate investment requires coordination across institutions and levels of government. To this end, national platforms can provide an overarching framework to connect local investment priorities with national policies, finance and technical support. Within national platforms, recurring national-subnational coordination mechanisms can help governments to align financial resources and needs as implementation progresses. Additionally, dedicated intermediary coordination functions are needed for or day-to-day coordination, monitoring, accountability and feedback loops. Together, these arrangements can help align governments, agencies and finance institutions coordination processes and ensure continuity over time.'
        }
      })
    });
    console.log('✓ Action 3 updated');
  }

  // Pathway 3.1
  const p3_1 = pathways.find((r: any) => String(r.fields['Pathway Title']).startsWith('3.1'));
  if (p3_1) {
    await airtableFetch(`https://api.airtable.com/v0/${baseId}/Pathways/${p3_1.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        fields: {
          'Pathway Title': '3.1 Recurring National–Subnational Coordination',
          'Overview': 'Recurring coordination offers a process for national and subnational governments to align investment priorities and review implementation. It connects local financing needs with national policies and funding programs. Climate investment often involves responsibilities spread across different institutions and levels of government. Scaling financing therefore requires recurring coordination to move projects from planning to financing and implementation. This can help identify barriers, align national support and keep investment priorities moving across political and administrative cycles.',
          'What it is': '',
          'Why it is needed': '',
          'Enabling Conditions': '',
          'Transferability Considerations': `• Adapting coordination frameworks and processes to the country\'s governance systems, enabling countries and cities to define governance relationships, supporting processes and coordination arrangements that reflect their own institutional context. In centralized systems, a national ministry could lead coordination, while decentralized may distribute coordination responsibilities across regional or state governments working alongside cities.
• Building on existing coordination mechanisms, such as climate or NDC units, national platforms, subnational climate cells or sectoral coordination bodies, rather than creating parallel institutions.
• Applying the coordination mechanisms progressively, where countries with limited institutional capacities may begin with simpler multistakeholder dialogues and progressively institutionalize recurring coordination processes as governance capabilities develop.`
        }
      })
    });
    console.log('✓ Pathway 3.1 updated');
  }

  // Pathway 3.2
  const p3_2 = pathways.find((r: any) => String(r.fields['Pathway Title']).startsWith('3.2'));
  if (p3_2) {
    await airtableFetch(`https://api.airtable.com/v0/${baseId}/Pathways/${p3_2.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        fields: {
          'Pathway Title': '3.2 National Platforms for Climate Investment and Implementation',
          'Overview': 'National platforms coordinate climate priorities, investment and implementation across government and other partners. They help address fragmented urban investment across ministries, cities, funding programmes and individual projects. Platforms connect cities with national ministries, finance institutions and development partners around shared priorities. They can support investment planning, project preparation, finance mobilization and implementation. This can strengthen links between local priorities, national programmes and available finance.',
          'What it is': '',
          'Why it is needed': '',
          'Enabling Conditions': '',
          'Transferability Considerations': `• Host the national platform within suitable institutions according to the governance context. Depending on the level of decentralization and governance arrangements, the platform may be coordinated by a group public and institutional partners, such as Viable Cities, a ministry-led multi-stakeholder platform such as citiES 2030, or a country-led financing framework that is designed to work across national and subnational levels, as in Tanzania.
• Adapt the platform functions and mandates to national priorities and capacities. Countries can prioritize different functions, from initial engagement and program readiness to investment planning, financing and implementation, and adjust the operations of the platform to match their challenges and ambitions.
• Bring cities into the platform through mechanisms that fit the governance system. In settings with high local capacities, city mobilization can be direct, as in Viable Cities’ Climate City Contracts. In less capacitated contexts, city mobilization can be routed through national processes while local governments build their own capacities and frameworks over time and continuously engage the national government through multilevel dialogues, as in Tanzania.
• Adopt an iterative, learning-by-doing approach where the prioritized strategies and initiatives could first be tested before a full roll-out, especially in context where institutional capacities are limited, as in Tanzania.`
        }
      })
    });
    console.log('✓ Pathway 3.2 updated');
  }

  // Pathway 3.3
  const p3_3 = pathways.find((r: any) => String(r.fields['Pathway Title']).startsWith('3.3'));
  if (p3_3) {
    await airtableFetch(`https://api.airtable.com/v0/${baseId}/Pathways/${p3_3.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        fields: {
          'Pathway Title': '3.3 Intermediary Coordination Function',
          'Overview': 'An intermediary coordination function provides dedicated capacity to support coordination between governments, institutions and partners. National platforms and coordination processes require dedicated capacity to function effectively over time. Responsibilities can otherwise become fragmented across institutions, projects and funding cycles. To this end, an intermediary coordination function can analyse financing and implementation needs, convene actors, track progress and connect local priorities with national support. The function can sit within a national platform, government programme or another trusted institution.',
          'What it is': '',
          'Why it is needed': '',
          'Enabling Conditions': '',
          'Transferability Considerations': `• Anchor the function in existing institutions and systems, such as a ministry, national agency (e.g., Sweden’s Coordination Function), climate platform, local-government association, city network or an independent public interest groups (e.g.,4C Maroc) and connect it to existing climate, intergovernmental, planning and budget processes rather than creating a parallel institutional structure.
• Scale its functions to capacity and implementation needs. In lower-capacity contexts, begin with convening, issue tracking, documentation and implementation support. Functions such as analysis, governance diagnostics, policy and finance alignment, monitoring, knowledge management and adaptive learning can be added as needs and capacities evolve.
• Maintaining clear institutional boundaries. The intermediary function should focus on analyses, facilitation and brokering alignment, while governments, financial institutions and delivery organisations retain their formal mandates and decision rights.`
        }
      })
    });
    console.log('✓ Pathway 3.3 updated');
  }

  // -------------------------------------------------------------
  // ACTION 4
  // -------------------------------------------------------------
  console.log('\n--- Syncing Action 4 ---');
  const a4 = actions.find((r: any) => r.fields['Action Number'] === 4 || r.fields['Action Number'] === '4');
  if (a4) {
    await airtableFetch(`https://api.airtable.com/v0/${baseId}/Actions/${a4.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        fields: {
          'Title': 'Jointly Plan and Prepare Climate Investment Portfolios',
          'Description': 'This Action helps national governments work with cities and subnational governments to plan and prepare urban climate investments. It covers investment planning, budgeting, portfolio development and project preparation. Together, these processes can turn shared climate priorities into coordinated and finance-ready investment pipelines.',
          'Systems Logic': 'Climate priorities need to become clear investment opportunities before finance can be mobilized. To this end, joint investment planning processes help identify what needs financing and who is responsible across government levels. Portfolio development then connects projects with the policy, governance and other measures needed for implementation. Project preparation then helps suitable projects become finance-ready and connects them with potential financiers.'
        }
      })
    });
    console.log('✓ Action 4 updated');
  }

  // Pathway 4.1
  const p4_1 = pathways.find((r: any) => String(r.fields['Pathway Title']).startsWith('4.1'));
  if (p4_1) {
    await airtableFetch(`https://api.airtable.com/v0/${baseId}/Pathways/${p4_1.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        fields: {
          'Pathway Title': '4.1 Joint Climate Investment Planning and Budgeting',
          'Overview': 'Joint climate investment planning helps translate shared climate priorities into investment needs, responsibilities and financing requirements. Climate action plans do not always identify costs, financing responsibilities or links to government budgets. This can prevent climate priorities from becoming funded investments. To this end, joint investment planning identifies what needs investment, when investment is needed and who could finance and deliver it. Climate budgeting then integrates priority investments into government budgets and tracks expenditure and implementation.',
          'What it is': '',
          'Why it is needed': '',
          'Enabling Conditions': '',
          'Transferability Considerations': `• Adapt to the governance context. Map where the city planning, budgeting and investment authority sits, and tailor the connections between local, regional and national processes accordingly. In more centralized systems, national or regional finance authorities may lead the investment planning and budgeting process while cities may provide locally grounded investment priorities and implementation evidence.
• Develop progressively and expand the scope over time. Lower-capacity governments can begin with climate-aligned budget tagging, a priority investment register, and basic mapping of costs, responsibilities and funding gaps. As data and capacity improve, the process can incorporate more advanced investment planning that extends beyond municipal assets to utilities, households, businesses and regional or national infrastructure.`
        }
      })
    });
    console.log('✓ Pathway 4.1 updated');
  }

  // Pathway 4.2
  const p4_2 = pathways.find((r: any) => String(r.fields['Pathway Title']).startsWith('4.2'));
  if (p4_2) {
    await airtableFetch(`https://api.airtable.com/v0/${baseId}/Pathways/${p4_2.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        fields: {
          'Pathway Title': '4.2 Portfolio and Pipeline Development',
          'Overview': 'Climate investment portfolios organise interconnected projects and supporting measures around shared climate priorities. They help address systemic barriers that individual projects cannot resolve on their own. Portfolios connect projects with policy reforms, regulation, governance, procurement and technical assistance needed for implementation. They can generate investible project pipelines and help governments identify common investment opportunities across cities. This can strengthen the quality and scale of investment opportunities presented to financiers. These portfolios can be developed as part of the national platform and informed by national and subnational investment plans.',
          'What it is': '',
          'Why it is needed': '',
          'Enabling Conditions': '',
          'Transferability Considerations': `• Tailor portfolio development to the national climate priorities and implementation capacities. Cities with relatively less capacities can start with mapping key actors, identifying and aligning projects with national priorities, and engaging with key actors, such as PPFs, then move to portfolio development and governance once the actors are involved and enabling conditions are mature.
• Different lead institutions can host the portfolio and pipeline development. Depending on the governance setup, portfolio development and coordination role can sit within a national program or agency, regional authority, a multistakeholder body of local governments or external partners, such as city networks. The key is having sufficient mandate and convening power to continually develop and implement the portfolio.
• Portfolio funding models can vary. Some contexts will need a donor-led or grant-led portfolio development, while others with higher levels of fiscal capacity can use city-led, national-led or blended funding arrangements. The key is having funding that is sufficient to develop the portfolio from planning to investment readiness.
• Tailor outreach to PPFs to match sector priorities, country context and pipeline maturity, so early-stage projects are steered toward diagnostics and concept development, while more advanced pipelines are matched with structuring, de-risking and investment-readiness support.`
        }
      })
    });
    console.log('✓ Pathway 4.2 updated');
  }

  // -------------------------------------------------------------
  // ACTION 6
  // -------------------------------------------------------------
  console.log('\n--- Syncing Action 6 ---');
  const a6 = actions.find((r: any) => r.fields['Action Number'] === 6 || r.fields['Action Number'] === '6');
  if (a6) {
    await airtableFetch(`https://api.airtable.com/v0/${baseId}/Actions/${a6.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        fields: {
          'Title': 'Learn, Strengthen Capacities and Scale',
          'Description': 'This Action helps national governments to strengthen capacities and partnerships needed to scale urban climate investment. It covers peer learning, capacity building, strategic partnerships and access to technical and financial support. It also supports governments to use implementation experience to improve and scale future investments.',
          'Systems Logic': 'Scaling climate investment requires more than replicating individual projects. City and subnational governments need capabilities to prepare investments, access finance, implement projects and apply lessons across cities. External partners can provide technical assistance, finance and specialist expertise where domestic capacity is limited. Monitoring and peer learning can then help successful approaches inform future policies, programmes and investments.'
        }
      })
    });
    console.log('✓ Action 6 updated');
  }

  // Pathway 6.1
  const p6_1 = pathways.find((r: any) => String(r.fields['Pathway Title']).startsWith('6.1'));
  if (p6_1) {
    await airtableFetch(`https://api.airtable.com/v0/${baseId}/Pathways/${p6_1.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        fields: {
          'Pathway Title': '6.1 Capacity, Networking and Peer Learning for Climate Investment',
          'Overview': 'Capacity building and peer learning strengthen the skills local governments need to finance and implement climate projects. They can include training, technical assistance, peer exchange and practitioner networks. National governments can support these efforts through national programmes, funding and platforms that connect cities with relevant technical expertise. Peer learning and networking can also help cities adopt approaches already tested in comparable contexts.',
          'What it is': '',
          'Why it is needed': '',
          'Enabling Conditions': '',
          'Transferability Considerations': `National governments and city networks should create clear, low-barrier entry points to capacity building and learning programs. They should also consider co-financing participation for under-resourced cities. This can entail the below activities:
• Cover travel, accommodation, and staff time, so participation is feasible for under-resourced cities.
• Offer hybrid and asynchronous options with downloadable/offline materials, for cities with weaker connectivity.
• Pair peer learning with follow-on technical assistance or mentoring, so cities can apply what they learn rather than just attend.
• Use local platforms (e.g., CCFLA Local Hubs) or city networks as delivery partners, so convening is closer to cities and less dependent on a single central venue.
• Organize workshops and events in local languages, wherever possible, so that guidance is accessible for city officials.`
        }
      })
    });
    console.log('✓ Pathway 6.1 updated');
  }

  // Pathway 6.2
  const p6_2 = pathways.find((r: any) => String(r.fields['Pathway Title']).startsWith('6.2'));
  if (p6_2) {
    await airtableFetch(`https://api.airtable.com/v0/${baseId}/Pathways/${p6_2.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        fields: {
          'Pathway Title': '6.2 Strategic Partnerships for Finance Mobilization and Implementation at Scale',
          'Overview': 'Strategic partnerships connect governments with institutions that can provide finance, technical assistance and implementation support. Partners can include MDBs, DFIs, climate funds, philanthropies, city networks and technical assistance providers. National governments can coordinate these partnerships and connect cities with suitable sources of support. This helps address gaps in finance, project preparation and specialist implementation capacity. These partnerships can reduce the burden on individual cities that may lack direct access to finance or struggle to navigate fragmented institutions and programmes.',
          'What it is': '',
          'Why it is needed': '',
          'Enabling Conditions': '',
          'Transferability Considerations': ''
        }
      })
    });
    console.log('✓ Pathway 6.2 updated');
  }

  // -------------------------------------------------------------
  // SYNC IMPLEMENTATION GUIDANCE
  // -------------------------------------------------------------
  console.log('\n--- Syncing Implementation Guidance Records ---');
  const pathwayIdsToSync = [p2_1?.id, p2_2?.id, p3_1?.id, p3_2?.id, p3_3?.id, p4_1?.id, p4_2?.id, p6_1?.id, p6_2?.id].filter(Boolean);

  const existingGuidanceToDelete = guidanceData.records.filter((r: any) =>
    r.fields['Belongs to Pathway']?.some((id: string) => pathwayIdsToSync.includes(id))
  );

  console.log(`Deleting ${existingGuidanceToDelete.length} existing guidance records...`);
  for (const r of existingGuidanceToDelete) {
    await airtableFetch(`https://api.airtable.com/v0/${baseId}/Implementation%20Guidance/${r.id}`, { method: 'DELETE' });
  }

  const allGuidanceToCreate = [
    // 2.1
    {
      pathwayId: p2_1.id,
      steps: [
        { order: 1, title: 'Define the purpose and scope of the assessment', content: 'Identify the investment challenges the assessment should examine. Determine which institutions, government levels and financing systems should be included.' },
        { order: 2, title: 'Assess existing conditions', content: 'Review relevant policies, regulations, fiscal systems, financing frameworks, institutional arrangements and data. Use consultations to understand how these arrangements work in practice.' },
        { order: 3, title: 'Identify barriers to investment', content: 'Determine which policy, fiscal, institutional, financing or data constraints are limiting urban climate investment. Distinguish national barriers from those that can be addressed locally.' },
        { order: 4, title: 'Validate findings across government levels', content: 'Discuss findings with cities, subnational governments and relevant national institutions. Use this process to confirm priorities and identify areas requiring joint action.' },
        { order: 5, title: 'Prioritise areas for reforms', content: 'Identify which barriers have the greatest effect on investment and implementation. Use the findings to inform reform priorities, technical assistance and financing support.' },
        { order: 6, title: 'Repeat the assessment when needed', content: 'Revisit priority areas as reforms progress and investment conditions change.' },
      ]
    },
    // 2.2
    {
      pathwayId: p2_2.id,
      steps: [
        { order: 1, title: 'Prioritise the most important barriers', content: 'Use assessment findings to identify reforms with the greatest potential to improve urban climate investment. Consider their impact, urgency and feasibility.' },
        { order: 2, title: 'For each priority, define the intended actions', content: 'Specify the actions required for each reform and identify the responsible institutions. Define milestones, resources and technical support where needed.' },
        { order: 3, title: 'Identify dependencies across government levels', content: 'Determine which reforms require national action and which can be implemented locally. Sequence connected reforms so that progress in one area enables another.' },
        { order: 4, title: 'Connect reforms with finance and technical support', content: 'Identify where public funding, development finance or technical assistance can support implementation. Engage relevant partners around agreed reform priorities.' },
        { order: 5, title: 'Track progress and update the roadmap', content: 'Establish clear milestones and review progress periodically. Update priorities when reforms advance or new barriers emerge.' },
      ]
    },
    // 3.1
    {
      pathwayId: p3_1.id,
      steps: [
        { order: 1, title: 'Map and build on existing coordination processes', content: 'Identify where climate, planning, budgeting and financing decisions already take place. Build on these processes rather than creating parallel arrangements.' },
        { order: 2, title: 'Clarify roles across government levels', content: 'Identify which decisions sit nationally, regionally and locally. Define where joint decisions or coordinated action are required.' },
        { order: 3, title: 'Link coordination to investment priorities', content: 'Use the coordination process to review investment plans, portfolios and project pipelines. Align relevant finance, technical assistance and implementation support around them.' },
        { order: 4, title: 'Establish regular review cycles', content: 'Convene national and subnational actors at agreed intervals to review progress and address barriers. Update priorities and responsibilities where needed.' },
        { order: 5, title: 'Use each cycle to improve the system', content: 'Feed implementation experience into future policies, programmes, funding decisions and coordination processes.' },
      ]
    },
    // 3.2
    {
      pathwayId: p3_2.id,
      steps: [
        { order: 1, title: 'Establish national ownership and mandate', content: 'Identify the national institution or group responsible for leading the platform. Define its purpose, responsibilities and relationship with existing government processes.' },
        { order: 2, title: 'Create clear entry points for cities', content: 'Establish regular channels for subnational governments to bring finance and implementation needs into national discussions.' },
        { order: 3, title: 'Align national and local investment priorities', content: 'Connect national climate and development objectives with city plans, investment portfolios and project pipelines.' },
        { order: 4, title: 'Bring finance partners into the process', content: 'Engage national development banks, MDBs, climate funds and private finance institutions around identified investment needs.' },
        { order: 5, title: 'Coordinate financing approaches', content: 'Identify where grants, concessional finance, guarantees, public investment or private capital can support different parts of the investment portfolio.' },
        { order: 6, title: 'Track implementation and adapt support', content: 'Review progress, financing gaps and implementation barriers regularly. Use these findings to adjust national programs.' },
      ]
    },
    // 3.3
    {
      pathwayId: p3_3.id,
      steps: [
        { order: 1, title: 'Define the mandate', content: 'Specify what the function will coordinate, analyse and facilitate. Keep formal policy, financing and investment decisions with the responsible institutions.' },
        { order: 2, title: 'Place the function within a trusted institution', content: 'Use an existing ministry, national platform, agency or other institution where possible. Ensure it can work across institutional boundaries.' },
        { order: 3, title: 'Build relationships across institutions', content: 'Maintain regular engagement with national agencies, subnational governments, finance institutions and implementation partners.' },
        { order: 4, title: 'Track priorities and barriers', content: 'Maintain a clear record of commitments, financing needs, responsibilities and unresolved issues. Use this information to support follow-up.' },
        { order: 5, title: 'Support coordination around finance', content: 'Help connect investment priorities with relevant government programmes, financial institutions and development partners.' },
        { order: 6, title: 'Feed learning into future decisions', content: 'Bring implementation experience into subsequent planning, budgeting, investment and policy cycles.' },
      ]
    },
    // 4.1
    {
      pathwayId: p4_1.id,
      steps: [
        { order: 1, title: 'Define priority investment needs', content: 'Work with cities to translate climate goals into priority investments. Identify expected costs, timing and links to national climate priorities.' },
        { order: 2, title: 'Connect local investment needs with national budgets and programmes', content: 'Compare investment needs with national, subnational and municipal budgets and programmes. Incorporate relevant priorities into national investment planning, funding programmes and fiscal decisions. Identify existing funding, overlaps and financing gaps.' },
        { order: 3, title: 'Clarify financing and implementation responsibilities', content: 'Identify which investments require national, subnational, municipal, utility or private-sector resources. Define where responsibilities need to be shared.' },
        { order: 4, title: 'Identify financing gaps and options', content: 'Determine which investments can use public budgets and which require additional finance. Consider grants, borrowing, concessional finance or private investment where appropriate.' },
        { order: 5, title: 'Support climate budgeting across government levels', content: 'Help cities integrate climate priorities into operating and capital budgets. National governments can provide guidance, standards, data and technical assistance.' },
        { order: 6, title: 'Review investment plans regularly', content: 'Track expenditure, implementation and financing gaps through existing planning and budget cycles. Update priorities as conditions change.' },
      ]
    },
    // 4.2
    {
      pathwayId: p4_2.id,
      steps: [
        { order: 1, title: 'Start from agreed investment priorities', content: 'Use climate investment plans to identify related projects and interventions that are part of the multilevel climate investment agenda.' },
        { order: 2, title: 'Organise related interventions into portfolios', content: 'Group projects with the policy, regulatory, governance, procurement and capacity measures needed for implementation. Define responsibilities and sequencing across government levels.' },
        { order: 3, title: 'Identify promising projects within each portfolio', content: 'Assess project readiness, investment potential and expected climate impact. Use this process to build a pipeline for further preparation.' },
        { order: 4, title: 'Engage project preparation facilities early', content: 'Connect the emerging pipeline with suitable PPFs and technical assistance providers. Use their support to strengthen feasibility, financial structuring and investment readiness.' },
        { order: 5, title: 'Match projects with financing pathways', content: 'Identify projects requiring additional development finance or borrowing or having potential for private investment. Flag projects requiring further risk reduction.' },
        { order: 6, title: 'Identify aggregation opportunities across multiple cities', content: 'Look for common investment needs that could inform national programmes or aggregated approaches. This can increase scale of investment and reduce fragmentation.' },
        { order: 7, title: 'Connect pipelines with financiers', content: 'Present prepared projects and portfolios to relevant national banks, MDBs, climate funds and private investors.' },
        { order: 8, title: 'Update portfolios as projects progress', content: 'Track preparation, financing and implementation across the portfolio. Add, revise or remove interventions as priorities and readiness evolve.' },
      ]
    },
    // 6.1
    {
      pathwayId: p6_1.id,
      steps: [
        { order: 1, title: 'Identify priority capacity gaps', content: 'Assess where cities need support across investment planning, project preparation, finance, procurement and implementation.' },
        { order: 2, title: 'Develop capacity support around these needs', content: 'Work with technical partners to provide training, guidance and technical assistance. Adapt support to different levels of city capacity.' },
        { order: 3, title: 'Create opportunities for peer learning', content: 'Connect cities facing similar investment and implementation challenges. Use national or regional networks to share practical experience.' },
        { order: 4, title: 'Connect learning with implementation', content: 'Pair training with practical application, mentoring or technical assistance. This helps cities apply new capabilities to actual investment portfolios and projects.' },
        { order: 5, title: 'Make support accessible across different contexts', content: 'Adapt language, formats and delivery approaches to local needs. Provide additional support for cities with limited financial or institutional capacity.' },
        { order: 6, title: 'Capture and share practical lessons', content: 'Translate experience into guidance, templates and repeatable approaches. Make these resources available across cities and government institutions.' },
        { order: 7, title: 'Track whether capacity leads to stronger investment outcomes', content: 'Monitor improvements in project preparation, finance access and implementation. Use findings to improve future capacity support.' },
      ]
    },
    // 6.2 (How to enable partnerships)
    {
      pathwayId: p6_2.id,
      steps: [
        { order: 1, title: 'Identify common support needs across cities', content: 'Determine whether the main gaps involve capacity, project preparation, financing, de-risking or implementation.' },
        { order: 2, title: 'Map partners against these needs', content: 'Identify institutions with suitable finance, technical assistance or implementation capabilities.' },
        { order: 3, title: 'Mobilize finance partners around project portfolios', content: 'Engage MDBs, DFIs, climate funds, development banks and private finance institutions around prepared investment opportunities.' },
        { order: 4, title: 'Use national institutions as intermediaries where needed', content: 'Enable development banks, ministries and national platforms to connect cities with partners they cannot access directly.' },
        { order: 5, title: 'Coordinate external support', content: 'Align partner activities around agreed national and local priorities. Reduce overlapping programmes, fragmented support and competing requirements where possible.' },
        { order: 6, title: 'Track partnership outcomes and remaining gaps', content: 'Monitor technical assistance, projects prepared, finance mobilized and implementation progress. Use findings to strengthen future partnerships.' },
      ]
    }
  ];

  for (const group of allGuidanceToCreate) {
    for (const step of group.steps) {
      await airtableFetch(`https://api.airtable.com/v0/${baseId}/Implementation%20Guidance`, {
        method: 'POST',
        body: JSON.stringify({
          fields: {
            'Step Title': step.title,
            'Detailed Content': step.content,
            'Step Order': step.order,
            'Belongs to Pathway': [group.pathwayId]
          }
        })
      });
    }
  }
  console.log('✓ Created all Implementation Guidance records');

  // -------------------------------------------------------------
  // UPDATE TOOLS & ILLUSTRATIVE EXAMPLES IN KEY RESOURCES
  // -------------------------------------------------------------
  console.log('\n--- Syncing Key Resources (Tools & Examples) ---');
  const allResources = resourcesData.records;

  const resourceUpdates: Array<{ findFn: (r: any) => boolean; fields: any; createIfMissing?: any }> = [
    // 2.1 Tools & Examples
    {
      findFn: (r) => String(r.fields['Example Title'] || r.fields['Example Title'] || '').toLowerCase().includes('national enabling framework conditions'),
      fields: {
        'Example Title': 'National Enabling Framework Conditions (EFC) Tools',
        'Type': 'Tool',
        'Full Text / Concept Explanation': 'National Enabling Framework Conditions (EFC) Tools offer a practical way to assess a national government against four key dimensions – policy, budget and finance, climate data, and vertical and horizontal coordination. These categories are further broken down into 16 sub-categories that include 64 assessment dimensions. The dimensions help identify priority areas for reform, and the process includes identifying stakeholders, collecting evidence, holding consultations, preparing results and identifying follow-up actions. The tool was piloted in India and Indonesia, making it a strong EMDE reference for how national enabling conditions can be assessed and translated into reform.',
        'Excerpt': 'National Enabling Framework Conditions (EFC) Tools offer a practical way to assess a national government against four key dimensions...',
        'Belongs to Pathway': [p2_1.id]
      }
    },
    {
      findFn: (r) => String(r.fields['Example Title'] || r.fields['Example Title'] || '').toLowerCase().includes('subnational enabling framework conditions'),
      fields: {
        'Example Title': 'Subnational Enabling Framework Conditions (EFC) Tool',
        'Type': 'Tool',
        'Full Text / Concept Explanation': 'Subnational Enabling Framework Conditions (EFC) Tool mirrors the same logic as that of the national tool, but is adapted for a specific city, metropolitan area, state or region depending on context. It is organized around 49 dimensions in four categories and 13 sub-categories. The tool walks users through a similar workflow — define the scope, gather evidence through document review and interviews, convene workshops to validate findings, and then turn the results into roadmaps or blueprints.',
        'Excerpt': 'Subnational Enabling Framework Conditions (EFC) Tool mirrors the same logic as that of the national tool, but is adapted for a specific city...',
        'Belongs to Pathway': [p2_1.id]
      }
    },
    {
      findFn: (r) => String(r.fields['Example Title'] || '').toLowerCase().includes('india pilot') || String(r.fields['Example Title'] || '').toLowerCase().includes('efc tool in practice'),
      fields: {
        'Example Title': 'The India pilot (2024)',
        'Type': 'Illustrative Example',
        'Full Text / Concept Explanation': 'The India pilot (2024) illustrates how the national EFC tool works in practice. The pilot was led by GIZ, alongside the Indian Ministry of Housing and Urban Affairs, the National Institute of Urban Affairs and The Energy Research Institute. It included a desk review with seven stakeholder interviews and two roundtables in New Delhi attended by more than 80 participants. The findings on the four dimensions included gaps in local institutional mandates, own-source revenues and borrowings, city-level climate data and coordination between state and local governments. Each gap points to a specific reform — broadening grants from the national finance commission to support climate action, for instance, or issuing city climate action plan guidelines under national missions.',
        'Excerpt': 'The India pilot (2024) illustrates how the national EFC tool works in practice...',
        'Belongs to Pathway': [p2_1.id]
      },
      createIfMissing: {
        'Example Title': 'The India pilot (2024)',
        'Type': 'Illustrative Example',
        'Full Text / Concept Explanation': 'The India pilot (2024) illustrates how the national EFC tool works in practice. The pilot was led by GIZ, alongside the Indian Ministry of Housing and Urban Affairs, the National Institute of Urban Affairs and The Energy Research Institute. It included a desk review with seven stakeholder interviews and two roundtables in New Delhi attended by more than 80 participants. The findings on the four dimensions included gaps in local institutional mandates, own-source revenues and borrowings, city-level climate data and coordination between state and local governments. Each gap points to a specific reform — broadening grants from the national finance commission to support climate action, for instance, or issuing city climate action plan guidelines under national missions.',
        'Excerpt': 'The India pilot (2024) illustrates how the national EFC tool works in practice...',
        'Belongs to Pathway': [p2_1.id]
      }
    },

    // 2.2 Tools & Examples
    {
      findFn: (r) => String(r.fields['Example Title'] || r.fields['Example Title'] || '').toLowerCase().includes('climate finance reform compass'),
      fields: {
        'Example Title': 'Climate Finance Reform Compass (CPI)',
        'Type': 'Tool',
        'Full Text / Concept Explanation': 'The Climate Finance Reform Compass helps align government, civil society, and the private sector on the full range of financial architecture reforms needed to maximize climate finance opportunities. It provides an action-oriented framework for translating climate finance commitments and identified gaps into prioritised reform areas, milestones and institutional actions. The Global Compass tracks progress across nine thematic areas for the international community to understand where progress is being made, where gaps persist, and how reforms can reinforce each other.\n\n• The Brazil Climate Finance Reform Compass: The Brazil Climate Finance Reform Compass adapts the global framework to national context, identifying gaps and reform priorities across the same nine thematic areas and mapping the institutions, actors and milestones needed to advance them. Both are designed as living tools that can be updated as policies, evidence and stakeholder priorities evolve, helping governments and other stakeholders coordinate reforms, track progress and strengthen alignment between climate finance and broader development priorities.',
        'Excerpt': 'The Climate Finance Reform Compass helps align government, civil society, and the private sector on the full range of financial architecture reforms...',
        'Belongs to Pathway': [p2_2.id]
      }
    },
    {
      findFn: (r) => String(r.fields['Example Title'] || '').toLowerCase().includes('city creditworthiness initiative'),
      fields: {
        'Example Title': 'World Bank City Creditworthiness Initiative (CCI)',
        'Type': 'Illustrative Example',
        'Full Text / Concept Explanation': 'The City Creditworthiness Initiative supports cities in developing the financial practices and institutional, legal and regulatory conditions needed to access finance for infrastructure investment. It includes creditworthiness academies, tailored technical assistance, and knowledge and research. Academies build city leaders’ capacity in areas such as revenue management, expenditure control, capital investment planning and debt management, while a self-assessment toolkit helps cities develop a preliminary creditworthiness action plan. Multi-year technical assistance then supports cities in achieving specific financial-management milestones, helping translate identified weaknesses into practical reforms. CCI also addresses wider enabling conditions through research on subnational borrowing, including legal and regulatory environments and local government borrowing practices.',
        'Excerpt': 'The City Creditworthiness Initiative supports cities in developing the financial practices and institutional, legal and regulatory conditions needed to access finance...',
        'Learn More URL': 'https://www.worldbank.org/en/topic/urbandevelopment/brief/city-creditworthiness-initiative',
        'Belongs to Pathway': [p2_2.id]
      }
    },

    // 3.1 Examples
    {
      findFn: (r) => String(r.fields['Example Title'] || '').toLowerCase().includes('climate city contracts') && String(r.fields['Example Title'] || '').toLowerCase().includes('ccc'),
      fields: {
        'Example Title': 'Climate City Contracts (CCCs)',
        'Type': 'Illustrative Example',
        'Full Text / Concept Explanation': 'Climate City Contracts (CCCs) illustrate how an overarching, iterative coordination framework can support long-term multilevel climate governance. The Climate City Contract is not simply a signed agreement, but an annual coordination process through which cities, national government agencies and Viable coordinate climate action by bringing together public authorities alongside businesses, academia and civil society. The process helps strengthen coordination capabilities across governance levels, builds long-term institutional relationships and continuously adapts implementation based on experience and emerging priorities.',
        'Excerpt': 'Climate City Contracts (CCCs) illustrate how an overarching, iterative coordination framework can support long-term multilevel climate governance...',
        'Belongs to Pathway': [p3_1.id]
      }
    },
    {
      findFn: (r) => String(r.fields['Example Title'] || '').toLowerCase().includes('colombia'),
      fields: {
        'Example Title': "Colombia's Strategic Committee on Cities and Climate Change",
        'Type': 'Illustrative Example',
        'Full Text / Concept Explanation': "Colombia's Strategic Committee on Cities and Climate Change illustrates how a recurring coordination mechanism can strengthen multilevel climate governance. Co-hosted by the national government and WRI, the biannual forum brings together cities, national authorities, NGOs and other stakeholders to identify implementation challenges, discuss active climate projects and opportunities for collaboration, and strengthen coordination across levels of government. This dialogue complements wider efforts to connect local priorities with national climate commitments and enabling support, including the Climate Financing Corridor, led by the National Planning Department to connect climate projects with funders and provide support. By convening actors repeatedly, the Committee provides an ongoing space for local implementation experience to inform national support and for national priorities and opportunities to be communicated back to cities—helping strengthen the relationships and coordination needed to advance climate action over time.",
        'Excerpt': "Colombia's Strategic Committee on Cities and Climate Change illustrates how a recurring coordination mechanism can strengthen multilevel climate governance...",
        'Belongs to Pathway': [p3_1.id]
      }
    },

    // 3.2 Tools & Examples
    {
      findFn: (r) => String(r.fields['Example Title'] || r.fields['Example Title'] || '').toLowerCase().includes('viable cities'),
      fields: {
        'Example Title': 'Viable Cities',
        'Type': 'Illustrative Example',
        'Full Text / Concept Explanation': 'Viable Cities demonstrates how a nationally anchored platform can turn climate ambition into an ongoing multilevel implementation architecture rather than a one-off coordination exercise. In Sweden, Viable Cities works with 48 cities and six government agencies and coordinates the country’s participation in CHAMP. Through the Climate City Contract approach, Viable Cities helps align municipal commitments with national support, shared learning and implementation capacity. The platform’s value lies in that continuity – it connects local priorities to a national mission, creates a common framework for collaboration and implementation, and helps keep governance, planning and implementation moving together over time.',
        'Excerpt': 'Viable Cities demonstrates how a nationally anchored platform can turn climate ambition into an ongoing multilevel implementation architecture...',
        'Learn More URL': 'https://viablecities.se',
        'Belongs to Pathway': [p3_2.id]
      }
    },
    {
      findFn: (r) => String(r.fields['Example Title'] || r.fields['Example Title'] || '').toLowerCase().includes('cities 2030') || String(r.fields['Example Title'] || r.fields['Example Title'] || '').toLowerCase().includes('cities2030'),
      fields: {
        'Example Title': 'citiES 2030',
        'Type': 'Illustrative Example',
        'Full Text / Concept Explanation': 'citiES 2030 is a strong example of a nationally anchored, multilevel and multi-stakeholder coordination platform that helps turn climate mission goals into implementation support for cities. It brings together cities, public sector actors, private sector partners, academia, civil society and citizens, and it works across European, national and local levels within the EU Cities Mission and Adaptation Mission. The platform provides services for learning and capacity building, Climate City Contract development, and the implementation of interconnected project portfolios and multi-city collaboration. In Spain, that support has helped five cities submit their Climate City Contracts and receive the EU Mission Label, showing how a platform can connect national coordination with concrete city-level implementation.',
        'Excerpt': 'citiES 2030 is a strong example of a nationally anchored, multilevel and multi-stakeholder coordination platform...',
        'Learn More URL': 'https://cities2030.es',
        'Belongs to Pathway': [p3_2.id]
      }
    },
    {
      findFn: (r) => String(r.fields['Example Title'] || '').toLowerCase().includes('tanzania'),
      fields: {
        'Example Title': "Tanzania’s Integrated National Financing Framework (INFF)",
        'Type': 'Illustrative Example',
        'Full Text / Concept Explanation': "Tanzania’s Integrated National Financing Framework (INFF) is a useful example to illustrate how a nationally led platform can be adapted across levels of government when it is paired with local ownership, iterative strategy-building and robust international cooperation for public and private finance. Rolled out on the mainland and in Zanzibar, the process aligned financing and development planning, broke silos within the Ministry of Finance and Planning, and used pilot dialogues with LGAs to surface locally appropriate financing solutions and bankable projects. INFF has demonstrated visible early results in Tanzania. Zanzibar’s revenue collection system is now used by 10 of 11 regional administrations, Zanzibar launched a USD 450 million sovereign sukuk, Tanga issued a USD 20.5 million water green bond, four SDG-aligned corporate bonds totalled USD 380 million, a USD 60 million road infrastructure bond to was issued to empower local contractors. Further, Zanzibar’s redesigned SDG Investor Map helped mobilize USD 5.5 million. Moreover, in coordination with national government via multilevel dialogues, Tanzanian cities like Dodoma have started developing their own local frameworks targeting local challenges and opportunities, such as improving local revenues.",
        'Excerpt': "Tanzania’s Integrated National Financing Framework (INFF) is a useful example to illustrate how a nationally led platform can be adapted across levels of government...",
        'Belongs to Pathway': [p3_2.id]
      }
    },
    {
      findFn: (r) => String(r.fields['Example Title'] || r.fields['Example Title'] || '').toLowerCase().includes('urban-inclusive country platforms'),
      fields: {
        'Example Title': 'CCFLA’s Urban-Inclusive Country Platforms Framework',
        'Type': 'Tool',
        'Full Text / Concept Explanation': 'CCFLA’s Urban-Inclusive Country Platforms Framework provides guidance on how a nationally led platform can be designed to systematically integrate cities and other subnational actors into climate finance and implementation systems. The framework is built around the barriers that often keep urban priorities out of country platforms – misalignment between national and subnational priorities, weak project pipelines, limited fiscal capacity and creditworthiness, and the absence of city-focused instruments – and responds with a phased roadmap from initial engagement to program readiness, investment programming, financing and implementation. Implementing the framework by national governments would allow for regular engagement with subnational leaders, inclusion of urban ministries and local representatives in coordination structures, support for local climate action plans and project pipelines, aggregation of smaller urban projects, and use of concessional, blended and de-risking tools through intermediaries such as national development banks and local financial institutions.',
        'Excerpt': 'CCFLA’s Urban-Inclusive Country Platforms Framework provides guidance on how a nationally led platform can be designed...',
        'Learn More URL': 'https://www.citiesclimatefinance.org',
        'Belongs to Pathway': [p3_2.id]
      }
    },

    // 3.3 Examples
    {
      findFn: (r) => String(r.fields['Example Title'] || '').toLowerCase().includes('samordningsfunktionen'),
      fields: {
        'Example Title': "Sweden's Samordningsfunktionen (Coordination Function)",
        'Type': 'Illustrative Example',
        'Full Text / Concept Explanation': "Sweden's Samordningsfunktionen (Coordination Function) within the Viable Cities programme demonstrates how a dedicated intermediary unit can strengthen multilevel climate governance by providing continuous operational support to the Climate City Contract process. It performs three complementary activities :\n• Analysing Climate City Contracts to identify local and regional needs alongside opportunities to accelerate implementation,\n• Facilitating collaboration between cities, national government agencies and other partners\n• Aligning the Climate City Contracts processes with national initiatives and the EU cities missions\nThrough these activities, Samordningsfunktionen enables a recurring cycle of analysis, joint development, local implementation and renewal, while helping national agencies strengthen their capacity to respond to local transition needs.",
        'Excerpt': "Sweden's Samordningsfunktionen (Coordination Function) within the Viable Cities programme demonstrates how a dedicated intermediary unit can strengthen multilevel climate governance...",
        'Belongs to Pathway': [p3_3.id]
      }
    },
    {
      findFn: (r) => String(r.fields['Example Title'] || '').toLowerCase().includes('4c maroc'),
      fields: {
        'Example Title': '4C Maroc (Morocco’s Climate Change Competence Centre)',
        'Type': 'Illustrative Example',
        'Full Text / Concept Explanation': "4C Maroc (Morocco’s Climate Change Competence Centre) illustrates how an intermediary function can provide trusted, cross-sector capacity for climate governance. Created as a public-interest group in 2015/16, 4C Maroc brings together public institutions and local authorities, the private sector, civil society, and research, expertise and training organisations through four stakeholder colleges. 4C supported the development and planning phases for the implementation of Morocco’s NDCs, capacity building, knowledge and information management, decision-support tools, climate-finance support and stakeholder dialogue, helping to connect climate policy with implementation across government and wider society. Its work includes supporting access to climate finance, facilitating science–policy dialogue, developing climate information and decision-support tools, and supporting the implementation and territorialisation of Morocco’s climate commitments. Its multi-stakeholder structure and regional and South–South engagement also give it a role in connecting national climate governance with wider African and international networks.",
        'Excerpt': "4C Maroc (Morocco’s Climate Change Competence Centre) illustrates how an intermediary function can provide trusted, cross-sector capacity for climate governance...",
        'Belongs to Pathway': [p3_3.id]
      }
    },

    // 4.1 Tools & Examples
    {
      findFn: (r) => String(r.fields['Example Title'] || '').toLowerCase().includes('climate city contract') && (String(r.fields['Example Title'] || '').toLowerCase().includes('investment planning') || String(r.fields['Example Title'] || '').toLowerCase().includes('hague')),
      fields: {
        'Example Title': 'Climate City Contracts’ investment planning approach',
        'Type': 'Illustrative Example',
        'Full Text / Concept Explanation': 'The climate investment-planning component of Sweden’s Climate City Contracts involves four key steps: 1) develop a city-level emissions and climate risks baseline and make forecasts, 2) identify climate actions that could help lower emissions and climate risks, 3) develop an implementation roadmap for identified climate actions and 4) identify which projects will be funded by public budgets and where additional financing will be needed; map financing actors and explore innovative financing mechanisms accordingly.\n\n• Climate City Contract Investment Plan of the Hague: The city of the Hague has the ambition to be climate-neutral in 2030. The current budget for climate and transition initiatives totals EUR 198.1 million for the period 2024-2027. The Climate Investment Plan of the Hague identifies its investment baseline and barriers, cross-references its existing municipal budget with its sectoral climate action priorities, estimates the gap between current allocations and total capital needs, and examines stakeholder shares, financing sources, implementation and investment risks and delivery arrangements. Its plan therefore connects its climate priorities with both the municipal planning and budget cycle and investment beyond the municipality.',
        'Excerpt': 'The climate investment-planning component of Sweden’s Climate City Contracts involves four key steps...',
        'Belongs to Pathway': [p4_1.id]
      }
    },
    {
      findFn: (r) => String(r.fields['Example Title'] || r.fields['Example Title'] || '').toLowerCase().includes('c40 climate budgeting framework'),
      fields: {
        'Example Title': 'C40 Climate Budgeting Framework (CBF)',
        'Type': 'Tool',
        'Full Text / Concept Explanation': 'The CBF helps cities in developing, implementing, and adopting a credible and robust climate budgeting process, setting out guidance for the budgeting process and output. It treats climate budgeting as a recurring governance process that connects climate action plan targets to annual or cyclical delivery plans, covers both operating and capital budgets, requires ownership by the finance function and cross-departmental teams, assigns implementation responsibilities and embeds monitoring and learning into the ordinary budget process. Further guidance by C40 highlights how to get started on a robust and credible climate budget. This includes securing political commitments from the city leadership and using the climate budget to have multilevel dialogues with the national government to support investment into priority projects.',
        'Excerpt': 'The CBF helps cities in developing, implementing, and adopting a credible and robust climate budgeting process...',
        'Belongs to Pathway': [p4_1.id]
      }
    },

    // 4.2 Tools & Examples
    {
      findFn: (r) => String(r.fields['Example Title'] || '').toLowerCase().includes('system demonstrators'),
      fields: {
        'Example Title': 'System Demonstrators',
        'Type': 'Illustrative Example',
        'Full Text / Concept Explanation': 'System Demonstrators provide a systematic way for governments and funders to move beyond individual projects toward mission-driven urban transition portfolios. Rather than starting with a predefined list of projects, participating cities define a shared mission, map the system and structural barriers, convene relevant public, private and civic actors, and develop a coordinated portfolio of interventions across areas such as governance, infrastructure, regulation, procurement, finance, behaviour and technology. Not every intervention needs to be commercially investible; through implementation and learning, the portfolio can progressively surface projects and wider investment opportunities that are ready to move into project preparation and financing pipelines. In Lund, for example, a broader energy and mobility portfolio helped identify local energy systems as an emerging investment area, with EnergyNet representing one opportunity for further financing and implementation.\n\nSystem Demonstrators Grant Calls:\nThe grant calls operationalize System Demonstrators by setting the funding rules, eligibility and governance for who can apply and what they must show at each stage. The grant calls follow a phased approach – cities first apply through a design stage, then consortia that complete the planning deliverables and meet the readiness criteria could access implementation funding. Viability Fund for Cities is now using this logic to explore internationally coordinated grant calls with shared principles and eligibility criteria across regions.',
        'Excerpt': 'System Demonstrators provide a systematic way for governments and funders to move beyond individual projects toward mission-driven urban transition portfolios...',
        'Belongs to Pathway': [p4_2.id]
      }
    },
    {
      findFn: (r) => String(r.fields['Example Title'] || '').toLowerCase().includes('pcvr'),
      fields: {
        'Example Title': 'PCVR project bank',
        'Type': 'Illustrative Example',
        'Full Text / Concept Explanation': 'The Green and Resilient Cities Program project bank is a good pipeline-coordination example because it was created as a demand-mapping tool with two functions: it gives an ecosystem overview of urban project development in Brazil and acts as a coordination platform that consolidates projects at different stages into one place, improving visibility and opening pathways to technical assistance, finance and implementation. This makes it a strong example of how a pipeline can be originated, and actors can be coordinated to move the pipeline towards financing and implementation.',
        'Excerpt': 'The Green and Resilient Cities Program project bank is a good pipeline-coordination example...',
        'Belongs to Pathway': [p4_2.id]
      }
    },
    {
      findFn: (r) => String(r.fields['Example Title'] || '').toLowerCase().includes('findeter'),
      fields: {
        'Example Title': 'Findeter’s Sustainable and Competitive Cities Program',
        'Type': 'Illustrative Example',
        'Full Text / Concept Explanation': 'Findeter’s Sustainable and Competitive Cities Program provides technical assistance and funding to small and intermediary cities in Colombia to prepare long-term roadmaps to develop and access financing for infrastructure and service projects. The program has supported the diagnostic and structuring phases of projects such as Fusagasugá’s public-lighting modernisation, helping lower preparation and financing risk before investment is mobilized. Findeter’s facility is used predominantly by intermediary cities. As a GCF-accredited entity, Findeter has a national footprint of 2,220 financed projects across 773 municipalities and 30 departments, demonstrating how a national intermediary can help crowd in capital for subnational climate investment at scale.',
        'Excerpt': 'Findeter’s Sustainable and Competitive Cities Program provides technical assistance and funding to small and intermediary cities in Colombia...',
        'Belongs to Pathway': [p4_2.id]
      }
    },
    {
      findFn: (r) => String(r.fields['Example Title'] || r.fields['Example Title'] || '').toLowerCase().includes('ccfla') && String(r.fields['Example Title'] || r.fields['Example Title'] || '').toLowerCase().includes('project preparation resource directory'),
      fields: {
        'Example Title': 'CCFLA – Project Preparation Resource Directory',
        'Type': 'Tool',
        'Full Text / Concept Explanation': 'The Directory helps subnational governments and stakeholders identify project preparation facilities that can support them in developing green and resilient infrastructure, including implementing more efficient heating and cooling systems, building renewable energy, setting up sustainable transit, or climate-proofing resilient infrastructure. Users can filter information by region, country, sector, project stage etc. to find the right PPFs for their project needs.',
        'Excerpt': 'The Directory helps subnational governments and stakeholders identify project preparation facilities...',
        'Learn More URL': 'https://www.citiesclimatefinance.org',
        'Belongs to Pathway': [p4_2.id]
      }
    },
    {
      findFn: (r) => String(r.fields['Example Title'] || r.fields['Example Title'] || '').toLowerCase().includes('ndc partnership'),
      fields: {
        'Example Title': 'NDC Partnership - Project Preparation Support Database',
        'Type': 'Tool',
        'Full Text / Concept Explanation': 'It is a searchable database of international, regional, national, and sub-national Project Preparation Facilities (PPFs) focused on supporting the preparation of climate-aligned projects, as well as incubators and accelerators focused on supporting climate-aligned businesses.\n\nBox: What are Project Preparation Facilities?\nProject Preparation Facilities (PPFs) are organizations, initiatives, or institutions that support cities in developing bankable, investment-ready projects, typically from a project’s concept, design, or scoping stage up to the financial close. A PPF may provide technical and/or financial support. PPFs can provide a wide range of support depending on a project’s stage and sector. The overarching goal of PPFs is preparing bankable, or investment-ready, projects. A project is bankable, whether from public or private sources, when its risk-return profile meets investors’ criteria.',
        'Excerpt': 'It is a searchable database of international, regional, national, and sub-national Project Preparation Facilities (PPFs)...',
        'Learn More URL': 'https://ndcpartnership.org',
        'Belongs to Pathway': [p4_2.id]
      }
    },
    {
      findFn: (r) => String(r.fields['Example Title'] || r.fields['Example Title'] || '').toLowerCase().includes('gap fund') || String(r.fields['Example Title'] || r.fields['Example Title'] || '').toLowerCase().includes('iclei and gap fund'),
      fields: {
        'Example Title': 'ICLEI and Gap Fund - Capacity Development Toolkit for Early-Stage Project Preparation',
        'Type': 'Tool',
        'Full Text / Concept Explanation': 'This toolkit brings together 12 practical tools and templates developed and tested through the Gap Fund Step-Up Project, led by ICLEI with the City Climate Finance Gap Fund. Co-created with cities in Africa and South America, it helps city officials, project managers and technical partners identify capacity and data gaps, map stakeholders and risks, build basic financial models, test PPP options, apply behavioural and systems-thinking approaches, and chart a path from pre-feasibility to bankability. Each tool comes with step-by-step guidance and downloadable templates that can be adapted for local use and training.',
        'Excerpt': 'This toolkit brings together 12 practical tools and templates developed and tested through the Gap Fund Step-Up Project...',
        'Learn More URL': 'https://www.citygapfund.org',
        'Belongs to Pathway': [p4_2.id]
      }
    },
    {
      findFn: (r) => String(r.fields['Example Title'] || r.fields['Example Title'] || '').toLowerCase().includes('bankability diagnostic'),
      fields: {
        'Example Title': 'Urban-Act - Early-Stage City Climate Project Bankability Diagnostic Tool',
        'Type': 'Tool',
        'Full Text / Concept Explanation': 'The tool is designed to support cities during the early stages of project preparation, from concept to pre-feasibility by applying a project finance lens to improve project viability and financeability. It offers tailored checklists across six thematic investment areas to identify bankability gaps and finance-readiness issues, along with practical sector-specific recommendations to strengthen project design, financial viability, and access to climate finance.',
        'Excerpt': 'The tool is designed to support cities during the early stages of project preparation, from concept to pre-feasibility...',
        'Learn More URL': 'https://urban-act.org',
        'Belongs to Pathway': [p4_2.id]
      }
    },
    {
      findFn: (r) => String(r.fields['Example Title'] || r.fields['Example Title'] || '').toLowerCase().includes('source'),
      fields: {
        'Example Title': 'SOURCE',
        'Type': 'Tool',
        'Full Text / Concept Explanation': 'SOURCE is a project-preparation software platform. A joint initiative of the multilateral development banks coordinated by the not-for-profit Sustainable Infrastructure Foundation, SOURCE uses standardised, sector-specific question sets covering the full project lifecycle—aligned with the SDGs and the Paris Agreement—to help governments define, develop and manage sustainable infrastructure projects consistently and transparently, with the aim of improving bankability, crowding in private finance and strengthening public-sector capacity. Its functionality includes portfolio and project monitoring dashboards, document and task management, consistency checks, a Project Preparation Facilities Finder and a public pipeline for project promotion, and it is used in more than 50 countries, including many CHAMP endorsers. The case demonstrates how a shared digital tool can standardise and de-risk project preparation across governments while linking prepared projects to preparation facilities and financiers.',
        'Excerpt': 'SOURCE is a project-preparation software platform. A joint initiative of the multilateral development banks...',
        'Learn More URL': 'https://public.sif-source.org',
        'Belongs to Pathway': [p4_2.id]
      }
    },

    // 6.1 Tools & Examples
    {
      findFn: (r) => String(r.fields['Example Title'] || '').toLowerCase().includes('cafe') || String(r.fields['Example Title'] || '').toLowerCase().includes('city academy on finance'),
      fields: {
        'Example Title': 'CAFE (City Academy on Finance and Equity)',
        'Type': 'Illustrative Example',
        'Full Text / Concept Explanation': 'CAFE (City Academy on Finance and Equity) was developed by the C40 Cities Finance Facility to equip city officials with the practical tools needed to plan and finance equitable infrastructure projects. The academy was delivered in three parts to mid- and senior-level officials from Global South cities, with learning objectives focused on understanding and assessing financing instruments, embedding equity and inclusion across planning, development and implementation, and linking finance to business models. Through its workshops and a workbook, CAFE offers a structured learning process that helps cities improve project preparation, strengthen cross-departmental understanding and design investments that are both finance-ready and equity-aware.',
        'Excerpt': 'CAFE (City Academy on Finance and Equity) was developed by the C40 Cities Finance Facility...',
        'Learn More URL': 'https://www.c40cff.org',
        'Belongs to Pathway': [p6_1.id]
      }
    },
    {
      findFn: (r) => String(r.fields['Example Title'] || r.fields['Example Title'] || '').toLowerCase().includes('urbanshift'),
      fields: {
        'Example Title': 'UrbanShift Academies',
        'Type': 'Tool',
        'Full Text / Concept Explanation': 'UrbanShift Academies offer a peer-learning platform for cities working on integrated urban development. UrbanShift is a “one-stop” platform bringing together global, national and local champions, while offering a suite of capacity-building activities that includes finance academies and dialogues with the national government. The platform combines these learning activities with on-the-ground local projects, so cities can exchange experience, build strategic planning skills, and apply what they learn to integrated solutions in areas such as transport, housing, green infrastructure and waste.',
        'Excerpt': 'UrbanShift Academies offer a peer-learning platform for cities working on integrated urban development...',
        'Learn More URL': 'https://www.shiftcities.org',
        'Belongs to Pathway': [p6_1.id]
      }
    },
    {
      findFn: (r) => String(r.fields['Example Title'] || '').toLowerCase().includes('cities climate finance leadership alliance') || String(r.fields['Example Title'] || '').toLowerCase().includes('ccfla'),
      fields: {
        'Example Title': 'The Cities Climate Finance Leadership Alliance (CCFLA)',
        'Type': 'Illustrative Example',
        'Full Text / Concept Explanation': 'The Cities Climate Finance Leadership Alliance (CCFLA) provides a multi-level, multi-stakeholder space for practitioners to connect, exchange experience and build networks around urban climate finance. Through its thematic Action Groups, CCFLA members can convene around priority topics such as project preparation, adaptation finance, enabling environments, private finance and other emerging financing challenges, sharing practical approaches and identifying opportunities for collaboration. Participation is open across CCFLA’s diverse membership, including national governments, city networks and subnational actors, demand- and supply-side finance organizations, and expert and technical organizations, helping connect perspectives across levels of government and across the climate finance ecosystem.',
        'Excerpt': 'The Cities Climate Finance Leadership Alliance (CCFLA) provides a multi-level, multi-stakeholder space...',
        'Learn More URL': 'https://www.citiesclimatefinance.org',
        'Belongs to Pathway': [p6_1.id]
      }
    },

    // 6.2 Examples
    {
      findFn: (r) => String(r.fields['Example Title'] || r.fields['Example Title'] || '').toLowerCase().includes('global platform for sustainable cities') || String(r.fields['Example Title'] || r.fields['Example Title'] || '').toLowerCase().includes('gpsc'),
      fields: {
        'Example Title': 'Global Platform for Sustainable Cities (GPSC)',
        'Type': 'Illustrative Example',
        'Full Text / Concept Explanation': 'Global Platform for Sustainable Cities (GPSC) is a World Bank–led global knowledge and partnership platform, supported by the Global Environment Facility, which connects cities with knowledge, partners and practical tools to help them design and implement integrated urban solutions. Through this platform, city leaders are supported to advance projects that cut emissions, protect biodiversity, create jobs and economic opportunities, strengthen resilience to climate and urban risks, and improve quality of life for residents.',
        'Excerpt': 'Global Platform for Sustainable Cities (GPSC) is a World Bank–led global knowledge and partnership platform...',
        'Learn More URL': 'https://www.worldbank.org/en/programs/gpsc',
        'Belongs to Pathway': [p6_2.id]
      }
    },
    {
      findFn: (r) => String(r.fields['Example Title'] || '').toLowerCase().includes('rise up') || String(r.fields['Example Title'] || '').toLowerCase().includes('un-habitat'),
      fields: {
        'Example Title': 'UN-Habitat RISE UP',
        'Type': 'Illustrative Example',
        'Full Text / Concept Explanation': 'UN-Habitat RISE UP is a flagship implementation partnership that is coordinated through UN-Habitat’s headquarters, regional, national and local offices, mobilizing significant investments to help cities effectively adapt to climate change. The program has mobilized more than USD150 million through partnerships with several organizations including the Adaptation Fund, Green Climate Fund and bilateral funding agencies such as Sida. The program is active in nearly 30 countries, making it a strong example of a global platform that supports city-level adaptation finance through partnerships with climate funds.',
        'Excerpt': 'UN-Habitat RISE UP is a flagship implementation partnership that is coordinated through UN-Habitat’s headquarters...',
        'Learn More URL': 'https://unhabitat.org/rise-up',
        'Belongs to Pathway': [p6_2.id]
      }
    },
    {
      findFn: (r) => String(r.fields['Example Title'] || '').toLowerCase().includes('beat the heat') || String(r.fields['Example Title'] || '').toLowerCase().includes('unep'),
      fields: {
        'Example Title': 'UNEP Beat the Heat Initiative, under the Global Cooling Pledge',
        'Type': 'Illustrative Example',
        'Full Text / Concept Explanation': 'UNEP Beat the Heat Initiative, under the Global Cooling Pledge is a multilevel coalition for urban heat action that brings cities, countries and partners together around a shared implementation challenge, with 250 cities joining the call to action and examples focused on heat action planning, nature-based solutions and cooling. Beat the Heat links city action to national and global cooling commitments. The initiative is a collective effort to localize the Global Cooling Pledge, which has 75 country signatories, and to support cities and sub-national actors through heat-risk assessments, passive and nature-based cooling, planning, and public procurement. The 50@50 activation then adds the city-to-city layer: more than 50 cities are sharing practical approaches, stress-testing systems and accelerating action together, with UNEP, C40 Cities and the City of Paris providing support and institutional anchoring through the wider Cool Coalition / EPIC architecture.',
        'Excerpt': 'UNEP Beat the Heat Initiative, under the Global Cooling Pledge is a multilevel coalition for urban heat action...',
        'Learn More URL': 'https://coolcoalition.org/beat-the-heat',
        'Belongs to Pathway': [p6_2.id]
      }
    }
  ];

  for (const item of resourceUpdates) {
    const matched = allResources.find(item.findFn);
    if (matched) {
      await airtableFetch(`https://api.airtable.com/v0/${baseId}/Key%20Resources/${matched.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ fields: item.fields })
      });
      console.log(`✓ Updated resource: ${item.fields['Example Title'] || item.fields['Example Title']}`);
    } else if (item.createIfMissing) {
      await airtableFetch(`https://api.airtable.com/v0/${baseId}/Key%20Resources`, {
        method: 'POST',
        body: JSON.stringify({ fields: item.createIfMissing })
      });
      console.log(`✓ Created new resource: ${item.createIfMissing['Example Title'] || item.createIfMissing['Example Title']}`);
    }
  }

  console.log('\n=== Full Sync for Actions 2, 3, 4, 6 Completed Successfully! ===');
}

syncActions2_3_4_6().catch(e => {
  console.error('Sync failed:', e);
  process.exit(1);
});
